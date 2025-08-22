import ServiceOrdersCardModePage from '@/components/identificador/ordensDeServico/CardModePage'
import ServiceOrdersKanbanModePage from '@/components/identificador/ordensDeServico/KanbanModePage'

import LoadingPage from '@/components/utils/LoadingPage'
import { useSession } from '@/components/providers/SessionProvider'
import React, { useState } from 'react'

export type TServiceOrdersPageModes = 'card' | 'kanban'

function MainServiceOrdersPage() {
  const { session, status } = useSession({ required: true })
  const [mode, setMode] = useState<TServiceOrdersPageModes>('card')

  if (status !== 'authenticated') return <LoadingPage />

  if (mode === 'kanban') return <ServiceOrdersKanbanModePage session={session} handleSetMode={setMode} />
  return <ServiceOrdersCardModePage session={session} handleSetMode={setMode} />
}

export default MainServiceOrdersPage
