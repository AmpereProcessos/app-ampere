import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import Select from 'react-select'
import PadraoCard from '../../components/PadraoCard'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import LoadingPage from '../../components/utils/LoadingPage'

function EnergyPAControls() {
  const router = useRouter()
  const { data: session, status } = useSession({ required: true })

  const [projects, setProjects] = useState([])
  const [filteredProjects, setFilteredProjects] = useState([])
  const [filters, setFilters] = useState({
    searchFilter: '',
    acStatusFilter: [],
    liberacaoStatus: [],
    segmentoFilter: [],
    parecerFilter: [],
    pendencia: false,
  })
  function getProjects() {
    axios.get('/api/gestao-obras/padroes').then((res) => {
      setFilteredProjects(res.data)
      setProjects(res.data)
    })
  }
  function filterProjects() {
    var newArr
    if (filters.acStatusFilter.length > 0) {
      if (!newArr) newArr = projects
      newArr = newArr.filter((call) => filters.acStatusFilter.includes(call.projeto.acStatus))
    }
    if (filters.liberacaoStatus.length > 0) {
      if (!newArr) newArr = projects
      newArr = newArr.filter((call) => filters.liberacaoStatus.includes(call.compra.statusLiberacao))
    }
    if (filters.segmentoFilter.length > 0) {
      if (!newArr) newArr = projects
      newArr = newArr.filter((call) => filters.segmentoFilter.includes(call.segmento))
    }
    if (filters.parecerFilter.length > 0) {
      if (!newArr) newArr = projects
      newArr = projects.filter((project) => filters.parecerFilter.includes(project.homologacao.status))
    }
    if (filters.searchFilter.trim().length > 0) {
      if (!newArr) newArr = projects
      newArr = projects.filter((call) => call.nomeDoContrato.toUpperCase().includes(filters.searchFilter.toUpperCase()))
    }
    if (filters.pendencia) {
      if (!newArr) newArr = projects
      newArr = newArr.filter((call) => !call.padrao.aumentoCarga.dataEfetivacao && !!call.compra.dataPedido)
    }
    if (!newArr) setFilteredProjects(projects)
    else {
      setFilteredProjects(newArr)
    }
  }
  function ordenate() {
    let arr = filteredProjects.sort(
      (a, b) => new Date(a.homologacao.documentacao.dataAssinatura).getTime() - new Date(b.homologacao.documentacao.dataAssinatura).getTime()
    )
    setFilteredProjects([...arr])
  }
  useEffect(() => {
    if (session?.user.permissoes.rotas.includes('Obras')) {
      getProjects()
    } else {
      if (session?.user) {
        router.push('/')
      }
    }
  }, [session])
  if (status != 'authenticated') return <LoadingPage />
  return (
    <div className="grow bg-[#fff] p-6">
      <div className="mb-2 flex w-full flex-col items-center border-b border-gray-200">
        <h1 className="pb-2 text-xl font-bold text-[#fead61]">CONTROLE DE PADRÕES ({filteredProjects.length})</h1>
        <div className="flex w-full flex-wrap items-center justify-center gap-x-2">
          <input
            type={'text'}
            placeholder="Digite o nome do contrato"
            value={filters.searchFilter}
            className={'rounded border border-gray-200 p-1.5 outline-none placeholder:italic'}
            onChange={(e) => setFilters({ ...filters, searchFilter: e.target.value })}
          />
          <div
            onClick={() => setFilters({ ...filters, pendencia: !filters.pendencia })}
            className={`${
              filters.pendencia ? 'bg-[#15599a]' : 'bg-blue-300'
            } flex h-[36px] cursor-pointer items-center justify-center rounded px-2 font-bold text-white`}
          >
            PENDÊNCIAS
          </div>
          <Select
            isMulti
            placeholder="SEGMENTO"
            onChange={(e) =>
              setFilters({
                ...filters,
                segmentoFilter: e.map((x) => x.value),
              })
            }
            options={[
              {
                value: 'COMERCIAL',
                label: 'COMERCIAL',
              },
              {
                value: 'INDUSTRIAL',
                label: 'INDUSTRIAL',
              },
              {
                value: 'RESIDENCIAL',
                label: 'RESIDENCIAL',
              },
              {
                value: 'RURAL',
                label: 'RURAL',
              },
              {
                value: undefined,
                label: 'NÃO DEFINIDO',
              },
            ]}
          />
          <Select
            isMulti
            placeholder="A.C STATUS"
            onChange={(e) =>
              setFilters({
                ...filters,
                acStatusFilter: e.map((x) => x.value),
              })
            }
            options={[
              {
                value: 'PENDÊNCIA',
                label: 'PENDÊNCIA',
              },
              {
                value: 'REALIZADO',
                label: 'REALIZADO',
              },
              {
                value: 'N/A',
                label: 'N/A',
              },
              {
                value: 'SOLICITADO COM G.D',
                label: 'SOLICITADO COM G.D',
              },
              {
                value: undefined,
                label: 'NÃO DEFINIDO',
              },
            ]}
          />
          <Select
            isMulti
            placeholder="STATUS DO PARECER"
            onChange={(e) =>
              setFilters({
                ...filters,
                parecerFilter: e.map((x) => x.value),
              })
            }
            options={[
              {
                label: 'AGUARDANDO ASSINATURA',
                value: 'AGUARDANDO ASSINATURA',
              },
              {
                label: 'AGUARDANDO AUMENTO DE CARGA',
                value: 'AGUARDANDO AUMENTO DE CARGA',
              },
              {
                label: 'INICIAR PROJETO',
                value: 'INICIAR PROJETO',
              },
              {
                label: 'SOLICITAR TROCA DE TITULARIDADE',
                value: 'SOLICITAR TROCA DE TITULARIDADE',
              },
              {
                label: 'AGUARDANDO FATURAMENTO ART',
                value: 'AGUARDANDO FATURAMENTO ART',
              },
              {
                label: 'AGUARDANDO FORMULÁRIOS',
                value: 'AGUARDANDO FORMULÁRIOS',
              },
              {
                label: 'AGUARDANDO RESPOSTA DA CONCESSIONARIA',
                value: 'AGUARDANDO RESPOSTA DA CONCESSIONARIA',
              },
              {
                label: 'AGUARDANDO TROCA DE TITULARIDADE',
                value: 'AGUARDANDO TROCA DE TITULARIDADE',
              },
              {
                label: 'AUMENTO DE CARGA',
                value: 'AUMENTO DE CARGA',
              },
              {
                label: 'CANCELADO',
                value: 'CANCELADO',
              },
              {
                label: 'PARECER DE ACESSO APROVADO',
                value: 'PARECER DE ACESSO APROVADO',
              },
              {
                label: 'PENDENCIAS',
                value: 'PENDENCIAS',
              },
              {
                label: 'SOLICITAR ACESSO',
                value: 'SOLICITAR ACESSO',
              },
              {
                label: 'SOLICITAR AUMENTO DE CARGA',
                value: 'SOLICITAR AUMENTO DE CARGA',
              },
              {
                label: 'PARECER DE ACESSO COM OBRAS',
                value: 'PARECER DE ACESSO COM OBRAS',
              },
              {
                label: 'NÃO DEFINIDO',
                value: 'NÃO DEFINIDO',
              },
            ]}
          />
          <button
            onClick={ordenate}
            className="flex h-[36px] items-center gap-x-2 rounded bg-[#fead61] py-2 px-2 font-bold hover:bg-[#15599a] hover:text-white"
          >
            <p>ORDENAR</p>
          </button>
          <button
            onClick={filterProjects}
            className="flex h-[36px] items-center gap-x-2 rounded bg-[#fead61] py-2 px-2 font-bold hover:bg-[#15599a] hover:text-white"
          >
            <p>Filtrar</p>
            <AiOutlineSearch />
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-y-2">
        {filteredProjects.map((project) => (
          <PadraoCard project={project} key={project._id} />
        ))}
      </div>
    </div>
  )
}

export default EnergyPAControls
