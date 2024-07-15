import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import LoadingPage from '../../components/utils/LoadingPage'
import UnauthorizedPage from '@/components/utils/UnauthorizedPage'
import { useExecutionStats } from '@/utils/methods/query/stats'
import { BsCalendarEvent, BsPatchCheck, BsTruck } from 'react-icons/bs'
import { VscDebugStart } from 'react-icons/vsc'
import { FaHourglassStart, FaPiggyBank } from 'react-icons/fa'
import { formatDecimalPlaces } from '@/utils/constants'
import { MdElectricMeter, MdRoofing } from 'react-icons/md'
import { FaListCheck } from 'react-icons/fa6'
function GestaoDeObras() {
  const router = useRouter()
  const { data: session, status } = useSession({ required: true })
  const isAuthorized = session?.user.permissoes.rotas.includes('Obras')

  const { data: stats, isLoading, isError, isSuccess } = useExecutionStats()

  if (status != 'authenticated') return <LoadingPage />
  if (!isAuthorized) return <UnauthorizedPage />
  return (
    <div className="flex w-full grow flex-col p-6">
      <div className="flex flex-col">
        <div className="flex w-full items-center justify-center rounded bg-[#15599a] p-2">
          <h1 className="font-bold text-white">DADOS DO PERÍODO</h1>
        </div>
        <div className="mt-2 flex w-full flex-col items-center justify-around gap-2 lg:flex-row">
          <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-6 shadow-sm lg:w-1/3">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium uppercase tracking-tight">OBRAS INICIADAS</h1>
              <VscDebugStart />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">{stats?.periodo?.iniciados || 0}</div>
              <div className="flex items-center gap-1">
                <FaHourglassStart />
                <p className="text-xs font-medium uppercase text-gray-800">
                  {formatDecimalPlaces((stats?.periodo.tempoMedioPlanejamento || 0) / 24)} dias em média de planejamento
                </p>
              </div>
            </div>
          </div>
          <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-6 shadow-sm lg:w-1/3">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium uppercase tracking-tight">OBRAS CONCLUÍDAS</h1>
              <BsPatchCheck />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">{stats?.periodo?.executados || 0}</div>
              <div className="flex items-center gap-1">
                <FaHourglassStart />
                <p className="text-xs font-medium uppercase text-gray-800">
                  {formatDecimalPlaces((stats?.periodo.tempoMedioExecucao || 0) / 24)} dias em média de execução
                </p>
              </div>
            </div>
          </div>
          <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-6 shadow-sm lg:w-1/3">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium uppercase tracking-tight">ENTREGAS</h1>
              <BsTruck />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">{stats?.periodo?.entregasEfetivadas || 0}</div>
              <div className="flex items-center gap-1">
                <BsCalendarEvent />
                <p className="text-xs font-medium uppercase text-gray-800">
                  {formatDecimalPlaces(stats?.periodo.entregasPrevistas || 0)} previstas em 30 dias
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex w-full items-center justify-center rounded bg-[#15599a] p-2">
          <h1 className="font-bold text-white">PENDÊNCIAS DE ADEQUAÇÃO</h1>
        </div>
        <div className="mt-2 flex w-full flex-col items-center justify-around gap-2 lg:flex-row">
          <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-6 shadow-sm lg:w-1/3">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium uppercase tracking-tight">PADRÕES</h1>
              <MdElectricMeter />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">{stats?.adequacoesPadrao?.total || 0}</div>
              <div className="flex items-center gap-1">
                <FaPiggyBank />
                <p className="text-xs font-medium uppercase text-gray-800">{stats?.adequacoesPadrao.pagos} pagos</p>
              </div>
            </div>
          </div>
          <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-6 shadow-sm lg:w-1/3">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium uppercase tracking-tight">ESTRUTURAS</h1>
              <MdRoofing />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">{stats?.adequacoesEstrutura?.total || 0}</div>
              <div className="flex items-center gap-1">
                <FaPiggyBank />
                <p className="text-xs font-medium uppercase text-gray-800">{stats?.adequacoesEstrutura.pagos} pagos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex w-full items-center justify-center rounded bg-[#fead41] p-2">
        <h1 className="font-bold text-white">ÁREAS DE CONTROLE</h1>
      </div>
      <div className="mt-5 flex w-full flex-wrap justify-center gap-4">
        <Link href="/obras/controle-padroes">
          <div className="flex w-full cursor-pointer flex-col gap-2 rounded-md border border-gray-300 p-3 shadow-sm duration-300 ease-in-out hover:border-blue-300 hover:bg-blue-100 lg:w-[45%]">
            <h1 className="text-center font-bold leading-none tracking-tight">CONTROLE DE PADRÕES</h1>
            <div className="flex w-full items-center justify-center p-2">
              <MdElectricMeter style={{ color: '#15599a', fontSize: '45px' }} />
            </div>
            <p className="text-center font-light text-gray-500">Área de gestão e controle de adequações de padrões pendentes.</p>
          </div>
        </Link>
        <Link href="/obras/controle-estruturas">
          <div className="flex w-full cursor-pointer flex-col gap-2 rounded-md border border-gray-300 p-3 shadow-sm duration-300 ease-in-out hover:border-blue-300 hover:bg-blue-100 lg:w-[45%]">
            <h1 className="text-center font-bold leading-none tracking-tight">CONTROLE DE ESTRUTURAS</h1>
            <div className="flex w-full items-center justify-center p-2">
              <MdRoofing style={{ color: '#15599a', fontSize: '45px' }} />
            </div>
            <p className="text-center font-light text-gray-500">Área de gestão e controle de adequações de estruturas pendentes.</p>
          </div>
        </Link>
        <Link href="/obras/conferenciaMaterial">
          <div className="flex w-full cursor-pointer flex-col gap-2 rounded-md border border-gray-300 p-3 shadow-sm duration-300 ease-in-out hover:border-blue-300 hover:bg-blue-100 lg:w-[45%]">
            <h1 className="text-center font-bold leading-none tracking-tight">ENTREGAS PARA CONFERÊNCIA</h1>
            <div className="flex w-full items-center justify-center p-2">
              <FaListCheck style={{ color: '#15599a', fontSize: '45px' }} />
            </div>
            <p className="text-center font-light text-gray-500">Área de controle e conferência de materiais.</p>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default GestaoDeObras
