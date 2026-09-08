const fs = require('fs');
['app.js', 'exercise-1/frontend/app.js', 'exercise-2/frontend/app.js'].forEach(f => {
    let str = fs.readFileSync(f, 'utf8');
    str = str.replace(/function renderAdmin\(\) \{[\s\S]*?function deleteUser\(email\) \{[\s\S]*?\n\}/, `function renderAdmin(){
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
\t\t\ttdName.style.padding = "8px 4px";
\t\t\ttdName.textContent = u.name || "N/A";
\t\t\tconst tdEmail = document.createElement('td');
\t\t\ttdEmail.style.padding = "8px 4px";
\t\t\ttdEmail.textContent = u.email;
\t\t\tconst tdRole = document.createElement('td');
\t\t\ttdRole.style.padding = "8px 4px";
\t\t\ttdRole.textContent = u.role === 'admin' ? 'Admin' : 'User';
\t\t\tconst tdAction = document.createElement('td');
\t\t\ttdAction.style.padding = "8px 4px";
\t\t\tif (u.role !== 'admin') {
\t\t\t\tconst btnDel = document.createElement('button');
\t\t\t\tbtnDel.textContent = "Xóa";
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
\t\t\ttr.appendChild(tdRole);
\t\t\ttr.appendChild(tdAction);
\t\t\ttbodyEl.appendChild(tr);
\t\t});
\t}
\tconst btn = document.getElementById('admin-refresh');
\tbtn?.removeEventListener('click', renderAdmin);
\tbtn?.addEventListener('click', renderAdmin);
}
function deleteUser(email) {
\tif (!confirm('Bạn có chắc muốn xóa người dùng ' + email + '?')) return;
\tconst raw = localStorage.getItem(STORAGE_KEYS.users);
\tlet list = raw ? JSON.parse(raw) : [];
\tlist = list.filter(u => u.email !== email);
\tlocalStorage.setItem(STORAGE_KEYS.users, JSON.stringify(list));
\tstate.users = list;
\talert('Đã xóa người dùng!');
\trenderAdmin();
}`);
    fs.writeFileSync(f, str, 'utf8');
});