import React from 'react'

import { useSession } from '../../components/providers/SessionProvider'
import LoadingPage from '../../components/utils/LoadingPage'
import UnauthenticatedComponent from '../../components/utils/UnauthenticatedComponent'
import UnauthorizedPage from '../../components/utils/UnauthorizedPage'
import { SupportCallsDatabase } from '@/components/identificador/chamados-suporte/SupportCallsDatabase'

function ChamadosSuporte() {
  const { session, status } = useSession()
  const isAuthorized = session?.user.permissoes.rotas.includes('O&M') || session?.user.permissoes.rotas.includes('Pós-Venda')
  if (status === 'loading') return <LoadingPage />
  if (status === 'unauthenticated') return <UnauthenticatedComponent />
  if (!isAuthorized) return <UnauthorizedPage />
  return <SupportCallsDatabase session={session} />
}

export default ChamadosSuporte
