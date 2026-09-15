const fs = require('fs');
const jsFiles = ['app.js', 'exercise-1/frontend/app.js', 'exercise-2/frontend/app.js'];

jsFiles.forEach(f => {
    if (!fs.existsSync(f)) return;
    let content = fs.readFileSync(f, 'utf8');
    
    // Remove the duplicates I just added
    content = content.replace(/let quizTimerInterval;\nlet quizTimeRemaining = 10;\n/, '');
    
    // In case they were already declared as var or something, let's just make sure we remove MY specific lines.
    fs.writeFileSync(f, content, 'utf8');
});