import { cn } from "@/lib/utils";
import type { TProject } from "@/utils/schemas/projects";
import { Tag } from "lucide-react";

type ProjectCardsTagsProps = {
	projectTags: TProject["etiquetas"];
};

function ProjectCardsTags({ projectTags }: ProjectCardsTagsProps) {
	return projectTags && projectTags.length > 0 ? (
		<div className="flex w-full flex-wrap items-center justify-start gap-2 lg:grow">
			<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80 ">ETIQUETAS</h1>
			{projectTags.map((tag, index) => (
				<div
					key={`${tag.id}-${index}`}
					style={{
						border: "1px solid",
						borderColor: tag.cores.primaria,
						color: tag.cores.primaria,
						backgroundColor: tag.cores.secundaria,
					}}
					className={cn("flex items-center gap-1 rounded px-2 py-0.5")}
				>
					<Tag width={10} height={10} />
					<h1 className="text-xxs font-bold tracking-tight">{tag.titulo}</h1>
				</div>
			))}
		</div>
	) : null;
}

export default ProjectCardsTags;
