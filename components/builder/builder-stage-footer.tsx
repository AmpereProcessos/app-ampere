"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useBuilder } from "./builder-context";

type BuilderStageFooterProps = {
	children?: ReactNode;
	actions?: ReactNode;
	onNext?: () => void;
	onPrevious?: () => void;
	nextLabel?: string;
	backLabel?: string;
	showBack?: boolean;
	showNext?: boolean;
	nextDisabled?: boolean;
	className?: string;
};

export function BuilderStageFooter({
	children,
	actions,
	onNext,
	onPrevious,
	nextLabel = "PROXIMA ETAPA",
	backLabel = "ETAPA ANTERIOR",
	showBack = true,
	showNext = true,
	nextDisabled,
	className,
}: BuilderStageFooterProps) {
	const { currentIndex, goNext, goPrevious } = useBuilder();
	const isFirstStage = currentIndex === 0;

	return (
		<footer className={cn("mt-auto flex w-full flex-col gap-3 border-t border-border pt-4", className)}>
			{children}
			<div className="flex w-full flex-col-reverse items-stretch justify-between gap-2 sm:flex-row sm:items-center">
				<div>
					{showBack && !isFirstStage ? (
						<Button type="button" variant="ghost" onClick={onPrevious ?? goPrevious} className="gap-1.5">
							<ArrowLeft className="h-3.5 w-3.5" />
							{backLabel}
						</Button>
					) : (
						<span aria-hidden className="hidden sm:block sm:h-9" />
					)}
				</div>
				{actions ? <div className="flex sm:ml-auto">{actions}</div> : null}
				{!actions && showNext && onNext ? (
					<Button type="button" onClick={onNext ?? goNext} disabled={nextDisabled} className="gap-1.5 sm:ml-auto">
						{nextLabel}
						<ArrowRight className="h-3.5 w-3.5" />
					</Button>
				) : null}
			</div>
		</footer>
	);
}
