import React from 'react'

import { MdDesignServices } from 'react-icons/md'

import { IoIosCalendar } from 'react-icons/io'

import Link from 'next/link'

function ObrasSidebar({ technicalTeam }) {
  return (
    <>
      <h2 className="text-xs text-gray-500">PRINCIPAL</h2>
      <Link href={'/ordens-de-servico/designadas'}>
        <div className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
          <MdDesignServices style={{ color: '#15599a', fontSize: '20px' }} />
          <p className="pl-3 text-xs text-gray-600">Minhas OSs</p>
        </div>
      </Link>
      {technicalTeam ? (
        <Link href="/operacoes">
          <div className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
            <IoIosCalendar style={{ color: '#15599a', fontSize: '20px' }} />
            <p className="pl-3 text-xs text-gray-600">Operações</p>
          </div>
        </Link>
      ) : (
        false
      )}
    </>
  )
}

export default ObrasSidebar
