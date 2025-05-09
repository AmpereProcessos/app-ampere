import type { TProjectDTO } from "@/utils/schemas/projects";
import type { Dispatch, SetStateAction } from "react";
import { GeneralTagsHolder } from "../identificador/etiquetas/TagsMenu";
import type { Session } from "next-auth";

type InfoEtiquetasBlockProps = {
	session: Session;
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
		setInfo((prev) => ({ ...prev, etiquetas: previousTags.filter((t) => t.id !== tagId) }));
		setChanges((prev) => ({ ...prev, etiquetas: previousTags.filter((t) => t.id !== tagId) }));
	}

	return (
		<div className="flex flex-col rounded-md border border-[#15599a] pb-2 shadow-lg">
			<span className="mb-2 w-full rounded-tr-md rounded-tl-md bg-[#15599a] py-2 text-center font-bold text-white">ETIQUETAS DO PROJETO</span>
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
