import { Session } from 'next-auth'
import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import NewExpense from './NewExpense'
import ExpensesBlock from './blocos/ExpensesBlock'
import PaymentsBlock from './blocos/PaymentsBlock'
import ExpenseStats from './ExpenseStats'

type ExpensesPageProps = {
  session: Session
}
function ExpensesPage({ session }: ExpensesPageProps) {
  const [newExpenseModalIsOpen, setNewExpenseModalIsOpen] = useState<boolean>(false)
  const storedExpensesApportionmentsFilterStr = localStorage.getItem('expenses-apportionments-filter')
  const storedExpensesApportionmentsFilter = storedExpensesApportionmentsFilterStr
    ? (JSON.parse(storedExpensesApportionmentsFilterStr) as string[])
    : []
  const storedExpensesCategoriesFilterStr = localStorage.getItem('expenses-categories-filter')
  const storedExpensesCategoriesFilter = storedExpensesCategoriesFilterStr ? (JSON.parse(storedExpensesCategoriesFilterStr) as string[]) : []

  const storedPaymentsApportionmentsFilterStr = localStorage.getItem('payments-apportionments-filter')
  const storedPaymentsApportionmentsFilter = storedPaymentsApportionmentsFilterStr
    ? (JSON.parse(storedPaymentsApportionmentsFilterStr) as string[])
    : []
  const storedPaymentsCategoriesFilterStr = localStorage.getItem('payments-categories-filter')
  const storedPaymentsCategoriesFilter = storedPaymentsCategoriesFilterStr ? (JSON.parse(storedPaymentsCategoriesFilterStr) as string[]) : []

  return (
    <div className="flex grow flex-col gap-2 p-6">
      <div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col items-center gap-2 lg:flex-row">
            <p className="text-center text-2xl font-black uppercase text-[#15599a]">DESPESAS</p>
          </div>
          <Button onClick={() => setNewExpenseModalIsOpen(true)}>NOVA DESPESA</Button>
        </div>
      </div>
      <ExpenseStats />
      <div className="flex max-h-[600px] w-full flex-col gap-6 lg:flex-row">
        <div className="w-full lg:w-[40%]">
          <PaymentsBlock
            session={session}
            storedPaymentsApportionmentsFilter={storedPaymentsApportionmentsFilter}
            storedPaymentsCategoriesFilter={storedPaymentsCategoriesFilter}
          />
        </div>
        <div className="w-full lg:w-[60%]">
          <ExpensesBlock
            session={session}
            storedExpensesApportionmentsFilter={storedExpensesApportionmentsFilter}
            storedExpensesCategoriesFilter={storedExpensesCategoriesFilter}
          />
        </div>
      </div>
      {newExpenseModalIsOpen ? <NewExpense session={session} closeModal={() => setNewExpenseModalIsOpen(false)} /> : null}
    </div>
  )
}

export default ExpensesPage
