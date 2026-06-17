// src/lib/tour-config.ts
// Single source of truth for the tour structure. Add/remove a step here
// and ProgressBar / nav / routing all follow.

export type TourStep = {
  index: number;
  number: number;
  slug: string;
  path: string;
  label: string;
  title: string;
  subtitle?: string;
  showInProgress: boolean;
};

export const TOUR_STEPS: TourStep[] = [
  {
    index: 0, number: 0, slug: "welcome", path: "/",
    label: "시작", title: "HCG 컨설팅, 어떻게 함께하시겠어요?", showInProgress: false,
  },
  {
    index: 1, number: 1, slug: "1-diagnose", path: "/tour/1-diagnose",
    label: "진단",
    title: "지금 상황을 1분만 알려주세요",
    subtitle: "회사 규모, HR 역량, 핵심 페인포인트를 짚어봅니다",
    showInProgress: true,
  },
  {
    index: 2, number: 2, slug: "2-demo", path: "/tour/2-demo",
    label: "자문 체험",
    title: "실제 자문은 이렇게 진행됩니다",
    subtitle: "Master 컨설턴트와 대화해보세요",
    showInProgress: true,
  },
  {
    index: 3, number: 3, slug: "3-deliverables", path: "/tour/3-deliverables",
    label: "도구·템플릿",
    title: "사이사이 필요한 자료를 드립니다",
    subtitle: "20+ HR 제도 템플릿과 운영 매뉴얼",
    showInProgress: true,
  },
  {
    index: 4, number: 4, slug: "4-simulate", path: "/tour/4-simulate",
    label: "시뮬레이션",
    title: "수치를 조정하면 효과가 보입니다",
    subtitle: "Pay Band·평가 분포·직급 단계를 바꿔보면서 기대효과를 미리 확인",
    showInProgress: true,
  },
  {
    index: 5, number: 5, slug: "5-modes", path: "/tour/5-modes",
    label: "지원 방식",
    title: "지원은 6가지 방식이 모두 활용돼요",
    subtitle: "Master 자문은 정해진 일정이 아니라, 필요할 때 호출하는 협업입니다",
    showInProgress: true,
  },
  {
    index: 6, number: 6, slug: "6-master", path: "/tour/6-master",
    label: "플랜 선택",
    title: "자문 플랜을 골라주세요",
    subtitle: "회사 규모와 단계에 맞는 3가지 옵션",
    showInProgress: true,
  },
  {
    index: 7, number: 7, slug: "7-system", path: "/tour/7-system",
    label: "시스템",
    title: "(Extra)시스템 도입도 Seamless하게 가능합니다",
    subtitle: "e-HR 솔루션으로 자문 결과를 지속적으로 운영",
    showInProgress: true,
  },
];

export const PROGRESS_STEPS = TOUR_STEPS.filter((s) => s.showInProgress);
export const TOTAL_PROGRESS_STEPS = PROGRESS_STEPS.length;

export function getStepBySlug(slug: string): TourStep | undefined {
  return TOUR_STEPS.find((s) => s.slug === slug);
}
export function getStepByPath(path: string): TourStep | undefined {
  return TOUR_STEPS.find((s) => s.path === path);
}
export function getNextStep(current: TourStep): TourStep | undefined {
  return TOUR_STEPS.find((s) => s.index === current.index + 1);
}
export function getPrevStep(current: TourStep): TourStep | undefined {
  return TOUR_STEPS.find((s) => s.index === current.index - 1);
}
