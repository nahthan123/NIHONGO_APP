// Simple SPA state
const VIEWS = [
	"splash",
	"home",
	"flashcards",
	"sentences",
	"leaderboard",
	"profile",
	"auth",
	"quiz",
	"admin",
];

const STORAGE_KEYS = {
	points: "nihongo_points",
	name: "nihongo_name",
	user: "nihongo_user",
	users: "nihongo_users", // list of all users
};

const state = {
	points: 0,
	level: 1,
	name: "Người học NihonGo",
	flashIdx: 0,
	sentenceIdx: 0,
	user: null,
	quizIdx: 0,
	quizAnswered: false,
	quizCorrectIndex: null,
	users: [],
};

// Demo data
const FLASHCARDS = [
	{ jp: "こんにちは", romaji: "Konnichiwa", vi: "Xin chào" },
	{ jp: "ありがとう", romaji: "Arigatou", vi: "Cảm ơn" },
	{ jp: "さようなら", romaji: "Sayounara", vi: "Tạm biệt" },
	{ jp: "水", romaji: "Mizu", vi: "Nước" },
	{ jp: "日本", romaji: "Nihon", vi: "Nhật Bản" },
];

const SENTENCES = [
	{ jp: "おはようございます。", vi: "Chào buổi sáng." },
	{ jp: "お元気ですか？", vi: "Bạn khỏe không?" },
	{ jp: "お願いします。", vi: "Làm ơn." },
	{ jp: "大丈夫です。", vi: "Không sao đâu." },
];

function seedAdminIfMissing() {
	const raw = localStorage.getItem(STORAGE_KEYS.users);
	let list = raw ? JSON.parse(raw) : [];
	const exists = list.some(u => u.role === 'admin');
	if (!exists) {
		list.push({ email: 'admin@nihongo.local', name: 'Administrator', passwordHash: hash('admin123'), role: 'admin', points: 0, history: [] });
	}
	if (!list.some(u => u.email === 'student1@gmail.com')) {
		list.push({ email: 'student1@gmail.com', name: 'Nguyễn Văn A', passwordHash: hash('123456'), role: 'user', points: 150, history: [] });
		list.push({ email: 'student2@gmail.com', name: 'Trần Thị B', passwordHash: hash('123456'), role: 'user', points: 420, history: [] });
		list.push({ email: 'testuser@yahoo.com', name: 'Học sinh Test', passwordHash: hash('123456'), role: 'user', points: 30, history: [] });
	}
	localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(list));
}

function loadFromStorage() {
	seedAdminIfMissing();
	const p = Number(localStorage.getItem(STORAGE_KEYS.points) || 0);
	const n = localStorage.getItem(STORAGE_KEYS.name) || state.name;
	const userRaw = localStorage.getItem(STORAGE_KEYS.user);
	const usersRaw = localStorage.getItem(STORAGE_KEYS.users);
	state.points = isNaN(p) ? 0 : p;
	state.name = n;
	state.user = userRaw ? JSON.parse(userRaw) : null;
	state.users = usersRaw ? JSON.parse(usersRaw) : [];
	state.level = calcLevel(state.points);
}

function savePoints() { localStorage.setItem(STORAGE_KEYS.points, String(state.points)); }
function saveName() { localStorage.setItem(STORAGE_KEYS.name, state.name); }
function saveUser() { state.user ? localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(state.user)) : localStorage.removeItem(STORAGE_KEYS.user); }
function saveUsers() { localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(state.users)); }

function calcLevel(points) { return Math.max(1, Math.floor(points / 100) + 1); }

function setActiveView(name) {
	// guard admin
	if (name === 'admin') {
		if (!(state.user && state.user.role === 'admin')) {
			alert('Chỉ admin mới truy cập được trang này');
			return;
		}
	}
	VIEWS.forEach((v) => {
		const el = document.getElementById(`view-${v}`);
		if (!el) return;
		el.classList.toggle("active", v === name);
	});
	const nav = document.querySelector(".bottom-nav");
	if (nav) nav.style.display = name === "splash" ? "none" : "grid";
	if (name === 'admin') renderAdmin();
}

