import React, { useContext, useState } from 'react'

import { motion, AnimatePresence } from 'framer-motion'

import { useRouter } from 'next/router'

import { useSession } from 'next-auth/react'
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
function Sidebar({ sidebarVisible }: SidebarProps) {
  const router = useRouter()
  const publicOrDocumentPath = router.pathname.includes('pdf') || router.pathname.includes('publico') || router.pathname.includes('auth')
  const { data: session, status } = useSession()

  if (status != 'authenticated' || publicOrDocumentPath) return null
  return (
    <AnimatePresence>
      <motion.div
        variants={sidebar}
        initial="hidden"
        animate={sidebarVisible ? 'visible' : 'hidden'}
        style={{ maxHeight: 'calc(100vh - 70px)' }}
        className="overscroll-y sticky top-[70px] flex w-full flex-col overflow-y-auto border-r border-gray-300 bg-[#fff] py-4 px-2 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 lg:w-[250px]"
      >
        {session.user?.visualizacao.tipo == 'OPERACIONAL' ? (
          <GeralSidebar
            session={session}
            userAccessibleRoutes={session.user?.permissoes.rotas}
            userIsManager={session.user?.permissoes.comercial.editar}
            userIsController={session.user?.permissoes.ordensDeServico.visualizar}
          />
        ) : null}
        {session.user?.visualizacao.tipo == 'VENDAS' ? (
          <VendedorSidebar
            userAccessibleRoutes={session.user?.permissoes.rotas}
            userVisualization={session.user?.visualizacao}
            sellerName={session.user?.visualizacao.referencia}
          />
        ) : null}
        {session.user?.visualizacao.tipo == 'EXECUÇÃO' ? <ObrasSidebar technicalTeam={session.user?.visualizacao.referencia} /> : null}
      </motion.div>
    </AnimatePresence>
  )
}

export default Sidebar
