export type PainImpact = {
  id: string;
  pain_text: string;
  area: string;
  after_text: string;
  metric_text?: string;
  question?: string;  // Step 2 채팅 chip에 노출할 자연스러운 질문
};

export const PAIN_IMPACT_MAP: PainImpact[] = [
  {
    id: "job_grade_complex",
    pain_text: "직급체계가 복잡하거나 연공서열에 묶여있다",
    area: "직급",
    after_text: "직급 통합 + 자격 기준 명문화",
    metric_text: "의사결정 속도 +30%, 승진 명분 명확화",
    question: "직급체계가 복잡하고 연공서열에 묶여있는데, 어디서부터 정리해야 하나요?",
  },
  {
    id: "decision_slow",
    pain_text: "의사결정이 느리고 조직이 비대하다",
    area: "직급",
    after_text: "직급 단계 통합 + 의사결정 권한 위임",
    metric_text: "의사결정 속도 +35%",
    question: "조직이 비대해지면서 의사결정이 느려지고 있어요. 직급 단계를 줄이려면 어떻게 접근해야 할까요?",
  },
  {
    id: "eval_unfair",
    pain_text: "평가가 공정하지 않다 / 변별력이 없다",
    area: "평가",
    after_text: "OKR + Check-in 도입, Calibration 정착",
    metric_text: "평가 일관성 ±15% 이내, S/D 격차 1.4배",
    question: "평가에 변별력이 없어서 직원 불만이 큰데, 어떻게 개선할 수 있나요?",
  },
  {
    id: "goal_miss",
    pain_text: "팀·개인의 목표 달성률이 낮아 조직성과가 향상되지 않는다",
    area: "평가",
    after_text: "OKR + 분기 Check-in 운영",
    metric_text: "목표 달성률 +12~18%p",
    question: "팀별 목표 달성률이 낮은데, OKR을 도입하면 정말 효과가 있을까요?",
  },
  {
    id: "poor_alignment",
    pain_text: "부서 간 silo / 목표 정렬이 안 된다",
    area: "조직문화",
    after_text: "OKR + 분기 정렬 워크숍",
    metric_text: "목표 달성률 +12%p, 변화 수용성 +20",
    question: "부서 간 silo가 심한데, 정렬 워크숍이 정말 도움이 되나요?",
  },
  {
    id: "low_motivation",
    pain_text: "직원 동기부여가 약하다 / 의욕이 낮다",
    area: "조직문화",
    after_text: "인정·피드백 문화 + 차등 보상",
    metric_text: "eNPS +10~20, 자발적 이탈 -25%",
    question: "직원 동기부여가 약한데, 보상 인상 외에 어떤 방법이 있을까요?",
  },
  {
    id: "no_payband",
    pain_text: "Pay Band 없이 보상이 임의적이다",
    area: "보상",
    after_text: "직급별 Pay Band 가시화, Compa-Ratio 분석",
    metric_text: "인상 재원 산정 시간 -70%",
    question: "Pay Band 없이 보상이 임의적으로 정해지고 있는데, 어떻게 체계화하나요?",
  },
  {
    id: "key_talent_risk",
    pain_text: "S급 핵심인재 이탈 우려 / 경쟁사 적극 영입",
    area: "보상",
    after_text: "차등 보상 + 핵심인재 retention 패키지",
    metric_text: "핵심인재 유지율 +6~10%p",
    question: "S급 핵심인재가 경쟁사에 빠져나가고 있어요. 어떻게 retention할 수 있나요?",
  },
  {
    id: "unclear_job",
    pain_text: "직무 분장이 모호하다",
    area: "직무",
    after_text: "직무 카드 (R&R 명세) 도입",
    metric_text: "업무 중복 -40%, 신입 온보딩 -30%",
    question: "직무 분장이 모호해서 업무 중복이 많은데, 어떻게 정리하나요?",
  },
  {
    id: "hire_difficulty",
    pain_text: "채용이 어렵거나 신규 입사자 적응이 느리다",
    area: "직무",
    after_text: "직무기술서 명문화 + 채용 페르소나 정의",
    metric_text: "채용 소요일 -25%, 6개월 retention +8%p",
    question: "채용은 어렵고 신규 입사자 적응도 느린데, 어디부터 개선해야 하나요?",
  },
  {
    id: "promo_unclear",
    pain_text: "승진 기준이 불명확하다",
    area: "승진",
    after_text: "승진 자격요건 + 심사 양식 정립",
    metric_text: "승진 만족도 +25%p",
    question: "승진 기준이 불명확해서 직원 불만이 큰데, 자격요건을 어떻게 정의하나요?",
  },
  {
    id: "weak_leadership",
    pain_text: "팀장 리더십이 약하거나 편차가 크다",
    area: "리더십",
    after_text: "Derailer 진단 기반 1:1 코칭",
    metric_text: "리더십 수준 진단 +0.5 (5점 척도)",
    question: "팀장 리더십 편차가 큰데, 어떻게 균질화할 수 있나요?",
  },
  {
    id: "low_performers",
    pain_text: "저성과자 관리가 안 된다 / 무임승차",
    area: "리더십",
    after_text: "변별력 있는 평가 + 코칭 후 PIP 절차",
    metric_text: "팀 생산성 +15%, 우수 인재 만족도 +20%p",
    question: "저성과자 관리가 안 되고 있어요. PIP 절차는 어떻게 시작하나요?",
  },
  {
    id: "culture_drift",
    pain_text: "직원 몰입도·만족도가 낮다",
    area: "조직문화",
    after_text: "심리적 안전 진단 + 정렬 워크숍 + 리더 코칭",
    metric_text: "eNPS +15, 1년 retention +3%p",
    question: "직원 몰입도가 점점 떨어지고 있어요. 어디부터 손대야 하나요?",
  },
  {
    id: "ai_adoption",
    pain_text: "AI 도입으로 생산성 향상하고 싶은데 어디서부터 시작할지 모르겠다",
    area: "AI",
    after_text: "HR AI 에이전트 도입 + 직무 명확화 + 자동화 우선순위 설계",
    metric_text: "HR 운영 부담 30~50% 감소, 의사결정 품질 향상",
    question: "AI를 도입해서 HR 생산성을 높이고 싶은데, 어디서부터 시작해야 할까요?",
  },
];
