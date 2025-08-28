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
import { useQuery, useQueryClient } from '@tanstack/react-query'

import dayjs from 'dayjs'
import FetchDataButton from '../../components/utils/Buttons/FetchDataButton'
import { AnimatePresence, motion } from 'framer-motion'
import FilterButton from '../../components/utils/Buttons/FilterButton'
import { useSession } from '../../components/providers/SessionProvider'
import LoadingPage from '../../components/utils/LoadingPage'
import { TAuthSession } from '@/lib/authentication/types'
import UnauthenticatedComponent from '../../components/utils/UnauthenticatedComponent'
import UnauthorizedPage from '../../components/utils/UnauthorizedPage'
import { SupportCallsDatabase } from '@/components/identificador/chamados-suporte/SupportCallsDatabase'

// Types for the support call data
interface SupportCall {
  _id: string
  nomeCliente?: string
  nomeUsina?: string
  abertura: string
  demanda?: string
  responsavel: string
  tipoChamado: string
  statusChamado: 'ABERTO' | 'PENDENTE' | 'EM ANDAMENTO' | 'RESOLVIDO'
  cidade?: string
  statusGarantia?: string
  ultAtualizacaoCliente?: string
  feedbackValor?: string
  plano?: string
  oemConcluido?: boolean
  fechamento?: string
}

interface SupportCallsData {
  openCalls: SupportCall[]
  closedCalls: SupportCall[]
}

interface FilterState {
  searchFilter: string
  respFilter: string[]
  statusFilter: string[]
  cityFilter: string[]
  typeFilter: string[]
}

interface ClosedCallsFilterState extends FilterState {
  afterDateFilter: Date
  beforeDateFilter: Date
}

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

