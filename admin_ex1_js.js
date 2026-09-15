const fs = require('fs');

const jsFiles = ['app.js', 'exercise-1/frontend/app.js'];
jsFiles.forEach(f => {
    if (!fs.existsSync(f)) return;
    let content = fs.readFileSync(f, 'utf8');
    
    // First, let's inject toggleUserRole and viewUserHistory
    const extraFuncs = `
function toggleUserRole(email) {
\tconst raw = localStorage.getItem(STORAGE_KEYS.users);
\tlet list = raw ? JSON.parse(raw) : [];
\tconst user = list.find(u => u.email === email);
\tif (!user) return;
\tif (user.email === state.user.email) {
\t\talert("Không thể tự thay đổi quyền của chính mình!");
\t\treturn;
\t}
\tuser.role = user.role === 'admin' ? 'user' : 'admin';
\tlocalStorage.setItem(STORAGE_KEYS.users, JSON.stringify(list));
\talert('Đã thay đổi quyền thành: ' + user.role);
\trenderAdmin();
}
function viewUserHistory(email) {
\tconst raw = localStorage.getItem(STORAGE_KEYS.users);
\tlet list = raw ? JSON.parse(raw) : [];
\tconst user = list.find(u => u.email === email);
\tif (!user) return;
\tif (!user.history || user.history.length === 0) {
\t\talert("Người dùng này chưa có hoạt động nào.");
\t\treturn;
\t}
\tconst histStr = user.history.slice(0, 10).map(h => "- " + h.action + " (" + new Date(h.timestamp).toLocaleString() + ")").join("\\n");
\talert("Lịch sử hoạt động của " + (user.name || email) + ":\\n\\n" + histStr);
}
`;
    if (!content.includes('function viewUserHistory')) {
        content = content + '\n' + extraFuncs;
    }
    
    // Update renderAdmin to calculate stats and render new buttons
    content = content.replace(/const totalEl = document.getElementById\('admin-total'\);[\s\S]*?if\s*\(tbodyEl\)\s*\{/, `const totalEl = document.getElementById('admin-total');
\tconst adminCountEl = document.getElementById('admin-count');
\tconst adminPointsEl = document.getElementById('admin-points');
\tconst tbodyEl = document.getElementById('admin-users-tbody');
\tconst raw = localStorage.getItem(STORAGE_KEYS.users);
\tconst list = raw ? JSON.parse(raw) : [];
\tif(totalEl) totalEl.textContent = String(list.length);
\tif(adminCountEl) adminCountEl.textContent = String(list.filter(u=>u.role==='admin').length);
\tif(adminPointsEl) adminPointsEl.textContent = String(list.reduce((sum, u)=>sum + (u.points||0), 0));
\tif (tbodyEl) {`);

    content = content.replace(/if \(u\.role !== 'admin'\) \{[\s\S]*?tr\.appendChild\(tdName\);/, `if (u.role !== 'admin' || u.email !== state.user.email) {
\t\t\t\tconst btnHistory = document.createElement('button');
\t\t\t\tbtnHistory.innerHTML = '📋 Lịch sử';
\t\t\t\tbtnHistory.style.cssText = "padding:4px 8px; font-size:12px; background:#10b981; border:none; color:white; border-radius:4px; cursor:pointer; margin-right:6px;";
\t\t\t\tbtnHistory.onclick = () => viewUserHistory(u.email);
\t\t\t\ttdAction.appendChild(btnHistory);
\t\t\t\t
\t\t\t\tconst btnRole = document.createElement('button');
\t\t\t\tbtnRole.innerHTML = u.role === 'admin' ? 'Hạ quyền' : 'Lên Admin';
\t\t\t\tbtnRole.style.cssText = "padding:4px 8px; font-size:12px; background:#fbbf24; border:none; color:black; border-radius:4px; cursor:pointer; margin-right:6px;";
\t\t\t\tbtnRole.onclick = () => toggleUserRole(u.email);
\t\t\t\ttdAction.appendChild(btnRole);
\t\t\t}
\t\t\tif (u.role !== 'admin') {
\t\t\t\tconst btnEdit = document.createElement('button');
\t\t\t\tbtnEdit.innerHTML = 'Sửa Điểm';
\t\t\t\tbtnEdit.style.cssText = "padding:4px 8px; font-size:12px; background:#3b82f6; border:none; color:white; border-radius:4px; cursor:pointer; margin-right:6px;";
\t\t\t\tbtnEdit.onclick = () => editUserPoints(u.email);
\t\t\t\ttdAction.appendChild(btnEdit);
\t\t\t\t
\t\t\t\tconst btnDel = document.createElement('button');
\t\t\t\tbtnDel.innerHTML = 'Xóa';
\t\t\t\tbtnDel.style.cssText = "padding:4px 8px; font-size:12px; background:#ef4444; border:none; color:white; border-radius:4px; cursor:pointer;";
\t\t\t\tbtnDel.onclick = () => deleteUser(u.email);
\t\t\t\ttdAction.appendChild(btnDel);
\t\t\t}
\t\t\ttr.appendChild(tdName);`);
    
    fs.writeFileSync(f, content, 'utf8');
});