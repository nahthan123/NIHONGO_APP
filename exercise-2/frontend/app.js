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
	"quiz",
	"exam",
	"admin"
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
	selectedSnTrack: "n5",
	selectedTrack: "n5",
	selectedQuizTrack: "n5",
	showRomaji: true,
	history: [],
	weakFilter: "all",
	isWeakDrillMode: false
};

// Expanded 64-item Academic Vocabulary Database with Contextual Example Sentences
const FLASHCARDS = [
	{
		"jp": "こんにちは",
		"romaji": "Konnichiwa",
		"vi": "Xin chào",
		"topic": "greetings",
		"track": "n5",
		"example": {
			"jp": "先生、こんにちは。",
			"romaji": "Sensei, konnichiwa.",
			"vi": "Chào thầy/cô giáo ạ."
		},
		"stage": 1,
		"stageTitle": "N5 • Giai đoạn 1/4 - Chào hỏi"
	},
	{
		"jp": "ありがとう",
		"romaji": "Arigatou",
		"vi": "Cảm ơn",
		"topic": "greetings",
		"track": "n5",
		"example": {
			"jp": "手伝ってくれて本当にありがとう。",
			"romaji": "Tetsudatte kurete hontou ni arigatou.",
			"vi": "Thật sự cảm ơn bạn đã giúp đỡ tôi."
		},
		"stage": 1,
		"stageTitle": "N5 • Giai đoạn 1/4 - Chào hỏi"
	},
	{
		"jp": "さようなら",
		"romaji": "Sayounara",
		"vi": "Tạm biệt",
		"topic": "greetings",
		"track": "n5",
		"example": {
			"jp": "また明日、さようなら。",
			"romaji": "Mata ashita, sayounara.",
			"vi": "Hẹn gặp lại ngày mai, tạm biệt nhé."
		},
		"stage": 1,
		"stageTitle": "N5 • Giai đoạn 1/4 - Chào hỏi"
	},
	{
		"jp": "はじめまして",
		"romaji": "Hajimemashite",
		"vi": "Rất vui được gặp bạn",
		"topic": "greetings",
		"track": "n5",
		"example": {
			"jp": "はじめまして、ナムと申します。",
			"romaji": "Hajimemashite, Namu to moushimasu.",
			"vi": "Rất hân hạnh được gặp, tôi tên là Nam."
		},
		"stage": 1,
		"stageTitle": "N5 • Giai đoạn 1/4 - Chào hỏi"
	},
	{
		"jp": "おはよう",
		"romaji": "Ohayou",
		"vi": "Chào buổi sáng",
		"topic": "greetings",
		"track": "n5",
		"example": {
			"jp": "おはようございます、今日も頑張りましょう。",
			"romaji": "Ohayou gozaimasu, kyou mo gambarimashou.",
			"vi": "Chúc buổi sáng tốt lành, hôm nay cùng cố gắng nhé."
		},
		"stage": 1,
		"stageTitle": "N5 • Giai đoạn 1/4 - Chào hỏi"
	},
	{
		"jp": "こんばんは",
		"romaji": "Konbanwa",
		"vi": "Chào buổi tối",
		"topic": "greetings",
		"track": "n5",
		"example": {
			"jp": "みなさん、こんばんは。",
			"romaji": "Minasan, konbanwa.",
			"vi": "Chào buổi tối tất cả mọi người."
		},
		"stage": 1,
		"stageTitle": "N5 • Giai đoạn 1/4 - Chào hỏi"
	},
	{
		"jp": "すみません",
		"romaji": "Sumimasen",
		"vi": "Xin lỗi / Làm phiền",
		"topic": "greetings",
		"track": "n5",
		"example": {
			"jp": "すみません、今何時ですか？",
			"romaji": "Sumimasen, ima nanji desu ka?",
			"vi": "Xin lỗi, cho tôi hỏi bây giờ là mấy giờ?"
		},
		"stage": 1,
		"stageTitle": "N5 • Giai đoạn 1/4 - Chào hỏi"
	},
	{
		"jp": "よろしく",
		"romaji": "Yoroshiku",
		"vi": "Xin nhờ giúp đỡ",
		"topic": "greetings",
		"track": "n5",
		"example": {
			"jp": "これからもよろしくお願いいたします。",
			"romaji": "Korekara mo yoroshiku onegai itashimasu.",
			"vi": "Từ nay về sau xin kính nhờ anh/chị giúp đỡ nhiều."
		},
		"stage": 1,
		"stageTitle": "N5 • Giai đoạn 1/4 - Chào hỏi"
	},
	{
		"jp": "水",
		"romaji": "Mizu",
		"vi": "Nước uống",
		"topic": "dining",
		"track": "n5",
		"example": {
			"jp": "冷たい水を一杯ください。",
			"romaji": "Tsumetai mizu wo ippai kudasai.",
			"vi": "Làm ơn cho tôi một cốc nước lạnh."
		},
		"stage": 3,
		"stageTitle": "N5 • Giai đoạn 3/4 - Ăn uống"
	},
	{
		"jp": "ご飯",
		"romaji": "Gohan",
		"vi": "Cơm / Bữa ăn",
		"topic": "dining",
		"track": "n5",
		"example": {
			"jp": "朝ご飯をしっかり食べました。",
			"romaji": "Asagohan wo shikkari tabemashita.",
			"vi": "Tôi đã ăn bữa sáng rất đầy đủ."
		},
		"stage": 3,
		"stageTitle": "N5 • Giai đoạn 3/4 - Ăn uống"
	},
	{
		"jp": "美味しい",
		"romaji": "Oishii",
		"vi": "Ngon miệng",
		"topic": "dining",
		"track": "n5",
		"example": {
			"jp": "この料理はとても美味しいです。",
			"romaji": "Kono ryouri wa totemo oishii desu.",
			"vi": "Món ăn này rất ngon miệng."
		},
		"stage": 3,
		"stageTitle": "N5 • Giai đoạn 3/4 - Ăn uống"
	},
	{
		"jp": "お茶",
		"romaji": "Ocha",
		"vi": "Trà xanh",
		"topic": "dining",
		"track": "n5",
		"example": {
			"jp": "温かい緑茶を飲みます。",
			"romaji": "Atatakai ryokucha wo nomimasu.",
			"vi": "Tôi uống một tách trà xanh ấm."
		},
		"stage": 3,
		"stageTitle": "N5 • Giai đoạn 3/4 - Ăn uống"
	},
	{
		"jp": "肉",
		"romaji": "Niku",
		"vi": "Thịt",
		"topic": "dining",
		"track": "n5",
		"example": {
			"jp": "牛肉のうどんを注文しました。",
			"romaji": "Gyuuniku no udon wo chuumon shimashita.",
			"vi": "Tôi đã gọi một tô mì udon thịt bò."
		},
		"stage": 3,
		"stageTitle": "N5 • Giai đoạn 3/4 - Ăn uống"
	},
	{
		"jp": "魚",
		"romaji": "Sakana",
		"vi": "Cá",
		"topic": "dining",
		"track": "n5",
		"example": {
			"jp": "日本の刺身は新鮮な魚を使います。",
			"romaji": "Nihon no sashimi wa shinsenna sakana wo tsukaimasu.",
			"vi": "Món sashimi Nhật dùng cá rất tươi."
		},
		"stage": 3,
		"stageTitle": "N5 • Giai đoạn 3/4 - Ăn uống"
	},
	{
		"jp": "注文",
		"romaji": "Chuumon",
		"vi": "Gọi món / Đặt hàng",
		"topic": "dining",
		"track": "n5",
		"example": {
			"jp": "すみません、注文をお願いします。",
			"romaji": "Sumimasen, chuumon wo onegaishimasu.",
			"vi": "Xin lỗi, cho tôi xin phép gọi món ạ."
		},
		"stage": 3,
		"stageTitle": "N5 • Giai đoạn 3/4 - Ăn uống"
	},
	{
		"jp": "会計",
		"romaji": "Kaikei",
		"vi": "Thanh toán hóa đơn",
		"topic": "dining",
		"track": "n5",
		"example": {
			"jp": "お会計は別々でお願いします。",
			"romaji": "Okaikei wa betsubetsu de onegaishimasu.",
			"vi": "Làm ơn thanh toán tiền riêng từng người giúp tôi."
		},
		"stage": 3,
		"stageTitle": "N5 • Giai đoạn 3/4 - Ăn uống"
	},
	{
		"jp": "駅",
		"romaji": "Eki",
		"vi": "Nhà ga",
		"topic": "transportation",
		"track": "n4",
		"example": {
			"jp": "駅の前で友達と待ち合わせをします。",
			"romaji": "Eki no mae de tomodachi to machiawase wo shimasu.",
			"vi": "Tôi hẹn gặp bạn ở trước nhà ga."
		},
		"stage": 1,
		"stageTitle": "N4 • Giai đoạn 1/4 - Giao thông"
	},
	{
		"jp": "電車",
		"romaji": "Densha",
		"vi": "Tàu điện",
		"topic": "transportation",
		"track": "n4",
		"example": {
			"jp": "次の電車はあと5分で来ます。",
			"romaji": "Tsugi no densha wa ato gofun de kimasu.",
			"vi": "Chuyến tàu điện tiếp theo sẽ đến sau 5 phút nữa."
		},
		"stage": 1,
		"stageTitle": "N4 • Giai đoạn 1/4 - Giao thông"
	},
	{
		"jp": "切符",
		"romaji": "Kippu",
		"vi": "Vé tàu / xe",
		"topic": "transportation",
		"track": "n4",
		"example": {
			"jp": "切符売り場はあちらです。",
			"romaji": "Kippu uriba wa achira desu.",
			"vi": "Quầy bán vé ở đằng kia ạ."
		},
		"stage": 1,
		"stageTitle": "N4 • Giai đoạn 1/4 - Giao thông"
	},
	{
		"jp": "車",
		"romaji": "Kuruma",
		"vi": "Xe hơi / Ô tô",
		"topic": "transportation",
		"track": "n4",
		"example": {
			"jp": "車で安全に運転してください。",
			"romaji": "Kuruma de anzen ni unten shite kudasai.",
			"vi": "Xin hãy lái xe ô tô thật an toàn."
		},
		"stage": 1,
		"stageTitle": "N4 • Giai đoạn 1/4 - Giao thông"
	},
	{
		"jp": "バス",
		"romaji": "Basu",
		"vi": "Xe buýt",
		"topic": "transportation",
		"track": "n4",
		"example": {
			"jp": "バスに乗って大学へ通っています。",
			"romaji": "Basu ni notte daigaku e kayotte imasu.",
			"vi": "Tôi đi xe buýt đến trường đại học hàng ngày."
		},
		"stage": 1,
		"stageTitle": "N4 • Giai đoạn 1/4 - Giao thông"
	},
	{
		"jp": "空港",
		"romaji": "Kuukou",
		"vi": "Sân bay",
		"topic": "transportation",
		"track": "n4",
		"example": {
			"jp": "成田空港まで特急で行きます。",
			"romaji": "Narita kuukou made tokkyuu de ikimasu.",
			"vi": "Tôi đi đến sân bay Narita bằng tàu tốc hành."
		},
		"stage": 1,
		"stageTitle": "N4 • Giai đoạn 1/4 - Giao thông"
	},
	{
		"jp": "乗り換え",
		"romaji": "Norikae",
		"vi": "Đổi tuyến tàu / xe",
		"topic": "transportation",
		"track": "n4",
		"example": {
			"jp": "次の駅で銀座線に乗り換えます。",
			"romaji": "Tsugi no eki de Ginza-sen ni norikaemasu.",
			"vi": "Tại ga tiếp theo, tôi sẽ chuyển sang tuyến Ginza."
		},
		"stage": 1,
		"stageTitle": "N4 • Giai đoạn 1/4 - Giao thông"
	},
	{
		"jp": "出発",
		"romaji": "Shuppatsu",
		"vi": "Khởi hành",
		"topic": "transportation",
		"track": "n4",
		"example": {
			"jp": "列車は定刻通りに出発しました。",
			"romaji": "Ressha wa teikoku doori ni shuppatsu shimashita.",
			"vi": "Chuyến tàu đã khởi hành đúng giờ quy định."
		},
		"stage": 1,
		"stageTitle": "N4 • Giai đoạn 1/4 - Giao thông"
	},
	{
		"jp": "買い物",
		"romaji": "Kaimono",
		"vi": "Mua sắm",
		"topic": "shopping",
		"track": "n4",
		"example": {
			"jp": "週末にスーパーへ買い物に行きます。",
			"romaji": "Shuumatsu ni suupaa e kaimono ni ikimasu.",
			"vi": "Cuối tuần tôi đi siêu thị để mua sắm."
		},
		"stage": 2,
		"stageTitle": "N4 • Giai đoạn 2/4 - Mua sắm"
	},
	{
		"jp": "いくら",
		"romaji": "Ikura",
		"vi": "Bao nhiêu tiền",
		"topic": "shopping",
		"track": "n4",
		"example": {
			"jp": "この辞書はいくらですか？",
			"romaji": "Kono jisho wa ikura desu ka?",
			"vi": "Cuốn từ điển này có giá bao nhiêu tiền?"
		},
		"stage": 2,
		"stageTitle": "N4 • Giai đoạn 2/4 - Mua sắm"
	},
	{
		"jp": "高い",
		"romaji": "Takai",
		"vi": "Đắt đỏ / Cao",
		"topic": "shopping",
		"track": "n4",
		"example": {
			"jp": "このカメラは少し高いですが品質が良いです。",
			"romaji": "Kono kamera wa sukoshi takai desu ga hinshitsu ga yoi desu.",
			"vi": "Chiếc máy ảnh này hơi đắt nhưng chất lượng rất tốt."
		},
		"stage": 2,
		"stageTitle": "N4 • Giai đoạn 2/4 - Mua sắm"
	},
	{
		"jp": "安い",
		"romaji": "Yasui",
		"vi": "Rẻ / Tiết kiệm",
		"topic": "shopping",
		"track": "n4",
		"example": {
			"jp": "この店の商品はとても安いです。",
			"romaji": "Kono mise no shouhin wa totemo yasui desu.",
			"vi": "Hàng hóa ở tiệm này rất rẻ."
		},
		"stage": 2,
		"stageTitle": "N4 • Giai đoạn 2/4 - Mua sắm"
	},
	{
		"jp": "店",
		"romaji": "Mise",
		"vi": "Cửa hàng / Tiệm",
		"topic": "shopping",
		"track": "n4",
		"example": {
			"jp": "駅の近くに美味しいパンの店があります。",
			"romaji": "Eki no chikaku ni oishii pan no mise ga arimasu.",
			"vi": "Gần nhà ga có một tiệm bánh mì rất ngon."
		},
		"stage": 2,
		"stageTitle": "N4 • Giai đoạn 2/4 - Mua sắm"
	},
	{
		"jp": "割引",
		"romaji": "Waribiki",
		"vi": "Giảm giá / Khuyến mãi",
		"topic": "shopping",
		"track": "n4",
		"example": {
			"jp": "会員カードで10%割引になります。",
			"romaji": "Kaiin kaado de jippaasento waribiki ni narimasu.",
			"vi": "Với thẻ thành viên, bạn sẽ được giảm giá 10%."
		},
		"stage": 2,
		"stageTitle": "N4 • Giai đoạn 2/4 - Mua sắm"
	},
	{
		"jp": "レシート",
		"romaji": "Reshiito",
		"vi": "Hóa đơn biên lai",
		"topic": "shopping",
		"track": "n4",
		"example": {
			"jp": "レシートをいただけますか？",
			"romaji": "Reshiito wo itadakemasu ka?",
			"vi": "Cho tôi xin hóa đơn thanh toán được không ạ?"
		},
		"stage": 2,
		"stageTitle": "N4 • Giai đoạn 2/4 - Mua sắm"
	},
	{
		"jp": "袋",
		"romaji": "Fukuro",
		"vi": "Túi đựng",
		"topic": "shopping",
		"track": "n4",
		"example": {
			"jp": "レジ袋は結構です、マイバッグがあります。",
			"romaji": "Rejibukuro wa kekkou desu, maibaggu ga arimasu.",
			"vi": "Tôi không cần túi nilon ạ, tôi có đem túi riêng rồi."
		},
		"stage": 2,
		"stageTitle": "N4 • Giai đoạn 2/4 - Mua sắm"
	},
	{
		"jp": "家族",
		"romaji": "Kazoku",
		"vi": "Gia đình",
		"topic": "family",
		"track": "n5",
		"example": {
			"jp": "私の家族は4人です。",
			"romaji": "Watashi no kazoku wa yonin desu.",
			"vi": "Gia đình tôi có bốn thành viên."
		},
		"stage": 4,
		"stageTitle": "N5 • Giai đoạn 4/4 - Gia đình"
	},
	{
		"jp": "父",
		"romaji": "Chichi",
		"vi": "Bố (của tôi)",
		"topic": "family",
		"track": "n5",
		"example": {
			"jp": "父は会社員で毎朝早く出勤します。",
			"romaji": "Chichi wa kaishain de maiasa hayaku shutkin shimasu.",
			"vi": "Bố tôi là nhân viên văn phòng, mỗi sáng đều đi làm sớm."
		},
		"stage": 4,
		"stageTitle": "N5 • Giai đoạn 4/4 - Gia đình"
	},
	{
		"jp": "母",
		"romaji": "Haha",
		"vi": "Mẹ (của tôi)",
		"topic": "family",
		"track": "n5",
		"example": {
			"jp": "母の作る料理が一番好きです。",
			"romaji": "Haha no tsukuru ryouri ga ichiban suki desu.",
			"vi": "Tôi thích nhất những món ăn do chính mẹ nấu."
		},
		"stage": 4,
		"stageTitle": "N5 • Giai đoạn 4/4 - Gia đình"
	},
	{
		"jp": "友達",
		"romaji": "Tomodachi",
		"vi": "Bạn bè",
		"topic": "family",
		"track": "n5",
		"example": {
			"jp": "週末に友達と映画を見ました。",
			"romaji": "Shuumatsu ni tomodachi to eiga wo mimashita.",
			"vi": "Cuối tuần tôi cùng bạn đi xem phim."
		},
		"stage": 4,
		"stageTitle": "N5 • Giai đoạn 4/4 - Gia đình"
	},
	{
		"jp": "兄",
		"romaji": "Ani",
		"vi": "Anh trai (của tôi)",
		"topic": "family",
		"track": "n5",
		"example": {
			"jp": "兄は東京の大学に通っています。",
			"romaji": "Ani wa Tokyo no daigaku ni kayotte imasu.",
			"vi": "Anh trai tôi đang theo học đại học ở Tokyo."
		},
		"stage": 4,
		"stageTitle": "N5 • Giai đoạn 4/4 - Gia đình"
	},
	{
		"jp": "妹",
		"romaji": "Imouto",
		"vi": "Em gái (của tôi)",
		"topic": "family",
		"track": "n5",
		"example": {
			"jp": "妹は音楽を聴くことが好きです。",
			"romaji": "Imouto wa ongaku wo kiku koto ga suki desu.",
			"vi": "Em gái tôi rất thích nghe âm nhạc."
		},
		"stage": 4,
		"stageTitle": "N5 • Giai đoạn 4/4 - Gia đình"
	},
	{
		"jp": "両親",
		"romaji": "Ryoushin",
		"vi": "Cha mẹ / Phụ huynh",
		"topic": "family",
		"track": "n5",
		"example": {
			"jp": "休みに両親に手紙を書きました。",
			"romaji": "Yasumi ni ryoushin ni tegami wo kakimashita.",
			"vi": "Vào kỳ nghỉ, tôi đã viết một lá thư gửi cha mẹ."
		},
		"stage": 4,
		"stageTitle": "N5 • Giai đoạn 4/4 - Gia đình"
	},
	{
		"jp": "約束",
		"romaji": "Yakusoku",
		"vi": "Cuộc hẹn / Lời hứa",
		"topic": "family",
		"track": "n5",
		"example": {
			"jp": "今夜大切な約束があります。",
			"romaji": "Konya taisetsuna yakusoku ga arimasu.",
			"vi": "Tối nay tôi có một cuộc hẹn quan trọng."
		},
		"stage": 4,
		"stageTitle": "N5 • Giai đoạn 4/4 - Gia đình"
	},
	{
		"jp": "今日",
		"romaji": "Kyou",
		"vi": "Hôm nay",
		"topic": "numbers",
		"track": "n5",
		"example": {
			"jp": "今日はとても充実した一日でした。",
			"romaji": "Kyou wa totemo juujitsu shita ichinichi deshita.",
			"vi": "Hôm nay là một ngày trọn vẹn và ý nghĩa."
		},
		"stage": 2,
		"stageTitle": "N5 • Giai đoạn 2/4 - Thời gian & Số"
	},
	{
		"jp": "明日",
		"romaji": "Ashita",
		"vi": "Ngày mai",
		"topic": "numbers",
		"track": "n5",
		"example": {
			"jp": "明日日本語のテストがあります。",
			"romaji": "Ashita nihongo no tesuto ga arimasu.",
			"vi": "Ngày mai tôi có bài kiểm tra tiếng Nhật."
		},
		"stage": 2,
		"stageTitle": "N5 • Giai đoạn 2/4 - Thời gian & Số"
	},
	{
		"jp": "時間",
		"romaji": "Jikan",
		"vi": "Thời gian / Giờ giấc",
		"topic": "numbers",
		"track": "n5",
		"example": {
			"jp": "時間を大切に使いましょう。",
			"romaji": "Jikan wo taisetsu ni tsukaimashou.",
			"vi": "Hãy sử dụng thời gian một cách thật trân quý."
		},
		"stage": 2,
		"stageTitle": "N5 • Giai đoạn 2/4 - Thời gian & Số"
	},
	{
		"jp": "一つ",
		"romaji": "Hitotsu",
		"vi": "Một cái (đơn vị)",
		"topic": "numbers",
		"track": "n5",
		"example": {
			"jp": "これを一ついただけますか？",
			"romaji": "Kore wo hitotsu itadakemasu ka?",
			"vi": "Cho tôi xin một cái này được không ạ?"
		},
		"stage": 2,
		"stageTitle": "N5 • Giai đoạn 2/4 - Thời gian & Số"
	},
	{
		"jp": "二つ",
		"romaji": "Futatsu",
		"vi": "Hai cái (đơn vị)",
		"topic": "numbers",
		"track": "n5",
		"example": {
			"jp": "りんごを二つ買いました。",
			"romaji": "Ringo wo futatsu kaimashita.",
			"vi": "Tôi đã mua hai quả táo."
		},
		"stage": 2,
		"stageTitle": "N5 • Giai đoạn 2/4 - Thời gian & Số"
	},
	{
		"jp": "毎日",
		"romaji": "Mainichi",
		"vi": "Mỗi ngày / Hàng ngày",
		"topic": "numbers",
		"track": "n5",
		"example": {
			"jp": "毎日30分日本語を勉強します。",
			"romaji": "Mainichi sanjuppun nihongo wo benkyou shimasu.",
			"vi": "Hàng ngày tôi dành 30 phút để học tiếng Nhật."
		},
		"stage": 2,
		"stageTitle": "N5 • Giai đoạn 2/4 - Thời gian & Số"
	},
	{
		"jp": "来週",
		"romaji": "Raishuu",
		"vi": "Tuần sau",
		"topic": "numbers",
		"track": "n5",
		"example": {
			"jp": "来週から新しいクラスが始まります。",
			"romaji": "Raishuu kara atarashii kurasu ga hajimarimasu.",
			"vi": "Từ tuần sau, lớp học mới sẽ chính thức bắt đầu."
		},
		"stage": 2,
		"stageTitle": "N5 • Giai đoạn 2/4 - Thời gian & Số"
	},
	{
		"jp": "予定",
		"romaji": "Yotei",
		"vi": "Kế hoạch / Dự định",
		"topic": "numbers",
		"track": "n5",
		"example": {
			"jp": "今週末の予定を教えてください。",
			"romaji": "Konshuumatsu no yotei wo oshiete kudasai.",
			"vi": "Hãy chia sẻ cho tôi kế hoạch cuối tuần này của bạn nhé."
		},
		"stage": 2,
		"stageTitle": "N5 • Giai đoạn 2/4 - Thời gian & Số"
	},
	{
		"jp": "会社",
		"romaji": "Kaisha",
		"vi": "Công ty",
		"topic": "work",
		"track": "n4",
		"example": {
			"jp": "毎日地下鉄で会社へ向かいます。",
			"romaji": "Mainichi chikatetsu de kaisha e mukaimasu.",
			"vi": "Mỗi ngày tôi đều đi tàu điện ngầm đến công ty."
		},
		"stage": 3,
		"stageTitle": "N4 • Giai đoạn 3/4 - Công việc"
	},
	{
		"jp": "仕事",
		"romaji": "Shigoto",
		"vi": "Công việc",
		"topic": "work",
		"track": "n4",
		"example": {
			"jp": "今の仕事はとてもやりがいがあります。",
			"romaji": "Ima no shigoto wa totemo yarigai ga arimasu.",
			"vi": "Công việc hiện tại đem lại cho tôi rất nhiều động lực."
		},
		"stage": 3,
		"stageTitle": "N4 • Giai đoạn 3/4 - Công việc"
	},
	{
		"jp": "会議",
		"romaji": "Kaigi",
		"vi": "Cuộc họp",
		"topic": "work",
		"track": "n4",
		"example": {
			"jp": "午後2時から企画会議があります。",
			"romaji": "Gogo niji kara kikaku kaigi ga arimasu.",
			"vi": "Lúc 2 giờ chiều sẽ có một cuộc họp lên kế hoạch."
		},
		"stage": 3,
		"stageTitle": "N4 • Giai đoạn 3/4 - Công việc"
	},
	{
		"jp": "書類",
		"romaji": "Shorui",
		"vi": "Tài liệu / Hồ sơ",
		"topic": "work",
		"track": "n4",
		"example": {
			"jp": "この書類を提出してください。",
			"romaji": "Kono shorui wo teishutsu shite kudasai.",
			"vi": "Xin vui lòng nộp tập tài liệu này."
		},
		"stage": 3,
		"stageTitle": "N4 • Giai đoạn 3/4 - Công việc"
	},
	{
		"jp": "電話",
		"romaji": "Denwa",
		"vi": "Điện thoại / Cuộc gọi",
		"topic": "work",
		"track": "n4",
		"example": {
			"jp": "お客様から電話がありました。",
			"romaji": "Okyakusama kara denwa ga arimashita.",
			"vi": "Vừa có cuộc điện thoại gọi đến từ khách hàng."
		},
		"stage": 3,
		"stageTitle": "N4 • Giai đoạn 3/4 - Công việc"
	},
	{
		"jp": "休憩",
		"romaji": "Kyuukei",
		"vi": "Nghỉ ngơi / Giải lao",
		"topic": "work",
		"track": "n4",
		"example": {
			"jp": "10分間休憩しましょう。",
			"romaji": "Juppunkan kyuukei shimashou.",
			"vi": "Chúng ta cùng nghỉ giải lao khoảng 10 phút nhé."
		},
		"stage": 3,
		"stageTitle": "N4 • Giai đoạn 3/4 - Công việc"
	},
	{
		"jp": "連絡",
		"romaji": "Renraku",
		"vi": "Liên lạc / Thông báo",
		"topic": "work",
		"track": "n4",
		"example": {
			"jp": "決まり次第メールでご連絡します。",
			"romaji": "Kimari shidai meeru de gorenraku shimasu.",
			"vi": "Ngay khi có quyết định, tôi sẽ liên lạc qua thư điện tử."
		},
		"stage": 3,
		"stageTitle": "N4 • Giai đoạn 3/4 - Công việc"
	},
	{
		"jp": "準備",
		"romaji": "Junbi",
		"vi": "Chuẩn bị",
		"topic": "work",
		"track": "n4",
		"example": {
			"jp": "明日のプレゼンの準備を終えました。",
			"romaji": "Ashita no purezen no junbi wo oemashita.",
			"vi": "Tôi đã hoàn thành công tác chuẩn bị cho buổi thuyết trình ngày mai."
		},
		"stage": 3,
		"stageTitle": "N4 • Giai đoạn 3/4 - Công việc"
	},
	{
		"jp": "天気",
		"romaji": "Tenki",
		"vi": "Thời tiết",
		"topic": "weather",
		"track": "n4",
		"example": {
			"jp": "今日の天気予報を見ましたか？",
			"romaji": "Kyou no tenki yohou wo mimashita ka?",
			"vi": "Bạn đã xem bản tin dự báo thời tiết hôm nay chưa?"
		},
		"stage": 4,
		"stageTitle": "N4 • Giai đoạn 4/4 - Thời tiết"
	},
	{
		"jp": "雨",
		"romaji": "Ame",
		"vi": "Mưa",
		"topic": "weather",
		"track": "n4",
		"example": {
			"jp": "傘を持って出かけましょう、雨が降ります。",
			"romaji": "Kasa wo motte dekakemashou, ame ga furimasu.",
			"vi": "Hãy đem theo ô khi ra ngoài nhé, trời sắp mưa đấy."
		},
		"stage": 4,
		"stageTitle": "N4 • Giai đoạn 4/4 - Thời tiết"
	},
	{
		"jp": "晴れ",
		"romaji": "Hare",
		"vi": "Nắng ráo / Trong xanh",
		"topic": "weather",
		"track": "n4",
		"example": {
			"jp": "青空が広がって気持ちの良い晴れです。",
			"romaji": "Aozora ga hirogatte kimochi no yoi hare desu.",
			"vi": "Bầu trời xanh trong, hôm nay là ngày nắng thật dễ chịu."
		},
		"stage": 4,
		"stageTitle": "N4 • Giai đoạn 4/4 - Thời tiết"
	},
	{
		"jp": "暑い",
		"romaji": "Atsui",
		"vi": "Nóng bức (thời tiết)",
		"topic": "weather",
		"track": "n4",
		"example": {
			"jp": "今年の夏は特に暑いです。",
			"romaji": "Kotoshi no natsu wa tokuni atsui desu.",
			"vi": "Mùa hè năm nay thời tiết đặc biệt nóng bức."
		},
		"stage": 4,
		"stageTitle": "N4 • Giai đoạn 4/4 - Thời tiết"
	},
	{
		"jp": "寒い",
		"romaji": "Samui",
		"vi": "Lạnh buốt (thời tiết)",
		"topic": "weather",
		"track": "n4",
		"example": {
			"jp": "外は風が強くてとても寒いです。",
			"romaji": "Soto wa kaze ga tsuyokute totemo samui desu.",
			"vi": "Bên ngoài gió to và rất lạnh buốt."
		},
		"stage": 4,
		"stageTitle": "N4 • Giai đoạn 4/4 - Thời tiết"
	},
	{
		"jp": "雪",
		"romaji": "Yuki",
		"vi": "Tuyết rơi",
		"topic": "weather",
		"track": "n4",
		"example": {
			"jp": "冬になると山に白い雪が積もります。",
			"romaji": "Fuyu ni naru to yama ni shiroi yuki ga tsumorimasu.",
			"vi": "Khi mùa đông đến, tuyết trắng phủ dày khắp đỉnh núi."
		},
		"stage": 4,
		"stageTitle": "N4 • Giai đoạn 4/4 - Thời tiết"
	},
	{
		"jp": "季節",
		"romaji": "Kisetsu",
		"vi": "Mùa trong năm",
		"topic": "weather",
		"track": "n4",
		"example": {
			"jp": "日本には四季という四つの季節があります。",
			"romaji": "Nihon ni wa shiki to iu yottsu no kisetsu ga arimasu.",
			"vi": "Nước Nhật có bốn mùa rất rõ nét."
		},
		"stage": 4,
		"stageTitle": "N4 • Giai đoạn 4/4 - Thời tiết"
	},
	{
		"jp": "気温",
		"romaji": "Kion",
		"vi": "Nhiệt độ không khí",
		"topic": "weather",
		"track": "n4",
		"example": {
			"jp": "今日の最高気温は25度です。",
			"romaji": "Kyou no saikou kion wa nijuugodo desu.",
			"vi": "Nhiệt độ cao nhất trong ngày hôm nay là 25 độ C."
		},
		"stage": 4,
		"stageTitle": "N4 • Giai đoạn 4/4 - Thời tiết"
	}
];

