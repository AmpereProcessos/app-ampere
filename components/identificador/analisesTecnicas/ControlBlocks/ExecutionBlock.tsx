import CheckboxInput from "@/components/inputs/Checkbox";
import TextInput from "@/components/inputs/Text";
import ErrorComponent from "@/components/utils/ErrorComponent";
import LoadingComponent from "@/components/utils/LoadingComponent";
import { cn } from "@/lib/utils";
import { formatNameAsInitials } from "@/utils/methods/formatting";
import { formatDateAsLocale } from "@/utils/methods/formatting";
import { useMutationWithFeedback } from "@/utils/methods/mutation/general-hook";
import { handleTechnicalAnalysisServiceOrderTrigger } from "@/utils/methods/mutation/triggers";
import { useServiceOrdersByTechnicalAnalysis } from "@/utils/methods/query/service-orders";
import type { TServiceOrderSimplifiedDTO } from "@/utils/schemas/service-order";
import type { TTechnicalAnalysisDTO } from "@/utils/schemas/technical-analysis";
import { BsCalendarCheck, BsCalendarPlus } from "react-icons/bs";
import { useQueryClient } from "@tanstack/react-query";
import { Pencil, Tag, UserRound } from "lucide-react";
import { BsCalendar, BsCheck2All } from "react-icons/bs";
import { BsCheck2 } from "react-icons/bs";
import React, { useState, type Dispatch, type SetStateAction } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { MdDashboard, MdDesignServices } from "react-icons/md";
import Avatar from "@/components/utils/Avatar";
import ModalControlServiceOrder from "../../ordensDeServico/modals/ModalControlServiceOrder";
import type { Session } from "next-auth";
type ExecutionBlockProps = {
	session: Session;
	infoHolder: TTechnicalAnalysisDTO;
	setInfoHolder: Dispatch<SetStateAction<TTechnicalAnalysisDTO>>;
	changes: object;
	setChanges: Dispatch<SetStateAction<object>>;
};
function ExecutionBlock({ session, infoHolder, setInfoHolder, changes, setChanges }: ExecutionBlockProps) {
	return (
		<div className="mt-4 flex w-full flex-col">
			<div className="flex w-full items-center justify-center gap-2 rounded-md bg-gray-800 p-2">
				<h1 className="font-bold text-white">INFORMAÇÕES DE EXECUÇÃO</h1>
			</div>
			<div className="mt-2 flex w-full flex-col gap-2">
				<div className="flex w-full flex-col">
					<h1 className="w-full rounded-tl-sm rounded-tr-sm bg-gray-500 p-1 text-center font-bold text-white">OBSERVAÇÕES</h1>
					<textarea
						placeholder="SEM OBSERVAÇÕES PREENCHIDAS..."
						value={infoHolder.execucao?.observacoes || ""}
						onChange={(e) => {
							setInfoHolder((prev) => ({
								...prev,
								execucao: prev.execucao ? { ...prev.execucao, observacoes: e.target.value } : { observacoes: e.target.value, itens: [], espacoQGBT: false },
							}));
							setChanges((prev) => ({ ...prev, "execucao.observacoes": e.target.value }));
						}}
						className="min-h-[80px] w-full resize-none rounded-bl-sm rounded-br-sm bg-gray-100 p-3 text-center text-xs font-medium text-gray-600 outline-none"
					/>
				</div>
				<div className="flex w-full items-center justify-center self-center lg:w-1/3">
					<CheckboxInput
						labelFalse="POSSUI ESPAÇO NO QGBT"
						labelTrue="POSSUI ESPAÇO NO QGBT"
						justify="justify-center"
						checked={infoHolder.execucao.espacoQGBT}
						handleChange={(value) => {
							setInfoHolder((prev) => ({ ...prev, execucao: { ...prev.execucao, espacoQGBT: value } }));
							setChanges((prev) => ({ ...prev, "execucao.espacoQGBT": value }));
						}}
					/>
				</div>
				<div className="flex w-full flex-col gap-2 lg:flex-row">
					<div className="w-full lg:w-1/3">
						<TextInput
							label="LOCAL DE ATERRAMENTO"
							placeholder="Preencha o local de aterramento..."
							value={infoHolder.locais.aterramento || ""}
							handleChange={(value) => {
								setInfoHolder((prev) => ({ ...prev, locais: { ...prev.locais, aterramento: value } }));
								setChanges((prev) => ({ ...prev, "locais.aterramento": value }));
							}}
							width={"100%"}
						/>
					</div>
					<div className="w-full lg:w-1/3">
						<TextInput
							label="LOCAL DE INSTALAÇÃO DO(S) INVERSOR(ES)"
							placeholder="Preencha o local de instalação do(s) inversor(es)..."
							value={infoHolder.locais.inversor || ""}
							handleChange={(value) => {
								setInfoHolder((prev) => ({ ...prev, locais: { ...prev.locais, inversor: value } }));
								setChanges((prev) => ({ ...prev, "locais.inversor": value }));
							}}
							width={"100%"}
						/>
					</div>
					<div className="w-full lg:w-1/3">
						<TextInput
							label="LOCAL DE INSTALAÇÃO DOS MÓDULOS"
							placeholder="Preencha o local de instalação dos módulos..."
							value={infoHolder.locais.modulos || ""}
							handleChange={(value) => {
								setInfoHolder((prev) => ({ ...prev, locais: { ...prev.locais, modulos: value } }));
								setChanges((prev) => ({ ...prev, "locais.modulos": value }));
							}}
							width={"100%"}
						/>
					</div>
				</div>
				<div className="flex w-full flex-col gap-2 lg:flex-row">
					<div className="w-full lg:w-1/3">
						<TextInput
							label="DISTANCIA DO CABEAMENTO CA"
							placeholder="Preencha a distância para cabeamento CA..."
							value={infoHolder.distancias.cabeamentoCA || ""}
							handleChange={(value) => {
								setInfoHolder((prev) => ({ ...prev, distancias: { ...prev.distancias, cabeamentoCA: value } }));
								setChanges((prev) => ({ ...prev, "distancias.cabeamentoCA": value }));
							}}
							width={"100%"}
						/>
					</div>
					<div className="w-full lg:w-1/3">
						<TextInput
							label="DISTANCIA DO CABEAMENTO CC"
							placeholder="Preencha a distância para cabeamento CC.."
							value={infoHolder.distancias.cabeamentoCC || ""}
							handleChange={(value) => {
								setInfoHolder((prev) => ({ ...prev, distancias: { ...prev.distancias, cabeamentoCC: value } }));
								setChanges((prev) => ({ ...prev, "distancias.cabeamentoCC": value }));
							}}
							width={"100%"}
						/>
					</div>
					<div className="w-full lg:w-1/3">
						<TextInput
							label="DISTÂNCIA ATÉ O ROTEADOR"
							placeholder="Preencha a distância do comunicador ao roteador..."
							value={infoHolder.distancias.conexaoInternet || ""}
							handleChange={(value) => {
								setInfoHolder((prev) => ({ ...prev, distancias: { ...prev.distancias, conexaoInternet: value } }));
								setChanges((prev) => ({ ...prev, "distancias.conexaoInternet": value }));
							}}
							width={"100%"}
						/>
					</div>
				</div>
				<TechnicalAnalysisServiceOrders session={session} technicalAnalysisMainServiceOrderId={infoHolder.idOrdemServico} technicalAnalysisId={infoHolder._id} />
			</div>
		</div>
	);
}

