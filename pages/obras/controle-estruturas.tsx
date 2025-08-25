import StructuresAdequationsFilterMenu from '@/components/identificador/controleEstruturas/FilterMenu'
import InstallationStrucutreProjectCard from '@/components/identificador/controleEstruturas/InstallationStrucutreProjectCard'
import ErrorComponent from '@/components/utils/ErrorComponent'
import LoadingPage from '@/components/utils/LoadingPage'
import UnauthorizedPage from '@/components/utils/UnauthorizedPage'
import { useInstallationStructureExecutionProjects } from '@/utils/methods/query/execution'
import { useSession } from '@/components/providers/SessionProvider'
import React, { useState } from 'react'
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'
import { TInstallationStructureExecution } from '../api/gestao-obras/estruturas'
import { VscDiffAdded } from 'react-icons/vsc'
import { FaTools } from 'react-icons/fa'

function InstallationStructureControls() {
  const { session, status } = useSession({ required: true })
  const isAuthorized = session?.user.permissoes.rotas.includes('Obras')
  const [filterMenuIsOpen, setFilterMenuIsOpen] = useState<boolean>(false)

  const { data: projects, isLoading, isError, isSuccess, filters, setFilters } = useInstallationStructureExecutionProjects()

  function getStats(info: TInstallationStructureExecution[]) {
    const pending = info.reduce(
      (acc, current) => (!current.estruturaPersonalizada.dataMontagem && current.estruturaPersonalizada.status != 'PRONTA' ? acc + 1 : acc),
      0
    )
    const pendingPaid = info.reduce(
      (acc, current) =>
        !current.estruturaPersonalizada.dataMontagem && current.estruturaPersonalizada.status != 'PRONTA' && !!current.compra.dataPagamento
          ? acc + 1
          : acc,
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
    <div className="h-full grow bg-slate-50 p-6">
      <div className="border-primary/20 flex flex-col items-center justify-between gap-2 border-b p-1">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col items-center gap-2 lg:flex-row">
            <p className="text-center text-2xl font-black text-[#15599a] uppercase">PROJETOS COM ADEQUAÇÃO DE ESTRUTURA</p>
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
        <div className="my-2 flex w-full flex-col items-center justify-center gap-3 lg:flex-row">
          <div className="bg-background border-primary/20 flex min-h-[110px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/3">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium tracking-tight uppercase">PROJETOS COM ADEQUAÇÃO</h1>
              <VscDiffAdded />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">{getStats(projects || []).projetos}</div>
            </div>
          </div>
          <div className="bg-background border-primary/20 flex min-h-[110px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/3">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium tracking-tight uppercase">PENDENTES</h1>
              <FaTools />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">{getStats(projects || []).pendentes}</div>
              <p className="text-primary/60 text-xs">{getStats(projects || []).pendentesPagos} pagos</p>
            </div>
          </div>
        </div>
        <StructuresAdequationsFilterMenu filterMenuIsOpen={filterMenuIsOpen} filters={filters} setFilters={setFilters} />
      </div>
      <div className="flex w-full flex-wrap justify-around gap-2 py-2">
        {isLoading ? <LoadingPage /> : null}
        {isError ? <ErrorComponent msg="Oops, houve um erro ao encontrar projetos para adequação de estrutura." /> : null}
        {isSuccess ? (
          projects.length > 0 ? (
            projects.map((project) => <InstallationStrucutreProjectCard key={project._id} project={project} />)
          ) : (
            <p className="text-primary/60 w-full text-center font-medium">Nenhum projeto foi encontrado...</p>
          )
        ) : null}
      </div>
    </div>
  )
}

export default InstallationStructureControls
