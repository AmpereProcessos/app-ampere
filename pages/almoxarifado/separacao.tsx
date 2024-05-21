import axios from 'axios'
import React, { useState, useEffect } from 'react'
import LoadingPage from '../../components/utils/LoadingPage'
import { useSession } from 'next-auth/react'
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'
import { useRouter } from 'next/router'
import { useWarehouseProjects } from '@/utils/methods/query/warehouse'
import ErrorComponent from '@/components/utils/ErrorComponent'
import FilterMenu from '@/components/identificador/almoxarifado/separacao/FilterMenu'
import SeparationProjectCard from '@/components/identificador/almoxarifado/separacao/SeparationProjectCard'
function PendingMaterialSeparation() {
  const { data: session, status } = useSession({ required: true })
  const router = useRouter()
  const [dropdownMenuVisible, setDropdownMenuVisible] = useState<boolean>(false)
  const { data: projects, isLoading, isError, isSuccess, filters, setFilters } = useWarehouseProjects()

  // function filterProjects() {
  //   var newArr
  //   if (filters.cidadeFilter.length > 0) {
  //     if (!newArr) newArr = projects
  //     newArr = newArr.filter((project) => filters.cidadeFilter.includes(project.cidade))
  //   }
  //   if (filters.equipeFilter.length > 0) {
  //     if (!newArr) newArr = projects
  //     newArr = newArr.filter((project) => filters.equipeFilter.includes(project.obra.equipeResp))
  //   }
  //   if (filters.statusDaObraFilter.length > 0) {
  //     if (!newArr) newArr = projects
  //     newArr = newArr.filter((project) => filters.statusDaObraFilter.includes(project.obra.statusDaObra))
  //   }
  //   if (filters.entregaStatusFilter.length > 0) {
  //     if (!newArr) newArr = projects
  //     newArr = newArr.filter((project) => filters.entregaStatusFilter.includes(project.compra.statusEntrega))
  //   }
  //   if (filters.qtdeModulosFilter && filters.qtdeModulosFilter != 0) {
  //     if (!newArr) newArr = projects
  //     newArr = newArr.filter((project) => Number(project.sistema.qtdeModulos) == Number(filters.qtdeModulosFilter))
  //   }
  //   if (filters.topologiaFilter.length > 0) {
  //     if (!newArr) newArr = projects
  //     newArr = newArr.filter((project) => filters.topologiaFilter.includes(project.sistema.topologia))
  //   }
  //   if (!newArr) setFilteredProjects(projects)
  //   else {
  //     setFilteredProjects(newArr)
  //   }
  // }
  useEffect(() => {
    if (session) {
      const userRoutes = session?.user.permissoes.rotas
      if (!userRoutes.includes('Obras') && !userRoutes.includes('Almoxarifado')) {
        router.push('/')
      }
    }
  }, [session])

  if (status != 'authenticated') return <LoadingPage />
  return (
    <div className="grow p-6">
      <div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col items-start ">
            <p className="text-center text-2xl font-black uppercase text-[#15599a]">PROJETOS PARA SEPARAÇÃO</p>
            <p className="italic tracking-tight text-gray-500">{projects != null ? `${projects.length} projetos para separação...` : null}</p>
          </div>
          <div className="flex items-center gap-2">
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
        </div>
        {dropdownMenuVisible ? <FilterMenu setFilters={setFilters} filters={filters} /> : null}
      </div>
      <div className="mt-4 flex flex-wrap justify-around gap-3">
        {isLoading ? <LoadingPage /> : null}
        {isError ? <ErrorComponent msg={'Erro ao buscar projetos para separação.'} /> : null}
        {isSuccess ? (
          projects.length > 0 ? (
            projects.map((project) => <SeparationProjectCard key={project._id} project={project} />)
          ) : (
            <p className="w-full text-center text-lg font-medium italic text-gray-500">Nenhum projeto encontrado.</p>
          )
        ) : null}
      </div>
    </div>
  )
  // if (status == 'authenticated') {
  //   return (
  //     <div className="flex grow flex-col p-6">
  //       <div className="flex flex-col items-center">
  //         <h1 className="text-xl font-bold text-[#15599a]">PROJETOS PARA SEPARAÇÃO ({filteredProjects?.length})</h1>
  //         <div className="flex flex-wrap justify-center gap-2">
  //           <Select
  //             placeholder="CIDADE"
  //             isMulti={true}
  //             options={cidadesAtendidas.map((cidade) => {
  //               return {
  //                 label: cidade,
  //                 value: cidade,
  //               }
  //             })}
  //             onChange={(e) =>
  //               setFilters({
  //                 ...filters,
  //                 cidadeFilter: e.map((x) => x.value),
  //               })
  //             }
  //           />
  //           <Select
  //             isMulti
  //             placeholder="STATUS DA ENTREGA"
  //             onChange={(e) =>
  //               setFilters({
  //                 ...filters,
  //                 entregaStatusFilter: e.map((x) => x.value),
  //               })
  //             }
  //             options={[
  //               { value: 'EM ROTA', label: 'EM ROTA' },
  //               { value: 'AGUARDANDO COMPRA', label: 'AGUARDANDO COMPRA' },
  //               { value: 'ENTREGUE', label: 'ENTREGUE' },
  //               { value: undefined, label: 'NÃO DEFINIDO' },
  //             ]}
  //           />
  //           <Select
  //             placeholder="EQUIPE RESP."
  //             isMulti={true}
  //             options={equipesTecnicas.map((equipe) => equipe)}
  //             onChange={(e) =>
  //               setFilters({
  //                 ...filters,
  //                 equipeFilter: e.map((x) => x.value),
  //               })
  //             }
  //           />
  //           <Select
  //             placeholder="STATUS DA OBRA"
  //             isMulti={true}
  //             options={[
  //               {
  //                 label: 'AGENDADA',
  //                 value: 'AGENDADA',
  //               },
  //               {
  //                 label: 'AGUARDANDO AGENDAMENTO',
  //                 value: 'AGUARDANDO AGENDAMENTO',
  //               },
  //               {
  //                 label: 'CONCLUIDA',
  //                 value: 'CONCLUIDA',
  //               },
  //               {
  //                 label: 'EM ANDAMENTO',
  //                 value: 'EM ANDAMENTO',
  //               },
  //               {
  //                 label: 'OBRA CANCELADA',
  //                 value: 'OBRA CANCELADA',
  //               },
  //               {
  //                 label: 'CASA EM CONSTRUÇÃO',
  //                 value: 'CASA EM CONSTRUÇÃO',
  //               },
  //               {
  //                 label: 'NÃO DEFINIDO',
  //                 value: 'NÃO DEFINIDO',
  //               },
  //             ]}
  //             onChange={(e) =>
  //               setFilters({
  //                 ...filters,
  //                 statusDaObraFilter: e.map((x) => x.value),
  //               })
  //             }
  //           />
  //           <Select
  //             placeholder="TOPOLOGIA"
  //             isMulti={true}
  //             options={[
  //               { label: 'INVERSOR', value: 'INVERSOR' },
  //               { label: 'MICRO-INVERSOR', value: 'MICRO-INVERSOR' },
  //               { label: 'OUTROS SERV.', value: 'OUTROS SERV.' },
  //               { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
  //             ]}
  //             onChange={(e) =>
  //               setFilters({
  //                 ...filters,
  //                 topologiaFilter: e.map((x) => x.value),
  //               })
  //             }
  //           />
  //           <input
  //             type="number"
  //             className="h-[36px] w-[100px] border border-gray-200 p-2 text-center text-xs outline-none"
  //             placeholder="NºMódulos"
  //             onChange={(e) =>
  //               setFilters({
  //                 ...filters,
  //                 qtdeModulosFilter: Number(e.target.value),
  //               })
  //             }
  //           />
  //           <button
  //             onClick={filterProjects}
  //             className="flex h-[36px] items-center gap-x-2 rounded bg-[#fead61] py-2 px-2 font-bold hover:bg-[#15599a] hover:text-white"
  //           >
  //             <p>Filtrar</p>
  //             <AiOutlineSearch />
  //           </button>
  //         </div>
  //       </div>
  //       <div className="mt-4 flex flex-col flex-wrap gap-3">
  //         {filteredProjects.map((project) => (
  //           <SeparacaoCard key={project._id} info={project} editor={session?.user?.permissoes.rotas.includes('Almoxarifado')} />
  //         ))}
  //       </div>
  //     </div>
  //   )
  // }
}

export default PendingMaterialSeparation
