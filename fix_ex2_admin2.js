const fs = require('fs');
const ex2AppPath = 'exercise-2/frontend/app.js';
if (fs.existsSync(ex2AppPath)) {
    let content = fs.readFileSync(ex2AppPath, 'utf8');
    
    // Replace deleteUser logic
    const oldDeleteUser = `function deleteUser(email) {
\tif (!confirm('Bạn có chắc muốn xóa người dùng ' + email + '?')) return;
\tconst raw = localStorage.getItem(STORAGE_KEYS.users);
\tlet list = raw ? JSON.parse(raw) : [];
\tlist = list.filter(u => u.email !== email);
\tlocalStorage.setItem(STORAGE_KEYS.users, JSON.stringify(list));
\tstate.users = list;
\talert('Đã xóa người dùng!');
\trenderAdmin();
}`;
    const newDeleteUser = `function deleteUser(email) {
\tif (!confirm('Bạn có chắc muốn xóa người dùng ' + email + '?')) return;
\tfetch('/api/admin/delete-user', {
\t\tmethod: 'POST',
\t\theaders: { 'Content-Type': 'application/json' },
\t\tbody: JSON.stringify({ email })
\t}).then(() => {
\t\talert('Xóa thành công');
\t\trenderAdmin();
\t});
}`;
    content = content.replace(oldDeleteUser, newDeleteUser);
    
    // Wait, earlier my regex didn't replace renderAdmin or editUserPoints!
    // Let's manually replace them by reading the file and replacing the block.
    
    const newAdminLogic = `function renderAdmin(){
\tfetch('/api/admin/users')
\t\t.then(res => res.json())
\t\t.then(list => {
\t\t\tconst totalEl = document.getElementById('admin-total');
\t\t\tconst tbodyEl = document.getElementById('admin-users-tbody');
\t\t\tif(totalEl) totalEl.textContent = String(list.length);
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
\t\t\t\t\tif (u.role !== 'admin') {
\t\t\t\t\t\tconst btnEdit = document.createElement('button');
\t\t\t\t\t\tbtnEdit.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:2px"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg> Sửa';
\t\t\t\t\t\tbtnEdit.style.padding = "4px 8px";
\t\t\t\t\t\tbtnEdit.style.fontSize = "12px";
\t\t\t\t\t\tbtnEdit.style.background = "#3b82f6";
\t\t\t\t\t\tbtnEdit.style.border = "none";
\t\t\t\t\t\tbtnEdit.style.color = "white";
\t\t\t\t\t\tbtnEdit.style.borderRadius = "4px";
\t\t\t\t\t\tbtnEdit.style.cursor = "pointer";
\t\t\t\t\t\tbtnEdit.style.marginRight = "6px";
\t\t\t\t\t\tbtnEdit.onclick = () => editUserPoints(u.email);
\t\t\t\t\t\ttdAction.appendChild(btnEdit);
\t\t\t\t\t\t
\t\t\t\t\t\tconst btnDel = document.createElement('button');
\t\t\t\t\t\tbtnDel.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:2px"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg> Xóa';
\t\t\t\t\t\tbtnDel.style.padding = "4px 8px";
\t\t\t\t\t\tbtnDel.style.fontSize = "12px";
\t\t\t\t\t\tbtnDel.style.background = "#ef4444";
\t\t\t\t\t\tbtnDel.style.border = "none";
\t\t\t\t\t\tbtnDel.style.color = "white";
\t\t\t\t\t\tbtnDel.style.borderRadius = "4px";
\t\t\t\t\t\tbtnDel.style.cursor = "pointer";
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
\t\t})
\t\t.catch(err => console.error("Admin fetch error:", err));
\t
\tconst btn = document.getElementById('admin-refresh');
\tbtn?.removeEventListener('click', renderAdmin);
\tbtn?.addEventListener('click', renderAdmin);
}

function editUserPoints(email) {
\tconst newPoints = prompt("Sửa điểm cho tài khoản " + email + ":\\nNhập số điểm mới:", 0);
\tif (newPoints !== null && !isNaN(newPoints) && newPoints.trim() !== '') {
\t\tfetch('/api/users/update-points', {
\t\t\tmethod: 'POST',
\t\t\theaders: { 'Content-Type': 'application/json' },
\t\t\tbody: JSON.stringify({ email, points: Number(newPoints) })
\t\t}).then(() => {
\t\t\talert('Cập nhật điểm thành công!');
\t\t\trenderAdmin();
\t\t});
\t}
}`;
    
    content = content.replace(/function renderAdmin\(\)\{[\s\S]*?function editUserPoints\(email\) \{[\s\S]*?\}\s*(?=function deleteUser)/, newAdminLogic + '\n');
    
    fs.writeFileSync(ex2AppPath, content, 'utf8');
}