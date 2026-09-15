const fs = require('fs');
const htmlFiles = ['index.html', 'exercise-1/frontend/index.html', 'exercise-2/frontend/index.html'];
htmlFiles.forEach(f => {
    if (!fs.existsSync(f)) return;
    let content = fs.readFileSync(f, 'utf8');
    
    // Add Tiến độ column
    if (!content.includes('<th>Tiến độ</th>')) {
        content = content.replace(/<th>Điểm<\/th>/, '<th>Điểm</th>\n          <th>Tiến độ</th>');
    }
    
    // Add Progress Bar
    const pbHtml = `<div style="margin-bottom:24px;">
          <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:14px; font-weight:bold; color:var(--muted);">
            <span>Tiến độ học từ vựng</span>
            <span id="fc-progress-text">0 / 0 từ</span>
          </div>
          <div style="width:100%; height:8px; background:var(--border); border-radius:999px; overflow:hidden;">
            <div id="fc-progress-bar" style="width:0%; height:100%; background:#10b981; transition: width 0.3s ease;"></div>
          </div>
        </div>`;
    if (!content.includes('fc-progress-bar')) {
        content = content.replace(/<div class="flashcard" id="flashcard">/, pbHtml + '\n        <div class="flashcard" id="flashcard">');
    }
    
    // Add "Đã thuộc" button
    const newBtn = `\n          <button id="btn-fc-memorized" class="btn" style="background:transparent; border:2px solid #10b981; color:#10b981; font-weight:bold;">Đã thuộc ✔️</button>`;
    if (!content.includes('btn-fc-memorized')) {
        content = content.replace(/<button id="btn-fc-speak" class="btn">Nghe<\/button>/, `<button id="btn-fc-speak" class="btn">Nghe</button>` + newBtn);
    }
    
    fs.writeFileSync(f, content, 'utf8');
});