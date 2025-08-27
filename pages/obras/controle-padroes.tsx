import React, { useState } from 'react'

import PAAdequationsFilterMenu from '@/components/identificador/controlePadroes/FilterMenu'
import PAAdequationProjectCard from '@/components/identificador/controlePadroes/PAAdequationProjectCard'
import DateIntervalInput from '@/components/inputs/DateIntervalInput'
import { useSession } from '@/components/providers/SessionProvider'
import ErrorComponent from '@/components/utils/ErrorComponent'
import GeneralPaginationComponent from '@/components/utils/Pagination'
import UnauthenticatedComponent from '@/components/utils/UnauthenticatedComponent'
import UnauthorizedPage from '@/components/utils/UnauthorizedPage'
import type { TAuthSession } from '@/lib/authentication/types'
import { formatDateAsLocale } from '@/utils/methods/formatting'
import { useEnergyPAExecutionWithFilters, usePAExecutionStats } from '@/utils/methods/query/execution'
import { useQueryClient } from '@tanstack/react-query'
import { ChartArea, CircleCheck, LayoutGrid, X } from 'lucide-react'
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'
import LoadingPage from '../../components/utils/LoadingPage'
import type { TEnergyPAExecutionWithFiltersInput } from '../api/gestao-obras/padroes'

function EnergyPAControls() {
  const { session, status } = useSession()
  const isAuthorized = session?.user.permissoes.rotas.includes('Obras') || session?.user.permissoes.rotas.includes('Pós-Venda')

  if (status === 'loading') return <LoadingPage />
  if (status === 'unauthenticated') return <UnauthenticatedComponent />
  if (!isAuthorized) return <UnauthorizedPage />
  return <EnergyPAControlsContent session={session} />
}

export default EnergyPAControls

function EnergyPAControlsContent({ session }: { session: TAuthSession }) {
  const queryClient = useQueryClient()
  const { data: projectsResult, isLoading, isError, isSuccess, queryParams, updateQueryParams, queryKey } = useEnergyPAExecutionWithFilters({})
  const projects = projectsResult?.projects || []
  const projectsMatched = projectsResult?.projectsMatched || 0
  const projectsShowing = projects.length
  const totalPages = projectsResult?.totalPages || 0
  const [filterMenuIsOpen, setFilterMenuIsOpen] = useState<boolean>(false)

  const handleOnMutate = async () => await queryClient.cancelQueries({ queryKey })
  const handleOnSettled = async () => await queryClient.invalidateQueries({ queryKey })

  return (
    <div className="grow bg-slate-50 p-6">
      <div className="border-primary/20 flex flex-col items-center justify-between gap-2 border-b p-1">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col items-center gap-2 lg:flex-row">
            <p className="text-center text-2xl font-black text-[#15599a] uppercase">PROJETOS COM ADEQUAÇÃO DE PADRÃO</p>
          </div>
          {filterMenuIsOpen ? (
            <div className="text-primary/80 cursor-pointer hover:text-blue-400">
              <IoMdArrowDropupCircle style={{ fontSize: '25px' }} onClick={() => setFilterMenuIsOpen(false)} />
            </div>
          ) : (
            <div className="text-primary/80 cursor-pointer hover:text-blue-400">
              <IoMdArrowDropdownCircle style={{ fontSize: '25px' }} onClick={() => setFilterMenuIsOpen(true)} />
            </div>
          )}
        </div>
        <EnergyPAExecutionStats />
        <EnergyPAFiltersShowcase queryParams={queryParams} updateQueryParams={updateQueryParams} />
      </div>
      <GeneralPaginationComponent
        activePage={queryParams.page}
        queryLoading={isLoading}
        selectPage={(page) => updateQueryParams({ page })}
        totalPages={totalPages}
        itemsMatchedText={`Foram encontrados ${projectsMatched} projetos.`}
        itemsShowingText={`Monstrando ${projectsShowing} projetos.`}
      />
      <div className="flex w-full flex-col gap-2 py-2">
        {isLoading ? <LoadingPage /> : null}
        {isError ? <ErrorComponent msg={'Erro ao encontrar projetos para adequação de padrão.'} /> : null}
        {isSuccess && projects ? (
          projects.length > 0 ? (
            projects.map((project) => (
              <PAAdequationProjectCard
                key={project._id}
                project={project}
                callbacks={{ onMutate: handleOnMutate, onSuccess: handleOnSettled, onSettled: handleOnSettled }}
              />
            ))
          ) : (
            <p className="text-primary/60 w-full text-center font-medium">Nenhum projeto foi encontrado...</p>
          )
        ) : null}
      </div>
      {filterMenuIsOpen ? (
        <PAAdequationsFilterMenu queryParams={queryParams} updateQueryParams={updateQueryParams} closeMenu={() => setFilterMenuIsOpen(false)} />
      ) : null}
    </div>
  )
}

