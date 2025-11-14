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
			<h1 className="bg-primary text-primary-foreground w-full rounded p-1 text-center font-bold">INFORMAÇÕES DA ANÁLISE TÉCNICA</h1>
			{technicalAnalysisId ? (
				<div className="flex w-full flex-col gap-2">
					<div className="flex w-full items-center justify-center">
						<button
							type="button"
							onClick={() => setTechnicalAnalysisBlockIsOpen((prev) => !prev)}
							className={cn("flex items-center gap-1 rounded-lg px-2 py-1 text-black duration-300 ease-in-out", {
								"bg-primary/20 hover:bg-red-300": technicalAnalysisBlockIsOpen,
								"bg-green-300 hover:bg-green-400": !technicalAnalysisBlockIsOpen,
							})}
						>
							<TbReportAnalytics />
							<h1 className="text-xs font-medium tracking-tight">
								{!technicalAnalysisBlockIsOpen ? "ABRIR INFORMAÇÕES DA ANÁLISE TÉCNICA" : "FECHAR INFORMAÇÕES DA ANÁLISE TÉCNICA"}
							</h1>
						</button>
					</div>
					{technicalAnalysisBlockIsOpen ? <TechnicalAnalysisBlock analysisId={technicalAnalysisId} /> : null}
				</div>
			) : (
				<div className="text-primary/80 w-full text-center text-sm font-medium tracking-tight">Nenhuma Análise Técnica vinculada.</div>
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
						<h1 className="font-raleway text-primary/60 text-xs font-bold">ANALISTA</h1>
						<Avatar url={analysis.analista?.avatar_url} fallback={"A"} height={30} width={30} />
						<p className="text-primary/60 text-sm font-medium">{analysis.analista?.apelido || "NÃO DEFINIDO"}</p>
					</div>
					<div className="flex w-full flex-wrap justify-around">
						<div className="border-primary/60 flex flex-col rounded-md border p-3">
							<p className="text-primary/60 text-[0.6rem] leading-none font-medium tracking-tight uppercase">TIPO DE TELHA</p>
							<h1 className="text-center text-xs font-medium text-black uppercase">{analysis.detalhes.tipoTelha}</h1>
						</div>
						<div className="border-primary/60 flex flex-col rounded-md border p-3">
							<p className="text-primary/60 text-[0.6rem] leading-none font-medium tracking-tight uppercase">TIPO DA ESTRUTURA</p>
							<h1 className="text-center text-xs font-medium text-black uppercase">{analysis.detalhes.tipoEstrutura}</h1>
						</div>
						<div className="border-primary/60 flex flex-col rounded-md border p-3">
							<p className="text-primary/60 text-[0.6rem] leading-none font-medium tracking-tight uppercase">MATERIAL DA ESTRUTURA</p>
							<h1 className="text-center text-xs font-medium text-black uppercase">{analysis.detalhes.materialEstrutura}</h1>
						</div>
						<div className="border-primary/60 flex flex-col rounded-md border p-3">
							<p className="text-primary/60 text-[0.6rem] leading-none font-medium tracking-tight uppercase">ORIENTAÇÃO DA ESTRUTURA</p>
							<h1 className="text-center text-xs font-medium text-black uppercase">{analysis.detalhes.orientacao || "-"}</h1>
						</div>
						<div className="border-primary/60 flex flex-col rounded-md border p-3">
							<p className="text-primary/60 text-[0.6rem] leading-none font-medium tracking-tight uppercase">CONCESSIONÁRIA</p>
							<h1 className="text-center text-xs font-medium text-black uppercase">{analysis.detalhes.concessionaria}</h1>
						</div>
					</div>
					<div className="flex w-full flex-col gap-1">
						<h1 className="w-full rounded-sm bg-[#fead41] p-1 text-center font-bold text-white">EXECUÇÃO</h1>
						<div className="mt-2 flex flex-col gap-1">
							<h1 className="text-primary/60 text-sm leading-none font-medium tracking-tight">OBSERVAÇÕES P/ EXECUÇÃO</h1>
							<div className="overscroll-y scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 text-primary/60 bg-primary/20 flex h-[50px] max-h-[50px] w-full items-center justify-center overflow-y-auto rounded-md border border-cyan-500 p-3 text-center text-sm">
								{analysis.execucao?.observacoes}
							</div>
						</div>
						<div className="mt-4 flex w-full flex-wrap justify-around">
							<div className="border-primary/60 flex flex-col rounded-md border p-3">
								<p className="text-primary/60 text-[0.6rem] leading-none font-medium tracking-tight uppercase">LOCAL DE INSTALAÇÃO DO INVERSOR</p>
								<h1 className="text-center text-xs font-medium text-black uppercase">{analysis.locais.inversor || "-"}</h1>
							</div>
							<div className="border-primary/60 flex flex-col rounded-md border p-3">
								<p className="text-primary/60 text-[0.6rem] leading-none font-medium tracking-tight uppercase">LOCAL DE INSTALAÇÃO DOS MÓDULOS</p>
								<h1 className="text-center text-xs font-medium text-black uppercase">{analysis.locais.modulos || "-"}</h1>
							</div>
							<div className="border-primary/60 flex flex-col rounded-md border p-3">
								<p className="text-primary/60 text-[0.6rem] leading-none font-medium tracking-tight uppercase">LOCAL DE ATERRAMENTO</p>
								<h1 className="text-center text-xs font-medium text-black uppercase">{analysis.locais.aterramento || "-"}</h1>
							</div>
							<div className="border-primary/60 flex flex-col rounded-md border p-3">
								<p className="text-primary/60 text-[0.6rem] leading-none font-medium tracking-tight uppercase">POSSUI ESPAÇO NO QGBT</p>
								<h1 className="text-center text-xs font-medium text-black uppercase">{analysis.execucao.espacoQGBT ? "SIM" : "NÃO"}</h1>
							</div>
						</div>
					</div>

					<TechnicalAnalysisFiles analysisId={analysisId} />
				</div>
			) : null}
		</div>
	);
}
