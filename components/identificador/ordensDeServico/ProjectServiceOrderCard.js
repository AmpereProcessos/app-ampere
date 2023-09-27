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

function ProjectServiceOrderCard({ order, projectId }) {
  return (
    <div className="flex min-h-[80px] h-[80px] max-h-[150px] w-full items-center rounded-md border border-gray-200">
      <div className={`flex h-[100%] w-[5px] rounded-bl-md rounded-tl-md bg-blue-400`}></div>
      <div className="flex grow flex-col p-3 h-full">
        <div className="h-full w-full flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-center text-[#15599a] text-sm font-bold leading-none tracking-tight duration-300 ease-in-out  lg:text-start">
              {order.descricao}
            </h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Avatar url={order.autor?.avatar_url} fallback={'U'} height={20} width={20} />
                <p className="font-medium text-gray-500 text-xs">{order.autor?.nome || 'AUTOR INDEFINIDO'}</p>
              </div>
              <div className={`flex items-center gap-2 ${order.dataEfetivacao ? 'text-green-500' : 'text-gray-500'}`}>
                {order.dataEfetivacao ? <BsFillCalendarCheckFill /> : <BsCalendarFill />}

                <p className="text-xs font-medium">
                  {dayjs(order.dataEfetivacao ? order.dataEfetivacao : order.dataInsercao).format('DD/MM/YYYY HH:mm')}
                </p>
              </div>
            </div>
          </div>
          <div className="grow flex justify-around items-center gap-2">
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
            <Link href={`/ordemDeServico/pdf/${order._id}`}>
              <a className="cursor-pointer p-1 rounded h-[30px] font-bold text-[#fead61] border border-[#fead61] hover:text-black hover:bg-[#fead61]">
                <TbExternalLink />
              </a>
            </Link>
            {order.categoria == 'MANUTENÇÃO PREVENTIVA' && projectId ? (
              <Link href={`/oem/pdfTermo/${projectId}`}>
                <a className="cursor-pointer p-1 rounded h-[30px] font-bold text-cyan-500 border border-cyan-500 hover:text-black hover:bg-cyan-500">
                  <HiOutlineDocumentText />
                </a>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectServiceOrderCard
