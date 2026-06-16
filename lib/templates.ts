// src/lib/templates.ts
// HCG 실제 컨설팅 사례에서 발췌해 정리한 템플릿/매뉴얼 카탈로그.
// area는 진단 페인포인트와 매칭되며 (PAIN_TO_AREA), Step 3 카드 + 모달
// 미리보기에서 그대로 사용됨.

export type Template = {
  id: string;
  area: "직급" | "평가" | "보상" | "직무" | "승진" | "리더십" | "조직문화" | "AI";
  name: string;
  description: string;
  /** 한 줄 핵심 메시지 — 카드/모달 상단에 강조 표시 */
  highlight: string;
  /** 모달에 보여줄 실제 컨텐츠 항목들 */
  contents: string[];
  /** 모달 하단 메타 정보 */
  format: string;
  pages?: string;
  isFree: boolean;
};

export const TEMPLATES: Template[] = [
  /* ─────────────── 직급 ─────────────── */
  {
    id: "grade_integration_guide",
    area: "직급",
    name: "직급체계 통합 설계 가이드",
    description: "5~7단계 → 3~4단계 통합 시나리오와 의사결정 프레임",
    highlight: "회사 효율성 + 직원 수용성 모두 검토하는 4-Factor 모델",
    contents: [
      "직급단계 통합 시 고려사항 — 인력구조 / 인건비 관리 / 수용성 / 동기부여",
      "통합 시나리오 비교: 2단계 vs 3단계 vs 4단계 (장단점 매트릭스)",
      "역할기반(Job Role) · 역량기반(Competency) · 직무기반(Job Value) · 연공기반 비교표",
      "동종업계 직급단계 벤치마크 (물류기업 A사 4단계 · 식품기업 A사 3~7단계 탄력 운영)",
      "통합 후 호칭체계 운영 옵션 (선임·책임·수석 vs 매니저·책임 매니저)",
    ],
    format: "PDF 가이드북 + Excel 시뮬레이터",
    pages: "32 페이지",
    isFree: true,
  },
  {
    id: "grade_qualification_template",
    area: "직급",
    name: "직급별 자격 기준 Template",
    description: "직급마다 필요한 경력·역량·성과 기준 정리",
    highlight: "G1(실무자) → G2(전문가) → G3(조직 리딩) 역할 정의 + 체류연한 산정",
    contents: [
      "직급별 역할 정의: 업무 실무자 / 업무 전문가 / 조직 리딩(및 후보)",
      "표준 체류연한 산출 로직 (운송업 A사 케이스: G2 7년, G3 8년)",
      "직급별 기대 성과 수준 — Quality·Quantity·Timing 5점 척도",
      "직급별 필수 역량 행동지표 (공통역량 3개 / 직무역량 6개)",
      "외부 채용 시 직급 매칭 기준표",
    ],
    format: "Word + Excel",
    pages: "24 페이지",
    isFree: false,
  },
  {
    id: "grade_transition_scenario",
    area: "직급",
    name: "직급 체계 전환 시나리오",
    description: "6단계 → 4단계 통합 시 전환 매트릭스",
    highlight: "Sliding 전환 vs 인력 분리 전환 — 회사 상황별 선택 가이드",
    contents: [
      "전환 방식 1: 직급 대 직급 Sliding 일괄 전환 — 수용성 ↑, 개별 이슈 ↓",
      "전환 방식 2-1: 직위연차 기준 분리 — 특정 연차 상하위 분리",
      "전환 방식 2-2: 경력연수 기준 분리 — 현 직위 무관 총 경력 재설정",
      "전환 방식 2-3: 역량수준 기준 분리 — 평가 통한 분류",
      "승진 인상 상실분 보전금 산정 로직 (Discount 계수 적용 예시)",
    ],
    format: "PDF + Excel 모의 산출표",
    pages: "18 페이지",
    isFree: false,
  },

  /* ─────────────── 평가 ─────────────── */
  {
    id: "okr_dictionary",
    area: "평가",
    name: "OKR Dictionary",
    description: "OKR 도입 회사를 위한 목표 작성 가이드",
    highlight: "BII 관점의 도전적 목표 — Build · Innovate · Improve",
    contents: [
      "OKR vs MBO 비교표 — Top-down/Bottom-up, 도전적 목표, 과정 중심",
      "Objectives 작성 가이드 — 분기 단위, 평균 기대수준 70% 정의",
      "Key Results 설계 — 측정 가능한 수치, 최대 5개 이하",
      "BII 목표 예시: Build(신규) / Innovate(재창조) / Improve(발전)",
      "Bad OKR vs Good OKR — 실제 제조업 A사 · 화장품기업 A사 사례 12선",
      "분기별 Check-in 미팅 진행 가이드",
    ],
    format: "Notion 워크스페이스",
    pages: "Notion + Excel 템플릿",
    isFree: true,
  },
  {
    id: "evaluation_scale_guide",
    area: "평가",
    name: "평가 등급 분포 가이드",
    description: "S/A/B/C/D 5단계 평가 척도 및 환산점수 표",
    highlight: "Quality · Quantity · Timing 3축으로 5점 척도 정의",
    contents: [
      "5점 척도 정의: 탁월(100점) / 우수(90) / 보통(80) / 미흡(70) / 부족(60)",
      "Quality 평가 기준: 결과물 내용이 기대수준 대비 어느 정도?",
      "Quantity 평가 기준: 목표한 빈도·업무량 달성도(120% / 100~120% / 80~100% ...)",
      "Timing 평가 기준: 예정 기한 대비 달성도",
      "종합등급 부여 기준 (S 85점+ / A 75~85 / B 60~75 / C 60-)",
      "케미칼·롯데 등 대기업 적용 사례 비교",
    ],
    format: "PDF + Excel 채점 시트",
    pages: "16 페이지",
    isFree: true,
  },
  {
    id: "workway_diagnosis",
    area: "평가",
    name: "Work Way 다면진단 Template",
    description: "일하는 방식에 대한 360도 진단 설문지",
    highlight: "11개 항목 33개 행동지표 — 강점/보통/약점 척도",
    contents: [
      "공통역량 3개: 도전 · 팀워크 · 문제해결",
      "직무역량 6개 (마케팅 예시): 책임감 / 실행력 / 사업적 통찰력 / 전략적 사고 / 기획력 / 프로젝트 관리",
      "협업역량 다면진단 (Co-worker 기반 진단자 선정)",
      "정성 평가 형식: Keep Going / Rethink 구분 서술",
      "진단 결과를 평가/육성에 활용하는 가이드",
      "다면평가에 대한 부정적 인식 해소 커뮤니케이션 가이드",
    ],
    format: "Excel 진단지 + 결과 분석 시트",
    pages: "20 페이지",
    isFree: false,
  },
  {
    id: "checkin_meeting_guide",
    area: "평가",
    name: "Check-in 미팅 가이드",
    description: "분기별 1:1 미팅 운영 매뉴얼",
    highlight: "평가가 아닌 코칭 — 목표 진척 점검과 장애 해소",
    contents: [
      "Check-in 미팅 vs 기존 면담의 차이 (Drive & Support vs Manage & Control)",
      "분기 사이클: 목표설정 → 점검 → 회고 → 재설정",
      "미팅 질문 가이드 30선 — 진척, 장애요소, 우선순위 재설정, 학습",
      "1:1 미팅 노트 템플릿 (Notion · Excel)",
      "인정 피드백(Recognition Feedback) 작성 예시",
      "리더 교육 자료 — Check-in을 평가 도구로 쓰지 않기",
    ],
    format: "Notion + PDF",
    pages: "12 페이지",
    isFree: true,
  },
  {
    id: "calibration_session_manual",
    area: "평가",
    name: "Calibration Session 운영 매뉴얼",
    description: "평가자 간 등급 협의 회의 진행 가이드",
    highlight: "1·2차 평가자 협의를 통한 평가 공정성 확보",
    contents: [
      "Session 운영 목적과 구성 — 본부 단위 / 전사 단위",
      "Session 진행 절차 (Opening → 후보 검토 → 등급 결정 → Closing)",
      "Session 참석자 R&R (위원장 / 위원 / 간사 / HR)",
      "평가 결과 분포 사전 점검 체크리스트",
      "이의제기 대응 프로세스 (절차 준수 / 만족도 / 이의제기 통합 운영)",
      "한국타이어 · 아주그룹 등 운영 사례",
    ],
    format: "PDF",
    pages: "14 페이지",
    isFree: false,
  },

  /* ─────────────── 보상 ─────────────── */
  {
    id: "payband_simulator",
    area: "보상",
    name: "Pay Band Simulator",
    description: "직급별 Min-Mid-Max 시뮬레이션 엑셀",
    highlight: "Range Spread, Compound Rate, Overlap 자동 계산",
    contents: [
      "직급별 초임 설정 (사원/대리/책임/수석) — Pay Policy Line 반영",
      "Range Spread 산출 — Compound Rate = (1+α)^n - 1",
      "예시: 사원 21.6% / 대리 26.5% / 책임 36.9% / 수석 42.6%",
      "Overlap 검증 — 제조업 A사 사례 10.7% · 17.9% · 52.6%",
      "Reference Point Progression — 기준값 상승률 18.8% / 23.5% / 10.2%",
      "단계적 Catch-up 운영 방안 (3년 50% → 75% → 100%)",
    ],
    format: "Excel 시뮬레이터",
    pages: "Sheet 6개",
    isFree: true,
  },
  {
    id: "compa_ratio_management",
    area: "보상",
    name: "Compa-Ratio 관리 가이드",
    description: "Pay Band 內 보상 격차 해소 방안",
    highlight: "중간값 인상 vs Pay Zone 방식 — 회사 상황별 선택",
    contents: [
      "Compa-Ratio = 개인 연봉 / Pay Band 중간값 (적정 0.85~1.15)",
      "Opt 1: 중간값 인상 방식 — Band 중간값 기준 인상금액 적용",
      "Opt 2: Pay Zone 방식 — Band 내 구간별 인상률 차등 (예: -2% / +0% / +2%)",
      "직급 내·간 보상 역전 현상 진단 체크리스트",
      "Merit Matrix 설계 가이드 (평가등급 × Compa-Ratio 격자)",
      "화장품기업 A사 · 식품기업 B사 보상 분포 분석 사례",
    ],
    format: "PDF + Excel",
    pages: "18 페이지",
    isFree: false,
  },
  {
    id: "salary_increase_matrix",
    area: "보상",
    name: "성과 기반 임금 인상 Matrix",
    description: "평가 등급별 차등 인상률 설계 가이드",
    highlight: "평균 5% 기준, S등급은 1.5배 이상 차등 (AON 벤치마크)",
    contents: [
      "평가 등급별 단일 인상률 vs Merit Matrix vs 자유 재량 — 65% 기업이 Compa-Ratio 방식",
      "S 7.7% / A 6.4% / B 4.9% / C 2.3% / D 0.8% (AON Korea 2013-14 기준)",
      "절대평가 도입 시 재원 고정 방식 (Opt 1/2/3 비교)",
      "성과연봉 지급률 차등폭 설계 (10/7.5/5/2.5/0 vs 8/6/5/2/0)",
      "Variable Pay 강화 트렌드 (식품기업 A사 NEXT HR 사례)",
      "Profit Sharing · Target Incentive · Retention 보너스 설계",
    ],
    format: "PDF + Excel 시뮬레이터",
    pages: "22 페이지",
    isFree: false,
  },
  {
    id: "incentive_design",
    area: "보상",
    name: "경영성과급 (PS) 설계 가이드",
    description: "영업이익 연계 성과급 산출 로직",
    highlight: "전사 균등 배분 + Circuit Breaker 설정",
    contents: [
      "Profit Sharing 설계 옵션: 영업이익 % 배분 / EVA 기반 / Target 대비",
      "제조업 A사 사례: 영업이익 2.1% 전사 균등 배분, 목표 85% Circuit Breaker",
      "직책수당 설계 (실/팀장 월 20만 → 조직 재정비 시 실장급 상향)",
      "재량보상 운영 — 본부장 재량, 5% 대상 약 300만원 권장 수준",
      "차량유지비 · 특지수당 등 기타임금 재정비 가이드",
      "도입 단계별 재원 산출 — 단기 / 중기 / 장기",
    ],
    format: "PDF + Excel",
    pages: "16 페이지",
    isFree: false,
  },

  /* ─────────────── 직무 ─────────────── */
  {
    id: "job_family_matrix",
    area: "직무",
    name: "Job Family Matrix Template",
    description: "직군 / 직렬 / 직무 분류 체계 설계",
    highlight: "전략적 방향성 + 직무 동질성 양 기준으로 직군 분류",
    contents: [
      "직군 분류 기준 — 업무 성격 / 프로세스 군 / 조직 운영 단위",
      "직군 분리가 수월한 경우 vs 어려운 경우 진단",
      "직렬 분류 기준 — 직무 이동 용이성, 역량 개발 동질성",
      "직군/직렬 체계 개편 프로세스 (인사팀 + SME + 의사결정권자 R&R)",
      "Job Family Matrix 작성 예시 (R&D 직군: 연구기획·HW·SW·클라우드 등)",
      "직무 변경 신청 프로세스 (Case 1·2 분기점 다이어그램)",
    ],
    format: "Excel + 프로세스 다이어그램",
    pages: "20 페이지",
    isFree: false,
  },
  {
    id: "job_description_template",
    area: "직무",
    name: "직무기술서 Template",
    description: "포지션별 책임/요건 정리 양식",
    highlight: "Position Description — 인사팀 + 현업 팀장 공동 작성",
    contents: [
      "직무 개요 — 직군/직렬, 보고체계, 주요 책임",
      "수행 업무 (Key Activities) 5~8개 항목",
      "필요 역량 — 공통역량 / 직무역량 / 리더십역량 (직책자만)",
      "자격 요건 — 학력, 경력, 자격증, 외국어",
      "성과 측정 기준 — KPI 또는 OKR 예시",
      "직무 변경 시 업데이트 프로세스",
    ],
    format: "Word + Excel",
    pages: "1인당 2-3 페이지",
    isFree: true,
  },
  {
    id: "job_competency_diagnosis",
    area: "직무",
    name: "직무역량 진단 도구",
    description: "직군별 역량 항목 및 Level 진단",
    highlight: "IT보안기업 A사 케이스 — R&D 직군 12개 역량 × 5 Level",
    contents: [
      "직무체계도 — 직군/직종/직무 트리 구조",
      "역량 항목 정의 — 직군별 핵심 역량 5~8개",
      "Level별 행동지표 — Level 1(인지) ~ Level 5(전문가) 단계 정의",
      "진단 방식 — 자기진단 + 상위자 진단 (2-way)",
      "진단 결과 분석 — 개인별 / 팀별 강점·약점 매핑",
      "교육 연계 — 역량 갭 기반 교육 추천",
    ],
    format: "Excel 진단지 + 시스템 예시",
    pages: "24 페이지",
    isFree: false,
  },

  /* ─────────────── 승진 ─────────────── */
  {
    id: "promotion_session_manual",
    area: "승진",
    name: "승진 Session 운영 매뉴얼",
    description: "공식 승진 심사 회의 진행 가이드",
    highlight: "1차 Screening + 2차 Selecting — 점수 서열화 탈피",
    contents: [
      "1차 Screening — Hurdle 기반 후보자 Pool 구성 (체류연한·평가·외국어·교육)",
      "2차 Selecting — 평가자 의견서 + 다면진단 기반 심층 논의",
      "Session 구성 — 위원장(사장/총괄) · 위원(본부장/실장) · 간사(HR)",
      "후보자 Profile 작성 가이드 (이력·평가·Work Way·리더십 Snapshot)",
      "Session Agenda 운영 (Opening 5분 → Agenda 1·2 → Wrap up)",
      "심사 기준 가중치 — 평가 10%·성과사례 10%·전문성 35%·리더 자질 35%·다면 10%",
    ],
    format: "PDF 매뉴얼 + 진행 슬라이드",
    pages: "26 페이지",
    isFree: false,
  },
  {
    id: "promotion_candidate_profile",
    area: "승진",
    name: "승진 후보자 Profile Template",
    description: "심사 자료 1인당 1장 정리 양식",
    highlight: "최근 3개년 이력 + 평가 + Work Way + 리더십을 한눈에",
    contents: [
      "기본 정보 — 성명, 소속, 직책, 담당 직무, 직급년차, 학력",
      "최근 3개년 평가 등급 (2020-2023 시계열)",
      "최근 3개년 주요 이력 — 프로젝트/TFT/특이 성과",
      "당해년도 업적평가 — 목표 / 달성 수준 / 평가 / 가중치",
      "Work Way 다면진단 결과 — 강점 / 보완점 시계열",
      "리더십 Snapshot (G3 승진 시) — 수준 · Derailer Matrix",
      "평가자 종합 의견 (200자 이내)",
    ],
    format: "PowerPoint 1장 / 후보자",
    pages: "예시 5명",
    isFree: true,
  },
  {
    id: "promotion_rate_management",
    area: "승진",
    name: "승진율 관리 가이드",
    description: "인력구조 안정화를 위한 승진율 통제",
    highlight: "승진 인상 상실분 보전 + 직급별 T/O 관리",
    contents: [
      "최근 3개년 직급별 승진율 분석 (사원→주임 98% / 주임→대리 93% ...)",
      "직급별 T/O 산출 로직 — 인력구조 항아리형 vs 피라미드형",
      "승진 인상 상실분 보전 — Discount 계수 적용 (운송업 A사 사례: 단기 약 2.0억)",
      "직급 통합 시 보전금 산정 — 체류연한·승진율 가중",
      "사원/주임 연차가급 지급 vs 일괄 인상 옵션 비교",
      "임원 초임과의 Gap 관리 (G3 상한 = 이사 초임 90%)",
    ],
    format: "PDF + Excel 시뮬레이터",
    pages: "18 페이지",
    isFree: false,
  },

  /* ─────────────── 리더십 ─────────────── */
  {
    id: "leadership_360_diagnosis",
    area: "리더십",
    name: "팀장 360도 진단 도구",
    description: "리더십 수준 + Derailer 이중 체계 진단",
    highlight: "Promotion · Replacement · Suitable · Development · Validation 5존",
    contents: [
      "리더십 수준 진단 — Performance(결단력·전략·전문성) + People(동기부여·팀워크·공정성)",
      "리더십 Derailer 진단 — 비윤리형·성과지상주의·소통장애 등 10개 위험 유형",
      "진단 척도 — 강점(20점) / 보통(15점) / 약점(10점)",
      "리더십 Snapshot — Level × Derailer 9-Block 매트릭스",
      "5개 구간별 의사결정 — 승진·교체·코칭·육성·검증",
      "공개 범위 가이드 — 부문장 이상 Top Management 한정",
    ],
    format: "Excel 진단지 + 결과 리포트",
    pages: "28 페이지",
    isFree: false,
  },
  {
    id: "leadership_competency_model",
    area: "리더십",
    name: "리더십 역량 모델",
    description: "리더 역할별 필요 역량 정의",
    highlight: "6대 핵심 역량 + 행동지표 24개",
    contents: [
      "비전 제시 — 전사 비전과 조직목표 연계, 비전 공유 (행동지표 2개)",
      "전략 실행력 — 우선순위 설정, 추진 일관성 (2개)",
      "변화 관리 — 변화 대응력, 내·외부 변화 확산 주도 (2개)",
      "인재 육성 — 업무를 통한 역량 향상, 자발적 동기부여 (2개)",
      "결단력 / 책임감 / 치밀함 — Performance 영역 (3개 × 행동지표)",
      "열린 소통 / 팀워크 / 공정성 — People 영역 (3개 × 행동지표)",
    ],
    format: "PDF + Word",
    pages: "20 페이지",
    isFree: true,
  },
  {
    id: "leadership_coaching_program",
    area: "리더십",
    name: "리더십 코칭 프로그램",
    description: "진단 결과 기반 1:1 코칭 가이드",
    highlight: "Snapshot 5구간별 맞춤 코칭 모듈",
    contents: [
      "Development 구간 코칭 — 리더십 수준 강화 (월 1회 × 6개월)",
      "Validation 구간 코칭 — Derailer 발현 환경/개인 요인 검증",
      "Suitable 구간 — 지속적 리더십 강화 독려 (분기 1회)",
      "리더 스스로의 변화 — 진단결과 Feedback & Reflection 세션",
      "1:1 코칭 vs 그룹 워크숍 vs 멘토링 — 유형별 가이드",
      "리더십 개발 (Development) vs 승계관리 (Succession Plan) 활용",
    ],
    format: "PDF 가이드 + 코칭 노트",
    pages: "30 페이지",
    isFree: false,
  },
  {
    id: "leader_succession_planning",
    area: "리더십",
    name: "Succession Plan Template",
    description: "차세대 리더 승계 계획 양식",
    highlight: "Successor Group I·II·III — 직급별 후계자 풀 관리",
    contents: [
      "포지션별 Successor Pool — Group I(즉시) / II(1-2년) / III(3-5년)",
      "후계자 적합도 평가 — 진단결과 × 포지션 요건 매칭",
      "Readiness Level 평가 — Ready Now / Ready Soon / Future Talent",
      "후계자별 개발 계획 (IDP) 양식",
      "분기별 Successor Review Session 운영 가이드",
      "외부 채용 vs 내부 육성 결정 프레임",
    ],
    format: "Excel + PowerPoint",
    pages: "16 페이지",
    isFree: false,
  },

  /* ─────────────── 조직문화 ─────────────── */
  {
    id: "employee_engagement_survey",
    area: "조직문화",
    name: "전사 조직진단 서베이",
    description: "직원 몰입도 · 만족도 종합 진단",
    highlight: "Driver × Outcome — Effective / Detached / Ineffective / Frustrated",
    contents: [
      "9개 영역 × 38개 문항: 전략·조직·일하는 방식·평가·보상·승진·복지·리더십·조직문화",
      "직원 유형 분석 — Driver(지원환경) × Outcome(몰입·만족) 4사분면",
      "Effective 유형 비중 진단 (예: 제조업 B사 Effective 52% · Ineffective 22% · Frustrated 23%)",
      "Top 5 / Bottom 5 영역 추출 — 노력·소속감·가치추구 vs 외부경쟁력·복리후생",
      "IPA 분석 — 중요도 × 만족도 매트릭스로 개선 우선순위 도출",
      "상관관계 분석 — 만족도에 가장 영향 큰 요인 식별",
    ],
    format: "Excel 설문지 + 결과 분석 리포트",
    pages: "설문 38문항 + 분석 40 페이지",
    isFree: true,
  },
  {
    id: "culture_improvement_program",
    area: "조직문화",
    name: "조직문화 개선 프로그램 카탈로그",
    description: "20가지 개선 활동 효과성 비교표",
    highlight: "프로그램 효과성 × 운영 효율성 × 참여도 3축 평가",
    contents: [
      "협업조직 멘토링 / 경영진 멘토스쿨 / 리버스 멘토링",
      "실패에 대한 인정 (P&G·BMW·Honda·3M 사례)",
      "업무개선 아이디어 (1차 투표 → 2차 심사 → 포상)",
      "응답하라 2033 (식품기업 B사 케이스) (구성원 아이디어 제작/공유)",
      "사내 전문가 그룹 — 연구 주제 자유 활동, 우수사례 포상",
      "조직 시너지 미팅 — 협업 필요 업무·이슈 분기별 운영",
      "리더십 개선사항 도출 — 구성원 의견 → 개선 계획 수립 → 행동 관찰 → 평가",
    ],
    format: "PDF 카탈로그",
    pages: "20 프로그램 × 1-2 페이지",
    isFree: false,
  },
  {
    id: "culture_action_workshop",
    area: "조직문화",
    name: "조직문화 액션 워크숍 가이드",
    description: "진단 후 직원 인볼브 워크숍 진행 매뉴얼",
    highlight: "진단 → 공유 → 액션 도출 → 실행 → 모니터링 12개월 사이클",
    contents: [
      "Phase 1 (1-2월): 결과 공유 타운홀 — 데이터 투명 공개",
      "Phase 2 (3-4월): 부서별 워크숍 — Top 3 이슈 액션 도출",
      "Phase 3 (5-10월): 실행 + 분기 점검",
      "Phase 4 (11-12월): 변화 확인 진단 + 차년도 계획",
      "워크숍 진행 도구 — 페르소나 카드, 가치 정렬 카드, 액션 캔버스",
      "조직별 이슈 분석 사례 (관리·생산·연구·영업·품질)",
    ],
    format: "PDF + Notion 워크숍 키트",
    pages: "32 페이지",
    isFree: false,
  },

  /* ─────────────── AI ─────────────── */
  {
    id: "ai-eval-comment-assistant",
    area: "AI",
    name: "AI 평가 코멘트 어시스턴트",
    description: "평가자가 키워드만 입력하면 평가 코멘트 초안을 자동 생성하는 AI 도구",
    highlight: "평가 코멘트 작성 시간 70% 단축 · 일관된 톤 자동 유지",
    contents: [
      "핵심 성과 키워드 3-5개 입력 → 평가 코멘트 3가지 톤(긍정/균형/개선) 자동 생성",
      "공통역량 · 직무역량 평가 코멘트 분리 출력",
      "팀장별 코멘트 편차 진단 — 너무 후하거나 너무 짧은 패턴 자동 탐지",
      "평가자 가이드 — AI가 놓치기 쉬운 정성 포인트 chk list",
      "talenx의 elizax AI 엔진과 연동 — 도메인 특화 학습 결과",
    ],
    format: "talenx 모듈 + 가이드 PDF",
    pages: "도입 가이드 12 페이지",
    isFree: false,
  },
  {
    id: "ai-1on1-coaching-guide",
    area: "AI",
    name: "AI 면담 코칭 가이드",
    description: "팀장이 1:1 미팅 전 AI에게 직원 컨텍스트를 입력하면 맞춤 코칭 질문 자동 추천",
    highlight: "팀장 리더십 편차 좁히기 · 면담 품질 균질화",
    contents: [
      "직원별 OKR · 최근 평가 데이터 기반 맞춤 코칭 질문 5-7개 자동 추천",
      "유형별 면담 시나리오 — 신임자 / 정체기 / 고성과자 / 저성과자",
      "면담 후 follow-up 액션 자동 정리 — 다음 분기 1:1 미팅 연계",
      "팀장 코칭 자가진단 — Derailer 항목 기반 자동 체크리스트",
      "코칭 대화 예시 라이브러리 (40+ 시나리오)",
    ],
    format: "talenx 모듈 + 코칭 카드 PDF",
    pages: "코칭 카드 40+",
    isFree: false,
  },
  {
    id: "ai-hr-analytics-dashboard",
    area: "AI",
    name: "AI HR Analytics 대시보드",
    description: "이탈률 · eNPS · Compa-Ratio · 평가 분포 등 핵심 지표를 자동 분석하고 인사이트 추출",
    highlight: "분기 진단 자동화 · 의사결정 sparring partner",
    contents: [
      "분기별 HR Health Check 자동 리포트 (이탈률 · 평가 분포 · 승진율 등 6개 핵심 지표)",
      "이탈 위험군 자동 탐지 — Compa-Ratio · 평가 트렌드 · 면담 빈도 결합 분석",
      "AI 인사이트 — '왜 이 segment 이탈률이 높은가?' 자동 추론",
      "경영진 보고용 대시보드 자동 생성 (월간/분기/연간)",
      "이상치 알림 — 특정 부서 이탈률 급증 시 즉시 통보",
    ],
    format: "talenx 대시보드 + 샘플 리포트 PDF",
    pages: "샘플 리포트 24 페이지",
    isFree: false,
  },
  {
    id: "ai-onboarding-bot",
    area: "AI",
    name: "AI 온보딩 어시스턴트",
    description: "신입사원이 회사 정보 · 제도 · 시스템 사용법을 챗봇으로 학습하는 AI 도우미",
    highlight: "신입 적응 기간 단축 · HR 반복 문의 80% 감소",
    contents: [
      "회사 위키 · 인사규정 · 복리후생 챗봇 형태 학습",
      "30-60-90일 온보딩 체크리스트 자동 푸시 · 진행 상황 추적",
      "신입 적응 진단 — 입사 30일/90일 자동 면담 알림 + 설문",
      "멘토 · 버디 매칭 자동화 — 부서 · 연차 · 관심사 기반",
      "FAQ 자동 답변 — '연차 며칠 남았어?' '회식비 정산 어디서?' 같은 반복 문의 처리",
    ],
    format: "talenx 챗봇 + 도입 가이드",
    pages: "도입 가이드 16 페이지",
    isFree: false,
  },
];

