import React from "react";

import EnergyPAProjectsFilters from "@/components/identificador/controlePadroes/EnergyPAProjectsFilters";
import PAAdequationProjectCard from "@/components/identificador/controlePadroes/PAAdequationProjectCard";
import DateIntervalInput from "@/components/inputs/DateIntervalInput";
import { useSession } from "@/components/providers/SessionProvider";
import ErrorComponent from "@/components/utils/ErrorComponent";
import GeneralPaginationComponent from "@/components/utils/Pagination";
import UnauthenticatedComponent from "@/components/utils/UnauthenticatedComponent";
import UnauthorizedPage from "@/components/utils/UnauthorizedPage";
import type { TAuthSession } from "@/lib/authentication/types";
import { useEnergyPAExecutionWithFilters, usePAExecutionStats } from "@/utils/methods/query/execution";
import { useQueryClient } from "@tanstack/react-query";
import { ChartArea, CircleCheck, LayoutGrid } from "lucide-react";
import LoadingPage from "../../components/utils/LoadingPage";

function EnergyPAControls() {
	const { session, status } = useSession();
	const isAuthorized = session?.user.permissoes.execucao.visualizar;

	if (status === "loading") return <LoadingPage />;
	if (status === "unauthenticated") return <UnauthenticatedComponent />;
	if (!isAuthorized) return <UnauthorizedPage />;
	return <EnergyPAControlsContent session={session} />;
}

export default EnergyPAControls;

function EnergyPAControlsContent({ session }: { session: TAuthSession }) {
	const queryClient = useQueryClient();
	const { data: projectsResult, isLoading, isError, isSuccess, queryParams, updateQueryParams, queryKey } = useEnergyPAExecutionWithFilters({});
	const projects = projectsResult?.projects || [];
	const projectsMatched = projectsResult?.projectsMatched || 0;
	const projectsShowing = projects.length;
	const totalPages = projectsResult?.totalPages || 0;
	const handleOnMutate = async () => await queryClient.cancelQueries({ queryKey });
	const handleOnSettled = async () => await queryClient.invalidateQueries({ queryKey });

	return (
		<div className="grow bg-slate-50 p-6">
			<div className="border-primary/20 flex flex-col items-center justify-between gap-2 border-b p-1">
				<div className="flex w-full items-center justify-center lg:justify-start">
					<p className="text-center text-2xl font-black text-[#15599a] uppercase">
						PROJETOS COM ADEQUAÇÃO DE PADRÃO
					</p>
				</div>
				<EnergyPAExecutionStats />
				<EnergyPAProjectsFilters queryParams={queryParams} updateQueryParams={updateQueryParams} />
			</div>
			<GeneralPaginationComponent
				activePage={queryParams.page}
				queryLoading={isLoading}
				selectPage={(page) => updateQueryParams({ page })}
				totalPages={totalPages}
				itemsMatchedText={`Foram encontrados ${projectsMatched} projetos.`}
				itemsShowingText={`Monstrando ${projectsShowing} projetos.`}
			/>
			<div className="flex w-full flex-col gap-2 py-2">
				{isLoading ? <LoadingPage /> : null}
				{isError ? <ErrorComponent msg={"Erro ao encontrar projetos para adequação de padrão."} /> : null}
				{isSuccess && projects ? (
					projects.length > 0 ? (
						projects.map((project) => (
							<PAAdequationProjectCard
								key={project._id}
								project={project}
								callbacks={{ onMutate: handleOnMutate, onSuccess: handleOnSettled, onSettled: handleOnSettled }}
							/>
						))
					) : (
						<p className="text-primary/60 w-full text-center font-medium">Nenhum projeto foi encontrado...</p>
					)
				) : null}
			</div>
		</div>
	);
}

function EnergyPAExecutionStats() {
	const { data: stats, isLoading, isError, isSuccess, queryParams, updateQueryParams } = usePAExecutionStats({});
	return (
		<div className="border-primary/20 flex w-full flex-col gap-2 rounded-xl border p-3 shadow-xs">
			<div className="flex w-full items-center justify-between">
				<div className="flex items-center gap-2">
					<ChartArea className="h-4 min-h-4 w-4 min-w-4" />
					<h1 className="text-xs font-medium tracking-tight uppercase">ESTATÍSTICAS</h1>
				</div>
				<DateIntervalInput
					label="Período"
					labelClassName="text-xs font-medium leading-none tracking-tight"
					className="h-fit border-none p-0 px-2 py-0.5 shadow-none"
					value={{
						after: queryParams.after ? new Date(queryParams.after) : undefined,
						before: queryParams.before ? new Date(queryParams.before) : undefined,
					}}
					handleChange={(v) =>
						updateQueryParams({
							after: v.after ? v.after.toISOString() : undefined,
							before: v.before ? v.before.toISOString() : undefined,
						})
					}
				/>
			</div>
			<div className="flex w-full flex-col items-center justify-center gap-3 lg:flex-row">
				<div className="bg-background border-primary/20 flex min-h-[130px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/3">
					<div className="flex items-center justify-between">
						<h1 className="text-xs font-medium tracking-tight uppercase">TOTAL DE ADEQUAÇÕES DE PADRÃO</h1>
						<LayoutGrid className="h-4 min-h-4 w-4 min-w-4" />
					</div>
					<div className="flex w-full flex-col">
						<div className="text-2xl font-bold text-[#15599a]">{stats?.totalAdequacoes}</div>
					</div>
				</div>
				<div className="bg-background border-primary/20 flex min-h-[130px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/3">
					<div className="flex items-center justify-between">
						<h1 className="text-xs font-medium tracking-tight uppercase">ADEQUAÇÕES DE PADRÃO CONCLUÍDAS</h1>
						<CircleCheck className="h-4 min-h-4 w-4 min-w-4" />
					</div>
					<div className="flex w-full flex-col">
						<div className="text-2xl font-bold text-[#15599a]">{stats?.adequacoesConcluidas}</div>
					</div>
				</div>
				<div className="bg-background border-primary/20 flex min-h-[130px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/3">
					<div className="flex items-center justify-between">
						<h1 className="text-xs font-medium tracking-tight uppercase">ADEQUAÇÕES DE PADRÃO PENDENTES</h1>
						<LayoutGrid className="h-4 min-h-4 w-4 min-w-4" />
					</div>
					<div className="flex w-full flex-col">
						<div className="text-2xl font-bold text-[#15599a]">{stats?.totalAdequacoesPendentes}</div>
						<p className="text-primary/60 text-xs">{stats?.totalAdequacoesPendentesPagas} pagos</p>
					</div>
				</div>
			</div>
			<div className="bg-background border-primary/20 flex w-full flex-col gap-1 rounded-xl border p-3 shadow-xs">
				<h1 className="text-xs font-medium tracking-tight uppercase">POR RESPONSABILIDADE</h1>
				<div className="flex w-full flex-wrap justify-start gap-2">
					{stats?.porResponsabilidade.map((responsability) => (
						<div key={responsability.tipo} className="bg-background border-primary/20 flex items-center gap-2 rounded-xl border p-3 shadow-xs">
							<h1 className="text-xs font-medium tracking-tight uppercase">{responsability.tipo}</h1>
							<div className="text-primary/60 text-xs">{responsability.totalAdequacoesPendentes} pendentes</div>
							<div className="text-primary/60 text-xs">{responsability.totalAdequacoesPendentesPagas} pagos</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
