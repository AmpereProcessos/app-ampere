import { ExpenseRevenueList, TProjectFinances } from '@/pages/api/stats/financial-auditing'
import { formatDecimalPlaces, formatToMoney } from '@/utils/constants'
import React, { useState } from 'react'
import { FaDiamond } from 'react-icons/fa6'

type ExpenseRevenueListItemProps = {
  finance: ExpenseRevenueList[number]
  tag: 'EXPENSE' | 'REVENUE'
}
function ExpenseRevenueListItem({ finance, tag }: ExpenseRevenueListItemProps) {
  const [showItems, setShowItems] = useState<boolean>(false)

  return (
    <div className="flex w-full flex-col rounded-md border border-gray-200 p-2">
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h1 className="cursor-pointer text-xs font-black leading-none tracking-tight lg:text-sm">{finance.categoria}</h1>
          {finance.itens.length > 0 ? (
            <button onClick={() => setShowItems((prev) => !prev)} className="text-[0.6rem] text-[#ED7D31]">
              {showItems ? 'FECHAR' : 'EXPANDIR'}
            </button>
          ) : null}
        </div>
        <div className={`flex min-w-fit items-center gap-2 rounded-full ${tag == 'EXPENSE' ? 'bg-[#ed174c]' : 'bg-[#70e000]'} px-2 py-1 `}>
          <h1 className="text-[0.65rem] font-medium text-white lg:text-xs">{formatToMoney(finance.total)}</h1>
        </div>
      </div>

      {showItems
        ? finance.itens.map((item) => (
            <div className="flex w-full items-center justify-between gap-2">
              <h1 className="text-[0.7rem] leading-none tracking-tight text-gray-700">
                <strong className="text-[#fead41]">{formatDecimalPlaces(item.qtde, 1)}</strong> x {item.descricao}{' '}
                <strong>
                  ({formatToMoney(item.preco)}/ {item.unidade})
                </strong>
              </h1>
              <h1 className="text-[0.7rem] font-medium text-gray-700">{formatToMoney(item.qtde * item.preco)}</h1>
            </div>
          ))
        : null}
    </div>
  )
  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <FaDiamond size={12} />
          <h1 className="text-xs leading-none tracking-tight text-gray-700">{finance.categoria}</h1>
          {finance.itens.length > 0 ? (
            <button onClick={() => setShowItems((prev) => !prev)} className="text-[0.6rem] text-[#ED7D31]">
              {showItems ? 'FECHAR' : 'EXPANDIR'}
            </button>
          ) : null}
        </div>
        <h1 className="text-sm font-medium text-gray-700">{formatToMoney(finance.total)}</h1>
      </div>
      {showItems
        ? finance.itens.map((item) => (
            <div className="flex w-full items-center justify-between gap-2">
              <h1 className="text-[0.7rem] leading-none tracking-tight text-gray-700">
                <strong className="text-[#fead41]">{formatDecimalPlaces(item.qtde, 1)}</strong> x {item.descricao}{' '}
                <strong>
                  ({formatToMoney(item.preco)}/ {item.unidade})
                </strong>
              </h1>
              <h1 className="text-[0.7rem] font-medium text-gray-700">{formatToMoney(item.qtde * item.preco)}</h1>
            </div>
          ))
        : null}
    </div>
  )
}

export default ExpenseRevenueListItem
