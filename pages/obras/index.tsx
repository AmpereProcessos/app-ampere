import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { AiOutlineSearch } from 'react-icons/ai'
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'
import { AnimatePresence, motion } from 'framer-motion'
import ModalObras from '../../components/ModalObras'
import ObrasSkeleton from '../../components/skeletons/ObrasSkeleton'
import { cidadesAtendidas, equipesTecnicas, formatDecimalPlaces, statusLiberacao, statusObra, tiposDeServico } from '../../utils/constants'
import dayjs from 'dayjs'
import TagTipoDeServico from '../../components/TagTipoDeServico'
import FilterButton from '../../components/utils/Buttons/FilterButton'
import { useSession } from 'next-auth/react'
import LoadingPage from '../../components/utils/LoadingPage'
import { useExecutionProjects } from '../../utils/methods/query/execution'
import { VscDiffAdded } from 'react-icons/vsc'
import { MdAttachMoney, MdCreate, MdPaid } from 'react-icons/md'
import { FaSignature } from 'react-icons/fa'
import TextInput from '../../components/inputs/Text'
import SelectInput from '../../components/inputs/Select'
import MultipleSelectInput from '../../components/inputs/MultipleSelect'
import { executionStatus, serviceTypes, structureTypes } from '../../utils/select-options'
import { TProjectDTO } from '../../utils/schemas/projects'
import { TbTextPlus, TbTruckDelivery } from 'react-icons/tb'
import { GrStorage } from 'react-icons/gr'
function Obras() {
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/authHome')
    },
  })
  const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false)

  const { data: projects, isSuccess, isLoading, isError, filters, setFilters } = useExecutionProjects()
  const [modalProject, setModalProject] = useState<{ isOpen: boolean; projectId: string | null }>({
    isOpen: false,
    projectId: null,
  })

  function getBorderColorByParecer(date1: string, date2: string, statusObra: string) {
    const Date1AsDate = new Date(date1)
    const Date2AsDate = new Date(date2)
    var timeDiff = Math.abs(Date2AsDate.getTime() - Date1AsDate.getTime())
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24))
    if (statusObra == 'CASA EM CONSTRUÇÃO') {
      return 'border-2 border-yellow-500'
    } else if (diffDays > 110) {
      return 'border-2 border-red-600'
    } else if (diffDays > 100) {
      return 'border-2 border-blue-500'
    } else if (diffDays > 90) {
      return 'border-2 border-green-500'
    } else {
      return 'border border-gray-200'
    }
  }
  function handleOpenModal(id: string) {
    setModalProject({ isOpen: true, projectId: id })
  }
  function getStats({ info }: { info: TProjectDTO[] }) {
    if (!info) {
      return {
        projetos: 0,
        potencia: 0,
        entregues: 0,
        emRota: 0,
        pagos: 0,
        obsPendente: 0,
      }
    }

    const projectsQty = info.length
    const totalPower = info.reduce((acc, current) => {
      const currentPower = current.sistema?.potPico || 0
      return acc + currentPower
    }, 0)
    const delivered = info.reduce((acc, current) => {
      const isDelivered = current.compra.statusEntrega == 'ENTREGUE'
      if (isDelivered) return acc + 1
      else return acc
    }, 0)
    const onDeliveryRoute = info.reduce((acc, current) => {
      const onRoute = current.compra?.statusEntrega == 'EM ROTA'
      if (onRoute) return acc + 1
      else return acc
    }, 0)
    const equipmentsPaid = info.reduce((acc, current) => {
      const isPaid = !!current.compra.dataPagamento
      if (isPaid) return acc + 1
      else return acc
    }, 0)
    const missingObservations = info.reduce((acc, current) => {
      const isMissingObservations = !current.obra.observacoes || current.obra.observacoes?.trim().length <= 2
      if (isMissingObservations) return acc + 1
      else return acc
    }, 0)
    return {
      projetos: projectsQty,
      potencia: formatDecimalPlaces(totalPower, 2),
      entregues: delivered,
      emRota: onDeliveryRoute,
      pagos: equipmentsPaid,
      obsPendente: missingObservations,
    }
  }
  useEffect(() => {
    if (session) {
      // @ts-ignore
      const userRoutes = session?.user?.accessibleRoutes
      if (!userRoutes.includes('PPS')) {
        router.push('/')
      }
    }
  }, [session])
  console.log(isSuccess, projects)
  if (isSuccess && projects)
    return (
      <div className="p-6 grow">
        <div className="flex flex-col items-center justify-between gap-2 border-b border-gray-200 p-1">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col lg:flex-row items-center gap-2">
              <p className="font-black uppercase text-center text-2xl text-[#15599a]">Projetos no estágio de execução</p>
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
                <h1 className="text-sm font-medium uppercase tracking-tight">ENTREGUE</h1>
                <GrStorage />
              </div>
              <div className="mt-2 flex w-full flex-col">
                <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: projects }).entregues}</div>
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
            <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-3 shadow-sm lg:w-1/4">
              <div className="flex items-center justify-between">
                <h1 className="text-sm font-medium uppercase tracking-tight">EQUIPAMENTOS PAGOS</h1>
                <MdPaid />
              </div>
              <div className="mt-2 flex w-full flex-col">
                <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: projects }).pagos}</div>
              </div>
            </div>
            <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-3 shadow-sm lg:w-1/4">
              <div className="flex items-center justify-between">
                <h1 className="text-sm font-medium uppercase tracking-tight">SEM OBSERVAÇÕES</h1>
                <TbTextPlus />
              </div>
              <div className="mt-2 flex w-full flex-col">
                <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: projects }).obsPendente}</div>
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
                  <TextInput
                    label={'TIPO DE TELHA'}
                    value={filters.roofTileType}
                    placeholder={'Digite o tipo de telha...'}
                    handleChange={(value) => setFilters((prev) => ({ ...prev, roofTileType: value }))}
                  />
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
                          serviceType: value as string[],
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
                      label={'CIDADE'}
                      selected={filters.city}
                      options={cidadesAtendidas.map((city, index) => ({ id: index + 1, label: city, value: city }))}
                      selectedItemLabel={'SEM FILTRO'}
                      handleChange={(value) =>
                        setFilters((prev) => ({
                          ...prev,
                          city: value as string[],
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
                      label={'EQUIPE RESPONSÁVEL'}
                      selected={filters.technicalTeam}
                      options={equipesTecnicas.map((team, index) => ({ id: index + 1, label: team.label, value: team.value }))}
                      selectedItemLabel={'SEM FILTRO'}
                      handleChange={(value) =>
                        setFilters((prev) => ({
                          ...prev,
                          technicalTeam: value as string[],
                        }))
                      }
                      onReset={() =>
                        setFilters((prev) => ({
                          ...prev,
                          technicalTeam: [],
                        }))
                      }
                    />
                  </div>
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
                        {
                          id: 3,
                          value: 'ENTREGUE',
                          label: 'ENTREGUE',
                        },
                        { id: 4, value: 'CANCELADO', label: 'CANCELADO' },
                      ]}
                      selectedItemLabel={'SEM FILTRO'}
                      handleChange={(value) =>
                        setFilters((prev) => ({
                          ...prev,
                          deliveryStatus: value as string[],
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
                      label={'STATUS DA ESTRUTURA'}
                      selected={filters.personalizedStructureStatus}
                      options={[
                        {
                          id: 1,
                          label: 'PRONTA',
                          value: 'PRONTA',
                        },
                        {
                          id: 2,
                          label: 'PENDÊNCIA',
                          value: 'PENDÊNCIA',
                        },
                        {
                          id: 3,
                          label: 'N/A',
                          value: 'N/A',
                        },
                        {
                          id: 4,
                          label: 'NÃO DEFINDO',
                          value: 'NÃO DEFINDO',
                        },
                      ]}
                      selectedItemLabel={'SEM FILTRO'}
                      handleChange={(value) =>
                        setFilters((prev) => ({
                          ...prev,
                          personalizedStructureStatus: value as string[],
                        }))
                      }
                      onReset={() =>
                        setFilters((prev) => ({
                          ...prev,
                          personalizedStructureStatus: [],
                        }))
                      }
                    />
                  </div>
                  <div className="w-full lg:w-[250px]">
                    <MultipleSelectInput
                      width={'100%'}
                      label={'A.C STATUS'}
                      selected={filters.paAlterationStatus}
                      options={[
                        {
                          id: 1,
                          label: 'PENDÊNCIA',
                          value: 'PENDÊNCIA',
                        },
                        {
                          id: 2,
                          label: 'REALIZADO',
                          value: 'REALIZADO',
                        },
                        {
                          id: 3,
                          label: 'SOLICITADO COM G.D',
                          value: 'SOLICITADO COM G.D',
                        },
                      ]}
                      selectedItemLabel={'SEM FILTRO'}
                      handleChange={(value) =>
                        setFilters((prev) => ({
                          ...prev,
                          paAlterationStatus: value as string[],
                        }))
                      }
                      onReset={() =>
                        setFilters((prev) => ({
                          ...prev,
                          paAlterationStatus: [],
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
                          executionStatus: value as string[],
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
                      label={'TOPOLOGIA'}
                      selected={filters.topology}
                      options={[
                        { id: 1, label: 'INVERSOR', value: 'INVERSOR' },
                        { id: 2, label: 'MICRO', value: 'MICRO' },
                        { id: 3, label: 'OUTROS SERV.', value: 'OUTROS SERV.' },
                        { id: 4, label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
                      ]}
                      selectedItemLabel={'SEM FILTRO'}
                      handleChange={(value) =>
                        setFilters((prev) => ({
                          ...prev,
                          topology: value as string[],
                        }))
                      }
                      onReset={() =>
                        setFilters((prev) => ({
                          ...prev,
                          topology: [],
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="flex flex-col lg:flex-row items-center justify-center gap-2 flex-wrap">
                  <div
                    onClick={() =>
                      setFilters({
                        ...filters,
                        personalizedStructureApplied: !filters.personalizedStructureApplied,
                      })
                    }
                    className={`${
                      filters.personalizedStructureApplied ? 'bg-[#15599a]' : 'bg-blue-300'
                    } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
                  >
                    COM ESTRUTURA PERSONALIZADA
                  </div>
                  <div
                    onClick={() =>
                      setFilters({
                        ...filters,
                        paAlterationApplied: !filters.paAlterationApplied,
                      })
                    }
                    className={`${
                      filters.paAlterationApplied ? 'bg-[#15599a]' : 'bg-blue-300'
                    } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
                  >
                    COM TROCA DE PADRÃO
                  </div>
                  <div
                    onClick={() =>
                      setFilters({
                        ...filters,
                        partialPaymentDone: !filters.partialPaymentDone,
                      })
                    }
                    className={`${
                      filters.partialPaymentDone ? 'bg-[#15599a]' : 'bg-blue-300'
                    } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
                  >
                    KIT PAGO
                  </div>
                  <div
                    onClick={() =>
                      setFilters({
                        ...filters,
                        missingObservations: !filters.missingObservations,
                      })
                    }
                    className={`${
                      filters.missingObservations ? 'bg-[#15599a]' : 'bg-blue-300'
                    } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
                  >
                    SEM OBSERVAÇÕES
                  </div>
                </div>
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
                  ? getBorderColorByParecer(project.parecer.dataParecerDeAcesso, new Date().toISOString(), project.obra.statusDaObra || '')
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
                    <span className="text-xxs">STATUS</span>
                    <p className="text-xs text-gray-600">{project.obra.statusDaObra ? project.obra.statusDaObra : '-'}</p>
                  </div>
                  <div>
                    <span className="text-xxs">LAUDO</span>
                    <p className="text-xs text-center text-gray-600">{project.obra.laudo ? project.obra.laudo : '-'}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xxs">STATUS KIT</span>
                    <p className="text-xs text-yellow-500">{project.compra.statusEntrega ? project.compra.statusEntrega : '-'}</p>
                  </div>
                  <div className="hidden lg:block">
                    <span className="text-xxs">PREVISÃO DE ENTREGA</span>
                    <p className="text-xs text-gray-600 text-center">
                      {project.compra.previsaoEntrega ? new Date(project.compra.previsaoEntrega).toLocaleDateString() : '-'}
                    </p>
                  </div>
                  <div>
                    <span className="text-xxs">TÉCNICO RESPONSÁVEL</span>
                    <p className="text-xs text-gray-600 text-center">{project.visitaTecnica.tecnico ? project.visitaTecnica.tecnico : '-'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <div className="flex flex-col gap-1 item-start">
                    <span className="text-xxs">CIDADE</span>
                    <p className="text-xs text-[#15599a]">{project.cidade ? project.cidade : '-'}</p>
                  </div>
                  <div className="flex flex-col gap-1 item-center">
                    <span className="text-xxs text-center">TELHA</span>
                    <p className="text-xs text-center text-[#15599a] uppercase">
                      {project.visitaTecnica.tipoDaTelha ? project.visitaTecnica.tipoDaTelha : '-'}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 item-end">
                    <span className="text-xxs text-end">NºMÓDULOS</span>
                    <p className="text-xs text-end text-[#15599a]">{project.sistema?.qtdeModulos ? project.sistema?.qtdeModulos : '-'}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xxs">FIM DO PARECER EM</span>
                    <p className="text-xs text-[#15599a] text-center uppercase">
                      {project.parecer.dataParecerDeAcesso
                        ? 120 - dayjs(new Date()).diff(project.parecer.dataParecerDeAcesso, 'days') > 0
                          ? `${120 - dayjs(new Date()).diff(project.parecer.dataParecerDeAcesso, 'days')} dias`
                          : 'VENCIDO'
                        : '-'}
                    </p>
                  </div>
                  <div>
                    <span className="text-xxs">DESDE DO CONTRATO</span>
                    <p className="text-xs text-[#15599a] uppercase text-center">
                      {project.contrato.dataAssinatura ? `${dayjs(new Date()).diff(project.contrato.dataAssinatura, 'days')} dias` : '-'}
                    </p>
                  </div>
                  <div>
                    <span className="text-xxs">DESDE DE ENTREGA</span>
                    <p className="text-xs text-center text-[#15599a] uppercase">
                      {project.compra.statusEntrega == 'ENTREGUE'
                        ? project.compra.dataEntrega
                          ? `${dayjs(new Date()).diff(project.compra.dataEntrega, 'days')} dias`
                          : `${dayjs(new Date()).diff(project.compra.previsaoEntrega, 'days')} dias`
                        : '-'}
                    </p>
                  </div>
                </div>
                {project.pagamento.credor == 'SOL FÁCIL' && (
                  <div className="flex justify-center items-center">
                    <h1 className="font-bold text-red-500 text-center">POSSUI DESLIGAMENTO REMOTO</h1>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        {modalProject.isOpen && modalProject.projectId ? (
          <ModalObras
            modalIsOpen={modalProject.isOpen}
            handleUpdates={() => console.log()}
            projectId={modalProject.projectId}
            closeModal={() => setModalProject({ isOpen: false, projectId: null })}
          />
        ) : null}
      </div>
    )
}

export default Obras
