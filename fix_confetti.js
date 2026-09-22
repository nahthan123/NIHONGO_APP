const fs = require('fs');

const jsFiles = ['app.js', 'exercise-1/frontend/app.js', 'exercise-2/frontend/app.js'];
jsFiles.forEach(f => {
    if (!fs.existsSync(f)) return;
    let content = fs.readFileSync(f, 'utf8');
    
    const confettiCode = `
\tif (score >= 8) {
\t\tconst script = document.createElement('script');
\t\tscript.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js";
\t\tscript.onload = () => {
\t\t\tconfetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
\t\t};
\t\tdocument.body.appendChild(script);
\t}
`;
    if (!content.includes('canvas-confetti')) {
        content = content.replace(/let msg = score >= 8/, confettiCode + '\n\tlet msg = score >= 8');
        fs.writeFileSync(f, content, 'utf8');
    }
});