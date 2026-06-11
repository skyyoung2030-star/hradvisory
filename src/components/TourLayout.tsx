import { Outlet } from "react-router-dom";
import TourProgressBar from "./TourProgressBar";

/**
 * Layout for /tour/* routes. Renders persistent ProgressBar at the top
 * and an <Outlet/> below for the current step. The bottom TourNav lives
 * inside each step (so individual steps can control disableNext/onBeforeNext).
 */
export default function TourLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <TourProgressBar />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
