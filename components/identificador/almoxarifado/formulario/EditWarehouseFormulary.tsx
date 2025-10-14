import CheckboxInput from "@/components/inputs/Checkbox";
import SelectInput from "@/components/inputs/Select";
import TextInput from "@/components/inputs/Text";
import ErrorComponent from "@/components/utils/ErrorComponent";
import LoadingPage from "@/components/utils/LoadingPage";
import ResponsiveDialogDrawer from "@/components/utils/ResponsiveDialogDrawer";
import ResponsiveDialogDrawerSection from "@/components/utils/ResponsiveDialogDrawerSection";
import type { TAuthSession } from "@/lib/authentication/types";
import { equipesTecnicas, serviceOrdersCategories } from "@/utils/constants";
import { formatToCEP } from "@/utils/methods/formatting";
import { createExpense } from "@/utils/methods/mutation/expenses";
import { useMutationWithFeedback } from "@/utils/methods/mutation/general-hook";
import { updateManyMaterials } from "@/utils/methods/mutation/materials";
import { deleteWarehouseFormulary, updateWarehouseFormulary } from "@/utils/methods/mutation/warehouse-forms";
import { useWarehouseFormById } from "@/utils/methods/query/warehouse-forms";
import { getCEPInfo } from "@/utils/methods/shared";
import type { TExpense } from "@/utils/schemas/expenses";
import type { TNewWarehouseFormularyDTO, TTransactionalWarehouseFormulary } from "@/utils/schemas/warehouse-formularies";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Code, LayoutGrid, UserRound } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BsCode } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { VscChromeClose } from "react-icons/vsc";
import { estadosECidades } from "../../../../utils/estados_cidades";
import MaterialsBlock from "./MaterialsBlock";
import WarehouseFormularyLocation from "./blocos/WarehouseFormularyLocation";

