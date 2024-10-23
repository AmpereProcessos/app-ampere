import NumberInput from '@/components/inputs/Number'
import { useMutationWithFeedback } from '@/utils/methods/mutation/general-hook'
import { updateManyMaterials } from '@/utils/methods/mutation/materials'
import { updateWarehouseFormulary } from '@/utils/methods/mutation/warehouse-forms'
import { isEmpty } from '@/utils/methods/shared'
import { TNewWarehouseFormulary, TWarehouseFormularyDTO } from '@/utils/schemas/warehouse-formularies'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { BsCode } from 'react-icons/bs'
import { MdDelete } from 'react-icons/md'
import { TbRulerMeasure } from 'react-icons/tb'
import { useQueryClient } from '@tanstack/react-query'

type MaterialListItem = {
  formularyId?: string
  material: TNewWarehouseFormulary['materiais'][number]
  index: number
  removeMaterial: ({ id, index }: { id?: string | null; index: number }) => void
  formHolder: TNewWarehouseFormulary
  setFormHolder: React.Dispatch<React.SetStateAction<TNewWarehouseFormulary>>
  blockTakeAway: boolean
  blockDevolution: boolean
  allowPostFinishEditing?: boolean
}
function MaterialListItem({
  formularyId,
  material,
  index,
  removeMaterial,
  formHolder,
  setFormHolder,
  blockTakeAway,
  blockDevolution,
  allowPostFinishEditing = false,
}: MaterialListItem) {
  const queryClient = useQueryClient()

  const [editMaterialMenuIsOpen, setEditMaterialMenuIsOpen] = useState<boolean>(false)
  const [editMaterialHolder, setEditMaterialHolder] = useState(material)

  async function handleUpdateMaterial(info: TNewWarehouseFormulary['materiais'][number]) {
    try {
      if (!formularyId) return toast.error('Formulário não encontrado')
      if (info.qtdeRetirada < 0) return toast.error('Por favor, insira uma quantidade válida de retirada')
      if (info.qtdeDevolucao > info.qtdeRetirada) return toast.error('Quantidade devolvida não deve ultrapassar a retidada.')

      // Getting the difference for the material take away and devolution in the post finish formulary
      const diffBeforeEditing = material.qtdeRetirada - material.qtdeDevolucao
      // Getting the difference for the information edited
      const diffAfterEditing = info.qtdeRetirada - info.qtdeDevolucao
      // Getting the final difference considering the values defined after editing and the origin values
      const diffFinal = diffAfterEditing - diffBeforeEditing

      const materialsList = [...formHolder.materiais]
      materialsList[index] = info
      const updates = [{ id: material.id as string, nome: material.nome, diferenca: -diffFinal }]
      const project = formHolder.projeto

      const loadingToastId = toast.loading('Processando operação...')
      const updateResponse = await updateManyMaterials({ formularyId, project, updates })
      await updateWarehouseFormulary({ id: formularyId, changes: { materiais: materialsList } })
      toast.dismiss(loadingToastId)
      return updateResponse
    } catch (error) {
      throw error
    }
  }
  const { mutate, isPending } = useMutationWithFeedback({
    mutationKey: ['update-material', formularyId],
    mutationFn: handleUpdateMaterial,
    queryClient: queryClient,
    affectedQueryKey: ['warehouse-form-by-id', formularyId],
  })
  const isFormularyFinished = !!formHolder.dataEfetivacao
  return (
    <div className="flex w-full flex-col">
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
            {isFormularyFinished && allowPostFinishEditing ? (
              <button
                onClick={() => setEditMaterialMenuIsOpen(true)}
                className="rounded-lg border border-orange-500 bg-orange-100 p-1 text-center text-xxs font-medium text-red-500"
              >
                EDITAR
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
      {editMaterialMenuIsOpen ? (
        <div className="mt-1 flex w-full flex-col gap-1">
          <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
            <div className="w-full lg:w-1/2">
              <NumberInput
                label="NOVO RETIRADO"
                placeholder="Preencha a nova quantidade retirada..."
                value={editMaterialHolder.qtdeRetirada}
                handleChange={(value) => setEditMaterialHolder((prev) => ({ ...prev, qtdeRetirada: value }))}
                width="100%"
              />
            </div>
            <div className="w-full lg:w-1/2">
              <NumberInput
                label="NOVO DEVOLVIDO"
                placeholder="Preencha a nova quantidade devolvida..."
                value={editMaterialHolder.qtdeDevolucao}
                handleChange={(value) => {
                  // Checking for the case where user puts a devolution value higher than the takeway
                  if (value > editMaterialHolder.qtdeRetirada) {
                    toast.error('Quantidade de devolução não pode exceder a de retirada.')
                    // Setting the devolution to the max value, which is the taken away qty
                    setEditMaterialHolder((prev) => ({ ...prev, qtdeDevolucao: prev.qtdeRetirada }))
                  } else {
                    setEditMaterialHolder((prev) => ({ ...prev, qtdeDevolucao: value }))
                  }
                }}
                width="100%"
              />
            </div>
          </div>
          <div className="flex w-full items-center justify-end">
            <button
              disabled={isPending}
              // @ts-ignore
              onClick={() => mutate(editMaterialHolder)}
              className="rounded bg-blue-600 py-1 px-4 text-xs font-medium text-white duration-300 ease-in-out disabled:bg-gray-500 enabled:hover:bg-blue-500"
            >
              ATUALIZAR MATERIAL
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default MaterialListItem
