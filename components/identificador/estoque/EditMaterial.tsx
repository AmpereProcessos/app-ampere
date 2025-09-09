import React, { useEffect, useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { LoadingButton } from "@/components/utils/Buttons/LoadingButton";

import { useMediaQuery } from "@/lib/hooks/media-query";

import { getErrorMessage } from "@/utils/methods/handlers";
import { updateMaterial } from "@/utils/methods/mutation/materials";
import type { TMaterial } from "@/utils/schemas/materials";

import ErrorComponent from "@/components/utils/ErrorComponent";
import LoadingComponent from "@/components/utils/LoadingComponent";
import type { TAuthSession } from "@/lib/authentication/types";
import type { TMaterialDeletionDataOutput } from "@/pages/api/almoxarifado/materiais/exclusao";
import { uploadFile } from "@/utils/methods/firebase";
import { formatAsSlug } from "@/utils/methods/formatting";
import { useMaterialById, useMaterialDeletionData } from "@/utils/methods/query/materials";
import type { TSimpleAttachment } from "@/utils/methods/uploading";
import Advanced from "./blocos/Advanced";
import MaterialGeneralBlock from "./blocos/General";
import QuantityConfigBlock from "./blocos/QuantityConfig";
import MaterialSuppliersBlock from "./blocos/Suppliers";
import UpdateRegistriesBlock from "./blocos/UpdateRegistriesBlock";

const initialState: TMaterial = { nome: "", nomeTecnico: "", preco: 0, qtde: 0, dataInsercao: new Date().toISOString() };

type EditMaterialProps = {
	session: TAuthSession;
	materialId: string;
	closeModal: () => void;
	callbacks?: {
		onMutate?: () => void;
		onSuccess?: () => void;
		onSettled?: () => void;
	};
};
function EditMaterial({ session, materialId, closeModal, callbacks }: EditMaterialProps) {
	const queryClient = useQueryClient();
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const { data: material, isLoading, isError, isSuccess, error, queryKey } = useMaterialById({ id: materialId });
	const { data: deletionData } = useMaterialDeletionData({ id: materialId });
	const [infoHolder, setInfoHolder] = useState<TMaterial>(initialState);
	const [imageHolder, setImageHolder] = useState<TSimpleAttachment>({ file: null, previewUrl: null });

	function updateInfoHolder(changes: Partial<TMaterial>) {
		setInfoHolder((prev) => ({ ...prev, ...changes }));
	}
	function resetInfoHolder() {
		setInfoHolder(initialState);
	}
	async function handleUpdateMaterial({ id, changes, file }: { id: string; changes: TMaterial; file: TSimpleAttachment["file"] }) {
		let imageUrl = changes.imagemUrl;
		if (file) {
			const { url } = await uploadFile({
				vinculationId: changes.nome,
				fileName: `${formatAsSlug(changes.nome)}-imagem-principal`,
				file: file,
				prefix: "materiais",
			});
			imageUrl = url;
		}
		return await updateMaterial({ id, changes: { ...changes, imagemUrl: imageUrl } });
	}
	const { mutate: handleMaterialUpdateMutation, isPending } = useMutation({
		mutationKey: ["update-material", materialId],
		mutationFn: handleUpdateMaterial,
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey: queryKey });
			if (callbacks?.onMutate) callbacks.onMutate();
		},
		onSuccess: async (data) => {
			if (callbacks?.onSuccess) callbacks.onSuccess();
			resetInfoHolder();
			closeModal();
			return toast.success(data);
		},
		onSettled: async () => {
			await queryClient.invalidateQueries({ queryKey: queryKey });
			if (callbacks?.onSettled) callbacks.onSettled();
		},
		onError: (error) => {
			const msg = getErrorMessage(error);
			return toast.error(msg);
		},
	});
	useEffect(() => {
		if (material) setInfoHolder(material);
	}, [material]);

	const TITLE = "EDITAR MATERIAL";
	const DESCRIPTION = "Preencha os dados do Material.";
	const BUTTON_TEXT = "EDITAR MATERIAL";

	return isDesktop ? (
		<Dialog open={true} onOpenChange={closeModal}>
			<DialogContent className="h-[85vh] w-[80%] min-w-[80%]">
				<DialogHeader>
					<DialogTitle>{TITLE}</DialogTitle>
					<DialogDescription>{DESCRIPTION}</DialogDescription>
				</DialogHeader>
				{isLoading ? <LoadingComponent /> : null}
				{isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
				{isSuccess ? (
					<>
						<div className="flex-1 overflow-auto">
							<MaterialContent
								session={session}
								materialId={materialId}
								infoHolder={infoHolder}
								updateInfoHolder={updateInfoHolder}
								deletionData={deletionData}
								closeModal={closeModal}
								imageHolder={imageHolder}
								setImageHolder={setImageHolder}
							/>
						</div>
						<DialogFooter>
							<DialogClose asChild>
								<Button variant="outline">FECHAR</Button>
							</DialogClose>
							<LoadingButton
								onClick={() => handleMaterialUpdateMutation({ id: materialId, changes: infoHolder, file: imageHolder.file })}
								loading={isPending}
							>
								{BUTTON_TEXT}
							</LoadingButton>
						</DialogFooter>
					</>
				) : null}
			</DialogContent>
		</Dialog>
	) : (
		<Drawer open={true} onOpenChange={closeModal}>
			<DrawerContent className="flex h-[85vh] flex-col">
				<DrawerHeader>
					<DrawerTitle>{TITLE}</DrawerTitle>
					<DrawerDescription>{DESCRIPTION}</DrawerDescription>
				</DrawerHeader>
				{isLoading ? <LoadingComponent /> : null}
				{isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
				{isSuccess ? (
					<>
						<div className="flex-1 overflow-auto">
							<MaterialContent
								session={session}
								materialId={materialId}
								infoHolder={infoHolder}
								updateInfoHolder={updateInfoHolder}
								deletionData={deletionData}
								closeModal={closeModal}
								imageHolder={imageHolder}
								setImageHolder={setImageHolder}
							/>
						</div>
						<DialogFooter>
							<DialogClose asChild>
								<Button variant="outline">FECHAR</Button>
							</DialogClose>
							<LoadingButton
								onClick={() => handleMaterialUpdateMutation({ id: materialId, changes: infoHolder, file: imageHolder.file })}
								loading={isPending}
							>
								{BUTTON_TEXT}
							</LoadingButton>
						</DialogFooter>
					</>
				) : null}
				<DrawerFooter>
					<DrawerClose asChild>
						<Button variant="outline">FECHAR</Button>
					</DrawerClose>

					<LoadingButton onClick={() => handleMaterialUpdateMutation({ id: materialId, changes: infoHolder, file: imageHolder.file })} loading={isPending}>
						{BUTTON_TEXT}
					</LoadingButton>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}

export default EditMaterial;

type MaterialContentProps = {
	session: TAuthSession;
	infoHolder: TMaterial;
	updateInfoHolder: (changes: Partial<TMaterial>) => void;
	materialId: string;
	deletionData?: TMaterialDeletionDataOutput["data"];
	closeModal: () => void;
	imageHolder: TSimpleAttachment;
	setImageHolder: (image: TSimpleAttachment) => void;
};
function MaterialContent({
	session,
	infoHolder,
	updateInfoHolder,
	materialId,
	deletionData,
	closeModal,
	imageHolder,
	setImageHolder,
}: MaterialContentProps) {
	return (
		<div className="flex h-full flex-col gap-3 px-4">
			<MaterialGeneralBlock infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} imageHolder={imageHolder} setImageHolder={setImageHolder} />
			<QuantityConfigBlock infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} />
			<MaterialSuppliersBlock session={session} infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} />
			<UpdateRegistriesBlock materialId={materialId} />
			{deletionData ? <Advanced materialId={materialId} material={infoHolder} deletionData={deletionData} closeModal={closeModal} /> : null}
		</div>
	);
}
