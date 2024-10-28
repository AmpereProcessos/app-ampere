import { usePurchaseControls, usePurchaseControlsTags } from '@/utils/methods/query/purchase-controls'
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
import { BsCalendar, BsCalendarCheck, BsCalendarEvent, BsCalendarPlus } from 'react-icons/bs'
import { Button } from '@/components/ui/button'
import NewPurchaseControl from './modals/NewPurchaseControl'
import { CheckCheck, Factory, Pencil, ScrollText, Tag, Truck, X } from 'lucide-react'
import { useMutationWithFeedback } from '@/utils/methods/mutation/general-hook'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updatePurchaseControl } from '@/utils/methods/mutation/purchase-controls'
import toast from 'react-hot-toast'
import ControlPurchaseControl from './modals/ControlPurchaseControl'
import { cn } from '@/lib/utils'
import { TPurchasesControlPageModes } from '@/pages/suprimentos/controle-compras'
import { FaRotate } from 'react-icons/fa6'
import SelectInput from '@/components/inputs/Select'
import MultipleSelectInput from '@/components/inputs/MultipleSelect'

type TPurchaseControlByStatus = {
  title: string
  items: TPurchaseControlKanbanSimplifiedDTO[]
}

type PurchaseControlsKanbanModePageProps = {
  session: Session
  handleSetMode: (mode: TPurchasesControlPageModes) => void
}
function PurchaseControlsKanbanModePage({ session, handleSetMode }: PurchaseControlsKanbanModePageProps) {
  const queryClient = useQueryClient()

  const { data: tags } = usePurchaseControlsTags()
  const { data: purchaseControls, isLoading, isError, isSuccess, error, queryParams, updateQueryParams, filters, setFilters } = usePurchaseControls()
  const [newPurchaseControlModalIsOpen, setNewPurchaseControlModalIsOpen] = useState<boolean>(false)
  const [editPurchaseControlModal, setEditPurchaseControlModal] = useState<{ id: string | null; isOpen: boolean }>({ id: null, isOpen: false })
  function getPurchaseControlsByStatus(purchaseControls: TPurchaseControlKanbanSimplifiedDTO[] | undefined): TPurchaseControlByStatus[] {
    if (!purchaseControls)
      return Object.entries({
        PENDENTE: [],
        'EM COTAÇÃO': [],
        'AGUARDANDO APROVAÇÃO': [],
        'AGUARDANDO PAGAMENTO': [],
        'AGUARDANDO COMPRA': [],
        'AGUARDANDO FATURAMENTO': [],
        'AGUARDANDO DESPACHE': [],
        'AGUARDANDO ENTREGA': [],
        CONCLUÍDA: [],
        PENDÊNCIAS: [],
      }).map(([key, value]) => ({ title: key, items: value }))

    return Object.entries({
      PENDENTE: purchaseControls.filter((c) => c.status == 'PENDENTE'),
      'EM COTAÇÃO': purchaseControls.filter((c) => c.status == 'EM COTAÇÃO'),
      'AGUARDANDO APROVAÇÃO': purchaseControls.filter((c) => c.status == 'AGUARDANDO APROVAÇÃO'),
      'AGUARDANDO PAGAMENTO': purchaseControls.filter((c) => c.status == 'AGUARDANDO PAGAMENTO'),
      'AGUARDANDO COMPRA': purchaseControls.filter((c) => c.status == 'AGUARDANDO COMPRA'),
      'AGUARDANDO FATURAMENTO': purchaseControls.filter((c) => c.status == 'AGUARDANDO FATURAMENTO'),
      'AGUARDANDO DESPACHE': purchaseControls.filter((c) => c.status == 'AGUARDANDO DESPACHE'),
      'AGUARDANDO ENTREGA': purchaseControls.filter((c) => c.status == 'AGUARDANDO ENTREGA'),
      CONCLUÍDA: purchaseControls.filter((c) => c.status == 'CONCLUÍDA'),
      PENDÊNCIAS: purchaseControls.filter((c) => c.status == 'PENDÊNCIAS'),
    }).map(([key, value]) => ({ title: key, items: value }))
  }

  function onDragEnd(dragEndResult: DropResult) {
    function handleEffectivationUpdate(newValue: TPurchaseControlKanbanSimplifiedDTO['status'], previousData: TPurchaseControlKanbanSimplifiedDTO) {
      if (newValue == 'CONCLUÍDA') {
        if (previousData.status != 'CONCLUÍDA') return new Date().toISOString()
        return previousData.dataEfetivacao
      } else {
        if (previousData.status == 'CONCLUÍDA') return null
        return previousData.dataEfetivacao
      }
    }

    const { source, destination, draggableId } = dragEndResult

    if (!destination) return
    if (destination.droppableId == source.droppableId) return

    const purchaseControl = purchaseControls?.find((p) => p._id == draggableId)
    if (!purchaseControl) return
    handleUpdatePurchaseControlStatus({
      id: draggableId,
      changes: {
        status: destination.droppableId as TPurchaseControlKanbanSimplifiedDTO['status'],
        dataEfetivacao: handleEffectivationUpdate(destination.droppableId as TPurchaseControlKanbanSimplifiedDTO['status'], purchaseControl),
      },
    })
  }
  const { mutate: handleUpdatePurchaseControlStatus } = useMutation({
    mutationKey: ['update-purchase-control'],
    mutationFn: updatePurchaseControl,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ['purchase-controls'] })

      const querySnapshot = queryClient.getQueryData(['purchase-controls']) as TPurchaseControlKanbanSimplifiedDTO[] | undefined

      if (!querySnapshot) return { querySnapshot }
      const update = querySnapshot.map((prev) => (prev._id == variables.id ? { ...prev, status: variables.changes.status || 'INDEFINIDO' } : prev))
      queryClient.setQueryData(['purchase-controls'], update)

      return { querySnapshot }
    },
    onSuccess: async (data) => {
      toast.success(data)
      return
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(['purchase-controls'], context?.querySnapshot)
    },
    onSettled: (data, error, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['purchase-controls'] })
    },
  })
  return (
    <div className="flex grow flex-col gap-2 p-6">
      <div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
        <div className="flex w-full flex-col items-center justify-between gap-2 gap-y-3 lg:flex-row ">
          <div className="flex flex-col items-center  gap-1 lg:flex-row">
            <div className="flex items-center gap-1">
              <p className="text-center text-2xl font-black uppercase text-[#15599a]">CONTROLES DE COMPRA</p>
            </div>

            <button
              onClick={() => handleSetMode('card')}
              className="flex items-center gap-1 px-2 text-xs text-gray-500 duration-300 ease-out hover:text-gray-800"
            >
              <FaRotate />
              <h1 className="font-medium">ALTERAR MODO</h1>
            </button>
          </div>
          <div className="flex w-full flex-col items-center gap-1 lg:w-fit lg:flex-row lg:items-end">
            <MultipleSelectInput
              label="TAGS"
              selected={filters.tags}
              options={tags?.map((tag) => ({ id: tag._id, value: tag._id, label: tag.titulo })) || []}
              handleChange={(value) => setFilters((prev) => ({ ...prev, tags: value as string[] }))}
              selectedItemLabel="NÃO DEFINIDO"
              onReset={() => setFilters((prev) => ({ ...prev, tags: [] }))}
            />
            <button
              onClick={() => updateQueryParams({ unfinishedOnly: !queryParams.unfinishedOnly })}
              className={cn('min-h-[46.6px] rounded p-2 text-xs font-bold text-white', queryParams.unfinishedOnly ? 'bg-blue-600' : 'bg-gray-600')}
            >
              {queryParams.unfinishedOnly ? 'EM ANDAMENTO' : 'TODAS'}
            </button>
            <Button onClick={() => setNewPurchaseControlModalIsOpen(true)} className="min-h-[46.6px]">
              NOVO CONTROLE
            </Button>
          </div>
        </div>
      </div>

      <DragDropContext onDragEnd={(e) => onDragEnd(e)}>
        <div className="flex max-h-[600px] w-full gap-3 overflow-x-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
          {isLoading ? <LoadingComponent /> : null}
          {isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
          {isSuccess ? (
            <>
              {getPurchaseControlsByStatus(purchaseControls).map((controlsByStatus) => (
                <FunnelList
                  key={controlsByStatus.title}
                  session={session}
                  title={controlsByStatus.title}
                  items={controlsByStatus.items}
                  handleItemClick={(id) => setEditPurchaseControlModal({ id, isOpen: true })}
                />
              ))}
            </>
          ) : null}
        </div>
      </DragDropContext>
      {newPurchaseControlModalIsOpen ? (
        <NewPurchaseControl
          session={session}
          affectedQueryKey={['purchase-controls', queryParams]}
          closeModal={() => setNewPurchaseControlModalIsOpen(false)}
        />
      ) : null}
      {editPurchaseControlModal.id && editPurchaseControlModal.isOpen ? (
        <ControlPurchaseControl
          session={session}
          purchaseControlId={editPurchaseControlModal.id}
          affectedQueryKey={['purchase-controls', queryParams]}
          closeModal={() => setEditPurchaseControlModal({ id: null, isOpen: false })}
        />
      ) : null}
    </div>
  )
}

