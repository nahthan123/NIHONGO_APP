const fs = require('fs');
const f = 'exercise-2/frontend/app.js';
let content = fs.readFileSync(f, 'utf8');

const bootCode = `
function boot() {
\tloadFromStorage();
\thydrateUI();
\tinitNav();
\tinitFlashcards();
\tinitSentences();
\tinitProfile();
\tinitAuth();
\tinitQuiz();
\t
\tif (state.user) {
\t\tsetActiveView("home");
\t} else {
\t\tsetActiveView("splash");
\t}
\t
\tif ('serviceWorker' in navigator) {
\t\tnavigator.serviceWorker.register('./sw.js').then(reg => {
\t\t\treg.addEventListener('updatefound', () => {
\t\t\t\tconst newWorker = reg.installing;
\t\t\t\tnewWorker.addEventListener('statechange', () => {
\t\t\t\t\tif (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
\t\t\t\t\t\twindow.location.reload(true);
\t\t\t\t\t}
\t\t\t\t});
\t\t\t});
\t\t}).catch(() => {});
\t}
}

document.addEventListener("DOMContentLoaded", boot);
`;

if (!content.includes('function boot()')) {
    content += '\n' + bootCode;
    fs.writeFileSync(f, content, 'utf8');
}