const fs = require('fs');
const path = require('path');

const fixAppJs = (filePath) => {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix messed up chars
    content = content.replace(/X\ufffda|Xa/g, 'Xóa');
    content = content.replace(/Admin \?\?|Admin 👑/g, 'Admin');
    content = content.replace(/Nguy\?n V\ufffdn A|Nguy\?n Vn A/g, 'Nguyễn Văn A');
    content = content.replace(/Tr\?n Th\? B/g, 'Trần Thị B');
    content = content.replace(/H\?c sinh Test/g, 'Học sinh Test');
    content = content.replace(/\? x\ufffda ng\ufffd\?i d\ufffdng!|\? xa ng\?i dng!/g, 'Đã xóa người dùng!');
    content = content.replace(/B\?n c\ufffd ch\?c mu\?n x\ufffda ng\ufffd\?i d\ufffdng|B\?n c ch\?c mu\?n xa ng\?i dng/g, 'Bạn có chắc muốn xóa người dùng');
    content = content.replace(/Ch\? admin!/g, 'Chỉ admin!');
    
    // For exercise-1 and exercise-2 app.js which have the admin functions
    // Let's just do a blanket replace to fix the role text
    content = content.replace(/u.role === 'admin' \? 'Admin.*?' : 'User'/g, "u.role === 'admin' ? 'Admin' : 'User'");
    
    fs.writeFileSync(filePath, content, 'utf8');
};

const fixIndexHtml = (filePath) => {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace Home Button emoji
    content = content.replace(/<div class="card-title">.*?Admin<\/div>/g, '<div class="card-title"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> Admin</div>');
    
    // Replace Refresh Button emoji
    content = content.replace(/<button id="admin-refresh".*?>.*?<\/button>/g, '<button id="admin-refresh" class="btn primary"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px;"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg> Làm mới</button>');
    
    fs.writeFileSync(filePath, content, 'utf8');
};

['app.js', 'exercise-1/frontend/app.js', 'exercise-2/frontend/app.js'].forEach(fixAppJs);
['index.html', 'exercise-1/frontend/index.html', 'exercise-2/frontend/index.html'].forEach(fixIndexHtml);
