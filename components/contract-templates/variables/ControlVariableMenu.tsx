import ResponsiveDialogDrawer from "@/components/utils/ResponsiveDialogDrawer";
import type { TAuthSession } from "@/lib/authentication/types";
import { getErrorMessage } from "@/utils/methods/handlers";
import { createContractTemplateVariable, updateContractTemplateVariable } from "@/utils/methods/mutation/contract-templates-variables";
import { useContractTemplateVariableById } from "@/utils/methods/query/contract-templates-variables";
import type { TMutationCallbacks } from "@/utils/methods/shared";
import { useContractTemplateVariableState } from "@/utils/state/contract-template-variable";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import toast from "react-hot-toast";
import ContractTemplatesVariableGeneral from "./blocks/General";
import ContractTemplatesVariableValue from "./blocks/Value";

type ControlVariableMenuProps = {
	variableId: string;
	session: TAuthSession;
	closeMenu: () => void;
	callbacks?: TMutationCallbacks;
};
function ControlContractTemplateVariableMenu({ variableId, session, closeMenu, callbacks }: ControlVariableMenuProps) {
	const queryClient = useQueryClient();
	const {
		data: variable,
		queryKey,
		isLoading,
		isError,
		isSuccess,
		error,
	} = useContractTemplateVariableById({
		id: variableId,
	});
	const { state, updateVariable, addVariableConditional, removeVariableConditional, updateVariableConditional, redefineState } =
		useContractTemplateVariableState({
			initialState: {
				variable: variable,
			},
		});

	const { mutate: handleUpdateContractTemplateVariableMutation, isPending } = useMutation({
		mutationKey: ["update-contract-template-variable"],
		mutationFn: updateContractTemplateVariable,
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey });
			if (callbacks?.onMutate) callbacks.onMutate();
		},
		onSuccess: async (data) => {
			if (callbacks?.onSuccess) callbacks.onSuccess();
			return toast.success(data.message);
		},
		onSettled: async () => {
			if (callbacks?.onSettled) callbacks.onSettled();
			queryClient.invalidateQueries({ queryKey });
		},
		onError: (error) => {
			if (callbacks?.onError) callbacks.onError();
			return toast.error(getErrorMessage(error));
		},
	});
	useEffect(() => {
		if (variable) {
			redefineState({ variable });
		}
	}, [variable]);
	return (
		<ResponsiveDialogDrawer
			menuTitle="EDITAR VARIÁVEL"
			menuDescription="Preencha os campos abaixo para editar a variável."
			menuActionButtonText="ATUALIZAR VARIÁVEL"
			menuCancelButtonText="CANCELAR"
			actionFunction={() =>
				handleUpdateContractTemplateVariableMutation({
					id: variableId,
					variable: state.variable,
				})
			}
			actionIsPending={isPending}
			stateIsLoading={isLoading}
			closeMenu={closeMenu}
		>
			<ContractTemplatesVariableGeneral state={state} updateVariable={updateVariable} />
			<ContractTemplatesVariableValue
				state={state}
				updateVariable={updateVariable}
				addVariableConditional={addVariableConditional}
				removeVariableConditional={removeVariableConditional}
				updateVariableConditional={updateVariableConditional}
			/>
		</ResponsiveDialogDrawer>
	);
}
export default ControlContractTemplateVariableMenu;
