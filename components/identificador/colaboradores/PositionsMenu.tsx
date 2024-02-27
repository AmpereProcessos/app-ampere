import DateInput from '@/components/inputs/Date'
import TextInput from '@/components/inputs/Text'
import { formatDate } from '@/utils/constants'
import { formatDateAsLocale } from '@/utils/methods/formatting'
import { formatDateInputChange } from '@/utils/methods/shared'
import { TCorporatePosition, TUser } from '@/utils/schemas/users'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { BsCalendarMinus, BsCalendarPlus, BsCode } from 'react-icons/bs'
import { MdDelete } from 'react-icons/md'

type PositionsMenuProps = {
  infoHolder: TUser
  setInfoHolder: React.Dispatch<React.SetStateAction<TUser>>
}
function PositionsMenu({ infoHolder, setInfoHolder }: PositionsMenuProps) {
  const [positionHolder, setPositionHolder] = useState<TCorporatePosition>({ cargo: '', cbo: '', dataInicio: new Date().toISOString() })
  function handleAddPosition(info: TCorporatePosition) {
    if (info.cargo.trim().length < 3) return toast.error('Preencha um cargo de ao menos 3 caracteres.')
    if (info.cbo.trim().length < 3) return toast.error('Preencha um CBO de ao menos 3 caracteres.')

    const positions = [...infoHolder.cargos]

    positions.push(info)

    setInfoHolder((prev) => ({ ...prev, cargos: positions }))
  }
  function handleDeletePosition(index: number) {
    const positions = [...infoHolder.cargos]

    positions.splice(index, 1)

    setInfoHolder((prev) => ({ ...prev, cargos: positions }))
  }
  return (
    <>
      <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
        <div className="w-full lg:w-2/6">
          <TextInput
            label="CARGO"
            placeholder="Preencha o nome do cargo..."
            value={positionHolder.cargo}
            handleChange={(value) => setPositionHolder((prev) => ({ ...prev, cargo: value }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-2/6">
          <TextInput
            label="CBO"
            placeholder="Preencha o CBO do cargo..."
            value={positionHolder.cbo}
            handleChange={(value) => setPositionHolder((prev) => ({ ...prev, cbo: value }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/6">
          <DateInput
            label="DATA DE INÍCIO"
            value={positionHolder.dataInicio ? formatDate(positionHolder.dataInicio) : undefined}
            handleChange={(value) => setPositionHolder((prev) => ({ ...prev, dataInicio: formatDateInputChange(value) }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/6">
          <DateInput
            label="DATA DE TÉRMINO"
            value={positionHolder.dataFinal ? formatDate(positionHolder.dataFinal) : undefined}
            handleChange={(value) => setPositionHolder((prev) => ({ ...prev, dataFinal: formatDateInputChange(value) }))}
            width="100%"
          />
        </div>
      </div>
      <div className="flex w-full items-center justify-end">
        <button
          onClick={() => handleAddPosition(positionHolder)}
          className="rounded bg-black py-1 px-4 text-xs font-medium text-white duration-300 ease-in-out disabled:bg-gray-500 enabled:hover:bg-gray-700"
        >
          ADICIONAR CARGO
        </button>
      </div>
      <div className="flex w-full flex-wrap items-start justify-around gap-2">
        {infoHolder.cargos.length ? (
          infoHolder.cargos.map((position, index) => (
            <div key={index} className="flex w-full flex-col rounded-md border border-gray-300 p-3 lg:w-[450px]">
              <div className="flex w-full items-center justify-between gap-2">
                <h1 className="text-xs font-black leading-none tracking-tight lg:text-sm">{position.cargo}</h1>
                <button
                  onClick={() => handleDeletePosition(index)}
                  type="button"
                  className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
                >
                  <MdDelete style={{ color: 'red' }} size={15} />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <BsCode />
                <p className="text-[0.65rem] font-medium leading-none tracking-tight text-gray-500 lg:text-xs">{position.cbo}</p>
              </div>
              <div className="mt-2 flex w-full items-center justify-between">
                <div className={`flex items-center gap-2`}>
                  <BsCalendarPlus />
                  <p className="text-xs font-medium text-gray-500">{formatDateAsLocale(position.dataInicio)}</p>
                </div>
                <div className="flex items-center justify-center gap-2">
                  {position.dataFinal ? (
                    <>
                      <BsCalendarMinus color={'#ed174c'} />
                      <p className="text-xs font-medium text-gray-500">{formatDateAsLocale(position.dataFinal)}</p>
                    </>
                  ) : (
                    <p className="text-xs font-bold text-green-500">EM ABERTO</p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs font-medium italic text-gray-500">Não há registros de cargos ocupados.</p>
        )}
      </div>
    </>
  )
}

export default PositionsMenu
