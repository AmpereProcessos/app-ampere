import MultipleSelectInput from '@/components/inputs/MultipleSelect'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Avatar from '@/components/utils/Avatar'
import { cn } from '@/lib/utils'
import { TPurchaseControlKanbanListExpandedModes, TPurchasesControlPageModes } from '@/pages/suprimentos/controle-compras'
import { handleSetCookie } from '@/utils/methods/cookies'
import { formatDateAsLocale, formatNameAsInitials, formatWithoutDiacritics } from '@/utils/methods/formatting'
import { getErrorMessage } from '@/utils/methods/handlers'
import { updatePurchaseControl } from '@/utils/methods/mutation/purchase-controls'
import { usePurchaseControls, usePurchaseControlsTags } from '@/utils/methods/query/purchase-controls'
import { TPurchaseControlKanbanSimplifiedDTO, TPurchaseControlSimplifiedDTO } from '@/utils/schemas/purchases'
import { PurchaseControlStatus } from '@/utils/select-options'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Factory, Package, Pencil, ScrollText, Tag, Truck } from 'lucide-react'
import type { TAuthSession } from '@/lib/authentication/types'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { BsCalendar, BsCalendarCheck, BsCalendarEvent, BsCalendarPlus } from 'react-icons/bs'
import { FaLocationDot, FaRotate } from 'react-icons/fa6'
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'
import { MdDashboard } from 'react-icons/md'
import NewPurchaseControl from './modals/NewPurchaseControl'
import ControlPurchaseControl from './modals/ControlPurchaseControl'

type TPurchaseControlByStatus = {
  title: string
  items: TPurchaseControlKanbanSimplifiedDTO[]
}

