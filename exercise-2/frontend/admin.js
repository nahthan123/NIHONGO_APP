/**
 * NihonGo Cloud Admin Panel - Controller Script
 * AWS Production & Multi-Container Management System
 */

const STORAGE_KEYS = { user: "nihongo_user" };
let currentUser = null;
let cachedUsers = [];
let pendingConfirmCallback = null;

// ================= Authenticated API Fetcher =================
function adminFetch(url, options = {}) {
    options.headers = options.headers || {};
    if (!options.headers['x-admin-email']) {
        const storedUser = currentUser || JSON.parse(localStorage.getItem(STORAGE_KEYS.user) || 'null');
        if (storedUser && storedUser.email) {
            options.headers['x-admin-email'] = storedUser.email;
        }
    }
    return fetch(url, options);
}

// ================= Toast Notification System =================
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let iconSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    if (type === 'error') {
        iconSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    } else if (type === 'info') {
        iconSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
    }

    toast.innerHTML = `
        <span style="display:inline-flex; align-items:center;">${iconSvg}</span>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// ================= Modal Management =================
function openModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
}

function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
}

function showConfirm(title, message, onConfirm) {
    document.getElementById('confirm-modal-title').textContent = title;
    document.getElementById('confirm-modal-message').textContent = message;
    pendingConfirmCallback = onConfirm;
    openModal('modal-confirm-action');
}

// ================= Tab Switching =================
function switchTab(tabId) {
    document.querySelectorAll('.tab-section').forEach(sec => sec.style.display = 'none');
    document.querySelectorAll('.sidebar-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
    });

    const activeSec = document.getElementById(tabId);
    if (activeSec) activeSec.style.display = 'block';
}

// ================= Authentication & Gate =================
function checkAuth() {
    const userRaw = localStorage.getItem(STORAGE_KEYS.user);
    if (!userRaw) {
        openModal('modal-admin-gate');
        return false;
    }

    try {
        currentUser = JSON.parse(userRaw);
    } catch (e) {
        currentUser = null;
    }

    if (!currentUser || currentUser.role !== 'admin') {
        openModal('modal-admin-gate');
        return false;
    }

    // Update UI profile in Navbar
    const nameEl = document.getElementById('admin-name');
    const emailEl = document.getElementById('admin-email');
    const avatarEl = document.getElementById('admin-avatar');

    if (nameEl) nameEl.textContent = currentUser.name || 'Quản trị viên';
    if (emailEl) emailEl.textContent = currentUser.email || 'admin@nihongo.local';
    if (avatarEl) avatarEl.textContent = (currentUser.name ? currentUser.name[0] : 'A').toUpperCase();

    closeModal('modal-admin-gate');
    return true;
}

function initAdminGate() {
    const btnQuickFill = document.getElementById('btn-quick-fill-admin');
    const emailInput = document.getElementById('gate-admin-email');
    const passInput = document.getElementById('gate-admin-pass');
    const errBox = document.getElementById('gate-login-err');
    const btnLogin = document.getElementById('btn-gate-login');

    btnQuickFill?.addEventListener('click', () => {
        if (emailInput) emailInput.value = 'admin@nihongo.local';
        if (passInput) passInput.value = 'admin123';
        if (errBox) errBox.style.display = 'none';
    });

    btnLogin?.addEventListener('click', () => {
        const email = emailInput?.value.trim();
        const password = passInput?.value;

        if (!email || !password) {
            if (errBox) {
                errBox.textContent = 'Vui lòng điền đầy đủ Email và Mật khẩu.';
                errBox.style.display = 'block';
            }
            return;
        }

        fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
        .then(res => res.json())
        .then(data => {
            if (!data.success) {
                if (errBox) {
                    errBox.textContent = data.message || 'Đăng nhập không thành công';
                    errBox.style.display = 'block';
                }
                return;
            }

            if (data.user.role !== 'admin') {
                if (errBox) {
                    errBox.textContent = 'Tài khoản này không có quyền Quản trị viên (Admin)!';
                    errBox.style.display = 'block';
                }
                return;
            }

            localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(data.user));
            currentUser = data.user;
            closeModal('modal-admin-gate');
            showToast('Đăng nhập Quản trị viên thành công!');
            checkAuth();
            loadAllData();
        })
        .catch(err => {
            if (errBox) {
                errBox.textContent = 'Lỗi kết nối tới Backend API máy chủ.';
                errBox.style.display = 'block';
            }
        });
    });

    document.getElementById('btn-admin-logout')?.addEventListener('click', () => {
        showConfirm('Đăng Xuất Khỏi Admin', 'Bạn có chắc chắn muốn đăng xuất khỏi NihonGo Admin?', () => {
            localStorage.removeItem(STORAGE_KEYS.user);
            currentUser = null;
            window.location.reload();
        });
    });
}

// ================= Data Loading & API Calls =================
function pingServerHealth() {
    const startTime = performance.now();
    fetch('/api/health')
    .then(res => res.json())
    .then(data => {
        const latency = Math.round(performance.now() - startTime);
        const statusText = document.getElementById('server-status-text');
        if (statusText) {
            statusText.textContent = `AWS Backend: ${latency}ms • 200 OK`;
        }
    })
    .catch(() => {
        const statusText = document.getElementById('server-status-text');
        if (statusText) {
            statusText.textContent = `AWS Backend: Mất kết nối`;
            statusText.parentElement.style.borderColor = 'var(--admin-danger)';
            statusText.parentElement.style.color = 'var(--admin-danger)';
        }
    });
}

function loadStats() {
    adminFetch('/api/admin/stats')
    .then(res => {
        if (res.status === 401 || res.status === 403) {
            openModal('modal-admin-gate');
            return null;
        }
        return res.json();
    })
    .then(stats => {
        if (!stats || !stats.success) return;

        // KPI Numbers
        document.getElementById('kpi-total-users').textContent = stats.totalUsers;
        document.getElementById('kpi-user-breakdown').textContent = `${stats.adminCount} Quản trị viên • ${stats.userCount} Học viên`;
        document.getElementById('kpi-admin-count').textContent = stats.adminCount;
        document.getElementById('kpi-total-points').textContent = stats.totalPoints.toLocaleString();
        document.getElementById('kpi-total-words').textContent = stats.totalWords;

        // Infrastructure Tab
        const elUptime = document.getElementById('infra-uptime');
        if (elUptime) {
            const h = Math.floor(stats.serverUptime / 3600);
            const m = Math.floor((stats.serverUptime % 3600) / 60);
            const s = stats.serverUptime % 60;
            elUptime.textContent = `${h} giờ ${m} phút ${s} giây`;
        }
        const elRam = document.getElementById('infra-ram');
        if (elRam) elRam.textContent = stats.memoryUsage;
        const elNode = document.getElementById('infra-node');
        if (elNode) elNode.textContent = stats.nodeVersion;
        const elEnv = document.getElementById('infra-env');
        if (elEnv) elEnv.textContent = stats.environment;
    })
    .catch(err => console.error('Error fetching stats:', err));
}

function loadUsers() {
    adminFetch('/api/admin/users')
    .then(res => {
        if (res.status === 401 || res.status === 403) {
            openModal('modal-admin-gate');
            return [];
        }
        return res.json();
    })
    .then(users => {
        if (Array.isArray(users)) {
            cachedUsers = users;
            renderUsersTable();
            renderOverviewRecent();
        }
    })
    .catch(err => console.error('Error fetching users:', err));
}

function loadLeaderboard() {
    fetch('/api/users/leaderboard')
    .then(res => res.json())
    .then(list => {
        const tbody = document.getElementById('admin-leaderboard-tbody');
        if (!tbody) return;
        tbody.innerHTML = '';

        list.forEach((item, index) => {
            let rankColor = 'inherit';
            let rankStyle = '';
            if (index === 0) {
                rankColor = '#fbbf24';
                rankStyle = 'background: rgba(251, 191, 36, 0.15); border: 1px solid rgba(251, 191, 36, 0.4); padding: 3px 8px; border-radius: 6px;';
            } else if (index === 1) {
                rankColor = '#94a3b8';
                rankStyle = 'background: rgba(148, 163, 184, 0.15); border: 1px solid rgba(148, 163, 184, 0.4); padding: 3px 8px; border-radius: 6px;';
            } else if (index === 2) {
                rankColor = '#d97706';
                rankStyle = 'background: rgba(217, 119, 6, 0.15); border: 1px solid rgba(217, 119, 6, 0.4); padding: 3px 8px; border-radius: 6px;';
            }

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="font-weight:700; font-size:13px; color:${rankColor};">
                    <span style="${rankStyle}">TOP ${index + 1}</span>
                </td>
                <td style="font-weight:600;">${escapeHtml(item.name)}</td>
                <td style="color:#10b981; font-weight:700;">${item.points} pts</td>
                <td><span class="level-pill">Lv ${item.level}</span></td>
                <td><strong>${item.words || 0}</strong> từ đã thuộc</td>
            `;
            tbody.appendChild(tr);
        });
    })
    .catch(err => console.error('Error fetching leaderboard:', err));
}

