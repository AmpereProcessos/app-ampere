import type { TAuthSession } from "@/lib/authentication/types";
import type { TProjectDTO } from "@/utils/schemas/projects";
import { Tags } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { GeneralTagsHolder } from "../identificador/etiquetas/TagsMenu";

type InfoEtiquetasBlockProps = {
	session: TAuthSession;
	infoHolder: TProjectDTO;
	setInfo: Dispatch<SetStateAction<TProjectDTO>>;
	changes: { [key: string]: any };
	setChanges: Dispatch<SetStateAction<{ [key: string]: any }>>;
};
function InfoEtiquetasBlock({ session, infoHolder, setInfo, changes, setChanges }: InfoEtiquetasBlockProps) {
	function handleAddTag(tag: Exclude<TProjectDTO["etiquetas"], undefined | null>[number]) {
		const previousTags = infoHolder.etiquetas || [];
		setInfo((prev) => ({ ...prev, etiquetas: [...previousTags, tag] }));
		setChanges((prev) => ({ ...prev, etiquetas: [...previousTags, tag] }));
	}
	function handleRemoveTag(tagId: string) {
		const previousTags = infoHolder.etiquetas || [];
		setInfo((prev) => ({
			...prev,
			etiquetas: previousTags.filter((t) => t.id !== tagId),
		}));
		setChanges((prev) => ({
			...prev,
			etiquetas: previousTags.filter((t) => t.id !== tagId),
		}));
	}

	return (
		<div className="flex flex-col rounded-md border border-primary pb-2 shadow-lg gap-6">
			<div className="flex items-center gap-2 bg-primary/20 px-2 py-2 rounded w-full justify-center">
				<Tags className="h-4 w-4 min-h-4 min-w-4" />
				<h1 className="text-xs tracking-tight font-medium text-start w-fit">ETIQUETAS DO PROJETO</h1>
			</div>
			<GeneralTagsHolder
				session={session}
				applicableTagsIds={infoHolder.etiquetas?.map((c) => c.id) || []}
				handleAddTag={(tag) =>
					handleAddTag({
						id: tag._id,
						titulo: tag.titulo,
						cores: tag.cores,
						dataInsercao: new Date().toISOString(),
					})
				}
				handleRemoveTag={handleRemoveTag}
				entities={{
					projetos: true,
				}}
			/>
		</div>
	);
}

export default InfoEtiquetasBlock;
