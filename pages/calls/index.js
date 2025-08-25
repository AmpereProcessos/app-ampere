import Link from 'next/link'
import React, { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession } from '../../components/providers/SessionProvider'
import LoadingPage from '../../components/utils/LoadingPage'
function Calls() {
  const router = useRouter()
  const { session, status } = useSession({ required: true })
  if (status != 'authenticated') return <LoadingPage />

  return (
    <div className="bg-primary/20 flex w-full grow flex-col p-6">
      <div className="bg-background border-primary/20 flex w-full items-center justify-around border p-4 shadow-xl">
        <h1 className="text-center font-['Roboto'] text-xl font-bold text-[#15599a] uppercase">Tipos de chamados</h1>
      </div>

      <div className="mt-5 flex w-full flex-wrap gap-4">
        {session?.user?.permissoes.rotas.includes('PPS') ? (
          <Link href="/calls/chamadosPPS">
            <div className="bg-background border-primary/20 flex h-[250px] w-full grow cursor-pointer flex-col justify-center border p-4 shadow-xl lg:w-[600px]">
              <h1 className="font-raleway text-center uppercase">Chamados Suporte PPS</h1>
            </div>
          </Link>
        ) : (
          false
        )}
        {session?.user?.permissoes.rotas?.includes('O&M') || session?.user?.permissoes.rotas?.includes('Pós-Venda') ? (
          <Link href="/calls/chamadosSuporte">
            <div className="bg-background border-primary/20 flex h-[250px] w-full grow cursor-pointer flex-col justify-center border p-4 shadow-xl lg:w-[600px]">
              <h1 className="font-raleway text-center uppercase">Chamados Suporte</h1>
            </div>
          </Link>
        ) : (
          false
        )}
        {session?.user?.permissoes.rotas.includes('Projetos') ? (
          <Link href="/calls/chamadosProjetos">
            <div className="bg-background border-primary/20 flex h-[250px] w-full grow cursor-pointer flex-col justify-center border p-4 shadow-xl lg:w-[600px]">
              <h1 className="font-raleway text-center uppercase">Chamados Projetos</h1>
            </div>
          </Link>
        ) : (
          false
        )}
        {session?.user?.permissoes.rotas.includes('ADM') ? (
          <Link href="/calls/chamadosADM">
            <div className="bg-background border-primary/20 flex h-[250px] w-full grow cursor-pointer flex-col justify-center border p-4 shadow-xl lg:w-[600px]">
              <h1 className="font-raleway text-center uppercase">Chamados ADM</h1>
            </div>
          </Link>
        ) : (
          false
        )}
        {session?.user?.permissoes.rotas.includes('Suprimentos') ? (
          <Link href="/calls/chamadosSuprimentos">
            <div className="bg-background border-primary/20 flex h-[250px] w-full grow cursor-pointer flex-col justify-center border p-4 shadow-xl lg:w-[600px]">
              <h1 className="font-raleway text-center uppercase">Chamados Suprimentos</h1>
            </div>
          </Link>
        ) : (
          false
        )}
      </div>
    </div>
  )
}

export default Calls
