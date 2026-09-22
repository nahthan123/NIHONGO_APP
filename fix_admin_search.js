const fs = require('fs');

const htmlFiles = ['index.html', 'exercise-1/frontend/index.html', 'exercise-2/frontend/index.html'];
htmlFiles.forEach(f => {
    if (!fs.existsSync(f)) return;
    let content = fs.readFileSync(f, 'utf8');
    
    // Add Search Input
    const searchHtml = `<div style="margin-bottom: 16px;">
              <input type="text" id="admin-search" placeholder="🔍 Tìm kiếm người dùng theo tên hoặc email..." style="width:100%; padding:10px; border-radius:6px; border:1px solid var(--border); background:var(--bg); color:var(--text); font-size:14px;">
            </div>`;
    
    if (!content.includes('admin-search')) {
        content = content.replace(/<div style="overflow-x: auto;">/, searchHtml + '\n          <div style="overflow-x: auto;">');
        fs.writeFileSync(f, content, 'utf8');
    }
});

const jsFiles = ['app.js', 'exercise-1/frontend/app.js', 'exercise-2/frontend/app.js'];
jsFiles.forEach(f => {
    if (!fs.existsSync(f)) return;
    let content = fs.readFileSync(f, 'utf8');
    
    // Add filtering logic to renderAdmin
    if (!content.includes('admin-search')) {
        content = content.replace(/list\.forEach\(u => \{/, `const searchEl = document.getElementById('admin-search');
\t\t\t\tlet filteredList = list;
\t\t\t\tif (searchEl && searchEl.value) {
\t\t\t\t\tconst term = searchEl.value.toLowerCase();
\t\t\t\t\tfilteredList = list.filter(u => (u.name && u.name.toLowerCase().includes(term)) || (u.email && u.email.toLowerCase().includes(term)));
\t\t\t\t}
\t\t\t\tfilteredList.forEach(u => {`);
        
        // Add event listener for search bar
        content = content.replace(/const btn = document\.getElementById\('admin-refresh'\);/, `const searchInput = document.getElementById('admin-search');
\tif(searchInput) {
\t\tsearchInput.removeEventListener('input', renderAdmin);
\t\tsearchInput.addEventListener('input', renderAdmin);
\t}\n\tconst btn = document.getElementById('admin-refresh');`);
        
        fs.writeFileSync(f, content, 'utf8');
    }
});