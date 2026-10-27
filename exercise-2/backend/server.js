const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'users.json');

app.use(cors());
app.use(bodyParser.json());

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Simple hash function matching the frontend
function hash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
        h = (h << 5) - h + str.charCodeAt(i);
        h |= 0;
    }
    return String(h);
}

// Load users
let users = [];
if (fs.existsSync(DATA_FILE)) {
    try {
        users = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch (e) {
        console.error('Error reading users file, resetting:', e);
        users = [];
    }
}

// Seed admin and demo learners for testing/evaluation
const adminExists = users.some(u => u.role === 'admin');
if (!adminExists || users.length <= 1) {
    if (!adminExists) {
        users.push({
            email: 'admin@nihongo.local',
            name: 'Quản trị viên (Admin)',
            passwordHash: hash('admin123'),
            role: 'admin',
            points: 500,
            level: 6,
            history: [
                { action: 'Khởi tạo hệ thống NihonGo', timestamp: new Date(Date.now() - 3600000 * 24).toISOString() },
                { action: 'Đăng nhập vào hệ thống Quản trị', timestamp: new Date(Date.now() - 3600000).toISOString() }
            ],
            memorizedWords: ['こんにちは', 'ありがとう', 'さようなら', 'おはよう']
        });
    }

    // Add demo learners if missing
    const demoLearners = [
        {
            email: 'sakura@nihongo.local',
            name: 'Sakura Tanaka',
            passwordHash: hash('123456'),
            role: 'user',
            points: 420,
            level: 5,
            history: [
                { action: 'Hoàn thành vòng trắc nghiệm 10 câu (+100 điểm)', timestamp: new Date(Date.now() - 3600000 * 2).toISOString() },
                { action: 'Ghi nhớ từ vựng: 美味しい, お茶, 水', timestamp: new Date(Date.now() - 3600000 * 6).toISOString() }
            ],
            memorizedWords: ['こんにちは', 'ありがとう', '水', 'ご飯', '美味しい', 'お茶']
        },
        {
            email: 'kenji@nihongo.local',
            name: 'Kenji Sato',
            passwordHash: hash('123456'),
            role: 'user',
            points: 250,
            level: 3,
            history: [
                { action: 'Luyện tập Flashcard chủ đề Giao thông', timestamp: new Date(Date.now() - 3600000 * 8).toISOString() }
            ],
            memorizedWords: ['駅', '電車', '切符']
        },
        {
            email: 'hocvien@nihongo.local',
            name: 'Học viên Demo',
            passwordHash: hash('123456'),
            role: 'user',
            points: 90,
            level: 1,
            history: [
                { action: 'Đăng ký tài khoản thành công', timestamp: new Date(Date.now() - 3600000 * 12).toISOString() }
            ],
            memorizedWords: ['こんにちは']
        }
    ];

    demoLearners.forEach(learner => {
        if (!users.some(u => u.email === learner.email)) {
            users.push(learner);
        }
    });

    saveUsers();
}

function saveUsers() {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), 'utf8');
    } catch (e) {
        console.error('Error writing users file:', e);
    }
}

function calcLevel(points) {
    return Math.max(1, Math.floor(points / 100) + 1);
}

// GET /api/users/me - Sync user info
app.get('/api/users/me', (req, res) => {
    const { email } = req.query;
    if (!email) {
        return res.status(400).json({ success: false, message: 'Email parameter is required' });
    }
    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({
        success: true,
        user: {
            email: user.email,
            name: user.name,
            points: user.points,
            level: user.level,
            role: user.role,
            history: user.history || [],
            memorizedWords: user.memorizedWords || [],
            weakWords: user.weakWords || []
        }
    });
});

// POST /api/auth/register
app.post('/api/auth/register', (req, res) => {
    const { email, password, name, points } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: 'Vui lòng nhập đúng định dạng email (ví dụ: name@domain.com)' });
    }

    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const startPoints = Number(points) || 0;
    const newUser = {
        email: email.trim().toLowerCase(),
        name: name ? name.trim() : 'Người học NihonGo',
        passwordHash: hash(password),
        role: 'user',
        points: startPoints,
        level: calcLevel(startPoints),
        history: [{ action: 'Tạo tài khoản mới', timestamp: new Date().toISOString() }],
        memorizedWords: [],
        weakWords: []
    };

    users.push(newUser);
    saveUsers();

    res.json({
        success: true,
        user: {
            email: newUser.email,
            name: newUser.name,
            points: newUser.points,
            level: newUser.level,
            role: newUser.role,
            history: newUser.history,
            memorizedWords: newUser.memorizedWords,
            weakWords: newUser.weakWords
        }
    });
});

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: 'Vui lòng nhập đúng định dạng email' });
    }

    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim() && u.passwordHash === hash(password));
    if (!user) {
        return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không chính xác' });
    }

    res.json({
        success: true,
        user: {
            email: user.email,
            name: user.name,
            points: user.points,
            level: user.level,
            role: user.role,
            history: user.history || [],
            memorizedWords: user.memorizedWords || [],
            weakWords: user.weakWords || []
        }
    });
});