function loadAllData() {
    pingServerHealth();
    loadStats();
    loadUsers();
    loadLeaderboard();
}

// Academic JLPT Rank Helper
function getLevelRank(level) {
    if (level <= 2) return { code: "[N5-BASIC]", label: "Sơ cấp N5" };
    if (level <= 5) return { code: "[N5-PRO]", label: "Trung cấp N5" };
    if (level <= 9) return { code: "[N4-CORE]", label: "Nâng cao N4" };
    return { code: "[MASTER]", label: "Cao cấp Master" };
}

// ================= Table Renderers =================
function renderOverviewRecent() {
    const tbody = document.getElementById('overview-recent-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const recent = cachedUsers.slice(0, 5);
    recent.forEach(u => {
        const rank = getLevelRank(u.level || 1);
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="user-cell">
                    <div class="user-avatar-sm">${escapeHtml(u.name ? u.name[0] : 'U').toUpperCase()}</div>
                    <div>
                        <div class="user-info-name">${escapeHtml(u.name || 'N/A')}</div>
                        <div class="user-info-email">${escapeHtml(u.email)}</div>
                    </div>
                </div>
            </td>
            <td><span class="role-badge ${u.role}">${u.role === 'admin' ? 'Admin' : 'Học viên'}</span></td>
            <td>
                <span class="level-pill">Lv ${u.level}</span>
                <span class="rank-badge" style="font-size:10px; padding:2px 6px; border-radius:4px; font-weight:700; background:rgba(16,185,129,0.15); color:#10b981; border:1px solid rgba(16,185,129,0.3); margin-left:4px;">${rank.code}</span>
            </td>
            <td><span style="color:#10b981; font-weight:700;">${u.progress || 0}</span> từ</td>
            <td>
                <button class="btn btn-outline btn-sm" onclick="openUserHistory('${escapeHtml(u.email)}')">Xem lịch sử</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderUsersTable() {
    const tbody = document.getElementById('admin-users-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const searchTerm = (document.getElementById('admin-search-input')?.value || '').toLowerCase().trim();
    const roleFilter = document.getElementById('admin-filter-role')?.value || 'all';
    const sortBy = document.getElementById('admin-sort-by')?.value || 'points-desc';

    let list = [...cachedUsers];

    // Filter by Search
    if (searchTerm) {
        list = list.filter(u => 
            (u.name && u.name.toLowerCase().includes(searchTerm)) || 
            (u.email && u.email.toLowerCase().includes(searchTerm))
        );
    }

    // Filter by Role
    if (roleFilter !== 'all') {
        list = list.filter(u => u.role === roleFilter);
    }

    // Sort
    if (sortBy === 'points-desc') list.sort((a, b) => (b.points || 0) - (a.points || 0));
    else if (sortBy === 'points-asc') list.sort((a, b) => (a.points || 0) - (b.points || 0));
    else if (sortBy === 'words-desc') list.sort((a, b) => (b.progress || 0) - (a.progress || 0));
    else if (sortBy === 'name-asc') list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:32px; color:var(--admin-muted);">Không tìm thấy người dùng nào phù hợp với bộ lọc.</td></tr>`;
        return;
    }

    list.forEach(u => {
        const tr = document.createElement('tr');
        const progressPercent = Math.min(100, Math.round(((u.progress || 0) / 20) * 100));

        tr.innerHTML = `
            <td>
                <div class="user-cell">
                    <div class="user-avatar-sm">${escapeHtml(u.name ? u.name[0] : 'U').toUpperCase()}</div>
                    <div>
                        <div class="user-info-name">${escapeHtml(u.name || 'N/A')}</div>
                        <div class="user-info-email">${escapeHtml(u.email)}</div>
                    </div>
                </div>
            </td>
            <td><span class="role-badge ${u.role}">${u.role === 'admin' ? 'Admin' : 'Học viên'}</span></td>
            <td>
                <span class="level-pill">Lv ${u.level}</span>
                <span class="rank-badge" style="font-size:10px; padding:2px 6px; border-radius:4px; font-weight:700; background:rgba(16,185,129,0.15); color:#10b981; border:1px solid rgba(16,185,129,0.3); margin-left:4px;">${getLevelRank(u.level || 1).code}</span>
                <div style="color:#10b981; font-weight:700; font-size:12px; margin-top:3px;">${u.points} pts</div>
            </td>
            <td>
                <div class="progress-wrap">
                    <div style="font-size:12px; font-weight:600; display:flex; justify-content:space-between;">
                        <span>${u.progress || 0} từ thuộc</span>
                        <span style="color:var(--admin-muted);">${progressPercent}%</span>
                    </div>
                    <div class="progress-bar-bg">
                        <div class="progress-bar-fill" style="width:${progressPercent}%"></div>
                    </div>
                </div>
            </td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-outline btn-sm action-btn" onclick="openEditUserModal('${escapeHtml(u.email)}', '${escapeHtml(u.name || '')}', ${u.points || 0}, '${u.role}')" title="Sửa thông tin">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        <span>Sửa</span>
                    </button>
                    <button class="btn btn-outline btn-sm action-btn" onclick="openResetPasswordModal('${escapeHtml(u.email)}')" title="Đổi mật khẩu">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        <span>Đổi MK</span>
                    </button>
                    <button class="btn btn-outline btn-sm action-btn" onclick="openUserHistory('${escapeHtml(u.email)}')" title="Xem hoạt động">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        <span>Lịch sử</span>
                    </button>
                    <button class="btn btn-outline btn-sm action-btn" style="color:#fbbf24; border-color:rgba(245,158,11,0.4);" onclick="toggleRole('${escapeHtml(u.email)}')" title="Đổi quyền">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        <span>${u.role === 'admin' ? 'Hạ quyền' : 'Lên Admin'}</span>
                    </button>
                    ${u.role !== 'admin' || (currentUser && u.email !== currentUser.email) ? `
                        <button class="btn btn-danger btn-sm action-btn" onclick="deleteUser('${escapeHtml(u.email)}')" title="Xóa người dùng">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                            <span>Xóa</span>
                        </button>
                    ` : ''}
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ================= User Actions (Modals & APIs) =================
function openCreateUserModal() {
    document.getElementById('create-user-email').value = '';
    document.getElementById('create-user-name').value = '';
    document.getElementById('create-user-pass').value = '';
    document.getElementById('create-user-points').value = '0';
    document.getElementById('create-user-role').value = 'user';
    openModal('modal-create-user');
}

function handleCreateUser() {
    const email = document.getElementById('create-user-email').value.trim();
    const name = document.getElementById('create-user-name').value.trim();
    const password = document.getElementById('create-user-pass').value;
    const points = Number(document.getElementById('create-user-points').value) || 0;
    const role = document.getElementById('create-user-role').value;

    if (!email || !password) {
        showToast('Vui lòng nhập Email và Mật khẩu', 'error');
        return;
    }

    adminFetch('/api/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password, points, role })
    })
    .then(res => res.json())
    .then(data => {
        if (!data.success) {
            showToast(data.message || 'Lỗi tạo tài khoản', 'error');
            return;
        }
        closeModal('modal-create-user');
        showToast('Tạo tài khoản người dùng thành công!');
        loadAllData();
    })
    .catch(() => showToast('Lỗi kết nối máy chủ', 'error'));
}

function openEditUserModal(email, name, points, role) {
    document.getElementById('edit-user-email').value = email;
    document.getElementById('edit-display-email').value = email;
    document.getElementById('edit-user-name').value = name;
    document.getElementById('edit-user-points').value = points;
    document.getElementById('edit-user-role').value = role;
    openModal('modal-edit-user');
}

function handleSaveEditUser() {
    const email = document.getElementById('edit-user-email').value;
    const name = document.getElementById('edit-user-name').value.trim();
    const points = Number(document.getElementById('edit-user-points').value) || 0;
    const role = document.getElementById('edit-user-role').value;

    adminFetch('/api/admin/update-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, points, role })
    })
    .then(res => res.json())
    .then(data => {
        if (!data.success) {
            showToast(data.message || 'Lỗi cập nhật người dùng', 'error');
            return;
        }
        closeModal('modal-edit-user');
        showToast('Cập nhật người dùng thành công!');
        loadAllData();
    })
    .catch(() => showToast('Lỗi kết nối máy chủ', 'error'));
}

function openResetPasswordModal(email) {
    document.getElementById('reset-user-email').value = email;
    document.getElementById('reset-user-text').textContent = `Đặt lại mật khẩu cho tài khoản: ${email}`;
    document.getElementById('reset-user-newpass').value = '';
    openModal('modal-reset-password');
}

function handleResetPassword() {
    const email = document.getElementById('reset-user-email').value;
    const newPassword = document.getElementById('reset-user-newpass').value;

    if (!newPassword || newPassword.length < 6) {
        showToast('Mật khẩu mới phải có ít nhất 6 ký tự', 'error');
        return;
    }

    adminFetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword })
    })
    .then(res => res.json())
    .then(data => {
        if (!data.success) {
            showToast(data.message || 'Lỗi đặt lại mật khẩu', 'error');
            return;
        }
        closeModal('modal-reset-password');
        showToast('Đã đổi mật khẩu thành công!');
    })
    .catch(() => showToast('Lỗi kết nối máy chủ', 'error'));
}

function openUserHistory(email) {
    document.getElementById('history-modal-title').textContent = `Lịch Sử Học Tập: ${email}`;
    const container = document.getElementById('history-items-container');
    container.innerHTML = '<div style="color:var(--admin-muted); padding:16px; text-align:center;">Đang tải lịch sử...</div>';
    openModal('modal-user-history');

    adminFetch(`/api/admin/user-history?email=${encodeURIComponent(email)}`)
    .then(res => res.json())
    .then(data => {
        if (!data.success || !data.history || data.history.length === 0) {
            container.innerHTML = '<div style="color:var(--admin-muted); padding:24px; text-align:center;">Chưa có hoạt động học tập nào được ghi nhận.</div>';
            return;
        }

        container.innerHTML = '';
        data.history.forEach(item => {
            const div = document.createElement('div');
            div.className = 'history-item';
            div.innerHTML = `
                <div>${escapeHtml(item.action)}</div>
                <div class="history-time">${new Date(item.timestamp).toLocaleString('vi-VN')}</div>
            `;
            container.appendChild(div);
        });
    })
    .catch(() => {
        container.innerHTML = '<div style="color:var(--admin-danger); padding:16px;">Lỗi khi tải lịch sử người dùng.</div>';
    });
}

function toggleRole(email) {
    showConfirm('Thay Đổi Vai Trò', `Bạn có chắc muốn chuyển đổi vai trò của tài khoản ${email}?`, () => {
        adminFetch('/api/admin/toggle-role', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        })
        .then(res => res.json())
        .then(data => {
            if (!data.success) {
                showToast(data.message || 'Lỗi thay đổi quyền', 'error');
                return;
            }
            showToast(`Đã đổi quyền thành công: ${data.role}`);
            loadAllData();
        })
        .catch(() => showToast('Lỗi kết nối máy chủ', 'error'));
    });
}

function deleteUser(email) {
    showConfirm('Xóa Người Dùng', `Hành động này KHÔNG THỂ HOÀN TÁC. Bạn có chắc muốn xóa vĩnh viễn tài khoản ${email}?`, () => {
        adminFetch('/api/admin/delete-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        })
        .then(res => res.json())
        .then(data => {
            if (!data.success) {
                showToast(data.message || 'Lỗi xóa người dùng', 'error');
                return;
            }
            showToast('Đã xóa người dùng thành công!');
            loadAllData();
        })
        .catch(() => showToast('Lỗi kết nối máy chủ', 'error'));
    });
}

function exportUsersJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cachedUsers, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `nihongo_users_export_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Đã xuất file sao lưu JSON thành công!');
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, m => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[m]);
}

// ================= Event Listeners Initialization =================
document.addEventListener('DOMContentLoaded', () => {
    initAdminGate();

    // Check Auth on load
    if (checkAuth()) {
        loadAllData();
    }

    // Sidebar navigation
    document.querySelectorAll('.sidebar-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            if (tabId) switchTab(tabId);
        });
    });

    // Refresh button
    document.getElementById('btn-refresh-all')?.addEventListener('click', () => {
        loadAllData();
        showToast('Đã làm mới dữ liệu hệ thống!');
    });

    // Add user button in overview
    document.getElementById('btn-open-create-user')?.addEventListener('click', openCreateUserModal);

    // Filter and search inputs
    document.getElementById('admin-search-input')?.addEventListener('input', renderUsersTable);
    document.getElementById('admin-filter-role')?.addEventListener('change', renderUsersTable);
    document.getElementById('admin-sort-by')?.addEventListener('change', renderUsersTable);

    // Modal submit buttons
    document.getElementById('btn-save-edit-user')?.addEventListener('click', handleSaveEditUser);
    document.getElementById('btn-submit-create-user')?.addEventListener('click', handleCreateUser);
    document.getElementById('btn-submit-reset-password')?.addEventListener('click', handleResetPassword);
    document.getElementById('btn-export-json')?.addEventListener('click', exportUsersJSON);

    // Confirmation execute
    document.getElementById('btn-confirm-action-execute')?.addEventListener('click', () => {
        closeModal('modal-confirm-action');
        if (typeof pendingConfirmCallback === 'function') {
            pendingConfirmCallback();
            pendingConfirmCallback = null;
        }
    });

    // Auto health ping every 20 seconds
    setInterval(pingServerHealth, 20000);
});
