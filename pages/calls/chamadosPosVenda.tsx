import type { TGetAllPosVendaCallsInput } from '@/app/api/chamados/posvenda/route'
import ControlPosVendaCall from '@/components/identificador/chamados/posvenda/ControlPosVendaCall'
import PosVendaCallsFilterMenu from '@/components/identificador/chamados/posvenda/FilterMenu'
import NewPosVendaCall from '@/components/identificador/chamados/posvenda/NewPosVendaCall'
import DateIntervalInput from '@/components/inputs/DateIntervalInput'
import { getServiceTypeTagColor } from '@/components/TagTipoDeServico'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import ErrorComponent from '@/components/utils/ErrorComponent'
import LoadingComponent from '@/components/utils/LoadingComponent'
import { cn } from '@/lib/utils'
import { formatToMoney } from '@/utils/constants'
import { formatDateAsLocale, formatNameAsInitials } from '@/utils/methods/formatting'
import { getErrorMessage } from '@/utils/methods/handlers'
import { updatePosVendaCall } from '@/utils/methods/mutation/pos-venda-calls'
import { useGetAllPosVendaCalls, useGetPosVendaCallsStatistics } from '@/utils/methods/query/pos-venda-calls'
import type { TPosVendaCall, TPosVendaCallDTO } from '@/utils/schemas/pos-venda-calls'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { BadgeCheck, BadgeDollarSign, ChartArea, Check, Pencil, Plus, X } from 'lucide-react'
import type { TAuthSession } from '@/lib/authentication/types'
import { useSession } from '@/components/providers/SessionProvider'
import { useState } from 'react'
import { DragDropContext, Draggable, Droppable, type DropResult } from 'react-beautiful-dnd'
import toast from 'react-hot-toast'
import { BsCalendarCheck, BsCalendarPlus } from 'react-icons/bs'
import { MdDashboard } from 'react-icons/md'

type TCallsByStatus = {
  title: string
  items: TPosVendaCallDTO[]
}

function PosVendaCallsPage() {
  const { session, status } = useSession({ required: true })
  if (status !== 'authenticated') return <LoadingComponent />

  return <PosVendaCalls session={session} />
}

