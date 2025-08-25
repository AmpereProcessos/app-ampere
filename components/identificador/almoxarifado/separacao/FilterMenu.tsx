import MultipleSelectInput from '@/components/inputs/MultipleSelect'
import NumberInput from '@/components/inputs/Number'
import TextInput from '@/components/inputs/Text'
import { GeneralVisibleHiddenExitMotionVariants } from '@/utils/constants'
import type { UseWarehouseProjectsParams } from '@/utils/methods/query/warehouse'
import { ServiceOrderStatus } from '@/utils/select-options'
import { AnimatePresence, motion } from 'framer-motion'
import React, { type SetStateAction, type Dispatch } from 'react'

type FilterMenuProps = {
  filters: UseWarehouseProjectsParams
  setFilters: Dispatch<SetStateAction<UseWarehouseProjectsParams>>
}
function FilterMenu({ filters, setFilters }: FilterMenuProps) {
  return (
    <AnimatePresence>
      <motion.div
        key={'editor'}
        variants={GeneralVisibleHiddenExitMotionVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="bg-background border-primary/20 mt-2 flex w-full flex-col gap-2 rounded-md border p-2"
      >
        <h1 className="text-sm font-bold tracking-tight">FILTROS</h1>
        <div className="flex w-full flex-col flex-wrap items-center justify-start gap-2 lg:flex-row">
          <div className="w-full lg:w-[450px]">
            <TextInput
              label="PESQUISA"
              value={filters.search}
              handleChange={(value) => {
                setFilters((prev) => ({ ...prev, search: value }))
              }}
              placeholder="Filtre pelo nome do kit..."
              labelClassName="text-xs font-medium tracking-tight text-black"
              width="100%"
            />
          </div>

          <div className="w-full lg:w-[450px]">
            <MultipleSelectInput
              width={'100%'}
              label={'STATUS DE ENTREGA'}
              selected={filters.deliveryStatus}
              options={[
                { id: 1, value: 'EM ROTA', label: 'EM ROTA' },
                {
                  id: 2,
                  value: 'AGUARDANDO COMPRA',
                  label: 'AGUARDANDO COMPRA',
                },
                {
                  id: 3,
                  value: 'ENTREGUE',
                  label: 'ENTREGUE',
                },
                { id: 4, value: 'CANCELADO', label: 'CANCELADO' },
              ]}
              selectedItemLabel={'SEM FILTRO'}
              labelClassName="text-xs font-medium tracking-tight text-black"
              handleChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  deliveryStatus: value as string[],
                }))
              }
              onReset={() =>
                setFilters((prev) => ({
                  ...prev,
                  deliveryStatus: [],
                }))
              }
            />
          </div>
          <div className="w-full lg:w-[450px]">
            <MultipleSelectInput
              width={'100%'}
              label={'STATUS DA OBRA'}
              selected={filters.executionStatus}
              options={ServiceOrderStatus}
              selectedItemLabel={'SEM FILTRO'}
              labelClassName="text-xs font-medium tracking-tight text-black"
              handleChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  executionStatus: value as string[],
                }))
              }
              onReset={() =>
                setFilters((prev) => ({
                  ...prev,
                  executionStatus: [],
                }))
              }
            />
          </div>
          <div className="w-full lg:w-[450px]">
            <MultipleSelectInput
              label="TOPOLOGIA"
              selected={filters.topology}
              options={[
                { id: 1, label: 'INVERSOR', value: 'INVERSOR' },
                {
                  id: 2,
                  label: 'MICRO-INVERSOR',
                  value: 'MICRO-INVERSOR',
                },
              ]}
              selectedItemLabel="NÃO DEFINIDO"
              labelClassName="text-xs font-medium tracking-tight text-black"
              handleChange={(value: string[] | []) => {
                setFilters((prev) => ({
                  ...prev,
                  topology: value,
                }))
              }}
              onReset={() => {
                setFilters((prev) => ({
                  ...prev,
                  topology: [],
                }))
              }}
              width="100%"
            />
          </div>
          <div className="w-full lg:w-[450px]">
            <NumberInput
              label="NÚMERO DE MÓDULOS MAIOR QUE"
              placeholder="Preencha um filtro para o número de módulos..."
              value={filters.modulesQtyGte}
              handleChange={(value) => setFilters((prev) => ({ ...prev, modulesQtyGte: value }))}
              labelClassName="text-xs font-medium tracking-tight text-black"
              width="100%"
            />
          </div>
          <div className="w-full lg:w-[450px]">
            <NumberInput
              label="NÚMERO DE MÓDULOS MENOR QUE"
              placeholder="Preencha um filtro para o número de módulos..."
              value={filters.modulesQtyLte}
              handleChange={(value) => setFilters((prev) => ({ ...prev, modulesQtyLte: value }))}
              labelClassName="text-xs font-medium tracking-tight text-black"
              width="100%"
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default FilterMenu
