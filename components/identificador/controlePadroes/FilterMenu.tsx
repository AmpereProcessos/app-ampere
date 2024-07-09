import CheckboxInput from '@/components/inputs/Checkbox'
import MultipleSelectInput from '@/components/inputs/MultipleSelect'
import TextInput from '@/components/inputs/Text'
import { GeneralVisibleHiddenExitMotionVariants } from '@/utils/constants'
import { UsePAExecutionProjectsFilters } from '@/utils/methods/query/execution'
import { HomologationControlStatus } from '@/utils/select-options'
import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'

type PAAdequationsFilterMenuProps = {
  filterMenuIsOpen: boolean
  filters: UsePAExecutionProjectsFilters
  setFilters: React.Dispatch<React.SetStateAction<UsePAExecutionProjectsFilters>>
}
function PAAdequationsFilterMenu({ filterMenuIsOpen, filters, setFilters }: PAAdequationsFilterMenuProps) {
  return (
    <AnimatePresence>
      {filterMenuIsOpen ? (
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
              label="NOME DO PROJETO"
              placeholder="Preencha aqui o nome do projeto..."
              value={filters.search}
              handleChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
              width="100%"
            />
            <MultipleSelectInput
              label="CATEGORIA"
              labelClassName="text-xs font-medium tracking-tight text-black"
              selected={filters.segments}
              handleChange={(value) => setFilters((prev) => ({ ...prev, segments: value as string[] }))}
              options={[
                { id: 1, value: 'COMERCIAL', label: 'COMERCIAL' },
                { id: 2, value: 'INDUSTRIAL', label: 'INDUSTRIAL' },
                { id: 3, value: 'RESIDENCIAL', label: 'RESIDENCIAL' },
                { id: 4, value: 'RURAL', label: 'RURAL' },
              ]}
              selectedItemLabel="NÃO DEFINIDO"
              onReset={() => setFilters((prev) => ({ ...prev, segments: [] }))}
            />
            <MultipleSelectInput
              label="STATUS DO PARECER DE ACESSO"
              labelClassName="text-xs font-medium tracking-tight text-black"
              selected={filters.accessStatus}
              handleChange={(value) => setFilters((prev) => ({ ...prev, accessStatus: value as string[] }))}
              options={HomologationControlStatus}
              selectedItemLabel="NÃO DEFINIDO"
              onReset={() => setFilters((prev) => ({ ...prev, accessStatus: [] }))}
            />
          </div>
          <div className="flex w-full flex-col flex-wrap items-center justify-start gap-2 lg:flex-row">
            <div className="w-fit">
              <CheckboxInput
                labelFalse="PENDÊNCIAS APTAS PARA EXECUÇÃO"
                labelTrue="PENDÊNCIAS APTAS PARA EXECUÇÃO"
                checked={filters.pendingPaid}
                handleChange={(value) => setFilters((prev) => ({ ...prev, pendingPaid: value }))}
              />
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export default PAAdequationsFilterMenu
