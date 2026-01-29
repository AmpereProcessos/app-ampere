import ResponsiveDialogDrawer from "@/components/utils/ResponsiveDialogDrawer";
import type { TAuthSession } from "@/lib/authentication/types";
import type { TSupportCall } from "@/utils/schemas/support-calls";
import { useEffect, useState } from "react";

import { getErrorMessage } from "@/utils/methods/handlers";
import { updateSupportCall } from "@/utils/methods/mutation/support-calls";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import ErrorComponent from "@/components/utils/ErrorComponent";
import LoadingComponent from "@/components/utils/LoadingComponent";
import { uploadFile } from "@/utils/methods/firebase";
import { createManyFileReferences } from "@/utils/methods/mutation/crm/file-references";
import { useSupportCallById } from "@/utils/methods/query/support-calls";
import type { TFileReference } from "@/utils/schemas/crm/file-reference.schema";
import { Attachments, General, PowerPlantInfo, type TSupportCallAttachmentHolderItem, WarrantyInfo } from "./Content";

type EditSupportCallProps = {
	callId: string;
	session: TAuthSession;
	closeModal: () => void;
	callbacks?: {
		onMutate?: () => void;
		onError?: () => void;
		onSuccess?: () => void;
		onSettled?: () => void;
	};
};
function EditSupportCall({ session, closeModal, callbacks, callId }: EditSupportCallProps) {
	const { data: supportCall, isLoading, isError, isSuccess, error } = useSupportCallById(callId);
	const [infoHolder, setInfoHolder] = useState<TSupportCall>({
		responsavel: session.user.id,
		statusChamado: "ABERTO",
		tipoChamado: "SUPORTE",
		abertura: new Date().toISOString(),
		responsavelUsuario: {
			id: session.user.id,
			nome: session.user.nome,
			avatar_url: session.user.avatar_url,
		},
	});
	const [attachmentItems, setAttachmentItems] = useState<TSupportCallAttachmentHolderItem[]>([
		{
			title: "NOVO ANEXO...",
			attachments: [],
		},
	]);
	function initializeNewAttachmentItem() {
		setAttachmentItems((prev) => [...prev, { title: "NOVO ANEXO...", attachments: [] }]);
	}

	function clearAttachmentItems() {
		setAttachmentItems([]);
	}
	function updateAttachmentItem(index: number, item: Partial<TSupportCallAttachmentHolderItem>) {
		setAttachmentItems((prev) => prev.map((prevItem, i) => (i === index ? { ...prevItem, ...item } : prevItem)));
	}

	function updateInfoHolder(info: Partial<TSupportCall>) {
		setInfoHolder((prev) => ({ ...prev, ...info }));
	}

	async function handleUpdateSupportCall({
		id,
		info,
		attachments,
	}: {
		id: string;
		info: TSupportCall;
		attachments: TSupportCallAttachmentHolderItem[];
	}) {
		const supportCall = await updateSupportCall({ info: { id, changes: info } });
		const insertedCallId = supportCall.data.updatedId;

		const uploads = attachments.flatMap((item) =>
			item.attachments
				.filter((a) => !!a.file)
				.map((a, aIdx, aArr) => ({
					title: aArr.length > 0 ? `${item.title} (${aIdx + 1})` : item.title,
					callId: item.callId,
					projectId: item.projectId,
					file: a.file as File,
				})),
		);
		// If no valid uploads, return early
		if (uploads.length === 0) return { insertedCallId, message: "Nenhum arquivo enviado." };

		const uploadPromises = uploads.map(async (uploadItem) => {
			const {
				url,
				format: formato,
				size: tamanho,
			} = await uploadFile({ file: uploadItem.file as File, fileName: uploadItem.title, vinculationId: undefined, prefix: "chamado-suporte" });

			const fileReference: TFileReference = {
				titulo: uploadItem.title,
				formato: formato,
				url: url,
				autor: {
					id: session.user.id,
					nome: session.user.nome,
					avatar_url: session.user.avatar_url,
				},
				idProjeto: uploadItem.projectId,
				idChamado: uploadItem.callId,
				dataInsercao: new Date().toISOString(),
			};
			return fileReference;
		});
		const fileReferences = await Promise.all(uploadPromises);
		await createManyFileReferences({ info: fileReferences });

		return { insertedCallId, message: "Chamado de suporte atualizado com sucesso." };
	}
	const { mutate: handleUpdateSupportCallMutation, isPending: updateSupportCallIsPending } = useMutation({
		mutationFn: handleUpdateSupportCall,
		onMutate: async () => {
			callbacks?.onMutate?.();
		},
		onSuccess: (data) => {
			toast.success(data.message);
			callbacks?.onSuccess?.();
		},
		onError: (err) => {
			toast.error(getErrorMessage(err));
			callbacks?.onError?.();
		},
		onSettled: () => {
			callbacks?.onSettled?.();
		},
	});

	useEffect(() => {
		if (supportCall) {
			setInfoHolder({
				...supportCall,
			});
		}
	}, [supportCall]);
	return (
		<ResponsiveDialogDrawer
			menuTitle="EDITAR CHAMADO DE SUPORTE"
			menuDescription="Preencha os campos abaixo para editar o chamado de suporte."
			menuActionButtonText="EDITAR CHAMADO"
			menuCancelButtonText="CANCELAR"
			actionFunction={() => handleUpdateSupportCallMutation({ id: callId, info: infoHolder, attachments: attachmentItems })}
			actionIsPending={updateSupportCallIsPending || !isSuccess}
			stateIsLoading={false}
			closeMenu={closeModal}
			dialogContentClassName="gap-6"
		>
			{isLoading ? <LoadingComponent /> : null}
			{isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
			{isSuccess ? (
				<>
					<General infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} />
					<PowerPlantInfo infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} />
					<WarrantyInfo infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} />
					<Attachments
						session={session}
						projectId={infoHolder.idPai ?? undefined}
						attachments={attachmentItems}
						initializeNewAttachmentItem={initializeNewAttachmentItem}
						updateAttachmentItem={updateAttachmentItem}
						clearAttachmentItems={clearAttachmentItems}
					/>
				</>
			) : null}
		</ResponsiveDialogDrawer>
	);
}

export default EditSupportCall;
