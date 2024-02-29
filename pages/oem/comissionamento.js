import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Select from 'react-select'
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'
import { motion, AnimatePresence } from 'framer-motion'
import ComissionamentoPosObraCard from '../../components/ComissionamentoPosObraCard'
import ComissionamentoPosObraSkeleton from '../../components/skeletons/ComissionamentoPosObraSkeleton'
import { cidadesAtendidas, equipesTecnicas, vendedores } from '../../utils/constants'
import FilterButton from '../../components/utils/Buttons/FilterButton'
import { useSession } from 'next-auth/react'
import LoadingPage from '../../components/utils/LoadingPage'

function Comissionamento() {
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/signin')
    },
  })

  const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false)

  const [projects, setProjects] = useState()
  const [filteredProjects, setFilteredProjects] = useState()
  const [filters, setFilters] = useState({
    search: '',
    city: [],
    respTeam: [],
    plantPowered: [],
    seller: [],
    technicalDeliveryType: [],
    appPending: false,
    injectedEnergyPending: false,
    technicalDeliveryPending: false,
  })
  const [dateFilter, setDateFilter] = useState({
    after: null,
    before: null,
    field1: null,
    field2: null,
  })
  function getProjects() {
    axios.get('/api/projects/comissionamentoPosObra').then((res) => {
      setFilteredProjects(res.data)
      setProjects(res.data)
    })
  }
  function handleSearchFilter(value) {
    setFilters({ ...filters, search: value })
    if (value != '' || value != ' ') {
      var filteredArr = filterProjects()
      var newArr = filteredArr.filter((project) => project.nomeDoContrato.toUpperCase().includes(value.toUpperCase()))
      setFilteredProjects(newArr)
    } else {
      setFilteredProjects(projects)
    }
  }
  function filterProjects() {
    var newArr
    if (dateFilter.after && dateFilter.before && dateFilter.field1 != null) {
      if (!newArr) newArr = projects
      newArr = newArr.filter(
        (call) => call[dateFilter.field1][dateFilter.field2] >= dateFilter.after && call[dateFilter.field1][dateFilter.field2] <= dateFilter.before
      )
    }
    if (filters.appPending) {
      if (!newArr) newArr = projects
      newArr = newArr.filter((project) => project.app.data == undefined)
      console.log(newArr)
    }
    if (filters.injectedEnergyPending) {
      if (!newArr) newArr = projects
      newArr = newArr.filter((project) => project.medidor.data != undefined && project.conferencias.energiaInjetada.data == undefined)
    }
    if (filters.technicalDeliveryPending) {
      if (!newArr) newArr = projects
      newArr = newArr.filter(
        (project) =>
          project.medidor.data != undefined &&
          (project.jornada?.tipoEntregaTecnica == undefined || project.jornada?.tipoEntregaTecnica == 'NÃO DEFINIDO')
      )
    }
    // if (filters.search.length > 0) {
    //   if (!newArr) newArr = projects;
    //   newArr = newArr.filter((call) =>
    //     call.nomeDoContrato.toUpperCase().includes(filters.search)
    //   );
    // }
    if (filters.city.length > 0) {
      if (!newArr) newArr = projects
      newArr = newArr.filter((call) => filters.city.includes(call.cidade))
    }
    if (filters.seller.length > 0) {
      if (!newArr) newArr = projects
      newArr = newArr.filter((call) => filters.seller.includes(call.vendedor.nome))
    }
    if (filters.respTeam.length > 0) {
      if (!newArr) newArr = projects
      newArr = newArr.filter((call) => filters.respTeam.includes(call.obra?.equipeResp))
    }
    if (filters.technicalDeliveryType.length > 0) {
      if (!newArr) newArr = projects
      newArr = newArr.filter((call) => filters.technicalDeliveryType.includes(call.jornada.tipoEntregaTecnica))
    }
    if (filters.plantPowered.length > 0) {
      if (!newArr) newArr = projects
      newArr = newArr.filter((call) => filters.plantPowered.includes(call.conferencias.usinaLigada.status))
    }
    if (!newArr) {
      setFilteredProjects(projects)
      return projects
    } else {
      setFilteredProjects([...newArr])
      return newArr
    }
  }
  useEffect(() => {
    if (session?.user.permissoes.rotas.includes('O&M') || session?.user.permissoes.rotas.includes('Pós-Venda')) {
      if (!projects) {
        getProjects()
      }
    } else {
      if (session?.user) {
        router.push('/')
      }
    }
  }, [session])

  if (status == 'loading') return <LoadingPage />
  if (status == 'authenticated') {
    if (filteredProjects) {
      return (
        <div className="flex grow flex-col p-6">
          <div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-wrap items-center justify-center gap-2 font-['Roboto']">
                <p className="text-center font-['Roboto'] text-2xl font-bold uppercase text-[#15599a]">COMISSIONAMENTO PÓS-OBRA</p>
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
                      value={filters.search}
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
                          placeholder={'CAMPO DE FILTRO'}
                          styles={{
                            control: (base, state) => ({
                              ...base,
                              width: '100%',
                              minHeight: '41px',
                            }),
                          }}
                          options={[
                            { label: 'SAÍDA DE OBRA', value: 'obra.saida' },
                            {
                              label: 'TROCA DO MEDIDOR',
                              value: 'medidor.data',
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
                        placeholder="USINA LIGADA"
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            plantPowered: e.map((x) => x.value),
                          })
                        }
                        options={[
                          { label: 'NÃO REALIZADO', value: 'NÃO REALIZADO' },
                          { label: 'REALIZADO', value: 'REALIZADO' },
                        ]}
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
                            respTeam: e.map((x) => x.value),
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
                        placeholder="VENDEDOR"
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            seller: e.map((x) => x.value),
                          })
                        }
                        options={vendedores.map((vendedor) => {
                          return { label: vendedor.nome, value: vendedor.nome }
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
                        placeholder="CIDADE"
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            city: e.map((x) => x.value),
                          })
                        }
                        options={cidadesAtendidas.map((cidade) => {
                          return {
                            label: cidade,
                            value: cidade,
                          }
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
                        placeholder="TIPO DA ENTREGA"
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            technicalDeliveryType: e.map((x) => x.value),
                          })
                        }
                        options={[
                          {
                            label: 'PRESENCIAL',
                            value: 'PRESENCIAL',
                          },
                          {
                            label: 'REMOTO',
                            value: 'REMOTO',
                          },
                          {
                            label: 'NÃO DEFINIDO',
                            value: 'NÃO DEFINIDO',
                          },
                        ]}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col flex-wrap items-center justify-center gap-2 lg:flex-row">
                    <div
                      onClick={() =>
                        setFilters({
                          ...filters,
                          appPending: !filters.appPending,
                        })
                      }
                      className={`${
                        filters.appPending ? 'bg-[#15599a]' : 'bg-blue-300'
                      } flex h-[36px] cursor-pointer items-center justify-center rounded px-2 font-bold text-white`}
                    >
                      APP PENDENTE
                    </div>
                    <div
                      onClick={() =>
                        setFilters({
                          ...filters,
                          injectedEnergyPending: !filters.injectedEnergyPending,
                        })
                      }
                      className={`${
                        filters.injectedEnergyPending ? 'bg-[#15599a]' : 'bg-blue-300'
                      } flex h-[36px] cursor-pointer items-center justify-center rounded px-2 font-bold text-white`}
                    >
                      ENERGIA INJETADA PENDENTE
                    </div>
                    <div
                      onClick={() =>
                        setFilters({
                          ...filters,
                          technicalDeliveryPending: !filters.technicalDeliveryPending,
                        })
                      }
                      className={`${
                        filters.technicalDeliveryPending ? 'bg-[#15599a]' : 'bg-blue-300'
                      } flex h-[36px] cursor-pointer items-center justify-center rounded px-2 font-bold text-white`}
                    >
                      ENTREGA TÉCNICA PENDENTE
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-x-2">
                    <FilterButton text={'FILTRAR'} icon={<AiOutlineSearch />} handleClick={filterProjects} />
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
          <div className="mt-2 flex flex-col gap-2">
            {filteredProjects?.map((project, index) => (
              <ComissionamentoPosObraCard key={project._id} project={project} index={index} handleUpdates={() => getProjects()} />
            ))}
          </div>
          <Link href={'/vendas/entregaTecnica'}>
            <a className="left-150 fixed bottom-10 cursor-pointer rounded-lg bg-[#15599a] p-3 text-white hover:bg-[#fead61] hover:text-[#15599a]">
              <p className="text-sm font-bold uppercase">ENTREGAS TÉCNICAS PRESENCIAIS</p>
            </a>
          </Link>
        </div>
      )
    } else {
      return <ComissionamentoPosObraSkeleton />
    }
  }
}

export default Comissionamento
