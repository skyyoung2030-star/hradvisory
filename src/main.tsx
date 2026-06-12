import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// StrictMode intentionally not used here:
// In dev, StrictMode invokes effects twice. When combined with framer-motion's
// transform-based enter animations on Korean glyphs over a dark background,
// it produced a transient sub-pixel double-paint that read as ghosted text
// behind the headings. We removed the motion animations from StepShell, and
// dropping StrictMode here closes the second source of the same symptom.
ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);