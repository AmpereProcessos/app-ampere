import { useMutationWithFeedback } from '@/utils/methods/mutation/general-hook'
import { createPurchaseControl, deletePurchaseControl, updatePurchaseControl } from '@/utils/methods/mutation/purchase-controls'
import { TPurchaseControl } from '@/utils/schemas/purchases'
import { Session } from 'next-auth'
import React, { useEffect, useState } from 'react'
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
import { usePurchaseControlById } from '@/utils/methods/query/purchase-controls'
import LoadingComponent from '@/components/utils/LoadingComponent'
import ErrorComponent from '@/components/utils/ErrorComponent'
import { getErrorMessage } from '@/utils/methods/handlers'
import CheckboxWithDate from '@/components/inputs/CheckboxWithDate'
import { formatDateInputChange } from '@/utils/methods/shared'
import PurchaseControlProjectInformationBlock from './blocos/ProjectInformationBlock'
import PurchaseControlProjectVinculation from './blocos/utils/ProjectVinculation'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import PurchaseControlFileReferences from './blocos/AttachmentsBlock'
import { updateProject } from '@/utils/methods/mutation/clients'
import PurchaseControlPaymentInformationBlock from './blocos/PaymentInformationBlock'
import { updateManyServiceOrdersByProjectId } from '@/utils/methods/mutation/service-orders'

