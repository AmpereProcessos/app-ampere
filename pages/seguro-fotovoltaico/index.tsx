import { Button } from '@/components/ui/button'
import ErrorComponent from '@/components/utils/ErrorComponent'
import LoadingComponent from '@/components/utils/LoadingComponent'
import LoadingPage from '@/components/utils/LoadingPage'
import { getErrorMessage } from '@/utils/methods/handlers'
import { useUFVInsuranceProjects, UseUFVInsuranceProjectsFiltersParams } from '@/utils/methods/query/ufv-insurance'
import { BadgeDollarSign, BadgeDollarSignIcon, Clock, ListFilter, Signature } from 'lucide-react'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'
import { TProjectUFVInsuranceDTO } from '../api/projects/seguro-fotovoltaico'
import { formatDateAsLocale, formatLocation } from '@/utils/methods/formatting'
import { FaLocationDot } from 'react-icons/fa6'
import { MdEdit, MdPhone } from 'react-icons/md'
import { BsCalendarCheck, BsCalendarEvent, BsCalendarPlus, BsPersonVcard } from 'react-icons/bs'
import { formatDecimalPlaces, formatToMoney, GeneralVisibleHiddenExitMotionVariants } from '@/utils/constants'
import { FaPercentage } from 'react-icons/fa'
import { TRevenue } from '@/utils/schemas/revenues'
import dayjs from 'dayjs'
import EditRevenue from '@/components/identificador/receitas/modals/EditRevenue'
import { AnimatePresence, motion } from 'framer-motion'
import TextInput from '@/components/inputs/Text'
import { cn } from '@/lib/utils'

import StatesAndCities from '@/utils/jsons/estados-cidades.json'
import MultipleSelectInputVirtualized from '@/components/inputs/MultipleSelectInputVirtualized'
import CheckboxInput from '@/components/inputs/Checkbox'

