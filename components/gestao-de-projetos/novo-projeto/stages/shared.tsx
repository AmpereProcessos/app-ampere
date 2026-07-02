"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function StageSection({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
	return (
		<section className={cn("flex w-full flex-col gap-3 rounded-md border border-primary/15 bg-background p-3", className)}>
			<div className="flex w-full items-center justify-between gap-3 border-b border-primary/10 pb-2">
				<h2 className="text-xs font-black uppercase tracking-wide text-primary/80">{title}</h2>
			</div>
			{children}
		</section>
	);
}

export function FieldGrid({ children, cols = 3 }: { children: ReactNode; cols?: 2 | 3 | 4 }) {
	const gridClass = cols === 4 ? "lg:grid-cols-4" : cols === 2 ? "lg:grid-cols-2" : "lg:grid-cols-3";
	return <div className={cn("grid w-full grid-cols-1 gap-3", gridClass)}>{children}</div>;
}

export function StageErrors({ errors }: { errors: string[] }) {
	if (errors.length === 0) return null;
	return (
		<div className="rounded-md border border-red-500/30 bg-red-500/5 p-3">
			<p className="text-xs font-bold uppercase tracking-wide text-red-600">Pendências da etapa</p>
			<ul className="mt-1 flex list-disc flex-col gap-1 pl-4 text-sm text-red-700">
				{errors.map((error) => (
					<li key={error}>{error}</li>
				))}
			</ul>
		</div>
	);
}

export function SummaryItem({ label, value }: { label: string; value: ReactNode }) {
	return (
		<div className="flex min-h-[52px] flex-col justify-center rounded-md border border-primary/10 bg-primary/[0.03] px-3 py-2">
			<span className="text-[10px] font-bold uppercase tracking-wide text-primary/55">{label}</span>
			<span className="break-words text-sm font-semibold text-foreground">{value || "NÃO DEFINIDO"}</span>
		</div>
	);
}
