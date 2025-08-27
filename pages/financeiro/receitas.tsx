import { useSession } from '@/components/providers/SessionProvider'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

import LoadingPage from '@/components/utils/LoadingPage'

import RevenuesPage from '@/components/identificador/receitas/RevenuesPage'
import UnauthenticatedComponent from '@/components/utils/UnauthenticatedComponent'
import UnauthorizedComponent from '@/components/utils/UnauthorizedComponent'

function Revenues() {
  const { session, status } = useSession()
  const isAuthorized = !!session?.user.permissoes.financeiro.visualizar || !!session?.user.permissoes.financeiro.visualizar

  if (status === 'loading') return <LoadingPage />
  if (status === 'unauthenticated') return <UnauthenticatedComponent />
  if (!isAuthorized) return <UnauthorizedComponent />

  return <RevenuesPage session={session} />
}
export default Revenues
