import React from 'react'
import { FaCity, FaUser } from 'react-icons/fa'
import { IoMdAlert, IoMdDocument } from 'react-icons/io'
import { MdCategory } from 'react-icons/md'
import Avatar from '../../utils/Avatar'
import { BsCalendarFill } from 'react-icons/bs'
import dayjs from 'dayjs'
import Link from 'next/link'

function getBarColor(orderPeriod) {
  if (!orderPeriod.inicio && !orderPeriod.fim) return 'bg-primary/60'
  if (orderPeriod.inicio && !orderPeriod.fim) return 'bg-blue-500'
  return 'bg-green-500'
}
function ResponsibleServiceOrderCard({ order, handleOpenModal }) {
  return (
    <div
      onClick={() => handleOpenModal(order)}
      className="border-primary/20 flex w-[450px] cursor-pointer items-center rounded-md border hover:bg-blue-50"
    >
      <div className={`h-full w-[7px] min-w-[7px] ${getBarColor(order.periodo)} rounded-tl-md rounded-bl-md`}></div>
      <div className="flex grow flex-col p-3">
        <div className="flex w-full items-center justify-between">
          <h1
            onClick={() => handleOpenModal(order)}
            className="w-full cursor-pointer text-center text-sm leading-none font-bold tracking-tight duration-300 ease-in-out lg:text-start"
          >
            {order.favorecido.nome}
          </h1>
          {order.projeto ? <p className="font-bold text-[#fead41]">#{order.projeto.identificador}</p> : null}
        </div>
        <div className={`mb-2 flex items-center gap-2 ${order.dataEfetivacao ? 'text-green-500' : 'text-primary/60'}`}>
          <BsCalendarFill />
          <p className="text-xs font-medium">{dayjs(order.dataEfetivacao ? order.dataEfetivacao : order.dataInsercao).format('DD/MM/YYYY HH:mm')}</p>
        </div>
        <div className="mt-2 flex w-full items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <MdCategory />
            <p className="text-xs leading-none font-bold tracking-tight text-[#15599a]">{order.categoria}</p>
          </div>
          <div className="flex items-center gap-2">
            <IoMdAlert />
            <p className="text-primary/60 text-xs leading-none tracking-tight">{order.urgencia}</p>
          </div>
        </div>
        <div className="mt-2 flex w-full items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FaCity />
            <p className="text-primary/60 text-xs leading-none tracking-tight">
              {order.localizacao.cidade}-{order.localizacao.uf}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <FaUser />
            <p className="text-primary/60 text-xs leading-none tracking-tight">{order.responsavel.nome || 'NÃO DEFINIDO'}</p>
          </div>
        </div>
        <h1 className="text-primary/60 mt-2 text-sm">OBSERVAÇÕES</h1>
        <div className="overscroll-y text-primary/80 scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 bg-primary/20 flex h-[80px] w-full flex-col items-center justify-center overflow-y-auto p-3 text-xs">
          {order.observacoes.map((o) => (
            <p className="text-primary/60 text-xs">{o.descricao}</p>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ResponsibleServiceOrderCard
