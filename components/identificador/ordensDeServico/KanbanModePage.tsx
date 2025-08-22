import { TServiceOrdersPageModes } from '@/pages/ordens-de-servico'
import { createServiceOrderTag, updateServiceOrder } from '@/utils/methods/mutation/service-orders'
import { TServiceOrderQueryParams, useServiceOrders, useServiceOrderTags } from '@/utils/methods/query/service-orders'
import { TServiceOrderSimplifiedDTO, TServiceOrderTagDTO } from '@/utils/schemas/service-order'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { TAuthSession } from '@/lib/authentication/types'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd'
import ErrorComponent from '@/components/utils/ErrorComponent'
import ModalNewServiceOrder from './modals/ModalNewServiceOrder'
import { cn } from '@/lib/utils'
import ModalControlServiceOrder from './modals/ModalControlServiceOrder'
import { Button } from '@/components/ui/button'
import { FaLocationDot, FaRotate } from 'react-icons/fa6'
import { getErrorMessage } from '@/utils/methods/handlers'
import { formatWithoutDiacritics } from '@/utils/methods/formatting'
import LoadingComponent from '@/components/utils/LoadingComponent'
import { MdDashboard, MdRoofing } from 'react-icons/md'
import { BsCalendarPlus, BsCalendarCheck, BsCalendar, BsPatchCheckFill } from 'react-icons/bs'
import { formatNameAsInitials, formatDateAsLocale } from '@/utils/methods/formatting'
import { Tag, Tags, UserRound, X } from 'lucide-react'
import Avatar from '@/components/utils/Avatar'
import { TagsColorPalette } from '@/utils/select-options'
import { Pencil } from 'lucide-react'
import * as Popover from '@radix-ui/react-popover'
import { useMutationWithFeedback } from '@/utils/methods/mutation/general-hook'
import { LoadingButton } from '@/components/utils/Buttons/LoadingButton'
import CheckboxInput from '@/components/inputs/Checkbox'
import { FaRegHourglass, FaSolarPanel } from 'react-icons/fa'
import { getServiceTypeTagColor } from '@/components/TagTipoDeServico'
import { getFormattedTextFromHoursAmount, getHoursDiff } from '@/utils/methods/dates'
import { TbUrgent } from 'react-icons/tb'
import dayjs from 'dayjs'
type TServiceOrderByStatus = {
  title: string
  items: TServiceOrderSimplifiedDTO[]
}

