const fs = require('fs');
const htmlFiles = ['index.html', 'exercise-1/frontend/index.html', 'exercise-2/frontend/index.html'];
htmlFiles.forEach(f => {
    if (!fs.existsSync(f)) return;
    let content = fs.readFileSync(f, 'utf8');
    
    // The current table headers are missing Points and Progress.
    const regex = /<th style="padding: 8px 4px;">Email<\/th>\s*<th style="padding: 8px 4px;">Vai tr[oò\u00f2]<\/th>/;
    
    // We want to add Điểm and Tiến độ
    const newHeaders = `<th style="padding: 8px 4px;">Email</th>
                  <th style="padding: 8px 4px;">\u0110i\u1ec3m</th>
                  <th style="padding: 8px 4px;">Ti\u1ebfn \u0111\u1ed9</th>
                  <th style="padding: 8px 4px;">Vai tr\u00f2</th>`;
                  
    if (content.match(regex)) {
        content = content.replace(regex, newHeaders);
    } else {
        // Fallback if styling is different
        content = content.replace(/<th>Email<\/th>\s*<th.*?>Vai tr[oò\u00f2]<\/th>/, `<th>Email</th>\n<th>\u0110i\u1ec3m</th>\n<th>Ti\u1ebfn \u0111\u1ed9</th>\n<th>Vai tr\u00f2</th>`);
    }
    
    fs.writeFileSync(f, content, 'utf8');
});