const AllCities = StatesAndCities.flatMap((s) => s.cidades).map((c, index) => ({ id: index + 1, label: c, value: c }))
const AllStates = StatesAndCities.map((e) => e.sigla).map((c, index) => ({ id: index + 1, label: c, value: c }))
function MainUFVInsurancePage() {
  const { data: session, status } = useSession({ required: true })
  const [filterMenuIsOpen, setFilterMenuIsOpen] = useState<boolean>(false)
  const [revenueModal, setRevenueModal] = useState<{ id: string | null; isOpen: boolean }>({ id: null, isOpen: false })
  const { data: projects, isLoading, isError, isSuccess, error, filters, setFilters } = useUFVInsuranceProjects()

  if (status != 'authenticated') return <LoadingPage />
  return (
    <div className="flex grow flex-col gap-2 p-6">
      <div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
        <div className="flex w-full flex-col items-center justify-between gap-2 gap-y-3 lg:flex-row ">
          <div className="flex flex-col items-center  gap-1 lg:flex-row">
            <div className="flex items-center gap-1">
              {filterMenuIsOpen ? (
                <div className="cursor-pointer text-gray-600 hover:text-blue-400">
                  <IoMdArrowDropupCircle style={{ fontSize: '25px' }} onClick={() => setFilterMenuIsOpen(false)} />
                </div>
              ) : (
                <div className="cursor-pointer text-gray-600 hover:text-blue-400">
                  <IoMdArrowDropdownCircle style={{ fontSize: '25px' }} onClick={() => setFilterMenuIsOpen(true)} />
                </div>
              )}
              <p className="text-center text-2xl font-black uppercase text-[#15599a]">PROJETOS DE SEGURO FOTOVOLTAICO</p>
            </div>
          </div>
        </div>
        <AnimatePresence>{filterMenuIsOpen ? <FilterMenu filters={filters} setFilters={setFilters} /> : null}</AnimatePresence>
      </div>

      {isLoading ? <LoadingComponent /> : null}
      {isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
      {isSuccess ? (
        projects.length > 0 ? (
          projects.map((project) => (
            <UFVInsuranceProjectCard key={project._id} project={project} onRevenueEditClick={(id) => setRevenueModal({ id, isOpen: true })} />
          ))
        ) : (
          <div className="w-full text-center text-sm font-medium tracking-tight text-primary/80">Nenhum projeto encontrado.</div>
        )
      ) : null}
      {revenueModal.id && revenueModal.isOpen ? (
        <EditRevenue revenueId={revenueModal.id} session={session} closeModal={() => setRevenueModal({ id: null, isOpen: false })} />
      ) : null}
    </div>
  )
}

export default MainUFVInsurancePage

type FilterMenuProps = {
  filters: UseUFVInsuranceProjectsFiltersParams
  setFilters: React.Dispatch<React.SetStateAction<UseUFVInsuranceProjectsFiltersParams>>
}
function FilterMenu({ filters, setFilters }: FilterMenuProps) {
  return (
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
          placeholder="Filtre pelo nome do contrato..."
          value={filters.search}
          handleChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
          labelClassName="text-xs font-medium tracking-tight text-black"
        />
        <MultipleSelectInputVirtualized
          label="CIDADE"
          selected={filters.cities}
          options={AllCities}
          selectedItemLabel="NÃO DEFINIDO"
          handleChange={(value) => {
            setFilters((prev) => ({
              ...prev,
              cities: value as string[],
            }))
          }}
          onReset={() => {
            setFilters((prev) => ({
              ...prev,
              cities: [],
            }))
          }}
          labelClassName="text-xs font-medium tracking-tight text-black"
        />
        <MultipleSelectInputVirtualized
          label="ESTADOS"
          selected={filters.ufs}
          options={AllStates}
          selectedItemLabel="NÃO DEFINIDO"
          handleChange={(value) => {
            setFilters((prev) => ({
              ...prev,
              ufs: value as string[],
            }))
          }}
          onReset={() => {
            setFilters((prev) => ({
              ...prev,
              ufs: [],
            }))
          }}
          labelClassName="text-xs font-medium tracking-tight text-black"
        />
      </div>
      <div className="flex w-full flex-col flex-wrap items-center justify-between gap-2 lg:flex-row">
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-fit">
            <CheckboxInput
              labelFalse="RECEBIMENTOS PENDENTES"
              labelTrue="RECEBIMENTOS PENDENTES"
              checked={filters.pendingReceipts}
              handleChange={(value) => setFilters((prev) => ({ ...prev, pendingReceipts: value }))}
            />
          </div>
          <div className="w-fit">
            <CheckboxInput
              labelFalse="RECEBIMENTOS PENDENTES PARA SEMANA"
              labelTrue="RECEBIMENTOS PENDENTES PARA SEMANA"
              checked={filters.pendingReceiptsForWeek}
              handleChange={(value) => setFilters((prev) => ({ ...prev, pendingReceiptsForWeek: value }))}
            />
          </div>
          <div className="w-fit">
            <CheckboxInput
              labelFalse="RECEBIMENTOS PENDENTES PARA HOJE"
              labelTrue="RECEBIMENTOS PENDENTES PARA HOJE"
              checked={filters.pendingReceiptsForToday}
              handleChange={(value) => setFilters((prev) => ({ ...prev, pendingReceiptsForToday: value }))}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

type UFVInsuranceProjectCardProps = {
  project: TProjectUFVInsuranceDTO
  onRevenueEditClick: (id: string) => void
}
function UFVInsuranceProjectCard({ project, onRevenueEditClick }: UFVInsuranceProjectCardProps) {
  const [showReceipts, setShowReceipts] = useState<boolean>(false)
  function getContractStatus(status: TProjectUFVInsuranceDTO['contrato']['status']) {
    if (status === 'AGUARDANDO SOLICITAÇÃO')
      return (
        <div className="flex min-w-fit items-center gap-1 rounded-lg bg-gray-500 px-2 py-0.5 text-white">
          <Signature size={12} />
          <h1 className="text-[0.5rem]">{status}</h1>
        </div>
      )
    if (['SOLICITADO'].includes(status || ''))
      return (
        <div className="flex min-w-fit items-center gap-1 rounded-lg bg-blue-600 px-2 py-0.5 text-white">
          <Signature size={12} />
          <h1 className="text-[0.5rem]">{status}</h1>
        </div>
      )
    if (status === 'NÃO ASSINADO')
      return (
        <div className="flex min-w-fit items-center gap-1 rounded-lg bg-orange-600 px-2 py-0.5 text-white">
          <Signature size={12} />
          <h1 className="text-[0.5rem]">{status}</h1>
        </div>
      )
    if (status === 'ASSINADO')
      return (
        <div className="flex min-w-fit items-center gap-1 rounded-lg bg-green-500 px-2 py-0.5 text-white">
          <Signature size={12} />
          <h1 className="text-[0.5rem]">{status}</h1>
        </div>
      )
    if (status === 'RESCISÃO DE CONTRATO')
      return (
        <div className="flex min-w-fit items-center gap-1 rounded-lg bg-red-500 px-2 py-0.5 text-white">
          <Signature size={12} />
          <h1 className="text-[0.5rem]">{status}</h1>7
        </div>
      )
    return (
      <div className="flex min-w-fit items-center gap-1 rounded-lg bg-gray-500 px-2 py-0.5 text-white">
        <Signature size={12} />
        <h1 className="text-[0.5rem]">NÃO DEFINIDO</h1>
      </div>
    )
  }
  function getRevenueStatus(revenue: TProjectUFVInsuranceDTO['receita']) {
    if (!revenue)
      return {
        tag: (
          <div className="flex min-w-fit items-center gap-1 rounded-lg bg-gray-500 px-2 py-0.5 text-white">
            <BadgeDollarSignIcon size={12} />
            <h1 className="text-[0.5rem]">NÃO DEFINIDO</h1>
          </div>
        ),
        fractionationStr: null,
      }

    const { fracionamento: receipts, total: revenueTotal } = revenue

    const totalReceived = receipts.reduce((acc, current) => (current.dataRecebimento ? acc + (current.valor || 0) : acc), 0)
    const partionsReceived = receipts.filter((r) => !!r.dataRecebimento).length
    // In case partions received are equal to the total amount of receipts
    if (totalReceived == revenueTotal || Math.abs(totalReceived - revenueTotal) <= 2)
      return {
        tag: (
          <div className="flex min-w-fit items-center gap-1 rounded-lg bg-green-500 px-2 py-0.5 text-white">
            <BadgeDollarSignIcon size={12} />
            <h1 className="text-[0.5rem]">RECEBIDO</h1>
          </div>
        ),
        fractionationStr: `${partionsReceived}/${receipts.length}`,
      }

    if (totalReceived > 0)
      return {
        tag: (
          <div className="flex min-w-fit items-center gap-1 rounded-lg bg-orange-600 px-2 py-0.5 text-white">
            <BadgeDollarSignIcon size={12} />
            <h1 className="text-[0.5rem]">RECEBIDO PARCIAL</h1>
          </div>
        ),
        fractionationStr: `${partionsReceived}/${receipts.length}`,
      }

    return {
      tag: (
        <div className="flex min-w-fit items-center gap-1 rounded-lg bg-red-600 px-2 py-0.5 text-white">
          <BadgeDollarSignIcon size={12} />
          <h1 className="text-[0.5rem]">PENDENTE</h1>
        </div>
      ),
      fractionationStr: `${partionsReceived}/${receipts.length}`,
    }
  }
  function getReceiptStatus(receipt: TRevenue['fracionamento'][number]) {
    if (!!receipt.dataRecebimento) return <h1 className="min-w-fit rounded-lg bg-green-500 px-2 py-0.5 text-[0.5rem] text-white">RECEBIDO</h1>
    const isForToday = dayjs().isSame(receipt.dataPrevisaoRecebimento)
    if (isForToday) return <h1 className="min-w-fit rounded-lg bg-orange-600 px-2 py-0.5 text-[0.5rem] text-white">RECEBER HOJE</h1>
    const isOverDue = dayjs(new Date()).isAfter(receipt.dataPrevisaoRecebimento)
    if (isOverDue) return <h1 className="min-w-fit rounded-lg bg-red-600 px-2 py-0.5 text-[0.5rem] text-white">EM ATRASO</h1>

    return <h1 className="min-w-fit rounded-lg bg-blue-500 px-2 py-0.5 text-[0.5rem] text-white">A RECEBER</h1>
  }
  const receiptStatus = getRevenueStatus(project.receita)
  return (
    <div className="relative flex w-full flex-col justify-between gap-1 rounded border border-gray-500 bg-[#fff] p-2 shadow-sm">
      <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-bold leading-none tracking-tight">{project.nomeDoContrato}</h1>
          {getContractStatus(project.contrato.status)}
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex w-full flex-wrap items-center justify-center gap-2 lg:grow lg:justify-start">
          <div className="flex items-center gap-1">
            <BsPersonVcard />
            <p className="text-[0.6rem] font-medium leading-none tracking-tight">{project?.cpf_cnpj}</p>
          </div>
          <div className="flex items-center gap-1">
            <MdPhone />
            <p className="text-[0.6rem] font-medium leading-none tracking-tight">{project?.telefone}</p>
          </div>
          <div className="flex items-center gap-1">
            <FaLocationDot width={15} height={15} />
            <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">
              {formatLocation({
                location: {
                  uf: project!.uf || '',
                  cidade: project!.cidade || '',
                  cep: project!.cep?.toString() || '',
                  bairro: project!.bairro,
                  endereco: project!.logradouro,
                  numeroOuIdentificador: project!.numeroResidencia?.toString() || '',
                  complemento: null,
                  latitude: null,
                  longitude: null,
                },
                includeCity: true,
                includeUf: true,
              })}
            </h1>
          </div>
        </div>
        <div className="flex w-full flex-wrap items-center justify-center gap-2 lg:min-w-fit lg:justify-end">
          <div className="flex items-center gap-1">
            <Signature width={15} height={15} />
            <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">ASSINADO EM:</h1>
            <h1 className="py-0.5 text-center text-[0.6rem] font-bold  text-primary">{formatDateAsLocale(project.contrato.dataAssinatura)}</h1>
          </div>
          <div className="flex items-center gap-1">
            <BadgeDollarSignIcon width={15} height={15} />
            <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">VALOR</h1>
            <h1 className="py-0.5 text-center text-[0.6rem] font-bold  text-primary">
              {formatToMoney(project.seguro?.valor || project.sistema.valorProjeto || 0)}
            </h1>
          </div>
          <div className="flex items-center gap-1">
            <Clock width={15} height={15} />
            <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">DURAÇÃO:</h1>
            <h1 className="py-0.5 text-center text-[0.6rem] font-bold  text-primary">{formatDecimalPlaces(project.seguro?.duracao || 0, 0)}</h1>
          </div>
          <div className="flex items-center gap-1">
            <BsCalendarPlus width={10} height={10} />
            <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">INÍCIO DO SEGURO:</h1>
            <h1 className="py-0.5 text-center text-[0.6rem] font-bold  text-primary">{formatDateAsLocale(project.seguro?.dataInicio)}</h1>
          </div>
          <div className="flex items-center gap-1">
            <BsCalendarCheck width={10} height={10} />
            <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">FIM DO SEGURO:</h1>
            <h1 className="py-0.5 text-center text-[0.6rem] font-bold  text-primary">{formatDateAsLocale(project.seguro?.dataFim)}</h1>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col gap-3">
        <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
          <div className="flex items-center gap-2">
            <h1 className="text-[0.6rem] font-medium leading-none tracking-tight">RECEITA</h1>
            {receiptStatus.tag}
            {receiptStatus.fractionationStr ? (
              <button
                onClick={() => setShowReceipts((prev) => !prev)}
                className={cn(
                  'rounded bg-gray-100 py-0.5 px-2 text-[0.5rem] font-bold text-primary/80 duration-300 ease-in-out',
                  showReceipts ? 'bg-gray-300' : ''
                )}
              >
                MOSTRAR RECEBIMENTOS {receiptStatus.fractionationStr}
              </button>
            ) : null}
          </div>
          {!!project.receita?._id ? (
            <button
              onClick={() => onRevenueEditClick(project.receita?._id || '')}
              className="flex items-center justify-center gap-2 rounded border border-orange-500 bg-orange-50 px-2 py-0.5 text-orange-500 duration-300 ease-in-out hover:border-orange-700 hover:text-orange-700"
            >
              <p className="text-[0.5rem]">EDITAR RECEITA</p>
              <MdEdit size={10} />
            </button>
          ) : null}
        </div>

        {project.receita ? (
          showReceipts ? (
            project.receita.fracionamento.length > 0 ? (
              project.receita.fracionamento.map((receipt, index) => (
                <div key={index} className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
                  <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                    <p className="text-[0.65rem] font-medium leading-none tracking-tight">{receipt.titulo}</p>
                    <div className="hidden items-center gap-1 rounded-lg bg-secondary px-2 py-0.5 text-center text-[0.5rem] font-medium italic text-primary/80 lg:flex">
                      <FaPercentage />
                      <h1>
                        PARCIAL DE{' '}
                        <strong>
                          {receipt.porcentagem
                            ? formatDecimalPlaces(receipt.porcentagem)
                            : formatDecimalPlaces(100 * (receipt.valor || 0 / (project.receita?.total || 0)))}
                          %
                        </strong>
                      </h1>
                    </div>
                    {getReceiptStatus(receipt)}
                  </div>
                  <div className="hidden flex-wrap items-center justify-center gap-2 lg:flex lg:justify-end">
                    <div className="flex items-center gap-1">
                      <BsCalendarEvent />
                      <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">PREVISTO PARA</h1>
                      <p className="py-0.5 text-center text-[0.6rem] font-bold  text-primary">
                        {formatDateAsLocale(receipt.dataPrevisaoRecebimento)}
                      </p>
                    </div>
                    {receipt.dataRecebimento ? (
                      <div className="flex items-center gap-1">
                        <BsCalendarCheck color="#22c55e " />
                        <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">RECEBIDO EM</h1>
                        <p className="py-0.5 text-center text-[0.6rem] font-bold  text-primary">{formatDateAsLocale(receipt.dataRecebimento)}</p>
                      </div>
                    ) : null}

                    <h1 className="rounded-lg bg-primary px-2 py-0.5 text-center text-[0.65rem] font-medium text-secondary">
                      {formatToMoney(receipt.valor || 0)}
                    </h1>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full text-start text-[0.65rem] font-medium tracking-tight text-primary/80">Nenhum recebimento definido.</div>
            )
          ) : null
        ) : (
          <div className="w-full text-start text-[0.65rem] font-medium tracking-tight text-primary/80">Receita não encontrada.</div>
        )}
      </div>
    </div>
  )
}
