import ProjectActivityCard from '@/components/identificador/atividades/ProjectActivityCard'
import ModalDB from '@/components/ModalDB'
import ErrorComponent from '@/components/utils/ErrorComponent'
import LoadingComponent from '@/components/utils/LoadingComponent'
import LoadingPage from '@/components/utils/LoadingPage'
import { formatLocation } from '@/utils/methods/formatting'
import { getErrorMessage } from '@/utils/methods/handlers'
import { editTechnicalAnalysis } from '@/utils/methods/mutation/technical-analysis'
import { useMonitoringProjects } from '@/utils/methods/query/oem'
import { TMonitoringProjectDTOSimplified } from '@/utils/schemas/projects'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { FaExpandArrowsAlt, FaPhone, FaUser } from 'react-icons/fa'
import { FaLocationDot } from 'react-icons/fa6'
import { MdEmail, MdOutlineCheckBox } from 'react-icons/md'
import { VscDiffAdded } from 'react-icons/vsc'
import { QueryClient, useQueryClient } from 'react-query'

function Monitoring() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { data: session, status } = useSession({ required: true })
  const { data: projects, isLoading, isError, isSuccess, error } = useMonitoringProjects()
  const [editModal, setEditModal] = useState<{ id: string | null; isOpen: boolean }>({ id: null, isOpen: false })
  useEffect(() => {
    if (session) {
      const userRoutes = session?.user.permissoes.rotas
      const technicalSupportViewPermission = session.user.permissoes.suporte.editar
      if (!userRoutes.includes('O&M') && !technicalSupportViewPermission) {
        router.push('/')
      }
    }
  }, [session])
  if (status != 'authenticated') return <LoadingPage />
  return (
    <div className="grow p-6">
      <div className="flex flex-col items-center justify-between gap-2 border-b border-gray-200 p-1">
        <div className="GAP-2 flex w-full items-center justify-between">
          <div className="flex flex-col items-center gap-2 lg:flex-row">
            <p className="text-center text-2xl font-black uppercase text-[#15599a]">PROJETOS DE MONITORAMENTO</p>
          </div>
          {/* {dropdownMenuVisible ? (
            <div className="cursor-pointer text-gray-600 hover:text-blue-400">
              <IoMdArrowDropupCircle style={{ fontSize: '25px' }} onClick={() => setDropdownMenuVisible(false)} />
            </div>
          ) : (
            <div className="cursor-pointer text-gray-600 hover:text-blue-400">
              <IoMdArrowDropdownCircle style={{ fontSize: '25px' }} onClick={() => setDropdownMenuVisible(true)} />
            </div>
          )} */}
        </div>
        {/* <div className="my-2 flex w-full flex-col items-center justify-center gap-3 lg:flex-row">
          <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-3 shadow-sm lg:w-1/4">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium uppercase tracking-tight">PROJETOS NO ESTÁGIO</h1>
              <VscDiffAdded />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: projects }).projetos}</div>
              <p className="text-xs text-gray-500">{formatDecimalPlaces(getStats({ info: projects }).potencia)} kWp</p>
            </div>
          </div>
          <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-3 shadow-sm lg:w-1/4">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium uppercase tracking-tight">QUANTIDADE DE MÓDULOS</h1>
              <FaSolarPanel />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: projects }).modulos}</div>
            </div>
          </div>
          <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-3 shadow-sm lg:w-1/4">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium uppercase tracking-tight">MANUTENÇÕES PENDENTES</h1>
              <FaList />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: projects }).manutencoesPendentes} </div>
            </div>
          </div>
          <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-3 shadow-sm lg:w-1/4">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium uppercase tracking-tight">MANUTENÇÕES ATRASADAS</h1>
              <MdError />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: projects }).manutencoesAtrasadas} </div>
            </div>
          </div>
        </div> */}
        {/* <AnimatePresence>
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
                  className={`${
                    filters.pendingMaintenance ? 'bg-[#fead41]' : 'bg-orange-300'
                  } flex h-[36px] cursor-pointer items-center justify-center rounded px-2 text-xs font-bold text-white`}
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
                  className={`${
                    filters.overdueMaintenance ? 'bg-red-500' : 'bg-red-300'
                  } flex h-[36px] cursor-pointer items-center justify-center rounded px-2 text-xs font-bold text-white`}
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
                  className={`${
                    filters.systemOffline ? 'bg-[#fead41]' : 'bg-orange-300'
                  } flex h-[36px] cursor-pointer items-center justify-center rounded px-2 text-xs font-bold text-white`}
                >
                  PENDENTE CONFERÊNCIA DE USINA LIGADA
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence> */}
      </div>
      <div className="mt-4 flex flex-wrap justify-around gap-3 overflow-y-auto overscroll-y-auto">
        {isLoading ? <LoadingComponent /> : null}
        {isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
        {isSuccess ? (
          projects.length > 0 ? (
            projects.map((project) => (
              <MonitoringProjectCard
                key={project._id}
                project={project}
                handleClick={(id) => setEditModal({ id, isOpen: true })}
                queryClient={queryClient}
              />
            ))
          ) : (
            <div className="w-full text-center text-sm font-medium tracking-tight text-primary/80">Nenhum projeto de monitoramento encontrado.</div>
          )
        ) : null}
      </div>
      {editModal.id && editModal.isOpen ? (
        <ModalDB
          session={session}
          projectId={editModal.id}
          closeModal={() => setEditModal({ id: null, isOpen: false })}
          modalIsOpen={editModal.isOpen}
        />
      ) : null}
    </div>
  )
}

