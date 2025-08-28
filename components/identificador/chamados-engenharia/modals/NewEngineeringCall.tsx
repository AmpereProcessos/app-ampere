import ResponsiveDialogDrawer from '@/components/utils/ResponsiveDialogDrawer'
import { TAuthSession } from '@/lib/authentication/types'
import { TEngineeringCall } from '@/utils/schemas/engineering-calls'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { getErrorMessage } from '@/utils/methods/handlers'
import { createEngineeringCall } from '@/utils/methods/mutation/engineering-calls'
import { Attachments, General, TEngineeringCallAttachmentHolderItem } from './Content'
import { uploadFile } from '@/utils/methods/firebase'
import { TFileReference } from '@/utils/schemas/crm/file-reference.schema'
import { createManyFileReferences } from '@/utils/methods/mutation/crm/file-references'

type NewEngineeringCallProps = {
  session: TAuthSession
  closeModal: () => void
  callbacks?: {
    onMutate?: () => void
    onError?: () => void
    onSuccess?: () => void
    onSettled?: () => void
  }
}
function NewEngineeringCall({ session, closeModal, callbacks }: NewEngineeringCallProps) {
  const [infoHolder, setInfoHolder] = useState<TEngineeringCall>({
    projeto: '',
    observacoes: '',
    responsavel: session.user.id,
    status: 'ABERTO',
    tipoDoChamado: 'PROJETO',
    abertura: new Date().toISOString(),
    responsavelUsuario: {
      id: session.user.id,
      nome: session.user.nome,
      avatar_url: session.user.avatar_url,
    },
  })
  const [attachmentItems, setAttachmentItems] = useState<TEngineeringCallAttachmentHolderItem[]>([
    {
      title: 'NOVO ANEXO...',
      attachments: [],
    },
  ])

  function initializeNewAttachmentItem() {
    setAttachmentItems((prev) => [...prev, { title: 'NOVO ANEXO...', attachments: [] }])
  }

  function clearAttachmentItems() {
    setAttachmentItems([])
  }

  function updateAttachmentItem(index: number, item: Partial<TEngineeringCallAttachmentHolderItem>) {
    setAttachmentItems((prev) => prev.map((prevItem, i) => (i === index ? { ...prevItem, ...item } : prevItem)))
  }

  function updateInfoHolder(info: Partial<TEngineeringCall>) {
    setInfoHolder((prev) => ({ ...prev, ...info }))
  }

  async function handleCreateEngineeringCall({ info, attachments }: { info: TEngineeringCall; attachments: TEngineeringCallAttachmentHolderItem[] }) {
    try {
      const engineeringCall = await createEngineeringCall({ info })
      const insertedCallId = engineeringCall.data.insertedId

      const uploads = attachments.flatMap((item) =>
        item.attachments
          .filter((a) => !!a.file)
          .map((a, aIdx, aArr) => ({
            title: aArr.length > 0 ? `${item.title} (${aIdx + 1})` : item.title,
            callId: item.callId,
            projectId: item.projectId,
            file: a.file as File,
          }))
      )
      // If no valid uploads, return early
      if (uploads.length === 0) return { insertedCallId, message: 'Nenhum arquivo enviado.' }

      const uploadPromises = uploads.map(async (uploadItem) => {
        const {
          url,
          format: formato,
          size: tamanho,
        } = await uploadFile({ file: uploadItem.file as File, fileName: uploadItem.title, vinculationId: undefined, prefix: 'chamado-engenharia' })

        const fileReference: TFileReference = {
          titulo: uploadItem.title,
          formato: formato,
          url: url,
          autor: {
            id: session.user.id,
            nome: session.user.nome,
            avatar_url: session.user.avatar_url,
          },
          idProjeto: uploadItem.projectId,
          idChamado: uploadItem.callId,
          dataInsercao: new Date().toISOString(),
        }
        return fileReference
      })
      const fileReferences = await Promise.all(uploadPromises)
      await createManyFileReferences({ info: fileReferences })

      return { insertedCallId, message: 'Chamado de engenharia criado com sucesso.' }
    } catch (error) {
      throw error
    }
  }

  const { mutate: handleCreateEngineeringCallMutation, isPending: createEngineeringCallIsPending } = useMutation({
    mutationFn: handleCreateEngineeringCall,
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

  return (
    <ResponsiveDialogDrawer
      menuTitle="NOVO CHAMADO DE ENGENHARIA"
      menuDescription="Preencha os campos abaixo para criar um novo chamado de engenharia."
      menuActionButtonText="CRIAR CHAMADO"
      menuCancelButtonText="CANCELAR"
      actionFunction={() => handleCreateEngineeringCallMutation({ info: infoHolder, attachments: attachmentItems })}
      actionIsPending={createEngineeringCallIsPending}
      stateIsLoading={false}
      closeMenu={closeModal}
      dialogContentClassName="gap-6"
    >
      <General infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} />
      <Attachments
        session={session}
        projectId={infoHolder.projeto ?? undefined}
        attachments={attachmentItems}
        initializeNewAttachmentItem={initializeNewAttachmentItem}
        updateAttachmentItem={updateAttachmentItem}
        clearAttachmentItems={clearAttachmentItems}
      />
    </ResponsiveDialogDrawer>
  )
}

export default NewEngineeringCall
