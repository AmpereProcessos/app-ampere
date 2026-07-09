import type { TAuthSession } from "@/lib/authentication/types";
import React, { useState } from "react";
import ReceiptsBlock from "./blocos/ReceiptsBlock";
import RevenuesBlock from "./blocos/RevenuesBlock";
import { Button } from "@/components/ui/button";
import NewRevenue from "./modals/NewRevenue";
import RevenueStats from "./RevenueStats";

type RevenuesPageProps = {
  session: TAuthSession;
};
function RevenuesPage({ session }: RevenuesPageProps) {
  const [newRevenueModalIsOpen, setNewRevenueModalIsOpen] = useState<boolean>(false);
  const storedReceiptsTypesFilterStr = localStorage.getItem("receipts-types-filter");
  const storedReceiptsTypesFilter = storedReceiptsTypesFilterStr
    ? (JSON.parse(storedReceiptsTypesFilterStr) as string[])
    : [];
  const storedRevenuesTypesFilterStr = localStorage.getItem("revenues-types-filter");
  const storedRevenuesTypesFilter = storedRevenuesTypesFilterStr
    ? (JSON.parse(storedRevenuesTypesFilterStr) as string[])
    : [];
  return (
    <div className="flex grow flex-col gap-2 p-6">
      <div className="border-border flex flex-col items-center justify-between border-b p-1">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col items-center gap-2 lg:flex-row">
            <p className="text-center text-2xl font-black text-[#15599a] uppercase">RECEITAS</p>
          </div>
          <Button onClick={() => setNewRevenueModalIsOpen(true)}>NOVA RECEITA</Button>
        </div>
      </div>
      <RevenueStats />
      <div className="flex max-h-[600px] w-full flex-col gap-6 lg:flex-row">
        <div className="w-full lg:w-[40%]">
          <ReceiptsBlock session={session} storedReceiptsTypesFilter={storedReceiptsTypesFilter} />
        </div>
        <div className="w-full lg:w-[60%]">
          <RevenuesBlock session={session} storedRevenuesTypesFilter={storedRevenuesTypesFilter} />
        </div>
      </div>
      {newRevenueModalIsOpen ? (
        <NewRevenue session={session} closeModal={() => setNewRevenueModalIsOpen(false)} />
      ) : null}
    </div>
  );
}

export default RevenuesPage;
