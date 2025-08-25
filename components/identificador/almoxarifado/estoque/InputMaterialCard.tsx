import MultipleSelectInputVirtualized from '@/components/inputs/MultipleSelectInputVirtualized'
import SelectVirtualizedInput from '@/components/inputs/SelectVirtualized'
import { InputMaterialItem } from '@/pages/almoxarifado/estoque/entrada'
import { formatDecimalPlaces, formatToMoney } from '@/utils/constants'
import { useMutationWithFeedback } from '@/utils/methods/mutation/general-hook'
import { inputMaterialUpdate } from '@/utils/methods/mutation/materials'
import { isEmpty } from '@/utils/methods/shared'
import { TMaterialDTO } from '@/utils/schemas/materials'
import React, { useState } from 'react'
import { FaLongArrowAltRight } from 'react-icons/fa'
import { FaBox } from 'react-icons/fa6'
import { ImPriceTag } from 'react-icons/im'
import { useQueryClient } from '@tanstack/react-query'

function getNewPrice({
  previousQty,
  previousPrice,
  inputQty,
  inputPrice,
}: {
  previousQty: number
  previousPrice: number
  inputQty: number
  inputPrice: number
}) {
  // Doing weighted average
  const newPrice = (previousQty * previousPrice + inputQty * inputPrice) / (previousQty + inputQty)
  return Number(newPrice.toFixed(2))
}

