'use client'

import { Pencil } from 'lucide-react'
import React, { useState } from 'react'
import { BsCalendar, BsCalendarPlus, BsCircleHalf, BsFunnelFill } from 'react-icons/bs'
import { cn } from '@/lib/utils'
import { useRevenueByFilters } from '@/utils/methods/query/revenues'
import GeneralPaginationComponent from '@/components/utils/Pagination'
import LoadingComponent from '@/components/utils/LoadingComponent'
import ErrorComponent from '@/components/utils/ErrorComponent'
import { getErrorMessage } from '@/utils/methods/handlers'
import { TRevenuesByFiltersResult } from '@/pages/api/receitas/search'
import { formatToMoney } from '@/utils/constants'
import { MdDashboard } from 'react-icons/md'
import { formatDateAsLocale, formatNameAsInitials } from '@/utils/methods/formatting'
import Avatar from '@/components/utils/Avatar'
import { Session } from 'next-auth'
import EditExpense from '../EditExpense'
import RevenuesFilterMenu from './ExpensesFilterMenu'
import { useExpensesByFilters } from '@/utils/methods/query/expenses'
import { TExpensesByFiltersResult } from '@/pages/api/despesas/search'

type ExpensesBlockProps = {
  session: Session
  storedExpensesApportionmentsFilter: string[]
  storedExpensesCategoriesFilter: string[]
}
function ExpensesBlock({ session, storedExpensesApportionmentsFilter, storedExpensesCategoriesFilter }: ExpensesBlockProps) {
  const [filterMenuIsOpen, setFilterMenuIsOpen] = useState<boolean>(false)
  const [editModal, setEditModal] = useState<{ id: string | null; isOpen: boolean }>({ id: null, isOpen: false })

  const {
    data: dashboardExpenses,
    isLoading,
    isSuccess,
    isError,
    error,
    queryParams,
    updateQueryParams,
  } = useExpensesByFilters({
    initialQueryParams: {
      page: 1,
      search: '',
      status: [],
      apportionments: storedExpensesApportionmentsFilter,
      categories: storedExpensesCategoriesFilter,
    },
  })

  const expenses = dashboardExpenses?.expenses
  const expensesShowing = expenses ? expenses.length : 0
  const expensesMatched = dashboardExpenses?.expensesMatched || 0
  const totalPages = dashboardExpenses?.totalPages
  return (
    <div className="flex h-full max-h-full w-full flex-col gap-2 rounded border border-primary bg-[#fff] p-3 shadow-sm dark:bg-[#121212]">
      <div className="flex w-full items-center justify-between gap-2 border-b border-primary/30 pb-3">
        <h1 className="text-sm font-bold leading-none tracking-tight">DESPESAS</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterMenuIsOpen((prev) => !prev)}
            className={cn(
              'min-h-6 min-w-6 flex h-6 w-6 items-center justify-center rounded-full text-primary duration-300 ease-in-out hover:bg-primary/20',
              {
                'bg-primary/30': filterMenuIsOpen,
              }
            )}
          >
            <BsFunnelFill width={14} height={14} />
          </button>
        </div>
      </div>
      <GeneralPaginationComponent
        activePage={queryParams.page}
        queryLoading={isLoading}
        selectPage={(page) => updateQueryParams({ page })}
        totalPages={totalPages || 0}
        itemsMatchedText={expensesMatched > 0 ? `${expensesMatched} despesas encontradas.` : `${expensesMatched} despesa encontrada.`}
        itemsShowingText={expensesShowing > 0 ? `Mostrando ${expensesShowing} despesas.` : `Mostrando ${expensesShowing} despesa.`}
      />
      <div className="flex w-full grow flex-col items-center gap-3 gap-y-1 overflow-y-auto overscroll-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
        {isLoading ? <LoadingComponent /> : null}
        {isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
        {isSuccess ? (
          expenses && expenses.length > 0 ? (
            expenses.map((expense) => <ExpenseCard key={expense._id} expense={expense} handleClick={(id) => setEditModal({ id, isOpen: true })} />)
          ) : (
            <div className="w-full text-center text-sm font-medium tracking-tight text-primary/80">Nenhuma despesa encontrada.</div>
          )
        ) : null}
      </div>
      {editModal.isOpen && editModal.id ? (
        <EditExpense session={session} expenseId={editModal.id} closeModal={() => setEditModal({ isOpen: false, id: null })} />
      ) : null}
      {/* {filterMenuIsOpen ? (
        <RevenuesFilterMenu queryParams={queryParams} updateQueryParams={updateQueryParams} closeMenu={() => setFilterMenuIsOpen(false)} />
      ) : null} */}
    </div>
  )
}