function speak(text, lang = "ja-JP") {
	if (!("speechSynthesis" in window)) return;
	const utter = new SpeechSynthesisUtterance(text);
	utter.lang = lang;
	window.speechSynthesis.cancel();
	window.speechSynthesis.speak(utter);
}

function updateHeaderStats() {
	const pointsEls = [document.getElementById("points"), document.getElementById("lb-points"), document.getElementById("pf-points")];
	pointsEls.forEach((el) => el && (el.textContent = String(state.points)));
	state.level = calcLevel(state.points);
	const levelEls = [document.getElementById("level"), document.getElementById("lb-level"), document.getElementById("pf-level")];
	levelEls.forEach((el) => el && (el.textContent = String(state.level)));
}

function renderFlashcard() {
	const data = FLASHCARDS[state.flashIdx % FLASHCARDS.length];
	document.getElementById("fc-jp").textContent = data.jp;
	document.getElementById("fc-romaji").textContent = data.romaji;
	document.getElementById("fc-vi").textContent = data.vi;
	document.getElementById("flashcard").classList.remove("flipped");
}

function renderSentence() {
	const data = SENTENCES[state.sentenceIdx % SENTENCES.length];
	document.getElementById("sn-jp").textContent = data.jp;
	document.getElementById("sn-vi").textContent = data.vi;
}

function addPoints(amount = 10) { state.points += amount; savePoints(); updateHeaderStats(); }

function initNav() {
	const btnStart = document.getElementById("btn-start");
	btnStart?.addEventListener("click", () => { setActiveView("home"); });
	document.querySelectorAll("[data-nav]").forEach((btn) => {
		btn.addEventListener("click", () => {
			const target = btn.getAttribute("data-nav");
			if (!target) return; setActiveView(target);
		});
	});
}

function initFlashcards() {
	const card = document.getElementById("flashcard");
	const btnFlip = document.getElementById("btn-fc-flip");
	const btnSpeak = document.getElementById("btn-fc-speak");
	const btnNext = document.getElementById("btn-fc-next");
	btnFlip.addEventListener("click", () => { card.classList.toggle("flipped"); });
	btnSpeak.addEventListener("click", () => { const data = FLASHCARDS[state.flashIdx % FLASHCARDS.length]; speak(data.jp); });
	btnNext.addEventListener("click", () => { state.flashIdx = (state.flashIdx + 1) % FLASHCARDS.length; addPoints(10); renderFlashcard(); });
	renderFlashcard();
}

function initSentences() {
	const btnSpeak = document.getElementById("btn-sn-speak");
	const btnNext = document.getElementById("btn-sn-next");
	btnSpeak.addEventListener("click", () => { const data = SENTENCES[state.sentenceIdx % SENTENCES.length]; speak(data.jp); });
	btnNext.addEventListener("click", () => { state.sentenceIdx = (state.sentenceIdx + 1) % SENTENCES.length; addPoints(10); renderSentence(); });
	renderSentence();
}

function initProfile() {
	const nameEl = document.getElementById("pf-name");
	const input = document.getElementById("pf-input-name");
	const btn = document.getElementById("pf-save");
	const btnLogout = document.getElementById("pf-logout");
	nameEl.textContent = state.user?.name || state.name;
	input.value = state.user?.name || state.name;
	btn.addEventListener("click", () => {
		const newName = input.value?.trim(); if (!newName) return;
		if (state.user) { state.user.name = newName; saveUser(); nameEl.textContent = state.user.name; }
		else { state.name = newName; saveName(); nameEl.textContent = state.name; }
	});
	btnLogout?.addEventListener("click", () => { state.user = null; saveUser(); nameEl.textContent = state.name; input.value = state.name; alert("Đã đăng xuất"); });
}

function hydrateUI() {
	updateHeaderStats();
	const pfName = document.getElementById("pf-name");
	const input = document.getElementById("pf-input-name");
	if (state.user?.name) { pfName.textContent = state.user.name; if (input) input.value = state.user.name; }
	else { pfName.textContent = state.name; if (input) input.value = state.name; }
}

