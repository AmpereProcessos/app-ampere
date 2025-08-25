import dayjs from 'dayjs'
import React from 'react'
import { FaCity, FaHourglass, FaHourglassHalf, FaUser } from 'react-icons/fa'
import { IoMdAlert } from 'react-icons/io'
import { MdCategory } from 'react-icons/md'
import Avatar from '../../utils/Avatar'
import { BsCalendarFill, BsFillCalendarCheckFill } from 'react-icons/bs'

function getBarColor(status) {
  if (status == 'CONCLUIDO') return 'bg-green-500'
  if (status == 'EM ANÁLISE TÉCNICA') return 'bg-yellow-500'
  if (status == 'PENDÊNCIA COMERCIAL') return 'bg-cyan-500'
  if (status == 'VISITA IN LOCO') return 'bg-indigo-500'
  if (status == 'REJEITADA') return 'bg-red-300'
  return 'bg-primary/60'
}
function getHourDiff({ insertDate, conclusionDate }) {
  if (!conclusionDate) {
    const diffInHours = dayjs().diff(insertDate, 'hour')
    return `${diffInHours} HORAS`
  }
  const diffInHours = dayjs(conclusionDate).diff(insertDate, 'hour')
  return `${diffInHours} HORAS`
}
function AnalysisCard({ analysis, handleOpenModal }) {
  return (
    <div key={analysis._id} className="border-primary/20 flex h-[180px] w-full gap-2 rounded-md border shadow-xs lg:h-[180px] lg:w-[400px]">
      <div className={`h-full w-[7px] ${getBarColor(analysis.status)} rounded-tl-md rounded-bl-md`}></div>
      <div className="flex w-full grow flex-col p-6">
        <div className="flex w-full grow flex-col">
          <div className="flex w-full flex-col">
            <h1
              onClick={() => handleOpenModal(analysis._id)}
              className="w-full cursor-pointer text-center text-sm leading-none font-bold tracking-tight duration-300 ease-in-out hover:text-cyan-500 lg:text-start"
            >
              {analysis.nome}
            </h1>
            <p className="text-primary/60 text-xs font-medium">{analysis.tipoSolicitacao}</p>
            <div className="mt-1 flex w-full items-center justify-start gap-2">
              <Avatar fallback={'R'} url={analysis.requerente?.avatar_url} height={20} width={20} />
              <p className="text-primary/60 text-xs font-medium">{analysis.requerente.nomeCRM || analysis.requerente.apelido}</p>
            </div>
          </div>
          <div className="mt-2 flex w-full items-center justify-center gap-2">
            {analysis.projeto.identificador ? (
              <p className="text-xs leading-none font-bold tracking-tight text-[#fead41]">({analysis.projeto.identificador})</p>
            ) : null}
            <p className="text-primary/60 text-xs leading-none font-semibold tracking-tight">
              {analysis.projeto.nome ? analysis.projeto.nome : analysis.cliente.nome}
            </p>
          </div>
          <div className="mt-2 flex w-full items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <FaCity />
              <p className="text-primary/60 text-[0.6rem] leading-none tracking-tight lg:text-xs">{analysis.localizacao.cidade}</p>
            </div>
            <div className="flex items-center gap-2">
              <IoMdAlert />
              <p className="text-primary/60 text-[0.6rem] leading-none tracking-tight lg:text-xs">{analysis.complexidade}</p>
            </div>
          </div>
        </div>
        <div className="flex w-full items-center justify-between">
          <div className={`flex items-center gap-2`}>
            {analysis.dataEfetivacao ? <BsFillCalendarCheckFill color="rgb(34,197,94)" /> : <BsCalendarFill />}
            <p className={`text-xs font-medium ${analysis.dataEfetivacao ? 'text-green-500' : 'text-primary/60'}`}>
              {dayjs(analysis.dataEfetivacao ? analysis.dataEfetivacao : analysis.dataInsercao).format('DD/MM/YYYY HH:mm')}
            </p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Avatar fallback={'U'} height={25} width={25} url={analysis.analista?.avatar_url || undefined} />
            <p className="text-primary/60 text-xs font-medium">{analysis.analista?.apelido || 'À DEFINIR'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalysisCard
