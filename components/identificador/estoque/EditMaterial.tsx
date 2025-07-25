import React, { useEffect, useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { LoadingButton } from "@/components/utils/Buttons/LoadingButton";

import { useMediaQuery } from "@/lib/hooks/media-query";

import { getErrorMessage } from "@/utils/methods/handlers";
import { updateMaterial } from "@/utils/methods/mutation/materials";
import type { TMaterial } from "@/utils/schemas/materials";

import MaterialGeneralBlock from "./blocos/General";
import QuantityConfigBlock from "./blocos/QuantityConfig";
import UpdateRegistriesBlock from "./blocos/UpdateRegistriesBlock";
import { useMaterialById } from "@/utils/methods/query/materials";
const initialState: TMaterial = { nome: "", nomeTecnico: "", preco: 0, qtde: 0, dataInsercao: new Date().toISOString() };

type EditMaterialProps = {
	materialId: string;
	closeModal: () => void;
	callbacks?: {
		onMutate?: () => void;
		onSuccess?: () => void;
		onSettled?: () => void;
	};
};
function EditMaterial({ materialId, closeModal, callbacks }: EditMaterialProps) {
	const queryClient = useQueryClient();
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const { data: material, isLoading, isError, isSuccess, error } = useMaterialById({ id: materialId });
	const [infoHolder, setInfoHolder] = useState<TMaterial>(initialState);
	function updateInfoHolder(changes: Partial<TMaterial>) {
		setInfoHolder((prev) => ({ ...prev, ...changes }));
	}
	function resetInfoHolder() {
		setInfoHolder(initialState);
	}

	const { mutate: handleMaterialUpdate, isPending } = useMutation({
		mutationKey: ["update-material", materialId],
		mutationFn: updateMaterial,
		onMutate: async () => {
			if (callbacks?.onMutate) callbacks.onMutate();
		},
		onSuccess: async (data) => {
			if (callbacks?.onSuccess) callbacks.onSuccess();
			resetInfoHolder();
			closeModal();
			return toast.success(data);
		},
		onSettled: async () => {
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
			<DialogContent className="min-w-[80%] w-[80%] h-[85vh]">
				<DialogHeader>
					<DialogTitle>{TITLE}</DialogTitle>
					<DialogDescription>{DESCRIPTION}</DialogDescription>
				</DialogHeader>
				<div className="flex-1 overflow-auto">
					<MaterialContent materialId={materialId} infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} />
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">FECHAR</Button>
					</DialogClose>
					<LoadingButton onClick={() => handleMaterialUpdate({ id: materialId, changes: infoHolder })} loading={isPending}>
						{BUTTON_TEXT}
					</LoadingButton>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	) : (
		<Drawer open={true} onOpenChange={closeModal}>
			<DrawerContent className="h-[85vh] flex flex-col">
				<DrawerHeader>
					<DrawerTitle>{TITLE}</DrawerTitle>
					<DrawerDescription>{DESCRIPTION}</DrawerDescription>
				</DrawerHeader>
				<div className="flex-1 overflow-auto">
					<MaterialContent materialId={materialId} infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} />
				</div>
				<DrawerFooter>
					<DrawerClose asChild>
						<Button variant="outline">FECHAR</Button>
					</DrawerClose>

					<LoadingButton onClick={() => handleMaterialUpdate({ id: materialId, changes: infoHolder })} loading={isPending}>
						{BUTTON_TEXT}
					</LoadingButton>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}

export default EditMaterial;

type MaterialContentProps = {
	infoHolder: TMaterial;
	updateInfoHolder: (changes: Partial<TMaterial>) => void;
	materialId: string;
};
function MaterialContent({ infoHolder, updateInfoHolder, materialId }: MaterialContentProps) {
	return (
		<div className="flex h-full flex-col gap-3 px-4">
			<MaterialGeneralBlock infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} />
			<QuantityConfigBlock infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} />
			<UpdateRegistriesBlock materialId={materialId} />
		</div>
	);
}
