import React from 'react'

import { useSession } from '@/components/providers/SessionProvider'
import type { TAuthSession } from '@/lib/authentication/types'

import LoadingPage from '../../components/utils/LoadingPage'

import ErrorPage from '@/components/utils/ErrorPage'

import { useViewModesStore } from '@/utils/stores/view-modes-store'
import EngineeringKanbanModePage from '@/components/identificador/engenharia/KanbanModePage'
import EngineeringDatabaseModePage from '@/components/identificador/engenharia/DatabaseModePage'

function Projetos() {
  const { session, status } = useSession({ required: true })

  if (status !== 'authenticated') return <LoadingPage />

  const isAuthorized = session?.user.permissoes.rotas.includes('Projetos') || session.user.permissoes.engenharia.visualizar
  if (!isAuthorized) return <ErrorPage msg="Você não tem permissão para acessar esta página" />
  return <ProjectsPageContent session={session} />
}

export default Projetos

type ProjectsPageContentProps = {
  session: TAuthSession
}
function ProjectsPageContent({ session }: ProjectsPageContentProps) {
  const engineeringViewMode = useViewModesStore((state) => state.modes.engineering)

  if (engineeringViewMode === 'kanban') {
    return <EngineeringKanbanModePage session={session} />
  }
  return <EngineeringDatabaseModePage session={session} />
}
