import { useMutationWithFeedback } from '@/utils/methods/mutation/general-hook'
import { createPurchaseControl } from '@/utils/methods/mutation/purchase-controls'
import { TPurchaseControl } from '@/utils/schemas/purchases'
import { Session } from 'next-auth'
import React, { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import * as Dialog from '@radix-ui/react-dialog'
import { VscChromeClose } from 'react-icons/vsc'
import PurchaseControlGeneralInformationBlock from './blocos/GeneralInformationBlock'
import PurchaseControlCompositionBlock from './blocos/CompositionBlock'
import PurchaseControlOrderInformationBlock from './blocos/OrderInformationBlock'
import PurchaseControlTransportationInformationBlock from './blocos/TransportationInformationBlock'
import PurchaseControlBillingInformationBlock from './blocos/BillingInformationBlock'
import { LoadingButton } from '@/components/utils/Buttons/LoadingButton'
import PurchaseControlDeliveryInformationBlock from './blocos/DeliveryInformationBlock'
import PurchaseControlUpdatesInformationBlock from './blocos/UpdatesInformationBlock'
import PurchaseControlTagsBlock from './blocos/TagsBlock'
import { usePurchaseProject } from '@/utils/methods/query/purchase-controls'
import PurchaseControlProjectInformationBlock from './blocos/ProjectInformationBlock'
import PurchaseControlProjectVinculation from './blocos/utils/ProjectVinculation'
import toast from 'react-hot-toast'
import PurchaseControlPaymentInformationBlock from './blocos/PaymentInformationBlock'

type NewPurchaseControlProps = {
  session: Session
  affectedQueryKey: any[]
  closeModal: () => void
}
function NewPurchaseControl({ session, affectedQueryKey, closeModal }: NewPurchaseControlProps) {
  const queryClient = useQueryClient()
  const [infoHolder, setInfoHolder] = useState<TPurchaseControl>({
    status: 'PENDENTE',
    registrosStatus: {},
    titulo: '',
    anotacoes: '',
    projeto: {},
    etiquetas: [],
    atualizacoes: [],
    totalPrevisto: 0,
    total: 0,
    liberacao: {
      autor: {},
    },
    composicao: [],
    entrega: {
      status: 'AGUARDANDO COMPRA',
      localizacao: {
        uf: '',
        cidade: '',
      },
    },
    faturamentos: [],
    fornecedor: {},
    transporte: {
      transportadora: {},
    },
    autor: {
      id: session.user.id,
      nome: session.user.nome,
      avatar_url: session.user.avatar_url,
    },
    dataInsercao: new Date().toISOString(),
  })

  const { data: project } = usePurchaseProject({ projectId: infoHolder.projeto.id || null })
  function addProductToComposition(product: TPurchaseControl['composicao'][number]) {
    setInfoHolder((prev) => ({ ...prev, composicao: [...prev.composicao, product] }))
    toast.success('Produto adicionado à composição')
  }
  const { mutate, isPending } = useMutationWithFeedback({
    mutationKey: ['create-purchase-control'],
    mutationFn: createPurchaseControl,
    queryClient: queryClient,
    affectedQueryKey: affectedQueryKey,
  })
  return (
    <Dialog.Root open onOpenChange={closeModal}>
      <Dialog.Overlay className="fixed inset-0 z-[100] bg-primary/70 backdrop-blur-sm" />
      <Dialog.Content className="fixed left-[50%] top-[50%] z-[100] h-[90%] w-[90%] translate-x-[-50%] translate-y-[-50%] rounded-md bg-background p-[10px] lg:h-[80%] lg:w-[80%]">
        <div className="flex h-full w-full flex-col">
          <div className="flex flex-col items-center justify-between border-b border-gray-200 px-2 pb-2 text-lg lg:flex-row">
            <h3 className="text-sm font-bold lg:text-xl">NOVO CONTROLE DE COMPRA</h3>
            <button
              onClick={() => closeModal()}
              type="button"
              className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
            >
              <VscChromeClose style={{ color: 'red' }} />
            </button>
          </div>
          <div className="flex h-full flex-col gap-y-2 overflow-y-auto overscroll-y-auto p-2 py-1 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
            <PurchaseControlGeneralInformationBlock session={session} infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
            {project ? (
              <PurchaseControlProjectInformationBlock purchase={infoHolder} project={project} addProductToComposition={addProductToComposition} />
            ) : (
              <PurchaseControlProjectVinculation
                purchaseControlId={undefined}
                infoHolder={infoHolder}
                setInfoHolder={setInfoHolder}
                affectedQueryKey={affectedQueryKey}
                queryClient={queryClient}
              />
            )}
            <PurchaseControlUpdatesInformationBlock session={session} infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
            {/* <PurchaseControlTagsBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} /> */}
            <PurchaseControlCompositionBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
            <PurchaseControlPaymentInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
            <PurchaseControlOrderInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
            <PurchaseControlTransportationInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
            <PurchaseControlBillingInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
            <PurchaseControlDeliveryInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
          </div>
          <div className="flex w-full items-center justify-end">
            <LoadingButton
              loading={isPending}
              onClick={() =>
                // @ts-ignore
                mutate(infoHolder)
              }
            >
              CRIAR CONTROLE DE COMPRA
            </LoadingButton>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export default NewPurchaseControl
