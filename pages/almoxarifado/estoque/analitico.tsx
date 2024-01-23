import MaterialBlock from '@/components/identificador/almoxarifado/estoque/MaterialBlock'
import NumberInput from '@/components/inputs/Number'
import TextInput from '@/components/inputs/Text'
import ErrorComponent from '@/components/utils/ErrorComponent'
import LoadingPage from '@/components/utils/LoadingPage'
import { formatToMoney } from '@/utils/constants'
import { useMaterials } from '@/utils/methods/query/materials'
import { TMaterialDTO } from '@/utils/schemas/materials'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useState } from 'react'
import { IoMdAlert, IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'
import { MdAttachMoney } from 'react-icons/md'
import { VscDiffAdded } from 'react-icons/vsc'

function StockAnalytics() {
  const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false)
  const { data: materials, isLoading, isError, isSuccess, filters, setFilters } = useMaterials()
  function getStats({ info }: { info?: TMaterialDTO[] }) {
    if (!info)
      return {
        materiais: 0,
        valor: 0,
        abaixoMinimo: 0,
      }
    const materials = info.length
    const value = info.reduce((acc, current) => acc + (current.qtde || 0) * (current.preco || 0), 0)
    const bellowMinimum = info.reduce((acc, current) => {
      const minDefined = current.qtdeMinima
      if (!minDefined) return acc
      const qty = current.qtde
      if (qty < minDefined) return acc + 1
      return acc
    }, 0)

    return {
      materiais: materials,
      valor: value,
      abaixoMinimo: bellowMinimum,
    }
  }
  return (
    <div className="flex grow flex-col p-6">
      <div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col items-center gap-2 lg:flex-row">
            <p className="text-center text-2xl font-black uppercase text-[#15599a]">ANÁLISE DE ESTOQUE</p>
          </div>
          {dropdownMenuVisible ? (
            <div className="cursor-pointer text-gray-600 hover:text-blue-400">
              <IoMdArrowDropupCircle style={{ fontSize: '25px' }} onClick={() => setDropdownMenuVisible(false)} />
            </div>
          ) : (
            <div className="cursor-pointer text-gray-600 hover:text-blue-400">
              <IoMdArrowDropdownCircle style={{ fontSize: '25px' }} onClick={() => setDropdownMenuVisible(true)} />
            </div>
          )}
        </div>
        <div className="my-2 flex w-full flex-col items-center justify-center gap-3 lg:flex-row">
          <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-3 shadow-sm lg:w-1/4">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium uppercase tracking-tight">MATERIAIS</h1>
              <VscDiffAdded />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: materials }).materiais}</div>
            </div>
          </div>
          <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-3 shadow-sm lg:w-1/4">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium uppercase tracking-tight">VALOR DO ESTOQUE</h1>
              <MdAttachMoney />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">{formatToMoney(getStats({ info: materials }).valor)} </div>
            </div>
          </div>
          <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-3 shadow-sm lg:w-1/4">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium uppercase tracking-tight">ABAIXO DO MÍNIMO</h1>
              <IoMdAlert />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: materials }).abaixoMinimo}</div>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {dropdownMenuVisible ? (
            <motion.div initial={{ scale: 0.8, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} className="mt-4 flex w-full flex-col gap-y-2">
              <div className="flex flex-col flex-wrap items-end justify-center gap-2 lg:flex-row">
                <TextInput
                  label={'NOME'}
                  value={filters.search}
                  placeholder={'Digite o nome do material...'}
                  handleChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
                />
                <div className="w-full lg:w-[250px]">
                  <NumberInput
                    label="MENOS QUE"
                    placeholder="Filtrar por menos quantidade que..."
                    value={filters.lessThan}
                    handleChange={(value) => setFilters((prev) => ({ ...prev, lessThan: value }))}
                    width="100%"
                  />
                </div>
                <div className="w-full lg:w-[250px]">
                  <NumberInput
                    label="MAIS QUE"
                    placeholder="Filtrar por mais quantidade que..."
                    value={filters.moreThan}
                    handleChange={(value) => setFilters((prev) => ({ ...prev, moreThan: value }))}
                    width="100%"
                  />
                </div>
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, minimumUndefined: !prev.minimumUndefined }))}
                  className={`rounded-md border border-gray-400 ${
                    filters.minimumUndefined ? 'bg-gray-400 text-white' : 'bg-transparent text-gray-400'
                  }  h-[49px] py-1 px-4 text-sm font-bold text-white`}
                >
                  MÍNIMO INDEFINIDO
                </button>
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, maximumUndefined: !prev.maximumUndefined }))}
                  className={`rounded-md border border-gray-400 ${
                    filters.maximumUndefined ? 'bg-gray-400 text-white' : 'bg-transparent text-gray-400'
                  }  h-[49px] py-1 px-4 text-sm font-bold text-white`}
                >
                  MÁXIMO INDEFINIDO
                </button>
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, belowMinimum: !prev.belowMinimum }))}
                  className={`rounded-md border border-red-400 ${
                    filters.belowMinimum ? 'bg-red-400 text-white' : 'bg-transparent text-red-400'
                  }  h-[49px] py-1 px-4 text-sm font-bold text-white`}
                >
                  MENOS QUE O MÍNIMO
                </button>
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, aboveMaximum: !prev.aboveMaximum }))}
                  className={`rounded-md border border-orange-400 ${
                    filters.aboveMaximum ? 'bg-orange-400 text-white' : 'bg-transparent text-orange-400'
                  }  h-[49px] py-1 px-4 text-sm font-bold text-white`}
                >
                  MAIS QUE O MÁXIMO
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      {isLoading ? <LoadingPage /> : null}
      {isError ? <ErrorComponent msg={'Erro ao carregar materiais.'} /> : null}
      {isSuccess ? (
        <div className="flex w-full flex-col gap-2 pt-2">
          {materials?.map((material) => <MaterialBlock key={material._id} material={material} />)}
        </div>
      ) : null}
    </div>
  )
}

export default StockAnalytics
