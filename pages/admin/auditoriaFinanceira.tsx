import AuditingCard from '@/components/identificador/auditoriaFinanceira/AuditingCard'
import ErrorComponent from '@/components/utils/ErrorComponent'
import LoadingPage from '@/components/utils/LoadingPage'
import { useFinancialAuditing } from '@/utils/methods/query/financial-auditing'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { TProjectFinances } from '../api/stats/financial-auditing'
import { FaDiamond, FaHandHoldingDollar } from 'react-icons/fa6'
import { FaCashRegister, FaPercent } from 'react-icons/fa'
import { formatDate, formatDecimalPlaces, formatToMoney } from '@/utils/constants'
import DateInput from '@/components/inputs/Date'
import { formatDateInputChange } from '@/utils/methods/shared'
import { VscDiffAdded } from 'react-icons/vsc'
import SelectInput from '@/components/inputs/Select'
import ProjectFinancesModal from '@/components/identificador/auditoriaFinanceira/ProjectFinancesModal'

var currentDate = new Date()
const afterDateParam = new Date(currentDate.setMonth(currentDate.getMonth() - 6)).toISOString()
const beforeDateParam = new Date().toISOString()
function FinancesAuditing() {
  const router = useRouter()
  const { data: session, status: sessionStatus } = useSession()
  const isManager = !!session?.user?.manager
  const isADM = !!session?.user?.accessibleRoutes?.includes('ADM')

  const [projectFinancesModal, setProjectFinancesModal] = useState<{ isOpen: boolean; projectId: string | null }>({
    isOpen: false,
    projectId: null,
  })
  const [dateFilter, setDateFilter] = useState<{
    field: string
    after: string
    before: string
  }>({
    field: 'contrato.dataAssinatura',
    after: afterDateParam,
    before: beforeDateParam,
  })
  const {
    data: auditing,
    isLoading,
    isError,
    isSuccess,
  } = useFinancialAuditing({ after: dateFilter.after, before: dateFilter.before, field: dateFilter.field })

  function getStats({ info }: { info?: TProjectFinances[] }) {
    if (!info)
      return {
        projetos: 0,
        receitas: 0,
        despesas: 0,
        margem: 0,
        despesasPorTipo: {},
      }
    const projects = info.length
    const totalRevenues = info.reduce((acc, current) => {
      const currentTotalRevenue = Object.values(current.receitas).reduce((acc, current) => acc + current, 0)
      acc += currentTotalRevenue
      return acc
    }, 0)
    const totalExpenses = info.reduce((acc, current) => {
      const currentTotalRevenue = Object.values(current.despesas).reduce((acc, current) => acc + current, 0)
      acc += currentTotalRevenue
      return acc
    }, 0)
    const overallMargin = ((totalRevenues - totalExpenses) * 100) / totalRevenues

    const expensesByType = info.reduce((acc: { [key: string]: number }, current) => {
      Object.entries(current.despesas).forEach(([key, value]) => {
        if (!acc[key]) acc[key] = value
        acc[key] += value
      })
      return acc
    }, {})
    console.log(expensesByType)
    return {
      projetos: projects,
      receitas: totalRevenues,
      despesas: totalExpenses,
      margem: overallMargin,
      despesasPorTipo: expensesByType,
    }
  }
  useEffect(() => {
    if (session) {
      if (!isManager && !isADM) router.push('/')
    }
  }, [session])
  if (sessionStatus == 'loading') return <LoadingPage />

  if (sessionStatus != 'authenticated') return <LoadingPage />

  return (
    <div className="flex grow flex-col p-6">
      <div className="flex flex-col items-center border-b border-gray-200 px-1 py-2">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col items-center gap-2 lg:flex-row">
            <p className="text-center text-2xl font-black uppercase text-[#15599a]">AUDITORIA FINANCEIRA</p>
          </div>
          <div className="flex items-center justify-center gap-x-2">
            <SelectInput
              label="PARÂMETRO"
              showLabel={false}
              value={dateFilter.field}
              options={[
                { id: 1, label: 'ASSINATURA DE CONTRATO', value: 'contrato.dataAssinatura' },
                { id: 2, label: 'CONCLUSÃO DE OBRA', value: 'obra.saida' },
              ]}
              selectedItemLabel="CAMPO PADRÃO"
              handleChange={(value) => setDateFilter((prev) => ({ ...prev, field: value }))}
              onReset={() => setDateFilter((prev) => ({ ...prev, field: 'contrato.dataAssinatura' }))}
            />
            <div className="w-full lg:w-[250px]">
              <DateInput
                width={'100%'}
                label={'DEPOIS DE'}
                showLabel={false}
                value={dateFilter.after ? formatDate(dateFilter.after) : undefined}
                handleChange={(value) => setDateFilter((prev) => ({ ...prev, after: formatDateInputChange(value) }))}
              />
            </div>
            <h1 className="font-bold">ATÉ</h1>
            <div className="w-full lg:w-[250px]">
              <DateInput
                width={'100%'}
                label={'ANTES DE'}
                showLabel={false}
                value={dateFilter.before ? formatDate(dateFilter.before) : undefined}
                handleChange={(value) => setDateFilter((prev) => ({ ...prev, before: formatDateInputChange(value) }))}
              />
            </div>
          </div>
        </div>
        <div className="my-2 flex w-full flex-col items-center justify-center gap-3 lg:flex-row">
          <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-3 shadow-sm lg:w-1/4">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium uppercase tracking-tight">PROJETOS NO ESTÁGIO</h1>
              <VscDiffAdded />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: auditing }).projetos}</div>
            </div>
          </div>
          <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-3 shadow-sm lg:w-1/4">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium uppercase tracking-tight">RECEITAS</h1>
              <FaHandHoldingDollar />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">{formatToMoney(getStats({ info: auditing }).receitas)}</div>
            </div>
          </div>
          <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-3 shadow-sm lg:w-1/4">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium uppercase tracking-tight">DESPESAS</h1>
              <FaCashRegister />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">{formatToMoney(getStats({ info: auditing }).despesas)} </div>
            </div>
          </div>
          <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-3 shadow-sm lg:w-1/4">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium uppercase tracking-tight">MARGEM</h1>
              <FaPercent />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">{formatDecimalPlaces(getStats({ info: auditing }).margem)}%</div>
            </div>
          </div>
        </div>
        <div className="flex min-h-[70px] w-full gap-2 rounded-xl border border-gray-200 bg-[#fff] p-3 shadow-sm">
          <div className="flex items-center gap-2">
            <FaDiamond />
            <h1 className="text-sm font-medium uppercase tracking-tight">DESPESAS POR TIPO</h1>
          </div>
          <div className="mt-2 flex grow flex-wrap items-center justify-around">
            {Object.entries(getStats({ info: auditing }).despesasPorTipo).map(([key, value], index) => (
              <p key={index} className="text-[0.8rem] text-gray-500">
                {key}: <strong>{formatToMoney(value)}</strong>
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap justify-around gap-3">
        {isLoading ? <LoadingPage /> : null}
        {isError ? <ErrorComponent msg={'Erro ao buscar dados para auditoria financeira.'} /> : null}
        {isSuccess
          ? auditing.map((info) => (
              <AuditingCard key={info._id} info={info} handleClick={(id: string) => setProjectFinancesModal({ isOpen: true, projectId: id })} />
            ))
          : null}
      </div>
      {projectFinancesModal.isOpen && projectFinancesModal.projectId ? (
        <ProjectFinancesModal
          projectId={projectFinancesModal.projectId}
          closeModal={() => setProjectFinancesModal({ isOpen: false, projectId: null })}
        />
      ) : null}
    </div>
  )
}

export default FinancesAuditing
