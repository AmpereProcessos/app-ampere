import type { TOverallReportOutput } from "@/pages/api/stats/overall-report";
import { formatDecimalPlaces, formatToMoney } from "@/utils/constants";
import { BadgeDollarSign, Building, Building2, DollarSign, Earth, Heart, Pickaxe, Ticket, Truck, Wrench, Zap } from "lucide-react";
import { MdDashboard } from "react-icons/md";

type OverallReportGeneralStatsProps = {
	generalData: TOverallReportOutput["data"]["geral"];
};
function OverallReportGeneralStats({ generalData }: OverallReportGeneralStatsProps) {
	return (
		<div className="bg-background flex flex-col gap-6 rounded-sm border border-gray-400 p-6 shadow-xs">
			<div className="flex w-full flex-col gap-2">
				<div className="flex w-full flex-col gap-1">
					<div className="flex items-center gap-2">
						<MdDashboard className="h-4 min-h-4 w-4 min-w-4" />
						<h2 className="text-lg font-bold tracking-tight">ESTATÍSTICAS GERAIS</h2>
					</div>
					<p className="text-primary/50 text-sm">Informações gerais sobre vendas, serviços executados, homologações e suprimentos</p>
				</div>
				<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
					<div className="bg-background flex w-full flex-col gap-2 rounded-xl border border-gray-400 p-3 lg:w-1/2">
						<div className="flex items-center gap-2">
							<MdDashboard className="h-4 min-h-4 w-4 min-w-4" />
							<h2 className="text-sm font-bold tracking-tight">PROJETOS</h2>
						</div>
						<div className="flex w-full items-center justify-center">
							<h1 className="text-lg font-bold tracking-tight">{generalData.qtdeProjetos}</h1>
						</div>
					</div>
					<div className="bg-background flex w-full flex-col gap-2 rounded-xl border border-gray-400 p-3 lg:w-1/2">
						<div className="flex items-center gap-2">
							<Heart className="h-4 min-h-4 w-4 min-w-4" />
							<h2 className="text-sm font-bold tracking-tight">NPS</h2>
						</div>
						<div className="flex w-full items-center justify-center">
							<h1 className="text-lg font-bold tracking-tight">{formatDecimalPlaces(generalData.nps)}%</h1>
						</div>
					</div>
				</div>
			</div>
			<div className="flex w-full flex-col gap-2">
				<div className="flex w-full flex-col gap-1">
					<div className="flex items-center gap-2">
						<BadgeDollarSign className="h-4 min-h-4 w-4 min-w-4" />
						<h2 className="text-lg font-bold tracking-tight">VENDAS</h2>
					</div>
					<p className="text-primary/50 text-sm">Informações gerais sobre vendas</p>
				</div>
				<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
					<div className="bg-background flex w-full flex-col gap-2 rounded-xl border border-gray-400 p-3 lg:w-1/2">
						<div className="flex items-center gap-2">
							<DollarSign className="h-4 min-h-4 w-4 min-w-4" />
							<h2 className="text-sm font-bold tracking-tight">VALOR VENDIDO</h2>
						</div>
						<div className="flex w-full items-center justify-center">
							<h1 className="text-lg font-bold tracking-tight">{formatToMoney(generalData.vendas.valorVendido)}</h1>
						</div>
					</div>
					<div className="bg-background flex w-full flex-col gap-2 rounded-xl border border-gray-400 p-3 lg:w-1/2">
						<div className="flex items-center gap-2">
							<MdDashboard className="h-4 min-h-4 w-4 min-w-4" />
							<h2 className="text-sm font-bold tracking-tight">PROJETOS VENDIDOS</h2>
						</div>
						<div className="flex w-full items-center justify-center">
							<h1 className="text-lg font-bold tracking-tight">{generalData.vendas.qtdeVendida}</h1>
						</div>
					</div>
					<div className="bg-background flex w-full flex-col gap-2 rounded-xl border border-gray-400 p-3 lg:w-1/2">
						<div className="flex items-center gap-2">
							<Ticket className="h-4 min-h-4 w-4 min-w-4" />
							<h2 className="text-sm font-bold tracking-tight">TICKET MÉDIO</h2>
						</div>
						<div className="flex w-full items-center justify-center">
							<h1 className="text-lg font-bold tracking-tight">{formatToMoney(generalData.vendas.valorVendido / generalData.vendas.qtdeVendida)}</h1>
						</div>
					</div>
				</div>
			</div>
			<div className="bg-primary/20 h-0.5 w-full rounded-lg" />
			<div className="flex w-full flex-col gap-2">
				<div className="flex w-full flex-col gap-1">
					<div className="flex items-center gap-2">
						<Wrench className="h-4 min-h-4 w-4 min-w-4" />
						<h2 className="text-lg font-bold tracking-tight">SERVIÇOS EXECUTADOS</h2>
					</div>
					<p className="text-primary/50 text-sm">Informações gerais sobre serviços (obras, manutenções, etc.) executados</p>
				</div>
				<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
					<div className="bg-background flex w-full flex-col gap-2 rounded-xl border border-gray-400 p-3 lg:w-1/3">
						<div className="flex items-center gap-2">
							<MdDashboard className="h-4 min-h-4 w-4 min-w-4" />
							<h2 className="text-sm font-bold tracking-tight">Nº DE SERVIÇOS EXECUTADOS</h2>
						</div>
						<div className="flex w-full items-center justify-center">
							<h1 className="text-lg font-bold tracking-tight">{generalData.instalacoes.qtdeExecutada}</h1>
						</div>
					</div>
					<div className="bg-background flex w-full flex-col gap-2 rounded-xl border border-gray-400 p-3 lg:w-1/3">
						<div className="flex items-center gap-2">
							<Building2 className="h-4 min-h-4 w-4 min-w-4" />
							<h2 className="text-sm font-bold tracking-tight">CIDADES JÁ ATENDIDAS</h2>
						</div>
						<div className="flex w-full items-center justify-center">
							<h1 className="text-lg font-bold tracking-tight">{generalData.instalacoes.numeroCidadesExecutadas}</h1>
						</div>
					</div>
					<div className="bg-background flex w-full flex-col gap-2 rounded-xl border border-gray-400 p-3 lg:w-1/3">
						<div className="flex items-center gap-2">
							<Earth className="h-4 min-h-4 w-4 min-w-4" />
							<h2 className="text-sm font-bold tracking-tight">ESTADOS JÁ ATENDIDAS</h2>
						</div>
						<div className="flex w-full items-center justify-center">
							<h1 className="text-lg font-bold tracking-tight">{generalData.instalacoes.numeroEstadosExecutados}</h1>
						</div>
					</div>
				</div>
				<div className="bg-background flex w-full flex-col gap-2 rounded-xl border border-gray-400 p-3">
					<div className="flex items-center gap-2">
						<Earth className="h-4 min-h-4 w-4 min-w-4" />
						<h2 className="text-sm font-bold tracking-tight">SERVIÇOS POR ESTADO</h2>
					</div>
					<div className="flex w-full flex-wrap items-center justify-start gap-2">
						{generalData.instalacoes.porEstado.map((state) => (
							<div key={`estado-servico-${state.titulo}`} className="flex items-center justify-between gap-6 rounded-xl border border-gray-400 px-2 py-1">
								<div className="bg-primary/80 flex items-center gap-2 rounded-lg px-2 py-1 text-white">
									<p className="text-[0.65rem] font-medium">{state.titulo}</p>
								</div>
								<p className="text-xs font-medium">{state.qtdeExecutada}</p>
							</div>
						))}
					</div>
				</div>
				<div className="bg-background flex w-full flex-col gap-2 rounded-xl border border-gray-400 p-3">
					<div className="flex items-center gap-2">
						<Building2 className="h-4 min-h-4 w-4 min-w-4" />
						<h2 className="text-sm font-bold tracking-tight">SERVIÇOS POR CIDADE</h2>
					</div>
					<div className="flex w-full flex-wrap items-center justify-start gap-2">
						{generalData.instalacoes.porCidade.map((city) => (
							<div key={`cidade-servico-${city.titulo}`} className="flex items-center justify-between gap-6 rounded-xl border border-gray-400 px-2 py-1">
								<div className="bg-primary/80 flex items-center gap-2 rounded-lg px-2 py-1 text-white">
									<p className="text-[0.65rem] font-medium">{city.titulo}</p>
								</div>
								<p className="text-xs font-medium">{city.qtdeExecutada}</p>
							</div>
						))}
					</div>
				</div>
			</div>
			<div className="bg-primary/20 h-0.5 w-full rounded-lg" />
			<div className="flex w-full flex-col gap-2">
				<div className="flex w-full flex-col gap-1">
					<div className="flex items-center gap-2">
						<MdDashboard className="h-4 min-h-4 w-4 min-w-4" />
						<h2 className="text-lg font-bold tracking-tight">HOMOLOGAÇÕES</h2>
					</div>
					<p className="text-primary/50 text-sm">Informações gerais sobre homologações realizadas</p>
				</div>
				<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
					<div className="bg-background flex w-full flex-col gap-2 rounded-xl border border-gray-400 p-3 lg:w-1/4">
						<div className="flex items-center gap-2">
							<MdDashboard className="h-4 min-h-4 w-4 min-w-4" />
							<h2 className="text-sm font-bold tracking-tight">Nº DE HOMOLOGAÇÕES</h2>
						</div>
						<div className="flex w-full items-center justify-center">
							<h1 className="text-lg font-bold tracking-tight">{generalData.homologacoes.qtdeHomologada}</h1>
						</div>
					</div>
					<div className="bg-background flex w-full flex-col gap-2 rounded-xl border border-gray-400 p-3 lg:w-1/4">
						<div className="flex items-center gap-2">
							<Zap className="h-4 min-h-4 w-4 min-w-4" />
							<h2 className="text-sm font-bold tracking-tight">POTÊNCIA HOMOLOGADA</h2>
						</div>
						<div className="flex w-full items-center justify-center">
							<h1 className="text-lg font-bold tracking-tight">{formatDecimalPlaces(generalData.homologacoes.potenciaHomologada)} kWp</h1>
						</div>
					</div>
					<div className="bg-background flex w-full flex-col gap-2 rounded-xl border border-gray-400 p-3 lg:w-1/4">
						<div className="flex items-center gap-2">
							<Building2 className="h-4 min-h-4 w-4 min-w-4" />
							<h2 className="text-sm font-bold tracking-tight">CIDADES JÁ ATENDIDAS</h2>
						</div>
						<div className="flex w-full items-center justify-center">
							<h1 className="text-lg font-bold tracking-tight">{generalData.homologacoes.numeroCidadesHomologadas}</h1>
						</div>
					</div>
					<div className="bg-background flex w-full flex-col gap-2 rounded-xl border border-gray-400 p-3 lg:w-1/4">
						<div className="flex items-center gap-2">
							<Earth className="h-4 min-h-4 w-4 min-w-4" />
							<h2 className="text-sm font-bold tracking-tight">ESTADOS JÁ ATENDIDOS</h2>
						</div>
						<div className="flex w-full items-center justify-center">
							<h1 className="text-lg font-bold tracking-tight">{generalData.homologacoes.numeroEstadosHomologados}</h1>
						</div>
					</div>
				</div>
				<div className="bg-background flex w-full flex-col gap-2 rounded-xl border border-gray-400 p-3">
					<div className="flex items-center gap-2">
						<Earth className="h-4 min-h-4 w-4 min-w-4" />
						<h2 className="text-sm font-bold tracking-tight">HOMOLOGAÇÕES POR ESTADO</h2>
					</div>
					<div className="flex w-full flex-wrap items-center justify-start gap-2">
						{generalData.homologacoes.porEstado.map((state) => (
							<div
								key={`estado-homologacao-${state.titulo}`}
								className="flex items-center justify-between gap-6 rounded-xl border border-gray-400 px-2 py-1"
							>
								<div className="bg-primary/80 flex items-center gap-2 rounded-lg px-2 py-1 text-white">
									<p className="text-[0.65rem] font-medium">{state.titulo}</p>
								</div>
								<div className="flex items-center justify-end gap-2">
									<div className="flex items-center gap-2">
										<MdDashboard className="h-4 w-4" />
										<p className="text-xs font-medium">{state.qtdeHomologada}</p>
									</div>
									<div className="flex items-center gap-2">
										<Zap className="h-4 w-4" />
										<p className="text-xs font-medium">{formatDecimalPlaces(state.potenciaHomologada)} kWp</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
				<div className="bg-background flex w-full flex-col gap-2 rounded-xl border border-gray-400 p-3">
					<div className="flex items-center gap-2">
						<Building2 className="h-4 min-h-4 w-4 min-w-4" />
						<h2 className="text-sm font-bold tracking-tight">HOMOLOGAÇÕES POR CIDADE</h2>
					</div>
					<div className="flex w-full flex-wrap items-center justify-start gap-2">
						{generalData.homologacoes.porCidade.map((city) => (
							<div key={`cidade-homologacao-${city.titulo}`} className="flex items-center justify-between gap-6 rounded-xl border border-gray-400 px-2 py-1">
								<div className="bg-primary/80 flex items-center gap-2 rounded-lg px-2 py-1 text-white">
									<p className="text-[0.65rem] font-medium">{city.titulo}</p>
								</div>
								<div className="flex items-center justify-end gap-2">
									<div className="flex items-center gap-2">
										<MdDashboard className="h-4 w-4" />
										<p className="text-xs font-medium">{city.qtdeHomologada}</p>
									</div>
									<div className="flex items-center gap-2">
										<Zap className="h-4 w-4" />
										<p className="text-xs font-medium">{formatDecimalPlaces(city.potenciaHomologada)} kWp</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
			<div className="bg-primary/20 h-0.5 w-full rounded-lg" />
			<div className="flex w-full flex-col gap-2">
				<div className="flex w-full flex-col gap-1">
					<div className="flex items-center gap-2">
						<MdDashboard className="h-4 min-h-4 w-4 min-w-4" />
						<h2 className="text-lg font-bold tracking-tight">SUPRIMENTOS</h2>
					</div>
					<p className="text-primary/50 text-sm">Informações gerais sobre suprimentos realizados</p>
				</div>
				<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
					<div className="bg-background flex w-full flex-col gap-2 rounded-xl border border-gray-400 p-3 lg:w-1/4">
						<div className="flex items-center gap-2">
							<MdDashboard className="h-4 min-h-4 w-4 min-w-4" />
							<h2 className="text-sm font-bold tracking-tight">Nº DE PEDIDOS</h2>
						</div>
						<div className="flex w-full items-center justify-center">
							<h1 className="text-lg font-bold tracking-tight">{generalData.suprimentos.qtdePedidos}</h1>
						</div>
					</div>
					<div className="bg-background flex w-full flex-col gap-2 rounded-xl border border-gray-400 p-3 lg:w-1/4">
						<div className="flex items-center gap-2">
							<Truck className="h-4 min-h-4 w-4 min-w-4" />
							<h2 className="text-sm font-bold tracking-tight">Nº DE ENTREGAS</h2>
						</div>
						<div className="flex w-full items-center justify-center">
							<h1 className="text-lg font-bold tracking-tight">{generalData.suprimentos.qtdeEntregas}</h1>
						</div>
					</div>
					<div className="bg-background flex w-full flex-col gap-2 rounded-xl border border-gray-400 p-3 lg:w-1/4">
						<div className="flex items-center gap-2">
							<Building2 className="h-4 min-h-4 w-4 min-w-4" />
							<h2 className="text-sm font-bold tracking-tight">CIDADES ENTREGUES</h2>
						</div>
						<div className="flex w-full items-center justify-center">
							<h1 className="text-lg font-bold tracking-tight">{generalData.suprimentos.numeroCidadesPedidos}</h1>
						</div>
					</div>
					<div className="bg-background flex w-full flex-col gap-2 rounded-xl border border-gray-400 p-3 lg:w-1/4">
						<div className="flex items-center gap-2">
							<Earth className="h-4 min-h-4 w-4 min-w-4" />
							<h2 className="text-sm font-bold tracking-tight">ESTADOS ENTREGUES</h2>
						</div>
						<div className="flex w-full items-center justify-center">
							<h1 className="text-lg font-bold tracking-tight">{generalData.suprimentos.numeroEstadosPedidos}</h1>
						</div>
					</div>
				</div>
				<div className="bg-background flex w-full flex-col gap-2 rounded-xl border border-gray-400 p-3">
					<div className="flex items-center gap-2">
						<Earth className="h-4 min-h-4 w-4 min-w-4" />
						<h2 className="text-sm font-bold tracking-tight">SUPRIMENTOS POR ESTADO</h2>
					</div>
					<div className="flex w-full flex-wrap items-center justify-start gap-2">
						{generalData.suprimentos.porEstado.map((state) => (
							<div key={`estado-suprimento-${state.titulo}`} className="flex items-center justify-between gap-6 rounded-xl border border-gray-400 px-2 py-1">
								<div className="bg-primary/80 flex items-center gap-2 rounded-lg px-2 py-1 text-white">
									<p className="text-[0.65rem] font-medium">{state.titulo}</p>
								</div>
								<div className="flex items-center justify-end gap-2">
									<div className="flex items-center gap-2">
										<MdDashboard className="h-4 w-4" />
										<p className="text-xs font-medium">{state.qtdePedidos}</p>
									</div>
									<div className="flex items-center gap-2">
										<Truck className="h-4 w-4" />
										<p className="text-xs font-medium">{state.qtdeEntregas}</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
				<div className="bg-background flex w-full flex-col gap-2 rounded-xl border border-gray-400 p-3">
					<div className="flex items-center gap-2">
						<Building2 className="h-4 min-h-4 w-4 min-w-4" />
						<h2 className="text-sm font-bold tracking-tight">SUPRIMENTOS POR CIDADE</h2>
					</div>
					<div className="flex w-full flex-wrap items-center justify-start gap-2">
						{generalData.suprimentos.porCidade.map((city) => (
							<div key={`cidade-suprimento-${city.titulo}`} className="flex items-center justify-between gap-6 rounded-xl border border-gray-400 px-2 py-1">
								<div className="bg-primary/80 flex items-center gap-2 rounded-lg px-2 py-1 text-white">
									<p className="text-[0.65rem] font-medium">{city.titulo}</p>
								</div>
								<div className="flex items-center justify-end gap-2">
									<div className="flex items-center gap-2">
										<MdDashboard className="h-4 w-4" />
										<p className="text-xs font-medium">{city.qtdePedidos}</p>
									</div>
									<div className="flex items-center gap-2">
										<Truck className="h-4 w-4" />
										<p className="text-xs font-medium">{city.qtdeEntregas}</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

export default OverallReportGeneralStats;
