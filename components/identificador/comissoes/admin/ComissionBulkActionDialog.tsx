import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/utils/Buttons/LoadingButton";
import { cn } from "@/lib/utils";
import { formatToMoney } from "@/utils/constants";
import { AlertTriangle } from "lucide-react";
import { ACTION_META, TONE_CLASSES } from "./tones";
import { COMISSION_BULK_ACTIONS, type ComissionBulkAction, type TComissionProject, getBulkActionSummary } from "./utils";

export type ComissionBulkActionRequest = {
	action: ComissionBulkAction;
	projects: TComissionProject[];
};

type ComissionBulkActionDialogProps = {
	request: ComissionBulkActionRequest | null;
	isPending: boolean;
	onCancel: () => void;
	onConfirm: (request: ComissionBulkActionRequest) => void;
};
export default function ComissionBulkActionDialog({ request, isPending, onCancel, onConfirm }: ComissionBulkActionDialogProps) {
	const config = request ? COMISSION_BULK_ACTIONS[request.action] : null;
	const summary = request ? getBulkActionSummary(request.projects, request.action) : null;
	const meta = request ? ACTION_META[request.action] : null;

	return (
		<AlertDialog open={!!request} onOpenChange={(open) => (!open && !isPending ? onCancel() : null)}>
			<AlertDialogContent>
				{request && config && summary ? (
					<>
						<AlertDialogHeader>
							<AlertDialogTitle className="flex items-center gap-2">
								{meta ? <meta.icon className={cn("h-5 w-5", TONE_CLASSES[meta.tone].text)} aria-hidden /> : null}
								{config.title}
							</AlertDialogTitle>
							<AlertDialogDescription>{config.description}</AlertDialogDescription>
						</AlertDialogHeader>
						<dl className="bg-secondary grid grid-cols-3 gap-2 rounded-md p-3 text-sm">
							<div>
								<dt className="text-muted-foreground text-xs">Projetos</dt>
								<dd className="font-semibold tabular-nums">{summary.projects}</dd>
							</div>
							<div>
								<dt className="text-muted-foreground text-xs">Comissionados</dt>
								<dd className="font-semibold tabular-nums">{summary.comissioned}</dd>
							</div>
							<div>
								<dt className="text-muted-foreground text-xs">Valor</dt>
								<dd className="font-semibold tabular-nums">{formatToMoney(summary.value)}</dd>
							</div>
						</dl>
						<div className="flex flex-col gap-1.5 text-sm">
							{summary.notValidated > 0 ? <Notice>{summary.notValidated} comissionado(s) ainda não validaram a comissão no CRM.</Notice> : null}
							{summary.missingComissionableValue > 0 ? (
								<Notice>{summary.missingComissionableValue} projeto(s) sem valor comissionável serão ignorados. Defina o valor antes de efetivar.</Notice>
							) : null}
							{summary.skippedProjects > 0 ? (
								<p className="text-muted-foreground text-xs">
									{summary.skippedProjects} projeto(s) selecionado(s) não se aplicam a esta ação e não serão alterados.
								</p>
							) : null}
						</div>
						<AlertDialogFooter>
							<Button variant="outline" disabled={isPending} onClick={onCancel}>
								CANCELAR
							</Button>
							<LoadingButton
								loading={isPending}
								disabled={summary.projects === 0}
								className={cn("gap-1.5", meta ? TONE_CLASSES[meta.tone].solid : null)}
								onClick={() => onConfirm(request)}
							>
								{meta ? <meta.icon className="h-4 w-4" aria-hidden /> : null}
								{config.confirmLabel}
							</LoadingButton>
						</AlertDialogFooter>
					</>
				) : null}
			</AlertDialogContent>
		</AlertDialog>
	);
}

function Notice({ children }: { children: React.ReactNode }) {
	return (
		<p className="border-accent-amber bg-accent-amber/15 flex items-start gap-2 rounded-md border px-2 py-1.5">
			<AlertTriangle className="text-accent-amber-hover mt-0.5 h-4 w-4 shrink-0" aria-hidden />
			<span>{children}</span>
		</p>
	);
}
