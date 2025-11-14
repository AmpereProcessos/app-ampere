import React, { useState } from "react";

import type { TServiceOrdersPageModes } from "@/pages/ordens-de-servico";
import type { TAuthSession } from "@/lib/authentication/types";
import ServiceOrdersFilterMenu from "./FilterMenu";
import { useQueryClient } from "@tanstack/react-query";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import { FaLocationDot, FaRotate } from "react-icons/fa6";
import { ListFilter, Pencil, Tag, UserRound } from "lucide-react";
import { useServiceOrdersByPersonalizedFilters } from "@/utils/methods/query/service-orders";
import { Button } from "@/components/ui/button";
import GeneralPaginationComponent from "@/components/utils/Pagination";
import LoadingComponent from "@/components/utils/LoadingComponent";
import { getErrorMessage } from "@/utils/methods/handlers";
import ErrorComponent from "@/components/utils/ErrorComponent";
import type { TServiceOrder, TServiceOrderSimplifiedDTO } from "@/utils/schemas/service-order";
import { cn } from "@/lib/utils";
import { BsCalendarCheck, BsCalendarPlus, BsCheck2, BsCheck2All } from "react-icons/bs";
import { formatDateAsLocale, formatNameAsInitials } from "@/utils/methods/formatting";
import { BsCalendar } from "react-icons/bs";
import { MdDashboard } from "react-icons/md";
import Avatar from "@/components/utils/Avatar";
import ModalNewServiceOrder from "./modals/ModalNewServiceOrder";
import ModalControlServiceOrder from "./modals/ModalControlServiceOrder";

