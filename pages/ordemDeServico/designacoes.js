import React from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

import { useServiceOrders } from '../../utils/methods/query/serviceOrders'

import DesignationCard from '../../components/identificador/ordensDeServico/DesignationCard'
import LoadingPage from '../../components/utils/LoadingPage'

var currentDate = new Date()
const afterDateParam = new Date(currentDate.setMonth(currentDate.getMonth() - 3)).toISOString()
const beforeDateParam = new Date().toISOString()

function groupByResponsible(orders) {
  if (!orders) return undefined
  const grouped = orders.reduce((acc, current) => {
    const responsibleName = current.responsavel?.nome || 'NÃO DEFINIDO'
    if (!acc[responsibleName]) {
      acc[responsibleName] = []
    }
    acc[responsibleName].push(current)
    return acc
  }, {})
  return grouped
}
function renderGroupedByResponsible(orders) {
  const grouped = groupByResponsible(orders)
  if (!grouped) return null

  return Object.entries(grouped).map(([key, value], index) => (
    <div key={index} className="flex flex-col w-full">
      <h1 className="w-full p-2 rounded-md text-center text-white font-bold bg-gray-800 mt-4">{key}</h1>
      <div className="mt-1 grid grid-cols-1 lg:grid-cols-3 w-full gap-5">
        {value.map((order, index2) => (
          <DesignationCard key={index2} order={order} />
        ))}
      </div>
    </div>
  ))
}
function ControleDeOSs({ arr }) {
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/authHome')
    },
  })
  const { data: orders } = useServiceOrders({
    after: afterDateParam,
    before: beforeDateParam,
    status: 'EM ABERTO',
    simplified: false,
    enabled: !!session,
  })
  console.log(afterDateParam, beforeDateParam)
  if (status == 'loading') return <LoadingPage />
  if (status == 'authenticated') {
    return (
      <div className="flex flex-col p-6 grow bg-[#fff]">
        <div className="flex items-center pb-2 border-b border-gray-200">
          <h1 className="text-[#15599a] font-bold text-xl">ORDENS DE SERVIÇO EM ABERTO</h1>
        </div>
        <div className="flex justify-around gap-3 mt-4 flex-wrap">{renderGroupedByResponsible(orders)}</div>
      </div>
    )
  }
}

export default ControleDeOSs
