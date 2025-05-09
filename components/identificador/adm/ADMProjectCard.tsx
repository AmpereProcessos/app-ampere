import { TProjectADMSimplifiedWithRevenue } from "@/pages/api/projects/adm";
import React from "react";
import { motion } from "framer-motion";
import TagTipoDeServico from "@/components/TagTipoDeServico";
import { formatDateAsLocale } from "@/utils/methods/formatting";
import { BsCircleHalf, BsFillPatchCheckFill } from "react-icons/bs";
import { TRevenueDTO } from "@/utils/schemas/revenues";
import { TbAlertHexagon } from "react-icons/tb";
import { MdOutlineAssignmentLate } from "react-icons/md";
import ProjectCardsTags from "@/components/utils/ProjectCardsTags";

function renderPendencyStatus({ fractionnement }: { fractionnement: TRevenueDTO["fracionamento"] }) {
	const hasFractionnement = fractionnement.length > 0;
	if (!hasFractionnement)
		return (
			<div className="flex items-center gap-2">
				<TbAlertHexagon color="#6c757d" />
				<p className="text-[0.65rem] font-medium text-gray-500  lg:text-xs">SEM FRACIONAMENTOS</p>
			</div>
		);

	const hasPendency = fractionnement.some((fraction) => !fraction.dataRecebimento);
	if (!hasPendency)
		return (
			<div className="flex items-center gap-2">
				<BsFillPatchCheckFill color="#2c6e49" />
				<p className="text-[0.65rem] font-medium text-gray-500  lg:text-xs">TOTALMENTE RECEBIDO</p>
			</div>
		);

	return (
		<div className="flex items-center gap-2">
			<MdOutlineAssignmentLate color="#ffbd00" />
			<p className="text-[0.65rem] font-medium text-gray-500 lg:text-xs">RECEBIMENTO PENDENTE</p>
		</div>
	);
}

type ADMProjectCardProps = {
	project: TProjectADMSimplifiedWithRevenue;
	handleClick: (id: string) => void;
	index: number;
};
function ADMProjectCard({ project, handleClick, index }: ADMProjectCardProps) {
	return (
		<motion.div
			initial={{ opacity: 0, translateX: -50, translateY: -35 }}
			animate={{ opacity: 1, translateX: 0, translateY: 0 }}
			transition={{ duration: 0.3, delay: 0.01 * index }}
			onClick={() => {
				handleClick(project._id);
			}}
			key={project._id}
			className="w-full cursor-pointer border border-gray-200 hover:bg-blue-100 md:w-[350px] lg:w-[450px]"
		>
			<TagTipoDeServico tipoDeServico={project.tipoDeServico} />
			<div className="flex flex-col p-2">
				<div className="flex items-center justify-between pb-2">
					<p className="text-xs text-gray-700">{project.nomeDoContrato}</p>
					<p className="text-xs text-[#15599a]">#{project.qtde}</p>
				</div>
				<ProjectCardsTags projectTags={project.etiquetas} />
				<div className="flex items-center justify-between pb-2">
					<div className="flex flex-col items-start gap-1">
						<span className="text-xxs">COBRANÇA GERAL</span>
						<p className={`rounded border p-1 text-xs font-black ${project.pagamento?.cobrancaFeita ? "border border-green-500 text-green-500" : "border border-red-500 text-red-500"}`}>
							{project.pagamento?.cobrancaFeita ? "REALIZADA" : "PENDENTE"}
						</p>
					</div>
					<div className="flex flex-col items-center gap-1">
						<span className="text-xxs">EMPRESA À FATURAR</span>
						<p className={`rounded p-1 text-sm font-bold text-gray-500 `}>{project.faturamento?.empresaFaturamento ? project.faturamento?.empresaFaturamento : "NÃO DEFINIDO"}</p>
					</div>
					<div className="flex flex-col items-end gap-1">
						<span className="text-xxs">FATURAMENTO GERAL</span>
						<p className={`rounded border p-1 text-xs font-black ${project.faturamento?.concluido ? "border border-green-500 text-green-500" : "border border-red-500 text-red-500"}`}>
							{project.faturamento?.concluido ? "REALIZADO" : "PENDENTE"}
						</p>
					</div>
				</div>
				<div className="flex items-center justify-between pb-2">
					<div className="flex flex-col gap-1">
						<span className="text-xxs">SAÍDA DE OBRA</span>
						<p className="text-xs text-yellow-500">{formatDateAsLocale(project.obra.saida) || "-"}</p>
					</div>
					<div className="flex flex-col gap-1">
						<span className="text-end text-xxs">VENDEDOR</span>
						<p className="text-xs text-[#15599a]">{project.vendedor && project.vendedor.nome}</p>
					</div>
				</div>
				<div className="flex items-center justify-between">
					<div className="flex flex-col items-start gap-1">
						<p className="text-xxs">TIPO DE PAGAMENTO</p>
						<p className="text-xs text-gray-600">{project.pagamento?.forma && project.pagamento.forma}</p>
					</div>
					<div className="flex flex-col items-end gap-1">
						<p className="text-end text-xxs">PAGAMENTO DO KIT</p>
						<p className="text-end text-xs text-gray-600">{project.compra?.statusLiberacao ? project.compra.statusLiberacao : "-"}</p>
					</div>
				</div>
				<div className="mt-1 flex w-full flex-wrap items-center justify-between">
					<div className="flex items-center gap-2">
						<BsCircleHalf color="#ed174c" />
						<p className="text-[0.65rem] font-medium leading-none tracking-tight text-gray-500 lg:text-xs">
							{project.receita?.fracionamento?.length || 0} {project.receita && project.receita?.fracionamento.length > 1 ? "RECEBIMENTOS" : "RECEBIMENTO"}
						</p>
					</div>
					{renderPendencyStatus({ fractionnement: project.receita?.fracionamento || [] })}
				</div>
			</div>
		</motion.div>
	);
}

export default ADMProjectCard;
