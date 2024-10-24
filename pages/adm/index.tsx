import React, { useEffect, useState } from 'react'

import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import ModalADM from '../../components/ModalADM'

import TagTipoDeServico from '../../components/TagTipoDeServico'
import { equipesTecnicas, formatDate, GeneralVisibleHiddenExitMotionVariants } from '../../utils/constants'
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
import CheckboxInput from '@/components/inputs/Checkbox'
import ADMProjectCard from '@/components/identificador/adm/ADMProjectCard'
function Administracao() {
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/signin')
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
      const isAuthorized = session?.user.permissoes.administrativo.visualizar
      if (!isAuthorized) {
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
            <motion.div
              key={'editor'}
              variants={GeneralVisibleHiddenExitMotionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="mt-2 flex w-full flex-col gap-2 rounded-md border border-gray-300 bg-[#fff] p-2"
            >
              <h1 className="text-sm font-bold tracking-tight">FILTROS</h1>
              <div className="flex w-full flex-col flex-wrap items-center justify-start gap-2 lg:flex-row">
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
                      value={filters.date.field || null}
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
              <div className="flex w-full flex-col flex-wrap items-center justify-start gap-4 lg:flex-row">
                <div className="w-fit">
                  <CheckboxInput
                    labelFalse="COBRANÇA GERAL PENDENTE"
                    labelTrue="COBRANÇA GERAL PENDENTE"
                    checked={filters.toCharge}
                    handleChange={(value) => setFilters((prev) => ({ ...prev, toCharge: value }))}
                  />
                </div>
                <div className="w-fit">
                  <CheckboxInput
                    labelFalse="COBRANÇA GERAL CONCLUÍDA"
                    labelTrue="COBRANÇA GERAL CONCLUÍDA"
                    checked={filters.chargeDone}
                    handleChange={(value) => setFilters((prev) => ({ ...prev, chargeDone: value }))}
                  />
                </div>
                <div className="w-fit">
                  <CheckboxInput
                    labelFalse="FATURAMENTOS PENDENTES"
                    labelTrue="FATURAMENTOS PENDENTES"
                    checked={filters.toBill}
                    handleChange={(value) => setFilters((prev) => ({ ...prev, toBill: value }))}
                  />
                </div>
                <div className="w-fit">
                  <CheckboxInput
                    labelFalse="FATURAMENTOS CONCLUÍDOS"
                    labelTrue="FATURAMENTOS CONCLUÍDOS"
                    checked={filters.billingDone}
                    handleChange={(value) => setFilters((prev) => ({ ...prev, billingDone: value }))}
                  />
                </div>
              </div>
              <div className="flex w-full flex-col flex-wrap items-center justify-start gap-4 lg:flex-row">
                <div className="w-fit">
                  <CheckboxInput
                    labelFalse="RECEBIMENTOS INDEFINIDOS"
                    labelTrue="RECEBIMENTOS INDEFINIDOS"
                    checked={filters.receiptsUndefined}
                    handleChange={(value) => setFilters((prev) => ({ ...prev, receiptsUndefined: value }))}
                  />
                </div>
                <div className="w-fit">
                  <CheckboxInput
                    labelFalse="RECEBIMENTOS PARA HOJE"
                    labelTrue="RECEBIMENTOS PARA HOJE"
                    checked={filters.receiptToday}
                    handleChange={(value) => setFilters((prev) => ({ ...prev, receiptToday: value }))}
                  />
                </div>
                <div className="w-fit">
                  <CheckboxInput
                    labelFalse="RECEBIMENTOS PARA A SEMANA"
                    labelTrue="RECEBIMENTOS PARA A SEMANA"
                    checked={filters.receiptThisWeek}
                    handleChange={(value) => setFilters((prev) => ({ ...prev, receiptThisWeek: value }))}
                  />
                </div>
                <div className="w-fit">
                  <CheckboxInput
                    labelFalse="RECEBIMENTOS PARA O MÊS"
                    labelTrue="RECEBIMENTOS PARA O MÊS"
                    checked={filters.receiptThisMonth}
                    handleChange={(value) => setFilters((prev) => ({ ...prev, receiptThisMonth: value }))}
                  />
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
          ? projects.map((project, index) => <ADMProjectCard project={project} index={index} handleClick={(id) => handleOpenModal(id)} />)
          : null}
      </div>
      <Link href={'/comercial/solicitacoes-contrato'}>
        <div className="fixed bottom-10 cursor-pointer rounded-lg bg-[#15599a] p-3 text-white hover:bg-[#fead61] hover:text-[#15599a]">
          <p className="text-sm font-bold uppercase">SOLICITAÇÕES DE CONTRATO</p>
        </div>
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
