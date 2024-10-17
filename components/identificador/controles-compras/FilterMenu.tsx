import CheckboxInput from '@/components/inputs/Checkbox'
import DateInput from '@/components/inputs/Date'
import MultipleSelectInput from '@/components/inputs/MultipleSelect'
import SelectInput from '@/components/inputs/Select'
import TextInput from '@/components/inputs/Text'
import { formatDate, GeneralVisibleHiddenExitMotionVariants } from '@/utils/constants'
import { TUsePurchaseControlsByFiltersFilters, usePurchaseControlsTags } from '@/utils/methods/query/purchase-controls'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useState } from 'react'

type PurchaseControlsFilterMenuProps = {
  filters: TUsePurchaseControlsByFiltersFilters
  updateFilters: (info: Partial<TUsePurchaseControlsByFiltersFilters>) => void
  queryLoading: boolean
  resetSelectedPage: () => void
}
function PurchaseControlsFilterMenu({ filters, updateFilters, queryLoading, resetSelectedPage }: PurchaseControlsFilterMenuProps) {
  const { data: tags } = usePurchaseControlsTags()
  const [filtersHolder, setFiltersHolder] = useState<TUsePurchaseControlsByFiltersFilters>(filters)

  return (
    <AnimatePresence>
      <motion.div
        key={'editor'}
        variants={GeneralVisibleHiddenExitMotionVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="mt-2 flex w-full flex-col gap-2 rounded-md border border-gray-300 bg-[#fff] p-2"
      >
        <h1 className="text-sm font-bold tracking-tight">FILTROS</h1>
        <div className="flex w-full flex-col flex-wrap items-center justify-start gap-2 lg:flex-row">
          <TextInput
            label="TÍTULO DO CONTROLE DE COMPRA"
            placeholder="Filtre pelo título da compra..."
            value={filtersHolder.title}
            handleChange={(value) => setFiltersHolder((prev) => ({ ...prev, title: value }))}
            labelClassName="text-xs font-medium tracking-tight text-black"
          />
          <TextInput
            label="NOME DO FORNECEDOR"
            placeholder="Filtre pelo nome do fornecedor..."
            value={filtersHolder.supplier}
            handleChange={(value) => setFiltersHolder((prev) => ({ ...prev, supplier: value }))}
            labelClassName="text-xs font-medium tracking-tight text-black"
          />
          <TextInput
            label="TRANSPORTADORA"
            placeholder="Filtre pelo nome da transportadora..."
            value={filtersHolder.carrier}
            handleChange={(value) => setFiltersHolder((prev) => ({ ...prev, carrier: value }))}
            labelClassName="text-xs font-medium tracking-tight text-black"
          />
          <div className="flex w-full flex-col items-center gap-2 lg:w-fit lg:flex-row">
            <div className="w-full lg:w-[180px]">
              <DateInput
                label="DEPOIS DE"
                labelClassName="text-xs font-medium tracking-tight text-black"
                value={formatDate(filtersHolder.period.after)}
                handleChange={(value) => setFiltersHolder((prev) => ({ ...prev, period: { ...prev.period, after: value } }))}
                width="100%"
              />
            </div>
            <div className="w-full lg:w-[180px]">
              <DateInput
                label="ANTES DE"
                labelClassName="text-xs font-medium tracking-tight text-black"
                value={formatDate(filtersHolder.period.before)}
                handleChange={(value) => setFiltersHolder((prev) => ({ ...prev, period: { ...prev.period, before: value } }))}
                width="100%"
              />
            </div>

            <SelectInput
              label="CAMPO DE FILTRO"
              labelClassName="text-xs font-medium tracking-tight text-black"
              value={filtersHolder.period.type}
              options={[
                { id: 1, label: 'DATA DE CRIAÇÃO', value: 'dataInsercao' },
                { id: 2, label: 'DATA DE LIBERAÇÃO', value: 'liberacao.data' },
                { id: 3, label: 'DATA DO PEDIDO', value: 'dataPedido' },
                { id: 5, label: 'PREVISÃO DA ENTREGA', value: 'entrega.dataPrevisao' },
                { id: 6, label: 'DATA DE ENTREGA', value: 'entrega.dataEfetivacao' },
                { id: 7, label: 'DATA DE CONCLUSÃO', value: 'dataEfetivacao' },
              ]}
              handleChange={(value) => setFiltersHolder((prev) => ({ ...prev, period: { ...prev.period, type: value } }))}
              onReset={() => setFiltersHolder((prev) => ({ ...prev, period: { ...prev.period, type: null } }))}
              selectedItemLabel="NÃO DEFINIDO"
            />
          </div>
          <MultipleSelectInput
            label="TAGS"
            labelClassName="text-xs font-medium tracking-tight text-black"
            selected={filtersHolder.tags}
            options={tags?.map((tag) => ({ id: tag._id, label: tag.titulo, value: tag._id })) || []}
            handleChange={(value) => setFiltersHolder((prev) => ({ ...prev, tags: value as string[] }))}
            onReset={() => setFiltersHolder((prev) => ({ ...prev, tags: [] }))}
            selectedItemLabel="NÃO DEFINIDO"
          />
        </div>
        <div className="flex w-full flex-col flex-wrap items-center justify-between gap-2 lg:flex-row">
          <div className="flex flex-wrap items-center gap-2">
            <div className="w-fit">
              <CheckboxInput
                labelFalse="PEDIDO PENDENTE"
                labelTrue="PEDIDO PENDENTE"
                checked={filtersHolder.pendingOrder}
                handleChange={(value) => setFiltersHolder((prev) => ({ ...prev, pendingOrder: value }))}
              />
            </div>
            <div className="w-fit">
              <CheckboxInput
                labelFalse="ENTREGA PENDENTE"
                labelTrue="ENTREGA PENDENTE"
                checked={filtersHolder.pendingDelivery}
                handleChange={(value) => setFiltersHolder((prev) => ({ ...prev, pendingDelivery: value }))}
              />
            </div>
          </div>
          <button
            disabled={queryLoading}
            onClick={() => {
              resetSelectedPage()
              updateFilters(filtersHolder)
            }}
            className="h-9 whitespace-nowrap rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow disabled:bg-gray-500 disabled:text-white enabled:hover:bg-blue-700 enabled:hover:text-white"
          >
            PESQUISAR
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default PurchaseControlsFilterMenu
