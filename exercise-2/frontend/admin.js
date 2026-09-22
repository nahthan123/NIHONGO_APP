
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
            
            tr.innerHTML = `
                <td>${u.name || ''}</td>
                <td>${u.email}</td>
                <td>${u.points} (Lv${u.level})</td>
                <td style="color:#10b981; font-weight:bold;">${u.progress || 0} từ</td>
                <td style="font-weight:bold; color:${u.role === 'admin' ? '#fbbf24' : 'inherit'}">${u.role === 'admin' ? 'Admin' : 'User'}</td>
            `;
            
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
            const histStr = data.history.slice(0, 10).map(h => "- " + h.action + " (" + new Date(h.timestamp).toLocaleString() + ")").join("\n");
            alert("Lịch sử 10 hoạt động gần nhất của " + email + ":\n\n" + histStr);
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
