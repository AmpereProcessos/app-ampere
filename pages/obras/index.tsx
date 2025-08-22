import React, { useEffect, useState } from 'react'

import { useSession } from '@/components/providers/SessionProvider'
import LoadingPage from '../../components/utils/LoadingPage'

import ExecutionPage from '@/components/identificador/obras/ExecutionPage'

export default function Obras() {
  const { session, status } = useSession({ required: true })
  if (status !== 'authenticated') return <LoadingPage />

  return <ExecutionPage session={session} />
}
