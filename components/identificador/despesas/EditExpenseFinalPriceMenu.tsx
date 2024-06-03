import NumberInput from '@/components/inputs/Number'
import TextInput from '@/components/inputs/Text'
import { GeneralVisibleHiddenExitMotionVariants } from '@/utils/constants'
import { TExpense } from '@/utils/schemas/expenses'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { MdEdit } from 'react-icons/md'
import { VscChromeClose } from 'react-icons/vsc'

type EditExpenseFinalPriceMenuProps = {
  infoHolder: TExpense
  setInfoHolder: React.Dispatch<React.SetStateAction<TExpense>>
}
function EditExpenseFinalPriceMenu({ infoHolder, setInfoHolder }: EditExpenseFinalPriceMenuProps) {
  const [finalValueHolder, setFinalValueHolder] = useState<number | null>(null)
  const [editFinalPriceMenuIsOpen, setEditFinalPriceMenuIsOpen] = useState<boolean>(false)
  function handleValueEditing(newFinalValue: number | null) {
    if (!newFinalValue || newFinalValue == 0) return toast.error('Preencha um valor válido.')
    const currentFinalValue = infoHolder.total
    const percentageDiff = (newFinalValue - currentFinalValue) / currentFinalValue
    const percentageMultiplier = 1 + percentageDiff
    const newExpenseItens = infoHolder.itens.map((i) => ({ ...i, preco: i.preco * percentageMultiplier }))
    setInfoHolder((prev) => ({ ...prev, itens: newExpenseItens, total: newFinalValue }))
    setEditFinalPriceMenuIsOpen(false)
    return toast.success('Valores atualizados com sucesso !')
  }
  return (
    <div className="flex w-full flex-col gap-1">
      <div className="flex w-full items-center justify-center">
        {!editFinalPriceMenuIsOpen ? (
          <button
            onClick={() => setEditFinalPriceMenuIsOpen(true)}
            className="flex items-center gap-1 rounded border border-orange-500 bg-orange-50 px-2 py-1 text-orange-500"
          >
            <p className="text-xs font-medium">EDITAR VALOR</p>
            <MdEdit />
          </button>
        ) : (
          <button
            onClick={() => setEditFinalPriceMenuIsOpen(false)}
            className="flex items-center gap-1 rounded border border-red-500 bg-red-50 px-2 py-1 text-red-500"
          >
            <p className="text-xs font-medium">FECHAR</p>
            <VscChromeClose />
          </button>
        )}
      </div>
      <AnimatePresence>
        {editFinalPriceMenuIsOpen ? (
          <motion.div
            key={'editor'}
            variants={GeneralVisibleHiddenExitMotionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex w-[70%] flex-col items-center gap-1 self-center rounded border border-gray-500 p-3 lg:w-[95%]"
          >
            <NumberInput
              label="VALOR FINAL"
              placeholder="Preencha aqui o valor final..."
              value={finalValueHolder}
              handleChange={(value) => setFinalValueHolder(value)}
            />
            <p className="w-full text-center text-xs tracking-tight text-gray-500">
              Preencha o valor final desejado para despesa e clique em <strong className="text-green-600">CONFIRMAR</strong>
            </p>
            <p className="w-full text-center text-xs tracking-tight text-gray-500">
              Ao confirmar, reajustaremos individualmente os valores de todos os itens com base na taxa de alteração.
            </p>
            <div className="flex w-full items-center justify-end">
              <button
                onClick={() => handleValueEditing(finalValueHolder)}
                className="w-fit rounded bg-green-600 px-2 py-1 text-xs font-medium text-white"
              >
                CONFIRMAR
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export default EditExpenseFinalPriceMenu
