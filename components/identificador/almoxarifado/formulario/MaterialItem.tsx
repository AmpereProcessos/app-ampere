import { TMaterialDTO } from '@/utils/schemas/materials'
import { TWarehouseFormularyDTO } from '@/utils/schemas/warehouse-formularies'
import React, { useState } from 'react'
import { VscChromeClose } from 'react-icons/vsc'

type MaterialItemProps = {
  material: TWarehouseFormularyDTO['materiais'][number]
  index: number
  formHolder: TWarehouseFormularyDTO
  setFormHolder: React.Dispatch<React.SetStateAction<TWarehouseFormularyDTO>>
  removeItem: (material: TWarehouseFormularyDTO['materiais'][number], index: number) => void
}
function MaterialItem({ material, formHolder, setFormHolder, index, removeItem }: MaterialItemProps) {
  const [message, setMessage] = useState('')
  return (
    <div className="flex w-full flex-col">
      <div className="grid grid-cols-9 items-center gap-3">
        <p className="col-span-4 list-none text-center font-bold text-gray-600">{material.nome}</p>
        <input
          type={'number'}
          disabled={true}
          className="col-span-2 border border-gray-200 p-1 text-center outline-none"
          value={material.qtdeSaida ? material.qtdeSaida : undefined}
          onChange={(e) => {
            let infoMaterial = formHolder.materiais
            infoMaterial[index].qtdeSaida = Number(e.target.value)
            setFormHolder({
              ...formHolder,
              materiais: infoMaterial,
            })
          }}
        />
        <input
          type={'number'}
          disabled={!!formHolder.efetivado}
          className="col-span-2 border border-gray-200 p-1 text-center outline-none"
          value={material.qtdeDevolucao ? material.qtdeDevolucao : undefined}
          onChange={(e) => {
            let infoMaterial = formHolder.materiais
            console.log(e)
            if (Number(e.target.value) > (infoMaterial[index].qtdeSaida || 0)) {
              setMessage('Número de devolução incompatível')
              infoMaterial[index].qtdeDevolucao = infoMaterial[index].qtdeSaida
              infoMaterial[index].diff = (infoMaterial[index].qtdeSaida || 0) - Number(e.target.value)

              setFormHolder({
                ...formHolder,
                materiais: infoMaterial,
              })
            } else if (Number(e.target.value) < 0) {
              infoMaterial[index].qtdeDevolucao = Math.abs(Number(e.target.value))
              infoMaterial[index].diff = (infoMaterial[index].qtdeSaida || 0) - Math.abs(Number(e.target.value))
              setFormHolder({
                ...formHolder,
                materiais: infoMaterial,
              })
            } else {
              setMessage('')
              infoMaterial[index].qtdeDevolucao = Number(e.target.value)
              infoMaterial[index].diff = (infoMaterial[index].qtdeSaida || 0) - Number(e.target.value)
              setFormHolder({
                ...formHolder,
                materiais: infoMaterial,
              })
            }
          }}
        />
        {formHolder.efetivado != true && (
          <div className="flex justify-center">
            <button
              className="col-span-1 self-center"
              onClick={() => {
                removeItem(material, index)
              }}
            >
              <VscChromeClose style={{ color: 'red', fontSize: '15px' }} />
            </button>
          </div>
        )}
      </div>
      {message && <p className="text-center italic text-red-500">{message}</p>}
    </div>
  )
}

export default MaterialItem
