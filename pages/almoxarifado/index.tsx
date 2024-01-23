import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { FaBox, FaWpforms } from 'react-icons/fa'
import LoadingPage from '../../components/utils/LoadingPage'
import { BsClipboardCheckFill } from 'react-icons/bs'
import { TbSeparatorVertical } from 'react-icons/tb'
function GestaoAlmoxarifado() {
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/authHome')
    },
  })

  useEffect(() => {
    if (!session?.user?.accessibleRoutes?.includes('Obras') && !session?.user?.accessibleRoutes?.includes('Almoxarifado')) {
      router.push('/')
    }
  }, [session])
  if (status != 'authenticated') return <LoadingPage />

  return (
    <div className="flex w-full grow flex-col p-6">
      <div className="mt-5 flex flex-col">
        <h1 className="text-center text-2xl font-black uppercase text-[#15599a]">Áreas de controle</h1>
        <div className="mt-5 flex w-full flex-wrap justify-center gap-4">
          <Link href="/almoxarifado/formularios">
            <div className="flex w-full cursor-pointer flex-col gap-2 rounded-md border border-gray-300 p-3 shadow-sm duration-300 ease-in-out hover:border-blue-300 hover:bg-blue-100 lg:w-[45%]">
              <h1 className="text-center font-bold leading-none tracking-tight">FORMULÁRIOS DE SAÍDA</h1>
              <div className="flex w-full items-center justify-center p-2">
                <FaWpforms style={{ color: '#15599a', fontSize: '45px' }} />
              </div>
              <p className="text-center font-light text-gray-500">Área de criação e controle dos formulários de saída de materiais.</p>
            </div>
          </Link>
          <Link href="/almoxarifado/estoque">
            <div className="flex w-full cursor-pointer flex-col gap-2 rounded-md border border-gray-300 p-3 shadow-sm duration-300 ease-in-out hover:border-blue-300 hover:bg-blue-100 lg:w-[45%]">
              <h1 className="text-center font-bold leading-none tracking-tight">ESTOQUE</h1>
              <div className="flex w-full items-center justify-center p-2">
                <FaBox style={{ color: '#15599a', fontSize: '45px' }} />
              </div>
              <p className="text-center font-light text-gray-500">Área de gestão do itens estocados. Controle quantidade, preços e localização.</p>
            </div>
          </Link>
          <Link href="/obras/conferenciaMaterial">
            <div className="flex w-full cursor-pointer flex-col gap-2 rounded-md border border-gray-300 p-3 shadow-sm duration-300 ease-in-out hover:border-blue-300 hover:bg-blue-100 lg:w-[45%]">
              <h1 className="text-center font-bold leading-none tracking-tight">ENTREGAS PARA CONFERÊNCIA</h1>
              <div className="flex w-full items-center justify-center p-2">
                <BsClipboardCheckFill style={{ color: '#15599a', fontSize: '45px' }} />
              </div>
              <p className="text-center font-light text-gray-500">
                Projetos com entregas recentes para conferência de materiais e abertura de chamados.
              </p>
            </div>
          </Link>
          <Link href="/almoxarifado/separacao">
            <div className="flex w-full cursor-pointer flex-col gap-2 rounded-md border border-gray-300 p-3 shadow-sm duration-300 ease-in-out hover:border-blue-300 hover:bg-blue-100 lg:w-[45%]">
              <h1 className="text-center font-bold leading-none tracking-tight">PROJETOS P/SEPARAÇÃO</h1>
              <div className="flex w-full items-center justify-center p-2">
                <TbSeparatorVertical style={{ color: '#15599a', fontSize: '45px' }} />
              </div>
              <p className="text-center font-light text-gray-500">Projetos com obras em preparação para separação de materiais.</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default GestaoAlmoxarifado
