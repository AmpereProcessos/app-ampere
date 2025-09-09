import type { PropsWithChildren } from "react";

export function InfoBlockSection({ headerTitle, headerIcon, children }: PropsWithChildren<{ headerTitle: string; headerIcon: React.ReactNode }>) {
	return (
		<div className="flex w-full flex-col gap-2">
			<div className="flex items-center gap-2 bg-primary/20 px-2 py-1 rounded w-fit">
				{headerIcon}
				<h1 className="text-xs tracking-tight font-medium text-start w-fit">{headerTitle}</h1>
			</div>
			{children}
		</div>
	);
}
