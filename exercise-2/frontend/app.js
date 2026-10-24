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
	selectedTrack: "all",
	showRomaji: true,
	history: []
};

// Expanded 64-item Academic Vocabulary Database with Contextual Example Sentences
const FLASHCARDS = [
	{
		"jp": "こんにちは",
		"romaji": "Konnichiwa",
		"vi": "Xin chào",
		"topic": "greetings",
		"track": "beginner",
		"example": {
			"jp": "先生、こんにちは。",
			"romaji": "Sensei, konnichiwa.",
			"vi": "Chào thầy/cô giáo ạ."
		}
	},
	{
		"jp": "ありがとう",
		"romaji": "Arigatou",
		"vi": "Cảm ơn",
		"topic": "greetings",
		"track": "beginner",
		"example": {
			"jp": "手伝ってくれて本当にありがとう。",
			"romaji": "Tetsudatte kurete hontou ni arigatou.",
			"vi": "Thật sự cảm ơn bạn đã giúp đỡ tôi."
		}
	},
	{
		"jp": "さようなら",
		"romaji": "Sayounara",
		"vi": "Tạm biệt",
		"topic": "greetings",
		"track": "beginner",
		"example": {
			"jp": "また明日、さようなら。",
			"romaji": "Mata ashita, sayounara.",
			"vi": "Hẹn gặp lại ngày mai, tạm biệt nhé."
		}
	},
	{
		"jp": "はじめまして",
		"romaji": "Hajimemashite",
		"vi": "Rất vui được gặp bạn",
		"topic": "greetings",
		"track": "beginner",
		"example": {
			"jp": "はじめまして、ナムと申します。",
			"romaji": "Hajimemashite, Namu to moushimasu.",
			"vi": "Rất hân hạnh được gặp, tôi tên là Nam."
		}
	},
	{
		"jp": "おはよう",
		"romaji": "Ohayou",
		"vi": "Chào buổi sáng",
		"topic": "greetings",
		"track": "beginner",
		"example": {
			"jp": "おはようございます、今日も頑張りましょう。",
			"romaji": "Ohayou gozaimasu, kyou mo gambarimashou.",
			"vi": "Chúc buổi sáng tốt lành, hôm nay cùng cố gắng nhé."
		}
	},
	{
		"jp": "こんばんは",
		"romaji": "Konbanwa",
		"vi": "Chào buổi tối",
		"topic": "greetings",
		"track": "beginner",
		"example": {
			"jp": "みなさん、こんばんは。",
			"romaji": "Minasan, konbanwa.",
			"vi": "Chào buổi tối tất cả mọi người."
		}
	},
	{
		"jp": "すみません",
		"romaji": "Sumimasen",
		"vi": "Xin lỗi / Làm phiền",
		"topic": "greetings",
		"track": "advanced",
		"example": {
			"jp": "すみません、今何時ですか？",
			"romaji": "Sumimasen, ima nanji desu ka?",
			"vi": "Xin lỗi, cho tôi hỏi bây giờ là mấy giờ?"
		}
	},
	{
		"jp": "よろしく",
		"romaji": "Yoroshiku",
		"vi": "Xin nhờ giúp đỡ",
		"topic": "greetings",
		"track": "advanced",
		"example": {
			"jp": "これからもよろしくお願いいたします。",
			"romaji": "Korekara mo yoroshiku onegai itashimasu.",
			"vi": "Từ nay về sau xin kính nhờ anh/chị giúp đỡ nhiều."
		}
	},
	{
		"jp": "水",
		"romaji": "Mizu",
		"vi": "Nước uống",
		"topic": "dining",
		"track": "beginner",
		"example": {
			"jp": "冷たい水を一杯ください。",
			"romaji": "Tsumetai mizu wo ippai kudasai.",
			"vi": "Làm ơn cho tôi một cốc nước lạnh."
		}
	},
	{
		"jp": "ご飯",
		"romaji": "Gohan",
		"vi": "Cơm / Bữa ăn",
		"topic": "dining",
		"track": "beginner",
		"example": {
			"jp": "朝ご飯をしっかり食べました。",
			"romaji": "Asagohan wo shikkari tabemashita.",
			"vi": "Tôi đã ăn bữa sáng rất đầy đủ."
		}
	},
	{
		"jp": "美味しい",
		"romaji": "Oishii",
		"vi": "Ngon miệng",
		"topic": "dining",
		"track": "beginner",
		"example": {
			"jp": "この料理はとても美味しいです。",
			"romaji": "Kono ryouri wa totemo oishii desu.",
			"vi": "Món ăn này rất ngon miệng."
		}
	},
	{
		"jp": "お茶",
		"romaji": "Ocha",
		"vi": "Trà xanh",
		"topic": "dining",
		"track": "beginner",
		"example": {
			"jp": "温かい緑茶を飲みます。",
			"romaji": "Atatakai ryokucha wo nomimasu.",
			"vi": "Tôi uống một tách trà xanh ấm."
		}
	},
	{
		"jp": "肉",
		"romaji": "Niku",
		"vi": "Thịt",
		"topic": "dining",
		"track": "beginner",
		"example": {
			"jp": "牛肉のうどんを注文しました。",
			"romaji": "Gyuuniku no udon wo chuumon shimashita.",
			"vi": "Tôi đã gọi một tô mì udon thịt bò."
		}
	},
	{
		"jp": "魚",
		"romaji": "Sakana",
		"vi": "Cá",
		"topic": "dining",
		"track": "beginner",
		"example": {
			"jp": "日本の刺身は新鮮な魚を使います。",
			"romaji": "Nihon no sashimi wa shinsenna sakana wo tsukaimasu.",
			"vi": "Món sashimi Nhật dùng cá rất tươi."
		}
	},
	{
		"jp": "注文",
		"romaji": "Chuumon",
		"vi": "Gọi món / Đặt hàng",
		"topic": "dining",
		"track": "advanced",
		"example": {
			"jp": "すみません、注文をお願いします。",
			"romaji": "Sumimasen, chuumon wo onegaishimasu.",
			"vi": "Xin lỗi, cho tôi xin phép gọi món ạ."
		}
	},
	{
		"jp": "会計",
		"romaji": "Kaikei",
		"vi": "Thanh toán hóa đơn",
		"topic": "dining",
		"track": "advanced",
		"example": {
			"jp": "お会計は別々でお願いします。",
			"romaji": "Okaikei wa betsubetsu de onegaishimasu.",
			"vi": "Làm ơn thanh toán tiền riêng từng người giúp tôi."
		}
	},
	{
		"jp": "駅",
		"romaji": "Eki",
		"vi": "Nhà ga",
		"topic": "transportation",
		"track": "beginner",
		"example": {
			"jp": "駅の前で友達と待ち合わせをします。",
			"romaji": "Eki no mae de tomodachi to machiawase wo shimasu.",
			"vi": "Tôi hẹn gặp bạn ở trước nhà ga."
		}
	},
	{
		"jp": "電車",
		"romaji": "Densha",
		"vi": "Tàu điện",
		"topic": "transportation",
		"track": "beginner",
		"example": {
			"jp": "次の電車はあと5分で来ます。",
			"romaji": "Tsugi no densha wa ato gofun de kimasu.",
			"vi": "Chuyến tàu điện tiếp theo sẽ đến sau 5 phút nữa."
		}
	},
	{
		"jp": "切符",
		"romaji": "Kippu",
		"vi": "Vé tàu / xe",
		"topic": "transportation",
		"track": "beginner",
		"example": {
			"jp": "切符売り場はあちらです。",
			"romaji": "Kippu uriba wa achira desu.",
			"vi": "Quầy bán vé ở đằng kia ạ."
		}
	},
	{
		"jp": "車",
		"romaji": "Kuruma",
		"vi": "Xe hơi / Ô tô",
		"topic": "transportation",
		"track": "beginner",
		"example": {
			"jp": "車で安全に運転してください。",
			"romaji": "Kuruma de anzen ni unten shite kudasai.",
			"vi": "Xin hãy lái xe ô tô thật an toàn."
		}
	},
	{
		"jp": "バス",
		"romaji": "Basu",
		"vi": "Xe buýt",
		"topic": "transportation",
		"track": "beginner",
		"example": {
			"jp": "バスに乗って大学へ通っています。",
			"romaji": "Basu ni notte daigaku e kayotte imasu.",
			"vi": "Tôi đi xe buýt đến trường đại học hàng ngày."
		}
	},
	{
		"jp": "空港",
		"romaji": "Kuukou",
		"vi": "Sân bay",
		"topic": "transportation",
		"track": "beginner",
		"example": {
			"jp": "成田空港まで特急で行きます。",
			"romaji": "Narita kuukou made tokkyuu de ikimasu.",
			"vi": "Tôi đi đến sân bay Narita bằng tàu tốc hành."
		}
	},
	{
		"jp": "乗り換え",
		"romaji": "Norikae",
		"vi": "Đổi tuyến tàu / xe",
		"topic": "transportation",
		"track": "advanced",
		"example": {
			"jp": "次の駅で銀座線に乗り換えます。",
			"romaji": "Tsugi no eki de Ginza-sen ni norikaemasu.",
			"vi": "Tại ga tiếp theo, tôi sẽ chuyển sang tuyến Ginza."
		}
	},
	{
		"jp": "出発",
		"romaji": "Shuppatsu",
		"vi": "Khởi hành",
		"topic": "transportation",
		"track": "advanced",
		"example": {
			"jp": "列車は定刻通りに出発しました。",
			"romaji": "Ressha wa teikoku doori ni shuppatsu shimashita.",
			"vi": "Chuyến tàu đã khởi hành đúng giờ quy định."
		}
	},
	{
		"jp": "買い物",
		"romaji": "Kaimono",
		"vi": "Mua sắm",
		"topic": "shopping",
		"track": "beginner",
		"example": {
			"jp": "週末にスーパーへ買い物に行きます。",
			"romaji": "Shuumatsu ni suupaa e kaimono ni ikimasu.",
			"vi": "Cuối tuần tôi đi siêu thị để mua sắm."
		}
	},
	{
		"jp": "いくら",
		"romaji": "Ikura",
		"vi": "Bao nhiêu tiền",
		"topic": "shopping",
		"track": "beginner",
		"example": {
			"jp": "この辞書はいくらですか？",
			"romaji": "Kono jisho wa ikura desu ka?",
			"vi": "Cuốn từ điển này có giá bao nhiêu tiền?"
		}
	},
	{
		"jp": "高い",
		"romaji": "Takai",
		"vi": "Đắt đỏ / Cao",
		"topic": "shopping",
		"track": "beginner",
		"example": {
			"jp": "このカメラは少し高いですが品質が良いです。",
			"romaji": "Kono kamera wa sukoshi takai desu ga hinshitsu ga yoi desu.",
			"vi": "Chiếc máy ảnh này hơi đắt nhưng chất lượng rất tốt."
		}
	},
	{
		"jp": "安い",
		"romaji": "Yasui",
		"vi": "Rẻ / Tiết kiệm",
		"topic": "shopping",
		"track": "beginner",
		"example": {
			"jp": "この店の商品はとても安いです。",
			"romaji": "Kono mise no shouhin wa totemo yasui desu.",
			"vi": "Hàng hóa ở tiệm này rất rẻ."
		}
	},
	{
		"jp": "店",
		"romaji": "Mise",
		"vi": "Cửa hàng / Tiệm",
		"topic": "shopping",
		"track": "beginner",
		"example": {
			"jp": "駅の近くに美味しいパンの店があります。",
			"romaji": "Eki no chikaku ni oishii pan no mise ga arimasu.",
			"vi": "Gần nhà ga có một tiệm bánh mì rất ngon."
		}
	},
	{
		"jp": "割引",
		"romaji": "Waribiki",
		"vi": "Giảm giá / Khuyến mãi",
		"topic": "shopping",
		"track": "advanced",
		"example": {
			"jp": "会員カードで10%割引になります。",
			"romaji": "Kaiin kaado de jippaasento waribiki ni narimasu.",
			"vi": "Với thẻ thành viên, bạn sẽ được giảm giá 10%."
		}
	},
	{
		"jp": "レシート",
		"romaji": "Reshiito",
		"vi": "Hóa đơn biên lai",
		"topic": "shopping",
		"track": "advanced",
		"example": {
			"jp": "レシートをいただけますか？",
			"romaji": "Reshiito wo itadakemasu ka?",
			"vi": "Cho tôi xin hóa đơn thanh toán được không ạ?"
		}
	},
	{
		"jp": "袋",
		"romaji": "Fukuro",
		"vi": "Túi đựng",
		"topic": "shopping",
		"track": "advanced",
		"example": {
			"jp": "レジ袋は結構です、マイバッグがあります。",
			"romaji": "Rejibukuro wa kekkou desu, maibaggu ga arimasu.",
			"vi": "Tôi không cần túi nilon ạ, tôi có đem túi riêng rồi."
		}
	},
	{
		"jp": "家族",
		"romaji": "Kazoku",
		"vi": "Gia đình",
		"topic": "family",
		"track": "beginner",
		"example": {
			"jp": "私の家族は4人です。",
			"romaji": "Watashi no kazoku wa yonin desu.",
			"vi": "Gia đình tôi có bốn thành viên."
		}
	},
	{
		"jp": "父",
		"romaji": "Chichi",
		"vi": "Bố (của tôi)",
		"topic": "family",
		"track": "beginner",
		"example": {
			"jp": "父は会社員で毎朝早く出勤します。",
			"romaji": "Chichi wa kaishain de maiasa hayaku shutkin shimasu.",
			"vi": "Bố tôi là nhân viên văn phòng, mỗi sáng đều đi làm sớm."
		}
	},
	{
		"jp": "母",
		"romaji": "Haha",
		"vi": "Mẹ (của tôi)",
		"topic": "family",
		"track": "beginner",
		"example": {
			"jp": "母の作る料理が一番好きです。",
			"romaji": "Haha no tsukuru ryouri ga ichiban suki desu.",
			"vi": "Tôi thích nhất những món ăn do chính mẹ nấu."
		}
	},
	{
		"jp": "友達",
		"romaji": "Tomodachi",
		"vi": "Bạn bè",
		"topic": "family",
		"track": "beginner",
		"example": {
			"jp": "週末に友達と映画を見ました。",
			"romaji": "Shuumatsu ni tomodachi to eiga wo mimashita.",
			"vi": "Cuối tuần tôi cùng bạn đi xem phim."
		}
	},
	{
		"jp": "兄",
		"romaji": "Ani",
		"vi": "Anh trai (của tôi)",
		"topic": "family",
		"track": "beginner",
		"example": {
			"jp": "兄は東京の大学に通っています。",
			"romaji": "Ani wa Tokyo no daigaku ni kayotte imasu.",
			"vi": "Anh trai tôi đang theo học đại học ở Tokyo."
		}
	},
	{
		"jp": "妹",
		"romaji": "Imouto",
		"vi": "Em gái (của tôi)",
		"topic": "family",
		"track": "beginner",
		"example": {
			"jp": "妹は音楽を聴くことが好きです。",
			"romaji": "Imouto wa ongaku wo kiku koto ga suki desu.",
			"vi": "Em gái tôi rất thích nghe âm nhạc."
		}
	},
	{
		"jp": "両親",
		"romaji": "Ryoushin",
		"vi": "Cha mẹ / Phụ huynh",
		"topic": "family",
		"track": "advanced",
		"example": {
			"jp": "休みに両親に手紙を書きました。",
			"romaji": "Yasumi ni ryoushin ni tegami wo kakimashita.",
			"vi": "Vào kỳ nghỉ, tôi đã viết một lá thư gửi cha mẹ."
		}
	},
	{
		"jp": "約束",
		"romaji": "Yakusoku",
		"vi": "Cuộc hẹn / Lời hứa",
		"topic": "family",
		"track": "advanced",
		"example": {
			"jp": "今夜大切な約束があります。",
			"romaji": "Konya taisetsuna yakusoku ga arimasu.",
			"vi": "Tối nay tôi có một cuộc hẹn quan trọng."
		}
	},
	{
		"jp": "今日",
		"romaji": "Kyou",
		"vi": "Hôm nay",
		"topic": "numbers",
		"track": "beginner",
		"example": {
			"jp": "今日はとても充実した一日でした。",
			"romaji": "Kyou wa totemo juujitsu shita ichinichi deshita.",
			"vi": "Hôm nay là một ngày trọn vẹn và ý nghĩa."
		}
	},
	{
		"jp": "明日",
		"romaji": "Ashita",
		"vi": "Ngày mai",
		"topic": "numbers",
		"track": "beginner",
		"example": {
			"jp": "明日日本語のテストがあります。",
			"romaji": "Ashita nihongo no tesuto ga arimasu.",
			"vi": "Ngày mai tôi có bài kiểm tra tiếng Nhật."
		}
	},
	{
		"jp": "時間",
		"romaji": "Jikan",
		"vi": "Thời gian / Giờ giấc",
		"topic": "numbers",
		"track": "beginner",
		"example": {
			"jp": "時間を大切に使いましょう。",
			"romaji": "Jikan wo taisetsu ni tsukaimashou.",
			"vi": "Hãy sử dụng thời gian một cách thật trân quý."
		}
	},
	{
		"jp": "一つ",
		"romaji": "Hitotsu",
		"vi": "Một cái (đơn vị)",
		"topic": "numbers",
		"track": "beginner",
		"example": {
			"jp": "これを一ついただけますか？",
			"romaji": "Kore wo hitotsu itadakemasu ka?",
			"vi": "Cho tôi xin một cái này được không ạ?"
		}
	},
	{
		"jp": "二つ",
		"romaji": "Futatsu",
		"vi": "Hai cái (đơn vị)",
		"topic": "numbers",
		"track": "beginner",
		"example": {
			"jp": "りんごを二つ買いました。",
			"romaji": "Ringo wo futatsu kaimashita.",
			"vi": "Tôi đã mua hai quả táo."
		}
	},
	{
		"jp": "毎日",
		"romaji": "Mainichi",
		"vi": "Mỗi ngày / Hàng ngày",
		"topic": "numbers",
		"track": "beginner",
		"example": {
			"jp": "毎日30分日本語を勉強します。",
			"romaji": "Mainichi sanjuppun nihongo wo benkyou shimasu.",
			"vi": "Hàng ngày tôi dành 30 phút để học tiếng Nhật."
		}
	},
	{
		"jp": "来週",
		"romaji": "Raishuu",
		"vi": "Tuần sau",
		"topic": "numbers",
		"track": "advanced",
		"example": {
			"jp": "来週から新しいクラスが始まります。",
			"romaji": "Raishuu kara atarashii kurasu ga hajimarimasu.",
			"vi": "Từ tuần sau, lớp học mới sẽ chính thức bắt đầu."
		}
	},
	{
		"jp": "予定",
		"romaji": "Yotei",
		"vi": "Kế hoạch / Dự định",
		"topic": "numbers",
		"track": "advanced",
		"example": {
			"jp": "今週末の予定を教えてください。",
			"romaji": "Konshuumatsu no yotei wo oshiete kudasai.",
			"vi": "Hãy chia sẻ cho tôi kế hoạch cuối tuần này của bạn nhé."
		}
	},
	{
		"jp": "会社",
		"romaji": "Kaisha",
		"vi": "Công ty",
		"topic": "work",
		"track": "beginner",
		"example": {
			"jp": "毎日地下鉄で会社へ向かいます。",
			"romaji": "Mainichi chikatetsu de kaisha e mukaimasu.",
			"vi": "Mỗi ngày tôi đều đi tàu điện ngầm đến công ty."
		}
	},
	{
		"jp": "仕事",
		"romaji": "Shigoto",
		"vi": "Công việc",
		"topic": "work",
		"track": "beginner",
		"example": {
			"jp": "今の仕事はとてもやりがいがあります。",
			"romaji": "Ima no shigoto wa totemo yarigai ga arimasu.",
			"vi": "Công việc hiện tại đem lại cho tôi rất nhiều động lực."
		}
	},
	{
		"jp": "会議",
		"romaji": "Kaigi",
		"vi": "Cuộc họp",
		"topic": "work",
		"track": "beginner",
		"example": {
			"jp": "午後2時から企画会議があります。",
			"romaji": "Gogo niji kara kikaku kaigi ga arimasu.",
			"vi": "Lúc 2 giờ chiều sẽ có một cuộc họp lên kế hoạch."
		}
	},
	{
		"jp": "書類",
		"romaji": "Shorui",
		"vi": "Tài liệu / Hồ sơ",
		"topic": "work",
		"track": "beginner",
		"example": {
			"jp": "この書類を提出してください。",
			"romaji": "Kono shorui wo teishutsu shite kudasai.",
			"vi": "Xin vui lòng nộp tập tài liệu này."
		}
	},
	{
		"jp": "電話",
		"romaji": "Denwa",
		"vi": "Điện thoại / Cuộc gọi",
		"topic": "work",
		"track": "beginner",
		"example": {
			"jp": "お客様から電話がありました。",
			"romaji": "Okyakusama kara denwa ga arimashita.",
			"vi": "Vừa có cuộc điện thoại gọi đến từ khách hàng."
		}
	},
	{
		"jp": "休憩",
		"romaji": "Kyuukei",
		"vi": "Nghỉ ngơi / Giải lao",
		"topic": "work",
		"track": "beginner",
		"example": {
			"jp": "10分間休憩しましょう。",
			"romaji": "Juppunkan kyuukei shimashou.",
			"vi": "Chúng ta cùng nghỉ giải lao khoảng 10 phút nhé."
		}
	},
	{
		"jp": "連絡",
		"romaji": "Renraku",
		"vi": "Liên lạc / Thông báo",
		"topic": "work",
		"track": "advanced",
		"example": {
			"jp": "決まり次第メールでご連絡します。",
			"romaji": "Kimari shidai meeru de gorenraku shimasu.",
			"vi": "Ngay khi có quyết định, tôi sẽ liên lạc qua thư điện tử."
		}
	},
	{
		"jp": "準備",
		"romaji": "Junbi",
		"vi": "Chuẩn bị",
		"topic": "work",
		"track": "advanced",
		"example": {
			"jp": "明日のプレゼンの準備を終えました。",
			"romaji": "Ashita no purezen no junbi wo oemashita.",
			"vi": "Tôi đã hoàn thành công tác chuẩn bị cho buổi thuyết trình ngày mai."
		}
	},
	{
		"jp": "天気",
		"romaji": "Tenki",
		"vi": "Thời tiết",
		"topic": "weather",
		"track": "beginner",
		"example": {
			"jp": "今日の天気予報を見ましたか？",
			"romaji": "Kyou no tenki yohou wo mimashita ka?",
			"vi": "Bạn đã xem bản tin dự báo thời tiết hôm nay chưa?"
		}
	},
	{
		"jp": "雨",
		"romaji": "Ame",
		"vi": "Mưa",
		"topic": "weather",
		"track": "beginner",
		"example": {
			"jp": "傘を持って出かけましょう、雨が降ります。",
			"romaji": "Kasa wo motte dekakemashou, ame ga furimasu.",
			"vi": "Hãy đem theo ô khi ra ngoài nhé, trời sắp mưa đấy."
		}
	},
	{
		"jp": "晴れ",
		"romaji": "Hare",
		"vi": "Nắng ráo / Trong xanh",
		"topic": "weather",
		"track": "beginner",
		"example": {
			"jp": "青空が広がって気持ちの良い晴れです。",
			"romaji": "Aozora ga hirogatte kimochi no yoi hare desu.",
			"vi": "Bầu trời xanh trong, hôm nay là ngày nắng thật dễ chịu."
		}
	},
	{
		"jp": "暑い",
		"romaji": "Atsui",
		"vi": "Nóng bức (thời tiết)",
		"topic": "weather",
		"track": "beginner",
		"example": {
			"jp": "今年の夏は特に暑いです。",
			"romaji": "Kotoshi no natsu wa tokuni atsui desu.",
			"vi": "Mùa hè năm nay thời tiết đặc biệt nóng bức."
		}
	},
	{
		"jp": "寒い",
		"romaji": "Samui",
		"vi": "Lạnh buốt (thời tiết)",
		"topic": "weather",
		"track": "beginner",
		"example": {
			"jp": "外は風が強くてとても寒いです。",
			"romaji": "Soto wa kaze ga tsuyokute totemo samui desu.",
			"vi": "Bên ngoài gió to và rất lạnh buốt."
		}
	},
	{
		"jp": "雪",
		"romaji": "Yuki",
		"vi": "Tuyết rơi",
		"topic": "weather",
		"track": "beginner",
		"example": {
			"jp": "冬になると山に白い雪が積もります。",
			"romaji": "Fuyu ni naru to yama ni shiroi yuki ga tsumorimasu.",
			"vi": "Khi mùa đông đến, tuyết trắng phủ dày khắp đỉnh núi."
		}
	},
	{
		"jp": "季節",
		"romaji": "Kisetsu",
		"vi": "Mùa trong năm",
		"topic": "weather",
		"track": "advanced",
		"example": {
			"jp": "日本には四季という四つの季節があります。",
			"romaji": "Nihon ni wa shiki to iu yottsu no kisetsu ga arimasu.",
			"vi": "Nước Nhật có bốn mùa rất rõ nét."
		}
	},
	{
		"jp": "気温",
		"romaji": "Kion",
		"vi": "Nhiệt độ không khí",
		"topic": "weather",
		"track": "advanced",
		"example": {
			"jp": "今日の最高気温は25度です。",
			"romaji": "Kyou no saikou kion wa nijuugodo desu.",
			"vi": "Nhiệt độ cao nhất trong ngày hôm nay là 25 độ C."
		}
	}
];

