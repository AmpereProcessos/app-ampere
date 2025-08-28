import { Button } from '@/components/ui/button'
import ErrorComponent from '@/components/utils/ErrorComponent'
import LoadingComponent from '@/components/utils/LoadingComponent'
import { TAuthSession } from '@/lib/authentication/types'
import { TGetManySupportCallsInput, TGetSupportCallsInput, TGetSupportCallsOutput, TGetSupportCallsOutputDefault } from '@/pages/api/chamados/suporte'
import { formatDateAsLocale, formatNameAsInitials } from '@/utils/methods/formatting'
import { getErrorMessage } from '@/utils/methods/handlers'
import { useSupportCalls } from '@/utils/methods/query/support-calls'
import { ArrowUpRight, Check, Diamond, Loader, X } from 'lucide-react'
import { ReactNode, useState } from 'react'
import { BsCalendarCheck, BsCalendarPlus } from 'react-icons/bs'
import { FaCity } from 'react-icons/fa'
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'
import NewSupportCall from './modals/NewSupportCall'
import { useQueryClient } from '@tanstack/react-query'
import EditSupportCall from './modals/EditSupportCall'
import { SlideMotionVariants, formatDate } from '@/utils/constants'
import { AnimatePresence, motion } from 'framer-motion'
import TextInput from '@/components/inputs/Text'
import SelectInput from '@/components/inputs/Select'
import DateInput from '@/components/inputs/Date'
import MultipleSelectInput from '@/components/inputs/MultipleSelect'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

type SupportCallsDatabaseProps = {
  session: TAuthSession
}

