import { useEngineeringSectorStats } from "@/utils/methods/query/engineering";
import { ChartArea, CircleCheck, CircleDashed, CircleX, DraftingCompass, GitPullRequestArrow, Network } from "lucide-react";
import { DateIntervalInput } from "@/components/utils/DateIntervalInput";
import { formatDecimalPlaces } from "@/utils/methods/handlers";

function EngineeringStats() {
	const { data: stats, queryParams, updateQueryParams } = useEngineeringSectorStats({});
	return (
		<div className="w-full flex flex-col gap-2 border border-gray-300 rounded-xl p-3 shadow-sm">
			<div className="w-full flex items-center justify-between">
				<div className="flex items-center gap-2">
					<ChartArea className="h-4 w-4 min-w-4 min-h-4" />
					<h1 className="text-xs font-medium uppercase tracking-tight">ESTATÍSTICAS</h1>
				</div>
				<DateIntervalInput
					label="Período"
					labelClassName="text-xs font-medium leading-none tracking-tight"
					className="border-none p-0 px-2 h-fit py-0.5 shadow-none"
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
				<div className="flex min-h-[130px] w-full flex-col rounded-xl border border-gray-300 bg-[#fff] p-3 shadow-sm lg:w-1/6">
					<div className="flex items-center justify-between">
						<h1 className="text-xs font-medium uppercase tracking-tight">EM ANDAMENTO</h1>
						<CircleDashed className="h-4 w-4 min-w-4 min-h-4" />
					</div>
					<div className="flex w-full flex-col">
						<div className="text-2xl font-bold text-[#15599a]">{stats?.emAndamento.qtde}</div>
						<p className="text-xs text-gray-500">{formatDecimalPlaces(stats?.emAndamento.potencia || 0)} kWp</p>
					</div>
				</div>
				<div className="flex min-h-[130px] w-full flex-col rounded-xl border border-gray-300 bg-[#fff] p-3 shadow-sm lg:w-1/6">
					<div className="flex items-center justify-between">
						<h1 className="text-xs font-medium uppercase tracking-tight">HOMOLOGAÇÕES SOLICITADAS</h1>
						<GitPullRequestArrow className="h-4 w-4 min-w-4 min-h-4" />
					</div>
					<div className="flex w-full flex-col">
						<div className="text-2xl font-bold text-[#15599a]">{stats?.homologacoesSolicitadas.qtde}</div>
						<p className="text-xs text-gray-500">{formatDecimalPlaces(stats?.homologacoesSolicitadas.potencia || 0)} kWp</p>
						<p className="text-xs text-gray-500">{formatDecimalPlaces(stats?.homologacoesSolicitadas.tempoMedio || 0)} HORAS (MÉDIA)</p>
					</div>
				</div>
				<div className="flex min-h-[130px] w-full flex-col rounded-xl border border-gray-300 bg-[#fff] p-3 shadow-sm lg:w-1/6">
					<div className="flex items-center justify-between">
						<h1 className="text-xs font-medium uppercase tracking-tight">HOMOLOGAÇÕES EFETIVADAS</h1>
						<CircleCheck className="h-4 w-4 min-w-4 min-h-4" />
					</div>
					<div className="flex w-full flex-col">
						<div className="text-2xl font-bold text-[#15599a]">{stats?.homologacoesEfetivadas.qtde}</div>
						<p className="text-xs text-gray-500">{formatDecimalPlaces(stats?.homologacoesEfetivadas.potencia || 0)} kWp</p>
						<p className="text-xs text-gray-500">{formatDecimalPlaces(stats?.homologacoesEfetivadas.tempoMedio || 0)} HORAS (MÉDIA)</p>
					</div>
				</div>
				<div className="flex min-h-[130px] w-full flex-col rounded-xl border border-gray-300 bg-[#fff] p-3 shadow-sm lg:w-1/6">
					<div className="flex items-center justify-between">
						<h1 className="text-xs font-medium uppercase tracking-tight">HOMOLOGAÇÕES REPROVADAS</h1>
						<CircleX className="h-4 w-4 min-w-4 min-h-4" />
					</div>
					<div className="flex w-full flex-col">
						<div className="text-2xl font-bold text-[#15599a]">{stats?.homologacoesReprovadas.qtde}</div>
						<p className="text-xs text-gray-500">{formatDecimalPlaces(stats?.homologacoesReprovadas.potencia || 0)} kWp</p>
					</div>
				</div>
				<div className="flex min-h-[130px] w-full flex-col rounded-xl border border-gray-300 bg-[#fff] p-3 shadow-sm lg:w-1/6">
					<div className="flex items-center justify-between">
						<h1 className="text-xs font-medium uppercase tracking-tight">VISTORIAS SOLICITADAS</h1>
						<CircleX className="h-4 w-4 min-w-4 min-h-4" />
					</div>
					<div className="flex w-full flex-col">
						<div className="text-2xl font-bold text-[#15599a]">{stats?.vistoriasSolicitadas.qtde}</div>
						<p className="text-xs text-gray-500">{formatDecimalPlaces(stats?.vistoriasSolicitadas.potencia || 0)} kWp</p>
						<p className="text-xs text-gray-500">{formatDecimalPlaces(stats?.vistoriasSolicitadas.tempoMedio || 0)} HORAS (MÉDIA)</p>
					</div>
				</div>
				<div className="flex min-h-[130px] w-full flex-col rounded-xl border border-gray-300 bg-[#fff] p-3 shadow-sm lg:w-1/6">
					<div className="flex items-center justify-between">
						<h1 className="text-xs font-medium uppercase tracking-tight">VISTORIAS EFETIVADAS</h1>
						<CircleCheck className="h-4 w-4 min-w-4 min-h-4" />
					</div>
					<div className="flex w-full flex-col">
						<div className="text-2xl font-bold text-[#15599a]">{stats?.vistoriasEfetivadas.qtde}</div>
						<p className="text-xs text-gray-500">{formatDecimalPlaces(stats?.vistoriasEfetivadas.potencia || 0)} kWp</p>
						<p className="text-xs text-gray-500">{formatDecimalPlaces(stats?.vistoriasEfetivadas.tempoMedio || 0)} HORAS (MÉDIA)</p>
					</div>
				</div>
			</div>
			<div className="flex w-full flex-col items-center justify-center gap-3 lg:flex-row">
				<div className="flex w-full flex-col rounded-xl border border-gray-300 bg-[#fff] p-3 shadow-sm lg:w-1/2">
					<div className="flex items-center justify-between">
						<h1 className="text-xs font-medium uppercase tracking-tight">DESENHOS EXECUTIVOS FEITOS</h1>
						<DraftingCompass className="h-4 w-4 min-w-4 min-h-4" />
					</div>
					<div className="flex w-full flex-col">
						<div className="text-2xl font-bold text-[#15599a]">{stats?.desenhosExecutivosFeitos}</div>
					</div>
				</div>
				<div className="flex w-full flex-col rounded-xl border border-gray-300 bg-[#fff] p-3 shadow-sm lg:w-1/2">
					<div className="flex items-center justify-between">
						<h1 className="text-xs font-medium uppercase tracking-tight">DIAGRAMAS EXECUTIVOS FEITOS</h1>
						<Network className="h-4 w-4 min-w-4 min-h-4" />
					</div>
					<div className="flex w-full flex-col">
						<div className="text-2xl font-bold text-[#15599a]">{stats?.desenhosExecutivosFeitos}</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default EngineeringStats;
