import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import LoadingPage from '../../components/utils/LoadingPage'
function GestaoDeObras() {
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/signin')
    },
  })

  const [stats, setStats] = useState({})
  function getStats() {
    axios.get('/api/gestaoDeObras/estatisticas').then((res) => setStats(res.data))
  }
  useEffect(() => {
    if (session?.user.permissoes.rotas.includes('Obras')) {
      getStats()
    } else {
      if (session?.user) {
        router.push('/')
      }
    }
  }, [session])
  if (status == 'loading') return <LoadingPage />
  if (status == 'authenticated') {
    return (
      <div className="flex w-full grow flex-col p-6">
        <div className="flex flex-col">
          <h1 className="text-center font-ralewayBlack text-xl font-bold uppercase text-[#15599a]">PENDÊNCIAS</h1>
          <div className="grid grid-cols-1 grid-rows-6  gap-3 lg:grid-cols-6 lg:grid-rows-1">
            <div className="flex h-[250px] flex-col border border-gray-200 bg-[#fff] p-4 shadow-xl">
              <div className="flex justify-between">
                <h1 className="uppercase text-gray-600">PADRÕES</h1>
              </div>
              <p className="flex grow items-center justify-center text-center text-2xl font-bold text-[#fead61]">
                {stats.padroes && stats.padroes.total}
              </p>
              <p className="text-center text-gray-600">
                PAGOS: <strong className="text-red-500">{stats.padroes && stats.padroes.parcial}</strong>
              </p>
            </div>
            <div className="flex h-[250px] flex-col border border-gray-200 bg-[#fff] p-4 shadow-xl">
              <div className="flex justify-between">
                <h1 className="uppercase text-gray-600">ESTRUTURAS</h1>
              </div>
              <p className="flex grow items-center justify-center text-center text-2xl font-bold text-[#fead61]">
                {stats.estruturas && stats.estruturas.total}
              </p>
              <p className="text-center text-gray-600">
                PAGOS: <strong className="text-red-500">{stats.estruturas && stats.estruturas.parcial}</strong>
              </p>
            </div>
            <div className="flex h-[250px] flex-col border border-gray-200 bg-[#fff] p-4 shadow-xl">
              <div className="flex justify-between">
                <h1 className="uppercase text-gray-600">OBRAS</h1>
              </div>
              <p className="flex grow items-center justify-center text-center text-2xl font-bold text-[#fead61]">
                {stats.obras && stats.obras.total}
              </p>
              <div className="flex flex-col gap-2">
                <p className="text-center text-gray-600">
                  ENTREGUES: <strong className="text-red-500">{stats.obras && stats.obras.parcial}</strong>
                </p>
                <p className="text-center text-gray-600">
                  PARA SEPARAR:
                  <strong className="text-red-500">{stats.obras && stats.obras.separacaoPendente}</strong>
                </p>
              </div>
            </div>
            <div className="flex h-[250px] flex-col border border-gray-200 bg-[#fff] p-4 shadow-xl">
              <div className="flex justify-between">
                <h1 className="uppercase text-gray-600">COMPRAS A FAZER</h1>
              </div>
              <p className="flex grow items-center justify-center text-center text-2xl font-bold text-[#fead61]">
                {stats.compras && stats.compras.total}
              </p>
              <p className="text-center text-gray-600">
                ENTREGUES: <strong className="text-red-500">{stats.compras && stats.compras.parcial}</strong>
              </p>
            </div>
            <div className="flex h-[250px] flex-col border border-gray-200 bg-[#fff] p-4 shadow-xl">
              <div className="flex justify-between">
                <h1 className="uppercase text-gray-600">PROJETOS COM OS aberta</h1>
              </div>
              <p className="flex grow items-center justify-center text-center text-2xl font-bold text-[#fead61]">{stats.oss && stats.oss.total}</p>
            </div>
            <div className="flex h-[250px] flex-col border border-gray-200 bg-[#fff] p-4 shadow-xl">
              <div className="flex justify-between">
                <h1 className="uppercase text-gray-600">OBSERVAÇÕES A PREENCHER</h1>
              </div>
              <p className="flex grow items-center justify-center text-center text-2xl font-bold text-[#fead61]">
                {stats.obras && stats.obras.obsPendente}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-5 flex flex-col">
          <h1 className="text-center font-ralewayBlack text-xl font-bold uppercase text-[#15599a]">Áreas de controle</h1>
          <div className="mt-5 flex w-full flex-wrap gap-4">
            <Link href="/obras/controlePadroes">
              <div className="flex h-[250px] w-full grow cursor-pointer flex-col justify-center border border-gray-200 bg-[#fff] p-4 shadow-xl lg:min-w-[600px]">
                <h1 className="text-center font-raleway uppercase">Controle de Padrões</h1>
              </div>
            </Link>
            <Link href="/obras/controleEstruturas">
              <div className="flex h-[250px] w-full grow cursor-pointer flex-col justify-center border border-gray-200 bg-[#fff] p-4 shadow-xl lg:min-w-[600px]">
                <h1 className="text-center font-raleway uppercase">Controle de Estruturas</h1>
              </div>
            </Link>
            <Link href="/obras/conferenciaMaterial">
              <div className="flex h-[250px] w-full grow cursor-pointer flex-col justify-center border border-gray-200 bg-[#fff] p-4 shadow-xl lg:min-w-[600px]">
                <h1 className="text-center font-raleway uppercase">Conferência de Material</h1>
              </div>
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

export default GestaoDeObras
