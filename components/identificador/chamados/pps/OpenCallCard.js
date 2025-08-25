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
      className="border-primary/20 dark:hover:bg-primary/10 flex h-[310px] w-full cursor-pointer gap-2 rounded-md border shadow-xs hover:bg-blue-100 lg:h-[280px] lg:w-[400px]"
    >
      <div className={`h-full w-[7px] ${getBarColor(call.status)} rounded-tl-md rounded-bl-md`}></div>
      <div className="flex w-full grow flex-col p-6">
        <div className="flex w-full grow flex-col">
          <div className="flex w-full flex-col">
            <h1 className="w-full text-start leading-none font-bold tracking-tight">{call.tipoSolicitacao}</h1>
            {call.requerente ? (
              <div className="mt-1 flex w-full items-center justify-start gap-2">
                <Avatar fallback={'R'} url={call.requerente?.avatar_url} height={20} width={20} />

                <p className="text-primary/60 text-xs font-medium">{call.requerente && call.requerente.apelido}</p>
              </div>
            ) : (
              <p className="text-primary/60 mt-1 w-full text-start text-xs">{call.requerente ? call.requerente.nome : 'Requerente não definido'}</p>
            )}
          </div>
          {call.projeto ? (
            <div className="mt-2 flex w-full flex-col items-center gap-2">
              <p className="text-xs leading-none font-semibold tracking-tight text-[#fead41]">{call.projeto.codigo}</p>
              <p className="text-primary/60 text-xs leading-none font-semibold tracking-tight">
                {call.projeto.nome ? call.projeto.nome : call.cliente.nome}
              </p>
            </div>
          ) : null}
          <div className="mt-4 flex w-full flex-col gap-1">
            <p className="text-primary/80 text-xs leading-none font-semibold tracking-tight">OBSERVAÇÕES</p>
            <p className="text-primary/60 w-full text-start text-xs">{formatLongString(call.observacoes, 140)}</p>
          </div>
        </div>
        <div className="flex w-full items-center justify-between">
          <div className={`flex items-center gap-2 ${call.dataEfetivacao ? 'text-green-500' : 'text-primary/60'}`}>
            <BsCalendarFill />
            <p className="text-xs font-medium">{dayjs(call.dataEfetivacao ? call.dataEfetivacao : call.dataInsercao).format('DD/MM/YYYY HH:mm')}</p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Avatar fallback={'U'} height={25} width={25} url={call.responsavel?.avatar_url || undefined} />
            <p className="text-primary/60 text-xs font-medium">{call.responsavel?.apelido || 'À DEFINIR'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OpenCallCard
