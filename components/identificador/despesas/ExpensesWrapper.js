import React, { useEffect, useMemo, useState } from 'react'
import { useExpenses } from '../../../utils/methods/query/expenses'
import LoadingPage from '../../utils/LoadingPage'
import ExpenseCard from './ExpenseCard'
import ExpenseModal from './modals/EditExpense'
import { AnimatePresence, motion } from 'framer-motion'
import FilterButton from '../../utils/Buttons/FilterButton'
import { AiOutlineSearch } from 'react-icons/ai'
import { formatToMoney } from '../../../utils/constants'
import dayjs from 'dayjs'

function ExpensesWrapper({ userAuthorized, filters }) {
  const { data: expenses, isLoading, isSuccess } = useExpenses(!!userAuthorized, filters)

  const [modalExpense, setModalExpense] = useState(null)
  const [modalIsOpen, setModalIsOpen] = useState(false)

  function handleOpenModal(expense) {
    setModalExpense(expense)
    setModalIsOpen(true)
  }
  function handleCloseModal() {
    setModalExpense(null)
    setModalIsOpen(false)
  }

  function getStats(expenses) {
    const toPayToday = expenses.reduce((acc, current) => {
      const unpaid = !current.efetivacao?.efetivado
      const scheduledDate = current.efetivacao?.data ? new Date(dayjs(current.efetivacao.data).add(3, 'hours')).setHours(0, 0, 0, 0) : null
      const todayDate = new Date().setHours(0, 0, 0, 0)
      const isScheduledToday = scheduledDate == todayDate
      if (unpaid && isScheduledToday) {
        const total = current.total
        return acc + total
      } else {
        return acc + 0
      }
    }, 0)
    const toPay = expenses.reduce((acc, current) => {
      const unpaid = !current.efetivacao?.efetivado
      const scheduledDate = current.efetivacao?.data ? new Date(dayjs(current.efetivacao.data).add(3, 'hours')).setHours(0, 0, 0, 0) : null
      const todayDate = new Date().setHours(0, 0, 0, 0)
      const yetToPay = scheduledDate >= todayDate
      if (unpaid && yetToPay) {
        const total = current.total
        return acc + total
      } else {
        return acc + 0
      }
    }, 0)
    const toPayOverdue = expenses.reduce((acc, current) => {
      const unpaid = !current.efetivacao?.efetivado
      const scheduledDate = current.efetivacao?.data ? new Date(dayjs(current.efetivacao.data).add(3, 'hours')).setHours(0, 0, 0, 0) : null
      const todayDate = new Date().setHours(0, 0, 0, 0)
      const isOverdue = scheduledDate < todayDate
      if (unpaid && isOverdue) {
        const total = current.total
        return acc + total
      } else {
        return acc + 0
      }
    }, 0)
    const paid = expenses.reduce((acc, current) => {
      const isPaid = !!current.efetivacao?.efetivado
      if (isPaid) {
        const total = current.total
        return acc + total
      } else {
        return acc + 0
      }
    }, 0)
    return {
      toPayToday: toPayToday,
      toPay: toPay,
      toPayOverdue: toPayOverdue,
      paid: paid,
    }
  }

  return (
    <div className="flex w-full grow flex-col">
      <div className="flex w-full items-center justify-center gap-2">
        <div className="flex min-h-[100px] w-[200px] flex-col rounded border border-gray-300 shadow-md">
          <div className="w-full rounded-tl rounded-tr bg-green-500 text-center text-sm text-white">PAGO</div>
          <div className="flex w-full grow items-center justify-center">
            <h1 className="text-center font-raleway font-bold">{formatToMoney(getStats(expenses || []).paid)}</h1>
          </div>
        </div>
        <div className="flex min-h-[100px] w-[200px] flex-col rounded border border-gray-300 shadow-md">
          <div className="w-full rounded-tl rounded-tr bg-[#15599a] text-center text-sm text-white">À PAGAR</div>
          <div className="flex w-full grow items-center justify-center">
            <h1 className="text-center font-raleway font-bold">{formatToMoney(getStats(expenses || []).toPay)}</h1>
          </div>
        </div>
        <div className="flex min-h-[100px] w-[200px] flex-col rounded border border-gray-300 shadow-md">
          <div className="w-full rounded-tl rounded-tr bg-[#fead41] text-center text-sm text-white">À PAGAR HOJE</div>
          <div className="flex w-full grow items-center justify-center">
            <h1 className="text-center font-raleway font-bold">{formatToMoney(getStats(expenses || []).toPayToday)}</h1>
          </div>
        </div>
        <div className="flex min-h-[100px] w-[200px] flex-col rounded border border-gray-300 shadow-md">
          <div className="w-full rounded-tl rounded-tr bg-red-500 text-center text-sm text-white">EM ATRASO</div>
          <div className="flex w-full grow items-center justify-center">
            <h1 className="text-center font-raleway font-bold">{formatToMoney(getStats(expenses || []).toPayOverdue)}</h1>
          </div>
        </div>
      </div>
      <div className="mt-4 flex w-full grow flex-col flex-wrap items-start justify-between gap-4 lg:flex-row">
        {isLoading ? (
          <div className="flex w-full grow items-center justify-center">
            <LoadingPage />
          </div>
        ) : null}
        {isSuccess && expenses ? (
          expenses.length > 0 ? (
            expenses.map((expense) => <ExpenseCard key={expense._id} expense={expense} openModal={handleOpenModal} />)
          ) : (
            <p className="w-full text-center italic text-gray-500">Nenhuma despesa encontrada...</p>
          )
        ) : null}
        {modalExpense && modalIsOpen ? <ExpenseModal expense={modalExpense} closeModal={handleCloseModal} /> : null}
      </div>
    </div>
  )
}

export default ExpensesWrapper
