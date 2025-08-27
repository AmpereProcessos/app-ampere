import { useSession } from '@/components/providers/SessionProvider'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

import LoadingPage from '@/components/utils/LoadingPage'

import ExpensesPage from '@/components/identificador/despesas/ExpensesPage'
import UnauthenticatedComponent from '@/components/utils/UnauthenticatedComponent'
import UnauthorizedComponent from '@/components/utils/UnauthorizedComponent'

function Despesas() {
  const router = useRouter()
  const { session, status } = useSession()
  const isAuthorized = session?.user.permissoes.financeiro.visualizar || session?.user.permissoes.financeiro.visualizar

  if (status === 'loading') return <LoadingPage />
  if (status === 'unauthenticated') return <UnauthenticatedComponent />
  if (!isAuthorized) return <UnauthorizedComponent />
  return <ExpensesPage session={session} />
}

export default Despesas
