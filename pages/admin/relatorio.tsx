import DateIntervalInput from "@/components/inputs/DateIntervalInput";
import LoadingComponent from "@/components/utils/LoadingComponent";
import UnauthorizedPage from "@/components/utils/UnauthorizedPage";
import { useOverallReport } from "@/utils/methods/query/stats";
import type { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, MapPin, Zap, DollarSign, Home, CheckCircle, Building2, Earth, Building } from "lucide-react";
import { formatDecimalPlaces, formatToMoney } from "@/utils/constants";
import { MdDashboard } from "react-icons/md";
import { FaSolarPanel } from "react-icons/fa";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function ReportPage() {
	const { data: session, status } = useSession({ required: true });

	if (status !== "authenticated") return <LoadingComponent />;

	const hasResultsAccess = session.user.permissoes.gestao.visualizarResultados;
	if (!hasResultsAccess) return <UnauthorizedPage />;

	return <ReportPageContent session={session} />;
}
export default ReportPage;
function ReportPageContent({ session }: { session: Session }) {
	const [activeSegmentMode, setActiveSegmentMode] = useState<"instalacoes" | "homologacoes">("instalacoes");
	const { data: report, isLoading, isError, error, queryParams, updateQueryParams } = useOverallReport({});
	return (
		<div className="flex grow flex-col p-6 bg-gray-50 min-h-screen">
			{/* Header */}
			<div className="flex flex-col items-center border-b border-gray-200 bg-white rounded-lg shadow-sm mb-6 px-6 py-4">
				<div className="flex w-full items-center justify-between">
					<div className="flex flex-col items-center gap-2 lg:flex-row">
						<div className="flex items-center gap-2">
							<BarChart3 className="h-8 w-8 text-[#15599a]" />
							<p className="text-center text-2xl font-black uppercase text-[#15599a]">RELATÓRIO GERAL</p>
						</div>
					</div>
					<DateIntervalInput
						label="Período"
						labelClassName="text-xs font-medium leading-none tracking-tight"
						className="border-none p-0 px-2 h-fit py-0.5 shadow-none"
						value={{
							after: queryParams.period?.after ? new Date(queryParams.period.after) : undefined,
							before: queryParams.period?.before ? new Date(queryParams.period.before) : undefined,
						}}
						handleChange={(v) =>
							updateQueryParams({
								period: {
									after: v.after ? v.after.toISOString() : undefined,
									before: v.before ? v.before.toISOString() : undefined,
								},
							})
						}
					/>
				</div>
			</div>

			{/* Main Content */}
			<div className="space-y-6">
				{/* Detalhamento das Vendas */}
				<div className="rounded-xl border border-gray-200 bg-[#fff] p-6 shadow-sm">
					<div className="mb-4">
						<div className="flex items-center gap-2 mb-2">
							<TrendingUp className="h-5 w-5 text-[#15599a]" />
							<h2 className="text-lg font-bold text-[#15599a] uppercase tracking-tight">Detalhamento de Vendas</h2>
						</div>
						<p className="text-sm text-gray-600">Análise completa dos valores comercializados</p>
					</div>
					<div className="flex flex-col lg:flex-row items-center gap-4">
						<div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-300 bg-[#fff] p-3 shadow-sm lg:w-1/3">
							<div className="flex items-center justify-between">
								<h1 className="text-sm font-medium uppercase tracking-tight">NÚMERO DE VENDAS</h1>
								<MdDashboard className="h-5 w-5" />
							</div>
							<div className="mt-2 flex w-full flex-col">
								<div className="text-2xl font-bold text-[#15599a]">{report?.vendas.qtdeVendida ?? 0}</div>
							</div>
						</div>
						<div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-300 bg-[#fff] p-3 shadow-sm lg:w-1/3">
							<div className="flex items-center justify-between">
								<h1 className="text-sm font-medium uppercase tracking-tight">VALOR VENDIDO</h1>
								<DollarSign className="h-5 w-5" />
							</div>
							<div className="mt-2 flex w-full flex-col">
								<div className="text-2xl font-bold text-[#15599a]">{formatToMoney(report?.vendas.valorVendido ?? 0)}</div>
							</div>
						</div>
						<div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-300 bg-[#fff] p-3 shadow-sm lg:w-1/3">
							<div className="flex items-center justify-between">
								<h1 className="text-sm font-medium uppercase tracking-tight">POTÊNCIA VENDIDA </h1>
								<Zap className="h-5 w-5" />
							</div>
							<div className="mt-2 flex w-full flex-col">
								<div className="text-2xl font-bold text-[#15599a]">{formatDecimalPlaces(report?.vendas.potenciaVendida ?? 0)} kWp</div>
							</div>
						</div>
					</div>
				</div>

				{/* Tabs para Instalações e Homologações */}
				<div className="w-full flex flex-col gap-4">
					<div className="w-full flex items-center justify-between gap-2">
						<Button
							onClick={() => setActiveSegmentMode("instalacoes")}
							className={cn("bg-white text-black hover:bg-blue-400 hover:text-white w-1/2 transition-colors", {
								"bg-[#15599a] text-white": activeSegmentMode === "instalacoes",
							})}
						>
							Instalações
						</Button>
						<Button
							onClick={() => setActiveSegmentMode("homologacoes")}
							className={cn("bg-white text-black hover:bg-blue-400 hover:text-white w-1/2 transition-colors", {
								"bg-[#15599a] text-white": activeSegmentMode === "homologacoes",
							})}
						>
							Homologações
						</Button>
					</div>
					{activeSegmentMode === "instalacoes" ? (
						<div className="flex flex-col gap-4 w-full">
							{/* Resumo de Instalações */}
							<div className="w-full flex flex-col gap-4 p-4">
								<div className="flex items-center gap-2 mb-4">
									<Home className="h-5 w-5 text-[#15599a]" />
									<h3 className="text-base font-bold text-[#15599a] uppercase tracking-tight">Resumo de Instalações</h3>
								</div>
								<div className="flex flex-col lg:flex-row items-center gap-4">
									<div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-300 bg-[#fff] p-3 shadow-sm lg:w-1/3">
										<div className="flex items-center justify-between">
											<h1 className="text-sm font-medium uppercase tracking-tight">NÚMERO DE INSTALAÇÕES</h1>
											<MdDashboard className="h-5 w-5" />
										</div>
										<div className="mt-2 flex w-full flex-col">
											<div className="text-2xl font-bold text-[#15599a]">{report?.instalacoes.qtdeInstalada ?? 0}</div>
										</div>
									</div>
									<div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-300 bg-[#fff] p-3 shadow-sm lg:w-1/3">
										<div className="flex items-center justify-between">
											<h1 className="text-sm font-medium uppercase tracking-tight">POTÊNCIA INSTALADA</h1>
											<Zap className="h-5 w-5" />
										</div>
										<div className="mt-2 flex w-full flex-col">
											<div className="text-2xl font-bold text-[#15599a]">{formatDecimalPlaces(report?.instalacoes.potenciaInstalada ?? 0)} kWp</div>
										</div>
									</div>
									<div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-300 bg-[#fff] p-3 shadow-sm lg:w-1/3">
										<div className="flex items-center justify-between">
											<h1 className="text-sm font-medium uppercase tracking-tight">NÚMERO DE PAINÉIS INSTALADOS</h1>
											<FaSolarPanel className="h-5 w-5" />
										</div>
										<div className="mt-2 flex w-full flex-col">
											<div className="text-2xl font-bold text-[#15599a]">{report?.instalacoes.numeroPaineisInstalados ?? 0}</div>
										</div>
									</div>
								</div>
							</div>
							{/* Por Estado - Instalações */}
							<div className="w-full flex flex-col gap-4 p-4 ">
								<div className="flex items-center gap-2 mb-4">
									<MapPin className="h-5 w-5 text-[#15599a]" />
									<h3 className="text-base font-bold text-[#15599a] uppercase tracking-tight">Por Estado</h3>
								</div>
								<div className="flex items-center justify-start flex-wrap gap-4">
									{report?.instalacoes.porEstado
										.sort((a, b) => b.qtdeInstalada - a.qtdeInstalada)
										.map((estado) => (
											<div key={estado.titulo} className="min-w-fit flex gap-6 rounded border border-gray-300 p-3">
												<div className="flex items-center gap-2">
													<div className="flex items-center gap-2">
														<Earth className="h-4 w-4" />
														<p className="text-sm font-medium">{estado.titulo}</p>
													</div>
												</div>
												<div className="min-w-fit flex items-center justify-between gap-2">
													<div className="flex items-center gap-2">
														<MdDashboard className="h-4 w-4" />
														<p className="text-sm font-medium">{estado.qtdeInstalada}</p>
													</div>
													<div className="flex items-center gap-2">
														<Zap className="h-4 w-4" />
														<p className="text-sm font-medium">{formatDecimalPlaces(estado.potenciaInstalada)} kWp</p>
													</div>
													<div className="flex items-center gap-2">
														<FaSolarPanel className="h-4 w-4" />
														<p className="text-sm font-medium">{estado.numeroPaineisInstalados}</p>
													</div>
												</div>
											</div>
										))}
								</div>
							</div>
							{/* Por Cidades - Instalações */}
							<div className="w-full flex flex-col gap-4 p-4">
								<div className="flex items-center gap-2 mb-4">
									<MapPin className="h-5 w-5 text-[#15599a]" />
									<h3 className="text-base font-bold text-[#15599a] uppercase tracking-tight">Por Cidades</h3>
								</div>
								<div className="flex flex-col w-full gap-2">
									{report?.instalacoes.porCidade
										.sort((a, b) => b.qtdeInstalada - a.qtdeInstalada)
										.slice(0, 5)
										.map((cidade, index) => (
											<div key={`cidade-instalacao-${cidade.titulo}`} className="w-full flex items-center justify-between gap-2 rounded border border-gray-300 p-3">
												<div className="flex items-center gap-2">
													<Building2 className="h-4 w-4" />
													<p className="text-sm font-medium">{cidade.titulo}</p>
												</div>
												<div className="flex items-center justify-end gap-2">
													<div className="flex items-center gap-2">
														<MdDashboard className="h-4 w-4" />
														<p className="text-sm font-medium">{cidade.qtdeInstalada}</p>
													</div>
													<div className="flex items-center gap-2">
														<Zap className="h-4 w-4" />
														<p className="text-sm font-medium">{formatDecimalPlaces(cidade.potenciaInstalada)} kWp</p>
													</div>
													<div className="flex items-center gap-2">
														<FaSolarPanel className="h-4 w-4" />
														<p className="text-sm font-medium">{cidade.numeroPaineisInstalados}</p>
													</div>
												</div>
											</div>
										))}
								</div>
							</div>
						</div>
					) : null}

					{activeSegmentMode === "homologacoes" ? (
						<div className="flex flex-col gap-4 w-full">
							{/* Resumo de Homologações */}
							<div className="w-full flex flex-col gap-4 p-4">
								<div className="flex items-center gap-2 mb-4">
									<Home className="h-5 w-5 text-[#15599a]" />
									<h3 className="text-base font-bold text-[#15599a] uppercase tracking-tight">Resumo de Homologações</h3>
								</div>
								<div className="flex flex-col lg:flex-row items-center gap-4">
									<div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-300 bg-[#fff] p-3 shadow-sm lg:w-1/3">
										<div className="flex items-center justify-between">
											<h1 className="text-sm font-medium uppercase tracking-tight">NÚMERO DE HOMOLOGAÇÕES</h1>
											<MdDashboard className="h-5 w-5" />
										</div>
										<div className="mt-2 flex w-full flex-col">
											<div className="text-2xl font-bold text-[#15599a]">{report?.homologacoes.qtdeHomologada ?? 0}</div>
										</div>
									</div>
									<div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-300 bg-[#fff] p-3 shadow-sm lg:w-1/3">
										<div className="flex items-center justify-between">
											<h1 className="text-sm font-medium uppercase tracking-tight">POTÊNCIA HOMOLOGADA</h1>
											<Zap className="h-5 w-5" />
										</div>
										<div className="mt-2 flex w-full flex-col">
											<div className="text-2xl font-bold text-[#15599a]">{formatDecimalPlaces(report?.homologacoes.potenciaHomologada ?? 0)} kWp</div>
										</div>
									</div>
									<div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-300 bg-[#fff] p-3 shadow-sm lg:w-1/3">
										<div className="flex items-center justify-between">
											<h1 className="text-sm font-medium uppercase tracking-tight">NÚMERO DE PAINÉIS HOMOLOGADOS</h1>
											<FaSolarPanel className="h-5 w-5" />
										</div>
										<div className="mt-2 flex w-full flex-col">
											<div className="text-2xl font-bold text-[#15599a]">{report?.homologacoes.numeroPaineisHomologados ?? 0}</div>
										</div>
									</div>
								</div>
							</div>
							{/* Por Estado - Homologações */}
							<div className="w-full flex flex-col gap-4 p-4 ">
								<div className="flex items-center gap-2 mb-4">
									<MapPin className="h-5 w-5 text-[#15599a]" />
									<h3 className="text-base font-bold text-[#15599a] uppercase tracking-tight">Por Estado</h3>
								</div>
								<div className="flex items-center justify-start flex-wrap gap-4">
									{report?.homologacoes.porEstado
										.sort((a, b) => b.qtdeHomologada - a.qtdeHomologada)
										.map((estado) => (
											<div key={estado.titulo} className="min-w-fit flex gap-6 rounded border border-gray-300 p-3">
												<div className="flex items-center gap-2">
													<div className="flex items-center gap-2">
														<Earth className="h-4 w-4" />
														<p className="text-sm font-medium">{estado.titulo}</p>
													</div>
												</div>
												<div className="min-w-fit flex items-center justify-between gap-2">
													<div className="flex items-center gap-2">
														<MdDashboard className="h-4 w-4" />
														<p className="text-sm font-medium">{estado.qtdeHomologada}</p>
													</div>
													<div className="flex items-center gap-2">
														<Zap className="h-4 w-4" />
														<p className="text-sm font-medium">{formatDecimalPlaces(estado.potenciaHomologada)} kWp</p>
													</div>
													<div className="flex items-center gap-2">
														<FaSolarPanel className="h-4 w-4" />
														<p className="text-sm font-medium">{estado.numeroPaineisHomologados}</p>
													</div>
												</div>
											</div>
										))}
								</div>
							</div>
							{/* Por Cidades - Homologações */}
							<div className="w-full flex flex-col gap-4 p-4">
								<div className="flex items-center gap-2 mb-4">
									<MapPin className="h-5 w-5 text-[#15599a]" />
									<h3 className="text-base font-bold text-[#15599a] uppercase tracking-tight">Por Cidades</h3>
								</div>
								<div className="flex flex-col w-full gap-2">
									{report?.homologacoes.porCidade
										.sort((a, b) => b.qtdeHomologada - a.qtdeHomologada)
										.slice(0, 5)
										.map((cidade, index) => (
											<div key={`cidade-instalacao-${cidade.titulo}`} className="w-full flex items-center justify-between gap-2 rounded border border-gray-300 p-3">
												<div className="flex items-center gap-2">
													<Building2 className="h-4 w-4" />
													<p className="text-sm font-medium">{cidade.titulo}</p>
												</div>
												<div className="flex items-center justify-end gap-2">
													<div className="flex items-center gap-2">
														<MdDashboard className="h-4 w-4" />
														<p className="text-sm font-medium">{cidade.qtdeHomologada}</p>
													</div>
													<div className="flex items-center gap-2">
														<Zap className="h-4 w-4" />
														<p className="text-sm font-medium">{formatDecimalPlaces(cidade.potenciaHomologada)} kWp</p>
													</div>
													<div className="flex items-center gap-2">
														<FaSolarPanel className="h-4 w-4" />
														<p className="text-sm font-medium">{cidade.numeroPaineisHomologados}</p>
													</div>
												</div>
											</div>
										))}
								</div>
							</div>
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
}