export function SupportCallsDatabase({ session }: SupportCallsDatabaseProps) {
  const queryClient = useQueryClient()
  const [filtersMenuIsOpen, setFiltersMenuIsOpen] = useState(false)

  const { data: supportCalls, isLoading, isError, isSuccess, error, filters, updateFilters } = useSupportCalls()

  const handleOnMutate = async () => {
    await queryClient.cancelQueries({ queryKey: ['support-calls', filters] })
  }
  const handleOnSettled = async () => {
    await queryClient.invalidateQueries({ queryKey: ['support-calls', filters] })
  }

  const [newSupportCallMenuIsOpen, setNewSupportCallMenuIsOpen] = useState(false)
  const [editSupportCallMenuId, setEditSupportCallMenuId] = useState<string | null>(null)

  return (
    <div className="flex w-full grow flex-col gap-6 p-6">
      <div className="border-primary/20 flex flex-col items-center justify-between gap-2 border-b p-1">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col items-center gap-2 lg:flex-row">
            <p className="text-center text-2xl font-black text-[#15599a] uppercase">BANCO DE CHAMADOS DE SUPORTE</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant={'default'} onClick={() => setNewSupportCallMenuIsOpen(true)}>
              CRIAR CHAMADO
            </Button>
            {filtersMenuIsOpen ? (
              <div className="text-primary/80 cursor-pointer hover:text-blue-400">
                <IoMdArrowDropupCircle style={{ fontSize: '25px' }} onClick={() => setFiltersMenuIsOpen(false)} />
              </div>
            ) : (
              <div className="text-primary/80 cursor-pointer hover:text-blue-400">
                <IoMdArrowDropdownCircle style={{ fontSize: '25px' }} onClick={() => setFiltersMenuIsOpen(true)} />
              </div>
            )}
          </div>
        </div>
      </div>
      <AnimatePresence>{filtersMenuIsOpen ? <SupportCallsDatabaseFilters filters={filters} updateFilters={updateFilters} /> : null}</AnimatePresence>
      {isLoading ? <LoadingComponent /> : null}
      {isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
      {isSuccess ? (
        <div className="flex flex-wrap justify-around gap-3">
          {supportCalls.map((call, index) => (
            <div key={call._id} className="w-full lg:w-[450px]">
              <SupportCard call={call} handleClick={() => setEditSupportCallMenuId(call._id)} />
            </div>
          ))}
        </div>
      ) : null}
      {newSupportCallMenuIsOpen ? (
        <NewSupportCall
          session={session}
          closeModal={() => setNewSupportCallMenuIsOpen(false)}
          callbacks={{
            onMutate: handleOnMutate,
            onSettled: handleOnSettled,
          }}
        />
      ) : null}
      {editSupportCallMenuId ? (
        <EditSupportCall
          callId={editSupportCallMenuId}
          session={session}
          closeModal={() => setEditSupportCallMenuId(null)}
          callbacks={{
            onMutate: handleOnMutate,
            onSettled: handleOnSettled,
          }}
        />
      ) : null}
    </div>
  )
}

type SupportCallsDatabaseFiltersProps = {
  filters: TGetManySupportCallsInput
  updateFilters: (filters: Partial<TGetManySupportCallsInput>) => void
}
function SupportCallsDatabaseFilters({ filters, updateFilters }: SupportCallsDatabaseFiltersProps) {
  return (
    <motion.div variants={SlideMotionVariants} initial="initial" animate="animate" exit="exit" className="mt-4 flex w-full flex-col gap-y-2">
      <div className="flex w-full flex-col items-center justify-start gap-2 md:flex-row">
        <div className="w-full md:w-[300px]">
          <TextInput
            label="PESQUISAR"
            value={filters.search ?? ''}
            placeholder="PESQUISAR CHAMADO..."
            handleChange={(value) => updateFilters({ search: value })}
            width="100%"
          />
        </div>
        <div className="w-full md:w-[300px]">
          <MultipleSelectInput
            label="STATUS"
            selected={filters.status ?? []}
            handleChange={(value) => updateFilters({ status: value as string[] })}
            options={[
              {
                id: 1,
                label: 'ABERTO',
                value: 'ABERTO',
              },
              {
                id: 2,
                label: 'EM ANDAMENTO',
                value: 'EM ANDAMENTO',
              },
              {
                id: 3,
                label: 'RESOLVIDO',
                value: 'RESOLVIDO',
              },
            ]}
            selectedItemLabel="NENHUM"
            onReset={() => updateFilters({ status: [] })}
            width="100%"
          />
        </div>
        <div className="w-full md:w-[300px]">
          <SelectInput
            label="CAMPO DE FILTRO DO PERÍODO"
            value={filters.periodField ?? ''}
            handleChange={(value) => updateFilters({ periodField: value as 'abertura' | 'fechamento' | null | undefined })}
            options={[
              {
                id: 1,
                label: 'ABERTURA',
                value: 'abertura',
              },
              {
                id: 2,
                label: 'FECHAMENTO',
                value: 'fechamento',
              },
            ]}
            selectedItemLabel="NENHUM"
            onReset={() => updateFilters({ periodField: null })}
            width="100%"
          />
        </div>
        <div className="w-full md:w-[300px]">
          <DateInput
            label="DATA DE INÍCIO"
            value={formatDate(filters.periodAfter)}
            handleChange={(value) => updateFilters({ periodAfter: value })}
            width="100%"
          />
        </div>
      </div>
    </motion.div>
  )
}

type SupportCardProps = {
  call: TGetSupportCallsOutputDefault[number]
  handleClick: () => void
}
function SupportCard({ call, handleClick }: SupportCardProps) {
  function renderSupportCallStatus(callStatus: TGetSupportCallsOutputDefault[number]['statusChamado']) {
    if (callStatus === 'RESOLVIDO')
      return (
        <div className={`inline-flex items-center gap-1 rounded-md bg-green-200 px-1.5 py-0.5 text-[0.65rem] font-bold text-green-700`}>
          <Check className="h-3 min-h-3 w-3 min-w-3" />
          RESOLVIDO
        </div>
      )
    if (callStatus === 'ABERTO')
      return (
        <div className={`inline-flex items-center gap-1 rounded-md bg-orange-200 px-1.5 py-0.5 text-[0.65rem] font-bold text-orange-700`}>
          <X className="h-3 min-h-3 w-3 min-w-3" />
          PENDENTE
        </div>
      )
    if (callStatus === 'EM ANDAMENTO')
      return (
        <div className={`inline-flex items-center gap-1 rounded-md bg-blue-200 px-1.5 py-0.5 text-[0.65rem] font-bold text-blue-700`}>
          <Loader className="h-3 min-h-3 w-3 min-w-3" />
          EM ANDAMENTO
        </div>
      )
  }
  return (
    <div className={'bg-card border-primary/20 flex w-full flex-col gap-3 rounded-xl border px-3 py-4 shadow-xs'}>
      <div className="flex items-center justify-between">
        <h1 className="text-xs font-medium tracking-tight uppercase">{call.nomeCliente ? call.nomeCliente : call.nomeUsina}</h1>
        {renderSupportCallStatus(call.statusChamado)}
      </div>
      <div className="flex w-full flex-wrap items-center justify-start gap-2">
        <SupportCardMetadata icon={<FaCity className="h-3 min-h-3 w-3 min-w-3" />} text={call.cidade ?? 'CIDADE NÃO INFORMADA'} />
        <SupportCardMetadata icon={<Diamond className="h-3 min-h-3 w-3 min-w-3" />} text={call.tipoChamado ?? 'TIPO NÃO INFORMADO'} />
        <SupportCardMetadata icon={<ArrowUpRight className="h-3 min-h-3 w-3 min-w-3" />} text={call.demanda ?? 'DEMANDA NÃO INFORMADA'} />
      </div>
      <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            <BsCalendarPlus />
            <p className="text-primary/80 text-[0.65rem] font-medium">{formatDateAsLocale(call.abertura, true)}</p>
          </div>
          {call.fechamento ? (
            <div className="flex items-center gap-1">
              <BsCalendarCheck color="#22c55e" />
              <p className="text-primary/80 text-[0.65rem] font-medium">{formatDateAsLocale(call.fechamento, true)}</p>
            </div>
          ) : null}
          <div className="flex items-center gap-1">
            <Avatar className="h-4 min-h-4 w-4 min-w-4">
              <AvatarImage src={call.responsavelUsuario?.avatar_url ?? undefined} />
              <AvatarFallback className="text-xs">{formatNameAsInitials(call.responsavelUsuario?.nome ?? 'N/A')}</AvatarFallback>
            </Avatar>
            <p className="text-primary/80 text-[0.65rem] font-medium">{call.responsavelUsuario?.nome ?? 'NÃO DEFINIDO'}</p>
          </div>
        </div>
        <Button onClick={handleClick} variant={'ghost'} size="fit" className="rounded px-2 py-1 text-xs">
          EDITAR
        </Button>
      </div>
    </div>
  )
}

type SupportCardMetadataProps = {
  icon: ReactNode
  text: string
}
function SupportCardMetadata({ icon, text }: SupportCardMetadataProps) {
  return (
    <div className="items-canter flex gap-1">
      {icon}
      <p className="text-primary/60 text-xs">{text}</p>
    </div>
  )
}
