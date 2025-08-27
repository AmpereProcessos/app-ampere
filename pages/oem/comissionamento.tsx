import CheckboxInput from '@/components/inputs/Checkbox'
import DateInput from '@/components/inputs/Date'
import MultipleSelectInputVirtualized from '@/components/inputs/MultipleSelectInputVirtualized'
import SelectInput from '@/components/inputs/Select'
import TextInput from '@/components/inputs/Text'
import { useSession } from '@/components/providers/SessionProvider'
import ErrorComponent from '@/components/utils/ErrorComponent'
import UnauthenticatedComponent from '@/components/utils/UnauthenticatedComponent'
import UnauthorizedPage from '@/components/utils/UnauthorizedPage'
import type { TAuthSession } from '@/lib/authentication/types'
import StatesAndCities from '@/utils/jsons/estados-cidades.json'
import { getErrorMessage } from '@/utils/methods/handlers'
import { useExecutionCommissioningProjects } from '@/utils/methods/query/oem'
import { formatDateInputChange } from '@/utils/methods/shared'
import type { TProjectDTO } from '@/utils/schemas/projects'
import { allActiveSellers } from '@/utils/select-options'
import axios from 'axios'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'
import { TbAlertHexagonFilled } from 'react-icons/tb'
import { VscDiffAdded } from 'react-icons/vsc'
import Select from 'react-select'
import ComissionamentoPosObraCard from '../../components/ComissionamentoPosObraCard'
import ComissionamentoPosObraSkeleton from '../../components/skeletons/ComissionamentoPosObraSkeleton'
import FilterButton from '../../components/utils/Buttons/FilterButton'
import LoadingPage from '../../components/utils/LoadingPage'
import { cidadesAtendidas, equipesTecnicas, formatDate, vendedores } from '../../utils/constants'

const AllCities = StatesAndCities.flatMap((s) => s.cidades).map((c, index) => ({
  id: index + 1,
  label: c,
  value: c,
}))

function Comissionamento() {
  const { session, status } = useSession()

  const isAuthorized = session?.user.permissoes.rotas.includes('O&M') || session?.user.permissoes.rotas.includes('Pós-Venda')

  if (status === 'loading') return <LoadingPage />
  if (status === 'unauthenticated') return <UnauthenticatedComponent />
  if (!isAuthorized) return <UnauthorizedPage />
  return <ComissionamentoContent session={session} />
}

export default Comissionamento

