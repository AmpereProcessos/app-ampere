import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Select from 'react-select'
import { AiOutlineReload } from 'react-icons/ai'
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'
import { TbCash } from 'react-icons/tb'
import { MdDateRange } from 'react-icons/md'
import Link from 'next/link'
import { AiOutlineSearch } from 'react-icons/ai'
import { cities } from '../../utils/constants'
import ModalCallADM from '../../components/ModalCallADM'
import FetchDataButton from '../../components/utils/Buttons/FetchDataButton'
import FilterButton from '../../components/utils/Buttons/FilterButton'
import { useSession } from 'next-auth/react'
import LoadingPage from '../../components/utils/LoadingPage'

const statusStyles = {
  ABERTO: {
    textColor: 'text-orange-500',
    borderColor: 'border-orange-500',
  },
  PENDENTE: {
    textColor: 'text-red-400',
    borderColor: 'border-red-400',
  },
  FINALIZADO: {
    textColor: 'text-green-500',
    borderColor: 'border-green-500',
  },
  RESOLVIDO: {
    textColor: 'text-green-400',
    borderColor: 'border-green-400',
  },
}
var dateFilterParam = new Date()
dateFilterParam.setDate(dateFilterParam.getDate() - 2)

function ChamadosADM() {
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/signin')
    },
  })
  const [openCallsDropdownMenuVisible, setOpenCallsDropdownMenuVisible] = useState(false)
  const [closedCallsDropdownMenuVisible, setClosedCallsDropdownMenuVisible] = useState(false)

  const [inProgress, setInProgress] = useState()
  const [filteredInProgress, setFilteredInProgress] = useState()
  const [inProgressFilters, setInProgressFilters] = useState({
    search: '',
    type: [],
  })
  const [inProgressDateFilter, setInProgressDateFilter] = useState({
    after: null,
    before: null,
  })

  const [closedCalls, setClosedCalls] = useState()
  const [filteredClosedCalls, setFilteredClosedCalls] = useState()
  const [closedFilters, setClosedFilters] = useState({
    search: '',
    type: [],
  })
  const [closedDateFilter, setClosedDateFilter] = useState({
    after: null,
    before: null,
  })
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [modalCall, setModalCall] = useState({})

  function handleOpenModal(call) {
    setModalCall(call)
    setModalIsOpen(true)
  }
  function getCalls() {
    axios.get('/api/chamados/adm/mainData').then((res) => {
      setInProgress(res.data.openCalls)
      setFilteredInProgress(res.data.openCalls)
      setClosedCalls(res.data.closedCalls)
      setFilteredClosedCalls(res.data.closedCalls)
    })
  }

  function getDemandColor(demanda) {
    if (demanda == 'PAGAMENTO') {
      return {
        paragraph: 'text-red-500 font-bold',
        iconColor: 'rgb(239 68 68)',
      }
    }
    if (demanda == 'COBRANÇA') {
      return {
        paragraph: 'text-green-500 font-bold',
        iconColor: 'rgb(34 197 94)',
      }
    }
  }
  function handleOpenCallsSearchFilter(value) {
    setInProgressFilters({ ...inProgressFilters, search: value })
    let filtered = filterOpenCalls()
    if (value.trim().length > 1) {
      let newArr = [...filtered].filter((call) => call.nomeCliente.toUpperCase().includes(inProgressFilters.search.toUpperCase()))
      setFilteredInProgress(newArr)
    } else {
      setFilteredInProgress(filtered)
    }
  }
  function handleClosedCallsSearchFilter(value) {
    setClosedFilters({ ...closedFilters, search: value })
    let filtered = filterClosedCalls()
    if (value.trim().length > 1) {
      let newArr = [...filtered].filter((call) => call.nomeCliente.toUpperCase().includes(closedFilters.search.toUpperCase()))
      setFilteredClosedCalls(newArr)
    } else {
      setFilteredClosedCalls(filtered)
    }
  }
  function filterOpenCalls() {
    var newArr
    if (inProgressFilters.type.length > 0) {
      if (!newArr) newArr = inProgress
      newArr = newArr.filter((call) => inProgressFilters.type.includes(call.demanda))
    }
    if (inProgressDateFilter.after && inProgressDateFilter.before) {
      if (!newArr) newArr = inProgress
      newArr = newArr.filter((call) => call.dataAbertura >= inProgressDateFilter.after && call.dataAbertura <= inProgressDateFilter.before)
    }
    if (!newArr) {
      setFilteredInProgress(inProgress)
      return inProgress
    } else {
      setFilteredInProgress(newArr)
      return newArr
    }
  }
  function filterClosedCalls() {
    var newArr
    if (closedFilters.type.length > 0) {
      if (!newArr) newArr = closedCalls
      newArr = newArr.filter((call) => closedFilters.type.includes(call.demanda))
    }
    if (closedDateFilter.after && closedDateFilter.before) {
      if (!newArr) newArr = closedCalls
      newArr = newArr.filter((call) => call.dataAbertura >= closedDateFilter.after && call.dataAbertura <= closedDateFilter.before)
    }
    if (!newArr) {
      setFilteredClosedCalls(closedCalls)
      return closedCalls
    } else {
      setFilteredClosedCalls(newArr)
      return newArr
    }
  }
  useEffect(() => {
    if (!!session?.user.permissoes.administrativo.visualizar) {
      if (!inProgress) {
        getCalls()
      }
    } else {
      if (session?.user) {
        router.push('/')
      }
    }
  }, [session])
  if (status == 'loading') return <LoadingPage />
  if (status == 'authenticated') {
    return (
      <div className="flex w-full grow flex-col gap-y-2 bg-gray-100 p-6">
        <div className="flex w-full items-center justify-between border border-gray-200 bg-[#fff] p-4 shadow-xl">
          <p className="text-center font-['Roboto'] text-2xl font-bold uppercase text-[#15599a]">CHAMADOS AO FINANCEIRO/ADMINISTRAÇÃO</p>
          <FetchDataButton text={'ATUALIZAR'} icon={<AiOutlineReload />} handleClick={getCalls} />
        </div>
        {/** Abertos */}
        <div className="flex h-[1200px] w-full flex-col border border-gray-200 bg-[#fff] p-4 shadow-xl lg:h-[720px]">
          <div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-wrap items-center justify-center gap-2 font-['Roboto']">
                <p className="text-center text-xl font-bold uppercase text-[#15599a]">Chamados abertos</p>
                <p className="font-bold text-[#fead61]">({filteredInProgress?.length})</p>
              </div>
              {openCallsDropdownMenuVisible ? (
                <div className="cursor-pointer text-gray-600 hover:text-blue-400">
                  <IoMdArrowDropupCircle style={{ fontSize: '25px' }} onClick={() => setOpenCallsDropdownMenuVisible(false)} />
                </div>
              ) : (
                <div className="cursor-pointer text-gray-600 hover:text-blue-400">
                  <IoMdArrowDropdownCircle style={{ fontSize: '25px' }} onClick={() => setOpenCallsDropdownMenuVisible(true)} />
                </div>
              )}
            </div>
            <AnimatePresence>
              {openCallsDropdownMenuVisible ? (
                <motion.div initial={{ scale: 0.8, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} className="mt-4 flex w-full flex-col gap-y-2">
                  <div className="flex flex-col flex-wrap items-center justify-center gap-2 lg:flex-row">
                    <input
                      type="text"
                      value={inProgressFilters.search}
                      onChange={(e) => handleOpenCallsSearchFilter(e.target.value)}
                      className="h-[41px] w-full  rounded border border-gray-200 p-1.5 outline-none placeholder:italic lg:w-[350px]"
                      placeholder="DIGITE O NOME DO CLIENTE"
                    />
                    <div className="w-full lg:w-[250px]">
                      <Select
                        isMulti
                        placeholder="TIPO DE DEMANDA"
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            width: '100%',
                            minHeight: '41px',
                          }),
                        }}
                        onChange={(e) =>
                          setInProgressFilters({
                            ...inProgress,
                            type: e.map((x) => x.value),
                          })
                        }
                        options={[
                          {
                            value: 'PAGAMENTO',
                            label: 'PAGAMENTO',
                          },
                          {
                            value: 'COBRANÇA',
                            label: 'COBRANÇA',
                          },
                        ]}
                      />
                    </div>
                    <div className="flex w-full gap-x-2 lg:w-fit">
                      <div className="flex w-fit flex-col items-center">
                        <span className="text-center font-raleway text-sm font-bold uppercase">Depois de:</span>
                        <input
                          className="w-full text-center text-xs uppercase text-gray-600 outline-none"
                          type="date"
                          value={inProgressDateFilter.after && new Date(inProgressDateFilter.after).toISOString().slice(0, 10)}
                          onChange={(e) =>
                            setInProgressDateFilter({
                              ...inProgressDateFilter,
                              after: isNaN(e.target.value) ? new Date(e.target.value).toISOString() : null,
                            })
                          }
                        />
                      </div>
                      <div className="flex w-fit flex-col items-center">
                        <span className="text-center font-raleway text-sm font-bold uppercase">Antes de:</span>
                        <input
                          className="w-full text-center text-xs uppercase text-gray-600 outline-none"
                          type="date"
                          value={inProgressDateFilter.before && new Date(inProgressDateFilter.before).toISOString().slice(0, 10)}
                          onChange={(e) =>
                            setInProgressDateFilter({
                              ...inProgressDateFilter,
                              before: isNaN(e.target.value) ? new Date(e.target.value).toISOString() : null,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    <FilterButton text={'FILTRAR'} icon={<AiOutlineSearch />} handleClick={filterOpenCalls} />
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
          <div className="overscroll-y mt-2 flex grow flex-wrap justify-around gap-2 overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
            {filteredInProgress ? (
              filteredInProgress.map((call) => (
                <div
                  onClick={() => handleOpenModal(call)}
                  key={call._id}
                  className="max-h-[150px] min-h-[120px] w-[420px] cursor-pointer border border-gray-200 p-3 hover:bg-blue-100"
                >
                  <div className="mb-2 flex justify-between">
                    <div className="flex items-center gap-2">
                      <TbCash
                        style={{
                          color: getDemandColor(call.demanda).iconColor,
                          fontSize: '25px',
                        }}
                      />
                      <h1 className={`${getDemandColor(call.demanda).paragraph}`}>{call.demanda}</h1>
                    </div>
                    <p
                      className={`rounded-lg border p-1 text-xs font-bold ${statusStyles[call.status].textColor} ${
                        statusStyles[call.status].borderColor
                      }`}
                    >
                      {call.status}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <h1 className="text-xs text-gray-600">{call.nomeCliente}</h1>
                    <p className="text-xs font-bold text-[#15599a]">#{call.codigoProjeto}</p>
                  </div>
                  <div className="flex justify-center">
                    <h1 className="text-center text-xs text-gray-600">{call.servico}</h1>
                  </div>
                </div>
              ))
            ) : (
              <LoadingPage />
            )}
          </div>
        </div>
        {/** Fechados */}
        <div className="flex h-[1200px] w-full flex-col border border-gray-200 bg-[#fff] p-4 shadow-xl lg:h-[500px]">
          <div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-wrap items-center justify-center gap-2 font-['Roboto']">
                <p className="text-center text-xl font-bold uppercase text-[#15599a]">CHAMADOS FINALIZADOS</p>
                <p className="font-bold text-[#fead61]">({filteredClosedCalls?.length})</p>
              </div>
              {closedCallsDropdownMenuVisible ? (
                <div className="cursor-pointer text-gray-600 hover:text-blue-400">
                  <IoMdArrowDropupCircle style={{ fontSize: '25px' }} onClick={() => setClosedCallsDropdownMenuVisible(false)} />
                </div>
              ) : (
                <div className="cursor-pointer text-gray-600 hover:text-blue-400">
                  <IoMdArrowDropdownCircle style={{ fontSize: '25px' }} onClick={() => setClosedCallsDropdownMenuVisible(true)} />
                </div>
              )}
            </div>
            <AnimatePresence>
              {closedCallsDropdownMenuVisible ? (
                <motion.div initial={{ scale: 0.8, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} className="mt-4 flex w-full flex-col gap-y-2">
                  <div className="flex flex-col flex-wrap items-center justify-center gap-2 lg:flex-row">
                    <input
                      type="text"
                      value={closedFilters.search}
                      onChange={(e) => handleClosedCallsSearchFilter(e.target.value)}
                      className="h-[41px] w-full  rounded border border-gray-200 p-1.5 outline-none placeholder:italic lg:w-[350px]"
                      placeholder="DIGITE O NOME DO CLIENTE"
                    />
                    <div className="w-full lg:w-[250px]">
                      <Select
                        isMulti
                        placeholder="TIPO DE DEMANDA"
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            width: '100%',
                            minHeight: '41px',
                          }),
                        }}
                        onChange={(e) =>
                          setClosedFilters({
                            ...closedFilters,
                            type: e.map((x) => x.value),
                          })
                        }
                        options={[
                          {
                            value: 'PAGAMENTO',
                            label: 'PAGAMENTO',
                          },
                          {
                            value: 'COBRANÇA',
                            label: 'COBRANÇA',
                          },
                        ]}
                      />
                    </div>
                    <div className="flex w-full gap-x-2 lg:w-fit">
                      <div className="flex w-fit flex-col items-center">
                        <span className="text-center font-raleway text-sm font-bold uppercase">Depois de:</span>
                        <input
                          className="w-full text-center text-xs uppercase text-gray-600 outline-none"
                          type="date"
                          value={closedDateFilter.after && new Date(closedDateFilter.after).toISOString().slice(0, 10)}
                          onChange={(e) =>
                            setClosedDateFilter({
                              ...closedDateFilter,
                              after: isNaN(e.target.value) ? new Date(e.target.value).toISOString() : null,
                            })
                          }
                        />
                      </div>
                      <div className="flex w-fit flex-col items-center">
                        <span className="text-center font-raleway text-sm font-bold uppercase">Antes de:</span>
                        <input
                          className="w-full text-center text-xs uppercase text-gray-600 outline-none"
                          type="date"
                          value={closedDateFilter.before && new Date(closedDateFilter.before).toISOString().slice(0, 10)}
                          onChange={(e) =>
                            setClosedDateFilter({
                              ...closedDateFilter,
                              before: isNaN(e.target.value) ? new Date(e.target.value).toISOString() : null,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    <FilterButton text={'FILTRAR'} icon={<AiOutlineSearch />} handleClick={filterClosedCalls} />
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
          <div className="overscroll-y mt-2 flex grow flex-wrap justify-around gap-2 overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
            {filteredClosedCalls ? (
              filteredClosedCalls.map((call) => (
                <div
                  onClick={() => handleOpenModal(call)}
                  key={call._id}
                  className="h-[100px] w-full cursor-pointer border border-gray-200 p-3 hover:bg-blue-100 lg:w-[420px]"
                >
                  <div className="mb-2 flex justify-between">
                    <div className="flex items-center gap-2">
                      <TbCash
                        style={{
                          color: getDemandColor(call.demanda).iconColor,
                          fontSize: '25px',
                        }}
                      />
                      <h1 className={`${getDemandColor(call.demanda).paragraph}`}>{call.demanda}</h1>
                    </div>
                    <p
                      className={`rounded-lg border p-1 text-xs font-bold ${statusStyles[call.status].textColor} ${
                        statusStyles[call.status].borderColor
                      }`}
                    >
                      {call.status}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <h1 className="text-xs text-gray-600">{call.nomeCliente}</h1>
                    <p className="text-xs font-bold text-[#15599a]">#{call.codigoProjeto}</p>
                  </div>
                  <div className="flex justify-center">
                    <h1 className="text-center text-xs text-gray-600">{call.servico}</h1>
                  </div>
                </div>
              ))
            ) : (
              <LoadingPage />
            )}
          </div>
        </div>
        {modalIsOpen && <ModalCallADM info={modalCall} setModalIsOpen={setModalIsOpen} getCalls={getCalls} />}
      </div>
    )
  }
}

export default ChamadosADM
