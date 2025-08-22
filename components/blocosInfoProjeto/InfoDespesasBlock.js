import React from 'react'
import { useProjectExpenses } from '../../utils/methods/query/expenses'
import { formatToMoney, validateAuthorization } from '../../utils/constants'
import { useSession } from '../../components/providers/SessionProvider'
import { BsCalendarFill } from 'react-icons/bs'
import LoadingPage from '../utils/LoadingPage'
import dayjs from 'dayjs'
import { FaUserAlt } from 'react-icons/fa'
import ExpenseItem from '../identificador/despesas/ExpenseItem'
function InfoDespesasBlock({ projectId }) {
  const { session } = useSession({ required: true })
  const { data: expenses, isSuccess, isFetching } = useProjectExpenses(projectId, validateAuthorization(session, 'ADM'))
  function getTotalExpenses(expensesArr) {
    const total = expensesArr.reduce((accumulator, current) => {
      const toBeSummed = current.total
      return toBeSummed + accumulator
    }, 0)
    return total
  }
  return (
    <div className="flex w-full flex-col rounded-md border border-[#15599a] pb-2 shadow-lg">
      <span className="mb-2 w-full rounded-tr-md rounded-tl-md bg-[#15599a] py-2 text-center font-bold text-white">DESPESAS DO PROJETO</span>
      <div className="flex w-full grow flex-wrap justify-center gap-2 px-2">
        {isSuccess ? (
          expenses.length > 0 ? (
            expenses.map((expense, index) => <ExpenseItem key={expense._id} expense={expense} />)
          ) : (
            <div className="flex w-full items-center justify-center">
              <p className="italic text-gray-500">Não há gastos vinculados à esse projeto...</p>
            </div>
          )
        ) : null}
        {isFetching ? <LoadingPage /> : null}
      </div>
      {isSuccess ? (
        <div className="mt-2 flex w-full flex-col">
          <h1 className="w-full text-center font-bold text-green-500">TOTAL DE DESPESAS DO PROJETO</h1>
          <h1 className="w-full text-center font-black">{formatToMoney(getTotalExpenses(expenses))}</h1>
        </div>
      ) : null}
    </div>
  )
}

export default InfoDespesasBlock
