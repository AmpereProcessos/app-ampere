import DateInput from '@/components/inputs/Date'
import TextInput from '@/components/inputs/Text'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatDate, GeneralVisibleHiddenExitMotionVariants } from '@/utils/constants'
import { formatDateAsLocale } from '@/utils/methods/formatting'
import { formatDateInputChange } from '@/utils/methods/shared'
import { TPurchaseControl } from '@/utils/schemas/purchases'
import { AnimatePresence, motion } from 'framer-motion'
import { Barcode } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { BsCalendarCheck } from 'react-icons/bs'
import { MdAddBox, MdDelete, MdEdit } from 'react-icons/md'

type PurchaseControlBillingInformationBlockProps = {
  infoHolder: TPurchaseControl
  setInfoHolder: React.Dispatch<React.SetStateAction<TPurchaseControl>>
}
function PurchaseControlBillingInformationBlock({ infoHolder, setInfoHolder }: PurchaseControlBillingInformationBlockProps) {
  const [newBillingMenuIsOpen, setNewBillingMenuIsOpen] = useState<boolean>(false)

  function addBilling(bill: TPurchaseControl['faturamentos'][number]) {
    if (bill.titulo.trim().length == 0) return toast.error('Preencha um título para o registro de faturamento.')
    setInfoHolder((prev) => ({ ...prev, faturamentos: [...prev.faturamentos, bill] }))
  }
  function updateBilling(info: { index: number; item: TPurchaseControl['faturamentos'][number] }) {
    setInfoHolder((prev) => ({
      ...prev,
      faturamentos: prev.faturamentos.map((fat, index) => (index == info.index ? info.item : fat)),
    }))
  }
  function removeBilling(index: number) {
    setInfoHolder((prev) => ({ ...prev, faturamentos: prev.faturamentos.filter((f, i) => i != index) }))
  }
  return (
    <div className="flex w-full grow flex-col gap-4">
      <h1 className="w-full rounded bg-primary p-1 text-center font-bold text-primary-foreground">INFORMAÇÕES DO FATURAMENTO</h1>
      <div className="flex w-full items-center justify-end">
        <button
          onClick={() => setNewBillingMenuIsOpen((prev) => !prev)}
          className={cn('flex items-center gap-1 rounded-lg px-2 py-1 text-black duration-300 ease-in-out', {
            'bg-gray-300  hover:bg-red-300': newBillingMenuIsOpen,
            'bg-green-300  hover:bg-green-400': !newBillingMenuIsOpen,
          })}
        >
          <MdAddBox />
          <h1 className="text-xs font-medium tracking-tight">
            {!newBillingMenuIsOpen ? 'ABRIR MENU DE NOVO FATURAMENTO' : 'FECHAR MENU DE NOVO FATURAMENTO'}
          </h1>
        </button>
      </div>
      {newBillingMenuIsOpen ? <NewBillingMenu addBilling={addBilling} /> : null}
      <div className="flex w-full flex-col gap-2 bg-[#fff] p-1 dark:bg-[#121212]"></div>
      <div className="flex w-full grow flex-col gap-2">
        <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
          {infoHolder.faturamentos.length > 0 ? (
            infoHolder.faturamentos.map((item, index) => (
              <BillingCard
                key={index}
                billing={item}
                handleUpdate={(item) => updateBilling({ item, index })}
                handleRemove={() => removeBilling(index)}
              />
            ))
          ) : (
            <p className="w-full text-center text-sm font-medium tracking-tight text-primary/80">Não há itens de faturamento.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default PurchaseControlBillingInformationBlock

type NewBillingMenuProps = {
  addBilling: (bill: TPurchaseControl['faturamentos'][number]) => void
}
function NewBillingMenu({ addBilling }: NewBillingMenuProps) {
  const [billingHolder, setBillingHolder] = useState<TPurchaseControl['faturamentos'][number]>({
    titulo: '',
    codigoNotaFiscal: '',
    data: new Date().toISOString(),
  })

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
        <h1 className="rounded-tl rounded-tr bg-green-600 p-1 text-center text-xs text-white">NOVO REGISTRO DE FATURAMENTO</h1>
        <div className="flex w-full grow flex-col gap-2 p-3">
          <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
            <div className="w-full lg:w-1/3">
              <TextInput
                label="TÍTULO"
                placeholder="Preencha um título para identificação da nota..."
                value={billingHolder.titulo}
                handleChange={(value) => setBillingHolder((prev) => ({ ...prev, titulo: value }))}
                width="100%"
              />
            </div>
            <div className="w-full lg:w-1/3">
              <TextInput
                label="CÓDIGO DA NOTA FISCAL"
                placeholder="Preencha o código da nota fiscal..."
                value={billingHolder.codigoNotaFiscal || ''}
                handleChange={(value) => setBillingHolder((prev) => ({ ...prev, codigoNotaFiscal: value }))}
                width="100%"
              />
            </div>
            <div className="w-full lg:w-1/3">
              <DateInput
                label="DATA DE FATURAMENTO"
                value={formatDate(billingHolder.data)}
                handleChange={(value) => setBillingHolder((prev) => ({ ...prev, data: formatDateInputChange(value) as string }))}
                width="100%"
              />
            </div>
          </div>
          <div className="mt-2 flex w-full items-center justify-end gap-2">
            <Button onClick={() => addBilling(billingHolder)} type="button" size={'xs'}>
              ADICIONAR FATURAMENTO
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

type BillingCardProps = {
  billing: TPurchaseControl['faturamentos'][number]
  handleUpdate: (item: TPurchaseControl['faturamentos'][number]) => void
  handleRemove: () => void
}
function BillingCard({ billing, handleUpdate, handleRemove }: BillingCardProps) {
  const [editMenuIsOpen, setEditMenuIsOpen] = useState<boolean>(false)
  const [itemHolder, setItemHolder] = useState<TPurchaseControl['faturamentos'][number]>(billing)
  return (
    <>
      <AnimatePresence>
        <div className="relative flex w-full flex-col justify-between gap-1 rounded border border-gray-500 bg-[#fff] p-2 shadow-sm">
          <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
            <div className="flex flex-col items-center gap-1 lg:flex-row lg:gap-2">
              <h1 className="text-sm font-bold leading-none tracking-tight">{billing.titulo}</h1>
              <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                <div className="flex items-center gap-1">
                  <Barcode width={10} height={10} />
                  <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">CÓDIGO</h1>
                  <h1 className="py-0.5 text-center text-[0.6rem] font-bold  text-primary">{billing.codigoNotaFiscal}</h1>
                </div>
                <div className="flex items-center gap-1">
                  <BsCalendarCheck width={10} height={10} />
                  <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">FATURADO EM: </h1>
                  <h1 className="py-0.5 text-center text-[0.6rem] font-bold  text-primary">{formatDateAsLocale(billing.data) || 'N/A'}</h1>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
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
                <div className="w-full lg:w-1/3">
                  <TextInput
                    label="TÍTULO"
                    placeholder="Preencha um título para identificação da nota..."
                    value={itemHolder.titulo}
                    handleChange={(value) => setItemHolder((prev) => ({ ...prev, titulo: value }))}
                    width="100%"
                  />
                </div>
                <div className="w-full lg:w-1/3">
                  <TextInput
                    label="CÓDIGO DA NOTA FISCAL"
                    placeholder="Preencha o código da nota fiscal..."
                    value={itemHolder.codigoNotaFiscal || ''}
                    handleChange={(value) => setItemHolder((prev) => ({ ...prev, codigoNotaFiscal: value }))}
                    width="100%"
                  />
                </div>
                <div className="w-full lg:w-1/3">
                  <DateInput
                    label="DATA DE FATURAMENTO"
                    value={formatDate(itemHolder.data)}
                    handleChange={(value) => setItemHolder((prev) => ({ ...prev, data: formatDateInputChange(value) as string }))}
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
        </div>
      </AnimatePresence>
    </>
  )
}