function hash(str) { let h = 0; for (let i = 0; i < str.length; i++) { h = (h << 5) - h + str.charCodeAt(i); h |= 0; } return String(h); }

function initAuth() {
	const tabLogin = document.getElementById("tab-login");
	const tabRegister = document.getElementById("tab-register");
	const loginBox = document.getElementById("auth-login");
	const regBox = document.getElementById("auth-register");
	tabLogin?.addEventListener("click", () => { if (loginBox) loginBox.style.display = "block"; if (regBox) regBox.style.display = "none"; tabLogin.classList.add("primary"); tabRegister.classList.remove("primary"); });
	tabRegister?.addEventListener("click", () => { if (loginBox) loginBox.style.display = "none"; if (regBox) regBox.style.display = "block"; tabRegister.classList.add("primary"); tabLogin.classList.remove("primary"); });
	const regEmail = document.getElementById("reg-email");
	const regPassword = document.getElementById("reg-password");
	const regName = document.getElementById("reg-name");
	const regBtn = document.getElementById("btn-register");
	const regErr = document.getElementById("reg-error");
	regBtn?.addEventListener("click", () => {
		if (regErr) regErr.style.display = "none";
		const email = regEmail.value.trim();
		const pass = regPassword.value;
		const name = regName.value.trim() || "Người học NihonGo";
		if (!email || !pass || pass.length < 6) { if (regErr) { regErr.textContent = "Vui lòng nhập email hợp lệ và mật khẩu ≥ 6 ký tự"; regErr.style.display = "block"; } return; }
		const usersRaw = localStorage.getItem(STORAGE_KEYS.users);
		const list = usersRaw ? JSON.parse(usersRaw) : [];
		if (list.some(u=>u.email===email)) { if (regErr) { regErr.textContent = "Email đã tồn tại"; regErr.style.display = "block"; } return; }
		const newUser = { email, passwordHash: hash(pass), name, role: 'user' };
		list.push(newUser);
		localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(list));
		state.users = list;
		state.user = newUser; saveUser();
		alert("Đăng ký thành công! Bạn đã đăng nhập."); setActiveView("home"); hydrateUI();
	});
	const loginEmail = document.getElementById("login-email");
	const loginPassword = document.getElementById("login-password");
	const loginBtn = document.getElementById("btn-login");
	const loginErr = document.getElementById("login-error");
	loginBtn?.addEventListener("click", () => {
		if (loginErr) loginErr.style.display = "none";
		const email = loginEmail.value.trim();
		const pass = loginPassword.value;
		const usersRaw = localStorage.getItem(STORAGE_KEYS.users);
		const list = usersRaw ? JSON.parse(usersRaw) : [];
		const found = list.find(u=>u.email===email && u.passwordHash===hash(pass));
		if (!found) { if (loginErr) { loginErr.textContent = "Email hoặc mật khẩu sai"; loginErr.style.display = "block"; } return; }
		state.user = found; saveUser(); alert("Đăng nhập thành công"); setActiveView("home"); hydrateUI();
	});
}

// Admin
function renderAdmin(){
	const totalEl = document.getElementById('admin-total');
	const tbodyEl = document.getElementById('admin-users-tbody');
	const raw = localStorage.getItem(STORAGE_KEYS.users);
	const list = raw ? JSON.parse(raw) : [];
	if(totalEl) totalEl.textContent = String(list.length);
	
	if (tbodyEl) {
		tbodyEl.innerHTML = '';
		list.forEach(u => {
			const tr = document.createElement('tr');
			tr.style.borderBottom = "1px solid #334155";
			
			const tdName = document.createElement('td');
			tdName.style.padding = "8px 4px";
			tdName.textContent = u.name || "N/A";
			
			const tdEmail = document.createElement('td');
			tdEmail.style.padding = "8px 4px";
			tdEmail.textContent = u.email;
			
			const tdRole = document.createElement('td');
			tdRole.style.padding = "8px 4px";
			tdRole.textContent = u.role === 'admin' ? 'Admin' : 'User';
			
			const tdAction = document.createElement('td');
			tdAction.style.padding = "8px 4px";
			if (u.role !== 'admin') {
				const btnDel = document.createElement('button');
				btnDel.textContent = "Xóa";
				btnDel.style.padding = "4px 8px";
				btnDel.style.fontSize = "12px";
				btnDel.style.background = "#ef4444";
				btnDel.style.border = "none";
				btnDel.style.color = "white";
				btnDel.style.borderRadius = "4px";
				btnDel.style.cursor = "pointer";
				btnDel.onclick = () => deleteUser(u.email);
				tdAction.appendChild(btnDel);
			}
			
			tr.appendChild(tdName);
			tr.appendChild(tdEmail);
			tr.appendChild(tdRole);
			tr.appendChild(tdAction);
			tbodyEl.appendChild(tr);
		});
	}
	const btn = document.getElementById('admin-refresh');
	btn?.removeEventListener('click', renderAdmin);
	btn?.addEventListener('click', renderAdmin);
}

