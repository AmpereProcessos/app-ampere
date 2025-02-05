import TextInput from '@/components/inputs/Text'
import { TProjectDTO } from '@/utils/schemas/projects'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { AiFillDelete } from 'react-icons/ai'
import { BsSuitDiamondFill } from 'react-icons/bs'
import { IoIosAdd } from 'react-icons/io'
import { MdOutlineAddCircle } from 'react-icons/md'

function getObservationsAsList(str: string) {
  if (!str) return []
  const spllited = str.split('/')
  return spllited.filter((x) => !!x)
}

type ObservationsBlockProps = {
  infoHolder: TProjectDTO
  setInfo: React.Dispatch<React.SetStateAction<TProjectDTO>>
  changes: { [key: string]: any }
  setChanges: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>
}
function ObservationsBlock({ infoHolder, setInfo, changes, setChanges }: ObservationsBlockProps) {
  const [observationHolder, setObservationHolder] = useState('')

  function addObservation(observation: string) {
    if (observation.trim().length == 0) return toast.error('Preencha uma observação válida.')

    const newObservation = infoHolder.obra?.observacoes ? infoHolder.obra.observacoes + '/' + observation : observation

    setInfo((prev) => ({ ...prev, obra: { ...prev.obra, observacoes: newObservation } }))
    setChanges((prev) => ({ ...prev, 'obra.observacoes': newObservation }))

    return setObservationHolder('')
  }
  function removeObservation(index: number) {
    const observationAsList = getObservationsAsList(infoHolder.obra.observacoes || '')
    observationAsList.splice(index, 1)
    const observationAsStr = observationAsList.join('/')
    setInfo((prev) => ({ ...prev, obra: { ...prev.obra, observacoes: observationAsStr } }))
    setChanges((prev) => ({ ...prev, 'obra.observacoes': observationAsStr }))
    return
  }
  return (
    <div className="flex h-full max-h-[300px] min-h-[300px] w-full flex-col rounded-lg border border-cyan-500 p-3">
      <div className="flex w-full items-center justify-between">
        <h1 className="font-sans text-center  font-bold text-[#353432]">OBSERVAÇÕES DE OBRA</h1>
      </div>
      <div className="flex w-full items-center gap-1">
        <div className="w-[90%]">
          <TextInput
            label="OBSERVAÇÃO"
            showLabel={false}
            placeholder={'Preencha a observação...'}
            value={observationHolder}
            handleChange={(value) => setObservationHolder(value)}
            width={'100%'}
          />
        </div>

        <div className="flex w-[10%] items-center justify-center">
          <button onClick={() => addObservation(observationHolder)} className="flex items-center justify-center text-green-500 ">
            <MdOutlineAddCircle style={{ fontSize: '25px' }} />
          </button>
          {/* <button onClick={() => addObservation(observationHolder)} className="flex items-center justify-center text-green-500">
                 <IoIosAdd />
                </button> */}
        </div>
      </div>
      <div className="overscroll-y mt-2 flex w-full grow flex-col overflow-y-auto px-2 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
        {getObservationsAsList(infoHolder.obra.observacoes || '').length > 0 ? (
          getObservationsAsList(infoHolder.obra.observacoes || '').map((observation, index) => (
            <div key={index} className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <BsSuitDiamondFill />
                <p className="text-xs tracking-tight text-gray-500">{observation}</p>
              </div>
              <button onClick={() => removeObservation(index)} className="flex items-center justify-center text-sm text-red-300 hover:text-red-500">
                <AiFillDelete />
              </button>
            </div>
          ))
        ) : (
          <div className="flex grow items-center justify-center">
            <p className="text-center text-sm italic text-gray-500">Nenhum observação adicionada...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ObservationsBlock
