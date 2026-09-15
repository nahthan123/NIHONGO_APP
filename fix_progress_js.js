const fs = require('fs');

const jsFiles = ['app.js', 'exercise-1/frontend/app.js'];
jsFiles.forEach(f => {
    if (!fs.existsSync(f)) return;
    let content = fs.readFileSync(f, 'utf8');
    
    // Admin: update renderAdmin
    content = content.replace(/let prog = u\.progress.*?;\n/, ''); // remove if exists
    content = content.replace(/const tdRole = document\.createElement\('td'\);/, `const tdProgress = document.createElement('td');
\t\t\t\t\ttdProgress.style.padding = "10px 4px";
\t\t\t\t\ttdProgress.style.fontWeight = "bold";
\t\t\t\t\ttdProgress.style.color = "#10b981";
\t\t\t\t\ttdProgress.textContent = (u.memorizedWords ? u.memorizedWords.length : 0) + " từ";
\t\t\t\t\tconst tdRole = document.createElement('td');`);
    content = content.replace(/tr\.appendChild\(tdPoints\);\n\t\t\t\t\ttr\.appendChild\(tdRole\);/, 'tr.appendChild(tdPoints);\n\t\t\t\t\ttr.appendChild(tdProgress);\n\t\t\t\t\ttr.appendChild(tdRole);');
    
    // Logic for btn-fc-memorized
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
\tconst wordId = fc.jp; // Use JP as unique ID
\t
\tconst raw = localStorage.getItem(STORAGE_KEYS.users);
\tlet list = raw ? JSON.parse(raw) : [];
\tconst userObj = list.find(u => u.email === state.user.email);
\t
\tif (userObj) {
\t\tif (!userObj.memorizedWords) userObj.memorizedWords = [];
\t\tconst idx = userObj.memorizedWords.indexOf(wordId);
\t\tif (idx > -1) {
\t\t\tuserObj.memorizedWords.splice(idx, 1);
\t\t} else {
\t\t\tuserObj.memorizedWords.push(wordId);
\t\t}
\t\tlocalStorage.setItem(STORAGE_KEYS.users, JSON.stringify(list));
\t\tstate.user.memorizedWords = userObj.memorizedWords;
\t\tupdateFlashcardProgress();
\t\trenderFlashcard();
\t}
}
`;
    if (!content.includes('function toggleMemorized')) {
        content = content.replace('function renderFlashcard() {', memLogic + '\nfunction renderFlashcard() {');
    }
    
    // Update renderFlashcard to change button state and call updateFlashcardProgress
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
    
    // Add event listener in initFlashcards
    content = content.replace(/nextBtn\.addEventListener\("click", \(\) => \{/, `const memBtn = document.getElementById('btn-fc-memorized');\n\tif(memBtn) memBtn.addEventListener('click', toggleMemorized);\n\n\tnextBtn.addEventListener("click", () => {`);

    fs.writeFileSync(f, content, 'utf8');
});