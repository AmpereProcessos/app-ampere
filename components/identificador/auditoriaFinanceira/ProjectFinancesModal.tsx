import ErrorComponent from '@/components/utils/ErrorComponent'
import LoadingPage from '@/components/utils/LoadingPage'
import financialAuditing, { TProjectFinances } from '@/pages/api/stats/financial-auditing'
import { formatDecimalPlaces, formatToMoney } from '@/utils/constants'
import { formatDateAsLocale } from '@/utils/methods/formatting'
import { useProjectFinances } from '@/utils/methods/query/financial-auditing'
import React from 'react'
import { FaCashRegister, FaCity, FaSignature, FaTools, FaUser } from 'react-icons/fa'
import { FaDiamond, FaHandHoldingDollar } from 'react-icons/fa6'
import { VscChromeClose } from 'react-icons/vsc'
import ExpenseRevenueListItem from './ExpenseRevenueListItem'
import { GoGoal } from 'react-icons/go'

type ProjectFinancesModalProps = {
  projectId: string
  closeModal: () => void
}

function getBarColor(margin: number) {
  if (margin >= 0.1) return 'text-green-500'
  if (margin > 0.05 && margin < 1) return 'text-orange-500'
  return 'text-red-500'
}
function getResults({ expenses, revenues }: { expenses: TProjectFinances['despesasLista']; revenues: TProjectFinances['receitasLista'] }) {
  if (!expenses || !revenues) return { receitas: 0, despesas: 0, resultado: 0, margem: 0 }
  const totalRevenues = revenues.reduce((acc, current) => acc + current.total, 0)
  const totalExpenses = expenses.reduce((acc, current) => acc + current.total, 0)
  return {
    receitas: totalRevenues,
    despesas: totalExpenses,
    resultado: totalRevenues - totalExpenses,
    margem: (totalRevenues - totalExpenses) / totalRevenues,
  }
}

function ProjectFinancesModal({ projectId, closeModal }: ProjectFinancesModalProps) {
  const { data: finances, isLoading, isSuccess, isError } = useProjectFinances({ id: projectId })
  const { receitas, despesas, resultado, margem } = getResults({ expenses: finances?.despesasLista, revenues: finances?.receitasLista })
  return (
    <div id="defaultModal" className="fixed bottom-0 left-0 right-0 top-0 z-[100] bg-[rgba(0,0,0,.85)]">
      <div className="fixed left-[50%] top-[50%] z-[100] h-[80%] w-[90%] translate-x-[-50%] translate-y-[-50%] rounded-md bg-[#fff] p-[10px] lg:h-[80%] lg:w-[60%]">
        {isLoading ? <LoadingPage /> : null}
        {isError ? <ErrorComponent msg={'Erro ao buscar finanças do projeto.'} /> : null}
        {isSuccess ? (
          <div className="flex h-full flex-col">
            <div className="flex flex-wrap items-center justify-between border-b border-gray-200 px-2 pb-2 text-lg">
              <div className="flex flex-col">
                <h3 className="text-xl font-bold text-[#353432] dark:text-white ">
                  FINANÇAS DE <strong className="text-cyan-500">{finances.nome}</strong>
                </h3>
                <p className="text-xs text-gray-500">#{finances._id}</p>
              </div>

              <button
                onClick={() => closeModal()}
                type="button"
                className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
              >
                <VscChromeClose style={{ color: 'red' }} />
              </button>
            </div>
            <div className="flex grow flex-col gap-2 overflow-y-auto overscroll-y-auto px-2 py-4 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
              <div className="my-2 flex w-full items-center justify-center gap-2">
                <div className="flex w-full items-center justify-center gap-2">
                  <FaUser />
                  <h1 className="text-sm font-bold leading-none tracking-tight">{finances.vendedor}</h1>
                </div>
                <div className="flex w-full items-center justify-center gap-2">
                  <FaCity />
                  <h1 className="text-sm font-bold leading-none tracking-tight">{finances.cidade}</h1>
                </div>
              </div>

              <div className="my-2 flex w-full items-center justify-center gap-2">
                <div className="flex items-center gap-2">
                  <FaSignature />
                  <h1 className="text-xs text-gray-500">ASSINADO EM: {formatDateAsLocale(finances.dataAssinatura)}</h1>
                </div>
                <div className="flex items-center gap-2">
                  <FaTools />
                  <h1 className="text-xs text-gray-500">
                    CONCLUIDO EM: {finances.dataConclusaoObra ? formatDateAsLocale(finances.dataConclusaoObra) : 'NÃO DEFINIDO'}
                  </h1>
                </div>
              </div>
              <div className="mt-4 flex w-full items-center justify-between gap-2 border-b border-gray-500 pb-1">
                <div className="flex items-center gap-1 ">
                  <FaHandHoldingDollar color="rgb(34,197,94)" />
                  <h1 className="text-lg font-bold leading-none tracking-tight text-gray-700">RECEITAS</h1>
                </div>
                <h1 className="text-xs font-bold text-green-700">
                  {formatToMoney(getResults({ expenses: finances.despesasLista, revenues: finances.receitasLista }).receitas)}
                </h1>
              </div>
              <div className="flex w-full flex-col gap-1">
                {finances.receitasLista?.map((revenue, index) => <ExpenseRevenueListItem key={index} finance={revenue} />)}
              </div>
              <div className="mt-4 flex w-full items-center justify-between gap-2 border-b border-gray-500 pb-1">
                <div className="flex items-center gap-1 ">
                  <FaCashRegister color="rgb(239,68,68)" />
                  <h1 className="text-lg font-bold leading-none tracking-tight text-gray-700">DESPESAS</h1>
                </div>
                <h1 className="text-xs font-bold text-red-700">
                  {formatToMoney(getResults({ expenses: finances.despesasLista, revenues: finances.receitasLista }).despesas)}
                </h1>
              </div>
              <div className="flex w-full flex-col gap-1">
                {finances.despesasLista && finances.despesasLista.length > 0 ? (
                  finances.despesasLista.map((expense, index) => <ExpenseRevenueListItem key={index} finance={expense} />)
                ) : (
                  <p className="w-full text-center text-sm italic text-gray-500">Não há despesas vinculadas ao projeto.</p>
                )}
              </div>
            </div>
            <div className="mt-4 flex w-[80%] flex-col items-center self-center rounded-md border border-gray-500 p-2 lg:w-[50%]">
              <div className="flex w-full items-center justify-between">
                <h1 className="text-sm font-black leading-none tracking-tight">RESULTADOS</h1>
                <GoGoal />
              </div>

              <h1 className="mt-2 w-full text-center text-xl font-bold text-[#15599a]">
                {formatToMoney(getResults({ expenses: finances.despesasLista, revenues: finances.receitasLista }).resultado)}
              </h1>
              <p className={`mt-2 text-sm leading-none tracking-tighter text-gray-500`}>
                MARGEM DE:{'  '}
                <strong className={`${getBarColor(getResults({ expenses: finances.despesasLista, revenues: finances.receitasLista }).margem)}`}>
                  {formatDecimalPlaces(getResults({ expenses: finances.despesasLista, revenues: finances.receitasLista }).margem * 100)}%
                </strong>
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default ProjectFinancesModal
