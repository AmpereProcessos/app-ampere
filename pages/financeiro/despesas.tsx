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
import ExpensesPage from '@/components/identificador/despesas/ExpensesPage'

function Despesas() {
  const router = useRouter()
  const { data: session, status } = useSession({ required: true })
  const isAuthorized = !!session?.user?.permissoes.rotas?.includes('ADM')

  useEffect(() => {
    if (session?.user && !isAuthorized) router.push('/')
  }, [session?.user])
  if (status != 'authenticated') return <LoadingPage />
  return <ExpensesPage session={session} />
}

export default Despesas