type ServiceOrdersKanbanModePageProps = {
  session: TAuthSession
  handleSetMode: (mode: TServiceOrdersPageModes) => void
}
function ServiceOrdersKanbanModePage({ session, handleSetMode }: ServiceOrdersKanbanModePageProps) {
  const queryClient = useQueryClient()

  const { data: serviceOrders, isLoading, isError, isSuccess, error, queryParams, updateQueryParams } = useServiceOrders()
  console.log(queryParams)
  const { data: tags } = useServiceOrderTags()

  const [newServiceOrderModalIsOpen, setNewServiceOrderModalIsOpen] = useState<boolean>(false)
  const [editServiceOrderModal, setEditServiceOrderModal] = useState<{ id: string | null; isOpen: boolean }>({ id: null, isOpen: false })

  function getServiceOrdersByStatus(serviceOrders: TServiceOrderSimplifiedDTO[] | undefined): TServiceOrderByStatus[] {
    if (!serviceOrders)
      return Object.entries({
        PENDENTE: [],
        'EM COTAÇÃO': [],
        'AGUARDANDO PLANEJAMENTO': [],
        'AGUARDANDO LIBERAÇÃO': [],
        'AGUARDANDO AGENDAMENTO': [],
        'AGUARDANDO EXECUÇÃO': [],
        'EM EXECUÇÃO': [],
        'CONCLUÍDA PARCIAL': [],
        CONCLUÍDA: [],
        CANCELADA: [],
        PENDÊNCIAS: [],
      }).map(([key, value]) => ({ title: key, items: value }))

    return Object.entries({
      PENDENTE: serviceOrders?.filter((s) => s.status == 'PENDENTE' || !s.status),
      'AGUARDANDO PLANEJAMENTO': serviceOrders?.filter((s) => s.status == 'AGUARDANDO PLANEJAMENTO'),
      'AGUARDANDO LIBERAÇÃO': serviceOrders?.filter((s) => s.status == 'AGUARDANDO LIBERAÇÃO'),
      'AGUARDANDO AGENDAMENTO': serviceOrders?.filter((s) => s.status == 'AGUARDANDO AGENDAMENTO'),
      'AGUARDANDO EXECUÇÃO': serviceOrders?.filter((s) => s.status == 'AGUARDANDO EXECUÇÃO'),
      'EM EXECUÇÃO': serviceOrders?.filter((s) => s.status == 'EM EXECUÇÃO'),
      'CONCLUÍDA PARCIAL': serviceOrders?.filter((s) => s.status == 'CONCLUÍDA PARCIAL'),
      CONCLUÍDA: serviceOrders?.filter((s) => s.status == 'CONCLUÍDA'),
      CANCELADA: serviceOrders?.filter((s) => s.status == 'CANCELADA'),
      PENDÊNCIAS: serviceOrders?.filter((s) => s.status == 'PENDÊNCIAS'),
    }).map(([key, value]) => ({ title: key, items: value }))
  }

  function onDragEnd(dragEndResult: DropResult) {
    function handleEffectivationUpdate(newValue: TServiceOrderSimplifiedDTO['status'], previousData: TServiceOrderSimplifiedDTO) {
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

    const serviceOrder = serviceOrders?.find((p) => p._id == draggableId)
    if (!serviceOrder) return
    handleUpdateServiceOrderStatus({
      id: draggableId,
      changes: {
        status: destination.droppableId as TServiceOrderSimplifiedDTO['status'],
        dataEfetivacao: handleEffectivationUpdate(destination.droppableId as TServiceOrderSimplifiedDTO['status'], serviceOrder),
      },
    })
  }

  const { mutate: handleUpdateServiceOrderStatus } = useMutation({
    mutationKey: ['update-service-order'],
    mutationFn: updateServiceOrder,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ['service-orders', queryParams] })

      const querySnapshot = queryClient.getQueryData(['service-orders', queryParams]) as TServiceOrderSimplifiedDTO[] | undefined

      if (!querySnapshot) return { querySnapshot }
      const update = querySnapshot.map((prev) => (prev._id == variables.id ? { ...prev, status: variables.changes.status || 'PENDENTE' } : prev))
      queryClient.setQueryData(['service-orders', queryParams], update)

      return { querySnapshot }
    },
    onSuccess: async (data) => {
      toast.success(data)
      return
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(['service-orders', queryParams], context?.querySnapshot)
    },
    onSettled: (data, error, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['service-orders', queryParams] })
    },
  })

  return (
    <div className="flex grow flex-col gap-2 p-6">
      <div className="flex flex-col items-center justify-between border-b border-gray-300 p-1">
        <div className="flex w-full flex-col items-center justify-between gap-2 gap-y-3 lg:flex-row ">
          <div className="flex flex-col items-center  gap-1 lg:flex-row">
            <div className="flex items-center gap-1">
              <p className="text-center text-2xl font-black uppercase text-[#15599a]">CONTROLES DE ORDEM DE SERVIÇO</p>
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
            <Button onClick={() => setNewServiceOrderModalIsOpen(true)} size={'xs'}>
              NOVA ORDEM DE SERVIÇO
            </Button>
          </div>
        </div>
        <div className="flex w-full flex-wrap items-center gap-2">
          <h3 className="text-sm font-medium text-gray-500">FILTROS</h3>
          <FilterMenu tags={tags || []} queryParams={queryParams} updateQueryParams={updateQueryParams} />
        </div>
      </div>

      <DragDropContext onDragEnd={(e) => onDragEnd(e)}>
        <div className="flex max-h-[600px] w-full gap-3 overflow-x-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
          {isLoading ? <LoadingComponent /> : null}
          {isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
          {isSuccess ? (
            <>
              {getServiceOrdersByStatus(serviceOrders).map((serviceOrdersByStatus) => (
                <FunnelList
                  key={serviceOrdersByStatus.title}
                  session={session}
                  title={serviceOrdersByStatus.title}
                  items={serviceOrdersByStatus.items}
                  handleItemClick={(id) => setEditServiceOrderModal({ id, isOpen: true })}
                />
              ))}
            </>
          ) : null}
        </div>
      </DragDropContext>
      {newServiceOrderModalIsOpen ? <ModalNewServiceOrder session={session} closeModal={() => setNewServiceOrderModalIsOpen(false)} /> : null}
      {editServiceOrderModal.id && editServiceOrderModal.isOpen ? (
        <ModalControlServiceOrder
          session={session}
          serviceOrderId={editServiceOrderModal.id}
          closeModal={() => setEditServiceOrderModal({ id: null, isOpen: false })}
        />
      ) : null}
    </div>
  )
}