// Expanded 24-item Communication Sentences across 8 topics
const SENTENCES = [
	{
		"jp": "おはようございます。",
		"vi": "Chào buổi sáng tốt lành.",
		"topic": "greetings",
		"track": "n5",
		"stage": 1,
		"stageTitle": "N5 • Giai đoạn 1/4 - Chào hỏi"
	},
	{
		"jp": "お元気ですか？",
		"vi": "Dạo này bạn có khỏe không?",
		"topic": "greetings",
		"track": "n5",
		"stage": 1,
		"stageTitle": "N5 • Giai đoạn 1/4 - Chào hỏi"
	},
	{
		"jp": "失礼いたします。",
		"vi": "Xin phép làm phiền / Xin phép vào.",
		"topic": "greetings",
		"track": "n5",
		"stage": 1,
		"stageTitle": "N5 • Giai đoạn 1/4 - Chào hỏi"
	},
	{
		"jp": "いただきます。",
		"vi": "Tôi xin phép dùng bữa.",
		"topic": "dining",
		"track": "n5",
		"stage": 3,
		"stageTitle": "N5 • Giai đoạn 3/4 - Ăn uống"
	},
	{
		"jp": "ごちそうさまでした。",
		"vi": "Cảm ơn vì bữa ăn rất ngon.",
		"topic": "dining",
		"track": "n5",
		"stage": 3,
		"stageTitle": "N5 • Giai đoạn 3/4 - Ăn uống"
	},
	{
		"jp": "お水を一杯いただけますか？",
		"vi": "Cho tôi xin một ly nước được không ạ?",
		"topic": "dining",
		"track": "n5",
		"stage": 3,
		"stageTitle": "N5 • Giai đoạn 3/4 - Ăn uống"
	},
	{
		"jp": "一番近い駅はどこですか？",
		"vi": "Nhà ga gần nhất nằm ở đâu ạ?",
		"topic": "transportation",
		"track": "n4",
		"stage": 1,
		"stageTitle": "N4 • Giai đoạn 1/4 - Giao thông"
	},
	{
		"jp": "切符はどこで買えますか？",
		"vi": "Tôi có thể mua vé ở đâu?",
		"topic": "transportation",
		"track": "n4",
		"stage": 1,
		"stageTitle": "N4 • Giai đoạn 1/4 - Giao thông"
	},
	{
		"jp": "東京駅までどのくらいかかりますか？",
		"vi": "Đến ga Tokyo mất khoảng bao lâu?",
		"topic": "transportation",
		"track": "n4",
		"stage": 1,
		"stageTitle": "N4 • Giai đoạn 1/4 - Giao thông"
	},
	{
		"jp": "これはいくらですか？",
		"vi": "Cái này giá bao nhiêu tiền vậy?",
		"topic": "shopping",
		"track": "n4",
		"stage": 2,
		"stageTitle": "N4 • Giai đoạn 2/4 - Mua sắm"
	},
	{
		"jp": "これをお願いします。",
		"vi": "Làm ơn lấy cho tôi món này.",
		"topic": "shopping",
		"track": "n4",
		"stage": 2,
		"stageTitle": "N4 • Giai đoạn 2/4 - Mua sắm"
	},
	{
		"jp": "カードで支払うことはできますか？",
		"vi": "Tôi có thể thanh toán bằng thẻ được không?",
		"topic": "shopping",
		"track": "n4",
		"stage": 2,
		"stageTitle": "N4 • Giai đoạn 2/4 - Mua sắm"
	},
	{
		"jp": "ご家族はお元気ですか？",
		"vi": "Gia đình bạn vẫn khỏe chứ?",
		"topic": "family",
		"track": "n5",
		"stage": 4,
		"stageTitle": "N5 • Giai đoạn 4/4 - Gia đình"
	},
	{
		"jp": "両親は故郷に住んでいます。",
		"vi": "Bố mẹ tôi hiện đang sống ở quê nhà.",
		"topic": "family",
		"track": "n5",
		"stage": 4,
		"stageTitle": "N5 • Giai đoạn 4/4 - Gia đình"
	},
	{
		"jp": "また遊びに来てくださいね。",
		"vi": "Lần sau hãy lại ghé chơi nhé.",
		"topic": "family",
		"track": "n5",
		"stage": 4,
		"stageTitle": "N5 • Giai đoạn 4/4 - Gia đình"
	},
	{
		"jp": "今、何時何分ですか？",
		"vi": "Bây giờ là mấy giờ mấy phút rồi?",
		"topic": "numbers",
		"track": "n5",
		"stage": 2,
		"stageTitle": "N5 • Giai đoạn 2/4 - Thời gian & Số"
	},
	{
		"jp": "来週の月曜日に会いましょう。",
		"vi": "Hẹn gặp bạn vào thứ Hai tuần tới nhé.",
		"topic": "numbers",
		"track": "n5",
		"stage": 2,
		"stageTitle": "N5 • Giai đoạn 2/4 - Thời gian & Số"
	},
	{
		"jp": "少し時間がかかります。",
		"vi": "Sẽ mất một chút thời gian đấy.",
		"topic": "numbers",
		"track": "n5",
		"stage": 2,
		"stageTitle": "N5 • Giai đoạn 2/4 - Thời gian & Số"
	},
	{
		"jp": "お疲れ様でした。",
		"vi": "Mọi người đã vất vả nhiều rồi.",
		"topic": "work",
		"track": "n4",
		"stage": 3,
		"stageTitle": "N4 • Giai đoạn 3/4 - Công việc"
	},
	{
		"jp": "確認して折り返し連絡します。",
		"vi": "Tôi sẽ kiểm tra rồi liên lạc lại ngay.",
		"topic": "work",
		"track": "n4",
		"stage": 3,
		"stageTitle": "N4 • Giai đoạn 3/4 - Công việc"
	},
	{
		"jp": "資料をメールで送付しました。",
		"vi": "Tôi đã gửi tài liệu qua thư điện tử rồi.",
		"topic": "work",
		"track": "n4",
		"stage": 3,
		"stageTitle": "N4 • Giai đoạn 3/4 - Công việc"
	},
	{
		"jp": "今日はとても良い天気ですね。",
		"vi": "Hôm nay thời tiết đẹp quá nhỉ.",
		"topic": "weather",
		"track": "n4",
		"stage": 4,
		"stageTitle": "N4 • Giai đoạn 4/4 - Thời tiết"
	},
	{
		"jp": "明日は雨が降るそうです。",
		"vi": "Nghe nói ngày mai trời sẽ đổ mưa.",
		"topic": "weather",
		"track": "n4",
		"stage": 4,
		"stageTitle": "N4 • Giai đoạn 4/4 - Thời tiết"
	},
	{
		"jp": "寒くなりましたのでお体に気をつけて。",
		"vi": "Trời trở lạnh rồi, bạn nhớ giữ gìn sức khỏe nhé.",
		"topic": "weather",
		"track": "n4",
		"stage": 4,
		"stageTitle": "N4 • Giai đoạn 4/4 - Thời tiết"
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

// Lightweight Native Web Audio Sound Effects (0 External Dependencies)
const soundEffects = {
	ctx: null,
	enabled: true,
	init() {
		if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
			const AudioCtx = window.AudioContext || window.webkitAudioContext;
			this.ctx = new AudioCtx();
		}
	},
	play(type) {
		if (!this.enabled) return;
		try {
			this.init();
			if (!this.ctx) return;
			if (this.ctx.state === 'suspended') {
				this.ctx.resume();
			}
			const now = this.ctx.currentTime;

			if (type === 'correct') {
				// Harmonic two-tone chime (587Hz D5 -> 880Hz A5)
				const osc1 = this.ctx.createOscillator();
				const osc2 = this.ctx.createOscillator();
				const gain = this.ctx.createGain();

				osc1.type = 'sine';
				osc2.type = 'sine';
				osc1.frequency.setValueAtTime(587.33, now);
				osc1.frequency.setValueAtTime(880.00, now + 0.1);
				osc2.frequency.setValueAtTime(880.00, now);
				osc2.frequency.setValueAtTime(1174.66, now + 0.1);

				gain.gain.setValueAtTime(0.12, now);
				gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

				osc1.connect(gain);
				osc2.connect(gain);
				gain.connect(this.ctx.destination);

				osc1.start(now);
				osc2.start(now);
				osc1.stop(now + 0.35);
				osc2.stop(now + 0.35);
			} else if (type === 'wrong') {
				// Soft low buzzer (220Hz -> 140Hz)
				const osc = this.ctx.createOscillator();
				const gain = this.ctx.createGain();

				osc.type = 'triangle';
				osc.frequency.setValueAtTime(220, now);
				osc.frequency.linearRampToValueAtTime(140, now + 0.25);

				gain.gain.setValueAtTime(0.15, now);
				gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

				osc.connect(gain);
				gain.connect(this.ctx.destination);

				osc.start(now);
				osc.stop(now + 0.25);
			} else if (type === 'flip') {
				// Clean gentle click
				const osc = this.ctx.createOscillator();
				const gain = this.ctx.createGain();

				osc.type = 'sine';
				osc.frequency.setValueAtTime(440, now);
				osc.frequency.exponentialRampToValueAtTime(220, now + 0.06);

				gain.gain.setValueAtTime(0.06, now);
				gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

				osc.connect(gain);
				gain.connect(this.ctx.destination);

				osc.start(now);
				osc.stop(now + 0.06);
			} else if (type === 'level-up') {
				// Ascending celebration arpeggio
				[523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
					const osc = this.ctx.createOscillator();
					const gain = this.ctx.createGain();
					const noteTime = now + (i * 0.08);

					osc.type = 'sine';
					osc.frequency.setValueAtTime(freq, noteTime);

					gain.gain.setValueAtTime(0.1, noteTime);
					gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.25);

					osc.connect(gain);
					gain.connect(this.ctx.destination);

					osc.start(noteTime);
					osc.stop(noteTime + 0.25);
				});
			}
		} catch (e) {
			// AudioContext not supported or restricted, ignore
		}
	}
};

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

	// update hero weak count and badge
	const heroWeakEl = document.getElementById("hero-weak-count");
	const weakBadgeEl = document.getElementById("weak-badge-count");
	const weakCount = (state.user && state.user.weakWords) ? state.user.weakWords.length : 0;
	if (heroWeakEl) heroWeakEl.textContent = String(weakCount);
	if (weakBadgeEl) weakBadgeEl.textContent = `${weakCount} từ`;
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
	if (state.isWeakDrillMode) {
		const weakSet = new Set((state.user && state.user.weakWords) || []);
		return FLASHCARDS.filter(f => {
			const matchWeak = weakSet.has(f.jp);
			const matchTrack = state.selectedTrack === "all" || f.track === state.selectedTrack;
			return matchWeak && matchTrack;
		});
	}
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
	const n5Card = document.getElementById("track-card-n5");
	const n4Card = document.getElementById("track-card-n4");
	const allBtn = document.getElementById("track-btn-all");
	if (n5Card) n5Card.classList.toggle("active", state.selectedTrack === "n5");
	if (n4Card) n4Card.classList.toggle("active", state.selectedTrack === "n4");
	if (allBtn) allBtn.classList.toggle("active", state.selectedTrack === "all");

	document.querySelectorAll("#fc-topic-selector .topic-card").forEach(card => {
		const topic = card.getAttribute("data-fc-topic");
		const track = card.getAttribute("data-track");
		const countEl = card.querySelector(".topic-count");
		
		if (state.selectedTrack === "all" || track === state.selectedTrack) {
			card.style.display = "flex";
		} else {
			card.style.display = "none";
		}

		if (topic && countEl) {
			const count = FLASHCARDS.filter(f => f.topic === topic).length;
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
			if (data.weakWords) state.user.weakWords = data.weakWords;
			saveUser();
			updateHeaderStats();
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
	if (name === 'weakwords') {
		renderWeakWordsView();
	}
	if (name !== 'flashcards') {
		state.isWeakDrillMode = false;
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
		trackBadge.textContent = data.stageTitle ? `[${data.stageTitle}]` : (data.track === "n5" ? "[JLPT N5 • SƠ CẤP]" : "[JLPT N4 • TRUNG CẤP]");
		trackBadge.className = "fc-track-badge " + (data.track === "n5" ? "badge-beginner" : "badge-advanced");
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
	return SENTENCES.filter(s => {
		const matchTopic = !state.selectedSnTopic || s.topic === state.selectedSnTopic;
		const matchTrack = state.selectedSnTrack === "all" || s.track === state.selectedSnTrack;
		return matchTopic && matchTrack;
	});
}

function updateSentenceTopicCounts() {
	const n5Card = document.getElementById("sn-track-card-n5");
	const n4Card = document.getElementById("sn-track-card-n4");
	const allBtn = document.getElementById("sn-track-btn-all");
	if (n5Card) n5Card.classList.toggle("active", state.selectedSnTrack === "n5");
	if (n4Card) n4Card.classList.toggle("active", state.selectedSnTrack === "n4");
	if (allBtn) allBtn.classList.toggle("active", state.selectedSnTrack === "all");

	document.querySelectorAll("#sn-topic-selector .topic-card").forEach(card => {
		const topic = card.getAttribute("data-sn-topic");
		const track = card.getAttribute("data-track");
		const countEl = card.querySelector(".topic-count");

		if (state.selectedSnTrack === "all" || track === state.selectedSnTrack) {
			card.style.display = "flex";
		} else {
			card.style.display = "none";
		}

		if (topic && countEl) {
			const count = SENTENCES.filter(s => s.topic === topic).length;
			countEl.textContent = `${count} mẫu câu`;
		}
	});
}

function resetSentenceView() {
	state.selectedSnTopic = null;
	const sel = document.getElementById("sn-topic-selector");
	const study = document.getElementById("sn-study-container");
	const title = document.getElementById("sn-title");
	if (sel) sel.style.display = "block";
	if (study) study.style.display = "none";
	if (title) title.textContent = "Mẫu câu thông dụng";
	updateSentenceTopicCounts();
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

	const trackBadge = document.getElementById("sn-track-badge");
	if (trackBadge) {
		trackBadge.textContent = data.stageTitle ? `[${data.stageTitle}]` : (data.track === "n5" ? "[JLPT N5 • SƠ CẤP]" : "[JLPT N4 • TRUNG CẤP]");
		trackBadge.className = "fc-track-badge " + (data.track === "n5" ? "badge-beginner" : "badge-advanced");
	}
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

// ========================================================
// JLPT MOCK EXAM SIMULATOR & DIGITAL CERTIFICATE
// ========================================================
let examData = {
	track: "n5",
	questions: [],
	currentIndex: 0,
	timerInterval: null,
	timeRemaining: 900, // 15 mins = 900s
	isSubmitted: false,
	score: 0
};

function generateExamQuestions(track = "n5") {
	const wordsPool = FLASHCARDS.filter(f => f.track === track);
	const sentencesPool = SENTENCES.filter(s => s.track === track);
	const questions = [];

	// Part 1: 10 Vocabulary Questions
	const shuffledWords = [...wordsPool];
	shuffle(shuffledWords);
	const chosenWords = shuffledWords.slice(0, 10);

	chosenWords.forEach((item, idx) => {
		const isJpToVi = idx % 2 === 0;
		const others = FLASHCARDS.filter(w => w.jp !== item.jp);
		shuffle(others);

		if (isJpToVi) {
			const options = [item.vi, others[0].vi, others[1].vi, others[2].vi];
			shuffle(options);
			questions.push({
				id: idx + 1,
				type: "vocab",
				typeName: "Từ vựng • Nghĩa từ vựng",
				prompt: `Từ 「${item.jp}」 có nghĩa tiếng Việt là gì?`,
				sub: `Phiên âm Romaji: ${item.romaji}`,
				targetWord: item.jp,
				options,
				correctIndex: options.indexOf(item.vi),
				correctAnswer: item.vi,
				userAnswer: null,
				flagged: false,
				explanation: `「${item.jp}」 (${item.romaji}) nghĩa là: ${item.vi}.`
			});
		} else {
			const options = [item.jp, others[0].jp, others[1].jp, others[2].jp];
			shuffle(options);
			questions.push({
				id: idx + 1,
				type: "vocab",
				typeName: "Từ vựng • Chữ viết Kanji / Kana",
				prompt: `Nghĩa 「${item.vi}」 trong tiếng Nhật viết là gì?`,
				sub: `Phiên âm: ${item.romaji}`,
				targetWord: item.jp,
				options,
				correctIndex: options.indexOf(item.jp),
				correctAnswer: item.jp,
				userAnswer: null,
				flagged: false,
				explanation: `「${item.jp}」 (${item.romaji}) tương ứng với nghĩa: ${item.vi}.`
			});
		}
	});

	// Part 2: 10 Sentence / Grammar Questions
	const sentenceCandidates = [...sentencesPool];
	wordsPool.forEach(w => {
		if (w.example && w.example.jp) {
			sentenceCandidates.push({ jp: w.example.jp, vi: w.example.vi, topic: w.topic, track: w.track });
		}
	});
	shuffle(sentenceCandidates);
	const chosenSentences = sentenceCandidates.slice(0, 10);

	chosenSentences.forEach((item, idx) => {
		const qId = 11 + idx;
		const others = sentenceCandidates.filter(s => s.jp !== item.jp);
		shuffle(others);

		const options = [item.vi, others[0].vi, others[1].vi, others[2].vi];
		shuffle(options);
		questions.push({
			id: qId,
			type: "sentence",
			typeName: "Ngữ pháp & Mẫu câu ngữ cảnh",
			prompt: `Ý nghĩa đúng của câu sau là gì: 「${item.jp}」`,
			sub: `Hội thoại tình huống giao tiếp chuẩn`,
			options,
			correctIndex: options.indexOf(item.vi),
			correctAnswer: item.vi,
			userAnswer: null,
			flagged: false,
			explanation: `Câu hoàn chỉnh: 「${item.jp}」 mang nghĩa: "${item.vi}".`
		});
	});

	return questions;
}

function resetExamView() {
	clearInterval(examData.timerInterval);
	const lobby = document.getElementById("exam-lobby-container");
	const live = document.getElementById("exam-live-container");
	const result = document.getElementById("exam-result-container");
	if (lobby) lobby.style.display = "block";
	if (live) live.style.display = "none";
	if (result) result.style.display = "none";
}

function startExam(track = "n5") {
	clearInterval(examData.timerInterval);
	examData.track = track;
	examData.questions = generateExamQuestions(track);
	examData.currentIndex = 0;
	examData.timeRemaining = 900; // 15 mins
	examData.isSubmitted = false;
	examData.score = 0;

	const lobby = document.getElementById("exam-lobby-container");
	const live = document.getElementById("exam-live-container");
	const result = document.getElementById("exam-result-container");
	if (lobby) lobby.style.display = "none";
	if (live) live.style.display = "block";
	if (result) result.style.display = "none";

	const badge = document.getElementById("exam-live-badge");
	if (badge) {
		badge.textContent = track === "n5" ? "[JLPT N5 EXAM]" : "[JLPT N4 EXAM]";
		badge.className = "fc-track-badge " + (track === "n5" ? "badge-beginner" : "badge-advanced");
	}

	renderExamQuestion(0);
	renderExamPalette();
	startExamTimer();
}

function startExamTimer() {
	clearInterval(examData.timerInterval);
	updateExamTimerDisplay();

	examData.timerInterval = setInterval(() => {
		examData.timeRemaining--;
		updateExamTimerDisplay();

		if (examData.timeRemaining <= 0) {
			clearInterval(examData.timerInterval);
			submitExam(true);
		}
	}, 1000);
}

function updateExamTimerDisplay() {
	const mins = Math.floor(examData.timeRemaining / 60);
	const secs = examData.timeRemaining % 60;
	const txt = document.getElementById("exam-timer-text");
	const badge = document.getElementById("exam-timer-display");
	if (txt) txt.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
	if (badge) {
		if (examData.timeRemaining <= 120) {
			badge.className = "exam-timer-badge";
		} else {
			badge.className = "exam-timer-badge normal";
		}
	}
}

function renderExamQuestion(index) {
	if (index < 0 || index >= examData.questions.length) return;
	examData.currentIndex = index;
	const q = examData.questions[index];

	const progressEl = document.getElementById("exam-live-progress");
	if (progressEl) progressEl.textContent = `Câu ${index + 1} / ${examData.questions.length}`;

	const typeEl = document.getElementById("exam-q-type");
	if (typeEl) {
		typeEl.textContent = q.typeName;
		typeEl.className = `exam-q-type ${q.type}`;
	}

	const promptEl = document.getElementById("exam-q-prompt");
	if (promptEl) promptEl.textContent = q.prompt;

	const subEl = document.getElementById("exam-q-sub");
	if (subEl) subEl.textContent = q.sub;

	const flagBtn = document.getElementById("btn-exam-flag");
	const flagText = document.getElementById("btn-flag-text");
	if (flagBtn) {
		flagBtn.classList.toggle("active", Boolean(q.flagged));
		if (flagText) flagText.textContent = q.flagged ? "Đã đặt cờ" : "Đặt cờ xem lại";
	}

	const optsContainer = document.getElementById("exam-options-list");
	if (optsContainer) {
		optsContainer.innerHTML = "";
		const keys = ["A", "B", "C", "D"];
		q.options.forEach((optText, optIdx) => {
			const btn = document.createElement("button");
			btn.type = "button";
			btn.className = "exam-opt-btn" + (q.userAnswer === optIdx ? " selected" : "");
			btn.innerHTML = `
				<span class="exam-opt-key">${keys[optIdx]}</span>
				<span>${optText}</span>
			`;
			btn.addEventListener("click", () => {
				q.userAnswer = optIdx;
				soundEffects.play("flip");
				renderExamQuestion(examData.currentIndex);
				renderExamPalette();
			});
			optsContainer.appendChild(btn);
		});
	}

	const btnPrev = document.getElementById("btn-exam-prev");
	const btnNext = document.getElementById("btn-exam-next");
	if (btnPrev) btnPrev.style.visibility = index === 0 ? "hidden" : "visible";
	if (btnNext) btnNext.textContent = index === examData.questions.length - 1 ? "Xem lại bài" : "Câu tiếp theo →";
}

function renderExamPalette() {
	const grid = document.getElementById("exam-palette-grid");
	if (!grid) return;
	grid.innerHTML = "";

	let answeredCount = 0;
	examData.questions.forEach((q, idx) => {
		if (q.userAnswer !== null) answeredCount++;
		const btn = document.createElement("button");
		btn.type = "button";
		btn.className = "palette-btn";
		btn.textContent = String(idx + 1);

		if (idx === examData.currentIndex) btn.classList.add("current");
		if (q.userAnswer !== null) btn.classList.add("answered");
		if (q.flagged) btn.classList.add("flagged");

		btn.addEventListener("click", () => {
			renderExamQuestion(idx);
			renderExamPalette();
		});
		grid.appendChild(btn);
	});

	const countTxt = document.getElementById("palette-count-text");
	if (countTxt) countTxt.textContent = `${answeredCount}/${examData.questions.length} đã làm`;
}

function toggleExamFlag() {
	const q = examData.questions[examData.currentIndex];
	if (!q) return;
	q.flagged = !q.flagged;
	renderExamQuestion(examData.currentIndex);
	renderExamPalette();
}

function submitExam(isAuto = false) {
	if (!isAuto) {
		const unanswered = examData.questions.filter(q => q.userAnswer === null).length;
		let confirmMsg = "Bạn có chắc chắn muốn nộp bài thi ngay bây giờ?";
		if (unanswered > 0) {
			confirmMsg = `Bạn còn ${unanswered} câu chưa trả lời. Bạn có chắc chắn muốn nộp bài không?`;
		}
		if (!confirm(confirmMsg)) return;
	}

	clearInterval(examData.timerInterval);
	examData.isSubmitted = true;

	let correctCount = 0;
	examData.questions.forEach(q => {
		if (q.userAnswer === q.correctIndex) {
			correctCount++;
		} else {
			if (q.type === "vocab" && q.targetWord) {
				addWeakWord(q.targetWord);
			}
		}
	});
	examData.score = correctCount;

	const isPass = correctCount >= 12;
	if (isPass) {
		soundEffects.play("level-up");
		addPoints(examData.track === "n5" ? 100 : 150, `Vượt qua kỳ thi thử JLPT ${examData.track.toUpperCase()}`);
	} else {
		soundEffects.play("wrong");
		addPoints(20, `Tham gia kỳ thi thử JLPT ${examData.track.toUpperCase()}`);
	}

	showExamResults();
}

function showExamResults() {
	document.getElementById("exam-lobby-container").style.display = "none";
	document.getElementById("exam-live-container").style.display = "none";
	document.getElementById("exam-result-container").style.display = "block";

	const score = examData.score;
	const isPass = score >= 12;
	const candidateName = (state.user && state.user.name) ? state.user.name : (state.name || "HỌC VIÊN NIHONGO");
	const trackName = examData.track === "n5" ? "JLPT N5 (SƠ CẤP)" : "JLPT N4 (TRUNG CẤP)";

	let rating = "CHƯA ĐẠT";
	if (score >= 18) rating = "XUẤT SẮC (S)";
	else if (score >= 15) rating = "GIỎI (A)";
	else if (score >= 12) rating = "ĐẠT CHUẨN (PASS)";

	const certName = document.getElementById("cert-candidate-name");
	if (certName) certName.textContent = candidateName.toUpperCase();

	const certScore = document.getElementById("cert-score-val");
	if (certScore) certScore.textContent = `${score} / 20 (${Math.round((score / 20) * 100)}%)`;

	const certLevel = document.getElementById("cert-level-val");
	if (certLevel) certLevel.textContent = trackName;

	const certRating = document.getElementById("cert-rating-val");
	if (certRating) {
		certRating.textContent = rating;
		certRating.style.color = isPass ? "#10b981" : "#ef4444";
	}

	const certCode = document.getElementById("cert-code-val");
	if (certCode) {
		const randomCode = Math.floor(10000 + Math.random() * 90000);
		certCode.textContent = `CERT-${examData.track.toUpperCase()}-${randomCode}`;
	}

	const certDate = document.getElementById("cert-date-val");
	if (certDate) {
		const now = new Date();
		certDate.textContent = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
	}

	const certDesc = document.getElementById("cert-desc-text");
	if (certDesc) {
		certDesc.textContent = isPass
			? `Đã hoàn thành xuất sắc kỳ thi mô phỏng chuẩn hóa quốc tế ${trackName}, đạt tiêu chuẩn kiến thức từ vựng và ngữ pháp phản xạ giao tiếp.`
			: `Đã tham gia kỳ thi mô phỏng chuẩn hóa quốc tế ${trackName}. Hãy tiếp tục rèn luyện từ vựng và ôn tập để vượt qua bài thi ở lần kế tiếp!`;
	}

	renderExamReviewList();
}

function renderExamReviewList() {
	const container = document.getElementById("exam-review-list");
	if (!container) return;
	container.innerHTML = "";

	const keys = ["A", "B", "C", "D"];
	examData.questions.forEach((q, idx) => {
		const isCorrect = q.userAnswer === q.correctIndex;
		const userAnsText = q.userAnswer !== null ? `${keys[q.userAnswer]}. ${q.options[q.userAnswer]}` : "Chưa trả lời";
		const correctAnsText = `${keys[q.correctIndex]}. ${q.options[q.correctIndex]}`;

		const item = document.createElement("div");
		item.style.cssText = `background:var(--card); border:1px solid ${isCorrect ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}; border-radius:12px; padding:16px; text-align:left;`;
		item.innerHTML = `
			<div style="display:flex; justify-content:space-between; margin-bottom:8px;">
				<strong style="color:var(--text);">Câu ${idx + 1}: ${q.prompt}</strong>
				<span style="font-size:12px; font-weight:700; color:${isCorrect ? '#10b981' : '#ef4444'};">
					${isCorrect ? 'Chính xác (+1)' : 'Sai / Chưa đạt'}
				</span>
			</div>
			<div style="font-size:13px; color:var(--muted); margin-bottom:6px;">Lựa chọn của bạn: <b style="color:${isCorrect ? '#10b981' : '#ef4444'};">${userAnsText}</b></div>
			<div style="font-size:13px; color:#10b981; margin-bottom:6px;">Đáp án đúng: <b>${correctAnsText}</b></div>
			<div style="font-size:12px; color:var(--muted); font-style:italic; background:var(--panel); padding:8px 12px; border-radius:6px; margin-top:6px;">
				Giải thích: ${q.explanation}
			</div>
		`;
		container.appendChild(item);
	});
}


// ========================================================
// SPACED REPETITION / WEAK WORDS SYSTEM
// ========================================================
function addWeakWord(wordJp) {
	if (!state.user) return;
	if (!state.user.weakWords) state.user.weakWords = [];
	if (!state.user.weakWords.includes(wordJp)) {
		state.user.weakWords.push(wordJp);
	}
	if (state.user.memorizedWords) {
		const mIdx = state.user.memorizedWords.indexOf(wordJp);
		if (mIdx > -1) state.user.memorizedWords.splice(mIdx, 1);
	}
	saveUser();
	updateHeaderStats();
	
	fetch('/api/users/add-weak-word', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email: state.user.email, word: wordJp })
	}).then(res => res.json()).then(data => {
		if (data.success) {
			state.user.weakWords = data.weakWords;
			state.user.memorizedWords = data.memorizedWords;
			saveUser();
			updateHeaderStats();
		}
	}).catch(() => {});
}

function removeWeakWord(wordJp) {
	if (!state.user) return;
	if (state.user.weakWords) {
		const idx = state.user.weakWords.indexOf(wordJp);
		if (idx > -1) state.user.weakWords.splice(idx, 1);
	}
	saveUser();
	updateHeaderStats();
	renderWeakWordsView();
	
	fetch('/api/users/remove-weak-word', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email: state.user.email, word: wordJp })
	}).then(res => res.json()).then(data => {
		if (data.success) {
			state.user.weakWords = data.weakWords;
			saveUser();
			updateHeaderStats();
			renderWeakWordsView();
		}
	}).catch(() => {});
}

