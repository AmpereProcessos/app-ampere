import React, { useState } from 'react'

import { BsCalendarEvent, BsFunnelFill } from 'react-icons/bs'
import { FaPercentage } from 'react-icons/fa'
import dayjs from 'dayjs'
import { Pencil } from 'lucide-react'
import LoadingPage from '@/components/utils/LoadingPage'
import ErrorComponent from '@/components/utils/ErrorComponent'
import { getErrorMessage } from '@/utils/methods/handlers'
import { formatDate, formatDecimalPlaces, formatToMoney, GeneralVisibleHiddenExitMotionVariants } from '@/utils/constants'
import { formatDateAsLocale } from '@/utils/methods/formatting'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import TextInput from '@/components/inputs/Text'
import SelectInput from '@/components/inputs/Select'
import MultipleSelectInput from '@/components/inputs/MultipleSelect'
import { revenueSources } from '@/utils/select-options'
import type { TAuthSession } from '@/lib/authentication/types'
import { usePendingPayments } from '@/utils/methods/query/expenses'
import EditExpense from '../modals/EditExpense'
import { TPaymentUnwindSimplifiedDTO } from '@/utils/schemas/expenses'
import { costApportionments } from '@/model'
import { MdDashboard } from 'react-icons/md'
import { FaDiamond } from 'react-icons/fa6'
import DateInput from '@/components/inputs/Date'
import { formatDateInputChange } from '@/utils/methods/shared'

type PaymentsBlockProps = {
  session: TAuthSession
  storedPaymentsApportionmentsFilter: string[]
  storedPaymentsCategoriesFilter: string[]
}
function PaymentsBlock({ session, storedPaymentsApportionmentsFilter, storedPaymentsCategoriesFilter }: PaymentsBlockProps) {
  const [filterMenuIsOpen, setFilterMenuIsOpen] = useState<boolean>(false)
  const [editModal, setEditModal] = useState<{ id: string | null; isOpen: boolean }>({ id: null, isOpen: false })
  const {
    data: payments,
    isLoading,
    isSuccess,
    isError,
    error,
    filters,
    setFilters,
  } = usePendingPayments({
    initialFilters: { search: '', apportionments: storedPaymentsApportionmentsFilter, categories: storedPaymentsCategoriesFilter, previewPeriod: {} },
  })
  return (
    <div className="border-primary bg-background flex h-full max-h-full w-full flex-col gap-2 rounded border p-3 shadow-xs dark:bg-[#121212]">
      <div className="border-primary/30 flex w-full items-center justify-between gap-2 border-b pb-3">
        <h1 className="text-sm leading-none font-bold tracking-tight">PAGAMENTOS PENDENTES</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterMenuIsOpen((prev) => !prev)}
            className={cn(
              'text-primary hover:bg-primary/20 flex h-6 min-h-6 w-6 min-w-6 items-center justify-center rounded-full duration-300 ease-in-out',
              {
                'bg-primary/30': filterMenuIsOpen,
              }
            )}
          >
            <BsFunnelFill width={14} height={14} />
          </button>
        </div>
      </div>
      <AnimatePresence>{filterMenuIsOpen ? <PaymentsFilterMenu filters={filters} setFilters={setFilters} /> : null}</AnimatePresence>
      <div className="scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 flex w-full grow flex-col items-center gap-3 gap-y-1 overflow-y-auto overscroll-y-auto">
        {isLoading ? <LoadingPage /> : null}
        {isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
        {isSuccess ? (
          payments.length > 0 ? (
            payments.map((payment) => <PaymentCard key={payment._id} payment={payment} handleClick={(id) => setEditModal({ id, isOpen: true })} />)
          ) : (
            <div className="text-primary/80 w-full text-center text-sm font-medium tracking-tight">Nenhum pagamento pendente encontrado.</div>
          )
        ) : null}
      </div>
      {editModal.isOpen && editModal.id ? (
        <EditExpense session={session} expenseId={editModal.id} closeModal={() => setEditModal({ isOpen: false, id: null })} />
      ) : null}
    </div>
  )
}

export default PaymentsBlock

