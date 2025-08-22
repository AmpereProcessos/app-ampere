import ResponsibleModalWrapperWithMutation from '@/components/utils/ResponsibleModalWithMutation'
import { usePosVendaCallStore } from '@/utils/state/pos-venda-call'
import type { TAuthSession } from '@/lib/authentication/types'
import PosVendaCallData from './PosVendaCallData'
import { useMutationWithFeedback } from '@/utils/methods/mutation/general-hook'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPosVendaCall, updatePosVendaCall } from '@/utils/methods/mutation/pos-venda-calls'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/utils/methods/handlers'
import { useEffect } from 'react'
import { useGetPosVendaCallById } from '@/utils/methods/query/pos-venda-calls'
import LoadingComponent from '@/components/utils/LoadingComponent'
import ErrorComponent from '@/components/utils/ErrorComponent'

type NewPosVendaCallProps = {
  callId: string
  session: TAuthSession
  closeModal: () => void
  callbacks?: {
    onMutate?: () => void
    onSuccess?: () => void
    onSettled?: () => void
  }
}

export default function ControlPosVendaCall({ callId, session, closeModal, callbacks }: NewPosVendaCallProps) {
  const queryClient = useQueryClient()

  const { data: call, isLoading, isError, isSuccess, error } = useGetPosVendaCallById({ id: callId })
  const redefineState = usePosVendaCallStore((state) => state.redefineState)
  const getCurrentState = usePosVendaCallStore((state) => state.getState)
  const reset = usePosVendaCallStore((state) => state.reset)
  const { mutate: handleUpdatePosVendaCall, isPending } = useMutation({
    mutationKey: ['update-pos-venda-call', callId],
    mutationFn: updatePosVendaCall,
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
  useEffect(() => {
    if (call) {
      redefineState({
        ...call,
      })
    }
  }, [call])
  return (
    <ResponsibleModalWrapperWithMutation
      title="EDITAR CHAMADO"
      description="Edite o chamado"
      ctaButtonText="ATUALIZAR CHAMADO"
      dialogContentClassName="min-w-[50%]"
      handleSubmit={() => {
        return handleUpdatePosVendaCall({
          id: callId,
          call: getCurrentState(),
        })
      }}
      isPending={isPending}
      closeModal={closeModal}
    >
      {isLoading ? <LoadingComponent /> : null}
      {isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
      {isSuccess ? <PosVendaCallData session={session} callId={callId} /> : null}
    </ResponsibleModalWrapperWithMutation>
  )
}
