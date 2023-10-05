import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Select from 'react-select'
import Link from 'next/link'
import { AiOutlineSearch, AiOutlineShoppingCart, AiOutlineThunderbolt } from 'react-icons/ai'
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'
import { AnimatePresence, motion } from 'framer-motion'
import { formatDate, formatDecimalPlaces, statusLiberacao, tiposDeServico } from '../../utils/constants'
import ModalSuprimentos from '../../components/ModalSuprimentos'
import dayjs from 'dayjs'
import dayjsBusinessDays from 'dayjs-business-days'
import TagTipoDeServico from '../../components/TagTipoDeServico'
import SuprimentosSkeleton from '../../components/skeletons/SuprimentosSkeleton'
import FilterButton from '../../components/utils/Buttons/FilterButton'
import { useSession } from 'next-auth/react'
import LoadingPage from '../../components/utils/LoadingPage'
import { MdAttachMoney } from 'react-icons/md'
import { VscDiffAdded } from 'react-icons/vsc'
import { useSupplyProjects } from '../../utils/methods/query/supply'
import DateInput from '../../components/inputs/Date'
import { formatDateInputChange } from '../../utils/methods/shared'
import SelectInput from '../../components/inputs/Select'
import TextInput from '../../components/inputs/Text'
import MultipleSelectInput from '../../components/inputs/MultipleSelect'
import { useQueryClient } from 'react-query'
import { TbTruckDelivery } from 'react-icons/tb'
import { supplementationStatus } from '../../utils/select-options'
function Suprimentos() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/authHome')
    },
  })
  dayjs.extend(dayjsBusinessDays)
  const { data: projects, isSuccess: projectsSuccess, filters, setFilters } = useSupplyProjects({ enabled: !!session?.user })
  const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false)

  const [modalProject, setModalProject] = useState({
    isOpen: false,
    projectId: null,
  })
  async function handleUpdates() {
    await queryClient.invalidateQueries({ queryKey: ['supply-projects'] })
  }

  function getBorderColor(liberationDate) {
    const diff = dayjs(new Date()).businessDiff(dayjs(liberationDate))
    if (diff > 5) {
      return 'border-2 border-red-600'
    } else if (diff >= 4) {
      return 'border-2 border-yellow-500'
    } else if (diff > 2) {
      return 'border-2 border-blue-700'
    } else {
      return 'border border-gray-200'
    }
  }

  function getStats({ info }) {
    if (!info)
      return {
        projetos: 0,
        potencia: 0,
        previsto: 0,
        pago: 0,
        resultado: 0,
        pendentes: 0,
        emRota: 0,
      }
    const projectsQty = info.length
    const totalPower = info.reduce((acc, current) => {
      const currentPower = current.sistema?.potPico || 0
      return acc + currentPower
    }, 0)
    const totalPredictedPayInKits = info.reduce((acc, current) => {
      const predicted = current.compra?.previsaoValorDoKit || 0
      const costDefined = !!current.compra?.valorDoKit
      if (costDefined) {
        return acc + predicted
      }
      return acc
    }, 0)
    const totalPaidInKits = info.reduce((acc, current) => {
      const paid = current.compra?.valorDoKit || 0
      return acc + paid
    }, 0)
    const pendingPurchases = info.reduce((acc, current) => {
      const purchased = !!current.compra?.dataPedido
      const status = current.compra.status
      if ((!purchased && status == 'NÃO DEFINIDO') || !status) return acc + 1
      else return acc
    }, 0)
    const onDeliveryRoute = info.reduce((acc, current) => {
      const onRoute = current.compra?.statusEntrega == 'EM ROTA'
      if (onRoute) return acc + 1
      else return acc
    }, 0)
    return {
      projetos: projectsQty,
      potencia: formatDecimalPlaces(totalPower, 2),
      previsto: formatDecimalPlaces(totalPredictedPayInKits, 2),
      pago: formatDecimalPlaces(totalPaidInKits, 2),
      resultado: 100 - (totalPaidInKits / totalPredictedPayInKits) * 100,
      pendentes: pendingPurchases,
      emRota: onDeliveryRoute,
    }
  }

  function handleOpenModal(id) {
    console.log('ID ESCOLHIDO', id)
    setModalProject({ projectId: id, isOpen: true })
  }
  useEffect(() => {
    if (session) {
      const userRoutes = session.user.accessibleRoutes
      if (!userRoutes.includes('Suprimentos')) return router.push('/')
    }
  }, [session])
  console.log(modalProject)
  if (status != 'authenticated') return <LoadingPage />
  if (projectsSuccess && projects) {
    return (
      <div className="p-6 grow">
        <div className="flex flex-col justify-between border-b border-gray-200 p-1">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col lg:flex-row items-center gap-2">
              <p className="font-black uppercase text-center text-2xl text-[#15599a]">Projetos no estágio de suprimentos</p>
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
                <h1 className="text-sm font-medium uppercase tracking-tight">COMPRAS PENDENTES</h1>
                <AiOutlineShoppingCart />
              </div>
              <div className="mt-2 flex w-full flex-col">
                <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: projects }).pendentes} </div>
              </div>
            </div>
            <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-3 shadow-sm lg:w-1/6">
              <div className="flex items-center justify-between">
                <h1 className="text-sm font-medium uppercase tracking-tight">EM ROTA</h1>
                <TbTruckDelivery />
              </div>
              <div className="mt-2 flex w-full flex-col">
                <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: projects }).emRota}</div>
              </div>
            </div>
            <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-3 shadow-sm lg:w-1/6">
              <div className="flex items-center justify-between">
                <h1 className="text-sm font-medium uppercase tracking-tight">VALOR GASTO EM KITS</h1>
                <MdAttachMoney />
              </div>
              <div className="mt-2 flex w-full flex-col">
                <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: projects }).pago}</div>
                <p className="text-xs text-gray-500">
                  {Number(getStats({ info: projects }).resultado) > 0
                    ? `${formatDecimalPlaces(getStats({ info: projects }).resultado, 2)}% a menos que o previsto`
                    : `${formatDecimalPlaces(getStats({ info: projects }).resultado, 2)}% a mais que o previsto`}{' '}
                </p>
              </div>
            </div>
            <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-3 shadow-sm lg:w-1/6">
              <div className="flex items-center justify-between">
                <h1 className="text-sm font-medium uppercase tracking-tight">VALOR PREVISTO EM KITS</h1>
                <MdAttachMoney />
              </div>
              <div className="mt-2 flex w-full flex-col">
                <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: projects }).previsto}</div>
              </div>
            </div>
          </div>
          <AnimatePresence>
            {dropdownMenuVisible ? (
              <motion.div initial={{ scale: 0.8, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col w-full gap-y-2 mt-4">
                <div className="flex flex-col lg:flex-row items-center justify-center gap-2 flex-wrap">
                  <TextInput
                    label={'NOME DO CONTRATO'}
                    value={filters.search}
                    placeholder={'Digite o nome do contrato...'}
                    handleChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
                  />
                  <div className="flex flex-col lg:flex-row gap-2 w-full lg:w-fit">
                    <div className="flex items-center gap-x-2 justify-center">
                      <DateInput
                        label={'DEPOIS DE'}
                        value={filters.date.after ? formatDate(filters.date.after) : undefined}
                        handleChange={(value) => setFilters((prev) => ({ ...prev, date: { ...prev.date, after: formatDateInputChange(value) } }))}
                      />
                      <DateInput
                        label={'ANTES DE'}
                        value={filters.date.before ? formatDate(filters.date.before) : undefined}
                        handleChange={(value) => setFilters((prev) => ({ ...prev, date: { ...prev.date, before: formatDateInputChange(value) } }))}
                      />
                    </div>
                    <div className="w-full lg:w-[250px]">
                      <SelectInput
                        label={'CAMPO DE FILTRO'}
                        value={filters.date.field1 && filters.date.field2 ? `${filters.date.field1}.${filters.date.field2}` : null}
                        options={[
                          {
                            id: 1,
                            label: 'DATA PAGAMENTO',
                            value: 'compra.dataPagamento',
                          },
                          {
                            id: 2,
                            label: 'DATA MÁX P/ PAGAMENTO',
                            value: 'compra.dataMaxPagamento',
                          },
                          {
                            id: 3,
                            label: 'PREVISÃO DE ENTREGA',
                            value: 'compra.previsaoEntrega',
                          },
                          {
                            id: 3,
                            label: 'DATA DO PEDIDO',
                            value: 'compra.dataPedido',
                          },
                        ]}
                        selectedItemLabel={'NÃO DEFINIDO'}
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
                </div>
                <div className="flex flex-col lg:flex-row items-center justify-center gap-2 flex-wrap">
                  <MultipleSelectInput
                    label={'STATUS DE SUPLEMENTAÇÃO'}
                    selected={filters.supplyStatus}
                    options={supplementationStatus}
                    selectedItemLabel={'NÃO DEFINIDO'}
                    handleChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        supplyStatus: value,
                      }))
                    }
                    onReset={() =>
                      setFilters((prev) => ({
                        ...prev,
                        supplyStatus: [],
                      }))
                    }
                  />

                  <MultipleSelectInput
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
                    selectedItemLabel={'NÃO DEFINIDO'}
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
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
        <div className="flex justify-around gap-3 mt-4 flex-wrap">
          {projects.map((project, index) => (
            <motion.div
              onClick={() => {
                handleOpenModal(project._id)
              }}
              initial={{ opacity: 0, translateX: -50, translateY: -35 }}
              animate={{ opacity: 1, translateX: 0, translateY: 0 }}
              transition={{ duration: 0.3, delay: 0.01 * index }}
              key={project._id}
              className={`w-full md:w-[350px] lg:w-[450px] cursor-pointer ${
                project.compra.dataPedido == undefined ? getBorderColor(project.compra.dataLiberacao) : 'border border-gray-200'
              } hover:bg-blue-100`}
            >
              <TagTipoDeServico tipoDeServico={project.tipoDeServico} />
              <div className="flex flex-col p-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-700">{project.nomeDoContrato}</p>
                  <p className="text-xs text-[#15599a]">#{project.qtde}</p>
                </div>
                <div className="grid grid-cols-2 mt-2">
                  <div className="flex flex-col items-start">
                    <span className="text-xxs">INFORMAÇÕES</span>
                    <p className="text-xs  text-gray-600 uppercase">{project.compra.informacoes ? project.compra.informacoes : '-'}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xxs">STATUS</span>
                    <p className="text-xs text-center text-gray-600">{project.compra.status ? project.compra.status : '-'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 items-center mt-1">
                  <div className="flex flex-col items-start">
                    <span className="text-xxs">FORNECEDOR</span>
                    <p className="text-xs text-yellow-500">{project.compra.fornecedor ? project.compra.fornecedor : '-'}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xxs">PREVISÃO ENTREGA</span>
                    {dayjs(new Date()).isBefore(dayjs(dayjs(project.compra.previsaoEntrega).add(22, 'hour'))) ? (
                      <p
                        className={`text-xs ${
                          dayjs(project.compra.previsaoEntrega).diff(new Date(), 'day') < 7 ? 'text-red-500 font-bold' : 'text-green-500 font-bold'
                        } text-center`}
                      >
                        {project.compra.previsaoEntrega
                          ? dayjs(new Date(project.compra.previsaoEntrega)).isValid()
                            ? dayjs(dayjs(project.compra.previsaoEntrega).add(4, 'hour')).format('DD/MM/YYYY')
                            : '-'
                          : '-'}
                      </p>
                    ) : (
                      <p className="text-red-500 font-bold text-xs lg:text-sm">PREV.VENCIDA</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xxs">STATUS ENTREGA</span>
                    <p className="text-xs text-gray-600">{project.compra.statusEntrega ? project.compra.statusEntrega : '-'}</p>
                  </div>
                </div>
                <div className="flex flex-col items-center pt-1">
                  <span className="text-xxs">FATURAMENTO</span>
                  <p className="text-xs text-center text-gray-600 uppercase">
                    {project.faturamento?.previsaoFaturamento ? project.faturamento?.previsaoFaturamento : '-'}
                  </p>
                </div>
                <div className="flex items-center justify-center">
                  <div>
                    <span className="text-xxs">DESDE LIBERAÇÃO ATÉ PEDIDO</span>
                    <p className={`text-xs uppercase ${project.compra.dataPedido ? 'text-gray-600' : 'text-red-500'} text-center`}>
                      {project.compra.dataPedido
                        ? `${dayjs(dayjs(project.compra.dataPedido).add(22, 'hour')).businessDiff(dayjs(project.compra.dataLiberacao))} DIAS`
                        : `${dayjs(new Date()).businessDiff(dayjs(project.compra.dataLiberacao))} DIAS`}
                    </p>
                  </div>
                </div>
                {project.compra.dataPagamento == undefined &&
                project.compra.dataMaxPagamento != null &&
                dayjs(new Date(project.compra.dataMaxPagamento)).isValid() ? (
                  dayjs(project.compra.dataMaxPagamento).isAfter(dayjs()) ? (
                    <p
                      className={`text-center text-sm ${
                        dayjs(project.compra.dataMaxPagamento).diff(new Date(), 'days') < 2 ? 'text-red-500' : 'text-gray-600'
                      } italic`}
                    >
                      DATA PAGAMENTO LIMITE EM: {dayjs(project.compra.dataMaxPagamento).diff(new Date(), 'day')} DIA(S)
                    </p>
                  ) : (
                    <p className="text-center text-sm text-red-500 italic font-bold">PAGAMENTO ATRASADO</p>
                  )
                ) : (
                  false
                )}
              </div>
            </motion.div>
          ))}
        </div>
        <Link href={'/obras/conferenciaMaterial'}>
          <a className="fixed bg-[#15599a] cursor-pointer hover:bg-[#fead61] text-white hover:text-[#15599a] p-3 rounded-lg bottom-10 left-150">
            <p className="uppercase font-bold text-sm">CONFERÊNCIA DE MATERIAIS</p>
          </a>
        </Link>
        {session?.user?.regional == undefined && (
          <Link href={'/suprimentos/cotacoes'}>
            <a className="fixed bg-[#15599a] cursor-pointer ml-[0px] lg:ml-[240px] hover:bg-[#fead61] text-white hover:text-[#15599a] p-3 rounded-lg bottom-[7rem] lg:bottom-10 left-150">
              <p className="uppercase font-bold text-sm">COTAÇÕES</p>
            </a>
          </Link>
        )}
        {modalProject.isOpen && modalProject.projectId ? (
          <ModalSuprimentos
            handleUpdates={handleUpdates}
            modalIsOpen={modalProject.isOpen}
            projectId={modalProject.projectId}
            editor={session?.user?.accessibleRoutes.includes('Suprimentos') && session?.user?.regional == undefined ? true : false}
            ppsEditor={session?.user?.accessibleRoutes.includes('PPS') ? true : false}
            credentials={session?.user}
            closeModal={() => setModalProject({ isOpen: false, projectId: null })}
          />
        ) : null}
      </div>
    )
  } else {
    return <SuprimentosSkeleton />
  }
}

export default Suprimentos
