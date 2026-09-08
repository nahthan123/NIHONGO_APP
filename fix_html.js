const fs = require('fs');
['index.html', 'exercise-1/frontend/index.html', 'exercise-2/frontend/index.html'].forEach(f => {
    let str = fs.readFileSync(f, 'utf8');
    str = str.replace(/<button id="admin-refresh".*?>.*?<\/button>/g, '<button id="admin-refresh" class="btn primary"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px;"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg> Làm mới</button>');
    fs.writeFileSync(f, str, 'utf8');
});