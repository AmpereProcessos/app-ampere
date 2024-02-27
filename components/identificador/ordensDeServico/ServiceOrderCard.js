import React from 'react'
import dayjs from 'dayjs'
import Link from 'next/link'

import { BsCalendarFill } from 'react-icons/bs'
import { FaCity, FaUser } from 'react-icons/fa'
import { IoMdAlert, IoMdDocument } from 'react-icons/io'
import { MdCategory } from 'react-icons/md'

import Avatar from '../../utils/Avatar'

function ServiceOrderCard({ order, handleOpenModal }) {
  return (
    <div className="flex w-full items-center rounded-md border border-gray-200 lg:w-[500px] lg:min-w-[500px]">
      <div className={`h-full w-[7px] min-w-[7px] rounded-bl-md rounded-tl-md bg-blue-300`}></div>
      <div className="flex grow flex-col p-3">
        <div className="flex w-full items-center justify-between">
          <h1
            onClick={() => handleOpenModal(order)}
            className="w-full cursor-pointer text-center text-sm font-bold leading-none tracking-tight duration-300 ease-in-out hover:text-cyan-500 lg:text-start"
          >
            {order.favorecido.nome}
          </h1>
          {order.projeto ? <p className="font-bold text-[#fead41]">#{order.projeto.identificador}</p> : null}
        </div>
        <div className="mt-2 flex w-full items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <MdCategory />
            <p className="text-xs  font-bold leading-none tracking-tight text-[#15599a]">{order.categoria}</p>
          </div>
          <div className="flex items-center gap-2">
            <IoMdAlert />
            <p className="text-xs leading-none tracking-tight text-gray-500">{order.urgencia}</p>
          </div>
        </div>
        <div className="mt-2 flex w-full items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FaCity />
            <p className="text-xs leading-none tracking-tight text-gray-500">
              {order.localizacao.cidade}-{order.localizacao.uf}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <FaUser />
            <p className="text-xs leading-none tracking-tight text-gray-500">{order.responsavel.nome || 'NÃO DEFINIDO'}</p>
          </div>
        </div>
        <h1 className="mt-2 text-sm text-gray-500">OBSERVAÇÕES</h1>
        <div className="overscroll-y flex h-[80px] max-h-[80px] w-full items-center justify-center overflow-y-auto bg-gray-100 p-3 text-xs text-gray-600 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
          {order.observacoes}
        </div>
        <div className="mt-2 flex w-full flex-col items-center justify-between gap-4 lg:flex-row">
          <div className={`flex items-center gap-2 ${order.dataEfetivacao ? 'text-green-500' : 'text-gray-500'}`}>
            <BsCalendarFill />
            <p className="text-xs font-medium">
              {dayjs(order.dataEfetivacao ? order.dataEfetivacao : order.dataInsercao).format('DD/MM/YYYY HH:mm')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/ordemDeServico/pdf/${order._id}`}>
              <a className="flex cursor-pointer items-center gap-1 text-gray-500 duration-300 ease-in-out hover:text-cyan-500">
                <IoMdDocument style={{ fontSize: '20px' }} />
                <p className="text-xs font-medium">DOCUMENTO</p>
              </a>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Avatar url={order.autor?.avatar_url} fallback={'U'} height={25} width={25} />
            <p className="text-xs font-medium text-gray-500">{order.autor?.nome}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceOrderCard
