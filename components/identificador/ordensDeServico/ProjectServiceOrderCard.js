import React from 'react'
import { BsCalendarFill, BsFillCalendarCheckFill } from 'react-icons/bs'
import { HiOutlineDocumentText } from 'react-icons/hi'
import { MdCategory } from 'react-icons/md'
import Avatar from '../../utils/Avatar'
import dayjs from 'dayjs'
import { FaCity, FaUser } from 'react-icons/fa'
import { IoMdAlert } from 'react-icons/io'
import Link from 'next/link'
import { TbExternalLink } from 'react-icons/tb'
import { AiFillEdit } from 'react-icons/ai'

function ProjectServiceOrderCard({ order, projectId, handleClick }) {
  return (
    <div className="flex h-[80px] max-h-[150px] min-h-[80px] w-full items-center rounded-md border border-gray-200">
      <div className={`flex h-[100%] w-[5px] rounded-bl-md rounded-tl-md bg-blue-400`}></div>
      <div className="flex h-full grow flex-col p-3">
        <div className="flex h-full w-full items-center justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-center text-sm font-bold leading-none tracking-tight text-[#15599a] duration-300 ease-in-out  lg:text-start">
              {order.descricao}
            </h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Avatar url={order.autor?.avatar_url} fallback={'U'} height={20} width={20} />
                <p className="text-xs font-medium text-gray-500">{order.autor?.nome || 'AUTOR INDEFINIDO'}</p>
              </div>
              <div className={`flex items-center gap-2 ${order.dataEfetivacao ? 'text-green-500' : 'text-gray-500'}`}>
                {order.dataEfetivacao ? <BsFillCalendarCheckFill /> : <BsCalendarFill />}

                <p className="text-xs font-medium">
                  {dayjs(order.dataEfetivacao ? order.dataEfetivacao : order.dataInsercao).format('DD/MM/YYYY HH:mm')}
                </p>
              </div>
            </div>
          </div>
          <div className="flex grow items-center justify-around gap-2">
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xs font-medium">CATEGORIA</h1>
                <MdCategory />
              </div>
              <p className="text-sm text-gray-500">{order.categoria}</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xs font-medium">URGÊNCIA</h1>
                <IoMdAlert />
              </div>
              <p className="text-sm text-gray-500">{order.urgencia}</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xs font-medium">CIDADE - UF</h1>
                <FaCity />
              </div>
              <p className="text-sm text-gray-500">
                {order.localizacao.cidade}-{order.localizacao.uf}
              </p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xs font-medium">RESPONSÁVEL</h1>
                <FaUser />
              </div>
              <p className="text-sm text-gray-500">{order.responsavel.nome || 'NÃO DEFINIDO'}</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => handleClick(order._id)}
              className="flex h-[30px] items-center gap-1 rounded border border-blue-500 p-1 text-blue-500 duration-300 ease-in-out hover:border-blue-800 hover:text-blue-800"
            >
              <AiFillEdit />
            </button>
            <Link href={`/ordens-de-servico/pdf/${order._id}`}>
              <div className="h-[30px] cursor-pointer rounded border border-[#fead61] p-1 font-bold text-[#fead61] hover:bg-[#fead61] hover:text-black">
                <TbExternalLink />
              </div>
            </Link>
            {order.categoria == 'MANUTENÇÃO PREVENTIVA' && projectId ? (
              <Link href={`/oem/pdfTermo/${projectId}`}>
                <div className="h-[30px] cursor-pointer rounded border border-cyan-500 p-1 font-bold text-cyan-500 hover:bg-cyan-500 hover:text-black">
                  <HiOutlineDocumentText />
                </div>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectServiceOrderCard
