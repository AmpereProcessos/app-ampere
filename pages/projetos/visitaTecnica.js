import axios from 'axios'
import { useRouter } from 'next/router'
import Select from 'react-select'
import React, { useEffect, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import ModalVisitaTecnica from '../../components/ModalVisitaTecnica'
import dayjs from 'dayjs'
import { BsPatchCheckFill } from 'react-icons/bs'
import { useSession } from 'next-auth/react'
import LoadingPage from '../../components/utils/LoadingPage'
import FilterButton from '../../components/utils/Buttons/FilterButton'
import TextInput from '../../components/inputs/Text'
import NumberInput from '../../components/inputs/Number'
import MultipleSelectInput from '../../components/inputs/MultipleSelect'
import { technicalAnalysisStatus } from '../../utils/select-options'
import DateInput from '../../components/inputs/Date'
import { formatDate } from '../../utils/constants'
import { formatDateInputChange } from '../../utils/methods/shared'
import SelectInput from '../../components/inputs/Select'
function VisitaTecnica() {
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/authHome')
    },
  })

  const [forms, setForms] = useState()
  const [filteredForms, setFilteredForms] = useState()
  const [filters, setFilters] = useState({
    status: [],
    numModules: '',
    search: '',
  })
  const [modal, setModal] = useState({
    open: false,
    form: {},
  })
  const [dateFilter, setDateFilter] = useState({
    after: null,
    before: null,
    field: null,
  })
  function getProjects() {
    axios.get('/api/solicitacoes/visitaTecnica').then((res) => {
      setFilteredForms(res.data)
      setForms(res.data)
    })
  }
  function getCardColor(statusAprovacao) {
    if (statusAprovacao == 'CONCLUIDO') {
      return 'bg-green-100'
    } else if (statusAprovacao == 'EM ANÁLISE TÉCNICA') {
      return 'bg-yellow-100'
    } else if (statusAprovacao == 'PENDÊNCIA COMERCIAL') {
      return 'bg-cyan-100'
    } else if (statusAprovacao == 'VISITA IN LOCO') {
      return 'bg-indigo-100'
    } else if (statusAprovacao == 'REJEITADA') {
      return 'bg-red-300'
    } else {
      return 'bg-[#fff]'
    }
  }
  function filterForms() {
    var newArr
    if (dateFilter.after && dateFilter.before && dateFilter.field != null) {
      if (!newArr) newArr = forms
      newArr = newArr.filter((form) => form[dateFilter.field] >= dateFilter.after && form[dateFilter.field] <= dateFilter.before)
    }
    if (filters.status.length > 0) {
      if (!newArr) newArr = forms
      newArr = newArr.filter((form) => filters.status.includes(form.status))
    }
    if (filters.search.trim().length > 0) {
      if (!newArr) newArr = forms
      newArr = newArr.filter((form) => form.nomeDoCliente.toUpperCase().includes(filters.search.toUpperCase()))
    }
    if (filters.numModules > 0) {
      if (!newArr) newArr = forms
      newArr = newArr.filter((form) => form.qtdeModulos > filters.numModules)
    }
    if (!newArr) {
      setFilteredForms(forms)
      return forms
    } else {
      setFilteredForms(newArr)
      return newArr
    }
  }
  function filterBySearch(value) {
    setFilters({ ...filters, search: value })
    if (value.trim().length > 0) {
      let filtered = filterForms()
      let newArr = filtered.filter((form) => form.nomeDoCliente.toUpperCase().includes(filters.search.toUpperCase()))
      setFilteredForms(newArr)
    } else {
      setFilteredForms(forms)
    }
  }
  function getPendenceStatusBorder(tipoDeLaudo, currentTimeDiff, status) {
    if (tipoDeLaudo == 'NÃO DEFINIDO') return
    if (status != 'CONCLUIDO') {
      var matches = /\(([^)]+)\)/.exec(tipoDeLaudo)[1]
      var expectedHours = matches.split(' ')[0]
      if (Number(expectedHours) - Number(currentTimeDiff) <= 3) {
        return 'border-2 border-red-500'
      } else if (Number(expectedHours) - Number(currentTimeDiff) <= 5) {
        return 'border-2 border-yellow-500'
      } else {
        return
      }
    } else {
      return
    }
  }
  function getPendenceStatusText(tipoDeLaudo, currentTimeDiff, status) {
    if (tipoDeLaudo == 'NÃO DEFINIDO') return 'text-gray-700'
    if (status != 'CONCLUIDO') {
      var matches = /\(([^)]+)\)/.exec(tipoDeLaudo)[1]
      var expectedHours = matches.split(' ')[0]
      if (Number(expectedHours) - Number(currentTimeDiff) <= 3) {
        return 'text-red-500'
      } else if (Number(expectedHours) - Number(currentTimeDiff) <= 5) {
        return 'text-yellow-500'
      } else {
        return 'text-gray-700'
      }
    } else {
      return 'text-gray-700'
    }
  }
  async function handleOpenModal(id) {
    try {
      let { data } = await axios.get(`/api/solicitacoes/getVisitaTecnica/${id}`)
      setModal({ open: true, form: data })
    } catch (error) {
      let { response } = error
      alert(response.data.msg)
    }
  }
  useEffect(() => {
    if (session?.user.accessibleRoutes.includes('Projetos')) {
      getProjects(session?.user)
    } else {
      if (session?.user) {
        router.push('/')
      }
    }
  }, [session])
  if (status == 'loading') return <LoadingPage />
  if (status == 'authenticated') {
    return (
      <div className="p-6 grow bg-[#fff] flex flex-col">
        <div className="flex flex-col gap-2 items-center w-full border-b border-gray-200 pb-2">
          <h1 className="pb-2 text-[#fead61] text-xl font-bold w-full text-center">FORMULÁRIOS DE VISITA TÉCNICA ({filteredForms?.length})</h1>
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center gap-2">
              <div className="w-[10px] h-[10px] bg-green-200 rounded" />
              <p>CONCLUIDO</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-[10px] h-[10px] bg-yellow-200 rounded" />
              <p>EM ANÁLISE TÉCNICA</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-[10px] h-[10px] bg-cyan-200 rounded" />
              <p>PENDÊNCIA COMERCIAL</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-[10px] h-[10px] bg-indigo-200 rounded" />
              <p>VISITA IN LOCO</p>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row items-end justify-center gap-2 flex-wrap w-full">
            <TextInput
              label={'NOME DO CONTRATO'}
              placeholder={'Digite aqui o nome do contrato...'}
              value={filters.search}
              handleChange={(value) => filterBySearch(value)}
            />
            <NumberInput
              label={'Nº DE MÓDULOS > QUE'}
              value={filters.numModules}
              placeholder={'Digite aqui o número mínimo de módulos...'}
              handleChange={(value) => setFilters((prev) => ({ ...prev, numModules: value }))}
            />
            <MultipleSelectInput
              label={'STATUS DA VISITA'}
              selectedItemLabel={'NÃO DEFINIDO'}
              selected={filters.status}
              options={technicalAnalysisStatus}
              handleChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
              onReset={() => setFilters((prev) => ({ ...prev, status: [] }))}
            />

            <div className="flex flex-col lg:flex-row gap-2 w-full lg:w-fit">
              <div className="flex items-center gap-x-2 justify-center">
                <div className="w-full lg:w-[250px]">
                  <DateInput
                    width={'100%'}
                    label={'DEPOIS DE'}
                    value={dateFilter.after ? formatDate(dateFilter.after) : undefined}
                    handleChange={(value) => setDateFilter((prev) => ({ ...prev, after: formatDateInputChange(value) }))}
                  />
                </div>
                <div className="w-full lg:w-[250px]">
                  <DateInput
                    width={'100%'}
                    label={'ANTES DE'}
                    value={dateFilter.before ? formatDate(dateFilter.before) : undefined}
                    handleChange={(value) => setDateFilter((prev) => ({ ...prev, before: formatDateInputChange(value) }))}
                  />
                </div>
              </div>
              <div className="w-full lg:w-[250px]">
                <SelectInput
                  width={'100%'}
                  label={'CAMPO DE FILTRO'}
                  value={dateFilter.field}
                  options={[
                    {
                      id: 1,
                      label: 'DATA DE CONCLUSÃO',
                      value: 'dataDeConclusao',
                    },
                    {
                      id: 2,
                      label: 'DATA DE ABERTURA',
                      value: 'dataDeAbertura',
                    },
                  ]}
                  selectedItemLabel={'SEM FILTRO'}
                  handleChange={(value) => setDateFilter((prev) => ({ ...prev, field: value }))}
                  onReset={() => setDateFilter((prev) => ({ ...prev, field: null }))}
                />
              </div>
            </div>
            <FilterButton text={'FILTRAR'} icon={<AiOutlineSearch />} handleClick={filterForms} />
          </div>
        </div>
        <div className="flex flex-wrap justify-around gap-3 mt-4">
          {filteredForms ? (
            filteredForms?.map((form) => (
              <div
                onClick={() => {
                  // setModal({ open: true, form: form });
                  handleOpenModal(form._id)
                }}
                key={form._id}
                className={`${getCardColor(form.status)} ${getPendenceStatusBorder(
                  form.tipoDeLaudo,
                  dayjs().diff(dayjs(form.dataDeAbertura), 'hours'),
                  form.status
                )} w-full md:w-[350px] lg:w-[450px] cursor-pointer border border-gray-200 hover:bg-blue-100 flex flex-col`}
              >
                <div className={`bg-[#15599a] text-[#fead61] text-xs font-bold text-center rounded-br-lg rounded-bl-lg`}>
                  {form.tipoDeSolicitacao ? form.tipoDeSolicitacao : 'NÃO DEFINIDO'}
                </div>
                <div className="flex flex-col p-3">
                  <div className="flex justify-center">
                    <h1 className="text-xs text-[#15599a] font-bold">{form.nomeDoCliente}</h1>
                    {form.solicitacaoContrato && (
                      <BsPatchCheckFill
                        style={{
                          fontSize: '20px',
                          color: 'rgb(21 128 61)',
                          marginLeft: '10px',
                        }}
                      />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col items-center">
                      <p className="text-xxs text-gray-700">CIDADE</p>
                      <p className="text-xs text-gray-700 font-bold">{form.cidade}</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <p className="text-xxs text-gray-700">VENDEDOR</p>
                      <p className="text-xs text-gray-700 font-bold">{form.nomeVendedor}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col items-center">
                      <p className="text-xxs text-gray-700">TIPO DE LAUDO</p>
                      <p className="text-xs text-gray-700 font-bold">{form.tipoDeLaudo}</p>
                    </div>
                    <div
                      className={`flex flex-col ${getPendenceStatusText(
                        form.tipoDeLaudo,
                        dayjs().diff(dayjs(form.dataDeAbertura), 'hours'),
                        form.status
                      )} items-center mt-2`}
                    >
                      <p className="text-xxs">{form.dataDeConclusao ? 'TEMPO ATÉ CONCLUSÃO' : 'TEMPO DESDE ABERTURA'}</p>
                      <p className="text-xs font-bold">
                        {form.dataDeConclusao
                          ? dayjs(form.dataDeConclusao).diff(dayjs(form.dataDeAbertura), 'hours')
                          : dayjs().diff(dayjs(form.dataDeAbertura), 'hours')}{' '}
                        HORAS
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="text-xxs text-gray-700">ABERTURA</p>
                    <p className="text-xs text-gray-700 font-bold">{form.dataDeAbertura ? new Date(form.dataDeAbertura).toLocaleString() : '-'}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <LoadingPage />
          )}
          {modal.open && (
            <ModalVisitaTecnica info={modal.form} setModalIsOpen={() => setModal({ ...modal, open: false })} handleUpdates={getProjects} />
          )}
        </div>
      </div>
    )
  }
}

export default VisitaTecnica
