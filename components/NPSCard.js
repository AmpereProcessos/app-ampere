import React, { useState } from 'react'
import NumberInput from './NumberInput'
import axios from 'axios'
import { BsFillCalendarCheckFill, BsTelephone } from 'react-icons/bs'
import SaveButton from './utils/Buttons/SaveButton'
import { FaCity, FaSave, FaUserAlt } from 'react-icons/fa'
import SelectInput from './inputs/Select'
import { formatDate } from '../utils/constants'
import dayjs from 'dayjs'
import toast from 'react-hot-toast'
import { getErrorMessage } from '../utils/methods/handlers'
function NPSCard({ project, credentials }) {
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
        'jornada.dataNps': nps != project.nps ? new Date().toJSON() : project.dataNps,
        'jornada.obsNps': obsNps,
      })
      toast.dismiss(loadingToastId)
      toast.success('Alterações feitas com sucesso !')
    } catch (error) {
      toast.dismiss(loadingToastId)
      const msg = getErrorMessage(error)
      toast.error(msg)
    }
  }
  function getTagColor(npsValue) {
    if (npsValue == undefined || npsValue == null) return 'bg-gray-500'
    if (nps <= 6) return 'bg-red-500'
    if (nps >= 9) return 'bg-green-500'
    return 'bg-blue-300'
  }
  return (
    <div className="flex w-[450px] items-center rounded-md border border-gray-200">
      <div className={`h-full w-[5px] rounded-bl-md rounded-tl-md ${getTagColor(nps)}`}></div>
      <div className="flex grow flex-col p-3">
        <div className="w-full flex items-center justify-between">
          <h1 className="w-full text-center text-sm font-bold leading-none tracking-tight duration-300 ease-in-out hover:text-cyan-500 lg:text-start">
            {project.nomeDoContrato}
          </h1>
          <p className="text-[#fead41] font-bold">#{project.qtde}</p>
        </div>

        <div className="flex w-full justity-center items-center gap-2 mt-2">
          <div className="flex items-center gap-2">
            <FaUserAlt />
            <p className="text-xs text-gray-500 tracking-tight leading-none">{project.vendedor?.nome}</p>
          </div>
          <div className="flex items-center gap-2">
            <BsTelephone />
            <p className="text-xs text-gray-500 tracking-tight leading-none">{project.telefone || 'NÃO FORNECIDO'}</p>
          </div>
          <div className="flex items-center gap-2">
            <FaCity />
            <p className="text-xs text-gray-500 tracking-tight leading-none">{project.cidade}</p>
          </div>
        </div>
        <h1 className="text-sm text-gray-500 mt-2">OBSERVAÇÕES</h1>
        <div className="w-full">
          <textarea
            value={obsNps}
            onChange={(e) => setObsNps(e.target.value)}
            className="bg-gray-100 resize-none w-full outline-none p-2 text-center h-[50px]"
          />
        </div>
        <div className="flex items-end w-full justify-between">
          <div className="flex items-end gap-2">
            <div className="w-[100px] flex flex-col gap-1">
              <label htmlFor={'nota'} className={'text-start text-gray-500 font-bold font-raleway text-xs'}>
                NOTA
              </label>
              <select
                value={nps >= 0 ? Math.round(nps).toString() : undefined}
                onChange={(e) => setNps(e.target.value)}
                className="w-full outline-none bg-transparent text-xs text-gray-500"
              >
                <option value={undefined}>N/A</option>
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
              {/* <SelectInput
                label={'NOTA'}
                labelClassName="text-start text-gray-500 font-normal font-raleway text-sm"
                value={nps >= 0 ? Math.round(nps).toString() : undefined}
                selectedItemLabel={'N/A'}
                options={[
                  { id: 1, label: '0', value: '0' },
                  { id: 2, label: '1', value: '1' },
                  { id: 3, label: '2', value: '2' },
                  { id: 4, label: '3', value: '3' },
                  { id: 5, label: '4', value: '4' },
                  { id: 6, label: '5', value: '5' },
                  { id: 7, label: '6', value: '6' },
                  { id: 8, label: '7', value: '7' },
                  { id: 9, label: '8', value: '8' },
                  { id: 10, label: '9', value: '9' },
                  { id: 11, label: '10', value: '10' },
                ]}
                onReset={() => setNps(undefined)}
                handleChange={(value) => setNps(value)}
                width={'100%'}
              /> */}
            </div>
          </div>
          {project.jornada?.dataNps ? (
            <div className="flex items-center gap-2 text-green-500">
              <BsFillCalendarCheckFill color="rgb(34,197, 94)" />
              <p className="text-sm text-gray-500">{dayjs(project.jornada.dataNps).add(3, 'hour').format('DD/MM/YYYY')}</p>
            </div>
          ) : null}
          <button
            onClick={handleChanges}
            className="p-1 rounded w-fit border border-blue-500 text-blue-500 font-medium hover:bg-blue-500 hover:text-white duration-300 ease-in-out"
          >
            SALVAR
          </button>
        </div>
      </div>
    </div>
  )
}

