// Seed handled centrally by backend API
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
	// seedAdminIfMissing handled by server
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


function saveHistory() {
	if (state.user) {
		state.user.history = state.history;
		saveUser();
	}
}

function calcLevel(points) { return Math.max(1, Math.floor(points / 100) + 1); }

function speak(text, lang = "ja-JP") {
	if (!("speechSynthesis" in window)) return;
	const utter = new SpeechSynthesisUtterance(text);
	utter.lang = lang;
	window.speechSynthesis.cancel();
	window.speechSynthesis.speak(utter);
}

function updateHeaderStats() {
	const pointsEls = [
		document.getElementById("points"),
		document.getElementById("lb-points"),
		document.getElementById("pf-points"),
		document.getElementById("hero-pts")
	];
	pointsEls.forEach((el) => el && (el.textContent = String(state.points)));

	state.level = calcLevel(state.points);
	const levelEls = [
		document.getElementById("level"),
		document.getElementById("lb-level"),
		document.getElementById("pf-level"),
		document.getElementById("hero-lvl")
	];
	levelEls.forEach((el) => el && (el.textContent = el.id === "hero-lvl" ? `Lv ${state.level}` : String(state.level)));
	
	// update name across UI
	const displayName = state.user && state.user.name ? state.user.name : (state.name || "Người học");
	const heroNameEl = document.getElementById("hero-user-name");
	if (heroNameEl) heroNameEl.textContent = displayName;

	// update avatar text
	const avatarEl = document.getElementById("pf-avatar");
	if (avatarEl && displayName) {
		avatarEl.textContent = displayName.substring(0, 2).toUpperCase();
	}

	// update hero memorized count
	const heroMemEl = document.getElementById("hero-memorized");
	if (heroMemEl) {
		const total = FLASHCARDS.length;
		const memorizedCount = (state.user && state.user.memorizedWords) ? state.user.memorizedWords.length : 0;
		heroMemEl.textContent = `${memorizedCount}/${total}`;
	}
}

function addHistoryEntry(action) {
	const entry = {
		action: action,
		timestamp: new Date().toISOString()
	};
	state.history.unshift(entry);
	if (state.history.length > 50) {
		state.history.pop();
	}
	if (state.user) {
		state.user.history = state.history;
		saveUser();
		fetch("/api/users/add-history", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email: state.user.email, action })
		}).catch(() => {});
	}
}

function renderProfileHistory() {
	const container = document.getElementById("pf-history-list");
	if (!container) return;
	if (state.history.length === 0) {
		container.innerHTML = '<div style="text-align:center; color:var(--muted); font-size:13px; padding:16px;">Chưa có hoạt động học tập nào. Hãy bắt đầu học!</div>';
		return;
	}
	container.innerHTML = "";
	state.history.forEach(item => {
		const div = document.createElement("div");
		div.className = "history-item";
		const time = new Date(item.timestamp);
		const formattedTime = String(time.getDate()).padStart(2, "0") + "/" + String(time.getMonth() + 1).padStart(2, "0") + " " + String(time.getHours()).padStart(2, "0") + ":" + String(time.getMinutes()).padStart(2, "0");
		div.innerHTML = '<span class="history-action">' + item.action + '</span><span class="history-time" style="font-size:11px; color:var(--muted); margin-left:8px;">' + formattedTime + '</span>';
		container.appendChild(div);
	});
}


// Flashcard Topic Logic
function getFilteredFlashcards() {
	if (!state.selectedFcTopic) return FLASHCARDS;
	return FLASHCARDS.filter(f => f.topic === state.selectedFcTopic);
}

function resetFlashcardView() {
	state.selectedFcTopic = null;
	const sel = document.getElementById("fc-topic-selector");
	const study = document.getElementById("fc-study-container");
	const title = document.getElementById("fc-title");
	if (sel) sel.style.display = "block";
	if (study) study.style.display = "none";
	if (title) title.textContent = "Từ vựng";
}

function selectFlashcardTopic(topic) {
	state.selectedFcTopic = topic;
	state.flashIdx = 0;
	const sel = document.getElementById("fc-topic-selector");
	const study = document.getElementById("fc-study-container");
	const title = document.getElementById("fc-title");
	if (sel) sel.style.display = "none";
	if (study) study.style.display = "block";
	if (title) title.textContent = "Từ vựng - " + (TOPIC_NAMES[topic] || topic);
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
	const list = getFilteredFlashcards();
	if (list.length === 0) return;
	const fc = list[state.flashIdx % list.length];
	const wordId = fc.jp;
	
	const btnMem = document.getElementById('btn-fc-memorized');
	if (btnMem) btnMem.textContent = "...";
	
	fetch('/api/users/toggle-word', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email: state.user.email, word: wordId })
	}).then(res => res.json()).then(data => {
		if (data.success) {
			state.user.memorizedWords = data.memorizedWords;
			saveUser();
			updateFlashcardProgress();
			renderFlashcard();
		}
	}).catch(err => {
		console.error("toggle-word error:", err);
		renderFlashcard();
	});
}

