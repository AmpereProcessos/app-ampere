import ErrorComponent from "@/components/utils/ErrorComponent";
import LoadingComponent from "@/components/utils/LoadingComponent";
import GeneralPaginationComponent from "@/components/utils/Pagination";
import { getErrorMessage } from "@/utils/methods/handlers";
import { useServiceOrdersByPersonalizedFilters } from "@/utils/methods/query/service-orders";
import { useState } from "react";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import type { TServiceOrdersByFiltersResult } from "@/pages/api/ordensDeServico/search";
import { Code, Pencil, Tag, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { getHoursDiff } from "@/utils/methods/dates";
import { getFormattedTextFromHoursAmount } from "@/utils/methods/dates";
import { FaRegHourglass, FaSolarPanel } from "react-icons/fa";
import { BsCalendar, BsCalendarCheck, BsCalendarPlus, BsPatchCheckFill } from "react-icons/bs";
import { MdDashboard, MdRoofing } from "react-icons/md";
import { getServiceTypeTagColor } from "@/components/TagTipoDeServico";
import dayjs from "dayjs";
import { TbUrgent } from "react-icons/tb";
import { formatNameAsInitials } from "@/utils/methods/formatting";
import Avatar from "@/components/utils/Avatar";
import { formatDateAsLocale } from "@/utils/methods/formatting";
import type { Session } from "next-auth";
import { FaLocationDot } from "react-icons/fa6";
import ModalControlServiceOrder from "../ordensDeServico/modals/ModalControlServiceOrder";
import { useQueryClient } from "@tanstack/react-query";
import ExecutionPageFilters from "./ExecutionPageFilters";
import { ListFilter } from "lucide-react";
import ExecutionPageStats from "./ExecutionPageStats";
type ExecutionPageProps = {
	session: Session;
};
export default function ExecutionPage({ session }: ExecutionPageProps) {
	const queryClient = useQueryClient();
	const [editServiceOrderModal, setEditServiceOrderModal] = useState<{ id: string | null; isOpen: boolean }>({ id: null, isOpen: false });
	const [filterMenusIsOpen, setFilterMenusIsOpen] = useState<boolean>(false);
	const {
		data: serviceOrdersByFiltersResult,
		isLoading,
		isError,
		isSuccess,
		error,
		filters,
		updateFilters,
	} = useServiceOrdersByPersonalizedFilters({
		initialFilters: {
			pending: true,
		},
	});
	const serviceOrders = serviceOrdersByFiltersResult?.serviceOrders;
	const serviceOrdersMatched = serviceOrdersByFiltersResult?.serviceOrdersMatched || 0;
	const serviceOrdersShowing = serviceOrders?.length || 0;
	const totalPages = serviceOrdersByFiltersResult?.totalPages || 0;

	const handleOnMutate = async () => await queryClient.cancelQueries({ queryKey: ["service-orders-by-filters", filters] });
	const handleOnSettled = async () => await queryClient.invalidateQueries({ queryKey: ["service-orders-by-filters", filters] });
	return (
		<div className="grow p-6">
			<div className="flex flex-col items-center justify-between gap-2 border-b border-gray-300 p-1">
				<div className="flex w-full items-center justify-between">
					<div className="flex flex-col items-center gap-2 lg:flex-row">
						<p className="text-center text-2xl font-black uppercase text-[#15599a]">PROJETOS NO ESTÁGIO DE EXECUÇÃO</p>
					</div>
					<button
						type="button"
						onClick={() => setFilterMenusIsOpen((prev) => !prev)}
						className="rounded-full p-2 cursor-pointer bg-primary hover:bg-blue-500 hover:text-white text-primary-foreground transition-colors"
					>
						<ListFilter className="w-4 h-4 min-w-4 min-h-4" />
					</button>
				</div>
			</div>
			<ExecutionPageStats session={session} />
			<GeneralPaginationComponent
				activePage={filters.page}
				queryLoading={isLoading}
				selectPage={(page) => updateFilters({ page })}
				totalPages={totalPages || 0}
				itemsMatchedText={serviceOrdersMatched > 1 ? `${serviceOrdersMatched} ordens de serviço encontradas.` : `${serviceOrdersMatched} ordem de serviço encontrada.`}
				itemsShowingText={serviceOrdersShowing > 1 ? `Mostrando ${serviceOrdersShowing} ordens de serviço.` : `Mostrando ${serviceOrdersShowing} ordem de serviço.`}
			/>
			<div className="flex w-full flex-wrap gap-x-6 gap-y-4 justify-around">
				{isLoading ? <LoadingComponent /> : null}
				{isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
				{isSuccess ? (
					serviceOrders && serviceOrders.length > 0 ? (
						serviceOrders.map((serviceOrder) => (
							<ServiceOrderExecutionCard key={serviceOrder._id} serviceOrder={serviceOrder} handleClick={(id) => setEditServiceOrderModal({ id, isOpen: true })} />
						))
					) : (
						<div className="w-full text-center text-sm font-medium tracking-tight text-primary/80">Nenhuma ordem de serviço encontrada.</div>
					)
				) : null}
			</div>
			{editServiceOrderModal.isOpen && editServiceOrderModal.id ? (
				<ModalControlServiceOrder
					serviceOrderId={editServiceOrderModal.id}
					session={session}
					closeModal={() => setEditServiceOrderModal({ id: null, isOpen: false })}
					callbacks={{
						onMutate: handleOnMutate,
						onSettled: handleOnSettled,
					}}
				/>
			) : null}
			{filterMenusIsOpen ? <ExecutionPageFilters filters={filters} updateFilters={updateFilters} closeMenu={() => setFilterMenusIsOpen(false)} /> : null}
		</div>
	);
}

type ServiceOrderExecutionCardProps = {
	serviceOrder: TServiceOrdersByFiltersResult["serviceOrders"][0];
	handleClick: (id: string) => void;
};
function ServiceOrderExecutionCard({ serviceOrder, handleClick }: ServiceOrderExecutionCardProps) {
	const maxAccessLiberationExecutionDate = serviceOrder.projeto.homologacaoAcessoDataResposta ? dayjs(serviceOrder.projeto.homologacaoAcessoDataResposta).add(120, "day") : null;
	const daysTillMaxAccessLiberationExecution = maxAccessLiberationExecutionDate ? maxAccessLiberationExecutionDate.diff(dayjs(), "day") : null;
	function getHomologationAccessTag() {
		if (!daysTillMaxAccessLiberationExecution) return null;
		return (
			<div
				className={cn("flex w-fit items-center gap-1 self-center rounded-lg px-2 py-1", {
					"bg-red-600 text-white": daysTillMaxAccessLiberationExecution < 10,
					"bg-orange-500 text-white": daysTillMaxAccessLiberationExecution >= 10 && daysTillMaxAccessLiberationExecution < 20,
					// "bg-green-500 text-white": daysTillMaxAccessLiberationExecution >= 20,
				})}
			>
				<TbUrgent size={12} />
				<h1 className="text-[0.5rem] font-medium">
					{daysTillMaxAccessLiberationExecution < 0 ? "PARECER VENCIDO" : `${daysTillMaxAccessLiberationExecution} DIAS ATÉ O VENCIMENTO DO PARECER`}
				</h1>
			</div>
		);
	}
	return (
		<div className="w-full lg:w-[450px] flex flex-col border border-primary/20 p-3 gap-3">
			<div className="w-full flex items-center justify-between">
				<div className="flex items-center gap-1">
					<div className="rounded-lg bg-secondary px-2 py-0.5 text-center text-[0.6rem] font-bold italic text-primary/80 flex items-center gap-1 self-center">
						<Code className="w-4 h-4 min-w-4 min-h-4" />
						<p>{serviceOrder.projeto.identificador}</p>
					</div>
					<h1 className="w-full text-start text-sm font-bold leading-none tracking-tight">{serviceOrder.favorecido.nome}</h1>
				</div>
				<h1
					className={cn("rounded-lg px-2 py-0.5 text-center text-[0.5rem] font-medium text-primary-foreground bg-primary min-w-fit", {
						"bg-red-500": serviceOrder.status === "PENDENTE", // Vermelho claro
						"bg-[#757575]": serviceOrder.status === "AGUARDANDO PLANEJAMENTO", // Cinza médio
						"bg-[#42A5F5]": serviceOrder.status === "AGUARDANDO LIBERAÇÃO", // Azul suave
						"bg-[#1E90FF]": serviceOrder.status === "AGUARDANDO AGENDAMENTO", // Azul médio
						"bg-[#FF8C00]": serviceOrder.status === "AGUARDANDO EXECUÇÃO", // Laranja
						"bg-[#7B68EE]": serviceOrder.status === "EM EXECUÇÃO", // Roxo médio
						"bg-[#8BC34A]": serviceOrder.status === "CONCLUÍDA PARCIAL", // Verde claro
						"bg-green-500": serviceOrder.status === "CONCLUÍDA", // Verde vibrante
						"bg-[#D32F2F]": serviceOrder.status === "PENDÊNCIAS", // Vermelho escuro
					})}
				>
					{serviceOrder.status || "NÃO DEFINIDO"}
				</h1>
			</div>
			<div className="w-full flex flex-col grow gap-2">
				{serviceOrder.etiquetas && serviceOrder.etiquetas?.length > 0 ? (
					<div className="flex w-full flex-wrap items-center justify-start gap-2 lg:grow">
						<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80 ">ETIQUETAS</h1>
						{serviceOrder.etiquetas.map((tag, index) => (
							<div
								key={tag.id}
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
				{serviceOrder.projeto.id ? (
					<>
						<div className={cn("flex w-fit items-center gap-1 self-center rounded-lg px-2 py-1", getServiceTypeTagColor(serviceOrder.projeto.tipo || ""))}>
							<MdDashboard size={12} />
							<h1 className="text-[0.5rem] font-medium">{serviceOrder.projeto.tipo}</h1>
						</div>
						{serviceOrder.categoria === "MONTAGEM" && serviceOrder.projeto.homologacaoAcessoDataResposta ? getHomologationAccessTag() : null}
						{serviceOrder.categoria === "MONTAGEM" && serviceOrder.projeto.homologacaoVistoriaDataEfetivacao ? (
							<div className="flex w-fit items-center gap-1 self-center">
								<BsPatchCheckFill height={13} width={13} color="#22c55e " />
								<h1 className="text-[0.6rem] font-medium uppercase text-primary/80">VISTORIA FEITA</h1>
							</div>
						) : null}
						{serviceOrder.categoria === "MONTAGEM" ? (
							<div className="flex w-full flex-wrap items-center justify-around gap-2">
								<div className="flex items-center gap-1">
									<FaRegHourglass height={13} width={13} />
									<h1 className="text-[0.6rem] font-medium uppercase text-primary/80">
										{serviceOrder.projeto.compraDataPagamento
											? `${getFormattedTextFromHoursAmount({
													hours: getHoursDiff({ start: serviceOrder.projeto.compraDataPagamento, finish: new Date() }),
													reference: "auto",
													onlyComplete: false,
												})} DESDE PAGAMENTO`
											: "NÃO PAGO"}
									</h1>
								</div>
								<div className="flex items-center gap-1">
									<FaRegHourglass height={13} width={13} />
									<h1 className="text-[0.6rem] font-medium uppercase text-primary/80">
										{serviceOrder.projeto.compraEntregaDataEfetivacao
											? `${getFormattedTextFromHoursAmount({
													hours: getHoursDiff({ start: serviceOrder.projeto.compraEntregaDataEfetivacao, finish: new Date() }),
													reference: "auto",
													onlyComplete: false,
												})} DESDE ENTREGA`
											: "NÃO ENTREGUE"}
									</h1>
								</div>
							</div>
						) : null}
					</>
				) : null}
				<div className="flex w-full flex-wrap items-center justify-around gap-2">
					<div className="flex items-center gap-1">
						<FaLocationDot height={13} width={13} />
						<h1 className="text-[0.6rem] font-medium text-primary/80">
							{serviceOrder.localizacao.cidade} ({serviceOrder.localizacao.uf})
						</h1>
					</div>
					<div className="flex items-center gap-1">
						<UserRound size={12} />
						<h1 className="text-[0.6rem] font-medium text-primary/80">{serviceOrder.responsavel.nome}</h1>
					</div>
				</div>
				<div className="flex w-full flex-wrap items-center justify-around gap-2">
					<div className="flex items-center gap-1">
						<FaSolarPanel height={13} width={13} />
						<h1 className="text-[0.6rem] font-medium text-primary/80">{serviceOrder.equipamentos.modulos.qtde || 0} MÓDULOS</h1>
					</div>
					<div className="flex items-center gap-1">
						<MdRoofing height={13} width={13} />
						<h1 className="text-[0.6rem] font-medium text-primary/80">{serviceOrder.detalhes.tipoTelha ? `TELHA ${serviceOrder.detalhes.tipoTelha}` : "N/A"}</h1>
					</div>
				</div>
				<div className="flex w-full flex-wrap items-center justify-around gap-2">
					<div className="flex items-center gap-1">
						<h1 className="text-[0.6rem] font-medium text-primary/80">AGENDAMENTO</h1>
						<BsCalendar width={12} height={12} />
						<h1 className="text-[0.6rem] font-medium text-primary/80">
							{serviceOrder.agendamento
								? `${formatDateAsLocale(serviceOrder.agendamento.inicio, true)} - ${serviceOrder.agendamento.fim ? formatDateAsLocale(serviceOrder.agendamento.fim, true) : "N/A"}`
								: "N/A"}
						</h1>
					</div>
				</div>
			</div>
			<div className="flex w-full items-center justify-between gap-2">
				<div className="flex grow flex-wrap items-center gap-2">
					<div className="flex items-center gap-1">
						<Avatar url={serviceOrder.autor?.avatar_url || undefined} fallback={formatNameAsInitials(serviceOrder.autor?.nome || "")} height={18} width={18} />
						<p className="text-[0.65rem] font-light text-primary/80">{serviceOrder.autor?.nome || ""}</p>
					</div>
					<div className="flex items-center gap-2">
						<div className="flex min-w-fit items-center gap-1">
							<BsCalendarPlus />
							<p className={"text-[0.65rem] font-medium text-primary/80"}>{formatDateAsLocale(serviceOrder.dataInsercao, true)}</p>
						</div>
						{serviceOrder.dataEfetivacao ? (
							<div className="flex items-center gap-1">
								<BsCalendarCheck color="#22c55e" />
								<p className="text-[0.65rem] font-medium text-primary/80">{formatDateAsLocale(serviceOrder.dataEfetivacao, true)}</p>
							</div>
						) : null}
					</div>
				</div>
				<button type="button" onClick={() => handleClick(serviceOrder._id)} className="flex items-center gap-1 rounded-lg bg-primary px-2 py-1 text-[0.6rem] text-secondary">
					<Pencil width={10} height={10} />
					<p>EDITAR</p>
				</button>
			</div>
		</div>
	);
}
