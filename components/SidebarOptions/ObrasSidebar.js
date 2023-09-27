import React from 'react'

import { MdDesignServices } from 'react-icons/md'

import { IoIosCalendar } from 'react-icons/io'

import Link from 'next/link'

function ObrasSidebar({ technicalTeam }) {
  return (
    <>
      <h2 className="text-xs text-gray-500">PRINCIPAL</h2>
      <Link href={'/ordemDeServico/designadas'}>
        <a className="hover:bg-blue-100 hover:scale-105 duration-300 ease-in py-2 pl-2 cursor-pointer flex items-center mt-2">
          <MdDesignServices style={{ color: '#15599a', fontSize: '20px' }} />
          <p className="pl-3 text-xs text-gray-600">Minhas OSs</p>
        </a>
      </Link>
      {technicalTeam ? (
        <Link href="/operacoes">
          <a className="hover:bg-blue-100 hover:scale-105 duration-300 ease-in py-2 pl-2 cursor-pointer flex items-center mt-2">
            <IoIosCalendar style={{ color: '#15599a', fontSize: '20px' }} />
            <p className="pl-3 text-xs text-gray-600">Operações</p>
          </a>
        </Link>
      ) : (
        false
      )}
    </>
  )
}

export default ObrasSidebar
