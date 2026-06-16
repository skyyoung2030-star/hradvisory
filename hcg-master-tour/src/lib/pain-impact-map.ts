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
    id: "eval_unfair",
    pain_text: "평가가 공정하지 않다 / 변별력이 없다",
    area: "평가",
    after_text: "OKR + Check-in 도입, Calibration 정착",
    metric_text: "평가 일관성 ±15% 이내, S/D 격차 1.4배",
  },
  {
    id: "no_payband",
    pain_text: "Pay Band 없이 보상이 임의적이다",
    area: "보상",
    after_text: "직급별 Pay Band 가시화, Compa-Ratio 분석",
    metric_text: "인상 재원 산정 시간 -70%",
  },
  {
    id: "unclear_job",
    pain_text: "직무 분장이 모호하다",
    area: "직무",
    after_text: "직무 카드 (R&R 명세) 도입",
    metric_text: "업무 중복 -40%, 신입 온보딩 -30%",
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
    pain_text: "팀장 리더십이 약하다",
    area: "리더십",
    after_text: "Derailer 진단 기반 1:1 코칭",
    metric_text: "리더십 수준 진단 +0.5 (5점 척도)",
  },
  {
    id: "culture_drift",
    pain_text: "조직문화가 흔들린다 / 핵심인재 이탈",
    area: "조직문화",
    after_text: "명시적 핵심인재 풀 + LTI 도입",
    metric_text: "핵심인재 retention +3%p",
  },
];
