import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import Select from 'react-select'
import { cidadesAtendidas, equipesTecnicas, formatDate, formatDecimalPlaces, oemPlans } from '../../utils/constants'
import AllCities from '@/utils/jsons/cidades.json'
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'
import { AiOutlineSearch } from 'react-icons/ai'
import { GiPoliceBadge } from 'react-icons/gi'
import ModalOeM from '../../components/ModalOeM'
import Link from 'next/link'
import dayjs from 'dayjs'
import SelectInput from '../../components/inputs/Select'
import TagTipoDeServico from '../../components/TagTipoDeServico'
import { AnimatePresence, motion } from 'framer-motion'
import { useSession } from '@/components/providers/SessionProvider'
import LoadingPage from '../../components/utils/LoadingPage'
import { useOeMProjects } from '@/utils/methods/query/oem'
import TextInput from '@/components/inputs/Text'
import MultipleSelectInput from '@/components/inputs/MultipleSelect'
import { ServiceOrderStatus, serviceTypes } from '@/utils/select-options'
import MultipleSelectInputVirtualized from '@/components/inputs/MultipleSelectInputVirtualized'
import NumberInput from '@/components/inputs/Number'
import DateInput from '@/components/inputs/Date'
import { formatDateInputChange } from '@/utils/methods/shared'
import { VscDiffAdded } from 'react-icons/vsc'
import type { TProjectDTO } from '@/utils/schemas/projects'
import { FaList, FaSolarPanel } from 'react-icons/fa'
import { TbAlertOctagonFilled } from 'react-icons/tb'
import { MdError } from 'react-icons/md'
import { formatDateAsLocale } from '@/utils/methods/formatting'
import { getDifferenceBetweenDates } from '@/utils/methods/dates'
import ProjectCardsTags from '@/components/utils/ProjectCardsTags'
const statusStyles = {
  REALIZADO: {
    textColor: 'text-green-500',
  },
  'NÃO REALIZADO': {
    textColor: 'text-red-500',
  },
}
function OemPage() {
  const router = useRouter()
  const { session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/signin')
    },
  })

  const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false)

  const { data: projects, isLoading, isError, isFetching, isSuccess, filters, setFilters } = useOeMProjects()
  const [modalProject, setModalProject] = useState<{ id: string | null; isOpen: boolean }>({ id: null, isOpen: false })
  function checkOeMEnding(dataMedidor: string | null | undefined, tipoDeServico: string, dataAssinatura: string | null | undefined) {
    if (tipoDeServico === 'OPERAÇÃO E MANUTENÇÃO') {
      if (dayjs().diff(dayjs(dataAssinatura), 'days') > 15) {
        return { text: 'O&M VENCIDO', color: 'text-red-500' }
      } else {
        return { text: 'O&M EM ANDAMENTO', color: 'text-red-500' }
      }
    } else {
      if (dataMedidor) {
        if (dayjs().diff(dayjs(dataMedidor), 'days') > 365) {
          return { text: 'O&M VENCIDO', color: 'text-red-500' }
        } else if (dayjs().diff(dayjs(dataMedidor), 'days') > 350) {
          return { text: 'O&M EM VENCIMENTO', color: 'text-orange-500' }
        } else {
          return { text: 'O&M EM ANDAMENTO', color: 'text-green-500' }
        }
      } else return { text: 'O&M EM ANDAMENTO', color: 'text-green-500' }
    }
  }

  function getStats({ info }: { info?: TProjectDTO[] }) {
    if (!info) {
      return {
        projetos: 0,
        potencia: 0,
        modulos: 0,
        manutencoesPendentes: 0,
        manutencoesAtrasadas: 0,
      }
    }

    const projectsQty = info.length
    const totalPower = info.reduce((acc, current) => {
      const currentPower = current.sistema?.potPico || 0

      return acc + currentPower
    }, 0)
    const modulesQty = info.reduce((acc, current) => {
      const currentQty = current.sistema.qtdeModulos || 0
      return acc + currentQty
    }, 0)
    const pendingMaintenance = info.reduce((acc, current) => {
      const isPending = current.manutencoes.some((m) => !m.dataEfetivacao)
      if (isPending) acc += 1
      return acc
    }, 0)
    const overdueMaintenance = info.reduce((acc, current) => {
      const referenceDate = current.medidor.data ? current.medidor.data : current.contrato.dataAssinatura
      const isOverDue = current.manutencoes.some(
        (m, index) =>
          !m.dataEfetivacao && referenceDate && getDifferenceBetweenDates({ start: new Date(referenceDate), end: new Date() }) > (index + 1) * 365
      )
      if (isOverDue) acc += 1
      return acc
    }, 0)

    return {
      projetos: projectsQty,
      potencia: totalPower,
      modulos: modulesQty,
      manutencoesPendentes: pendingMaintenance,
      manutencoesAtrasadas: overdueMaintenance,
    }
  }
  useEffect(() => {
    if (session) {
      const userRoutes = session?.user.permissoes.rotas
      if (!userRoutes.includes('O&M')) {
        router.push('/')
      }
    }
  }, [session])

  if (status === 'loading') return <LoadingPage />
  if (status === 'authenticated') {
    return (
      <div className="grow p-6">
        <div className="flex flex-col items-center justify-between gap-2 border-b border-gray-300 p-1">
          <div className="GAP-2 flex w-full items-center justify-between">
            <div className="flex flex-col items-center gap-2 lg:flex-row">
              <p className="text-center text-2xl font-black uppercase text-[#15599a]">PROJETOS NOS ESTAGIO DE O&M</p>
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
            <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-300 bg-[#fff] p-3 shadow-sm lg:w-1/4">
              <div className="flex items-center justify-between">
                <h1 className="text-sm font-medium uppercase tracking-tight">PROJETOS NO ESTÁGIO</h1>
                <VscDiffAdded />
              </div>
              <div className="mt-2 flex w-full flex-col">
                <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: projects }).projetos}</div>
                <p className="text-xs text-gray-500">{formatDecimalPlaces(getStats({ info: projects }).potencia)} kWp</p>
              </div>
            </div>
            <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-300 bg-[#fff] p-3 shadow-sm lg:w-1/4">
              <div className="flex items-center justify-between">
                <h1 className="text-sm font-medium uppercase tracking-tight">QUANTIDADE DE MÓDULOS</h1>
                <FaSolarPanel />
              </div>
              <div className="mt-2 flex w-full flex-col">
                <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: projects }).modulos}</div>
              </div>
            </div>
            <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-300 bg-[#fff] p-3 shadow-sm lg:w-1/4">
              <div className="flex items-center justify-between">
                <h1 className="text-sm font-medium uppercase tracking-tight">MANUTENÇÕES PENDENTES</h1>
                <FaList />
              </div>
              <div className="mt-2 flex w-full flex-col">
                <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: projects }).manutencoesPendentes} </div>
              </div>
            </div>
            <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-300 bg-[#fff] p-3 shadow-sm lg:w-1/4">
              <div className="flex items-center justify-between">
                <h1 className="text-sm font-medium uppercase tracking-tight">MANUTENÇÕES ATRASADAS</h1>
                <MdError />
              </div>
              <div className="mt-2 flex w-full flex-col">
                <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: projects }).manutencoesAtrasadas} </div>
              </div>
            </div>
          </div>
          <AnimatePresence>
            {dropdownMenuVisible ? (
              <motion.div initial={{ scale: 0.8, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} className="mt-4 flex w-full flex-col gap-y-2">
                <div className="flex flex-col flex-wrap items-center justify-center gap-2 lg:flex-row">
                  <TextInput
                    label={'NOME DO PROJETO'}
                    value={filters.search}
                    placeholder={'Digite o nome do projeto...'}
                    handleChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
                  />

                  <TextInput
                    label={'BAIRRO'}
                    value={filters.neighborhoodSearch}
                    placeholder={'Digite o bairro do projeto...'}
                    handleChange={(value) => setFilters((prev) => ({ ...prev, neighborhoodSearch: value }))}
                  />

                  <NumberInput
                    label="NÚMERO DE MÓDULOS MAIOR QUE"
                    placeholder="Preencha um filtro para o número de módulos..."
                    value={filters.modulesQtyGte}
                    handleChange={(value) => setFilters((prev) => ({ ...prev, modulesQtyGte: value }))}
                  />

                  <NumberInput
                    label="NÚMERO DE MÓDULOS MENOR QUE"
                    placeholder="Preencha um filtro para o número de módulos..."
                    value={filters.modulesQtyLte}
                    handleChange={(value) => setFilters((prev) => ({ ...prev, modulesQtyLte: value }))}
                  />

                  <div className="w-full lg:w-[300px]">
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
                  <div className="flex w-full flex-col gap-2 lg:w-fit lg:flex-row">
                    <div className="flex items-center justify-center gap-x-2">
                      <div className="w-full lg:w-[300px]">
                        <DateInput
                          width={'100%'}
                          label={'DEPOIS DE'}
                          value={filters.date.after ? formatDate(filters.date.after) : undefined}
                          handleChange={(value) => setFilters((prev) => ({ ...prev, date: { ...prev.date, after: formatDateInputChange(value) } }))}
                        />
                      </div>
                      <div className="w-full lg:w-[300px]">
                        <DateInput
                          width={'100%'}
                          label={'ANTES DE'}
                          value={filters.date.before ? formatDate(filters.date.before) : undefined}
                          handleChange={(value) => setFilters((prev) => ({ ...prev, date: { ...prev.date, before: formatDateInputChange(value) } }))}
                        />
                      </div>
                    </div>
                    <div className="w-full lg:w-[300px]">
                      <SelectInput
                        width={'100%'}
                        label={'CAMPO DE FILTRO'}
                        value={filters.date.field || null}
                        options={[
                          {
                            id: 1,
                            label: 'SAÍDA DE OBRA',
                            value: 'obra.saida',
                          },
                          {
                            id: 2,
                            label: 'TROCA DE MEDIDOR',
                            value: 'medidor.data',
                          },
                          {
                            id: 3,
                            label: 'EXECUÇÃO DA MANUTENÇÃO',
                            value: 'manutencoes.dataEfetivacao',
                          },
                        ]}
                        selectedItemLabel={'SEM FILTRO'}
                        handleChange={(value: string) =>
                          setFilters((prev) => ({
                            ...prev,
                            date: {
                              ...prev.date,
                              field: value,
                            },
                          }))
                        }
                        onReset={() =>
                          setFilters((prev) => ({
                            ...prev,
                            date: {
                              after: null,
                              before: null,
                              field: null,
                            },
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col flex-wrap items-center justify-center gap-2 lg:flex-row">
                  <div className="w-full lg:w-[300px]">
                    <MultipleSelectInputVirtualized
                      width={'100%'}
                      label={'CIDADE'}
                      selected={filters.city}
                      options={AllCities.map((city, index) => ({ id: index + 1, label: city, value: city }))}
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
                  <div className="w-full lg:w-[300px]">
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
                  <div className="w-full lg:w-[300px]">
                    <MultipleSelectInput
                      width={'100%'}
                      label={'STATUS DA OBRA'}
                      selected={filters.executionStatus}
                      options={ServiceOrderStatus}
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
                  <div className="w-full lg:w-[300px]">
                    <MultipleSelectInput
                      width={'100%'}
                      label={'PLANO DE O&M'}
                      selected={filters.oemPlan}
                      options={oemPlans.map((plan, index) => ({ id: index + 1, label: plan.label, value: plan.value }))}
                      selectedItemLabel={'SEM FILTRO'}
                      handleChange={(value) =>
                        setFilters((prev) => ({
                          ...prev,
                          oemPlan: value as string[],
                        }))
                      }
                      onReset={() =>
                        setFilters((prev) => ({
                          ...prev,
                          oemPlan: [],
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
                        pendingMaintenance: !filters.pendingMaintenance,
                      }))
                    }
                    className={`${filters.pendingMaintenance ? 'bg-[#fead41]' : 'bg-orange-300'} flex h-[36px] cursor-pointer items-center justify-center rounded px-2 text-xs font-bold text-white`}
                  >
                    MANUTENÇÃO PENDENTE
                  </div>
                  <div
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        overdueMaintenance: !filters.overdueMaintenance,
                      }))
                    }
                    className={`${filters.overdueMaintenance ? 'bg-red-500' : 'bg-red-300'} flex h-[36px] cursor-pointer items-center justify-center rounded px-2 text-xs font-bold text-white`}
                  >
                    MANUTENÇÃO ATRASADA
                  </div>
                  <div
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        systemOffline: !filters.systemOffline,
                      }))
                    }
                    className={`${filters.systemOffline ? 'bg-[#fead41]' : 'bg-orange-300'} flex h-[36px] cursor-pointer items-center justify-center rounded px-2 text-xs font-bold text-white`}
                  >
                    PENDENTE CONFERÊNCIA DE USINA LIGADA
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
        <div className="mt-4 flex flex-wrap justify-around gap-3 overflow-y-auto overscroll-y-auto">
          {projects ? (
            projects.map((project) => (
              <div
                onClick={() => {
                  setModalProject({ id: project._id, isOpen: true })
                }}
                key={project._id}
                className="w-full cursor-pointer border border-gray-300 hover:bg-blue-100 md:w-[350px]  lg:w-[450px]"
              >
                <TagTipoDeServico tipoDeServico={project.tipoDeServico} />
                <div className="flex flex-col p-2 pb-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-gray-700">{project.nomeDoContrato}</p>
                    <p className="text-xs font-bold text-[#15599a]">#{project.qtde}</p>
                  </div>
                  <ProjectCardsTags projectTags={project.etiquetas} />

                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex flex-col items-start">
                      <span className="text-[0.6rem] leading-none tracking-tight text-gray-500">CIDADE</span>
                      <p className="text-xs font-medium tracking-tight">{project.cidade}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[0.6rem] leading-none tracking-tight text-gray-500">TOPOLOGIA</span>
                      <p className="text-xs font-medium tracking-tight">{project.sistema.topologia}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex flex-col items-start">
                      <span className={`text-[0.6rem] leading-none tracking-tight text-gray-500`}>STATUS DO O&M</span>
                      <p
                        className={`text-xs font-medium tracking-tight ${checkOeMEnding(project.medidor.data, project.tipoDeServico, project.contrato.dataAssinatura).color}`}
                      >
                        {checkOeMEnding(project.medidor.data, project.tipoDeServico, project.contrato.dataAssinatura).text}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[0.6rem] leading-none tracking-tight text-gray-500">NÚMERO DE MÓDULOS</span>
                      <p className={'text-xs font-medium tracking-tight'}>{project.sistema.qtdeModulos}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex flex-col items-start">
                      <span className="text-[0.6rem] leading-none tracking-tight text-gray-500">EQUIPE TÉCNICA</span>
                      <p className={'text-xs font-medium tracking-tight'}>{project.obra.equipeResp || 'NÃO DEFINIDO'}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[0.6rem] leading-none tracking-tight text-gray-500">SAÍDA DE OBRA</span>
                      <p className={'text-xs font-medium tracking-tight'}>{formatDateAsLocale(project.obra.saida)}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <span className="text-[0.6rem] leading-none tracking-tight text-gray-500">PLANO DE O&M</span>
                      <p className={'text-center text-xs font-medium tracking-tight text-cyan-500'}>{project.oem?.plano || 'NÃO DEFINIDO'}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <LoadingPage />
          )}
        </div>
        <Link href={'/oem/baixaPerformance'}>
          <div className="left-150 fixed bottom-10 cursor-pointer rounded-lg bg-[#15599a] p-3 text-white hover:bg-[#fead61] hover:text-[#15599a]">
            <p className="text-sm font-bold uppercase">ACOMPANHAMENTO DE PERFORMANCE</p>
          </div>
        </Link>
        {modalProject.id && modalProject.isOpen && (
          <ModalOeM closeModal={() => setModalProject({ id: null, isOpen: false })} modalIsOpen={modalProject.isOpen} projectId={modalProject.id} />
        )}
      </div>
    )
  }
}

export default OemPage
