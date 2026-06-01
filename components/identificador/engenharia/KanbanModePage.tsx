import ModalProjetos from "@/components/ModalProjetos";
import { getServiceTypeTagColor } from "@/components/TagTipoDeServico";
import ErrorComponent from "@/components/utils/ErrorComponent";
import LoadingComponent from "@/components/utils/LoadingComponent";
import type { TAuthSession } from "@/lib/authentication/types";
import { cn } from "@/lib/utils";
import type { TEngineeringProjectsKanbanOutput } from "@/pages/api/projects/engenharia/kanban";
import { formatDateAsLocale } from "@/utils/methods/formatting";
import { getErrorMessage } from "@/utils/methods/handlers";
import { updateProject } from "@/utils/methods/mutation/clients";
import { useEngineeringProjectsKanban } from "@/utils/methods/query/engineering";
import { useViewModesStore } from "@/utils/stores/view-modes-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Pencil, Tag } from "lucide-react";
import { useState } from "react";
import { DragDropContext, Draggable, type DropResult, Droppable } from "react-beautiful-dnd";
import { toast } from "react-hot-toast";
import { FaRotate } from "react-icons/fa6";
import { MdDashboard } from "react-icons/md";
import EngineeringKanbanProjectsFilters from "./EngineeringKanbanProjectsFilters";
import { useTags } from "@/utils/methods/query/tags";

const CurrentDate = dayjs().toDate();

