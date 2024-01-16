import React, { useEffect, useState } from 'react'

import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import ModalADM from '../../components/ModalADM'

import TagTipoDeServico from '../../components/TagTipoDeServico'
import { equipesTecnicas, formatDate, statusLiberacao } from '../../utils/constants'
import dayjs from 'dayjs'

import { useSession } from 'next-auth/react'
import LoadingPage from '../../components/utils/LoadingPage'
import { billableCompanies, contractStatus, inspectionStatus } from '../../utils/select-options'
import { useADMProjects } from '@/utils/methods/query/adm'
import TextInput from '@/components/inputs/Text'
import SelectInput from '@/components/inputs/Select'
import DateInput from '@/components/inputs/Date'
import { formatDateInputChange } from '@/utils/methods/shared'
import MultipleSelectInput from '@/components/inputs/MultipleSelect'
import ErrorComponent from '@/components/utils/ErrorComponent'
import { TProjectDTO } from '@/utils/schemas/projects'
import { VscDiffAdded } from 'react-icons/vsc'
import { MdPaid } from 'react-icons/md'
import { IoDocumentTextOutline } from 'react-icons/io5'
function Administracao() {
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/authHome')
    },
  })

  const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false)

  const { data: projects, filters, setFilters, isLoading, isSuccess, isError } = useADMProjects()
  const [modalProject, setModalProject] = useState<{ isOpen: boolean; projectId: string | null }>({ isOpen: false, projectId: null })

  function getStats({ info }: { info: TProjectDTO[] | undefined }) {
    if (!info) return { projetos: 0, cobrancasPendentes: 0, faturamentosPendentes: 0 }
    const projectsQty = info.length
    const pendingCharges = info.reduce((acc, current) => {
      const toCharge = !current.pagamento.cobrancaFeita
      if (toCharge) return acc + 1
      return acc
    }, 0)
    const pendingBilling = info.reduce((acc, current) => {
      const toBill = !current.faturamento.concluido
      if (toBill) return acc + 1
      return acc
    }, 0)
    return { projetos: projectsQty, cobrancasPendentes: pendingCharges, faturamentosPendentes: pendingBilling }
  }

  function handleOpenModal(id: string) {
    return setModalProject({ isOpen: true, projectId: id })
  }

  useEffect(() => {
    if (session) {
      const userRoutes = session.user.accessibleRoutes
      if (!userRoutes?.includes('ADM')) {
        router.push('/')
      }
    }
  }, [session])

  if (status != 'authenticated') return <LoadingPage />

  return (
    <div className="grow p-6">
      <div className="flex flex-col items-center gap-y-2 border-b border-gray-200 p-1">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col items-center gap-2 lg:flex-row">
            <p className="text-center text-2xl font-black uppercase text-[#15599a]">Projetos no estágio de cobrança/faturamento</p>
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
          <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-3 shadow-sm lg:w-1/3">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium uppercase tracking-tight">PROJETOS NO ESTÁGIO</h1>
              <VscDiffAdded />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: projects }).projetos}</div>
            </div>
          </div>

          <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-3 shadow-sm lg:w-1/3">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium uppercase tracking-tight">COBRANÇAS PENDENTES</h1>
              <MdPaid />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: projects }).cobrancasPendentes}</div>
            </div>
          </div>
          <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-3 shadow-sm lg:w-1/3">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium uppercase tracking-tight">FATURAMENTOS PENDENTES</h1>
              <IoDocumentTextOutline />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: projects }).faturamentosPendentes}</div>
            </div>
          </div>
        </div>
        <div className="my-2 flex w-full items-center justify-end gap-2">
          <Link href="/financeiro/despesas">
            <button className="rounded-md bg-[#ed174c] py-1 px-4 text-sm font-bold text-white">DESPESAS</button>
          </Link>
          <Link href="/financeiro/receitas">
            <button className="rounded-md bg-green-400 py-1 px-4 text-sm font-bold text-white">RECEITAS</button>
          </Link>
        </div>
        <AnimatePresence>
          {dropdownMenuVisible ? (
            <motion.div initial={{ scale: 0.8, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} className="mt-4 flex w-full flex-col gap-y-2">
              <div className="flex flex-col flex-wrap items-center justify-center gap-2 lg:flex-row">
                <TextInput
                  label="NOME DO CONTRATO"
                  value={filters.search}
                  placeholder="Digite o nome do contrato..."
                  handleChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
                />
                <div className="flex w-full flex-col gap-2 lg:w-fit lg:flex-row">
                  <div className="flex items-center justify-center gap-x-2">
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
                        handleChange={(value) => setFilters((prev) => ({ ...prev, date: { ...prev.date, before: formatDateInputChange(value) } }))}
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-[250px]">
                    <SelectInput
                      width={'100%'}
                      label={'CAMPO DE FILTRO'}
                      value={filters.date.field1 && filters.date.field2 ? `${filters.date.field1}.${filters.date.field2}` : null}
                      options={[
                        { id: 1, label: 'SAÍDA DE OBRA', value: 'obra.saida' },
                        { id: 2, label: 'TROCA DO MEDIDOR', value: 'medidor.data' },
                        { id: 3, label: 'DATA ASS.CONTRATO', value: 'contrato.dataAssinatura' },
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
              </div>
              <div className="flex flex-col flex-wrap items-center justify-center gap-2 lg:flex-row">
                <div className="w-full lg:w-[250px]">
                  <MultipleSelectInput
                    width="100%"
                    label="EMPRESA A FATURAR"
                    selected={filters.billingCompany}
                    options={billableCompanies}
                    selectedItemLabel="SEM FILTRO"
                    handleChange={(value) => setFilters((prev) => ({ ...prev, billingCompany: value as string[] }))}
                    onReset={() => setFilters((prev) => ({ ...prev, billingCompany: [] }))}
                  />
                </div>
                <div className="w-full lg:w-[250px]">
                  <MultipleSelectInput
                    width="100%"
                    label="EQUIPE TÉCNICA"
                    selected={filters.technicalTeam}
                    options={equipesTecnicas.map((team, index) => ({ id: index + 1, label: team.label, value: team.value }))}
                    selectedItemLabel="SEM FILTRO"
                    handleChange={(value) => setFilters((prev) => ({ ...prev, technicalTeam: value as string[] }))}
                    onReset={() => setFilters((prev) => ({ ...prev, technicalTeam: [] }))}
                  />
                </div>
                <div className="w-full lg:w-[250px]">
                  <MultipleSelectInput
                    width="100%"
                    label="STATUS DO CONTRATO"
                    selected={filters.contractStatus}
                    options={contractStatus}
                    selectedItemLabel="SEM FILTRO"
                    handleChange={(value) => setFilters((prev) => ({ ...prev, contractStatus: value as string[] }))}
                    onReset={() => setFilters((prev) => ({ ...prev, contractStatus: [] }))}
                  />
                </div>
                <div className="w-full lg:w-[250px]">
                  <MultipleSelectInput
                    width="100%"
                    label="STATUS DA VISTORIA"
                    selected={filters.inspectionStatus}
                    options={inspectionStatus}
                    selectedItemLabel="SEM FILTRO"
                    handleChange={(value) => setFilters((prev) => ({ ...prev, inspectionStatus: value as string[] }))}
                    onReset={() => setFilters((prev) => ({ ...prev, inspectionStatus: [] }))}
                  />
                </div>
              </div>
              <div className="flex flex-col flex-wrap items-center justify-center gap-2 lg:flex-row">
                <div
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      toCharge: !prev.toCharge,
                    }))
                  }
                  className={`cursor-pointer rounded border border-[#15599a] p-1 font-bold ${
                    filters.toCharge ? 'bg-[#15599a] text-white' : 'bg-transparent text-[#15599a]'
                  }`}
                >
                  COBRANÇA PENDENTE
                </div>
                <div
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      chargeDone: !prev.chargeDone,
                    }))
                  }
                  className={`cursor-pointer rounded border border-[#fead41] p-1 font-bold ${
                    filters.chargeDone ? 'bg-[#fead41] text-white' : 'bg-transparent text-[#fead41]'
                  }`}
                >
                  COBRANÇA FEITA
                </div>
                <div
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      toBill: !prev.toBill,
                    }))
                  }
                  className={`cursor-pointer rounded border border-[#15599a] p-1 font-bold ${
                    filters.toBill ? 'bg-[#15599a] text-white' : 'bg-transparent text-[#15599a]'
                  }`}
                >
                  FATURAMENTO PENDENTE
                </div>
                <div
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      billingDone: !prev.billingDone,
                    }))
                  }
                  className={`cursor-pointer rounded border border-[#fead41] p-1 font-bold ${
                    filters.billingDone ? 'bg-[#fead41] text-white' : 'bg-transparent text-[#fead41]'
                  }`}
                >
                  FATURAMENTO FEITO
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      <div className="mt-4  flex flex-wrap justify-around gap-3">
        {isLoading ? <LoadingPage /> : null}
        {isError ? <ErrorComponent msg={'Erro ao buscar projetos.'} /> : null}
        {isSuccess
          ? projects.map((project, index) => (
              <motion.div
                initial={{ opacity: 0, translateX: -50, translateY: -35 }}
                animate={{ opacity: 1, translateX: 0, translateY: 0 }}
                transition={{ duration: 0.3, delay: 0.01 * index }}
                onClick={() => {
                  handleOpenModal(project._id)
                }}
                key={project._id}
                className="w-full cursor-pointer border border-gray-200 hover:bg-blue-100 md:w-[350px] lg:w-[450px]"
              >
                <TagTipoDeServico tipoDeServico={project.tipoDeServico} />
                <div className="flex flex-col p-2">
                  <div className="flex items-center justify-between pb-2">
                    <p className="text-xs text-gray-700">{project.nomeDoContrato}</p>
                    <p className="text-xs text-[#15599a]">#{project.qtde}</p>
                  </div>
                  <div className="flex items-center justify-between pb-2">
                    <div className="flex flex-col items-start gap-1">
                      <span className="text-xxs">STATUS DE COBRANÇA</span>
                      <p
                        className={`rounded border p-1 text-xs font-black ${
                          project.pagamento?.cobrancaFeita ? 'border border-green-500 text-green-500' : 'border border-red-500 text-red-500'
                        }`}
                      >
                        {project.pagamento?.cobrancaFeita ? 'REALIZADA' : 'PENDENTE'}
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xxs">EMPRESA À FATURAR</span>
                      <p className={`rounded p-1 text-sm font-bold text-gray-500 `}>
                        {project.faturamento?.empresaFaturamento ? project.faturamento?.empresaFaturamento : 'NÃO DEFINIDO'}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xxs">STATUS DE FATURAMENTO</span>
                      <p
                        className={`rounded border p-1 text-xs font-black ${
                          project.faturamento?.concluido ? 'border border-green-500 text-green-500' : 'border border-red-500 text-red-500'
                        }`}
                      >
                        {project.faturamento?.concluido ? 'REALIZADO' : 'PENDENTE'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pb-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-xxs">SAÍDA DE OBRA</span>
                      <p className="text-xs text-yellow-500">
                        {project.obra?.saida ? dayjs(project.obra.saida).add(4, 'hours').format('DD/MM/YYYY') : '-'}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-end text-xxs">VENDEDOR</span>
                      <p className="text-xs text-[#15599a]">{project.vendedor && project.vendedor.nome}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col items-start gap-1">
                      <p className="text-xxs">TIPO DE PAGAMENTO</p>
                      <p className="text-xs text-gray-600">{project.pagamento?.forma && project.pagamento.forma}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <p className="text-end text-xxs">PAGAMENTO DO KIT</p>
                      <p className="text-end text-xs text-gray-600">{project.compra?.statusLiberacao ? project.compra.statusLiberacao : '-'}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          : null}
      </div>
      <Link href={'/comercial/formulariosSolicitacao'}>
        <a className="fixed bottom-10 cursor-pointer rounded-lg bg-[#15599a] p-3 text-white hover:bg-[#fead61] hover:text-[#15599a]">
          <p className="text-sm font-bold uppercase">SOLICITAÇÕES DE CONTRATO</p>
        </a>
      </Link>
      {modalProject.isOpen && modalProject.projectId ? (
        <ModalADM
          projectId={modalProject.projectId}
          modalIsOpen={modalProject.isOpen}
          closeModal={() => setModalProject({ isOpen: false, projectId: null })}
        />
      ) : null}
    </div>
  )
}

export default Administracao
