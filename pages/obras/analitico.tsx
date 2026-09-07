import { useSession } from '@/components/providers/SessionProvider'
import LoadingPage from '@/components/utils/LoadingPage'
import UnauthenticatedComponent from '@/components/utils/UnauthenticatedComponent'
import UnauthorizedPage from '@/components/utils/UnauthorizedPage'
import dynamic from 'next/dynamic'
import Head from 'next/head'

const ExecutionAnalyticsView = dynamic(() => import('@/components/identificador/obras/ExecutionAnalyticsView'), { loading: () => <LoadingPage /> })

export default function ObrasAnalyticsPage() {
  const { session, status } = useSession()
  if (status === 'loading') return <LoadingPage />
  if (status === 'unauthenticated' || !session) return <UnauthenticatedComponent />
  if (!session.user.permissoes.execucao.visualizar && !session.user.permissoes.ordensDeServico.visualizar) return <UnauthorizedPage />
  return (
    <>
      <Head>
        <title>Analítico de Obras | Ampère</title>
      </Head>
      <ExecutionAnalyticsView />
    </>
  )
}