function renderWeakWordsView() {
	const userWeakList = (state.user && state.user.weakWords) || [];
	const weakSet = new Set(userWeakList);
	const weakCards = FLASHCARDS.filter(f => weakSet.has(f.jp));

	const totalCount = weakCards.length;
	const n5Count = weakCards.filter(f => f.track === "n5").length;
	const n4Count = weakCards.filter(f => f.track === "n4").length;

	const allCountEl = document.getElementById("weak-filter-all-count");
	const n5CountEl = document.getElementById("weak-filter-n5-count");
	const n4CountEl = document.getElementById("weak-filter-n4-count");
	if (allCountEl) allCountEl.textContent = totalCount;
	if (n5CountEl) n5CountEl.textContent = n5Count;
	if (n4CountEl) n4CountEl.textContent = n4Count;

	const drillBtn = document.getElementById("btn-weak-drill");
	const emptyBox = document.getElementById("weak-words-empty");
	const grid = document.getElementById("weak-words-grid");

	if (totalCount === 0) {
		if (drillBtn) drillBtn.style.display = "none";
		if (emptyBox) emptyBox.style.display = "block";
		if (grid) grid.innerHTML = "";
		return;
	}

	if (drillBtn) drillBtn.style.display = "inline-flex";
	if (emptyBox) emptyBox.style.display = "none";

	const filtered = weakCards.filter(f => {
		if (state.weakFilter === "n5") return f.track === "n5";
		if (state.weakFilter === "n4") return f.track === "n4";
		return true;
	});

	if (grid) {
		grid.innerHTML = filtered.map(card => {
			const trackBadge = card.track === "n5" 
				? '<span class="fc-track-badge badge-beginner" style="font-size:10.5px; padding:2px 7px;">[JLPT N5]</span>' 
				: '<span class="fc-track-badge badge-advanced" style="font-size:10.5px; padding:2px 7px;">[JLPT N4]</span>';
			
			return `
				<div class="weak-card" data-word="${card.jp}">
					<div>
						<div class="weak-card-top">
							<div class="weak-card-jp">${card.jp}</div>
							${trackBadge}
						</div>
						<div class="weak-card-romaji">${card.romaji}</div>
						<div class="weak-card-vi">${card.vi}</div>
					</div>
					<div class="weak-card-actions">
						<button class="btn ghost btn-sm btn-speak-weak" type="button" data-speak="${card.jp}">
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
							Phát âm
						</button>
						<button class="btn-mastered btn-resolve-weak" type="button" data-word="${card.jp}">
							<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
							Đã thuộc ✓ (+15đ)
						</button>
					</div>
				</div>
			`;
		}).join("");

		grid.querySelectorAll(".btn-speak-weak").forEach(btn => {
			btn.addEventListener("click", () => {
				const word = btn.getAttribute("data-speak");
				speakJapanese(word);
			});
		});

		grid.querySelectorAll(".btn-resolve-weak").forEach(btn => {
			btn.addEventListener("click", () => {
				const word = btn.getAttribute("data-word");
				soundEffects.play("correct");
				addPoints(15, `Hoàn thành ôn tập từ khó: ${word}`);
				
				if (!state.user.memorizedWords) state.user.memorizedWords = [];
				if (!state.user.memorizedWords.includes(word)) {
					state.user.memorizedWords.push(word);
				}
				removeWeakWord(word);
			});
		});
	}
}

