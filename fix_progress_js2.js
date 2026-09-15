const fs = require('fs');

const f = 'exercise-2/frontend/app.js';
if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    
    // Admin: update renderAdmin
    // I need to add tdProgress
    content = content.replace(/const tdRole = document\.createElement\('td'\);/, `const tdProgress = document.createElement('td');
\t\t\t\t\ttdProgress.style.padding = "10px 4px";
\t\t\t\t\ttdProgress.style.fontWeight = "bold";
\t\t\t\t\ttdProgress.style.color = "#10b981";
\t\t\t\t\ttdProgress.textContent = (u.progress || 0) + " từ";
\t\t\t\t\tconst tdRole = document.createElement('td');`);
    content = content.replace(/tr\.appendChild\(tdPoints\);\n\t\t\t\t\ttr\.appendChild\(tdRole\);/, 'tr.appendChild(tdPoints);\n\t\t\t\t\ttr.appendChild(tdProgress);\n\t\t\t\t\ttr.appendChild(tdRole);');
    
    const memLogic = `
function updateFlashcardProgress() {
\tconst bar = document.getElementById('fc-progress-bar');
\tconst txt = document.getElementById('fc-progress-text');
\tconst total = FLASHCARDS.length;
\tlet memorizedCount = 0;
\t
\tif (state.user && state.user.memorizedWords) {
\t\tmemorizedCount = state.user.memorizedWords.length;
\t}
\t
\tif (txt) txt.textContent = memorizedCount + " / " + total + " t\u1eeb";
\tif (bar) bar.style.width = ((memorizedCount / total) * 100) + "%";
}

function toggleMemorized() {
\tif (!state.user) {
\t\talert("Vui lòng đăng nhập để lưu tiến độ!");
\t\treturn;
\t}
\tconst fc = FLASHCARDS[state.fcIdx];
\tconst wordId = fc.jp;
\t
\tconst btnMem = document.getElementById('btn-fc-memorized');
\tif(btnMem) btnMem.textContent = "...";
\t
\tfetch('/api/users/toggle-word', {
\t\tmethod: 'POST',
\t\theaders: { 'Content-Type': 'application/json' },
\t\tbody: JSON.stringify({ email: state.user.email, word: wordId })
\t}).then(res => res.json()).then(data => {
\t\tif (data.success) {
\t\t\tstate.user.memorizedWords = data.memorizedWords;
\t\t\tupdateFlashcardProgress();
\t\t\trenderFlashcard();
\t\t}
\t});
}
`;
    if (!content.includes('function toggleMemorized')) {
        content = content.replace('function renderFlashcard() {', memLogic + '\nfunction renderFlashcard() {');
    }
    
    // Update renderFlashcard
    const btnStateLogic = `
\tconst btnMem = document.getElementById('btn-fc-memorized');
\tif (btnMem) {
\t\tif (state.user && state.user.memorizedWords && state.user.memorizedWords.includes(fc.jp)) {
\t\t\tbtnMem.style.background = "#10b981";
\t\t\tbtnMem.style.color = "white";
\t\t\tbtnMem.textContent = "\u0110\u00e3 thu\u1ed9c \u2714\ufe0f";
\t\t} else {
\t\t\tbtnMem.style.background = "transparent";
\t\t\tbtnMem.style.color = "#10b981";
\t\t\tbtnMem.textContent = "Ch\u01b0a thu\u1ed9c";
\t\t}
\t}
\tupdateFlashcardProgress();
`;
    content = content.replace(/document\.getElementById\("flashcard"\)\.classList\.remove\("is-flipped"\);/, 'document.getElementById("flashcard").classList.remove("is-flipped");\n' + btnStateLogic);
    
    content = content.replace(/nextBtn\.addEventListener\("click", \(\) => \{/, `const memBtn = document.getElementById('btn-fc-memorized');\n\tif(memBtn) memBtn.addEventListener('click', toggleMemorized);\n\n\tnextBtn.addEventListener("click", () => {`);

    fs.writeFileSync(f, content, 'utf8');
}