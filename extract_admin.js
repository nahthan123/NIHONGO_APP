const fs = require('fs');

const dir = 'exercise-2/frontend/';
if (!fs.existsSync(dir)) process.exit(0);

// 1. CREATE admin.html
const adminHtml = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quản trị hệ thống | NihonGo</title>
  <link rel="stylesheet" href="styles.css">
  <style>
    body { background: var(--bg); color: var(--text); padding-top: 60px; }
    .admin-container { max-width: 1000px; margin: 0 auto; padding: 24px; }
    #admin-users-tbody tr { transition: background 0.2s ease; }
    #admin-users-tbody tr:hover { background: rgba(255,255,255,0.05); }
    .admin-table th { color: var(--muted); font-weight: 600; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; padding: 12px 24px; }
    .admin-table td { font-size: 14px; padding: 16px 24px; }
    #admin-search:focus { outline: 2px solid var(--primary); box-shadow: 0 0 10px rgba(16, 185, 129, 0.2); }
  </style>
</head>
<body>
  <header style="position:fixed; top:0; width:100%; height:60px; background:var(--card); display:flex; align-items:center; padding:0 24px; box-shadow:0 2px 10px rgba(0,0,0,0.5); z-index:100;">
    <h1 style="font-size:18px; margin:0; flex:1;">Quản trị hệ thống</h1>
    <button onclick="window.location.href='index.html'" class="btn" style="background:transparent; border:1px solid var(--border); color:var(--text);">← Về trang học</button>
  </header>
  
  <main class="admin-container">
    <!-- Thống kê -->
    <div style="display:flex; gap:16px; flex-wrap:wrap; margin-bottom:24px; width:100%;">
      <div style="background:var(--card); padding:24px; border-radius:12px; border:1px solid var(--border); flex:1; text-align:center;">
        <div style="font-size:13px; color:var(--muted); text-transform:uppercase; letter-spacing:1px; margin-bottom:8px;">Tổng T\u00e0i Kho\u1ea3n</div>
        <div style="font-size:36px; font-weight:bold; color:var(--primary)" id="admin-total">0</div>
      </div>
      <div style="background:var(--card); padding:24px; border-radius:12px; border:1px solid var(--border); flex:1; text-align:center;">
        <div style="font-size:13px; color:var(--muted); text-transform:uppercase; letter-spacing:1px; margin-bottom:8px;">Qu\u1ea3n Tr\u1ecb Vi\u00ean</div>
        <div style="font-size:36px; font-weight:bold; color:#fbbf24" id="admin-count">0</div>
      </div>
      <div style="background:var(--card); padding:24px; border-radius:12px; border:1px solid var(--border); flex:1; text-align:center;">
        <div style="font-size:13px; color:var(--muted); text-transform:uppercase; letter-spacing:1px; margin-bottom:8px;">T\u1ed5ng \u0110i\u1ec3m</div>
        <div style="font-size:36px; font-weight:bold; color:#10b981" id="admin-points">0</div>
      </div>
    </div>
    
    <!-- Table -->
    <div class="card" style="padding: 24px 0;">
      <div style="padding: 0 24px; display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <h3 style="margin:0;">Danh sách người dùng</h3>
        <button id="admin-refresh" class="btn primary">Làm mới</button>
      </div>
      
      <div style="padding: 0 24px; margin-bottom: 16px;">
        <input type="text" id="admin-search" placeholder="🔍 Tìm kiếm người dùng theo tên hoặc email..." style="width:100%; padding:12px; border-radius:6px; border:1px solid var(--border); background:var(--bg); color:var(--text); font-size:14px;">
      </div>
      
      <div style="overflow-x: auto;">
        <table class="admin-table" style="width:100%; text-align:left; border-collapse:collapse;">
          <thead>
            <tr style="border-bottom: 1px solid var(--border);">
              <th>Tên</th>
              <th>Email</th>
              <th>Điểm</th>
              <th>Tiến độ</th>
              <th>Vai trò</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody id="admin-users-tbody">
            <!-- Render by JS -->
          </tbody>
        </table>
      </div>
    </div>
  </main>
  <script src="admin.js"></script>
</body>
</html>
`;
fs.writeFileSync(dir + 'admin.html', adminHtml, 'utf8');

// 2. CREATE admin.js
const adminJs = `
const STORAGE_KEYS = { user: "nihongo_user" };
let currentUser = null;

function checkAuth() {
    const userRaw = localStorage.getItem(STORAGE_KEYS.user);
    if (!userRaw) {
        alert("Vui lòng đăng nhập!");
        window.location.href = 'index.html';
        return;
    }
    currentUser = JSON.parse(userRaw);
    if (currentUser.role !== 'admin') {
        alert("Chỉ quản trị viên mới được truy cập!");
        window.location.href = 'index.html';
    }
}

