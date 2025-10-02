import ResponsiveDialogDrawer from "@/components/utils/ResponsiveDialogDrawer";
import type { TAuthSession } from "@/lib/authentication/types";
import { getErrorMessage } from "@/utils/methods/handlers";
import { createContractTemplateVariable } from "@/utils/methods/mutation/contract-templates-variables";
import type { TMutationCallbacks } from "@/utils/methods/shared";
import { useContractTemplateVariableState } from "@/utils/state/contract-template-variable";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import ContractTemplatesVariableGeneral from "./blocks/General";
import ContractTemplatesVariableValue from "./blocks/Value";

type NewVariableMenuProps = {
	session: TAuthSession;
	closeMenu: () => void;
	callbacks?: TMutationCallbacks;
};
function NewContractTemplateVariableMenu({ session, closeMenu, callbacks }: NewVariableMenuProps) {
	const { state, updateVariable, addVariableConditional, removeVariableConditional, updateVariableConditional, resetState } =
		useContractTemplateVariableState({});

	const { mutate: handleCreateContractTemplateVariableMutation, isPending } = useMutation({
		mutationKey: ["create-contract-template-variable"],
		mutationFn: createContractTemplateVariable,
		onMutate: async () => {
			if (callbacks?.onMutate) callbacks.onMutate();
		},
		onSuccess: async (data) => {
			if (callbacks?.onSuccess) callbacks.onSuccess();
			resetState();
			return toast.success(data.message);
		},
		onSettled: async () => {
			if (callbacks?.onSettled) callbacks.onSettled();
		},
		onError: (error) => {
			if (callbacks?.onError) callbacks.onError();
			return toast.error(getErrorMessage(error));
		},
	});
	return (
		<ResponsiveDialogDrawer
			menuTitle="NOVA VARIÁVEL"
			menuDescription="Preencha os campos abaixo para criar uma nova variável."
			menuActionButtonText="CRIAR VARIÁVEL"
			menuCancelButtonText="CANCELAR"
			actionFunction={() =>
				handleCreateContractTemplateVariableMutation({
					variable: state.variable,
				})
			}
			actionIsPending={isPending}
			stateIsLoading={false}
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
export default NewContractTemplateVariableMenu;
