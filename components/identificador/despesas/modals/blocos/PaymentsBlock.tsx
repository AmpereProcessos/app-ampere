import DateInput from '@/components/inputs/Date'
import NumberInput from '@/components/inputs/Number'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatDate, GeneralVisibleHiddenExitMotionVariants } from '@/utils/constants'
import { formatDateInputChange } from '@/utils/methods/shared'
import { TExpense } from '@/utils/schemas/expenses'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { MdAddBox } from 'react-icons/md'
import ExpensePaymentsTable from './utils/PaymentsTable'

function getMissingPercentage({ payments }: { payments: TExpense['pagamentos'] }) {
  const currentTotal = payments.reduce((acc, current) => current.porcentagem + acc, 0)
  return 100 - currentTotal
}
type ExpensePaymentsBlockProps = {
  infoHolder: TExpense
  setInfoHolder: React.Dispatch<React.SetStateAction<TExpense>>
}
function ExpensePaymentsBlock({ infoHolder, setInfoHolder }: ExpensePaymentsBlockProps) {
  const [newPaymentMenuIsOpen, setNewPaymentMenuIsOpen] = useState<boolean>(false)

  const missingPercentage = getMissingPercentage({ payments: infoHolder.pagamentos })

  function addPayment(info: TExpense['pagamentos'][number]) {
    if (info.porcentagem > missingPercentage) return toast.error('Porcentagem excede o máximo permitido.')
    if (!info.dataPrevisaoPagamento) return toast.error('Preencha uma data de previsão de pagamento.')

    setInfoHolder((prev) => ({ ...prev, pagamentos: [...prev.pagamentos, info] }))
  }
  function updatePayment(info: { index: number; item: Partial<TExpense['pagamentos'][number]> }) {
    setInfoHolder((prev) => ({
      ...prev,
      pagamentos: prev.pagamentos.map((item, index) => (index === info.index ? { ...item, ...info.item } : item)),
    }))
  }
  function removePayment(index: number) {
    setInfoHolder((prev) => ({ ...prev, pagamentos: prev.pagamentos.filter((f, i) => i !== index) }))
  }
  return (
    <div className="flex w-full grow flex-col gap-4">
      <h1 className="w-full rounded bg-primary p-1 text-center font-bold text-primary-foreground">PAGAMENTOS DA DESPESA</h1>
      <div className="flex w-full flex-col gap-2">
        <p className="w-full text-center text-sm tracking-tight text-primary">
          Gerencie aqui os pagamentos da receita através do controle de previsões e da efetivação dos pagamentos.
        </p>
        <div className="flex w-full items-center justify-end">
          <button
            onClick={() => setNewPaymentMenuIsOpen((prev) => !prev)}
            className={cn('flex items-center gap-1 rounded-lg px-2 py-1 text-black duration-300 ease-in-out', {
              'bg-gray-300  hover:bg-red-300': newPaymentMenuIsOpen,
              'bg-green-300  hover:bg-green-400': !newPaymentMenuIsOpen,
            })}
          >
            <MdAddBox />
            <h1 className="text-xs font-medium tracking-tight">
              {!newPaymentMenuIsOpen ? 'ABRIR MENU DE NOVO PAGAMENTO' : 'FECHAR MENU DE NOVO PAGAMENTO'}
            </h1>
          </button>
        </div>
        {newPaymentMenuIsOpen ? (
          <NewPaymentMenu expenseTotal={infoHolder.total} missingPercentage={missingPercentage} addPayment={addPayment} />
        ) : null}
        <ExpensePaymentsTable
          payments={infoHolder.pagamentos}
          expenseTotal={infoHolder.total}
          updatePayment={updatePayment}
          removePayment={removePayment}
        />
      </div>
    </div>
  )
}

export default ExpensePaymentsBlock

type NewPaymentMenuProps = {
  expenseTotal: number
  missingPercentage: number
  addPayment: (info: TExpense['pagamentos'][number]) => void
}
function NewPaymentMenu({ expenseTotal, missingPercentage, addPayment }: NewPaymentMenuProps) {
  const [receiptHolder, setReceiptHolder] = useState<TExpense['pagamentos'][number]>({
    valor: 0,
    porcentagem: missingPercentage,
    dataPrevisaoPagamento: new Date().toISOString(),
  })

  useEffect(() => {
    setReceiptHolder((prev) => ({ ...prev, porcentagem: missingPercentage }))
  }, [missingPercentage])

  return (
    <AnimatePresence>
      <motion.div
        key={'menu-open'}
        variants={GeneralVisibleHiddenExitMotionVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="flex w-full flex-col gap-2 rounded border border-green-600 bg-[#fff] shadow-sm dark:bg-[#121212]"
      >
        <h1 className="rounded-tl rounded-tr bg-green-600 p-1 text-center text-xs text-white">NOVO RECEBIMENTO</h1>
        <div className="flex w-full grow flex-col gap-2 p-3">
          <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
            <div className="w-full lg:w-1/4">
              <NumberInput
                label="VALOR"
                labelClassName="text-sm tracking-tight"
                placeholder="Preencha aqui o valor do fracionamento..."
                value={receiptHolder.valor || null}
                handleChange={(value) => setReceiptHolder((prev) => ({ ...prev, valor: value, porcentagem: (value / expenseTotal) * 100 }))}
                width="100%"
              />
            </div>
            <div className="w-full lg:w-1/4">
              <NumberInput
                label="PORCENTAGEM"
                labelClassName="text-sm tracking-tight"
                placeholder="Preencha aqui a porcentagem do fracionamento..."
                value={receiptHolder.porcentagem}
                handleChange={(value) => setReceiptHolder((prev) => ({ ...prev, porcentagem: value, valor: (value * expenseTotal) / 100 }))}
                width="100%"
              />
            </div>
            <div className="w-full lg:w-1/4">
              <DateInput
                label="PREVISÃO DE PAGAMENTO"
                labelClassName="text-sm tracking-tight"
                value={receiptHolder.dataPrevisaoPagamento ? formatDate(receiptHolder.dataPrevisaoPagamento) : undefined}
                handleChange={(value) => setReceiptHolder((prev) => ({ ...prev, dataPrevisaoPagamento: formatDateInputChange(value) }))}
                width="100%"
              />
            </div>
            <div className="w-full lg:w-1/4">
              <DateInput
                label="DATA DE PAGAMENTO"
                labelClassName="text-sm tracking-tight"
                value={receiptHolder.dataPagamento ? formatDate(receiptHolder.dataPagamento) : undefined}
                handleChange={(value) => setReceiptHolder((prev) => ({ ...prev, dataPagamento: formatDateInputChange(value) }))}
                width="100%"
              />
            </div>
          </div>
          <div className="flex w-full items-center justify-end">
            <Button onClick={() => addPayment(receiptHolder)} size={'xs'}>
              ADICIONAR PAGAMENTO
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