function initWeakWords() {
	document.querySelectorAll("[data-weak-filter]").forEach(btn => {
		btn.addEventListener("click", () => {
			document.querySelectorAll("[data-weak-filter]").forEach(b => b.classList.remove("active"));
			btn.classList.add("active");
			state.weakFilter = btn.getAttribute("data-weak-filter");
			renderWeakWordsView();
		});
	});

	const drillBtn = document.getElementById("btn-weak-drill");
	if (drillBtn) {
		drillBtn.addEventListener("click", () => {
			const userWeakList = (state.user && state.user.weakWords) || [];
			if (userWeakList.length === 0) return;
			
			state.isWeakDrillMode = true;
			state.flashIdx = 0;
			state.selectedFcTopic = null;
			state.selectedTrack = state.weakFilter === "n5" ? "n5" : state.weakFilter === "n4" ? "n4" : "all";
			
			setActiveView("flashcards");
			const sel = document.getElementById("fc-topic-selector");
			const study = document.getElementById("fc-study-container");
			const title = document.getElementById("fc-title");
			if (sel) sel.style.display = "none";
			if (study) study.style.display = "block";
			if (title) title.textContent = "Luyện tập Sổ tay Từ khó (" + userWeakList.length + " từ)";
			renderFlashcard();
		});
	}
}

