import NumberInput from '@/components/inputs/Number'
import SelectInput from '@/components/inputs/Select'
import TextInput from '@/components/inputs/Text'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import PurchaseControlCompositionBlockTable from './utils/CompositionTable'
import { TPurchaseControl } from '@/utils/schemas/purchases'
import toast from 'react-hot-toast'
import { PurchaseCompositionItemCategories, units } from '@/utils/select-options'
import { BsCart } from 'react-icons/bs'
import { cn } from '@/lib/utils'
import { AnimatePresence } from 'framer-motion'
import PurchaseNewCompositionItem from './utils/NewCompositionItem'

type PurchaseControlCompositionBlockProps = {
  infoHolder: TPurchaseControl
  setInfoHolder: React.Dispatch<React.SetStateAction<TPurchaseControl>>
}
function PurchaseControlCompositionBlock({ infoHolder, setInfoHolder }: PurchaseControlCompositionBlockProps) {
  const [newCompositionItemMenuIsOpen, setNewCompositionItemMenuIsOpen] = useState<boolean>(false)
  const [compositionItemHolder, setCompositionItemHolder] = useState<TPurchaseControl['composicao'][number]>({
    categoria: 'OUTROS',
    descricao: '',
    qtde: 1,
    unidade: 'UN',
    valor: 0,
  })

  function addCompositionItem(item: TPurchaseControl['composicao'][number]) {
    setInfoHolder((prev) => ({ ...prev, composicao: [...prev.composicao, item] }))
  }

  function removeCompositionItem(index: number) {
    setInfoHolder((prev) => ({ ...prev, composicao: prev.composicao.filter((c, cIndex) => cIndex != index) }))
  }
  function updateCompositionItem(info: { index: number; item: Partial<TPurchaseControl['composicao'][number]> }) {
    setInfoHolder((prev) => ({
      ...prev,
      composicao: prev.composicao.map((cItem, cIndex) => (cIndex != info.index ? cItem : { ...cItem, ...info.item })),
    }))
  }

  function handleAddCompositionItem(info: TPurchaseControl['composicao'][number]) {
    if (info.descricao.trim().length <= 2) return toast.error('Preencha uma descrição de ao menos 2 caracteres para o item.')
    if (info.qtde <= 0) return toast.error('A quantidade deve ser maior que zero.')
    if (info.valor < 0) return toast.error('O valor não pode ser negativo.')

    addCompositionItem(info)
  }

  const compositionItemsTotal = infoHolder.composicao.reduce((acc, current) => acc + current.qtde * current.valor, 0)

  return (
    <div className="flex w-full grow flex-col gap-4">
      <h1 className="w-full rounded bg-primary p-1 text-center font-bold text-primary-foreground">COMPOSIÇÃO DA COMPRA</h1>
      <div className="flex w-full grow flex-col gap-2">
        <div className="flex w-full items-center justify-end">
          <button
            onClick={() => setNewCompositionItemMenuIsOpen((prev) => !prev)}
            className={cn('flex items-center gap-1 rounded-lg px-2 py-1 text-black duration-300 ease-in-out', {
              'bg-gray-300  hover:bg-red-300': newCompositionItemMenuIsOpen,
              'bg-green-300  hover:bg-green-400': !newCompositionItemMenuIsOpen,
            })}
          >
            <BsCart />
            <h1 className="text-xs font-medium tracking-tight">
              {!newCompositionItemMenuIsOpen ? 'ABRIR MENU DE NOVO ITEM' : 'FECHAR MENU DE NOVO ITEM'}
            </h1>
          </button>
        </div>
        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
            <div className="w-full lg:w-[25%]">
              <SelectInput
                label="CATEGORIA"
                selectedItemLabel="NÃO DEFINIDO"
                options={PurchaseCompositionItemCategories}
                value={compositionItemHolder.categoria}
                handleChange={(value) =>
                  setCompositionItemHolder((prev) => ({
                    ...prev,
                    categoria: value,
                  }))
                }
                onReset={() => {
                  setCompositionItemHolder((prev) => ({
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
                placeholder="Preencha a descrição do item..."
                value={compositionItemHolder.descricao}
                handleChange={(value) => setCompositionItemHolder((prev) => ({ ...prev, descricao: value }))}
                width="100%"
              />
            </div>
            <div className="w-full lg:w-[15%]">
              <SelectInput
                label="UNIDADE"
                selectedItemLabel="NÃO DEFINIDO"
                options={units}
                value={compositionItemHolder.unidade}
                handleChange={(value) =>
                  setCompositionItemHolder((prev) => ({
                    ...prev,
                    unidade: value,
                  }))
                }
                onReset={() => {
                  setCompositionItemHolder((prev) => ({
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
                value={compositionItemHolder.qtde}
                handleChange={(value) =>
                  setCompositionItemHolder((prev) => ({
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
                value={compositionItemHolder.valor}
                handleChange={(value) =>
                  setCompositionItemHolder((prev) => ({
                    ...prev,
                    valor: value,
                  }))
                }
                placeholder="Preencha o valor do item..."
                width="100%"
              />
            </div>
          </div>
          <div className="flex items-center justify-end">
            <Button onClick={() => handleAddCompositionItem(compositionItemHolder)} size={'sm'} type="button">
              ADICIONAR ITEM
            </Button>
          </div>
        </div>
        <AnimatePresence>
          {newCompositionItemMenuIsOpen ? <PurchaseNewCompositionItem addCompositionItem={addCompositionItem} /> : null}
        </AnimatePresence>

        <PurchaseControlCompositionBlockTable
          composition={infoHolder.composicao}
          removeCompositionItem={removeCompositionItem}
          updateCompositionItem={updateCompositionItem}
        />
        {compositionItemsTotal > infoHolder.total ? (
          <p className="w-full rounded border border-orange-400 bg-orange-50 p-1 text-center text-xs italic tracking-tight text-orange-400">
            Por favor, ajuste os valores dos itens da composição. A somatória dos itens atuais excede o valor total estabelecido para a compra.
          </p>
        ) : null}
        <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <NumberInput
              label="TOTAL PREVISTO PARA A COMPRA"
              placeholder="Preencha o valor previsto para a compra..."
              value={infoHolder.totalPrevisto || null}
              handleChange={(value) => setInfoHolder((prev) => ({ ...prev, totalPrevisto: value }))}
              width="100%"
            />
          </div>
          <div className="w-full lg:w-1/2">
            <NumberInput
              label="TOTAL DA COMPRA"
              placeholder="Preencha o valor total da compra..."
              value={infoHolder.total}
              handleChange={(value) => setInfoHolder((prev) => ({ ...prev, total: value }))}
              width="100%"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PurchaseControlCompositionBlock
