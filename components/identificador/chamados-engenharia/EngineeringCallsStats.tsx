import DateIntervalInput from "@/components/inputs/DateIntervalInput";
import { cn } from "@/lib/utils";
import { formatDecimalPlaces } from "@/utils/constants";
import { useEngineeringCallsStats } from "@/utils/methods/query/engineering-calls";
import { ChartArea, Check, Clock, Sigma, TrendingDown, TrendingUp, X } from "lucide-react";
import { BsCalendarPlus } from "react-icons/bs";

function EngineeringCallsStats() {
  const { data: stats, filters, updateFilters } = useEngineeringCallsStats();
  return (
    <div className="border-border flex w-full flex-col gap-2 rounded-xl border p-3 shadow-xs">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <ChartArea className="h-4 min-h-4 w-4 min-w-4" />
          <h1 className="text-xs font-medium tracking-tight uppercase">ESTATÍSTICAS</h1>
        </div>
        <DateIntervalInput
          labelClassName="text-xs font-medium leading-none tracking-tight"
          className="h-fit border-none p-0 px-2 py-0.5 shadow-none"
          value={{
            after: filters.periodAfter ? new Date(filters.periodAfter) : undefined,
            before: filters.periodBefore ? new Date(filters.periodBefore) : undefined,
          }}
          handleChange={(v) =>
            updateFilters({
              periodAfter: v.after ? v.after.toISOString() : undefined,
              periodBefore: v.before ? v.before.toISOString() : undefined,
            })
          }
        />
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-3 lg:flex-row">
        <CardStat
          title="TOTAL DE CHAMADOS"
          icon={<Sigma className="h-4 min-h-4 w-4 min-w-4" />}
          current={stats?.total || 0}
          previous={stats?.total || 0}
          showComparison={false}
        />
        <CardStat
          title="TOTAL DE CHAMADOS RESOLVIDOS"
          icon={<Check className="h-4 min-h-4 w-4 min-w-4" />}
          current={stats?.totalFechados || 0}
          previous={stats?.totalFechados || 0}
          showComparison={false}
        />
        <CardStat
          title="TOTAL DE CHAMADOS PENDENTES"
          icon={<X className="h-4 min-h-4 w-4 min-w-4" />}
          current={stats?.totalAbertos || 0}
          previous={stats?.totalAbertos || 0}
          showComparison={false}
        />
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-3 lg:flex-row">
        <CardStat
          title="ABERTOS NO PERÍODO"
          icon={<BsCalendarPlus className="h-4 min-h-4 w-4 min-w-4" />}
          current={stats?.abertos.atual || 0}
          previous={stats?.abertos.anterior || 0}
        />
        <CardStat
          title="FECHADOS NO PERÍODO"
          icon={<Check className="h-4 min-h-4 w-4 min-w-4" />}
          current={stats?.fechados.atual || 0}
          previous={stats?.fechados.anterior || 0}
        />
        <CardStat
          title="TEMPO MÉDIO DE FECHAMENTO"
          icon={<Clock className="h-4 min-h-4 w-4 min-w-4" />}
          current={stats?.tempoMedioFechamento.atual || 0}
          previous={stats?.tempoMedioFechamento.anterior || 0}
          formatCurrent={(n) => `${formatDecimalPlaces(n)}h`}
          formatPrevious={(n) => `${formatDecimalPlaces(n)}h`}
          lowerIsBetter
        />
      </div>
    </div>
  );
}

export default EngineeringCallsStats;

type CardStatProps = {
  title: string;
  icon: React.ReactNode;
  current: number;
  previous: number;
  showComparison?: boolean;
  formatCurrent?: (n: number) => string;
  formatPrevious?: (n: number) => string;
  lowerIsBetter?: boolean;
  className?: string;
};
function CardStat({
  title,
  icon,
  current,
  previous,
  showComparison = true,
  formatCurrent,
  formatPrevious,
  lowerIsBetter,
  className,
}: CardStatProps) {
  const change = (() => {
    if (previous === 0) {
      if (current === 0) return 0;
      return 100;
    }
    return ((current - previous) / Math.abs(previous)) * 100;
  })();

  const isGood = lowerIsBetter ? change < 0 : change > 0;
  const isNeutral = change === 0;
  const changeAbs = Math.abs(change);

  return (
    <div
      className={cn(
        "bg-card border-border flex w-full flex-col gap-1 rounded-xl border px-3 py-4 shadow-xs",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <h1 className="text-xs font-medium tracking-tight uppercase">{title}</h1>
        {showComparison && (
          <div className="flex items-center gap-2">
            {!isNeutral && (
              <div
                className={
                  `inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[0.65rem] font-bold ` +
                  (isGood ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700")
                }
              >
                {isGood ? (
                  <TrendingUp className="h-3 min-h-3 w-3 min-w-3" />
                ) : (
                  <TrendingDown className="h-3 min-h-3 w-3 min-w-3" />
                )}
                {formatDecimalPlaces(changeAbs)}%
              </div>
            )}
            {icon}
          </div>
        )}
      </div>
      <div className="flex w-full flex-col">
        <div className="text-2xl font-bold text-[#15599a] dark:text-[#fead61]">
          {formatCurrent ? formatCurrent(current) : String(current)}
        </div>
        {showComparison && (
          <p className="text-foreground text-xs tracking-tight">
            PERÍODO ANTERIOR: {formatPrevious ? formatPrevious(previous) : String(previous || 0)}
          </p>
        )}
      </div>
    </div>
  );
}
