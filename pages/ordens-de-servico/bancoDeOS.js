import React, { useEffect, useState, useContext } from 'react'
import dayjs from 'dayjs'
import Select from 'react-select'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'

import LoadingPage from '../../components/utils/LoadingPage'
import { AnimatePresence, motion } from 'framer-motion'

import { useServiceOrders } from '../../utils/methods/query/service-orders'
import { cidadesAtendidas, formatDate, serviceOrdersCategories } from '../../utils/constants'

import ServiceOrderCard from '../../components/identificador/ordensDeServico/ServiceOrderCard'
import ModalOrdemServico from '../../components/ModalOrdemServico'
import TextInput from '../../components/inputs/Text'
import DateInput from '../../components/inputs/Date'
import { formatDateInputChange } from '../../utils/methods/shared'
import MultipleSelectInput from '../../components/inputs/MultipleSelect'
import SelectInput from '../../components/inputs/Select'

var currentDate = new Date()
const afterDateParam = new Date(currentDate.setMonth(currentDate.getMonth() - 3)).toISOString()
const beforeDateParam = new Date().toISOString()

function BancoDeOS() {
  const [dateFilter, setDateFilter] = useState({
    after: afterDateParam,
    before: beforeDateParam,
  })
  const [modalInfo, setModalInfo] = useState({
    isOpen: false,
    orderId: null,
  })
  // Utils
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/signin')
    },
  })

  const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false)
  function handleOpenModal(order) {
    console.log('ORDEM', order)
    setModalInfo((prev) => ({ ...prev, isOpen: true, orderId: order._id }))
  }
  // Projects array holder
  const {
    data: orders,
    filters,
    setFilters,
  } = useServiceOrders({ after: dateFilter.after, before: dateFilter.before, enabled: status == 'authenticated' })
  console.log(filters)
  if (status == 'loading') return <LoadingPage />
  if (status == 'authenticated') {
    return (
      <div className="grow p-6">
        <div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col items-center gap-2 lg:flex-row">
              <p className="text-center text-2xl font-black uppercase text-[#15599a]">BANCO DE ORDENS DE SERVIÇO ({orders?.length || '...'})</p>
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
                  <div className="w-full lg:w-[250px]">
                    <SelectInput
                      width={'100%'}
                      label={'URGÊNCIA'}
                      value={filters.urgency}
                      options={[
                        { id: 1, label: 'POUCO URGENTE', value: 'POUCO URGENTE' },
                        { id: 2, label: 'URGENTE', value: 'URGENTE' },
                        { id: 3, label: 'EMERGÊNCIA', value: 'EMERGÊNCIA' },
                      ]}
                      selectedItemLabel={'SEM FILTRO'}
                      handleChange={(value) =>
                        setFilters((prev) => ({
                          ...prev,
                          urgency: value,
                        }))
                      }
                      onReset={() =>
                        setFilters((prev) => ({
                          ...prev,
                          urgency: null,
                        }))
                      }
                    />
                  </div>

                  <div className="flex w-full items-center justify-center gap-x-2 lg:w-fit">
                    <div className="w-full lg:w-1/2">
                      <DateInput
                        width={'100%'}
                        label={'DEPOIS DE'}
                        value={dateFilter.after ? formatDate(dateFilter.after) : undefined}
                        handleChange={(value) => setDateFilter((prev) => ({ ...prev, after: formatDateInputChange(value) }))}
                      />
                    </div>
                    <div className="w-full lg:w-1/2">
                      <DateInput
                        width={'100%'}
                        label={'ANTES DE'}
                        value={dateFilter.before ? formatDate(dateFilter.before) : undefined}
                        handleChange={(value) => setDateFilter((prev) => ({ ...prev, before: formatDateInputChange(value) }))}
                      />
                    </div>
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
        </div>
        <div className="mt-4 flex flex-wrap justify-around gap-3">
          {orders ? orders?.map((order, index) => <ServiceOrderCard key={index} order={order} handleOpenModal={handleOpenModal} />) : null}
        </div>
        {modalInfo.isOpen && modalInfo.orderId ? (
          <ModalOrdemServico
            modalIsOpen={modalInfo.isOpen}
            orderId={modalInfo.orderId}
            closeModal={() => setModalInfo({ isOpen: false, orderId: null })}
          />
        ) : null}
        <Link href={'/ordemDeServico/designacoes'}>
          <div className="left-150 fixed bottom-10 cursor-pointer rounded-lg bg-[#15599a] p-3 text-white hover:bg-[#fead61] hover:text-[#15599a]">
            <p className="text-sm font-bold uppercase">DESIGNAÇÃO DE OSS</p>
          </div>
        </Link>
      </div>
    )
  }
}

export default BancoDeOS