export default ExecutionBlock;

type TechnicalAnalysisServiceOrdersProps = {
	session: Session;
	technicalAnalysisMainServiceOrderId: string | null | undefined;
	technicalAnalysisId: string;
};
function TechnicalAnalysisServiceOrders({ session, technicalAnalysisMainServiceOrderId, technicalAnalysisId }: TechnicalAnalysisServiceOrdersProps) {
	const queryClient = useQueryClient();
	const { data: serviceOrders, isLoading, isError, isSuccess, error } = useServiceOrdersByTechnicalAnalysis({ technicalAnalysisId });
	const [editServiceOrderModal, setEditServiceOrderModal] = useState<{ id: string; isOpen: boolean }>({ id: "", isOpen: false });
	const { mutate: mutateProjectServiceOrderTrigger, isPending } = useMutationWithFeedback({
		mutationKey: ["create-project-main-service-order"],
		mutationFn: handleTechnicalAnalysisServiceOrderTrigger,
		affectedQueryKey: ["service-orders-by-technical-analysis", technicalAnalysisId],
		queryClient: queryClient,
	});
	return (
		<div className="w-full flex flex-col gap-2">
			<h1 className="w-full text-start font-medium">ORDENS DE SERVIÇO</h1>
			<div className="flex w-full items-center justify-end">
				{!technicalAnalysisMainServiceOrderId ? (
					<button
						type="button"
						onClick={() =>
							mutateProjectServiceOrderTrigger({
								technicalAnalysisId,
							})
						}
						disabled={isPending}
						className={cn(
							"flex items-center gap-1 rounded-lg bg-blue-500 px-2 py-1 text-white duration-300 ease-in-out disabled:bg-gray-500 disabled:text-gray-300 enabled:hover:bg-blue-600",
						)}
					>
						<MdDesignServices />
						<h1 className="text-xs font-medium tracking-tight">GERAR ORDEM DE SERVIÇO DA ANÁLISE</h1>
					</button>
				) : null}
			</div>
			{isLoading ? <LoadingComponent /> : null}
			{isError ? <ErrorComponent msg={"Erro ao buscar informações das ordens de serviço."} /> : null}
			{isSuccess ? (
				serviceOrders.length > 0 ? (
					serviceOrders.map((serviceOrder) => (
						<ServiceOrderCard key={serviceOrder._id} serviceOrder={serviceOrder} handleClick={(id) => setEditServiceOrderModal({ id, isOpen: true })} />
					))
				) : (
					<div className="w-full text-center text-sm font-medium tracking-tight text-primary/80">Nenhuma ordem de serviço encontrada.</div>
				)
			) : null}
			{editServiceOrderModal.isOpen && editServiceOrderModal.id ? (
				<ModalControlServiceOrder serviceOrderId={editServiceOrderModal.id} session={session} closeModal={() => setEditServiceOrderModal({ id: "", isOpen: false })} />
			) : null}
		</div>
	);
}

