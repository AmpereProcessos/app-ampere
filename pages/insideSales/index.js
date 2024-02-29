import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import { MdDateRange } from 'react-icons/md'
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'
import { BsDownload } from 'react-icons/bs'
import Select from 'react-select'
import axios from 'axios'
import dayjs from 'dayjs'
import { motion, AnimatePresence } from 'framer-motion'
import ModalNovoLead from '../../components/ModalNovoLead'
import LeadCard from '../../components/LeadCard'
import { cidadesAtendidas, formatDate, vendedores } from '../../utils/constants'
import AnimatedTextAndIconButton from '../../components/AnimatedTextAndIconButton'
import FilterButton from '../../components/utils/Buttons/FilterButton'
import FetchDataButton from '../../components/utils/Buttons/FetchDataButton'
import { useSession } from 'next-auth/react'
import LoadingPage from '../../components/utils/LoadingPage'

var dateFilterParam = new Date()
dateFilterParam.setMonth(dateFilterParam.getMonth() - 3)

function InsideSales() {
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/signin')
    },
  })

  const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false)

  const [leads, setLeads] = useState([])
  const [filteredLeads, setFilteredLeads] = useState([])

  const [modalNovoLead, setModalNovoLead] = useState(false)

  const [filters, setFilters] = useState({
    pesquisaFilter: '',
    cidadeFilter: [],
    vendedorFilter: [],
    canalFilter: [],
    insiderFilter: [],
  })

  const [fetchDateFilter, setFetchDateFilter] = useState({
    after: new Date(dateFilterParam).toISOString(),
    before: new Date(dayjs().hour(22).$d).toISOString(),
  })
  const [dateFilter, setDateFilter] = useState({
    after: null,
    before: null,
    field: null,
  })
  function getConversion() {
    const convertedNum = filteredLeads.filter((lead) => !!lead.contratoAssinado).length
    return (convertedNum * 100) / filteredLeads.length
  }
  function getLoses() {
    const lostNum = filteredLeads.filter((lead) => !!lead.perdido).length
    return (lostNum * 100) / filteredLeads.length
  }
  function getLeads() {
    if (session?.user.permissoes.rotas.includes('PPS') || session?.user.permissoes.rotas.includes('Marketing')) {
      axios.get(`api/insideSales?after=${new Date(fetchDateFilter.after).toISOString()}&before=${fetchDateFilter.before}`).then((res) => {
        setLeads(res.data)
        setFilteredLeads(res.data)
      })
    } else {
      axios
        .post('/api/insideSales', {
          match: {
            responsavel: session?.user.visualizacao.referencia,
            dataDeAquisicao: {
              $gte: new Date(fetchDateFilter.after).toISOString(),
              $lt: fetchDateFilter.before,
            },
          },
        })
        .then((res) => {
          setLeads(res.data)
          setFilteredLeads(res.data)
        })
    }
  }
  function filterLeads() {
    var newArr
    if (dateFilter.after && dateFilter.before && dateFilter.field != null) {
      if (!newArr) newArr = leads
      newArr = newArr.filter((call) => call[dateFilter.field] >= dateFilter.after && call[dateFilter.field] <= dateFilter.before)
    }
    if (filters.cidadeFilter.length > 0) {
      if (!newArr) newArr = leads
      newArr = newArr.filter((lead) => filters.cidadeFilter.includes(lead.cidade))
    }
    if (filters.vendedorFilter.length > 0) {
      if (!newArr) newArr = leads
      newArr = newArr.filter((lead) => filters.vendedorFilter.includes(lead.vendedor))
    }
    if (filters.canalFilter.length > 0) {
      if (!newArr) newArr = leads
      newArr = newArr.filter((lead) => filters.canalFilter.includes(lead.canal))
    }
    if (filters.insiderFilter.length > 0) {
      if (!newArr) newArr = leads
      newArr = newArr.filter((lead) => filters.insiderFilter.includes(lead.responsavel))
    }
    if (filters.pesquisaFilter.trim().length > 0) {
      if (!newArr) newArr = leads
      newArr = newArr.filter((lead) => lead.nome.toUpperCase().includes(filters.pesquisaFilter.toUpperCase()))
    }
    if (!newArr) {
      setFilteredLeads(leads)
      return leads
    } else {
      setFilteredLeads(newArr)
      return newArr
    }
  }
  function exportData() {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(filteredLeads))}`
    const link = document.createElement('a')
    link.href = jsonString
    link.download = 'data.json'

    link.click()
  }
  useEffect(() => {
    if (session?.user.permissoes.rotas.includes('InsideSales')) {
      getLeads()
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
        <div className="flex flex-col border-b border-gray-200 pb-2">
          <div className="flex items-center justify-between">
            <h1 className="text-start  font-['Roboto'] text-2xl  font-bold text-[#15599a]">
              ACOMPANHAMENTO DE OPORTUNIDADES ({filteredLeads.length})
            </h1>
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center font-medium">
                <h1 className="text-xs">CONVERSÃO (%)</h1>
                <h1 className="text-sm text-green-500">
                  {getConversion().toLocaleString('pt-br', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{' '}
                  %
                </h1>
              </div>
              <div className="flex flex-col items-center font-medium">
                <h1 className="text-xs">PERDAS (%)</h1>
                <h1 className="text-sm text-red-500">
                  {getLoses().toLocaleString('pt-br', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{' '}
                  %
                </h1>
              </div>
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
              <motion.div
                initial={{ scale: 0.8, opacity: 0.6 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mt-4 flex w-full flex-col items-center gap-2 lg:flex-row lg:justify-between"
              >
                <div className="flex flex-col gap-2">
                  <span className="h-[38px] font-['Roboto'] text-xs">ADQUIRIDOS ENTRE:</span>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <input
                      value={formatDate(fetchDateFilter.after)}
                      onChange={(e) =>
                        setFetchDateFilter({
                          ...fetchDateFilter,
                          after: dayjs(e.target.value).$d != 'Invalid Date' ? new Date(e.target.value).toISOString() : dateFilterParam,
                        })
                      }
                      type="date"
                      className="border border-gray-200 py-1 px-2 outline-none"
                    />
                    <p>&</p>
                    <input
                      value={formatDate(fetchDateFilter.before)}
                      onChange={(e) =>
                        setFetchDateFilter({
                          ...fetchDateFilter,
                          before:
                            dayjs(e.target.value).$d != 'Invalid Date'
                              ? dayjs(e.target.value).add('20', 'hour').toISOString()
                              : new Date().toISOString(),
                        })
                      }
                      type="date"
                      className="border border-gray-200 py-1 px-2 outline-none"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <FetchDataButton text={'BUSCAR'} icon={<MdDateRange />} handleClick={getLeads} />
                    <div
                      onClick={exportData}
                      className="flex cursor-pointer items-center rounded-lg  p-2 font-bold text-[#15599a] transition duration-300 ease-in-out hover:scale-105"
                    >
                      <p className="mr-2 text-sm">BAIXAR DADOS</p>
                      <BsDownload />
                    </div>
                  </div>
                </div>
                <div className="flex grow flex-col items-end gap-2">
                  <div className="flex flex-col items-center gap-2 lg:flex-row">
                    <input
                      type={'text'}
                      className="w-full rounded border border-gray-200 p-1.5 outline-none placeholder:italic lg:w-[250px]"
                      placeholder="Digite o nome do contrato"
                      value={filters.pesquisaFilter}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          pesquisaFilter: e.target.value,
                        })
                      }
                    />
                    <div className="flex gap-x-2">
                      <div className="flex w-fit flex-col items-center">
                        <span className="text-center font-raleway text-sm font-bold uppercase">Depois de:</span>
                        <input
                          className="w-full text-center text-xs uppercase text-gray-600 outline-none"
                          type="date"
                          value={dateFilter.after ? formatDate(dateFilter.after) : null}
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
                          value={dateFilter.before ? formatDate(dateFilter.before) : null}
                          onChange={(e) =>
                            setDateFilter({
                              ...dateFilter,
                              before: isNaN(e.target.value) ? new Date(e.target.value).toISOString() : null,
                            })
                          }
                        />
                      </div>
                      <Select
                        isMulti={false}
                        placeholder={'CAMPO DE FILTRO'}
                        options={[
                          {
                            label: 'DATA DE ENVIO',
                            value: 'dataDeEnvio',
                          },
                          {
                            label: 'DATA DE AQUISIÇÃO',
                            value: 'dataDeAquisicao',
                          },
                          { label: 'NÃO DEFINIDO', value: null },
                        ]}
                        onChange={(e) =>
                          setDateFilter({
                            ...dateFilter,
                            field: e.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex w-full flex-col flex-wrap items-center justify-start gap-2 lg:flex-row lg:justify-end">
                    <div className="w-full lg:w-[200px]">
                      <Select
                        isMulti
                        placeholder="CIDADE"
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            width: '100%',
                          }),
                        }}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            cidadeFilter: e.map((x) => x.value),
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
                    <div className="w-full lg:w-[200px]">
                      <Select
                        isMulti
                        placeholder="VENDEDOR"
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            width: '100%',
                          }),
                        }}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            vendedorFilter: e.map((x) => x.value),
                          })
                        }
                        options={vendedores.map((vendedor) => {
                          return {
                            label: vendedor.nome,
                            value: vendedor.nome,
                          }
                        })}
                      />
                    </div>
                    <div className="w-full lg:w-[200px]">
                      <Select
                        isMulti
                        placeholder="CANAL"
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            width: '100%',
                          }),
                        }}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            canalFilter: e.map((x) => x.value),
                          })
                        }
                        options={[
                          { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
                          {
                            label: 'CALCULADORA SOLAR',
                            value: 'CALCULADORA SOLAR',
                          },
                          { label: 'GOOGLE ADS', value: 'GOOGLE ADS' },
                          { label: 'FACEBOOK ADS', value: 'FACEBOOK ADS' },
                          { label: 'INDICAÇÃO', value: 'INDICAÇÃO' },
                          { label: 'PASSIVO', value: 'PASSIVO' },
                          {
                            label: 'PROSPECÇÃO ATIVA',
                            value: 'PROSPECÇÃO ATIVA',
                          },
                        ]}
                      />
                    </div>

                    {session?.user?.permissoes.rotas.includes('PPS') || session?.user?.permissoes.rotas.includes('Marketing') ? (
                      <div className="w-full lg:w-[200px]">
                        <Select
                          isMulti
                          placeholder="INSIDER"
                          styles={{
                            control: (base, state) => ({
                              ...base,
                              width: '100%',
                            }),
                          }}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              insiderFilter: e.map((x) => x.value),
                            })
                          }
                          options={vendedores
                            .filter((x) => x.qualificacao?.includes('INSIDE') && x.ativo)
                            .map((vendedor) => {
                              return {
                                label: vendedor.nome,
                                value: vendedor.nome,
                              }
                            })}
                        />
                      </div>
                    ) : (
                      false
                    )}
                  </div>
                  <FilterButton text={'FILTRAR'} icon={<AiOutlineSearch />} handleClick={filterLeads} />
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="mt-4 flex flex-wrap justify-around gap-3">
          {filteredLeads.map((lead) => (
            <LeadCard key={lead._id} lead={lead} getLeads={getLeads} />
          ))}
        </div>
        {/* <div
        onClick={() => setModalNovoLead(true)}
        className="fixed bg-[#15599a] cursor-pointer hover:bg-[#fead61] text-white hover:text-[#15599a] p-3 rounded-lg bottom-10 left-150"
      >
        <p className="uppercase font-bold text-sm">NOVO LEAD</p>
      </div> */}
        <AnimatedTextAndIconButton>
          <p onClick={() => setModalNovoLead(true)} className="h-full w-full text-center text-sm font-bold uppercase">
            NOVO LEAD
          </p>
        </AnimatedTextAndIconButton>
        {modalNovoLead && <ModalNovoLead setModalIsOpen={setModalNovoLead} getLeads={getLeads} />}
      </div>
    )
  }
}

export default InsideSales
