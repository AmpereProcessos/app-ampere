import { useMutationWithFeedback } from '@/utils/methods/mutation/general-hook'
import { createPurchaseControl } from '@/utils/methods/mutation/purchase-controls'
import type { TPurchaseControl } from '@/utils/schemas/purchases'
import type { TAuthSession } from '@/lib/authentication/types'
import React, { useState, type Dispatch, type SetStateAction } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import PurchaseControlGeneralInformationBlock from './blocos/GeneralInformationBlock'
import PurchaseControlCompositionBlock from './blocos/CompositionBlock'

import { LoadingButton } from '@/components/utils/Buttons/LoadingButton'

import PurchaseControlTagsBlock from './blocos/TagsBlock'
import { usePurchaseProject } from '@/utils/methods/query/purchase-controls'
import PurchaseControlProjectInformationBlock from './blocos/ProjectInformationBlock'
import PurchaseControlProjectVinculation from './blocos/utils/ProjectVinculation'
import toast from 'react-hot-toast'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { useMediaQuery } from '@/lib/hooks/media-query'
type NewPurchaseControlSimplifiedProps = {
  session: TAuthSession
  affectedQueryKey: any[]
  closeModal: () => void
  initialData?: Partial<TPurchaseControl>
}
function NewPurchaseControlSimplified({ session, affectedQueryKey, closeModal, initialData }: NewPurchaseControlSimplifiedProps) {
  const queryClient = useQueryClient()
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const [infoHolder, setInfoHolder] = useState<TPurchaseControl>({
    status: initialData?.status || 'PENDENTE',
    registrosStatus: initialData?.registrosStatus || {},
    titulo: initialData?.titulo || '',
    anotacoes: initialData?.anotacoes || '',
    projeto: initialData?.projeto || {},
    etiquetas: initialData?.etiquetas || [],
    atualizacoes: initialData?.atualizacoes || [],
    totalPrevisto: initialData?.totalPrevisto || 0,
    total: initialData?.total || 0,
    liberacao: {
      autor: initialData?.liberacao?.autor || {},
    },
    composicao: initialData?.composicao || [],
    entrega: {
      status: initialData?.entrega?.status || 'AGUARDANDO COMPRA',
      localizacao: {
        uf: initialData?.entrega?.localizacao?.uf || '',
        cidade: initialData?.entrega?.localizacao?.cidade || '',
      },
    },
    faturamentos: initialData?.faturamentos || [],
    fornecedor: initialData?.fornecedor || {},
    transporte: {
      transportadora: initialData?.transporte?.transportadora || {},
    },
    autor: {
      id: initialData?.autor?.id || session.user.id,
      nome: initialData?.autor?.nome || session.user.nome,
      avatar_url: initialData?.autor?.avatar_url || session.user.avatar_url,
    },
    dataInsercao: initialData?.dataInsercao || new Date().toISOString(),
  })

  const { mutate, isPending } = useMutationWithFeedback({
    mutationKey: ['create-purchase-control'],
    mutationFn: createPurchaseControl,
    queryClient: queryClient,
    affectedQueryKey: affectedQueryKey,
  })

  const TITLE = 'REQUISITAR COMPRA'
  const DESCRIPTION = 'Preencha os dados para abrir uma solicitação de compra.'
  const BUTTON_TEXT = 'REQUISITAR COMPRA'

  return isDesktop ? (
    <Dialog open={true} onOpenChange={closeModal}>
      <DialogContent className="h-[85vh] w-[80%] min-w-[80%]">
        <DialogHeader>
          <DialogTitle>{TITLE}</DialogTitle>
          <DialogDescription>{DESCRIPTION}</DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-hidden px-4">
          <ScrollArea className="h-full">
            <PurchaseControlDataBlock
              queryClient={queryClient}
              infoHolder={infoHolder}
              setInfoHolder={setInfoHolder}
              session={session}
              affectedQueryKey={affectedQueryKey}
            />
          </ScrollArea>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">FECHAR</Button>
          </DialogClose>
          <LoadingButton onClick={() => mutate(infoHolder)} loading={isPending}>
            {BUTTON_TEXT}
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer open={true} onOpenChange={closeModal}>
      <DrawerContent className="flex h-[85vh] flex-col">
        <DrawerHeader>
          <DrawerTitle>{TITLE}</DrawerTitle>
          <DrawerDescription>{DESCRIPTION}</DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 overflow-hidden px-4">
          <ScrollArea className="h-full">
            <PurchaseControlDataBlock
              queryClient={queryClient}
              infoHolder={infoHolder}
              setInfoHolder={setInfoHolder}
              session={session}
              affectedQueryKey={affectedQueryKey}
            />
          </ScrollArea>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">FECHAR</Button>
          </DrawerClose>

          <LoadingButton onClick={() => mutate(infoHolder)} loading={isPending}>
            {BUTTON_TEXT}
          </LoadingButton>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default NewPurchaseControlSimplified

type PurchaseControlDataBlockProps = {
  queryClient: any
  infoHolder: TPurchaseControl
  setInfoHolder: Dispatch<SetStateAction<TPurchaseControl>>
  session: TAuthSession
  affectedQueryKey: any[]
}
function PurchaseControlDataBlock({ queryClient, infoHolder, setInfoHolder, session, affectedQueryKey }: PurchaseControlDataBlockProps) {
  const { data: project } = usePurchaseProject({ projectId: infoHolder.projeto.id || null })

  function addProductToComposition(product: TPurchaseControl['composicao'][number]) {
    setInfoHolder((prev) => ({ ...prev, composicao: [...prev.composicao, product] }))
    toast.success('Produto adicionado à composição')
  }

  return (
    <div className="flex h-full flex-col gap-y-2">
      <PurchaseControlGeneralInformationBlock session={session} infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
      {project ? (
        <PurchaseControlProjectInformationBlock
          session={session}
          purchase={infoHolder}
          updatePurchase={(changes) => setInfoHolder((prev) => ({ ...prev, ...changes }))}
          project={project}
          addProductToComposition={addProductToComposition}
        />
      ) : (
        <PurchaseControlProjectVinculation
          purchaseControlId={undefined}
          infoHolder={infoHolder}
          setInfoHolder={setInfoHolder}
          affectedQueryKey={affectedQueryKey}
          queryClient={queryClient}
        />
      )}
      <PurchaseControlTagsBlock session={session} infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
      <PurchaseControlCompositionBlock session={session} infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
    </div>
  )
}
