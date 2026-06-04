import { Suspense } from "react";
import { MissionsPanel } from "@/components/simulator/missions-panel";

export const metadata = {
  title: "Nhiệm vụ - JokingFinance",
};

export default function AppMissionsPage() {
  return (
    <Suspense fallback={<div className="rounded-md border border-[#d9ddd3] bg-white p-6">Đang tải nhiệm vụ...</div>}>
      <MissionsPanel />
    </Suspense>
  );
}
