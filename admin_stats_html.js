const fs = require('fs');

// 1. Update HTML Files to add richer stats
const htmlFiles = ['index.html', 'exercise-1/frontend/index.html', 'exercise-2/frontend/index.html'];
htmlFiles.forEach(f => {
    if (!fs.existsSync(f)) return;
    let content = fs.readFileSync(f, 'utf8');
    
    const oldStats = `<p>Tổng số tài khoản: <strong id="admin-total">0</strong></p>`;
    const newStats = `<div style="display:flex; gap:16px; flex-wrap:wrap; margin-top:12px;">
              <div style="background:var(--bg); padding:12px; border-radius:8px; border:1px solid var(--border); flex:1; min-width:120px;">
                <div style="font-size:12px; color:var(--muted)">Tổng tài khoản</div>
                <div style="font-size:24px; font-weight:bold; color:var(--primary)" id="admin-total">0</div>
              </div>
              <div style="background:var(--bg); padding:12px; border-radius:8px; border:1px solid var(--border); flex:1; min-width:120px;">
                <div style="font-size:12px; color:var(--muted)">Tổng Admin</div>
                <div style="font-size:24px; font-weight:bold; color:#fbbf24" id="admin-count">0</div>
              </div>
              <div style="background:var(--bg); padding:12px; border-radius:8px; border:1px solid var(--border); flex:1; min-width:120px;">
                <div style="font-size:12px; color:var(--muted)">Tổng điểm hệ thống</div>
                <div style="font-size:24px; font-weight:bold; color:#10b981" id="admin-points">0</div>
              </div>
            </div>`;
    
    if (content.includes(oldStats)) {
        content = content.replace(oldStats, newStats);
        fs.writeFileSync(f, content, 'utf8');
    }
});