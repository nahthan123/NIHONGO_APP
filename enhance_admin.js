const fs = require('fs');

// 1. Update HTML Files
const htmlFiles = ['index.html', 'exercise-1/frontend/index.html', 'exercise-2/frontend/index.html'];
htmlFiles.forEach(f => {
    if (!fs.existsSync(f)) return;
    let content = fs.readFileSync(f, 'utf8');
    
    // Add Points column to table header
    const oldHeader = `<th style="padding: 8px 4px;">Email</th>
                  <th style="padding: 8px 4px;">Vai trò</th>
                  <th style="padding: 8px 4px;">Hành động</th>`;
    const newHeader = `<th style="padding: 8px 4px;">Email</th>
                  <th style="padding: 8px 4px;">Điểm (Cấp)</th>
                  <th style="padding: 8px 4px;">Vai trò</th>
                  <th style="padding: 8px 4px;">Hành động</th>`;
    content = content.replace(oldHeader, newHeader);
    
    fs.writeFileSync(f, content, 'utf8');
});

// 2. Update JS Files
const jsFiles = ['app.js', 'exercise-1/frontend/app.js', 'exercise-2/frontend/app.js'];
jsFiles.forEach(f => {
    if (!fs.existsSync(f)) return;
    let content = fs.readFileSync(f, 'utf8');
    
    const newRenderAdmin = `function renderAdmin(){
\tconst totalEl = document.getElementById('admin-total');
\tconst tbodyEl = document.getElementById('admin-users-tbody');
\tconst raw = localStorage.getItem(STORAGE_KEYS.users);
\tconst list = raw ? JSON.parse(raw) : [];
\tif(totalEl) totalEl.textContent = String(list.length);
\tif (tbodyEl) {
\t\ttbodyEl.innerHTML = '';
\t\tlist.forEach(u => {
\t\t\tconst tr = document.createElement('tr');
\t\t\ttr.style.borderBottom = "1px solid var(--border)";
\t\t\tconst tdName = document.createElement('td');
\t\t\ttdName.style.padding = "10px 4px";
\t\t\ttdName.textContent = u.name || "N/A";
\t\t\tconst tdEmail = document.createElement('td');
\t\t\ttdEmail.style.padding = "10px 4px";
\t\t\ttdEmail.textContent = u.email;
\t\t\tconst tdPoints = document.createElement('td');
\t\t\ttdPoints.style.padding = "10px 4px";
\t\t\tlet pts = u.points || 0;
\t\t\tlet lvl = Math.max(1, Math.floor(pts / 100) + 1);
\t\t\ttdPoints.textContent = pts + " (Lv" + lvl + ")";
\t\t\tconst tdRole = document.createElement('td');
\t\t\ttdRole.style.padding = "10px 4px";
\t\t\ttdRole.innerHTML = u.role === 'admin' ? '<span style="color:#fbbf24;font-weight:bold;">Admin</span>' : 'User';
\t\t\tconst tdAction = document.createElement('td');
\t\t\ttdAction.style.padding = "10px 4px";
\t\t\t
\t\t\tif (u.role !== 'admin') {
\t\t\t\tconst btnEdit = document.createElement('button');
\t\t\t\tbtnEdit.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:2px"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg> Sửa';
\t\t\t\tbtnEdit.style.padding = "4px 8px";
\t\t\t\tbtnEdit.style.fontSize = "12px";
\t\t\t\tbtnEdit.style.background = "#3b82f6";
\t\t\t\tbtnEdit.style.border = "none";
\t\t\t\tbtnEdit.style.color = "white";
\t\t\t\tbtnEdit.style.borderRadius = "4px";
\t\t\t\tbtnEdit.style.cursor = "pointer";
\t\t\t\tbtnEdit.style.marginRight = "6px";
\t\t\t\tbtnEdit.onclick = () => editUserPoints(u.email);
\t\t\t\ttdAction.appendChild(btnEdit);
\t\t\t\t
\t\t\t\tconst btnDel = document.createElement('button');
\t\t\t\tbtnDel.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:2px"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg> Xóa';
\t\t\t\tbtnDel.style.padding = "4px 8px";
\t\t\t\tbtnDel.style.fontSize = "12px";
\t\t\t\tbtnDel.style.background = "#ef4444";
\t\t\t\tbtnDel.style.border = "none";
\t\t\t\tbtnDel.style.color = "white";
\t\t\t\tbtnDel.style.borderRadius = "4px";
\t\t\t\tbtnDel.style.cursor = "pointer";
\t\t\t\tbtnDel.onclick = () => deleteUser(u.email);
\t\t\t\ttdAction.appendChild(btnDel);
\t\t\t}
\t\t\ttr.appendChild(tdName);
\t\t\ttr.appendChild(tdEmail);
\t\t\ttr.appendChild(tdPoints);
\t\t\ttr.appendChild(tdRole);
\t\t\ttr.appendChild(tdAction);
\t\t\ttbodyEl.appendChild(tr);
\t\t});
\t}
\tconst btn = document.getElementById('admin-refresh');
\tbtn?.removeEventListener('click', renderAdmin);
\tbtn?.addEventListener('click', renderAdmin);
}

function editUserPoints(email) {
\tconst raw = localStorage.getItem(STORAGE_KEYS.users);
\tlet list = raw ? JSON.parse(raw) : [];
\tconst user = list.find(u => u.email === email);
\tif (!user) return;
\tconst newPoints = prompt("Sửa điểm cho tài khoản " + (user.name || email) + ":\\nNhập số điểm mới:", user.points || 0);
\tif (newPoints !== null && !isNaN(newPoints) && newPoints.trim() !== '') {
\t\tuser.points = Number(newPoints);
\t\tlocalStorage.setItem(STORAGE_KEYS.users, JSON.stringify(list));
\t\talert('Cập nhật điểm thành công!');
\t\trenderAdmin();
\t}
}
function deleteUser(email) {`;

    content = content.replace(/function renderAdmin\(\)\{[\s\S]*?function deleteUser\(email\) \{/, newRenderAdmin);
    
    fs.writeFileSync(f, content, 'utf8');
});