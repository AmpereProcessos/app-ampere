import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import Select from 'react-select'
import { AiOutlineSearch } from 'react-icons/ai'
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import ModalADM from '../../components/ModalADM'
import ADMSkeleton from '../../components/skeletons/ADMSkeleton'
import TagTipoDeServico from '../../components/TagTipoDeServico'
import { equipesTecnicas, statusLiberacao } from '../../utils/constants'
import dayjs from 'dayjs'
import FilterButton from '../../components/utils/Buttons/FilterButton'
import { useSession } from 'next-auth/react'
import LoadingPage from '../../components/utils/LoadingPage'
import { billableCompanies, contractStatus } from '../../utils/select-options'
function Administracao() {
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/authHome')
    },
  })

  const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false)

  const [projects, setProjects] = useState()
  const [filteredProjects, setFilteredProjects] = useState()
  const [filters, setFilters] = useState({
    contratoFilter: [],
    pagamentoFilter: [],
    empresaAFaturar: [],
    equipResp: [],
    vistoriaFilter: [],
    dataSaidaDeObra: null,
    pesquisaFilter: '',
    paraCobrar: false,
    cobrancaFeita: false,
    paraFaturar: false,
    faturamentoFeito: false,
  })
  const [dateFilter, setDateFilter] = useState({
    after: null,
    before: null,
    field1: null,
    field2: null,
  })
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [modalProject, setModalProject] = useState({})
  function getProjects() {
    axios.get('/api/projects/adm').then((res) => {
      setProjects(res.data)
      setFilteredProjects(res.data)
    })
  }
  function filterProjects() {
    var newArr
    if (filters.contratoFilter.length > 0 && filters.pagamentoFilter.length > 0) {
      newArr = projects.filter(
        (project) => filters.pagamentoFilter.includes(project.pagamento.status) && filters.contratoFilter.includes(project.contrato.status)
      )
    } else if (filters.pagamentoFilter.length > 0) {
      newArr = projects.filter((project) => filters.pagamentoFilter.includes(project.compra.statusLiberacao))
    } else if (filters.contratoFilter.length > 0) {
      newArr = projects.filter((project) => filters.contratoFilter.includes(project.contrato.status))
    }
    if (filters.equipResp.length > 0) {
      if (!newArr) newArr = projects
      newArr = newArr.filter((call) => filters.equipResp.includes(call.obra?.equipeResp))
    }
    if (filters.vistoriaFilter.length > 0) {
      if (!newArr) newArr = projects
      newArr = newArr.filter((call) => filters.vistoriaFilter.includes(call.vistoria?.status))
    }
    if (filters.empresaAFaturar.length > 0) {
      if (!newArr) newArr = projects
      newArr = newArr.filter((call) => filters.empresaAFaturar.includes(call.faturamento?.empresaFaturamento))
    }
    if (filters.paraCobrar) {
      if (!newArr) newArr = projects
      newArr = newArr.filter((call) => call.pagamento.cobrancaFeita != true)
    }
    if (filters.cobrancaFeita) {
      if (!newArr) newArr = projects
      newArr = newArr.filter((call) => !!call.pagamento.cobrancaFeita)
    }
    if (filters.paraFaturar) {
      if (!newArr) newArr = projects
      newArr = newArr.filter((call) => call.faturamento.concluido != true)
    }
    if (filters.faturamentoFeito) {
      if (!newArr) newArr = projects
      newArr = newArr.filter((call) => !!call.faturamento.concluido)
    }
    if (dateFilter.after && dateFilter.before && dateFilter.field1 != null) {
      if (!newArr) newArr = projects
      newArr = newArr.filter(
        (call) => call[dateFilter.field1][dateFilter.field2] >= dateFilter.after && call[dateFilter.field1][dateFilter.field2] <= dateFilter.before
      )
    }
    if (!newArr) {
      setFilteredProjects(projects)
      return projects
    } else {
      setFilteredProjects(newArr)
      return newArr
    }
  }
  function handleSearchFilter(value) {
    setFilters({ ...filters, pesquisaFilter: value })
    if (value != '' || ' ') {
      let filtered = filterProjects()
      let newArr = filtered.filter((call) => call.nomeDoContrato.toUpperCase().includes(value.toUpperCase()))
      setFilteredProjects(newArr)
    } else {
      setFilteredProjects(projects)
    }
  }

  function handleUpdates(id) {
    axios.get(`/api/projects/fetchDoc/${id}`).then((res) => setModalProject(res.data[0]))
  }
  function handleOpenModal(id) {
    axios.get(`/api/projects/fetchDoc/${id}`).then((res) => {
      setModalProject(res.data[0])
      setModalIsOpen(true)
    })
  }

  useEffect(() => {
    if (session?.user.accessibleRoutes.includes('ADM') || session?.user.accessibleRoutes.includes('Marketing')) {
      if (!projects) {
        getProjects()
      }
    }
  }, [session])

  if (status == 'loading') return <LoadingPage />

  if (status == 'authenticated') {
    if (filteredProjects) {
      return (
        <div className="grow p-6">
          <div className="flex flex-col items-center gap-y-2 border-b border-gray-200 p-1">
            <div className="flex w-full items-center justify-between gap-2">
              <div className="flex flex-col items-center gap-2 font-['Roboto'] lg:flex-row">
                <p className="text-center text-2xl font-bold uppercase text-[#15599a]">Controle de projetos - Administração</p>
                <p className="font-bold text-[#fead61]">({filteredProjects.length})</p>
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
            <AnimatePresence>
              {dropdownMenuVisible ? (
                <motion.div initial={{ scale: 0.8, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} className="mt-4 flex w-full flex-col gap-y-2">
                  <div className="flex flex-col flex-wrap items-center justify-center gap-2 lg:flex-row">
                    <input
                      type="text"
                      className="w-full rounded  border border-gray-200 p-1.5 outline-none placeholder:italic lg:w-[350px]"
                      placeholder="DIGITE O NOME DO CONTRATO"
                      value={filters.pesquisaFilter}
                      onChange={(e) => handleSearchFilter(e.target.value)}
                    />
                    <div className="flex w-full flex-col gap-2 lg:w-fit lg:flex-row">
                      <div className="flex items-center justify-center gap-x-2">
                        <div className="flex w-fit flex-col items-center">
                          <span className="text-center font-raleway text-sm font-bold uppercase">Depois de:</span>
                          <input
                            className="w-full text-center text-xs uppercase text-gray-600 outline-none"
                            type="date"
                            value={dateFilter.after && new Date(dateFilter.after).toISOString().slice(0, 10)}
                            onChange={(e) =>
                              setDateFilter({
                                ...dateFilter,
                                after: isNaN(e.target.value) ? new Date(e.target.value).toISOString() : null,
                              })
                            }
                          />
                        </div>
                        <div className="flex w-fit flex-col items-center">
                          <span className="text-center font-raleway text-sm font-bold uppercase">Antes de:</span>
                          <input
                            className="w-full text-center text-xs uppercase text-gray-600 outline-none"
                            type="date"
                            value={dateFilter.before && new Date(dateFilter.before).toISOString().slice(0, 10)}
                            onChange={(e) =>
                              setDateFilter({
                                ...dateFilter,
                                before: isNaN(e.target.value) ? new Date(e.target.value).toISOString() : null,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="w-full lg:w-[250px]">
                        <Select
                          isMulti={false}
                          styles={{
                            control: (base, state) => ({
                              ...base,
                              width: '100%',
                              minHeight: '41px',
                            }),
                          }}
                          placeholder={'CAMPO DE FILTRO'}
                          options={[
                            { label: 'SAÍDA DE OBRA', value: 'obra.saida' },
                            {
                              label: 'TROCA DO MEDIDOR',
                              value: 'medidor.data',
                            },
                            {
                              label: 'DATA ASS.CONTRATO',
                              value: 'contrato.dataAssinatura',
                            },
                            { label: 'NÃO DEFINIDO', value: null },
                          ]}
                          onChange={(e) =>
                            setDateFilter({
                              ...dateFilter,
                              field1: e.value != null ? e.value.split('.')[0] : null,
                              field2: e.value != null ? e.value.split('.')[1] : null,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col flex-wrap items-center justify-center gap-2 lg:flex-row">
                    <div className="w-full lg:w-[250px]">
                      <Select
                        isMulti
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            width: '100%',
                            minHeight: '41px',
                          }),
                        }}
                        placeholder="EMPRESA A FATURAR"
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            empresaAFaturar: e.map((x) => x.value),
                          })
                        }
                        options={billableCompanies}
                      />
                    </div>
                    <div className="w-full lg:w-[250px]">
                      <Select
                        isMulti
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            width: '100%',
                            minHeight: '41px',
                          }),
                        }}
                        placeholder="EQUIP.RESP"
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            equipResp: e.map((x) => x.value),
                          })
                        }
                        options={equipesTecnicas.map((equipe) => equipe)}
                      />
                    </div>
                    <div className="w-full lg:w-[250px]">
                      <Select
                        isMulti
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            width: '100%',
                            minHeight: '41px',
                          }),
                        }}
                        placeholder="STATUS CONTRATO"
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            contratoFilter: e.map((x) => x.value),
                          })
                        }
                        options={contractStatus}
                      />
                    </div>
                    <div className="w-full lg:w-[250px]">
                      <Select
                        isMulti
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            width: '100%',
                            minHeight: '41px',
                          }),
                        }}
                        placeholder="STATUS DE LIBERAÇÃO"
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            pagamentoFilter: e.map((x) => x.value),
                          })
                        }
                        options={statusLiberacao.map((status) => {
                          return { label: status.label, value: status.value }
                        })}
                      />
                    </div>
                    <div className="w-full lg:w-[250px]">
                      <Select
                        isMulti
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            width: '100%',
                            minHeight: '41px',
                          }),
                        }}
                        placeholder="STATUS DA VISTORIA"
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            vistoriaFilter: e.map((x) => x.value),
                          })
                        }
                        options={[
                          { label: 'REALIZADA', value: 'REALIZADA' },
                          {
                            label: 'AGUARDANDO OBRA DE REDE',
                            value: 'AGUARDANDO OBRA DE REDE',
                          },
                          {
                            label: 'AGUARDANDO CONCESSIONARIA',
                            value: 'AGUARDANDO CONCESSIONARIA',
                          },
                          { label: 'NÃO DEFINIDO', value: undefined },
                        ]}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col flex-wrap items-center justify-center gap-2 lg:flex-row">
                    <div
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          paraCobrar: !prev.paraCobrar,
                        }))
                      }
                      className={`cursor-pointer rounded border border-[#15599a] p-1 font-bold ${
                        filters.paraCobrar ? 'bg-[#15599a] text-white' : 'bg-transparent text-[#15599a]'
                      }`}
                    >
                      COBRANÇA PENDENTE
                    </div>
                    <div
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          cobrancaFeita: !prev.cobrancaFeita,
                        }))
                      }
                      className={`cursor-pointer rounded border border-[#fead41] p-1 font-bold ${
                        filters.cobrancaFeita ? 'bg-[#fead41] text-white' : 'bg-transparent text-[#fead41]'
                      }`}
                    >
                      COBRANÇA FEITA
                    </div>
                    <div
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          paraFaturar: !prev.paraFaturar,
                        }))
                      }
                      className={`cursor-pointer rounded border border-[#15599a] p-1 font-bold ${
                        filters.paraFaturar ? 'bg-[#15599a] text-white' : 'bg-transparent text-[#15599a]'
                      }`}
                    >
                      FATURAMENTO PENDENTE
                    </div>
                    <div
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          faturamentoFeito: !prev.faturamentoFeito,
                        }))
                      }
                      className={`cursor-pointer rounded border border-[#fead41] p-1 font-bold ${
                        filters.faturamentoFeito ? 'bg-[#fead41] text-white' : 'bg-transparent text-[#fead41]'
                      }`}
                    >
                      FATURAMENTO FEITO
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-x-2">
                    <FilterButton text={'FILTRAR'} icon={<AiOutlineSearch />} handleClick={filterProjects} />
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
          <div className="mt-4  flex flex-wrap justify-around gap-3">
            {filteredProjects.map((project, index) => (
              <motion.div
                initial={{ opacity: 0, translateX: -50, translateY: -35 }}
                animate={{ opacity: 1, translateX: 0, translateY: 0 }}
                transition={{ duration: 0.3, delay: 0.01 * index }}
                onClick={() => {
                  handleOpenModal(project._id)
                }}
                key={project._id}
                className="w-full cursor-pointer border border-gray-200 hover:bg-blue-100 md:w-[350px] lg:w-[450px]"
              >
                <TagTipoDeServico tipoDeServico={project.tipoDeServico} />
                <div className="flex flex-col p-2">
                  <div className="flex items-center justify-between pb-2">
                    <p className="text-xs text-gray-700">{project.nomeDoContrato}</p>
                    <p className="text-xs text-[#15599a]">#{project.qtde}</p>
                  </div>
                  <div className="flex items-center justify-between pb-2">
                    <div className="flex flex-col items-start gap-1">
                      <span className="text-xxs">STATUS DE COBRANÇA</span>
                      <p
                        className={`rounded border p-1 text-xs font-black ${
                          project.pagamento?.cobrancaFeita ? 'border border-green-500 text-green-500' : 'border border-red-500 text-red-500'
                        }`}
                      >
                        {project.pagamento?.cobrancaFeita ? 'REALIZADA' : 'PENDENTE'}
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xxs">EMPRESA À FATURAR</span>
                      <p className={`rounded p-1 text-sm font-bold text-gray-500 `}>
                        {project.faturamento?.empresaFaturamento ? project.faturamento?.empresaFaturamento : 'NÃO DEFINIDO'}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xxs">STATUS DE FATURAMENTO</span>
                      <p
                        className={`rounded border p-1 text-xs font-black ${
                          project.faturamento?.concluido ? 'border border-green-500 text-green-500' : 'border border-red-500 text-red-500'
                        }`}
                      >
                        {project.faturamento?.concluido ? 'REALIZADO' : 'PENDENTE'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pb-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-xxs">SAÍDA DE OBRA</span>
                      <p className="text-xs text-yellow-500">
                        {project.obra?.saida ? dayjs(project.obra.saida).add(4, 'hours').format('DD/MM/YYYY') : '-'}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-end text-xxs">VENDEDOR</span>
                      <p className="text-xs text-[#15599a]">{project.vendedor && project.vendedor.nome}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col items-start gap-1">
                      <p className="text-xxs">TIPO DE PAGAMENTO</p>
                      <p className="text-xs text-gray-600">{project.pagamento?.forma && project.pagamento.forma}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <p className="text-end text-xxs">PAGAMENTO DO KIT</p>
                      <p className="text-end text-xs text-gray-600">{project.compra?.statusLiberacao ? project.compra.statusLiberacao : '-'}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          {session?.user?.visualizacao == undefined && (
            <Link href={'/comercial/formulariosSolicitacao'}>
              <a className="fixed bottom-10 cursor-pointer rounded-lg bg-[#15599a] p-3 text-white hover:bg-[#fead61] hover:text-[#15599a]">
                <p className="text-sm font-bold uppercase">SOLICITAÇÕES DE CONTRATO</p>
              </a>
            </Link>
          )}
          <Link href={'/financeiro/despesas'}>
            <a className="fixed bottom-10 ml-60 cursor-pointer rounded-lg bg-[#15599a] p-3 text-white hover:bg-[#fead61] hover:text-[#15599a]">
              <p className="text-sm font-bold uppercase">DESPESAS</p>
            </a>
          </Link>
          {modalIsOpen && (
            <ModalADM
              handleUpdates={handleUpdates}
              project={modalProject}
              modalIsOpen={modalIsOpen}
              editor={session?.user && session?.user?.accessibleRoutes.includes('ADM') ? true : false}
              setModalIsOpen={setModalIsOpen}
              credentials={session?.user}
            />
          )}
        </div>
      )
    } else {
      return <ADMSkeleton />
    }
  }
}

export default Administracao
