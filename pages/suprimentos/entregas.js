import axios from 'axios'
import React, { useState, useEffect, useContext } from 'react'
import EntregasCard from '../../components/EntregasCard'
import Select from 'react-select'
import dayjs from 'dayjs'
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'
import { AiOutlineSearch } from 'react-icons/ai'
import { useRouter } from 'next/router'
import { AnimatePresence, motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import LoadingPage from '../../components/utils/LoadingPage'
function Entregas() {
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/signin')
    },
  })
  const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false)

  const [projects, setProjects] = useState([])
  const [filteredProjects, setFilteredProjects] = useState([])
  const [filters, setFilters] = useState({
    deliveryStatus: [],
    rastreioFilter: false,
    ordenatePrev: false,
    searchFilter: '',
  })
  const [dateFilter, setDateFilter] = useState({
    after: null,
    before: null,
    field1: null,
    field2: null,
  })
  function getProjects() {
    axios.get('/api/projects/suprimentos').then((res) => {
      setFilteredProjects(res.data)
      setProjects(res.data)
    })
  }
  function filterProjects() {
    var newArr
    if (filters.deliveryStatus.length > 0) {
      if (!newArr) newArr = projects
      newArr = newArr.filter((project) => filters.deliveryStatus.includes(project.compra.statusEntrega))
    }
    if (filters.rastreioFilter) {
      if (!newArr) newArr = projects
      newArr = newArr.filter((project) => project.compra.rastreio?.trim().length > 0)
    }
    if (filters.ordenatePrev) {
      console.log('PASSEI POR AQUI')
      if (!newArr) newArr = projects
      newArr = newArr.filter((obj) => obj.compra.previsaoEntrega != null)
      newArr = newArr.sort((a, b) => {
        if (dayjs(a.compra.previsaoEntrega).isBefore(b.compra.previsaoEntrega)) return -1
        else if (dayjs(a.compra.previsaoEntrega).isAfter(b.compra.previsaoEntrega)) return 1
        else return 0
      })
      console.log(newArr)
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
    setFilters({ ...filters, searchFilter: value })
    if (value != '' || ' ') {
      let filtered = filterProjects()
      let newArr = filtered.filter((call) => call.nomeDoContrato.toUpperCase().includes(value.toUpperCase()))
      setFilteredProjects(newArr)
    } else {
      setFilteredProjects(projects)
    }
  }
  function sortByPrevEntrega() {
    var newArr = filteredProjects.sort((a, b) => {
      return new Date(b.compra?.previsaoEntrega) - new Date(a.compra?.previsaoEntrega)
      setFilteredProjects(newArr)
    })
  }
  useEffect(() => {
    if (session?.user.permissoes.rotas.includes('Suprimentos') || session?.user.permissoes.rotas.includes('Marketing')) {
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
      <div className="flex grow flex-col p-6">
        <div className="flex w-full flex-col items-center justify-between border-b border-gray-200 p-1">
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-wrap items-center justify-center gap-2 font-['Roboto']">
              <p className="text-xl font-bold text-[#15599a]">ENTREGAS</p>
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
                    className="w-full rounded  border border-gray-200 p-1.5 outline-none placeholder:italic lg:w-[350px]"
                    placeholder="DIGITE O NOME DO CONTRATO"
                    value={filters.searchFilter}
                    onChange={(e) => handleSearchFilter(e.target.value)}
                  />
                  <div className="flex w-full gap-x-2 lg:w-fit">
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
                    <div className="w-full lg:w-[250px]">
                      <Select
                        isMulti={false}
                        placeholder={'CAMPO DE FILTRO'}
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            width: '100%',
                            minHeight: '41px',
                          }),
                        }}
                        options={[
                          {
                            label: 'DATA PAGAMENTO',
                            value: 'compra.dataPagamento',
                          },
                          {
                            label: 'DATA MÁX P/ PAGAMENTO',
                            value: 'compra.dataMaxPagamento',
                          },
                          {
                            label: 'PREVISÃO DE ENTREGA',
                            value: 'compra.previsaoEntrega',
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
                  <div
                    onClick={() =>
                      setFilters({
                        ...filters,
                        ordenatePrev: !filters.ordenatePrev,
                      })
                    }
                    className={`${
                      filters.ordenatePrev ? 'bg-[#15599a]' : 'bg-blue-300'
                    } flex h-[36px] cursor-pointer items-center justify-center rounded px-2 text-center text-xs font-bold text-white lg:text-base`}
                  >
                    ORDENAR POR PREVISÃO
                  </div>
                  <div
                    onClick={() =>
                      setFilters({
                        ...filters,
                        rastreioFilter: !filters.rastreioFilter,
                      })
                    }
                    className={`${
                      filters.rastreioFilter ? 'bg-[#15599a]' : 'bg-blue-300'
                    } flex h-[36px] cursor-pointer items-center justify-center rounded px-2 text-center text-xs font-bold text-white lg:text-base`}
                  >
                    RASTREIO PREENCHIDO
                  </div>
                  <div className="w-full lg:w-[250px]">
                    <Select
                      isMulti
                      placeholder="STATUS ENTREGA"
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          width: '100%',
                          minHeight: '41px',
                        }),
                      }}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          deliveryStatus: e.map((x) => x.value),
                        })
                      }
                      options={[
                        { value: 'EM ROTA', label: 'EM ROTA' },
                        {
                          value: 'AGUARDANDO COMPRA',
                          label: 'AGUARDANDO COMPRA',
                        },
                        { value: 'CANCELADO', label: 'CANCELADO' },
                        { value: undefined, label: 'NÃO DEFINIDO' },
                      ]}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-x-2">
                  <button
                    onClick={filterProjects}
                    className="flex h-[36px] items-center gap-x-2 rounded bg-[#fead61] px-2 font-bold hover:bg-[#15599a] hover:text-white"
                  >
                    <p>Filtrar</p>
                    <AiOutlineSearch />
                  </button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
        <div className="mt-2 flex flex-col gap-2">
          {filteredProjects.map((project, index) => (
            <EntregasCard index={index} key={project._id} project={project} />
          ))}
        </div>
      </div>
    )
  }
}

export default Entregas
