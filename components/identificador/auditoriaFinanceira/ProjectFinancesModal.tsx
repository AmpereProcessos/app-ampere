import ErrorComponent from '@/components/utils/ErrorComponent'
import LoadingPage from '@/components/utils/LoadingPage'
import financialAuditing, { TProjectFinances } from '@/pages/api/stats/financial-auditing'
import { formatDecimalPlaces, formatToMoney } from '@/utils/constants'
import { formatDateAsLocale } from '@/utils/methods/formatting'
import { useProjectFinances } from '@/utils/methods/query/financial-auditing'
import React from 'react'
import { FaCashRegister, FaCity, FaExternalLinkAlt, FaSignature, FaSolarPanel, FaTools, FaUser } from 'react-icons/fa'
import { FaDiamond, FaHandHoldingDollar } from 'react-icons/fa6'
import { VscChromeClose } from 'react-icons/vsc'
import ExpenseRevenueListItem from './ExpenseRevenueListItem'
import { GoGoal } from 'react-icons/go'
import { TbPercentage, TbTopologyFull } from 'react-icons/tb'
import { RxDownload, RxUpload } from 'react-icons/rx'
import { BsCode } from 'react-icons/bs'
import { ImPower } from 'react-icons/im'
import { MdAttachMoney, MdSignalCellularAlt } from 'react-icons/md'
import Link from 'next/link'

