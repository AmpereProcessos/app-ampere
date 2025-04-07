import { usePurchaseControls, usePurchaseControlsTags } from "@/utils/methods/query/purchase-controls";
import type { Session } from "next-auth";
import React, { useEffect, useState } from "react";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle, IoMdContract, IoMdExpand } from "react-icons/io";
import type { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import LoadingComponent from "@/components/utils/LoadingComponent";
import ErrorComponent from "@/components/utils/ErrorComponent";
import { getErrorMessage } from "@/utils/methods/handlers";
import type { TPurchaseControl, TPurchaseControlKanbanSimplifiedDTO } from "@/utils/schemas/purchases";
import { MdDashboard } from "react-icons/md";
import Avatar from "@/components/utils/Avatar";
import { formatDateAsLocale, formatNameAsInitials, formatWithoutDiacritics } from "@/utils/methods/formatting";
import { BsCalendar, BsCalendarCheck, BsCalendarEvent, BsCalendarPlus, BsFillFunnelFill, BsFunnel, BsFunnelFill } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import NewPurchaseControl from "./modals/NewPurchaseControl";
import { CheckCheck, Factory, Pencil, ScrollText, Tag, Target, Truck, X } from "lucide-react";
import { useMutationWithFeedback } from "@/utils/methods/mutation/general-hook";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePurchaseControl } from "@/utils/methods/mutation/purchase-controls";
import toast from "react-hot-toast";
import ControlPurchaseControl from "./modals/ControlPurchaseControl";
import { cn } from "@/lib/utils";
import type { TPurchaseControlKanbanListExpandedModes, TPurchasesControlPageModes } from "@/pages/suprimentos/controle-compras";
import { FaLocationDot, FaRotate } from "react-icons/fa6";
import SelectInput from "@/components/inputs/Select";
import MultipleSelectInput from "@/components/inputs/MultipleSelect";
import { FaExpand } from "react-icons/fa";
import { handleSetCookie } from "@/utils/methods/cookies";
import { PurchaseControlStatus } from "@/utils/select-options";
import dayjs from "dayjs";
import { TbUrgent } from "react-icons/tb";

type TPurchaseControlByStatus = {
	title: string;
	items: TPurchaseControlKanbanSimplifiedDTO[];
};

