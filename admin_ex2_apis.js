const fs = require('fs');
const serverPath = 'exercise-2/backend/server.js';
if (fs.existsSync(serverPath)) {
    let content = fs.readFileSync(serverPath, 'utf8');
    const apis = `
// POST /api/admin/toggle-role
app.post('/api/admin/toggle-role', (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false });
    const user = users.find(u => u.email === email);
    if (!user) return res.status(404).json({ success: false });
    user.role = user.role === 'admin' ? 'user' : 'admin';
    saveUsers();
    res.json({ success: true, role: user.role });
});

// GET /api/admin/user-history
app.get('/api/admin/user-history', (req, res) => {
    const { email } = req.query;
    const user = users.find(u => u.email === email);
    if (!user) return res.status(404).json({ success: false });
    res.json({ success: true, history: user.history || [] });
});
`;
    if (!content.includes('/api/admin/toggle-role')) {
        content = content.replace('// Health check', apis + '\n// Health check');
        fs.writeFileSync(serverPath, content, 'utf8');
    }
}