import DateInput from '@/components/inputs/Date'
import SelectInput from '@/components/inputs/Select'
import TextInput from '@/components/inputs/Text'
import { equipesTecnicas, formatDate, GeneralVisibleHiddenExitMotionVariants, tiposDeServico } from '@/utils/constants'
import { formatDateInputChange } from '@/utils/methods/shared'
import { TPersonalizedProjectsFilter } from '@/utils/schemas/projects'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useState } from 'react'
import AllCities from '@/utils/jsons/cidades.json'
import MultipleSelectInputVirtualized from '@/components/inputs/MultipleSelectInputVirtualized'
import MultipleSelectInput from '@/components/inputs/MultipleSelect'
import { allSellers, customersAcquisitionChannels, insiders, serviceTypes } from '@/utils/select-options'
type FilterMenuProps = {
  updateFilters: (filters: TPersonalizedProjectsFilter) => void
  queryLoading: boolean
  resetSelectedPage: () => void
}
function FilterMenu({ updateFilters, queryLoading, resetSelectedPage }: FilterMenuProps) {
  const [filtersHolder, setFiltersHolder] = useState<TPersonalizedProjectsFilter>({
    name: '',
    period: { after: null, before: null, field: null },
    state: [],
    city: [],
    serviceType: [],
    seller: [],
    insider: [],
    technicalTeam: [],
    acquisitionChannel: [],
  })
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
            label="PESQUISA"
            value={filtersHolder.name}
            handleChange={(value) => {
              setFiltersHolder((prev) => ({ ...prev, name: value }))
            }}
            placeholder="Filtre pelo nome do cliente..."
            labelClassName="text-xs font-medium tracking-tight text-black"
          />
          <div className="flex w-full flex-col gap-2 lg:w-fit lg:flex-row">
            <div className="flex items-center justify-center gap-x-2">
              <div className="w-full lg:w-[250px]">
                <DateInput
                  width={'100%'}
                  label={'DEPOIS DE'}
                  value={filtersHolder.period.after ? formatDate(filtersHolder.period.after) : undefined}
                  handleChange={(value) => setFiltersHolder((prev) => ({ ...prev, period: { ...prev.period, after: formatDateInputChange(value) } }))}
                  labelClassName="text-xs font-medium tracking-tight text-black"
                />
              </div>
              <div className="w-full lg:w-[250px]">
                <DateInput
                  width={'100%'}
                  label={'ANTES DE'}
                  value={filtersHolder.period.before ? formatDate(filtersHolder.period.before) : undefined}
                  handleChange={(value) =>
                    setFiltersHolder((prev) => ({ ...prev, period: { ...prev.period, before: formatDateInputChange(value) } }))
                  }
                />
              </div>
            </div>
            <div className="w-full lg:w-[250px]">
              <SelectInput
                width={'100%'}
                label={'CAMPO DE FILTRO'}
                value={filtersHolder.period.field}
                options={[
                  { id: 1, label: 'DATA ASS.CONTRATO', value: 'contrato.dataAssinatura' },
                  { id: 2, label: 'DATA DE SOLICITAÇÃO DO PARECER', value: 'projeto.dataSolicitacaoAcesso' },
                  { id: 3, label: 'DATA DO PARECER', value: 'parecer.dataParecerDeAcesso' },
                  { id: 4, label: 'DATA PAG.KIT', value: 'compra.dataPagamento' },
                  { id: 5, label: 'DATA PEDIDO', value: 'compra.dataPedido' },
                  { id: 6, label: 'DATA DE PREV.ENTREGA', value: 'compra.previsaoEntrega' },
                  { id: 7, label: 'DATA DE ENTREGA', value: 'compra.dataEntrega' },
                  { id: 8, label: 'SAÍDA DE OBRA', value: 'obra.saida' },
                  { id: 9, label: 'PEDIDO DE VISTORIA', value: 'vistoria.dataPedido' },
                  { id: 10, label: 'TROCA DO MEDIDOR', value: 'medidor.data' },
                  { id: 11, label: 'DATA DE MANUTENÇÃO', value: 'manutencaoPreventiva.data' },
                ]}
                selectedItemLabel={'SEM FILTRO'}
                handleChange={(value) =>
                  setFiltersHolder((prev) => ({
                    ...prev,
                    period: {
                      ...prev.period,
                      field: value,
                    },
                  }))
                }
                onReset={() =>
                  setFiltersHolder((prev) => ({
                    ...prev,
                    period: {
                      ...prev.period,
                      field: null,
                    },
                  }))
                }
              />
            </div>
          </div>
          <div className="w-full lg:w-[200px]">
            <MultipleSelectInputVirtualized
              label="CIDADE"
              selected={filtersHolder.city}
              options={AllCities.map((c, index) => ({ id: index + 1, value: c, label: c }))}
              selectedItemLabel="NÃO DEFINIDO"
              handleChange={(value) => {
                setFiltersHolder((prev) => ({
                  ...prev,
                  city: value as string[],
                }))
              }}
              onReset={() => {
                setFiltersHolder((prev) => ({
                  ...prev,
                  city: [],
                }))
              }}
              width="100%"
              labelClassName="text-xs font-medium tracking-tight text-black"
            />
          </div>
          <div className="w-full lg:w-[200px]">
            <MultipleSelectInput
              label="CANAL DE AQUISIÇÃO"
              selected={filtersHolder.acquisitionChannel}
              options={customersAcquisitionChannels}
              selectedItemLabel="NÃO DEFINIDO"
              handleChange={(value) => {
                setFiltersHolder((prev) => ({
                  ...prev,
                  acquisitionChannel: value as string[],
                }))
              }}
              onReset={() => {
                setFiltersHolder((prev) => ({
                  ...prev,
                  acquisitionChannel: [],
                }))
              }}
              width="100%"
              labelClassName="text-xs font-medium tracking-tight text-black"
            />
          </div>
          <div className="w-full lg:w-[200px]">
            <MultipleSelectInput
              label="TIPO DE SERVIÇO"
              selected={filtersHolder.serviceType}
              options={serviceTypes}
              selectedItemLabel="NÃO DEFINIDO"
              handleChange={(value) => {
                setFiltersHolder((prev) => ({
                  ...prev,
                  serviceType: value as string[],
                }))
              }}
              onReset={() => {
                setFiltersHolder((prev) => ({
                  ...prev,
                  serviceType: [],
                }))
              }}
              width="100%"
              labelClassName="text-xs font-medium tracking-tight text-black"
            />
          </div>
          <div className="w-full md:w-[250px]">
            <MultipleSelectInput
              label="VENDEDOR"
              options={allSellers.map((s, index) => ({ id: index + 1, label: s.label, value: s.value }))}
              selected={filtersHolder.seller}
              handleChange={(value) => setFiltersHolder((prev) => ({ ...prev, seller: value as string[] }))}
              selectedItemLabel="TODOS"
              onReset={() => setFiltersHolder((prev) => ({ ...prev, seller: [] }))}
              labelClassName="text-xs font-medium tracking-tight text-black"
              width="100%"
            />
          </div>
          <div className="w-full md:w-[250px]">
            <MultipleSelectInput
              label="INSIDER"
              options={insiders.map((s, index) => ({ id: index + 1, label: s.label, value: s.value }))}
              selected={filtersHolder.insider}
              handleChange={(value) => setFiltersHolder((prev) => ({ ...prev, insider: value as string[] }))}
              selectedItemLabel="TODOS"
              onReset={() => setFiltersHolder((prev) => ({ ...prev, insider: [] }))}
              labelClassName="text-xs font-medium tracking-tight text-black"
              width="100%"
            />
          </div>
          <div className="w-full md:w-[250px]">
            <MultipleSelectInput
              label="EQUIPE TÉCNICA"
              options={equipesTecnicas}
              selected={filtersHolder.technicalTeam}
              handleChange={(value) => setFiltersHolder((prev) => ({ ...prev, technicalTeam: value as string[] }))}
              selectedItemLabel="TODOS"
              onReset={() => setFiltersHolder((prev) => ({ ...prev, technicalTeam: [] }))}
              labelClassName="text-xs font-medium tracking-tight text-black"
              width="100%"
            />
          </div>
        </div>
        <div className="flex w-full flex-col flex-wrap items-center justify-end gap-2 lg:flex-row">
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

export default FilterMenu
