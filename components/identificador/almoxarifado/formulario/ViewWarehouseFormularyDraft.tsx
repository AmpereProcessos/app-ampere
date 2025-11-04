import ResponsiveDialogDrawer from "@/components/utils/ResponsiveDialogDrawer";
import type { TAuthSession } from "@/lib/authentication/types";
import { formatLocation } from "@/utils/methods/formatting";

import { getErrorMessage } from "@/utils/methods/handlers";

import { updateWarehouseFormulary } from "@/utils/methods/mutation/warehouse-forms";
import { useWarehouseFormById } from "@/utils/methods/query/warehouse-forms";
import type { TNewWarehouseFormularyDTO } from "@/utils/schemas/warehouse-formularies";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Book, Box, Code, Diamond, LayoutGrid, MapPin, Text, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type ViewWarehouseFormularyDraftProps = {
	formularyId: string;
	session: TAuthSession;
	closeModal: () => void;
	callbacks?: {
		onMutate?: () => void;
		onSuccess?: () => void;
		onSettled?: () => void;
		onError?: (error: Error) => void;
	};
};
function ViewWarehouseFormularyDraft({ formularyId, session, closeModal, callbacks }: ViewWarehouseFormularyDraftProps) {
	const queryClient = useQueryClient();

	const { data: formulary, isLoading, isError, isSuccess, error } = useWarehouseFormById({ id: formularyId });

	const [infoHolder, setInfoHolder] = useState<TNewWarehouseFormularyDTO>({
		_id: "holder",
		titulo: "",
		categoria: "",
		responsaveis: "",
		projeto: {
			id: null,
			nome: null,
		},
		localizacao: {
			cep: null,
			uf: null,
			cidade: null,
			bairro: "",
			endereco: "",
			numeroOuIdentificador: "",
			complemento: "",
			distancia: null,
		},
		materiais: [],
		autor: {
			id: session.user.id,
			nome: session.user.nome,
			avatar_url: session.user.avatar_url,
		},
		dataEfetivacao: null,
		dataInsercao: new Date().toISOString(),
	});

	const { mutate: handleUpdate, isPending: loadingUpdate } = useMutation({
		mutationKey: ["edit-warehouse-formulary", formularyId],
		mutationFn: updateWarehouseFormulary,
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey: ["warehouse-form-by-id", formularyId] });
			if (callbacks?.onMutate) callbacks.onMutate();
		},
		onSuccess: async (data) => {
			if (callbacks?.onSuccess) callbacks.onSuccess();
			toast.success(data.message);
			return closeModal();
		},
		onSettled: async () => {
			await queryClient.invalidateQueries({ queryKey: ["warehouse-form-by-id", formularyId] });
			if (callbacks?.onSettled) callbacks.onSettled();
		},
		onError: async (error) => {
			if (callbacks?.onError) callbacks.onError(error);
			return toast.error(getErrorMessage(error));
		},
	});

	useEffect(() => {
		if (formulary) setInfoHolder(formulary as TNewWarehouseFormularyDTO);
	}, [formulary]);

	return (
		<ResponsiveDialogDrawer
			menuTitle="VISUALIZAR"
			menuDescription="Visualize o formulário em rascunho."
			menuActionButtonText="EFETIVAR"
			menuCancelButtonText="CANCELAR"
			actionFunction={() =>
				handleUpdate({ warehouseFormularyId: formularyId, warehouseFormulary: { ...infoHolder, dataInsercao: new Date().toISOString() } })
			}
			actionIsPending={loadingUpdate}
			stateIsLoading={isLoading}
			stateError={isError ? getErrorMessage(error) : null}
			closeMenu={closeModal}
		>
			<div className="w-full flex flex-col items-center justify-center">
				<div className="flex items-center gap-2 px-2 py-1 rounded-md bg-primary/20">
					<Code className="h-4 w-4 min-h-4 min-w-4" />
					<p className="text-xs font-medium">{formularyId}</p>
				</div>
			</div>
			<InformationItem icon={<Text className="h-4 w-4 min-h-4 min-w-4" />} label="TÍTULO" value={infoHolder.titulo} />

			<InformationItem icon={<Diamond className="h-4 w-4 min-h-4 min-w-4" />} label="MATERIAIS" value={infoHolder.categoria} />
			<InformationItem icon={<UsersRound className="h-4 w-4 min-h-4 min-w-4" />} label="RESPONSÁVEIS" value={infoHolder.responsaveis} />
			<InformationItem
				icon={<MapPin className="h-4 w-4 min-h-4 min-w-4" />}
				label="LOCALIZAÇÃO"
				value={formatLocation({
					location: {
						cep: infoHolder.localizacao.cep?.toString() || "",
						uf: infoHolder.localizacao.uf || "",
						cidade: infoHolder.localizacao.cidade || "",
						bairro: infoHolder.localizacao.bairro,
						endereco: infoHolder.localizacao.endereco,
						numeroOuIdentificador: infoHolder.localizacao.numeroOuIdentificador,
					},
					includeCEP: true,
					includeCity: true,
					includeUf: true,
				})}
			/>
			<InformationItem icon={<LayoutGrid className="h-4 w-4 min-h-4 min-w-4" />} label="PROJETO" value={infoHolder.projeto.nome || "N/A"} />
			<InformationItemLists
				icon={<Box className="h-4 w-4 min-h-4 min-w-4" />}
				label="MATERIAIS"
				value={infoHolder.materiais.map((material) => `- ${material.qtdeRetirada}x ${material.nome}`)}
			/>
		</ResponsiveDialogDrawer>
	);
}

export default ViewWarehouseFormularyDraft;

function InformationItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
	return (
		<div className="w-full flex flex-col gap-1">
			<div className="w-full flex items-center gap-1.5">
				{icon}
				<h3 className="text-sm font-bold tracking-tighter text-primary/80">{label}</h3>
			</div>
			<h3 className="text-sm tracking-tight">{value}</h3>
		</div>
	);
}
function InformationItemLists({ icon, label, value }: { icon: React.ReactNode; label: string; value: string[] }) {
	return (
		<div className="w-full flex flex-col gap-1">
			<div className="w-full flex items-center gap-1.5">
				{icon}
				<h3 className="text-sm font-bold tracking-tighter text-primary/80">{label}</h3>
			</div>
			<div className="w-full flex flex-col gap-1.5">
				{value.map((item) => (
					<div className="w-full flex items-center gap-1.5" key={item}>
						<h3 className="text-sm tracking-tight">{item}</h3>
					</div>
				))}
			</div>
		</div>
	);
}
