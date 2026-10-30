import type { Copy } from "./copy";

// AI translation of en.ts (2026-10-29), awaiting Andre's review.
export const KO: Copy = {
  site: {
    summary: "André Amnc의 허브. 창의적이고 유쾌하게 세상에 나를 소개하는 나만의 방식이에요. 나의 관심사, 내가 당신을 위해 할 수 있는 일, 그리고 내가 자연과 사회에 돌려주는 것.",
    more: "내가 관심사를 경험하는 그대로, 내가 전하는 링크와 콘텐츠를 통해 당신도 경험하길 바라요. 소프트웨어 엔지니어링과 지금 작업 중인(혹은 가지고 노는!) 코드, 아웃도어맨의 영상과 글, 내가 쓰고 있는 장편과 단편 소설, 브리티시컬럼비아 곳곳에서의 사냥 모험, 그리고 AI 시대 창업의 고단함까지.",
    imageAlt: "andreamnc.com의 ASCII 산맥",
  },
  sections: { latest: "최근", interests: "관심사", write: "편지 보내기", nav: "섹션", menu: "메뉴" },
  interests: {
    Engineer: {
      label: "엔지니어",
      line: "엔지니어링은 내 밥벌이이고, 큰 즐거움이기도 해요. 어디에 있든, 소프트웨어든 문제 해결이든, 그것을 하지 않은 날은 거의 없었어요.",
      alt: "위에서 내려다본 조차장의 탱크 화차 두 량",
    },
    Outdoorsman: {
      label: "아웃도어맨",
      line: "늦게 찾아온 열정이자, 내가 삶을 다시 발견하고 있는 이유예요. 야생은 훌륭한 친구이자 스승이었어요.",
      alt: "비니와 체크무늬 재킷 차림으로 물 너머를 바라보는 André",
    },
    Writer: {
      label: "작가",
      line: "글쓰기는 내 삶을 깊이 파고들고, 경험을 소화하고, 생각에 자유를 주는 수단이에요. 이야기는 전통을 실어 나르는 수레예요.",
      alt: "물 위 어두운 숲속의 오두막",
    },
    Hunter: {
      label: "사냥꾼",
      line: "사냥은 나를 땅과 야생에, 바깥의 야생과 내 안의 야생에 이어 줘요. 한 생명과 자기 생계를 책임지는 일은 자연을 향한 영적인 경외의 수행이에요.",
      alt: "챙 넓은 모자에 체스트 팩을 멘 André, 뒤로 펼쳐진 산들",
    },
    Entrepreneur: {
      label: "기업가",
      line: "내 사업의 주인이 되는 것은 늘 꿈이었고, 동시에 숙적이기도 했어요. 벅차고 겸손해지는 경험이며, 사회에 가치를 더한다는 것이 무엇인지 돌아보게 해 줘요.",
      alt: "콘크리트 타워를 전망대까지 올려다본 모습",
    },
  },
  links: { "Code on GitHub": "GitHub의 코드", "Films on YouTube": "YouTube의 영상", "Stories on Substack": "Substack의 이야기" },
  range: { label: "산맥: 다섯 가지 관심사", index: "관심사", photoToCome: "사진 준비 중", lineToCome: "[당신의 말로 한 줄]" },
  carousel: {
    all: "모든 관심사", previous: "이전 관심사", next: "다음 관심사",
    strip: "관심사를 하나씩 보여 줘요. 화살표 키를 사용하세요", slide: "{total}개 중 {n}번째: {name}", show: "{name} 보기",
    carouselRole: "캐러셀", slideRole: "슬라이드",
  },
  latest: { nothingYet: "[아직 게시된 글이 없어요]" },
  letter: {
    opening: "편지 보내기",
    message: "메시지", email: "이메일", emailPlaceholder: "답장받을 이메일", enter: "Enter",
    edit: "메시지 수정", another: "다른 질문", orWriteTo: "또는 이메일로:",
    badEmail: "이메일 주소가 올바르지 않은 것 같아요.",
    failed: "전송되지 않았어요. 대신 {address}(으)로 보내 주세요.",
    sent: "보냈어요. 고마워요.",
  },
  prompts: [
    "몇 마디를 명상해 봐요",
    "당신의 롤모델이라면 무엇을 쓸까요?",
    "오늘 밖에 나가 봤나요?",
    "오늘 해돋이를 봤나요?",
    "출근길에 집을 돌아보며 ‘난 정말 운이 좋아’라고 생각하나요?",
    "확신이 드나요?",
    "오늘, 한 살 더 먹기 전에 잠시 돌아볼 시간을 가졌나요?",
    "평화롭게 살고 있나요?",
    "무엇을 이루고 싶나요?",
    "땅의 밑바닥을 응시해 본 적 있나요?",
    "그냥 너무 좋은 그 노래는 뭐예요?",
    "이야기를 들려줘요",
    "기억을 캐는 중",
    "안녕하세요!",
    "밤잠을 설치게 하는 건 뭔가요?",
    "당신도 OutdoorBoyz 유튜브 채널 좋아해요?",
    "정말 찾고 있는 것을 찾는 데 도움이 필요한가요?",
  ],
  asks: {
    Engineer: "엔지니어에게 무엇을 묻고 싶나요?",
    Outdoorsman: "아웃도어맨에게 무엇을 묻고 싶나요?",
    Writer: "작가에게 무엇을 묻고 싶나요?",
    Hunter: "사냥꾼에게 무엇을 묻고 싶나요?",
    Entrepreneur: "기업가에게 무엇을 묻고 싶나요?",
  },
  offer: "한국어로 읽기",
  footer: { channels: "채널", languages: "언어" },
};
