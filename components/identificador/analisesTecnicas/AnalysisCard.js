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
  return 'bg-gray-500'
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
    <div key={analysis._id} className="flex  h-[180px]  w-full gap-2 rounded-md border border-gray-300 shadow-sm lg:h-[180px]   lg:w-[400px]">
      <div className={`h-full w-[7px] ${getBarColor(analysis.status)} rounded-tl-md rounded-bl-md`}></div>
      <div className="flex w-full grow flex-col p-6">
        <div className="flex w-full grow flex-col">
          <div className="flex w-full flex-col">
            <h1
              onClick={() => handleOpenModal(analysis._id)}
              className="w-full cursor-pointer text-center text-sm font-bold leading-none tracking-tight duration-300 ease-in-out hover:text-cyan-500 lg:text-start"
            >
              {analysis.nome}
            </h1>
            <p className="text-xs font-medium text-gray-500">{analysis.tipoSolicitacao}</p>
            <div className="mt-1 flex w-full items-center justify-start gap-2">
              <Avatar fallback={'R'} url={analysis.requerente?.avatar_url} height={20} width={20} />
              <p className="text-xs font-medium text-gray-500">{analysis.requerente.nomeCRM || analysis.requerente.apelido}</p>
            </div>
          </div>
          <div className="mt-2 flex w-full items-center justify-center gap-2">
            {analysis.projeto.identificador ? (
              <p className="text-xs font-bold leading-none tracking-tight text-[#fead41]">({analysis.projeto.identificador})</p>
            ) : null}
            <p className="text-xs font-semibold leading-none tracking-tight text-gray-500">
              {analysis.projeto.nome ? analysis.projeto.nome : analysis.cliente.nome}
            </p>
          </div>
          <div className="mt-2 flex w-full items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <FaCity />
              <p className="text-[0.6rem] leading-none tracking-tight text-gray-500 lg:text-xs">{analysis.localizacao.cidade}</p>
            </div>
            <div className="flex items-center gap-2">
              <IoMdAlert />
              <p className="text-[0.6rem] leading-none tracking-tight text-gray-500 lg:text-xs">{analysis.complexidade}</p>
            </div>
          </div>
        </div>
        <div className="flex w-full items-center justify-between">
          <div className={`flex items-center gap-2`}>
            {analysis.dataEfetivacao ? <BsFillCalendarCheckFill color="rgb(34,197,94)" /> : <BsCalendarFill />}
            <p className={`text-xs font-medium ${analysis.dataEfetivacao ? 'text-green-500' : 'text-gray-500'}`}>
              {dayjs(analysis.dataEfetivacao ? analysis.dataEfetivacao : analysis.dataInsercao).format('DD/MM/YYYY HH:mm')}
            </p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Avatar fallback={'U'} height={25} width={25} url={analysis.analista?.avatar_url || undefined} />
            <p className="text-xs font-medium text-gray-500">{analysis.analista?.apelido || 'À DEFINIR'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalysisCard
