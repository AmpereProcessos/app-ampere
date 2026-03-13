import type { TServiceOrder, TServiceOrderTagDTO } from "@/utils/schemas/service-order";
import { GeneralTagsHolder } from "@/components/identificador/etiquetas/TagsMenu";
import type { TAuthSession } from "@/lib/authentication/types";
import ResponsiveDialogDrawerSection from "@/components/utils/ResponsiveDialogDrawerSection";
import { LayoutGrid } from "lucide-react";

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
		<ResponsiveDialogDrawerSection sectionTitleText="ETIQUETAS DA ORDEM DE SERVIÇO" sectionTitleIcon={<LayoutGrid size={15} />}>
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
		</ResponsiveDialogDrawerSection>
	);
}

export default ServiceOrderTagsBlock;
