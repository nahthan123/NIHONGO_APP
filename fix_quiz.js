const fs = require('fs');

const jsFiles = ['app.js', 'exercise-1/frontend/app.js', 'exercise-2/frontend/app.js'];

const newQuizLogic = `// Quiz Logic (10-Question Round)
let quizRound = 0;
let quizScore = 0;
let quizTimerInterval;
let quizTimeRemaining = 10;
let currentQuizData = null;

function shuffle(arr){ for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]]; } return arr; }

function buildQuizQuestion(){ 
\tconst correct = FLASHCARDS[Math.floor(Math.random() * FLASHCARDS.length)]; 
\tconst pool = FLASHCARDS.map(f=>f.vi); 
\tconst others = pool.filter(v=>v!==correct.vi); 
\tshuffle(others); 
\tconst options = [correct.vi, ...others.slice(0,3)]; 
\tshuffle(options); 
\tconst correctIndex = options.indexOf(correct.vi); 
\treturn { correct, options, correctIndex }; 
}

function renderQuizQuestion() {
\tif (quizRound > 10) {
\t\tshowQuizResult(quizScore);
\t\treturn;
\t}
\t
\tconst title = document.querySelector('#view-quiz h1');
\tif(title) title.textContent = "Trắc nghiệm: Câu " + quizRound + "/10";
\t
\tcurrentQuizData = buildQuizQuestion();
\tdocument.getElementById("q-jp").textContent = currentQuizData.correct.jp;
\tdocument.getElementById("q-romaji").textContent = currentQuizData.correct.romaji;
\t
\tconst btns = document.querySelectorAll("#q-options .option-btn");
\tbtns.forEach((btn, i) => {
\t\tbtn.textContent = currentQuizData.options[i];
\t\tbtn.className = "btn option-btn";
\t\tbtn.disabled = false;
\t});
\t
\tstartQuizTimer();
}

function startQuizTimer() {
\tclearInterval(quizTimerInterval);
\tquizTimeRemaining = 10;
\tconst bar = document.getElementById("quiz-timer-bar");
\tconst txt = document.getElementById("quiz-timer-text");
\tif (bar) { bar.style.transition = 'none'; bar.style.width = '100%'; bar.style.background = 'var(--primary)'; }
\tif (txt) txt.textContent = "Thời gian còn lại: 10 giây";
\t
\tsetTimeout(() => { if (bar) bar.style.transition = 'width 1s linear'; }, 50);
\t
\tquizTimerInterval = setInterval(() => {
\t\tquizTimeRemaining--;
\t\tif (txt) txt.textContent = "Thời gian còn lại: " + quizTimeRemaining + " giây";
\t\tif (bar) bar.style.width = (quizTimeRemaining * 10) + "%";
\t\tif (quizTimeRemaining <= 3 && bar) bar.style.background = 'var(--danger)';
\t\t
\t\tif (quizTimeRemaining <= 0) {
\t\t\tclearInterval(quizTimerInterval);
\t\t\thandleQuizAnswer(-1); // Time out
\t\t}
\t}, 1000);
}

function handleQuizAnswer(selectedIndex) {
\tclearInterval(quizTimerInterval);
\tconst btns = document.querySelectorAll("#q-options .option-btn");
\tbtns.forEach(btn => btn.disabled = true);
\t
\tif (selectedIndex === currentQuizData.correctIndex) {
\t\tbtns[selectedIndex].classList.add("correct");
\t\tquizScore++;
\t} else {
\t\tif (selectedIndex >= 0) btns[selectedIndex].classList.add("wrong");
\t\tbtns[currentQuizData.correctIndex].classList.add("correct");
\t}
\t
\tsetTimeout(() => {
\t\tquizRound++;
\t\trenderQuizQuestion();
\t}, 1000);
}

function showQuizResult(score) {
\tconst overlay = document.createElement('div');
\toverlay.style.cssText = "position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.8); z-index:9999; display:flex; align-items:center; justify-content:center;";
\tconst box = document.createElement('div');
\tbox.style.cssText = "background:var(--bg); padding:32px; border-radius:16px; text-align:center; max-width:90%; width:320px; box-shadow:0 10px 25px rgba(0,0,0,0.5);";
\t
\tlet msg = score >= 8 ? "Tuyệt vời! 🎉" : score >= 5 ? "Khá lắm! 👍" : "Cố lên nhé! 💪";
\t
\tbox.innerHTML = `
\t\t<h2 style="margin-top:0; font-size:24px;">Kết quả</h2>
\t\t<div style="font-size:48px; margin:16px 0; font-weight:bold; color:var(--primary)">${score}/10</div>
\t\t<p style="margin-bottom:24px; color:var(--muted); font-size:16px;">${msg}</p>
\t\t<button id="btn-quiz-done" style="background:var(--primary); color:white; border:none; padding:12px 24px; border-radius:8px; font-weight:bold; cursor:pointer; width:100%; font-size:16px;">Nhận ${score * 10} Điểm</button>
\t`;
\toverlay.appendChild(box);
\tdocument.body.appendChild(overlay);
\t
\tdocument.getElementById('btn-quiz-done').onclick = () => {
\t\tdocument.body.removeChild(overlay);
\t\tif (score > 0) addPoints(score * 10, "Đúng " + score + "/10 câu trắc nghiệm");
\t\tsetActiveView("home");
\t};
}

function initQuiz() {
\tconst btns = document.querySelectorAll("#q-options .option-btn");
\tbtns.forEach((btn, i) => {
\t\tbtn.addEventListener("click", () => handleQuizAnswer(i));
\t});
\t
\t// Intercept quiz navigation to reset round
\tconst navs = document.querySelectorAll('[data-nav="quiz"]');
\tnavs.forEach(nav => {
\t\tnav.addEventListener("click", () => {
\t\t\tquizRound = 1;
\t\t\tquizScore = 0;
\t\t\trenderQuizQuestion();
\t\t});
\t});
}
`;

jsFiles.forEach(f => {
    if (!fs.existsSync(f)) return;
    let content = fs.readFileSync(f, 'utf8');
    
    // Replace from function shuffle to end of initQuiz
    content = content.replace(/function shuffle\(arr\)[\s\S]*?function initQuiz\(\) \{[\s\S]*?\}\n/, newQuizLogic + '\n');
    
    fs.writeFileSync(f, content, 'utf8');
});