import TechnicalAnalysisFiles from "@/components/identificador/analisesTecnicas/TechnicalAnalysisFiles";
import Avatar from "@/components/utils/Avatar";
import ErrorComponent from "@/components/utils/ErrorComponent";
import LoadingComponent from "@/components/utils/LoadingComponent";
import { cn } from "@/lib/utils";
import { useTechnicalAnalysisById } from "@/utils/methods/query/technical-analysis";
import type { TServiceOrder } from "@/utils/schemas/service-order";
import { useState } from "react";
import { TbReportAnalytics } from "react-icons/tb";

type ServiceOrderTechnicalAnalysisInformationBlockProps = {
	technicalAnalysisId: TServiceOrder["idAnaliseTecnica"];
};
function ServiceOrderTechnicalAnalysisInformationBlock({ technicalAnalysisId }: ServiceOrderTechnicalAnalysisInformationBlockProps) {
	const [technicalAnalysisBlockIsOpen, setTechnicalAnalysisBlockIsOpen] = useState<boolean>(false);

	return (
		<div className="flex w-full grow flex-col gap-4">
			<h1 className="w-full rounded bg-primary p-1 text-center font-bold text-primary-foreground">INFORMAÇÕES DA ANÁLISE TÉCNICA</h1>
			{technicalAnalysisId ? (
				<div className="flex w-full flex-col gap-2">
					<div className="flex w-full items-center justify-center">
						<button
							type="button"
							onClick={() => setTechnicalAnalysisBlockIsOpen((prev) => !prev)}
							className={cn("flex items-center gap-1 rounded-lg px-2 py-1 text-black duration-300 ease-in-out", {
								"bg-gray-300  hover:bg-red-300": technicalAnalysisBlockIsOpen,
								"bg-green-300  hover:bg-green-400": !technicalAnalysisBlockIsOpen,
							})}
						>
							<TbReportAnalytics />
							<h1 className="text-xs font-medium tracking-tight">{!technicalAnalysisBlockIsOpen ? "ABRIR INFORMAÇÕES DA ANÁLISE TÉCNICA" : "FECHAR INFORMAÇÕES DA ANÁLISE TÉCNICA"}</h1>
						</button>
					</div>
					{technicalAnalysisBlockIsOpen ? <TechnicalAnalysisBlock analysisId={technicalAnalysisId} /> : null}
				</div>
			) : (
				<div className="w-full text-center text-sm font-medium tracking-tight text-primary/80">Nenhuma Análise Técnica vinculada.</div>
			)}
		</div>
	);
}
export default ServiceOrderTechnicalAnalysisInformationBlock;

