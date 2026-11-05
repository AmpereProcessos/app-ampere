import { cn } from "@/lib/utils";
import { STAGE_META, TONE_CLASSES } from "./tones";
import { COMISSION_STAGES, type ComissionStage } from "./utils";

export default function ComissionStageBadge({ stage, className }: { stage: ComissionStage; className?: string }) {
	const config = COMISSION_STAGES[stage];
	const { tone, icon: Icon, iconTone } = STAGE_META[stage];
	return (
		<span
			title={config.description}
			className={cn(
				"inline-flex shrink-0 items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap uppercase",
				TONE_CLASSES[tone].soft,
				className,
			)}
		>
			<Icon className={cn("h-3.5 w-3.5", iconTone ? TONE_CLASSES[iconTone].text : null)} aria-hidden />
			{config.label}
		</span>
	);
}