type PurchaseControlsKanbanModePageProps = {
	session: Session;
	handleSetMode: (mode: TPurchasesControlPageModes) => void;
	initialKanbanListExpandedModeOptions: TPurchaseControlKanbanListExpandedModes;
};
function PurchaseControlsKanbanModePage({ session, handleSetMode, initialKanbanListExpandedModeOptions }: PurchaseControlsKanbanModePageProps) {
	const queryClient = useQueryClient();

	const { data: tags } = usePurchaseControlsTags();
	const { data: purchaseControls, isLoading, isError, isSuccess, error, queryParams, updateQueryParams, filters, setFilters } = usePurchaseControls();
	const [newPurchaseControlModalIsOpen, setNewPurchaseControlModalIsOpen] = useState<boolean>(false);
	const [editPurchaseControlModal, setEditPurchaseControlModal] = useState<{ id: string | null; isOpen: boolean }>({ id: null, isOpen: false });
	function getPurchaseControlsByStatus(purchaseControls: TPurchaseControlKanbanSimplifiedDTO[] | undefined): TPurchaseControlByStatus[] {
		if (!purchaseControls)
			return Object.entries({
				PENDENTE: [],
				"EM COTAÇÃO": [],
				"AGUARDANDO APROVAÇÃO": [],
				"AGUARDANDO COMPRA": [],
				"AGUARDANDO NOTA FUTURA": [],
				"AGUARDANDO PAGAMENTO": [],
				"AGUARDANDO NOTA FINAL": [],
				"AGUARDANDO SEPARAÇÃO": [],
				"AGUARDANDO DESPACHE": [],
				"AGUARDANDO ENTREGA": [],
				CONCLUÍDA: [],
				PENDÊNCIAS: [],
			}).map(([key, value]) => ({ title: key, items: value }));

		function handleSortByStatusLog(status: TPurchaseControlKanbanSimplifiedDTO["status"], itemA: TPurchaseControlKanbanSimplifiedDTO, itemB: TPurchaseControlKanbanSimplifiedDTO) {
			const dateAAddedInStatus = itemA.registrosStatus?.[status]?.entrada;
			const dateBAddedInStatus = itemB.registrosStatus?.[status]?.entrada;
			if (!dateAAddedInStatus || !dateBAddedInStatus) return 0;
			return new Date(dateAAddedInStatus).getTime() - new Date(dateBAddedInStatus).getTime();
		}
		return Object.entries({
			PENDENTE: purchaseControls.filter((c) => c.status == "PENDENTE"),
			"EM COTAÇÃO": purchaseControls.filter((c) => c.status == "EM COTAÇÃO").sort((a, b) => handleSortByStatusLog("EM COTAÇÃO", a, b)),
			"AGUARDANDO APROVAÇÃO": purchaseControls.filter((c) => c.status == "AGUARDANDO APROVAÇÃO").sort((a, b) => handleSortByStatusLog("AGUARDANDO APROVAÇÃO", a, b)),
			"AGUARDANDO NOTA FUTURA": purchaseControls.filter((c) => c.status == "AGUARDANDO NOTA FUTURA").sort((a, b) => handleSortByStatusLog("AGUARDANDO NOTA FUTURA", a, b)),
			"AGUARDANDO PAGAMENTO": purchaseControls.filter((c) => c.status == "AGUARDANDO PAGAMENTO").sort((a, b) => handleSortByStatusLog("AGUARDANDO PAGAMENTO", a, b)),
			"AGUARDANDO NOTA FINAL": purchaseControls.filter((c) => c.status == "AGUARDANDO NOTA FINAL").sort((a, b) => handleSortByStatusLog("AGUARDANDO NOTA FINAL", a, b)),
			"AGUARDANDO COMPRA": purchaseControls.filter((c) => c.status == "AGUARDANDO COMPRA").sort((a, b) => handleSortByStatusLog("AGUARDANDO COMPRA", a, b)),
			"AGUARDANDO SEPARAÇÃO": purchaseControls.filter((c) => c.status == "AGUARDANDO SEPARAÇÃO").sort((a, b) => handleSortByStatusLog("AGUARDANDO SEPARAÇÃO", a, b)),
			"AGUARDANDO FATURAMENTO": purchaseControls.filter((c) => c.status == "AGUARDANDO FATURAMENTO").sort((a, b) => handleSortByStatusLog("AGUARDANDO FATURAMENTO", a, b)),
			"AGUARDANDO NF COR": purchaseControls.filter((c) => c.status == "AGUARDANDO NF COR").sort((a, b) => handleSortByStatusLog("AGUARDANDO NF COR", a, b)),
			"AGUARDANDO DESPACHE": purchaseControls.filter((c) => c.status == "AGUARDANDO DESPACHE").sort((a, b) => handleSortByStatusLog("AGUARDANDO DESPACHE", a, b)),
			"AGUARDANDO ENTREGA": purchaseControls.filter((c) => c.status == "AGUARDANDO ENTREGA").sort((a, b) => handleSortByStatusLog("AGUARDANDO ENTREGA", a, b)),
			CONCLUÍDA: purchaseControls.filter((c) => c.status == "CONCLUÍDA").sort((a, b) => handleSortByStatusLog("CONCLUÍDA", a, b)),
			PENDÊNCIAS: purchaseControls.filter((c) => c.status == "PENDÊNCIAS").sort((a, b) => handleSortByStatusLog("PENDÊNCIAS", a, b)),
		}).map(([key, value]) => ({ title: key, items: value }));
	}

	function onDragEnd(dragEndResult: DropResult) {
		function handleEffectivationUpdate(newValue: TPurchaseControlKanbanSimplifiedDTO["status"], previousData: TPurchaseControlKanbanSimplifiedDTO) {
			if (newValue == "CONCLUÍDA") {
				if (previousData.status != "CONCLUÍDA") return new Date().toISOString();
				return previousData.dataEfetivacao;
			} else {
				if (previousData.status == "CONCLUÍDA") return null;
				return previousData.dataEfetivacao;
			}
		}
		function handleStatusLogs(newValue: TPurchaseControl["status"], previousData: TPurchaseControlKanbanSimplifiedDTO) {
			const previousStatus = previousData.status;
			const newStatus = newValue;
			if (previousStatus == newStatus) return previousData.registrosStatus || {};
			const previousStatusLog = previousData.registrosStatus?.[previousStatus] || {};
			const newStatusLog = previousData.registrosStatus?.[newStatus] || {};
			return {
				...(previousData.registrosStatus || {}),
				[previousStatus]: { ...previousStatusLog, saida: new Date().toISOString() },
				[newStatus]: { ...newStatusLog, entrada: new Date().toISOString() },
			};
		}
		const { source, destination, draggableId } = dragEndResult;

		if (!destination) return;
		if (destination.droppableId == source.droppableId) return;

		const purchaseControl = purchaseControls?.find((p) => p._id == draggableId);
		if (!purchaseControl) return;
		handleUpdatePurchaseControlStatus({
			id: draggableId,
			changes: {
				status: destination.droppableId as TPurchaseControlKanbanSimplifiedDTO["status"],
				dataEfetivacao: handleEffectivationUpdate(destination.droppableId as TPurchaseControlKanbanSimplifiedDTO["status"], purchaseControl),
				registrosStatus: handleStatusLogs(destination.droppableId as TPurchaseControlKanbanSimplifiedDTO["status"], purchaseControl),
			},
		});
	}
	const { mutate: handleUpdatePurchaseControlStatus } = useMutation({
		mutationKey: ["update-purchase-control"],
		mutationFn: updatePurchaseControl,
		onMutate: async (variables) => {
			await queryClient.cancelQueries({ queryKey: ["purchase-controls"] });

			const querySnapshot = queryClient.getQueryData(["purchase-controls"]) as TPurchaseControlKanbanSimplifiedDTO[] | undefined;

			if (!querySnapshot) return { querySnapshot };
			const update = querySnapshot.map((prev) => (prev._id == variables.id ? { ...prev, status: variables.changes.status || "INDEFINIDO" } : prev));
			queryClient.setQueryData(["purchase-controls"], update);

			return { querySnapshot };
		},
		onSuccess: async (data) => {
			toast.success(data);
			return;
		},
		onError: (error, variables, context) => {
			queryClient.setQueryData(["purchase-controls"], context?.querySnapshot);
		},
		onSettled: (data, error, variables, context) => {
			queryClient.invalidateQueries({ queryKey: ["purchase-controls"] });
		},
	});
	return (
		<div className="flex grow flex-col gap-2 p-6">
			<div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
				<div className="flex w-full flex-col items-center justify-between gap-2 gap-y-3 lg:flex-row ">
					<div className="flex flex-col items-center  gap-1 lg:flex-row">
						<div className="flex items-center gap-1">
							<p className="text-center text-2xl font-black uppercase text-[#15599a]">CONTROLES DE COMPRA</p>
						</div>
						<button onClick={() => handleSetMode("card")} className="flex items-center gap-1 px-2 text-xs text-gray-500 duration-300 ease-out hover:text-gray-800">
							<FaRotate />
							<h1 className="font-medium">ALTERAR MODO</h1>
						</button>
					</div>
					<div className="flex w-full flex-col items-center gap-1 lg:w-fit lg:flex-row lg:items-end">
						<MultipleSelectInput
							label="TAGS"
							selected={queryParams.queryTags}
							options={tags?.map((tag) => ({ id: tag._id, value: tag._id, label: tag.titulo })) || []}
							handleChange={(value) => updateQueryParams({ queryTags: value as string[] })}
							selectedItemLabel="NÃO DEFINIDO"
							onReset={() => updateQueryParams({ queryTags: [] })}
						/>

						<button
							onClick={() => updateQueryParams({ queryPendingConclusion: !queryParams.queryPendingConclusion })}
							className={cn("min-h-[46.6px] rounded p-2 text-xs font-bold text-white", queryParams.queryPendingConclusion ? "bg-blue-600" : "bg-gray-600")}
						>
							{queryParams.queryPendingConclusion ? "EM ANDAMENTO" : "TODAS"}
						</button>
						<Button onClick={() => setNewPurchaseControlModalIsOpen(true)} className="min-h-[46.6px]">
							NOVO CONTROLE
						</Button>
					</div>
				</div>
			</div>

			<DragDropContext onDragEnd={(e) => onDragEnd(e)}>
				<div className="flex max-h-[600px] w-full gap-3 overflow-x-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
					{isLoading ? <LoadingComponent /> : null}
					{isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
					{isSuccess ? (
						<>
							{getPurchaseControlsByStatus(purchaseControls).map((controlsByStatus) => (
								<FunnelList
									key={controlsByStatus.title}
									session={session}
									title={controlsByStatus.title}
									items={controlsByStatus.items}
									initialKanbanListExpandedModeOptions={initialKanbanListExpandedModeOptions}
									handleItemClick={(id) => setEditPurchaseControlModal({ id, isOpen: true })}
								/>
							))}
						</>
					) : null}
				</div>
			</DragDropContext>
			{newPurchaseControlModalIsOpen ? (
				<NewPurchaseControl session={session} affectedQueryKey={["purchase-controls", queryParams]} closeModal={() => setNewPurchaseControlModalIsOpen(false)} />
			) : null}
			{editPurchaseControlModal.id && editPurchaseControlModal.isOpen ? (
				<ControlPurchaseControl
					session={session}
					purchaseControlId={editPurchaseControlModal.id}
					affectedQueryKey={["purchase-controls", queryParams]}
					closeModal={() => setEditPurchaseControlModal({ id: null, isOpen: false })}
				/>
			) : null}
		</div>
	);
}

export default PurchaseControlsKanbanModePage;

type FunnelListProps = {
	session: Session;
	title: string;
	items: TPurchaseControlKanbanSimplifiedDTO[];
	initialKanbanListExpandedModeOptions: TPurchaseControlKanbanListExpandedModes;
	handleItemClick: (id: string) => void;
};
function FunnelList({ session, title, items, initialKanbanListExpandedModeOptions, handleItemClick }: FunnelListProps) {
	function getFunnelListStatusDeadlineDays(status: TPurchaseControlKanbanSimplifiedDTO["status"]) {
		const statusOption = PurchaseControlStatus.find((s) => s.value == status);
		return statusOption?.deadlineDays;
	}
	const initialKanbanListExpandedMode = initialKanbanListExpandedModeOptions[title] || null;
	const [funnelListItemsExpandedModeActive, setFunnelListItemsExpandedModeActive] = useState<boolean>(initialKanbanListExpandedMode == "inactive" ? false : true);
	const deadlineDays = getFunnelListStatusDeadlineDays(title as TPurchaseControlKanbanSimplifiedDTO["status"]);
	return (
		<Droppable droppableId={title.toString()}>
			{(provided) => (
				<div className="flex w-full min-w-[390px] flex-col p-2 px-4 lg:w-[390px]">
					<div className="flex w-full flex-col rounded bg-[#15599a] px-2 lg:h-[60px]">
						<div className="flex w-full items-center gap-2">
							<button
								onClick={() => {
									if (!funnelListItemsExpandedModeActive) {
										handleSetCookie({
											ctx: null,
											key: `puchases-control-kanban-(${formatWithoutDiacritics(title)})-list-expanded`,
											value: "active",
											path: "/suprimentos/controle-compras",
										});
									} else {
										handleSetCookie({
											ctx: null,
											key: `puchases-control-kanban-(${formatWithoutDiacritics(title)})-list-expanded`,
											value: "inactive",
											path: "/suprimentos/controle-compras",
										});
									}

									setFunnelListItemsExpandedModeActive((prev) => !prev);
								}}
								className={cn("flex items-center rounded-full p-1 text-xs text-white", funnelListItemsExpandedModeActive ? "bg-slate-400" : "bg-transparent")}
							>
								{funnelListItemsExpandedModeActive ? <IoMdContract /> : <IoMdExpand />}
							</button>
							<h1 className="w-full rounded p-1 text-center font-medium text-white">{title}</h1>
							<button
								onClick={() => setFunnelListItemsExpandedModeActive((prev) => !prev)}
								className={cn("hidden items-center rounded p-1 text-white", funnelListItemsExpandedModeActive ? "bg-gray-50" : "bg-transparent")}
							>
								{funnelListItemsExpandedModeActive ? <IoMdContract /> : <IoMdExpand />}
							</button>
						</div>
						<div className="mt-1 flex w-full flex-col items-center justify-center px-2 pb-2 lg:flex-row">
							<div className="w-full lg:w-1/3" />
							<div className="flex w-full items-center justify-center gap-1 text-[0.65rem] text-white lg:w-1/3  lg:text-[0.7rem]">
								<MdDashboard />
								<p>{items.length}</p>
							</div>
							<div className="flex w-full items-center justify-center gap-1 text-[0.65rem] text-white lg:w-1/3  lg:text-[0.7rem]">
								{deadlineDays ? (
									<>
										<Target size={12} />
										<p>{deadlineDays} DIAS</p>
									</>
								) : null}
							</div>
						</div>
					</div>
					<div ref={provided.innerRef} {...provided.droppableProps} className="my-1 flex flex-col gap-2 ">
						{items.map((item, index) => (
							<FunnelListItem key={item._id} funnelListItemsExpandedModeActive={funnelListItemsExpandedModeActive} item={item} index={index} handleClick={handleItemClick} />
						))}
						{provided.placeholder}
					</div>
				</div>
			)}
		</Droppable>
	);
}

type FunnelListItemProps = {
	funnelListItemsExpandedModeActive: boolean;
	item: TPurchaseControlKanbanSimplifiedDTO;
	index: number;
	handleClick: (id: string) => void;
};
function FunnelListItem({ funnelListItemsExpandedModeActive, item, index, handleClick }: FunnelListItemProps) {
	const [itemExpandedModeActive, setItemExpandedModeActive] = useState(funnelListItemsExpandedModeActive);

	function getItemDeadlineStatus(item: TPurchaseControlKanbanSimplifiedDTO) {
		const statusDeadlineDays = PurchaseControlStatus.find((s) => s.value == item.status)?.deadlineDays;
		if (!statusDeadlineDays) return null;
		const itemStatusLogStart = item.registrosStatus?.[item.status]?.entrada;
		if (!itemStatusLogStart) return null;
		const itemStatusLogStartDate = new Date(itemStatusLogStart);
		const diffInDays = dayjs().diff(dayjs(itemStatusLogStartDate), "day");
		console.log(diffInDays);
		if (diffInDays > statusDeadlineDays)
			return (
				<div className="flex min-w-fit items-center gap-1 self-center rounded-lg bg-red-600 px-2 py-0.5 text-white">
					<TbUrgent size={12} />
					<h1 className="text-[0.5rem]">ATRASADO</h1>
				</div>
			);

		if (diffInDays + 1 >= statusDeadlineDays)
			return (
				<div className="flex min-w-fit items-center gap-1 self-center rounded-lg bg-yellow-600 px-2 py-0.5 text-white">
					<TbUrgent size={12} />
					<h1 className="text-[0.5rem]">VENCENDO</h1>
				</div>
			);

		return null;
	}
	useEffect(() => {
		setItemExpandedModeActive(funnelListItemsExpandedModeActive);
	}, [funnelListItemsExpandedModeActive]);
	return (
		<Draggable draggableId={item._id.toString()} index={index}>
			{(provided) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					className="relative flex min-h-[110px] w-full flex-col justify-between gap-1 rounded border border-gray-500 bg-[#fff] p-2 shadow-sm"
				>
					<div className="flex w-full items-center justify-between gap-2">
						<div className="flex items-center gap-1">
							<button
								onClick={() => setItemExpandedModeActive((prev) => !prev)}
								className={cn("flex items-center rounded-full p-1 text-xs text-black", itemExpandedModeActive ? "bg-slate-400" : "bg-transparent")}
							>
								{itemExpandedModeActive ? <IoMdContract /> : <IoMdExpand />}
							</button>
							<h1 className="text-sm font-bold leading-none tracking-tight">{item.titulo}</h1>
						</div>
						<button onClick={() => handleClick(item._id)} className="flex items-center gap-1 rounded-lg bg-primary px-2 py-1 text-[0.6rem] text-secondary">
							<Pencil width={10} height={10} />
							<p>EDITAR</p>
						</button>
					</div>
					<div className="flex w-full grow flex-col gap-2 px-2">
						{getItemDeadlineStatus(item)}
						{item.registrosStatus?.[item.status]?.entrada ? (
							<div className="flex w-fit items-center gap-1 self-center">
								<BsFunnel />
								<p className={`text-[0.65rem] font-medium text-gray-500`}>{formatDateAsLocale(item.registrosStatus?.[item.status]?.entrada, true)}</p>
							</div>
						) : null}
						{item.etiquetas.length > 0 ? (
							<div className="flex w-full flex-wrap items-center justify-start gap-2 lg:grow">
								<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80 ">ETIQUETAS</h1>
								{item.etiquetas.map((tag, index) => (
									<div
										key={index}
										style={{
											border: "1px solid",
											borderColor: tag.cores.primaria,
											color: tag.cores.primaria,
											backgroundColor: tag.cores.secundaria,
										}}
										className={cn("flex items-center gap-1 rounded px-2 py-0.5")}
									>
										<Tag width={10} height={10} />
										<h1 className="text-[0.5rem] font-bold tracking-tight">{tag.titulo}</h1>
									</div>
								))}
							</div>
						) : null}
						{itemExpandedModeActive ? (
							<>
								<div className="flex w-full flex-wrap items-center justify-around gap-2">
									<div className="flex items-center gap-1">
										<Factory height={13} width={13} />
										<h1 className="text-[0.6rem] font-medium text-primary/80">{item.fornecedor.nome || "FORNECEDOR INDEFINIDO"}</h1>
									</div>
									<div className="flex items-center gap-1">
										<ScrollText height={13} width={13} />
										<h1 className="text-[0.6rem] font-medium text-primary/80">
											FATURAMENTOS {item.faturamentos.filter((f) => !!f.data).length}/{item.faturamentos.length}
										</h1>
									</div>
									<div className="flex items-center gap-1">
										<FaLocationDot height={13} width={13} />
										<h1 className="text-[0.6rem] font-medium text-primary/80">
											{item.entrega.localizacao.cidade} ({item.entrega.localizacao.uf})
										</h1>
									</div>
								</div>
								<div className="flex w-full flex-wrap items-center justify-center gap-2">
									<div className="flex items-center gap-1">
										<BsCalendar width={10} height={10} />
										<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">PEDIDO</h1>
										<h1 className="py-0.5 text-center text-[0.6rem] font-bold  text-primary">{formatDateAsLocale(item.dataPedido) || "N/A"}</h1>
									</div>
									<div className="flex items-center gap-1">
										<BsCalendarEvent width={10} height={10} />
										<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">PREVISÃO</h1>
										<h1 className="py-0.5 text-center text-[0.6rem] font-bold  text-primary">{formatDateAsLocale(item.entrega.dataPrevisao) || "N/A"}</h1>
									</div>
									<div className="flex items-center gap-1">
										<BsCalendarCheck width={10} height={10} />
										<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">ENTREGA</h1>
										<h1 className="py-0.5 text-center text-[0.6rem] font-bold  text-primary">{formatDateAsLocale(item.entrega.dataEfetivacao) || "N/A"}</h1>
									</div>
								</div>
							</>
						) : null}
					</div>
					<div className="flex w-full items-center justify-between gap-2">
						<div className="flex grow flex-wrap items-center gap-2">
							<div className="flex items-center gap-1">
								<Avatar url={item.autor.avatar_url || undefined} fallback={formatNameAsInitials(item.autor.nome)} height={18} width={18} />

								<p className="text-[0.65rem] font-light text-gray-400">{item.autor.nome}</p>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<div className="flex min-w-fit items-center gap-1">
								<BsCalendarPlus />
								<p className={`text-[0.65rem] font-medium text-gray-500`}>{formatDateAsLocale(item.dataInsercao, true)}</p>
							</div>

							{item.dataEfetivacao ? (
								<div className="flex items-center gap-1">
									<BsCalendarCheck color="#22c55e" />
									<p className="text-[0.65rem] font-medium text-primary/80">{formatDateAsLocale(item.dataEfetivacao, true)}</p>
								</div>
							) : null}
						</div>
					</div>
				</div>
			)}
		</Draggable>
	);
}
