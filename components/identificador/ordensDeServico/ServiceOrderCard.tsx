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
    <div className="border-primary/20 flex w-full items-center rounded-md border lg:w-[500px] lg:min-w-[500px]">
      <div
        className={`h-full w-[7px] min-w-[7px] rounded-tl-md rounded-bl-md ${!!serviceOrder.dataEfetivacao ? 'bg-green-500' : 'bg-blue-500'}`}
      ></div>
      <div className="flex grow flex-col p-3">
        <div className="flex w-full items-center justify-between">
          <h1
            onClick={() => handleClick(serviceOrder._id)}
            className="w-full cursor-pointer text-center text-sm leading-none font-bold tracking-tight duration-300 ease-in-out hover:text-cyan-500 lg:text-start"
          >
            <strong className="text-[#fead41]">#{serviceOrder.projeto.identificador} </strong>
            {serviceOrder.favorecido.nome}
          </h1>
          <h1
            className={`rounded-full ${!!serviceOrder.dataEfetivacao ? 'bg-green-500' : 'bg-blue-500'} px-2 py-1 text-center text-[0.65rem] font-bold text-white lg:text-xs`}
          >
            {!!serviceOrder.dataEfetivacao ? 'FINALIZADO' : 'ABERTA'}
          </h1>
        </div>
        <div className="mt-2 flex w-full items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <MdCategory />
            <p className="text-xs leading-none font-bold tracking-tight text-[#15599a]">{serviceOrder.categoria}</p>
          </div>
          <div className="flex items-center gap-2">
            <IoMdAlert />
            <p className="text-primary/60 text-xs leading-none tracking-tight">{serviceOrder.urgencia}</p>
          </div>
        </div>
        <div className="mt-2 flex w-full items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FaCity />
            <p className="text-primary/60 text-xs leading-none tracking-tight">
              {serviceOrder.localizacao.cidade}-{serviceOrder.localizacao.uf}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <FaUser />
            <p className="text-primary/60 text-xs leading-none tracking-tight">{serviceOrder.responsavel.nome || 'NÃO DEFINIDO'}</p>
          </div>
        </div>
        <h1 className="text-primary/60 mt-2 text-sm">OBSERVAÇÕES</h1>
        <div className="overscroll-y text-primary/80 scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 bg-primary/20 flex h-[80px] max-h-[80px] w-full items-center justify-center overflow-y-auto p-3 text-xs">
          {/* {serviceOrder.observacoes} */}
        </div>
        <div className="lg:0 mt-2 flex w-full flex-col-reverse items-center justify-between gap-1 lg:flex-row lg:gap-2">
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1`}>
              <BsCalendarPlus />
              <p className="text-primary/60 text-[0.65rem] font-medium">{formatDateAsLocale(serviceOrder.dataInsercao, true)}</p>
            </div>
            {serviceOrder.dataEfetivacao ? (
              <div className="flex items-center gap-1">
                <BsCalendarCheck color="rgb(34,197,94)" />
                <p className="text-primary/60 text-[0.65rem] font-medium">{formatDateAsLocale(serviceOrder.dataEfetivacao, true)}</p>
              </div>
            ) : null}
            <div className="flex items-center gap-2">
              <Link href={`/ordens-de-servico/pdf/${serviceOrder._id}`}>
                <div className="text-primary/60 flex cursor-pointer items-center gap-1 duration-300 ease-in-out hover:text-cyan-500">
                  <IoMdDocument style={{ fontSize: '20px' }} />
                  <p className="text-[0.6rem] font-medium">DOCUMENTO</p>
                </div>
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Avatar fallback={'R'} url={serviceOrder.autor?.avatar_url || undefined} height={20} width={20} />
            <p className="text-primary/60 text-[0.65rem] font-medium">{serviceOrder.autor?.nome || 'INDEFINIDO'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceOrderCard
