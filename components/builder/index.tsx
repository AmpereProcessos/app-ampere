import { BuilderPanel } from "./builder-panel";
import { BuilderProvider, useBuilder } from "./builder-context";
import { BuilderStage } from "./builder-stage";
import { BuilderStageFooter } from "./builder-stage-footer";
import { BuilderStepper } from "./builder-stepper";

export type { TBuilderContextValue, TBuilderNavigationMode, TBuilderRootProps, TBuilderStageDefinition } from "./types";
export { BuilderProvider, useBuilder } from "./builder-context";

export const Builder = {
	Root: BuilderProvider,
	Stepper: BuilderStepper,
	Panel: BuilderPanel,
	Stage: BuilderStage,
	Footer: BuilderStageFooter,
};
