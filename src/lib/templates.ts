export type Template = {
  id: string;
  area: "직급" | "평가" | "보상" | "직무" | "승진" | "리더십" | "조직문화";
  name: string;
  description: string;
  isFree: boolean;
};

export const TEMPLATES: Template[] = [
  { id: "grade-design", area: "직급", name: "직급 통합 설계 가이드", description: "직급 단계 결정 + 자격 기준 설정 방법론", isFree: false },
  { id: "grade-criteria", area: "직급", name: "직급별 자격 기준 Template", description: "직급마다 필요한 경력·역량·성과 기준 정리", isFree: true },
  { id: "grade-transition", area: "직급", name: "직급 체계 전환 시나리오", description: "6단계 → 4단계 통합 시 전환 매트릭스", isFree: false },

  { id: "okr-dictionary", area: "평가", name: "OKR Dictionary (직무별 예시)", description: "영업·개발·마케팅·HR 등 직무별 OKR 예시 100선", isFree: false },
  { id: "checkin-template", area: "평가", name: "분기 Check-in 면담 양식", description: "평가자-피평가자 1:1 면담 진행 양식", isFree: true },
  { id: "calibration-guide", area: "평가", name: "Calibration 회의 진행 가이드", description: "평가 등급 분포 조정 회의 운영 매뉴얼", isFree: false },
  { id: "eval-calendar", area: "평가", name: "평가 시즌 8주 캘린더", description: "평가 시즌 8주 단위별 to-do 리스트", isFree: true },
  { id: "360-survey", area: "평가", name: "다면 평가 서베이 문항", description: "동료·부하·상사 다면 피드백 진단 문항", isFree: false },

  { id: "pay-band-sim", area: "보상", name: "Pay Band Simulator", description: "직급별 Min-Mid-Max 시뮬레이션 엑셀", isFree: false },
  { id: "payout-curve", area: "보상", name: "성과급 Payout Curve 설계", description: "Threshold-Target-Cap 곡선 설계 매뉴얼", isFree: false },
  { id: "comp-policy", area: "보상", name: "보상 정책 체크리스트", description: "Pay Level · Mix · Structure · Contributor 4P 점검", isFree: true },
  { id: "incentive-design", area: "보상", name: "성과급 Scheme 비교", description: "Target Incentive vs Profit Sharing 비교 가이드", isFree: false },

  { id: "job-card", area: "직무", name: "직무 카드 (R&R 명세)", description: "직무별 R&R · 핵심역량 · KPI 1페이지 정리", isFree: true },
  { id: "job-analysis", area: "직무", name: "직무 분석 워크시트", description: "신규 직무 도출 또는 기존 직무 재정의", isFree: false },
  { id: "job-grade-matrix", area: "직무", name: "직무·직급 매트릭스", description: "직무군별 직급 매핑 + 승진 트랙", isFree: false },

  { id: "promo-criteria", area: "승진", name: "승진 자격요건 & 심사 양식", description: "직급별 승진 자격요건 + 심사 절차 양식", isFree: false },
  { id: "promo-interview", area: "승진", name: "승진 면접 질문 라이브러리", description: "직급별 승진 면접 질문 50선", isFree: false },
  { id: "promo-policy", area: "승진", name: "승진 정책 체크리스트", description: "연 1회 vs 반기 vs 수시 등 운영 방식 비교", isFree: true },

  { id: "derailer-mini", area: "리더십", name: "Derailer 미니 진단 8문항", description: "소통장애·파벌형성·현실안주 등 리더십 위험 진단", isFree: true },
  { id: "leadership-coaching", area: "리더십", name: "리더 1:1 코칭 매뉴얼", description: "팀장·임원 1:1 코칭 세션 진행 매뉴얼", isFree: false },
  { id: "one-on-one", area: "리더십", name: "1:1 미팅 진행 가이드", description: "팀장-팀원 정기 1:1 운영 방법", isFree: true },
  { id: "leadership-competency", area: "리더십", name: "리더십 역량 모델", description: "Leading Business · Building Trust · Managing Org 3축 모델", isFree: false },

  { id: "culture-survey", area: "조직문화", name: "조직문화 진단 서베이", description: "HCG 3E 진단 모델 기반 360 문항 서베이", isFree: false },
  { id: "town-hall", area: "조직문화", name: "Town Hall 운영 가이드", description: "전사 미팅 효과적 운영 방법론", isFree: true },
  { id: "pmi-checklist", area: "조직문화", name: "M&A 후 PMI 체크리스트", description: "인사 통합 100일 to-do 리스트", isFree: false },
];

export const PAIN_TO_AREA: Record<string, Template["area"]> = {
  job_grade_complex: "직급",
  eval_unfair: "평가",
  no_payband: "보상",
  unclear_job: "직무",
  promo_unclear: "승진",
  weak_leadership: "리더십",
  culture_drift: "조직문화",
};
