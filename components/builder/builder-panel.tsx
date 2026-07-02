"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type BuilderPanelProps = {
	children: ReactNode;
	className?: string;
};

export function BuilderPanel({ children, className }: BuilderPanelProps) {
	return <section className={cn("flex w-full min-h-0 flex-1 flex-col overflow-hidden rounded-md border border-border bg-card shadow-sm", className)}>{children}</section>;
}
