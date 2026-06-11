import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Users,
  FileText,
  MessageCircle,
  BarChart3,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { getStepBySlug } from "@/lib/tour-config";
import StepShell from "@/components/StepShell";
import TourNav from "@/components/TourNav";
import { cn } from "@/lib/utils";

type Phase = {
  id: string;
  weekRange: string;
  title: string;
  goal: string;
  activities: { icon: LucideIcon; text: string }[];
  outputs: string[];
};

const PHASES: Phase[] = [
  {
    id: "0",
    weekRange: "Week 1~2",
    title: "Kick-off · 진단",
    goal: "현재 HR 상태를 객관적으로 파악합니다",
    activities: [
      { icon: Users, text: "경영진 인터뷰 (2~3회)" },
      { icon: MessageCircle, text: "주요 팀장 1:1 면담" },
      { icon: BarChart3, text: "조직문화 서베이 발송" },
    ],
    outputs: ["현황 진단 보고서", "Quick-Win 우선순위 5선"],
  },
  {
    id: "1",
    weekRange: "Week 3~6",
    title: "구조 설계",
    goal: "직급 · 평가 · 보상의 뼈대를 함께 만듭니다",
    activities: [
      { icon: FileText, text: "직급 통합 시나리오 3안 제시" },
      { icon: FileText, text: "OKR / MBO Dictionary 초안" },
      { icon: BarChart3, text: "Pay Band 시뮬레이션" },
    ],
    outputs: ["직급 체계 v1", "평가 운영 매뉴얼 초안", "Pay Band Excel"],
  },
  {
    id: "2",
    weekRange: "Week 7~12",
    title: "리더 정렬",
    goal: "팀장이 자기 입으로 설명할 수 있게 만듭니다",
    activities: [
      { icon: Users, text: "팀장 워크숍 (2회)" },
      { icon: MessageCircle, text: "1:1 코칭 (선택 팀장 4~6명)" },
      { icon: FileText, text: "평가자 교육 자료 제작" },
    ],
    outputs: ["팀장 교육 매뉴얼", "평가자 가이드북"],
  },
  {
    id: "3",
    weekRange: "Week 13~20",
    title: "시범 운영",
    goal: "한 사이클을 함께 돌려봅니다",
    activities: [
      { icon: Calendar, text: "Check-in 면담 시범 운영" },
      { icon: BarChart3, text: "Calibration 회의 동석" },
      { icon: MessageCircle, text: "이슈 핫라인 상시" },
    ],
    outputs: ["시범 운영 회고", "수정안 v2"],
  },
  {
    id: "4",
    weekRange: "Week 21~24",
    title: "이양 · 정착",
    goal: "내부 운영 가능 상태로 인계합니다",
    activities: [
      { icon: FileText, text: "운영 매뉴얼 최종본 제작" },
      { icon: Users, text: "HR 담당자 OJT" },
      { icon: CheckCircle2, text: "효과 측정 · ROI 보고" },
    ],
    outputs: ["최종 운영 매뉴얼", "성과 측정 리포트"],
  },
];

export default function Step4Process() {
  const step = getStepBySlug("4-process")!;
  const [active, setActive] = useState(0);
  const phase = PHASES[active];

  return (
    <>
      <StepShell step={step}>
        {/* Phase selector — timeline with dots */}
        <div className="relative">
          <div className="absolute left-0 right-0 top-4 h-[2px] bg-primary-200" />
          <div
            className="absolute left-0 top-4 h-[2px] bg-accent-500 transition-all duration-300"
            style={{ width: `${((active + 0.5) / PHASES.length) * 100}%` }}
          />
          <div className="relative grid grid-cols-5 gap-2">
            {PHASES.map((p, i) => {
              const isDone = i < active;
              const isActive = i === active;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActive(i)}
                  className="flex flex-col items-center group"
                >
                  <span
                    className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold transition-all border-2",
                      "group-active:scale-95",
                      isActive
                        ? "bg-accent-500 text-white border-accent-500 scale-110 shadow-lg shadow-accent-500/40"
                        : isDone
                        ? "bg-accent-500 text-white border-accent-500"
                        : "bg-white text-primary-400 border-primary-200 group-hover:border-accent-500 group-hover:text-accent-600",
                    )}
                  >
                    {isDone ? <CheckCircle2 size={14} /> : i + 1}
                  </span>
                  <span
                    className={cn(
                      "mt-2 text-[12px] font-medium transition-colors",
                      isActive ? "text-accent-600" : "text-primary-500",
                    )}
                  >
                    {p.weekRange}
                  </span>
                  <span className="text-[11px] text-primary-400 mt-0.5 text-center leading-tight">
                    {p.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active phase detail */}
        <AnimatePresence mode="wait">
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="mt-12 grid lg:grid-cols-[1fr,1fr] gap-6"
          >
            <div className="card shadow-sm">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-accent-50 text-accent-700 text-[11px] font-bold uppercase tracking-wider">
                {phase.weekRange}
              </div>
              <h2 className="h-2 mt-4">{phase.title}</h2>
              <p className="body text-primary-600 mt-3">{phase.goal}</p>

              <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary-400 mt-7 mb-3">
                이 기간 활동
              </h3>
              <ul className="space-y-2.5">
                {phase.activities.map((a, i) => {
                  const Icon = a.icon;
                  return (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-7 h-7 rounded-lg bg-accent-50 text-accent-600 flex items-center justify-center flex-shrink-0">
                        <Icon size={14} />
                      </span>
                      <span className="body-sm text-primary-700 pt-1">{a.text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="card card-soft">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary-400 mb-3">
                전달 산출물
              </h3>
              <ul className="space-y-3">
                {phase.outputs.map((o, i) => (
                  <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white border border-primary-100">
                    <FileText size={16} className="text-accent-500 mt-0.5 flex-shrink-0" />
                    <span className="body-sm text-primary-800 font-medium">{o}</span>
                  </li>
                ))}
              </ul>
              <p className="caption mt-4">
                각 산출물은 Notion · PDF · Excel 중 회사가 운영하기 쉬운 형태로 전달됩니다.
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </StepShell>

      <TourNav current={step} nextLabel="Before / After" />
    </>
  );
}
