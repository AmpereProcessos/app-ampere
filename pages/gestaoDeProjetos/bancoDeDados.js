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

import { cidadesAtendidas, customersAcquisitionChannels, equipesTecnicas, vendedores } from '../../utils/constants'
import { allSellers, insiders } from '../../utils/select-options'
import MultipleSelectInput from '../../components/inputs/MultipleSelect'
function BandoDeDados({ data }) {
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/authHome')
    },
  })

  const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false)

  // Data
  const [projects, setProjects] = useState()
  const [filteredProjects, setFilteredProjects] = useState()

  // Modal Control
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [modalProject, setModalProject] = useState({})

  // Filters
  const [searchFilter, setSearchFilter] = useState('')
  const [opInProgress, setOpInProgress] = useState(false)
  const [dateFilter, setDateFilter] = useState({
    after: null,
    before: null,
    field1: null,
    field2: null,
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

  // Functions
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
  // function handleSearchFilter(value) {
  //   setSearchFilter(value);
  //   if (value != "" || " ") {
  //     let newArr = projects.filter((call) =>
  //       call.nomeDoContrato.toUpperCase().includes(value.toUpperCase())
  //     );
  //     setFilteredProjects(newArr);
  //   } else {
  //     setFilteredProjects(projects);
  //   }
  // }
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
    axios.get(`/api/projects/fetchDoc/${id}`).then((res) => {
      setModalProject(res.data[0])
      setModalIsOpen(true)
    })
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
      <div className="p-6 grow">
        <div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-wrap justify-center items-center gap-2 font-['Roboto']">
              <p className="font-bold uppercase text-center text-2xl text-[#15599a]">BANCO DE DADOS</p>
              {filteredProjects && <p className="font-bold text-[#fead61]">({filteredProjects?.length})</p>}
            </div>
            {dropdownMenuVisible ? (
              <div className="text-gray-600 hover:text-blue-400 cursor-pointer">
                <IoMdArrowDropupCircle style={{ fontSize: '25px' }} onClick={() => setDropdownMenuVisible(false)} />
              </div>
            ) : (
              <div className="text-gray-600 hover:text-blue-400 cursor-pointer">
                <IoMdArrowDropdownCircle style={{ fontSize: '25px' }} onClick={() => setDropdownMenuVisible(true)} />
              </div>
            )}
          </div>
          <AnimatePresence>
            {dropdownMenuVisible ? (
              <motion.div initial={{ scale: 0.8, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col w-full gap-y-2 mt-4">
                <div className="flex flex-col lg:flex-row items-center justify-center gap-2 flex-wrap">
                  <TextInput
                    label="NOME DO CONTRATO"
                    placeholder="Digite o nome do contrato..."
                    handleChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
                    value={filters.search}
                  />
                  <div className="flex flex-col lg:flex-row gap-2 w-full lg:w-fit">
                    <div className="flex items-center gap-x-2 justify-center">
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
                <div className="flex flex-col lg:flex-row items-center justify-center gap-2 flex-wrap">
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
                <div className="flex flex-col lg:flex-row items-center justify-center gap-2 flex-wrap">
                  <div
                    onClick={() =>
                      setFilters({
                        ...filters,
                        missingDocumentationSignature: !filters.missingDocumentationSignature,
                      })
                    }
                    className={`${
                      filters.missingDocumentationSignature ? 'bg-[#15599a]' : 'bg-blue-300'
                    } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
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
                  className="px-3 py-2 cursor-pointer ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700"
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
                  className={`px-3 py-2 cursor-pointer ${
                    currentPage == 1
                      ? 'text-blue-700 bg-blue-300 hover:text-blue-500 hover:bg-blue-100'
                      : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700'
                  } leading-tight  border border-gray-300`}
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
                  className={`px-3 py-2 cursor-pointer ${
                    currentPage == 2
                      ? 'text-blue-700 bg-blue-300 hover:text-blue-500 hover:bg-blue-100'
                      : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700'
                  } leading-tight  border border-gray-300`}
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
                  className={`px-3 py-2 cursor-pointer ${
                    currentPage == 3
                      ? 'text-blue-700 bg-blue-300 hover:text-blue-500 hover:bg-blue-100'
                      : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700'
                  } leading-tight  border border-gray-300`}
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
                  className={`px-3 py-2 cursor-pointer ${
                    currentPage == 4
                      ? 'text-blue-700 bg-blue-300 hover:text-blue-500 hover:bg-blue-100'
                      : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700'
                  } leading-tight  border border-gray-300`}
                >
                  4
                </a>
              </li>
              <li>
                <a
                  onClick={() => {
                    if (currentPage == 4) return
                    getProjects(currentPage + 1)
                    setCurrentPage((prevState) => prevState + 1)
                  }}
                  className="px-3 py-2 cursor-pointer leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700"
                >
                  Próximo
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex  justify-around gap-3 mt-4 flex-wrap">
          {!filteredProjects ? (
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
                className="w-full md:w-[250px] lg:w-[450px]  cursor-pointer border border-gray-200 p-3 hover:bg-blue-100"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-700">{project.nomeDoContrato}</p>
                  <p className="text-xs text-[#15599a]">#{project.qtde}</p>
                </div>
                <div className="flex items-center mt-2 justify-between">
                  <div className="flex flex-col">
                    <span className="text-xxs">CIDADE</span>
                    <p className="text-xs text-yellow-500">{project.cidade && project.cidade}</p>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xxs">VENDEDOR</span>
                    <p className="text-xs text-[#15599a]">{project.vendedor && project.vendedor.nome}</p>
                  </div>
                </div>
                <div className="flex items-center mt-2 justify-between">
                  <p className="text-xs text-gray-700">TIPO DE SERVIÇO</p>
                  <p className="text-xs text-gray-700 font-bold">{project.tipoDeServico ? project.tipoDeServico : '-'}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>
        {modalIsOpen && (
          <ModalDB
            project={modalProject}
            handleUpdates={handleUpdates}
            editor={
              session?.user != {} &&
              !session?.user.visualizacao &&
              ['Projetos', 'Obras', 'Suprimentos', 'O&M', 'Marketing', 'Vendas', 'Pós-Venda', 'PPS', 'InsideSales', 'Financeiro', 'ADM', 'RH'].every(
                (el) => session?.user.accessibleRoutes.includes(el)
              )
                ? true
                : false
            }
            setModalIsOpen={setModalIsOpen}
          />
        )}
      </div>
    )
  }
}

export default BandoDeDados