// Expanded 24-item Communication Sentences across 8 topics
const SENTENCES = [
	{
		"jp": "おはようございます。",
		"vi": "Chào buổi sáng tốt lành.",
		"topic": "greetings"
	},
	{
		"jp": "お元気ですか？",
		"vi": "Dạo này bạn có khỏe không?",
		"topic": "greetings"
	},
	{
		"jp": "失礼いたします。",
		"vi": "Xin phép làm phiền / Xin phép vào.",
		"topic": "greetings"
	},
	{
		"jp": "いただきます。",
		"vi": "Tôi xin phép dùng bữa.",
		"topic": "dining"
	},
	{
		"jp": "ごちそうさまでした。",
		"vi": "Cảm ơn vì bữa ăn rất ngon.",
		"topic": "dining"
	},
	{
		"jp": "お水を一杯いただけますか？",
		"vi": "Cho tôi xin một ly nước được không ạ?",
		"topic": "dining"
	},
	{
		"jp": "一番近い駅はどこですか？",
		"vi": "Nhà ga gần nhất nằm ở đâu ạ?",
		"topic": "transportation"
	},
	{
		"jp": "切符はどこで買えますか？",
		"vi": "Tôi có thể mua vé ở đâu?",
		"topic": "transportation"
	},
	{
		"jp": "東京駅までどのくらいかかりますか？",
		"vi": "Đến ga Tokyo mất khoảng bao lâu?",
		"topic": "transportation"
	},
	{
		"jp": "これはいくらですか？",
		"vi": "Cái này giá bao nhiêu tiền vậy?",
		"topic": "shopping"
	},
	{
		"jp": "これをお願いします。",
		"vi": "Làm ơn lấy cho tôi món này.",
		"topic": "shopping"
	},
	{
		"jp": "カードで支払うことはできますか？",
		"vi": "Tôi có thể thanh toán bằng thẻ được không?",
		"topic": "shopping"
	},
	{
		"jp": "ご家族はお元気ですか？",
		"vi": "Gia đình bạn vẫn khỏe chứ?",
		"topic": "family"
	},
	{
		"jp": "両親は故郷に住んでいます。",
		"vi": "Bố mẹ tôi hiện đang sống ở quê nhà.",
		"topic": "family"
	},
	{
		"jp": "また遊びに来てくださいね。",
		"vi": "Lần sau hãy lại ghé chơi nhé.",
		"topic": "family"
	},
	{
		"jp": "今、何時何分ですか？",
		"vi": "Bây giờ là mấy giờ mấy phút rồi?",
		"topic": "numbers"
	},
	{
		"jp": "来週の月曜日に会いましょう。",
		"vi": "Hẹn gặp bạn vào thứ Hai tuần tới nhé.",
		"topic": "numbers"
	},
	{
		"jp": "少し時間がかかります。",
		"vi": "Sẽ mất một chút thời gian đấy.",
		"topic": "numbers"
	},
	{
		"jp": "お疲れ様でした。",
		"vi": "Mọi người đã vất vả nhiều rồi.",
		"topic": "work"
	},
	{
		"jp": "確認して折り返し連絡します。",
		"vi": "Tôi sẽ kiểm tra rồi liên lạc lại ngay.",
		"topic": "work"
	},
	{
		"jp": "資料をメールで送付しました。",
		"vi": "Tôi đã gửi tài liệu qua thư điện tử rồi.",
		"topic": "work"
	},
	{
		"jp": "今日はとても良い天気ですね。",
		"vi": "Hôm nay thời tiết đẹp quá nhỉ.",
		"topic": "weather"
	},
	{
		"jp": "明日は雨が降るそうです。",
		"vi": "Nghe nói ngày mai trời sẽ đổ mưa.",
		"topic": "weather"
	},
	{
		"jp": "寒くなりましたのでお体に気をつけて。",
		"vi": "Trời trở lạnh rồi, bạn nhớ giữ gìn sức khỏe nhé.",
		"topic": "weather"
	}
];

