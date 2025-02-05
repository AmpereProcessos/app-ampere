import dayjs from 'dayjs'
import Link from 'next/link'
import React, { useState } from 'react'
import { BsCalendarFill, BsCalendarPlus, BsCheck2All, BsCircleHalf, BsEyeFill, BsEyeSlashFill, BsFillPatchCheckFill } from 'react-icons/bs'
import { FaFilePdf, FaUserAlt } from 'react-icons/fa'
import { formatLongString, formatToMoney } from '../../../utils/constants'
import { AiFillEdit, AiOutlineEdit, AiTwotoneEdit } from 'react-icons/ai'
import { RiMoneyDollarCircleFill } from 'react-icons/ri'
import { TExpenseDTO } from '@/utils/schemas/expenses'
import { FaDiamond } from 'react-icons/fa6'
import { BsCode } from 'react-icons/bs'
import { MdOutlineAssignmentLate, MdTimer } from 'react-icons/md'
import { formatDateAsLocale } from '@/utils/methods/formatting'
import Avatar from '@/components/utils/Avatar'

function renderPendencyStatus({ expense }: { expense: TExpenseDTO }) {
  const hasPendency = !expense.efetivacao.efetivado
  if (!hasPendency)
    return (
      <div className="flex items-center gap-2">
        {/* <BsCheck2All color="#2c6e49" /> */}
        <BsFillPatchCheckFill color="#2c6e49" />
        <p className="text-[0.65rem] font-medium text-gray-500  lg:text-xs">PAGO</p>
      </div>
    )

  const isToday = dayjs(expense.efetivacao.data).add(3, 'hour').isSame(dayjs(), 'day')
  if (isToday)
    return (
      <div className="flex items-center gap-2">
        <MdOutlineAssignmentLate color="#ffbd00" />
        <p className="text-[0.65rem] font-medium text-gray-500 lg:text-xs">PAGAR HOJE</p>
      </div>
    )

  const isOverdue = dayjs().isAfter(dayjs(expense.efetivacao.data).add(3, 'hour'), 'day')
  if (isOverdue)
    return (
      <div className="flex items-center gap-2">
        <MdTimer color="#ed174c" />
        <p className="text-[0.65rem] font-medium text-gray-500 lg:text-xs">ATRASADO</p>
      </div>
    )

  return (
    <div className="flex items-center gap-2">
      <MdOutlineAssignmentLate color="#ffbd00" />
      <p className="text-[0.65rem] font-medium text-gray-500 lg:text-xs">À PAGAR</p>
    </div>
  )
}

type ExpenseCardProps = {
  expense: TExpenseDTO
  openModal: (id: string) => void
}
function ExpenseCard({ expense, openModal }: ExpenseCardProps) {
  return (
    <div className="flex w-full flex-col rounded-md border border-gray-200 p-4 lg:w-[480px]">
      <div className="flex w-full items-center justify-between gap-2">
        <h1
          onClick={() => openModal(expense._id)}
          className="grow cursor-pointer text-xs font-black leading-none tracking-tight hover:text-cyan-500 lg:text-sm"
        >
          {expense.categoria}
        </h1>
        <h1 className="min-w-fit rounded-full bg-gray-800 px-2 py-1 text-[0.58rem] font-medium text-white lg:text-xs">
          {formatToMoney(expense.total)}
        </h1>
      </div>
      <div className="mt-1 flex w-full flex-wrap items-center justify-between">
        <div className="flex items-center gap-2">
          <FaDiamond />
          <p className="text-[0.65rem] font-medium leading-none tracking-tight text-gray-500 lg:text-xs">{expense.rateio}</p>
        </div>
        {expense.projeto?.id ? (
          <div className="flex items-center gap-2">
            <BsCode size={'20px'} color="rgb(31,41,55)" />
            <p className="text-[0.65rem] font-medium leading-none tracking-tight text-gray-500 lg:text-xs">{expense.projeto?.nome}</p>
          </div>
        ) : null}
      </div>
      <div className="mt-1 flex w-full flex-wrap items-center justify-between">
        <div className="flex items-center gap-2">
          <BsCircleHalf color="#ed174c" />
          <p className="text-[0.65rem] font-medium leading-none tracking-tight text-gray-500 lg:text-xs">
            {expense.itens?.length} {expense.itens.length > 1 ? 'ITENS' : 'ITEM'}
          </p>
        </div>
        {renderPendencyStatus({ expense: expense })}
      </div>
      <div className="mt-2 flex w-full items-center justify-between">
        <div className={`flex items-center gap-2`}>
          <BsCalendarPlus />
          <p className="text-xs font-medium text-gray-500">{formatDateAsLocale(expense.dataInsercao)}</p>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Avatar fallback={'U'} height={25} width={25} url={expense.autor?.avatar_url || undefined} />
          <p className="text-xs font-medium text-gray-500">{expense.autor?.nome}</p>
        </div>
      </div>
    </div>
  )

  // return (
  //   <div
  //     onClick={() => openModal(expense)}
  //     className={`flex h-[150px] w-full cursor-pointer items-center gap-2 rounded-lg border border-gray-200 shadow-md duration-300 ease-in-out hover:bg-blue-100 lg:w-[450px]`}
  //   >
  //     <div
  //       className={`h-full w-[4px] rounded-tl-lg rounded-bl-lg ${getTagColor({
  //         paid: expense.efetivacao?.efetivado,
  //         date: expense.efetivacao?.data,
  //       })}`}
  //     ></div>
  //     <div className="flex h-full grow p-4">
  //       <div className="flex h-full w-[70%] flex-col justify-between">
  //         <p className={`${expense.projeto ? '' : 'text-gray-300'} font-raleway font-bold`}>
  //           {expense.projeto?.nome ? formatLongString(expense.projeto.nome, 23) : '-'}
  //         </p>
  //         <p className="font-raleway font-medium text-[#fead41]">{expense.categoria}</p>
  //         <div
  //           className={`flex h-fit w-fit items-center rounded border-[1.5px] p-1 ${
  //             expense.idFormularioAlmoxarifado
  //               ? 'cursor-pointer border-black text-black duration-300 ease-in-out hover:bg-black hover:text-white'
  //               : 'border-gray-600 text-gray-600  opacity-30'
  //           }`}
  //         >
  //           {expense.idFormularioAlmoxarifado ? (
  //             <Link href={`/almoxarifado/pdfFormulario/${expense.idFormularioAlmoxarifado}`}>
  //               <a className="font-raleway text-sm font-bold">FORMULÁRIO</a>
  //             </Link>
  //           ) : (
  //             <p className="font-raleway text-sm font-bold">FORMULÁRIO</p>
  //           )}
  //         </div>
  //       </div>
  //       <div className="flex h-full w-[30%] flex-col justify-between">
  //         <div className="flex items-center gap-2">
  //           <BsCalendarFill color="#15599a" size="20px" />
  //           <p className="font-raleway text-sm font-medium text-gray-600">{dayjs(expense.dataInsercao).format('DD/MM/YYYY')}</p>
  //         </div>
  //         <div className="flex items-center gap-2">
  //           <FaUserAlt color="#15599a" size="20px" />
  //           <p className="upper font-raleway text-sm font-medium text-gray-600">{expense.autor.nome}</p>
  //         </div>
  //         <div className={`flex items-center gap-2`}>
  //           <RiMoneyDollarCircleFill color="#15599a" size="23px" />
  //           <p className="font-raleway text-sm font-medium text-gray-600">{formatToMoney(expense.total)}</p>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // )
}

export default ExpenseCard
