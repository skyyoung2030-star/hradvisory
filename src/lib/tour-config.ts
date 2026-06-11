// lib/tour-config.ts
// Single source of truth for the guided tour structure.
// Adding/removing a step here automatically updates ProgressBar, TourNav, and routing.

export type TourStep = {
  index: number;          // 0-based internal index
  number: number;         // 1-based display number  (0 = welcome, hidden from progress bar)
  slug: string;           // URL slug under /tour or "/" for welcome
  path: string;           // full pathname
  label: string;          // short label for progress bar
  title: string;          // step page title
  subtitle?: string;      // optional one-liner under the title
  showInProgress: boolean;// Welcome / Master final card hide from progress bar
};

export const TOUR_STEPS: TourStep[] = [
  {
    index: 0,
    number: 0,
    slug: "welcome",
    path: "/",
    label: "시작",
    title: "HCG 컨설팅, 어떻게 함께하시겠어요?",
    subtitle: "5분 인터랙티브 체험으로 자문 서비스를 직접 경험해보세요",
    showInProgress: false,
  },
  {
    index: 1,
    number: 1,
    slug: "1-diagnose",
    path: "/tour/1-diagnose",
    label: "진단",
    title: "지금 상황을 1분만 알려주세요",
    subtitle: "회사 규모, HR 역량, 핵심 페인포인트를 빠르게 짚어봅니다",
    showInProgress: true,
  },
  {
    index: 2,
    number: 2,
    slug: "2-demo",
    path: "/tour/2-demo",
    label: "자문 체험",
    title: "실제 자문은 이렇게 진행됩니다",
    subtitle: "Master 컨설턴트와 대화해보세요. AI가 HCG 전문가 톤으로 답합니다",
    showInProgress: true,
  },
  {
    index: 3,
    number: 3,
    slug: "3-deliverables",
    path: "/tour/3-deliverables",
    label: "산출물",
    title: "이런 자료들이 전달됩니다",
    subtitle: "20+ HR 제도 템플릿 · 즉시 사용 가능한 양식",
    showInProgress: true,
  },
  {
    index: 4,
    number: 4,
    slug: "4-process",
    path: "/tour/4-process",
    label: "프로세스",
    title: "함께하는 6개월, 이렇게 흘러갑니다",
    subtitle: "주차별로 무엇이 일어나는지 미리 확인하세요",
    showInProgress: true,
  },
  {
    index: 5,
    number: 5,
    slug: "5-before-after",
    path: "/tour/5-before-after",
    label: "Before / After",
    title: "당신의 페인포인트, 이렇게 변합니다",
    subtitle: "선택하신 과제 기반 변화 시나리오",
    showInProgress: true,
  },
  {
    index: 6,
    number: 6,
    slug: "6-master",
    path: "/tour/6-master",
    label: "플랜 선택",
    title: "Master 플랜을 골라주세요",
    subtitle: "회사 규모와 단계에 맞는 3가지 옵션",
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