function setActiveView(name) {
	// Guard: Nếu chưa đăng nhập thì chỉ được ở splash hoặc auth
	if (name !== 'splash' && name !== 'auth' && !state.user) {
		name = 'auth';
	}

	if (name !== 'quiz') {
		clearInterval(quizTimerInterval);
	}
	
	// Direct to dedicated Admin Panel
	if (name === 'admin') {
		window.location.href = 'admin.html';
		return;
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

function renderFlashcard() {
	const list = getFilteredFlashcards();
	if (list.length === 0) return;
	const data = list[state.flashIdx % list.length];
	document.getElementById("fc-jp").textContent = data.jp;
	document.getElementById("fc-romaji").textContent = data.romaji;
	document.getElementById("fc-vi").textContent = data.vi;
	document.getElementById("flashcard").classList.remove("flipped");

	const btnMem = document.getElementById('btn-fc-memorized');
	if (btnMem) {
		if (state.user && state.user.memorizedWords && state.user.memorizedWords.includes(data.jp)) {
			btnMem.style.background = "#10b981";
			btnMem.style.color = "white";
			btnMem.textContent = "Đã thuộc ✔️";
		} else {
			btnMem.style.background = "transparent";
			btnMem.style.color = "#10b981";
			btnMem.textContent = "Chưa thuộc";
		}
	}
	updateFlashcardProgress();
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
	document.getElementById("btn-fc-memorized")?.addEventListener("click", toggleMemorized);
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

	// Admin button removed from home grid for standard students
	const pfAdminLink = document.getElementById("pf-admin-link");
	if (pfAdminLink) {
		const isAdmin = Boolean(state.user && state.user.role === 'admin');
		pfAdminLink.style.display = isAdmin ? 'inline-flex' : 'none';
		const headerAdminBtn = document.getElementById("header-admin-btn");
		if (headerAdminBtn) headerAdminBtn.style.display = isAdmin ? 'inline-flex' : 'none';
		const heroAdminAction = document.getElementById("hero-admin-action");
		if (heroAdminAction) heroAdminAction.style.display = isAdmin ? 'block' : 'none';
		const heroTagText = document.getElementById("hero-tag-text");
		if (heroTagText) heroTagText.textContent = isAdmin ? "Quản Trị Viên Hệ Thống" : "Khởi đầu ngày mới";
	}
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
			  if (data.user.role === 'admin') {
				  alert("Đăng nhập thành công! Hệ thống nhận diện tài khoản Quản trị viên (Admin). Nút 'Admin Portal' đã được kích hoạt trên thanh điều hướng.");
			  } else {
				  alert("Đăng nhập thành công!");
			  } 
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


// Quiz with 10s Timer (10-Question Round)
let quizRound = 1;
let quizScore = 0;
let currentQuizData = null;

function shuffle(arr) {
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
}

function buildQuizQuestion() {
	const correct = FLASHCARDS[Math.floor(Math.random() * FLASHCARDS.length)];
	const pool = FLASHCARDS.map(f => f.vi);
	const others = pool.filter(v => v !== correct.vi);
	shuffle(others);
	const options = [correct.vi, ...others.slice(0, 3)];
	shuffle(options);
	const correctIndex = options.indexOf(correct.vi);
	return { correct, options, correctIndex };
}

function renderQuiz() {
	quizRound = 1;
	quizScore = 0;
	renderQuizQuestion();
}

function renderQuizQuestion() {
	if (quizRound > 10) {
		showQuizResult(quizScore);
		return;
	}
	
	const title = document.querySelector('#view-quiz h1');
	if (title) title.textContent = "Trắc nghiệm: Câu " + quizRound + "/10";
	
	currentQuizData = buildQuizQuestion();
	const qJp = document.getElementById("q-jp");
	const qRomaji = document.getElementById("q-romaji");
	if (qJp) qJp.textContent = currentQuizData.correct.jp;
	if (qRomaji) qRomaji.textContent = currentQuizData.correct.romaji;
	
	const optsEl = document.getElementById("q-options");
	if (optsEl) {
		optsEl.innerHTML = "";
		const keys = ["A", "B", "C", "D"];
		currentQuizData.options.forEach((opt, i) => {
			const btn = document.createElement("button");
			btn.className = "opt";
			btn.textContent = keys[i] + ". " + opt;
			btn.onclick = () => handleQuizAnswer(i);
			optsEl.appendChild(btn);
		});
	}
	
	const feedback = document.getElementById("q-feedback");
	if (feedback) {
		feedback.textContent = "Chọn nghĩa đúng";
		feedback.style.color = "var(--muted)";
	}
	
	startQuizTimer();
}

function startQuizTimer() {
	clearInterval(quizTimerInterval);
	quizTimeRemaining = 10;
	const bar = document.getElementById("quiz-timer-bar");
	const txt = document.getElementById("quiz-timer-text");
	if (bar) { bar.style.transition = 'none'; bar.style.width = '100%'; bar.style.background = 'var(--primary)'; }
	if (txt) txt.textContent = "Thời gian còn lại: 10 giây";
	
	setTimeout(() => { if (bar) bar.style.transition = 'width 1s linear'; }, 50);
	
	quizTimerInterval = setInterval(() => {
		quizTimeRemaining--;
		if (txt) txt.textContent = "Thời gian còn lại: " + quizTimeRemaining + " giây";
		if (bar) bar.style.width = (quizTimeRemaining * 10) + "%";
		if (quizTimeRemaining <= 3 && bar) bar.style.background = '#ef4444';
		
		if (quizTimeRemaining <= 0) {
			clearInterval(quizTimerInterval);
			handleQuizAnswer(-1); // Time out
		}
	}, 1000);
}

function handleQuizAnswer(selectedIndex) {
	clearInterval(quizTimerInterval);
	const opts = document.querySelectorAll("#q-options .opt");
	opts.forEach(btn => btn.style.pointerEvents = "none");
	
	const feedback = document.getElementById("q-feedback");
	
	if (selectedIndex === currentQuizData.correctIndex) {
		if (opts[selectedIndex]) opts[selectedIndex].classList.add("correct");
		quizScore++;
		if (feedback) { feedback.textContent = "Chính xác! (+10đ)"; feedback.style.color = "#4ade80"; }
	} else {
		if (selectedIndex >= 0 && opts[selectedIndex]) opts[selectedIndex].classList.add("wrong");
		if (opts[currentQuizData.correctIndex]) opts[currentQuizData.correctIndex].classList.add("correct");
		if (feedback) { feedback.textContent = selectedIndex === -1 ? "Hết giờ!" : "Sai rồi!"; feedback.style.color = "#fca5a5"; }
	}
	
	setTimeout(() => {
		quizRound++;
		renderQuizQuestion();
	}, 1500);
}

function showQuizResult(score) {
	const overlay = document.createElement('div');
	overlay.style.cssText = "position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.8); z-index:9999; display:flex; align-items:center; justify-content:center;";
	const box = document.createElement('div');
	box.style.cssText = "background:var(--bg); padding:32px; border-radius:16px; text-align:center; max-width:90%; width:320px; box-shadow:0 10px 25px rgba(0,0,0,0.5);";
	
	let msg = score >= 8 ? "Tuyệt vời! 🎉" : score >= 5 ? "Khá lắm! 👍" : "Cố lên nhé! 💪";
	
	box.innerHTML = '<h2 style="margin-top:0; font-size:24px;">Kết quả</h2><div style="font-size:48px; margin:16px 0; font-weight:bold; color:var(--primary)">' + score + '/10</div><p style="margin-bottom:24px; color:var(--muted); font-size:16px;">' + msg + '</p><button id="btn-quiz-done" style="background:var(--primary); color:white; border:none; padding:12px 24px; border-radius:8px; font-weight:bold; cursor:pointer; width:100%; font-size:16px;">Nhận ' + (score * 10) + ' Điểm</button>';
	
	overlay.appendChild(box);
	document.body.appendChild(overlay);
	
	document.getElementById('btn-quiz-done').onclick = () => {
		document.body.removeChild(overlay);
		if (score > 0) addPoints(score * 10, "Đúng " + score + "/10 câu trắc nghiệm");
		setActiveView("home");
	};
}

function initQuiz() {
	const navs = document.querySelectorAll('[data-nav="quiz"]');
	navs.forEach(nav => {
		nav.addEventListener("click", () => {
			quizRound = 1;
			quizScore = 0;
			renderQuizQuestion();
		});
	});
}


function initKeyboardShortcuts() {
	window.addEventListener('keydown', (e) => {
		if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
		if (e.key === 'Escape') {
			setActiveView('home');
			return;
		}
		const fcView = document.getElementById('view-flashcards');
		if (fcView && fcView.classList.contains('active')) {
			const study = document.getElementById('fc-study-container');
			if (study && study.style.display !== 'none') {
				if (e.code === 'Space') {
					e.preventDefault();
					document.getElementById('btn-fc-flip')?.click();
				} else if (e.key === 'ArrowRight') {
					e.preventDefault();
					document.getElementById('btn-fc-next')?.click();
				} else if (e.key.toLowerCase() === 's') {
					document.getElementById('btn-fc-speak')?.click();
				}
			}
		}
		const quizView = document.getElementById('view-quiz');
		if (quizView && quizView.classList.contains('active')) {
			const opts = document.querySelectorAll('#q-options .opt');
			if (opts.length === 4) {
				let idx = -1;
				if (e.key === '1' || e.key.toLowerCase() === 'a') idx = 0;
				else if (e.key === '2' || e.key.toLowerCase() === 'b') idx = 1;
				else if (e.key === '3' || e.key.toLowerCase() === 'c') idx = 2;
				else if (e.key === '4' || e.key.toLowerCase() === 'd') idx = 3;
				if (idx >= 0 && opts[idx]) {
					opts[idx].click();
				}
			}
		}
	});
}

function boot() {
	initKeyboardShortcuts();
	loadFromStorage();
	hydrateUI();
	initNav();
	initFlashcards();
	initSentences();
	initProfile();
	initAuth();
	initQuiz();
	
	if (state.user) {
		setActiveView("home");
	} else {
		setActiveView("splash");
	}
	
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
