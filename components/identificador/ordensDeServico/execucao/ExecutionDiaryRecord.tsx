import DatetimeInput from '@/components/inputs/Datetime'

import { formatDateAsLocale } from '@/utils/methods/formatting'
import { useMutationWithFeedback } from '@/utils/methods/mutation/general-hook'
import { updateServiceOrder } from '@/utils/methods/mutation/serviceOrders'
import { formatDateInputChange } from '@/utils/methods/shared'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { AiFillDelete } from 'react-icons/ai'
import { RxTimer } from 'react-icons/rx'
import { useQueryClient } from 'react-query'

type ExecutionDiaryRecordProps = {
  orderId: string
  history: {
    entrada: string
    saida?: string | undefined
    anotacoes: string
  }[]
  item: {
    entrada: string
    saida?: string | undefined
    anotacoes: string
  }
  itemIndex: number
}
function ExecutionDiaryRecord({ orderId, item, itemIndex, history }: ExecutionDiaryRecordProps) {
  const queryClient = useQueryClient()
  const [infoHolder, setInfoHolder] = useState<ExecutionDiaryRecordProps['item']>(item)

  async function handleRecordUpdate() {
    if (!infoHolder.saida) return toast.error('Preencha uma data de check-out.')
    if (infoHolder.anotacoes.trim().length < 5) return toast.error('Preencha anotações para o registro de execução.')
    if (new Date(infoHolder.saida) < new Date(infoHolder.entrada)) return toast.error('Horário de check-out não pode ser anterior ao de check-in.')

    const loadingToastId = toast.loading('Atualizando o registro...')

    try {
      const historyCopy = [...history]
      historyCopy[itemIndex] = infoHolder
      await updateServiceOrder({
        orderId: orderId,
        info: { 'periodo.historico': historyCopy },
        queryClient: queryClient,
        invalidateKey: ['service-order', orderId],
      })
      toast.dismiss(loadingToastId)
      toast.success('Registro atualizado com sucesso !')
    } catch (error) {
      toast.dismiss(loadingToastId)
      return toast.error('Houve um erro na atualização do registro.')
    }
  }
  async function handleRecordDelete(index: number) {
    const historyCopy = [...history]
    historyCopy.splice(index, 1)
    const loadingToastId = toast.loading('Processando...')
    try {
      await updateServiceOrder({
        orderId: orderId,
        info: { 'periodo.historico': historyCopy },
        queryClient: queryClient,
        invalidateKey: ['service-order', orderId],
      })
      toast.dismiss(loadingToastId)
      toast.success('Registro excluído com sucesso !')
    } catch (error) {
      toast.dismiss(loadingToastId)
      return toast.error('Houve um erro na atualização do registro.')
    }
  }
  return (
    <div className="flex flex-col w-full p-3 rounded-md shadow-sm border border-gray-300">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RxTimer />
          <p className="font-thin tracking-tight leading-none text-sm lg:text-base">
            <strong className="text-[#fead41] font-bold">{formatDateAsLocale(item.entrada, true)}</strong> até às{' '}
            <strong className="text-[#fead41] font-bold">{item.saida ? formatDateAsLocale(item.saida, true) : '?'}</strong>
          </p>
        </div>
        <button onClick={() => handleRecordDelete(itemIndex)} className="text-red-400 hover:text-red-500 duration-300 ease-in-out">
          <AiFillDelete />
        </button>
      </div>

      {!item.saida ? (
        <div className="flex flex-col w-full lg:mt-2 mt-4">
          <h1 className="font-sans font-bold tracking-tight leading-none text-[#353432]">ANOTAÇÕES</h1>
          <textarea
            value={infoHolder.anotacoes}
            placeholder="Preencha aqui anotações sobre o período de execução..."
            onChange={(e) => setInfoHolder((prev) => ({ ...prev, anotacoes: e.target.value }))}
            className="min-h-[50px] p-3 w-full resize-none outline-none text-center text-sm text-gray-800 bg-gray-100 rounded border border-gray-300 shadow-sm mt-2"
          />
        </div>
      ) : (
        <h1 className="my-1 w-full py-3 bg-gray-100 text-center text-gray-500 text-sm rounded-md tracking-tight leading-none">{item.anotacoes}</h1>
      )}

      {!item.saida ? (
        <div className="w-full flex flex-col lg:flex-row items-center lg:items-end justify-end gap-2 mt-2">
          <DatetimeInput
            label="CHECK-OUT"
            labelClassName="text-xs font-sans font-bold  text-[#353432]"
            value={infoHolder.saida}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, saida: formatDateInputChange(value) }))}
          />
          <button
            onClick={() => handleRecordUpdate()}
            className="py-2 px-4 bg-black rounded text-xs text-white font-medium hover:bg-gray-700 duration-300 ease-in-out mb-2"
          >
            REALIZAR CHECK-OUT
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default ExecutionDiaryRecord
