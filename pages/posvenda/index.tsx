import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import React, { useState } from "react";
import { FaSignature } from "react-icons/fa";
import { FaListCheck } from "react-icons/fa6";
import { TbAlertTriangle, TbTruckDelivery } from "react-icons/tb";
import { VscDiffAdded } from "react-icons/vsc";

import PosVendaCard from "../../components/PosVendaCard";
import AfterSalesProjectsFilters from "@/components/identificador/posvenda/AfterSalesProjectsFilters";
import { useSession } from "@/components/providers/SessionProvider";
import ErrorComponent from "@/components/utils/ErrorComponent";
import LoadingPage from "../../components/utils/LoadingPage";
import UnauthenticatedComponent from "@/components/utils/UnauthenticatedComponent";
import UnauthorizedPage from "@/components/utils/UnauthorizedPage";
import type { TAuthSession } from "@/lib/authentication/types";
import { useAfterSalesProjects } from "@/utils/methods/query/aftersales";
import type { TProjectDTO } from "@/utils/schemas/projects";

function Posvenda() {
	const { session, status } = useSession();

	const isAuthorized = session?.user.permissoes.posVenda.visualizar;
	if (status === "loading") return <LoadingPage />;
	if (status === "unauthenticated") return <UnauthenticatedComponent />;
	if (!isAuthorized) return <UnauthorizedPage />;
	return <PosvendaContent session={session} />;
}

export default Posvenda;

function PosvendaContent({ session }: { session: TAuthSession }) {
	const queryClient = useQueryClient();

	const { data: projects, queryKey, isSuccess, isLoading, isError, filters, setFilters } = useAfterSalesProjects();

	const [mode, setMode] = useState<"CARD" | "SIMPLIFIED">("CARD");

	function getStats({ info }: { info: TProjectDTO[] | undefined }) {
		if (!info)
			return {
				projetos: 0,
				contatosPendentes: 0,
				paraConfeccionar: 0,
				paraAssinar: 0,
				entregaHoje: 0,
				entregaSemana: 0,
			};
		const projectsQty = info.length;
		const pendingContacts = info.reduce((acc, current) => {
			const lastContact = current.jornada.dataUltimaInteracao;
			if (!lastContact) return acc + 1;
			const sinceLastContact = dayjs().diff(lastContact, "day");
			if (sinceLastContact >= 7) return acc + 1;
			return acc;
		}, 0);
		const docsToElaborate = info.reduce((acc, current) => {
			const projectStarted = !!current.homologacao.dataLiberacao;
			const missignDocElaboration = !current.homologacao.documentacao.dataLiberacao;
			if (projectStarted && missignDocElaboration) return acc + 1;
			return acc;
		}, 0);
		const docsToSign = info.reduce((acc, current) => {
			const missingDocSigning = !!current.homologacao.documentacao.dataLiberacao && !current.homologacao.documentacao.dataAssinatura;
			if (missingDocSigning) return acc + 1;
			return acc;
		}, 0);
		const deliveries = info.reduce(
			(acc, current) => {
				if (!current.compra.previsaoEntrega) return acc;
				const deliveryPrevision = dayjs(current.compra.previsaoEntrega).add(3, "hour");

				const isToday = dayjs().isSame(deliveryPrevision, "day");
				const isThisWeek = dayjs().isSame(deliveryPrevision, "week") && dayjs(deliveryPrevision).isAfter(new Date());

				if (isToday) acc.today += 1;
				if (isThisWeek) acc.thisWeek += 1;
				return acc;
			},
			{ today: 0, thisWeek: 0 },
		);
		return {
			projetos: projectsQty,
			contatosPendentes: pendingContacts,
			paraConfeccionar: docsToElaborate,
			paraAssinar: docsToSign,
			entregaHoje: deliveries.today,
			entregaSemana: deliveries.thisWeek,
		};
	}
	const handleOnMutate = async () => {
		await queryClient.cancelQueries({ queryKey: queryKey });
	};

	const handleOnSettled = async () => {
		await queryClient.invalidateQueries({ queryKey: queryKey });
	};

	const stats = getStats({ info: projects });

	return (
		<div className="grow p-6">
			<div className="border-primary/20 flex flex-col items-center justify-between border-b p-1">
				<div className="flex w-full items-center justify-center lg:justify-start">
					<p className="text-center text-2xl font-black text-[#15599a] uppercase">PROJETOS EM JORNADA</p>
				</div>
				<div className="my-2 flex w-full flex-col items-center justify-center gap-3 lg:flex-row">
					<div className="bg-background border-primary/20 flex min-h-[110px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/5">
						<div className="flex items-center justify-between">
							<h1 className="text-sm font-medium tracking-tight uppercase">PROJETOS NO ESTÁGIO</h1>
							<VscDiffAdded />
						</div>
						<div className="mt-2 flex w-full flex-col">
							<div className="text-2xl font-bold text-[#15599a]">{stats.projetos}</div>
						</div>
					</div>
					<div className="bg-background border-primary/20 flex min-h-[110px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/5">
						<div className="flex items-center justify-between">
							<h1 className="text-sm font-medium tracking-tight uppercase">DOCUMENTAÇÃO A CONFECCIONAR</h1>
							<FaListCheck />
						</div>
						<div className="mt-2 flex w-full flex-col">
							<div className="text-2xl font-bold text-[#15599a]">{stats.paraConfeccionar}</div>
						</div>
					</div>
					<div className="bg-background border-primary/20 flex min-h-[110px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/5">
						<div className="flex items-center justify-between">
							<h1 className="text-sm font-medium tracking-tight uppercase">DOCUMENTAÇÃO A ASSINAR</h1>
							<FaSignature />
						</div>
						<div className="mt-2 flex w-full flex-col">
							<div className="text-2xl font-bold text-[#15599a]">{stats.paraAssinar}</div>
						</div>
					</div>
					<div className="bg-background border-primary/20 flex min-h-[110px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/5">
						<div className="flex items-center justify-between">
							<h1 className="text-sm font-medium tracking-tight uppercase">ENTREGAS HOJE</h1>
							<TbTruckDelivery />
						</div>
						<div className="mt-2 flex w-full flex-col">
							<div className="text-2xl font-bold text-[#15599a]">{stats.entregaHoje}</div>
							<p className="text-primary/60 text-xs">{stats.entregaSemana} essa semana</p>
						</div>
					</div>
					<div className="bg-background border-primary/20 flex min-h-[110px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/5">
						<div className="flex items-center justify-between">
							<h1 className="text-sm font-medium tracking-tight uppercase">CONTATOS PENDENTES</h1>
							<TbAlertTriangle />
						</div>
						<div className="mt-2 flex w-full flex-col">
							<div className="text-2xl font-bold text-[#15599a]">{stats.contatosPendentes}</div>
						</div>
					</div>
				</div>

				<AfterSalesProjectsFilters
					filters={filters}
					setFilters={setFilters}
					mode={mode}
					onModeChange={setMode}
				/>
			</div>

			<div className="mt-4 flex flex-wrap justify-around gap-3 overflow-y-auto overscroll-y-auto">
				{isLoading ? <LoadingPage /> : null}
				{isError ? <ErrorComponent msg={"Erro ao buscar projetos em jornada."} /> : null}
				{isSuccess
					? projects.map((project) => (
							<PosVendaCard
								session={session}
								key={project._id}
								projectId={project._id}
								project={project}
								mode={mode}
								callbacks={{
									onMutate: handleOnMutate,
									onSettled: handleOnSettled,
								}}
							/>
						))
					: null}
			</div>
		</div>
	);
}
