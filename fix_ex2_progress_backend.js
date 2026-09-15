const fs = require('fs');
const serverPath = 'exercise-2/backend/server.js';
if (fs.existsSync(serverPath)) {
    let content = fs.readFileSync(serverPath, 'utf8');
    
    // Add memorizedWords to new users
    content = content.replace(/history: \[\]\n\s*};\n\n\s*users\.push\(newUser\);/, 'history: [],\n\t\tmemorizedWords: []\n\t};\n\n\tusers.push(newUser);');
    
    // Return memorizedWords in /api/users/me
    content = content.replace(/role: user\.role,\n\s*history: user\.history \|\| \[\]/, 'role: user.role,\n\t\t\thistory: user.history || [],\n\t\t\tmemorizedWords: user.memorizedWords || []');
    
    // Return progress in /api/admin/users
    content = content.replace(/level: u\.level\n\s*}\)\);/, 'level: u.level,\n\t\tprogress: u.memorizedWords ? u.memorizedWords.length : 0\n\t}));');
    
    // Add POST /api/users/toggle-word
    const apiCode = `
// POST /api/users/toggle-word
app.post('/api/users/toggle-word', (req, res) => {
    const { email, word } = req.body;
    if (!email || !word) return res.status(400).json({ success: false });
    const user = users.find(u => u.email === email);
    if (!user) return res.status(404).json({ success: false });
    
    if (!user.memorizedWords) user.memorizedWords = [];
    const idx = user.memorizedWords.indexOf(word);
    let isMemorized = false;
    if (idx > -1) {
        user.memorizedWords.splice(idx, 1);
    } else {
        user.memorizedWords.push(word);
        isMemorized = true;
    }
    saveUsers();
    res.json({ success: true, memorizedWords: user.memorizedWords, isMemorized });
});
`;
    if (!content.includes('/api/users/toggle-word')) {
        content = content.replace('// GET /api/users/leaderboard', apiCode + '\n// GET /api/users/leaderboard');
        fs.writeFileSync(serverPath, content, 'utf8');
    }
}