import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from '@/components/providers/SessionProvider'
import type { TAuthSession } from '@/lib/authentication/types'
import { FaBox, FaWpforms } from 'react-icons/fa'
import LoadingPage from '../../components/utils/LoadingPage'
import { BsClipboardCheckFill } from 'react-icons/bs'
import { TbSeparatorVertical } from 'react-icons/tb'
function GestaoAlmoxarifado() {
  const router = useRouter()
  const { session, status } = useSession({
    required: true,
  })

  useEffect(() => {
    if (!session?.user?.permissoes.rotas?.includes('Obras') && !session?.user?.permissoes.rotas?.includes('Almoxarifado')) {
      router.push('/')
    }
  }, [session])
  if (status !== 'authenticated') return <LoadingPage />

  return (
    <div className="flex w-full grow flex-col p-6">
      <div className="mt-5 flex flex-col">
        <h1 className="text-center text-2xl font-black text-[#15599a] uppercase">Áreas de controle</h1>
        <div className="mt-5 flex w-full flex-wrap justify-center gap-4">
          <Link href="/almoxarifado/formularios">
            <div className="border-primary/20 dark:hover:bg-primary/10 flex w-full cursor-pointer flex-col gap-2 rounded-md border p-3 shadow-xs duration-300 ease-in-out hover:border-blue-300 hover:bg-blue-100 lg:w-[500px]">
              <h1 className="text-center leading-none font-bold tracking-tight">FORMULÁRIOS DE SAÍDA</h1>
              <div className="flex w-full items-center justify-center p-2">
                <FaWpforms style={{ color: '#15599a', fontSize: '45px' }} />
              </div>
              <p className="text-primary/60 text-center font-light">Área de criação e controle dos formulários de saída de materiais.</p>
            </div>
          </Link>
          <Link href="/almoxarifado/estoque">
            <div className="border-primary/20 dark:hover:bg-primary/10 flex w-full cursor-pointer flex-col gap-2 rounded-md border p-3 shadow-xs duration-300 ease-in-out hover:border-blue-300 hover:bg-blue-100 lg:w-[500px]">
              <h1 className="text-center leading-none font-bold tracking-tight">ESTOQUE</h1>
              <div className="flex w-full items-center justify-center p-2">
                <FaBox style={{ color: '#15599a', fontSize: '45px' }} />
              </div>
              <p className="text-primary/60 text-center font-light">Área de gestão do itens estocados. Controle quantidade, preços e localização.</p>
            </div>
          </Link>
          <Link href="/obras/conferenciaMaterial">
            <div className="border-primary/20 dark:hover:bg-primary/10 flex w-full cursor-pointer flex-col gap-2 rounded-md border p-3 shadow-xs duration-300 ease-in-out hover:border-blue-300 hover:bg-blue-100 lg:w-[500px]">
              <h1 className="text-center leading-none font-bold tracking-tight">ENTREGAS PARA CONFERÊNCIA</h1>
              <div className="flex w-full items-center justify-center p-2">
                <BsClipboardCheckFill style={{ color: '#15599a', fontSize: '45px' }} />
              </div>
              <p className="text-primary/60 text-center font-light">
                Projetos com entregas recentes para conferência de materiais e abertura de chamados.
              </p>
            </div>
          </Link>
          <Link href="/almoxarifado/separacao">
            <div className="border-primary/20 dark:hover:bg-primary/10 flex w-full cursor-pointer flex-col gap-2 rounded-md border p-3 shadow-xs duration-300 ease-in-out hover:border-blue-300 hover:bg-blue-100 lg:w-[500px]">
              <h1 className="text-center leading-none font-bold tracking-tight">PROJETOS P/SEPARAÇÃO</h1>
              <div className="flex w-full items-center justify-center p-2">
                <TbSeparatorVertical style={{ color: '#15599a', fontSize: '45px' }} />
              </div>
              <p className="text-primary/60 text-center font-light">Projetos com obras em preparação para separação de materiais.</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default GestaoAlmoxarifado
