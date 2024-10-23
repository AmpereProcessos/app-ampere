import React, { useEffect, useMemo, useState } from 'react'
import LoadingPage from '../../utils/LoadingPage'
import { AnimatePresence, motion } from 'framer-motion'
import FilterButton from '../../utils/Buttons/FilterButton'
import { AiOutlineSearch } from 'react-icons/ai'
import { formatToMoney } from '../../../utils/constants'
import dayjs from 'dayjs'
import RevenueCard from './RevenueCard'
import { useRevenues } from '../../../utils/methods/query/revenues'
import ErrorComponent from '@/components/utils/ErrorComponent'
import { TRevenueDTO } from '@/utils/schemas/revenues'
import EditRevenue from './modals/EditRevenue'
import { Session } from 'next-auth'

type RevenuesWrapperProps = {
  session: Session
}
function RevenuesWrapper({ session }: RevenuesWrapperProps) {
  const { data: revenues, isLoading, isError, isSuccess } = useRevenues()

  const [modalRevenue, setModalRevenue] = useState<{ isOpen: boolean; id: null | string }>({
    isOpen: false,
    id: null,
  })
  function getStats(revenues: TRevenueDTO[]) {
    return {
      toReceiveToday: 0,
      toReceive: 0,
      toReceiveOverdue: 0,
      received: 0,
    }
    // const toReceiveToday = revenues.reduce((acc, current) => {
    //   const notReceived = !current.efetivacao?.efetivado
    //   const scheduledDate = current.efetivacao?.data ? new Date(dayjs(current.efetivacao.data).add(3, 'hours')).setHours(0, 0, 0, 0) : null
    //   const todayDate = new Date().setHours(0, 0, 0, 0)
    //   const isScheduledToday = scheduledDate == todayDate
    //   if (notReceived && isScheduledToday) {
    //     const total = current.total
    //     return acc + total
    //   } else {
    //     return acc + 0
    //   }
    // }, 0)
    // const toReceive = revenues.reduce((acc, current) => {
    //   const notReceived = !current.efetivacao?.efetivado
    //   const scheduledDate = current.efetivacao?.data ? new Date(dayjs(current.efetivacao.data).add(3, 'hours')).setHours(0, 0, 0, 0) : null
    //   const todayDate = new Date().setHours(0, 0, 0, 0)
    //   const yetToReceive = scheduledDate >= todayDate
    //   if (notReceived && yetToReceive) {
    //     const total = current.total
    //     return acc + total
    //   } else {
    //     return acc + 0
    //   }
    // }, 0)
    // const toReceiveOverdue = revenues.reduce((acc, current) => {
    //   const notReceived = !current.efetivacao?.efetivado
    //   const scheduledDate = current.efetivacao?.data ? new Date(dayjs(current.efetivacao.data).add(3, 'hours')).setHours(0, 0, 0, 0) : null
    //   const todayDate = new Date().setHours(0, 0, 0, 0)
    //   const isOverdue = scheduledDate < todayDate
    //   if (notReceived && isOverdue) {
    //     const total = current.total
    //     return acc + total
    //   } else {
    //     return acc + 0
    //   }
    // }, 0)
    // const received = revenues.reduce((acc, current) => {
    //   const isReceived = !!current.efetivacao?.efetivado
    //   if (isReceived) {
    //     const total = current.total
    //     return acc + total
    //   } else {
    //     return acc + 0
    //   }
    // }, 0)
    // return {
    //   toReceiveToday: toReceiveToday,
    //   toReceive: toReceive,
    //   toReceiveOverdue: toReceiveOverdue,
    //   received: received,
    // }
  }

  return (
    <div className="flex w-full grow flex-col">
      <div className="flex w-full items-center justify-center gap-2">
        <div className="flex min-h-[100px] w-[200px] flex-col rounded border border-gray-300 shadow-md">
          <div className="w-full rounded-tl rounded-tr bg-green-500 text-center text-sm text-white">RECEBIDO</div>
          <div className="flex w-full grow items-center justify-center">
            <h1 className="text-center font-raleway font-bold">{formatToMoney(getStats(revenues || []).received)}</h1>
          </div>
        </div>
        <div className="flex min-h-[100px] w-[200px] flex-col rounded border border-gray-300 shadow-md">
          <div className="w-full rounded-tl rounded-tr bg-[#15599a] text-center text-sm text-white">À RECEBER</div>
          <div className="flex w-full grow items-center justify-center">
            <h1 className="text-center font-raleway font-bold">{formatToMoney(getStats(revenues || []).toReceive)}</h1>
          </div>
        </div>
        <div className="flex min-h-[100px] w-[200px] flex-col rounded border border-gray-300 shadow-md">
          <div className="w-full rounded-tl rounded-tr bg-[#fead41] text-center text-sm text-white">À RECEBER HOJE</div>
          <div className="flex w-full grow items-center justify-center">
            <h1 className="text-center font-raleway font-bold">{formatToMoney(getStats(revenues || []).toReceiveToday)}</h1>
          </div>
        </div>
        <div className="flex min-h-[100px] w-[200px] flex-col rounded border border-gray-300 shadow-md">
          <div className="w-full rounded-tl rounded-tr bg-red-500 text-center text-sm text-white">EM ATRASO</div>
          <div className="flex w-full grow items-center justify-center">
            <h1 className="text-center font-raleway font-bold">{formatToMoney(getStats(revenues || []).toReceiveOverdue)}</h1>
          </div>
        </div>
      </div>
      <div className="mt-4 flex w-full grow flex-col flex-wrap items-start justify-between gap-4 lg:flex-row">
        {isLoading ? <LoadingPage /> : null}
        {isError ? <ErrorComponent msg={'Erro ao buscar receitas.'} /> : null}
        {isSuccess && revenues ? (
          revenues.length > 0 ? (
            revenues.map((revenue) => (
              <RevenueCard key={revenue._id} revenue={revenue} openModal={(id) => setModalRevenue({ isOpen: true, id: id })} />
            ))
          ) : (
            <p className="w-full text-center italic text-gray-500">Nenhuma receita encontrada...</p>
          )
        ) : null}
        {modalRevenue.isOpen && modalRevenue.id ? (
          <EditRevenue session={session} revenueId={modalRevenue.id} closeModal={() => setModalRevenue({ isOpen: false, id: null })} />
        ) : null}
        {/* {modalRevenue && modalIsOpen ? (
          <ExpenseModal expense={modalRevenue} closeModal={handleCloseModal} />
        ) : null} */}
      </div>
    </div>
  )
}

export default RevenuesWrapper
