import React from 'react'
import { FaCity, FaUser } from 'react-icons/fa'
import { IoMdAlert, IoMdDocument } from 'react-icons/io'
import { MdCategory } from 'react-icons/md'
import Avatar from '../../utils/Avatar'
import { BsCalendarFill } from 'react-icons/bs'
import dayjs from 'dayjs'
import Link from 'next/link'

function ServiceOrderCard({ order, handleOpenModal }) {
  return (
    <div className="flex w-[450px] items-center rounded-md border border-gray-200">
      <div className={`h-full w-[5px] rounded-bl-md rounded-tl-md bg-blue-300`}></div>
      <div className="flex grow flex-col p-3">
        <div className="w-full flex items-center justify-between">
          <h1
            onClick={() => handleOpenModal(order)}
            className="w-full cursor-pointer text-center text-sm font-bold leading-none tracking-tight duration-300 ease-in-out hover:text-cyan-500 lg:text-start"
          >
            {order.favorecido.nome}
          </h1>
          {order.projeto ? <p className="text-[#fead41] font-bold">#{order.projeto.identificador}</p> : null}
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
        <div className="w-full flex items-center justify-between mt-2">
          <div className={`flex items-center gap-2 ${order.dataEfetivacao ? 'text-green-500' : 'text-gray-500'}`}>
            <BsCalendarFill />
            <p className="text-xs font-medium">
              {dayjs(order.dataEfetivacao ? order.dataEfetivacao : order.dataInsercao).format('DD/MM/YYYY HH:mm')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/ordemDeServico/pdf/${order._id}`}>
              <a className="cursor-pointer text-gray-500 hover:text-cyan-500 duration-300 ease-in-out flex items-center gap-1">
                <IoMdDocument style={{ fontSize: '20px' }} />
                <p className="font-medium text-xs">DOCUMENTO</p>
              </a>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Avatar url={order.autor?.avatar_url} fallback={'U'} height={25} width={25} />
            <p className="font-medium text-gray-500 text-xs">{order.autor?.nome}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceOrderCard
