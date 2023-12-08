import { TProjectFinances } from '@/pages/api/stats/financial-auditing'
import { formatDecimalPlaces, formatToMoney } from '@/utils/constants'
import { formatDateAsLocale } from '@/utils/methods/formatting'
import React from 'react'
import { FaSignature, FaTools } from 'react-icons/fa'

type AuditingCardProps = {
  info: TProjectFinances
}

function getBarColor(margin: number) {
  if (margin >= 0.1) return 'bg-green-500'
  if (margin > 0.05 && margin < 1) return 'bg-orange-500'
  return 'bg-red-500'
}
function getResult({ revenues, expenses }: { revenues: TProjectFinances['receitas']; expenses: TProjectFinances['despesas'] }) {
  const totalExpenses = Object.values(expenses).reduce((acc, current) => acc + current, 0)
  const totalRevenues = Object.values(revenues).reduce((acc, current) => acc + current, 0)

  const margin = (totalRevenues - totalExpenses) / totalRevenues
  return {
    margem: margin,
    liquido: totalRevenues - totalExpenses,
  }
}
function AuditingCard({ info }: AuditingCardProps) {
  const { liquido, margem } = getResult({ revenues: info.receitas, expenses: info.despesas })
  return (
    <div className="flex w-full gap-2 rounded-md border border-gray-300 shadow-sm lg:w-[550px]">
      <div className={`h-full w-[7px] ${getBarColor(margem)} rounded-tl-md rounded-bl-md`}></div>
      <div className="flex grow flex-col p-6">
        <div className="flex w-full items-center justify-between">
          <h1 className="trackig-tight font-bold leading-none">{info.nome}</h1>
          <div className="rounded-md border border-gray-500 px-2 py-1 text-xs font-medium">{formatToMoney(liquido)}</div>
        </div>
        <div className="flex w-full grow flex-col">
          <h1 className="mt-4 text-[0.65rem] font-medium leading-none tracking-tighter text-green-600">RECEITAS</h1>
          {Object.entries(info.receitas)
            .filter(([key, value]) => value != 0)
            .map(([key, value]) => (
              <div className="mt-1 flex w-full items-center justify-between">
                <p className="text-xs font-medium leading-none tracking-tight text-gray-600">{key}</p>
                <p className="text-xs font-bold text-green-500">{formatToMoney(value)}</p>
              </div>
            ))}
          <h1 className="mt-4 text-[0.65rem] font-medium leading-none tracking-tighter text-red-600">DESPESAS</h1>
          {Object.entries(info.despesas)
            .filter(([key, value]) => value != 0)
            .map(([key, value]) => (
              <div className="mt-1 flex w-full items-center justify-between">
                <p className="text-xs font-medium leading-none tracking-tight text-gray-600">{key}</p>
                <p className="text-xs font-bold text-red-500">{formatToMoney(value)}</p>
              </div>
            ))}
        </div>
        <div className="mt-2 flex w-full items-center justify-between ">
          <div className="flex items-center gap-2">
            <FaTools />
            <h1 className="text-xs text-gray-500">{formatDateAsLocale(info.dataConclusaoObra)}</h1>
            <FaSignature />
            <h1 className="text-xs text-gray-500">{formatDateAsLocale(info.dataAssinatura)}</h1>
          </div>
          <h1 className="rounded-md text-xs font-medium  text-cyan-500 underline underline-offset-2">
            MARGEM {formatDecimalPlaces(margem * 100, 2)}%
          </h1>
        </div>
      </div>
    </div>
  )
}

export default AuditingCard
