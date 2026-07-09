import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TRevenueStatsResult } from "@/pages/api/receitas/estatisticas";
import { formatToMoney } from "@/utils/constants";
import { useRevenueStats } from "@/utils/methods/query/revenues";
import { Check, CircleDot, Receipt, ChartNoAxesColumnIncreasing } from "lucide-react";
import React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

function RevenueStats() {
  const { data: stats } = useRevenueStats();
  return (
    <div className="border-primary bg-background flex w-full flex-col gap-2 rounded border p-3 shadow-xs dark:bg-[#121212]">
      <div className="border-border flex w-full items-center justify-between gap-2 border-b pb-3">
        <h1 className="text-sm leading-none font-bold tracking-tight">RESULTADOS</h1>
      </div>
      <div className="flex w-full flex-col gap-6 lg:flex-row">
        <div className="flex h-full max-h-full w-full flex-col gap-2 lg:w-[40%]">
          <div className="border-primary/50 bg-background flex w-full flex-col gap-2 rounded border p-3 shadow-xs dark:bg-[#121212]">
            <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
              <div className="flex items-center justify-start gap-2">
                <Receipt size={12} />
                <h1 className="text-xs leading-none font-medium tracking-tight">TOTAL FATURADO</h1>
              </div>
              <h1 className="leading-none font-black">
                {formatToMoney(stats?.totalFaturado || 0)}
              </h1>
            </div>
          </div>
          <div className="border-primary/50 bg-background flex w-full flex-col gap-2 rounded border p-3 shadow-xs dark:bg-[#121212]">
            <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
              <div className="flex items-center justify-start gap-2">
                <div
                  className={
                    "border-primary flex h-4 min-h-4 w-4 min-w-4 items-center justify-center rounded-full border bg-green-500 text-white"
                  }
                >
                  <Check size={12} />
                </div>
                <h1 className="text-xs leading-none font-medium tracking-tight">TOTAL RECEBIDO</h1>
              </div>
              <h1 className="leading-none font-black">
                {formatToMoney(stats?.totalRecebido || 0)}
              </h1>
            </div>
          </div>
          <div className="border-primary/50 bg-background flex w-full flex-col gap-2 rounded border p-3 shadow-xs dark:bg-[#121212]">
            <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
              <div className="flex items-center justify-start gap-2">
                <div
                  className={
                    "border-primary flex h-4 min-h-4 w-4 min-w-4 items-center justify-center rounded-full border bg-blue-500 text-white"
                  }
                >
                  <CircleDot size={12} />
                </div>
                <h1 className="text-xs leading-none font-medium tracking-tight">TOTAL A RECEBER</h1>
              </div>
              <h1 className="leading-none font-black">
                {formatToMoney(stats?.totalAReceber || 0)}
              </h1>
            </div>
          </div>
          <div className="border-primary/50 bg-background flex w-full flex-col gap-2 rounded border p-3 shadow-xs dark:bg-[#121212]">
            <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
              <div className="flex items-center justify-start gap-2">
                <div
                  className={
                    "border-primary flex h-4 min-h-4 w-4 min-w-4 items-center justify-center rounded-full border bg-orange-600 text-white"
                  }
                >
                  <CircleDot size={12} />
                </div>
                <h1 className="text-xs leading-none font-medium tracking-tight">
                  TOTAL A RECEBER HOJE
                </h1>
              </div>
              <h1 className="leading-none font-black">
                {formatToMoney(stats?.totalAReceberHoje || 0)}
              </h1>
            </div>
          </div>
          <div className="border-primary/50 bg-background flex w-full flex-col gap-2 rounded border p-3 shadow-xs dark:bg-[#121212]">
            <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
              <div className="flex items-center justify-start gap-2">
                <div
                  className={
                    "border-primary flex h-4 min-h-4 w-4 min-w-4 items-center justify-center rounded-full border bg-red-600 text-white"
                  }
                ></div>
                <h1 className="text-xs leading-none font-medium tracking-tight">
                  TOTAL A RECEBER EM ATRASO
                </h1>
              </div>
              <h1 className="leading-none font-black">
                {formatToMoney(stats?.totalAReceberEmAtraso || 0)}
              </h1>
            </div>
          </div>
        </div>
        <div className="border-primary/50 bg-background flex h-full max-h-full w-full flex-col gap-2 rounded border p-3 shadow-xs lg:w-[60%] dark:bg-[#121212]">
          <div className="flex items-center justify-start gap-2">
            <ChartNoAxesColumnIncreasing size={12} />
            <h1 className="text-xs leading-none font-medium tracking-tight">
              FLUXO DE RECEBIMENTOS
            </h1>
          </div>
          <RevenuesGraph daily={stats?.diario || []} />
        </div>
      </div>
    </div>
  );
}

export default RevenueStats;

type RevenuesGraphProps = {
  daily: TRevenueStatsResult["diario"];
};
function RevenuesGraph({ daily }: RevenuesGraphProps) {
  const chartConfig = {
    efetivado: {
      label: "RECEBIDO",
      color: "#16a34a",
    },
    esperado: {
      label: "A RECEBER",
      color: "#ca8a04",
    },
  } satisfies ChartConfig;
  return (
    <ChartContainer config={chartConfig} className="h-[200px] w-full">
      <BarChart accessibilityLayer data={daily}>
        <CartesianGrid vertical={false} strokeWidth={0.2} />
        <XAxis
          dataKey="dia"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 12)}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
        <Bar dataKey="efetivado" fill="var(--color-efetivado)" radius={4} />
        <Bar dataKey="esperado" fill="var(--color-esperado)" radius={4} />
        <ChartLegend
          content={<ChartLegendContent color="#000" />}
          className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
        />
      </BarChart>
    </ChartContainer>
  );
}
