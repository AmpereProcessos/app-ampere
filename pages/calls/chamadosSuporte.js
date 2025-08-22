import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import ModalCallSuporte from '../../components/ModalCallSuporte'
import CreateModal from '../../components/SuportCallCreation'
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'
import { AiOutlineReload } from 'react-icons/ai'
import { MdDateRange } from 'react-icons/md'
import { BsFillPatchCheckFill } from 'react-icons/bs'
import Link from 'next/link'
import Select from 'react-select'
import { AiOutlineSearch } from 'react-icons/ai'
import { cidadesAtendidas, cities, tiposChamadosSuporte } from '../../utils/constants'

import dayjs from 'dayjs'
import FetchDataButton from '../../components/utils/Buttons/FetchDataButton'
import { AnimatePresence, motion } from 'framer-motion'
import FilterButton from '../../components/utils/Buttons/FilterButton'
import { useSession } from '../../components/providers/SessionProvider'
import LoadingPage from '../../components/utils/LoadingPage'

const statusStyles = {
  ABERTO: {
    textColor: 'text-yellow-500',
    borderColor: 'border-yellow-500',
  },
  PENDENTE: {
    textColor: 'text-red-400',
    borderColor: 'border-red-400',
  },
  'EM ANDAMENTO': {
    textColor: 'text-[#15599a]',
    borderColor: 'border-[#15599a]',
  },
  RESOLVIDO: {
    textColor: 'text-green-400',
    borderColor: 'border-green-400',
  },
}
var dateFilterParam = new Date()
dateFilterParam.setDate(dateFilterParam.getDate() - 2)
function ChamadosSuporte() {
  const router = useRouter()
  const { session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/signin')
    },
  })
  const [openCallsDropdownMenuVisible, setOpenCallsDropdownMenuVisible] = useState(false)
  const [closedCallsDropdownMenuVisible, setClosedCallsDropdownMenuVisible] = useState(false)

  // Array com os chamados, filtrados ou não.
  const [inProgress, setInProgress] = useState()
  const [filteredInProgress, setFilteredInProgress] = useState()
  const [closedCalls, setClosedCalls] = useState()
  const [filteredClosedCalls, setFilteredClosedCalls] = useState()
  // Controle booleano da abertura de modais
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [creationModal, setCreationModal] = useState(false)
  // Controle do chamado da modal
  const [modalCall, setModalCall] = useState({})
  // Controle de filtros
  const [inProgressCallsFilters, setInProgressCallsFilters] = useState({
    searchFilter: '',
    respFilter: [],
    statusFilter: [],
    cityFilter: [],
    typeFilter: [],
  })
  const [closedCallsFilters, setClosedCallsFilters] = useState({
    searchFilter: '',
    respFilter: [],
    cityFilter: [],
    typeFilter: [],
    afterDateFilter: dateFilterParam,
    beforeDateFilter: new Date(),
  })
  function getCalls() {
    axios
      .get(`/api/chamados/suporte/mainData?closedAfter=${closedCallsFilters.afterDateFilter}&closedBefore=${closedCallsFilters.beforeDateFilter}`)
      .then((res) => {
        setInProgress(res.data.openCalls)
        setFilteredInProgress(res.data.openCalls)
        setClosedCalls(res.data.closedCalls)
        setFilteredClosedCalls(res.data.closedCalls)
      })
  }
  function getClosedCallsByDate() {
    axios
      .post('/api/chamados/suporte/filteredByDate', {
        date: {
          after: closedCallsFilters.afterDateFilter,
          before: closedCallsFilters.beforeDateFilter,
        },
      })
      .then((res) => {
        setFilteredClosedCalls(res.data)
        setClosedCalls(res.data)
      })
  }
  function filterInProgressCalls() {
    var newArr
    if (inProgressCallsFilters.statusFilter.length > 0 && inProgressCallsFilters.respFilter.length > 0) {
      newArr = inProgress.filter(
        (call) => inProgressCallsFilters.respFilter.includes(call.responsavel) && inProgressCallsFilters.statusFilter.includes(call.statusChamado)
      )
    } else if (inProgressCallsFilters.respFilter.length > 0) {
      newArr = inProgress.filter((call) => inProgressCallsFilters.respFilter.includes(call.responsavel))
    } else if (inProgressCallsFilters.statusFilter.length > 0) {
      newArr = inProgress.filter((call) => inProgressCallsFilters.statusFilter.includes(call.statusChamado))
    }
    if (inProgressCallsFilters.cityFilter.length > 0) {
      if (!newArr) newArr = inProgress
      newArr = newArr.filter((call) => inProgressCallsFilters.cityFilter.includes(call.cidade))
    }
    if (inProgressCallsFilters.typeFilter.length > 0) {
      if (!newArr) newArr = inProgress
      newArr = newArr.filter((call) => inProgressCallsFilters.typeFilter.includes(call.tipoChamado))
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
    if (closedCallsFilters.cityFilter.length > 0) {
      if (!newArr) newArr = closedCalls
      newArr = newArr.filter((call) => closedCallsFilters.cityFilter.includes(call.cidade))
    }
    if (closedCallsFilters.typeFilter.length > 0) {
      if (!newArr) newArr = closedCalls
      newArr = newArr.filter((call) => closedCallsFilters.typeFilter.includes(call.tipoChamado))
    }
    if (closedCallsFilters.respFilter.length > 0) {
      if (!newArr) newArr = closedCalls
      newArr = newArr.filter((call) => closedCallsFilters.respFilter.includes(call.responsavel))
    }
    if (!newArr) {
      setFilteredClosedCalls(closedCalls)
      return closedCalls
    } else {
      setFilteredClosedCalls(newArr)
      return newArr
    }
  }
  // Filtros de pesquisa
  function handleInProgressCallsSearchFilter(value) {
    setInProgressCallsFilters({
      ...inProgressCallsFilters,
      searchFilter: value,
    })
    if (value != '' || ' ') {
      let filteredByOptions = filterInProgressCalls()
      let newArr = filteredByOptions.filter((call) =>
        call.nomeCliente ? call.nomeCliente.toUpperCase().includes(value.toUpperCase()) : call.nomeUsina.toUpperCase().includes(value.toUpperCase())
      )
      setFilteredInProgress(newArr)
    } else {
      setFilteredInProgress(inProgress)
    }
  }
  function handleClosedCallsSearchFilter(value) {
    setClosedCallsFilters({ ...closedCallsFilters, searchFilter: value })
    if (value != '' || ' ') {
      let filteredByOptions = filterClosedCalls()
      let newArr = filteredByOptions.filter((call) =>
        call.nomeCliente ? call.nomeCliente.toUpperCase().includes(value.toUpperCase()) : call.nomeUsina.toUpperCase().includes(value.toUpperCase())
      )
      setFilteredClosedCalls(newArr)
    } else {
      setFilteredClosedCalls(inProgress)
    }
  }
  function updateModalInfo(id) {
    axios.get(`/api/chamados/getSuporte/${id}`).then((res) => {
      setModalCall(res.data)
      getCalls()
    })
  }
  function handleOpenModal(id) {
    axios.get(`/api/chamados/getSuporte/${id}`).then((res) => {
      setModalCall(res.data)
      setModalIsOpen(true)
    })
  }
  function getDeadlineStatus(tipoDoChamado, plano, statusPlano, abertura, statusChamado) {
    if (statusChamado == 'ABERTO') {
      let tipoInfo = tiposChamadosSuporte.filter((chamado) => chamado.tipo == tipoDoChamado)[0]
      var grau
      if (plano && plano != 'MANUTENÇÃO PREVENTIVA' && statusPlano != true) {
        grau = tipoInfo ? tipoInfo.grauUrgenciaOeM : 'B'
      } else {
        grau = tipoInfo ? tipoInfo.grauUrgenciaNormal : 'B'
      }
      let diffTempo = dayjs().diff(dayjs(abertura), 'hours')
      if (grau == 'A' && diffTempo > 24) {
        return 'border-red-500'
      } else if (grau == 'B' && diffTempo > 48) {
        return 'border-red-500'
      } else if (grau == 'C' && diffTempo > 72) {
        return 'border-red-500'
      } else if (grau == 'D' && diffTempo > 96) {
        return 'border-red-500'
      } else {
        return 'border-gray-300'
      }
    } else {
      return 'border-gray-300'
    }
  }
  useEffect(() => {
    if (session?.user.permissoes.rotas.includes('O&M') || session?.user.permissoes.rotas.includes('Pós-Venda')) {
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
        <div className="flex w-full items-center justify-between border border-gray-300 bg-[#fff] p-4 shadow-xl">
          <p className="text-center font-['Roboto'] text-2xl font-bold uppercase text-[#15599a]">CHAMADOS DE SUPORTE TÉCNICO</p>
          <FetchDataButton text={'ATUALIZAR'} icon={<AiOutlineReload />} handleClick={getCalls} />
        </div>
        <div className="flex h-[1200px] w-full flex-col border border-gray-300 bg-[#fff] p-4 shadow-xl lg:h-[720px]">
          <div className="flex flex-col items-center justify-between border-b border-gray-300 p-1">
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
                      className="w-full rounded  border border-gray-300 p-1.5 outline-none placeholder:italic lg:w-[350px]"
                      placeholder="DIGITE O NOME DO CLIENTE/USINA"
                      value={inProgressCallsFilters.searchFilter}
                      onChange={(e) => handleInProgressCallsSearchFilter(e.target.value)}
                    />
                    <div className="w-full lg:w-[250px]">
                      <Select
                        isMulti
                        placeholder="TIPO DE CHAMADO"
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            width: '100%',
                            minHeight: '41px',
                          }),
                        }}
                        onChange={(e) =>
                          setInProgressCallsFilters({
                            ...inProgressCallsFilters,
                            typeFilter: e.map((x) => x.value),
                          })
                        }
                        options={tiposChamadosSuporte.map((chamado) => {
                          return { value: chamado.tipo, label: chamado.tipo }
                        })}
                      />
                    </div>
                    <div className="w-full lg:w-[250px]">
                      <Select
                        isMulti
                        placeholder="CIDADE"
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            width: '100%',
                            minHeight: '41px',
                          }),
                        }}
                        onChange={(e) =>
                          setInProgressCallsFilters({
                            ...inProgressCallsFilters,
                            cityFilter: e.map((x) => x.value),
                          })
                        }
                        options={cidadesAtendidas.map((cidade) => {
                          return { value: cidade, label: cidade }
                        })}
                      />
                    </div>
                    <div className="w-full lg:w-[250px]">
                      <Select
                        isMulti
                        placeholder="STATUS DO CHAMADOS"
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            width: '100%',
                            minHeight: '41px',
                          }),
                        }}
                        onChange={(e) =>
                          setInProgressCallsFilters({
                            ...inProgressCallsFilters,
                            statusFilter: e.map((x) => x.value),
                          })
                        }
                        options={[
                          {
                            value: 'ABERTO',
                            label: 'ABERTO',
                          },
                          {
                            value: 'EM ANDAMENTO',
                            label: 'EM ANDAMENTO',
                          },
                        ]}
                      />
                    </div>
                    <div className="w-full lg:w-[250px]">
                      <Select
                        isMulti
                        placeholder="RESPONSÁVEL"
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            width: '100%',
                            minHeight: '41px',
                          }),
                        }}
                        onChange={(e) =>
                          setInProgressCallsFilters({
                            ...inProgressCallsFilters,
                            respFilter: e.map((x) => x.value),
                          })
                        }
                        options={[
                          {
                            id: 1,
                            value: 'SUPORTE',
                            label: 'SUPORTE',
                          },
                          {
                            id: 2,
                            value: 'PÓS-VENDA',
                            label: 'PÓS-VENDA',
                          },
                          {
                            id: 3,
                            value: 'A DEFINIR',
                            label: 'A DEFINIR',
                          },
                        ]}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    <FilterButton text={'FILTRAR'} icon={<AiOutlineSearch />} handleClick={filterInProgressCalls} />
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
          <div className="overscroll-y mt-2 flex grow flex-wrap justify-around gap-2 overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
            {filteredInProgress ? (
              filteredInProgress.map((call) => (
                <div
                  onClick={() => handleOpenModal(call._id)}
                  key={call._id}
                  className={`max-h-[200px] w-[450px] cursor-pointer border ${getDeadlineStatus(
                    call.tipoChamado,
                    call.plano,
                    call.oemConcluido,
                    call.abertura,
                    call.statusChamado
                  )} p-3 hover:bg-blue-100`}
                >
                  <div className="grid w-full grid-cols-6 items-center gap-2">
                    <h1 className="col-span-3 text-sm font-semibold uppercase">{call.nomeCliente ? call.nomeCliente : call.nomeUsina}</h1>
                    {call.cidade && <p className="col-span-1 text-center text-xxs font-bold uppercase text-gray-700">{call.cidade}</p>}
                    <p
                      className={`col-span-2 rounded-lg border p-1 text-center text-xs font-bold ${statusStyles[call.statusChamado].textColor} ${
                        statusStyles[call.statusChamado].borderColor
                      }`}
                    >
                      {call.statusChamado}
                    </p>
                  </div>
                  <div className="mt-2 flex w-full items-center justify-between">
                    <p className="text-xs uppercase text-gray-500">Responsável:</p>
                    <p className="text-xs text-gray-500">{call.responsavel}</p>
                  </div>
                  <div className="mt-2 hidden w-full items-center justify-between lg:flex">
                    <p className="text-xs uppercase text-gray-500">DEMANDA</p>
                    <p className={`text-xs ${call.demanda == 'EXTERNA' ? 'text-red-500' : 'text-gray-500'}`}>{call.demanda ? call.demanda : '-'}</p>
                  </div>
                  <div className="mt-2 flex w-full items-center justify-between">
                    <p className="text-xs uppercase text-gray-500">Tipo de chamado:</p>
                    <p className="text-xs text-gray-500">{call.tipoChamado}</p>
                  </div>
                  <div className="mt-2 flex w-full items-center justify-between">
                    <p className="text-xs uppercase text-gray-500">ABERTURA</p>
                    <p className="text-xxs uppercase text-gray-500">{dayjs().diff(dayjs(call.abertura), 'hours')} horas em aberto</p>
                    <p className="text-xs text-gray-500">{new Date(call.abertura).toLocaleString()}</p>
                  </div>
                  {call.tipoChamado.includes('GARANTIA') &&
                  call.statusGarantia != 'IDENTIFICAÇÃO E TESTES' &&
                  (!call.ultAtualizacaoCliente || dayjs().diff(dayjs(call.ultAtualizacaoCliente), 'days') >= 7) ? (
                    <p className="text-center font-bold text-red-500">ATUALIZAR CLIENTE</p>
                  ) : (
                    false
                  )}
                </div>
              ))
            ) : (
              <LoadingPage />
            )}
          </div>
        </div>
        <div className="flex h-[1200px] w-full flex-col border border-gray-300 bg-[#fff] p-4 shadow-xl lg:h-[500px]">
          <div className="flex flex-col items-center justify-between border-b border-gray-300 p-1">
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
                    <p>Entre:</p>
                    <input
                      value={dayjs(closedCallsFilters.afterDateFilter).format('YYYY-MM-DD')}
                      onChange={(e) =>
                        setClosedCallsFilters({
                          ...closedCallsFilters,
                          afterDateFilter: e.target.value,
                        })
                      }
                      type="date"
                      className="border border-gray-300 p-2 outline-none"
                    />
                    <p>&</p>
                    <input
                      value={dayjs(closedCallsFilters.beforeDateFilter).format('YYYY-MM-DD')}
                      onChange={(e) =>
                        setClosedCallsFilters({
                          ...closedCallsFilters,
                          beforeDateFilter: e.target.value,
                        })
                      }
                      type="date"
                      className="border border-gray-300 p-2 outline-none"
                    />
                    <FetchDataButton handleClick={getClosedCallsByDate} text={'BUSCAR'} icon={<MdDateRange />} />
                  </div>
                  <div className="flex flex-col flex-wrap items-center justify-center gap-2 lg:flex-row">
                    <input
                      value={closedCallsFilters.searchFilter}
                      onChange={(e) => handleClosedCallsSearchFilter(e.target.value)}
                      placeholder="DIGITE O NOME DO CLIENTE/USINA"
                      className="h-[41px] w-full  rounded border border-gray-300 p-1.5 outline-none placeholder:italic lg:w-[350px]"
                    />
                    <div className="w-full lg:w-[250px]">
                      <Select
                        isMulti
                        placeholder="TIPO DE CHAMADO"
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            width: '100%',
                            minHeight: '41px',
                          }),
                        }}
                        onChange={(e) =>
                          setClosedCallsFilters({
                            ...closedCallsFilters,
                            typeFilter: e.map((x) => x.value),
                          })
                        }
                        options={tiposChamadosSuporte.map((chamado) => {
                          return { value: chamado.tipo, label: chamado.tipo }
                        })}
                      />
                    </div>
                    <div className="w-full lg:w-[250px]">
                      <Select
                        isMulti
                        placeholder="CIDADE"
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            width: '100%',
                            minHeight: '41px',
                          }),
                        }}
                        onChange={(e) =>
                          setClosedCallsFilters({
                            ...closedCallsFilters,
                            cityFilter: e.map((x) => x.value),
                          })
                        }
                        options={cidadesAtendidas.map((cidade) => {
                          return { value: cidade, label: cidade }
                        })}
                      />
                    </div>
                    <div className="w-full lg:w-[250px]">
                      <Select
                        isMulti
                        placeholder="RESPONSÁVEL"
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            width: '100%',
                            minHeight: '41px',
                          }),
                        }}
                        onChange={(e) =>
                          setClosedCallsFilters({
                            ...closedCallsFilters,
                            respFilter: e.map((x) => x.value),
                          })
                        }
                        options={[
                          {
                            id: 1,
                            value: 'SUPORTE',
                            label: 'SUPORTE',
                          },
                          {
                            id: 2,
                            value: 'PÓS-VENDA',
                            label: 'PÓS-VENDA',
                          },
                          {
                            id: 3,
                            value: 'A DEFINIR',
                            label: 'A DEFINIR',
                          },
                        ]}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-x-2">
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
                  onClick={() => handleOpenModal(call._id)}
                  key={call._id}
                  className="max-h-[180px] w-[370px] cursor-pointer border border-gray-300 p-3 hover:bg-blue-100"
                >
                  <div className="flex w-full items-center justify-between gap-2">
                    {call.feedbackValor != undefined && call.feedbackValor != '' ? (
                      <BsFillPatchCheckFill
                        style={{
                          fontSize: '20px',
                          color: 'rgb(21 128 61)',
                          marginLeft: '3px',
                        }}
                      />
                    ) : (
                      false
                    )}
                    <h1 className="text-sm font-semibold uppercase">{call.nomeCliente ? call.nomeCliente : call.nomeUsina}</h1>
                    {call.cidade && <p className="text-xs uppercase text-gray-700">{call.cidade}</p>}
                    <p
                      className={`rounded-lg border p-1 text-xs font-bold ${statusStyles[call.statusChamado].textColor} ${statusStyles[call.statusChamado].borderColor}`}
                    >
                      {call.statusChamado}
                    </p>
                  </div>
                  <div className="mt-2 flex w-full items-center justify-between">
                    <p className="text-xs uppercase text-gray-500">Responsável:</p>
                    <p className="text-xs text-gray-500">{call.responsavel}</p>
                  </div>
                  {call.demanda && (
                    <div className="mt-2 hidden w-full items-center justify-between lg:flex">
                      <p className="text-xs uppercase text-gray-500">DEMANDA</p>
                      <p className="text-xs text-gray-500">{call.demanda}</p>
                    </div>
                  )}
                  <div className="mt-2 flex w-full items-center justify-between">
                    <p className="text-xs uppercase text-gray-500">Tipo de chamado:</p>
                    <p className="text-xs text-gray-500">{call.tipoChamado}</p>
                  </div>
                </div>
              ))
            ) : (
              <LoadingPage />
            )}
          </div>
        </div>
        <div
          onClick={() => setCreationModal(true)}
          className="left-150 fixed bottom-10 cursor-pointer rounded-lg bg-[#15599a] p-3 text-white hover:bg-[#fead61] hover:text-[#15599a]"
        >
          <p className="text-sm font-bold uppercase">Novo chamado</p>
        </div>
        {creationModal && <CreateModal getCalls={getCalls} setModalIsOpen={setCreationModal} />}
        {modalIsOpen && (
          <ModalCallSuporte
            modalIsOpen={modalIsOpen}
            session={session}
            updateModalInfo={updateModalInfo}
            setModalIsOpen={setModalIsOpen}
            info={modalCall}
          />
        )}
      </div>
    )
  }
}

export default ChamadosSuporte
