import TagTipoDeServico from "@/components/TagTipoDeServico";
import ProjectCardsTags from "@/components/utils/ProjectCardsTags";
import { ProjectTypesCollors } from "@/utils/constants";
import type { TProjectDTODBSimplified } from "@/utils/schemas/projects";
import React from "react";
import { FaCity, FaPhone, FaSignature, FaTag } from "react-icons/fa";
import { FaDiamond } from "react-icons/fa6";
import { MdDashboard } from "react-icons/md";

function getBarColor(type: string) {
	return ProjectTypesCollors[type as keyof typeof ProjectTypesCollors] || "bg-black";
}

type ProjectDBCardProps = {
	project: TProjectDTODBSimplified;
	handleClick: (id: string) => void;
};
function ProjectDBCard({ project, handleClick }: ProjectDBCardProps) {
	return (
		<div className="bg-background flex w-full rounded-md border md:w-[350px] lg:w-[500px]">
			<div className={`h-full w-[7px] ${getBarColor(project.tipoDeServico)} rounded-tl-md rounded-bl-md`} />
			<div className="flex grow flex-col gap-2 p-3">
				<div className="flex w-full items-center justify-between gap-2">
					<div className="flex items-center gap-1">
						<button
							type="button"
							onClick={() => handleClick(project._id)}
							className="cursor-pointer text-sm leading-none font-black tracking-tight duration-300 ease-in-out hover:text-cyan-500"
						>
							{project.nomeDoContrato}
						</button>
					</div>
					<h1 className="rounded-full bg-black px-2 py-1 text-[0.55rem] font-bold text-white lg:text-xs">{project.qtde}</h1>
				</div>
				<ProjectCardsTags projectTags={project.etiquetas} />
				<div className="flex w-full items-center gap-2">
					<FaDiamond />
					<p className="text-primary/60 text-[0.65rem] leading-none font-medium tracking-tight lg:text-xs">{project.tipoDeServico}</p>
				</div>
				<div className="flex w-full items-center justify-between gap-2">
					<div className="flex items-center gap-2">
						<FaCity />
						<p className="text-primary/60 text-[0.65rem] leading-none font-medium tracking-tight lg:text-xs">
							{project.cidade} {project.uf ? `(${project.uf})` : null}
						</p>
					</div>
					<div className="flex items-center gap-2">
						<FaPhone />
						<p className="text-primary/60 text-[0.65rem] leading-none font-medium tracking-tight lg:text-xs">{project.telefone || "NÃO DEFINIDO"}</p>
					</div>
				</div>
				<div className="flex w-full items-center justify-between gap-2">
					<div className="flex items-center gap-2">
						<FaTag />
						<p className="text-primary/60 text-[0.65rem] leading-none font-medium tracking-tight lg:text-xs">{project.vendedor?.nome || "NÃO DEFINIDO"}</p>
					</div>
					<div className="flex items-center gap-2">
						<FaSignature />
						<p className="text-primary/60 text-[0.65rem] leading-none font-medium tracking-tight lg:text-xs">
							{project.contrato?.status || "NÃO DEFINIDO"}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ProjectDBCard;