export default ServiceOrdersKanbanModePage

type FilterMenuProps = {
  tags: TServiceOrderTagDTO[]
  queryParams: TServiceOrderQueryParams
  updateQueryParams: (params: Partial<TServiceOrderQueryParams>) => void
}
function FilterMenu({ tags, queryParams, updateQueryParams }: FilterMenuProps) {
  function getApplicableTags() {
    return tags.filter((tag) => queryParams.queryTags.includes(tag._id))
  }
  function addTag(tag: TServiceOrderTagDTO) {
    updateQueryParams({ queryTags: [...queryParams.queryTags, tag._id] })
  }
  function removeTag(tagId: string) {
    updateQueryParams({ queryTags: queryParams.queryTags.filter((tag) => tag != tagId) })
  }
  const applicableTags = getApplicableTags()
  return (
    <div className="flex items-center justify-center gap-2 lg:justify-end">
      {applicableTags?.map((tag, index) => (
        <div
          key={index}
          style={{
            border: '1px solid',
            borderColor: tag.cores.primaria,
            color: tag.cores.primaria,
            backgroundColor: tag.cores.secundaria,
          }}
          className={cn('group flex items-center gap-1 rounded py-0.5 pl-2 pr-1')}
        >
          <Tag width={12} height={12} />
          <h1 className="text-[0.65rem] font-bold tracking-tight">{tag.titulo}</h1>
          <button
            onClick={() => removeTag(tag._id)}
            className="items-center justify-center opacity-0 duration-300 ease-in-out group-hover:opacity-100"
          >
            <X height={12} width={12} />
          </button>
        </div>
      ))}
      <TagsMenu currentApplicableTags={queryParams.queryTags} handleClick={addTag} />
      <div className="w-fit">
        <CheckboxInput
          labelTrue="SOMENTE NÃO EFETIVADOS"
          labelFalse="SOMENTE NÃO EFETIVADOS"
          checked={queryParams.queryPendingConclusion}
          handleChange={() => updateQueryParams({ queryPendingConclusion: !queryParams.queryPendingConclusion })}
        />
      </div>
    </div>
  )
}

