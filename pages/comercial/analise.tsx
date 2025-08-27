import { useSession } from '@/components/providers/SessionProvider'
import React, { useEffect, useState } from 'react'

import ErrorComponent from '../../components/utils/ErrorComponent'
import LoadingPage from '../../components/utils/LoadingPage'

import AnaliseBlock from '../../components/identificador/comercial/AnaliseBlock'

import DateInput from '../../components/inputs/Date'
import MultipleSelectInput from '../../components/inputs/MultipleSelect'
import TextInput from '../../components/inputs/Text'

import UnauthenticatedComponent from '@/components/utils/UnauthenticatedComponent'
import type { TAuthSession } from '@/lib/authentication/types'
import { ImPower } from 'react-icons/im'
import { MdAttachMoney } from 'react-icons/md'
import { VscDiffAdded } from 'react-icons/vsc'
import { formatDate, formatDecimalPlaces, formatToMoney } from '../../utils/constants'
import { useComercialAnalyticalData } from '../../utils/methods/query/comercial'
import { formatDateInputChange } from '../../utils/methods/shared'
import { allSellers } from '../../utils/select-options'
import type { TComercialAnalyticalItem } from '../api/projects/analitico/comercial'
const currentDate = new Date()

function Analise() {
  const { session, status } = useSession()
  if (status === 'loading') return <LoadingPage />
  if (status === 'unauthenticated') return <UnauthenticatedComponent />
  return <AnaliseContent session={session} />
}

export default Analise

function AnaliseContent({ session }: { session: TAuthSession }) {
  const [dateFilter, setDateFilter] = useState({
    after: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1, -3).toISOString(),
    before: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1).toISOString(),
  })
  const {
    data: projects,
    isSuccess,
    isLoading,
    isError,
    filters,
    setFilters,
  } = useComercialAnalyticalData({
    after: dateFilter.after,
    before: dateFilter.before,
  })

  function getStats({ info }: { info: TComercialAnalyticalItem[] | undefined }) {
    if (!info)
      return {
        projetos: {
          app: 0,
          crm: 0,
        },
        potencia: {
          app: 0,
          crm: 0,
        },
        vendido: {
          app: 0,
          crm: 0,
        },
      }
    const power = info.reduce(
      (acc, current) => {
        const appPower = current.potenciaPico || 0
        const crmPower = current.proposta.potenciaPico || 0
        acc.app += appPower
        acc.crm += crmPower
        return acc
      },
      { app: 0, crm: 0 }
    )
    const value = info.reduce(
      (acc, current) => {
        const appValue = current.valorContrato || 0
        const crmValue = current.proposta.valor || 0
        acc.app += appValue
        acc.crm += crmValue
        return acc
      },
      { app: 0, crm: 0 }
    )
    const count = info.reduce(
      (acc, current) => {
        const hasVinculatedProject = !!current.proposta.id
        acc.app += 1
        if (hasVinculatedProject) acc.crm += 1
        return acc
      },
      { app: 0, crm: 0 }
    )
    return {
      projetos: count,
      potencia: power,
      vendido: value,
    }
  }
  useEffect(() => {
    if (session) {
      const userRoutes = session?.user.permissoes.rotas
    }
  }, [session])
  return (
    <div className="flex grow flex-col p-6">
      <div className="border-primary/20 mb-2 flex flex-col items-center justify-between border-b p-1">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-wrap items-center justify-center gap-2 font-['Roboto']">
            <p className="text-center text-2xl font-bold text-[#15599a] uppercase">ANÁLISE COMERCIAL</p>
          </div>
        </div>
        <div className="my-2 flex w-full flex-col items-center justify-center gap-3 lg:flex-row">
          <div className="bg-background border-primary/20 flex min-h-[110px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/3">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium tracking-tight uppercase">CONTAGEM DE PROJETOS</h1>
              <VscDiffAdded />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">APP: {getStats({ info: projects }).projetos.app}</div>
              <p className="text-primary/60 text-sm">CRM: {getStats({ info: projects }).projetos.crm}</p>
            </div>
          </div>
          <div className="bg-background border-primary/20 flex min-h-[110px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/3">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium tracking-tight uppercase">VALOR VENDIDO</h1>
              <MdAttachMoney />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">APP: {formatToMoney(getStats({ info: projects }).vendido.app)}</div>
              <p className="text-primary/60 text-sm">CRM: {formatToMoney(getStats({ info: projects }).vendido.crm)}</p>
            </div>
          </div>
          <div className="bg-background border-primary/20 flex min-h-[110px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/3">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium tracking-tight uppercase">POTÊNCIA VENDIDA</h1>
              <ImPower />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">APP: {formatDecimalPlaces(getStats({ info: projects }).potencia.app)}</div>
              <p className="text-primary/60 text-sm">CRM: {formatDecimalPlaces(getStats({ info: projects }).potencia.crm)}</p>
            </div>
          </div>
        </div>
        <div className="mt-4 flex w-full flex-col gap-y-2">
          <div className="flex flex-col flex-wrap items-end justify-center gap-2 lg:flex-row">
            <TextInput
              label={'NOME DO CONTRATO'}
              value={filters.search}
              placeholder={'Digite o nome do contrato...'}
              handleChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
            />

            <div className="w-full lg:w-[250px]">
              <MultipleSelectInput
                width={'100%'}
                label={'VENDEDOR'}
                selected={filters.sellerName}
                options={allSellers}
                selectedItemLabel={'SEM FILTRO'}
                handleChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    sellerName: value as string[],
                  }))
                }
                onReset={() =>
                  setFilters((prev) => ({
                    ...prev,
                    sellerName: [],
                  }))
                }
              />
            </div>
            <div className="flex items-center justify-center gap-x-2">
              <div className="w-full lg:w-[250px]">
                <DateInput
                  width={'100%'}
                  label={'DEPOIS DE'}
                  value={dateFilter.after ? formatDate(dateFilter.after) : undefined}
                  handleChange={(value) => setDateFilter((prev) => ({ ...prev, after: formatDateInputChange(value) as string }))}
                />
              </div>
              <div className="w-full lg:w-[250px]">
                <DateInput
                  width={'100%'}
                  label={'ANTES DE'}
                  value={dateFilter.before ? formatDate(dateFilter.before) : undefined}
                  handleChange={(value) => setDateFilter((prev) => ({ ...prev, before: formatDateInputChange(value) as string }))}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                setFilters({
                  ...filters,
                  pendingVinculation: !filters.pendingVinculation,
                })
              }
              className={`${filters.pendingVinculation ? 'bg-[#15599a]' : 'bg-blue-300'} flex h-[47px] cursor-pointer items-center justify-center rounded px-2 font-bold text-white`}
            >
              SEM VINCULAÇÃO
            </button>
          </div>
        </div>
      </div>
      {isLoading ? <LoadingPage /> : null}
      {isError ? <ErrorComponent msg={'Erro ao carregar informações da análise. Tente novamente.'} /> : null}
      {isSuccess && projects ? (
        projects.length > 0 ? (
          <div className="flex w-full flex-col gap-2">
            {projects.map((project) => (
              <AnaliseBlock key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="flex grow items-center justify-center">
            <h1 className="text-primary/60 text-lg italic">Nenhuma informação encontrada para o período de análise</h1>
          </div>
        )
      ) : null}
    </div>
  )
}
