import React from 'react'
import dayjs from 'dayjs'
import Link from 'next/link'

import { BsCalendarCheck, BsCalendarFill, BsCalendarPlus } from 'react-icons/bs'
import { FaCity, FaUser } from 'react-icons/fa'
import { IoMdAlert, IoMdDocument } from 'react-icons/io'
import { MdCategory } from 'react-icons/md'

import Avatar from '../../utils/Avatar'
import { TServiceOrderSimplifiedDTO } from '@/utils/schemas/service-order'
import { formatDateAsLocale } from '@/utils/methods/formatting'

type ServiceOrderCardProps = {
  serviceOrder: TServiceOrderSimplifiedDTO
  handleClick: (id: string) => void
}

function ServiceOrderCard({ serviceOrder, handleClick }: ServiceOrderCardProps) {
  return (
    <div className="flex w-full items-center rounded-md border border-gray-200 lg:w-[500px] lg:min-w-[500px]">
      <div
        className={`h-full w-[7px] min-w-[7px] rounded-bl-md rounded-tl-md ${!!serviceOrder.dataEfetivacao ? 'bg-green-500' : 'bg-blue-500'}`}
      ></div>
      <div className="flex grow flex-col p-3">
        <div className="flex w-full items-center justify-between">
          <h1
            onClick={() => handleClick(serviceOrder._id)}
            className="w-full cursor-pointer text-center text-sm font-bold leading-none tracking-tight duration-300 ease-in-out hover:text-cyan-500 lg:text-start"
          >
            <strong className="text-[#fead41]">#{serviceOrder.projeto.identificador} </strong>
            {serviceOrder.favorecido.nome}
          </h1>
          <h1
            className={`rounded-full ${
              !!serviceOrder.dataEfetivacao ? 'bg-green-500' : 'bg-blue-500'
            } px-2 py-1 text-center text-[0.65rem] font-bold text-white lg:text-xs`}
          >
            {!!serviceOrder.dataEfetivacao ? 'FINALIZADO' : 'ABERTA'}
          </h1>
        </div>
        <div className="mt-2 flex w-full items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <MdCategory />
            <p className="text-xs  font-bold leading-none tracking-tight text-[#15599a]">{serviceOrder.categoria}</p>
          </div>
          <div className="flex items-center gap-2">
            <IoMdAlert />
            <p className="text-xs leading-none tracking-tight text-gray-500">{serviceOrder.urgencia}</p>
          </div>
        </div>
        <div className="mt-2 flex w-full items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FaCity />
            <p className="text-xs leading-none tracking-tight text-gray-500">
              {serviceOrder.localizacao.cidade}-{serviceOrder.localizacao.uf}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <FaUser />
            <p className="text-xs leading-none tracking-tight text-gray-500">{serviceOrder.responsavel.nome || 'NÃO DEFINIDO'}</p>
          </div>
        </div>
        <h1 className="mt-2 text-sm text-gray-500">OBSERVAÇÕES</h1>
        <div className="overscroll-y flex h-[80px] max-h-[80px] w-full items-center justify-center overflow-y-auto bg-gray-100 p-3 text-xs text-gray-600 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
          {/* {serviceOrder.observacoes} */}
        </div>
        <div className="lg:0 mt-2 flex w-full flex-col-reverse items-center justify-between gap-1 lg:flex-row lg:gap-2">
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1`}>
              <BsCalendarPlus />
              <p className="text-[0.65rem] font-medium text-gray-500">{formatDateAsLocale(serviceOrder.dataInsercao, true)}</p>
            </div>
            {serviceOrder.dataEfetivacao ? (
              <div className="flex items-center gap-1">
                <BsCalendarCheck color="rgb(34,197,94)" />
                <p className="text-[0.65rem] font-medium text-gray-500">{formatDateAsLocale(serviceOrder.dataEfetivacao, true)}</p>
              </div>
            ) : null}
            <div className="flex items-center gap-2">
              <Link href={`/ordemDeServico/pdf/${serviceOrder._id}`}>
                <a className="flex cursor-pointer items-center gap-1 text-gray-500 duration-300 ease-in-out hover:text-cyan-500">
                  <IoMdDocument style={{ fontSize: '20px' }} />
                  <p className="text-[0.6rem] font-medium">DOCUMENTO</p>
                </a>
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Avatar fallback={'R'} url={serviceOrder.autor?.avatar_url || undefined} height={20} width={20} />
            <p className="text-[0.65rem] font-medium text-gray-500">{serviceOrder.autor?.nome || 'INDEFINIDO'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceOrderCard
