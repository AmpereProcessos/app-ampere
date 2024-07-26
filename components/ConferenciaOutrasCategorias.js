import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { getErrorMessage } from '../utils/methods/handlers'
import { destroyCookie } from 'nookies'
import { updateServiceOrder } from '../utils/methods/mutation/serviceOrders'
import { useQueryClient } from 'react-query'

function ConferenciaOutrasCategorias({ order, closeModal, queryKey }) {
  const [finishInProgress, setFinishInProgress] = useState(false)
  const queryClient = useQueryClient()
  async function finishOS() {
    const loadingToastId = toast.loading('Processando...')
    setFinishInProgress(true)
    try {
      const currentDateTime = new Date().toISOString()
      await updateServiceOrder({
        info: { dataEfetivacao: currentDateTime },
        invalidateKey: queryKey,
        orderId: order._id,
        queryClient: queryClient,
      })
      toast.dismiss(loadingToastId)
      toast.success('Ordem de Serviço finalizada com sucesso !')
      destroyCookie(null, `STAGE-${order._id}`)
      closeModal()
    } catch (error) {
      toast.dismiss(loadingToastId)
      const msg = getErrorMessage(error)
      toast.error(msg)
      setFinishInProgress(false)
    }
  }
  return (
    <div className="my-2 mt-6 flex items-center justify-center">
      <button
        disabled={finishInProgress}
        onClick={finishOS}
        className="rounded border border-[#15599a] p-2 font-bold text-[#15599a] duration-500 ease-in-out disabled:bg-gray-500 disabled:text-white disabled:opacity-70 hover:scale-105 hover:bg-[#15599a] hover:text-white"
      >
        FINALIZAR OS
      </button>
    </div>
  )
}

export default ConferenciaOutrasCategorias