const TOPIC_NAMES = {
	"greetings": "Chào hỏi",
	"dining": "Ăn uống",
	"transportation": "Giao thông",
	"shopping": "Mua sắm",
	"family": "Gia đình",
	"numbers": "Thời gian & Số",
	"work": "Công việc",
	"weather": "Thời tiết"
};

// Timer variables
let quizTimerInterval = null;
let quizTimeRemaining = 10;

function loadFromStorage() {
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

// Academic Level Classification
function getLevelRank(level) {
	if (level <= 2) return { code: "[N5-BASIC]", label: "Sơ cấp N5" };
	if (level <= 5) return { code: "[N5-PRO]", label: "Trung cấp N5" };
	if (level <= 9) return { code: "[N4-CORE]", label: "Nâng cao N4" };
	return { code: "[MASTER]", label: "Cao cấp Master" };
}

function speak(text, lang = "ja-JP") {
	if (!("speechSynthesis" in window)) return;
	const utter = new SpeechSynthesisUtterance(text);
	utter.lang = lang;
	utter.rate = 0.9;
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
	
	const rank = getLevelRank(state.level);
	const headerRankEl = document.getElementById("header-rank");
	if (headerRankEl) headerRankEl.textContent = rank.code;
	const heroRankEl = document.getElementById("hero-rank");
	if (heroRankEl) heroRankEl.textContent = rank.code;

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

// Flashcard Topic & Track Logic
function getFilteredFlashcards() {
	return FLASHCARDS.filter(f => {
		const matchTopic = !state.selectedFcTopic || f.topic === state.selectedFcTopic;
		const matchTrack = state.selectedTrack === "all" || f.track === state.selectedTrack;
		return matchTopic && matchTrack;
	});
}

function resetFlashcardView() {
	state.selectedFcTopic = null;
	const sel = document.getElementById("fc-topic-selector");
	const study = document.getElementById("fc-study-container");
	const title = document.getElementById("fc-title");
	if (sel) sel.style.display = "block";
	if (study) study.style.display = "none";
	if (title) title.textContent = "Từ vựng tiếng Nhật";
	updateTopicCounts();
}

function updateTopicCounts() {
	document.querySelectorAll("#fc-topic-selector .topic-card").forEach(card => {
		const topic = card.getAttribute("data-fc-topic");
		const countEl = card.querySelector(".topic-count");
		if (topic && countEl) {
			const count = FLASHCARDS.filter(f => {
				const matchTopic = f.topic === topic;
				const matchTrack = state.selectedTrack === "all" || f.track === state.selectedTrack;
				return matchTopic && matchTrack;
			}).length;
			countEl.textContent = `${count} từ vựng`;
		}
	});
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
	const list = getFilteredFlashcards();
	const total = list.length || 1;
	let memorizedCount = 0;
	
	if (state.user && state.user.memorizedWords) {
		const wordSet = new Set(list.map(w => w.jp));
		memorizedCount = state.user.memorizedWords.filter(w => wordSet.has(w)).length;
	}
	
	if (txt) txt.textContent = memorizedCount + " / " + list.length + " từ";
	if (bar) bar.style.width = Math.min(100, Math.round((memorizedCount / total) * 100)) + "%";
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
	if (name !== 'splash' && name !== 'auth' && !state.user) {
		name = 'auth';
	}

	if (name !== 'quiz') {
		clearInterval(quizTimerInterval);
	}
	
	if (name === 'admin') {
		window.location.href = 'admin.html';
		return;
	}

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
}

// Sequential Learning: Word -> Meaning -> Example Contextual Sentence
function renderFlashcard() {
	const list = getFilteredFlashcards();
	if (list.length === 0) {
		const jpEl = document.getElementById("fc-jp");
		const romajiEl = document.getElementById("fc-romaji");
		const viEl = document.getElementById("fc-vi");
		if (jpEl) jpEl.textContent = "Chưa có từ";
		if (romajiEl) romajiEl.textContent = "Không có từ vựng ở phân loại này";
		if (viEl) viEl.textContent = "Vui lòng chọn chủ đề hoặc cấp độ khác";
		const exCard = document.getElementById("fc-example-card");
		if (exCard) exCard.style.display = "none";
		return;
	}
	const data = list[state.flashIdx % list.length];
	
	// Stage 1: Japanese word & Romaji
	const jpEl = document.getElementById("fc-jp");
	const romajiEl = document.getElementById("fc-romaji");
	if (jpEl) jpEl.textContent = data.jp;
	if (romajiEl) {
		romajiEl.textContent = data.romaji;
		romajiEl.style.display = state.showRomaji ? "block" : "none";
	}
	
	// Stage 2: Meaning in Vietnamese
	const viEl = document.getElementById("fc-vi");
	if (viEl) viEl.textContent = data.vi;
	
	document.getElementById("flashcard").classList.remove("flipped");

	// Stage 3: Immediate Applied Contextual Sentence Card
	const exCard = document.getElementById("fc-example-card");
	if (exCard && data.example) {
		exCard.style.display = "block";
		const exJp = document.getElementById("fc-ex-jp");
		const exRomaji = document.getElementById("fc-ex-romaji");
		const exVi = document.getElementById("fc-ex-vi");
		if (exJp) exJp.textContent = data.example.jp;
		if (exRomaji) {
			exRomaji.textContent = data.example.romaji;
			exRomaji.style.display = state.showRomaji ? "block" : "none";
		}
		if (exVi) exVi.textContent = data.example.vi;
	}

	// Track badge
	const trackBadge = document.getElementById("fc-track-badge");
	if (trackBadge) {
		trackBadge.textContent = data.track === "beginner" ? "[SƠ CẤP]" : "[NÂNG CAO]";
		trackBadge.className = "fc-track-badge " + (data.track === "beginner" ? "badge-beginner" : "badge-advanced");
	}

	// Memorization status (No emojis)
	const btnMem = document.getElementById('btn-fc-memorized');
	if (btnMem) {
		if (state.user && state.user.memorizedWords && state.user.memorizedWords.includes(data.jp)) {
			btnMem.style.background = "#10b981";
			btnMem.style.color = "white";
			btnMem.textContent = "Đã thuộc";
		} else {
			btnMem.style.background = "transparent";
			btnMem.style.color = "#10b981";
			btnMem.textContent = "Chưa thuộc";
		}
	}
	updateFlashcardProgress();
}

function updateRomajiToggleUI() {
	const btn = document.getElementById("btn-toggle-romaji");
	if (!btn) return;
	const indicator = btn.querySelector(".toggle-indicator");
	const text = btn.querySelector(".toggle-text");
	if (state.showRomaji) {
		if (indicator) indicator.className = "toggle-indicator on";
		if (text) text.textContent = "Romaji: BẬT";
	} else {
		if (indicator) indicator.className = "toggle-indicator off";
		if (text) text.textContent = "Romaji: TẮT";
	}
}

// Sentence View Logic
function getFilteredSentences() {
	if (!state.selectedSnTopic) return SENTENCES;
	return SENTENCES.filter(s => s.topic === state.selectedSnTopic);
}

function resetSentenceView() {
	state.selectedSnTopic = null;
	const sel = document.getElementById("sn-topic-selector");
	const study = document.getElementById("sn-study-container");
	const title = document.getElementById("sn-title");
	if (sel) sel.style.display = "block";
	if (study) study.style.display = "none";
	if (title) title.textContent = "Mẫu câu thông dụng";
}

function selectSentenceTopic(topic) {
	state.selectedSnTopic = topic;
	state.sentenceIdx = 0;
	const sel = document.getElementById("sn-topic-selector");
	const study = document.getElementById("sn-study-container");
	const title = document.getElementById("sn-title");
	if (sel) sel.style.display = "none";
	if (study) study.style.display = "block";
	if (title) title.textContent = `Mẫu câu - ${TOPIC_NAMES[topic] || topic}`;
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
	// Topic cards click
	document.querySelectorAll("#fc-topic-selector .topic-card").forEach((card) => {
		card.addEventListener("click", () => {
			const topic = card.getAttribute("data-fc-topic");
			selectFlashcardTopic(topic);
		});
	});

	// Track filter tabs ([ALL], [BEGINNER], [ADVANCED])
	document.querySelectorAll(".track-tab").forEach((tab) => {
		tab.addEventListener("click", () => {
			document.querySelectorAll(".track-tab").forEach(t => t.classList.remove("active"));
			tab.classList.add("active");
			state.selectedTrack = tab.getAttribute("data-track") || "all";
			state.flashIdx = 0;
			updateTopicCounts();
			const studyContainer = document.getElementById("fc-study-container");
			if (studyContainer && studyContainer.style.display !== "none") {
				renderFlashcard();
			}
		});
	});

	// Romaji toggle button
	const btnToggleRomaji = document.getElementById("btn-toggle-romaji");
	btnToggleRomaji?.addEventListener("click", () => {
		state.showRomaji = !state.showRomaji;
		updateRomajiToggleUI();
		renderFlashcard();
	});

	// Card controls
	const card = document.getElementById("flashcard");
	const btnFlip = document.getElementById("btn-fc-flip");
	const btnSpeak = document.getElementById("btn-fc-speak");
	const btnNext = document.getElementById("btn-fc-next");
	const btnBackTopic = document.getElementById("btn-fc-back-topic");
	const btnExSpeak = document.getElementById("btn-fc-ex-speak");
	
	btnFlip?.addEventListener("click", () => { card.classList.toggle("flipped"); });
	btnSpeak?.addEventListener("click", () => { 
		const list = getFilteredFlashcards();
		if (list.length === 0) return;
		const data = list[state.flashIdx % list.length]; 
		speak(data.jp); 
	});
	btnNext?.addEventListener("click", () => { 
		const list = getFilteredFlashcards();
		if (list.length === 0) return;
		const data = list[state.flashIdx % list.length]; 
		state.flashIdx = (state.flashIdx + 1) % list.length; 
		addPoints(10, `Học từ: ${data.jp}`); 
		renderFlashcard(); 
	});
	btnBackTopic?.addEventListener("click", resetFlashcardView);
	document.getElementById("btn-fc-memorized")?.addEventListener("click", toggleMemorized);

	// Contextual example audio speech
	btnExSpeak?.addEventListener("click", () => {
		const list = getFilteredFlashcards();
		if (list.length === 0) return;
		const data = list[state.flashIdx % list.length];
		if (data.example && data.example.jp) {
			speak(data.example.jp);
		}
	});

	updateTopicCounts();
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

	btnSpeak?.addEventListener("click", () => { 
		const list = getFilteredSentences();
		if (list.length === 0) return;
		const data = list[state.sentenceIdx % list.length]; 
		speak(data.jp); 
	});
	btnNext?.addEventListener("click", () => { 
		const list = getFilteredSentences();
		if (list.length === 0) return;
		const data = list[state.sentenceIdx % list.length]; 
		state.sentenceIdx = (state.sentenceIdx + 1) % list.length; 
		addPoints(10, `Học câu: ${data.jp}`); 
		renderSentence(); 
	});
	btnBackTopic?.addEventListener("click", resetSentenceView);
}

function initProfile() {
	const nameEl = document.getElementById("pf-name");
	const input = document.getElementById("pf-input-name");
	const btn = document.getElementById("pf-save");
	const btnLogout = document.getElementById("pf-logout");
	
	btn?.addEventListener("click", () => {
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
				  if (nameEl) nameEl.textContent = state.user.name;
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

	// Admin button exclusively for Admins
	const pfAdminLink = document.getElementById("pf-admin-link");
	const isAdmin = Boolean(state.user && state.user.role === 'admin');
	if (pfAdminLink) pfAdminLink.style.display = isAdmin ? 'inline-flex' : 'none';
	const headerAdminBtn = document.getElementById("header-admin-btn");
	if (headerAdminBtn) headerAdminBtn.style.display = isAdmin ? 'inline-flex' : 'none';
	const heroAdminAction = document.getElementById("hero-admin-action");
	if (heroAdminAction) heroAdminAction.style.display = isAdmin ? 'block' : 'none';
	const heroTagText = document.getElementById("hero-tag-text");
	if (heroTagText) heroTagText.textContent = isAdmin ? "Quản Trị Viên Hệ Thống" : "Khởi đầu ngày mới";
}

function hash(str) { let h = 0; for (let i = 0; i < str.length; i++) { h = (h << 5) - h + str.charCodeAt(i); h |= 0; } return String(h); }

function initAuth() {
	const tabLogin = document.getElementById("tab-login");
	const tabRegister = document.getElementById("tab-register");
	const loginBox = document.getElementById("auth-login");
	const regBox = document.getElementById("auth-register");
	tabLogin?.addEventListener("click", () => { if (loginBox) loginBox.style.display = "block"; if (regBox) regBox.style.display = "none"; tabLogin.classList.add("primary"); tabRegister.classList.remove("primary"); });
	tabRegister?.addEventListener("click", () => { if (loginBox) loginBox.style.display = "none"; if (regBox) regBox.style.display = "block"; tabRegister.classList.add("primary"); tabLogin.classList.remove("primary"); });
	
	const btnSplashLogin = document.getElementById("btn-splash-login");
	const btnSplashRegister = document.getElementById("btn-splash-register");
	btnSplashLogin?.addEventListener("click", () => {
		tabLogin?.click();
		setActiveView("auth");
	});
	btnSplashRegister?.addEventListener("click", () => {
		tabRegister?.click();
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
			if (loginErr) { loginErr.textContent = "Vui lòng nhập đúng định dạng email (ví dụ: email@domain.com)"; loginErr.style.display = "block"; }
			return;
		}
		if (!pass) {
			if (loginErr) { loginErr.textContent = "Vui lòng nhập mật khẩu"; loginErr.style.display = "block"; }
			return;
		}
		
		fetch('/api/auth/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password: pass })
		}).then(res => res.json())
		  .then(data => {
			  if (!data.success) {
				  if (loginErr) { loginErr.textContent = data.message || "Đăng nhập thất bại"; loginErr.style.display = "block"; }
				  return;
			  }
			  state.user = data.user;
			  state.points = data.user.points;
			  state.level = data.user.level;
			  state.history = data.user.history || [];
			  saveUser();
			  loadFromStorage();
			  if (state.user.role === 'admin') {
				  alert("Đăng nhập thành công với vai trò Quản Trị Viên (Admin)!");
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
			handleQuizAnswer(-1);
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
	
	let msg = score >= 8 ? "Xuất sắc! Đạt chuẩn ghi nhớ." : score >= 5 ? "Khá tốt! Hãy tiếp tục duy trì." : "Cần rèn luyện thêm từ vựng.";
	
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
