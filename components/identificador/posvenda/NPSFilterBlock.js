import React from 'react'
import Select from 'react-select'

import { cidadesAtendidas, formatDate, vendedores } from '../../../utils/constants'

import TextInput from '../../inputs/Text'
import NumberInput from '../../inputs/Number'
import SelectInput from '../../inputs/Select'
import DateInput from '../../inputs/Date'
import MultipleSelectInput from '../../inputs/MultipleSelect'
import { allSellers } from '../../../utils/select-options'
import { formatDateInputChange } from '../../../utils/methods/shared'

function NPSFilterBlock({ filters, setFilters }) {
  return (
    <div className="mt-4 flex w-full flex-col gap-y-2">
      <div className="flex flex-col flex-wrap items-center justify-center gap-2 lg:flex-row">
        <TextInput
          label="NOME DO CONTRATO"
          placeholder="Digite o nome do contrato..."
          value={filters.search}
          handleChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
        />
        <div className="flex w-full flex-col gap-2 lg:w-fit lg:flex-row">
          <div className="flex items-center justify-center gap-x-2">
            <div className="w-full lg:w-[250px]">
              <DateInput
                width={'100%'}
                label={'DEPOIS DE'}
                value={filters.date.after ? formatDate(filters.date.after) : undefined}
                handleChange={(value) => setFilters((prev) => ({ ...prev, date: { ...prev.date, after: formatDateInputChange(value) } }))}
              />
            </div>
            <div className="w-full lg:w-[250px]">
              <DateInput
                width={'100%'}
                label={'ANTES DE'}
                value={filters.date.before ? formatDate(filters.date.before) : undefined}
                handleChange={(value) => setFilters((prev) => ({ ...prev, date: { ...prev.date, before: formatDateInputChange(value) } }))}
              />
            </div>
          </div>
          <div className="w-full lg:w-[250px]">
            <SelectInput
              width={'100%'}
              label={'CAMPO DE FILTRO'}
              value={filters.date.field1 && filters.date.field2 ? `${filters.date.field1}.${filters.date.field2}` : null}
              options={[
                { id: 1, label: 'COLETA DO NPS', value: 'jornada.dataNps' },
                { id: 2, label: 'TROCA DO MEDIDOR', value: 'medidor.data' },
              ]}
              selectedItemLabel={'SEM FILTRO'}
              handleChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  date: {
                    ...prev.date,
                    field1: value != null ? value.split('.')[0] : null,
                    field2: value != null ? value.split('.')[1] : null,
                  },
                }))
              }
              onReset={() =>
                setFilters((prev) => ({
                  ...prev,
                  date: {
                    field1: null,
                    field2: null,
                  },
                }))
              }
            />
          </div>
        </div>
        <div className="flex items-center justify-center gap-x-2">
          <div className="w-full lg:w-[250px]">
            <NumberInput
              label="MAIOR QUE"
              value={filters.npsRange.min}
              handleChange={(value) => setFilters((prev) => ({ ...prev, npsRange: { ...prev.npsRange, min: value } }))}
              width="100%"
            />
          </div>
          <div className="w-full lg:w-[250px]">
            <NumberInput
              label="MENOR QUE"
              value={filters.npsRange.max}
              handleChange={(value) => setFilters((prev) => ({ ...prev, npsRange: { ...prev.npsRange, max: value } }))}
              width="100%"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-wrap items-center justify-center gap-2 lg:flex-row">
        <div className="w-full lg:w-[250px]">
          <MultipleSelectInput
            width={'100%'}
            label={'CIDADE'}
            selected={filters.city}
            options={cidadesAtendidas.map((city, index) => ({ id: index + 1, label: city, value: city }))}
            selectedItemLabel={'SEM FILTRO'}
            handleChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                city: value,
              }))
            }
            onReset={() =>
              setFilters((prev) => ({
                ...prev,
                city: [],
              }))
            }
          />
        </div>
        <div className="w-full lg:w-[250px]">
          <MultipleSelectInput
            width={'100%'}
            label={'VENDEDOR'}
            selected={filters.sellerName}
            options={allSellers.map((seller, index) => ({ id: index + 1, label: seller.label, value: seller.value }))}
            selectedItemLabel={'SEM FILTRO'}
            handleChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                sellerName: value,
              }))
            }
            onReset={() =>
              setFilters((prev) => ({
                ...prev,
                sellerName: [],
              }))
            }
          />
        </div>
      </div>
      <div className="flex flex-col flex-wrap items-center justify-center gap-2 lg:flex-row">
        <div
          onClick={() => setFilters({ ...filters, unCollected: !filters.unCollected })}
          className={`cursor-pointer p-2 ${
            filters.unCollected ? 'bg-blue-500 text-white' : 'bg-transparent text-blue-500'
          } w-fit rounded border border-blue-500 font-bold`}
        >
          NÃO COLETADOS
        </div>
        <div
          onClick={() => setFilters({ ...filters, withObs: !filters.withObs })}
          className={`cursor-pointer p-2 ${
            filters.withObs ? 'bg-blue-500 text-white' : 'bg-transparent text-blue-500'
          } w-fit rounded border border-blue-500 font-bold`}
        >
          COM OBSERVAÇÕES
        </div>
        <div
          onClick={() => setFilters({ ...filters, withoutObs: !filters.withoutObs })}
          className={`cursor-pointer p-2 ${
            filters.withoutObs ? 'bg-blue-500 text-white' : 'bg-transparent text-blue-500'
          } w-fit rounded border border-blue-500 font-bold`}
        >
          SEM OBSERVAÇÕES
        </div>
      </div>
    </div>
  )
}

export default NPSFilterBlock
