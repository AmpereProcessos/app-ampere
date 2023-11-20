import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { AnimatePresence, motion } from 'framer-motion'

import dayjs from 'dayjs'

import { useServiceOrders } from '../../utils/methods/query/serviceOrders'
import { cidadesAtendidas, serviceOrdersCategories } from '../../utils/constants'

import DesignationCard from '../../components/identificador/ordensDeServico/DesignationCard'
import LoadingPage from '../../components/utils/LoadingPage'

import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'

import TextInput from '../../components/inputs/Text'
import MultipleSelectInput from '../../components/inputs/MultipleSelect'
import { VscDiffAdded } from 'react-icons/vsc'
import { FaHourglassHalf, FaTools } from 'react-icons/fa'
import { MdOutlineAssignmentInd } from 'react-icons/md'

var currentDate = new Date()
const afterDateParam = new Date(currentDate.setMonth(currentDate.getMonth() - 3)).toISOString()
const beforeDateParam = new Date().toISOString()

function groupByResponsible(orders) {
  if (!orders) return undefined
  const grouped = orders.reduce((acc, current) => {
    const responsibleName = current.responsavel?.nome || 'NÃO DEFINIDO'
    if (!acc[responsibleName]) {
      acc[responsibleName] = []
    }
    acc[responsibleName].push(current)
    return acc
  }, {})
  return grouped
}
function renderGroupedByResponsible(orders) {
  const grouped = groupByResponsible(orders)
  if (!grouped) return null

  return Object.entries(grouped).map(([key, value], index) => (
    <div key={index} className="flex flex-col w-full">
      <h1 className="w-full p-2 rounded-md text-center text-white font-bold bg-gray-800 mt-4">{key}</h1>
      <div className="mt-1 grid grid-cols-1 lg:grid-cols-3 w-full gap-5">
        {value.map((order, index2) => (
          <DesignationCard key={order._id} order={order} />
        ))}
      </div>
    </div>
  ))
}
function ControleDeOSs({ arr }) {
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/authHome')
    },
  })
  const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false)

  const {
    data: orders,
    isSuccess,
    isLoading,
    isError,
    filters,
    setFilters,
  } = useServiceOrders({
    after: afterDateParam,
    before: beforeDateParam,
    status: 'EM ABERTO',
    simplified: false,
    enabled: !!session,
  })
  function getStats({ info }) {
    if (!info)
      return {
        ordens: 0,
        emAndamento: 0,
        emExecucao: 0,
        paraDesignar: 0,
      }

    const ordersQty = info.length

    const inProgress = info.reduce((acc, current) => {
      const isInitiated = !!current.periodo.inicio
      const isNotFinished = !current.periodo.fim
      if (isInitiated && isNotFinished) return acc + 1
      return acc
    }, 0)

    const inExecution = info.reduce((acc, current) => {
      const currentDayStart = dayjs().set('hour', 0).toDate()
      const currentDayEnd = dayjs().set('hour', 23).toDate()
      const hasExecutionLogToday = current.periodo.historico?.some(
        (h) => new Date(h.entrada) >= currentDayStart && new Date(h.entrada) <= currentDayEnd && !h.saida
      )
      if (hasExecutionLogToday) return acc + 1
      return acc
    }, 0)
    const toAssign = info.reduce((acc, current) => {
      const hasResponsible = !!current.responsavel?.nome
      if (!hasResponsible) return acc + 1
      return acc
    }, 0)

    return {
      ordens: ordersQty,
      emAndamento: inProgress,
      emExecucao: inExecution,
      paraDesignar: toAssign,
    }
  }

  // console.log(afterDateParam, beforeDateParam)
  if (status == 'loading') return <LoadingPage />
  if (status == 'authenticated') {
    return (
      <div className="flex flex-col p-6 grow bg-[#fff]">
        <div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col lg:flex-row items-center gap-2">
              <p className="font-black uppercase text-center text-2xl text-[#15599a]">GESTÃO DE EXECUÇÕES</p>
            </div>
            {dropdownMenuVisible ? (
              <div className="text-gray-600 hover:text-blue-400 cursor-pointer">
                <IoMdArrowDropupCircle style={{ fontSize: '25px' }} onClick={() => setDropdownMenuVisible(false)} />
              </div>
            ) : (
              <div className="text-gray-600 hover:text-blue-400 cursor-pointer">
                <IoMdArrowDropdownCircle style={{ fontSize: '25px' }} onClick={() => setDropdownMenuVisible(true)} />
              </div>
            )}
          </div>
          <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-3 my-2">
            <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-3 shadow-sm lg:w-1/4">
              <div className="flex items-center justify-between">
                <h1 className="text-sm font-medium uppercase tracking-tight">ORDENS</h1>
                <VscDiffAdded />
              </div>
              <div className="mt-2 flex w-full flex-col">
                <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: orders }).ordens} </div>
              </div>
            </div>
            <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-3 shadow-sm lg:w-1/4">
              <div className="flex items-center justify-between">
                <h1 className="text-sm font-medium uppercase tracking-tight">EM ANDAMENTO</h1>
                <FaHourglassHalf />
              </div>
              <div className="mt-2 flex w-full flex-col">
                <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: orders }).emAndamento} </div>
              </div>
            </div>
            <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-3 shadow-sm lg:w-1/4">
              <div className="flex items-center justify-between">
                <h1 className="text-sm font-medium uppercase tracking-tight">EM EXECUÇÃO</h1>
                <FaTools />
              </div>
              <div className="mt-2 flex w-full flex-col">
                <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: orders }).emExecucao} </div>
              </div>
            </div>
            <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-3 shadow-sm lg:w-1/4">
              <div className="flex items-center justify-between">
                <h1 className="text-sm font-medium uppercase tracking-tight">PARA DESIGNAR</h1>
                <MdOutlineAssignmentInd />
              </div>
              <div className="mt-2 flex w-full flex-col">
                <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: orders }).paraDesignar} </div>
              </div>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {dropdownMenuVisible ? (
            <motion.div initial={{ scale: 0.8, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col w-full gap-y-2 mt-4">
              <div className="flex flex-col lg:flex-row items-center justify-center gap-2 flex-wrap">
                <TextInput
                  label="NOME DO CLIENTE"
                  placeholder="Filtre por nome do cliente..."
                  value={filters.search}
                  handleChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
                />
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
                    label={'CATEGORIA'}
                    selected={filters.category}
                    options={serviceOrdersCategories}
                    selectedItemLabel={'SEM FILTRO'}
                    handleChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        category: value,
                      }))
                    }
                    onReset={() =>
                      setFilters((prev) => ({
                        ...prev,
                        category: [],
                      }))
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col lg:flex-row items-center justify-center gap-2 flex-wrap">
                <div
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      inProgress: !prev.inProgress,
                    }))
                  }
                  className={`${
                    filters.inProgress ? 'bg-[#15599a]' : 'bg-blue-300'
                  } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
                >
                  EM PROCESSO
                </div>
                <div
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      inExecution: !prev.inExecution,
                    }))
                  }
                  className={`${
                    filters.inExecution ? 'bg-[#15599a]' : 'bg-blue-300'
                  } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
                >
                  EM EXECUÇÃO
                </div>
                <div
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      unassigned: !prev.unassigned,
                    }))
                  }
                  className={`${
                    filters.unassigned ? 'bg-[#15599a]' : 'bg-blue-300'
                  } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
                >
                  PARA DESIGNAR
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
        <div className="flex justify-around gap-3 mt-4 flex-wrap">{renderGroupedByResponsible(orders)}</div>
      </div>
    )
  }
}

export default ControleDeOSs
