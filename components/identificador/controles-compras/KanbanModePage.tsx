import { usePurchaseControls } from '@/utils/methods/query/purchase-controls'
import { Session } from 'next-auth'
import React, { useState } from 'react'
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd'
import LoadingComponent from '@/components/utils/LoadingComponent'
import ErrorComponent from '@/components/utils/ErrorComponent'
import { getErrorMessage } from '@/utils/methods/handlers'
import { TPurchaseControlDTO, TPurchaseControlKanbanSimplified, TPurchaseControlKanbanSimplifiedDTO } from '@/utils/schemas/purchases'
import { MdDashboard } from 'react-icons/md'
import Avatar from '@/components/utils/Avatar'
import { formatDateAsLocale, formatNameAsInitials } from '@/utils/methods/formatting'
import { BsCalendarPlus } from 'react-icons/bs'
import { Button } from '@/components/ui/button'

type TPurchaseControlByStatus = {
  title: string
  items: TPurchaseControlKanbanSimplifiedDTO[]
}

type PurchaseControlsKanbanModePageProps = {
  session: Session
}
function PurchaseControlsKanbanModePage({ session }: PurchaseControlsKanbanModePageProps) {
  const { data: purchaseControls, isLoading, isError, isSuccess, error } = usePurchaseControls()
  const [newPurchaseControlModalIsOpen, setNewPurchaseControlModalIsOpen] = useState<boolean>(false)
  function getPurchaseControlsByStatus(purchaseControls: TPurchaseControlKanbanSimplifiedDTO[] | undefined): TPurchaseControlByStatus[] {
    if (!purchaseControls)
      return Object.entries({
        INDEFINIDO: [],
        'AGUARDANDO LIBERAÇÃO': [],
        'AGUARDANDO PAGAMENTO': [],
        'PENDÊNCIA COMERCIAL': [],
        'PENDÊNCIA OPERACIONAL': [],
        'PENDÊNCIA EXTERNA': [],
        CONCLUÍDA: [],
      }).map(([key, value]) => ({ title: key, items: value }))

    return Object.entries({
      INDEFINIDO: purchaseControls.filter((c) => c.status == 'INDEFINIDO'),
      'AGUARDANDO LIBERAÇÃO': purchaseControls.filter((c) => c.status == 'AGUARDANDO LIBERAÇÃO'),
      'AGUARDANDO PAGAMENTO': purchaseControls.filter((c) => c.status == 'AGUARDANDO PAGAMENTO'),
      'PENDÊNCIA COMERCIAL': purchaseControls.filter((c) => c.status == 'PENDÊNCIA COMERCIAL'),
      'PENDÊNCIA OPERACIONAL': purchaseControls.filter((c) => c.status == 'PENDÊNCIA OPERACIONAL'),
      'PENDÊNCIA EXTERNA': purchaseControls.filter((c) => c.status == 'PENDÊNCIA EXTERNA'),
      CONCLUÍDA: purchaseControls.filter((c) => c.status == 'CONCLUÍDA'),
    }).map(([key, value]) => ({ title: key, items: value }))
  }

  function onDragEnd(dragEndResult: DropResult) {}

  return (
    <div className="flex grow flex-col gap-2 p-6">
      <div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
        <div className="flex w-full items-center justify-between">
          <p className="text-center text-2xl font-black uppercase text-[#15599a]">CONTROLES DE COMPRA</p>
          <Button onClick={() => setNewPurchaseControlModalIsOpen(true)}>NOVO CONTROLE</Button>
        </div>
      </div>
      <DragDropContext onDragEnd={(e) => onDragEnd(e)}>
        <div className="flex w-full gap-3 overflow-x-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
          {isLoading ? <LoadingComponent /> : null}
          {isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
          {isSuccess ? (
            <>
              {getPurchaseControlsByStatus(purchaseControls).map((controlsByStatus) => (
                <FunnelList key={controlsByStatus.title} session={session} title={controlsByStatus.title} items={controlsByStatus.items} />
              ))}
            </>
          ) : null}
        </div>
      </DragDropContext>
    </div>
  )
}

export default PurchaseControlsKanbanModePage

type FunnelListProps = {
  session: Session
  title: string
  items: TPurchaseControlKanbanSimplifiedDTO[]
}
function FunnelList({ session, title, items }: FunnelListProps) {
  return (
    <Droppable droppableId={title.toString()}>
      {(provided) => (
        <div className="flex w-full min-w-[375px] flex-col p-2 px-4 lg:w-[375px]">
          <div className="flex h-[100px] w-full flex-col rounded bg-[#15599a] px-2 lg:h-[60px]">
            <h1 className="w-full rounded p-1 text-center font-medium text-white">{title}</h1>
            <div className="mt-1 flex w-full flex-col items-center justify-center px-2 pb-2 lg:flex-row">
              <div className="flex w-full items-center justify-center gap-1 text-[0.65rem] text-white lg:w-1/3 lg:justify-end lg:text-[0.7rem]">
                <p>
                  <MdDashboard />
                </p>
                <p>{items.length}</p>
              </div>
            </div>
          </div>
          <div ref={provided.innerRef} {...provided.droppableProps} className="my-1 flex flex-col gap-2 ">
            {items.map((item, index) => (
              <FunnelListItem key={item._id} item={item} index={index} />
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  )
}

type FunnelListItemProps = {
  item: TPurchaseControlKanbanSimplifiedDTO
  index: number
}
function FunnelListItem({ item, index }: FunnelListItemProps) {
  return (
    <Draggable draggableId={item._id.toString()} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="relative flex min-h-[110px] w-full flex-col justify-between gap-2 rounded border border-gray-500 bg-[#fff] shadow-sm"
        >
          <div className="flex w-full items-center justify-between gap-2">
            <h1 className="text-sm font-bold leading-none tracking-tight">{item.titulo}</h1>
          </div>
          <div className="flex w-full grow flex-col p-2">
            {item.etiquetas.length > 0 ? (
              <div className="flex w-full flex-wrap items-center justify-start gap-2 lg:grow">
                <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80 ">ETIQUETAS</h1>
                {item.etiquetas.map((category, index) => (
                  <h1 key={category.id} className="rounded-lg bg-primary px-2 py-0.5 text-[0.5rem] text-secondary">
                    {category.titulo}
                  </h1>
                ))}
              </div>
            ) : null}
          </div>
          <div className="flex w-full items-center justify-between gap-2">
            <div className="flex grow flex-wrap items-center gap-2">
              <div className="flex items-center gap-1">
                <Avatar url={item.autor.avatar_url || undefined} fallback={formatNameAsInitials(item.autor.nome)} height={18} width={18} />
                <p className="text-[0.65rem] font-light text-gray-400">{item.autor.nome}</p>
              </div>
            </div>
            <div className="ites-center flex min-w-fit gap-1">
              <BsCalendarPlus />
              <p className={`text-[0.65rem] font-medium text-gray-500`}>{formatDateAsLocale(item.dataInsercao, true)}</p>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  )
}
