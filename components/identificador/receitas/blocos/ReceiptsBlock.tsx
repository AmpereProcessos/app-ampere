import React, { useState } from 'react'

import { BsCalendarEvent, BsFunnelFill } from 'react-icons/bs'
import { FaPercentage } from 'react-icons/fa'
import dayjs from 'dayjs'
import { Pencil } from 'lucide-react'
import { usePendingReceipts } from '@/utils/methods/query/revenues'
import LoadingPage from '@/components/utils/LoadingPage'
import ErrorComponent from '@/components/utils/ErrorComponent'
import { getErrorMessage } from '@/utils/methods/handlers'
import { TReceiptUnwindSimplifiedDTO } from '@/utils/schemas/revenues'
import { formatDecimalPlaces, formatToMoney, GeneralVisibleHiddenExitMotionVariants } from '@/utils/constants'
import { formatDateAsLocale } from '@/utils/methods/formatting'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import TextInput from '@/components/inputs/Text'
import SelectInput from '@/components/inputs/Select'
import MultipleSelectInput from '@/components/inputs/MultipleSelect'
import { revenueSources } from '@/utils/select-options'
import { useLocalStorage } from '@/lib/hooks/local-storage'
import EditRevenue from '../EditRevenue'
import { Session } from 'next-auth'

type ReceiptsBlockProps = {
  session: Session
  initialReceiptsTypesFilter: string[]
}
function ReceiptsBlock({ session, initialReceiptsTypesFilter }: ReceiptsBlockProps) {
  const [filterMenuIsOpen, setFilterMenuIsOpen] = useState<boolean>(false)
  const [editModal, setEditModal] = useState<{ id: string | null; isOpen: boolean }>({ id: null, isOpen: false })
  const {
    data: receipts,
    isLoading,
    isSuccess,
    isError,
    error,
    filters,
    setFilters,
  } = usePendingReceipts({ initialFilters: { search: '', types: initialReceiptsTypesFilter } })
  return (
    <div className="flex h-full max-h-full w-full flex-col gap-2 rounded border border-primary bg-[#fff] p-3 shadow-sm dark:bg-[#121212]">
      <div className="flex w-full items-center justify-between gap-2 border-b border-primary/30 pb-3">
        <h1 className="text-sm font-bold leading-none tracking-tight">RECEBIMENTOS PENDENTES</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterMenuIsOpen((prev) => !prev)}
            className={cn(
              'min-h-6 min-w-6 flex h-6 w-6 items-center justify-center rounded-full text-primary duration-300 ease-in-out hover:bg-primary/20',
              {
                'bg-primary/30': filterMenuIsOpen,
              }
            )}
          >
            <BsFunnelFill width={14} height={14} />
          </button>
        </div>
      </div>
      <AnimatePresence>{filterMenuIsOpen ? <ReceiptsFilterMenu filters={filters} setFilters={setFilters} /> : null}</AnimatePresence>
      <div className="flex w-full grow flex-col items-center gap-3 gap-y-1 overflow-y-auto overscroll-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
        {isLoading ? <LoadingPage /> : null}
        {isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
        {isSuccess ? (
          receipts.length > 0 ? (
            receipts.map((receipt) => <ReceiptCard key={receipt._id} receipt={receipt} handleClick={(id) => setEditModal({ id, isOpen: true })} />)
          ) : (
            <div className="w-full text-center text-sm font-medium tracking-tight text-primary/80">Nenhum recebimento pendente encontrado.</div>
          )
        ) : null}
      </div>
      {editModal.isOpen && editModal.id ? (
        <EditRevenue session={session} revenueId={editModal.id} closeModal={() => setEditModal({ isOpen: false, id: null })} />
      ) : null}
    </div>
  )
}

export default ReceiptsBlock

