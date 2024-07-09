import { TProjectDTO } from '@/utils/schemas/projects'
import React from 'react'
import { FaLock } from 'react-icons/fa'
import CheckboxInput from '../inputs/Checkbox'
import TextareaInput from '../inputs/TextareaInput'

type RestrictionBlockProps = {
  infoHolder: TProjectDTO
  setInfo: React.Dispatch<React.SetStateAction<TProjectDTO>>
  changes: { [key: string]: any }
  setChanges: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>
}
function RestrictionBlock({ infoHolder, setInfo, changes, setChanges }: RestrictionBlockProps) {
  return (
    <div className="flex w-full flex-col gap-2 rounded-md border border-gray-500 pb-2 shadow-lg">
      <div className="mb-2 flex w-full items-center justify-center gap-1 rounded-tr-md rounded-tl-md bg-gray-500 py-2 text-center font-bold text-white">
        <FaLock />
        <h1>RESTRIÇÃO DE PROJETO</h1>
      </div>
      <div className="w-fit self-center">
        <CheckboxInput
          labelFalse="RESTRINGIR PROJETO"
          labelTrue="RESTRINGIR PROJETO"
          checked={!!infoHolder.restricao?.aplicavel}
          handleChange={(value) => {
            setInfo((prev) => ({ ...prev, restricao: { ...(prev.restricao || {}), aplicavel: value } }))
            setChanges((prev) => ({ ...prev, 'restricao.aplicavel': value }))
          }}
        />
      </div>
      <TextareaInput
        label="OBSERVAÇÕES SOBRE A RESTRIÇÃO"
        placeholder="Preencha aqui observações, justificativas e afins sobre a restrição..."
        value={infoHolder.restricao?.observacoes || ''}
        handleChange={(value) => {
          setInfo((prev) => ({ ...prev, restricao: { ...(prev.restricao || {}), observacoes: value } }))
          setChanges((prev) => ({ ...prev, 'restricao.observacoes': value }))
        }}
      />
    </div>
  )
}

export default RestrictionBlock
