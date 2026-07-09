import type { TExpense } from "@/utils/schemas/expenses";
import { BadgeDollarSign, Plus } from "lucide-react";
import React, { useState } from "react";
import { formatToMoney } from "../../utils/constants";
import { useProjectExpenses } from "../../utils/methods/query/expenses";
import ExpenseItem from "../identificador/despesas/ExpenseItem";
import NewExpense from "../identificador/despesas/modals/NewExpense";
import { useSession } from "../providers/SessionProvider";
import { Button } from "../ui/button";
import LoadingPage from "../utils/LoadingPage";

type InfoDespesasBlockProps = {
  projectId: string;
  projectName: string;
  projectIdentifier: string;
};
function InfoDespesasBlock({ projectId, projectName, projectIdentifier }: InfoDespesasBlockProps) {
  const { session } = useSession();
  const [newExpenseMenuIsOpen, setNewExpenseMenuIsOpen] = useState<boolean>(false);
  const {
    data: expenses,
    isSuccess,
    isFetching,
  } = useProjectExpenses({
    projectId,
    enabled: !!session?.user.permissoes.financeiro.visualizar,
    identifier: null,
  });
  function getTotalExpenses(expensesArr: TExpense[]) {
    const total = expensesArr.reduce((accumulator: number, current: TExpense) => {
      const toBeSummed = current.total;
      return toBeSummed + accumulator;
    }, 0);
    return total;
  }
  return (
    <div className="flex flex-col rounded-md border border-primary pb-2 shadow-lg gap-6">
      <div className="flex items-center gap-2 bg-primary/20 px-2 py-2 rounded w-full justify-center">
        <BadgeDollarSign className="h-4 w-4 min-h-4 min-w-4" />
        <h1 className="text-xs tracking-tight font-medium text-start w-fit">DESPESAS DO PROJETO</h1>
      </div>
      <div className="w-full flex items-center justify-end gap-2">
        <Button
          variant="ghost"
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg"
          size="fit"
          onClick={() => setNewExpenseMenuIsOpen(true)}
        >
          <Plus className="w-4 h-4 min-w-4 min-h-4" />
          NOVO CUSTO
        </Button>
      </div>
      <div className="flex w-full grow flex-wrap justify-center gap-2 px-2">
        {isSuccess ? (
          expenses.length > 0 ? (
            expenses.map((expense, index) => <ExpenseItem key={expense._id} expense={expense} />)
          ) : (
            <div className="flex w-full items-center justify-center">
              <p className="text-foreground italic">Não há gastos vinculados à esse projeto...</p>
            </div>
          )
        ) : null}
        {isFetching ? <LoadingPage /> : null}
      </div>
      {isSuccess ? (
        <div className="mt-2 flex w-full flex-col">
          <h1 className="w-full text-center font-bold text-green-500">
            TOTAL DE DESPESAS DO PROJETO
          </h1>
          <h1 className="w-full text-center font-black">
            {formatToMoney(getTotalExpenses(expenses))}
          </h1>
        </div>
      ) : null}
      {newExpenseMenuIsOpen && session ? (
        <NewExpense
          session={session}
          initialState={{
            projeto: { id: projectId, nome: projectName, identificador: projectIdentifier },
          }}
          closeModal={() => setNewExpenseMenuIsOpen(false)}
        />
      ) : null}
    </div>
  );
}

export default InfoDespesasBlock;
