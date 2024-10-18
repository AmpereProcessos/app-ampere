import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MdDelete, MdEdit } from 'react-icons/md'
import { TbRulerMeasure } from 'react-icons/tb'
import { FaDollarSign } from 'react-icons/fa'
import SelectInput from '@/components/inputs/Select'
import { PurchaseCompositionItemCategories, units } from '@/utils/select-options'
import TextInput from '@/components/inputs/Text'
import NumberInput from '@/components/inputs/Number'
import { TPurchaseControl } from '@/utils/schemas/purchases'
import { renderProductCategoryIcon, renderUnitLabel } from '@/utils/methods/rendering'
import { formatToMoney, GeneralVisibleHiddenExitMotionVariants } from '@/utils/constants'

type PurchaseControlCompositionTableProps = {
  composition: TPurchaseControl['composicao']
  updateCompositionItem: (info: { index: number; item: Partial<TPurchaseControl['composicao'][number]> }) => void
  removeCompositionItem: (info: number) => void
}

function PurchaseControlCompositionTable({ composition, updateCompositionItem, removeCompositionItem }: PurchaseControlCompositionTableProps) {
  return (
    <div className="flex w-full flex-col rounded border-0 border-primary/80 lg:border">
      <div className="hidden w-full items-center gap-2 rounded rounded-bl-[0] rounded-br-[0] bg-gray-800 p-1 lg:flex">
        <h1 className="w-[30%] text-center text-sm font-bold text-white">ITEM</h1>
        <h1 className="w-[15%] text-center text-sm font-bold text-white">UNIDADE</h1>
        <h1 className="w-[15%] text-center text-sm font-bold text-white">QTDE</h1>
        <h1 className="w-[20%] text-center text-sm font-bold text-white">VALOR</h1>
        <h1 className="w-[20%] text-center text-sm font-bold text-white">TOTAL</h1>
      </div>
      <div className="flex w-full flex-col gap-2 bg-[#fff] p-1 dark:bg-[#121212]">
        {composition.length > 0 ? (
          composition.map((item, index) => (
            <PurchaseControlCompositionTableItem
              key={index}
              item={{ ...item }}
              handleUpdate={(item) => updateCompositionItem({ item, index })}
              handleRemove={() => removeCompositionItem(index)}
            />
          ))
        ) : (
          <p className="w-full text-center text-sm font-medium tracking-tight text-primary/80">Não há itens de composição da compra.</p>
        )}
      </div>
    </div>
  )
}

export default PurchaseControlCompositionTable