function ComissionamentoContent({ session }: { session: TAuthSession }) {
  const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false)

  const { data: projects, isLoading, isError, isSuccess, error, filters, setFilters } = useExecutionCommissioningProjects()
  const errorMsg = getErrorMessage(error)
  function getStats({ info }: { info?: TProjectDTO[] }) {
    if (!info)
      return {
        projetos: 0,
        pendenteUsinaLigada: 0,
        pendenteEnergiaInjetada: 0,
        pendenteConfiguracaoApp: 0,
        pendenteMonitoramento: 0,
      }

    const pendeningPlantPoweredCheck = info.reduce((acc, current) => (!current.conferencias.usinaLigada.data ? acc + 1 : acc), 0)
    const pendeningEnergyInjectionCheck = info.reduce((acc, current) => (!current.conferencias.energiaInjetada.data ? acc + 1 : acc), 0)
    const pendeningAppConfig = info.reduce((acc, current) => (!current.app.data ? acc + 1 : acc), 0)
    const pendeningMonitoring = info.reduce((acc, current) => (!current.conferencias.monitoramentoFeito.data ? acc + 1 : acc), 0)

    return {
      projetos: info.length,
      pendenteUsinaLigada: pendeningPlantPoweredCheck,
      pendenteEnergiaInjetada: pendeningEnergyInjectionCheck,
      pendenteConfiguracaoApp: pendeningAppConfig,
      pendenteMonitoramento: pendeningMonitoring,
    }
  }
  return (
    <div className="flex grow flex-col p-6">
      <div className="border-primary/20 flex flex-col items-center justify-between border-b p-1">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col items-center gap-2 lg:flex-row">
            <p className="text-center text-2xl font-black text-[#15599a] uppercase">PROJETOS PARA COMISSIONAMENTO PÓS-OBRA</p>
          </div>
          {dropdownMenuVisible ? (
            <div className="text-primary/80 cursor-pointer hover:text-blue-400">
              <IoMdArrowDropupCircle style={{ fontSize: '25px' }} onClick={() => setDropdownMenuVisible(false)} />
            </div>
          ) : (
            <div className="text-primary/80 cursor-pointer hover:text-blue-400">
              <IoMdArrowDropdownCircle style={{ fontSize: '25px' }} onClick={() => setDropdownMenuVisible(true)} />
            </div>
          )}
        </div>
        <div className="my-2 flex w-full flex-col items-center justify-center gap-3 lg:flex-row">
          <div className="bg-background border-primary/20 flex min-h-[110px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/4">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium tracking-tight uppercase">PROJETOS NO ESTÁGIO</h1>
              <VscDiffAdded />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: projects }).projetos}</div>
            </div>
          </div>
          <div className="bg-background border-primary/20 flex min-h-[110px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/4">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium tracking-tight uppercase">PENDENTE USINA LIGADA</h1>
              <TbAlertHexagonFilled />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: projects }).pendenteUsinaLigada} </div>
            </div>
          </div>
          <div className="bg-background border-primary/20 flex min-h-[110px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/4">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium tracking-tight uppercase">PENDENTE ENERGIA INJETADA</h1>
              <TbAlertHexagonFilled />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: projects }).pendenteEnergiaInjetada}</div>
            </div>
          </div>
          <div className="bg-background border-primary/20 flex min-h-[110px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/4">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium tracking-tight uppercase">PENDENTE CONFIGURAÇÃO DO APP</h1>
              <TbAlertHexagonFilled />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: projects }).pendenteConfiguracaoApp}</div>
            </div>
          </div>
          <div className="bg-background border-primary/20 flex min-h-[110px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/4">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium tracking-tight uppercase">PENDENTE MONITORAMENTO</h1>
              <TbAlertHexagonFilled />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: projects }).pendenteMonitoramento}</div>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {dropdownMenuVisible ? (
            <motion.div initial={{ scale: 0.8, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} className="mt-4 flex w-full flex-col gap-y-2">
              <div className="flex w-full flex-col flex-wrap items-center justify-start gap-2 lg:flex-row">
                <TextInput
                  label="NOME DO CONTRATO"
                  placeholder="Filtre pelo nome do contrato..."
                  value={filters.search}
                  handleChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
                />

                <div className="flex w-full flex-col gap-2 lg:w-fit lg:flex-row">
                  <div className="flex items-center justify-center gap-x-2">
                    <div className="w-full lg:w-[250px]">
                      <DateInput
                        width={'100%'}
                        label={'DEPOIS DE'}
                        value={filters.date.after ? formatDate(filters.date.after) : undefined}
                        handleChange={(value) =>
                          setFilters((prev) => ({
                            ...prev,
                            date: {
                              ...prev.date,
                              after: formatDateInputChange(value) as string,
                            },
                          }))
                        }
                      />
                    </div>
                    <div className="w-full lg:w-[250px]">
                      <DateInput
                        width={'100%'}
                        label={'ANTES DE'}
                        value={filters.date.before ? formatDate(filters.date.before) : undefined}
                        handleChange={(value) =>
                          setFilters((prev) => ({
                            ...prev,
                            date: {
                              ...prev.date,
                              before: formatDateInputChange(value) as string,
                            },
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-[250px]">
                    <SelectInput
                      width={'100%'}
                      label={'CAMPO DE FILTRO'}
                      value={filters.date.field || null}
                      options={[
                        { id: 1, label: 'SAÍDA DE OBRA', value: 'obra.saida' },
                        {
                          id: 2,
                          label: 'TROCA DO MEDIDOR',
                          value: 'medidor.data',
                        },
                      ]}
                      selectedItemLabel={'SEM FILTRO'}
                      handleChange={(value) =>
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
              <div className="flex w-full flex-col flex-wrap items-center justify-start gap-2 lg:flex-row">
                <div className="w-full lg:w-[250px]">
                  <MultipleSelectInputVirtualized
                    width="100%"
                    label="EQUIPE TÉCNICA"
                    selected={filters.responsibleTeam}
                    options={equipesTecnicas.map((team, index) => ({
                      id: index + 1,
                      label: team.label,
                      value: team.value,
                    }))}
                    selectedItemLabel="SEM FILTRO"
                    handleChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        responsibleTeam: value as string[],
                      }))
                    }
                    onReset={() => setFilters((prev) => ({ ...prev, responsibleTeam: [] }))}
                  />
                </div>
                <div className="w-full lg:w-[250px]">
                  <MultipleSelectInputVirtualized
                    width={'100%'}
                    label={'VENDEDOR'}
                    selected={filters.seller}
                    options={allActiveSellers}
                    selectedItemLabel={'SEM FILTRO'}
                    handleChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        seller: value as string[],
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
                <div className="w-full lg:w-[200px]">
                  <MultipleSelectInputVirtualized
                    label="CIDADE"
                    selected={filters.city}
                    options={AllCities}
                    selectedItemLabel="NÃO DEFINIDO"
                    handleChange={(value) => {
                      setFilters((prev) => ({
                        ...prev,
                        city: value as string[],
                      }))
                    }}
                    onReset={() => {
                      setFilters((prev) => ({
                        ...prev,
                        city: [],
                      }))
                    }}
                    width="100%"
                    labelClassName="text-xs font-medium tracking-tight text-black"
                  />
                </div>
              </div>
              <div className="flex w-full flex-col flex-wrap items-center justify-start gap-2 lg:flex-row">
                <div className="w-fit">
                  <CheckboxInput
                    labelFalse="CONFIGURAÇÃO DO APLICATIVO PENDENTE"
                    labelTrue="CONFIGURAÇÃO DO APLICATIVO PENDENTE"
                    checked={filters.appPending}
                    handleChange={(value) => setFilters((prev) => ({ ...prev, appPending: value }))}
                  />
                </div>
                <div className="w-fit">
                  <CheckboxInput
                    labelFalse="CONFERÊNCIA DE USINA LIGADA PENDENTE"
                    labelTrue="CONFERÊNCIA DE USINA LIGADA PENDENTE"
                    checked={filters.plantPowerCheckPending}
                    handleChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        plantPowerCheckPending: value,
                      }))
                    }
                  />
                </div>
                <div className="w-fit">
                  <CheckboxInput
                    labelFalse="CONFERÊNCIA DE ENERGIA INJETADA PENDENTE"
                    labelTrue="CONFERÊNCIA DE ENERGIA INJETADA PENDENTE"
                    checked={filters.injectedEnergyPending}
                    handleChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        injectedEnergyPending: value,
                      }))
                    }
                  />
                </div>
                <div className="w-fit">
                  <CheckboxInput
                    labelFalse="MONITORAMENTO PENDENTE"
                    labelTrue="MONITORAMENTO PENDENTE"
                    checked={filters.monitoringPending}
                    handleChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        monitoringPending: value,
                      }))
                    }
                  />
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="mt-2 flex flex-col gap-2">
        {isLoading ? <LoadingPage /> : null}
        {isError ? <ErrorComponent msg={errorMsg} /> : null}
        {isSuccess ? (
          projects.length > 0 ? (
            projects?.map((project, index) => <ComissionamentoPosObraCard key={project._id} project={project} index={index} />)
          ) : (
            <p className="text-primary/60 w-full text-center font-medium">Nenhum projeto foi encontrado.</p>
          )
        ) : null}
      </div>
      <Link href={'/vendas/entregaTecnica'}>
        <div className="fixed bottom-10 left-150 cursor-pointer rounded-lg bg-[#15599a] p-3 text-white hover:bg-[#fead61] hover:text-[#15599a]">
          <p className="text-sm font-bold uppercase">ENTREGAS TÉCNICAS PRESENCIAIS</p>
        </div>
      </Link>
    </div>
  )
}
