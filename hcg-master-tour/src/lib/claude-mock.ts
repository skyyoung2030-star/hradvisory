// src/lib/claude-mock.ts
// Curated consultant-style mock replies — ported from the Next.js build's
// lib/claude.ts MOCK_RESPONSES. Used by /tour/2-demo so the chat feels real
// without needing an Anthropic API key (CORS blocks browser calls anyway).
//
// To swap in a real LLM later, replace getChatReply in src/lib/api.ts with
// a fetch() against your own Supabase Edge Function / proxy endpoint.

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const REPLIES: { trigger: RegExp; reply: string }[] = [
  {
    trigger: /평가\s*시즌|평가\s*준비|calibration/i,
    reply:
      "평가 시즌 준비는 보통 8주 캘린더로 진행합니다. 목표 점검 → 자기평가 → Calibration → 면담 4단계로 나누고, 각 단계마다 매니저 가이드와 체크리스트를 미리 배포하는 게 핵심입니다.\n\n특히 Calibration 회의 운영이 평가 일관성을 좌우합니다. 평가자들 간 등급 분포가 너무 다를 때 조정하는 자리인데, 사전에 객관적 데이터(목표 달성도·다면 피드백)를 정리해두지 않으면 감정적 논쟁이 되기 쉽습니다.",
  },
  {
    trigger: /성과급|인센티브|payout|보너스/i,
    reply:
      "성과급 체계 정비는 먼저 Target Incentive(목표 성과급률)을 직급·직무별로 설정하는 것부터 시작합니다. 보통 기본급 대비 10~30% 범위에서 결정하고, 등급별 Payout Curve(지급 배율)를 설계합니다.\n\n핵심은 Threshold(최소 지급 기준)와 Cap(최대 지급 한도)을 명확히 하는 것입니다. 이렇게 하면 '왜 이 금액인지' 설명 가능한 구조가 됩니다. Pay Band와 연동하면 기본급 인상과 성과급을 분리해서 관리할 수 있습니다.",
  },
  {
    trigger: /pay\s*band|보상|급여\s*체계|연봉/i,
    reply:
      "Pay Band 도입은 보상 체계 정비의 첫 단추입니다. 직급(또는 직무등급)별로 Min-Mid-Max를 설정하고, 현재 인원의 Compa-Ratio(시장 대비 위치)를 분석하는 것부터 시작합니다.\n\nBand를 설정하면 인상 재원 배분이 객관적으로 바뀝니다. Band 하단에 있는 인원은 시장 경쟁력 확보를 위해 우선 인상하고, 상단에 있는 인원은 승진 시까지 인상폭을 조절하는 식입니다. 엑셀 시뮬레이터로 시나리오별 재원을 미리 돌려볼 수 있습니다.",
  },
  {
    trigger: /평가\s*제도|평가\s*없|평가\s*시작|평가\s*만들|평가\s*도입/i,
    reply:
      "100명 규모 회사에서 평가제도를 처음 도입하실 때는 한꺼번에 풀세트를 가는 것보다 단계적으로 가는 게 정착률이 높습니다.\n\n1단계로는 직무별 OKR Dictionary를 만들어 목표 정렬부터 시작하고, 2단계에서 분기 Check-in 면담을 도입합니다. 평가 등급은 1년 운영 후에 도입하는 게 안전합니다. 처음부터 S/A/B/C 등급으로 가면 데이터 없이 주관 평가가 되고, 결과적으로 신뢰가 무너집니다.",
  },
  {
    trigger: /okr|mbo/i,
    reply:
      "MBO에서 OKR로 전환할 때 가장 큰 함정은 '용어만 바꾸기'입니다. MBO 목표 그대로 두고 이름만 KR로 바꾸면 본질이 똑같습니다.\n\nOKR의 핵심은 ① 야심찬 Objective(70% 달성이 적정) ② 측정 가능한 Key Result 3~5개 ③ 분기 단위 빠른 사이클입니다. 전환 시 가장 중요한 건 평가와 분리하는 것이에요. OKR을 평가 점수로 직결시키면 사람들이 보수적인 목표만 세웁니다.",
  },
  {
    trigger: /리더십|팀장|코칭|derailer/i,
    reply:
      "팀장 리더십 진단은 HCG에서는 Derailer(파괴 행동) 진단을 자주 활용합니다. 자기인식이 약한 영역을 찾아 1:1 코칭으로 보완하는 접근입니다.\n\n기본 문항은 ① 소통 장애 ② 파벌 형성 ③ 현실 안주 ④ 마이크로매니징 ⑤ 의사결정 회피 5개 축으로 8문항씩 구성합니다. 360도 다면(상사·동료·부하)으로 받아야 의미 있고, 결과는 본인에게만 1:1로 피드백합니다. 공개하면 방어 모드로 들어가서 행동 변화가 어렵습니다.",
  },
  {
    trigger: /이탈|핵심\s*인재|retention|퇴사/i,
    reply:
      "핵심인재 이탈의 근본 원인은 보통 세 가지로 수렴합니다: 성장 경로 불투명, 보상 시장 대비 미달, 리더십 이슈. 먼저 퇴사자 인터뷰와 잔류 인원 서베이를 통해 주요 이탈 드라이버를 특정해야 합니다.\n\n단기적으로는 핵심인재 풀을 명시적으로 지정하고 LTI(장기 인센티브: RSU·스톡옵션·유급 안식월 등)를 설계하는 것이 효과적입니다. 장기적으로는 조직문화 진단을 통해 구조적 문제를 파악하고 개선 로드맵을 수립해야 합니다.",
  },
  {
    trigger: /직급|grade|승진/i,
    reply:
      "직급체계는 보통 4~5단계로 가는 게 운영 부담과 차별화 사이에서 균형이 맞습니다. 6단계 이상은 단계 간 차이를 설명하기 어렵고, 3단계 이하는 승진 모티베이션이 약해집니다.\n\n핵심은 각 직급별 자격 기준을 명문화하는 것입니다. 단순히 연차가 아니라 ① 책임 범위 ② 의사결정 권한 ③ 핵심 역량 ④ 성과 기준으로 정의해야 승진 명분이 명확해집니다. 통합 시 시나리오는 3안으로 만들어 경영진과 합의하시는 걸 권장합니다.",
  },
  {
    trigger: /m&a|pmi|통합|합병/i,
    reply:
      "PMI(Post-Merger Integration)에서 인사제도 통합은 보통 100일 로드맵으로 접근합니다. Day 1에는 커뮤니케이션과 거버넌스만 정리하고, 30일까지 직급·보상 현황 매핑, 60일까지 통합안 설계, 100일까지 시행이 일반적 타임라인입니다.\n\n가장 예민한 영역은 보상 수준 차이입니다. 양사 Pay Band를 겹쳐놓고 갭 분석을 하되, '낮은 쪽을 높이는' 방향이 아니면 이탈이 발생합니다. 직급 호칭 통합은 초기에 결정하되, 보상 통합은 1~2년에 걸쳐 점진적으로 수렴시키는 것을 권장합니다.",
  },
  {
    trigger: /해고|노무|근로계약|취업규칙|부당해고/i,
    reply:
      "이 부분은 노무·법무 영역이라 일반 원칙만 말씀드리면, 해고는 ① 정당한 사유 ② 적법한 절차 ③ 사전 협의 세 요건이 모두 충족돼야 합니다. 한 가지라도 빠지면 부당해고 분쟁 위험이 큽니다.\n\n구체 사안은 회사 취업규칙·인사위원회 운영 방식에 따라 달라지니, 노무사와 직접 상담이 필요합니다. Master 자문 계약 시 우대 단가로 노무사 매칭이 가능합니다.",
  },
];

const DEFAULT_REPLY =
  "좋은 질문입니다. 이 이슈는 회사 규모와 현재 제도 현황에 따라 접근법이 달라지는데요, 일반적인 방법론 측면에서 말씀드리면 먼저 현황 진단(As-Is)을 통해 문제의 근본 원인을 특정하고, 벤치마킹 데이터와 비교한 후 개선안(To-Be)을 설계하는 순서로 진행합니다.\n\n다만 구체적인 실행 계획은 귀사의 직급체계, 인원 구성, 기존 제도 운영 이력 등을 종합적으로 검토해야 정확한 방향을 잡을 수 있습니다. Master 자문에서는 이런 맥락을 반영한 맞춤 답변과 함께 실제 활용 가능한 템플릿도 제공해드립니다.";

export function getMockReply(question: string): string {
  for (const { trigger, reply } of REPLIES) {
    if (trigger.test(question)) return reply;
  }
  return DEFAULT_REPLY;
}
