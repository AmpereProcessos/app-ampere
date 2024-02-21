import NumberInput from '@/components/inputs/Number'
import { isEmpty } from '@/utils/methods/shared'
import { TNewWarehouseFormulary, TWarehouseFormularyDTO } from '@/utils/schemas/warehouse-formularies'
import React from 'react'
import toast from 'react-hot-toast'
import { BsCode } from 'react-icons/bs'
import { MdDelete } from 'react-icons/md'
import { TbRulerMeasure } from 'react-icons/tb'

type MaterialListItem = {
  material: TNewWarehouseFormulary['materiais'][number]
  index: number
  removeMaterial: ({ id, index }: { id?: string | null; index: number }) => void
  formHolder: TNewWarehouseFormulary
  setFormHolder: React.Dispatch<React.SetStateAction<TNewWarehouseFormulary>>
  blockTakeAway: boolean
  blockDevolution: boolean
}
function MaterialListItem({ material, index, removeMaterial, formHolder, setFormHolder, blockTakeAway, blockDevolution }: MaterialListItem) {
  const isFormularyFinished = !!formHolder.dataEfetivacao
  return (
    <div className="flex w-full flex-col items-center justify-between gap-1 rounded border border-gray-300 p-2 lg:flex-row">
      <div className="flex w-full flex-row gap-1 lg:w-[40%] lg:flex-col lg:gap-0">
        <h1 className="text-sm font-medium text-gray-500">{material.nome}</h1>
        <div className="flex items-center gap-1">
          <TbRulerMeasure />
          <p className="text-xs italic text-gray-500">{material.grandeza}</p>
          <BsCode />
          <p className="text-xs italic text-gray-500">#{material.id || 'NÃO DEFIDO'}</p>
          {!isFormularyFinished ? (
            <button
              onClick={() => removeMaterial({ id: material.id, index })}
              className="rounded-lg border border-red-500 bg-red-100 p-1 text-center text-xxs font-medium text-red-500"
            >
              EXCLUIR
            </button>
          ) : null}
        </div>
      </div>
      <div className="flex w-full items-center gap-1 lg:w-[60%]">
        <div className="w-[50%]">
          <input
            disabled={blockTakeAway || isFormularyFinished}
            value={!isEmpty(material.qtdeRetirada) ? material.qtdeRetirada?.toString() : ''}
            onChange={(e) => {
              const value = Number(e.target.value)
              const materialsList = [...formHolder.materiais]
              materialsList[index].qtdeRetirada = value
              setFormHolder((prev) => ({ ...prev, materiais: materialsList }))
            }}
            min={0}
            id={'qtdeRetirada'}
            type="number"
            className="h-full w-full rounded-md border border-gray-200 bg-gray-100 p-3 text-xs outline-none placeholder:italic disabled:bg-gray-400"
          />
        </div>
        <div className="w-[50%]">
          <input
            disabled={blockDevolution || isFormularyFinished}
            value={!isEmpty(material.qtdeDevolucao) ? material.qtdeDevolucao?.toString() : ''}
            onChange={(e) => {
              const value = Number(e.target.value)
              const materialsList = [...formHolder.materiais]

              // Checking for the case where user puts a devolution value higher than the takeway
              if (value > materialsList[index].qtdeRetirada) {
                toast.error('Quantidade de devolução não pode exceder a de retirada.')
                // Setting the devolution to the max value, which is the taken away qty
                materialsList[index].qtdeDevolucao = materialsList[index].qtdeRetirada
              } else {
                materialsList[index].qtdeDevolucao = value
              }

              setFormHolder((prev) => ({ ...prev, materiais: materialsList }))
            }}
            min={0}
            id={'qtdeDevolucao'}
            type="number"
            className="h-full w-full rounded-md border border-gray-200 bg-gray-100 p-3 text-xs outline-none placeholder:italic disabled:bg-gray-400"
          />
        </div>
      </div>
    </div>
  )
}

export default MaterialListItem