type EngineeringKanbanModePageProps = {
	session: TAuthSession;
};
function EngineeringKanbanModePage({ session }: EngineeringKanbanModePageProps) {
	const queryClient = useQueryClient();
	const updateViewMode = useViewModesStore((state) => state.updateMode);
	const { data: tags } = useTags({ initialFilters: { applicableToProjects: "true" } });
	const [editProjectModal, setEditProjectModal] = useState<{ id: string | null; isOpen: boolean }>({
		id: null,
		isOpen: false,
	});
	const { data: kanbanProjects, isLoading, isError, error, isSuccess, filters, updateFilters } = useEngineeringProjectsKanban();

	async function onDragEnd(dragEndResult: DropResult) {
		const { source, destination, draggableId } = dragEndResult;
		if (!destination) return;
		if (destination.droppableId === source.droppableId) return null;

		const previousStatus = source.droppableId;
		const newStatus = destination.droppableId;
		await updateProject({
			id: draggableId,
			changes: {
				"homologacao.status": newStatus,
			},
		});
		return {
			projectId: draggableId,
			previousStatus,
			newStatus,
			message: "Status do projeto atualizado com sucesso",
		};
	}
	const { mutate: handleUpdateProjectStatus } = useMutation({
		mutationKey: ["update-engineering-project-status"],
		mutationFn: onDragEnd,
		onMutate: async (variables) => {
			const { source, destination, draggableId } = variables;
			if (!destination) return;
			if (destination.droppableId === source.droppableId) return;
			console.log("[INFO] [ENGINEERING_KANBAN_MODE_PAGE] Drag end result:", {
				source: source.droppableId,
				destination: destination.droppableId,
				draggableId,
			});
			await queryClient.cancelQueries({ queryKey: ["engineering-projects-kanban", filters] });

			const querySnapshot = queryClient.getQueryData(["engineering-projects-kanban", filters]) as TEngineeringProjectsKanbanOutput["data"];
			if (!querySnapshot) return { querySnapshot };

			queryClient.setQueryData(["engineering-projects-kanban", filters], (prevData: TEngineeringProjectsKanbanOutput["data"]) => {
				const updatedProject = querySnapshot[source.droppableId].find((p) => p._id === draggableId);
				if (!updatedProject) return prevData;

				return {
					...prevData,
					[source.droppableId]: prevData[source.droppableId].filter((p) => p._id !== draggableId),
					[destination.droppableId]: [
						...prevData[destination.droppableId],
						{
							...updatedProject,
							status: destination.droppableId,
						},
					],
				};
			});

			return { querySnapshot };
		},
		onSuccess: async (data) => {
			if (!data) return;
			toast.success(data.message);
			return;
		},
		onError: (error, variables, context) => {
			queryClient.setQueryData(["engineering-projects-kanban", filters], context?.querySnapshot);
		},
		onSettled: (data, error, variables, context) => {
			queryClient.invalidateQueries({ queryKey: ["engineering-projects-kanban", filters] });
		},
	});
	return (
		<div className="flex grow flex-col gap-2 p-6">
			<div className="border-primary/20 flex flex-col items-center justify-between border-b p-1">
				<div className="flex w-full flex-col items-center justify-between gap-2 gap-y-3 lg:flex-row">
					<div className="flex flex-col items-center gap-1 lg:flex-row">
						<div className="flex items-center gap-1">
							<p className="text-center text-2xl font-black text-[#15599a] uppercase">PROJETOS EM ENGENHARIA</p>
						</div>
						<button
							type="button"
							onClick={() => updateViewMode("engineering", "database")}
							className="text-primary/60 hover:text-primary/80 flex items-center gap-1 px-2 text-xs duration-300 ease-out"
						>
							<FaRotate />
							<h1 className="font-medium">ALTERAR MODO</h1>
						</button>
					</div>
				</div>
				<EngineeringKanbanProjectsFilters
					filters={filters}
					updateFilters={updateFilters}
					tagOptions={tags?.map((t) => ({ id: t._id, value: t._id, label: t.titulo })) ?? []}
				/>
			</div>

			<DragDropContext onDragEnd={(e) => handleUpdateProjectStatus(e)}>
				<div className="scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 flex max-h-[600px] w-full gap-3 overflow-x-auto">
					{isLoading ? <LoadingComponent /> : null}
					{isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
					{isSuccess
						? Object.entries(kanbanProjects).map(([key, value]) => (
								<EngineeringKanbanFunnelList key={key} listTitle={key} listItems={value} handleItemClick={() => {}} />
							))
						: null}
				</div>
			</DragDropContext>
			{editProjectModal.isOpen && editProjectModal.id && (
				<ModalProjetos
					session={session}
					projectId={editProjectModal.id}
					modalIsOpen={editProjectModal.isOpen}
					closeModal={() => setEditProjectModal({ id: null, isOpen: false })}
				/>
			)}
		</div>
	);
}

export default EngineeringKanbanModePage;

type EngineeringKanbanFunnelListProps = {
	listTitle: string;
	listItems: TEngineeringProjectsKanbanOutput["data"][string];
	handleItemClick: (id: string) => void;
};
function EngineeringKanbanFunnelList({ listTitle, listItems, handleItemClick }: EngineeringKanbanFunnelListProps) {
	return (
		<Droppable droppableId={listTitle.toString()}>
			{(provided) => (
				<div className="flex w-full min-w-[390px] flex-col p-2 px-4 lg:w-[390px]">
					<div className="flex w-full flex-col rounded bg-[#15599a] px-2 lg:h-[60px]">
						<div className="flex w-full items-center gap-2">
							<h1 className="w-full rounded p-1 text-center font-medium text-white">{listTitle}</h1>
						</div>
						<div className="mt-1 flex w-full flex-col items-center justify-center px-2 pb-2 lg:flex-row">
							<div className="w-full lg:w-1/3" />
							<div className="flex w-full items-center justify-center gap-1 text-[0.65rem] text-white lg:w-1/3 lg:text-[0.7rem]">
								<MdDashboard />
								<p>{listItems.length}</p>
							</div>
						</div>
					</div>
					<div ref={provided.innerRef} {...provided.droppableProps} className="my-1 flex flex-col gap-2">
						{listItems.map((item, index) => (
							<EngineeringKanbanListItem key={item._id} item={item} index={index} handleClick={handleItemClick} />
						))}
						{provided.placeholder}
					</div>
				</div>
			)}
		</Droppable>
	);
}

function getProjectFlags(project: TEngineeringProjectsKanbanOutput["data"][string][number]) {
	const homologationStatusValue = project.homologacao.status;
	const homologationStatusValueColor =
		homologationStatusValue === "APROVADO" ? "text-green-500" : homologationStatusValue === "REPROVADO" ? "text-red-500" : "text-primary";
	const homologationInspectionIsDone = !!project.homologacao.vistoria.dataEfetivacao;
	const executiveDiagramDone = !!project.homologacao.pendencias.diagramas;
	const executiveDrawingDone = !!project.homologacao.pendencias.desenhos;
	const projectIsDelivered = project.compra.statusEntrega === "ENTREGUE";
	const projectsDelivery = {
		label: projectIsDelivered ? "DATA DE ENTREGA" : "PREV. DE ENTREGA",
		value: projectIsDelivered ? formatDateAsLocale(project.compra.dataEntrega) || "-" : formatDateAsLocale(project.compra.previsaoEntrega) || "-",
	};

	const timeSinceContractSignature = dayjs(project.contrato.dataAssinatura).diff(dayjs(CurrentDate), "day");
	const timeSinceAccessGrantingRequest = project.homologacao.acesso.dataSolicitacao
		? dayjs(project.homologacao.acesso.dataSolicitacao).diff(dayjs(CurrentDate), "day")
		: undefined;
	const timeSinceAccessGrantingResponse = project.homologacao.acesso.dataResposta
		? dayjs(project.homologacao.acesso.dataResposta).diff(dayjs(CurrentDate), "day")
		: undefined;

	const isFastTrack = project.homologacao.fastTrack;

	return {
		homologationStatusFlag: {
			label: "STATUS DA HOMOLOGAÇÃO",
			value: homologationStatusValue,
			valueColor: homologationStatusValueColor,
		},
		homologationInspectionFlag: {
			label: "STATUS DA VISTORIA",
			value: homologationInspectionIsDone ? "FEITA" : "PENDENTE",
			valueColor: homologationInspectionIsDone ? "text-green-500" : "text-red-500",
		},
		executiveDiagramFlag: {
			label: "DIAGRAMA UNIFILAR",
			value: executiveDiagramDone ? "FEITO" : "PENDENTE",
			valueColor: executiveDiagramDone ? "text-green-500" : "text-red-500",
		},
		executiveDrawingFlag: {
			label: "DESENHO DO TELHADO",
			value: executiveDrawingDone ? "FEITO" : "PENDENTE",
			valueColor: executiveDrawingDone ? "text-green-500" : "text-red-500",
		},
		projectsDeliveryFlag: {
			label: projectIsDelivered ? "DATA DE ENTREGA" : "PREV. DE ENTREGA",
			value: projectIsDelivered ? formatDateAsLocale(project.compra.dataEntrega) || "-" : formatDateAsLocale(project.compra.previsaoEntrega) || "-",
			valueColor: projectIsDelivered ? "text-green-500" : "text-red-500",
		},
		timeSinceContractSignatureFlag: {
			label: "DESDE ASS.CONTRATO",
			value: timeSinceContractSignature,
			valueColor: "text-primary",
		},
		timeSinceAccessGrantingRequestFlag: {
			label: "DESDE A SOLICITAÇÃO DE ACESSO",
			value: timeSinceAccessGrantingRequest ? `${timeSinceAccessGrantingRequest} DIAS` : "-",
			valueColor: "text-primary",
		},
		timeSinceAccessGrantingResponseFlag: {
			label: "DESDE A RESPOSTA DO PARECER",
			value: timeSinceAccessGrantingResponse ? `${timeSinceAccessGrantingResponse} DIAS` : "-",
			valueColor: "text-primary",
		},
		isFastTrackedFlag: {
			label: "FAST TRACK",
			value: isFastTrack ? "SIM" : "NÃO",
			valueColor: isFastTrack ? "text-green-500" : "text-red-500",
		},
	};
}
type EngineeringKanbanListItemProps = {
	item: TEngineeringProjectsKanbanOutput["data"][string][number];
	index: number;
	handleClick: (id: string) => void;
};
function EngineeringKanbanListItem({ item, index, handleClick }: EngineeringKanbanListItemProps) {
	const {
		homologationStatusFlag,
		homologationInspectionFlag,
		executiveDiagramFlag,
		executiveDrawingFlag,
		projectsDeliveryFlag,
		timeSinceContractSignatureFlag,
		timeSinceAccessGrantingRequestFlag,
		timeSinceAccessGrantingResponseFlag,
		isFastTrackedFlag,
	} = getProjectFlags(item);
	return (
		<Draggable draggableId={item._id.toString()} index={index}>
			{(provided) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					className="bg-background border-primary/60 relative flex min-h-[110px] w-full flex-col justify-between gap-1 rounded border p-2 shadow-xs"
				>
					<div className="flex w-full items-center justify-between gap-2">
						<div className="flex items-center gap-1">
							<h1 className="text-sm leading-none font-bold tracking-tight">{item.nomeDoContrato}</h1>
						</div>
						<button
							type="button"
							onClick={() => handleClick(item._id)}
							className="bg-primary text-secondary flex items-center gap-1 rounded-lg px-2 py-1 text-[0.6rem]"
						>
							<Pencil width={10} height={10} />
							<p>EDITAR</p>
						</button>
					</div>
					<div className="flex w-full grow flex-col gap-2 px-2">
						<div className={cn("flex w-fit items-center gap-1 self-center rounded-lg px-2 py-1", getServiceTypeTagColor(item.tipoDeServico || ""))}>
							<MdDashboard size={12} />
							<h1 className="text-xxs font-medium">{item.tipoDeServico}</h1>
						</div>
						{item.etiquetas && item.etiquetas.length > 0 ? (
							<div className="flex w-full flex-wrap items-center justify-start gap-2 lg:grow">
								<h1 className="text-primary/80 py-0.5 text-center text-[0.6rem] font-medium italic">ETIQUETAS</h1>
								{item.etiquetas.map((tag, index) => (
									<div
										key={`${tag.id}-${index}`}
										style={{
											border: "1px solid",
											borderColor: tag.cores.primaria,
											color: tag.cores.primaria,
											backgroundColor: tag.cores.secundaria,
										}}
										className={cn("flex items-center gap-1 rounded px-2 py-0.5")}
									>
										<Tag width={10} height={10} />
										<h1 className="text-xxs font-bold tracking-tight">{tag.titulo}</h1>
									</div>
								))}
							</div>
						) : null}
						<div className="flex items-center justify-between">
							<div>
								<span className="text-xxs">{homologationStatusFlag.label}</span>
								<p className={cn("text-primary/80 text-xs", homologationStatusFlag.valueColor)}>{homologationStatusFlag.value}</p>
							</div>
							<div className="text-end">
								<span className="text-xxs text-end">{homologationInspectionFlag.label}</span>
								<p className={cn("text-primary/80 text-center text-xs", homologationInspectionFlag.valueColor)}>{homologationInspectionFlag.value}</p>
							</div>
						</div>
						<div className="flex items-center justify-between">
							<div>
								<span className="text-xxs">{executiveDiagramFlag.label}</span>
								<p className={cn("text-xs uppercase", executiveDiagramFlag.valueColor)}>{executiveDiagramFlag.value}</p>
							</div>
							<div>
								<span className="text-xxs text-center">{projectsDeliveryFlag.label}</span>
								<p className={cn("text-primary/80 text-center text-xs uppercase", projectsDeliveryFlag.valueColor)}>{projectsDeliveryFlag.value}</p>
							</div>
							<div>
								<span className="text-xxs">{executiveDrawingFlag.label}</span>
								<p className={cn("text-primary/80 text-center text-xs", executiveDrawingFlag.valueColor)}>{executiveDrawingFlag.value}</p>
							</div>
						</div>
						<div className="flex items-center justify-between">
							<div className="flex w-full flex-col">
								<span className="text-xxs">{timeSinceContractSignatureFlag.label}</span>
								<p className={cn("text-start text-xs text-red-500 uppercase", timeSinceContractSignatureFlag.valueColor)}>
									{timeSinceContractSignatureFlag.value}
								</p>
							</div>
							<div className="flex w-full flex-col">
								<span className="text-xxs text-end">{timeSinceAccessGrantingResponseFlag.label}</span>
								<p className={cn("text-end text-xs text-red-500 uppercase", timeSinceAccessGrantingResponseFlag.valueColor)}>
									{timeSinceAccessGrantingResponseFlag.value}
								</p>
							</div>
						</div>
						{item.homologacao.acesso.dataSolicitacao ? (
							<div className="flex w-full items-center justify-between">
								<p className="text-xxs">{timeSinceAccessGrantingRequestFlag.label}</p>
								<p className={cn("text-primary/80 text-start text-xs", timeSinceAccessGrantingRequestFlag.valueColor)}>
									{timeSinceAccessGrantingRequestFlag.value}
								</p>
							</div>
						) : null}
						{item.homologacao.fastTrack ? (
							<div className="flex w-full items-center justify-center">
								<h1 className={cn("rounded px-2 py-1 text-[0.55rem] font-bold", isFastTrackedFlag.valueColor)}>{isFastTrackedFlag.value}</h1>
							</div>
						) : null}
					</div>
					<div className="flex w-full items-center justify-between gap-2" />
				</div>
			)}
		</Draggable>
	);
}
