import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Resets window scroll to top whenever the route changes.
 * React Router preserves scroll position by default — this restores
 * the "new page starts at top" expectation people have from regular sites.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Use 'auto' (instant) — smooth would feel sluggish on every nav
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}
