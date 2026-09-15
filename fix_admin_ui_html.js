const fs = require('fs');

const htmlFiles = ['index.html', 'exercise-1/frontend/index.html', 'exercise-2/frontend/index.html'];
htmlFiles.forEach(f => {
    if (!fs.existsSync(f)) return;
    let content = fs.readFileSync(f, 'utf8');
    
    // Fix Dashboard Stats
    const oldStatsRegex = /<div><strong>T\u1ed5ng s\u1ed1 t\u00e0i kho\u1ea3n:<\/strong> <span id="admin-total">0<\/span><\/div>/;
    // Actually, reading from file, the file has actual UTF-8 characters.
    // If I use exact string with actual chars here, Powershell might corrupt it.
    // But I can match just 'id="admin-total"'
    
    const newStats = `<div style="display:flex; gap:16px; flex-wrap:wrap; margin-bottom:12px; width:100%;">
            <div style="background:var(--bg); padding:16px; border-radius:12px; border:1px solid var(--border); flex:1; text-align:center;">
              <div style="font-size:13px; color:var(--muted); text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;">T\u1ed5ng T\u00e0i Kho\u1ea3n</div>
              <div style="font-size:28px; font-weight:bold; color:var(--primary)" id="admin-total">0</div>
            </div>
            <div style="background:var(--bg); padding:16px; border-radius:12px; border:1px solid var(--border); flex:1; text-align:center;">
              <div style="font-size:13px; color:var(--muted); text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;">Qu\u1ea3n Tr\u1ecb Vi\u00ean</div>
              <div style="font-size:28px; font-weight:bold; color:#fbbf24" id="admin-count">0</div>
            </div>
            <div style="background:var(--bg); padding:16px; border-radius:12px; border:1px solid var(--border); flex:1; text-align:center;">
              <div style="font-size:13px; color:var(--muted); text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;">T\u1ed5ng \u0110i\u1ec3m</div>
              <div style="font-size:28px; font-weight:bold; color:#10b981" id="admin-points">0</div>
            </div>
          </div>`;
    
    content = content.replace(/<div><strong>.*?<\/strong> <span id="admin-total">0<\/span><\/div>/, newStats);
    
    // Fix Points header missing
    const tableHeaderRegex = /<th>Email<\/th>\s*<th style="width:60px">Vai tr\u00f2<\/th>/;
    content = content.replace(/<th>Email<\/th>\s*<th style="width:60px">Vai tr[oò\u00f2]<\/th>/, '<th>Email</th>\n<th>\u0110i\u1ec3m</th>\n<th style="width:60px">Vai tr\u00f2</th>');
    content = content.replace(/<th>Email<\/th>\s*<th>Vai tr[oò\u00f2]<\/th>/, '<th>Email</th>\n<th>\u0110i\u1ec3m</th>\n<th>Vai tr\u00f2</th>');
    
    fs.writeFileSync(f, content, 'utf8');
});