"use client";

import React from "react";
import { ChatSidebar } from "@/components/chat";
import { HomeHeader } from "@/components/home-header";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SummaryCards } from "@/components/wallet/summary-cards";

import data from "../../data/dashboard-data.json";

export default function Page() {
  return (
    <main className="">
      <HomeHeader />

      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SummaryCards />
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>
            <DataTable data={data} />
          </div>
        </div>
      </div>

      <React.Suspense fallback={null}>
        <ChatSidebar />
      </React.Suspense>
    </main>
  );
}
