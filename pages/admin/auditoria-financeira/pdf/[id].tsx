import ErrorComponent from '@/components/utils/ErrorComponent'
import LoadingPage from '@/components/utils/LoadingPage'
import { useProjectFinances } from '@/utils/methods/query/financial-auditing'
import { Collection, ObjectId } from 'mongodb'
import { GetServerSidePropsContext } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Logo from '@/utils/images/logo-semtexto-branco.png'
import { FaCity, FaSignature, FaSolarPanel, FaTools, FaUser } from 'react-icons/fa'
import { formatDateAsLocale } from '@/utils/methods/formatting'
import { TbTopologyFull } from 'react-icons/tb'
import ExpenseRevenueListItem from '@/components/identificador/auditoriaFinanceira/ExpenseRevenueListItem'
import { formatDecimalPlaces, formatToMoney } from '@/utils/constants'
import { TProjectFinances } from '@/pages/api/stats/financial-auditing'
import { GoGoal } from 'react-icons/go'
import { RxDownload, RxUpload } from 'react-icons/rx'

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
type SpecificProjectFinancialAuditingProps = {
  id: string
  error: string | null | undefined
}
function SpecificProjectFinancialAuditing({ id, error }: SpecificProjectFinancialAuditingProps) {
  if (!!error) return <ErrorComponent msg={error} />
  const { data: finances, isLoading, isError, isSuccess } = useProjectFinances({ id })
  if (isLoading) return <LoadingPage />
  if (isError) return <ErrorComponent msg={'Erro ao buscar finanças do projeto.'} />
  if (isSuccess) {
    const { receitas, despesas, resultado, margem } = getResults({ expenses: finances?.despesasLista, revenues: finances?.receitasLista })
    return (
      <div className="relative flex h-[297mm] w-[210mm] flex-col overflow-hidden bg-white">
        <div className="flex items-center justify-center gap-4 border border-black bg-black p-3">
          <Link href={'/admin/auditoria-financeira'}>
            <div className="flex cursor-pointer items-center justify-end">
              <Image height={30} width={30} src={Logo} />
            </div>
          </Link>
          <h1 className="text-center text-xl font-black leading-none tracking-tight text-white">RELATÓRIO FINANCEIRO DO PROJETO</h1>
        </div>
        <h1 className="w-full text-center text-3xl font-black">{finances.nome}</h1>
        <div className="my-2 flex w-full flex-col items-center justify-center gap-2 lg:flex-row">
          <div className="flex items-center gap-2">
            <FaSignature />
            <h1 className="text-xs">ASSINADO EM: {formatDateAsLocale(finances.dataAssinatura)}</h1>
          </div>
          <div className="flex items-center gap-2">
            <FaTools />
            <h1 className="text-xs">CONCLUIDO EM: {finances.dataConclusaoObra ? formatDateAsLocale(finances.dataConclusaoObra) : 'NÃO DEFINIDO'}</h1>
          </div>
        </div>
        <div className="my-2 flex w-full flex-wrap items-center justify-center gap-4">
          <div className="flex items-center justify-center gap-2">
            <FaUser />
            <h1 className="text-sm font-bold leading-none tracking-tight">{finances.vendedor}</h1>
          </div>
          <div className="flex items-center justify-center gap-2">
            <FaCity />
            <h1 className="text-sm font-bold leading-none tracking-tight">{finances.cidade}</h1>
          </div>
          <div className="flex items-center justify-center gap-2">
            <TbTopologyFull />
            <h1 className="text-sm font-bold leading-none tracking-tight">{finances.topologia}</h1>
          </div>
          <div className="flex items-center justify-center gap-2">
            <FaSolarPanel />
            <h1 className="text-sm font-bold leading-none tracking-tight">{finances.qtdeModulos} MÓDULOS</h1>
          </div>
        </div>
        <div className="my-4 flex w-full items-center justify-around gap-2">
          <div className="flex w-1/2 flex-col rounded-xl border border-black p-2 lg:w-1/3">
            <div className="grid w-full grid-cols-6 items-center">
              <div className="col-span-1 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-black text-white lg:h-[40px] lg:w-[40px]">
                <RxDownload />
              </div>
              <h1 className="col-span-4 text-center font-medium text-gray-800">TOTAL EM RECEITAS</h1>
              <div className="col-span-1"></div>
            </div>
            <p className="mt-2 w-full text-center text-2xl font-medium text-green-500">R$ {formatDecimalPlaces(receitas)}</p>
          </div>
          <div className="flex w-1/2 flex-col rounded-xl border border-black p-2 lg:w-1/3">
            <div className="grid w-full grid-cols-6 items-center">
              <div className="col-span-1 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-black text-white lg:h-[40px] lg:w-[40px]">
                <RxUpload />
              </div>
              <h1 className="col-span-4 text-center font-medium text-gray-800">TOTAL EM DESPESAS</h1>
              <div className="col-span-1"></div>
            </div>
            <p className="mt-2 w-full text-center text-2xl font-medium text-[#ff0054]">R$ {formatDecimalPlaces(despesas)} </p>
          </div>
        </div>
        <div className="flex w-full items-center justify-center">
          <div className="flex w-1/2 flex-col rounded-xl border border-black p-2 lg:w-1/3">
            <div className="grid w-full grid-cols-6 items-center">
              <div className="col-span-1 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-black text-white lg:h-[40px] lg:w-[40px]">
                <GoGoal />
              </div>
              <h1 className="col-span-4  text-center font-medium text-gray-800">RESULTADOS</h1>
              <div className="col-span-1"></div>
            </div>

            <p className="w-full text-center text-2xl font-black text-black">R$ {formatDecimalPlaces(resultado)}</p>
            <p className="w-full text-center text-sm font-black text-cyan-500">MARGEM DE {formatDecimalPlaces(margem * 100)}%</p>
          </div>
        </div>
        <div className="my-2 flex items-center justify-center gap-1 bg-green-700">
          <h1 className="font-bold text-white">RECEITAS</h1>
        </div>
        <div className="flex w-full flex-col gap-1">
          {finances.receitasLista && finances.receitasLista.length > 0 ? (
            finances.receitasLista.map((revenue, index) => (
              <div key={index} className="flex w-full flex-col rounded-md border border-gray-200 p-2">
                <div className="flex w-full items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h1 className="cursor-pointer text-xs font-black leading-none tracking-tight lg:text-sm">{revenue.categoria}</h1>
                  </div>
                  <div className={`flex min-w-fit items-center gap-2 rounded-full bg-green-700 px-2 py-1 `}>
                    <h1 className="text-[0.65rem] font-medium text-white lg:text-xs">{formatToMoney(revenue.total)}</h1>
                  </div>
                </div>

                {revenue.itens.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex w-full items-center justify-between gap-2">
                    <h1 className="text-[0.7rem] leading-none tracking-tight text-gray-700">
                      <strong className="text-[#fead41]">{formatDecimalPlaces(item.qtde, 1)}</strong> x {item.descricao}{' '}
                      <strong>
                        ({formatToMoney(item.preco)}/ {item.unidade})
                      </strong>
                    </h1>
                    <h1 className="text-[0.7rem] font-medium text-gray-700">{formatToMoney(item.qtde * item.preco)}</h1>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <p className="w-full text-center text-sm italic text-gray-500">Não há receitas vinculadas ao projeto.</p>
          )}
        </div>
        <div className="my-2 flex items-center justify-center gap-1 bg-[#ed174c]">
          <h1 className="font-bold text-white">DESPESAS</h1>
        </div>
        <div className="flex w-full flex-col gap-1">
          {finances.despesasLista && finances.despesasLista.length > 0 ? (
            finances.despesasLista.map((expense, index) => (
              <div key={index} className="flex w-full flex-col rounded-md border border-gray-200 p-2">
                <div className="flex w-full items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h1 className="cursor-pointer text-xs font-black leading-none tracking-tight lg:text-sm">{expense.categoria}</h1>
                  </div>
                  <div className={`flex min-w-fit items-center gap-2 rounded-full bg-[#ed174c] px-2 py-1 `}>
                    <h1 className="text-[0.65rem] font-medium text-white lg:text-xs">{formatToMoney(expense.total)}</h1>
                  </div>
                </div>

                {expense.itens.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex w-full items-center justify-between gap-2">
                    <h1 className="text-[0.7rem] leading-none tracking-tight text-gray-700">
                      <strong className="text-[#fead41]">{formatDecimalPlaces(item.qtde, 1)}</strong> x {item.descricao}{' '}
                      <strong>
                        ({formatToMoney(item.preco)}/ {item.unidade})
                      </strong>
                    </h1>
                    <h1 className="text-[0.7rem] font-medium text-gray-700">{formatToMoney(item.qtde * item.preco)}</h1>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <p className="w-full text-center text-sm italic text-gray-500">Não há despesas vinculadas ao projeto.</p>
          )}
        </div>
      </div>
    )
  }
  return <></>
}

export default SpecificProjectFinancialAuditing

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { query } = context
  const { id } = query

  // Validating ID provided and its validity
  if (!id || typeof id != 'string' || !ObjectId.isValid(id)) {
    return {
      props: {
        error: 'Oops, o ID solicitado não é válido.',
      },
    }
  }

  return {
    props: {
      id: id,
    },
  }
}
