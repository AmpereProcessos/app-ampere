import { buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CalendarDays } from "lucide-react";

export type TRankingPeriodType = "current-month" | "current-semester" | "current-year";

const PERIOD_OPTIONS: { value: TRankingPeriodType; label: string }[] = [
  { value: "current-month", label: "Mês" },
  { value: "current-semester", label: "Semestre" },
  { value: "current-year", label: "Ano" },
];

type RankingPeriodSelectProps = {
  value: TRankingPeriodType;
  onValueChange: (value: TRankingPeriodType) => void;
  className?: string;
};

export default function RankingPeriodSelect({
  value,
  onValueChange,
  className,
}: RankingPeriodSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(nextValue) => onValueChange(nextValue as TRankingPeriodType)}
    >
      <SelectTrigger
        className={cn(
          buttonVariants({ variant: "ghost", size: "fit" }),
          "h-auto gap-1 rounded-lg border-0 bg-transparent p-2 text-[0.6rem] lg:text-xs font-medium uppercase tracking-tight shadow-none",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "[&_svg:not([class*='text-'])]:text-current",
          className,
        )}
      >
        <CalendarDays className="h-3 min-h-3 w-3 min-w-3 shrink-0 lg:h-4 lg:min-h-4 lg:w-4 lg:min-w-4" />
        <SelectValue placeholder="Período" />
      </SelectTrigger>
      <SelectContent align="start" className="border-border min-w-28">
        {PERIOD_OPTIONS.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="text-xs font-medium uppercase tracking-tight"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