type PosVendaCallsProps = {
  session: TAuthSession
}
function PosVendaCalls({ session }: PosVendaCallsProps) {
  const queryClient = useQueryClient()
  const [filterMenuIsOpen, setFilterMenuIsOpen] = useState(false)
  const [newCallIsOpen, setNewCallIsOpen] = useState(false)
  const [editCallModal, setEditCallModal] = useState<{ id: string | null; isOpen: boolean }>({ id: null, isOpen: false })
  const { data: calls, isLoading, isError, isSuccess, filters, error, updateFilters } = useGetAllPosVendaCalls({})

  const { mutate: handleUpdateCallStatus } = useMutation({
    mutationKey: ['update-call'],
    mutationFn: updatePosVendaCall,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ['pos-venda-calls', filters] })

      const querySnapshot = queryClient.getQueryData(['pos-venda-calls', filters]) as TPosVendaCallDTO[] | undefined

      if (!querySnapshot) return { querySnapshot }
      const update = querySnapshot.map((prev) => (prev._id === variables.id ? { ...prev, status: variables.call.status || 'PENDENTE' } : prev))
      queryClient.setQueryData(['pos-venda-calls', filters], update)

      return { querySnapshot }
    },
    onSuccess: async (data) => {
      toast.success(data.message)
      return
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(['pos-venda-calls', filters], context?.querySnapshot)
    },
    onSettled: (data, error, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['pos-venda-calls', filters] })
    },
  })

  function getCallsByStatus(calls: TPosVendaCallDTO[] | undefined): TCallsByStatus[] {
    if (!calls)
      return Object.entries({
        PENDENTE: [],
        'AGUARDANDO PAGAMENTO': [],
        PAGO: [],
        CONCLUÍDO: [],
      }).map(([key, value]) => ({ title: key, items: value }))

    return Object.entries({
      PENDENTE: calls?.filter((s) => s.status === 'PENDENTE' || !s.status),
      'AGUARDANDO PAGAMENTO': calls?.filter((s) => s.status === 'AGUARDANDO PAGAMENTO'),
      PAGO: calls?.filter((s) => s.status === 'PAGO'),
      CONCLUÍDO: calls?.filter((s) => s.status === 'CONCLUÍDO'),
    }).map(([key, value]) => ({ title: key, items: value }))
  }
  function onDragEnd(dragEndResult: DropResult) {
    function handleEffectivationUpdate(newValue: TPosVendaCall['status'], previousData: TPosVendaCall) {
      if (newValue === 'CONCLUÍDO') {
        if (previousData.status !== 'CONCLUÍDO') return new Date().toISOString()
        return previousData.dataEfetivacao
      }
      if (previousData.status === 'CONCLUÍDO') return null
      return previousData.dataEfetivacao
    }

    const { source, destination, draggableId } = dragEndResult

    if (!destination) return
    if (destination.droppableId === source.droppableId) return

    const call = calls?.find((p) => p._id === draggableId)
    if (!call) return
    handleUpdateCallStatus({
      id: draggableId,
      call: {
        status: destination.droppableId as TPosVendaCall['status'],
        dataEfetivacao: handleEffectivationUpdate(destination.droppableId as TPosVendaCall['status'], call),
      },
    })
  }

  const handleOnMutate = async () => await queryClient.cancelQueries({ queryKey: ['pos-venda-calls', filters] })
  const handleOnSettled = async () => await queryClient.invalidateQueries({ queryKey: ['pos-venda-calls', filters] })
  return (
    <div className="flex grow flex-col p-6">
      <div className="flex flex-col items-center border-b border-gray-300 px-1 py-2">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col items-center gap-2 lg:flex-row">
            <p className="text-center text-2xl font-black uppercase text-[#15599a]">CHAMADOS DE POS VENDA</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant={'ghost'} onClick={() => setFilterMenuIsOpen(true)}>
              FILTRAR
            </Button>
            <Button onClick={() => setNewCallIsOpen(true)}>NOVO CHAMADO</Button>
          </div>
        </div>
      </div>
      <FiltersShowcase filters={filters} updateFilters={updateFilters} />
      <PosVendaCallsStatistics />
      <DragDropContext onDragEnd={(e) => onDragEnd(e)}>
        <div className="flex max-h-[600px] w-full gap-3 overflow-x-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
          {isLoading ? <LoadingComponent /> : null}
          {isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
          {isSuccess ? (
            <>
              {getCallsByStatus(calls).map((callsByStatus) => (
                <FunnelList
                  key={callsByStatus.title}
                  session={session}
                  title={callsByStatus.title}
                  items={callsByStatus.items}
                  handleItemClick={(id) => setEditCallModal({ id, isOpen: true })}
                />
              ))}
            </>
          ) : null}
        </div>
      </DragDropContext>
      {newCallIsOpen ? (
        <NewPosVendaCall
          session={session}
          closeModal={() => setNewCallIsOpen(false)}
          callbacks={{
            onMutate: handleOnMutate,
            onSettled: handleOnSettled,
          }}
        />
      ) : null}
      {editCallModal.id && editCallModal.isOpen ? (
        <ControlPosVendaCall
          callId={editCallModal.id}
          session={session}
          closeModal={() => setEditCallModal({ id: null, isOpen: false })}
          callbacks={{
            onMutate: handleOnMutate,
            onSettled: handleOnSettled,
          }}
        />
      ) : null}
      {filterMenuIsOpen ? (
        <PosVendaCallsFilterMenu queryParams={filters} updateQueryParams={updateFilters} closeMenu={() => setFilterMenuIsOpen(false)} />
      ) : null}
    </div>
  )
}

export default PosVendaCallsPage