// POST /api/users/update-points
app.post('/api/users/update-points', (req, res) => {
    const { email, points } = req.body;
    if (!email || points === undefined) {
        return res.status(400).json({ success: false, message: 'Email and points are required' });
    }

    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.points = Math.max(0, Number(points) || 0);
    user.level = calcLevel(user.points);
    saveUsers();

    res.json({
        success: true,
        points: user.points,
        level: user.level
    });
});

// POST /api/users/update-name
app.post('/api/users/update-name', (req, res) => {
    const { email, name } = req.body;
    if (!email || !name) {
        return res.status(400).json({ success: false, message: 'Email and name are required' });
    }

    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.name = name.trim();
    saveUsers();

    res.json({
        success: true,
        name: user.name
    });
});

// POST /api/users/add-history
app.post('/api/users/add-history', (req, res) => {
    const { email, action } = req.body;
    if (!email || !action) {
        return res.status(400).json({ success: false, message: 'Email and action are required' });
    }

    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.history) user.history = [];
    user.history.unshift({
        action,
        timestamp: new Date().toISOString()
    });

    if (user.history.length > 50) {
        user.history.pop();
    }

    saveUsers();

    res.json({
        success: true,
        history: user.history
    });
});

// POST /api/users/toggle-word
app.post('/api/users/toggle-word', (req, res) => {
    const { email, word } = req.body;
    if (!email || !word) return res.status(400).json({ success: false, message: 'Email and word required' });
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    if (!user.memorizedWords) user.memorizedWords = [];
    const idx = user.memorizedWords.indexOf(word);
    let isMemorized = false;
    if (idx > -1) {
        user.memorizedWords.splice(idx, 1);
    } else {
        user.memorizedWords.push(word);
        isMemorized = true;
        // If memorized, remove from weak words
        if (user.weakWords) {
            const wIdx = user.weakWords.indexOf(word);
            if (wIdx > -1) user.weakWords.splice(wIdx, 1);
        }
    }
    saveUsers();
    res.json({ success: true, memorizedWords: user.memorizedWords, weakWords: user.weakWords || [], isMemorized });
});

// POST /api/users/add-weak-word
app.post('/api/users/add-weak-word', (req, res) => {
    const { email, word } = req.body;
    if (!email || !word) return res.status(400).json({ success: false, message: 'Email and word required' });
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (!user.weakWords) user.weakWords = [];
    if (!user.weakWords.includes(word)) {
        user.weakWords.push(word);
    }
    // If it was memorized, remove it from memorized
    if (user.memorizedWords) {
        const mIdx = user.memorizedWords.indexOf(word);
        if (mIdx > -1) user.memorizedWords.splice(mIdx, 1);
    }
    saveUsers();
    res.json({ success: true, weakWords: user.weakWords, memorizedWords: user.memorizedWords || [] });
});

// POST /api/users/remove-weak-word
app.post('/api/users/remove-weak-word', (req, res) => {
    const { email, word } = req.body;
    if (!email || !word) return res.status(400).json({ success: false, message: 'Email and word required' });
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.weakWords) {
        const wIdx = user.weakWords.indexOf(word);
        if (wIdx > -1) user.weakWords.splice(wIdx, 1);
    }
    saveUsers();
    res.json({ success: true, weakWords: user.weakWords || [] });
});

// GET /api/users/leaderboard
app.get('/api/users/leaderboard', (req, res) => {
    const leaderboard = users
        .map(u => ({ 
            name: u.name, 
            points: u.points || 0, 
            level: u.level || 1, 
            words: (u.memorizedWords || []).length 
        }))
        .sort((a, b) => b.points - a.points)
        .slice(0, 10);
    res.json(leaderboard);
});

// ========================================================
// Middleware: Role-Based Authorization for Admin APIs
// ========================================================
function requireAdmin(req, res, next) {
    const adminEmail = (
        req.headers['x-admin-email'] || 
        req.query.adminEmail || 
        (req.body && req.body.adminEmail) || 
        ''
    ).toString().trim().toLowerCase();

    if (!adminEmail) {
        return res.status(401).json({ 
            success: false, 
            message: 'Yêu cầu xác thực: Vui lòng cung cấp thông tin tài khoản Quản trị viên (x-admin-email header).' 
        });
    }

    const adminUser = users.find(u => u.email.toLowerCase() === adminEmail && u.role === 'admin');
    if (!adminUser) {
        return res.status(403).json({ 
            success: false, 
            message: 'Từ chối truy cập: Tài khoản không có đặc quyền Quản trị viên (Admin).' 
        });
    }

    req.admin = adminUser;
    next();
}

app.use('/api/admin', requireAdmin);

// GET /api/admin/users
app.get('/api/admin/users', (req, res) => {
    const list = users.map(u => ({
        email: u.email,
        name: u.name,
        role: u.role,
        points: u.points || 0,
        level: u.level || 1,
        progress: u.memorizedWords ? u.memorizedWords.length : 0,
        historyCount: (u.history || []).length
    }));
    res.json(list);
});