type ControlPurchaseControlProps = {
  session: Session
  purchaseControlId: string
  affectedQueryKey: any[]
  closeModal: () => void
}
function ControlPurchaseControl({ session, purchaseControlId, affectedQueryKey, closeModal }: ControlPurchaseControlProps) {
  const queryClient = useQueryClient()
  const { data: purchaseControl, isLoading, isError, isSuccess, error } = usePurchaseControlById({ id: purchaseControlId })
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

  async function handleUpdatePurchaseControl({ id, changes }: { id: string; changes: Partial<TPurchaseControl> }) {
    try {
      await updatePurchaseControl({ id, changes })
      const projectId = purchaseControl?.projeto.id
      if (projectId) {
        await updateProject({
          id: projectId,
          changes: {
            'compra.status': infoHolder.status,
            'compra.atualizacoes': infoHolder.atualizacoes,
            'compra.liberacao': !!infoHolder.liberacao.data,
            'compra.dataLiberacao': infoHolder.liberacao.data,
            'compra.fornecedor': infoHolder.fornecedor.nome,
            'compra.dataPedido': infoHolder.dataPedido,
            'compra.valorDoKit': infoHolder.total,
            'compra.rastreio': infoHolder.transporte.linkRastreio,
            'compra.dataRequisicaoPagamento': infoHolder.dataRequisicaoPagamento,
            'compra.dataPagamento': infoHolder.dataLiberacaoPagamento,
            'compra.dataPagamentoEquipamentos': infoHolder.dataPagamento,
            'compra.previsaoEntrega': infoHolder.entrega.dataPrevisao,
            'compra.dataEntrega': infoHolder.entrega.dataEfetivacao,
            'compra.statusEntrega': infoHolder.entrega.status,
            'compra.kitInfo': infoHolder.composicao.map((c) => `${c.qtde}-${c.descricao}`).join('\n'),
            'obra.pendencias': infoHolder.metadata?.pendenciasExecucao,
          },
        })
        await updateManyServiceOrdersByProjectId({
          projectId: projectId,
          filters: { categoria: 'MONTAGEM', dataEfetivacao: null },
          changes: { dataPrevisaoLiberacao: infoHolder.entrega.dataPrevisao, dataLiberacao: infoHolder.entrega.dataEfetivacao },
        })
      }
    } catch (error) {}
  }
  const { mutate, isPending: isUpdateLoading } = useMutationWithFeedback({
    mutationKey: ['update-purchase-control', purchaseControlId],
    mutationFn: handleUpdatePurchaseControl,
    queryClient: queryClient,
    affectedQueryKey: affectedQueryKey,
    callbackFn: async () => queryClient.invalidateQueries({ queryKey: ['purchase-control-by-id', purchaseControlId] }),
  })
  const { mutate: deleteMutation, isPending: isDeleteLoading } = useMutationWithFeedback({
    mutationKey: ['delete-purchase-control', purchaseControlId],
    mutationFn: deletePurchaseControl,
    queryClient: queryClient,
    affectedQueryKey: affectedQueryKey,
    callbackFn: () => closeModal(),
  })
  function addProductToComposition(product: TPurchaseControl['composicao'][number]) {
    setInfoHolder((prev) => ({ ...prev, composicao: [...prev.composicao, product] }))
    toast.success('Produto adicionado à composição')
  }
  console.log(infoHolder)
  useEffect(() => {
    if (purchaseControl) setInfoHolder(purchaseControl)
  }, [purchaseControl])
  return (
    <Dialog.Root open onOpenChange={closeModal}>
      <Dialog.Overlay className="fixed inset-0 z-[50] bg-primary/70 backdrop-blur-sm" />
      <Dialog.Content className="fixed left-[50%] top-[50%] z-[100] h-[90%] w-[90%] translate-x-[-50%] translate-y-[-50%] rounded-md bg-background p-[10px] lg:h-[80%] lg:w-[80%]">
        <div className="flex h-full w-full flex-col">
          <div className="flex flex-col items-center justify-between border-b border-gray-200 px-2 pb-2 text-lg lg:flex-row">
            <h3 className="text-sm font-bold lg:text-xl">EDITAR CONTROLE DE COMPRA</h3>
            <button
              onClick={() => closeModal()}
              type="button"
              className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
            >
              <VscChromeClose style={{ color: 'red' }} />
            </button>
          </div>
          {isLoading ? <LoadingComponent /> : null}
          {isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
          {isSuccess ? (
            <>
              <div className="flex h-full flex-col gap-y-2 overflow-y-auto overscroll-y-auto p-2 py-1 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
                <div className="flex w-full items-center justify-center">
                  <Link href={`/suprimentos/controle-compras/pdf/${purchaseControlId}`}>
                    <button
                      className={cn('flex items-center gap-1 rounded-lg bg-black px-2 py-1 text-white duration-300 ease-in-out hover:bg-gray-800')}
                    >
                      <ExternalLink width={14} height={14} />
                      <h1 className="text-xs font-medium tracking-tight">PÁGINA DO PEDIDO</h1>
                    </button>
                  </Link>
                </div>
                <PurchaseControlGeneralInformationBlock session={session} infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
                {purchaseControl.projetoDados ? (
                  <PurchaseControlProjectInformationBlock
                    session={session}
                    purchase={infoHolder}
                    updatePurchase={(changes) => setInfoHolder((prev) => ({ ...prev, ...changes }))}
                    project={purchaseControl.projetoDados}
                    addProductToComposition={addProductToComposition}
                  />
                ) : (
                  <PurchaseControlProjectVinculation
                    purchaseControlId={purchaseControlId}
                    infoHolder={infoHolder}
                    setInfoHolder={setInfoHolder}
                    affectedQueryKey={['purchase-control-by-id', purchaseControlId]}
                    queryClient={queryClient}
                  />
                )}
                <PurchaseControlFileReferences
                  session={session}
                  attachmentPrefix={`clientes/${infoHolder.titulo}`}
                  purchaseId={purchaseControlId}
                  projectId={infoHolder.projeto.id || undefined}
                />
                <PurchaseControlUpdatesInformationBlock session={session} infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
                <PurchaseControlTagsBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
                <PurchaseControlCompositionBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
                <PurchaseControlPaymentInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
                <PurchaseControlOrderInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
                <PurchaseControlTransportationInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
                <PurchaseControlBillingInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
                <PurchaseControlDeliveryInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
              </div>
              <div className="flex w-full flex-wrap items-center justify-between gap-2">
                <LoadingButton
                  loading={isDeleteLoading || isUpdateLoading}
                  // @ts-ignore
                  onClick={() => deleteMutation({ id: purchaseControlId })}
                  variant={'destructive'}
                >
                  EXCLUIR CONTROLE DE COMPRA
                </LoadingButton>
                <LoadingButton
                  loading={isUpdateLoading || isDeleteLoading}
                  onClick={() =>
                    // @ts-ignore
                    mutate({ id: purchaseControlId, changes: infoHolder })
                  }
                >
                  ATUALIZAR CONTROLE DE COMPRA
                </LoadingButton>
              </div>
            </>
          ) : null}
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export default ControlPurchaseControl
