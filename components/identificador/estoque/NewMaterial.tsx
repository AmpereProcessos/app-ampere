import NumberInput from '@/components/inputs/Number'
import SelectInput from '@/components/inputs/Select'
import TextInput from '@/components/inputs/Text'
import { useMutationWithFeedback } from '@/utils/methods/mutation/general-hook'
import { createMaterial } from '@/utils/methods/mutation/materials'
import { TMaterial } from '@/utils/schemas/materials'
import { units } from '@/utils/select-options'
import React, { useState } from 'react'
import { VscChromeClose } from 'react-icons/vsc'
import { useQueryClient } from '@tanstack/react-query'

type NewMaterialProps = {
  closeModal: () => void
}
function NewMaterial({ closeModal }: NewMaterialProps) {
  const queryClient = useQueryClient()
  const [infoHolder, setInfoHolder] = useState<TMaterial>({ nome: '', nomeTecnico: '', preco: 0, qtde: 0, dataInsercao: new Date().toISOString() })
  const { mutate: handleMaterialCreation, isPending } = useMutationWithFeedback({
    mutationKey: ['create-material'],
    mutationFn: createMaterial,
    queryClient: queryClient,
    affectedQueryKey: ['materials'],
    callbackFn: () => console.log(),
  })
  return (
    <div id="new-warehouse-form" className="fixed bottom-0 left-0 right-0 top-0 z-[100] bg-[rgba(0,0,0,.85)]">
      <div className="fixed left-[50%] top-[50%] z-[100] h-[90%] w-[90%]  translate-x-[-50%] translate-y-[-50%] rounded-md bg-[#fff] p-[10px] lg:h-[60%] lg:w-[60%]">
        <div className="flex h-full flex-col">
          <div className="flex flex-col items-center justify-between border-b border-gray-200 px-2 pb-2 text-lg lg:flex-row">
            <div className="flex flex-col">
              <h3 className="text-xl font-bold text-[#353432] dark:text-white ">NOVO MATERIAL</h3>
            </div>
            <button
              onClick={() => closeModal()}
              type="button"
              className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
            >
              <VscChromeClose style={{ color: 'red' }} />
            </button>
          </div>
          <div className="flex grow flex-col gap-y-2 overflow-y-auto overscroll-y-auto px-2 py-1 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
            <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
              <div className="w-full lg:w-1/2">
                <TextInput
                  label={'NOME DO MATERIAL'}
                  value={infoHolder.nome}
                  handleChange={(value) => setInfoHolder((prev) => ({ ...prev, nome: value }))}
                  placeholder="Preencha o nome do material..."
                  width="100%"
                />
              </div>
              <div className="w-full lg:w-1/2">
                <TextInput
                  label={'NOME TÉCNICO DO MATERIAL'}
                  value={infoHolder.nomeTecnico || ''}
                  handleChange={(value) => setInfoHolder((prev) => ({ ...prev, nomeTecnico: value }))}
                  placeholder="Preencha o nome técnico do material..."
                  width="100%"
                />
              </div>
            </div>
            <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
              <div className="w-full lg:w-1/2">
                <NumberInput
                  label={'PREÇO UNITÁRIO DO ITEM'}
                  value={infoHolder.preco}
                  handleChange={(value) => setInfoHolder((prev) => ({ ...prev, preco: value }))}
                  placeholder="Preencha o preço unitário do material..."
                  width="100%"
                />
              </div>
              <div className="w-full lg:w-1/2">
                <NumberInput
                  label={'QUANTIDADE DO ITEM'}
                  value={infoHolder.qtde}
                  handleChange={(value) => setInfoHolder((prev) => ({ ...prev, qtde: value }))}
                  placeholder="Preencha o preço unitário do material..."
                  width="100%"
                />
              </div>
            </div>
            <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
              <div className="w-full lg:w-1/2">
                <SelectInput
                  label={'GRANDEZA'}
                  value={infoHolder.grandeza}
                  options={units}
                  handleChange={(value) => setInfoHolder((prev) => ({ ...prev, grandeza: value }))}
                  selectedItemLabel="NÃO DEFINIDO"
                  onReset={() => setInfoHolder((prev) => ({ ...prev, grandeza: null }))}
                  width="100%"
                />
              </div>
              <div className="w-full lg:w-1/2">
                <TextInput
                  label={'LOCALIZAÇÃO DO MATERIAL'}
                  value={infoHolder.localizacao || ''}
                  handleChange={(value) => setInfoHolder((prev) => ({ ...prev, localizacao: value }))}
                  placeholder="Preencha a localização do material..."
                  width="100%"
                />
              </div>
            </div>
            <h1 className="my-2 w-full text-center text-sm leading-none tracking-tight">INFORMAÇÕES DE CONTROLE DE QUANTIDADE</h1>
            <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
              <div className="w-full lg:w-1/2">
                <NumberInput
                  label={'QUANTIDADE MÁXIMA'}
                  value={infoHolder.qtdeMaxima || null}
                  handleChange={(value) => setInfoHolder((prev) => ({ ...prev, qtdeMaxima: value }))}
                  placeholder="Preencha a quantidade máxima do material..."
                  width="100%"
                />
              </div>
              <div className="w-full lg:w-1/2">
                <NumberInput
                  label={'QUANTIDADE MÍNIMA'}
                  value={infoHolder.qtdeMinima || null}
                  handleChange={(value) => setInfoHolder((prev) => ({ ...prev, qtdeMinima: value }))}
                  placeholder="Preencha a quantidade mínima do material..."
                  width="100%"
                />
              </div>
            </div>
          </div>
          <div className="my-1 flex w-full items-center justify-end">
            <button
              disabled={isPending}
              // @ts-ignore
              onClick={() => handleMaterialCreation({ info: infoHolder })}
              className="rounded bg-black py-1 px-4 text-xs font-medium text-white duration-300 ease-in-out disabled:bg-gray-500 enabled:hover:bg-gray-700"
            >
              CRIAR MATERIAL
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewMaterial
