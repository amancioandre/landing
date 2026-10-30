import type { Copy } from "./copy";

// AI translation of en.ts into Simplified Chinese (2026-10-29), awaiting Andre's review.
export const ZH_HANS: Copy = {
  site: {
    summary: "André Amnc 的主页。这是我以创意和玩心向世界介绍自己的方式：我的兴趣、我能为你做什么，以及我回馈给自然与社会的东西。",
    more: "希望你能像我一样体验我的兴趣，通过我带给你的链接和内容：软件工程，以及我正在做（或在玩！）的代码；一个户外人的视频和文章；我正在创作的长篇和短篇小说；遍及不列颠哥伦比亚的狩猎冒险；还有 AI 时代创业的艰辛。",
    imageAlt: "andreamnc.com 上的 ASCII 山脉",
  },
  sections: { latest: "最新", interests: "兴趣", write: "给我写信", nav: "栏目", menu: "菜单" },
  interests: {
    Engineer: {
      label: "工程师",
      line: "工程一直是我谋生的手艺，我也从中获得极大的乐趣。无论身在何处，几乎没有一天我不在实践它，不论是在软件中，还是在解决问题时。",
      alt: "俯瞰调车场上的两节罐车",
    },
    Outdoorsman: {
      label: "户外人",
      line: "这是我人生后来才找到的热爱，也是我重新发现自己生活的原因。荒野一直是我的好朋友和好老师。",
      alt: "戴着毛线帽、穿格子夹克的 André，眺望水面",
    },
    Writer: {
      label: "写作者",
      line: "写作是我深入挖掘生活、消化经历、让思想获得自由的方式。讲故事是传统的载体。",
      alt: "水边上方黑暗森林中的小木屋",
    },
    Hunter: {
      label: "猎人",
      line: "狩猎让我与土地和野性相连，无论是外面的，还是我内心的。对一条生命、对自己的生计负责，是对自然的一种灵性敬畏的修行。",
      alt: "戴宽檐帽、背胸包的 André，身后是群山",
    },
    Entrepreneur: {
      label: "创业者",
      line: "做自己的老板一直是我的梦想，也是我的宿敌。这是一段令人生畏、也让人谦卑的经历，它让我重新看待为社会创造价值这件事。",
      alt: "仰望一座混凝土塔，直到它的观景台",
    },
  },
  links: { "Code on GitHub": "GitHub 上的代码", "Films on YouTube": "YouTube 上的影片", "Stories on Substack": "Substack 上的故事" },
  range: { label: "山脉：五个兴趣", index: "兴趣", photoToCome: "照片即将上线", lineToCome: "［用你的话写一句］" },
  carousel: {
    all: "全部兴趣", previous: "上一个兴趣", next: "下一个兴趣",
    strip: "兴趣，一次一个；可使用方向键", slide: "第 {n} 个，共 {total} 个：{name}", show: "显示{name}",
    carouselRole: "轮播", slideRole: "幻灯片",
  },
  latest: { nothingYet: "［暂无发布内容］" },
  letter: {
    opening: "给我写信",
    message: "你的留言", email: "你的邮箱", emailPlaceholder: "你的邮箱，方便我回复", enter: "回车",
    edit: "编辑留言", another: "换一个问题", orWriteTo: "或写信至",
    badEmail: "这个邮箱看起来不太对。",
    failed: "没有发送成功。请直接写信至 {address}。",
    sent: "已发送。谢谢你。",
  },
  prompts: [
    "静心写下几句话",
    "你的榜样会写些什么？",
    "你今天出门了吗？",
    "你今天看到日出了吗？",
    "早上出门上班时，你会回头看看自己的家，心想“我真幸运”吗？",
    "你被说服了吗？",
    "今天，在又老一点之前，你有没有花一点时间反思？",
    "你活得平静吗？",
    "你希望实现什么？",
    "你曾凝视过大地的深处吗？",
    "那首你就是爱听的歌是什么？",
    "给我讲个故事",
    "挖掘回忆",
    "你好！",
    "什么让你夜不能寐？",
    "你也喜欢 YouTube 上的 OutdoorBoyz 频道吗？",
    "你需要帮助找到你真正在寻找的东西吗？",
  ],
  asks: {
    Engineer: "你想问工程师什么？",
    Outdoorsman: "你想问户外人什么？",
    Writer: "你想问写作者什么？",
    Hunter: "你想问猎人什么？",
    Entrepreneur: "你想问创业者什么？",
  },
  offer: "阅读简体中文版",
  footer: { channels: "频道", languages: "语言" },
};
