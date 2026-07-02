import type { ComponentType, ReactNode } from "react";

export type TBuilderStageDefinition<TStageId extends string> = {
	id: TStageId;
	label: string;
	icon: ComponentType<{ className?: string }>;
};

export type TBuilderNavigationMode = "create" | "edit";

export type TBuilderRootProps<TStageId extends string> = {
	stages: Record<TStageId, TBuilderStageDefinition<TStageId>>;
	stageOrder: readonly TStageId[];
	currentStage: TStageId;
	onStageChange: (stage: TStageId) => void;
	furthestStageIndex?: number;
	onFurthestStageIndexChange?: (index: number) => void;
	navigationMode?: TBuilderNavigationMode;
	children: ReactNode;
	className?: string;
};

export type TBuilderContextValue<TStageId extends string> = {
	stages: Record<TStageId, TBuilderStageDefinition<TStageId>>;
	stageOrder: readonly TStageId[];
	currentStage: TStageId;
	currentIndex: number;
	furthestIndex: number;
	navigationMode: TBuilderNavigationMode;
	setCurrentStage: (stage: TStageId) => void;
	goToStageByIndex: (index: number) => void;
	goNext: () => void;
	goPrevious: () => void;
	markFurthestIndex: (index: number) => void;
};
