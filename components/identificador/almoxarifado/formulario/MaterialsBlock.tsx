import NumberInput from '@/components/inputs/Number'
import SelectVirtualizedInput from '@/components/inputs/SelectVirtualized'
import { useMaterials } from '@/utils/methods/query/materials'
import { TNewWarehouseFormulary } from '@/utils/schemas/warehouse-formularies'
import React, { useState } from 'react'
import MaterialListItem from './MaterialListItem'
import toast from 'react-hot-toast'
import { updateManyMaterials } from '@/utils/methods/mutation/materials'
import { updateWarehouseFormulary } from '@/utils/methods/mutation/warehouse-forms'
import { useQueryClient } from '@tanstack/react-query'

type MaterialsBlockProps = {
  formularyId?: string
  formHolder: TNewWarehouseFormulary
  setFormHolder: React.Dispatch<React.SetStateAction<TNewWarehouseFormulary>>
  blockTakeAway?: boolean
  blockDevolution?: boolean
  allowPostFinishEditing?: boolean
}
function MaterialsBlock({
  formularyId,
  formHolder,
  setFormHolder,
  blockTakeAway = false,
  blockDevolution = true,
  allowPostFinishEditing = false,
}: MaterialsBlockProps) {
  const queryClient = useQueryClient()
  const { data: materials, isLoading: materialsLoading, isFetching: materialsFetching } = useMaterials()
  const [materialHolder, setMaterialHolder] = useState<{ id: string | null; qtde: number | null }>({ id: null, qtde: null })
  async function addMaterial({ id, qtde }: { id: string; qtde: number }) {
    // Checking for positive numbers only
    if (qtde <= 0) return toast.error('Por favor, preencha uma quantidade válida de retirada.')
    // Getting the equivalent material based on the id selected
    const equivalent = materials?.find((client) => client._id == id)
    if (!equivalent) return
    const { nome, preco, grandeza, qtde: currentQty } = equivalent
    // Validating if choosen qty exceeds the qty in stock
    if (qtde > currentQty) return toast.error(`Quantidade excede o estoque atual contabilizado de ${currentQty}`)

    // If validations were passed, handling the addition of the material to list

    const materialsList = [...formHolder.materiais]
    // Validating existence of material in the list already
    const materialInList = materialsList.find((mat) => mat.id == id)
    const materialInListIndex = materialsList.findIndex((obj) => !!obj.id && obj.id == id)
    // In case it isnt in the list, pushing it to the list holder
    if (!materialInList) materialsList.push({ id, nome, preco, grandeza: grandeza || 'UN', qtdeRetirada: qtde, qtdeDevolucao: 0 })

    // Checking if qty in the list plus additional qty surpasses the qty in stock
    if (!!materialInList && materialInList.qtdeRetirada + qtde > currentQty)
      return toast.error(`Quantidade adicional excede o estoque atual contabilizado de ${currentQty}`)
    if (materialInListIndex != -1) materialsList[materialInListIndex].qtdeRetirada += qtde

    // In case formulary isnt created yet, just updating materials list array
    if (!formularyId) return setFormHolder((prev) => ({ ...prev, materiais: materialsList }))

    // Else, calling method for stock quantities update
    const loadingToastId = toast.loading('Atualizando quantidades no estoque...')
    const project = formHolder.projeto
    const updates = [{ id: id, nome: nome, diferenca: -qtde }]

    const updateFormularyResponse = await updateWarehouseFormulary({ id: formularyId, changes: { materiais: materialsList } })
    const updateResponse = await updateManyMaterials({ formularyId, project, updates })

    // Invalidating materials query for up to date quantities after updates
    await queryClient.cancelQueries({ queryKey: ['materials'] })
    await queryClient.invalidateQueries({ queryKey: ['materials'] })
    toast.dismiss(loadingToastId)
    toast.success(updateResponse)
    return setFormHolder((prev) => ({ ...prev, materiais: materialsList }))
  }
  async function removeMaterial({ id, index }: { id?: string | null; index: number }) {
    // Getting current list of materials in the holder
    const materialsList = [...formHolder.materiais]
    // Getting info from the removed material
    const materialRemoved = { ...materialsList[index] }
    // Removing material in the current list holder
    materialsList.splice(index, 1)

    // In case the formulary is already open, updating both the form object and handling the material qty devolution to stock
    if (id && formularyId) {
      const project = formHolder.projeto

      const materialName = materialRemoved.nome
      const materialQtyReturn = materialRemoved.qtdeRetirada
      const updates = [{ id: id, nome: materialName, diferenca: materialQtyReturn }]
      const loadingToastId = toast.loading('Devolvendo quantidades ao estoque...')
      // Calling method for formulary update in database
      const updateFormularyResponse = await updateWarehouseFormulary({ id: formularyId, changes: { materiais: materialsList } })
      // Calling method for material devolution process
      const updateResponse = await updateManyMaterials({ formularyId, project, updates })
      toast.dismiss(loadingToastId)
      toast.success(updateResponse)

      // Invalidating materials query for up to date quantities after updates
      await queryClient.cancelQueries({ queryKey: ['materials'] })
      await queryClient.invalidateQueries({ queryKey: ['materials'] })
    }

    return setFormHolder((prev) => ({ ...prev, materiais: materialsList }))
  }

  const isFormularyFinished = !!formHolder.dataEfetivacao
  return (
    <div className="flex w-full flex-col">
      <h1 className="mb-2 w-full rounded-md bg-[#15599a] p-1 text-center text-sm font-bold text-white">MATERIAIS</h1>
      {!isFormularyFinished ? (
        <>
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
        </>
      ) : null}

      {formHolder.materiais.length > 0 ? (
        <div className="flex w-full flex-col gap-1">
          <div className="flex w-full items-center gap-1 bg-gray-800">
            <h1 className="w-[40%] text-center font-bold text-white">MATERIAL</h1>
            <h1 className="w-[30%] text-center font-bold text-white">RETIRADO</h1>
            <h1 className="w-[30%] text-center font-bold text-white">DEVOLVIDO</h1>
          </div>
          {formHolder.materiais.map((material, index) => (
            <MaterialListItem
              key={index}
              formularyId={formularyId}
              allowPostFinishEditing={allowPostFinishEditing}
              material={material}
              index={index}
              removeMaterial={({ id, index }) => removeMaterial({ id, index })}
              formHolder={formHolder}
              setFormHolder={setFormHolder}
              blockTakeAway={blockTakeAway}
              blockDevolution={blockDevolution}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default MaterialsBlock
