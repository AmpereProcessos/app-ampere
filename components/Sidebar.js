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

function Sidebar({ sidebarVisible }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  if (router.pathname.includes('pdf') || router.pathname.includes('publico') || router.pathname.includes('auth')) return null
  if (status == 'loading' || status == 'unauthenticated') return null
  if (status == 'authenticated') {
    return (
      <AnimatePresence>
        <motion.div
          variants={sidebar}
          initial="hidden"
          animate={sidebarVisible ? 'visible' : 'hidden'}
          style={{ maxHeight: 'calc(100vh - 70px)' }}
          className="flex py-4 px-2 flex-col bg-[#fff] sticky top-[70px] w-full md:w-[250px] overflow-y-auto overscroll-y scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 border-r border-gray-300"
        >
          {session.user?.visualizacao == undefined || session.user?.visualizacao == 'REGIONAL' ? (
            <GeralSidebar
              userAccessibleRoutes={session.user?.accessibleRoutes}
              userIsManager={session.user?.manager}
              userVisualization={session.user?.visualizacao}
              userIsController={session.user?.controller}
            />
          ) : null}
          {session.user?.visualizacao == 'INSIDE' || session.user?.visualizacao == 'VENDEDOR' ? (
            <VendedorSidebar
              userAccessibleRoutes={session.user?.accessibleRoutes}
              userVisualization={session.user?.visualizacao}
              sellerName={session.user?.vendedor}
            />
          ) : null}
          {session.user?.visualizacao == 'OBRAS' ? <ObrasSidebar technicalTeam={session.user?.equipe} /> : null}
        </motion.div>
      </AnimatePresence>
    )
  }
}

export default Sidebar
