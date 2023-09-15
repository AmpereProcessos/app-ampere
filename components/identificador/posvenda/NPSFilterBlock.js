import React from 'react'
import Select from 'react-select'
import { cidadesAtendidas, vendedores } from '../../../utils/constants'

function NPSFilterBlock({ filters, setFilters }) {
  return (
    <div className="flex flex-col w-full gap-y-2 mt-4">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-2 flex-wrap">
        <input
          className="outline-none p-1.5 w-[300px] rounded border border-gray-200 placeholder:italic"
          placeholder="Digite o nome do contrato"
          value={filters.search}
          onChange={(e) =>
            setFilters({
              ...filters,
              search: e.target.value,
            })
          }
        />
        <div className="flex flex-col lg:flex-row gap-2 w-full lg:w-fit">
          <div className="flex items-center gap-x-2 justify-center">
            <div className="flex flex-col w-fit items-center">
              <span className="uppercase font-bold font-raleway text-center text-sm">Depois de:</span>
              <input
                className="text-xs w-full text-center uppercase text-gray-600 outline-none"
                type="date"
                value={filters.date.after ? new Date(filters.date.after).toISOString().slice(0, 10) : undefined}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    date: { ...prev.date, after: isNaN(e.target.value) ? new Date(e.target.value).toISOString() : null },
                  }))
                }
              />
            </div>
            <div className="flex flex-col w-fit items-center">
              <span className="uppercase font-bold font-raleway text-center text-sm">Antes de:</span>
              <input
                className="text-xs w-full text-center uppercase text-gray-600 outline-none"
                type="date"
                value={filters.date.before ? new Date(filters.date.before).toISOString().slice(0, 10) : undefined}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    date: { ...prev.date, before: isNaN(e.target.value) ? new Date(e.target.value).toISOString() : null },
                  }))
                }
              />
            </div>
          </div>
          <div className="w-full lg:w-[250px]">
            <Select
              isMulti={false}
              placeholder={'CAMPO DE FILTRO'}
              styles={{
                control: (base, state) => ({
                  ...base,
                  width: '100%',
                  minHeight: '41px',
                }),
              }}
              options={[
                { label: 'COLETA DO NPS', value: 'jornada.dataNps' },
                { label: 'TROCA DO MEDIDOR', value: 'medidor.data' },
                { label: 'NÃO DEFINIDO', value: null },
              ]}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  date: {
                    ...prev.date,
                    field1: e.value != null ? e.value.split('.')[0] : null,
                    field2: e.value != null ? e.value.split('.')[1] : null,
                  },
                }))
              }
            />
          </div>
        </div>
        <Select
          isMulti
          placeholder="CIDADE"
          onChange={(e) =>
            setFilters({
              ...filters,
              city: e.map((x) => x.value),
            })
          }
          options={cidadesAtendidas.map((cidade) => {
            return {
              label: cidade,
              value: cidade,
            }
          })}
        />
        <Select
          isMulti
          placeholder="VENDEDOR"
          onChange={(e) =>
            setFilters({
              ...filters,
              seller: e.map((x) => x.value),
            })
          }
          options={vendedores.map((vendedor) => {
            return {
              label: vendedor.nome,
              value: vendedor.nome,
            }
          })}
        />
      </div>
      <div className="flex flex-col lg:flex-row items-center justify-center gap-2 flex-wrap">
        <div
          onClick={() => setFilters({ ...filters, unCollected: !filters.unCollected })}
          className={`cursor-pointer p-2 ${
            filters.unCollected ? 'bg-blue-500 text-white' : 'bg-transparent text-blue-500'
          } rounded font-bold w-fit border border-blue-500`}
        >
          NÃO COLETADOS
        </div>
        <div
          onClick={() => setFilters({ ...filters, withObs: !filters.withObs })}
          className={`cursor-pointer p-2 ${
            filters.withObs ? 'bg-blue-500 text-white' : 'bg-transparent text-blue-500'
          } rounded font-bold w-fit border border-blue-500`}
        >
          COM OBSERVAÇÕES
        </div>
        <div
          onClick={() => setFilters({ ...filters, withoutObs: !filters.withoutObs })}
          className={`cursor-pointer p-2 ${
            filters.withoutObs ? 'bg-blue-500 text-white' : 'bg-transparent text-blue-500'
          } rounded font-bold w-fit border border-blue-500`}
        >
          SEM OBSERVAÇÕES
        </div>
      </div>
    </div>
  )
}

export default NPSFilterBlock