/* PAIN_TO_AREAS — 1:N 매핑 (페인당 1~2개, 평균 1.3개)
   여러 모듈이 영향 주는 건 맞지만, 정말 본질적 driver만 남겨야 강조의 의미가 살아남.
   "관련 있음" 정도로 끼우지 않고 "이게 핵심이다"인 것만. */
export const PAIN_TO_AREAS: Record<string, Template["area"][]> = {
  job_grade_complex: ["직급"],
  decision_slow:     ["직급"],              // 직급 단축이 압도. R&R은 부차.
  eval_unfair:       ["평가"],
  goal_miss:         ["평가", "리더십"],    // OKR + 1:1 코칭이 진짜 driver
  poor_alignment:    ["조직문화"],          // 정렬 = 문화 영역
  low_motivation:    ["조직문화", "보상"],  // 인정(문화) + 차등(보상)
  culture_drift:     ["조직문화"],          // 몰입은 문화가 거의 전부
  no_payband:        ["보상"],
  key_talent_risk:   ["보상", "평가"],      // 시장 보상 + 변별 신호
  unclear_job:       ["직무"],              // 직무가 압도
  hire_difficulty:   ["직무"],              // JD 명확화가 핵심. 보상은 부차.
  promo_unclear:     ["승진", "평가"],      // 자격요건 + 평가 hurdle
  weak_leadership:   ["리더십"],
  low_performers:    ["리더십", "평가"],    // PIP = 리더 + 변별
  ai_adoption:       ["AI"],                // AI 단독
};

/* PAIN_TO_AREA — 1:1 backward-compat (primary area).
   Step 3의 초기 active 탭 선택 등에서 사용. */
export const PAIN_TO_AREA: Record<string, Template["area"]> = Object.fromEntries(
  Object.entries(PAIN_TO_AREAS).map(([k, v]) => [k, v[0]])
);