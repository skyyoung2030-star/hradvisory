import { Routes, Route } from "react-router-dom";
import Welcome from "@/pages/Welcome";
import TourLayout from "@/components/TourLayout";
import ScrollToTop from "@/components/ScrollToTop";
import Step1Diagnose from "@/pages/Step1Diagnose";
import Step2Demo from "@/pages/Step2Demo";
import Step3Deliverables from "@/pages/Step3Deliverables";
import Step4Simulate from "@/pages/Step4Simulate";
import Step5Modes from "@/pages/Step5Modes";
import Step6Master from "@/pages/Step6Master";
import Step7System from "@/pages/Step7System";
import AdminInbox from "@/pages/AdminInbox";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/admin" element={<AdminInbox />} />
        <Route path="/tour" element={<TourLayout />}>
          <Route path="1-diagnose"     element={<Step1Diagnose />} />
          <Route path="2-demo"         element={<Step2Demo />} />
          <Route path="3-deliverables" element={<Step3Deliverables />} />
          <Route path="4-simulate"     element={<Step4Simulate />} />
          <Route path="5-modes"        element={<Step5Modes />} />
          <Route path="6-master"       element={<Step6Master />} />
          <Route path="7-system"       element={<Step7System />} />
        </Route>
      </Routes>
    </>
  );
}