type EnergyPAFiltersShowcaseProps = {
  queryParams: TEnergyPAExecutionWithFiltersInput
  updateQueryParams: (params: Partial<TEnergyPAExecutionWithFiltersInput>) => void
}
function EnergyPAFiltersShowcase({ queryParams, updateQueryParams }: EnergyPAFiltersShowcaseProps) {
  const PERIO_FIELD_MAP = {
    'homologacao.documentacao.dataConclusaoElaboracao': 'DATA DE CONCLUSÃO DA ELABORAÇÃO DA DOCUMENTAÇÃO',
    'homologacao.documentacao.dataAssinatura': 'DATA DE ASSINATURA DA DOCUMENTAÇÃO',
    'homologacao.acesso.dataResposta': 'DATA DE RESPOSTA DO PARECER DE ACESSO',
    'homologacao.vistoria.dataEfetivacao': 'DATA DE EFETIVAÇÃO DA VISTORIA',
    'padrao.aumentoCarga.dataEfetivacao': 'DATA DE SOLICITAÇÃO DO AUMENTO DE CARGA',
  }
  const isAnyFilterApplied =
    queryParams.search ||
    queryParams.segments.length > 0 ||
    queryParams.homologationStatus.length > 0 ||
    queryParams.responsabilityTypes.length > 0 ||
    queryParams.pendingExecutionOnly ||
    queryParams.paidOnly ||
    queryParams.period.field
  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-2 lg:justify-end">
      {isAnyFilterApplied ? <p className="text-primary/80 text-xs font-medium tracking-tight">FILTROS APLICADOS</p> : null}
      {queryParams.search && queryParams.search.length > 0 ? (
        <div className="bg-primary/10 flex items-center gap-1 rounded-lg px-2 py-1 text-[0.65rem]">
          <p className="text-primary/80">
            BUSCA: <strong>{queryParams.search}</strong>
          </p>
          <button
            type="button"
            onClick={() => updateQueryParams({ search: '' })}
            className="text-primary hover:bg-primary/20 rounded-lg bg-transparent p-1"
          >
            <X size={12} />
          </button>
        </div>
      ) : null}
      {queryParams.segments.length > 0 ? (
        <div className="bg-primary/10 flex items-center gap-1 rounded-lg px-2 py-1 text-[0.65rem]">
          <p className="text-primary/80">
            SEGMENTOS: <strong>{queryParams.segments.join(', ')}</strong>
          </p>
          <button
            type="button"
            onClick={() => updateQueryParams({ segments: [] })}
            className="text-primary hover:bg-primary/20 rounded-lg bg-transparent p-1"
          >
            <X size={12} />
          </button>
        </div>
      ) : null}
      {queryParams.homologationStatus.length > 0 ? (
        <div className="bg-primary/10 flex items-center gap-1 rounded-lg px-2 py-1 text-[0.65rem]">
          <p className="text-primary/80">
            STATUS DO PARECER DE ACESSO: <strong>{queryParams.homologationStatus.join(', ')}</strong>
          </p>
        </div>
      ) : null}
      {queryParams.responsabilityTypes.length > 0 ? (
        <div className="bg-primary/10 flex items-center gap-1 rounded-lg px-2 py-1 text-[0.65rem]">
          <p className="text-primary/80">
            RESPONSABILIDADE: <strong>{queryParams.responsabilityTypes.join(', ')}</strong>
          </p>
          <button
            type="button"
            onClick={() => updateQueryParams({ responsabilityTypes: [] })}
            className="text-primary hover:bg-primary/20 rounded-lg bg-transparent p-1"
          >
            <X size={12} />
          </button>
        </div>
      ) : null}
      {queryParams.pendingExecutionOnly ? (
        <div className="bg-primary/10 flex items-center gap-1 rounded-lg px-2 py-1 text-[0.65rem]">
          <p className="text-primary/80">APENAS NÃO EXECUTADOS</p>
          <button
            type="button"
            onClick={() => updateQueryParams({ pendingExecutionOnly: false })}
            className="text-primary hover:bg-primary/20 rounded-lg bg-transparent p-1"
          >
            <X size={12} />
          </button>
        </div>
      ) : null}
      {queryParams.paidOnly ? (
        <div className="bg-primary/10 flex items-center gap-1 rounded-lg px-2 py-1 text-[0.65rem]">
          <p className="text-primary/80">APENAS PAGOS</p>
          <button
            type="button"
            onClick={() => updateQueryParams({ paidOnly: false })}
            className="text-primary hover:bg-primary/20 rounded-lg bg-transparent p-1"
          >
            <X size={12} />
          </button>
        </div>
      ) : null}
      {queryParams.period.field && queryParams.period.after && queryParams.period.before ? (
        <div className="bg-primary/10 flex items-center gap-1 rounded-lg px-2 py-1 text-[0.65rem]">
          <p className="text-primary/80">
            {PERIO_FIELD_MAP[queryParams.period.field]} {formatDateAsLocale(queryParams.period.after)} a{' '}
            {formatDateAsLocale(queryParams.period.before)}
          </p>
          <button
            type="button"
            onClick={() => updateQueryParams({ period: { field: null, after: null, before: null } })}
            className="text-primary hover:bg-primary/20 rounded-lg bg-transparent p-1"
          >
            <X size={12} />
          </button>
        </div>
      ) : null}
    </div>
  )
}

