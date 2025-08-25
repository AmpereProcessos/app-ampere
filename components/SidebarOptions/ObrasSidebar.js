import React from 'react'

import { MdDesignServices } from 'react-icons/md'

import { IoIosCalendar } from 'react-icons/io'

import Link from 'next/link'

function ObrasSidebar({ technicalTeam }) {
  return (
    <>
      <h2 className="text-primary/60 text-xs">PRINCIPAL</h2>
      <Link href={'/ordens-de-servico/designadas'}>
        <div className="dark:hover:bg-primary/10 mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
          <MdDesignServices style={{ color: '#15599a', fontSize: '20px' }} />
          <p className="text-primary/80 pl-3 text-xs">Minhas OSs</p>
        </div>
      </Link>
      {technicalTeam ? (
        <Link href="/operacoes">
          <div className="dark:hover:bg-primary/10 mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
            <IoIosCalendar style={{ color: '#15599a', fontSize: '20px' }} />
            <p className="text-primary/80 pl-3 text-xs">Operações</p>
          </div>
        </Link>
      ) : (
        false
      )}
    </>
  )
}

export default ObrasSidebar
