import React from 'react'

import { useSession } from '../../components/providers/SessionProvider'
import LoadingPage from '../../components/utils/LoadingPage'
import UnauthenticatedComponent from '../../components/utils/UnauthenticatedComponent'
import UnauthorizedPage from '../../components/utils/UnauthorizedPage'
import { EngineeringCallsDatabase } from '@/components/identificador/chamados-engenharia'

function ChamadosEngenharia() {
  const { session, status } = useSession()
  const isAuthorized = session?.user.permissoes.rotas.includes('O&M') || session?.user.permissoes.rotas.includes('Pós-Venda')
  if (status === 'loading') return <LoadingPage />
  if (status === 'unauthenticated') return <UnauthenticatedComponent />
  if (!isAuthorized) return <UnauthorizedPage />
  return <EngineeringCallsDatabase session={session} />
}

export default ChamadosEngenharia
