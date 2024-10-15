import PurchaseControlsKanbanModePage from '@/components/identificador/controles-compras/KanbanModePage'
import LoadingPage from '@/components/utils/LoadingPage'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'

function PurchasesManagement() {
  const { data: session, status } = useSession({ required: true })

  if (status != 'authenticated') return <LoadingPage />
  return <PurchaseControlsKanbanModePage session={session} />
}

export default PurchasesManagement