export default PurchaseControlsKanbanModePage

type FunnelListProps = {
  session: Session
  title: string
  items: TPurchaseControlKanbanSimplifiedDTO[]
  handleItemClick: (id: string) => void
}
function FunnelList({ session, title, items, handleItemClick }: FunnelListProps) {
  return (
    <Droppable droppableId={title.toString()}>
      {(provided) => (
        <div className="flex w-full min-w-[390px] flex-col p-2 px-4 lg:w-[390px]">
          <div className="flex w-full flex-col rounded bg-[#15599a] px-2 lg:h-[60px]">
            <h1 className="w-full rounded p-1 text-center font-medium text-white">{title}</h1>
            <div className="mt-1 flex w-full flex-col items-center justify-center px-2 pb-2 lg:flex-row">
              <div className="flex w-full items-center justify-center gap-1 text-[0.65rem] text-white lg:w-1/3  lg:text-[0.7rem]">
                <p>
                  <MdDashboard />
                </p>
                <p>{items.length}</p>
              </div>
            </div>
          </div>
          <div ref={provided.innerRef} {...provided.droppableProps} className="my-1 flex flex-col gap-2 ">
            {items.map((item, index) => (
              <FunnelListItem key={item._id} item={item} index={index} handleClick={handleItemClick} />
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
  handleClick: (id: string) => void
}
function FunnelListItem({ item, index, handleClick }: FunnelListItemProps) {
  function getDeliveryStatusTag(status: TPurchaseControlKanbanSimplifiedDTO['entrega']['status']) {
    if (status == 'AGUARDANDO COMPRA') return <h1 className="min-w-fit rounded-lg bg-orange-600 px-2 py-0.5 text-[0.5rem] text-white">{status}</h1>
    if (status == 'EM ROTA') return <h1 className="min-w-fit rounded-lg bg-blue-600 px-2 py-0.5 text-[0.5rem] text-white">{status}</h1>
    if (status == 'ENTREGUE') return <h1 className="min-w-fit rounded-lg bg-green-500 px-2 py-0.5 text-[0.5rem] text-white">{status}</h1>
  }

  return (
    <Draggable draggableId={item._id.toString()} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="relative flex min-h-[110px] w-full flex-col justify-between gap-1 rounded border border-gray-500 bg-[#fff] p-2 shadow-sm"
        >
          <div className="flex w-full items-center justify-between gap-2">
            <h1 className="text-sm font-bold leading-none tracking-tight">{item.titulo}</h1>
            <button
              onClick={() => handleClick(item._id)}
              className="flex items-center gap-1 rounded-lg bg-primary px-2 py-1 text-[0.6rem] text-secondary"
            >
              <Pencil width={10} height={10} />
              <p>EDITAR</p>
            </button>
          </div>
          <div className="flex w-full grow flex-col gap-2 px-2">
            {item.etiquetas.length > 0 ? (
              <div className="flex w-full flex-wrap items-center justify-start gap-2 lg:grow">
                <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80 ">ETIQUETAS</h1>
                {item.etiquetas.map((tag, index) => (
                  <div
                    key={index}
                    style={{
                      border: '1px solid',
                      borderColor: tag.cores.primaria,
                      color: tag.cores.primaria,
                      backgroundColor: tag.cores.secundaria,
                    }}
                    className={cn('flex items-center gap-1 rounded px-2 py-0.5')}
                  >
                    <Tag width={10} height={10} />
                    <h1 className="text-[0.5rem] font-bold tracking-tight">{tag.titulo}</h1>
                  </div>
                ))}
              </div>
            ) : null}
            <div className="flex w-full items-center justify-center">
              {item.liberacao.data ? <CheckCheck color="#22c55e" height={13} width={13} /> : <X color="#ef4444" height={13} width={13} />}
              <h1 className="text-[0.6rem] text-primary/80">{item.liberacao.data ? 'LIBERADO' : 'NÃO LIBERADO'}</h1>
            </div>
            <div className="flex w-full flex-wrap items-center justify-around gap-2">
              <div className="flex items-center gap-1">
                <Factory height={13} width={13} />
                <h1 className="text-[0.6rem] font-medium text-primary/80">{item.fornecedor.nome || 'FORNECEDOR INDEFINIDO'}</h1>
              </div>
              <div className="flex items-center gap-1">
                <Truck height={13} width={13} />
                <h1 className="text-[0.6rem] font-medium text-primary/80">{item.transporte.transportadora.nome || 'TRANSPORTADORA INDEFINIDO'}</h1>
              </div>
              <div className="flex items-center gap-1">
                <ScrollText height={13} width={13} />
                <h1 className="text-[0.6rem] font-medium text-primary/80">
                  FATURAMENTOS {item.faturamentos.filter((f) => !!f.data).length}/{item.faturamentos.length}
                </h1>
              </div>
            </div>
            <div className="flex w-full flex-wrap items-center justify-center gap-2">
              <div className="flex items-center gap-1">
                <BsCalendar width={10} height={10} />
                <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">PEDIDO</h1>
                <h1 className="py-0.5 text-center text-[0.6rem] font-bold  text-primary">{formatDateAsLocale(item.dataPedido) || 'N/A'}</h1>
              </div>
              <div className="flex items-center gap-1">
                <BsCalendarEvent width={10} height={10} />
                <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">PREVISÃO</h1>
                <h1 className="py-0.5 text-center text-[0.6rem] font-bold  text-primary">{formatDateAsLocale(item.entrega.dataPrevisao) || 'N/A'}</h1>
              </div>
              <div className="flex items-center gap-1">
                <BsCalendarCheck width={10} height={10} />
                <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">ENTREGA</h1>
                <h1 className="py-0.5 text-center text-[0.6rem] font-bold  text-primary">
                  {formatDateAsLocale(item.entrega.dataEfetivacao) || 'N/A'}
                </h1>
              </div>
            </div>
            <div className="flex w-full items-center justify-center gap-1">
              <BsCalendarCheck width={10} height={10} />
              <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">STATUS DE ENTREGA</h1>
              <h1 className="py-0.5 text-center text-[0.6rem] font-bold  text-primary">{getDeliveryStatusTag(item.entrega.status)}</h1>
            </div>
          </div>
          <div className="flex w-full items-center justify-between gap-2">
            <div className="flex grow flex-wrap items-center gap-2">
              <div className="flex items-center gap-1">
                <Avatar url={item.autor.avatar_url || undefined} fallback={formatNameAsInitials(item.autor.nome)} height={18} width={18} />
                <p className="text-[0.65rem] font-light text-gray-400">{item.autor.nome}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex min-w-fit items-center gap-1">
                <BsCalendarPlus />
                <p className={`text-[0.65rem] font-medium text-gray-500`}>{formatDateAsLocale(item.dataInsercao, true)}</p>
              </div>
              {item.dataEfetivacao ? (
                <div className="flex items-center gap-1">
                  <BsCalendarCheck color="#22c55e" />
                  <p className="text-[0.65rem] font-medium text-primary/80">{formatDateAsLocale(item.dataEfetivacao, true)}</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  )
}
