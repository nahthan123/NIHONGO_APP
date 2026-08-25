// Simple SPA state
const VIEWS = [
	"splash",
	"home",
	"flashcards",
	"sentences",
	"leaderboard",
	"profile",
	"auth",
	"quiz"
];

const STORAGE_KEYS = {
	points: "nihongo_points",
	name: "nihongo_name",
	user: "nihongo_user",
	users: "nihongo_users",
	theme: "nihongo_theme",
	history: "nihongo_history"
};

const state = {
	points: 0,
	level: 1,
	name: "",
	flashIdx: 0,
	sentenceIdx: 0,
	user: null,
	users: [],
	quizIdx: 0,
	quizAnswered: false,
	quizCorrectIndex: null,
	theme: "dark",
	selectedFcTopic: null,
	selectedSnTopic: null,
	history: []
};

// Expanded Topic-based Demo Data
const FLASHCARDS = [
	// Chào hỏi
	{ jp: "こんにちは", romaji: "Konnichiwa", vi: "Xin chào", topic: "greetings" },
	{ jp: "ありがとう", romaji: "Arigatou", vi: "Cảm ơn", topic: "greetings" },
	{ jp: "さようなら", romaji: "Sayounara", vi: "Tạm biệt", topic: "greetings" },
	{ jp: "はじめまして", romaji: "Hajimemashite", vi: "Rất vui được gặp bạn", topic: "greetings" },
	// Ăn uống
	{ jp: "水", romaji: "Mizu", vi: "Nước", topic: "dining" },
	{ jp: "ご飯", romaji: "Gohan", vi: "Cơm", topic: "dining" },
	{ jp: "美味しい", romaji: "Oishii", vi: "Ngon", topic: "dining" },
	{ jp: "お茶", romaji: "Ocha", vi: "Trà", topic: "dining" },
	// Giao thông
	{ jp: "駅", romaji: "Eki", vi: "Nhà ga", topic: "transportation" },
	{ jp: "電車", romaji: "Densha", vi: "Tàu điện", topic: "transportation" },
	{ jp: "切符", romaji: "Kippu", vi: "Vé tàu", topic: "transportation" },
	{ jp: "車", romaji: "Kuruma", vi: "Xe hơi", topic: "transportation" },
	// Mua sắm
	{ jp: "買い物", romaji: "Kaimono", vi: "Mua sắm", topic: "shopping" },
	{ jp: "いくら", romaji: "Ikura", vi: "Bao nhiêu tiền", topic: "shopping" },
	{ jp: "高い", romaji: "Takai", vi: "Đắt / Cao", topic: "shopping" },
	{ jp: "安い", romaji: "Yasui", vi: "Rẻ", topic: "shopping" },
];

const SENTENCES = [
	// Chào hỏi
	{ jp: "おはようございます。", vi: "Chào buổi sáng.", topic: "greetings" },
	{ jp: "お元気ですか？", vi: "Bạn khỏe không?", topic: "greetings" },
	{ jp: "すみません。", vi: "Xin lỗi / Cho tôi hỏi.", topic: "greetings" },
	// Ăn uống
	{ jp: "いただきます。", vi: "Mời mọi người dùng bữa.", topic: "dining" },
	{ jp: "お会計をお願いします。", vi: "Làm ơn tính tiền.", topic: "dining" },
	{ jp: "水をください。", vi: "Cho tôi xin nước.", topic: "dining" },
	// Giao thông
	{ jp: "駅はどこですか？", vi: "Nhà ga ở đâu?", topic: "transportation" },
	{ jp: "切符はどこで買えますか？", vi: "Có thể mua vé ở đâu?", topic: "transportation" },
	{ jp: "東京駅に行きたいです。", vi: "Tôi muốn đi đến ga Tokyo.", topic: "transportation" },
	// Mua sắm
	{ jp: "prefix", vi: "prefix vi", topic: "shopping" },
	{ jp: "prefix2", vi: "prefix 2", topic: "shopping" },
	{ jp: "これはいくらですか？", vi: "Cái này bao nhiêu tiền?", topic: "shopping" },
	{ jp: "これをお願いします。", vi: "Lấy cho tôi cái này.", topic: "shopping" },
	{ jp: "クレジットカード là 使えますか？", vi: "Có dùng được thẻ tín dụng không?", topic: "shopping" },
];
SENTENCES.splice(0, 2);

const TOPIC_NAMES = {
	greetings: "Chào hỏi 👋",
	dining: "Ăn uống 🍣",
	transportation: "Giao thông 🚄",
	shopping: "Mua sắm 🛍️"
};

