import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import Select from 'react-select'
import PadraoCard from '../../components/PadraoCard'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import LoadingPage from '../../components/utils/LoadingPage'
import { usePAExecutionProjects } from '@/utils/methods/query/execution'
import UnauthorizedPage from '@/components/utils/UnauthorizedPage'
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'
import PAAdequationsFilterMenu from '@/components/identificador/controlePadroes/FilterMenu'
import ErrorComponent from '@/components/utils/ErrorComponent'
import PAAdequationProjectCard from '@/components/identificador/controlePadroes/PAAdequationProjectCard'
import { VscDiffAdded } from 'react-icons/vsc'
import { TEnergyPAExecution } from '../api/gestao-obras/padroes'
import { FaTools } from 'react-icons/fa'

function EnergyPAControls() {
  const router = useRouter()
  const { data: session, status } = useSession({ required: true })
  const isAuthorized = session?.user.permissoes.rotas.includes('Obras')
  const { data: projects, isLoading, isError, isSuccess, filters, setFilters } = usePAExecutionProjects()
  const [filterMenuIsOpen, setFilterMenuIsOpen] = useState<boolean>(false)

  function getStats(info: TEnergyPAExecution[]) {
    const pending = info.reduce((acc, current) => (!current.padrao.aumentoCarga.dataEfetivacao ? acc + 1 : acc), 0)
    const pendingPaid = info.reduce(
      (acc, current) => (!current.padrao.aumentoCarga.dataEfetivacao && !!current.compra.dataPagamento ? acc + 1 : acc),
      0
    )
    return {
      projetos: info.length,
      pendentes: pending,
      pendentesPagos: pendingPaid,
    }
  }
  if (status != 'authenticated') return <LoadingPage />
  if (!isAuthorized) return <UnauthorizedPage />
  return (
    <div className="grow p-6">
      <div className="flex flex-col items-center justify-between gap-2 border-b border-gray-200 p-1">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col items-center gap-2 lg:flex-row">
            <p className="text-center text-2xl font-black uppercase text-[#15599a]">PROJETOS COM ADEQUAÇÃO DE PADRÃO</p>
          </div>
          {filterMenuIsOpen ? (
            <div className="cursor-pointer text-gray-600 hover:text-blue-400">
              <IoMdArrowDropupCircle style={{ fontSize: '25px' }} onClick={() => setFilterMenuIsOpen(false)} />
            </div>
          ) : (
            <div className="cursor-pointer text-gray-600 hover:text-blue-400">
              <IoMdArrowDropdownCircle style={{ fontSize: '25px' }} onClick={() => setFilterMenuIsOpen(true)} />
            </div>
          )}
        </div>
        <div className="my-2 flex w-full flex-col items-center justify-center gap-3 lg:flex-row">
          <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-3 shadow-sm lg:w-1/3">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium uppercase tracking-tight">PROJETOS COM ADEQUAÇÃO</h1>
              <VscDiffAdded />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">{getStats(projects || []).projetos}</div>
            </div>
          </div>
          <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-3 shadow-sm lg:w-1/3">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium uppercase tracking-tight">PENDENTES</h1>
              <FaTools />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">{getStats(projects || []).pendentes}</div>
              <p className="text-xs text-gray-500">{getStats(projects || []).pendentesPagos} pagos</p>
            </div>
          </div>
        </div>
        <PAAdequationsFilterMenu filterMenuIsOpen={filterMenuIsOpen} filters={filters} setFilters={setFilters} />
      </div>
      <div className="flex w-full flex-col gap-2 py-2">
        {isLoading ? <LoadingPage /> : null}
        {isError ? <ErrorComponent msg={'Erro ao encontrar projetos para adequação de padrão.'} /> : null}
        {isSuccess ? (
          projects.length > 0 ? (
            projects.map((project) => <PAAdequationProjectCard key={project._id} project={project} />)
          ) : (
            <p className="w-full text-center font-medium text-gray-500">Nenhum projeto foi encontrado...</p>
          )
        ) : null}
      </div>
    </div>
  )
  // return (
  //   <div className="grow p-6">
  //     <div className="mb-2 flex w-full flex-col items-center border-b border-gray-200">
  //       <h1 className="pb-2 text-xl font-bold text-[#fead61]">CONTROLE DE PADRÕES ({filteredProjects.length})</h1>
  //       <div className="flex w-full flex-wrap items-center justify-center gap-x-2">
  //         <input
  //           type={'text'}
  //           placeholder="Digite o nome do contrato"
  //           value={filters.searchFilter}
  //           className={'rounded border border-gray-200 p-1.5 outline-none placeholder:italic'}
  //           onChange={(e) => setFilters({ ...filters, searchFilter: e.target.value })}
  //         />
  //         <div
  //           onClick={() => setFilters({ ...filters, pendencia: !filters.pendencia })}
  //           className={`${
  //             filters.pendencia ? 'bg-[#15599a]' : 'bg-blue-300'
  //           } flex h-[36px] cursor-pointer items-center justify-center rounded px-2 font-bold text-white`}
  //         >
  //           PENDÊNCIAS
  //         </div>
  //         <Select
  //           isMulti
  //           placeholder="SEGMENTO"
  //           onChange={(e) =>
  //             setFilters({
  //               ...filters,
  //               segmentoFilter: e.map((x) => x.value),
  //             })
  //           }
  //           options={[
  //             {
  //               value: 'COMERCIAL',
  //               label: 'COMERCIAL',
  //             },
  //             {
  //               value: 'INDUSTRIAL',
  //               label: 'INDUSTRIAL',
  //             },
  //             {
  //               value: 'RESIDENCIAL',
  //               label: 'RESIDENCIAL',
  //             },
  //             {
  //               value: 'RURAL',
  //               label: 'RURAL',
  //             },
  //             {
  //               value: undefined,
  //               label: 'NÃO DEFINIDO',
  //             },
  //           ]}
  //         />
  //         <Select
  //           isMulti
  //           placeholder="A.C STATUS"
  //           onChange={(e) =>
  //             setFilters({
  //               ...filters,
  //               acStatusFilter: e.map((x) => x.value),
  //             })
  //           }
  //           options={[
  //             {
  //               value: 'PENDÊNCIA',
  //               label: 'PENDÊNCIA',
  //             },
  //             {
  //               value: 'REALIZADO',
  //               label: 'REALIZADO',
  //             },
  //             {
  //               value: 'N/A',
  //               label: 'N/A',
  //             },
  //             {
  //               value: 'SOLICITADO COM G.D',
  //               label: 'SOLICITADO COM G.D',
  //             },
  //             {
  //               value: undefined,
  //               label: 'NÃO DEFINIDO',
  //             },
  //           ]}
  //         />
  //         <Select
  //           isMulti
  //           placeholder="STATUS DO PARECER"
  //           onChange={(e) =>
  //             setFilters({
  //               ...filters,
  //               parecerFilter: e.map((x) => x.value),
  //             })
  //           }
  //           options={[
  //             {
  //               label: 'AGUARDANDO ASSINATURA',
  //               value: 'AGUARDANDO ASSINATURA',
  //             },
  //             {
  //               label: 'AGUARDANDO AUMENTO DE CARGA',
  //               value: 'AGUARDANDO AUMENTO DE CARGA',
  //             },
  //             {
  //               label: 'INICIAR PROJETO',
  //               value: 'INICIAR PROJETO',
  //             },
  //             {
  //               label: 'SOLICITAR TROCA DE TITULARIDADE',
  //               value: 'SOLICITAR TROCA DE TITULARIDADE',
  //             },
  //             {
  //               label: 'AGUARDANDO FATURAMENTO ART',
  //               value: 'AGUARDANDO FATURAMENTO ART',
  //             },
  //             {
  //               label: 'AGUARDANDO FORMULÁRIOS',
  //               value: 'AGUARDANDO FORMULÁRIOS',
  //             },
  //             {
  //               label: 'AGUARDANDO RESPOSTA DA CONCESSIONARIA',
  //               value: 'AGUARDANDO RESPOSTA DA CONCESSIONARIA',
  //             },
  //             {
  //               label: 'AGUARDANDO TROCA DE TITULARIDADE',
  //               value: 'AGUARDANDO TROCA DE TITULARIDADE',
  //             },
  //             {
  //               label: 'AUMENTO DE CARGA',
  //               value: 'AUMENTO DE CARGA',
  //             },
  //             {
  //               label: 'CANCELADO',
  //               value: 'CANCELADO',
  //             },
  //             {
  //               label: 'PARECER DE ACESSO APROVADO',
  //               value: 'PARECER DE ACESSO APROVADO',
  //             },
  //             {
  //               label: 'PENDENCIAS',
  //               value: 'PENDENCIAS',
  //             },
  //             {
  //               label: 'SOLICITAR ACESSO',
  //               value: 'SOLICITAR ACESSO',
  //             },
  //             {
  //               label: 'SOLICITAR AUMENTO DE CARGA',
  //               value: 'SOLICITAR AUMENTO DE CARGA',
  //             },
  //             {
  //               label: 'PARECER DE ACESSO COM OBRAS',
  //               value: 'PARECER DE ACESSO COM OBRAS',
  //             },
  //             {
  //               label: 'NÃO DEFINIDO',
  //               value: 'NÃO DEFINIDO',
  //             },
  //           ]}
  //         />
  //         <button
  //           onClick={ordenate}
  //           className="flex h-[36px] items-center gap-x-2 rounded bg-[#fead61] py-2 px-2 font-bold hover:bg-[#15599a] hover:text-white"
  //         >
  //           <p>ORDENAR</p>
  //         </button>
  //         <button
  //           onClick={filterProjects}
  //           className="flex h-[36px] items-center gap-x-2 rounded bg-[#fead61] py-2 px-2 font-bold hover:bg-[#15599a] hover:text-white"
  //         >
  //           <p>Filtrar</p>
  //           <AiOutlineSearch />
  //         </button>
  //       </div>
  //     </div>
  //     <div className="flex flex-col gap-y-2">
  //       {filteredProjects.map((project) => (
  //         <PadraoCard project={project} key={project._id} />
  //       ))}
  //     </div>
  //   </div>
  // )
}

export default EnergyPAControls