function initExam() {
	document.getElementById("btn-start-exam-n5")?.addEventListener("click", () => startExam("n5"));
	document.getElementById("btn-start-exam-n4")?.addEventListener("click", () => startExam("n4"));
	document.getElementById("exam-select-n5")?.addEventListener("click", () => startExam("n5"));
	document.getElementById("exam-select-n4")?.addEventListener("click", () => startExam("n4"));
	
	document.getElementById("btn-exam-back")?.addEventListener("click", () => setActiveView("home"));
	document.getElementById("btn-exam-submit-early")?.addEventListener("click", () => submitExam(false));
	document.getElementById("btn-exam-flag")?.addEventListener("click", toggleExamFlag);

	document.getElementById("btn-exam-prev")?.addEventListener("click", () => {
		if (examData.currentIndex > 0) {
			renderExamQuestion(examData.currentIndex - 1);
			renderExamPalette();
		}
	});

	document.getElementById("btn-exam-next")?.addEventListener("click", () => {
		if (examData.currentIndex < examData.questions.length - 1) {
			renderExamQuestion(examData.currentIndex + 1);
			renderExamPalette();
		} else {
			submitExam(false);
		}
	});

	document.getElementById("btn-print-cert")?.addEventListener("click", () => window.print());

	document.getElementById("btn-toggle-exam-review")?.addEventListener("click", () => {
		const rev = document.getElementById("exam-review-details");
		if (rev) {
			rev.style.display = rev.style.display === "none" ? "block" : "none";
		}
	});

	document.getElementById("btn-exam-done-home")?.addEventListener("click", () => setActiveView("home"));
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

	// 2-Track Selection Cards ([JLPT N5], [JLPT N4], [ALL])
	document.getElementById("track-card-n5")?.addEventListener("click", () => {
		state.selectedTrack = "n5";
		state.flashIdx = 0;
		updateTopicCounts();
	});
	document.getElementById("track-card-n4")?.addEventListener("click", () => {
		state.selectedTrack = "n4";
		state.flashIdx = 0;
		updateTopicCounts();
	});
	document.getElementById("track-btn-all")?.addEventListener("click", () => {
		state.selectedTrack = "all";
		state.flashIdx = 0;
		updateTopicCounts();
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
	card?.addEventListener("click", () => { card.classList.toggle("flipped"); soundEffects.play("flip"); });
	btnFlip?.addEventListener("click", (e) => { e.stopPropagation(); card.classList.toggle("flipped"); soundEffects.play("flip"); });
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

	// 2-Track Selection Cards for Sentences
	document.getElementById("sn-track-card-n5")?.addEventListener("click", () => {
		state.selectedSnTrack = "n5";
		state.sentenceIdx = 0;
		updateSentenceTopicCounts();
	});
	document.getElementById("sn-track-card-n4")?.addEventListener("click", () => {
		state.selectedSnTrack = "n4";
		state.sentenceIdx = 0;
		updateSentenceTopicCounts();
	});
	document.getElementById("sn-track-btn-all")?.addEventListener("click", () => {
		state.selectedSnTrack = "all";
		state.sentenceIdx = 0;
		updateSentenceTopicCounts();
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
	updateSentenceTopicCounts();
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
	const trackPool = (state.selectedQuizTrack && state.selectedQuizTrack !== "all")
		? FLASHCARDS.filter(f => f.track === state.selectedQuizTrack)
		: FLASHCARDS;
	const poolList = trackPool.length >= 4 ? trackPool : FLASHCARDS;
	const correct = poolList[Math.floor(Math.random() * poolList.length)];
	const pool = poolList.map(f => f.vi);
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
		soundEffects.play("wrong");
		if (selectedIndex >= 0 && opts[selectedIndex]) opts[selectedIndex].classList.add("wrong");
		if (opts[currentQuizData.correctIndex]) opts[currentQuizData.correctIndex].classList.add("correct");
		if (feedback) { feedback.textContent = selectedIndex === -1 ? "Hết giờ!" : "Sai rồi!"; feedback.style.color = "#fca5a5"; }
		if (currentQuizData && currentQuizData.correct && currentQuizData.correct.jp) { addWeakWord(currentQuizData.correct.jp); }
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
	
	if (score >= 7) { soundEffects.play("level-up"); }
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

	document.querySelectorAll(".quiz-track-btn").forEach(btn => {
		btn.addEventListener("click", () => {
			document.querySelectorAll(".quiz-track-btn").forEach(b => b.classList.remove("active"));
			btn.classList.add("active");
			state.selectedQuizTrack = btn.getAttribute("data-quiz-track") || "n5";
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
	initExam();
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
