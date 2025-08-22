import TechnicalAnalysisPage from '@/components/identificador/analisesTecnicas/TechnicalAnalysisPage'
import LoadingPage from '@/components/utils/LoadingPage'
import { useSession } from '@/components/providers/SessionProvider'
import React from 'react'

function TechnicalaAnalysisPage() {
  const { session, status } = useSession({ required: true })
  if (status !== 'authenticated') return <LoadingPage />
  return <TechnicalAnalysisPage session={session} />
}

export default TechnicalaAnalysisPage