// Timer variables
let quizTimerInterval = null;
let quizTimeRemaining = 10;

function loadFromStorage() {
	const userRaw = localStorage.getItem(STORAGE_KEYS.user);
	const usersRaw = localStorage.getItem(STORAGE_KEYS.users);
	const themeRaw = localStorage.getItem(STORAGE_KEYS.theme) || "dark";
	const historyRaw = localStorage.getItem(STORAGE_KEYS.history);

	state.user = userRaw ? JSON.parse(userRaw) : null;
	state.users = usersRaw ? JSON.parse(usersRaw) : [];
	state.theme = themeRaw;
	
	if (state.user) {
		state.name = state.user.name;
		state.points = state.user.points || 0;
		state.history = state.user.history || [];
	} else {
		state.name = "";
		state.points = 0;
		state.history = historyRaw ? JSON.parse(historyRaw) : [];
	}
	
	state.level = calcLevel(state.points);

	// Apply theme
	document.documentElement.setAttribute("data-theme", state.theme);
}

function savePoints() { 
	if (state.user) {
		state.user.points = state.points;
		saveUser();
		const idx = state.users.findIndex(u=>u.email===state.user.email);
		if (idx!==-1) {
			state.users[idx].points = state.points;
			saveUsers();
		}
	}
}
function saveName() { }
function saveUser() { state.user ? localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(state.user)) : localStorage.removeItem(STORAGE_KEYS.user); }
function saveUsers() { localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(state.users)); }
function saveTheme() { localStorage.setItem(STORAGE_KEYS.theme, state.theme); }
function saveHistory() { 
	if (state.user) {
		state.user.history = state.history;
		saveUser();
		const idx = state.users.findIndex(u=>u.email===state.user.email);
		if (idx!==-1) {
			state.users[idx].history = state.history;
			saveUsers();
		}
	} else {
		localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(state.history)); 
	}
}

function calcLevel(points) { return Math.max(1, Math.floor(points / 100) + 1); }

function setActiveView(name) {
	// Guard: Nếu chưa đăng nhập thì chỉ được ở splash hoặc auth
	if (name !== 'splash' && name !== 'auth' && !state.user) {
		setActiveView('auth');
		return;
	}

	if (name !== 'quiz') {
		clearInterval(quizTimerInterval);
	}
	
	VIEWS.forEach((v) => {
		const el = document.getElementById(`view-${v}`);
		if (!el) return;
		el.classList.toggle("active", v === name);
	});
	
	// Update bottom navigation active class
	document.querySelectorAll(".bottom-nav .nav-btn").forEach((btn) => {
		const navTarget = btn.getAttribute("data-nav");
		btn.classList.toggle("active", navTarget === name);
	});

	const nav = document.querySelector(".bottom-nav");
	if (nav) nav.style.display = (name === "splash" || name === "auth") ? "none" : "";
	
	// Set specific view states
	if (name === 'flashcards') {
		resetFlashcardView();
	}
	if (name === 'sentences') {
		resetSentenceView();
	}
	if (name === 'quiz') {
		renderQuiz();
	}
	if (name === 'profile') {
		renderProfileHistory();
	}
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
	
	// update avatar text
	const name = state.user?.name || state.name;
	const avatarEl = document.getElementById("pf-avatar");
	if (avatarEl && name) {
		avatarEl.textContent = name.substring(0, 2).toUpperCase();
	}
}

// History logging
function addHistoryEntry(action) {
	const entry = {
		action: action,
		timestamp: new Date().toISOString()
	};
	state.history.unshift(entry); // add to top
	if (state.history.length > 50) {
		state.history.pop(); // keep top 50
	}
	saveHistory();
}

