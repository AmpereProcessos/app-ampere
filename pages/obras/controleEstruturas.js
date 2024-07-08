import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { AiOutlineSearch } from 'react-icons/ai'
import Select from 'react-select'
import EstruturaCard from '../../components/EstruturaCard'
import { useSession } from 'next-auth/react'
import LoadingPage from '../../components/utils/LoadingPage'
function ControleEstruturas() {
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/signin')
    },
  })

  const [projects, setProjects] = useState([])
  const [filteredProjects, setFilteredProjects] = useState([])
  const [filters, setFilters] = useState({
    searchFilter: '',
    estruturaPersFilter: [],
    entregaEstruturaFilter: [],
    liberacaoStatus: [],
    segmentoFilter: [],
    pendencia: false,
  })
  function getProjects() {
    axios.get('/api/gestao-obras/estruturas').then((res) => {
      setFilteredProjects(res.data)
      setProjects(res.data)
    })
  }
  function filterProjects() {
    var newArr
    if (filters.estruturaPersFilter.length > 0) {
      if (!newArr) newArr = projects
      newArr = newArr.filter((call) => filters.estruturaPersFilter.includes(call.estruturaPersonalizada.status))
    }
    if (filters.entregaEstruturaFilter.length > 0) {
      if (!newArr) newArr = projects
      newArr = newArr.filter((call) => filters.entregaEstruturaFilter.includes(call.estruturaPersonalizada.statusEntrega))
    }
    if (filters.liberacaoStatus.length > 0) {
      if (!newArr) newArr = projects
      newArr = newArr.filter((call) => filters.liberacaoStatus.includes(call.compra.statusLiberacao))
    }
    if (filters.segmentoFilter.length > 0) {
      if (!newArr) newArr = projects
      newArr = newArr.filter((call) => filters.segmentoFilter.includes(call.segmento))
    }
    if (filters.searchFilter.trim().length > 0) {
      if (!newArr) newArr = projects
      newArr = projects.filter((call) => call.nomeDoContrato.toUpperCase().includes(filters.searchFilter.toUpperCase()))
    }
    if (filters.pendencia) {
      if (!newArr) newArr = projects
      newArr = projects.filter((call) => call.estruturaPersonalizada.status != 'PRONTA' && call.compra.statusLiberacao == 'PAGO')
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
  if (status == 'loading') return <LoadingPage />
  if (status == 'authenticated') {
    return (
      <div className="grow bg-[#fff] p-6">
        <div className="mb-2 flex w-full flex-col items-center border-b border-gray-200">
          <h1 className="pb-2 text-xl font-bold text-[#fead61]">CONTROLE DE ESTRUTURA ({filteredProjects.length})</h1>
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
              placeholder="STATUS EST. PERSONALIZADA"
              onChange={(e) =>
                setFilters({
                  ...filters,
                  estruturaPersFilter: e.map((x) => x.value),
                })
              }
              options={[
                {
                  value: 'PRONTA',
                  label: 'PRONTA',
                },
                {
                  value: 'PENDÊNCIA',
                  label: 'PENDÊNCIA',
                },
                {
                  value: 'N/A',
                  label: 'N/A',
                },
                {
                  value: undefined,
                  label: 'NÃO DEFINIDO',
                },
              ]}
            />
            <Select
              isMulti
              placeholder="STATUS ENTREGA DA ESTRUTURA"
              onChange={(e) =>
                setFilters({
                  ...filters,
                  entregaEstruturaFilter: e.map((x) => x.value),
                })
              }
              options={[
                {
                  label: 'AGUARDANDO COMPRA',
                  value: 'AGUARDANDO COMPRA',
                },
                {
                  label: 'EM ROTA',
                  value: 'EM ROTA',
                },
                {
                  label: 'ENTREGUE',
                  value: 'ENTREGUE',
                },
                {
                  label: 'CANCELADO',
                  value: 'CANCELADO',
                },
                {
                  label: 'NÃO DEFINIDO',
                  value: 'NÃO DEFINIDO',
                },
              ]}
            />

            <Select
              isMulti
              placeholder="STATUS PAG. KIT"
              onChange={(e) =>
                setFilters({
                  ...filters,
                  liberacaoStatus: e.map((x) => x.value),
                })
              }
              options={[
                { value: 'PAGO', label: 'PAGO' },
                {
                  value: 'REALIZAR COMPRA',
                  label: 'REALIZAR COMPRA',
                },
                {
                  value: 'AGUARDANDO PAGAMENTO DO BANCO',
                  label: 'AGUARDANDO PAGAMENTO DO BANCO',
                },
                {
                  value: 'AGUARDANDO CLIENTE PAGAR',
                  label: 'AGUARDANDO CLIENTE PAGAR',
                },
                {
                  value: 'AGUARDANDO LIBERAÇÃO DE CRÉDITO',
                  label: 'AGUARDANDO LIBERAÇÃO DE CRÉDITO',
                },
                {
                  value: 'AGUARDANDO PARECER DE ACESSO',
                  label: 'AGUARDANDO PARECER DE ACESSO',
                },
                {
                  value: 'AGUARDANDO N.F',
                  label: 'AGUARDANDO N.F',
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
            <EstruturaCard project={project} key={project._id} />
          ))}
        </div>
      </div>
    )
  }
}

export default ControleEstruturas
