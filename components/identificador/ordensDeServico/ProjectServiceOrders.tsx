import React, { useState } from "react";
import { useProjectServiceOrders } from "../../../utils/methods/query/service-orders";
import LoadingPage from "../../utils/LoadingPage";
import ModalOrdemServico from "../../ModalOrdemServico";
import type { TProject } from "@/utils/schemas/projects";
import ErrorComponent from "@/components/utils/ErrorComponent";
import { getErrorMessage } from "@/utils/methods/handlers";
import type { TServiceOrderSimplifiedDTO } from "@/utils/schemas/service-order";
import { MdDashboard, MdDesignServices } from "react-icons/md";
import { Pencil } from "lucide-react";
import { formatNameAsInitials } from "@/utils/methods/formatting";
import Avatar from "@/components/utils/Avatar";
import { BsCalendarCheck, BsCalendarPlus } from "react-icons/bs";
import { Tag } from "lucide-react";
import { UserRound } from "lucide-react";
import { BsCheck2All } from "react-icons/bs";
import { BsCalendar } from "react-icons/bs";
import { FaLocationDot } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import { BsCheck2 } from "react-icons/bs";
import { formatDateAsLocale } from "@/utils/methods/formatting";
import { useMutationWithFeedback } from "@/utils/methods/mutation/general-hook";
import { useQueryClient } from "@tanstack/react-query";
import { handleProjectServiceOrderTrigger } from "@/utils/methods/mutation/triggers";
import ModalControlServiceOrder from "./modals/ModalControlServiceOrder";
import type { Session } from "next-auth";
import ModalNewServiceOrder from "./modals/ModalNewServiceOrder";
type ProjectServiceOrdersProps = {
	session: Session;
	projectId: string;
	projectMainServiceOrderId: TProject["idOrdemServico"];
};
function ProjectServiceOrders({ session, projectId, projectMainServiceOrderId }: ProjectServiceOrdersProps) {
	const queryClient = useQueryClient();
	const [newServiceOrderModalIsOpen, setNewServiceOrderModalIsOpen] = useState(false);
	const [editServiceOrder, setEditServiceOrder] = useState({ id: null as string | null, isOpen: false });
	const { data: orders, isLoading, isSuccess, isError, error } = useProjectServiceOrders({ projectId });

	const { mutate: mutateProjectServiceOrderTrigger, isPending } = useMutationWithFeedback({
		mutationKey: ["create-project-main-service-order"],
		mutationFn: handleProjectServiceOrderTrigger,
		affectedQueryKey: ["project-service-orders", projectId],
		queryClient: queryClient,
	});
	const handleMutate = async () => {
		await queryClient.cancelQueries({ queryKey: ["project-service-orders", projectId] });
		await queryClient.cancelQueries({ queryKey: ["project-by-id", projectId] });
	};
	const handleSettled = async () => {
		await queryClient.invalidateQueries({ queryKey: ["project-service-orders", projectId] });
		await queryClient.invalidateQueries({ queryKey: ["project-by-id", projectId] });
	};
	return (
		<div className="my-2 flex w-full flex-col gap-3">
			<span className="mb-2 w-full rounded-tr-md rounded-tl-md bg-[#15599a] py-2 text-center font-bold text-white">ORDENS DE SERVIÇO</span>
			<div className="w-full flex flex-col gap-2">
				<div className="flex w-full items-center justify-end gap-2 flex-wrap">
					{!projectMainServiceOrderId ? (
						<button
							type="button"
							onClick={() =>
								mutateProjectServiceOrderTrigger({
									projectId,
								})
							}
							disabled={isPending}
							className={cn(
								"flex items-center gap-1 rounded-lg bg-blue-500 px-2 py-1 text-white duration-300 ease-in-out disabled:bg-gray-500 disabled:text-gray-300 enabled:hover:bg-blue-600",
							)}
						>
							<MdDesignServices />
							<h1 className="text-xs font-medium tracking-tight">GERAR ORDEM DE SERVIÇO DO PROJETO</h1>
						</button>
					) : null}
					<button
						type="button"
						onClick={() => setNewServiceOrderModalIsOpen(true)}
						className={cn("flex items-center gap-1 rounded-lg bg-primary px-2 py-1 text-white duration-300 ease-in-out hover:bg-primary/80")}
					>
						<MdDesignServices />
						<h1 className="text-xs font-medium tracking-tight">NOVA ORDEM DE SERVIÇO</h1>
					</button>
				</div>
				{isLoading ? <h1 className="text-center w-full text-primary/50 animate-pulse">Buscando ordens de serviço...</h1> : null}
				{isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
				{isSuccess ? (
					orders.length > 0 ? (
						orders.map((order) => <ProjectServiceOrderCard key={order._id} serviceOrder={order} handleClick={(id) => setEditServiceOrder({ id: id, isOpen: true })} />)
					) : (
						<div className="flex h-[60px] items-center justify-center">
							<p className="text-center italic text-primary/50">Não há ordens de serviço vinculadas a esse projeto...</p>
						</div>
					)
				) : null}
			</div>
			{editServiceOrder.id && editServiceOrder.isOpen ? (
				<ModalControlServiceOrder
					serviceOrderId={editServiceOrder.id}
					closeModal={() => setEditServiceOrder({ id: null, isOpen: false })}
					session={session}
					callbacks={{
						onMutate: handleMutate,
						onSettled: handleSettled,
					}}
				/>
			) : null}
			{newServiceOrderModalIsOpen ? (
				<ModalNewServiceOrder
					session={session}
					projectId={projectId}
					closeModal={() => setNewServiceOrderModalIsOpen(false)}
					callbacks={{
						onMutate: handleMutate,
						onSettled: handleSettled,
					}}
				/>
			) : null}
		</div>
	);
}

export default ProjectServiceOrders;

type ProjectServiceOrderCardProps = {
	serviceOrder: TServiceOrderSimplifiedDTO;
	handleClick: (id: string) => void;
};
function ProjectServiceOrderCard({ serviceOrder, handleClick }: ProjectServiceOrderCardProps) {
	function getStatusTag(serviceOrder: TServiceOrderSimplifiedDTO) {
		if (serviceOrder.status === "PENDENTE") return <div className="rounded-full bg-red-600 px-2 py-0.5 text-[0.5rem] font-medium text-white">PENDENTE</div>;

		if (serviceOrder.status === "AGUARDANDO PLANEJAMENTO") return <div className="rounded-full bg-blue-800 px-2 py-0.5 text-[0.5rem] font-medium text-white">EM PLANEJAMENTO</div>;

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
			<div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row flex-wrap">
				<div className="flex w-full flex-wrap items-center justify-center gap-2 lg:grow lg:justify-start">
					<div className="flex items-center gap-1">
						<Tag size={12} />
						<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">{serviceOrder.categoria}</h1>
					</div>
					<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80 ">ETIQUETAS</h1>
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