type ServiceOrdersCardModePageProps = {
	session: TAuthSession;
	handleSetMode: (mode: TServiceOrdersPageModes) => void;
};
function ServiceOrdersCardModePage({ session, handleSetMode }: ServiceOrdersCardModePageProps) {
	const queryClient = useQueryClient();

	const [filterMenuIsOpen, setFilterMenuIsOpen] = useState<boolean>(false);

	const [newServiceOrderModalIsOpen, setNewServiceOrderModalIsOpen] = useState<boolean>(false);
	const [editServiceOrderModal, setEditServiceOrderModal] = useState<{ id: string | null; isOpen: boolean }>({ id: null, isOpen: false });
	const {
		data: serviceOrdersByFiltersResult,
		isLoading,
		isError,
		isSuccess,
		error,
		filters,
		updateFilters,
	} = useServiceOrdersByPersonalizedFilters({
		initialFilters: {},
	});

	const serviceOrders = serviceOrdersByFiltersResult?.serviceOrders;
	const serviceOrdersMatched = serviceOrdersByFiltersResult?.serviceOrdersMatched || 0;
	const serviceOrdersShowing = serviceOrders?.length || 0;
	const totalPages = serviceOrdersByFiltersResult?.totalPages || 0;

	const callbackOnMutate = async () => await queryClient.cancelQueries({ queryKey: ["service-orders-by-filters", filters] });
	const callbackOnSettled = async () => await queryClient.invalidateQueries({ queryKey: ["service-orders-by-filters", filters] });
	return (
		<div className="flex grow flex-col gap-2 p-6">
			<div className="border-primary/20 flex flex-col items-center justify-between border-b p-1">
				<div className="flex w-full flex-col items-center justify-between gap-2 gap-y-3 lg:flex-row">
					<div className="flex flex-col items-center gap-1 lg:flex-row">
						<div className="flex items-center gap-1">
							{filterMenuIsOpen ? (
								<div className="text-primary/80 cursor-pointer hover:text-blue-400">
									<IoMdArrowDropupCircle style={{ fontSize: "25px" }} onClick={() => setFilterMenuIsOpen(false)} />
								</div>
							) : (
								<div className="text-primary/80 cursor-pointer hover:text-blue-400">
									<IoMdArrowDropdownCircle style={{ fontSize: "25px" }} onClick={() => setFilterMenuIsOpen(true)} />
								</div>
							)}
							<p className="text-center text-2xl font-black text-[#15599a] uppercase">CONTROLE DE ORDENS DE SERVIÇO</p>
						</div>

						<button
							type="button"
							onClick={() => handleSetMode("kanban")}
							className="text-primary/60 hover:text-primary/80 flex items-center gap-1 px-2 text-xs duration-300 ease-out"
						>
							<FaRotate />
							<h1 className="font-medium">ALTERAR MODO</h1>
						</button>
					</div>
					<div className="flex items-center gap-1">
						<Button onClick={() => setFilterMenuIsOpen((prev) => !prev)} className="flex items-center gap-1">
							<ListFilter height={15} width={15} />
							<h1>FILTRAR</h1>
						</Button>
						<Button onClick={() => setNewServiceOrderModalIsOpen(true)}>NOVO ORDEM DE SERVIÇO</Button>
					</div>
				</div>
				{filterMenuIsOpen ? (
					<ServiceOrdersFilterMenu
						filters={filters}
						updateFilters={updateFilters}
						queryLoading={isLoading}
						resetSelectedPage={() => updateFilters({ page: 1 })}
					/>
				) : null}
			</div>
			<GeneralPaginationComponent
				activePage={filters.page}
				queryLoading={isLoading}
				selectPage={(page) => updateFilters({ page })}
				totalPages={totalPages || 0}
				itemsMatchedText={
					serviceOrdersMatched > 1 ? `${serviceOrdersMatched} ordens de serviço encontradas.` : `${serviceOrdersMatched} ordem de serviço encontrada.`
				}
				itemsShowingText={
					serviceOrdersShowing > 1 ? `Mostrando ${serviceOrdersShowing} ordens de serviço.` : `Mostrando ${serviceOrdersShowing} ordem de serviço.`
				}
			/>

			<div className="flex w-full flex-col items-center gap-2">
				{isLoading ? <LoadingComponent /> : null}
				{isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
				{isSuccess ? (
					serviceOrders && serviceOrders.length > 0 ? (
						serviceOrders.map((serviceOrder) => (
							<ServiceOrderCard key={serviceOrder._id} serviceOrder={serviceOrder} handleClick={(id) => setEditServiceOrderModal({ id, isOpen: true })} />
						))
					) : (
						<div className="text-primary/80 w-full text-center text-sm font-medium tracking-tight">Nenhuma ordem de serviço encontrada.</div>
					)
				) : null}
			</div>
			{newServiceOrderModalIsOpen ? (
				<ModalNewServiceOrder
					session={session}
					closeModal={() => setNewServiceOrderModalIsOpen(false)}
					callbacks={{
						onMutate: callbackOnMutate,
						onSettled: callbackOnSettled,
					}}
				/>
			) : null}
			{editServiceOrderModal.isOpen && editServiceOrderModal.id ? (
				<ModalControlServiceOrder
					serviceOrderId={editServiceOrderModal.id}
					session={session}
					closeModal={() => setEditServiceOrderModal({ id: null, isOpen: false })}
					callbacks={{
						onMutate: callbackOnMutate,
						onSettled: callbackOnSettled,
					}}
				/>
			) : null}
		</div>
	);
}

export default ServiceOrdersCardModePage;

type ServiceOrderCardProps = {
	serviceOrder: TServiceOrderSimplifiedDTO;
	handleClick: (id: string) => void;
};
function ServiceOrderCard({ serviceOrder, handleClick }: ServiceOrderCardProps) {
	function getStatusTag(serviceOrder: TServiceOrderSimplifiedDTO) {
		if (serviceOrder.status === "PENDENTE") return <div className="text-xxs rounded-full bg-red-600 px-2 py-0.5 font-medium text-white">PENDENTE</div>;

		if (serviceOrder.status === "AGUARDANDO PLANEJAMENTO")
			return <div className="text-xxs rounded-full bg-blue-800 px-2 py-0.5 font-medium text-white">EM PLANEJAMENTO</div>;

		if (serviceOrder.status === "AGUARDANDO AGENDAMENTO")
			return <div className="text-xxs rounded-full bg-yellow-600 px-2 py-0.5 font-medium text-white">AGENDADA</div>;

		if (serviceOrder.status === "EM EXECUÇÃO")
			return <div className="text-xxs rounded-full bg-blue-600 px-2 py-0.5 font-medium text-white">EM EXECUÇÃO</div>;

		if (serviceOrder.status === "CONCLUÍDA PARCIAL")
			return <div className="text-xxs rounded-full bg-purple-600 px-2 py-0.5 font-medium text-white">CONCLUÍDA PARCIAL</div>;

		if (serviceOrder.status === "CONCLUÍDA") return <h1 className="text-xxs min-w-fit rounded-lg bg-green-500 px-2 py-0.5 text-white">CONCLUÍDA</h1>;

		if (serviceOrder.status === "CANCELADA") return <h1 className="text-xxs bg-primary/60 min-w-fit rounded-lg px-2 py-0.5 text-white">CANCELADA</h1>;

		return <h1 className="bg-primary text-xxs min-w-fit rounded-lg px-2 py-0.5 text-white">NÃO DEFINIDO</h1>;
	}
	return (
		<div className="border-primary bg-background flex w-full flex-col gap-1 rounded border p-2 shadow-xs dark:bg-[#121212]">
			<div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
				<div className="flex flex-wrap items-center gap-2">
					<p className="text-sm leading-none font-bold tracking-tight">{serviceOrder.descricao}</p>
					{serviceOrder.projeto.nome ? (
						<div className="flex items-center gap-1">
							<MdDashboard size={10} />
							<h1 className="text-primary/80 py-0.5 text-center text-[0.6rem] font-medium italic">{serviceOrder.projeto.nome}</h1>
						</div>
					) : null}

					{getStatusTag(serviceOrder)}
				</div>
				<div className="flex items-center gap-1">
					<UserRound size={12} />
					<h1 className="text-primary/80 py-0.5 text-center text-[0.6rem] font-medium italic">{serviceOrder.responsavel.nome}</h1>
				</div>
			</div>
			<div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
				<div className="flex w-full flex-wrap items-center justify-center gap-2 lg:grow lg:justify-start">
					<div className="flex items-center gap-1">
						<Tag size={12} />
						<h1 className="text-primary/80 py-0.5 text-center text-[0.6rem] font-medium italic">{serviceOrder.categoria}</h1>
					</div>
					<h1 className="text-primary/80 py-0.5 text-center text-[0.6rem] font-medium italic">ETIQUETAS</h1>
					{serviceOrder.etiquetas && serviceOrder.etiquetas?.length > 0 ? (
						serviceOrder.etiquetas.map((tag, index) => (
							<div
								key={`${index}-${tag.id}`}
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
						))
					) : (
						<h1 className="text-primary/80 py-0.5 text-center text-[0.6rem] font-medium italic">NÃO DEFINIDAS</h1>
					)}
				</div>
				<div className="flex w-full flex-wrap items-center justify-center gap-2 lg:min-w-fit lg:justify-end">
					<div className="flex items-center gap-1">
						<FaLocationDot width={10} height={10} />
						<h1 className="text-primary/80 py-0.5 text-center text-[0.6rem] font-medium italic">LOCALIZAÇÃO</h1>
						<h1 className="text-primary py-0.5 text-center text-[0.6rem] font-bold">
							{serviceOrder.localizacao.cidade} ({serviceOrder.localizacao.uf})
						</h1>
					</div>
					<div className="flex items-center gap-1">
						<BsCheck2 width={10} height={10} />
						<h1 className="text-primary/80 py-0.5 text-center text-[0.6rem] font-medium italic">PREVISÃO DE LIBERAÇÃO</h1>
						<h1 className="text-primary py-0.5 text-center text-[0.6rem] font-bold">
							{serviceOrder.dataPrevisaoLiberacao ? formatDateAsLocale(serviceOrder.dataPrevisaoLiberacao) : "N/A"}
						</h1>
					</div>
					<div className="flex items-center gap-1">
						<BsCheck2All width={10} height={10} />
						<h1 className="text-primary/80 py-0.5 text-center text-[0.6rem] font-medium italic">LIBERAÇÃO</h1>
						<h1 className="text-primary py-0.5 text-center text-[0.6rem] font-bold">
							{serviceOrder.dataLiberacao ? formatDateAsLocale(serviceOrder.dataLiberacao) : "N/A"}
						</h1>
					</div>
					<div className="flex items-center gap-1">
						<BsCalendar width={10} height={10} />
						<h1 className="text-primary/80 py-0.5 text-center text-[0.6rem] font-medium italic">AGENDAMENTO</h1>
						<h1 className="text-primary py-0.5 text-center text-[0.6rem] font-bold">
							{serviceOrder.agendamento
								? `${formatDateAsLocale(serviceOrder.agendamento.inicio, true)} - ${serviceOrder.agendamento.fim ? formatDateAsLocale(serviceOrder.agendamento.fim, true) : "N/A"}`
								: "N/A"}
						</h1>
					</div>
					<div className="flex items-center gap-1">
						<BsCalendarCheck width={10} height={10} />
						<h1 className="text-primary/80 py-0.5 text-center text-[0.6rem] font-medium italic">EXECUÇÃO</h1>
						<h1 className="text-primary py-0.5 text-center text-[0.6rem] font-bold">
							{serviceOrder.periodo.inicio
								? `${formatDateAsLocale(serviceOrder.periodo.inicio, true)} - ${serviceOrder.periodo.fim ? formatDateAsLocale(serviceOrder.periodo.fim, true) : "N/A"}`
								: "N/A"}
						</h1>
					</div>
				</div>
			</div>
			<div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
				<div className="flex flex-wrap items-center gap-2">
					<div className="flex items-center gap-1">
						<BsCalendarPlus />
						<p className="text-primary/80 text-[0.65rem] font-medium">{formatDateAsLocale(serviceOrder.dataInsercao, true)}</p>
					</div>
					{serviceOrder.dataEfetivacao ? (
						<div className="flex items-center gap-1">
							<BsCalendarCheck color="#22c55e" />
							<p className="text-primary/80 text-[0.65rem] font-medium">{formatDateAsLocale(serviceOrder.dataEfetivacao, true)}</p>
						</div>
					) : null}
					<div className="flex items-center gap-1">
						<Avatar
							url={serviceOrder.autor?.avatar_url || undefined}
							width={20}
							height={20}
							fallback={formatNameAsInitials(serviceOrder.autor?.nome || "")}
						/>

						<p className="text-primary/80 text-[0.65rem] font-medium">{serviceOrder.autor?.nome || ""}</p>
					</div>
				</div>
				<button
					type="button"
					onClick={() => handleClick(serviceOrder._id)}
					className="bg-primary text-secondary flex items-center gap-1 rounded-lg px-2 py-1 text-[0.6rem]"
				>
					<Pencil width={10} height={10} />
					<p>EDITAR</p>
				</button>
			</div>
		</div>
	);
}