function getExpensesFromFormulary({ session, info }: { session: TAuthSession; info: TNewWarehouseFormularyDTO }): TExpense {
	const items = info.materiais.map((material) => {
		const item: TExpense["itens"][number] = {
			idMaterial: material.id,
			descricao: material.nome,
			preco: material.preco,
			qtde: material.qtdeRetirada - material.qtdeDevolucao,
			unidade: material.grandeza || "UN",
		};
		return item;
	});
	const total = items.reduce((acc, current) => acc + current.preco * current.qtde, 0);
	return {
		rateio: "CUSTOS DIRETOS",
		categoria: "INSUMOS DE ALMOXARIFADO",
		descricao: info.titulo,
		projeto: {
			id: info.projeto.id,
			nome: info.projeto.nome,
			identificador: info.projeto.identificador, // identificador QTDE do projeto no banco de projetos
			tipo: "",
		},
		idFormularioAlmoxarifado: info._id || "",
		autor: {
			id: session.user.id,
			nome: session.user.nome,
			avatar_url: session.user.avatar_url,
		},
		itens: items,
		total: total,
		efetivacao: {
			efetivado: true,
			data: new Date().toISOString(),
		},
		criterioCompetencia: true,
		criterioReferencia: false,
		pagamentos: [],
		dataInsercao: new Date().toISOString(),
	};
}
type EditFormProps = {
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
function EditForm({ formularyId, session, closeModal, callbacks }: EditFormProps) {
	const queryClient = useQueryClient();
	const [externalResponsible, setExternalResponsible] = useState<boolean>(false);

	const { data: formulary, isLoading, isError, isSuccess } = useWarehouseFormById({ id: formularyId });

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

	async function handleFormularyConclusion() {
		// Formatting updates for material devolution
		const updates = infoHolder.materiais
			.filter((m) => !!m.id)
			.map((material) => {
				return {
					id: material.id as string,
					nome: material.nome,
					diferenca: material.qtdeDevolucao,
				};
			});
		// Getting an expense object to create expense from materials take away
		const expense = getExpensesFromFormulary({ session, info: infoHolder });
		const project = infoHolder.projeto;

		// Calling method for stock quantities update
		await updateManyMaterials({ formularyId, project, updates });
		// Calling method to generate a expense from formulary
		await createExpense({ ...expense });
		// Calling method for the update of the formulary itself
		await updateWarehouseFormulary({
			warehouseFormularyId: formularyId,
			warehouseFormulary: { ...infoHolder, dataEfetivacao: new Date().toISOString() },
		});

		return "Formulário de saída de materiais finalizado com sucesso !";
	}

	async function handleFormularyDelete() {
		try {
			const project = infoHolder.projeto;

			const devolutionLoadingToastId = toast.loading("Devolvendo todos os materiais usados.");
			// Formatting updates for material devolution
			const updates = infoHolder.materiais
				.filter((m) => !!m.id)
				.map((material) => {
					return {
						id: material.id as string,
						nome: material.nome,
						diferenca: material.qtdeRetirada - material.qtdeDevolucao, // returning to stock only what wasnt already returned (qtdeDevolucao) in a finished formulary
					};
				})
				.filter((u) => u.diferenca !== 0);
			await updateManyMaterials({ formularyId, project, updates });
			toast.dismiss(devolutionLoadingToastId);

			const deleteLoadingToastId = toast.loading("Excluindo formulário.");
			const deleteResponse = await deleteWarehouseFormulary({ warehouseFormularyId: formularyId });
			toast.dismiss(deleteLoadingToastId);
			return deleteResponse;
		} catch (error) {
			toast.dismiss();
			throw error;
		}
	}
	const { mutate: handleConclusion, isPending: loadingConclusion } = useMutationWithFeedback({
		mutationKey: ["conclude-warehouse-formulary", formularyId],
		mutationFn: handleFormularyConclusion,
		queryClient: queryClient,
		affectedQueryKey: ["warehouse-form-by-id", formularyId],
		callbackFn: () => callbacks?.onSettled?.(),
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
			return toast.success(data.message);
		},
		onSettled: async () => {
			await queryClient.invalidateQueries({ queryKey: ["warehouse-form-by-id", formularyId] });
			if (callbacks?.onSettled) callbacks.onSettled();
		},
		onError: async (error) => {
			if (callbacks?.onError) callbacks.onError(error);
		},
	});
	const { mutate: handleDelete, isPending: loadingDelete } = useMutationWithFeedback({
		mutationKey: ["delete-warehouse-formulary", formularyId],
		mutationFn: handleFormularyDelete,
		queryClient: queryClient,
		affectedQueryKey: ["warehouse-form-by-id", formularyId],
		callbackFn: () => {
			if (callbacks?.onSettled) callbacks.onSettled();
			closeModal();
		},
	});

	const isFormularyFinished = !!infoHolder.dataEfetivacao;
	const userHasOverallEditingPermission = session.user.permissoes.execucao.editar;
	useEffect(() => {
		if (formulary) setInfoHolder(formulary as TNewWarehouseFormularyDTO);
	}, [formulary]);

	return (
		<ResponsiveDialogDrawer
			menuTitle="ATUALIZAR FORMULÁRIO"
			menuDescription="Preencha os campos abaixo para atualizar o formulário."
			menuActionButtonText="ATUALIZAR FORMULÁRIO"
			menuCancelButtonText="CANCELAR"
			actionFunction={() => handleUpdate({ warehouseFormularyId: formularyId, warehouseFormulary: infoHolder })}
			actionIsPending={loadingUpdate}
			stateIsLoading={isLoading}
			closeMenu={closeModal}
			dialogVariant="md"
		>
			<div className="w-full flex flex-col items-center justify-center">
				<div className="flex items-center gap-2 px-2 py-1 rounded-md bg-primary/20">
					<Code className="h-4 w-4 min-h-4 min-w-4" />
					<p className="text-xs font-medium">{formularyId}</p>
				</div>
			</div>
			<div className="w-full flex flex-col items-center justify-center">
				<div className="w-fit">
					<CheckboxInput
						labelFalse="FINALIZADO"
						labelTrue="FINALIZADO"
						checked={infoHolder.dataEfetivacao !== null}
						handleChange={(value) => setInfoHolder((prev) => ({ ...prev, dataEfetivacao: value ? new Date().toISOString() : null }))}
					/>
				</div>
			</div>

			<TextInput
				label="TITULO DO FORMULÁRIO"
				editable={!isFormularyFinished}
				placeholder="Preencha aqui um titulo para identificação e filtro desse formulário posteriomente..."
				value={infoHolder.titulo}
				handleChange={(value) => setInfoHolder((prev) => ({ ...prev, titulo: value }))}
				width="100%"
			/>
			{infoHolder.projeto ? (
				<ResponsiveDialogDrawerSection sectionTitleText="PROJETO" sectionTitleIcon={<LayoutGrid className="h-4 w-4 min-h-4 min-w-4" />}>
					<div className="flex flex-col gap-2">
						<div className="flex items-center gap-1">
							<Code className="h-4 w-4 min-h-4 min-w-4" />
							<p className="text-sm font-semibold tracking-tight">#{infoHolder.projeto.id || "N/A"}</p>
						</div>
						<div className="flex items-center gap-1">
							<UserRound className="h-4 w-4 min-h-4 min-w-4" />
							<p className="text-sm font-semibold tracking-tight">{infoHolder.projeto.nome || "N/A"}</p>
						</div>
					</div>
				</ResponsiveDialogDrawerSection>
			) : null}
			<div className="my-2 flex w-full items-center justify-center">
				<CheckboxInput
					labelFalse="RESPONSÁVEL INTERNO"
					labelTrue="RESPONSÁVEL INTERNO"
					checked={!externalResponsible}
					handleChange={(value) => {
						setExternalResponsible((prev) => !prev);
					}}
				/>
			</div>
			<div className="flex w-full flex-col gap-2 lg:flex-row">
				<div className="w-full lg:w-1/2">
					<SelectInput
						label="CATEGORIA"
						value={infoHolder.categoria}
						options={serviceOrdersCategories}
						selectedItemLabel="NÃO DEFINIDO"
						handleChange={(value) => setInfoHolder((prev) => ({ ...prev, categoria: value }))}
						onReset={() => setInfoHolder((prev) => ({ ...prev, categoria: "" }))}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/2">
					{externalResponsible ? (
						<TextInput
							label="RESPONSÁVEL(IS)"
							placeholder="Preencha aqui o nome dos responsáveis pelo material.."
							value={infoHolder.responsaveis}
							handleChange={(value) => setInfoHolder((prev) => ({ ...prev, responsaveis: value }))}
							width="100%"
						/>
					) : (
						<SelectInput
							label="RESPONSÁVEL(IS)"
							value={infoHolder.responsaveis}
							options={equipesTecnicas}
							selectedItemLabel="NÃO DEFINIDO"
							handleChange={(value) => setInfoHolder((prev) => ({ ...prev, responsaveis: value }))}
							onReset={() => setInfoHolder((prev) => ({ ...prev, responsaveis: "" }))}
							width="100%"
						/>
					)}
				</div>
			</div>

			<MaterialsBlock
				formularyId={formularyId}
				formHolder={infoHolder}
				setFormHolder={setInfoHolder as React.Dispatch<React.SetStateAction<TTransactionalWarehouseFormulary>>}
				blockTakeAway={true}
				blockDevolution={false}
				allowPostFinishEditing={userHasOverallEditingPermission}
			/>

			<WarehouseFormularyLocation infoHolder={infoHolder} updateInfoHolder={(changes) => setInfoHolder((prev) => ({ ...prev, ...changes }))} />
		</ResponsiveDialogDrawer>
	);
}

export default EditForm;
