import DateInput from '@/components/inputs/Date'
import NumberInput from '@/components/inputs/Number'
import TextInput from '@/components/inputs/Text'
import { formatDate, formatDecimalPlaces, formatToMoney, GeneralVisibleHiddenExitMotionVariants } from '@/utils/constants'
import { formatDateAsLocale } from '@/utils/methods/formatting'
import { formatDateInputChange } from '@/utils/methods/shared'
import { TExpense } from '@/utils/schemas/expenses'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useState } from 'react'
import { BsCalendar, BsCalendarCheck, BsPatchCheck } from 'react-icons/bs'
import { FaPercentage } from 'react-icons/fa'
import { MdAttachMoney, MdDelete, MdEdit } from 'react-icons/md'

type ExpensePaymentsTableProps = {
  payments: TExpense['pagamentos']
  expenseTotal: number
  updatePayment: (info: { index: number; item: Partial<TExpense['pagamentos'][number]> }) => void
  removePayment: (index: number) => void
}
function ExpensePaymentsTable({ payments, expenseTotal, updatePayment, removePayment }: ExpensePaymentsTableProps) {
  const paymentsTotal = payments.reduce((acc, current) => acc + (current.valor || 0), 0)

  return (
    <div className="border-primary/80 flex w-full flex-col rounded border-0 lg:border">
      <div className="bg-primary/80 hidden w-full items-center gap-2 rounded rounded-br-none rounded-bl-none p-1 lg:flex">
        <h1 className="w-[40%] text-center text-sm font-bold text-white">TÍTULO</h1>
        <h1 className="w-[40%] text-center text-sm font-bold text-white">VALOR</h1>
        <h1 className="w-[30%] text-center text-sm font-bold text-white">PREV. DE PAGAMENTO</h1>
        <h1 className="w-[30%] text-center text-sm font-bold text-white">DATA DE PAGAMENTO</h1>
      </div>
      <div className="bg-background flex w-full flex-col gap-2 p-1 dark:bg-[#121212]">
        {payments.length > 0 ? (
          payments.map((item, index) => (
            <PaymentTableItem
              key={index}
              item={item}
              expenseTotal={expenseTotal}
              handleRemove={() => removePayment(index)}
              handleUpdate={(info) => updatePayment({ index, item: info })}
            />
          ))
        ) : (
          <p className="text-primary/80 w-full text-center text-sm font-medium tracking-tight">Não há registros de pagamentos da despesa.</p>
        )}
        {paymentsTotal > expenseTotal ? (
          <p className="w-full rounded border border-orange-400 bg-orange-50 p-1 text-center text-xs tracking-tight text-orange-400 italic">
            Por favor, ajuste os valores dos pagamentos. A somatória dos pagamentos atuais excede o valor total estabelecido para a despesa.
          </p>
        ) : null}
      </div>
    </div>
  )
}

export default ExpensePaymentsTable

