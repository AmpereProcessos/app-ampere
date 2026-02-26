import ResponsiveDialogDrawer from "@/components/utils/ResponsiveDialogDrawer";
import type { TAuthSession } from "@/lib/authentication/types";
import { createTransportControl } from "@/utils/methods/mutation/transport-controls";
import { useTransportControlState } from "@/utils/state/transport-controls";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import CostsBlock from "./blocos/Costs";
import GeneralBlock from "./blocos/General";
import ItemsBlock from "./blocos/Items";
import ResponsiblesBlock from "./blocos/Responsibles";

type NewTransportControlProps = {
	session: TAuthSession;
	closeModal: () => void;
	callbacks?: {
		onMutate?: () => void;
		onSuccess?: () => void;
		onError?: (error: Error) => void;
		onSettled?: () => void;
	};
};
export default function NewTransportControl({ session, closeModal, callbacks }: NewTransportControlProps) {
	const queryClient = useQueryClient();

	const {
		state,
		updateTransportControl,
		addTransportControlItem,
		removeTransportControlItem,
		moveTransportControlItem,
		addTransportControlItemAttachment,
		removeTransportControlItemAttachment,
		addTransportControlCost,
		removeTransportControlCost,
		addTransportControlCostAttachment,
		removeTransportControlCostAttachment,
	} = useTransportControlState({
		initialState: {
			transportControl: {
				identificador: 0,
				titulo: "",
				responsaveis: [],
				itens: [],
				custos: [],
				configuracoes: {
					custoQuilometragem: 3,
				},
				dataInsercao: new Date().toISOString(),
				autor: {
					id: session.user.id,
					nome: session.user.nome,
					avatar_url: session.user.avatar_url,
				},
			},
		},
	});

	const { mutate: handleCreateTransportControl, isPending } = useMutation({
		mutationKey: ["create-transport-control"],
		mutationFn: createTransportControl,
		onMutate: async () => {
			if (callbacks?.onMutate) callbacks.onMutate();
		},
		onSuccess: async (data) => {
			if (callbacks?.onSuccess) callbacks.onSuccess();
			toast.success(data.message);
			return closeModal();
		},
		onSettled: async () => {
			if (callbacks?.onSettled) callbacks.onSettled();
		},
		onError: async (error) => {
			if (callbacks?.onError) callbacks.onError(error);
		},
	});
	return (
		<ResponsiveDialogDrawer
			menuTitle="NOVO CONTROLE DE TRANSPORTE"
			menuDescription="Crie um novo controle de transporte para o seu projeto."
			menuActionButtonText="CRIAR CONTROLE DE TRANSPORTE"
			menuCancelButtonText="CANCELAR"
			actionFunction={() => {
				return handleCreateTransportControl({
					transportControl: state.transportControl,
				});
			}}
			actionIsPending={isPending}
			closeMenu={() => closeModal()}
			stateIsLoading={false}
			dialogVariant="md"
		>
			<GeneralBlock
				transportControl={state.transportControl}
				updateTransportControl={updateTransportControl}
				addTransportControlItem={addTransportControlItem}
				removeTransportControlItem={removeTransportControlItem}
			/>
			<ResponsiblesBlock responsaveis={state.transportControl.responsaveis} updateTransportControl={updateTransportControl} />
			<ItemsBlock
				items={state.transportControl.itens}
				addItem={addTransportControlItem}
				removeItem={removeTransportControlItem}
				moveItem={moveTransportControlItem}
			/>
			<CostsBlock costs={state.transportControl.custos} addCost={addTransportControlCost} removeCost={removeTransportControlCost} />
		</ResponsiveDialogDrawer>
	);
}
