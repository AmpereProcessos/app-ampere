import ResponsiveDialogDrawer from "@/components/utils/ResponsiveDialogDrawer";
import { getErrorMessage } from "@/utils/methods/handlers";
import { updateTransportControl as updateTransportControlMutation } from "@/utils/methods/mutation/transport-controls";
import { useTransportControlByIdPublic } from "@/utils/methods/query/transport-controls";
import { useTransportControlState } from "@/utils/state/transport-controls";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef } from "react";
import toast from "react-hot-toast";
import CostsBlock from "./blocos/Costs";
import GeneralBlock from "./blocos/General";
import ItemsBlock from "./blocos/Items";
import ResponsiblesBlock from "./blocos/Responsibles";

type EditTransportControlProps = {
	transportControlId: string;
	closeModal: () => void;
	onSuccess?: () => void;
};

export default function EditTransportControl({ transportControlId, closeModal, onSuccess }: EditTransportControlProps) {
	const queryClient = useQueryClient();
	const {
		data: transportControl,
		isLoading,
		isError,
		error,
		isSuccess,
	} = useTransportControlByIdPublic({
		id: transportControlId,
	});

	const hydratedTransportControl = useMemo(() => {
		if (!transportControl) return null;
		const normalizedItems = transportControl.itens.map((item, index) => ({
			id: item.id,
			titulo: item.titulo,
			ordem: item.ordem ?? index + 1,
			projeto: {
				id: item.projeto?.id || item.controleCompra?.projeto?.id || null,
				nome: item.projeto?.nome || item.controleCompra?.projeto?.nome || null,
			},
			anexos:
				item.anexos?.map((anexo) => ({
					idArquivoReferencia: anexo.idArquivoReferencia || "",
					titulo: anexo.titulo || "ANEXO",
					identificador: anexo.identificador ?? null,
					url: anexo.url,
					formato: anexo.formato || "",
					tamanho: anexo.tamanho || 0,
				})) || [],
			dataEfetivacao: item.dataEfetivacao ?? null,
		}));

		const normalizedCosts = transportControl.custos.map((cost) => ({
			descricao: cost.descricao,
			valor: cost.valor,
			anexos:
				cost.anexos?.map((anexo) => ({
					idArquivoReferencia: anexo.idArquivoReferencia || "",
					titulo: anexo.titulo || "ANEXO",
					url: anexo.url,
					formato: anexo.formato || "",
					tamanho: anexo.tamanho || 0,
				})) || [],
		}));

		return {
			identificador: transportControl.identificador,
			titulo: transportControl.titulo,
			responsaveis: transportControl.responsaveis ?? [],
			itens: normalizedItems,
			custos: normalizedCosts,
			configuracoes: transportControl.configuracoes,
			distanciaQuilometragemInicial: transportControl.distanciaQuilometragemInicial ?? null,
			distanciaQuilometragemFinal: transportControl.distanciaQuilometragemFinal ?? null,
			dataInicio: transportControl.dataInicio ?? null,
			dataFim: transportControl.dataFim ?? null,
			dataInsercao: transportControl.dataInsercao,
			autor: transportControl.autor,
		};
	}, [transportControl]);

	const {
		state,
		updateTransportControl,
		addTransportControlItem,
		removeTransportControlItem,
		moveTransportControlItem,
		addTransportControlCost,
		removeTransportControlCost,
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
				distanciaQuilometragemInicial: null,
				distanciaQuilometragemFinal: null,
				dataInicio: null,
				dataFim: null,
				dataInsercao: new Date().toISOString(),
				autor: {
					id: "",
					nome: "",
					avatar_url: null,
				},
			},
		},
	});
	const hasHydratedRef = useRef(false);

	useEffect(() => {
		if (!hydratedTransportControl || hasHydratedRef.current) return;
		updateTransportControl(hydratedTransportControl);
		hasHydratedRef.current = true;
	}, [hydratedTransportControl, updateTransportControl]);

	const { mutate: handleUpdateTransportControl, isPending } = useMutation({
		mutationKey: ["update-transport-control", transportControlId],
		mutationFn: async () =>
			await updateTransportControlMutation({
				transportControlId,
				changes: {
					...state.transportControl,
				},
			}),
		onSuccess: () => {
			toast.success("Controle de transporte atualizado com sucesso!");
			queryClient.invalidateQueries({ queryKey: ["transport-controls"] });
			queryClient.invalidateQueries({ queryKey: ["transport-control-by-id-public", transportControlId] });
			if (onSuccess) onSuccess();
			closeModal();
		},
		onError: (err) => {
			toast.error(getErrorMessage(err));
		},
	});

	return (
		<ResponsiveDialogDrawer
			menuTitle="EDITAR CONTROLE DE TRANSPORTE"
			menuDescription="Atualize as informações do controle de transporte."
			menuActionButtonText="SALVAR ALTERAÇÕES"
			menuCancelButtonText="CANCELAR"
			actionFunction={() => handleUpdateTransportControl()}
			actionIsPending={isPending}
			closeMenu={closeModal}
			stateIsLoading={isLoading}
			stateError={isError ? getErrorMessage(error) : null}
			dialogVariant="md"
		>
			{isSuccess ? (
				<>
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
				</>
			) : null}
		</ResponsiveDialogDrawer>
	);
}