type PaymentTableItemProps = {
  item: TExpense['pagamentos'][number]
  expenseTotal: number
  handleUpdate: (item: TExpense['pagamentos'][number]) => void
  handleRemove: () => void
}
function PaymentTableItem({ item, expenseTotal, handleUpdate, handleRemove }: PaymentTableItemProps) {
  const [editMenuIsOpen, setEditMenuIsOpen] = useState<boolean>(false)
  const [itemHolder, setItemHolder] = useState<TExpense['pagamentos'][number]>(item)
  return (
    <>
      <AnimatePresence>
        <div className="bg-background hidden w-full flex-col gap-1 lg:flex dark:bg-[#121212]">
          <div className="flex w-full items-center gap-2 p-1">
            <div className="flex w-[40%] items-start gap-1">
              <div className="flex flex-col">
                <h1 className="text-xs tracking-tight">{item.titulo}</h1>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <FaPercentage size={10} />
                    <p className="text-primary/80 text-[0.65rem] leading-none font-light tracking-tight italic">
                      {formatDecimalPlaces(((item.valor || 0) / expenseTotal) * 100)}%
                    </p>
                  </div>
                </div>
                {/* <p className="text-[0.65rem] font-light italic leading-none tracking-tight text-primary/60">{item.categoria}</p> */}
              </div>
              <button
                onClick={() => setEditMenuIsOpen((prev) => !prev)}
                className="flex items-center justify-center rounded border border-orange-500 bg-orange-50 p-1 text-orange-500 duration-300 ease-in-out hover:border-orange-700 hover:text-orange-700"
              >
                <MdEdit size={10} />
              </button>
              <button
                onClick={() => handleRemove()}
                className="flex items-center justify-center rounded border border-red-500 bg-red-50 p-1 text-red-500 duration-300 ease-in-out hover:border-red-700 hover:text-red-700"
              >
                <MdDelete size={10} />
              </button>
            </div>
            <h1 className="w-[20%] text-center text-xs tracking-tight">{formatToMoney(item.valor || 0)}</h1>
            <h1 className="w-[20%] text-center text-xs tracking-tight">{formatDateAsLocale(item.dataPrevisaoPagamento || undefined) || '-'}</h1>
            <h1 className="w-[20%] text-center text-xs tracking-tight">{formatDateAsLocale(item.dataPagamento || undefined) || '-'}</h1>
          </div>
        </div>
        <div className="border-primary bg-background flex w-full flex-col rounded-md border p-2 lg:hidden dark:bg-[#121212]">
          <div className="flex w-full items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full border border-black p-1 text-[20px]">
                <MdAttachMoney size={15} />
              </div>
              {item.titulo ? (
                <p className="text-sm leading-none font-bold tracking-tight">{item.titulo}</p>
              ) : (
                <p className="text-sm leading-none font-bold tracking-tight">
                  PAGAMENTO DE <strong className="text-[#FF9B50]">{formatDecimalPlaces(((item.valor || 0) / expenseTotal) * 100)}%</strong>
                </p>
              )}
            </div>
            {!!item.valor && item.valor > 0 ? (
              <div className="bg-primary/80 flex min-w-fit items-center gap-2 rounded-full px-2 py-1">
                <h1 className="text-[0.65rem] font-medium text-white lg:text-xs">{formatToMoney(item.valor)}</h1>
              </div>
            ) : null}
          </div>
          <div className="flex w-full items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditMenuIsOpen((prev) => !prev)}
                type="button"
                className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-orange-200"
              >
                <MdEdit style={{ color: 'orange' }} size={15} />
              </button>
              <button
                onClick={() => handleRemove()}
                type="button"
                className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
              >
                <MdDelete style={{ color: 'red' }} size={15} />
              </button>
            </div>
            <div className="flex items-center gap-2">
              {item.dataPagamento ? (
                <div className="flex items-center gap-1">
                  <BsPatchCheck color="rgb(34,197,94)" />
                  <p className="text-primary/60 text-[0.6rem] lg:text-xs">PAGO</p>
                </div>
              ) : null}
              <div className="flex items-center gap-1">
                <BsCalendar />
                <p className="text-primary/80 text-[0.6rem] lg:text-xs">{formatDateAsLocale(item.dataPrevisaoPagamento || undefined)}</p>
              </div>
              {item.dataPagamento ? (
                <div className="flex items-center gap-1">
                  <BsCalendarCheck color="#22c55e " />
                  <p className="text-primary/80 text-[0.6rem] lg:text-xs">{formatDateAsLocale(item.dataPagamento || undefined)}</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        {editMenuIsOpen ? (
          <motion.div
            variants={GeneralVisibleHiddenExitMotionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex w-full flex-col gap-1 p-3"
          >
            <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
              <div className="w-full lg:w-[30%]">
                <TextInput
                  label="TÍTULO"
                  labelClassName="text-xs tracking-tight"
                  value={itemHolder.titulo}
                  placeholder="Preencha aqui um titulo para o recebimento..."
                  handleChange={(value) => setItemHolder((prev) => ({ ...prev, titulo: value }))}
                  width="100%"
                />
              </div>
              <div className="w-full lg:w-[20%]">
                <NumberInput
                  label="VALOR"
                  labelClassName="text-xs tracking-tight"
                  placeholder="Preencha aqui o valor do fracionamento..."
                  value={itemHolder.valor || null}
                  handleChange={(value) => setItemHolder((prev) => ({ ...prev, valor: value, porcentagem: (value / expenseTotal) * 100 }))}
                  width="100%"
                />
              </div>
              <div className="w-full lg:w-[10%]">
                <NumberInput
                  label="PORCENTAGEM"
                  labelClassName="text-xs tracking-tight"
                  placeholder="Preencha aqui a porcentagem do fracionamento..."
                  value={itemHolder.porcentagem}
                  handleChange={(value) => setItemHolder((prev) => ({ ...prev, porcentagem: value, valor: (value * expenseTotal) / 100 }))}
                  width="100%"
                />
              </div>
              <div className="w-full lg:w-[20%]">
                <DateInput
                  label="PREVISÃO DE PAGAMENTO"
                  labelClassName="text-xs tracking-tight"
                  value={itemHolder.dataPrevisaoPagamento ? formatDate(itemHolder.dataPrevisaoPagamento) : undefined}
                  handleChange={(value) => setItemHolder((prev) => ({ ...prev, dataPrevisaoPagamento: formatDateInputChange(value) }))}
                  width="100%"
                />
              </div>
              <div className="w-full lg:w-[20%]">
                <DateInput
                  label="DATA DE PAGAMENTO"
                  labelClassName="text-xs tracking-tight"
                  value={itemHolder.dataPagamento ? formatDate(itemHolder.dataPagamento) : undefined}
                  handleChange={(value) => setItemHolder((prev) => ({ ...prev, dataPagamento: formatDateInputChange(value) }))}
                  width="100%"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setEditMenuIsOpen(false)
                }}
                className="rounded bg-red-800 p-1 px-4 text-[0.6rem] font-medium text-white duration-300 ease-in-out hover:bg-red-700"
              >
                FECHAR
              </button>
              <button
                onClick={() => {
                  handleUpdate(itemHolder)
                  setEditMenuIsOpen(false)
                }}
                className="rounded bg-blue-800 p-1 px-4 text-[0.6rem] font-medium text-white duration-300 ease-in-out hover:bg-blue-700"
              >
                ATUALIZAR ITEM
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
