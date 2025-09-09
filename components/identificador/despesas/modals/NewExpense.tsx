import React, { useState } from "react";
import { VscChromeClose } from "react-icons/vsc";

import { centrosDeCusto, expenseCategories, formatDate, formatToMoney } from "../../../../utils/constants";

import type { TAuthSession } from "@/lib/authentication/types";
import type { TExpense } from "@/utils/schemas/expenses";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createExpense } from "../../../../utils/methods/mutation/expenses";

import { LoadingButton } from "@/components/utils/Buttons/LoadingButton";
import { getErrorMessage } from "@/utils/methods/handlers";
import { useMutationWithFeedback } from "@/utils/methods/mutation/general-hook";
import { useExpenseProject } from "@/utils/methods/query/expenses";
import toast from "react-hot-toast";
import ExpenseGeneralInformationBlock from "./blocos/GeneralInformationBlock";
import ExpenseItemsInformationBlock from "./blocos/ItemsInformationBlock";
import ExpensePaymentsBlock from "./blocos/PaymentsBlock";
import ExpenseProjectInformationBlock from "./blocos/ProjectInformationBlock";
import ExpenseProjectVinculation from "./blocos/utils/ProjectVinculation";

type NewExpenseProps = {
	session: TAuthSession;
	closeModal: () => void;
	callbacks?: {
		onMutate?: () => void;
		onSuccess?: () => void;
		onSettled?: () => void;
	};
};
function NewExpense({ session, closeModal, callbacks }: NewExpenseProps) {
	const queryClient = useQueryClient();

	const initialInfoHolder: TExpense = {
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
			avatar_url: session.user.avatar_url,
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
	};
	const [infoHolder, setInfoHolder] = useState(initialInfoHolder);

	const { data: project } = useExpenseProject({ projectId: infoHolder.projeto.id || null });

	const { mutate: handleCreateExpense, isPending } = useMutation({
		mutationKey: ["create-expense"],
		mutationFn: createExpense,
		onMutate: async () => {
			if (!!callbacks?.onMutate) callbacks.onMutate();
		},
		onSuccess: async (data) => {
			if (!!callbacks?.onSuccess) callbacks.onSuccess();
			return toast.success(data);
		},
		onSettled: async () => {
			if (!!callbacks?.onSettled) callbacks.onSettled();
			setInfoHolder(initialInfoHolder);
		},
		onError: (error) => {
			const msg = getErrorMessage(error);
			return toast.error(msg);
		},
	});
	return (
		<div id="defaultModal" className="fixed top-0 right-0 bottom-0 left-0 z-100 bg-[rgba(0,0,0,.85)]">
			<div className="bg-background fixed top-[50%] left-[50%] z-100 h-[80%] w-[90%] translate-x-[-50%] translate-y-[-50%] rounded-md p-[10px] lg:w-[75%]">
				<div className="flex h-full w-full flex-col">
					<div className="border-primary/20 flex flex-col items-center justify-between border-b px-2 pb-2 text-lg lg:flex-row">
						<h3 className="text-xl font-bold text-primary dark:text-white">NOVA DESPESA</h3>
						<button
							onClick={() => closeModal()}
							type="button"
							className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
						>
							<VscChromeClose style={{ color: "red" }} />
						</button>
					</div>
					<div className="scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 flex grow flex-col gap-y-2 overflow-y-auto overscroll-y-auto px-2 py-2">
						<ExpenseGeneralInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
						{project ? (
							<ExpenseProjectInformationBlock expense={infoHolder} project={project} />
						) : (
							<ExpenseProjectVinculation
								expenseId={undefined}
								infoHolder={infoHolder}
								setInfoHolder={setInfoHolder}
								affectedQueryKey={["expenses"]}
								queryClient={queryClient}
							/>
						)}
						<ExpenseItemsInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
						<ExpensePaymentsBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
					</div>
					<div className="mt-2 flex w-full items-center justify-end">
						<LoadingButton
							loading={isPending}
							onClick={() =>
								//@ts-ignore
								handleCreateExpense(infoHolder)
							}
							type="button"
							className="bg-green-800 hover:bg-green-700"
						>
							CRIAR DESPESA
						</LoadingButton>
					</div>
				</div>
			</div>
		</div>
	);
}

export default NewExpense;
