import React from 'react'
import { formatLongString } from '../../../../utils/constants'
import Image from 'next/image'
import { BsCalendarFill } from 'react-icons/bs'
import dayjs from 'dayjs'
import Avatar from '../../../utils/Avatar'

function getBarColor(status) {
  if (status == 'EM ANDAMENTO') return 'bg-blue-500'
  if (status == 'REALIZADO') return 'bg-green-500'
  if (status == 'PENDENTE') return 'bg-red-400'
  return 'bg-red-400'
}
function OpenCallCard({ call, handleOpenModal }) {
  return (
    <div
      key={call._id}
      onClick={() => handleOpenModal(call)}
      className="flex  gap-2  w-full lg:w-[400px] h-[310px] lg:h-[280px] shadow-sm cursor-pointer border border-gray-300  hover:bg-blue-100 rounded-md"
    >
      <div className={`h-full w-[7px] ${getBarColor(call.status)} rounded-tl-md rounded-bl-md`}></div>
      <div className="flex flex-col w-full grow p-6">
        <div className="flex flex-col w-full grow">
          <div className="flex flex-col w-full">
            <h1 className="w-full text-start font-bold tracking-tight leading-none ">{call.tipoSolicitacao}</h1>
            {call.requerente ? (
              <div className="flex items-center justify-start w-full gap-2 mt-1">
                <Avatar fallback={'R'} url={call.requerente?.avatar_url} height={20} width={20} />

                <p className="font-medium text-gray-500 text-xs">{call.requerente && call.requerente.apelido}</p>
              </div>
            ) : (
              <p className="text-xs text-gray-500 w-full text-start mt-1">{call.requerente ? call.requerente.nome : 'Requerente não definido'}</p>
            )}
          </div>
          {call.projeto ? (
            <div className="w-full flex flex-col items-center gap-2 mt-2">
              <p className="tracking-tight leading-none text-xs font-semibold text-[#fead41]">{call.projeto.codigo}</p>
              <p className="tracking-tight leading-none text-xs font-semibold text-gray-500">
                {call.projeto.nome ? call.projeto.nome : call.cliente.nome}
              </p>
            </div>
          ) : null}
          <div className="flex flex-col mt-4  gap-1 w-full">
            <p className="tracking-tight leading-none text-xs text-gray-800 font-semibold">OBSERVAÇÕES</p>
            <p className="text-xs w-full text-start text-gray-500">{formatLongString(call.observacoes, 140)}</p>
          </div>
        </div>
        <div className="w-full flex items-center justify-between">
          <div className={`flex items-center gap-2 ${call.dataEfetivacao ? 'text-green-500' : 'text-gray-500'}`}>
            <BsCalendarFill />
            <p className="text-xs font-medium">{dayjs(call.dataEfetivacao ? call.dataEfetivacao : call.dataInsercao).format('DD/MM/YYYY HH:mm')}</p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Avatar fallback={'U'} height={25} width={25} url={call.responsavel?.avatar_url || undefined} />
            {/* <div className="relative h-[25px] w-[25px]">
              <Image
                src={call.responsavel.avatar_url}
                alt="USUÁRIO"
                title="CONFIGURAÇÕES"
                fill={true}
                width={25}
                height={25}
                style={{ borderRadius: '100%' }}
              />
            </div> */}
            <p className="font-medium text-gray-500 text-xs">{call.responsavel?.apelido || 'À DEFINIR'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OpenCallCard
