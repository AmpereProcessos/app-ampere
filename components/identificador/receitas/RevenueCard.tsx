import dayjs from 'dayjs'
import Link from 'next/link'
import React, { useState } from 'react'
import { BsCalendarFill, BsCalendarPlus, BsCheck2All, BsCircleHalf, BsEyeFill, BsEyeSlashFill } from 'react-icons/bs'
import { FaFilePdf, FaUserAlt } from 'react-icons/fa'
import { formatDate, formatLongString, formatToMoney } from '../../../utils/constants'
import { AiFillEdit, AiOutlineEdit, AiOutlineMoneyCollect, AiTwotoneEdit } from 'react-icons/ai'
import { RiMoneyDollarCircleFill } from 'react-icons/ri'
import { TRevenue, TRevenueDTO } from '@/utils/schemas/revenues'
import { MdOutlineAssignmentLate, MdPayment, MdTimer } from 'react-icons/md'
import { FaDiamond } from 'react-icons/fa6'
import Avatar from '@/components/utils/Avatar'
import { formatDateAsLocale } from '@/utils/methods/formatting'

function renderStatusTag({ total, realization }: { total: number; realization: TRevenueDTO['efetivacao'] }) {
  if (realization.efetivado)
    return (
      <div className="flex items-center gap-2 rounded-full bg-[#2c6e49] px-2 py-1 ">
        <BsCheck2All color="#fff" />
        <h1 className="text-[0.65rem] font-medium text-white lg:text-xs">{formatToMoney(total)}</h1>
      </div>
    )
  const currentDate = dayjs()
  const currentDateObj = {
    day: currentDate.date(),
    month: currentDate.month(),
    year: currentDate.year(),
  }
  const realizationDate = dayjs(realization.data).add(3, 'hour')
  const realizationDateObj = {
    day: realizationDate.date(),
    month: realizationDate.month(),
    year: realizationDate.year(),
  }
  const isSame = dayjs(realization.data).add(3, 'hour').isSame(dayjs(), 'day')
  if (realization.data && isSame) {
    return (
      <div className="flex items-center gap-2 rounded-full bg-[#ffbd00] px-2 py-1 ">
        <AiOutlineMoneyCollect color="#fff" />
        <h1 className="text-[0.65rem] font-medium text-white lg:text-xs">{formatToMoney(total)}</h1>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 rounded-full bg-[#ed174c] px-2 py-1 ">
      <MdTimer color="#fff" />
      <h1 className="text-[0.65rem] font-medium text-white lg:text-xs">{formatToMoney(total)}</h1>
    </div>
  )
}
function renderPendencyStatus({ fractionnement }: { fractionnement: TRevenueDTO['fracionamento'] }) {
  const hasPendency = fractionnement.some((fraction) => !fraction.dataRecebimento)
  if (!hasPendency)
    return (
      <div className="flex items-center gap-2">
        <BsCheck2All color="#2c6e49" />
        <p className="text-[0.65rem] font-medium text-gray-500  lg:text-xs">TOTALMENTE RECEBIDO</p>
      </div>
    )
  return (
    <div className="flex items-center gap-2">
      <MdOutlineAssignmentLate color="#ffbd00" />
      <p className="text-[0.65rem] font-medium text-gray-500 lg:text-xs">RECEBIMENTO PENDENTE</p>
    </div>
  )
}
type RevenueCardProps = {
  revenue: TRevenueDTO
  openModal: (id: string) => void
}
function RevenueCard({ revenue, openModal }: RevenueCardProps) {
  return (
    <div className="flex w-full flex-col rounded-md border border-gray-200 p-4 lg:w-[450px]">
      <div className="flex w-full items-center justify-between gap-2">
        <h1
          onClick={() => openModal(revenue._id)}
          className="cursor-pointer text-xs font-black leading-none tracking-tight hover:text-cyan-500 lg:text-sm"
        >
          {revenue.nome}
        </h1>
        <div className="flex items-center gap-2 rounded-full bg-gray-800 px-2 py-1 ">
          <h1 className="text-[0.65rem] font-medium text-white lg:text-xs">{formatToMoney(revenue.total)}</h1>
        </div>
      </div>
      <div className="mt-1 flex w-full flex-wrap items-center justify-between">
        <div className="flex items-center gap-2">
          <FaDiamond />
          <p className="text-[0.65rem] font-medium leading-none tracking-tight text-gray-500 lg:text-xs">{revenue.tipo}</p>
        </div>
        <div className="flex items-center gap-2">
          <MdPayment color={'#76c893'} />
          <p className="text-[0.65rem] font-medium leading-none tracking-tight text-gray-500 lg:text-xs">{revenue.metodo}</p>
        </div>
      </div>
      <div className="mt-1 flex w-full flex-wrap items-center justify-between">
        <div className="flex items-center gap-2">
          <BsCircleHalf color="#ed174c" />
          <p className="text-[0.65rem] font-medium leading-none tracking-tight text-gray-500 lg:text-xs">
            {revenue.fracionamento?.length} {revenue.fracionamento.length > 1 ? 'RECEBIMENTOS' : 'RECEBIMENTO'}
          </p>
        </div>
        {renderPendencyStatus({ fractionnement: revenue.fracionamento })}
      </div>
      <div className="mt-2 flex w-full items-center justify-between">
        <div className={`flex items-center gap-2`}>
          <BsCalendarPlus />
          <p className="text-xs font-medium text-gray-500">{formatDateAsLocale(revenue.dataInsercao)}</p>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Avatar fallback={'U'} height={25} width={25} url={revenue.autor?.avatar_url || undefined} />
          <p className="text-xs font-medium text-gray-500">{revenue.autor?.nome}</p>
        </div>
      </div>
    </div>
  )
}

export default RevenueCard
