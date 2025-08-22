import ResponsibleModalWrapperWithMutation from '@/components/utils/ResponsibleModalWithMutation'
import { usePosVendaCallStore } from '@/utils/state/pos-venda-call'
import type { TAuthSession } from '@/lib/authentication/types'
import PosVendaCallData from './PosVendaCallData'
import { useMutationWithFeedback } from '@/utils/methods/mutation/general-hook'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPosVendaCall } from '@/utils/methods/mutation/pos-venda-calls'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/utils/methods/handlers'
import { useEffect } from 'react'

type NewPosVendaCallProps = {
  session: TAuthSession
  closeModal: () => void
  callbacks?: {
    onMutate?: () => void
    onSuccess?: () => void
    onSettled?: () => void
  }
}

export default function NewPosVendaCall({ session, closeModal, callbacks }: NewPosVendaCallProps) {
  const queryClient = useQueryClient()
  const redefineState = usePosVendaCallStore((state) => state.redefineState)
  const getCurrentState = usePosVendaCallStore((state) => state.getState)
  const reset = usePosVendaCallStore((state) => state.reset)
  const { mutate: handleCreatePosVendaCall, isPending } = useMutation({
    mutationKey: ['create-pos-venda-call'],
    mutationFn: createPosVendaCall,
    onMutate: async () => {
      if (callbacks?.onMutate) callbacks.onMutate()
    },
    onSuccess: async (data) => {
      if (callbacks?.onSuccess) callbacks.onSuccess()
      reset()
      closeModal()
      return toast.success(data.message)
    },
    onSettled: async () => {
      if (callbacks?.onSettled) callbacks.onSettled()
    },
    onError: (error) => {
      const msg = getErrorMessage(error)
      return toast.error(msg)
    },
  })
  useEffect(() => {
    // Cleanup quando o componente for desmontado
    return () => {
      reset()
    }
  }, [])
  return (
    <ResponsibleModalWrapperWithMutation
      title="NOVO CHAMADO"
      description="Crie um novo chamado para o cliente"
      ctaButtonText="CRIAR CHAMADO"
      dialogContentClassName="min-w-[50%]"
      handleSubmit={() => {
        return handleCreatePosVendaCall({
          call: getCurrentState(),
        })
      }}
      isPending={isPending}
      closeModal={closeModal}
    >
      <PosVendaCallData session={session} />
    </ResponsibleModalWrapperWithMutation>
  )
}
