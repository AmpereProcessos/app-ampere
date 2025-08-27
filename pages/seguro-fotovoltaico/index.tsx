import EditRevenue from '@/components/identificador/receitas/modals/EditRevenue'
import TextInput from '@/components/inputs/Text'
import { useSession } from '@/components/providers/SessionProvider'
import { Button } from '@/components/ui/button'
import ErrorComponent from '@/components/utils/ErrorComponent'
import LoadingComponent from '@/components/utils/LoadingComponent'
import LoadingPage from '@/components/utils/LoadingPage'
import type { TAuthSession } from '@/lib/authentication/types'
import { cn } from '@/lib/utils'
import { GeneralVisibleHiddenExitMotionVariants, formatDecimalPlaces, formatToMoney } from '@/utils/constants'
import { formatDateAsLocale, formatLocation } from '@/utils/methods/formatting'
import { getErrorMessage } from '@/utils/methods/handlers'
import { type UseUFVInsuranceProjectsFiltersParams, useUFVInsuranceProjects } from '@/utils/methods/query/ufv-insurance'
import type { TRevenue } from '@/utils/schemas/revenues'
import dayjs from 'dayjs'
import { AnimatePresence, motion } from 'framer-motion'
import { BadgeDollarSign, BadgeDollarSignIcon, Clock, ListFilter, Signature } from 'lucide-react'
import type React from 'react'
import { useState } from 'react'
import { BsCalendarCheck, BsCalendarEvent, BsCalendarPlus, BsPersonVcard } from 'react-icons/bs'
import { FaPercentage } from 'react-icons/fa'
import { FaLocationDot } from 'react-icons/fa6'
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'
import { MdEdit, MdPhone } from 'react-icons/md'
import type { TProjectUFVInsuranceDTO } from '../api/projects/seguro-fotovoltaico'

import CheckboxInput from '@/components/inputs/Checkbox'
import MultipleSelectInputVirtualized from '@/components/inputs/MultipleSelectInputVirtualized'
import UnauthenticatedComponent from '@/components/utils/UnauthenticatedComponent'
import StatesAndCities from '@/utils/jsons/estados-cidades.json'

const AllCities = StatesAndCities.flatMap((s) => s.cidades).map((c, index) => ({
  id: index + 1,
  label: c,
  value: c,
}))
const AllStates = StatesAndCities.map((e) => e.sigla).map((c, index) => ({
  id: index + 1,
  label: c,
  value: c,
}))
function MainUFVInsurancePage() {
  const { session, status } = useSession()
  if (status === 'loading') return <LoadingPage />
  if (status === 'unauthenticated') return <UnauthenticatedComponent />
  return <MainUFVInsurancePageContent session={session} />
}

export default MainUFVInsurancePage