function renderAdmin() {
    fetch('/api/admin/users')
    .then(res => res.json())
    .then(list => {
        let totalPoints = 0;
        let adminCount = 0;
        list.forEach(u => {
            totalPoints += (u.points || 0);
            if (u.role === 'admin') adminCount++;
        });
        
        document.getElementById('admin-total').textContent = list.length;
        document.getElementById('admin-count').textContent = adminCount;
        document.getElementById('admin-points').textContent = totalPoints;
        
        const tbody = document.getElementById('admin-users-tbody');
        tbody.innerHTML = '';
        
        const searchEl = document.getElementById('admin-search');
        let filtered = list;
        if (searchEl && searchEl.value) {
            const term = searchEl.value.toLowerCase();
            filtered = list.filter(u => (u.name && u.name.toLowerCase().includes(term)) || (u.email && u.email.toLowerCase().includes(term)));
        }
        
        filtered.forEach(u => {
            const tr = document.createElement('tr');
            tr.style.borderBottom = "1px solid var(--border)";
            
            tr.innerHTML = \`
                <td>\${u.name || ''}</td>
                <td>\${u.email}</td>
                <td>\${u.points} (Lv\${u.level})</td>
                <td style="color:#10b981; font-weight:bold;">\${u.progress || 0} từ</td>
                <td style="font-weight:bold; color:\${u.role === 'admin' ? '#fbbf24' : 'inherit'}">\${u.role === 'admin' ? 'Admin' : 'User'}</td>
            \`;
            
            const tdAction = document.createElement('td');
            tdAction.style.display = "flex";
            tdAction.style.gap = "8px";
            tdAction.style.flexWrap = "wrap";
            
            if (u.email !== currentUser.email) {
                const btnRole = document.createElement('button');
                btnRole.textContent = u.role === 'admin' ? 'Hạ quyền' : 'Lên Admin';
                btnRole.style.cssText = "padding:6px 12px; font-size:12px; background:transparent; border:1px solid #fbbf24; color:#fbbf24; border-radius:4px; cursor:pointer;";
                btnRole.onclick = () => toggleUserRole(u.email);
                tdAction.appendChild(btnRole);
            }
            
            if (u.role !== 'admin') {
                const btnHist = document.createElement('button');
                btnHist.textContent = 'Lịch sử';
                btnHist.style.cssText = "padding:6px 12px; font-size:12px; background:transparent; border:1px solid #10b981; color:#10b981; border-radius:4px; cursor:pointer;";
                btnHist.onclick = () => viewUserHistory(u.email);
                
                const btnEdit = document.createElement('button');
                btnEdit.textContent = 'Sửa điểm';
                btnEdit.style.cssText = "padding:6px 12px; font-size:12px; background:transparent; border:1px solid #3b82f6; color:#3b82f6; border-radius:4px; cursor:pointer;";
                btnEdit.onclick = () => editUserPoints(u.email);
                
                const btnDel = document.createElement('button');
                btnDel.textContent = 'Xóa';
                btnDel.style.cssText = "padding:6px 12px; font-size:12px; background:transparent; border:1px solid #ef4444; color:#ef4444; border-radius:4px; cursor:pointer;";
                btnDel.onclick = () => deleteUser(u.email);
                
                tdAction.appendChild(btnHist);
                tdAction.appendChild(btnEdit);
                tdAction.appendChild(btnDel);
            }
            tr.appendChild(tdAction);
            tbody.appendChild(tr);
        });
    });
}

function toggleUserRole(email) {
    if(!confirm("Đổi quyền của " + email + "?")) return;
    fetch('/api/admin/toggle-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    }).then(res => res.json()).then(data => {
        if(data.success) { alert('Thành công!'); renderAdmin(); }
        else alert(data.message || 'Lỗi');
    });
}

function deleteUser(email) {
    if(!confirm("Chắc chắn XÓA " + email + "?")) return;
    fetch('/api/admin/delete-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    }).then(res => res.json()).then(data => {
        if(data.success) { alert('Đã xóa!'); renderAdmin(); }
        else alert(data.message || 'Lỗi');
    });
}

function editUserPoints(email) {
    const pts = prompt("Nhập số điểm mới:");
    if(pts !== null && !isNaN(pts)) {
        fetch('/api/users/update-points', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, points: Number(pts) })
        }).then(res => res.json()).then(data => {
            if(data.success) { alert('Cập nhật thành công!'); renderAdmin(); }
        });
    }
}

function viewUserHistory(email) {
    fetch('/api/admin/user-history?email=' + encodeURIComponent(email))
    .then(res => res.json()).then(data => {
        if(data.success && data.history.length > 0) {
            const histStr = data.history.slice(0, 10).map(h => "- " + h.action + " (" + new Date(h.timestamp).toLocaleString() + ")").join("\\n");
            alert("Lịch sử 10 hoạt động gần nhất của " + email + ":\\n\\n" + histStr);
        } else {
            alert("Chưa có hoạt động nào.");
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    renderAdmin();
    document.getElementById('admin-refresh').addEventListener('click', renderAdmin);
    document.getElementById('admin-search').addEventListener('input', renderAdmin);
});
`;
fs.writeFileSync(dir + 'admin.js', adminJs, 'utf8');

// 3. REMOVE ADMIN HTML from index.html
let indexHtml = fs.readFileSync(dir + 'index.html', 'utf8');
indexHtml = indexHtml.replace(/<section id="view-admin" class="view">[\s\S]*?<\/section>/, '');
fs.writeFileSync(dir + 'index.html', indexHtml, 'utf8');

// 4. REMOVE ADMIN JS from app.js and FIX router
let appJs = fs.readFileSync(dir + 'app.js', 'utf8');
appJs = appJs.replace(/function renderAdmin\(\) \{[\s\S]*?(?=function boot\(\) \{)/, ''); // Remove all admin functions up to boot()
appJs = appJs.replace(/if\(name === 'admin'\) \{ if\(!state\.user \|\| state\.user\.role !== 'admin'\) \{ alert\('Chỉ admin!'\); return; \} renderAdmin\(\); \}/g, '');
appJs = appJs.replace(/if \(name === 'admin'\) \{[\s\S]*?return;\n\t\}/, `if (name === 'admin') {
\t\tif (state.user && state.user.role === 'admin') {
\t\t\twindow.location.href = 'admin.html';
\t\t} else {
\t\t\talert('Chỉ admin mới truy cập được trang này');
\t\t}
\t\treturn;
\t}`);
fs.writeFileSync(dir + 'app.js', appJs, 'utf8');