function PosVendaCallsStatistics() {
  const { data: statistics, isLoading, isError, isSuccess, filters, updateFilters } = useGetPosVendaCallsStatistics({})

  return (
    <div className="flex w-full flex-col gap-1 rounded-md border border-primary bg-[#fff] p-2 dark:bg-[#121212]">
      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full items-center gap-1">
          <ChartArea className="min-w-4 min-h-4 h-4 w-4" />
          <h1 className="text-sm font-bold tracking-tight">ESTATÍSTICAS</h1>
        </div>
        <h3 className="w-full text-sm tracking-tight text-muted-foreground">Estatísticas de chamados de pos venda</h3>
      </div>
      <div className="flex w-full items-center justify-end">
        <DateIntervalInput
          label="Período"
          labelClassName="text-xs font-medium leading-none tracking-tight"
          className="h-fit border-none p-0 px-2 py-0.5 shadow-none"
          value={{
            after: filters.periodAfter ? new Date(filters.periodAfter) : undefined,
            before: filters.periodBefore ? new Date(filters.periodBefore) : undefined,
          }}
          handleChange={(v) =>
            updateFilters({
              periodAfter: v.after ? v.after.toISOString() : undefined,
              periodBefore: v.before ? v.before.toISOString() : undefined,
            })
          }
        />
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-2 lg:flex-row">
        <div className="flex w-full flex-col rounded-xl border border-primary/30 bg-[#fff] p-3 shadow-sm dark:bg-[#121212] lg:w-1/3">
          <div className="flex items-center justify-between">
            <h1 className="text-sm font-medium uppercase tracking-tight">CHAMADOS CRIADOS</h1>
            <Plus className="min-w-4 min-h-4 h-4 w-4" />
          </div>
          <div className="mt-2 flex w-full flex-col">
            <div className="text-xl font-bold text-[#15599a]">{statistics?.criadas || 0}</div>
          </div>
        </div>
        <div className="flex w-full flex-col rounded-xl border border-primary/30 bg-[#fff] p-3 shadow-sm dark:bg-[#121212] lg:w-1/3">
          <div className="flex items-center justify-between">
            <h1 className="text-sm font-medium uppercase tracking-tight">CHAMADOS CONCLUÍDOS</h1>
            <Check className="min-w-4 min-h-4 h-4 w-4" />
          </div>
          <div className="mt-2 flex w-full flex-col">
            <div className="text-xl font-bold text-[#15599a]">{statistics?.concluidas || 0}</div>
          </div>
        </div>
        <div className="flex w-full flex-col rounded-xl border border-primary/30 bg-[#fff] p-3 shadow-sm dark:bg-[#121212] lg:w-1/3">
          <div className="flex items-center justify-between">
            <h1 className="text-sm font-medium uppercase tracking-tight">VALOR TOTAL</h1>
            <BadgeDollarSign className="min-w-4 min-h-4 h-4 w-4" />
          </div>
          <div className="mt-2 flex w-full flex-col">
            <div className="text-xl font-bold text-[#15599a]">{formatToMoney(statistics?.valorTotal || 0)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

type FiltersShowcaseProps = {
  filters: TGetAllPosVendaCallsInput
  updateFilters: (filters: Partial<TGetAllPosVendaCallsInput>) => void
}
function FiltersShowcase({ filters, updateFilters }: FiltersShowcaseProps) {
  const PeriodMap = {
    dataInsercao: 'DATA DE INSERÇÃO',
    dataEfetivacao: 'DATA DE EFETIVAÇÃO',
  }
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-end">
      {filters.periodAfter && filters.periodBefore && filters.periodField ? (
        <div className="flex items-center gap-1 rounded-lg bg-secondary px-2 py-1 text-[0.65rem]">
          <p className="text-primary/80">
            PERÍODO:{' '}
            <strong>
              {PeriodMap[filters.periodField]} {formatDateAsLocale(filters.periodAfter)} a {formatDateAsLocale(filters.periodBefore)}
            </strong>
          </p>
          <button
            type="button"
            onClick={() => updateFilters({ periodAfter: null, periodBefore: null, periodField: null })}
            className="rounded-lg bg-transparent p-1 text-primary hover:bg-primary/20"
          >
            <X size={12} />
          </button>
        </div>
      ) : null}

      {filters.search && filters.search.length > 0 ? (
        <div className="flex items-center gap-1 rounded-lg bg-secondary px-2 py-1 text-[0.65rem]">
          <p className="text-primary/80">
            BUSCA: <strong>{filters.search}</strong>
          </p>
          <button
            type="button"
            onClick={() => updateFilters({ search: null })}
            className="rounded-lg bg-transparent p-1 text-primary hover:bg-primary/20"
          >
            <X size={12} />
          </button>
        </div>
      ) : null}
      {filters.ongoingOnly ? (
        <div className="flex items-center gap-1 rounded-lg bg-secondary px-2 py-1 text-[0.65rem]">
          <p className="text-primary/80">APENAS CHAMADOS EM ANDAMENTO</p>
          <button
            type="button"
            onClick={() => updateFilters({ ongoingOnly: null })}
            className="rounded-lg bg-transparent p-1 text-primary hover:bg-primary/20"
          >
            <X size={12} />
          </button>
        </div>
      ) : null}
    </div>
  )
}

type FunnelListProps = {
  session: TAuthSession
  title: string
  items: TPosVendaCallDTO[]
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
  item: TPosVendaCallDTO
  index: number
  handleClick: (id: string) => void
}
function FunnelListItem({ item, index, handleClick }: FunnelListItemProps) {
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
              <h1 className="text-sm font-bold leading-none tracking-tight">{item.titulo}</h1>
            </div>
            <button
              type="button"
              onClick={() => handleClick(item._id)}
              className="flex items-center gap-1 rounded-lg bg-primary px-2 py-1 text-[0.6rem] text-secondary"
            >
              <Pencil width={10} height={10} />
              <p>EDITAR</p>
            </button>
          </div>
          <div className="flex w-full grow flex-col gap-2 px-2">
            {item.projeto ? (
              <>
                <div
                  className={cn('flex w-fit items-center gap-1 self-center rounded-lg px-2 py-1', getServiceTypeTagColor(item.projeto.tipo || ''))}
                >
                  <MdDashboard size={12} />
                  <h1 className="text-[0.5rem] font-medium">{item.projeto.tipo}</h1>
                </div>
              </>
            ) : null}
          </div>
          <div className="flex w-full items-center justify-center rounded bg-primary/10 p-2">
            <h1 className="whitespace-pre-line text-[0.6rem] font-medium">{item.descricao || 'DESCRIÇÃO NÃO DEFINIDA'}</h1>
          </div>
          <div className="flex w-full flex-wrap items-center justify-center">
            <div
              className={cn(
                'flex items-center gap-1 rounded-lg bg-secondary px-2 py-0.5 text-center text-[0.5rem] font-bold italic text-primary/80',
                {
                  'bg-gray-100 text-gray-700': !item.metadados.cobravel,
                  'bg-green-100 text-green-700': item.metadados.cobravel,
                }
              )}
            >
              <BadgeCheck className={cn('min-w-3 min-h-3 h-3 w-3')} />
              <p className={cn('text-[0.57rem] font-medium')}>{item.metadados.cobravel ? 'CHAMADO COBRÁVEL' : 'CHAMADO NÃO COBRÁVEL'}</p>
            </div>
          </div>
          <div className="flex w-full items-center justify-between gap-2">
            <div className="flex grow flex-wrap items-center gap-2">
              <div className="flex items-center gap-1">
                <Avatar className="h-4 w-4">
                  <AvatarFallback>{formatNameAsInitials(item.autor?.nome || '')}</AvatarFallback>
                  <AvatarImage src={item.autor?.avatar_url || undefined} />
                </Avatar>
                <p className="text-[0.65rem] font-light text-gray-400">{item.autor?.nome || ''}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex min-w-fit items-center gap-1">
                <BsCalendarPlus />
                <p className={'text-[0.65rem] font-medium text-gray-500'}>{formatDateAsLocale(item.dataInsercao, true)}</p>
              </div>

              {item.dataEfetivacao ? (
                <div className="flex items-center gap-1">
                  <BsCalendarCheck className="text-green-500" />
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