type PaymentCardProps = {
  payment: TPaymentUnwindSimplifiedDTO
  handleClick: (id: string) => void
}
function PaymentCard({ payment, handleClick }: PaymentCardProps) {
  function getStatusTag(payment: TPaymentUnwindSimplifiedDTO) {
    if (!!payment.pagamento.dataPagamento) return <h1 className="text-xxs min-w-fit rounded-lg bg-green-500 px-2 py-0.5 text-white">RECEBIDO</h1>

    const isForToday = dayjs().isSame(payment.pagamento.dataPrevisaoPagamento)
    if (isForToday) return <h1 className="text-xxs min-w-fit rounded-lg bg-orange-600 px-2 py-0.5 text-white">RECEBER HOJE</h1>

    const isOverDue = dayjs(new Date()).isAfter(payment.pagamento.dataPrevisaoPagamento)
    if (isOverDue) return <h1 className="text-xxs min-w-fit rounded-lg bg-red-600 px-2 py-0.5 text-white">EM ATRASO</h1>

    return <h1 className="text-xxs min-w-fit rounded-lg bg-blue-500 px-2 py-0.5 text-white">A RECEBER</h1>
  }
  return (
    <div className="border-primary bg-background flex w-full flex-col gap-1 rounded border p-2 shadow-xs dark:bg-[#121212]">
      <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm leading-none font-bold tracking-tight">{payment.pagamento.titulo}</p>
          <div className="bg-secondary text-xxs text-primary/80 flex items-center gap-1 rounded-lg px-2 py-0.5 text-center font-medium italic">
            <FaPercentage />
            <h1>
              PARCIAL DE{' '}
              <strong>
                {payment.pagamento.porcentagem
                  ? formatDecimalPlaces(payment.pagamento.porcentagem)
                  : formatDecimalPlaces(100 * (payment.pagamento.valor || 0 / payment.total))}
                %
              </strong>
            </h1>
          </div>
          {getStatusTag(payment)}
        </div>
        <h1 className="bg-primary text-secondary rounded-lg px-2 py-0.5 text-center text-[0.65rem] font-medium">
          {formatToMoney(payment.pagamento.valor || 0)}
        </h1>
      </div>
      <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex w-full flex-wrap items-center justify-center gap-2 lg:grow lg:justify-start">
          <div className="flex items-center gap-1">
            <MdDashboard width={8} height={8} />
            <h1 className="text-xxs text-primary py-0.5 text-center font-bold">{payment.rateio}</h1>
          </div>
          <div className="flex items-center gap-1">
            <FaDiamond width={8} height={8} />
            <h1 className="text-xxs text-primary py-0.5 text-center font-bold">{payment.categoria}</h1>
          </div>
        </div>
        <div className="flex w-full flex-wrap items-center justify-center gap-2 lg:min-w-fit lg:justify-end"></div>
      </div>

      <div className="flex w-full flex-col items-center justify-center gap-2 lg:flex-row lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            <BsCalendarEvent />
            <h1 className="text-primary/80 py-0.5 text-center text-[0.6rem] font-medium italic">PREVISTO PARA</h1>
            <p className="text-primary py-0.5 text-center text-[0.6rem] font-bold">{formatDateAsLocale(payment.pagamento.dataPrevisaoPagamento)}</p>
          </div>
        </div>
        <button
          onClick={() => handleClick(payment._id)}
          className="bg-primary text-secondary flex items-center gap-1 rounded-lg px-2 py-1 text-[0.6rem]"
        >
          <Pencil width={10} height={10} />
          <p>EDITAR</p>
        </button>
      </div>
    </div>
  )
}

type PaymentsFilterMenuProps = {
  filters: { search: string; apportionments: string[]; categories: string[]; previewPeriod: { after?: string | null; before?: string | null } }
  setFilters: React.Dispatch<
    React.SetStateAction<{
      search: string
      apportionments: string[]
      categories: string[]
      previewPeriod: { after?: string | null; before?: string | null }
    }>
  >
}
function PaymentsFilterMenu({ filters, setFilters }: PaymentsFilterMenuProps) {
  return (
    <motion.div
      key={'editor'}
      variants={GeneralVisibleHiddenExitMotionVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="bg-background border-primary/20 mt-2 flex w-full flex-col gap-2 rounded-md border p-2"
    >
      <MultipleSelectInput
        label="RATEIOS"
        labelClassName="text-[0.6rem]"
        holderClassName="text-xs p-2 min-h-[34px]"
        selected={filters.apportionments}
        handleChange={(value) => {
          setFilters((prev) => ({ ...prev, apportionments: value as string[] }))
          localStorage.setItem('payments-apportionments-filter', JSON.stringify(value))
        }}
        options={costApportionments.map((c, index) => ({ id: index + 1, label: c.nome, value: c.nome }))}
        onReset={() => {
          setFilters((prev) => ({ ...prev, apportionments: [] }))
          localStorage.setItem('payments-apportionments-filter', JSON.stringify([]))
        }}
        selectedItemLabel="NÃO DEFINIDO"
        width="100%"
      />

      <MultipleSelectInput
        label="CATEGORIAS"
        labelClassName="text-[0.6rem]"
        holderClassName="text-xs p-2 min-h-[34px]"
        selected={filters.categories}
        handleChange={(value) => {
          setFilters((prev) => ({ ...prev, categories: value as string[] }))
          localStorage.setItem('payments-categories-filter', JSON.stringify(value))
        }}
        options={costApportionments.flatMap((c) => c.categorias).map((c, index) => ({ id: index + 1, label: c.label, value: c.value }))}
        onReset={() => {
          setFilters((prev) => ({ ...prev, categories: [] }))
          localStorage.setItem('payments-categories-filter', JSON.stringify([]))
        }}
        selectedItemLabel="NÃO DEFINIDO"
        width="100%"
      />

      <DateInput
        label="PREVISTO PARA DEPOIS DE:"
        labelClassName="text-[0.6rem]"
        holderClassName="text-xs p-2 min-h-[34px]"
        value={formatDate(filters.previewPeriod.after)}
        handleChange={(value) => setFilters((prev) => ({ ...prev, previewPeriod: { ...prev.previewPeriod, after: formatDateInputChange(value) } }))}
        width="100%"
      />

      <DateInput
        label="PREVISTO PARA ANTES DE:"
        labelClassName="text-[0.6rem]"
        holderClassName="text-xs p-2 min-h-[34px]"
        value={formatDate(filters.previewPeriod.before)}
        handleChange={(value) => setFilters((prev) => ({ ...prev, previewPeriod: { ...prev.previewPeriod, before: formatDateInputChange(value) } }))}
        width="100%"
      />
    </motion.div>
  )
}
