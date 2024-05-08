import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'

import ModalDB from '../../components/ModalDB'

import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'
import { AiOutlineSearch } from 'react-icons/ai'

import DateInput from '../../components/inputs/Date'
import SelectInput from '../../components/inputs/Select'
import TextInput from '../../components/inputs/Text'
import LoadingPage from '../../components/utils/LoadingPage'
import FilterButton from '../../components/utils/Buttons/FilterButton'

import { cidadesAtendidas, equipesTecnicas, formatDate, vendedores } from '../../utils/constants'
import { allSellers, customersAcquisitionChannels, insiders } from '../../utils/select-options'
import MultipleSelectInput from '../../components/inputs/MultipleSelect'
import { formatDateInputChange } from '../../utils/methods/shared'
function BandoDeDados({ data }) {
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/signin')
    },
  })

  const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false)

  // Data
  const [projects, setProjects] = useState()
  const [filteredProjects, setFilteredProjects] = useState()
  const [opInProgress, setOpInProgress] = useState(false)
  // Modal Control

  const [modalProject, setModalProject] = useState({
    isOpen: false,
    projectId: null,
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    search: '',
    date: {
      after: null,
      before: null,
      field1: null,
      field2: null,
    },
    acquisitionChannels: [],
    city: [],
    sellerName: [],
    insider: [],
    technicalTeam: [],
    missingDocumentationSignature: false,
    cidadeFilter: [],
    vendedorFilter: [],
    equipeFilter: [],
    entregaTecnicaFeita: false,
    condicaoOeM: 'TODOS',
    insider: [],
    canal: [],
    numModulos: null,
    nps: null,
  })

  function getProjects(page) {
    setOpInProgress(true)
    axios
      .get(`/api/projects/bancoDeDados?page=${page}`)
      .then((res) => {
        setProjects(res.data)
        setFilteredProjects(res.data)
        setOpInProgress(false)
      })
      .catch((err) => console.log(err))
  }
  function handleGetByFilters() {
    var matchObj
    // Initializing query params given selected filters
    matchObj = {
      nomeDoContrato: filters.search.length > 0 ? { $regex: filters.search.toUpperCase() } : { $ne: null },
      cidade: filters.city.length > 0 ? { $in: filters.city } : { $ne: null },
      canalVenda: filters.acquisitionChannels.length > 0 ? { $in: filters.acquisitionChannels } : { $ne: '' },
      'vendedor.nome': filters.sellerName.length > 0 ? { $in: filters.sellerName } : { $ne: null },
      insider: filters.insider.length > 0 ? { $in: filters.insider } : { $ne: '' },
      'obra.equipeResp': filters.technicalTeam.length > 0 ? { $in: filters.technicalTeam } : { $ne: '' },
      [`${filters.date.field1 ? `${[filters.date.field1]}.${[filters.date.field2]}` : 'qtde'}`]: filters.date.field1
        ? {
            $gte: filters.date.after,
            $lte: filters.date.before,
          }
        : { $ne: null },
    }
    // Adding additional params when missing documentation signature filter is active
    if (filters.missingDocumentationSignature) {
      matchObj = {
        ...matchObj,
        $and: [{ 'projeto.dataLiberacaoDocumentacao': { $ne: null } }, { 'projeto.dataAssDocumentacao': null }],
      }
    }

    setOpInProgress(true)
    axios.post('/api/projects/bancoDeDados', matchObj).then((res) => {
      setFilteredProjects(res.data)
      setProjects(res.data)
      setCurrentPage(0)
      setOpInProgress(false)
    })
  }
  function handleUpdates(id) {
    axios.get(`/api/projects/fetchDoc/${id}`).then((res) => setModalProject(res.data[0]))
  }
  function handleOpenModal(id) {
    setModalProject({ isOpen: true, projectId: id })
  }
  useEffect(() => {
    if (session?.user) {
      if (!projects) {
        setCurrentPage(1)
        getProjects(1)
      }
    }
  }, [session])
  console.log(filteredProjects?.map((project) => project.qtde))
  if (status == 'loading') return <LoadingPage />
  if (status == 'authenticated') {
    return (
      <div className="grow p-6">
        <div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col items-center gap-2 lg:flex-row">
              <p className="text-center text-2xl font-black uppercase text-[#15599a]">
                BANCO DE DADOS <strong className="text-[#fead41]">({filteredProjects?.length || '...'})</strong>
              </p>
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
                  <TextInput
                    label="NOME DO CONTRATO"
                    placeholder="Digite o nome do contrato..."
                    handleChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
                    value={filters.search}
                  />
                  <div className="flex w-full flex-col gap-2 lg:w-fit lg:flex-row">
                    <div className="flex items-center justify-center gap-x-2">
                      <div className="w-full lg:w-[250px]">
                        <DateInput
                          width={'100%'}
                          label={'DEPOIS DE'}
                          value={filters.date.after ? formatDate(filters.date.after) : undefined}
                          handleChange={(value) => setFilters((prev) => ({ ...prev, date: { ...prev.date, after: formatDateInputChange(value) } }))}
                        />
                      </div>
                      <div className="w-full lg:w-[250px]">
                        <DateInput
                          width={'100%'}
                          label={'ANTES DE'}
                          value={filters.date.before ? formatDate(filters.date.before) : undefined}
                          handleChange={(value) => setFilters((prev) => ({ ...prev, date: { ...prev.date, before: formatDateInputChange(value) } }))}
                        />
                      </div>
                    </div>
                    <div className="w-full lg:w-[250px]">
                      <SelectInput
                        width={'100%'}
                        label={'CAMPO DE FILTRO'}
                        value={filters.date.field1 && filters.date.field2 ? `${filters.date.field1}.${filters.date.field2}` : null}
                        options={[
                          { id: 1, label: 'SAÍDA DE OBRA', value: 'obra.saida' },
                          { id: 2, label: 'DATA DE SOLICITAÇÃO DO PARECER', value: 'projeto.dataSolicitacaoAcesso' },
                          { id: 3, label: 'DATA DO PARECER', value: 'parecer.dataParecerDeAcesso' },
                          { id: 4, label: 'DATA ASS.CONTRATO', value: 'contrato.dataAssinatura' },
                          { id: 5, label: 'DATA DE ENTREGA', value: 'compra.dataEntrega' },
                          { id: 6, label: 'DATA DE PREV.ENTREGA', value: 'compra.previsaoEntrega' },
                          { id: 7, label: 'DATA PAG.KIT', value: 'compra.dataPagamento' },
                          { id: 8, label: 'TROCA DO MEDIDOR', value: 'medidor.data' },
                          { id: 9, label: 'PEDIDO DE VISTORIA', value: 'vistoria.dataPedido' },
                          { id: 10, label: 'DATA PEDIDO', value: 'compra.dataPedido' },
                          { id: 11, label: 'NÃO DEFINIDO', value: null },
                        ]}
                        selectedItemLabel={'SEM FILTRO'}
                        handleChange={(value) =>
                          setFilters((prev) => ({
                            ...prev,
                            date: {
                              ...prev.date,
                              field1: value != null ? value.split('.')[0] : null,
                              field2: value != null ? value.split('.')[1] : null,
                            },
                          }))
                        }
                        onReset={() =>
                          setFilters((prev) => ({
                            ...prev,
                            date: {
                              after: null,
                              before: null,
                              field1: null,
                              field2: null,
                            },
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col flex-wrap items-center justify-center gap-2 lg:flex-row">
                  <div className="w-full lg:w-[250px]">
                    <MultipleSelectInput
                      width={'100%'}
                      label={'CIDADE'}
                      selected={filters.city}
                      options={cidadesAtendidas.map((city, index) => ({ id: index + 1, label: city, value: city }))}
                      selectedItemLabel={'SEM FILTRO'}
                      handleChange={(value) =>
                        setFilters((prev) => ({
                          ...prev,
                          city: value,
                        }))
                      }
                      onReset={() =>
                        setFilters((prev) => ({
                          ...prev,
                          city: [],
                        }))
                      }
                    />
                  </div>
                  <div className="w-full lg:w-[250px]">
                    <MultipleSelectInput
                      width={'100%'}
                      label={'CANAL DE AQUISIÇÃO'}
                      selected={filters.acquisitionChannels}
                      options={customersAcquisitionChannels}
                      selectedItemLabel={'SEM FILTRO'}
                      handleChange={(value) =>
                        setFilters((prev) => ({
                          ...prev,
                          acquisitionChannels: value,
                        }))
                      }
                      onReset={() =>
                        setFilters((prev) => ({
                          ...prev,
                          acquisitionChannels: [],
                        }))
                      }
                    />
                  </div>
                  <div className="w-full lg:w-[250px]">
                    <MultipleSelectInput
                      width={'100%'}
                      label={'VENDEDOR'}
                      selected={filters.sellerName}
                      options={allSellers}
                      selectedItemLabel={'SEM FILTRO'}
                      handleChange={(value) =>
                        setFilters((prev) => ({
                          ...prev,
                          sellerName: value,
                        }))
                      }
                      onReset={() =>
                        setFilters((prev) => ({
                          ...prev,
                          sellerName: [],
                        }))
                      }
                    />
                  </div>
                  <div className="w-full lg:w-[250px]">
                    <MultipleSelectInput
                      width={'100%'}
                      label={'INSIDER'}
                      selected={filters.insider}
                      options={insiders}
                      selectedItemLabel={'SEM FILTRO'}
                      handleChange={(value) =>
                        setFilters((prev) => ({
                          ...prev,
                          insider: value,
                        }))
                      }
                      onReset={() =>
                        setFilters((prev) => ({
                          ...prev,
                          insider: [],
                        }))
                      }
                    />
                  </div>
                  <div className="w-full lg:w-[250px]">
                    <MultipleSelectInput
                      width={'100%'}
                      label={'EQUIPE RESPONSÁVEL'}
                      selected={filters.technicalTeam}
                      options={equipesTecnicas.map((team, index) => ({ id: index + 1, label: team.label, value: team.value }))}
                      selectedItemLabel={'SEM FILTRO'}
                      handleChange={(value) =>
                        setFilters((prev) => ({
                          ...prev,
                          technicalTeam: value,
                        }))
                      }
                      onReset={() =>
                        setFilters((prev) => ({
                          ...prev,
                          technicalTeam: [],
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="flex flex-col flex-wrap items-center justify-center gap-2 lg:flex-row">
                  <div
                    onClick={() =>
                      setFilters({
                        ...filters,
                        missingDocumentationSignature: !filters.missingDocumentationSignature,
                      })
                    }
                    className={`${
                      filters.missingDocumentationSignature ? 'bg-[#15599a]' : 'bg-blue-300'
                    } flex h-[36px] cursor-pointer items-center justify-center rounded px-2 font-bold text-white`}
                  >
                    ASS.DOCUMENTAÇÃO PENDENTE
                  </div>
                </div>
                <div className="flex items-center justify-end gap-x-2">
                  <FilterButton text={'FILTRAR'} icon={<AiOutlineSearch />} handleClick={handleGetByFilters} />
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
          <nav className="my-4" aria-label="Page navigation example">
            <ul className="inline-flex -space-x-px">
              <li>
                <a
                  onClick={() => {
                    if (currentPage == 1) return
                    getProjects(currentPage - 1)
                    setCurrentPage((prevState) => prevState - 1)
                  }}
                  className="ml-0 cursor-pointer rounded-l-lg border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                >
                  Anterior
                </a>
              </li>
              <li>
                <a
                  onClick={() => {
                    if (currentPage != 1) {
                      setCurrentPage(1)
                      getProjects(1)
                    } else return
                  }}
                  className={`cursor-pointer px-3 py-2 ${
                    currentPage == 1
                      ? 'bg-blue-300 text-blue-700 hover:bg-blue-100 hover:text-blue-500'
                      : 'bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                  } border  border-gray-300 leading-tight`}
                >
                  1
                </a>
              </li>
              <li>
                <a
                  onClick={() => {
                    if (currentPage != 2) {
                      setCurrentPage(2)
                      getProjects(2)
                    } else return
                  }}
                  className={`cursor-pointer px-3 py-2 ${
                    currentPage == 2
                      ? 'bg-blue-300 text-blue-700 hover:bg-blue-100 hover:text-blue-500'
                      : 'bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                  } border  border-gray-300 leading-tight`}
                >
                  2
                </a>
              </li>
              <li>
                <a
                  onClick={() => {
                    if (currentPage != 3) {
                      setCurrentPage(3)
                      getProjects(3)
                    } else return
                  }}
                  className={`cursor-pointer px-3 py-2 ${
                    currentPage == 3
                      ? 'bg-blue-300 text-blue-700 hover:bg-blue-100 hover:text-blue-500'
                      : 'bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                  } border  border-gray-300 leading-tight`}
                >
                  3
                </a>
              </li>
              <li>
                <a
                  onClick={() => {
                    if (currentPage != 4) {
                      setCurrentPage(4)
                      getProjects(4)
                    } else return
                  }}
                  className={`cursor-pointer px-3 py-2 ${
                    currentPage == 4
                      ? 'bg-blue-300 text-blue-700 hover:bg-blue-100 hover:text-blue-500'
                      : 'bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                  } border  border-gray-300 leading-tight`}
                >
                  4
                </a>
              </li>
              <li>
                <a
                  onClick={() => {
                    if (currentPage != 5) {
                      setCurrentPage(5)
                      getProjects(5)
                    } else return
                  }}
                  className={`cursor-pointer px-3 py-2 ${
                    currentPage == 5
                      ? 'bg-blue-300 text-blue-700 hover:bg-blue-100 hover:text-blue-500'
                      : 'bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                  } border  border-gray-300 leading-tight`}
                >
                  5
                </a>
              </li>
              <li>
                <a
                  onClick={() => {
                    if (currentPage == 5) return
                    getProjects(currentPage + 1)
                    setCurrentPage((prevState) => prevState + 1)
                  }}
                  className="cursor-pointer rounded-r-lg border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                >
                  Próximo
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="mt-4  flex flex-wrap justify-around gap-3">
          {!filteredProjects ? (
            <div role="status">
              <svg
                aria-hidden="true"
                className="mr-2 h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          ) : (
            filteredProjects.map((project, index) => (
              <motion.div
                onClick={() => {
                  handleOpenModal(project._id)
                }}
                initial={{ opacity: 0, translateX: -50 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ duration: 0.3, delay: 0.01 * index }}
                key={project._id}
                className="w-full cursor-pointer border  border-gray-200 p-3 hover:bg-blue-100 md:w-[250px] lg:w-[450px]"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-700">{project.nomeDoContrato}</p>
                  <p className="text-xs text-[#15599a]">#{project.qtde}</p>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xxs">CIDADE</span>
                    <p className="text-xs text-yellow-500">{project.cidade && project.cidade}</p>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xxs">VENDEDOR</span>
                    <p className="text-xs text-[#15599a]">{project.vendedor && project.vendedor.nome}</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-gray-700">TIPO DE SERVIÇO</p>
                  <p className="text-xs font-bold text-gray-700">{project.tipoDeServico ? project.tipoDeServico : '-'}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>
        {modalProject.isOpen && modalProject.projectId && (
          <ModalDB
            projectId={modalProject.projectId}
            handleUpdates={handleUpdates}
            closeModal={() => setModalProject({ isOpen: false, projectId: null })}
            modalIsOpen={modalProject.isOpen}
          />
        )}
      </div>
    )
  }
}

export default BandoDeDados