function TechnicalAnalysisBlock({ analysisId }: { analysisId: string }) {
	const { data: analysis, isLoading, isError, isSuccess } = useTechnicalAnalysisById({ id: analysisId });

	return (
		<div className="flex w-[90%] flex-col self-center rounded-md border border-[#15599a] pb-2 shadow-lg">
			<h1 className="tounded-tl-md w-full rounded-tr-md bg-[#15599a] p-1 text-center text-xs font-medium text-white">INFORMAÇÕES DA ANÁLISE TÉCNICA</h1>
			{isLoading ? <LoadingComponent /> : null}
			{isError ? <ErrorComponent msg={"Erro ao buscar informações da análise técnica."} /> : null}
			{isSuccess && analysis ? (
				<div className="flex w-full flex-col gap-2 px-4">
					<h1 className="self-center rounded border border-[#15599a] p-1 font-bold text-[#15599a]">{analysis.status}</h1>
					<div className="flex w-full items-center justify-center gap-2">
						<h1 className="font-raleway text-xs font-bold text-gray-500">ANALISTA</h1>
						<Avatar url={analysis.analista?.avatar_url} fallback={"A"} height={30} width={30} />
						<p className="text-sm font-medium text-gray-500">{analysis.analista?.apelido || "NÃO DEFINIDO"}</p>
					</div>
					<div className="flex w-full flex-wrap justify-around">
						<div className="flex flex-col rounded-md border border-gray-500 p-3">
							<p className="text-[0.6rem] font-medium uppercase leading-none tracking-tight text-gray-500">TIPO DE TELHA</p>
							<h1 className="text-center text-xs font-medium uppercase text-black">{analysis.detalhes.tipoTelha}</h1>
						</div>
						<div className="flex flex-col rounded-md border border-gray-500 p-3">
							<p className="text-[0.6rem] font-medium uppercase leading-none tracking-tight text-gray-500">TIPO DA ESTRUTURA</p>
							<h1 className="text-center text-xs font-medium uppercase text-black">{analysis.detalhes.tipoEstrutura}</h1>
						</div>
						<div className="flex flex-col rounded-md border border-gray-500 p-3">
							<p className="text-[0.6rem] font-medium uppercase leading-none tracking-tight text-gray-500">MATERIAL DA ESTRUTURA</p>
							<h1 className="text-center text-xs font-medium uppercase text-black">{analysis.detalhes.materialEstrutura}</h1>
						</div>
						<div className="flex flex-col rounded-md border border-gray-500 p-3">
							<p className="text-[0.6rem] font-medium uppercase leading-none tracking-tight text-gray-500">ORIENTAÇÃO DA ESTRUTURA</p>
							<h1 className="text-center text-xs font-medium uppercase text-black">{analysis.detalhes.orientacao || "-"}</h1>
						</div>
						<div className="flex flex-col rounded-md border border-gray-500 p-3">
							<p className="text-[0.6rem] font-medium uppercase leading-none tracking-tight text-gray-500">CONCESSIONÁRIA</p>
							<h1 className="text-center text-xs font-medium uppercase text-black">{analysis.detalhes.concessionaria}</h1>
						</div>
					</div>
					<div className="flex w-full flex-col gap-1">
						<h1 className="w-full rounded-sm bg-[#fead41] p-1 text-center font-bold text-white">EXECUÇÃO</h1>
						<div className="mt-2 flex flex-col gap-1">
							<h1 className="text-sm font-medium leading-none tracking-tight text-gray-500">OBSERVAÇÕES P/ EXECUÇÃO</h1>
							<div className="overscroll-y flex h-[50px] max-h-[50px] w-full items-center justify-center overflow-y-auto rounded-md border border-cyan-500 bg-gray-100 p-3 text-center text-sm text-gray-500 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
								{analysis.execucao?.observacoes}
							</div>
						</div>
						<div className="mt-4 flex w-full flex-wrap justify-around">
							<div className="flex flex-col rounded-md border border-gray-500 p-3">
								<p className="text-[0.6rem] font-medium uppercase leading-none tracking-tight text-gray-500">LOCAL DE INSTALAÇÃO DO INVERSOR</p>
								<h1 className="text-center text-xs font-medium uppercase text-black">{analysis.locais.inversor || "-"}</h1>
							</div>
							<div className="flex flex-col rounded-md border border-gray-500 p-3">
								<p className="text-[0.6rem] font-medium uppercase leading-none tracking-tight text-gray-500">LOCAL DE INSTALAÇÃO DOS MÓDULOS</p>
								<h1 className="text-center text-xs font-medium uppercase text-black">{analysis.locais.modulos || "-"}</h1>
							</div>
							<div className="flex flex-col rounded-md border border-gray-500 p-3">
								<p className="text-[0.6rem] font-medium uppercase leading-none tracking-tight text-gray-500">LOCAL DE ATERRAMENTO</p>
								<h1 className="text-center text-xs font-medium uppercase text-black">{analysis.locais.aterramento || "-"}</h1>
							</div>
							<div className="flex flex-col rounded-md border border-gray-500 p-3">
								<p className="text-[0.6rem] font-medium uppercase leading-none tracking-tight text-gray-500">POSSUI ESPAÇO NO QGBT</p>
								<h1 className="text-center text-xs font-medium uppercase text-black">{analysis.execucao.espacoQGBT ? "SIM" : "NÃO"}</h1>
							</div>
						</div>
					</div>

					<TechnicalAnalysisFiles analysisId={analysisId} />
				</div>
			) : null}
		</div>
	);
}