type TTagMenuHolder = {
  title: string
  colors: { primary: string; secondary: string }
}
type TagsMenuProps = {
  currentApplicableTags: string[]
  handleClick: (tag: TServiceOrderTagDTO) => void
}
function TagsMenu({ currentApplicableTags, handleClick }: TagsMenuProps) {
  const queryClient = useQueryClient()
  const { data: tags, isLoading, isError, isSuccess, error } = useServiceOrderTags()

  const [holder, setHolder] = useState<TTagMenuHolder>({
    title: '',
    colors: { primary: TagsColorPalette[0].primaria, secondary: TagsColorPalette[0].secundaria },
  })
  function getFilteredTags(tags: TServiceOrderTagDTO[]) {
    return tags.filter((t) => formatWithoutDiacritics(t.titulo, true).includes(formatWithoutDiacritics(holder.title, true)))
  }

  const filteredTags = getFilteredTags(tags || [])

  const { mutate: handleCreateServiceOrderTag, isPending: isUpdateLoading } = useMutationWithFeedback({
    mutationKey: ['create-service-order-tag'],
    mutationFn: createServiceOrderTag,
    queryClient,
    affectedQueryKey: ['service-order-tags'],
  })
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button variant="secondary" className="flex items-center gap-1" size={'xs'}>
          <Tags height={13} width={13} />
          <h1 className="text-[0.65rem] font-bold tracking-tight">+ TAGS</h1>
        </Button>
      </Popover.Trigger>
      <Popover.Content className="z-[120] flex min-h-[250px] w-80 flex-col gap-2 rounded border border-gray-500 bg-white p-3 shadow-sm">
        <div className="flex flex-col items-center justify-between border-b border-gray-300 px-2 pb-2 text-lg lg:flex-row">
          <h3 className="text-sm font-bold">MENU DE ETIQUETAS</h3>
        </div>
        <input
          className="bg-transparent p-2 text-xs outline-none placeholder:italic"
          value={holder.title}
          onChange={(e) => setHolder((prev) => ({ ...prev, title: e.target.value }))}
          placeholder="Filtre pelo título da tag..."
        />

        <div className="flex w-full grow flex-col gap-2">
          {isLoading ? (
            <div className="flex w-full grow items-center justify-center">
              <h1 className="animate-pulse text-xs tracking-tight text-primary/80">Carregando...</h1>
            </div>
          ) : null}
          {isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
          {isSuccess ? (
            filteredTags.length > 0 ? (
              <div className="flex w-full flex-wrap gap-2">
                {filteredTags.map((tag) => (
                  <button
                    disabled={currentApplicableTags.includes(tag._id)}
                    style={{
                      border: '1px solid',
                      borderColor: tag.cores.primaria,
                      color: tag.cores.primaria,
                      backgroundColor: tag.cores.secundaria,
                    }}
                    className={cn(
                      'flex w-fit items-center gap-1 rounded px-2 py-0.5',
                      currentApplicableTags.includes(tag._id) ? 'opacity-30' : 'opacity-100'
                    )}
                    onClick={() => handleClick(tag)}
                  >
                    <Tag width={12} height={12} />
                    <h1 className="text-[0.65rem] font-bold tracking-tight">{tag.titulo}</h1>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex w-full grow flex-col items-center justify-center gap-2 p-2">
                <div
                  style={{
                    border: '1px solid',
                    borderColor: holder.colors.primary,
                    color: holder.colors.primary,
                    backgroundColor: holder.colors.secondary,
                  }}
                  className={cn('flex items-center gap-1 rounded px-2 py-0.5')}
                >
                  <Tag width={12} height={12} />
                  <h1 className="text-[0.7rem] font-bold tracking-tight">{holder.title}</h1>
                </div>
                <div className="flex w-full flex-wrap items-center justify-center gap-1">
                  {TagsColorPalette.map((tagColor) => (
                    <button
                      type="button"
                      onClick={() => setHolder((prev) => ({ ...prev, colors: { primary: tagColor.primaria, secondary: tagColor.secundaria } }))}
                      style={{ border: '1px solid', borderColor: tagColor.primaria, backgroundColor: tagColor.secundaria }}
                      className={cn('h-4 w-4 rounded-full opacity-60', tagColor.primaria == holder.colors.primary ? 'scale-110 opacity-100' : '')}
                    ></button>
                  ))}
                </div>
                <LoadingButton
                  loading={isUpdateLoading}
                  onClick={() =>
                    // @ts-ignore
                    handleCreateServiceOrderTag({
                      info: {
                        titulo: holder.title,
                        cores: { primaria: holder.colors.primary, secundaria: holder.colors.secondary },
                        dataInsercao: new Date().toISOString(),
                      },
                    })
                  }
                  size={'xs'}
                >
                  CRIAR ETIQUETA
                </LoadingButton>
              </div>
            )
          ) : null}
        </div>
      </Popover.Content>
    </Popover.Root>
  )
}

type FunnelListProps = {
  session: TAuthSession
  title: string
  items: TServiceOrderSimplifiedDTO[]
  handleItemClick: (id: string) => void
}
function FunnelList({ session, title, items, handleItemClick }: FunnelListProps) {
  return (
    <Droppable droppableId={title.toString()}>
      {(provided) => (
        <div className="flex w-full min-w-[390px] flex-col p-2 px-4 lg:w-[390px]">
          <div className="flex w-full flex-col rounded bg-[#15599a] px-2 lg:h-[60px]">
            <div className="flex w-full items-center gap-2">
              <h1 className="w-full rounded p-1 text-center font-medium text-white">{title}</h1>
            </div>
            <div className="mt-1 flex w-full flex-col items-center justify-center px-2 pb-2 lg:flex-row">
              <div className="w-full lg:w-1/3" />
              <div className="flex w-full items-center justify-center gap-1 text-[0.65rem] text-white lg:w-1/3  lg:text-[0.7rem]">
                <MdDashboard />
                <p>{items.length}</p>
              </div>
              <div className="w-full lg:w-1/3" />
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
  item: TServiceOrderSimplifiedDTO
  index: number
  handleClick: (id: string) => void
}
function FunnelListItem({ item, index, handleClick }: FunnelListItemProps) {
  function getHomologationAccessTag(acessResponseData: string) {
    const daysSinceResponse = dayjs().diff(dayjs(acessResponseData), 'day')

    const daysTillExpiration = 120 - daysSinceResponse
    if (daysSinceResponse > 110)
      return (
        <div
          className={cn('flex w-fit items-center gap-1 self-center rounded-lg px-2 py-1', {
            'bg-red-600 text-white': daysSinceResponse > 110,
            'bg-orange-500 text-white': daysSinceResponse <= 110 && daysSinceResponse > 100,
            'bg-green-500 text-white': daysSinceResponse <= 100 && daysSinceResponse > 0,
          })}
        >
          <TbUrgent size={12} />
          <h1 className="text-[0.5rem] font-medium">
            {daysTillExpiration < 0 ? 'PARECER VENCIDO' : `${daysTillExpiration} DIAS ATÉ O VENCIMENTO DO PARECER`}
          </h1>
        </div>
      )
  }
  return (
    <Draggable draggableId={item._id.toString()} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="relative flex min-h-[70px] w-full flex-col justify-between gap-1 rounded border border-gray-500 bg-[#fff] p-2 shadow-sm"
        >
          <div className="flex w-full items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              {/* <button
              onClick={() => setItemExpandedModeActive((prev) => !prev)}
              className={cn('flex items-center rounded-full p-1 text-xs text-black', itemExpandedModeActive ? 'bg-slate-400' : 'bg-transparent')}
              >
              {itemExpandedModeActive ? <IoMdContract /> : <IoMdExpand />}
              </button> */}
              <h1 className="text-sm font-bold leading-none tracking-tight">{item.favorecido.nome}</h1>
            </div>
            <button
              onClick={() => handleClick(item._id)}
              className="flex items-center gap-1 rounded-lg bg-primary px-2 py-1 text-[0.6rem] text-secondary"
            >
              <Pencil width={10} height={10} />
              <p>EDITAR</p>
            </button>
          </div>
          <div className="flex w-full grow flex-col gap-2 px-2">
            {item.etiquetas && item.etiquetas?.length > 0 ? (
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
            {item.projeto.id ? (
              <>
                <div
                  className={cn('flex w-fit items-center gap-1 self-center rounded-lg px-2 py-1', getServiceTypeTagColor(item.projeto.tipo || ''))}
                >
                  <MdDashboard size={12} />
                  <h1 className="text-[0.5rem] font-medium">{item.projeto.tipo}</h1>
                </div>
                {item.categoria == 'MONTAGEM' && item.projeto.homologacaoAcessoDataResposta
                  ? getHomologationAccessTag(item.projeto.homologacaoAcessoDataResposta)
                  : null}
                {item.categoria == 'MONTAGEM' && item.projeto.homologacaoVistoriaDataEfetivacao ? (
                  <div className="flex w-fit items-center gap-1 self-center">
                    <BsPatchCheckFill height={13} width={13} color="#22c55e " />
                    <h1 className="text-[0.6rem] font-medium uppercase text-primary/80">VISTORIA FEITA</h1>
                  </div>
                ) : null}
                {item.categoria == 'MONTAGEM' ? (
                  <div className="flex w-full flex-wrap items-center justify-around gap-2">
                    <div className="flex items-center gap-1">
                      <FaRegHourglass height={13} width={13} />
                      <h1 className="text-[0.6rem] font-medium uppercase text-primary/80">
                        {item.projeto.contratoDataAssinatura
                          ? `${getFormattedTextFromHoursAmount({
                              hours: getHoursDiff({ start: item.projeto.contratoDataAssinatura, finish: new Date() }),
                              reference: 'auto',
                              onlyComplete: false,
                            })} DESDE ASSINATURA`
                          : 'NÃO ASSINADO'}
                      </h1>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaRegHourglass height={13} width={13} />
                      <h1 className="text-[0.6rem] font-medium uppercase text-primary/80">
                        {item.projeto.compraEntregaDataEfetivacao
                          ? `${getFormattedTextFromHoursAmount({
                              hours: getHoursDiff({ start: item.projeto.compraEntregaDataEfetivacao, finish: new Date() }),
                              reference: 'auto',
                              onlyComplete: false,
                            })} DESDE ENTREGA`
                          : 'NÃO ENTREGUE'}
                      </h1>
                    </div>
                  </div>
                ) : null}
              </>
            ) : null}
            <div className="flex w-full flex-wrap items-center justify-around gap-2">
              <div className="flex items-center gap-1">
                <FaLocationDot height={13} width={13} />
                <h1 className="text-[0.6rem] font-medium text-primary/80">
                  {item.localizacao.cidade} ({item.localizacao.uf})
                </h1>
              </div>
              <div className="flex items-center gap-1">
                <UserRound size={12} />
                <h1 className="text-[0.6rem] font-medium text-primary/80">{item.responsavel.nome}</h1>
              </div>
            </div>
            <div className="flex w-full flex-wrap items-center justify-around gap-2">
              <div className="flex items-center gap-1">
                <FaSolarPanel height={13} width={13} />
                <h1 className="text-[0.6rem] font-medium text-primary/80">{item.equipamentos.modulos.qtde || 0} MÓDULOS</h1>
              </div>
              <div className="flex items-center gap-1">
                <MdRoofing height={13} width={13} />
                <h1 className="text-[0.6rem] font-medium text-primary/80">{item.detalhes.tipoTelha ? `TELHA ${item.detalhes.tipoTelha}` : 'N/A'}</h1>
              </div>
            </div>
            <div className="flex w-full flex-wrap items-center justify-around gap-2">
              <div className="flex items-center gap-1">
                <h1 className="text-[0.6rem] font-medium text-primary/80">AGENDAMENTO</h1>
                <BsCalendar width={12} height={12} />
                <h1 className="text-[0.6rem] font-medium text-primary/80">
                  {item.agendamento
                    ? `${formatDateAsLocale(item.agendamento.inicio, true)} - ${item.agendamento.fim ? formatDateAsLocale(item.agendamento.fim, true) : 'N/A'}`
                    : 'N/A'}
                </h1>
              </div>
            </div>
          </div>
          <div className="flex w-full items-center justify-between gap-2">
            <div className="flex grow flex-wrap items-center gap-2">
              <div className="flex items-center gap-1">
                <Avatar url={item.autor?.avatar_url || undefined} fallback={formatNameAsInitials(item.autor?.nome || '')} height={18} width={18} />

                <p className="text-[0.65rem] font-light text-gray-400">{item.autor?.nome || ''}</p>
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
