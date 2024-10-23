import React, { useState } from 'react'
import NumberInput from './NumberInput'
import axios from 'axios'
import { BsFillCalendarCheckFill, BsTelephone } from 'react-icons/bs'
import SaveButton from './utils/Buttons/SaveButton'
import { FaCity, FaSave, FaUserAlt } from 'react-icons/fa'
import { formatDateAsLocale } from '../utils/methods/formatting'
import toast from 'react-hot-toast'
import { getErrorMessage } from '../utils/methods/handlers'
import { useQueryClient } from '@tanstack/react-query'
import { isNumber } from '../utils/methods/validating'
import { TProjectDTO } from '@/utils/schemas/projects'

type NPSCardProps = {
  project: TProjectDTO
}
function NPSCard({ project }: NPSCardProps) {
  const queryClient = useQueryClient()
  const [nps, setNps] = useState(project.nps)
  const [obsNps, setObsNps] = useState(project.jornada.obsNps)
  const [msg, setMsg] = useState({
    text: '',
    color: '',
  })
  async function handleChanges() {
    const loadingToastId = toast.loading('Carregando...')
    try {
      const response = await axios.post(`/api/projects/update/${project._id}`, {
        nps: nps,
        'jornada.dataNps': nps != project.nps ? new Date().toJSON() : project.jornada.dataNps,
        'jornada.obsNps': obsNps,
      })
      toast.dismiss(loadingToastId)
      toast.success('Alterações feitas com sucesso !')
      await queryClient.invalidateQueries({ queryKey: ['nps'] })
    } catch (error) {
      toast.dismiss(loadingToastId)
      const msg = getErrorMessage(error)
      toast.error(msg)
    }
  }
  function getTagColor(npsValue: TProjectDTO['nps']) {
    if (npsValue == undefined || npsValue == null) return { tag: 'NÃO DEFINIDO', color: 'bg-gray-500' }
    if (npsValue <= 6) return { tag: 'DETRATOR', color: 'bg-red-500' }
    if (npsValue >= 9) return { tag: 'PROMOTOR', color: 'bg-green-500' }
    return { tag: 'NEUTRO', color: 'bg-blue-300' }
  }
  if (project.qtde == 2) console.log(nps)
  return (
    <div className="flex w-[450px] items-center rounded-md border border-gray-200">
      <div className={`h-full w-[5px] rounded-bl-md rounded-tl-md ${getTagColor(nps).color}`}></div>
      <div className="flex grow flex-col p-3">
        <div className="flex w-full items-center justify-between">
          <h1 className="w-full text-center text-sm font-bold leading-none tracking-tight duration-300 ease-in-out hover:text-cyan-500 lg:text-start">
            <strong className="text-[#fead41]">{project.qtde}</strong> {project.nomeDoContrato}
          </h1>
          <div className={`flex min-w-fit items-center gap-2 rounded-full ${getTagColor(nps).color} px-2 py-1`}>
            <h1 className="text-[0.65rem] font-medium text-white lg:text-xs">{getTagColor(nps).tag}</h1>
          </div>
        </div>
        <div className="justity-center mt-2 flex w-full items-center gap-2">
          <div className="flex items-center gap-2">
            <FaUserAlt />
            <p className="text-[0.6rem] leading-none tracking-tight text-gray-500">{project.vendedor?.nome}</p>
          </div>
          <div className="flex items-center gap-2">
            <BsTelephone />
            <p className="text-[0.6rem] leading-none tracking-tight text-gray-500">{project.telefone || 'NÃO FORNECIDO'}</p>
          </div>
          <div className="flex items-center gap-2">
            <FaCity />
            <p className="text-[0.6rem] leading-none tracking-tight text-gray-500">{project.cidade}</p>
          </div>
        </div>
        <h1 className="mt-2 text-sm text-gray-500">OBSERVAÇÕES</h1>
        <div className="w-full">
          <textarea
            value={obsNps || undefined}
            onChange={(e) => setObsNps(e.target.value)}
            className="h-[50px] w-full resize-none bg-gray-100 p-2 text-center outline-none"
          />
        </div>
        <div className="flex w-full items-end justify-between">
          <div className="flex items-end gap-2">
            <div className="flex w-[100px] flex-col gap-1">
              <label htmlFor={'nota'} className={'text-start font-raleway text-xs font-bold text-gray-500'}>
                NOTA
              </label>
              <select
                value={isNumber(nps) ? Math.round(nps as number).toString() : undefined}
                onChange={(e) => {
                  const npsValue = isNumber(e.target.value) ? Number(e.target.value) : null
                  setNps(npsValue)
                }}
                className="w-full bg-transparent text-xs text-gray-500 outline-none"
              >
                <option value={'N/A'}>N/A</option>
                <option value={'0'}>0</option>
                <option value={'1'}>1</option>
                <option value={'2'}>2</option>
                <option value={'3'}>3</option>
                <option value={'4'}>4</option>
                <option value={'5'}>5</option>
                <option value={'6'}>6</option>
                <option value={'7'}>7</option>
                <option value={'8'}>8</option>
                <option value={'9'}>9</option>
                <option value={'10'}>10</option>
              </select>
            </div>
          </div>
          {project.jornada?.dataNps ? (
            <div className="flex items-center gap-2 text-green-500">
              <BsFillCalendarCheckFill color="rgb(34,197, 94)" />
              <p className="text-xs text-gray-500">{formatDateAsLocale(project.jornada.dataNps, true)}</p>
            </div>
          ) : null}
          <button
            onClick={handleChanges}
            className="w-fit rounded border border-blue-500 p-1 text-xs font-medium text-blue-500 duration-300 ease-in-out hover:bg-blue-500 hover:text-white"
          >
            SALVAR
          </button>
        </div>
      </div>
    </div>
  )
}

export default NPSCard
