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
    <div key={index} className="flex w-full flex-col">
      <h1 className="mt-4 w-full rounded-md bg-gray-800 p-2 text-center font-bold text-white">{key}</h1>
      <div className="mt-1 grid w-full grid-cols-1 gap-5 lg:grid-cols-3">
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
      router.push('/auth/signin')
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
      <div className="flex grow flex-col bg-[#fff] p-6">
        <div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col items-center gap-2 lg:flex-row">
              <p className="text-center text-2xl font-black uppercase text-[#15599a]">GESTÃO DE EXECUÇÕES</p>
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
            <motion.div initial={{ scale: 0.8, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} className="mt-4 flex w-full flex-col gap-y-2">
              <div className="flex flex-col flex-wrap items-center justify-center gap-2 lg:flex-row">
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
              <div className="flex flex-col flex-wrap items-center justify-center gap-2 lg:flex-row">
                <div
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      inProgress: !prev.inProgress,
                    }))
                  }
                  className={`${
                    filters.inProgress ? 'bg-[#15599a]' : 'bg-blue-300'
                  } flex h-[36px] cursor-pointer items-center justify-center rounded px-2 font-bold text-white`}
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
                  } flex h-[36px] cursor-pointer items-center justify-center rounded px-2 font-bold text-white`}
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
                  } flex h-[36px] cursor-pointer items-center justify-center rounded px-2 font-bold text-white`}
                >
                  PARA DESIGNAR
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
        <div className="mt-4 flex flex-wrap justify-around gap-3">{renderGroupedByResponsible(orders)}</div>
      </div>
    )
  }
}

export default ControleDeOSs
