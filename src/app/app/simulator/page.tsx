import { Suspense } from "react";
import { SimulatorPanel } from "@/components/simulator/simulator-panel";
import { SimulatorSafetyConsent } from "@/components/simulator/simulator-safety-consent";

export const metadata = {
  title: "Mô phỏng - JokingFinance",
};

export default function AppSimulatorPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-md border border-[#d9ddd3] bg-white p-6">
          Đang tải mô phỏng...
        </div>
      }
    >
      <SimulatorSafetyConsent>
        <SimulatorPanel />
      </SimulatorSafetyConsent>
    </Suspense>
  );
}
