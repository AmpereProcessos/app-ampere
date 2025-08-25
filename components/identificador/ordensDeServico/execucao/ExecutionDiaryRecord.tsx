import DatetimeInput from '@/components/inputs/Datetime'

import { formatDateAsLocale } from '@/utils/methods/formatting'
import { useMutationWithFeedback } from '@/utils/methods/mutation/general-hook'
import { updateServiceOrder } from '@/utils/methods/mutation/service-orders'
import { formatDateInputChange } from '@/utils/methods/shared'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { AiFillDelete } from 'react-icons/ai'
import { RxTimer } from 'react-icons/rx'
import { useQueryClient } from '@tanstack/react-query'

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
        changes: { 'periodo.historico': historyCopy },
        id: orderId,
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
        changes: { 'periodo.historico': historyCopy },
        id: orderId,
      })
      toast.dismiss(loadingToastId)
      toast.success('Registro excluído com sucesso !')
    } catch (error) {
      toast.dismiss(loadingToastId)
      return toast.error('Houve um erro na atualização do registro.')
    }
  }
  return (
    <div className="border-primary/20 flex w-full flex-col rounded-md border p-3 shadow-xs">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <RxTimer />
          <p className="text-sm leading-none font-thin tracking-tight lg:text-base">
            <strong className="font-bold text-[#fead41]">{formatDateAsLocale(item.entrada, true)}</strong> até às{' '}
            <strong className="font-bold text-[#fead41]">{item.saida ? formatDateAsLocale(item.saida, true) : '?'}</strong>
          </p>
        </div>
        <button onClick={() => handleRecordDelete(itemIndex)} className="text-red-400 duration-300 ease-in-out hover:text-red-500">
          <AiFillDelete />
        </button>
      </div>

      {!item.saida ? (
        <div className="mt-4 flex w-full flex-col lg:mt-2">
          <h1 className="font-sans leading-none font-bold tracking-tight text-[#353432]">ANOTAÇÕES</h1>
          <textarea
            value={infoHolder.anotacoes}
            placeholder="Preencha aqui anotações sobre o período de execução..."
            onChange={(e) => setInfoHolder((prev) => ({ ...prev, anotacoes: e.target.value }))}
            className="border-primary/20 bg-primary/20 text-primary/80 mt-2 min-h-[50px] w-full resize-none rounded border p-3 text-center text-sm shadow-xs outline-hidden"
          />
        </div>
      ) : (
        <h1 className="text-primary/60 bg-primary/20 my-1 w-full rounded-md py-3 text-center text-sm leading-none tracking-tight">
          {item.anotacoes}
        </h1>
      )}

      {!item.saida ? (
        <div className="mt-2 flex w-full flex-col items-center justify-end gap-2 lg:flex-row lg:items-end">
          <DatetimeInput
            label="CHECK-OUT"
            labelClassName="text-xs font-sans font-bold  text-[#353432]"
            value={infoHolder.saida}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, saida: formatDateInputChange(value) }))}
          />

          <button
            onClick={() => handleRecordUpdate()}
            className="hover:bg-primary/70 mb-2 rounded bg-black px-4 py-2 text-xs font-medium text-white duration-300 ease-in-out"
          >
            REALIZAR CHECK-OUT
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default ExecutionDiaryRecord
