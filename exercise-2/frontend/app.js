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
// Simple SPA state
const VIEWS = [
	"splash",
	"home",
	"flashcards",
	"sentences",
	"leaderboard",
	"profile",
	"auth",
	"quiz", "admin"
];

const STORAGE_KEYS = {
	points: "nihongo_points",
	name: "nihongo_name",
	user: "nihongo_user",
	theme: "nihongo_theme"
};

const state = {
	points: 0,
	level: 1,
	name: "",
	flashIdx: 0,
	sentenceIdx: 0,
	user: null,
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
	{ jp: "切符は đâu で買えますか？", vi: "Có thể mua vé ở đâu?", topic: "transportation" }, // Typo fix
	{ jp: "切符はどこで買えますか？", vi: "Có thể mua vé ở đâu?", topic: "transportation" },
	{ jp: "東京駅に行きたいです。", vi: "Tôi muốn đi đến ga Tokyo.", topic: "transportation" },
	// Mua sắm
	{ jp: "これはいくらですか？", vi: "Cái này bao nhiêu tiền?", topic: "shopping" },
	{ jp: "これをお願いします。", vi: "Lấy cho tôi cái này.", topic: "shopping" },
	{ jp: "クレジットカードは使えますか？", vi: "Có dùng được thẻ tín dụng không?", topic: "shopping" },
];
SENTENCES.splice(7, 1); // remove typo item

const TOPIC_NAMES = {
	greetings: "Chào hỏi",
	dining: "Ăn uống",
	transportation: "Giao thông",
	shopping: "Mua sắm"
};

// Timer variables
let quizTimerInterval = null;
let quizTimeRemaining = 10;

function loadFromStorage() {
	seedAdminIfMissing();
	const userRaw = localStorage.getItem(STORAGE_KEYS.user);
	const themeRaw = localStorage.getItem(STORAGE_KEYS.theme) || "dark";

	state.user = userRaw ? JSON.parse(userRaw) : null;
	state.theme = themeRaw;
	
	if (state.user) {
		state.name = state.user.name;
		state.points = state.user.points || 0;
		state.history = state.user.history || [];
	} else {
		state.name = "";
		state.points = 0;
		state.history = [];
	}
	
	state.level = calcLevel(state.points);

	// Apply theme
	document.documentElement.setAttribute("data-theme", state.theme);

	// Sync stats and history with server if logged in
	if (state.user) {
		fetch(`/api/users/me?email=${encodeURIComponent(state.user.email)}`)
			.then(res => res.json())
			.then(data => {
				if (data.success && data.user) {
					state.user = data.user;
					state.points = data.user.points;
					state.level = data.user.level;
					state.history = data.user.history || [];
					saveUser();
					savePoints();
					updateHeaderStats();
					if (document.getElementById("view-profile").classList.contains("active")) {
						renderProfileHistory();
					}
				}
			}).catch(() => {});
	}
}

function savePoints() { 
	if (state.user) {
		state.user.points = state.points;
		saveUser();
	}
}
function saveName() { }
function saveUser() { state.user ? localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(state.user)) : localStorage.removeItem(STORAGE_KEYS.user); }
function saveTheme() { localStorage.setItem(STORAGE_KEYS.theme, state.theme); }

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
	
	// guard admin
	if (name === 'admin') {
		if (!(state.user && state.user.role === 'admin')) {
			alert('Chỉ admin mới truy cập được trang này');
			return;
		}
	}
	
	if(name === 'admin') { if(!state.user || state.user.role !== 'admin') { alert('Chỉ admin!'); return; } renderAdmin(); }
	VIEWS.forEach((v) => {
		const el = document.getElementById(`view-${v}`);
		if (!el) return;
		el.classList.toggle("active", v === name);
	});
	
	document.querySelectorAll(".bottom-nav .nav-btn").forEach((btn) => {
		const navTarget = btn.getAttribute("data-nav");
		btn.classList.toggle("active", navTarget === name);
	});

	const nav = document.querySelector(".bottom-nav");
	if (nav) nav.style.display = (name === "splash" || name === "auth") ? "none" : "";
	
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
	if (name === 'admin') {
		renderAdmin();
	}
	if (name === 'leaderboard') {
		renderLeaderboard();
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
	
	const name = state.user?.name || state.name;
	const avatarEl = document.getElementById("pf-avatar");
	if (avatarEl && name) {
		avatarEl.textContent = name.substring(0, 2).toUpperCase();
	}
}

// History logging (Backend synched)
function addHistoryEntry(action) {
	if (state.user) {
		fetch('/api/users/add-history', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email: state.user.email, action })
		}).then(res => res.json())
		  .then(data => {
			  if (data.success) {
				  state.history = data.history;
				  if (document.getElementById("view-profile").classList.contains("active")) {
					  renderProfileHistory();
				  }
			  }
		  }).catch(() => {});
	}
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


function updateFlashcardProgress() {
	const bar = document.getElementById('fc-progress-bar');
	const txt = document.getElementById('fc-progress-text');
	const total = FLASHCARDS.length;
	let memorizedCount = 0;
	
	if (state.user && state.user.memorizedWords) {
		memorizedCount = state.user.memorizedWords.length;
	}
	
	if (txt) txt.textContent = memorizedCount + " / " + total + " từ";
	if (bar) bar.style.width = ((memorizedCount / total) * 100) + "%";
}

