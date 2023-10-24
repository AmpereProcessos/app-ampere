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
    <div key={analysis._id} className="flex  gap-2  w-full lg:w-[400px] h-[180px] lg:h-[180px] shadow-sm border border-gray-300   rounded-md">
      <div className={`h-full w-[7px] ${getBarColor(analysis.status)} rounded-tl-md rounded-bl-md`}></div>
      <div className="flex flex-col w-full grow p-6">
        <div className="flex flex-col w-full grow">
          <div className="flex flex-col w-full">
            <h1
              onClick={() => handleOpenModal(analysis._id)}
              className="w-full cursor-pointer text-center text-sm font-bold leading-none tracking-tight duration-300 ease-in-out hover:text-cyan-500 lg:text-start"
            >
              {analysis.nome}
            </h1>
            <p className="font-medium text-gray-500 text-xs">{analysis.tipoSolicitacao}</p>
            <div className="flex items-center justify-start w-full gap-2 mt-1">
              <Avatar fallback={'R'} url={analysis.requerente?.avatar_url} height={20} width={20} />
              <p className="font-medium text-gray-500 text-xs">{analysis.requerente.apelido || analysis.requerente.nomeCRM}</p>
            </div>
          </div>
          <div className="w-full flex items-center justify-center gap-2 mt-2">
            {analysis.projeto.identificador ? (
              <p className="tracking-tight leading-none text-xs font-bold text-[#fead41]">({analysis.projeto.identificador})</p>
            ) : null}
            <p className="tracking-tight leading-none text-xs font-semibold text-gray-500">
              {analysis.projeto.nome ? analysis.projeto.nome : analysis.cliente.nome}
            </p>
          </div>
          <div className="w-full flex items-center justify-between gap-2 mt-2">
            <div className="flex items-center gap-2">
              <FaCity />
              <p className="text-[0.6rem] lg:text-xs text-gray-500 tracking-tight leading-none">{analysis.localizacao.cidade}</p>
            </div>
            <div className="flex items-center gap-2">
              <IoMdAlert />
              <p className="text-[0.6rem] lg:text-xs text-gray-500 tracking-tight leading-none">{analysis.complexidade}</p>
            </div>
          </div>
        </div>
        <div className="w-full flex items-center justify-between">
          <div className={`flex items-center gap-2`}>
            {analysis.dataEfetivacao ? <BsFillCalendarCheckFill color="rgb(34,197,94)" /> : <BsCalendarFill />}
            <p className={`text-xs font-medium ${analysis.dataEfetivacao ? 'text-green-500' : 'text-gray-500'}`}>
              {dayjs(analysis.dataEfetivacao ? analysis.dataEfetivacao : analysis.dataInsercao).format('DD/MM/YYYY HH:mm')}
            </p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Avatar fallback={'U'} height={25} width={25} url={analysis.analista?.avatar_url || undefined} />
            <p className="font-medium text-gray-500 text-xs">{analysis.analista?.apelido || 'À DEFINIR'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalysisCard
