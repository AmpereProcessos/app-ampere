'use client'
import React from 'react'

import { motion, AnimatePresence } from 'framer-motion'

import { usePathname } from 'next/navigation'

import { useSession } from '@/components/providers/SessionProvider'
import type { TAuthSession } from '@/lib/authentication/types'
import GeralSidebar from './SidebarOptions/GeralSidebar'
import VendedorSidebar from './SidebarOptions/VendedorSidebar'
import ObrasSidebar from './SidebarOptions/ObrasSidebar'

const sidebar = {
  hidden: {
    x: '-45%',
    opacity: 0.3,
  },
  visible: {
    x: '0',
    opacity: 1,
  },
}

type SidebarProps = {
  sidebarVisible: boolean
}
function AppRouterSidebar({ sidebarVisible }: SidebarProps) {
  const pathname = usePathname()
  const publicOrDocumentPath = pathname?.includes('pdf') || pathname?.includes('publico') || pathname?.includes('auth')
  const { session, status } = useSession({ required: true })

  if (status !== 'authenticated' || publicOrDocumentPath) return null
  return (
    <AnimatePresence>
      <motion.div
        variants={sidebar}
        initial="hidden"
        animate={sidebarVisible ? 'visible' : 'hidden'}
        style={{ maxHeight: 'calc(100vh - 70px)' }}
        className="overscroll-y bg-background scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 border-primary/20 sticky top-[70px] flex w-full flex-col overflow-y-auto border-r px-2 py-4 lg:w-[250px]"
      >
        {session.user?.visualizacao.tipo === 'OPERACIONAL' ? (
          <GeralSidebar
            session={session}
            userAccessibleRoutes={session.user?.permissoes.rotas}
            userIsManager={session.user?.permissoes.comercial.editar}
            userIsController={session.user?.permissoes.ordensDeServico.visualizar}
          />
        ) : null}
        {session.user?.visualizacao.tipo === 'VENDAS' ? (
          <VendedorSidebar
            userAccessibleRoutes={(session.user?.permissoes.rotas || []) as never[]}
            userVisualization={session.user?.visualizacao}
            sellerName={session.user?.visualizacao.referencia}
          />
        ) : null}
        {session.user?.visualizacao.tipo === 'EXECUÇÃO' ? <ObrasSidebar technicalTeam={session.user?.visualizacao.referencia} /> : null}
      </motion.div>
    </AnimatePresence>
  )
}

export default AppRouterSidebar
