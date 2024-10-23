import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

import LoadingPage from '@/components/utils/LoadingPage'

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