export default Monitoring

type MonitoringProjectCardProps = {
  project: TMonitoringProjectDTOSimplified
  handleClick: (id: string) => void
  queryClient: QueryClient
}
function MonitoringProjectCard({ project, handleClick, queryClient }: MonitoringProjectCardProps) {
  const [activitiesMenuIsOpen, setActivitiesMenuIsOpen] = useState<boolean>(false)

  const openActivitiesCount = project.atividades ? project.atividades.filter((a) => !a.dataConclusao).length : 0

  return (
    <div className="flex w-full flex-col gap-2 rounded-md border border-gray-500 p-3 shadow-sm">
      <div className="flex w-full flex-col items-start justify-between lg:flex-row lg:items-center">
        <h1 className="font-bold leading-none tracking-tight">
          <strong className="text-[#fead41]">#{project.qtde}</strong> {project.nomeDoContrato}
        </h1>
      </div>
      <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex w-full flex-wrap items-center justify-start gap-2 lg:grow">
          <div className="flex items-center gap-1">
            <FaUser width={10} height={10} />
            <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">{project.vendedor.nome}</h1>
          </div>
          <div className="flex items-center gap-1">
            <FaPhone width={10} height={10} />
            <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">{project.telefone || 'N/A'}</h1>
          </div>
          <div className="flex items-center gap-1">
            <MdEmail width={10} height={10} />
            <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">{project.email || 'N/A'}</h1>
          </div>
        </div>
        <div className="flex w-full flex-wrap items-center justify-center gap-2 lg:min-w-fit lg:justify-end">
          <div className="flex items-center gap-1">
            <FaLocationDot width={10} height={10} />
            <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">LOCALIZAÇÃO</h1>
            <h1 className="py-0.5 text-center text-[0.6rem] font-bold  text-primary">
              {formatLocation({
                location: {
                  uf: project.uf,
                  cidade: project.cidade,
                  cep: project.cep?.toString() || '',
                  bairro: project.bairro,
                  endereco: project.logradouro,
                  numeroOuIdentificador: project.numeroResidencia?.toString() || '',
                },
                includeCity: true,
                includeUf: true,
              })}
            </h1>
          </div>
        </div>
      </div>
      <div className="mt-1 flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleClick(project._id)}
            className="flex items-center gap-1 rounded border border-[#fead41] py-1 px-4 text-xs font-medium text-[#fead41] duration-300 ease-in-out hover:bg-[#fead41] hover:text-white"
          >
            <p>EXPANDIR</p>
            <FaExpandArrowsAlt />
          </button>
          <div className="relative">
            {openActivitiesCount > 0 ? (
              <div className="absolute -top-1 -left-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 p-1">
                <p className="text-xxs font-medium text-white">{openActivitiesCount}</p>
              </div>
            ) : null}
            <button
              onClick={() => setActivitiesMenuIsOpen((prev) => !prev)}
              className={`${
                openActivitiesCount > 0 ? 'border-red-500 text-red-500 hover:bg-red-500' : 'border-blue-500 text-blue-500 hover:bg-blue-500'
              } flex items-center gap-1 rounded border py-1 px-4 text-xs font-medium duration-300 ease-in-out hover:text-white`}
            >
              <p>ATIVIDADES</p>
              <MdOutlineCheckBox size={18} />
            </button>
          </div>
        </div>
        {/* <button
          disabled={isLoading}
          onClick={() => {
            // @ts-ignore
            handleUpdateProject({ id: projectId, changes: { 'jornada.obsJornada': infoHolder.jornada.obsJornada } })
          }}
          className="rounded bg-black py-1 px-4 text-xs font-medium text-white duration-300 ease-in-out disabled:bg-gray-500 enabled:hover:bg-gray-700"
        >
          SALVAR ANOTAÇÕES
        </button> */}
      </div>
      {activitiesMenuIsOpen ? (
        project.atividades && project.atividades.length > 0 ? (
          <div className="mt-1 flex w-full flex-col gap-1">
            {project.atividades.map((activity) => (
              <ProjectActivityCard
                key={activity._id}
                activity={activity}
                projectId={project._id}
                mutateCallback={() => queryClient.invalidateQueries({ queryKey: ['monitoring-projects'] })}
              />
            ))}
          </div>
        ) : (
          <h1 className="w-full py-1 text-center text-sm italic text-gray-500">Nenhuma atividade cadastrada...</h1>
        )
      ) : null}
    </div>
  )
}
