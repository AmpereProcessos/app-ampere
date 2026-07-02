"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

import type { TBuilderContextValue, TBuilderRootProps } from "./types";

const BuilderContext = createContext<TBuilderContextValue<string> | null>(null);

export function BuilderProvider<TStageId extends string>({
	stages,
	stageOrder,
	currentStage,
	onStageChange,
	furthestStageIndex: controlledFurthestIndex,
	onFurthestStageIndexChange,
	navigationMode = "create",
	children,
	className,
}: TBuilderRootProps<TStageId>) {
	const currentIndex = useMemo(() => stageOrder.indexOf(currentStage), [stageOrder, currentStage]);
	const [internalFurthestIndex, setInternalFurthestIndex] = useState(currentIndex);
	const furthestIndex = controlledFurthestIndex ?? internalFurthestIndex;

	const markFurthestIndex = useCallback(
		(index: number) => {
			const next = Math.max(furthestIndex, index);
			if (next === furthestIndex) return;
			if (onFurthestStageIndexChange) onFurthestStageIndexChange(next);
			else setInternalFurthestIndex(next);
		},
		[furthestIndex, onFurthestStageIndexChange],
	);

	const setCurrentStage = useCallback(
		(stage: TStageId) => {
			onStageChange(stage);
			if (controlledFurthestIndex === undefined) {
				const idx = stageOrder.indexOf(stage);
				if (idx >= 0) markFurthestIndex(idx);
			}
		},
		[controlledFurthestIndex, markFurthestIndex, onStageChange, stageOrder],
	);

	const goToStageByIndex = useCallback(
		(index: number) => {
			const stage = stageOrder[index];
			if (!stage) return;
			if (navigationMode === "edit" || index <= furthestIndex) setCurrentStage(stage);
		},
		[furthestIndex, navigationMode, setCurrentStage, stageOrder],
	);

	const goNext = useCallback(() => {
		const next = stageOrder[currentIndex + 1];
		if (next) setCurrentStage(next);
	}, [currentIndex, setCurrentStage, stageOrder]);

	const goPrevious = useCallback(() => {
		const previous = stageOrder[currentIndex - 1];
		if (previous) onStageChange(previous);
	}, [currentIndex, onStageChange, stageOrder]);

	const value = useMemo<TBuilderContextValue<TStageId>>(
		() => ({
			stages,
			stageOrder,
			currentStage,
			currentIndex,
			furthestIndex,
			navigationMode,
			setCurrentStage,
			goToStageByIndex,
			goNext,
			goPrevious,
			markFurthestIndex,
		}),
		[stages, stageOrder, currentStage, currentIndex, furthestIndex, navigationMode, setCurrentStage, goToStageByIndex, goNext, goPrevious, markFurthestIndex],
	);

	return (
		<BuilderContext.Provider value={value as unknown as TBuilderContextValue<string>}>
			<div className={className}>{children}</div>
		</BuilderContext.Provider>
	);
}

export function useBuilder<TStageId extends string = string>() {
	const context = useContext(BuilderContext);
	if (!context) throw new Error("useBuilder must be used within Builder.Root");
	return context as unknown as TBuilderContextValue<TStageId>;
}
