import React from 'react'
import { FaCity, FaUser } from 'react-icons/fa'
import { IoMdAlert, IoMdDocument } from 'react-icons/io'
import { MdCategory } from 'react-icons/md'
import Avatar from '../../utils/Avatar'
import { BsCalendarFill } from 'react-icons/bs'
import dayjs from 'dayjs'
import Link from 'next/link'

function getBarColor(orderPeriod) {
  if (!orderPeriod.inicio && !orderPeriod.fim) return 'bg-gray-500'
  if (orderPeriod.inicio && !orderPeriod.fim) return 'bg-blue-500'
  return 'bg-green'
}
function ResponsibleServiceOrderCard({ order, handleOpenModal }) {
  return (
    <div
      onClick={() => handleOpenModal(order)}
      className="flex w-[450px] cursor-pointer items-center rounded-md border border-gray-200 hover:bg-blue-50"
    >
      <div className={`h-full min-w-[7px] w-[7px] ${getBarColor(order.periodo)} rounded-tl-md rounded-bl-md`}></div>
      <div className="flex grow flex-col p-3">
        <div className="w-full flex items-center justify-between">
          <h1
            onClick={() => handleOpenModal(order)}
            className="w-full cursor-pointer text-center text-sm font-bold leading-none tracking-tight duration-300 ease-in-out lg:text-start"
          >
            {order.favorecido.nome}
          </h1>
          {order.projeto ? <p className="text-[#fead41] font-bold">#{order.projeto.identificador}</p> : null}
        </div>
        <div className={`mb-2 flex items-center gap-2 ${order.dataEfetivacao ? 'text-green-500' : 'text-gray-500'}`}>
          <BsCalendarFill />
          <p className="text-xs font-medium">{dayjs(order.dataEfetivacao ? order.dataEfetivacao : order.dataInsercao).format('DD/MM/YYYY HH:mm')}</p>
        </div>
        <div className="flex w-full justify-between items-center gap-2 mt-2">
          <div className="flex items-center gap-2">
            <MdCategory />
            <p className="text-xs  tracking-tight leading-none font-bold text-[#15599a]">{order.categoria}</p>
          </div>
          <div className="flex items-center gap-2">
            <IoMdAlert />
            <p className="text-xs text-gray-500 tracking-tight leading-none">{order.urgencia}</p>
          </div>
        </div>
        <div className="flex w-full justify-between items-center gap-2 mt-2">
          <div className="flex items-center gap-2">
            <FaCity />
            <p className="text-xs text-gray-500 tracking-tight leading-none">
              {order.localizacao.cidade}-{order.localizacao.uf}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <FaUser />
            <p className="text-xs text-gray-500 tracking-tight leading-none">{order.responsavel.nome || 'NÃO DEFINIDO'}</p>
          </div>
        </div>
        <h1 className="text-sm text-gray-500 mt-2">OBSERVAÇÕES</h1>
        <div className="w-full p-3 h-[80px] text-xs text-gray-600 bg-gray-100 flex items-center justify-center overflow-y-auto overscroll-y scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <p>{order.observacoes}</p>
        </div>
      </div>
    </div>
  )
}

export default ResponsibleServiceOrderCard
