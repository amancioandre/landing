import type { Copy } from "./copy";

// AI translation of en.ts into Traditional Chinese, as written in Taiwan (2026-10-29), awaiting Andre's review.
export const ZH_HANT: Copy = {
  site: {
    summary: "André Amnc 的主頁。這是我以創意與玩心向世界介紹自己的方式：我的興趣、我能為你做什麼，以及我回饋給自然與社會的東西。",
    more: "希望你能像我一樣體驗我的興趣，透過我帶給你的連結與內容：軟體工程，以及我正在做（或在玩！）的程式碼；一個戶外人的影片與文章；我正在創作的長篇與短篇小說；遍及卑詩省的狩獵冒險；還有 AI 時代創業的艱辛。",
    imageAlt: "andreamnc.com 上的 ASCII 山脈",
  },
  sections: { latest: "最新", interests: "興趣", now: "此刻", write: "給我寫信", nav: "單元", menu: "選單" },
  interests: {
    Engineer: {
      label: "工程師",
      line: "工程一直是我謀生的手藝，我也從中獲得極大的樂趣。無論身在何處，幾乎沒有一天我不在實踐它，不論是在軟體中，還是在解決問題時。",
      alt: "俯瞰調車場上的兩節罐車",
    },
    Outdoorsman: {
      label: "戶外人",
      line: "這是我人生後來才找到的熱愛，也是我重新發現自己生活的原因。荒野一直是我的好朋友與好老師。",
      alt: "戴著毛帽、穿格紋夾克的 André，眺望水面",
    },
    Writer: {
      label: "寫作者",
      line: "寫作是我深入挖掘生活、消化經歷、讓思想獲得自由的方式。說故事是傳統的載體。",
      alt: "水邊上方幽暗森林中的小木屋",
    },
    Hunter: {
      label: "獵人",
      line: "狩獵讓我與土地和野性相連，無論是外在的，還是我內心的。對一條生命、對自己的生計負責，是對自然的一種靈性敬畏的修行。",
      alt: "戴寬簷帽、背胸包的 André，身後是群山",
    },
    Entrepreneur: {
      label: "創業者",
      line: "當自己的老闆一直是我的夢想，也是我的宿敵。這是一段令人生畏、也讓人謙卑的經歷，它讓我重新看待為社會創造價值這件事。",
      alt: "仰望一座混凝土塔，直到它的觀景台",
    },
  },
  links: { "Code on GitHub": "GitHub 上的程式碼", "Films on YouTube": "YouTube 上的影片", "Stories on Substack": "Substack 上的故事" },
  range: { label: "山脈：五個興趣", index: "興趣", photoToCome: "照片即將上線", lineToCome: "［用你的話寫一句］" },
  settings: {
    name: "設定", weather: "天氣", fog: "霧", wind: "風", from: "風向", west: "西", east: "東", clouds: "雲", time: "時間",
    clock: "我的時鐘", day: "白天", night: "夜晚", campfire: "營火", fire: "火", smoke: "煙", ink: "墨色", moonlight: "月光",
    starlight: "星光", faint: "淡", stars: "星星", ascii: "ASCII", glyphs: "字形", characters: "字元", asDrawn: "原樣",
    full: "完整", round: "圓潤", contrast: "對比", mist: "薄霧",
  },
  carousel: { carouselRole: "輪播", slideRole: "投影片" },   // the Now carousel's roles, for screen readers
  latest: { nothingYet: "［尚無發布內容］" },
  now: {
    kinds: { note: "筆記", story: "故事", post: "貼文", code: "程式碼" },
    previous: "上一個", next: "下一個", strip: "此刻，一次一件；用方向鍵瀏覽", slide: "第 {n} 項，共 {total} 項：{kind}",
    open: { note: "在 {where} 閱讀", story: "在 {where} 閱讀", post: "在 {where} 查看", code: "GitHub 上的程式碼" },
  },
  letter: {
    opening: "給我寫信",
    message: "你的留言", email: "你的電子郵件", emailPlaceholder: "你的電子郵件，方便我回信", enter: "Enter",
    edit: "編輯留言", another: "換一個問題", orWriteTo: "或寫信至",
    badEmail: "這個電子郵件看起來不太對。",
    failed: "沒有寄送成功。請直接寫信至 {address}。",
    sent: "已寄出。謝謝你。",
  },
  prompts: [
    "靜心寫下幾句話",
    "你的榜樣會寫些什麼？",
    "你今天出門了嗎？",
    "你今天看到日出了嗎？",
    "早上出門上班時，你會回頭看看自己的家，心想「我真幸運」嗎？",
    "你被說服了嗎？",
    "今天，在又老一點之前，你有沒有花一點時間反思？",
    "你活得平靜嗎？",
    "你希望實現什麼？",
    "你曾凝視過大地的深處嗎？",
    "那首你就是愛聽的歌是什麼？",
    "說個故事給我聽",
    "挖掘回憶",
    "你好！",
    "什麼讓你夜不能寐？",
    "你也喜歡 YouTube 上的 OutdoorBoyz 頻道嗎？",
    "你需要幫忙找到你真正在尋找的東西嗎？",
  ],
  asks: {
    Engineer: "你想問工程師什麼？",
    Outdoorsman: "你想問戶外人什麼？",
    Writer: "你想問寫作者什麼？",
    Hunter: "你想問獵人什麼？",
    Entrepreneur: "你想問創業者什麼？",
  },
  offer: "閱讀繁體中文版",
  footer: { channels: "頻道", languages: "語言" },
};