const PriceDescription = {
  kit: 'KIT FOTOVOLTAICO',
  instalacao: 'INSTALAÇÃO',
  maoDeObra: 'MÃO DE OBRA',
  projeto: 'CUSTOS DE PROJETO',
  venda: 'CUSTOS DE VENDA',
  padrao: 'ADEQUAÇÕES DE PADRÃO',
  estrutura: 'ADEQUAÇÕES DE ESTRUTURA',
  extra: 'OUTROS SERVIÇOS',
}

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
  const costForecasts = finances?.previsaoDespesas
    ? Object.entries(finances.previsaoDespesas || {}).map(([key, value]) => ({
        identificador: PriceDescription[key as keyof typeof PriceDescription],
        ...value,
      }))
    : []
  return (
    <div id="defaultModal" className="fixed bottom-0 left-0 right-0 top-0 z-[100] bg-[rgba(0,0,0,.85)]">
      <div className="fixed left-[50%] top-[50%] z-[100] h-[80%] w-[90%] translate-x-[-50%] translate-y-[-50%] rounded-md bg-[#fff] p-[10px] lg:h-[80%] lg:w-[60%]">
        {isLoading ? <LoadingPage /> : null}
        {isError ? <ErrorComponent msg={'Erro ao buscar finanças do projeto.'} /> : null}
        {isSuccess ? (
          <div className="flex h-full flex-col">
            <div className="flex flex-wrap items-center justify-between border-b border-gray-200 px-2 pb-2 text-lg">
              <div className="flex flex-col gap-0.5">
                <h3 className="text-sm font-bold text-[#353432] dark:text-white lg:text-xl">
                  FINANÇAS DE <strong className="text-cyan-500">{finances.nome}</strong>
                </h3>
                <p className="text-xxs text-gray-500 lg:text-xs">#{finances._id}</p>
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
              <div className="flex w-full flex-col rounded-xl bg-[#222831] p-2">
                <div className="my-2 flex w-full flex-col items-center justify-center gap-2 lg:flex-row">
                  <div className="flex items-center gap-2 text-white">
                    <FaSignature />
                    <h1 className="text-xs">ASSINADO EM: {formatDateAsLocale(finances.dataAssinatura)}</h1>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <FaTools />
                    <h1 className="text-xs">
                      CONCLUIDO EM: {finances.dataConclusaoObra ? formatDateAsLocale(finances.dataConclusaoObra) : 'NÃO DEFINIDO'}
                    </h1>
                  </div>
                </div>
                <div className="my-2 flex w-full items-center justify-center gap-2">
                  <div className="flex items-center gap-2 text-white">
                    <BsCode color={finances.idProjetoCRM ? 'rgb(6,182,212)' : 'black'} />
                    {finances.idProjetoCRM ? (
                      <a
                        href={`https://crm.ampereenergias.com.br/projeto/id/${finances.idProjetoCRM}`}
                        className="text-[0.65rem] font-medium leading-none tracking-tight text-white hover:text-cyan-500 lg:text-xs"
                      >
                        {finances.identificador}
                      </a>
                    ) : (
                      <p className="text-[0.65rem] font-medium leading-none tracking-tight lg:text-xs">{finances.identificador}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <ImPower />
                    <p className="text-[0.65rem] font-medium leading-none tracking-tight lg:text-xs">{finances.potencia} kWp</p>
                  </div>
                </div>
                <div className="my-2 flex w-full flex-wrap items-center justify-center gap-4">
                  <div className="flex items-center justify-center gap-2 text-white">
                    <FaUser />
                    <h1 className="text-sm font-bold leading-none tracking-tight">{finances.vendedor}</h1>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-white">
                    <FaCity />
                    <h1 className="text-sm font-bold leading-none tracking-tight">{finances.cidade}</h1>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-white">
                    <TbTopologyFull />
                    <h1 className="text-sm font-bold leading-none tracking-tight">{finances.topologia}</h1>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-white">
                    <FaSolarPanel />
                    <h1 className="text-sm font-bold leading-none tracking-tight">{finances.qtdeModulos} MÓDULOS</h1>
                  </div>
                </div>
                <div className="my-4 flex w-full items-center justify-around gap-2">
                  <div className="flex w-1/2 flex-col rounded-xl bg-[#fff] p-2 lg:w-1/3">
                    <div className="grid w-full grid-cols-6 items-center">
                      <div className="col-span-1 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-gray-800 text-white lg:h-[40px] lg:w-[40px]">
                        <RxDownload />
                      </div>
                      <h1 className="col-span-4 hidden text-center font-medium text-gray-500 lg:block">TOTAL EM RECEITAS</h1>
                      <div className="col-span-1"></div>
                    </div>
                    <h1 className="mt-2 block text-center text-xs font-light text-gray-500 lg:hidden">TOTAL EM RECEITAS</h1>

                    <p className="mt-2 w-full text-center text-2xl font-medium text-green-500">R$ {formatDecimalPlaces(receitas)}</p>
                  </div>
                  <div className="flex w-1/2 flex-col rounded-xl bg-[#fff] p-2 lg:w-1/3">
                    <div className="grid w-full grid-cols-6 items-center">
                      <div className="col-span-1 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-gray-800 text-white lg:h-[40px] lg:w-[40px]">
                        <RxUpload />
                      </div>
                      <h1 className="col-span-4 hidden text-center font-medium text-gray-500 lg:block">TOTAL EM DESPESAS</h1>
                      <div className="col-span-1"></div>
                    </div>
                    <h1 className="mt-2 block text-center text-xs font-light text-gray-500 lg:hidden">TOTAL EM DESPESAS</h1>
                    <p className="mt-2 w-full text-center text-2xl font-medium text-[#ff0054]">R$ {formatDecimalPlaces(despesas)} </p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-center">
                  <div className="flex w-1/2 flex-col rounded-xl bg-[#fff] p-2 lg:w-1/3">
                    <div className="grid w-full grid-cols-6 items-center">
                      <div className="col-span-1 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-gray-800 text-white lg:h-[40px] lg:w-[40px]">
                        <GoGoal />
                      </div>
                      <h1 className="col-span-4 hidden text-center font-medium text-gray-500 lg:block">RESULTADOS</h1>
                      <div className="col-span-1"></div>
                    </div>
                    <h1 className="mt-2 block text-center text-xs font-light text-gray-500 lg:hidden">RESULTADOS</h1>
                    <p className="w-full text-center text-2xl font-black">R$ {formatDecimalPlaces(resultado)}</p>
                    <p className="w-full text-center text-sm font-black text-cyan-500">MARGEM DE {formatDecimalPlaces(margem * 100)}%</p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-end">
                  <Link href={`/admin/auditoria-financeira/pdf/${projectId}`}>
                    <div className="flex items-center gap-1 rounded-md py-1 px-2 text-white duration-300 ease-in-out hover:bg-gray-50 hover:text-gray-800">
                      <FaExternalLinkAlt />
                      <p className="text-xs tracking-tight">IR À PÁGINA DE RELATÓRIO</p>
                    </div>
                  </Link>
                </div>
              </div>
              <div className="flex w-full items-center justify-center">
                <h1 className="text-lg font-black leading-none tracking-tight text-[#70e000]">RECEITAS</h1>
              </div>
              <div className="flex w-full flex-col gap-1">
                {finances.receitasLista && finances.receitasLista.length > 0 ? (
                  finances.receitasLista.map((revenue, index) => <ExpenseRevenueListItem key={index} finance={revenue} tag="REVENUE" />)
                ) : (
                  <p className="w-full text-center text-sm italic text-gray-500">Não há receitas vinculadas ao projeto.</p>
                )}
              </div>
              <div className="flex w-full items-center justify-center">
                <h1 className="text-lg font-black leading-none tracking-tight text-[#ed174c]">DESPESAS</h1>
              </div>
              <div className="flex w-full flex-col gap-1">
                {finances.despesasLista && finances.despesasLista.length > 0 ? (
                  finances.despesasLista.map((expense, index) => <ExpenseRevenueListItem key={index} finance={expense} tag="EXPENSE" />)
                ) : (
                  <p className="w-full text-center text-sm italic text-gray-500">Não há despesas vinculadas ao projeto.</p>
                )}
              </div>
              <div className="flex w-full items-center justify-center">
                <h1 className="text-lg font-black leading-none tracking-tight text-gray-800">PREVISÃO DE CUSTOS</h1>
              </div>
              <div className="flex w-full flex-wrap justify-around gap-2">
                {costForecasts.map((forecast, index) => (
                  <div key={index} className="flex w-full flex-col rounded-md border border-gray-200 p-4 lg:w-[450px]">
                    <div className="flex w-full items-center justify-between gap-2">
                      <h1 className="text-xs font-black leading-none tracking-tight  lg:text-sm">{forecast.identificador}</h1>
                      <div className="flex min-w-fit items-center gap-2 rounded-full bg-gray-800 px-2 py-1 ">
                        <h1 className="text-[0.65rem] font-medium text-white lg:text-xs">{formatToMoney(forecast.custo)}</h1>
                      </div>
                    </div>
                    <div className="mt-1 flex w-full flex-wrap items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TbPercentage size={15} color="#15599a" />
                        <p className="text-[0.65rem] font-medium leading-none tracking-tight text-gray-500 lg:text-xs">
                          IMPOSTO: {formatDecimalPlaces(forecast.imposto * 100)}%
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <MdSignalCellularAlt size={15} color="#fead41" />
                        <p className="text-[0.65rem] font-medium leading-none tracking-tight text-gray-500 lg:text-xs">
                          MARGEM: {formatDecimalPlaces(forecast.margemLucro * 100)}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default ProjectFinancesModal
