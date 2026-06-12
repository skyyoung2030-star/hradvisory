export type PainImpact = {
  id: string;
  pain_text: string;
  area: string;
  after_text: string;
  metric_text?: string;
};

export const PAIN_IMPACT_MAP: PainImpact[] = [
  {
    id: "job_grade_complex",
    pain_text: "직급체계가 복잡하거나 연공서열에 묶여있다",
    area: "직급",
    after_text: "직급 통합 + 자격 기준 명문화",
    metric_text: "의사결정 속도 +30%, 승진 명분 명확화",
  },
  {
    id: "decision_slow",
    pain_text: "의사결정이 느리고 조직이 비대하다",
    area: "직급",
    after_text: "직급 단계 통합 + 의사결정 권한 위임",
    metric_text: "의사결정 속도 +35%",
  },
  {
    id: "eval_unfair",
    pain_text: "평가가 공정하지 않다 / 변별력이 없다",
    area: "평가",
    after_text: "OKR + Check-in 도입, Calibration 정착",
    metric_text: "평가 일관성 ±15% 이내, S/D 격차 1.4배",
  },
  {
    id: "goal_miss",
    pain_text: "팀·개인의 목표 달성률이 낮다",
    area: "평가",
    after_text: "OKR + 분기 Check-in 운영",
    metric_text: "목표 달성률 +12~18%p",
  },
  {
    id: "poor_alignment",
    pain_text: "부서 간 silo / 목표 정렬이 안 된다",
    area: "조직문화",
    after_text: "OKR + 분기 정렬 워크숍",
    metric_text: "목표 달성률 +12%p, 변화 수용성 +20",
  },
  {
    id: "low_motivation",
    pain_text: "직원 동기부여가 약하다 / 의욕이 낮다",
    area: "조직문화",
    after_text: "인정·피드백 문화 + 차등 보상",
    metric_text: "eNPS +10~20, 자발적 이탈 -25%",
  },
  {
    id: "no_payband",
    pain_text: "Pay Band 없이 보상이 임의적이다",
    area: "보상",
    after_text: "직급별 Pay Band 가시화, Compa-Ratio 분석",
    metric_text: "인상 재원 산정 시간 -70%",
  },
  {
    id: "key_talent_risk",
    pain_text: "S급 핵심인재 이탈 우려 / 경쟁사 적극 영입",
    area: "보상",
    after_text: "차등 보상 + 핵심인재 retention 패키지",
    metric_text: "핵심인재 유지율 +6~10%p",
  },
  {
    id: "unclear_job",
    pain_text: "직무 분장이 모호하다",
    area: "직무",
    after_text: "직무 카드 (R&R 명세) 도입",
    metric_text: "업무 중복 -40%, 신입 온보딩 -30%",
  },
  {
    id: "hire_difficulty",
    pain_text: "채용이 어렵거나 신규 입사자 적응이 느리다",
    area: "직무",
    after_text: "직무기술서 명문화 + 채용 페르소나 정의",
    metric_text: "채용 소요일 -25%, 6개월 retention +8%p",
  },
  {
    id: "promo_unclear",
    pain_text: "승진 기준이 불명확하다",
    area: "승진",
    after_text: "승진 자격요건 + 심사 양식 정립",
    metric_text: "승진 만족도 +25%p",
  },
  {
    id: "weak_leadership",
    pain_text: "팀장 리더십이 약하거나 편차가 크다",
    area: "리더십",
    after_text: "Derailer 진단 기반 1:1 코칭",
    metric_text: "리더십 수준 진단 +0.5 (5점 척도)",
  },
  {
    id: "low_performers",
    pain_text: "저성과자 관리가 안 된다 / 무임승차",
    area: "리더십",
    after_text: "변별력 있는 평가 + 코칭 후 PIP 절차",
    metric_text: "팀 생산성 +15%, 우수 인재 만족도 +20%p",
  },
  {
    id: "culture_drift",
    pain_text: "직원 몰입도·만족도가 낮다",
    area: "조직문화",
    after_text: "심리적 안전 진단 + 정렬 워크숍 + 리더 코칭",
    metric_text: "eNPS +15, 1년 retention +3%p",
  },
];