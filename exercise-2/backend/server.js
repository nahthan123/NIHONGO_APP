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

// Seed admin if not present
const adminExists = users.some(u => u.role === 'admin');
if (!adminExists) {
    users.push({
        email: 'admin@nihongo.local',
        name: 'Administrator',
        passwordHash: hash('admin123'),
        role: 'admin',
        points: 0,
        level: 1,
        history: []
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
            history: user.history || []
        }
    });
});

// POST /api/auth/register
app.post('/api/auth/register', (req, res) => {
    const { email, password, name, points } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
    }
    if (users.some(u => u.email === email)) {
        return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const startPoints = Number(points) || 0;
    const newUser = {
        email,
        name: name || 'Người học NihonGo',
        passwordHash: hash(password),
        role: 'user',
        points: startPoints,
        level: calcLevel(startPoints),
        history: []
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
            history: newUser.history
        }
    });
});

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = users.find(u => u.email === email && u.passwordHash === hash(password));
    if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    res.json({
        success: true,
        user: {
            email: user.email,
            name: user.name,
            points: user.points,
            level: user.level,
            role: user.role,
            history: user.history || []
        }
    });
});

// POST /api/users/update-points
app.post('/api/users/update-points', (req, res) => {
    const { email, points } = req.body;
    if (!email || points === undefined) {
        return res.status(400).json({ success: false, message: 'Email and points are required' });
    }

    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.points = Number(points) || 0;
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

    const user = users.find(u => u.email === email);
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

    const user = users.find(u => u.email === email);
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

// GET /api/users/leaderboard
app.get('/api/users/leaderboard', (req, res) => {
    const leaderboard = users
        .map(u => ({ name: u.name, points: u.points, level: u.level }))
        .sort((a, b) => b.points - a.points)
        .slice(0, 10);
    res.json(leaderboard);
});

// GET /api/admin/users
app.get('/api/admin/users', (req, res) => {
    const list = users.map(u => ({
        email: u.email,
        name: u.name,
        role: u.role,
        points: u.points,
        level: u.level
    }));
    res.json(list);
});

// Health check
app.get('/api/health', (req, res) => {
    res.status(200).send('OK');
});

// Serve static frontend files (ideal for local testing without Docker!)
app.use(express.static(path.join(__dirname, '../frontend')));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
