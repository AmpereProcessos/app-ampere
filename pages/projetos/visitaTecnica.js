import React, { useEffect, useState } from 'react'
import axios from 'axios'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

import { AiOutlineSearch } from 'react-icons/ai'
import { BsPatchCheckFill } from 'react-icons/bs'

import ModalVisitaTecnica from '../../components/ModalVisitaTecnica'

import LoadingPage from '../../components/utils/LoadingPage'
import FilterButton from '../../components/utils/Buttons/FilterButton'
import TextInput from '../../components/inputs/Text'
import NumberInput from '../../components/inputs/Number'
import MultipleSelectInput from '../../components/inputs/MultipleSelect'
import DateInput from '../../components/inputs/Date'
import SelectInput from '../../components/inputs/Select'

import { formatDate } from '../../utils/constants'
import { technicalAnalysisStatus } from '../../utils/select-options'
import { formatDateInputChange } from '../../utils/methods/shared'
import AnalysisCard from '../../components/identificador/visitasTecnicas/AnalysisCard'

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
              <div className="w-[10px] h-[10px] bg-green-500 rounded" />
              <p>CONCLUIDO</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-[10px] h-[10px] bg-yellow-500 rounded" />
              <p>EM ANÁLISE TÉCNICA</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-[10px] h-[10px] bg-cyan-500 rounded" />
              <p>PENDÊNCIA COMERCIAL</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-[10px] h-[10px] bg-indigo-500 rounded" />
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
            filteredForms?.map((form) => <AnalysisCard key={form._id} analysis={form} handleOpenModal={handleOpenModal} />)
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
