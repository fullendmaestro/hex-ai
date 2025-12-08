import React from "react";
import { ChatSidebar, ChatProvider } from "@/components/chat";
import { HomeHeader } from "@/components/home-header";
import { DataTable } from "@/components/data-table";
import { SummaryCards } from "@/components/wallet/summary-cards";
import { fetchAVSData, fetchOperatorsData } from "./actions";

export default async function Page() {
  // Fetch all EigenLayer data server-side
  const [avsData, operatorsData] = await Promise.all([
    fetchAVSData(),
    fetchOperatorsData(),
  ]);

  // Calculate summary statistics
  const totalAVS = avsData.length;
  const totalOperators = operatorsData.length;
  const totalStakers = avsData.reduce((sum, avs) => sum + avs.totalStakers, 0);
  const avgApy =
    avsData.reduce((sum, avs) => sum + parseFloat(avs.maxApy || "0"), 0) /
    (avsData.length || 1);

  return (
    <ChatProvider>
      <main className="">
        <div className="sticky top-0 z-50">
          <HomeHeader />
        </div>

        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="container mx-auto max-w-7xl px-4 lg:px-6">
                <SummaryCards
                  totalAVS={totalAVS}
                  totalOperators={totalOperators}
                  totalStakers={totalStakers}
                  avgApy={avgApy}
                />
              </div>
              <div className="container mx-auto max-w-7xl px-4 lg:px-6">
                <DataTable avsData={avsData} operatorsData={operatorsData} />
              </div>
            </div>
          </div>
        </div>

        <React.Suspense fallback={null}>
          <ChatSidebar />
        </React.Suspense>
      </main>
    </ChatProvider>
  );
}