type ReceiptCardProps = {
  receipt: TReceiptUnwindSimplifiedDTO
  handleClick: (id: string) => void
}
function ReceiptCard({ receipt, handleClick }: ReceiptCardProps) {
  function getStatusTag(receipt: TReceiptUnwindSimplifiedDTO) {
    if (!!receipt.fracionamento.dataRecebimento)
      return <h1 className="min-w-fit rounded-lg bg-green-500 px-2 py-0.5 text-[0.5rem] text-white">RECEBIDO</h1>
    const isForToday = dayjs().isSame(receipt.fracionamento.dataPrevisaoRecebimento)
    if (isForToday) return <h1 className="min-w-fit rounded-lg bg-orange-600 px-2 py-0.5 text-[0.5rem] text-white">RECEBER HOJE</h1>
    const isOverDue = dayjs(new Date()).isAfter(receipt.fracionamento.dataPrevisaoRecebimento)
    if (isOverDue) return <h1 className="min-w-fit rounded-lg bg-red-600 px-2 py-0.5 text-[0.5rem] text-white">EM ATRASO</h1>

    return <h1 className="min-w-fit rounded-lg bg-blue-500 px-2 py-0.5 text-[0.5rem] text-white">A RECEBER</h1>
  }
  return (
    <div className="flex w-full flex-col gap-1 rounded border border-primary bg-[#fff] p-2 shadow-sm dark:bg-[#121212]">
      <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-bold leading-none tracking-tight">{receipt.nome}</p>
          <div className="flex items-center gap-1 rounded-lg bg-secondary px-2 py-0.5 text-center text-[0.5rem] font-medium italic text-primary/80">
            <FaPercentage />
            <h1>
              PARCIAL DE{' '}
              <strong>
                {receipt.fracionamento.porcentagem
                  ? formatDecimalPlaces(receipt.fracionamento.porcentagem)
                  : formatDecimalPlaces(100 * (receipt.fracionamento.valor || 0 / receipt.total))}
                %
              </strong>
            </h1>
          </div>
          {getStatusTag(receipt)}
        </div>
        <h1 className="rounded-lg bg-primary px-2 py-0.5 text-center text-[0.65rem] font-medium text-secondary">
          {formatToMoney(receipt.fracionamento.valor || 0)}
        </h1>
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-2 lg:flex-row lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            <BsCalendarEvent />
            <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">PREVISTO PARA</h1>
            <p className="py-0.5 text-center text-[0.6rem] font-bold  text-primary">
              {formatDateAsLocale(receipt.fracionamento.dataPrevisaoRecebimento)}
            </p>
          </div>
        </div>
        <button
          onClick={() => handleClick(receipt._id)}
          className="flex items-center gap-1 rounded-lg bg-primary px-2 py-1 text-[0.6rem] text-secondary"
        >
          <Pencil width={10} height={10} />
          <p>EDITAR</p>
        </button>
      </div>
    </div>
  )
}

type ReceiptsFilterMenuProps = {
  filters: { search: string; types: string[] }
  setFilters: React.Dispatch<React.SetStateAction<{ search: string; types: string[] }>>
}
function ReceiptsFilterMenu({ filters, setFilters }: ReceiptsFilterMenuProps) {
  const [value, setValue] = useLocalStorage<string[]>('receipts-types-filter', [])
  return (
    <motion.div
      key={'editor'}
      variants={GeneralVisibleHiddenExitMotionVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="mt-2 flex w-full flex-col gap-2 rounded-md border border-gray-300 bg-[#fff] p-2"
    >
      <TextInput
        label="PESQUISA"
        value={filters.search}
        handleChange={(value) => {
          setFilters((prev) => ({ ...prev, search: value }))
        }}
        placeholder="Filtre pelo nome da receita..."
        labelClassName="text-xs font-medium tracking-tight text-black"
        width="100%"
      />
      <MultipleSelectInput
        label="TIPO DA RECEITA"
        selected={filters.types}
        handleChange={(value) => {
          setFilters((prev) => ({ ...prev, types: value as string[] }))
          setValue(value as string[])
        }}
        options={revenueSources}
        onReset={() => {
          setFilters((prev) => ({ ...prev, types: [] }))
          setValue([])
        }}
        selectedItemLabel="NÃO DEFINIDO"
        width="100%"
      />
    </motion.div>
  )
}
