import { getServiceTypeTagColor } from "@/components/TagTipoDeServico";
import Avatar from "@/components/utils/Avatar";
import ErrorComponent from "@/components/utils/ErrorComponent";
import LoadingComponent from "@/components/utils/LoadingComponent";
import GeneralPaginationComponent from "@/components/utils/Pagination";
import type { TAuthSession } from "@/lib/authentication/types";
import { cn } from "@/lib/utils";
import type { TServiceOrdersByFiltersResult } from "@/pages/api/ordensDeServico/search";
import { getHoursDiff } from "@/utils/methods/dates";
import { getFormattedTextFromHoursAmount } from "@/utils/methods/dates";
import { formatNameAsInitials } from "@/utils/methods/formatting";
import { formatDateAsLocale } from "@/utils/methods/formatting";
import { getErrorMessage } from "@/utils/methods/handlers";
import { useServiceOrdersByPersonalizedFilters } from "@/utils/methods/query/service-orders";
import type { TPersonalizedServiceOrderFilter } from "@/utils/schemas/service-order";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Code, Pencil, Tag, UserRound, X } from "lucide-react";
import { ListFilter } from "lucide-react";
import { useState } from "react";
import { BsCalendar, BsCalendarCheck, BsCalendarPlus, BsPatchCheckFill } from "react-icons/bs";
import { FaRegHourglass, FaSolarPanel } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import { MdDashboard, MdRoofing } from "react-icons/md";
import { TbUrgent } from "react-icons/tb";
import ModalControlServiceOrder from "../ordensDeServico/modals/ModalControlServiceOrder";
import ExecutionPageFilters from "./ExecutionPageFilters";
import ExecutionPageStats from "./ExecutionPageStats";
type ExecutionPageProps = {
	session: TAuthSession;
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
		<div className="grow p-6 flex flex-col gap-4">
			<div className="border-primary/20 flex flex-col items-center justify-between gap-2 border-b p-1">
				<div className="flex w-full items-center justify-between">
					<div className="flex flex-col items-center gap-2 lg:flex-row">
						<p className="text-center text-2xl font-black text-[#15599a] uppercase">PROJETOS NO ESTÁGIO DE EXECUÇÃO</p>
					</div>
					<button
						type="button"
						onClick={() => setFilterMenusIsOpen((prev) => !prev)}
						className="bg-primary text-primary-foreground cursor-pointer rounded-full p-2 transition-colors hover:bg-blue-500 hover:text-white"
					>
						<ListFilter className="h-4 min-h-4 w-4 min-w-4" />
					</button>
				</div>
			</div>
			<ExecutionPageFiltersShowcase filters={filters} updateFilters={updateFilters} />
			<ExecutionPageStats session={session} />
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
			<div className="flex w-full flex-wrap justify-around gap-x-6 gap-y-4">
				{isLoading ? <LoadingComponent /> : null}
				{isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
				{isSuccess ? (
					serviceOrders && serviceOrders.length > 0 ? (
						serviceOrders.map((serviceOrder) => (
							<ServiceOrderExecutionCard
								key={serviceOrder._id}
								serviceOrder={serviceOrder}
								handleClick={(id) => setEditServiceOrderModal({ id, isOpen: true })}
							/>
						))
					) : (
						<div className="text-primary/80 w-full text-center text-sm font-medium tracking-tight">Nenhuma ordem de serviço encontrada.</div>
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
	const maxAccessLiberationExecutionDate = serviceOrder.projeto.homologacaoAcessoDataResposta
		? dayjs(serviceOrder.projeto.homologacaoAcessoDataResposta).add(120, "day")
		: null;
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
				<h1 className="text-xxs font-medium">
					{daysTillMaxAccessLiberationExecution < 0 ? "PARECER VENCIDO" : `${daysTillMaxAccessLiberationExecution} DIAS ATÉ O VENCIMENTO DO PARECER`}
				</h1>
			</div>
		);
	}
	return (
		<div className="border-primary/20 flex w-full flex-col gap-3 border p-3 lg:w-[450px]">
			<div className="flex w-full items-center justify-between">
				<div className="flex items-center gap-1">
					<div className="bg-secondary text-primary/80 flex items-center gap-1 self-center rounded-lg px-2 py-0.5 text-center text-[0.6rem] font-bold italic">
						<Code className="h-4 min-h-4 w-4 min-w-4" />
						<p>{serviceOrder.projeto.identificador}</p>
					</div>
					<h1 className="w-full text-start text-sm leading-none font-bold tracking-tight">{serviceOrder.favorecido.nome}</h1>
				</div>
				<h1
					className={cn("bg-primary text-primary-foreground min-w-fit rounded-lg px-2 py-0.5 text-center text-[0.5rem] font-medium", {
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
			<div className="flex w-full grow flex-col gap-2">
				{serviceOrder.etiquetas && serviceOrder.etiquetas?.length > 0 ? (
					<div className="flex w-full flex-wrap items-center justify-start gap-2 lg:grow">
						<h1 className="text-primary/80 py-0.5 text-center text-[0.6rem] font-medium italic">ETIQUETAS</h1>
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
								<h1 className="text-xxs font-bold tracking-tight">{tag.titulo}</h1>
							</div>
						))}
					</div>
				) : null}
				{serviceOrder.projeto.id ? (
					<>
						<div className={cn("flex w-fit items-center gap-1 self-center rounded-lg px-2 py-1", getServiceTypeTagColor(serviceOrder.projeto.tipo || ""))}>
							<MdDashboard size={12} />
							<h1 className="text-xxs font-medium">{serviceOrder.projeto.tipo}</h1>
						</div>
						{serviceOrder.categoria === "MONTAGEM" && serviceOrder.projeto.homologacaoAcessoDataResposta ? getHomologationAccessTag() : null}
						{serviceOrder.categoria === "MONTAGEM" && serviceOrder.projeto.homologacaoVistoriaDataEfetivacao ? (
							<div className="flex w-fit items-center gap-1 self-center">
								<BsPatchCheckFill height={13} width={13} color="#22c55e " />
								<h1 className="text-primary/80 text-[0.6rem] font-medium uppercase">VISTORIA FEITA</h1>
							</div>
						) : null}
						{serviceOrder.categoria === "MONTAGEM" ? (
							<div className="flex w-full flex-wrap items-center justify-around gap-2">
								<div className="flex items-center gap-1">
									<FaRegHourglass height={13} width={13} />
									<h1 className="text-primary/80 text-[0.6rem] font-medium uppercase">
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
									<h1 className="text-primary/80 text-[0.6rem] font-medium uppercase">
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
						<h1 className="text-primary/80 text-[0.6rem] font-medium">
							{serviceOrder.localizacao.cidade} ({serviceOrder.localizacao.uf})
						</h1>
					</div>
					<div className="flex items-center gap-1">
						<UserRound size={12} />
						<h1 className="text-primary/80 text-[0.6rem] font-medium">{serviceOrder.responsavel.nome}</h1>
					</div>
				</div>
				<div className="flex w-full flex-wrap items-center justify-around gap-2">
					<div className="flex items-center gap-1">
						<FaSolarPanel height={13} width={13} />
						<h1 className="text-primary/80 text-[0.6rem] font-medium">{serviceOrder.equipamentos.modulos.qtde || 0} MÓDULOS</h1>
					</div>
					<div className="flex items-center gap-1">
						<MdRoofing height={13} width={13} />
						<h1 className="text-primary/80 text-[0.6rem] font-medium">
							{serviceOrder.detalhes.tipoTelha ? `TELHA ${serviceOrder.detalhes.tipoTelha}` : "N/A"}
						</h1>
					</div>
				</div>
				<div className="flex w-full flex-wrap items-center justify-around gap-2">
					<div className="flex items-center gap-1">
						<h1 className="text-primary/80 text-[0.6rem] font-medium">AGENDAMENTO</h1>
						<BsCalendar width={12} height={12} />
						<h1 className="text-primary/80 text-[0.6rem] font-medium">
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
						<Avatar
							url={serviceOrder.autor?.avatar_url || undefined}
							fallback={formatNameAsInitials(serviceOrder.autor?.nome || "")}
							height={18}
							width={18}
						/>
						<p className="text-primary/80 text-[0.65rem] font-light">{serviceOrder.autor?.nome || ""}</p>
					</div>
					<div className="flex items-center gap-2">
						<div className="flex min-w-fit items-center gap-1">
							<BsCalendarPlus />
							<p className={"text-primary/80 text-[0.65rem] font-medium"}>{formatDateAsLocale(serviceOrder.dataInsercao, true)}</p>
						</div>
						{serviceOrder.dataEfetivacao ? (
							<div className="flex items-center gap-1">
								<BsCalendarCheck color="#22c55e" />
								<p className="text-primary/80 text-[0.65rem] font-medium">{formatDateAsLocale(serviceOrder.dataEfetivacao, true)}</p>
							</div>
						) : null}
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

type ExecutionPageFiltersShowcase = {
	filters: TPersonalizedServiceOrderFilter;
	updateFilters: (filters: Partial<TPersonalizedServiceOrderFilter>) => void;
};
function ExecutionPageFiltersShowcase({ filters, updateFilters }: ExecutionPageFiltersShowcase) {
	const FilterTag = ({ label, value, onRemove }: { label: string; value: string; onRemove?: () => void }) => (
		<div className="bg-secondary flex items-center gap-1 rounded-lg px-2 py-1 text-[0.65rem]">
			<p className="text-primary/80">
				{label}: <strong>{value}</strong>
			</p>
			{onRemove && (
				<button type="button" onClick={onRemove} className="text-primary hover:bg-primary/20 rounded-lg bg-transparent p-1">
					<X size={12} />
				</button>
			)}
		</div>
	);
	const PERIOD_MAP = {
		dataInsercao: "DATA DE INSERÇÃO",
		dataPrevisaoLiberacao: "DATA DE PREVISÃO DE LIBERAÇÃO",
		dataLiberacao: "DATA DE LIBERAÇÃO",
		dataEfetivacao: "DATA DE EFETIVAÇÃO",
		"periodo.inicio": "DATA DE INÍCIO DO SERVIÇO",
		"periodo.fim": "DATA DE FIM DO SERVIÇO",
		"projeto.contratoDataAssinatura": "DATA DE ASSINATURA DO CONTRATO",
		"projeto.compraDataPagamento": "DATA DE PAGAMENTO DA COMPRA",
		"projeto.compraEntregaDataPrevisao": "DATA DE PREVISÃO DE ENTREGA DA COMPRA",
		"projeto.compraEntregaDataEfetivacao": "DATA DE EFETIVAÇÃO DA ENTREGA DA COMPRA",
		"projeto.homologacaoAcessoDataResposta": "DATA DE RESPOSTA DA HOMOLOGACAO DE ACESSO",
		"projeto.homologacaoVistoriaDataEfetivacao": "DATA DE EFETIVAÇÃO DA VISTORIA",
	};
	return (
		<div className="flex w-full flex-wrap items-center justify-center gap-2 lg:justify-end">
			<h1 className="text-[0.65rem] font-medium tracking-tight uppercase">FILTROS APLICADOS</h1>
			{filters.orderBy.direction && filters.orderBy.field ? (
				<FilterTag
					label="ORDEM"
					value={`${filters.orderBy.direction === "asc" ? "CRESCENTE" : "DECRESCENTE"} - ${PERIOD_MAP[filters.orderBy.field]}`}
					onRemove={() => updateFilters({ orderBy: { direction: null, field: null } })}
				/>
			) : null}
			{filters.name && filters.name.trim().length > 0 ? (
				<FilterTag label="NOME" value={filters.name} onRemove={() => updateFilters({ name: "" })} />
			) : null}

			{filters.responsible && filters.responsible.trim().length > 0 ? (
				<FilterTag label="RESPONSÁVEL" value={filters.responsible} onRemove={() => updateFilters({ responsible: "" })} />
			) : null}

			{filters.tags && filters.tags.length > 0 ? (
				<FilterTag label="TAGS" value={filters.tags.join(", ")} onRemove={() => updateFilters({ tags: [] })} />
			) : null}

			{filters.city && filters.city.length > 0 ? (
				<FilterTag label="CIDADE" value={filters.city.join(", ")} onRemove={() => updateFilters({ city: [] })} />
			) : null}
			{filters.state && filters.state.length > 0 ? (
				<FilterTag label="ESTADO" value={filters.state.join(", ")} onRemove={() => updateFilters({ state: [] })} />
			) : null}
			{filters.category && filters.category.length > 0 ? (
				<FilterTag label="CATEGORIA" value={filters.category.join(", ")} onRemove={() => updateFilters({ category: [] })} />
			) : null}
			{filters.urgency && filters.urgency.length > 0 ? (
				<FilterTag label="URGENCIA" value={filters.urgency.join(", ")} onRemove={() => updateFilters({ urgency: [] })} />
			) : null}
			{filters.authors && filters.authors.length > 0 ? (
				<FilterTag label="AUTORES" value={filters.authors.join(", ")} onRemove={() => updateFilters({ authors: [] })} />
			) : null}
			{filters.topologies && filters.topologies.length > 0 ? (
				<FilterTag label="TOPOLOGIAS" value={filters.topologies.join(", ")} onRemove={() => updateFilters({ topologies: [] })} />
			) : null}
			{filters.roofTypes && filters.roofTypes.length > 0 ? (
				<FilterTag label="TIPOS DE TELHA" value={filters.roofTypes.join(", ")} onRemove={() => updateFilters({ roofTypes: [] })} />
			) : null}
			{filters.projectEquipmentDelivered ? (
				<FilterTag label="EQUIPAMENTO ENTREGUE" value="EQUIPAMENTO ENTREGUE" onRemove={() => updateFilters({ projectEquipmentDelivered: false })} />
			) : null}
			{filters.projectEquipmentNotDelivered ? (
				<FilterTag
					label="EQUIPAMENTO NÃO ENTREGUE"
					value="EQUIPAMENTO NÃO ENTREGUE"
					onRemove={() => updateFilters({ projectEquipmentNotDelivered: false })}
				/>
			) : null}
			{filters.pending ? <FilterTag label="SOMENTE EM ABERTO" value="SOMENTE EM ABERTO" onRemove={() => updateFilters({ pending: false })} /> : null}
			{filters.released ? <FilterTag label="SOMENTE LIBERADAS" value="SOMENTE LIBERADAS" onRemove={() => updateFilters({ released: false })} /> : null}
			{filters.notReleased ? (
				<FilterTag label="SOMENTE NÃO LIBERADAS" value="SOMENTE NÃO LIBERADAS" onRemove={() => updateFilters({ notReleased: false })} />
			) : null}
			{filters.missingObservations ? (
				<FilterTag
					label="SOMENTE COM OBSERVAÇÕES AUSENTES"
					value="SOMENTE COM OBSERVAÇÕES AUSENTES"
					onRemove={() => updateFilters({ missingObservations: false })}
				/>
			) : null}
			{filters.period?.after && filters.period?.before && filters.period?.field ? (
				<FilterTag
					label="PERÍODO"
					value={`${PERIOD_MAP[filters.period?.field]} ${formatDateAsLocale(filters.period?.after)} a ${formatDateAsLocale(filters.period?.before)}`}
					onRemove={() => updateFilters({ period: { field: null, after: null, before: null } })}
				/>
			) : null}
		</div>
	);
}
