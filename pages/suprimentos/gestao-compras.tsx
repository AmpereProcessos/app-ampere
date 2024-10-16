import PurchaseControlsKanbanModePage from '@/components/identificador/controles-compras/KanbanModePage'
import LoadingPage from '@/components/utils/LoadingPage'
import { GetServerSidePropsContext } from 'next'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'
import nookies, { setCookie, parseCookies } from 'nookies'
import { handleSetCookie } from '@/utils/methods/cookies'
import PurchaseControlsCardModePage from '@/components/identificador/controles-compras/CardModePage'

export type TPurchasesControlPageModes = 'card' | 'kanban'
type PurchasesControlProps = { initialMode: TPurchasesControlPageModes | null | undefined }
function PurchasesControl({ initialMode }: PurchasesControlProps) {
  const { data: session, status } = useSession({ required: true })
  const [mode, setMode] = useState<TPurchasesControlPageModes>(initialMode || 'kanban')

  function handleSetMode(selected: TPurchasesControlPageModes) {
    // Setting selected mode in a cookie for futher preference use
    handleSetCookie({ ctx: null, key: 'purchases-control-page-mode', value: selected, path: '/suprimentos/gestao-compras' })
    setMode(selected)
  }

  if (status != 'authenticated') return <LoadingPage />
  if (mode == 'card') return <PurchaseControlsCardModePage session={session} handleSetMode={handleSetMode} />
  return <PurchaseControlsKanbanModePage session={session} handleSetMode={handleSetMode} />
}

export default PurchasesControl

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const cookies = nookies.get(context)
  const initialMode = cookies['purchases-control-page-mode'] || null
  return {
    props: {
      initialMode,
    },
  }
}
