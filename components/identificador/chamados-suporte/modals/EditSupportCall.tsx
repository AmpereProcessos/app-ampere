import ResponsiveDialogDrawer from '@/components/utils/ResponsiveDialogDrawer'
import { TAuthSession } from '@/lib/authentication/types'
import { TSupportCall } from '@/utils/schemas/support-calls'
import { useEffect, useState } from 'react'

import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { getErrorMessage } from '@/utils/methods/handlers'
import { createSupportCall, updateSupportCall } from '@/utils/methods/mutation/support-calls'

import { General, PowerPlantInfo, WarrantyInfo } from './Content'
import { useSupportCallById } from '@/utils/methods/query/support-calls'
import LoadingComponent from '@/components/utils/LoadingComponent'
import ErrorComponent from '@/components/utils/ErrorComponent'

type EditSupportCallProps = {
  callId: string
  session: TAuthSession
  closeModal: () => void
  callbacks?: {
    onMutate?: () => void
    onError?: () => void
    onSuccess?: () => void
    onSettled?: () => void
  }
}
function EditSupportCall({ session, closeModal, callbacks, callId }: EditSupportCallProps) {
  const { data: supportCall, isLoading, isError, isSuccess, error } = useSupportCallById(callId)
  const [infoHolder, setInfoHolder] = useState<TSupportCall>({
    responsavel: session.user.id,
    statusChamado: 'ABERTO',
    tipoChamado: 'SUPORTE',
    abertura: new Date().toISOString(),
    responsavelUsuario: {
      id: session.user.id,
      nome: session.user.nome,
      avatar_url: session.user.avatar_url,
    },
  })
  function updateInfoHolder(info: Partial<TSupportCall>) {
    setInfoHolder((prev) => ({ ...prev, ...info }))
  }

  const { mutate: handleUpdateSupportCall, isPending: updateSupportCallIsPending } = useMutation({
    mutationFn: updateSupportCall,
    onMutate: async () => {
      callbacks?.onMutate?.()
    },
    onSuccess: (data) => {
      toast.success(data.message)
      callbacks?.onSuccess?.()
    },
    onError: (err) => {
      toast.error(getErrorMessage(err))
      callbacks?.onError?.()
    },
    onSettled: () => {
      callbacks?.onSettled?.()
    },
  })

  useEffect(() => {
    if (supportCall) {
      setInfoHolder({
        ...supportCall,
      })
    }
  }, [supportCall])
  return (
    <ResponsiveDialogDrawer
      menuTitle="EDITAR CHAMADO DE SUPORTE"
      menuDescription="Preencha os campos abaixo para editar o chamado de suporte."
      menuActionButtonText="EDITAR CHAMADO"
      menuCancelButtonText="CANCELAR"
      actionFunction={() => handleUpdateSupportCall({ info: { id: callId, changes: infoHolder } })}
      actionIsPending={updateSupportCallIsPending}
      stateIsLoading={false}
      closeMenu={closeModal}
      dialogContentClassName="gap-6"
    >
      {isLoading ? <LoadingComponent /> : null}
      {isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
      {isSuccess ? (
        <>
          <General infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} />
          <PowerPlantInfo infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} />
          <WarrantyInfo infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} />
        </>
      ) : null}
    </ResponsiveDialogDrawer>
  )
}

export default EditSupportCall
