const fs = require('fs');
const jsFiles = ['app.js', 'exercise-1/frontend/app.js', 'exercise-2/frontend/app.js'];

jsFiles.forEach(f => {
    if (!fs.existsSync(f)) return;
    let content = fs.readFileSync(f, 'utf8');
    
    // Remove btnRole completely.
    content = content.replace(/const btnRole = document\.createElement\('button'\);[\s\S]*?tdAction\.appendChild\(btnRole\);/, '');
    
    // Format tdAction for flex layout
    content = content.replace(/tdAction\.style\.padding = "10px 4px";/, 'tdAction.style.padding = "10px 4px";\n\t\t\t\t\ttdAction.style.display = "flex";\n\t\t\t\t\ttdAction.style.gap = "6px";\n\t\t\t\t\ttdAction.style.flexWrap = "wrap";');
    
    // Clean up all individual margin-rights from previous inline styles
    content = content.replace(/margin-right:6px;/g, '');
    
    // Improve button styles (outline instead of filled for cleaner look)
    content = content.replace(/background:#10b981; border:none; color:white;/g, 'background:transparent; border:1px solid #10b981; color:#10b981;');
    content = content.replace(/background:#3b82f6; border:none; color:white;/g, 'background:transparent; border:1px solid #3b82f6; color:#3b82f6;');
    content = content.replace(/background:#ef4444; border:none; color:white;/g, 'background:transparent; border:1px solid #ef4444; color:#ef4444;');
    
    // Change "📋 Lịch sử" to just "Lịch sử"
    content = content.replace(/📋 Lịch sử/g, 'Lịch sử');

    fs.writeFileSync(f, content, 'utf8');
});