import type { TServiceOrder, TServiceOrderTagDTO } from "@/utils/schemas/service-order";
import { GeneralTagsHolder } from "@/components/identificador/etiquetas/TagsMenu";
import type { TAuthSession } from "@/lib/authentication/types";

type ServiceOrderTagsBlockProps = {
	session: TAuthSession;
	infoHolder: TServiceOrder;
	updateInfoHolder: (changes: Partial<TServiceOrder>) => void;
};
function ServiceOrderTagsBlock({ session, infoHolder, updateInfoHolder }: ServiceOrderTagsBlockProps) {
	function handleAddTag(tag: TServiceOrderTagDTO) {
		const tagFormatted: Exclude<TServiceOrder["etiquetas"], undefined | null>[number] = { id: tag._id, titulo: tag.titulo, cores: tag.cores };
		updateInfoHolder({ etiquetas: [...(infoHolder.etiquetas || []), tagFormatted] });
	}
	function handleRemoveTag(tagId: string) {
		updateInfoHolder({ etiquetas: (infoHolder.etiquetas || []).filter((e) => e.id !== tagId) });
	}
	return (
		<div className="flex w-full grow flex-col gap-4">
			<h1 className="w-full rounded bg-primary p-1 text-center font-bold text-primary-foreground">ETIQUETAS DA ORDEM DE SERVIÇO</h1>
			<GeneralTagsHolder
				session={session}
				applicableTagsIds={infoHolder.etiquetas?.map((c) => c.id) || []}
				handleAddTag={(tag) =>
					handleAddTag({
						_id: tag._id,
						titulo: tag.titulo,
						cores: tag.cores,
						dataInsercao: new Date().toISOString(),
					})
				}
				handleRemoveTag={handleRemoveTag}
				entities={{
					compras: true,
				}}
			/>
		</div>
	);
}

export default ServiceOrderTagsBlock;