type InputMaterialCardProps = {
  inputMaterial: InputMaterialItem
  materials: TMaterialDTO[]
  clearMaterialHolder: () => void
}
function InputMaterialCard({ inputMaterial, materials, clearMaterialHolder }: InputMaterialCardProps) {
  const queryClient = useQueryClient()
  const [infoHolder, setInfoHolder] = useState(inputMaterial)
  const [materialId, setMaterialId] = useState<string | null>(null)

  const vinculationMaterial = materialId ? materials.find((m) => m._id == materialId) : null

  async function handleMaterialInput({
    inputMaterial,
    vinculationMaterial,
  }: {
    inputMaterial: InputMaterialItem
    vinculationMaterial: TMaterialDTO
  }) {
    try {
      const materialId = vinculationMaterial._id
      const qtdeEntrada = inputMaterial.qtde
      const precoEntrada = inputMaterial.preco
      const response = await inputMaterialUpdate({ materialId, changes: { qtdeEntrada, precoEntrada } })
      setMaterialId(null)
      return response
    } catch (error) {
      throw error
    }
  }

  const { mutate: handleUpdate, isPending } = useMutationWithFeedback({
    mutationKey: ['input-update-material', materialId],
    mutationFn: handleMaterialInput,
    queryClient: queryClient,
    affectedQueryKey: ['materials'],
    callbackFn: async () => {
      await queryClient.invalidateQueries({ queryKey: ['materials-logs-by-type', 'ENTRADA'] })
      clearMaterialHolder()
    },
  })
  return (
    <div className="border-primary/60 flex w-full flex-col rounded border p-3 shadow-xs lg:w-[650px]">
      <div className="flex w-full items-center justify-between gap-2">
        <h1 className="grow text-xs leading-none font-black tracking-tight lg:text-sm">{infoHolder.nome}</h1>
        <h2 className="rounded-lg bg-blue-50 px-2 py-1 text-[0.6rem] text-blue-500">#{infoHolder.codigo}</h2>
      </div>

      <h1 className="text-primary/60 my-2 text-[0.65rem] leading-none font-bold tracking-tight lg:text-xs">INFORMAÇÕES IDENTIFICADAS</h1>
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-1">
          <FaBox color="#fead41" />
          <p className="text-primary/60 text-[0.65rem] leading-none font-medium tracking-tight lg:text-xs">
            {formatDecimalPlaces(inputMaterial.qtde)} {inputMaterial.grandeza}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <ImPriceTag color="rgb(34,197,94)" />
          <p className="text-primary/60 text-[0.65rem] leading-none font-medium tracking-tight lg:text-xs">{formatToMoney(inputMaterial.preco)}</p>
        </div>
      </div>
      <h1 className="text-primary/60 my-2 text-[0.65rem] leading-none font-bold tracking-tight lg:text-xs">INFORMAÇÕES DE ENTRADA</h1>
      <SelectVirtualizedInput
        label="MATERIAL DE VINCULAÇÃO"
        value={materialId}
        options={materials.map((mat) => ({ id: mat._id, label: `${mat.codigo ? `(${mat.codigo}) ` : ''}${mat.nome}`, value: mat._id }))}
        handleChange={(value) => setMaterialId(value)}
        selectedItemLabel="NÃO DEFINIDO"
        onReset={() => setMaterialId(null)}
        width="100%"
      />

      <div className="mt-2 flex w-full flex-col items-center gap-2 lg:flex-row">
        <div className={`flex w-full flex-col gap-1 lg:w-1/2`}>
          <label htmlFor={'qty-price'} className={'font-sans text-[0.6rem] font-bold tracking-tight text-[#353432]'}>
            QUANTIDADE DE ENTRADA
          </label>
          <input
            id={'qty-price'}
            value={!isEmpty(infoHolder.qtde) ? infoHolder.qtde?.toString() : ''}
            onChange={(e) => setInfoHolder((prev) => ({ ...prev, qtde: Number(e.target.value) }))}
            name="qty-price"
            type="number"
            className="border-primary/20 text-primary/60 rounded-lg border p-1 text-center text-[0.6rem] tracking-tight shadow-xs outline-hidden placeholder:italic"
          />
        </div>
        <div className={`flex w-full flex-col gap-1 lg:w-1/2`}>
          <label htmlFor={'input-price'} className={'font-sans text-[0.6rem] font-bold tracking-tight text-[#353432]'}>
            PREÇO DE ENTRADA
          </label>
          <input
            id={'input-price'}
            value={!isEmpty(infoHolder.preco) ? infoHolder.preco?.toString() : ''}
            onChange={(e) => setInfoHolder((prev) => ({ ...prev, preco: Number(e.target.value) }))}
            name="input-price"
            type="number"
            className="border-primary/20 text-primary/60 rounded-lg border p-1 text-center text-[0.6rem] tracking-tight shadow-xs outline-hidden placeholder:italic"
          />
        </div>
      </div>
      {vinculationMaterial ? (
        <div className="mt-2 flex flex-col gap-2 rounded border border-green-300 bg-green-100 p-3">
          <h1 className="text-primary/60 text-[0.65rem] leading-none font-bold tracking-tight lg:text-xs">ATUALIZAÇÕES</h1>
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-1">
              <FaBox color="#fead41" />
              <p className="text-primary/60 text-[0.65rem] leading-none font-medium tracking-tight lg:text-xs">
                {formatDecimalPlaces(vinculationMaterial.qtde)} {vinculationMaterial.grandeza}
              </p>
              <FaLongArrowAltRight size={10} />
              <p className="text-primary/60 text-[0.65rem] leading-none font-medium tracking-tight lg:text-xs">
                {formatDecimalPlaces(vinculationMaterial.qtde + infoHolder.qtde)} {vinculationMaterial.grandeza}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <ImPriceTag color="rgb(34,197,94)" />
              <p className="text-primary/60 text-[0.65rem] leading-none font-medium tracking-tight lg:text-xs">
                {formatToMoney(vinculationMaterial.preco)}
              </p>
              <FaLongArrowAltRight size={10} />
              <p className="text-primary/60 text-[0.65rem] leading-none font-medium tracking-tight lg:text-xs">
                {formatToMoney(
                  getNewPrice({
                    previousPrice: vinculationMaterial.preco,
                    previousQty: vinculationMaterial.qtde,
                    inputPrice: infoHolder.preco,
                    inputQty: infoHolder.qtde,
                  })
                )}
              </p>
            </div>
          </div>
          {vinculationMaterial.grandeza && vinculationMaterial.grandeza != infoHolder.grandeza ? (
            <p className="rounded border-orange-500 bg-orange-100 p-1 text-center text-[0.65rem] font-medium tracking-tight text-orange-500">
              Oops, notamos uma divergência nas grandezas. O material atual está em <strong>{vinculationMaterial.grandeza || 'UN'}</strong> , e a
              entrada está em <strong>{infoHolder.grandeza}</strong>. Verifique as informações e, se necessário, faça ajustes de quantidade e preço.
            </p>
          ) : null}
          <div className="mt-2 flex w-full items-center justify-center">
            <button
              disabled={isPending}
              // @ts-ignore
              onClick={() => handleUpdate({ inputMaterial: infoHolder, vinculationMaterial })}
              className="disabled:bg-primary/60 rounded bg-green-500 px-4 py-1 text-xs font-medium text-white duration-300 ease-in-out enabled:hover:bg-green-700"
            >
              ATUALIZAR
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default InputMaterialCard
