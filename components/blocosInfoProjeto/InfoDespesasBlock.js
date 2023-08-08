import React from "react";
import { useProjectExpenses } from "../../utils/methods/query/expeses";
import { validateAuthorization } from "../../utils/constants";
import { useSession } from "next-auth/react";
import { BsCalendarFill } from "react-icons/bs";
import LoadingPage from "../utils/LoadingPage";
import dayjs from "dayjs";
import { FaUserAlt } from "react-icons/fa";
import ExpenseCard from "../identificador/expenses/ExpenseCard";
function InfoDespesasBlock({ projectId }) {
  const { data: session } = useSession();
  const {
    data: expenses,
    isSuccess,
    isFetching,
  } = useProjectExpenses(projectId, validateAuthorization(session, "ADM"));
  function getTotalExpenses(expensesArr) {
    const total = expensesArr.reduce((accumulator, current) => {
      const toBeSummed = current.total;
      return toBeSummed + accumulator;
    }, 0);
    return total;
  }
  return (
    <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg w-full">
      <h1 className="text-sm text-center font-bold text-[#15599a] py-2">
        DESPESAS DO PROJETO
      </h1>
      <div className="flex w-full grow flex-wrap justify-center gap-2 px-2">
        {isSuccess ? (
          expenses.length > 0 ? (
            expenses.map((expense, index) => (
              <ExpenseCard key={expense._id} expense={expense} />
            ))
          ) : (
            <div className="flex items-center justify-center w-full">
              <p className="text-gray-500 italic">
                Não há gastos vinculados à esse projeto...
              </p>
            </div>
          )
        ) : null}
        {isFetching ? <LoadingPage /> : null}
      </div>
      {isSuccess ? (
        <div className="w-full flex flex-col mt-2">
          <h1 className="w-full text-center font-bold text-green-500">
            TOTAL DE DESPESAS DO PROJETOS
          </h1>
          <h1 className="text-center w-full font-black">
            R${" "}
            {getTotalExpenses(expenses).toLocaleString("pt-br", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h1>
        </div>
      ) : null}
    </div>
  );
}

export default InfoDespesasBlock;
