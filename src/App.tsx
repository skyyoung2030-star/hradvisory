import { Routes, Route } from "react-router-dom";
import Welcome from "@/pages/Welcome";
import TourLayout from "@/components/TourLayout";
import Step1Diagnose from "@/pages/Step1Diagnose";
import Step2Demo from "@/pages/Step2Demo";
import Step3Deliverables from "@/pages/Step3Deliverables";
import Step4Process from "@/pages/Step4Process";
import Step5BeforeAfter from "@/pages/Step5BeforeAfter";
import Step6Master from "@/pages/Step6Master";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/tour" element={<TourLayout />}>
        <Route path="1-diagnose" element={<Step1Diagnose />} />
        <Route path="2-demo" element={<Step2Demo />} />
        <Route path="3-deliverables" element={<Step3Deliverables />} />
        <Route path="4-process" element={<Step4Process />} />
        <Route path="5-before-after" element={<Step5BeforeAfter />} />
        <Route path="6-master" element={<Step6Master />} />
      </Route>
    </Routes>
  );
}