function MainUFVInsurancePageContent({ session }: { session: TAuthSession }) {
  const [filterMenuIsOpen, setFilterMenuIsOpen] = useState<boolean>(false)
  const [revenueModal, setRevenueModal] = useState<{
    id: string | null
    isOpen: boolean
  }>({ id: null, isOpen: false })
  const { data: projects, isLoading, isError, isSuccess, error, filters, setFilters } = useUFVInsuranceProjects()

  return (
    <div className="flex grow flex-col gap-2 p-6">
      <div className="border-primary/20 flex flex-col items-center justify-between border-b p-1">
        <div className="flex w-full flex-col items-center justify-between gap-2 gap-y-3 lg:flex-row">
          <div className="flex flex-col items-center gap-1 lg:flex-row">
            <div className="flex items-center gap-1">
              {filterMenuIsOpen ? (
                <div className="text-primary/80 cursor-pointer hover:text-blue-400">
                  <IoMdArrowDropupCircle style={{ fontSize: '25px' }} onClick={() => setFilterMenuIsOpen(false)} />
                </div>
              ) : (
                <div className="text-primary/80 cursor-pointer hover:text-blue-400">
                  <IoMdArrowDropdownCircle style={{ fontSize: '25px' }} onClick={() => setFilterMenuIsOpen(true)} />
                </div>
              )}
              <p className="text-center text-2xl font-black text-[#15599a] uppercase">PROJETOS DE SEGURO FOTOVOLTAICO</p>
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
          <div className="text-primary/80 w-full text-center text-sm font-medium tracking-tight">Nenhum projeto encontrado.</div>
        )
      ) : null}
      {revenueModal.id && revenueModal.isOpen ? (
        <EditRevenue revenueId={revenueModal.id} session={session} closeModal={() => setRevenueModal({ id: null, isOpen: false })} />
      ) : null}
    </div>
  )
}

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
      className="bg-background border-primary/20 mt-2 flex w-full flex-col gap-2 rounded-md border p-2"
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
              handleChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  pendingReceiptsForWeek: value,
                }))
              }
            />
          </div>
          <div className="w-fit">
            <CheckboxInput
              labelFalse="RECEBIMENTOS PENDENTES PARA HOJE"
              labelTrue="RECEBIMENTOS PENDENTES PARA HOJE"
              checked={filters.pendingReceiptsForToday}
              handleChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  pendingReceiptsForToday: value,
                }))
              }
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
        <div className="bg-primary/60 flex min-w-fit items-center gap-1 rounded-lg px-2 py-0.5 text-white">
          <Signature size={12} />
          <h1 className="text-xxs">{status}</h1>
        </div>
      )

    if (['SOLICITADO'].includes(status || ''))
      return (
        <div className="flex min-w-fit items-center gap-1 rounded-lg bg-blue-600 px-2 py-0.5 text-white">
          <Signature size={12} />
          <h1 className="text-xxs">{status}</h1>
        </div>
      )

    if (status === 'NÃO ASSINADO')
      return (
        <div className="flex min-w-fit items-center gap-1 rounded-lg bg-orange-600 px-2 py-0.5 text-white">
          <Signature size={12} />
          <h1 className="text-xxs">{status}</h1>
        </div>
      )

    if (status === 'ASSINADO')
      return (
        <div className="flex min-w-fit items-center gap-1 rounded-lg bg-green-500 px-2 py-0.5 text-white">
          <Signature size={12} />
          <h1 className="text-xxs">{status}</h1>
        </div>
      )

    if (status === 'RESCISÃO DE CONTRATO')
      return (
        <div className="flex min-w-fit items-center gap-1 rounded-lg bg-red-500 px-2 py-0.5 text-white">
          <Signature size={12} />
          <h1 className="text-xxs">{status}</h1>7
        </div>
      )

    return (
      <div className="bg-primary/60 flex min-w-fit items-center gap-1 rounded-lg px-2 py-0.5 text-white">
        <Signature size={12} />
        <h1 className="text-xxs">NÃO DEFINIDO</h1>
      </div>
    )
  }
  function getRevenueStatus(revenue: TProjectUFVInsuranceDTO['receita']) {
    if (!revenue)
      return {
        tag: (
          <div className="bg-primary/60 flex min-w-fit items-center gap-1 rounded-lg px-2 py-0.5 text-white">
            <BadgeDollarSignIcon size={12} />
            <h1 className="text-xxs">NÃO DEFINIDO</h1>
          </div>
        ),

        fractionationStr: null,
      }

    const { fracionamento: receipts, total: revenueTotal } = revenue

    const totalReceived = receipts.reduce((acc, current) => (current.dataRecebimento ? acc + (current.valor || 0) : acc), 0)
    const partionsReceived = receipts.filter((r) => !!r.dataRecebimento).length
    // In case partions received are equal to the total amount of receipts
    if (totalReceived === revenueTotal || Math.abs(totalReceived - revenueTotal) <= 2)
      return {
        tag: (
          <div className="flex min-w-fit items-center gap-1 rounded-lg bg-green-500 px-2 py-0.5 text-white">
            <BadgeDollarSignIcon size={12} />
            <h1 className="text-xxs">RECEBIDO</h1>
          </div>
        ),

        fractionationStr: `${partionsReceived}/${receipts.length}`,
      }

    if (totalReceived > 0)
      return {
        tag: (
          <div className="flex min-w-fit items-center gap-1 rounded-lg bg-orange-600 px-2 py-0.5 text-white">
            <BadgeDollarSignIcon size={12} />
            <h1 className="text-xxs">RECEBIDO PARCIAL</h1>
          </div>
        ),

        fractionationStr: `${partionsReceived}/${receipts.length}`,
      }

    return {
      tag: (
        <div className="flex min-w-fit items-center gap-1 rounded-lg bg-red-600 px-2 py-0.5 text-white">
          <BadgeDollarSignIcon size={12} />
          <h1 className="text-xxs">PENDENTE</h1>
        </div>
      ),

      fractionationStr: `${partionsReceived}/${receipts.length}`,
    }
  }
  function getReceiptStatus(receipt: TRevenue['fracionamento'][number]) {
    if (receipt.dataRecebimento) return <h1 className="text-xxs min-w-fit rounded-lg bg-green-500 px-2 py-0.5 text-white">RECEBIDO</h1>

    const isForToday = dayjs().isSame(receipt.dataPrevisaoRecebimento)
    if (isForToday) return <h1 className="text-xxs min-w-fit rounded-lg bg-orange-600 px-2 py-0.5 text-white">RECEBER HOJE</h1>

    const isOverDue = dayjs(new Date()).isAfter(receipt.dataPrevisaoRecebimento)
    if (isOverDue) return <h1 className="text-xxs min-w-fit rounded-lg bg-red-600 px-2 py-0.5 text-white">EM ATRASO</h1>

    return <h1 className="text-xxs min-w-fit rounded-lg bg-blue-500 px-2 py-0.5 text-white">A RECEBER</h1>
  }
  const receiptStatus = getRevenueStatus(project.receita)
  return (
    <div className="bg-background border-primary/60 relative flex w-full flex-col justify-between gap-1 rounded border p-2 shadow-xs">
      <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex items-center gap-2">
          <h1 className="text-sm leading-none font-bold tracking-tight">{project.nomeDoContrato}</h1>
          {getContractStatus(project.contrato.status)}
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex w-full flex-wrap items-center justify-center gap-2 lg:grow lg:justify-start">
          <div className="flex items-center gap-1">
            <BsPersonVcard />
            <p className="text-[0.6rem] leading-none font-medium tracking-tight">{project?.cpf_cnpj}</p>
          </div>
          <div className="flex items-center gap-1">
            <MdPhone />
            <p className="text-[0.6rem] leading-none font-medium tracking-tight">{project?.telefone}</p>
          </div>
          <div className="flex items-center gap-1">
            <FaLocationDot width={15} height={15} />
            <h1 className="text-primary/80 py-0.5 text-center text-[0.6rem] font-medium italic">
              {formatLocation({
                location: {
                  uf: project.uf || '',
                  cidade: project.cidade || '',
                  cep: project.cep?.toString() || '',
                  bairro: project.bairro,
                  endereco: project.logradouro,
                  numeroOuIdentificador: project.numeroResidencia?.toString() || '',
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
            <h1 className="text-primary/80 py-0.5 text-center text-[0.6rem] font-medium italic">ASSINADO EM:</h1>
            <h1 className="text-primary py-0.5 text-center text-[0.6rem] font-bold">{formatDateAsLocale(project.contrato.dataAssinatura)}</h1>
          </div>
          <div className="flex items-center gap-1">
            <BadgeDollarSignIcon width={15} height={15} />
            <h1 className="text-primary/80 py-0.5 text-center text-[0.6rem] font-medium italic">VALOR</h1>
            <h1 className="text-primary py-0.5 text-center text-[0.6rem] font-bold">
              {formatToMoney(project.seguro?.valor || project.sistema.valorProjeto || 0)}
            </h1>
          </div>
          <div className="flex items-center gap-1">
            <Clock width={15} height={15} />
            <h1 className="text-primary/80 py-0.5 text-center text-[0.6rem] font-medium italic">DURAÇÃO:</h1>
            <h1 className="text-primary py-0.5 text-center text-[0.6rem] font-bold">{formatDecimalPlaces(project.seguro?.duracao || 0, 0)}</h1>
          </div>
          <div className="flex items-center gap-1">
            <BsCalendarPlus width={10} height={10} />
            <h1 className="text-primary/80 py-0.5 text-center text-[0.6rem] font-medium italic">INÍCIO DO SEGURO:</h1>
            <h1 className="text-primary py-0.5 text-center text-[0.6rem] font-bold">{formatDateAsLocale(project.seguro?.dataInicio)}</h1>
          </div>
          <div className="flex items-center gap-1">
            <BsCalendarCheck width={10} height={10} />
            <h1 className="text-primary/80 py-0.5 text-center text-[0.6rem] font-medium italic">FIM DO SEGURO:</h1>
            <h1 className="text-primary py-0.5 text-center text-[0.6rem] font-bold">{formatDateAsLocale(project.seguro?.dataFim)}</h1>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col gap-3">
        <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
          <div className="flex items-center gap-2">
            <h1 className="text-[0.6rem] leading-none font-medium tracking-tight">RECEITA</h1>
            {receiptStatus.tag}
            {receiptStatus.fractionationStr ? (
              <button
                type="button"
                onClick={() => setShowReceipts((prev) => !prev)}
                className={cn(
                  'text-xxs text-primary/80 rounded bg-blue-100 px-2 py-0.5 font-bold duration-300 ease-in-out',
                  showReceipts ? 'bg-blue-300' : ''
                )}
              >
                MOSTRAR RECEBIMENTOS {receiptStatus.fractionationStr}
              </button>
            ) : null}
          </div>
          {project.receita?._id ? (
            <button
              type="button"
              onClick={() => onRevenueEditClick(project.receita?._id || '')}
              className="bg-primary/80 hover:border-primary/60 hover:bg-primary/60 border-primary/80 flex items-center justify-center gap-2 rounded border px-2 py-0.5 text-white duration-300 ease-in-out"
            >
              <p className="text-xxs font-medium">EDITAR RECEITA</p>
              <MdEdit size={10} />
            </button>
          ) : null}
        </div>

        {project.receita ? (
          showReceipts ? (
            project.receita?.fracionamento.length > 0 ? (
              project.receita?.fracionamento.map((receipt) => (
                <div key={receipt.titulo} className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
                  <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                    <p className="text-[0.65rem] leading-none font-medium tracking-tight">{receipt.titulo}</p>
                    <div className="bg-secondary text-xxs text-primary/80 hidden items-center gap-1 rounded-lg px-2 py-0.5 text-center font-medium italic lg:flex">
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
                      <h1 className="text-primary/80 py-0.5 text-center text-[0.6rem] font-medium italic">PREVISTO PARA</h1>
                      <p className="text-primary py-0.5 text-center text-[0.6rem] font-bold">{formatDateAsLocale(receipt.dataPrevisaoRecebimento)}</p>
                    </div>
                    {receipt.dataRecebimento ? (
                      <div className="flex items-center gap-1">
                        <BsCalendarCheck color="#22c55e " />
                        <h1 className="text-primary/80 py-0.5 text-center text-[0.6rem] font-medium italic">RECEBIDO EM</h1>
                        <p className="text-primary py-0.5 text-center text-[0.6rem] font-bold">{formatDateAsLocale(receipt.dataRecebimento)}</p>
                      </div>
                    ) : null}

                    <h1 className="bg-primary text-secondary rounded-lg px-2 py-0.5 text-center text-[0.65rem] font-medium">
                      {formatToMoney(receipt.valor || 0)}
                    </h1>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-primary/80 w-full text-start text-[0.65rem] font-medium tracking-tight">Nenhum recebimento definido.</div>
            )
          ) : null
        ) : (
          <div className="text-primary/80 w-full text-start text-[0.65rem] font-medium tracking-tight">Receita não encontrada.</div>
        )}
      </div>
    </div>
  )
}