export default ExpensesBlock

type ExpenseCardProps = {
  expense: TExpensesByFiltersResult['expenses'][number]
  handleClick: (id: string) => void
}
function ExpenseCard({ expense, handleClick }: ExpenseCardProps) {
  function getReceiptStatus({
    payments,
    expenseTotal,
  }: {
    payments: TExpensesByFiltersResult['expenses'][number]['pagamentos']
    expenseTotal: number
  }) {
    const totalReceived = payments?.reduce((acc, curr) => (!!curr.dataPagamento ? acc + (curr.valor || curr.porcentagem * expenseTotal) : acc), 0)
    const partionsReceived = payments?.filter((r) => !!r.dataPagamento).length

    // In case partions received are equal to the total amount of receipts
    if (totalReceived == expenseTotal)
      return {
        tag: <h1 className="rounded-lg bg-green-500 px-2 py-0.5 text-center text-[0.5rem] font-medium text-white">PAGO</h1>,
        fractionationStr: `${partionsReceived}/${payments.length}`,
      }

    if (totalReceived > 0)
      return {
        tag: <h1 className="rounded-lg bg-orange-600 px-2 py-0.5 text-center text-[0.5rem] font-medium text-white">PAGO PARCIAL</h1>,
        fractionationStr: `${partionsReceived}/${payments.length}`,
      }

    return {
      tag: <h1 className="rounded-lg bg-red-600 px-2 py-0.5 text-center text-[0.5rem] font-medium text-white">PENDENTE</h1>,
      fractionationStr: `${partionsReceived}/${payments.length}`,
    }
  }
  const { tag: ReceiptStatusTag, fractionationStr } = getReceiptStatus({ payments: expense.pagamentos, expenseTotal: expense.total })
  return (
    <div className="flex w-full flex-col gap-1 rounded border border-primary bg-[#fff] p-2 shadow-sm dark:bg-[#121212]">
      <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-bold leading-none tracking-tight">{expense.categoria}</p>
          {ReceiptStatusTag}
        </div>
        <h1 className="rounded-lg bg-primary px-2 py-0.5 text-center text-[0.65rem] font-medium text-secondary">{formatToMoney(expense.total)}</h1>
      </div>
      <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex w-fit min-w-fit items-center gap-1">
          <MdDashboard width={10} height={10} />
          <h1 className="py-0.5 text-center text-[0.6rem] font-bold  text-primary">{expense.rateio}</h1>
        </div>

        <div className="flex w-full flex-wrap items-center justify-center gap-2 lg:min-w-fit lg:justify-end">
          <div className="flex items-center gap-1">
            <BsCalendar width={10} height={10} />
            <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">COMPETÊNCIA</h1>
            <h1 className="py-0.5 text-center text-[0.6rem] font-bold  text-primary">
              {expense.efetivacao.data ? formatDateAsLocale(expense.efetivacao.data) : 'N/A'}
            </h1>
          </div>
          <div className="flex items-center gap-1">
            <BsCircleHalf width={10} height={10} />
            <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">PAGAMENTOS</h1>
            <h1 className="py-0.5 text-center text-[0.6rem] font-bold  text-primary">{fractionationStr}</h1>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            <BsCalendarPlus />
            <p className="text-[0.65rem] font-medium text-primary/80">{formatDateAsLocale(expense.dataInsercao, true)}</p>
          </div>
          <div className="flex items-center gap-1">
            <Avatar url={expense.autor.avatar_url || undefined} height={20} width={20} fallback={formatNameAsInitials(expense.autor.nome)} />

            <p className="text-[0.65rem] font-medium text-primary/80">{expense.autor.nome}</p>
          </div>
        </div>
        <button
          onClick={() => handleClick(expense._id)}
          className="flex items-center gap-1 rounded-lg bg-primary px-2 py-1 text-[0.6rem] text-secondary"
        >
          <Pencil width={10} height={10} />
          <p>EDITAR</p>
        </button>
      </div>
    </div>
  )
}
