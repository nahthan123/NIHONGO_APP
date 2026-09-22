const fs = require('fs');
const htmlFiles = ['index.html', 'exercise-1/frontend/index.html', 'exercise-2/frontend/index.html'];

const premiumStyle = `<style>
  #admin-users-tbody tr { transition: background 0.2s ease; }
  #admin-users-tbody tr:hover { background: rgba(255,255,255,0.05); }
  .admin-table th { color: var(--muted); font-weight: 600; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; }
  .admin-table td { font-size: 14px; }
  #admin-search:focus { outline: 2px solid var(--primary); box-shadow: 0 0 10px rgba(16, 185, 129, 0.2); }
</style>`;

htmlFiles.forEach(f => {
    if (!fs.existsSync(f)) return;
    let content = fs.readFileSync(f, 'utf8');
    
    if (!content.includes('admin-users-tbody tr:hover')) {
        content = content.replace(/<div class="card" style="margin-bottom: 24px;">/, premiumStyle + '\n        <div class="card" style="margin-bottom: 24px;">');
    }
    
    // Add class admin-table to the table
    content = content.replace(/<table style="width:100%; text-align:left; border-collapse:collapse;">/, '<table class="admin-table" style="width:100%; text-align:left; border-collapse:collapse;">');
    
    // Make the card have no padding for the table so it spans full width
    content = content.replace(/<div class="card" style="margin-bottom: 24px;">\s*<h3>Danh sách người dùng<\/h3>/, '<div class="card" style="margin-bottom: 24px; padding: 24px 0;">\n            <h3 style="padding: 0 24px;">Danh sách người dùng</h3>');
    
    // Add padding to th and td to compensate for full width
    content = content.replace(/<th style="padding: 8px 4px;">/g, '<th style="padding: 12px 24px;">');
    
    fs.writeFileSync(f, content, 'utf8');
});

const jsFiles = ['app.js', 'exercise-1/frontend/app.js', 'exercise-2/frontend/app.js'];
jsFiles.forEach(f => {
    if (!fs.existsSync(f)) return;
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/tdName\.style\.padding = "10px 4px";/g, 'tdName.style.padding = "16px 24px";');
    content = content.replace(/tdEmail\.style\.padding = "10px 4px";/g, 'tdEmail.style.padding = "16px 24px";');
    content = content.replace(/tdPoints\.style\.padding = "10px 4px";/g, 'tdPoints.style.padding = "16px 24px";');
    content = content.replace(/tdProgress\.style\.padding = "10px 4px";/g, 'tdProgress.style.padding = "16px 24px";');
    content = content.replace(/tdRole\.style\.padding = "10px 4px";/g, 'tdRole.style.padding = "16px 24px";');
    content = content.replace(/tdAction\.style\.padding = "10px 4px";/g, 'tdAction.style.padding = "16px 24px";');
    
    fs.writeFileSync(f, content, 'utf8');
});