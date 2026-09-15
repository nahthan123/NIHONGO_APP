const fs = require('fs');

const htmlFiles = ['index.html', 'exercise-1/frontend/index.html', 'exercise-2/frontend/index.html'];
htmlFiles.forEach(f => {
    if (!fs.existsSync(f)) return;
    let content = fs.readFileSync(f, 'utf8');
    
    // Fix Dashboard Stats
    const oldStatsRegex = /<div><strong>Tổng số tài khoản:<\/strong> <span id="admin-total">0<\/span><\/div>/;
    const newStats = `<div style="display:flex; gap:16px; flex-wrap:wrap; margin-bottom:12px; width:100%;">
            <div style="background:var(--bg); padding:16px; border-radius:12px; border:1px solid var(--border); flex:1; text-align:center;">
              <div style="font-size:13px; color:var(--muted); text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;">Tổng Tài Khoản</div>
              <div style="font-size:28px; font-weight:bold; color:var(--primary)" id="admin-total">0</div>
            </div>
            <div style="background:var(--bg); padding:16px; border-radius:12px; border:1px solid var(--border); flex:1; text-align:center;">
              <div style="font-size:13px; color:var(--muted); text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;">Quản Trị Viên</div>
              <div style="font-size:28px; font-weight:bold; color:#fbbf24" id="admin-count">0</div>
            </div>
            <div style="background:var(--bg); padding:16px; border-radius:12px; border:1px solid var(--border); flex:1; text-align:center;">
              <div style="font-size:13px; color:var(--muted); text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;">Tổng Điểm</div>
              <div style="font-size:28px; font-weight:bold; color:#10b981" id="admin-points">0</div>
            </div>
          </div>`;
    
    if (content.match(oldStatsRegex)) {
        content = content.replace(oldStatsRegex, newStats);
    }
    
    // Fix Points header missing
    const tableHeaderRegex = /<th>Email<\/th>\s*<th style="width:60px">Vai trò<\/th>/;
    if (content.match(tableHeaderRegex)) {
        content = content.replace(tableHeaderRegex, '<th>Email</th>\n<th>Điểm</th>\n<th style="width:60px">Vai trò</th>');
    } else {
        // Ex 2 might be different
        const tableHeaderRegex2 = /<th>Email<\/th>\s*<th>Vai trò<\/th>/;
        if (content.match(tableHeaderRegex2)) {
            content = content.replace(tableHeaderRegex2, '<th>Email</th>\n<th>Điểm</th>\n<th>Vai trò</th>');
        }
    }
    
    fs.writeFileSync(f, content, 'utf8');
});

// Update JS for buttons
const jsFiles = ['app.js', 'exercise-1/frontend/app.js', 'exercise-2/frontend/app.js'];
jsFiles.forEach(f => {
    if (!fs.existsSync(f)) return;
    let content = fs.readFileSync(f, 'utf8');
    
    // In app.js and ex1
    content = content.replace(/const btnRole = document\.createElement\('button'\);[\s\S]*?tdAction\.appendChild\(btnRole\);/, '');
    
    // Change tdAction style
    content = content.replace(/tdAction\.style\.padding = "10px 4px";/, 'tdAction.style.padding = "10px 4px";\ntdAction.style.display = "flex";\ntdAction.style.gap = "6px";\ntdAction.style.flexWrap = "wrap";');
    
    // Fix button margins (remove margin-right since we use gap)
    content = content.replace(/margin-right:6px;/g, '');
    
    // Redesign buttons slightly
    content = content.replace(/📋 Lịch sử/g, 'Lịch sử');
    content = content.replace(/background:#10b981;/g, 'background:var(--bg); border:1px solid #10b981; color:#10b981;');
    content = content.replace(/background:#3b82f6;/g, 'background:var(--bg); border:1px solid #3b82f6; color:#3b82f6;');
    content = content.replace(/background:#ef4444;/g, 'background:var(--bg); border:1px solid #ef4444; color:#ef4444;');
    
    fs.writeFileSync(f, content, 'utf8');
});