import React, { useEffect, useState, useContext } from 'react'
import dayjs from 'dayjs'
import Select from 'react-select'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'

import LoadingPage from '../../components/utils/LoadingPage'
import { AnimatePresence, motion } from 'framer-motion'

import { useServiceOrders } from '../../utils/methods/query/serviceOrders'
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
      router.push('/auth/authHome')
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
      <div className="p-6 grow">
        <div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col lg:flex-row items-center gap-2">
              <p className="font-black uppercase text-center text-2xl text-[#15599a]">BANCO DE ORDENS DE SERVIÇO ({orders?.length || '...'})</p>
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

                  <div className="flex items-center gap-x-2 justify-center w-full lg:w-fit">
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
        </div>
        <div className="flex flex-wrap mt-4 gap-3 justify-around">
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
          <a className="fixed bg-[#15599a] cursor-pointer hover:bg-[#fead61] text-white hover:text-[#15599a] p-3 rounded-lg bottom-10 left-150">
            <p className="uppercase font-bold text-sm">DESIGNAÇÃO DE OSS</p>
          </a>
        </Link>
      </div>
    )
  }
}

export default BancoDeOS
