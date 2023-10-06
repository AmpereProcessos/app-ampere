import dayjs from 'dayjs'
import React from 'react'
import { FaCity, FaHourglass, FaHourglassHalf, FaUser } from 'react-icons/fa'
import { IoMdAlert } from 'react-icons/io'
import { MdCategory } from 'react-icons/md'
import Avatar from '../../utils/Avatar'
import { BsCalendarFill } from 'react-icons/bs'

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
    <div
      onClick={() => handleOpenModal(analysis._id)}
      className="flex  gap-2  w-full lg:w-[450px] h-[130px] lg:h-[130px] shadow-sm cursor-pointer border border-gray-300  hover:bg-blue-100 rounded-md"
    >
      <div className={`h-full w-[7px] ${getBarColor(analysis.status)} rounded-tl-md rounded-bl-md`}></div>
      <div className="flex grow flex-col p-3">
        <div className="w-full flex items-center justify-between">
          <h1 className="w-full text-center text-sm font-bold leading-none tracking-tight  lg:text-start">{analysis.nomeDoCliente}</h1>
          {analysis.procodigoSVBjeto ? <p className="text-[#fead41] font-bold">#{analysis.codigoSVB}</p> : null}
        </div>
        <div className="flex w-full justify-between items-center gap-2 mt-2">
          <div className="flex items-center gap-2">
            <MdCategory />
            <p className="text-xs  tracking-tight leading-none font-bold text-[#15599a]">{analysis.tipoDeSolicitacao || 'NÃO DEFINIDO'}</p>
          </div>
          <div className="flex items-center gap-2">
            <FaCity />
            <p className="text-xs text-gray-500 tracking-tight leading-none">{analysis.cidade}</p>
          </div>
        </div>
        <div className="flex w-full justify-between items-center gap-2 mt-2">
          <div className="flex items-center gap-2">
            <IoMdAlert />
            <p className="text-xs text-gray-500 tracking-tight leading-none">{analysis.tipoDeLaudo}</p>
          </div>
          <div className="flex items-center gap-2">
            <FaUser />
            <p className="text-xs text-gray-500 tracking-tight leading-none">{analysis.nomeVendedor || 'NÃO DEFINIDO'}</p>
          </div>
        </div>
        <div className="w-full gap-4 flex-col lg:flex-row flex items-center justify-between mt-4">
          <div className={`flex items-center gap-2 ${analysis.dataDeConclusao ? 'text-green-500' : 'text-gray-500'}`}>
            <BsCalendarFill />
            <p className="text-xs font-medium">
              {dayjs(analysis.dataDeConclusao ? analysis.dataDeConclusao : analysis.dataDeAbertura).format('DD/MM/YYYY HH:mm')}
            </p>
          </div>
          <div className={`flex items-center gap-2 ${!!analysis.dataDeConclusao ? 'text-green-500' : 'text-orange-500'}`}>
            <FaHourglass />
            <p className="text-xs tracking-tight leading-none font-bold">
              {getHourDiff({ insertDate: analysis.dataDeAbertura, conclusionDate: analysis.dataDeConclusao })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Avatar url={analysis.analista?.avatar_url} fallback={'U'} height={25} width={25} />
            <p className="font-medium text-gray-500 text-xs">{analysis.analista?.apelido}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalysisCard
