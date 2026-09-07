import React, { useState } from 'react'

import { useSession } from '@/components/providers/SessionProvider'
import LoadingPage from '../../components/utils/LoadingPage'

import ExecutionPage from '@/components/identificador/obras/ExecutionPage'
import UnauthenticatedComponent from '@/components/utils/UnauthenticatedComponent'
import UnauthorizedPage from '@/components/utils/UnauthorizedPage'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { BarChart3 } from 'lucide-react'

type TObrasTab = 'execution' | 'planning'

export default function Obras() {
  const { session, status } = useSession()
  const [tab, setTab] = useState<TObrasTab>('execution')
  if (status === 'loading') return <LoadingPage />
  if (status === 'unauthenticated') return <UnauthenticatedComponent />

  return (
    <Tabs value={tab} onValueChange={(value) => setTab(value as TObrasTab)} className="grow gap-0">
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 pt-6">
        <TabsList aria-label="Etapas das obras">
          <TabsTrigger value="execution">EM EXECUÇÃO</TabsTrigger>
          <TabsTrigger value="planning">EM PLANEJAMENTO</TabsTrigger>
        </TabsList>
        {(session.user.permissoes.execucao.visualizar || session.user.permissoes.ordensDeServico.visualizar) ? (
          <Button asChild variant="outline" size="sm"><Link href="/obras/analitico"><BarChart3 className="size-4" /> Analítico</Link></Button>
        ) : null}
      </div>

      <TabsContent value={tab} className="flex grow flex-col">
        <ExecutionPage key={tab} session={session} view={tab} />
      </TabsContent>
    </Tabs>
  )
}