function toggleMemorized() {
	if (!state.user) {
		alert("Vui lòng đăng nhập để lưu tiến độ!");
		return;
	}
	const fc = FLASHCARDS[state.fcIdx];
	const wordId = fc.jp;
	
	const btnMem = document.getElementById('btn-fc-memorized');
	if(btnMem) btnMem.textContent = "...";
	
	fetch('/api/users/toggle-word', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email: state.user.email, word: wordId })
	}).then(res => res.json()).then(data => {
		if (data.success) {
			state.user.memorizedWords = data.memorizedWords;
			updateFlashcardProgress();
			renderFlashcard();
		}
	});
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
	
	if (state.user) {
		fetch('/api/users/update-points', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email: state.user.email, points: state.points })
		}).then(res => res.json())
		  .then(data => {
			  if (data.success) {
				  state.user.points = data.points;
				  state.user.level = data.level;
				  state.points = data.points;
				  state.level = data.level;
				  saveUser();
				  savePoints();
				  updateHeaderStats();
			  }
		  }).catch(() => {});
	}
	
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
		fetch('/api/users/update-name', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email: state.user.email, name: newName })
		}).then(res => res.json())
		  .then(data => {
			  if (data.success) {
				  state.user.name = newName;
				  saveUser();
				  nameEl.textContent = state.user.name;
				  updateHeaderStats();
				  alert("Cập nhật tên thành công");
			  }
		  }).catch(() => {});
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
	if (state.user && state.user.name) { 
		if(pfName) pfName.textContent = state.user.name; 
		if (input) input.value = state.user.name; 
	} else { 
		if(pfName) pfName.textContent = state.name; 
		if (input) input.value = state.name; 
	}

	// Toggle Auth buttons
	const authCards = document.querySelectorAll('[data-nav="auth"]');
	authCards.forEach(el => {
		el.style.display = state.user ? 'none' : '';
	});

	// Toggle Admin button
	const adminCards = document.querySelectorAll('[data-nav="admin"]');
	adminCards.forEach(el => {
		el.style.display = (state.user && state.user.role === 'admin') ? '' : 'none';
	});
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
		
		fetch('/api/auth/register', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password: pass, name, points: state.points })
		}).then(res => res.json())
		  .then(data => {
			  if (!data.success) {
				  if (regErr) { regErr.textContent = data.message || "Đăng ký thất bại"; regErr.style.display = "block"; }
				  return;
			  }
			  state.user = data.user;
			  state.points = data.user.points;
			  state.level = data.user.level;
			  state.history = data.user.history || [];
			  saveUser();
			  loadFromStorage();
			  alert("Đăng ký thành công! Bạn đã đăng nhập."); 
			  setActiveView("home"); 
			  hydrateUI();
		  }).catch(() => {
			  if (regErr) { regErr.textContent = "Lỗi kết nối đến máy chủ"; regErr.style.display = "block"; }
		  });
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
		
		fetch('/api/auth/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password: pass })
		}).then(res => res.json())
		  .then(data => {
			  if (!data.success) {
				  if (loginErr) { loginErr.textContent = data.message || "Email hoặc mật khẩu sai"; loginErr.style.display = "block"; }
				  return;
			  }
			  state.user = data.user;
			  state.points = data.user.points;
			  state.level = data.user.level;
			  state.history = data.user.history || [];
			  saveUser();
			  loadFromStorage();
			  alert("Đăng nhập thành công"); 
			  setActiveView("home"); 
			  hydrateUI();
		  }).catch(() => {
			  if (loginErr) { loginErr.textContent = "Lỗi kết nối đến máy chủ"; loginErr.style.display = "block"; }
		  });
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

