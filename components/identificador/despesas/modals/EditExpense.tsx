import NumberInput from "@/components/inputs/Number";
import SelectInput from "@/components/inputs/Select";
import Avatar from "@/components/utils/Avatar";
import { LoadingButton } from "@/components/utils/Buttons/LoadingButton";
import ErrorComponent from "@/components/utils/ErrorComponent";
import LoadingPage from "@/components/utils/LoadingPage";
import ResponsiveDialogDrawer from "@/components/utils/ResponsiveDialogDrawer";
import type { TAuthSession } from "@/lib/authentication/types";
import { formatDateAsLocale } from "@/utils/methods/formatting";
import { useMutationWithFeedback } from "@/utils/methods/mutation/general-hook";
import { useExpenseById } from "@/utils/methods/query/expenses";
import { formatDateInputChange } from "@/utils/methods/shared";
import type { TExpense, TExpenseDTO } from "@/utils/schemas/expenses";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { BsCalendarFill, BsCalendarPlus, BsCode } from "react-icons/bs";
import { FaUser, FaUserAlt } from "react-icons/fa";
import { VscChromeClose } from "react-icons/vsc";
import { centrosDeCusto, formatDate, formatToMoney } from "../../../../utils/constants";
import { getErrorMessage } from "../../../../utils/methods/handlers";
import { deleteExpense, updateExpense } from "../../../../utils/methods/mutation/expenses";
import CheckboxInput from "../../../inputs/Checkbox";
import DateInput from "../../../inputs/Date";
import EditExpenseFinalPriceMenu from "../EditExpenseFinalPriceMenu";
import ExpenseListItem from "../ExpenseListItem";
import Payments from "../Payments";
import ProjectVinculationMenu from "../ProjectVinculationMenu";
import ExpenseGeneralInformationBlock from "./blocos/GeneralInformationBlock";
import ExpenseItemsInformationBlock from "./blocos/ItemsInformationBlock";
import ExpensePaymentsBlock from "./blocos/PaymentsBlock";
import ExpenseProjectInformationBlock from "./blocos/ProjectInformationBlock";
import ExpenseProjectVinculation from "./blocos/utils/ProjectVinculation";

type EditExpenseProps = {
	expenseId: string;
	session: TAuthSession;
	closeModal: () => void;
	callbacks?: {
		onMutate?: () => void;
		onSuccess?: () => void;
		onSettled?: () => void;
	};
};
function EditExpense({ expenseId, session, closeModal, callbacks }: EditExpenseProps) {
	const queryClient = useQueryClient();
	const { data: expense, isLoading, isError, isSuccess } = useExpenseById({ id: expenseId });
	const [infoHolder, setInfoHolder] = useState<TExpenseDTO>({
		_id: "",
		rateio: "",
		categoria: "",
		descricao: "",
		projeto: {
			id: null,
			nome: null,
			identificador: null,
			tipo: null,
		},
		autor: {
			id: session.user?.id,
			nome: session.user.nome,
		},
		itens: [],
		total: 0,
		efetivacao: {
			efetivado: false,
			data: null,
		},
		pagamentos: [],
		criterioReferencia: false,
		criterioCompetencia: false,
		dataInsercao: new Date().toISOString(),
	});

	function resetInfoHolder() {
		setInfoHolder({
			_id: "",
			rateio: "",
			categoria: "",
			descricao: "",
			projeto: {
				id: null,
				nome: null,
				identificador: null,
				tipo: null,
			},
			autor: {
				id: session.user?.id,
				nome: session.user.nome,
			},
			itens: [],
			total: 0,
			efetivacao: {
				efetivado: false,
				data: null,
			},
			pagamentos: [],
			criterioReferencia: false,
			criterioCompetencia: false,
			dataInsercao: new Date().toISOString(),
		});
	}
	const { mutate: handleUpdateExpense, isPending } = useMutation({
		mutationKey: ["edit-expense", expenseId],
		mutationFn: updateExpense,
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey: ["expense-by-id", expenseId] });
			if (callbacks?.onMutate) callbacks.onMutate();
		},
		onSuccess: async (data) => {
			if (callbacks?.onSuccess) callbacks.onSuccess();
			return toast.success(data);
		},
		onSettled: async () => {
			await queryClient.invalidateQueries({ queryKey: ["expense-by-id", expenseId] });
			if (callbacks?.onSettled) callbacks.onSettled();
			resetInfoHolder();
		},
		onError: (error) => {
			const msg = getErrorMessage(error);
			return toast.error(msg);
		},
	});
	const { mutate: handleDeleteExpense, isPending: isDeleting } = useMutation({
		mutationKey: ["delete-expense", expenseId],
		mutationFn: deleteExpense,
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey: ["expense-by-id", expenseId] });
			if (callbacks?.onMutate) callbacks.onMutate();
		},
		onSuccess: async (data) => {
			if (callbacks?.onSuccess) callbacks.onSuccess();
			return closeModal();
		},
		onSettled: async () => {
			await queryClient.invalidateQueries({ queryKey: ["expense-by-id", expenseId] });
			if (callbacks?.onSettled) callbacks.onSettled();
		},
		onError: (error) => {
			const msg = getErrorMessage(error);
			return toast.error(msg);
		},
	});
	useEffect(() => {
		if (expense) setInfoHolder(expense);
	}, [expense]);

	return (
		<ResponsiveDialogDrawer
			menuTitle="ATUALIZAR DESPESA"
			menuDescription="Preencha os campos abaixo para atualizar a despesa."
			menuActionButtonText="ATUALIZAR DESPESA"
			menuCancelButtonText="CANCELAR"
			actionFunction={() => handleUpdateExpense({ id: expenseId, changes: infoHolder })}
			actionIsPending={isPending}
			menuSecondaryActionButtonText="EXCLUIR DESPESA"
			secondaryActionFunction={() => handleDeleteExpense({ id: expenseId })}
			menuSecondaryActionButtonClassName="bg-red-500 text-white hover:bg-red-600"
			stateIsLoading={isLoading || isDeleting}
			closeMenu={closeModal}
			dialogVariant="md"
		>
			<ExpenseGeneralInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder as React.Dispatch<React.SetStateAction<TExpense>>} />
			{expense ? (
				expense.projetoDados ? (
					<ExpenseProjectInformationBlock expense={infoHolder} project={expense.projetoDados} />
				) : (
					<ExpenseProjectVinculation
						expenseId={expenseId}
						infoHolder={infoHolder}
						setInfoHolder={setInfoHolder as React.Dispatch<React.SetStateAction<TExpense>>}
						affectedQueryKey={["expenses"]}
						queryClient={queryClient}
					/>
				)
			) : null}
			<ExpenseItemsInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder as React.Dispatch<React.SetStateAction<TExpense>>} />

			<ExpensePaymentsBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder as React.Dispatch<React.SetStateAction<TExpense>>} />
		</ResponsiveDialogDrawer>
	);
}

export default EditExpense;
