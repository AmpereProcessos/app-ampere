import axios from 'axios'
import React, { useEffect, useState } from 'react'
import ComissionamentoCard from '../../components/ComissionamentoCard'
import { useRouter } from 'next/router'
import { useSession } from '../../components/providers/SessionProvider'
import LoadingPage from '../../components/utils/LoadingPage'
import UnauthenticatedComponent from '@/components/utils/UnauthenticatedComponent'
import UnauthorizedPage from '@/components/utils/UnauthorizedPage'
import type { TAuthSession } from '@/lib/authentication/types'
function Comissionamento() {
  const router = useRouter()
  const { session, status } = useSession()
  const isAuthorized = session?.user.permissoes.rotas.includes('Projetos')
  if (status === 'loading') return <LoadingPage />
  if (status === 'unauthenticated') return <UnauthenticatedComponent />
  if (!isAuthorized) return <UnauthorizedPage />
  return <ComissionamentoContent session={session} />
}

export default Comissionamento

function ComissionamentoContent({ session }: { session: TAuthSession }) {
  const [projects, setProjects] = useState([])
  const [filteredProjects, setFilteredProjects] = useState([])
  const [searchFilter, setSearchFilter] = useState()
  const [filters, setFilters] = useState({
    pendenciaComercial: false,
    pendenciaSuprimentos: false,
    pendenciaProjetos: false,
  })
  function getProjects() {
    axios.get('/api/projects/comissionamento').then((res) => {
      console.log(res.data)
      setProjects(res.data)
      setFilteredProjects(res.data)
    })
  }
  function filterPendenciaComercial(value) {
    setFilters({ pendenciaComercial: value })
    var newArr
    if (value) {
      newArr = projects.filter((obj) => !obj.comissionamento?.comercial)
      console.log('comercial', newArr)
    }
    if (!newArr) setFilteredProjects(projects)
    else {
      setFilteredProjects(newArr)
    }
  }
  function filterPendenciaSuprimentos(value) {
    setFilters({ pendenciaSuprimentos: value })
    var newArr
    if (value) {
      newArr = projects.filter((obj) => obj.comissionamento?.comercial && !obj.comissionamento?.suprimentos)
      console.log('comercial', newArr)
    }
    if (!newArr) setFilteredProjects(projects)
    else {
      setFilteredProjects(newArr)
    }
  }

  function filterPendenciaProjetos(value) {
    setFilters({ pendenciaProjetos: value })
    var newArr
    if (value) {
      newArr = projects.filter((obj) => obj.comissionamento?.comercial && obj.comissionamento?.suprimentos)
      console.log('comercial', newArr)
    }
    if (!newArr) {
      setFilteredProjects(projects)
    } else {
      setFilteredProjects(newArr)
    }
  }
  function handleSearchFilter(value) {
    setSearchFilter(value)
    if (value !== '' && value !== ' ') {
      let newArr = projects.filter((call) => call.nomeDoContrato.toUpperCase().includes(value.toUpperCase()))
      setFilteredProjects(newArr)
    } else {
      setFilteredProjects(projects)
    }
  }

  return (
    <div className="grow p-6">
      <div className="border-primary/20 flex flex-col items-center justify-between border-b p-1">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-wrap items-center justify-center gap-2 font-['Roboto']">
            <p className="text-2xl font-bold text-[#15599a] uppercase">Comissionamento</p>
            {filteredProjects && <p className="font-bold text-[#fead61]">({filteredProjects.length})</p>}
          </div>
        </div>
        <div className="mt-4 flex w-full flex-col gap-y-2">
          <div className="flex flex-col flex-wrap items-center justify-center gap-2 lg:flex-row">
            <input
              type={'text'}
              className="border-primary/20 w-full rounded border p-1.5 outline-hidden placeholder:italic lg:w-[350px]"
              placeholder="DIGITE O NOME DO CONTRATO"
              value={searchFilter}
              onChange={(e) => handleSearchFilter(e.target.value)}
            />
            <div
              onClick={() => filterPendenciaComercial(!filters.pendenciaComercial)}
              className={`${filters.pendenciaComercial ? 'bg-[#15599a]' : 'bg-blue-300'} flex h-[36px] cursor-pointer items-center justify-center rounded px-2 font-bold text-white`}
            >
              PENDENCIA COMERCIAL
            </div>
            <div
              onClick={() => filterPendenciaSuprimentos(!filters.pendenciaSuprimentos)}
              className={`${filters.pendenciaSuprimentos ? 'bg-[#15599a]' : 'bg-blue-300'} flex h-[36px] cursor-pointer items-center justify-center rounded px-2 font-bold text-white`}
            >
              PENDENCIA SUPRIMENTOS
            </div>
            <div
              onClick={() => filterPendenciaProjetos(!filters.pendenciaProjetos)}
              className={`${filters.pendenciaProjetos ? 'bg-[#15599a]' : 'bg-blue-300'} flex h-[36px] cursor-pointer items-center justify-center rounded px-2 font-bold text-white`}
            >
              PENDENCIA PROJETOS
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 grid w-full grid-cols-1 gap-3 lg:grid-cols-2">
        {filteredProjects.map((project) => (
          <ComissionamentoCard getProjects={getProjects} key={project._id} info={project} />
        ))}
      </div>
    </div>
  )
}
