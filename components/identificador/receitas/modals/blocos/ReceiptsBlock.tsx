import DateInput from '@/components/inputs/Date'
import NumberInput from '@/components/inputs/Number'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatDate, GeneralVisibleHiddenExitMotionVariants } from '@/utils/constants'
import { formatDateInputChange } from '@/utils/methods/shared'
import { TRevenue } from '@/utils/schemas/revenues'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { MdAddBox } from 'react-icons/md'
import RevenueReceiptsTable from './utils/ReceiptsTable'

function getMissingPercentage({ fractionnement }: { fractionnement: TRevenue['fracionamento'] }) {
  const currentTotal = fractionnement.reduce((acc, current) => current.porcentagem + acc, 0)
  return 100 - currentTotal
}
type RevenueReceiptsBlockProps = {
  infoHolder: TRevenue
  setInfoHolder: React.Dispatch<React.SetStateAction<TRevenue>>
}
function RevenueReceiptsBlock({ infoHolder, setInfoHolder }: RevenueReceiptsBlockProps) {
  const [newReceiptMenuIsOpen, setNewReceiptMenuIsOpen] = useState<boolean>(false)

  const missingPercentage = getMissingPercentage({ fractionnement: infoHolder.fracionamento })

  function addReceipt(info: TRevenue['fracionamento'][number]) {
    if (info.porcentagem > missingPercentage) return toast.error('Porcentagem excede o máximo permitido.')
    if (!info.dataPrevisaoRecebimento) return toast.error('Preencha uma data de previsão de recebimento.')

    setInfoHolder((prev) => ({ ...prev, fracionamento: [...prev.fracionamento, info] }))
  }
  function updateReceipt(info: { index: number; item: Partial<TRevenue['fracionamento'][number]> }) {
    setInfoHolder((prev) => ({
      ...prev,
      fracionamento: prev.fracionamento.map((item, index) => (index === info.index ? { ...item, ...info.item } : item)),
    }))
  }
  function removeReceipt(index: number) {
    setInfoHolder((prev) => ({ ...prev, fracionamento: prev.fracionamento.filter((f, i) => i !== index) }))
  }

  return (
    <div className="flex w-full grow flex-col gap-4">
      <h1 className="w-full rounded bg-primary p-1 text-center font-bold text-primary-foreground">RECEBIMENTOS DA RECEITA</h1>
      <div className="flex w-full flex-col gap-2">
        <p className="w-full text-center text-sm tracking-tight text-primary">
          Gerencie aqui os recebimentos da receita através do controle de previsões e da efetivação dos recebimentos.
        </p>
        <div className="flex w-full items-center justify-end">
          <button
            onClick={() => setNewReceiptMenuIsOpen((prev) => !prev)}
            className={cn('flex items-center gap-1 rounded-lg px-2 py-1 text-black duration-300 ease-in-out', {
              'bg-gray-300  hover:bg-red-300': newReceiptMenuIsOpen,
              'bg-green-300  hover:bg-green-400': !newReceiptMenuIsOpen,
            })}
          >
            <MdAddBox />
            <h1 className="text-xs font-medium tracking-tight">
              {!newReceiptMenuIsOpen ? 'ABRIR MENU DE NOVO RECEBIMENTO' : 'FECHAR MENU DE NOVO RECEBIMENTO'}
            </h1>
          </button>
        </div>
        {newReceiptMenuIsOpen ? (
          <NewReceiptMenu revenueTotal={infoHolder.total} missingPercentage={missingPercentage} addReceipt={addReceipt} />
        ) : null}
        <RevenueReceiptsTable
          receipts={infoHolder.fracionamento}
          revenueTotal={infoHolder.total}
          updateReceipt={updateReceipt}
          removeReceipt={removeReceipt}
        />
      </div>
    </div>
  )
}

export default RevenueReceiptsBlock

type NewReceiptMenuProps = {
  revenueTotal: number
  missingPercentage: number
  addReceipt: (info: TRevenue['fracionamento'][number]) => void
}
function NewReceiptMenu({ revenueTotal, missingPercentage, addReceipt }: NewReceiptMenuProps) {
  const [receiptHolder, setReceiptHolder] = useState<TRevenue['fracionamento'][number]>({
    valor: 0,
    porcentagem: missingPercentage,
    dataPrevisaoRecebimento: new Date().toISOString(),
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
                handleChange={(value) => setReceiptHolder((prev) => ({ ...prev, valor: value, porcentagem: (value / revenueTotal) * 100 }))}
                width="100%"
              />
            </div>
            <div className="w-full lg:w-1/4">
              <NumberInput
                label="PORCENTAGEM"
                labelClassName="text-sm tracking-tight"
                placeholder="Preencha aqui a porcentagem do fracionamento..."
                value={receiptHolder.porcentagem}
                handleChange={(value) => setReceiptHolder((prev) => ({ ...prev, porcentagem: value, valor: (value * revenueTotal) / 100 }))}
                width="100%"
              />
            </div>
            <div className="w-full lg:w-1/4">
              <DateInput
                label="PREVISÃO DE RECEBIMENTO"
                labelClassName="text-sm tracking-tight"
                value={receiptHolder.dataPrevisaoRecebimento ? formatDate(receiptHolder.dataPrevisaoRecebimento) : undefined}
                handleChange={(value) => setReceiptHolder((prev) => ({ ...prev, dataPrevisaoRecebimento: formatDateInputChange(value) }))}
                width="100%"
              />
            </div>
            <div className="w-full lg:w-1/4">
              <DateInput
                label="DATA DE RECEBIMENTO"
                labelClassName="text-sm tracking-tight"
                value={receiptHolder.dataRecebimento ? formatDate(receiptHolder.dataRecebimento) : undefined}
                handleChange={(value) => setReceiptHolder((prev) => ({ ...prev, dataRecebimento: formatDateInputChange(value) }))}
                width="100%"
              />
            </div>
          </div>
          <div className="flex w-full items-center justify-end">
            <Button onClick={() => addReceipt(receiptHolder)} size={'xs'}>
              ADICIONAR RECEBIMENTO
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