// Admin
function renderAdmin(){
	fetch('/api/admin/users')
		.then(res => res.json())
		.then(list => {
			const totalEl = document.getElementById('admin-total');
			const adminCountEl = document.getElementById('admin-count');
			const adminPointsEl = document.getElementById('admin-points');
			const tbodyEl = document.getElementById('admin-users-tbody');
			if(totalEl) totalEl.textContent = String(list.length);
			if(adminCountEl) adminCountEl.textContent = String(list.filter(u=>u.role==='admin').length);
			if(adminPointsEl) adminPointsEl.textContent = String(list.reduce((sum, u)=>sum + (u.points||0), 0));
			if (tbodyEl) {
				tbodyEl.innerHTML = '';
				const searchEl = document.getElementById('admin-search');
				let filteredList = list;
				if (searchEl && searchEl.value) {
					const term = searchEl.value.toLowerCase();
					filteredList = list.filter(u => (u.name && u.name.toLowerCase().includes(term)) || (u.email && u.email.toLowerCase().includes(term)));
				}
				filteredList.forEach(u => {
					const tr = document.createElement('tr');
					tr.style.borderBottom = "1px solid var(--border)";
					const tdName = document.createElement('td');
					tdName.style.padding = "10px 4px";
					tdName.textContent = u.name || "N/A";
					const tdEmail = document.createElement('td');
					tdEmail.style.padding = "10px 4px";
					tdEmail.textContent = u.email;
					const tdPoints = document.createElement('td');
					tdPoints.style.padding = "10px 4px";
					let pts = u.points || 0;
					let lvl = Math.max(1, Math.floor(pts / 100) + 1);
					tdPoints.textContent = pts + " (Lv" + lvl + ")";
					const tdProgress = document.createElement('td');
					tdProgress.style.padding = "10px 4px";
					tdProgress.style.fontWeight = "bold";
					tdProgress.style.color = "#10b981";
					tdProgress.textContent = (u.progress || 0) + " từ";
					const tdRole = document.createElement('td');
					tdRole.style.padding = "10px 4px";
					tdRole.innerHTML = u.role === 'admin' ? '<span style="color:#fbbf24;font-weight:bold;">Admin</span>' : 'User';
					const tdAction = document.createElement('td');
					tdAction.style.padding = "10px 4px";
					tdAction.style.display = "flex";
					tdAction.style.gap = "6px";
					tdAction.style.flexWrap = "wrap";
tdAction.style.display = "flex";
tdAction.style.gap = "6px";
tdAction.style.flexWrap = "wrap";
					
					if (u.role !== 'admin' || u.email !== state.user.email) {
						const btnHistory = document.createElement('button');
						btnHistory.innerHTML = 'Lịch sử';
						btnHistory.style.cssText = "padding:4px 8px; font-size:12px; background:var(--bg); border:1px solid #10b981; color:#10b981; border:none; color:white; border-radius:4px; cursor:pointer; ";
						btnHistory.onclick = () => viewUserHistory(u.email);
						tdAction.appendChild(btnHistory);
						
						
					}
					if (u.role !== 'admin') {
						const btnEdit = document.createElement('button');
						btnEdit.innerHTML = 'Sửa Điểm';
						btnEdit.style.cssText = "padding:4px 8px; font-size:12px; background:var(--bg); border:1px solid #3b82f6; color:#3b82f6; border:none; color:white; border-radius:4px; cursor:pointer; ";
						btnEdit.onclick = () => editUserPoints(u.email);
						tdAction.appendChild(btnEdit);
						
						const btnDel = document.createElement('button');
						btnDel.innerHTML = 'Xóa';
						btnDel.style.cssText = "padding:4px 8px; font-size:12px; background:var(--bg); border:1px solid #ef4444; color:#ef4444; border:none; color:white; border-radius:4px; cursor:pointer;";
						btnDel.onclick = () => deleteUser(u.email);
						tdAction.appendChild(btnDel);
					}
					tr.appendChild(tdName);
					tr.appendChild(tdEmail);
					tr.appendChild(tdPoints);
					tr.appendChild(tdRole);
					tr.appendChild(tdAction);
					tbodyEl.appendChild(tr);
				});
			}
		})
		.catch(err => console.error("Admin fetch error:", err));
	
	const searchInput = document.getElementById('admin-search');
	if(searchInput) {
		searchInput.removeEventListener('input', renderAdmin);
		searchInput.addEventListener('input', renderAdmin);
	}
	const btn = document.getElementById('admin-refresh');
	btn?.removeEventListener('click', renderAdmin);
	btn?.addEventListener('click', renderAdmin);
}

function editUserPoints(email) {
	const newPoints = prompt("Sửa điểm cho tài khoản " + email + ":\nNhập số điểm mới:", 0);
	if (newPoints !== null && !isNaN(newPoints) && newPoints.trim() !== '') {
		fetch('/api/users/update-points', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, points: Number(newPoints) })
		}).then(() => {
			alert('Cập nhật điểm thành công!');
			renderAdmin();
		});
	}
}
function deleteUser(email) {
	if (!confirm('Bạn có chắc muốn xóa người dùng ' + email + '?')) return;
	const raw = localStorage.getItem(STORAGE_KEYS.users);
	let list = raw ? JSON.parse(raw) : [];
	list = list.filter(u => u.email !== email);
	localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(list));
	state.users = list;
	alert('Đã xóa người dùng!');
	renderAdmin();
}


function toggleUserRole(email) {
	if (email === state.user.email) {
		alert("Không thể tự thay đổi quyền của chính mình!");
		return;
	}
	fetch('/api/admin/toggle-role', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email })
	}).then(res => res.json()).then(data => {
		if(data.success) {
			alert('Đã thay đổi quyền thành: ' + data.role);
			renderAdmin();
		}
	});
}
function viewUserHistory(email) {
	fetch('/api/admin/user-history?email=' + encodeURIComponent(email))
		.then(res => res.json())
		.then(data => {
			if(data.success && data.history.length > 0) {
				const histStr = data.history.slice(0, 10).map(h => "- " + h.action + " (" + new Date(h.timestamp).toLocaleString() + ")").join("\n");
				alert("Lịch sử hoạt động của " + email + ":\n\n" + histStr);
			} else {
				alert("Người dùng này chưa có hoạt động nào.");
			}
		});
}