// GET /api/admin/stats - Overview metrics
app.get('/api/admin/stats', (req, res) => {
    let totalPoints = 0;
    let totalWords = 0;
    let adminCount = 0;
    let userCount = 0;

    users.forEach(u => {
        totalPoints += (u.points || 0);
        totalWords += ((u.memorizedWords || []).length);
        if (u.role === 'admin') adminCount++;
        else userCount++;
    });

    res.json({
        success: true,
        totalUsers: users.length,
        adminCount,
        userCount,
        totalPoints,
        totalWords,
        serverUptime: Math.floor(process.uptime()),
        nodeVersion: process.version,
        memoryUsage: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
        environment: process.env.NODE_ENV || 'production',
        timestamp: new Date().toISOString()
    });
});

// POST /api/admin/create-user
app.post('/api/admin/create-user', (req, res) => {
    const { email, password, name, role, points } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email và mật khẩu là bắt buộc' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: 'Định dạng email không hợp lệ' });
    }

    if (users.some(u => u.email.toLowerCase() === email.toLowerCase().trim())) {
        return res.status(400).json({ success: false, message: 'Email này đã tồn tại trong hệ thống' });
    }

    const pts = Math.max(0, Number(points) || 0);
    const newUser = {
        email: email.trim().toLowerCase(),
        name: name ? name.trim() : 'Người dùng mới',
        passwordHash: hash(password),
        role: role === 'admin' ? 'admin' : 'user',
        points: pts,
        level: calcLevel(pts),
        history: [{ action: 'Quản trị viên tạo tài khoản', timestamp: new Date().toISOString() }],
        memorizedWords: []
    };

    users.push(newUser);
    saveUsers();

    res.json({ success: true, message: 'Tạo tài khoản thành công', user: newUser });
});

// POST /api/admin/update-user
app.post('/api/admin/update-user', (req, res) => {
    const { email, name, points, role } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email là bắt buộc' });

    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });

    if (name !== undefined) user.name = name.trim();
    if (points !== undefined) {
        user.points = Math.max(0, Number(points) || 0);
        user.level = calcLevel(user.points);
    }
    if (role !== undefined) {
        // Protect last admin
        if (user.role === 'admin' && role !== 'admin') {
            const adminTotal = users.filter(u => u.role === 'admin').length;
            if (adminTotal <= 1) {
                return res.status(400).json({ success: false, message: 'Không thể hạ quyền Admin duy nhất của hệ thống' });
            }
        }
        user.role = role === 'admin' ? 'admin' : 'user';
    }

    saveUsers();
    res.json({ success: true, user });
});

// POST /api/admin/reset-password
app.post('/api/admin/reset-password', (req, res) => {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) return res.status(400).json({ success: false, message: 'Email và mật khẩu mới là bắt buộc' });

    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });

    user.passwordHash = hash(newPassword);
    saveUsers();
    res.json({ success: true, message: 'Đã đổi mật khẩu thành công' });
});

// POST /api/admin/delete-user
app.post('/api/admin/delete-user', (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ success: false, message: 'Email required' });
    }
    const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (userIndex === -1) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (users[userIndex].role === 'admin') {
        const adminTotal = users.filter(u => u.role === 'admin').length;
        if (adminTotal <= 1) {
            return res.status(403).json({ success: false, message: 'Không thể xóa Admin duy nhất của hệ thống' });
        }
    }
    users.splice(userIndex, 1);
    saveUsers();
    res.json({ success: true });
});

// POST /api/admin/toggle-role
app.post('/api/admin/toggle-role', (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false });
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return res.status(404).json({ success: false });

    if (user.role === 'admin') {
        const adminTotal = users.filter(u => u.role === 'admin').length;
        if (adminTotal <= 1) {
            return res.status(400).json({ success: false, message: 'Không thể hạ quyền Admin duy nhất' });
        }
        user.role = 'user';
    } else {
        user.role = 'admin';
    }

    saveUsers();
    res.json({ success: true, role: user.role });
});

// GET /api/admin/user-history
app.get('/api/admin/user-history', (req, res) => {
    const { email } = req.query;
    const user = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
    if (!user) return res.status(404).json({ success: false });
    res.json({ success: true, history: user.history || [] });
});

// Health check for AWS load balancer / Docker
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        service: 'nihongo-backend',
        version: '2.0.0',
        uptime: Math.floor(process.uptime()),
        timestamp: new Date().toISOString()
    });
});

// Serve static frontend files (ideal for local testing and Docker)
const frontendDockerPath = path.join(__dirname, 'frontend');
const frontendLocalPath = path.join(__dirname, '../frontend');

if (fs.existsSync(path.join(frontendDockerPath, 'index.html'))) {
    app.use(express.static(frontendDockerPath));
} else {
    app.use(express.static(frontendLocalPath));
}

app.listen(PORT, () => {
    console.log(`NihonGo Backend running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});
