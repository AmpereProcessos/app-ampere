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
import { formatDate } from '../../utils/constants'

import ServiceOrderCard from '../../components/identificador/ordensDeServico/ServiceOrderCard'
import ModalOrdemServico from '../../components/ModalOrdemServico'

var currentDate = new Date()
const afterDateParam = new Date(currentDate.setMonth(currentDate.getMonth() - 3)).toISOString()
const beforeDateParam = currentDate.toISOString()

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
  const { data: orders, filters, setFilters } = useServiceOrders({ after: afterDateParam, before: currentDate, enabled: status == 'authenticated' })
  if (status == 'loading') return <LoadingPage />
  if (status == 'authenticated') {
    return (
      <div className="p-6 grow">
        <div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-wrap justify-center items-center gap-2 font-raleway font-black">
              <p className="font-bold uppercase text-center text-2xl text-[#15599a]">BANCO DE ORDENS DE SERVIÇO</p>
              {orders ? <p className="font-bold text-[#fead61]">({orders?.length})</p> : null}
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
                <div className="flex flex-col lg:flex-row justify-between gap-2">
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-['Roboto'] text-xs">ADQUIRIDOS ENTRE:</span>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-2">
                      <input
                        value={formatDate(dateFilter.after)}
                        onChange={(e) =>
                          setDateFilter({
                            ...dateFilter,
                            after: dayjs(e.target.value).$d != 'Invalid Date' ? new Date(e.target.value).toISOString() : dateFilterParam,
                          })
                        }
                        type="date"
                        className="border border-gray-200 outline-none py-1 px-2"
                      />
                      <p>&</p>
                      <input
                        value={formatDate(dateFilter.before)}
                        onChange={(e) =>
                          setDateFilter({
                            ...dateFilter,
                            before:
                              dayjs(e.target.value).$d != 'Invalid Date'
                                ? dayjs(e.target.value).add('20', 'hour').toISOString()
                                : new Date().toISOString(),
                          })
                        }
                        type="date"
                        className="border border-gray-200 outline-none py-1 px-2"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      {/* <FetchDataButton text={'BUSCAR'} icon={<MdDateRange />} handleClick={getOSS} /> */}
                      {/* <div className="flex cursor-pointer text-[#15599a] items-center  font-bold p-2 rounded-lg transition duration-300 ease-in-out hover:scale-105">
                        <p className="mr-2 text-sm">BAIXAR DADOS</p>
                        <BsDownload />
                      </div> */}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 w-full">
                    <div className="w-full lg:w-[350px]">
                      <Select
                        isMulti
                        placeholder="CATEGORIAS"
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            width: '100%',
                            minHeight: '41px',
                          }),
                        }}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            category: e.map((x) => x.value),
                          })
                        }
                        options={[
                          { label: 'PADRÃO', value: 'PADRÃO' },
                          { label: 'ESTRUTURA', value: 'ESTRUTURA' },
                          { label: 'MONTAGEM', value: 'MONTAGEM' },
                          {
                            label: 'MANUTENÇÃO PREVENTIVA',
                            value: 'MANUTENÇÃO PREVENTIVA',
                          },
                          {
                            label: 'MANUTENÇÃO CORRETIVA',
                            value: 'MANUTENÇÃO CORRETIVA',
                          },
                          {
                            label: 'NÃO DEFINIDO',
                            value: 'NÃO DEFINIDO',
                          },
                        ]}
                      />
                    </div>
                    <div
                      onClick={() => setFilters({ ...filters, unfinished: !filters.unfinished })}
                      className={`${
                        filters.unfinished ? 'bg-[#15599a]' : 'bg-blue-300'
                      } rounded h-[41px] w-full lg:w-[350px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
                    >
                      EM ABERTO
                    </div>
                    <input
                      className="outline-none p-1.5  w-full lg:w-[350px] rounded border border-gray-200 placeholder:italic"
                      placeholder="DIGITE O NOME DO CONTRATO"
                      value={filters.search}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          search: e.target.value,
                        })
                      }
                    />
                    {/* <FilterButton text={'FILTRAR'} icon={<AiOutlineSearch />} handleClick={filterOS} /> */}
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