type ServiceOrderCardProps = {
	serviceOrder: TServiceOrderSimplifiedDTO;
	handleClick: (id: string) => void;
};
function ServiceOrderCard({ serviceOrder, handleClick }: ServiceOrderCardProps) {
	function getStatusTag(serviceOrder: TServiceOrderSimplifiedDTO) {
		if (serviceOrder.status === "PENDENTE") return <div className="rounded-full bg-red-600 px-2 py-0.5 text-[0.5rem] font-medium text-white">PENDENTE</div>;

		if (serviceOrder.status === "AGUARDANDO PLANEJAMENTO")
			return <div className="rounded-full bg-blue-800 px-2 py-0.5 text-[0.5rem] font-medium text-white">AGUARDANDO PLANEJAMENTO</div>;

		if (serviceOrder.status === "AGUARDANDO AGENDAMENTO") return <div className="rounded-full bg-yellow-600 px-2 py-0.5 text-[0.5rem] font-medium text-white">AGENDADA</div>;

		if (serviceOrder.status === "EM EXECUÇÃO") return <div className="rounded-full bg-blue-600 px-2 py-0.5 text-[0.5rem] font-medium text-white">EM EXECUÇÃO</div>;

		if (serviceOrder.status === "CONCLUÍDA PARCIAL") return <div className="rounded-full bg-purple-600 px-2 py-0.5 text-[0.5rem] font-medium text-white">CONCLUÍDA PARCIAL</div>;

		if (serviceOrder.status === "CONCLUÍDA") return <h1 className="min-w-fit rounded-lg bg-green-500 px-2 py-0.5 text-[0.5rem] text-white">CONCLUÍDA</h1>;

		if (serviceOrder.status === "CANCELADA") return <h1 className="min-w-fit rounded-lg bg-gray-500 px-2 py-0.5 text-[0.5rem] text-white">CANCELADA</h1>;

		return <h1 className="min-w-fit rounded-lg bg-primary px-2 py-0.5 text-[0.5rem] text-white">NÃO DEFINIDO</h1>;
	}
	return (
		<div className="flex w-full flex-col gap-1 rounded border border-primary bg-[#fff] p-2 shadow-sm dark:bg-[#121212]">
			<div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
				<div className="flex flex-wrap items-center gap-2">
					<p className="text-sm font-bold leading-none tracking-tight">{serviceOrder.descricao}</p>
					{serviceOrder.projeto.nome ? (
						<div className="flex items-center gap-1">
							<MdDashboard size={10} />
							<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">{serviceOrder.projeto.nome}</h1>
						</div>
					) : null}
					{getStatusTag(serviceOrder)}
				</div>
				<div className="flex items-center gap-1">
					<UserRound size={12} />
					<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">{serviceOrder.responsavel.nome}</h1>
				</div>
			</div>
			<div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
				<div className="flex w-full flex-wrap items-center justify-center gap-2 lg:grow lg:justify-start">
					<div className="flex items-center gap-1">
						<Tag size={10} />
						<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">{serviceOrder.categoria}</h1>
					</div>
					<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80 ">ETIQUETAS</h1>
					{serviceOrder.etiquetas && serviceOrder.etiquetas?.length > 0 ? (
						serviceOrder.etiquetas.map((tag, index) => (
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
								<h1 className="text-[0.5rem] font-bold tracking-tight">{tag.titulo}</h1>
							</div>
						))
					) : (
						<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80 ">NÃO DEFINIDAS</h1>
					)}
				</div>
				<div className="flex w-full flex-wrap items-center justify-center gap-2 lg:min-w-fit lg:justify-end">
					<div className="flex items-center gap-1">
						<FaLocationDot width={10} height={10} />
						<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">LOCALIZAÇÃO</h1>
						<h1 className="py-0.5 text-center text-[0.6rem] font-bold  text-primary">
							{serviceOrder.localizacao.cidade} ({serviceOrder.localizacao.uf})
						</h1>
					</div>
					<div className="flex items-center gap-1">
						<BsCheck2 width={10} height={10} />
						<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">PREVISÃO DE LIBERAÇÃO</h1>
						<h1 className="py-0.5 text-center text-[0.6rem] font-bold  text-primary">
							{serviceOrder.dataPrevisaoLiberacao ? formatDateAsLocale(serviceOrder.dataPrevisaoLiberacao) : "N/A"}
						</h1>
					</div>
					<div className="flex items-center gap-1">
						<BsCheck2All width={10} height={10} />
						<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">LIBERAÇÃO</h1>
						<h1 className="py-0.5 text-center text-[0.6rem] font-bold  text-primary">{serviceOrder.dataLiberacao ? formatDateAsLocale(serviceOrder.dataLiberacao) : "N/A"}</h1>
					</div>
					<div className="flex items-center gap-1">
						<BsCalendar width={10} height={10} />
						<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">AGENDAMENTO</h1>
						<h1 className="py-0.5 text-center text-[0.6rem] font-bold  text-primary">
							{serviceOrder.agendamento
								? `${formatDateAsLocale(serviceOrder.agendamento.inicio, true)} - ${serviceOrder.agendamento.fim ? formatDateAsLocale(serviceOrder.agendamento.fim, true) : "N/A"}`
								: "N/A"}
						</h1>
					</div>
					<div className="flex items-center gap-1">
						<BsCalendarCheck width={10} height={10} />
						<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">EXECUÇÃO</h1>
						<h1 className="py-0.5 text-center text-[0.6rem] font-bold  text-primary">
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
						<p className="text-[0.65rem] font-medium text-primary/80">{formatDateAsLocale(serviceOrder.dataInsercao, true)}</p>
					</div>
					{serviceOrder.dataEfetivacao ? (
						<div className="flex items-center gap-1">
							<BsCalendarCheck color="#22c55e" />
							<p className="text-[0.65rem] font-medium text-primary/80">{formatDateAsLocale(serviceOrder.dataEfetivacao, true)}</p>
						</div>
					) : null}
					<div className="flex items-center gap-1">
						<Avatar url={serviceOrder.autor?.avatar_url || undefined} width={20} height={20} fallback={formatNameAsInitials(serviceOrder.autor?.nome || "")} />

						<p className="text-[0.65rem] font-medium text-primary/80">{serviceOrder.autor?.nome || ""}</p>
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