// Custom hooks for React Query
const useSupportCallsData = (afterDate: Date, beforeDate: Date) => {
  return useQuery<SupportCallsData>({
    queryKey: ['support-calls', afterDate, beforeDate],
    queryFn: async () => {
      const response = await axios.get(`/api/chamados/suporte/mainData?closedAfter=${afterDate}&closedBefore=${beforeDate}`)
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

const useClosedCallsByDate = (afterDate: Date, beforeDate: Date, enabled: boolean = false) => {
  return useQuery<SupportCall[]>({
    queryKey: ['closed-calls-by-date', afterDate, beforeDate],
    queryFn: async () => {
      const response = await axios.post('/api/chamados/suporte/filteredByDate', {
        date: {
          after: afterDate,
          before: beforeDate,
        },
      })
      return response.data
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

const useSupportCallById = (id: string | null) => {
  return useQuery<SupportCall>({
    queryKey: ['support-call', id],
    queryFn: async () => {
      const response = await axios.get(`/api/chamados/getSuporte/${id}`)
      return response.data
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

function ChamadosSuporte() {
  const { session, status } = useSession()
  const isAuthorized = session?.user.permissoes.rotas.includes('O&M') || session?.user.permissoes.rotas.includes('Pós-Venda')
  if (status === 'loading') return <LoadingPage />
  if (status === 'unauthenticated') return <UnauthenticatedComponent />
  if (!isAuthorized) return <UnauthorizedPage />
  return <SupportCallsDatabase session={session} />
}

export default ChamadosSuporte

function ChamadosSuporteContent({ session }: { session: TAuthSession }) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const [openCallsDropdownMenuVisible, setOpenCallsDropdownMenuVisible] = useState(false)
  const [closedCallsDropdownMenuVisible, setClosedCallsDropdownMenuVisible] = useState(false)

  // Controle booleano da abertura de modais
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [creationModal, setCreationModal] = useState(false)
  // Controle do chamado da modal
  const [modalCall, setModalCall] = useState<SupportCall | null>(null)
  const [selectedCallId, setSelectedCallId] = useState<string | null>(null)

  // Controle de filtros
  const [inProgressCallsFilters, setInProgressCallsFilters] = useState<FilterState>({
    searchFilter: '',
    respFilter: [],
    statusFilter: [],
    cityFilter: [],
    typeFilter: [],
  })
  const [closedCallsFilters, setClosedCallsFilters] = useState<ClosedCallsFilterState>({
    searchFilter: '',
    respFilter: [],
    statusFilter: [],
    cityFilter: [],
    typeFilter: [],
    afterDateFilter: dateFilterParam,
    beforeDateFilter: new Date(),
  })

  // React Query hooks
  const {
    data: callsData,
    isLoading: isLoadingCalls,
    error: callsError,
    refetch: refetchCalls,
  } = useSupportCallsData(closedCallsFilters.afterDateFilter, closedCallsFilters.beforeDateFilter)

  const {
    data: closedCallsByDate,
    isLoading: isLoadingClosedCalls,
    refetch: refetchClosedCalls,
  } = useClosedCallsByDate(
    closedCallsFilters.afterDateFilter,
    closedCallsFilters.beforeDateFilter,
    false // Only fetch when explicitly requested
  )

  const { data: selectedCall } = useSupportCallById(selectedCallId)

  // Derived state for filtered calls
  const [filteredInProgress, setFilteredInProgress] = useState<SupportCall[]>([])
  const [filteredClosedCalls, setFilteredClosedCalls] = useState<SupportCall[]>([])

  // Update filtered data when main data changes
  useEffect(() => {
    if (callsData) {
      setFilteredInProgress(callsData.openCalls)
      setFilteredClosedCalls(callsData.closedCalls)
    }
  }, [callsData])

  // Update closed calls when date filter is applied
  useEffect(() => {
    if (closedCallsByDate) {
      setFilteredClosedCalls(closedCallsByDate)
    }
  }, [closedCallsByDate])

  function getCalls() {
    refetchCalls()
  }

  function getClosedCallsByDate() {
    refetchClosedCalls()
  }

  function filterInProgressCalls() {
    if (!callsData?.openCalls) return callsData?.openCalls || []

    let newArr: SupportCall[] | undefined

    if (inProgressCallsFilters.statusFilter.length > 0 && inProgressCallsFilters.respFilter.length > 0) {
      newArr = callsData.openCalls.filter(
        (call) => inProgressCallsFilters.respFilter.includes(call.responsavel) && inProgressCallsFilters.statusFilter.includes(call.statusChamado)
      )
    } else if (inProgressCallsFilters.respFilter.length > 0) {
      newArr = callsData.openCalls.filter((call) => inProgressCallsFilters.respFilter.includes(call.responsavel))
    } else if (inProgressCallsFilters.statusFilter.length > 0) {
      newArr = callsData.openCalls.filter((call) => inProgressCallsFilters.statusFilter.includes(call.statusChamado))
    }

    if (inProgressCallsFilters.cityFilter.length > 0) {
      if (!newArr) newArr = callsData.openCalls
      newArr = newArr.filter((call) => call.cidade && inProgressCallsFilters.cityFilter.includes(call.cidade))
    }

    if (inProgressCallsFilters.typeFilter.length > 0) {
      if (!newArr) newArr = callsData.openCalls
      newArr = newArr.filter((call) => inProgressCallsFilters.typeFilter.includes(call.tipoChamado))
    }

    if (!newArr) {
      setFilteredInProgress(callsData.openCalls)
      return callsData.openCalls
    } else {
      setFilteredInProgress(newArr)
      return newArr
    }
  }

  function filterClosedCalls() {
    const closedCalls = closedCallsByDate || callsData?.closedCalls || []
    if (!closedCalls.length) return closedCalls

    let newArr: SupportCall[] | undefined

    if (closedCallsFilters.cityFilter.length > 0) {
      if (!newArr) newArr = closedCalls
      newArr = newArr.filter((call) => call.cidade && closedCallsFilters.cityFilter.includes(call.cidade))
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
  function handleInProgressCallsSearchFilter(value: string) {
    setInProgressCallsFilters({
      ...inProgressCallsFilters,
      searchFilter: value,
    })

    if (value !== '' && value !== ' ') {
      let filteredByOptions = filterInProgressCalls()
      let newArr = filteredByOptions.filter((call) =>
        call.nomeCliente ? call.nomeCliente.toUpperCase().includes(value.toUpperCase()) : call.nomeUsina?.toUpperCase().includes(value.toUpperCase())
      )
      setFilteredInProgress(newArr)
    } else {
      setFilteredInProgress(callsData?.openCalls || [])
    }
  }

  function handleClosedCallsSearchFilter(value: string) {
    setClosedCallsFilters({ ...closedCallsFilters, searchFilter: value })

    if (value !== '' && value !== ' ') {
      let filteredByOptions = filterClosedCalls()
      let newArr = filteredByOptions.filter((call) =>
        call.nomeCliente ? call.nomeCliente.toUpperCase().includes(value.toUpperCase()) : call.nomeUsina?.toUpperCase().includes(value.toUpperCase())
      )
      setFilteredClosedCalls(newArr)
    } else {
      setFilteredClosedCalls(closedCallsByDate || callsData?.closedCalls || [])
    }
  }

  function updateModalInfo(id: string) {
    setSelectedCallId(id)
    // Invalidate and refetch the main calls data
    queryClient.invalidateQueries({ queryKey: ['support-calls'] })
  }

  function handleOpenModal(id: string) {
    setSelectedCallId(id)
    setModalIsOpen(true)
  }

  function getDeadlineStatus(
    tipoDoChamado: string,
    plano: string | undefined,
    statusPlano: boolean | undefined,
    abertura: string,
    statusChamado: string
  ) {
    if (statusChamado === 'ABERTO') {
      let tipoInfo = tiposChamadosSuporte.filter((chamado) => chamado.tipo === tipoDoChamado)[0]
      var grau: string
      if (plano && plano !== 'MANUTENÇÃO PREVENTIVA' && statusPlano !== true) {
        grau = tipoInfo ? tipoInfo.grauUrgenciaOeM : 'B'
      } else {
        grau = tipoInfo ? tipoInfo.grauUrgenciaNormal : 'B'
      }
      let diffTempo = dayjs().diff(dayjs(abertura), 'hours')
      if (grau === 'A' && diffTempo > 24) {
        return 'border-red-500'
      } else if (grau === 'B' && diffTempo > 48) {
        return 'border-red-500'
      } else if (grau === 'C' && diffTempo > 72) {
        return 'border-red-500'
      } else if (grau === 'D' && diffTempo > 96) {
        return 'border-red-500'
      } else {
        return 'border-primary/20'
      }
    } else {
      return 'border-primary/20'
    }
  }

  // Handle errors
  if (callsError) {
    return (
      <div className="bg-primary/20 flex w-full grow flex-col gap-y-2 p-6">
        <div className="bg-background border-primary/20 flex w-full items-center justify-center border p-4 shadow-xl">
          <p className="text-red-500">Erro ao carregar os chamados. Tente novamente.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-primary/20 flex w-full grow flex-col gap-y-2 p-6">
      <div className="bg-background border-primary/20 flex w-full items-center justify-between border p-4 shadow-xl">
        <p className="text-center font-['Roboto'] text-2xl font-bold text-[#15599a] uppercase">CHAMADOS DE SUPORTE TÉCNICO</p>
        <FetchDataButton text={'ATUALIZAR'} icon={<AiOutlineReload />} handleClick={getCalls} />
      </div>
      <div className="bg-background border-primary/20 flex h-[1200px] w-full flex-col border p-4 shadow-xl lg:h-[720px]">
        <div className="border-primary/20 flex flex-col items-center justify-between border-b p-1">
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-wrap items-center justify-center gap-2 font-['Roboto']">
              <p className="text-center text-xl font-bold text-[#15599a] uppercase">Chamados abertos</p>
              <p className="font-bold text-[#fead61]">({filteredInProgress?.length || 0})</p>
            </div>
            {openCallsDropdownMenuVisible ? (
              <div className="text-primary/80 cursor-pointer hover:text-blue-400">
                <IoMdArrowDropupCircle style={{ fontSize: '25px' }} onClick={() => setOpenCallsDropdownMenuVisible(false)} />
              </div>
            ) : (
              <div className="text-primary/80 cursor-pointer hover:text-blue-400">
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
                    className="border-primary/20 w-full rounded border p-1.5 outline-hidden placeholder:italic lg:w-[350px]"
                    placeholder="DIGITE O NOME DO CLIENTE/USINA"
                    value={inProgressCallsFilters.searchFilter}
                    onChange={(e) => handleInProgressCallsSearchFilter(e.target.value)}
                  />
                  <div className="w-full lg:w-[250px]">
                    <Select
                      isMulti
                      placeholder="TIPO DE CHAMADO"
                      className="min-h-[41px]"
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
                      className="min-h-[41px]"
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
                        control: (base) => ({
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
                        control: (base) => ({
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
        <div className="overscroll-y scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 mt-2 flex grow flex-wrap justify-around gap-2 overflow-y-auto">
          {isLoadingCalls ? (
            <LoadingPage />
          ) : filteredInProgress ? (
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
                )} dark:hover:bg-primary/10 p-3 hover:bg-blue-100`}
              >
                <div className="grid w-full grid-cols-6 items-center gap-2">
                  <h1 className="col-span-3 text-sm font-semibold uppercase">{call.nomeCliente ? call.nomeCliente : call.nomeUsina}</h1>
                  {call.cidade && <p className="text-xxs text-primary/70 col-span-1 text-center font-bold uppercase">{call.cidade}</p>}
                  <p
                    className={`col-span-2 rounded-lg border p-1 text-center text-xs font-bold ${statusStyles[call.statusChamado].textColor} ${
                      statusStyles[call.statusChamado].borderColor
                    }`}
                  >
                    {call.statusChamado}
                  </p>
                </div>
                <div className="mt-2 flex w-full items-center justify-between">
                  <p className="text-primary/60 text-xs uppercase">Responsável:</p>
                  <p className="text-primary/60 text-xs">{call.responsavel}</p>
                </div>
                <div className="mt-2 hidden w-full items-center justify-between lg:flex">
                  <p className="text-primary/60 text-xs uppercase">DEMANDA</p>
                  <p className={`text-xs ${call.demanda === 'EXTERNA' ? 'text-red-500' : 'text-primary/60'}`}>{call.demanda ? call.demanda : '-'}</p>
                </div>
                <div className="mt-2 flex w-full items-center justify-between">
                  <p className="text-primary/60 text-xs uppercase">Tipo de chamado:</p>
                  <p className="text-primary/60 text-xs">{call.tipoChamado}</p>
                </div>
                <div className="mt-2 flex w-full items-center justify-between">
                  <p className="text-primary/60 text-xs uppercase">ABERTURA</p>
                  <p className="text-xxs text-primary/60 uppercase">{dayjs().diff(dayjs(call.abertura), 'hours')} horas em aberto</p>
                  <p className="text-primary/60 text-xs">{new Date(call.abertura).toLocaleString()}</p>
                </div>
                {call.tipoChamado.includes('GARANTIA') &&
                call.statusGarantia !== 'IDENTIFICAÇÃO E TESTES' &&
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
      <div className="bg-background border-primary/20 flex h-[1200px] w-full flex-col border p-4 shadow-xl lg:h-[500px]">
        <div className="border-primary/20 flex flex-col items-center justify-between border-b p-1">
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-wrap items-center justify-center gap-2 font-['Roboto']">
              <p className="text-center text-xl font-bold text-[#15599a] uppercase">CHAMADOS FINALIZADOS</p>
              <p className="font-bold text-[#fead61]">({filteredClosedCalls?.length || 0})</p>
            </div>
            {closedCallsDropdownMenuVisible ? (
              <div className="text-primary/80 cursor-pointer hover:text-blue-400">
                <IoMdArrowDropupCircle style={{ fontSize: '25px' }} onClick={() => setClosedCallsDropdownMenuVisible(false)} />
              </div>
            ) : (
              <div className="text-primary/80 cursor-pointer hover:text-blue-400">
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
                        afterDateFilter: new Date(e.target.value),
                      })
                    }
                    type="date"
                    className="border-primary/20 border p-2 outline-hidden"
                  />
                  <p>&</p>
                  <input
                    value={dayjs(closedCallsFilters.beforeDateFilter).format('YYYY-MM-DD')}
                    onChange={(e) =>
                      setClosedCallsFilters({
                        ...closedCallsFilters,
                        beforeDateFilter: new Date(e.target.value),
                      })
                    }
                    type="date"
                    className="border-primary/20 border p-2 outline-hidden"
                  />
                  <FetchDataButton handleClick={getClosedCallsByDate} text={'BUSCAR'} icon={<MdDateRange />} />
                </div>
                <div className="flex flex-col flex-wrap items-center justify-center gap-2 lg:flex-row">
                  <input
                    value={closedCallsFilters.searchFilter}
                    onChange={(e) => handleClosedCallsSearchFilter(e.target.value)}
                    placeholder="DIGITE O NOME DO CLIENTE/USINA"
                    className="border-primary/20 h-[41px] w-full rounded border p-1.5 outline-hidden placeholder:italic lg:w-[350px]"
                  />
                  <div className="w-full lg:w-[250px]">
                    <Select
                      isMulti
                      placeholder="TIPO DE CHAMADO"
                      styles={{
                        control: (base) => ({
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
                        control: (base) => ({
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
                        control: (base) => ({
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
        <div className="overscroll-y scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 mt-2 flex grow flex-wrap justify-around gap-2 overflow-y-auto">
          {isLoadingClosedCalls ? (
            <LoadingPage />
          ) : filteredClosedCalls ? (
            filteredClosedCalls.map((call) => (
              <div
                onClick={() => handleOpenModal(call._id)}
                key={call._id}
                className="border-primary/20 dark:hover:bg-primary/10 max-h-[180px] w-[370px] cursor-pointer border p-3 hover:bg-blue-100"
              >
                <div className="flex w-full items-center justify-between gap-2">
                  {call.feedbackValor !== undefined && call.feedbackValor !== '' ? (
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
                  {call.cidade && <p className="text-primary/70 text-xs uppercase">{call.cidade}</p>}
                  <p
                    className={`rounded-lg border p-1 text-xs font-bold ${statusStyles[call.statusChamado].textColor} ${statusStyles[call.statusChamado].borderColor}`}
                  >
                    {call.statusChamado}
                  </p>
                </div>
                <div className="mt-2 flex w-full items-center justify-between">
                  <p className="text-primary/60 text-xs uppercase">Responsável:</p>
                  <p className="text-primary/60 text-xs">{call.responsavel}</p>
                </div>
                {call.demanda && (
                  <div className="mt-2 hidden w-full items-center justify-between lg:flex">
                    <p className="text-primary/60 text-xs uppercase">DEMANDA</p>
                    <p className="text-primary/60 text-xs">{call.demanda}</p>
                  </div>
                )}
                <div className="mt-2 flex w-full items-center justify-between">
                  <p className="text-primary/60 text-xs uppercase">Tipo de chamado:</p>
                  <p className="text-primary/60 text-xs">{call.tipoChamado}</p>
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
        className="fixed bottom-10 left-150 cursor-pointer rounded-lg bg-[#15599a] p-3 text-white hover:bg-[#fead61] hover:text-[#15599a]"
      >
        <p className="text-sm font-bold uppercase">Novo chamado</p>
      </div>
      {creationModal && <CreateModal getCalls={getCalls} setModalIsOpen={setCreationModal} />}
      {modalIsOpen && selectedCall && (
        <ModalCallSuporte
          modalIsOpen={modalIsOpen}
          session={session}
          updateModalInfo={updateModalInfo}
          setModalIsOpen={setModalIsOpen}
          info={selectedCall}
        />
      )}
    </div>
  )
}