function deleteUser(email) {
	if (!confirm(`Bạn có chắc muốn xóa người dùng ${email}?`)) return;
	const raw = localStorage.getItem(STORAGE_KEYS.users);
	let list = raw ? JSON.parse(raw) : [];
	list = list.filter(u => u.email !== email);
	localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(list));
	state.users = list;
	alert("Đã xóa người dùng!");
	renderAdmin();
}

// Quiz
function shuffle(arr){ for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]]; } return arr; }
function buildQuizQuestion(index){ const correct = FLASHCARDS[index % FLASHCARDS.length]; const pool = FLASHCARDS.map(f=>f.vi); const others = pool.filter(v=>v!==correct.vi); shuffle(others); const options = [correct.vi, ...others.slice(0,3)]; shuffle(options); const correctIndex = options.indexOf(correct.vi); return { correct, options, correctIndex }; }
function renderQuiz(){ const qData = buildQuizQuestion(state.quizIdx); state.quizCorrectIndex = qData.correctIndex; state.quizAnswered = false; const jpEl = document.getElementById("q-jp"); const romajiEl = document.getElementById("q-romaji"); const optsEl = document.getElementById("q-options"); const feedback = document.getElementById("q-feedback"); jpEl.textContent = qData.correct.jp; romajiEl.textContent = qData.correct.romaji; optsEl.innerHTML = ""; feedback.textContent = "Chọn nghĩa đúng"; const keys = ["A","B","C","D"]; qData.options.forEach((text, i)=>{ const btn = document.createElement("button"); btn.className = "opt"; btn.innerHTML = `<span class="key">${keys[i]}</span><span>${text}</span>`; btn.addEventListener("click", ()=>onAnswer(i, btn)); optsEl.appendChild(btn); }); }
function onAnswer(index, btn){ if(state.quizAnswered) return; state.quizAnswered = true; const opts = Array.from(document.querySelectorAll("#q-options .opt")); opts.forEach((o, i)=>{ if(i === state.quizCorrectIndex){ o.classList.add("correct"); } }); if(index === state.quizCorrectIndex){ btn.classList.add("correct"); addPoints(10); document.getElementById("q-feedback").textContent = "+10 điểm! Chính xác"; }else{ btn.classList.add("wrong"); document.getElementById("q-feedback").textContent = "Chưa đúng, thử câu khác"; } }
function initQuiz(){ const nextBtn = document.getElementById("btn-q-next"); nextBtn.addEventListener("click", ()=>{ state.quizIdx = (state.quizIdx + 1) % FLASHCARDS.length; renderQuiz(); }); renderQuiz(); }

function boot() {
	loadFromStorage();
	hydrateUI();
	initNav();
	initFlashcards();
	initSentences();
	initProfile();
	initAuth();
	initQuiz();
	setActiveView("splash");
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register('./sw.js').then(reg => {
			reg.addEventListener('updatefound', () => {
				const newWorker = reg.installing;
				newWorker.addEventListener('statechange', () => {
					if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
						window.location.reload(true);
					}
				});
			});
		}).catch(() => {});
	}
}

document.addEventListener("DOMContentLoaded", boot);


