import NumberInput from "@/components/inputs/Number";
import SelectInput from "@/components/inputs/Select";
import Avatar from "@/components/utils/Avatar";
import { LoadingButton } from "@/components/utils/Buttons/LoadingButton";
import ErrorComponent from "@/components/utils/ErrorComponent";
import LoadingPage from "@/components/utils/LoadingPage";
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
import { updateExpense } from "../../../../utils/methods/mutation/expenses";
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

function getMissingPercentage({ payments }: { payments: TExpenseDTO["pagamentos"] }) {
	const currentTotal = payments.reduce((acc, current) => current.porcentagem + acc, 0);
	return 100 - currentTotal;
}

function getExpenseCategories(costApportionment: string) {
	if (!costApportionment) return [];
	const costApportionmentsObj = centrosDeCusto.find((center) => center.nome == costApportionment);
	if (!costApportionmentsObj) return [];

	const options = costApportionmentsObj.categorias.map((category, index) => ({
		id: index + 1,
		...category,
	}));
	return options;
}
type ExpenseModalProps = {
	expenseId: string;
	session: TAuthSession;
	closeModal: () => void;
	callbacks?: {
		onMutate?: () => void;
		onSuccess?: () => void;
		onSettled?: () => void;
	};
};
function ExpenseModal({ expenseId, session, closeModal, callbacks }: ExpenseModalProps) {
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
			if (!!callbacks?.onMutate) callbacks.onMutate();
		},
		onSuccess: async (data) => {
			if (!!callbacks?.onSuccess) callbacks.onSuccess();
			return toast.success(data);
		},
		onSettled: async () => {
			await queryClient.invalidateQueries({ queryKey: ["expense-by-id", expenseId] });
			if (!!callbacks?.onSettled) callbacks.onSettled();
			resetInfoHolder();
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
		<div id="edit-expense" className="fixed top-0 right-0 bottom-0 left-0 z-100 bg-[rgba(0,0,0,.85)]">
			<div className="bg-background fixed top-[50%] left-[50%] z-100 h-[80%] w-[90%] translate-x-[-50%] translate-y-[-50%] rounded-md p-[10px] lg:w-[75%]">
				<div className="flex h-full w-full flex-col">
					<div className="border-primary/20 flex flex-col items-center justify-between border-b px-2 pb-2 text-lg lg:flex-row">
						<div className="flex flex-col gap-1">
							<h3 className="text-xl font-bold text-primary dark:text-white">ATUALIZAR DESPESA</h3>
							<h1 className="text-xxs text-primary/60">#{expenseId}</h1>
						</div>
						<button
							onClick={() => closeModal()}
							type="button"
							className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
						>
							<VscChromeClose style={{ color: "red" }} />
						</button>
					</div>
					{isLoading ? <LoadingPage /> : null}
					{isError ? <ErrorComponent msg={"Houve um erro ao buscar informações da despesa."} /> : null}
					{isSuccess ? (
						<>
							<div className="scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 flex grow flex-col gap-y-2 overflow-y-auto overscroll-y-auto px-2 py-1">
								<ExpenseGeneralInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder as React.Dispatch<React.SetStateAction<TExpense>>} />

								{expense.projetoDados ? (
									<ExpenseProjectInformationBlock expense={infoHolder} project={expense.projetoDados} />
								) : (
									<ExpenseProjectVinculation
										expenseId={undefined}
										infoHolder={infoHolder}
										setInfoHolder={setInfoHolder as React.Dispatch<React.SetStateAction<TExpense>>}
										affectedQueryKey={["expenses"]}
										queryClient={queryClient}
									/>
								)}
								<ExpenseItemsInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder as React.Dispatch<React.SetStateAction<TExpense>>} />

								<ExpensePaymentsBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder as React.Dispatch<React.SetStateAction<TExpense>>} />
							</div>
							<div className="mt-2 flex w-full items-center justify-end">
								<LoadingButton
									loading={isPending}
									onClick={() =>
										//@ts-ignore
										handleUpdateExpense({ id: expenseId, changes: infoHolder })
									}
									type="button"
									className="bg-blue-800 hover:bg-blue-700"
								>
									ATUALIZAR DESPESA
								</LoadingButton>
							</div>
						</>
					) : null}
				</div>
			</div>
		</div>
	);
}

export default ExpenseModal;