type PurchaseControlCompositionTableItemProps = {
  item: TPurchaseControl['composicao'][number]
  handleUpdate: (item: TPurchaseControl['composicao'][number]) => void
  handleRemove: () => void
}
function PurchaseControlCompositionTableItem({ item, handleUpdate, handleRemove }: PurchaseControlCompositionTableItemProps) {
  const [editMenuIsOpen, setEditMenuIsOpen] = useState<boolean>(false)
  const [itemHolder, setItemHolder] = useState<TPurchaseControl['composicao'][number]>(item)
  return (
    <>
      <AnimatePresence>
        <div className="hidden w-full flex-col gap-1 bg-[#fff] dark:bg-[#121212] lg:flex">
          <div className="flex w-full items-center gap-2 p-1">
            <div className="flex w-[30%] items-center gap-1">
              <div className="flex flex-col">
                <h1 className="text-xs tracking-tight">{item.descricao}</h1>
                <p className="text-[0.65rem] font-light italic leading-none tracking-tight text-primary/80">{item.categoria}</p>
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
            <h1 className="w-[15%] text-center text-xs tracking-tight">{item.unidade}</h1>
            <h1 className="w-[15%] text-center text-xs tracking-tight">{item.qtde}</h1>
            <h1 className="w-[20%] text-center text-xs tracking-tight">{item.valor ? formatToMoney(item.valor) : '-'}</h1>
            <h1 className="w-[20%] text-center text-xs tracking-tight">{item.valor ? formatToMoney(item.qtde * item.valor) : '-'}</h1>
          </div>
        </div>
        <div className="flex w-full flex-col rounded-md border border-primary bg-[#fff] p-2 dark:bg-[#121212] lg:hidden">
          <div className="flex w-full flex-col items-start justify-between gap-2">
            <div className="flex w-full items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full border border-black p-1 text-[20px]">
                  {renderProductCategoryIcon(item.categoria, 15)}
                </div>
                <p className="text-sm font-bold leading-none tracking-tight">
                  <strong className="text-[#FF9B50]">{item.qtde}</strong> x {item.descricao}
                </p>
              </div>
              {item.valor > 0 ? (
                <div className="flex min-w-fit items-center gap-2 rounded-full bg-gray-800 px-2 py-1 ">
                  <h1 className="text-[0.65rem] font-medium text-white lg:text-xs">{formatToMoney(item.qtde * item.valor)}</h1>
                </div>
              ) : null}
            </div>
            <div className="flex w-full items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <TbRulerMeasure />
                  <p className="text-[0.6rem] italic text-primary/80 lg:text-xs">{renderUnitLabel(item.unidade)}</p>
                </div>
                {item.valor > 0 ? (
                  <div className="flex items-center gap-1">
                    <FaDollarSign />
                    <p className="text-[0.6rem] italic text-primary/80 lg:text-xs">
                      {formatToMoney(item.valor)}/{item.unidade}
                    </p>
                  </div>
                ) : null}
              </div>
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
              <div className="w-full lg:w-[25%]">
                <SelectInput
                  label="CATEGORIA"
                  labelClassName="text-xs tracking-tight"
                  selectedItemLabel="NÃO DEFINIDO"
                  options={PurchaseCompositionItemCategories}
                  value={itemHolder.categoria}
                  handleChange={(value) =>
                    setItemHolder((prev) => ({
                      ...prev,
                      categoria: value,
                    }))
                  }
                  onReset={() => {
                    setItemHolder((prev) => ({
                      ...prev,
                      categoria: 'INSUMO',
                    }))
                  }}
                  width="100%"
                />
              </div>
              <div className="w-full lg:w-[25%]">
                <TextInput
                  label="DESCRIÇÃO"
                  labelClassName="text-xs tracking-tight"
                  placeholder="Preencha a descrição do item..."
                  value={itemHolder.descricao}
                  handleChange={(value) => setItemHolder((prev) => ({ ...prev, descricao: value }))}
                  width="100%"
                />
              </div>
              <div className="w-full lg:w-[15%]">
                <SelectInput
                  label="UNIDADE"
                  labelClassName="text-xs tracking-tight"
                  selectedItemLabel="NÃO DEFINIDO"
                  options={units}
                  value={itemHolder.unidade}
                  handleChange={(value) =>
                    setItemHolder((prev) => ({
                      ...prev,
                      unidade: value,
                    }))
                  }
                  onReset={() => {
                    setItemHolder((prev) => ({
                      ...prev,
                      unidade: 'UN',
                    }))
                  }}
                  width="100%"
                />
              </div>
              <div className="w-full lg:w-[15%]">
                <NumberInput
                  label="QTDE"
                  labelClassName="text-xs tracking-tight"
                  value={itemHolder.qtde}
                  handleChange={(value) =>
                    setItemHolder((prev) => ({
                      ...prev,
                      qtde: value,
                    }))
                  }
                  placeholder="Preencha a quantidade do item..."
                  width="100%"
                />
              </div>
              <div className="w-full lg:w-[20%]">
                <NumberInput
                  label="VALOR UNITÁRIO"
                  labelClassName="text-xs tracking-tight"
                  value={itemHolder.valor}
                  handleChange={(value) =>
                    setItemHolder((prev) => ({
                      ...prev,
                      valor: value,
                    }))
                  }
                  placeholder="Preencha o valor do item..."
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
