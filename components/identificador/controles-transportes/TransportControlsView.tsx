import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/utils/Buttons/LoadingButton";
import GeneralPaginationComponent from "@/components/utils/Pagination";
import ResponsiveDialogDrawerViewOnly from "@/components/utils/ResponsiveDialogDrawerViewOnly";
import type { TAuthSession } from "@/lib/authentication/types";
import { cn, copyToClipboard } from "@/lib/utils";
import type { TGetTransportControlsOutput } from "@/pages/api/controles-transportes";
import type { TPurchasesControlPageModes } from "@/pages/suprimentos/controle-compras";
import { formatDateAsLocale, formatNameAsInitials } from "@/utils/methods/formatting";
import { getErrorMessage } from "@/utils/methods/handlers";
import { deleteTransportControl } from "@/utils/methods/mutation/transport-controls";
import { useTransportControls } from "@/utils/methods/query/transport-controls";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, EyeIcon, LinkIcon, Pencil, PlusIcon, TrashIcon, Truck } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { BsCalendarPlus } from "react-icons/bs";
import EditTransportControl from "./modals/EditTransportControl";
import NewTransportControl from "./modals/NewTransportControl";
import ValidateTransportControl from "./modals/ValidateTransportControl";
import ViewTransportControl from "./modals/ViewTransportControl";

type TransportControlsViewProps = {
	session: TAuthSession;
	handleSetMode: (mode: TPurchasesControlPageModes) => void;
};

export default function TransportControlsView({ session, handleSetMode }: TransportControlsViewProps) {
	const queryClient = useQueryClient();
	const [newTransportControlModalIsOpen, setNewTransportControlModalIsOpen] = useState(false);
	const [viewTransportControlId, setViewTransportControlId] = useState<string | null>(null);
	const [validateTransportControlId, setValidateTransportControlId] = useState<string | null>(null);
	const [deleteTransportControlId, setDeleteTransportControlId] = useState<string | null>(null);
	const [editTransportControlId, setEditTransportControlId] = useState<string | null>(null);
	const { data: transportControlsResult, queryKey, isLoading, isError, isSuccess, error, params, updateParams } = useTransportControls({});

	const transportControls = transportControlsResult?.transportControls;
	const totalPages = transportControlsResult?.totalPages;
	const transportControlsShowing = transportControls?.length || 0;
	const transportControlsMatched = transportControlsResult?.transportControlsMatched || 0;

	const handleOnMutate = async () => {
		await queryClient.cancelQueries({ queryKey });
	};
	const handleOnSettled = async () => {
		await queryClient.invalidateQueries({ queryKey });
	};
	const { mutate: handleDeleteTransportControl, isPending: deleteTransportControlIsPending } = useMutation({
		mutationKey: ["delete-transport-control"],
		mutationFn: async (transportControlId: string) => await deleteTransportControl({ transportControlId }),
		onSuccess: () => {
			toast.success("Controle de transporte excluído com sucesso!");
			queryClient.invalidateQueries({ queryKey });
			setDeleteTransportControlId(null);
		},
		onError: (err) => {
			toast.error(getErrorMessage(err));
		},
	});

	const deleteTransportControlReference = transportControls?.find((control) => control._id === deleteTransportControlId);
	return (
		<div className="w-full h-full flex flex-col gap-3">
			<div className="w-full flex items-center justify-end">
				<Button onClick={() => setNewTransportControlModalIsOpen(true)} className="flex items-center gap-1">
					<PlusIcon className="w-4 h-4" />
					NOVO CONTROLE
				</Button>
			</div>
			<GeneralPaginationComponent
				activePage={params.page}
				queryLoading={isLoading}
				selectPage={(page) => updateParams({ page })}
				totalPages={totalPages || 0}
				itemsMatchedText={`Foram encontrados ${transportControlsMatched} controles de transporte.`}
				itemsShowingText={`Mostrando ${transportControlsShowing} controles de transporte.`}
			/>
			<div className="flex w-full flex-col gap-3">
				{transportControls?.map((transportControl) => (
					<TransportControlCard
						key={transportControl._id}
						transportControl={transportControl}
						handleClick={(id) => setViewTransportControlId(id)}
						handleValidate={(id) => setValidateTransportControlId(id)}
						handleDelete={(id) => setDeleteTransportControlId(id)}
						handleEdit={(id) => setEditTransportControlId(id)}
					/>
				))}
			</div>
			{newTransportControlModalIsOpen ? (
				<NewTransportControl
					session={session}
					closeModal={() => setNewTransportControlModalIsOpen(false)}
					callbacks={{ onMutate: handleOnMutate, onSettled: handleOnSettled }}
				/>
			) : null}
			{viewTransportControlId ? (
				<ViewTransportControl transportControlId={viewTransportControlId} closeModal={() => setViewTransportControlId(null)} />
			) : null}
			{validateTransportControlId ? (
				<ValidateTransportControl
					transportControlId={validateTransportControlId}
					queryKey={queryKey}
					closeModal={() => setValidateTransportControlId(null)}
				/>
			) : null}
			{editTransportControlId ? (
				<EditTransportControl transportControlId={editTransportControlId} closeModal={() => setEditTransportControlId(null)} />
			) : null}
			{deleteTransportControlId ? (
				<ResponsiveDialogDrawerViewOnly
					menuTitle="EXCLUIR CONTROLE DE TRANSPORTE"
					menuDescription="Tem certeza que deseja excluir este controle de transporte? Essa ação não pode ser desfeita."
					menuCancelButtonText="CANCELAR"
					closeMenu={() => setDeleteTransportControlId(null)}
					stateIsLoading={false}
					stateError={null}
					dialogVariant="sm"
				>
					<div className="flex flex-col gap-3">
						<p className="text-sm">
							Controle: <span className="font-semibold">#{deleteTransportControlReference?.identificador || "---"}</span>{" "}
							{deleteTransportControlReference?.titulo ? `- ${deleteTransportControlReference.titulo}` : ""}
						</p>
						<LoadingButton
							variant="destructive"
							loading={deleteTransportControlIsPending}
							onClick={() => handleDeleteTransportControl(deleteTransportControlId)}
						>
							EXCLUIR CONTROLE
						</LoadingButton>
					</div>
				</ResponsiveDialogDrawerViewOnly>
			) : null}
		</div>
	);
}

