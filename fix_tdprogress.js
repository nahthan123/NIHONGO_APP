const fs = require('fs');
const jsFiles = ['app.js', 'exercise-1/frontend/app.js', 'exercise-2/frontend/app.js'];

jsFiles.forEach(f => {
    if (!fs.existsSync(f)) return;
    let content = fs.readFileSync(f, 'utf8');
    
    // Fix missing appendChild for tdProgress
    if (!content.includes('tr.appendChild(tdProgress)')) {
        content = content.replace(/tr\.appendChild\(tdPoints\);\s*tr\.appendChild\(tdRole\);/, 'tr.appendChild(tdPoints);\n\t\t\t\t\ttr.appendChild(tdProgress);\n\t\t\t\t\ttr.appendChild(tdRole);');
    }
    
    // If regex failed, let's just do a string replace
    content = content.replace('tr.appendChild(tdPoints);\n\t\t\t\t\ttr.appendChild(tdRole);', 'tr.appendChild(tdPoints);\n\t\t\t\t\ttr.appendChild(tdProgress);\n\t\t\t\t\ttr.appendChild(tdRole);');
    // What if it's spaces?
    content = content.replace(/tr\.appendChild\(tdPoints\);\r?\n\s*tr\.appendChild\(tdRole\);/, 'tr.appendChild(tdPoints);\n\t\t\t\t\ttr.appendChild(tdProgress);\n\t\t\t\t\ttr.appendChild(tdRole);');

    // Make buttons look professional
    content = content.replace(/Lịch sử/g, 'Lịch sử'); // keep text
    // Increase spacing in tdAction
    content = content.replace(/tdAction\.style\.gap = "6px";/, 'tdAction.style.gap = "8px";');
    
    fs.writeFileSync(f, content, 'utf8');
});