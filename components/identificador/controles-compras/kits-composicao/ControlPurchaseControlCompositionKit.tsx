import TextInput from "@/components/inputs/Text";
import ResponsiveDialogDrawer from "@/components/utils/ResponsiveDialogDrawer";
import type { TAuthSession } from "@/lib/authentication/types";
import { useMediaQuery } from "@/lib/hooks/media-query";
import { getErrorMessage } from "@/utils/methods/handlers";
import { createPurchaseControlCompositionKit } from "@/utils/methods/mutation/purchase-controls";
import { usePurchaseControlCompositionKitById } from "@/utils/methods/query/purchase-controls";
import type { TPurchaseControlCompositionKit } from "@/utils/schemas/purchases";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import PurchaseControlCompositionKitItemBlock from "./ItensBlock";

type NewPurchaseControlCompositionKitProps = {
	purchaseControlCompositionKitId: string;
	session: TAuthSession;
	closeModal: () => void;
	callbacks?: {
		onMutate?: () => void;
		onSuccess?: () => void;
		onError?: (error: Error) => void;
		onSettled?: () => void;
	};
};
function NewPurchaseControlCompositionKit({ purchaseControlCompositionKitId, callbacks, closeModal }: NewPurchaseControlCompositionKitProps) {
	const queryClient = useQueryClient();
	const isDesktop = useMediaQuery("(min-width: 768px)");

	const {
		data: purchaseControlCompositionKit,
		queryKey,
		isLoading,
		isError,
		isSuccess,
		error,
	} = usePurchaseControlCompositionKitById({ id: purchaseControlCompositionKitId });
	const initialInfoHolder = {
		titulo: "",
		itens: [],
		dataInsercao: new Date().toISOString(),
	};
	const [infoHolder, setInfoHolder] = useState<TPurchaseControlCompositionKit>(initialInfoHolder);

	function updateData(changes: Partial<TPurchaseControlCompositionKit>) {
		setInfoHolder((prev) => ({
			...prev,
			...changes,
		}));
	}

	function addItem(item: TPurchaseControlCompositionKit["itens"][number]) {
		setInfoHolder((prev) => ({
			...prev,
			itens: [...prev.itens, item],
		}));
	}
	function updateItem({ index, changes }: { index: number; changes: Partial<TPurchaseControlCompositionKit["itens"][number]> }) {
		setInfoHolder((prev) => ({
			...prev,
			itens: prev.itens.map((item, i) => (i === index ? { ...item, ...changes } : item)),
		}));
	}

	function removeItem(index: number) {
		setInfoHolder((prev) => ({
			...prev,
			itens: prev.itens.filter((_, i) => i !== index),
		}));
	}

	const { mutate: handleCreatePurchaseControlCompositionKit, isPending } = useMutation({
		mutationKey: ["create-composition-kit"],
		mutationFn: createPurchaseControlCompositionKit,
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey: queryKey });
			if (callbacks?.onMutate) callbacks.onMutate();
		},
		onSuccess: async (data) => {
			if (callbacks?.onSuccess) callbacks.onSuccess();
			setInfoHolder(initialInfoHolder);
			return toast.success(data);
		},
		onSettled: async () => {
			await queryClient.invalidateQueries({ queryKey: queryKey });
			if (callbacks?.onSettled) callbacks.onSettled();
		},
		onError: async (error) => {
			if (callbacks?.onError) callbacks.onError(error);
		},
	});
	useEffect(() => {
		if (purchaseControlCompositionKit) {
			setInfoHolder(purchaseControlCompositionKit);
		}
	}, [purchaseControlCompositionKit]);
	const TITLE = "NOVO KIT";
	const DESCRIPTION = "Preencha alguns dados sobre o kit.";
	const BUTTON_TEXT = "ADICIONAR KIT";
	return (
		<ResponsiveDialogDrawer
			menuTitle={TITLE}
			menuDescription={DESCRIPTION}
			menuActionButtonText={BUTTON_TEXT}
			menuCancelButtonText="FECHAR"
			closeMenu={closeModal}
			actionFunction={() => handleCreatePurchaseControlCompositionKit(infoHolder)}
			stateIsLoading={isLoading}
			stateError={error ? getErrorMessage(error) : null}
			actionIsPending={isPending}
			dialogVariant="md"
		>
			<PurchaseControlCompositionKitData data={infoHolder} updateData={updateData} addItem={addItem} updateItem={updateItem} removeItem={removeItem} />
		</ResponsiveDialogDrawer>
	);
}

export default NewPurchaseControlCompositionKit;

type PurchaseControlCompositionKitDataProps = {
	data: TPurchaseControlCompositionKit;
	updateData: (changes: Partial<TPurchaseControlCompositionKit>) => void;
	addItem: (item: TPurchaseControlCompositionKit["itens"][number]) => void;
	updateItem: (info: { index: number; changes: Partial<TPurchaseControlCompositionKit["itens"][number]> }) => void;
	removeItem: (index: number) => void;
};
function PurchaseControlCompositionKitData({ data, updateData, addItem, updateItem, removeItem }: PurchaseControlCompositionKitDataProps) {
	return (
		<div className="flex h-full flex-col gap-y-2">
			<TextInput
				label={"NOME DO KIT"}
				value={data.titulo}
				handleChange={(value) => updateData({ titulo: value })}
				placeholder="Preencha aqui o nome do kit..."
				width="100%"
			/>
			<PurchaseControlCompositionKitItemBlock items={data.itens} updateItem={updateItem} removeItem={removeItem} addItem={addItem} />
		</div>
	);
}
