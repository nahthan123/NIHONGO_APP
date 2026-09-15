const fs = require('fs');
const ex2AppPath = 'exercise-2/frontend/app.js';
if (fs.existsSync(ex2AppPath)) {
    let content = fs.readFileSync(ex2AppPath, 'utf8');
    
    // Add functions if missing
    const newFuncs = `
function toggleUserRole(email) {
\tif (email === state.user.email) {
\t\talert("Không thể tự thay đổi quyền của chính mình!");
\t\treturn;
\t}
\tfetch('/api/admin/toggle-role', {
\t\tmethod: 'POST',
\t\theaders: { 'Content-Type': 'application/json' },
\t\tbody: JSON.stringify({ email })
\t}).then(res => res.json()).then(data => {
\t\tif(data.success) {
\t\t\talert('Đã thay đổi quyền thành: ' + data.role);
\t\t\trenderAdmin();
\t\t}
\t});
}
function viewUserHistory(email) {
\tfetch('/api/admin/user-history?email=' + encodeURIComponent(email))
\t\t.then(res => res.json())
\t\t.then(data => {
\t\t\tif(data.success && data.history.length > 0) {
\t\t\t\tconst histStr = data.history.slice(0, 10).map(h => "- " + h.action + " (" + new Date(h.timestamp).toLocaleString() + ")").join("\\n");
\t\t\t\talert("Lịch sử hoạt động của " + email + ":\\n\\n" + histStr);
\t\t\t} else {
\t\t\t\talert("Người dùng này chưa có hoạt động nào.");
\t\t\t}
\t\t});
}`;
    if (!content.includes('function viewUserHistory')) {
        content = content + '\n' + newFuncs;
    }

    // Replace renderAdmin body
    const newAdminLogic = `function renderAdmin(){
\tfetch('/api/admin/users')
\t\t.then(res => res.json())
\t\t.then(list => {
\t\t\tconst totalEl = document.getElementById('admin-total');
\t\t\tconst adminCountEl = document.getElementById('admin-count');
\t\t\tconst adminPointsEl = document.getElementById('admin-points');
\t\t\tconst tbodyEl = document.getElementById('admin-users-tbody');
\t\t\tif(totalEl) totalEl.textContent = String(list.length);
\t\t\tif(adminCountEl) adminCountEl.textContent = String(list.filter(u=>u.role==='admin').length);
\t\t\tif(adminPointsEl) adminPointsEl.textContent = String(list.reduce((sum, u)=>sum + (u.points||0), 0));
\t\t\tif (tbodyEl) {
\t\t\t\ttbodyEl.innerHTML = '';
\t\t\t\tlist.forEach(u => {
\t\t\t\t\tconst tr = document.createElement('tr');
\t\t\t\t\ttr.style.borderBottom = "1px solid var(--border)";
\t\t\t\t\tconst tdName = document.createElement('td');
\t\t\t\t\ttdName.style.padding = "10px 4px";
\t\t\t\t\ttdName.textContent = u.name || "N/A";
\t\t\t\t\tconst tdEmail = document.createElement('td');
\t\t\t\t\ttdEmail.style.padding = "10px 4px";
\t\t\t\t\ttdEmail.textContent = u.email;
\t\t\t\t\tconst tdPoints = document.createElement('td');
\t\t\t\t\ttdPoints.style.padding = "10px 4px";
\t\t\t\t\tlet pts = u.points || 0;
\t\t\t\t\tlet lvl = Math.max(1, Math.floor(pts / 100) + 1);
\t\t\t\t\ttdPoints.textContent = pts + " (Lv" + lvl + ")";
\t\t\t\t\tconst tdRole = document.createElement('td');
\t\t\t\t\ttdRole.style.padding = "10px 4px";
\t\t\t\t\ttdRole.innerHTML = u.role === 'admin' ? '<span style="color:#fbbf24;font-weight:bold;">Admin</span>' : 'User';
\t\t\t\t\tconst tdAction = document.createElement('td');
\t\t\t\t\ttdAction.style.padding = "10px 4px";
\t\t\t\t\t
\t\t\t\t\tif (u.role !== 'admin' || u.email !== state.user.email) {
\t\t\t\t\t\tconst btnHistory = document.createElement('button');
\t\t\t\t\t\tbtnHistory.innerHTML = '📋 Lịch sử';
\t\t\t\t\t\tbtnHistory.style.cssText = "padding:4px 8px; font-size:12px; background:#10b981; border:none; color:white; border-radius:4px; cursor:pointer; margin-right:6px;";
\t\t\t\t\t\tbtnHistory.onclick = () => viewUserHistory(u.email);
\t\t\t\t\t\ttdAction.appendChild(btnHistory);
\t\t\t\t\t\t
\t\t\t\t\t\tconst btnRole = document.createElement('button');
\t\t\t\t\t\tbtnRole.innerHTML = u.role === 'admin' ? 'Hạ quyền' : 'Lên Admin';
\t\t\t\t\t\tbtnRole.style.cssText = "padding:4px 8px; font-size:12px; background:#fbbf24; border:none; color:black; border-radius:4px; cursor:pointer; margin-right:6px;";
\t\t\t\t\t\tbtnRole.onclick = () => toggleUserRole(u.email);
\t\t\t\t\t\ttdAction.appendChild(btnRole);
\t\t\t\t\t}
\t\t\t\t\tif (u.role !== 'admin') {
\t\t\t\t\t\tconst btnEdit = document.createElement('button');
\t\t\t\t\t\tbtnEdit.innerHTML = 'Sửa Điểm';
\t\t\t\t\t\tbtnEdit.style.cssText = "padding:4px 8px; font-size:12px; background:#3b82f6; border:none; color:white; border-radius:4px; cursor:pointer; margin-right:6px;";
\t\t\t\t\t\tbtnEdit.onclick = () => editUserPoints(u.email);
\t\t\t\t\t\ttdAction.appendChild(btnEdit);
\t\t\t\t\t\t
\t\t\t\t\t\tconst btnDel = document.createElement('button');
\t\t\t\t\t\tbtnDel.innerHTML = 'Xóa';
\t\t\t\t\t\tbtnDel.style.cssText = "padding:4px 8px; font-size:12px; background:#ef4444; border:none; color:white; border-radius:4px; cursor:pointer;";
\t\t\t\t\t\tbtnDel.onclick = () => deleteUser(u.email);
\t\t\t\t\t\ttdAction.appendChild(btnDel);
\t\t\t\t\t}
\t\t\t\t\ttr.appendChild(tdName);
\t\t\t\t\ttr.appendChild(tdEmail);
\t\t\t\t\ttr.appendChild(tdPoints);
\t\t\t\t\ttr.appendChild(tdRole);
\t\t\t\t\ttr.appendChild(tdAction);
\t\t\t\t\ttbodyEl.appendChild(tr);
\t\t\t\t});
\t\t\t}
\t\t})`;
    content = content.replace(/function renderAdmin\(\)\{[\s\S]*?\}\s*\)\s*\.catch\(err => console\.error\("Admin fetch error:", err\)\);/, newAdminLogic + '\n\t\t.catch(err => console.error("Admin fetch error:", err));');
    
    fs.writeFileSync(ex2AppPath, content, 'utf8');
}