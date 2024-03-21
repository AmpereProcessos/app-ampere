import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { AnimatePresence, motion } from 'framer-motion'

import NewExpense from '../../components/identificador/despesas/NewExpense'
import ExpensesWrapper from '../../components/identificador/despesas/ExpensesWrapper'

import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'
import { MdAttachMoney, MdOutlineAssignmentLate, MdOutlineWatchLater } from 'react-icons/md'
import dayjs from 'dayjs'
import { TExpenseDTO } from '@/utils/schemas/expenses'
import TextInput from '@/components/inputs/Text'
import { useExpenses } from '@/utils/methods/query/expenses'
import LoadingPage from '@/components/utils/LoadingPage'
import ErrorComponent from '@/components/utils/ErrorComponent'
import ExpenseCard from '@/components/identificador/despesas/ExpenseCard'
import ExpenseModal from '@/components/identificador/despesas/EditExpense'
import { formatToMoney } from '@/utils/constants'

function Despesas() {
  const router = useRouter()
  const { data: session, status } = useSession({ required: true })
  const isAuthorized = !!session?.user?.permissoes.rotas?.includes('ADM')

  const { data: expenses, isLoading, isError, isSuccess, filters, setFilters } = useExpenses()

  const [newExpenseModalIsOpen, setNewExpenseModalIsOpen] = useState(false)
  const [modalExpense, setModalExpense] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null,
  })
  const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false)
  function getStats({ info }: { info?: TExpenseDTO[] }) {
    if (!info)
      return {
        pago: 0,
        pagar: 0,
        pagarHoje: 0,
        emAtraso: 0,
      }

    const paid = info.reduce((acc, current) => {
      return acc + current.total
    }, 0)
    const toPay = info.reduce(
      (acc, current) => {
        const isPending = !current.efetivacao.efetivado
        if (!isPending) return acc
        const total = current.total
        acc.overall += total
        // Validing todays pending
        const isSame = dayjs(current.efetivacao.data).add(3, 'hour').isSame(dayjs(), 'day')
        const totalToday = current.total
        if (isSame) acc.today += totalToday
        return acc
      },
      { overall: 0, today: 0 }
    )
    const overdue = info.reduce((acc, current) => {
      const isPending = !current.efetivacao.efetivado
      if (!isPending) return acc

      const isAfter = dayjs().isAfter(dayjs(current.efetivacao.data).add(3, 'hour'), 'day')
      if (!isAfter) return acc
      return acc + current.total
    }, 0)

    return {
      pago: paid,
      pagar: toPay.overall,
      pagarHoje: toPay.today,
      emAtraso: overdue,
    }
  }
  useEffect(() => {
    if (session?.user && !isAuthorized) router.push('/')
  }, [session?.user])
  if (status != 'authenticated') return <LoadingPage />
  return (
    <div className="flex grow flex-col gap-2 p-6">
      <div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col items-center gap-2 lg:flex-row">
            <p className="text-center text-2xl font-black uppercase text-[#15599a]">DESPESAS</p>
          </div>
          {dropdownMenuVisible ? (
            <div className="cursor-pointer text-gray-600 hover:text-blue-400">
              <IoMdArrowDropupCircle style={{ fontSize: '25px' }} onClick={() => setDropdownMenuVisible(false)} />
            </div>
          ) : (
            <div className="cursor-pointer text-gray-600 hover:text-blue-400">
              <IoMdArrowDropdownCircle style={{ fontSize: '25px' }} onClick={() => setDropdownMenuVisible(true)} />
            </div>
          )}
        </div>
        <div className="my-2 flex w-full flex-col items-center justify-center gap-3 lg:flex-row">
          <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-3 shadow-sm lg:w-1/4">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium uppercase tracking-tight">PAGO</h1>
              <MdAttachMoney />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">{formatToMoney(getStats({ info: expenses }).pago)}</div>
            </div>
          </div>
          <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-3 shadow-sm lg:w-1/4">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium uppercase tracking-tight">À PAGAR</h1>
              <MdOutlineWatchLater />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">{formatToMoney(getStats({ info: expenses }).pagar)}</div>
              <p className="text-xs text-gray-500">{formatToMoney(getStats({ info: expenses }).pagarHoje)} para hoje</p>
            </div>
          </div>
          <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-3 shadow-sm lg:w-1/4">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium uppercase tracking-tight">EM ATRASO</h1>
              <MdOutlineAssignmentLate />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">{formatToMoney(getStats({ info: expenses }).emAtraso)}</div>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {dropdownMenuVisible ? (
            <motion.div initial={{ scale: 0.8, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} className="mt-4 flex w-full flex-col gap-y-2">
              <div className="flex flex-wrap items-end justify-center gap-2 lg:flex-row">
                <TextInput
                  label={'NOME DA DESPESA'}
                  value={filters.search}
                  placeholder={'Digite o nome da despesa...'}
                  handleChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
                />
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, paid: !prev.paid }))}
                  className={`rounded-md border border-green-400 ${
                    filters.paid ? 'bg-green-400 text-white' : 'bg-transparent text-green-400'
                  }  h-[49px] py-1 px-4 text-sm font-bold text-white`}
                >
                  PAGO
                </button>
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, notPaid: !prev.notPaid }))}
                  className={`rounded-md border border-[#ed174c] ${
                    filters.notPaid ? 'bg-[#ed174c] text-white' : 'bg-transparent text-[#ed174c]'
                  }  h-[49px] py-1 px-4 text-sm font-bold text-white`}
                >
                  NÃO PAGO
                </button>
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, dueToday: !prev.dueToday }))}
                  className={`rounded-md border border-[#ffbd00] ${
                    filters.dueToday ? 'bg-[#ffbd00] text-white' : 'bg-transparent text-[#ffbd00]'
                  }  h-[49px] py-1 px-4 text-sm font-bold text-white`}
                >
                  PAGAR HOJE
                </button>

                <button
                  onClick={() => setFilters((prev) => ({ ...prev, overDue: !prev.overDue }))}
                  className={`rounded-md border border-red-600 ${
                    filters.overDue ? 'bg-red-600 text-white' : 'bg-transparent text-red-600'
                  }  h-[49px] py-1 px-4 text-sm font-bold text-white`}
                >
                  EM ATRASO
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      <div className="mt-4 flex w-full grow flex-col flex-wrap items-start justify-between gap-4 lg:flex-row">
        {isLoading ? <LoadingPage /> : null}
        {isError ? <ErrorComponent msg={'Erro ao buscar despesas.'} /> : null}
        {isSuccess && expenses ? (
          expenses.length > 0 ? (
            expenses.map((expense) => (
              <ExpenseCard key={expense._id} expense={expense} openModal={() => setModalExpense({ isOpen: true, id: expense._id })} />
            ))
          ) : (
            <p className="w-full text-center italic text-gray-500">Nenhuma receita encontrada...</p>
          )
        ) : null}
        {modalExpense.isOpen && modalExpense.id ? (
          <ExpenseModal session={session} expenseId={modalExpense.id} closeModal={() => setModalExpense({ isOpen: false, id: null })} />
        ) : null}
      </div>
      <a
        onClick={() => setNewExpenseModalIsOpen(true)}
        className="fixed bottom-10 cursor-pointer rounded-lg bg-[#15599a] p-3 text-white hover:bg-[#fead61] hover:text-[#15599a]"
      >
        <p className="text-sm font-bold uppercase">NOVA DESPESA</p>
      </a>
      {newExpenseModalIsOpen ? <NewExpense session={session} closeModal={() => setNewExpenseModalIsOpen(false)} /> : null}
    </div>
  )
}

export default Despesas