function EnergyPAExecutionStats() {
  const { data: stats, isLoading, isError, isSuccess, queryParams, updateQueryParams } = usePAExecutionStats({})
  return (
    <div className="border-primary/20 flex w-full flex-col gap-2 rounded-xl border p-3 shadow-xs">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <ChartArea className="h-4 min-h-4 w-4 min-w-4" />
          <h1 className="text-xs font-medium tracking-tight uppercase">ESTATÍSTICAS</h1>
        </div>
        <DateIntervalInput
          label="Período"
          labelClassName="text-xs font-medium leading-none tracking-tight"
          className="h-fit border-none p-0 px-2 py-0.5 shadow-none"
          value={{
            after: queryParams.after ? new Date(queryParams.after) : undefined,
            before: queryParams.before ? new Date(queryParams.before) : undefined,
          }}
          handleChange={(v) =>
            updateQueryParams({
              after: v.after ? v.after.toISOString() : undefined,
              before: v.before ? v.before.toISOString() : undefined,
            })
          }
        />
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-3 lg:flex-row">
        <div className="bg-background border-primary/20 flex min-h-[130px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/3">
          <div className="flex items-center justify-between">
            <h1 className="text-xs font-medium tracking-tight uppercase">TOTAL DE ADEQUAÇÕES DE PADRÃO</h1>
            <LayoutGrid className="h-4 min-h-4 w-4 min-w-4" />
          </div>
          <div className="flex w-full flex-col">
            <div className="text-2xl font-bold text-[#15599a]">{stats?.totalAdequacoes}</div>
          </div>
        </div>
        <div className="bg-background border-primary/20 flex min-h-[130px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/3">
          <div className="flex items-center justify-between">
            <h1 className="text-xs font-medium tracking-tight uppercase">ADEQUAÇÕES DE PADRÃO CONCLUÍDAS</h1>
            <CircleCheck className="h-4 min-h-4 w-4 min-w-4" />
          </div>
          <div className="flex w-full flex-col">
            <div className="text-2xl font-bold text-[#15599a]">{stats?.adequacoesConcluidas}</div>
          </div>
        </div>
        <div className="bg-background border-primary/20 flex min-h-[130px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/3">
          <div className="flex items-center justify-between">
            <h1 className="text-xs font-medium tracking-tight uppercase">ADEQUAÇÕES DE PADRÃO PENDENTES</h1>
            <LayoutGrid className="h-4 min-h-4 w-4 min-w-4" />
          </div>
          <div className="flex w-full flex-col">
            <div className="text-2xl font-bold text-[#15599a]">{stats?.totalAdequacoesPendentes}</div>
            <p className="text-primary/60 text-xs">{stats?.totalAdequacoesPendentesPagas} pagos</p>
          </div>
        </div>
      </div>
      <div className="bg-background border-primary/20 flex w-full flex-col gap-1 rounded-xl border p-3 shadow-xs">
        <h1 className="text-xs font-medium tracking-tight uppercase">POR RESPONSABILIDADE</h1>
        <div className="flex w-full flex-wrap justify-start gap-2">
          {stats?.porResponsabilidade.map((responsability) => (
            <div key={responsability.tipo} className="bg-background border-primary/20 flex items-center gap-2 rounded-xl border p-3 shadow-xs">
              <h1 className="text-xs font-medium tracking-tight uppercase">{responsability.tipo}</h1>
              <div className="text-primary/60 text-xs">{responsability.totalAdequacoesPendentes} pendentes</div>
              <div className="text-primary/60 text-xs">{responsability.totalAdequacoesPendentesPagas} pagos</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