function renderProfileHistory() {
	const container = document.getElementById("pf-history-list");
	if (!container) return;
	if (state.history.length === 0) {
		container.innerHTML = `<div style="text-align:center; color:var(--muted); font-size:13px; padding:16px;">Chưa có hoạt động học tập nào. Hãy bắt đầu học!</div>`;
		return;
	}
	container.innerHTML = "";
	state.history.forEach(item => {
		const div = document.createElement("div");
		div.className = "history-item";
		const time = new Date(item.timestamp);
		const formattedTime = `${time.getDate().toString().padStart(2, '0')}/${(time.getMonth()+1).toString().padStart(2, '0')} ${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;
		div.innerHTML = `
			<span class="history-action">${item.action}</span>
			<span class="history-time">${formattedTime}</span>
		`;
		container.appendChild(div);
	});
}

// Flashcard Logic
function getFilteredFlashcards() {
	if (!state.selectedFcTopic) return FLASHCARDS;
	return FLASHCARDS.filter(f => f.topic === state.selectedFcTopic);
}

function resetFlashcardView() {
	state.selectedFcTopic = null;
	document.getElementById("fc-topic-selector").style.display = "block";
	document.getElementById("fc-study-container").style.display = "none";
	document.getElementById("fc-title").textContent = "Từ vựng";
}

function selectFlashcardTopic(topic) {
	state.selectedFcTopic = topic;
	state.flashIdx = 0;
	document.getElementById("fc-topic-selector").style.display = "none";
	document.getElementById("fc-study-container").style.display = "block";
	document.getElementById("fc-title").textContent = `Từ vựng - ${TOPIC_NAMES[topic]}`;
	renderFlashcard();
}

function renderFlashcard() {
	const list = getFilteredFlashcards();
	if (list.length === 0) return;
	const data = list[state.flashIdx % list.length];
	document.getElementById("fc-jp").textContent = data.jp;
	document.getElementById("fc-romaji").textContent = data.romaji;
	document.getElementById("fc-vi").textContent = data.vi;
	document.getElementById("flashcard").classList.remove("flipped");
}

// Sentence Logic
function getFilteredSentences() {
	if (!state.selectedSnTopic) return SENTENCES;
	return SENTENCES.filter(s => s.topic === state.selectedSnTopic);
}

function resetSentenceView() {
	state.selectedSnTopic = null;
	document.getElementById("sn-topic-selector").style.display = "block";
	document.getElementById("sn-study-container").style.display = "none";
	document.getElementById("sn-title").textContent = "Mẫu câu";
}

function selectSentenceTopic(topic) {
	state.selectedSnTopic = topic;
	state.sentenceIdx = 0;
	document.getElementById("sn-topic-selector").style.display = "none";
	document.getElementById("sn-study-container").style.display = "block";
	document.getElementById("sn-title").textContent = `Mẫu câu - ${TOPIC_NAMES[topic]}`;
	renderSentence();
}

function renderSentence() {
	const list = getFilteredSentences();
	if (list.length === 0) return;
	const data = list[state.sentenceIdx % list.length];
	document.getElementById("sn-jp").textContent = data.jp;
	document.getElementById("sn-vi").textContent = data.vi;
}

function addPoints(amount = 10, activityName = "Học tập") { 
	state.points += amount; 
	savePoints(); 
	updateHeaderStats(); 
	addHistoryEntry(`${activityName} (+${amount} điểm)`);
}

function initNav() {
	document.querySelectorAll("[data-nav]").forEach((btn) => {
		btn.addEventListener("click", () => {
			const target = btn.getAttribute("data-nav");
			if (!target) return; setActiveView(target);
		});
	});
}

function initFlashcards() {
	document.querySelectorAll("#fc-topic-selector .topic-card").forEach((card) => {
		card.addEventListener("click", () => {
			const topic = card.getAttribute("data-fc-topic");
			selectFlashcardTopic(topic);
		});
	});
	
	const card = document.getElementById("flashcard");
	const btnFlip = document.getElementById("btn-fc-flip");
	const btnSpeak = document.getElementById("btn-fc-speak");
	const btnNext = document.getElementById("btn-fc-next");
	const btnBackTopic = document.getElementById("btn-fc-back-topic");
	
	btnFlip.addEventListener("click", () => { card.classList.toggle("flipped"); });
	btnSpeak.addEventListener("click", () => { 
		const list = getFilteredFlashcards();
		const data = list[state.flashIdx % list.length]; 
		speak(data.jp); 
	});
	btnNext.addEventListener("click", () => { 
		const list = getFilteredFlashcards();
		const data = list[state.flashIdx % list.length]; 
		state.flashIdx = (state.flashIdx + 1) % list.length; 
		addPoints(10, `Học từ: ${data.jp}`); 
		renderFlashcard(); 
	});
	btnBackTopic.addEventListener("click", resetFlashcardView);
}

function initSentences() {
	document.querySelectorAll("#sn-topic-selector .topic-card").forEach((card) => {
		card.addEventListener("click", () => {
			const topic = card.getAttribute("data-sn-topic");
			selectSentenceTopic(topic);
		});
	});

	const btnSpeak = document.getElementById("btn-sn-speak");
	const btnNext = document.getElementById("btn-sn-next");
	const btnBackTopic = document.getElementById("btn-sn-back-topic");

	btnSpeak.addEventListener("click", () => { 
		const list = getFilteredSentences();
		const data = list[state.sentenceIdx % list.length]; 
		speak(data.jp); 
	});
	btnNext.addEventListener("click", () => { 
		const list = getFilteredSentences();
		const data = list[state.sentenceIdx % list.length]; 
		state.sentenceIdx = (state.sentenceIdx + 1) % list.length; 
		addPoints(10, `Học câu: ${data.jp}`); 
		renderSentence(); 
	});
	btnBackTopic.addEventListener("click", resetSentenceView);
}

function initProfile() {
	const nameEl = document.getElementById("pf-name");
	const input = document.getElementById("pf-input-name");
	const btn = document.getElementById("pf-save");
	const btnLogout = document.getElementById("pf-logout");
	
	btn.addEventListener("click", () => {
		const newName = input.value?.trim(); if (!newName || !state.user) return;
		state.user.name = newName; 
		saveUser(); 
		nameEl.textContent = state.user.name; 
		// Update auth in users list
		const idx = state.users.findIndex(u=>u.email===state.user.email);
		if (idx!==-1) {
			state.users[idx].name = newName;
			saveUsers();
		}
		state.name = newName;
		updateHeaderStats();
		alert("Cập nhật tên thành công");
	});
	btnLogout?.addEventListener("click", () => { 
		state.user = null; 
		saveUser(); 
		state.name = "";
		state.points = 0;
		state.history = [];
		updateHeaderStats(); 
		alert("Đã đăng xuất"); 
		setActiveView("splash"); 
	});
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
	
	// Splash click handles
	const btnSplashLogin = document.getElementById("btn-splash-login");
	const btnSplashRegister = document.getElementById("btn-splash-register");
	btnSplashLogin?.addEventListener("click", () => {
		tabLogin.click();
		setActiveView("auth");
	});
	btnSplashRegister?.addEventListener("click", () => {
		tabRegister.click();
		setActiveView("auth");
	});

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
		
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!email || !emailRegex.test(email)) {
			if (regErr) { regErr.textContent = "Vui lòng nhập đúng định dạng email (ví dụ: email@domain.com)"; regErr.style.display = "block"; }
			return;
		}
		if (!pass || pass.length < 6) {
			if (regErr) { regErr.textContent = "Mật khẩu phải chứa ít nhất 6 ký tự"; regErr.style.display = "block"; }
			return;
		}
		
		const usersRaw = localStorage.getItem(STORAGE_KEYS.users);
		const list = usersRaw ? JSON.parse(usersRaw) : [];
		if (list.some(u=>u.email===email)) { if (regErr) { regErr.textContent = "Email đã tồn tại"; regErr.style.display = "block"; } return; }
		const newUser = { email, passwordHash: hash(pass), name, role: 'user', points: 0, history: [] };
		list.push(newUser);
		localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(list));
		state.users = list;
		state.user = newUser; 
		saveUser();
		loadFromStorage();
		alert("Đăng ký thành công! Bạn đã đăng nhập."); 
		setActiveView("home"); 
		hydrateUI();
	});
	const loginEmail = document.getElementById("login-email");
	const loginPassword = document.getElementById("login-password");
	const loginBtn = document.getElementById("btn-login");
	const loginErr = document.getElementById("login-error");
	loginBtn?.addEventListener("click", () => {
		if (loginErr) loginErr.style.display = "none";
		const email = loginEmail.value.trim();
		const pass = loginPassword.value;
		
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!email || !emailRegex.test(email)) {
			if (loginErr) { loginErr.textContent = "Vui lòng nhập đúng định dạng email"; loginErr.style.display = "block"; }
			return;
		}
		
		const usersRaw = localStorage.getItem(STORAGE_KEYS.users);
		const list = usersRaw ? JSON.parse(usersRaw) : [];
		const found = list.find(u=>u.email===email && u.passwordHash===hash(pass));
		if (!found) { if (loginErr) { loginErr.textContent = "Email hoặc mật khẩu sai"; loginErr.style.display = "block"; } return; }
		state.user = found; 
		saveUser(); 
		loadFromStorage();
		alert("Đăng nhập thành công"); 
		setActiveView("home"); 
		hydrateUI();
	});
}

// Theme Toggle
function initTheme() {
	const btn = document.getElementById("theme-toggle");
	btn?.addEventListener("click", () => {
		state.theme = state.theme === "dark" ? "light" : "dark";
		saveTheme();
		document.documentElement.setAttribute("data-theme", state.theme);
	});
}

// Quiz with 10s Timer
function shuffle(arr){ for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]]; } return arr; }
function buildQuizQuestion(index){ const correct = FLASHCARDS[index % FLASHCARDS.length]; const pool = FLASHCARDS.map(f=>f.vi); const others = pool.filter(v=>v!==correct.vi); shuffle(others); const options = [correct.vi, ...others.slice(0,3)]; shuffle(options); const correctIndex = options.indexOf(correct.vi); return { correct, options, correctIndex }; }

function startQuizTimer() {
	clearInterval(quizTimerInterval);
	quizTimeRemaining = 10;
	updateQuizTimerUI();
	
	quizTimerInterval = setInterval(() => {
		quizTimeRemaining -= 0.1;
		if (quizTimeRemaining <= 0) {
			quizTimeRemaining = 0;
			clearInterval(quizTimerInterval);
			onQuizTimeout();
		}
		updateQuizTimerUI();
	}, 100);
}

function updateQuizTimerUI() {
	const bar = document.getElementById("quiz-timer-bar");
	const text = document.getElementById("quiz-timer-text");
	if (bar) bar.style.width = `${(quizTimeRemaining / 10) * 100}%`;
	if (text) text.textContent = `Thời gian còn lại: ${Math.ceil(quizTimeRemaining)} giây`;
}

function onQuizTimeout() {
	state.quizAnswered = true;
	const feedback = document.getElementById("q-feedback");
	feedback.textContent = "Hết giờ! Bạn không nhận được điểm.";
	feedback.style.color = "#fca5a5";
	
	// Show correct answer
	const opts = Array.from(document.querySelectorAll("#q-options .opt"));
	opts.forEach((o, i) => {
		if (i === state.quizCorrectIndex) {
			o.classList.add("correct");
		} else {
			o.classList.add("wrong");
		}
	});
	addHistoryEntry("Hết giờ làm trắc nghiệm");
}

function renderQuiz() {
	const qData = buildQuizQuestion(state.quizIdx);
	state.quizCorrectIndex = qData.correctIndex;
	state.quizAnswered = false;
	
	const jpEl = document.getElementById("q-jp");
	const romajiEl = document.getElementById("q-romaji");
	const optsEl = document.getElementById("q-options");
	const feedback = document.getElementById("q-feedback");
	
	jpEl.textContent = qData.correct.jp;
	romajiEl.textContent = qData.correct.romaji;
	optsEl.innerHTML = "";
	feedback.textContent = "Chọn nghĩa đúng";
	feedback.style.color = "var(--muted)";
	
	const keys = ["A","B","C","D"];
	qData.options.forEach((text, i) => {
		const btn = document.createElement("button");
		btn.className = "opt";
		btn.innerHTML = `<span class="key">${keys[i]}</span><span>${text}</span>`;
		btn.addEventListener("click", () => onAnswer(i, btn));
		optsEl.appendChild(btn);
	});
	
	startQuizTimer();
}

function onAnswer(index, btn) {
	if (state.quizAnswered) return;
	state.quizAnswered = true;
	clearInterval(quizTimerInterval);
	
	const opts = Array.from(document.querySelectorAll("#q-options .opt"));
	opts.forEach((o, i) => {
		if (i === state.quizCorrectIndex) {
			o.classList.add("correct");
		}
	});
	
	const qData = buildQuizQuestion(state.quizIdx);
	if (index === state.quizCorrectIndex) {
		btn.classList.add("correct");
		addPoints(10, `Trắc nghiệm: ${qData.correct.jp}`);
		document.getElementById("q-feedback").textContent = "✨ +10 điểm! Chính xác";
		document.getElementById("q-feedback").style.color = "var(--primary)";
	} else {
		btn.classList.add("wrong");
		addHistoryEntry(`Trắc nghiệm sai câu: ${qData.correct.jp}`);
		document.getElementById("q-feedback").textContent = "❌ Chưa đúng rồi!";
		document.getElementById("q-feedback").style.color = "#fca5a5";
	}
}

function initQuiz() {
	const nextBtn = document.getElementById("btn-q-next");
	nextBtn.addEventListener("click", () => {
		state.quizIdx = (state.quizIdx + 1) % FLASHCARDS.length;
		renderQuiz();
	});
}

function boot() {
	loadFromStorage();
	hydrateUI();
	initNav();
	initFlashcards();
	initSentences();
	initProfile();
	initAuth();
	initQuiz();
	initTheme();
	
	if (state.user) {
		setActiveView("home");
	} else {
		setActiveView("splash");
	}
	
	if ('serviceWorker' in navigator) { navigator.serviceWorker.register('./sw.js').catch(() => {}); }
}

document.addEventListener("DOMContentLoaded", boot);
