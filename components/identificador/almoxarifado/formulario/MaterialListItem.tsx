import NumberInput from '@/components/inputs/Number'
import { TNewWarehouseFormulary, TWarehouseFormularyDTO } from '@/utils/schemas/warehouse-formularies'
import React from 'react'
import { MdDelete } from 'react-icons/md'
import { TbRulerMeasure } from 'react-icons/tb'

type MaterialListItem = {
  material: TNewWarehouseFormulary['materiais'][number]
  index: number
  removeMaterial: (index: number) => void
}
function MaterialListItem({ material, index, removeMaterial }: MaterialListItem) {
  return (
    <div className="flex w-full items-center justify-between rounded border border-gray-300 p-2">
      <div className="flex flex-col">
        <h1 className="text-sm font-medium text-gray-500">{material.nome}</h1>
        <div className="flex items-center gap-1">
          <TbRulerMeasure />
          <p className="text-xs italic text-gray-500">{material.grandeza}</p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <div className="grow">
          <NumberInput
            label="QTDE DE SAÍDA"
            placeholder="Preencha a quantidade de saída..."
            value={material.qtdeRetirada}
            handleChange={(value) => console.log(value)}
            width="100%"
          />
        </div>
        <div className="grow">
          <NumberInput
            label="QTDE DE DEVOLUÇÃO"
            placeholder="Preencha a quantidade de devolução..."
            value={material.qtdeDevolucao}
            handleChange={(value) => console.log(value)}
            width="100%"
          />
        </div>
      </div>
      <div className="flex items-center justify-center">
        <button
          onClick={() => removeMaterial(index)}
          type="button"
          className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
        >
          <MdDelete style={{ color: 'red' }} />
        </button>
      </div>
    </div>
  )
}

export default MaterialListItem
