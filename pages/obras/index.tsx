import React, { useState } from 'react'

import { useSession } from '@/components/providers/SessionProvider'
import LoadingPage from '../../components/utils/LoadingPage'

import ExecutionPage from '@/components/identificador/obras/ExecutionPage'
import UnauthenticatedComponent from '@/components/utils/UnauthenticatedComponent'
import UnauthorizedPage from '@/components/utils/UnauthorizedPage'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type TObrasTab = 'execution' | 'planning'

export default function Obras() {
  const { session, status } = useSession()
  const [tab, setTab] = useState<TObrasTab>('execution')
  if (status === 'loading') return <LoadingPage />
  if (status === 'unauthenticated') return <UnauthenticatedComponent />

  return (
    <Tabs value={tab} onValueChange={(value) => setTab(value as TObrasTab)} className="grow gap-0">
      <div className="px-6 pt-6">
        <TabsList aria-label="Etapas das obras">
          <TabsTrigger value="execution">EM EXECUÇÃO</TabsTrigger>
          <TabsTrigger value="planning">EM PLANEJAMENTO</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value={tab} className="flex grow flex-col">
        <ExecutionPage key={tab} session={session} view={tab} />
      </TabsContent>
    </Tabs>
  )
}