export default NPSCard
// <div className="w-[250px] lg:w-[450px] cursor-pointer border border-gray-200 p-3 hover:bg-blue-100">
//   <div className="flex items-center justify-between">
//     <p className="text-xs text-gray-700">{project.nomeDoContrato}</p>
//     <p className="text-xs text-[#15599a]">#{project.qtde}</p>
//   </div>
//   <div className="flex items-center justify-between">
//     <div>
//       <span className="text-xxs">CIDADE</span>
//       <p className="text-xs text-gray-600">{project.cidade ? project.cidade : '-'}</p>
//     </div>
//     <div className="hidden lg:block">
//       <span className="text-xxs">VENDEDOR</span>
//       <p className="text-xs text-gray-600">{project.vendedor.nome ? project.vendedor.nome : '-'}</p>
//     </div>
//     <div>
//       <span className="text-xxs">TELEFONE</span>
//       <p className="text-xs text-center text-gray-600">{project.telefone ? project.telefone : '-'}</p>
//     </div>
//   </div>
//   <div className="flex flex-col items-center mt-2">
//     <h1 className="text-sm text-gray-500 font-bold">OBSERVAÇÕES</h1>
//     <textarea
//       value={obsNps}
//       onChange={(e) => setObsNps(e.target.value)}
//       className="bg-gray-100 resize-none w-full outline-none p-2 text-center"
//     />
//   </div>
//   <div className="flex items-center justify-between mt-2 px-2">
//     <SelectInput
//       label={'NPS'}
//       value={nps ? Math.round(nps) : undefined}
//       selectedItemLabel={'NÃO DEFINIDO'}
//       options={[
//         { id: 1, label: 1, value: 1 },
//         { id: 2, label: 2, value: 2 },
//         { id: 3, label: 3, value: 3 },
//         { id: 4, label: 4, value: 4 },
//         { id: 5, label: 5, value: 5 },
//         { id: 6, label: 6, value: 6 },
//         { id: 7, label: 7, value: 7 },
//         { id: 8, label: 8, value: 8 },
//         { id: 9, label: 9, value: 9 },
//         { id: 10, label: 10, value: 10 },
//       ]}
//       onReset={() => setNps(undefined)}
//       handleChange={(value) => setNps(value)}
//     />
//     <div className="flex flex-col items-center justify-center">
//       <p className="text-xs text-gray-700 font-bold">DATA DE COLETA</p>
//       <p className="text-xs text-gray-500">{project.jornada.dataNps ? new Date(project.jornada.dataNps).toLocaleDateString() : '-'}</p>
//     </div>
//     <div className="flex items-center justify-center">
//       <SaveButton text={'SALVAR'} icon={<FaSave />} handleClick={handleChanges} />
//     </div>
//   </div>
//   {msg.text && <p className={`${msg.color} italic text-center text-xs`}>{msg.text}</p>}
// </div>
