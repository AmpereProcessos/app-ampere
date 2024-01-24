import NumberInput from '@/components/inputs/Number'
import SelectVirtualizedInput from '@/components/inputs/SelectVirtualized'
import { useMaterials } from '@/utils/methods/query/materials'
import { TNewWarehouseFormulary } from '@/utils/schemas/warehouse-formularies'
import React, { useState } from 'react'
import MaterialItem from './MaterialItem'
import MaterialListItem from './MaterialListItem'

type MaterialsBlockProps = {
  formHolder: TNewWarehouseFormulary
  setFormHolder: React.Dispatch<React.SetStateAction<TNewWarehouseFormulary>>
}
function MaterialsBlock({ formHolder, setFormHolder }: MaterialsBlockProps) {
  const { data: materials, isLoading: materialsLoading, isFetching: materialsFetching } = useMaterials()
  const [materialHolder, setMaterialHolder] = useState<{ id: string | null; qtde: number | null }>({ id: null, qtde: null })
  function addMaterial({ id, qtde }: { id: string; qtde: number }) {
    const equivalent = materials?.find((client) => client._id == id)
    if (!equivalent) return
    const { nome, preco, grandeza } = equivalent
    const materialsList = [...formHolder.materiais]
    materialsList.push({ id, nome, preco, grandeza: grandeza || 'UN', qtdeRetirada: qtde, qtdeDevolucao: 0 })
    setFormHolder((prev) => ({ ...prev, materiais: materialsList }))
  }
  return (
    <div className="flex w-full flex-col">
      <h1 className="mb-2 w-full rounded-md bg-[#15599a] p-2 text-center font-bold text-white">MATERIAIS</h1>
      <div className="flex w-full items-center gap-2">
        <div className="w-full lg:w-3/4">
          <SelectVirtualizedInput
            label="MATERIAL"
            options={
              materials?.map((material) => ({
                id: material._id,
                label: `${material.nome} (${material.qtde} ${material.grandeza || 'UN'} restantes)`,
                value: material._id,
              })) || []
            }
            value={materialHolder.id}
            handleChange={(value) => {
              setMaterialHolder((prev) => ({ ...prev, id: value }))
            }}
            selectedItemLabel="NÃO DEFINIDO"
            onReset={() => setMaterialHolder((prev) => ({ ...prev, id: null, qtde: null }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <NumberInput
            label="QUANTIDADE"
            placeholder="Preencha aqui a quantidade de saída..."
            value={materialHolder.qtde}
            handleChange={(value) => setMaterialHolder((prev) => ({ ...prev, qtde: value }))}
            width="100%"
          />
        </div>
      </div>
      <div className="my-1 flex w-full items-center justify-end">
        <button
          onClick={() => {
            // @ts-ignore
            addMaterial({ id: materialHolder.id, qtde: materialHolder.qtde })
          }}
          className="rounded bg-black py-1 px-4 text-xs font-medium text-white duration-300 ease-in-out disabled:bg-gray-500 enabled:hover:bg-gray-700"
        >
          ADICIONAR MATERIAL
        </button>
      </div>
      {formHolder.materiais.length > 0 ? (
        <div className="flex w-full flex-col gap-1">
          <div className="flex w-full items-center bg-gray-800">
            <h1 className="w-[30%]"></h1>
            <h1 className="w-[20%]"></h1>
            <h1 className="w-[20%]"></h1>
          </div>
          {formHolder.materiais.map((material, index) => (
            <MaterialListItem key={index} material={material} index={index} removeMaterial={() => console.log()} />
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default MaterialsBlock
