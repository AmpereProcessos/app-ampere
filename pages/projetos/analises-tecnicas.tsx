import TechnicalAnalysisPage from '@/components/identificador/analisesTecnicas/TechnicalAnalysisPage'
import { useSession } from '@/components/providers/SessionProvider'
import LoadingPage from '@/components/utils/LoadingPage'
import UnauthenticatedComponent from '@/components/utils/UnauthenticatedComponent'
import React from 'react'

function TechnicalaAnalysisPage() {
  const { session, status } = useSession()
  if (status === 'loading') return <LoadingPage />
  if (status === 'unauthenticated') return <UnauthenticatedComponent />
  return <TechnicalAnalysisPage session={session} />
}

export default TechnicalaAnalysisPage
