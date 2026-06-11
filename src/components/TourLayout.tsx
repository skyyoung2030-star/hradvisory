import { Outlet } from "react-router-dom";
import TourProgressBar from "./TourProgressBar";

/**
 * Layout for /tour/* routes. Top progress bar + step content via Outlet.
 * Bottom TourNav lives inside each step page (steps own their nav props).
 */
export default function TourLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-soft">
      <TourProgressBar />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
