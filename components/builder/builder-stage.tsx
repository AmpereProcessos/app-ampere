"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type BuilderStageProps = {
	children: ReactNode;
	className?: string;
};

export function BuilderStage({ children, className }: BuilderStageProps) {
	return <div className={cn("flex w-full min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 lg:p-5", className)}>{children}</div>;
}
