import { Button } from "@/components/ui/button";

import * as Popover from "@radix-ui/react-popover";
import ErrorComponent from "@/components/utils/ErrorComponent";
import { cn } from "@/lib/utils";
import { formatWithoutDiacritics } from "@/utils/methods/formatting";
import { getErrorMessage } from "@/utils/methods/handlers";

import { TagsColorPalette } from "@/utils/select-options";
import { Tag, Tags, X } from "lucide-react";
import React, { useState } from "react";
import { VscChromeClose } from "react-icons/vsc";
import { useMutationWithFeedback } from "@/utils/methods/mutation/general-hook";
import { useQueryClient } from "@tanstack/react-query";
import { LoadingButton } from "@/components/utils/Buttons/LoadingButton";
import type { TServiceOrder, TServiceOrderTagDTO } from "@/utils/schemas/service-order";
import { useServiceOrderTags } from "@/utils/methods/query/service-orders";
import { createServiceOrderTag } from "@/utils/methods/mutation/service-orders";
import { GeneralTagsHolder } from "@/components/identificador/etiquetas/TagsMenu";
import type { Session } from "next-auth";

type ServiceOrderTagsBlockProps = {
	session: Session;
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
