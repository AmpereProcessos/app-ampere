import { getCurrentSession } from '@/lib/authentication/session'
import { redirect } from 'next/navigation'
import HomePage from './home-page'

export default async function Home() {
  const { session, user } = await getCurrentSession()
  if (!session) redirect('/auth/signin')

  if (user.visualizacao.tipo === 'EXECUÇÃO') redirect('/ordens-de-servico/designadas')

  return <HomePage user={user} />
}