type PurchaseControlsGroupedModePageProps = {
  session: TAuthSession
  handleSetMode: (mode: TPurchasesControlPageModes) => void
  initialListExpandedModeOptions: TPurchaseControlKanbanListExpandedModes
}
function PurchaseControlsGroupedModePage({ session, handleSetMode, initialListExpandedModeOptions }: PurchaseControlsGroupedModePageProps) {
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
        'AGUARDANDO NOTA FUTURA': [],
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
      'AGUARDANDO NOTA FUTURA': purchaseControls.filter((c) => c.status == 'AGUARDANDO NOTA FUTURA'),
      'AGUARDANDO PAGAMENTO': purchaseControls.filter((c) => c.status == 'AGUARDANDO PAGAMENTO'),
      'AGUARDANDO COMPRA': purchaseControls.filter((c) => c.status == 'AGUARDANDO COMPRA'),
      'AGUARDANDO FATURAMENTO': purchaseControls.filter((c) => c.status == 'AGUARDANDO FATURAMENTO'),
      'AGUARDANDO DESPACHE': purchaseControls.filter((c) => c.status == 'AGUARDANDO DESPACHE'),
      'AGUARDANDO ENTREGA': purchaseControls.filter((c) => c.status == 'AGUARDANDO ENTREGA'),
      CONCLUÍDA: purchaseControls.filter((c) => c.status == 'CONCLUÍDA'),
      PENDÊNCIAS: purchaseControls.filter((c) => c.status == 'PENDÊNCIAS'),
    }).map(([key, value]) => ({ title: key, items: value }))
  }
  const purchaseControlsByStatus = getPurchaseControlsByStatus(purchaseControls || [])
  return (
    <div className="flex grow flex-col gap-2 p-6">
      <div className="border-primary/20 flex flex-col items-center justify-between border-b p-1">
        <div className="flex w-full flex-col items-center justify-between gap-2 gap-y-3 lg:flex-row">
          <div className="flex flex-col items-center gap-1 lg:flex-row">
            <div className="flex items-center gap-1">
              <p className="text-center text-2xl font-black text-[#15599a] uppercase">CONTROLES DE COMPRA</p>
            </div>
            <button
              onClick={() => handleSetMode('kanban')}
              className="text-primary/60 hover:text-primary/80 flex items-center gap-1 px-2 text-xs duration-300 ease-out"
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
              onClick={() => updateQueryParams({ queryPendingConclusion: !queryParams.queryPendingConclusion })}
              className={cn(
                'min-h-[46.6px] rounded p-2 text-xs font-bold text-white',
                queryParams.queryPendingConclusion ? 'bg-blue-600' : 'bg-primary/80'
              )}
            >
              {queryParams.queryPendingConclusion ? 'EM ANDAMENTO' : 'TODAS'}
            </button>
            <Button onClick={() => setNewPurchaseControlModalIsOpen(true)} className="min-h-[46.6px]">
              NOVO CONTROLE
            </Button>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col gap-2">
        {purchaseControlsByStatus.map((item) => (
          <PurchaseControlGroupBlock
            data={item}
            affectedQueryKey={['purchase-controls', queryParams]}
            handleItemClick={(id) => setEditPurchaseControlModal({ id, isOpen: true })}
            initialListExpandedModeOptions={initialListExpandedModeOptions}
          />
        ))}
      </div>
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

export default PurchaseControlsGroupedModePage

type PurchaseControlsGroupBlockProps = {
  data: TPurchaseControlByStatus
  handleItemClick: (id: string) => void
  initialListExpandedModeOptions: TPurchaseControlKanbanListExpandedModes

  affectedQueryKey: any[]
}

function PurchaseControlGroupBlock({ data, handleItemClick, affectedQueryKey, initialListExpandedModeOptions }: PurchaseControlsGroupBlockProps) {
  const initialListExpandedMode = initialListExpandedModeOptions[data.title] || null

  const [showItems, setShowItems] = useState<boolean>(initialListExpandedMode == 'inactive' ? false : true)
  return (
    <div className="flex w-full flex-col gap-1">
      <div
        className={cn('flex w-full items-center justify-between gap-2 rounded p-2 text-xs', {
          'bg-red-600': data.title == 'PENDENTE',
          'bg-primary/70': data.title === 'EM COTAÇÃO',
          'bg-teal-600': data.title === 'AGUARDANDO APROVAÇÃO',
          'bg-sky-500': data.title === 'AGUARDANDO NOTA FUTURA',
          'bg-orange-600': data.title === 'AGUARDANDO PAGAMENTO',
          'bg-blue-600': data.title === 'AGUARDANDO COMPRA',
          'bg-violet-600': data.title === 'AGUARDANDO FATURAMENTO',
          'bg-lime-600': data.title === 'AGUARDANDO DESPACHE',
          'bg-green-800': data.title === 'AGUARDANDO ENTREGA',
          'bg-green-500': data.title === 'CONCLUÍDA',
          'bg-red-800': data.title === 'PENDÊNCIAS',
        })}
      >
        <div className="flex items-center gap-1">
          {showItems ? (
            <div className="cursor-pointer text-white hover:text-blue-400">
              <IoMdArrowDropupCircle
                size={15}
                onClick={() => {
                  handleSetCookie({
                    ctx: null,
                    key: `puchases-control-kanban-(${formatWithoutDiacritics(data.title)})-list-expanded`,
                    value: 'inactive',
                    path: '/suprimentos/controle-compras',
                  })
                  setShowItems(false)
                }}
              />
            </div>
          ) : (
            <div className="cursor-pointer text-white hover:text-blue-400">
              <IoMdArrowDropdownCircle
                size={15}
                onClick={() => {
                  handleSetCookie({
                    ctx: null,
                    key: `puchases-control-kanban-(${formatWithoutDiacritics(data.title)})-list-expanded`,
                    value: 'active',
                    path: '/suprimentos/controle-compras',
                  })
                  setShowItems(true)
                }}
              />
            </div>
          )}
          <h1 className="text-xs font-bold text-white">{data.title}</h1>
        </div>

        <div className="flex items-center gap-1">
          <MdDashboard size={15} color="white" />
          <h1 className="text-xs font-medium tracking-tight text-white">
            {data.items.length > 1 ? `${data.items.length} controles de compra` : `${data.items.length} controle de compra`}
          </h1>
        </div>
      </div>
      {showItems ? (
        data.items.length > 0 ? (
          data.items.map((purchaseControl) => (
            <PurchaseControlCard
              key={purchaseControl._id}
              purchaseControl={purchaseControl}
              handleClick={(id) => handleItemClick(id)}
              affectedQueryKey={affectedQueryKey}
            />
          ))
        ) : (
          <div className="text-primary/80 w-full text-center text-sm font-medium tracking-tight">Nenhum controle de compra encontrado.</div>
        )
      ) : null}
    </div>
  )
}

type PurchaseControlCardProps = {
  purchaseControl: TPurchaseControlKanbanSimplifiedDTO
  handleClick: (id: string) => void
  affectedQueryKey: any[]
}
function PurchaseControlCard({ purchaseControl, handleClick, affectedQueryKey }: PurchaseControlCardProps) {
  const queryClient = useQueryClient()

  return (
    <div className="bg-background border-primary/60 relative flex w-full flex-col justify-between gap-1 rounded border p-2 shadow-xs">
      <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex items-center gap-2">
          <PurchaseControlStatusController
            purchaseControl={purchaseControl}
            updateCallbacks={{
              onSettled: async () => await queryClient.invalidateQueries({ queryKey: affectedQueryKey }),
            }}
          />

          <h1 className="text-sm leading-none font-bold tracking-tight">{purchaseControl.titulo}</h1>
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex w-full flex-wrap items-center justify-start gap-2 lg:grow">
          <h1 className="text-primary/80 py-0.5 text-center text-[0.6rem] font-medium italic">ETIQUETAS</h1>
          {purchaseControl.etiquetas.length > 0 ? (
            purchaseControl.etiquetas.map((tag, index) => (
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
                <h1 className="text-xxs font-bold tracking-tight">{tag.titulo}</h1>
              </div>
            ))
          ) : (
            <h1 className="text-primary/80 py-0.5 text-center text-[0.6rem] font-medium italic">NÃO DEFINIDAS</h1>
          )}
        </div>
        <div className="flex w-full flex-wrap items-center justify-center gap-2 lg:min-w-fit lg:justify-end">
          <div className="flex items-center gap-1">
            <Factory width={13} height={13} />
            <h1 className="text-primary/80 py-0.5 text-center text-[0.6rem] font-medium italic">FORNECEDOR</h1>
            <h1 className="text-primary py-0.5 text-center text-[0.6rem] font-bold">{purchaseControl.fornecedor.nome || 'N/A'}</h1>
          </div>

          <div className="flex items-center gap-1">
            <ScrollText width={13} height={13} />
            <h1 className="text-primary/80 py-0.5 text-center text-[0.6rem] font-medium italic">FATURAMENTOS</h1>
            <h1 className="text-primary py-0.5 text-center text-[0.6rem] font-bold">
              FATURAMENTOS {purchaseControl.faturamentos.filter((f) => !!f.data).length}/{purchaseControl.faturamentos.length}
            </h1>
          </div>
          <div className="flex items-center gap-1">
            <BsCalendar width={10} height={10} />
            <h1 className="text-primary/80 py-0.5 text-center text-[0.6rem] font-medium italic">PEDIDO</h1>
            <h1 className="text-primary py-0.5 text-center text-[0.6rem] font-bold">{formatDateAsLocale(purchaseControl.dataPedido) || 'N/A'}</h1>
          </div>
          <div className="flex items-center gap-1">
            <FaLocationDot width={10} height={10} />
            <h1 className="text-primary/80 py-0.5 text-center text-[0.6rem] font-medium italic">LOCALIZAÇÃO</h1>
            <h1 className="text-primary py-0.5 text-center text-[0.6rem] font-bold">
              {purchaseControl.entrega.localizacao.cidade} ({purchaseControl.entrega.localizacao.uf})
            </h1>
          </div>
          <div className="flex items-center gap-1">
            <BsCalendarEvent width={10} height={10} />
            <h1 className="text-primary/80 py-0.5 text-center text-[0.6rem] font-medium italic">PREVISÃO</h1>
            <h1 className="text-primary py-0.5 text-center text-[0.6rem] font-bold">
              {formatDateAsLocale(purchaseControl.entrega.dataPrevisao) || 'N/A'}
            </h1>
          </div>
          <div className="flex items-center gap-1">
            <BsCalendarCheck width={10} height={10} />
            <h1 className="text-primary/80 py-0.5 text-center text-[0.6rem] font-medium italic">EFETIVAÇÃO</h1>
            <h1 className="text-primary py-0.5 text-center text-[0.6rem] font-bold">
              {formatDateAsLocale(purchaseControl.entrega.dataEfetivacao) || 'N/A'}
            </h1>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            <BsCalendarPlus />
            <p className="text-primary/80 text-[0.65rem] font-medium">{formatDateAsLocale(purchaseControl.dataInsercao, true)}</p>
          </div>
          {purchaseControl.dataEfetivacao ? (
            <div className="flex items-center gap-1">
              <BsCalendarCheck color="#22c55e" />
              <p className="text-primary/80 text-[0.65rem] font-medium">{formatDateAsLocale(purchaseControl.dataEfetivacao, true)}</p>
            </div>
          ) : null}
          <div className="flex items-center gap-1">
            <Avatar
              url={purchaseControl.autor.avatar_url || undefined}
              width={20}
              height={20}
              fallback={formatNameAsInitials(purchaseControl.autor.nome)}
            />

            <p className="text-primary/80 text-[0.65rem] font-medium">{purchaseControl.autor.nome}</p>
          </div>
        </div>
        <button
          onClick={() => handleClick(purchaseControl._id)}
          className="bg-primary text-secondary flex items-center gap-1 rounded-lg px-2 py-1 text-[0.6rem]"
        >
          <Pencil width={10} height={10} />
          <p>EDITAR</p>
        </button>
      </div>
    </div>
  )
}

function PurchaseControlStatusController({
  purchaseControl,
  updateCallbacks,
}: {
  purchaseControl: TPurchaseControlKanbanSimplifiedDTO
  updateCallbacks?: { onMutate?: (data: { id: string; updates: any }) => void; onSuccess?: () => void; onSettled?: () => void }
}) {
  const { mutate, isPending } = useMutation({
    mutationKey: ['update-purchase-control-status', purchaseControl._id],
    mutationFn: updatePurchaseControl,
    onMutate: async (variables) => {
      if (!!updateCallbacks?.onMutate) updateCallbacks.onMutate({ id: variables.id, updates: variables.changes })
    },
    onSuccess: async (data) => {
      if (!!updateCallbacks?.onSuccess) updateCallbacks.onSuccess()
    },
    onSettled: async () => {
      if (!!updateCallbacks?.onSettled) updateCallbacks.onSettled()
    },
    onError: (error) => {
      const msg = getErrorMessage(error)
      return toast.error(msg)
    },
  })
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn('rounded-lg px-2 py-0.5 text-[0.65rem] font-medium text-white', {
              'bg-red-600': purchaseControl.status == 'PENDENTE',
              'bg-primary/70': purchaseControl.status === 'EM COTAÇÃO',
              'bg-teal-600': purchaseControl.status === 'AGUARDANDO APROVAÇÃO',
              'bg-sky-500': purchaseControl.status === 'AGUARDANDO NOTA FUTURA',
              'bg-orange-600': purchaseControl.status === 'AGUARDANDO PAGAMENTO',
              'bg-blue-600': purchaseControl.status === 'AGUARDANDO COMPRA',
              'bg-violet-600': purchaseControl.status === 'AGUARDANDO FATURAMENTO',
              'bg-lime-600': purchaseControl.status === 'AGUARDANDO DESPACHE',
              'bg-green-800': purchaseControl.status === 'AGUARDANDO ENTREGA',
              'bg-green-500': purchaseControl.status === 'CONCLUÍDA',
              'bg-red-800': purchaseControl.status === 'PENDÊNCIAS',
            })}
          >
            {purchaseControl.status}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>STATUS DA COMPRA</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {PurchaseControlStatus.map((status) => (
              <button
                className="w-full"
                disabled={isPending}
                onClick={() =>
                  mutate({
                    id: purchaseControl._id,
                    changes: { status: status.value as TPurchaseControlKanbanSimplifiedDTO['status'] },
                  })
                }
              >
                <DropdownMenuItem className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <div
                      className={cn('h-4 min-h-4 w-4 min-w-4 rounded-full', {
                        'bg-red-600': status.value == 'PENDENTE',
                        'bg-primary/70': status.value === 'EM COTAÇÃO',
                        'bg-teal-600': status.value === 'AGUARDANDO APROVAÇÃO',
                        'bg-sky-500': status.value === 'AGUARDANDO NOTA FUTURA',
                        'bg-orange-600': status.value === 'AGUARDANDO PAGAMENTO',
                        'bg-blue-600': status.value === 'AGUARDANDO COMPRA',
                        'bg-violet-600': status.value === 'AGUARDANDO FATURAMENTO',
                        'bg-lime-600': status.value === 'AGUARDANDO DESPACHE',
                        'bg-green-800': status.value === 'AGUARDANDO ENTREGA',
                        'bg-green-500': status.value === 'CONCLUÍDA',
                        'bg-red-800': status.value === 'PENDÊNCIAS',
                      })}
                    ></div>
                    <h1 className="text-xs">{status.label}</h1>
                  </div>
                </DropdownMenuItem>
              </button>
            ))}
            {/* <button
                   className="w-full"
                   disabled={isPending}
                   onClick={() => mutate({ activityId: activity.id, activity: { status: 'PENDENTE', dataConclusao: null }, responsibles: [] })}
                  >
                   <DropdownMenuItem className="flex items-center justify-between">
                     <div className="flex items-center gap-1">
                       <div className="min-h-4 min-w-4 h-4 w-4 rounded-full border border-primary"></div>
                       <h1>PENDENTE</h1>
                     </div>
                     {activity.status === 'PENDENTE' ? <Check size={15} /> : null}
                   </DropdownMenuItem>
                  </button>
                   <button
                   className="w-full"
                   disabled={isLoading}
                   onClick={() => mutate({ activityId: activity.id, activity: { status: 'EM ANDAMENTO', dataConclusao: null }, responsibles: [] })}
                  >
                   <DropdownMenuItem className="flex cursor-pointer items-center justify-between">
                     <div className="flex items-center gap-1">
                       <div className="min-h-4 min-w-4 flex h-4 w-4 items-center justify-center rounded-full border border-primary bg-blue-500 text-white">
                         <CircleDot size={12} />
                       </div>
                       <h1>EM ANDAMENTO</h1>
                     </div>
                     {activity.status === 'EM ANDAMENTO' ? <Check size={15} /> : null}
                   </DropdownMenuItem>
                  </button>
                  <button
                   className="w-full"
                   disabled={isLoading}
                   onClick={() => mutate({ activityId: activity.id, activity: { status: 'CONCLUÍDO', dataConclusao: new Date() }, responsibles: [] })}
                  >
                   <DropdownMenuItem className="flex cursor-pointer items-center justify-between">
                     <div className="flex items-center gap-1">
                       <div className="min-h-4 min-w-4 flex h-4 w-4 items-center justify-center rounded-full border border-primary bg-green-500 text-white">
                         <Check size={12} />
                       </div>
                       <h1>CONCLUÍDO</h1>
                     </div>
                     {activity.status === 'CONCLUÍDO' ? <Check size={15} /> : null}
                   </DropdownMenuItem>
                  </button> */}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
