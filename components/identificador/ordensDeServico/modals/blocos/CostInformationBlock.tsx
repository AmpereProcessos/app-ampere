import EditExpense from "@/components/identificador/despesas/modals/EditExpense";
import NewExpense from "@/components/identificador/despesas/modals/NewExpense";
import type { TAuthSession } from "@/lib/authentication/types";
import { formatToMoney } from "@/utils/constants";
import { formatDateAsLocale } from "@/utils/methods/formatting";
import { getErrorMessage } from "@/utils/methods/handlers";
import { createExpense } from "@/utils/methods/mutation/expenses";
import { useProjectExpenses } from "@/utils/methods/query/expenses";
import type { TExpenseDTO } from "@/utils/schemas/expenses";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DollarSign, Pencil, Plus } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { BsCalendar } from "react-icons/bs";
import { Button } from "../../../../ui/button";
import { LoadingButton } from "../../../../utils/Buttons/LoadingButton";
import ErrorComponent from "../../../../utils/ErrorComponent";
import ResponsiveDialogDrawerSection from "../../../../utils/ResponsiveDialogDrawerSection";

export default function CostsInformation({
	sessionUser,
	projectName,
	projectId,
	projectIdentifier,
}: { sessionUser: TAuthSession; projectName: string; projectId: string; projectIdentifier: string }) {
	const [newExpenseMenuIsOpen, setNewExpenseMenuIsOpen] = useState(false);
	const queryClient = useQueryClient();
	const {
		data: expenses,
		queryKey,
		isLoading,
		isSuccess,
		isFetching,
		isError,
		error,
	} = useProjectExpenses({ projectId, enabled: true, identifier: "CUSTOS-ORDEM-DE-SERVICO" });

	const { mutate: handleCreateServiceOrderExpense, isPending } = useMutation({
		mutationKey: ["create-service-order-expense"],
		mutationFn: async () => {
			return await createExpense({
				identificador: "CUSTOS-ORDEM-DE-SERVICO",
				rateio: "DESPESAS OBRAS",
				categoria: "DESPESAS OBRAS",
				descricao: "Custo de despesas de obra da ordem de serviço...",
				projeto: {
					id: projectId,
					nome: projectName,
					identificador: projectIdentifier,
				},
				autor: {
					id: sessionUser.user.id,
					nome: sessionUser.user.nome,
					avatar_url: sessionUser.user.avatar_url,
				},
				itens: [
					{
						descricao: "CUSTO POR MÓDULOS",
						preco: 0,
						qtde: 1,
						unidade: "UN",
					},
					{
						descricao: "CUSTO POR INVERSORES",
						preco: 0,
						qtde: 1,
						unidade: "UN",
					},
					{
						descricao: "CUSTO KM RODADO",
						preco: 0,
						qtde: 1,
						unidade: "KM",
					},
					{
						descricao: "CUSTO DE ALIMENTAÇÃO",
						preco: 0,
						qtde: 1,
						unidade: "UN",
					},
					{
						descricao: "CUSTO DE PEDÁGIO E ESTACIONAMENTO",
						preco: 0,
						qtde: 1,
						unidade: "UN",
					},
					{
						descricao: "CUSTO DE HOSPEDAGEM",
						preco: 0,
						qtde: 1,
						unidade: "UN",
					},
				],
				total: 0,
				efetivacao: {
					efetivado: true,
					data: new Date().toISOString(),
				},
				pagamentos: [],
				criterioReferencia: true,
				criterioCompetencia: true,
				dataInsercao: new Date().toISOString(),
			});
		},
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey });
		},
		onSuccess: async (data) => {
			return toast.success(data);
		},
		onError: async (error) => {
			return toast.error(getErrorMessage(error));
		},
		onSettled: async () => {
			await queryClient.invalidateQueries({ queryKey });
		},
	});

	const isMissingARTCost = isSuccess && !expenses.some((expense) => expense.categoria === "ART");

	return (
		<ResponsiveDialogDrawerSection sectionTitleText="CUSTOS" sectionTitleIcon={<DollarSign size={15} />}>
			<div className="w-full flex items-center justify-end gap-2">
				{isMissingARTCost ? (
					<LoadingButton
						variant="ghost"
						className="flex items-center gap-1.5 px-2 py-1 rounded-lg"
						size="fit"
						loading={isPending}
						onClick={() => handleCreateServiceOrderExpense()}
					>
						GERAR CUSTO DE OBRA
					</LoadingButton>
				) : null}

				<Button variant="ghost" className="flex items-center gap-1.5 px-2 py-1 rounded-lg" size="fit" onClick={() => setNewExpenseMenuIsOpen(true)}>
					<Plus className="w-4 h-4 min-w-4 min-h-4" />
					NOVO CUSTO
				</Button>
			</div>
			{isLoading ? <p className="w-full text-center text-sm font-medium text-primary/80 animate-pulse">Carregando custos...</p> : null}
			{isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
			{isSuccess ? (
				expenses.length > 0 ? (
					expenses.map((expense) => <ExpenseItemCard key={expense._id} expense={expense} session={sessionUser} />)
				) : (
					<p className="w-full text-center text-sm font-medium text-primary/80">Nenhum custo encontrado.</p>
				)
			) : null}
			{newExpenseMenuIsOpen ? (
				<NewExpense
					initialState={{
						identificador: "CUSTOS-ORDEM-DE-SERVICO",
						projeto: {
							id: projectId,
							nome: projectName,
							identificador: projectIdentifier,
						},
					}}
					session={sessionUser}
					closeModal={() => setNewExpenseMenuIsOpen(false)}
				/>
			) : null}
		</ResponsiveDialogDrawerSection>
	);
}

function ExpenseItemCard({ expense, session }: { expense: TExpenseDTO; session: TAuthSession }) {
	const [editExpenseMenuIsOpen, setEditExpenseMenuIsOpen] = useState(false);
	return (
		<div className="border-primary/20 flex w-full flex-col items-center gap-1 border p-3 shadow-xs rounded">
			<div className="w-full flex items-center justify-between gap-2">
				<h1 className="text-sm font-bold">
					{expense.rateio} - {expense.categoria}
				</h1>
				<h1 className="text-sm font-bold px-2 py-1 rounded-lg bg-primary/20">{formatToMoney(expense.total)} </h1>
			</div>
			<div className="w-full flex items-center justify-between gap-2 flex-col lg:flex-row">
				<div className="flex items-center gap-2">
					<div className="flex items-center gap-1.5">
						<BsCalendar className="w-4 h-4 min-w-4 min-h-4" />
						<p className="text-xs font-medium">{formatDateAsLocale(expense.efetivacao.data, true)}</p>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<Button
						onClick={() => setEditExpenseMenuIsOpen(true)}
						size={"fit"}
						variant={"ghost"}
						className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs"
					>
						<Pencil className="w-4 h-4 min-w-4 min-h-4" />
						EDITAR
					</Button>
				</div>
			</div>
			{editExpenseMenuIsOpen ? <EditExpense expenseId={expense._id} session={session} closeModal={() => setEditExpenseMenuIsOpen(false)} /> : null}
		</div>
	);
}
