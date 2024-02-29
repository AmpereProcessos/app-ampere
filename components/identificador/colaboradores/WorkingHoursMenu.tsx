import TimeInput from '@/components/inputs/TimeInput'
import { getDifferenceBetweenTimes } from '@/utils/methods/dates'
import { TEmployeeDTO, TUser, TWorkingHours } from '@/utils/schemas/users'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { FaPlayCircle, FaRegClock, FaStopCircle } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'

type WorkingHoursMenuProps = {
  infoHolder: TEmployeeDTO
  setInfoHolder: React.Dispatch<React.SetStateAction<TEmployeeDTO>>
}
function WorkingHoursMenu({ infoHolder, setInfoHolder }: WorkingHoursMenuProps) {
  const [workingHoursHolder, setWorkingHoursHolder] = useState<TWorkingHours>({
    horarioInicio: '',
    horarioFinal: '',
  })
  function handleAddWorkingHours(info: TWorkingHours) {
    if (info.horarioInicio.trim().length < 3) return toast.error('Preencha um horário início.')
    if (info.horarioFinal.trim().length < 3) return toast.error('Preencha um horário de término.')

    const hours = [...infoHolder.horariosTrabalho]

    hours.push(info)

    setInfoHolder((prev) => ({ ...prev, horariosTrabalho: hours }))
  }
  function handleDeleteWorkingHours(index: number) {
    const hours = [...infoHolder.horariosTrabalho]

    hours.splice(index, 1)

    setInfoHolder((prev) => ({ ...prev, horariosTrabalho: hours }))
  }
  function getWorkload(workingHours: TWorkingHours[]) {
    const totalMinutes = workingHours.reduce(
      (acc, current) => acc + getDifferenceBetweenTimes(current.horarioInicio, current.horarioFinal).minutesTotal,
      0
    )

    var hours = Math.floor(totalMinutes / 60)
    var minutes = totalMinutes % 60
    return { hours, minutes }
  }
  return (
    <>
      <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <TimeInput
            label="HORÁRIO DE INÍCIO"
            value={workingHoursHolder.horarioInicio}
            handleChange={(value) => setWorkingHoursHolder((prev) => ({ ...prev, horarioInicio: value || '' }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/2">
          <TimeInput
            label="HORÁRIO DE TÉRMINO"
            value={workingHoursHolder.horarioFinal}
            handleChange={(value) => setWorkingHoursHolder((prev) => ({ ...prev, horarioFinal: value || '' }))}
            width="100%"
          />
        </div>
      </div>
      <div className="flex w-full items-center justify-end">
        <button
          onClick={() => handleAddWorkingHours(workingHoursHolder)}
          className="rounded bg-black py-1 px-4 text-xs font-medium text-white duration-300 ease-in-out disabled:bg-gray-500 enabled:hover:bg-gray-700"
        >
          ADICIONAR HORÁRIO
        </button>
      </div>
      {infoHolder.horariosTrabalho.length ? (
        <div className="flex items-center gap-2 self-center rounded-md bg-[#15599a] px-2 py-1 font-medium text-white">
          <FaRegClock />
          <h1 className="text-sm tracking-tight">
            {getWorkload(infoHolder.horariosTrabalho).hours} HORAS E {getWorkload(infoHolder.horariosTrabalho).minutes} MINUTOS TOTAIS
          </h1>
        </div>
      ) : null}
      <div className="flex w-full flex-wrap items-start justify-around gap-2">
        {infoHolder.horariosTrabalho.length > 0 ? (
          infoHolder.horariosTrabalho.map((hour, index) => (
            <div key={index} className="flex w-full flex-col rounded-md border border-gray-300 p-3 lg:w-[350px]">
              <h1 className="text-xs font-black leading-none tracking-tight lg:text-sm">TURNO {index + 1}</h1>
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-2 `}>
                    <FaPlayCircle color="rgb(34,197,94)" />
                    <p className="text-xs font-medium text-gray-500">INÍCIO ÀS {hour.horarioInicio}</p>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <FaStopCircle color={'#ed174c'} />
                    <p className="text-xs font-medium text-gray-500">TERMINO ÀS {hour.horarioFinal}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteWorkingHours(index)}
                  type="button"
                  className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
                >
                  <MdDelete style={{ color: 'red' }} size={15} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs font-medium italic text-gray-500">Não há registros de horários de trabalho.</p>
        )}
      </div>
    </>
  )
}

export default WorkingHoursMenu
