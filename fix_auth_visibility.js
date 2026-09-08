const fs = require('fs');

const newHydrateUI = `function hydrateUI() {
\tupdateHeaderStats();
\tconst pfName = document.getElementById("pf-name");
\tconst input = document.getElementById("pf-input-name");
\tif (state.user && state.user.name) { 
\t\tif(pfName) pfName.textContent = state.user.name; 
\t\tif (input) input.value = state.user.name; 
\t} else { 
\t\tif(pfName) pfName.textContent = state.name; 
\t\tif (input) input.value = state.name; 
\t}

\t// Toggle Auth buttons
\tconst authCards = document.querySelectorAll('[data-nav="auth"]');
\tauthCards.forEach(el => {
\t\tel.style.display = state.user ? 'none' : '';
\t});

\t// Toggle Admin button
\tconst adminCards = document.querySelectorAll('[data-nav="admin"]');
\tadminCards.forEach(el => {
\t\tel.style.display = (state.user && state.user.role === 'admin') ? '' : 'none';
\t});
}`;

['app.js', 'exercise-1/frontend/app.js', 'exercise-2/frontend/app.js'].forEach(f => {
    if (!fs.existsSync(f)) return;
    let content = fs.readFileSync(f, 'utf8');
    
    // Replace hydrateUI function
    content = content.replace(/function hydrateUI\(\) \{[\s\S]*?\}\s*(?=function hash)/, newHydrateUI + '\n\n');
    
    fs.writeFileSync(f, content, 'utf8');
});