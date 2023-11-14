import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import axios from 'axios'
import dayjs from 'dayjs'
import { AnimatePresence, motion } from 'framer-motion'
import { useSession } from 'next-auth/react'

import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'
import { VscDiffAdded } from 'react-icons/vsc'
import { FaMoneyBillWaveAlt, FaMoon, FaSignature } from 'react-icons/fa'
import { BsPatchCheck } from 'react-icons/bs'
import { TbCheckupList } from 'react-icons/tb'

import ModalProjetos from '../../components/ModalProjetos'
import ProjetosSkeleton from '../../components/skeletons/ProjetosSkeleton'
import TagTipoDeServico from '../../components/TagTipoDeServico'
import LoadingPage from '../../components/utils/LoadingPage'

import TextInput from '../../components/inputs/Text'
import SelectInput from '../../components/inputs/Select'
import DateInput from '../../components/inputs/Date'
import MultipleSelectInput from '../../components/inputs/MultipleSelect'

import { accessGrantingStatus, executionStatus, inspectionStatus, reliabilityAnalysts, serviceTypes } from '../../utils/select-options'
import { useEngineeringProjects } from '../../utils/methods/query/engineering'
import { formatDateInputChange } from '../../utils/methods/shared'
import { cidadesAtendidas, vendedores, formatDecimalPlaces, formatDate } from '../../utils/constants'

