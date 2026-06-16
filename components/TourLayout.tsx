import { Outlet } from "react-router-dom";
import TourProgressBar from "./TourProgressBar";

export default function TourLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-ink-50 bg-spotlight relative">
      {/* Subtle line-grid texture across all tour steps for surface depth */}
      <div aria-hidden className="absolute inset-0 bg-grid-line mask-vignette opacity-60 pointer-events-none" />
      <div className="relative flex flex-col min-h-screen">
        <TourProgressBar />
        <main className="flex-1 flex flex-col">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