type TransportControlCardProps = {
	transportControl: TGetTransportControlsOutput["data"]["transportControls"][number];
	handleClick: (id: string) => void;
	handleValidate: (id: string) => void;
	handleDelete: (id: string) => void;
	handleEdit: (id: string) => void;
};
function TransportControlCard({ transportControl, handleClick, handleValidate, handleDelete, handleEdit }: TransportControlCardProps) {
	const canEdit = !transportControl.dataFim;
	const canValidate = !!transportControl.dataFim && !transportControl.dataValidacao;
	return (
		<div className="bg-background border-primary/30 relative flex w-full flex-col justify-between gap-1 rounded-lg border p-3 shadow-xs">
			<div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
				<div className="flex items-center gap-2">
					<div className="bg-secondary text-muted-foreground flex items-center gap-1 text-center text-xs font-bold italic px-2 py-1 rounded-lg">
						<Truck className="w-4 h-4 min-w-4 min-h-4" />
						<p className="text-xs">{transportControl.identificador}</p>
					</div>
					<h1 className="text-sm leading-none font-bold tracking-tight">{transportControl.titulo}</h1>
				</div>
				<div className="flex items-center gap-2">
					<div className="flex item-center gap-1">
						<Truck className="w-4 h-4 min-w-4 min-h-4" />
						<p className="text-xs font-medium">
							{transportControl.itens.length} {transportControl.itens.length > 1 ? "TRANSPORTES" : "TRANSPORTE"}
						</p>
					</div>
					<h1
						className={cn("flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium", {
							"bg-green-200 text-green-600":
								!!transportControl.dataFim && !!transportControl.dataValidacao && new Date(transportControl.dataFim) < new Date(),
							"bg-orange-200 text-orange-600":
								!!transportControl.dataFim && !transportControl.dataValidacao && new Date(transportControl.dataFim) < new Date(),
							"bg-blue-200 text-blue-600": !!transportControl.dataInicio && new Date(transportControl.dataInicio) > new Date(),
							"bg-yellow-200 text-yellow-600": !transportControl.dataFim && !transportControl.dataInicio,
						})}
					>
						{transportControl.dataFim
							? transportControl.dataValidacao
								? "FINALIZADO"
								: "FINALIZADO SEM VALIDAÇÃO"
							: transportControl.dataInicio
								? "EM ANDAMENTO"
								: "PENDENTE"}
					</h1>
				</div>
			</div>
			<div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
				<div className="flex flex-wrap items-center gap-2">
					<div className="flex items-center gap-1">
						<BsCalendarPlus className="w-4 h-4 min-w-4 min-h-4" />
						<p className="text-primary/80 text-[0.65rem] font-medium">{formatDateAsLocale(transportControl.dataInsercao, true)}</p>
					</div>

					<div className="flex items-center gap-1">
						<Avatar className="w-5 h-5 min-w-5 min-h-5">
							<AvatarImage src={transportControl.autor.avatar_url || undefined} />
							<AvatarFallback>{formatNameAsInitials(transportControl.autor.nome)}</AvatarFallback>
						</Avatar>
						<p className="text-primary/80 text-[0.65rem] font-medium">{transportControl.autor.nome}</p>
					</div>
				</div>
				<div className="flex flex-wrap items-center gap-2">
					<Button
						onClick={() => handleClick(transportControl._id)}
						variant={"ghost"}
						size={"fit"}
						className="flex items-center gap-1 px-2 py-1 rounded-lg"
					>
						<EyeIcon className="w-4 h-4 min-w-4 min-h-4" />
						<p>VISUALIZAR</p>
					</Button>
					{canValidate ? (
						<Button
							onClick={() => handleValidate(transportControl._id)}
							variant={"ghost"}
							size={"fit"}
							className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-green-200 hover:text-green-600 transition-colors"
						>
							<CheckCircle2 className="w-4 h-4 min-w-4 min-h-4" />
							<p>VALIDAR</p>
						</Button>
					) : null}
					<Button
						onClick={() => copyToClipboard(`${process.env.NEXT_PUBLIC_APP_URL}/publico/formulario-transporte/${transportControl._id}`)}
						variant={"ghost"}
						size={"fit"}
						className="flex items-center gap-1 px-2 py-1 rounded-lg"
					>
						<LinkIcon className="w-4 h-4 min-w-4 min-h-4" />
						<p>LINK DE CONTROLE</p>
					</Button>
					{canEdit ? (
						<Button
							onClick={() => handleEdit(transportControl._id)}
							variant={"ghost"}
							size={"fit"}
							className="flex items-center gap-1 px-2 py-1 rounded-lg"
						>
							<Pencil className="w-4 h-4 min-w-4 min-h-4" />
							<p>EDITAR</p>
						</Button>
					) : null}
					<Button
						onClick={() => handleDelete(transportControl._id)}
						variant={"ghost"}
						size={"fit"}
						className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-red-200 hover:text-red-600 transition-colors"
					>
						<TrashIcon className="w-4 h-4 min-w-4 min-h-4" />
						<p>EXCLUIR</p>
					</Button>
				</div>
			</div>
		</div>
	);
}
