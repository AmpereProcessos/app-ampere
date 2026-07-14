"use client";

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

import { useBuilder } from "./builder-context";

type BuilderStepperProps = {
  className?: string;
};

export function BuilderStepper({ className }: BuilderStepperProps) {
  const {
    stageOrder,
    stages,
    currentStage,
    currentIndex,
    furthestIndex,
    navigationMode,
    goToStageByIndex,
  } = useBuilder();
  const allowFreeNavigation = navigationMode === "edit";

  return (
    <nav aria-label="Progresso do fluxo" className={cn("w-full", className)}>
      <ol className="flex w-full items-stretch gap-0 overflow-x-auto rounded-md border border-border bg-card px-1 py-1 shadow-sm">
        {stageOrder.map((stageId, idx) => {
          const stage = stages[stageId];
          if (!stage) return null;
          const Icon = stage.icon;
          const isActive = stageId === currentStage;
          const isComplete = idx < currentIndex;
          const isClickable = allowFreeNavigation || idx <= furthestIndex;
          const isLast = idx === stageOrder.length - 1;

          return (
            <li key={stageId} className="flex min-w-[8rem] flex-1 items-stretch">
              <button
                type="button"
                onClick={() => goToStageByIndex(idx)}
                disabled={!isClickable}
                aria-current={isActive ? "step" : undefined}
                className={cn(
                  "group flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left transition-colors",
                  isActive && "bg-secondary",
                  !isActive && isClickable && "hover:bg-secondary/60",
                  !isClickable && "cursor-not-allowed opacity-50",
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors",
                    isActive && "border-primary bg-primary text-primary-foreground",
                    isComplete && !isActive && "border-border bg-primary/10 text-primary",
                    !isActive && !isComplete && "border-border bg-background text-muted-foreground",
                  )}
                >
                  {isComplete && !isActive ? (
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </span>
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="truncate text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    Etapa {idx + 1}
                  </span>
                  <span
                    className={cn(
                      "truncate text-xs font-semibold",
                      isActive ? "text-foreground" : "text-foreground/80",
                    )}
                  >
                    {stage.label}
                  </span>
                </span>
              </button>
              {!isLast ? (
                <span
                  aria-hidden
                  className={cn(
                    "my-3 w-px shrink-0 self-stretch",
                    isComplete ? "bg-primary/25" : "bg-border",
                  )}
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