function Projetos() {
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/authHome')
    },
  })

  const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false)
  const {
    data: projects,
    isSuccess: projectsSuccess,
    isLoading: projectsLoading,
    isError: projectsError,
    filters,
    setFilters,
  } = useEngineeringProjects({ enabled: status == 'authenticated' })

  // const [modalIsOpen, setModalIsOpen] = useState(false)
  const [modalProject, setModalProject] = useState({
    isOpen: false,
    projectId: null,
  })
  function handleUpdates(id) {
    var index = projects.findIndex((x) => x._id == id)
    var indexFiltered = projects.findIndex((x) => x._id == id)
    axios.get(`/api/projects/fetchDoc/${id}`).then((res) => {
      var arr = [...projects]
      arr[index] = res.data[0]
      var arrFiltered = [...projects]
      arrFiltered[indexFiltered] = res.data[0]
      setModalProject(res.data[0])
    })
  }

  function getBorderColorByParecer(date1, date2) {
    var timeDiff = Math.abs(date2.getTime() - date1.getTime())
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24))
    if (diffDays > 110) {
      return 'border-2 border-red-600'
    } else if (diffDays > 105) {
      return 'border-2 border-yellow-500'
    } else if (diffDays > 90) {
      return 'border-2 border-blue-700'
    } else {
      return 'border border-gray-200'
    }
  }
  function getDateDiff(date1, date2) {
    const diffInMs = new Date(date1) - new Date(date2)
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24)
    return Number(diffInDays).toFixed(0)
  }
  function handleOpenModal(id) {
    setModalProject({ projectId: id, isOpen: true })
  }
  function getStats({ info }) {
    if (!info)
      return {
        projetos: 0,
        potencia: 0,
        pareceresNoturnos: 0,
        pendenciasDebitos: 0,
        pareceresAprovados: 0,
        assinaturasPendentes: 0,
        vistoriasPendentes: 0,
      }
    const projectsQty = info.length
    const totalPower = info.reduce((acc, current) => {
      const currentPower = current.sistema?.potPico || 0

      return acc + currentPower
    }, 0)
    const withNightlyAccessGrantings = info.reduce((acc, current) => {
      const hasNigthlyAccessGranting = current.parecer.statusDoParecerDeAcesso == 'PARECER APROVADO - NOTURNO'
      if (hasNigthlyAccessGranting) return acc + 1
      return acc
    }, 0)
    const withDebitDependencies = info.reduce((acc, current) => {
      const hasDebitDependencies = current.parecer.statusDoParecerDeAcesso == 'PENDÊNCIAS - DÉBITOS'
      if (hasDebitDependencies) return acc + 1
      return acc
    }, 0)
    const withAccessGranted = info.reduce((acc, current) => {
      const hasAccessGranted = current.parecer.statusDoParecerDeAcesso == 'PARECER DE ACESSO APROVADO'
      if (hasAccessGranted) return acc + 1
      return acc
    }, 0)
    const withMissingSignature = info.reduce((acc, current) => {
      const hasMissingSignature = current.projeto.dataLiberacaoDocumentacao != undefined && !current.projeto.dataAssDocumentacao
      if (hasMissingSignature) return acc + 1
      return acc
    }, 0)
    const withInspectionDepency = info.reduce((acc, current) => {
      const pendantInspection = !!current.vistoria?.dataPedido && current.vistoria.status != 'REALIZADA'
      if (pendantInspection) return acc + 1
      return acc
    }, 0)
    return {
      projetos: projectsQty,
      potencia: formatDecimalPlaces(totalPower),
      pareceresNoturnos: formatDecimalPlaces(withNightlyAccessGrantings, 0),
      pendenciasDebitos: formatDecimalPlaces(withDebitDependencies, 0),
      pareceresAprovados: formatDecimalPlaces(withAccessGranted, 0),
      assinaturasPendentes: formatDecimalPlaces(withMissingSignature, 0),
      vistoriasPendentes: formatDecimalPlaces(withInspectionDepency, 0),
    }
  }
  function getTotalCircuitBreakers() {
    var circuitBreakerObj = {}
    if (projects) {
      for (let i = 0; i < projects.length; i++) {
        const cbArr = projects[i].material?.disjuntores
        if (cbArr) {
          for (let j = 0; j < cbArr.length; j++) {
            var tag = `${cbArr[j].tipo} ${cbArr[j].corrente}A`
            var currentTagQtde = circuitBreakerObj[tag] ? circuitBreakerObj[tag] : 0
            circuitBreakerObj[tag] = currentTagQtde + cbArr[j].qtde
          }
        }
      }
      if (Object.keys(circuitBreakerObj).length > 0) {
        return circuitBreakerObj
      } else {
        return null
      }
    } else {
      return null
    }
  }
  function sortTotalCircuitBreakerKeys(arrOfKeys) {
    const sortedArr = arrOfKeys.sort((a, b) => a.localeCompare(b, 'pt-br', { numeric: true }))
    return sortedArr
  }
  function getCircuitBreakerTypeColors(str) {
    if (str.includes('MONOFÁSICO')) return 'bg-[#fead61] text-black'
    if (str.includes('BIFÁSICO')) return 'bg-[#15599a] text-white'
    if (str.includes('TRIFÁSICO')) return 'bg-black text-white'
  }

  useEffect(() => {
    if (session) {
      const userRoutes = session.user.accessibleRoutes
      if (!userRoutes.includes('Projetos')) return router.push('/')
    }
  }, [session])
  if (status == 'loading') return <LoadingPage />
  if (status == 'authenticated') {
    if (projectsSuccess && projects) {
      return (
        <div className="p-6 grow">
          <div className="flex flex-col justify-between items-center  gap-2 border-b border-gray-200 p-1">
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col lg:flex-row items-center gap-2">
                <p className="font-black uppercase text-center text-2xl text-[#15599a]">Projetos no estágio de engenharia</p>
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
              <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-3 shadow-sm lg:w-1/6">
                <div className="flex items-center justify-between">
                  <h1 className="text-sm font-medium uppercase tracking-tight">PROJETOS NO ESTÁGIO</h1>
                  <VscDiffAdded />
                </div>
                <div className="mt-2 flex w-full flex-col">
                  <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: projects }).projetos}</div>
                  <p className="text-xs text-gray-500">{getStats({ info: projects }).potencia} kWp</p>
                </div>
              </div>
              <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-3 shadow-sm lg:w-1/6">
                <div className="flex items-center justify-between">
                  <h1 className="text-sm font-medium uppercase tracking-tight">PARECES APROVADOS</h1>
                  <BsPatchCheck />
                </div>
                <div className="mt-2 flex w-full flex-col">
                  <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: projects }).pareceresAprovados}</div>
                </div>
              </div>
              <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-3 shadow-sm lg:w-1/6">
                <div className="flex items-center justify-between">
                  <h1 className="text-sm font-medium uppercase tracking-tight">PARECES NOTURNOS</h1>
                  <FaMoon />
                </div>
                <div className="mt-2 flex w-full flex-col">
                  <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: projects }).pareceresNoturnos} </div>
                </div>
              </div>
              <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-3 shadow-sm lg:w-1/6">
                <div className="flex items-center justify-between">
                  <h1 className="text-sm font-medium uppercase tracking-tight">AGUARDANDO ASSINATURA</h1>
                  <FaSignature />
                </div>
                <div className="mt-2 flex w-full flex-col">
                  <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: projects }).assinaturasPendentes} </div>
                </div>
              </div>
              <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-3 shadow-sm lg:w-1/6">
                <div className="flex items-center justify-between">
                  <h1 className="text-sm font-medium uppercase tracking-tight">VISTORIA PENDENTE</h1>
                  <TbCheckupList />
                </div>
                <div className="mt-2 flex w-full flex-col">
                  <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: projects }).vistoriasPendentes} </div>
                </div>
              </div>
              <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-3 shadow-sm lg:w-1/6">
                <div className="flex items-center justify-between">
                  <h1 className="text-sm font-medium uppercase tracking-tight">PENDÊNCIAS COM DÉBITOS</h1>
                  <FaMoneyBillWaveAlt />
                </div>
                <div className="mt-2 flex w-full flex-col">
                  <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: projects }).pendenciasDebitos} </div>
                </div>
              </div>
            </div>
            <AnimatePresence>
              {dropdownMenuVisible ? (
                <motion.div initial={{ scale: 0.8, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col w-full gap-y-2 mt-4">
                  <div className="flex flex-col lg:flex-row items-center justify-center gap-2">
                    <TextInput
                      label={'NOME DO CONTRATO'}
                      placeholder={'Digite o nome do contrato...'}
                      value={filters.search}
                      handleChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
                    />
                    <div className="flex flex-col lg:flex-row gap-2 w-full lg:w-fit">
                      <div className="flex items-center gap-x-2 justify-center">
                        <div className="w-full lg:w-[250px]">
                          <DateInput
                            width={'100%'}
                            label={'DEPOIS DE'}
                            value={filters.date.after ? formatDate(filters.date.after) : undefined}
                            handleChange={(value) => setFilters((prev) => ({ ...prev, date: { ...prev.date, after: formatDateInputChange(value) } }))}
                          />
                        </div>
                        <div className="w-full lg:w-[250px]">
                          <DateInput
                            width={'100%'}
                            label={'ANTES DE'}
                            value={filters.date.before ? formatDate(filters.date.before) : undefined}
                            handleChange={(value) =>
                              setFilters((prev) => ({ ...prev, date: { ...prev.date, before: formatDateInputChange(value) } }))
                            }
                          />
                        </div>
                      </div>
                      <div className="w-full lg:w-[250px]">
                        <SelectInput
                          width={'100%'}
                          label={'CAMPO DE FILTRO'}
                          value={filters.date.field1 && filters.date.field2 ? `${filters.date.field1}.${filters.date.field2}` : null}
                          options={[
                            {
                              id: 1,
                              label: 'DATA DE PAGAMENTO',
                              value: 'compra.dataPagamento',
                            },
                            { id: 2, label: 'DATA ASS.CONTRATO', value: 'contrato.dataAssinatura' },
                            { id: 3, label: 'DATA ASS.DOCUMENTAÇÃO', value: 'projeto.dataAssDocumentacao' },
                            { id: 4, label: 'TROCA DO MEDIDOR', value: 'medidor.data' },
                            { id: 5, label: 'DATA DE SOLICITAÇÃO DO PARECER', value: 'projeto.dataSolicitacaoAcesso' },
                            { id: 6, label: 'APROVAÇÃO DO PARECER', value: 'parecer.dataParecerDeAcesso' },
                            { id: 7, label: 'PEDIDO DA VISTORIA', value: 'vistoria.dataPedido' },
                            { id: 8, label: 'NÃO DEFINIDO', value: null },
                          ]}
                          selectedItemLabel={'SEM FILTRO'}
                          handleChange={(value) =>
                            setFilters((prev) => ({
                              ...prev,
                              date: {
                                ...prev.date,
                                field1: value != null ? value.split('.')[0] : null,
                                field2: value != null ? value.split('.')[1] : null,
                              },
                            }))
                          }
                          onReset={() =>
                            setFilters((prev) => ({
                              ...prev,
                              date: {
                                after: null,
                                before: null,
                                field1: null,
                                field2: null,
                              },
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div className="w-full lg:w-[250px]">
                      <MultipleSelectInput
                        width={'100%'}
                        label={'TIPO DE SERVIÇO'}
                        selected={filters.serviceType}
                        options={serviceTypes}
                        selectedItemLabel={'SEM FILTRO'}
                        handleChange={(value) =>
                          setFilters((prev) => ({
                            ...prev,
                            serviceType: value,
                          }))
                        }
                        onReset={() =>
                          setFilters((prev) => ({
                            ...prev,
                            serviceType: [],
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="flex flex-col lg:flex-row items-center justify-center gap-2 flex-wrap">
                    <div className="w-full lg:w-[250px]">
                      <MultipleSelectInput
                        width={'100%'}
                        label={'STATUS DE ENTREGA'}
                        selected={filters.deliveryStatus}
                        options={[
                          { id: 1, value: 'EM ROTA', label: 'EM ROTA' },
                          {
                            id: 2,
                            value: 'AGUARDANDO COMPRA',
                            label: 'AGUARDANDO COMPRA',
                          },
                          { id: 3, value: 'CANCELADO', label: 'CANCELADO' },
                        ]}
                        selectedItemLabel={'SEM FILTRO'}
                        handleChange={(value) =>
                          setFilters((prev) => ({
                            ...prev,
                            deliveryStatus: value,
                          }))
                        }
                        onReset={() =>
                          setFilters((prev) => ({
                            ...prev,
                            deliveryStatus: [],
                          }))
                        }
                      />
                    </div>
                    <div className="w-full lg:w-[250px]">
                      <MultipleSelectInput
                        width={'100%'}
                        label={'STATUS DO PARECER'}
                        selected={filters.grantingStatus}
                        options={accessGrantingStatus}
                        selectedItemLabel={'SEM FILTRO'}
                        handleChange={(value) =>
                          setFilters((prev) => ({
                            ...prev,
                            grantingStatus: value,
                          }))
                        }
                        onReset={() =>
                          setFilters((prev) => ({
                            ...prev,
                            grantingStatus: [],
                          }))
                        }
                      />
                    </div>
                    <div className="w-full lg:w-[250px]">
                      <MultipleSelectInput
                        width={'100%'}
                        label={'STATUS DA OBRA'}
                        selected={filters.executionStatus}
                        options={executionStatus}
                        selectedItemLabel={'SEM FILTRO'}
                        handleChange={(value) =>
                          setFilters((prev) => ({
                            ...prev,
                            executionStatus: value,
                          }))
                        }
                        onReset={() =>
                          setFilters((prev) => ({
                            ...prev,
                            executionStatus: [],
                          }))
                        }
                      />
                    </div>
                    <div className="w-full lg:w-[250px]">
                      <MultipleSelectInput
                        width={'100%'}
                        label={'STATUS DA VISTORIA'}
                        selected={filters.inspectionStatus}
                        options={inspectionStatus}
                        selectedItemLabel={'SEM FILTRO'}
                        handleChange={(value) =>
                          setFilters((prev) => ({
                            ...prev,
                            inspectionStatus: value,
                          }))
                        }
                        onReset={() =>
                          setFilters((prev) => ({
                            ...prev,
                            inspectionStatus: [],
                          }))
                        }
                      />
                    </div>

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
                        label={'VENDEDOR'}
                        selected={filters.sellerName}
                        options={vendedores.map((seller, index) => ({ id: index + 1, label: seller.nome, value: seller.nome }))}
                        selectedItemLabel={'SEM FILTRO'}
                        handleChange={(value) =>
                          setFilters((prev) => ({
                            ...prev,
                            sellerName: value,
                          }))
                        }
                        onReset={() =>
                          setFilters((prev) => ({
                            ...prev,
                            sellerName: [],
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="flex flex-col lg:flex-row items-center justify-center gap-2">
                    <div
                      onClick={() =>
                        setFilters({
                          ...filters,
                          necessaryDistribution: !filters.necessaryDistribution,
                        })
                      }
                      className={`${
                        filters.necessaryDistribution ? 'bg-[#15599a]' : 'bg-blue-300'
                      } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
                    >
                      NECESSÁRIO DISTRIBUIÇÃO
                    </div>
                    <div
                      onClick={() =>
                        setFilters({
                          ...filters,
                          necessaryHomologation: !filters.necessaryHomologation,
                        })
                      }
                      className={`${
                        filters.necessaryHomologation ? 'bg-[#15599a]' : 'bg-blue-300'
                      } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
                    >
                      NECESSÁRIO HOMOLOGAÇÃO
                    </div>
                    <div
                      onClick={() =>
                        setFilters({
                          ...filters,
                          notNecessaryHomologation: !filters.notNecessaryHomologation,
                        })
                      }
                      className={`${
                        filters.notNecessaryHomologation ? 'bg-[#15599a]' : 'bg-blue-300'
                      } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
                    >
                      NÃO NECESSÁRIO HOMOLOGAÇÃO
                    </div>
                    <div
                      onClick={() =>
                        setFilters({
                          ...filters,
                          missingDraw: !filters.missingDraw,
                        })
                      }
                      className={`${
                        filters.missingDraw ? 'bg-[#15599a]' : 'bg-blue-300'
                      } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
                    >
                      DESENHO PENDENTE
                    </div>
                    <div
                      onClick={() =>
                        setFilters({
                          ...filters,
                          missingSignature: !filters.missingSignature,
                        })
                      }
                      className={`${
                        filters.missingSignature ? 'bg-[#15599a]' : 'bg-blue-300'
                      } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
                    >
                      FALTANDO ASSINATURA
                    </div>
                    <div
                      onClick={() =>
                        setFilters({
                          ...filters,
                          failedGranting: !filters.failedGranting,
                        })
                      }
                      className={`${
                        filters.failedGranting ? 'bg-[#15599a]' : 'bg-blue-300'
                      } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
                    >
                      PARECER REPROVADO
                    </div>
                    <div
                      onClick={() =>
                        setFilters({
                          ...filters,
                          failedInspection: !filters.failedInspection,
                        })
                      }
                      className={`${
                        filters.failedInspection ? 'bg-[#15599a]' : 'bg-blue-300'
                      } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
                    >
                      VISTORIA REPROVADA
                    </div>
                  </div>
                  {getTotalCircuitBreakers() ? (
                    <div className="flex flex-col items-center justify-center gap-2">
                      <h1 className="text-gray-600 font-medium">CONTAGEM DE DISJUNTORES CADASTRADOS</h1>
                      <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-2">
                        {sortTotalCircuitBreakerKeys(Object.keys(getTotalCircuitBreakers())).map(
                          //Object.keys(getTotalCircuitBreakers())
                          (key, index) => (
                            <p key={index} className={`${getCircuitBreakerTypeColors(key)} p-1 rounded text-center`}>
                              {key} - ({getTotalCircuitBreakers()[key]} UN)
                            </p>
                          )
                        )}
                      </div>
                    </div>
                  ) : null}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
          <div className="flex  justify-around gap-3 mt-4 flex-wrap">
            {projects.map((project, index) => (
              <motion.div
                onClick={() => {
                  handleOpenModal(project._id)
                }}
                key={project._id}
                initial={{ opacity: 0, translateX: -50, translateY: -35 }}
                animate={{ opacity: 1, translateX: 0, translateY: 0 }}
                transition={{ duration: 0.3, delay: 0.01 * index }}
                className={`w-full md:w-[350px] lg:w-[450px] cursor-pointer ${
                  project.parecer.dataParecerDeAcesso != undefined && project.vistoria.status != 'REALIZADA'
                    ? getBorderColorByParecer(new Date(project.parecer.dataParecerDeAcesso), new Date())
                    : 'border border-gray-200'
                }  hover:bg-blue-100`}
              >
                <TagTipoDeServico tipoDeServico={project.tipoDeServico} />
                <div className="flex flex-col p-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-700">{project.nomeDoContrato}</p>
                    <p className="text-xs text-[#15599a]">#{project.qtde}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xxs">PARECER DE ACESSO</span>
                      <p className="text-xs text-gray-600">
                        {project.parecer.statusDoParecerDeAcesso ? project.parecer.statusDoParecerDeAcesso : '-'}
                      </p>
                    </div>
                    <div className="text-end">
                      <span className="text-xxs text-end">VISTORIA</span>
                      <p className="text-xs text-center text-gray-600">{project.vistoria.status ? project.vistoria.status : '-'}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xxs">DIAGRAMA UNIFILAR</span>
                      <p className={`${project.projeto.diagramaUnifilar ? 'text-yellow-500' : 'text-red-400'} text-xs uppercase`}>
                        {project.projeto.diagramaUnifilar ? project.projeto.diagramaUnifilar : 'PENDENTE'}
                      </p>
                    </div>
                    <div>
                      <span className="text-xxs text-center">
                        {project.compra.statusEntrega == 'ENTREGUE' ? 'DATA DE ENTREGA' : 'PREV. DE ENTREGA'}
                      </span>
                      <p className={`text-gray-600 text-xs uppercase text-center`}>
                        {project.compra.statusEntrega == 'ENTREGUE' && project.compra.dataEntrega
                          ? dayjs(project.compra.dataEntrega).add(4, 'h').format('DD/MM/YYYY')
                          : project.compra.previsaoEntrega
                          ? dayjs(project.compra.previsaoEntrega).add(4, 'h').format('DD/MM/YYYY')
                          : '-'}
                      </p>
                    </div>
                    <div>
                      <span className="text-xxs">DESENHO DO TELHADO</span>
                      <p className="text-xs text-gray-600 text-center">{project.projeto.desenhoTelhado ? project.projeto.desenhoTelhado : '-'}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="w-full flex flex-col">
                      <span className="text-xxs">DESDE ASS.CONTRATO</span>
                      <p className={`text-xs uppercase text-red-500 text-start`}>
                        {project.contrato.dataAssinatura ? `${getDateDiff(new Date(), new Date(project.contrato.dataAssinatura))} DIAS` : '-'}
                      </p>
                    </div>
                    {project.parecer.statusDoParecerDeAcesso == 'PARECER DE ACESSO COM OBRAS' && (
                      <div className="w-full flex flex-col">
                        <span className="text-xxs text-center">DIAS DE OBRA</span>
                        <p className={`text-xs uppercase text-red-500 text-center`}>
                          {project.parecer.qtdeDiasObraDeRede ? `${project.parecer.qtdeDiasObraDeRede} DIAS` : '-'}
                        </p>
                      </div>
                    )}
                    <div className="w-full flex flex-col">
                      <span className="text-xxs text-end">DESDE APROV.PARECER</span>
                      <p className={`text-xs uppercase text-red-500 text-end`}>
                        {project.parecer.dataParecerDeAcesso ? `${getDateDiff(new Date(), new Date(project.parecer.dataParecerDeAcesso))} DIAS` : '-'}
                      </p>
                    </div>
                  </div>
                  {project.projeto.dataSolicitacaoAcesso ? (
                    <div className="flex items-center w-full justify-between">
                      <p className="text-xxs ">
                        {project.parecer?.dataParecerDeAcesso ? 'ATÉ APROVAÇÃO DO PARECER' : 'DESDE A SOLICITAÇÃO DE ACESSO'}
                      </p>
                      <p className="text-xs text-gray-600 text-start">
                        {project.parecer?.dataParecerDeAcesso
                          ? `${getDateDiff(new Date(project.parecer?.dataParecerDeAcesso), new Date(project.projeto.dataSolicitacaoAcesso))} DIAS`
                          : `${getDateDiff(new Date(), new Date(project.projeto.dataSolicitacaoAcesso))} DIAS`}
                      </p>
                    </div>
                  ) : null}
                </div>
              </motion.div>
            ))}
          </div>
          <Link href={'/projetos/analisesTecnicas'}>
            <a className="fixed bg-[#15599a] cursor-pointer hover:bg-[#fead61] text-white hover:text-[#15599a] p-3 rounded-lg bottom-10 left-150">
              <p className="uppercase font-bold text-sm">Visitas técnicas</p>
            </a>
          </Link>
          {modalProject.isOpen && modalProject.projectId && (
            <ModalProjetos
              projectId={modalProject.projectId}
              modalIsOpen={modalProject.isOpen}
              handleUpdates={handleUpdates}
              closeModal={() => setModalProject({ isOpen: false, projectId: null })}
            />
          )}
        </div>
      )
    } else {
      return <ProjetosSkeleton />
    }
  }
}

export default Projetos
