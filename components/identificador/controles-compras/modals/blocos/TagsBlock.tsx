import type { TPurchaseControl, TPurchaseControlTag, TPurchaseControlTagDTO } from "@/utils/schemas/purchases";

import React, { useState, type Dispatch, type SetStateAction } from "react";

import { GeneralTagsHolder } from "@/components/identificador/etiquetas/TagsMenu";
import type { TAuthSession } from "@/lib/authentication/types";
type PurchaseControlTagsBlockProps = {
	session: TAuthSession;
	infoHolder: TPurchaseControl;
	setInfoHolder: Dispatch<SetStateAction<TPurchaseControl>>;
};
function PurchaseControlTagsBlock({ session, infoHolder, setInfoHolder }: PurchaseControlTagsBlockProps) {
	function handleAddTag(tag: TPurchaseControlTagDTO) {
		const tagFormatted: TPurchaseControl["etiquetas"][number] = { id: tag._id, titulo: tag.titulo, cores: tag.cores };
		setInfoHolder((prev) => ({ ...prev, etiquetas: [...prev.etiquetas, tagFormatted] }));
	}
	function handleRemoveTag(id: string) {
		setInfoHolder((prev) => ({ ...prev, etiquetas: prev.etiquetas.filter((e) => e.id !== id) }));
	}
	return (
		<div className="flex w-full grow flex-col gap-4">
			<h1 className="w-full rounded bg-primary p-1 text-center font-bold text-primary-foreground">ETIQUETAS DA COMPRA</h1>
			<GeneralTagsHolder
				session={session}
				applicableTagsIds={infoHolder.etiquetas.map((c) => c.id)}
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

export default PurchaseControlTagsBlock;
