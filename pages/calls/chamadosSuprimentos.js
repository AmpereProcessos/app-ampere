import axios from 'axios'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'
import { AiOutlineReload, AiOutlineSearch } from 'react-icons/ai'
import ModalCallSuprimentos from '../../components/ModalCallSuprimentos'
import FetchDataButton from '../../components/utils/Buttons/FetchDataButton'
import { AnimatePresence, motion } from 'framer-motion'
import Select from 'react-select'
import { fornecedores } from '../../utils/constants'
import FilterButton from '../../components/utils/Buttons/FilterButton'
import { useSession } from 'next-auth/react'
import LoadingPage from '../../components/utils/LoadingPage'

const statusStyles = {
  ABERTO: {
    text: 'text-yellow-500',
    border: 'border-yellow-500',
  },
  'EM ANDAMENTO': {
    text: 'text-[#15599a]',
    border: 'border-[#15599a]',
  },
}
function ChamadosSuprimentos() {
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/authHome')
    },
  })

  //DropDowns
  const [openCallsDropdownMenuVisible, setOpenCallsDropdownMenuVisible] = useState(false)
  const [closedCallsDropdownMenuVisible, setClosedCallsDropdownMenuVisible] = useState(false)

  // Data
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [modalCall, setModalCall] = useState({})

  const [openCalls, setOpenCalls] = useState({
    general: undefined,
    filtered: undefined,
  })
  const [openCallsFilters, setOpenCallsFilters] = useState({
    search: '',
    supplier: [],
  })

  const [closedCalls, setClosedCalls] = useState({
    general: undefined,
    filtered: undefined,
  })
  const [closedCallsFilters, setClosedCallsFilters] = useState({
    search: '',
    supplier: [],
  })

  // Fetch Functions
  function getCalls() {
    axios.get('/api/chamados/suprimentos/mainData').then((res) => {
      setOpenCalls({
        general: res.data.abertos,
        filtered: res.data.abertos,
      })
      setClosedCalls({
        general: res.data.fechados,
        filtered: res.data.fechados,
      })
    })
  }
  function filterOpenCalls() {
    var newArr
    if (openCallsFilters.supplier.length > 0) {
      if (!newArr) newArr = openCalls.general
      newArr = newArr.filter((call) => openCallsFilters.supplier.includes(call.fornecedor))
    }

    if (!newArr) {
      setOpenCalls({ ...openCalls, filtered: openCalls.general })
      return openCalls.general
    } else {
      setOpenCalls({ ...openCalls, filtered: newArr })
      return newArr
    }
  }
  function filterClosedCalls() {
    var newArr
    if (closedCallsFilters.supplier.length > 0) {
      if (!newArr) newArr = closedCalls.general
      newArr = newArr.filter((call) => closedCallsFilters.supplier.includes(call.fornecedor))
    }

    if (!newArr) {
      setClosedCalls({ ...closedCalls, filtered: closedCalls.general })
      return closedCalls.general
    } else {
      setClosedCalls({ ...closedCalls, filtered: newArr })
      return newArr
    }
  }

  function handleOpenCallsSearchFilter(value) {
    setOpenCallsFilters({ ...openCallsFilters, search: value })
    var filtered = filterOpenCalls()
    if (value.trim().length > 0) {
      var newArr = [...filtered].filter((call) => call.nomeDoContrato.toUpperCase().includes(openCallsFilters.search.toUpperCase()))
      setOpenCalls({ ...openCalls, filtered: newArr })
    } else {
      setOpenCalls({ ...openCalls, filtered: filtered })
    }
  }
  function handleClosedCallsSearchFilter(value) {
    setClosedCallsFilters({ ...closedCallsFilters, search: value })
    var filtered = filterClosedCalls()
    if (value.trim().length > 0) {
      var newArr = [...filtered].filter((call) => call.nomeDoContrato.toUpperCase().includes(closedCallsFilters.search.toUpperCase()))
      setClosedCalls({ ...closedCalls, filtered: newArr })
    } else {
      setClosedCalls({ ...closedCalls, filtered: filtered })
    }
  }
  // Utils functions
  function handleOpenModal(info) {
    setModalCall(info)
    setModalIsOpen(true)
  }
  useEffect(() => {
    if (session?.user.accessibleRoutes.includes('Suprimentos')) {
      if (!openCalls.general) {
        getCalls()
      }
    } else {
      if (session?.user) {
        router.push('/')
      }
    }
  }, [session])
  if (status == 'loading') return <LoadingPage />
  if (status == 'authenticated') {
    return (
      <div className="flex flex-col gap-y-2 bg-gray-100 grow p-6 w-full">
        <div className="flex items-center justify-between w-full border border-gray-200 bg-[#fff] shadow-xl p-4">
          <p className="font-bold uppercase text-center text-2xl text-[#15599a] font-['Roboto']">CHAMADOS DE SUPRIMENTOS</p>
          <FetchDataButton text={'ATUALIZAR'} icon={<AiOutlineReload />} handleClick={getCalls} />
        </div>
        {/**Abertos */}
        <div className="flex flex-col w-full border h-[1200px] lg:h-[720px] border-gray-200 bg-[#fff] shadow-xl p-4">
          <div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-wrap justify-center items-center gap-2 font-['Roboto']">
                <p className="text-center uppercase text-[#15599a] font-bold text-xl">CHAMADOS ABERTOS</p>
                <p className="font-bold text-[#fead61]">({openCalls.filtered?.length})</p>
              </div>
              {openCallsDropdownMenuVisible ? (
                <div className="text-gray-600 hover:text-blue-400 cursor-pointer">
                  <IoMdArrowDropupCircle style={{ fontSize: '25px' }} onClick={() => setOpenCallsDropdownMenuVisible(false)} />
                </div>
              ) : (
                <div className="text-gray-600 hover:text-blue-400 cursor-pointer">
                  <IoMdArrowDropdownCircle style={{ fontSize: '25px' }} onClick={() => setOpenCallsDropdownMenuVisible(true)} />
                </div>
              )}
            </div>
            <AnimatePresence>
              {openCallsDropdownMenuVisible ? (
                <motion.div initial={{ scale: 0.8, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col w-full gap-y-2 mt-4">
                  <div className="flex flex-col lg:flex-row items-center justify-center gap-2 flex-wrap">
                    <input
                      type="text"
                      value={openCallsFilters.search}
                      onChange={(e) => handleOpenCallsSearchFilter(e.target.value)}
                      className="outline-none p-1.5  w-full lg:w-[350px] h-[41px] rounded border border-gray-200 placeholder:italic"
                      placeholder="DIGITE O NOME DO CONTRATO"
                    />
                    <div className="w-full lg:w-[250px]">
                      <Select
                        isMulti
                        placeholder="FORNECEDORES"
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            width: '100%',
                            minHeight: '41px',
                          }),
                        }}
                        onChange={(e) =>
                          setOpenCallsFilters({
                            ...openCallsFilters,
                            supplier: e.map((x) => x.value),
                          })
                        }
                        options={fornecedores.map((supplier) => supplier)}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    <FilterButton text={'FILTRAR'} icon={<AiOutlineSearch />} handleClick={filterOpenCalls} />
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
          <div className="flex grow overflow-y-auto overscroll-y scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 mt-2 flex-wrap gap-2 justify-around">
            {openCalls.filtered ? (
              openCalls.filtered?.length > 0 ? (
                openCalls.filtered.map((chamado) => (
                  <div
                    key={chamado._id}
                    onClick={() => handleOpenModal(chamado)}
                    className={`w-[420px] h-[200px] cursor-pointer border border-gray-200 p-3 hover:bg-blue-100`}
                  >
                    <div className="flex justify-between gap-3 items-center w-full">
                      <h1 className="uppercase text-base font-bold">
                        <strong className="text-[#15599a]">{chamado.codigoProjeto}</strong> {chamado.nomeDoContrato}
                      </h1>
                      <p
                        className={`text-xs text-center font-bold border-2 ${statusStyles[chamado.status].text} ${
                          statusStyles[chamado.status].border
                        } p-1 rounded-lg`}
                      >
                        {chamado.status}
                      </p>
                    </div>
                    <div className="flex justify-between mt-3">
                      <p className="text-gray-500 font-bold text-xs">FORNECEDOR</p>
                      <p className="text-[#fead61] font-bold text-xs">{chamado.fornecedor}</p>
                    </div>
                    <div className="flex justify-between mt-3">
                      <p className="text-gray-500 font-bold text-xs">AVARIAS</p>
                      <p className="text-red-500 font-bold text-xs">{chamado.avarias ? 'SIM' : 'NÃO'}</p>
                    </div>
                    <div className="flex justify-between mt-3">
                      <p className="text-gray-500 font-bold text-xs">MATERIAL FALTANDO</p>
                      <p className="text-red-500 font-bold text-xs">{chamado.entregaFaltando ? 'SIM' : 'NÃO'}</p>
                    </div>
                    <div className="flex justify-between mt-3">
                      <div className="flex flex-col items-center">
                        <p className="text-gray-500 font-bold text-xs">DATA DE ENTREGA</p>
                        <p className="text-red-500 font-bold text-xs">
                          {chamado.dataEntrega ? dayjs(chamado.dataEntrega).format('DD/MM/YYYY') : '-'}
                        </p>
                      </div>
                      <div className="flex flex-col items-center">
                        <p className="text-gray-500 font-bold text-xs">DIAS DESDE ENTREGA</p>
                        <p className="text-gray-500 font-bold text-xs">
                          {chamado.dataEntrega ? dayjs().diff(new Date(chamado.dataEntrega), 'days') : '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center italic text-gray-700">SEM CHAMADOS ABERTOS</p>
              )
            ) : (
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
            )}
          </div>
        </div>
        {/**Fechados */}
        <div className="flex flex-col w-full border h-[1200px] lg:h-[720px] border-gray-200 bg-[#fff] shadow-xl p-4">
          <div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-wrap justify-center items-center gap-2 font-['Roboto']">
                <p className="text-center uppercase text-[#15599a] font-bold text-xl">CHAMADOS FINALIZADOS</p>
                <p className="font-bold text-[#fead61]">({closedCalls.filtered?.length})</p>
              </div>
              {closedCallsDropdownMenuVisible ? (
                <div className="text-gray-600 hover:text-blue-400 cursor-pointer">
                  <IoMdArrowDropupCircle style={{ fontSize: '25px' }} onClick={() => setClosedCallsDropdownMenuVisible(false)} />
                </div>
              ) : (
                <div className="text-gray-600 hover:text-blue-400 cursor-pointer">
                  <IoMdArrowDropdownCircle style={{ fontSize: '25px' }} onClick={() => setClosedCallsDropdownMenuVisible(true)} />
                </div>
              )}
            </div>
            <AnimatePresence>
              {closedCallsDropdownMenuVisible ? (
                <motion.div initial={{ scale: 0.8, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col w-full gap-y-2 mt-4">
                  <div className="flex flex-col lg:flex-row items-center justify-center gap-2 flex-wrap">
                    <input
                      type="text"
                      value={closedCallsFilters.search}
                      onChange={(e) => handleClosedCallsSearchFilter(e.target.value)}
                      className="outline-none p-1.5  w-full lg:w-[350px] h-[41px] rounded border border-gray-200 placeholder:italic"
                      placeholder="DIGITE O NOME DO CONTRATO"
                    />
                    <div className="w-full lg:w-[250px]">
                      <Select
                        isMulti
                        placeholder="FORNECEDORES"
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            width: '100%',
                            minHeight: '41px',
                          }),
                        }}
                        onChange={(e) =>
                          setClosedCallsFilters({
                            ...closedCallsFilters,
                            supplier: e.map((x) => x.value),
                          })
                        }
                        options={fornecedores.map((supplier) => supplier)}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    <FilterButton text={'FILTRAR'} icon={<AiOutlineSearch />} handleClick={filterClosedCalls} />
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
          <div className="flex justify-around flex-wrap gap-2 w-full h-[600px] p-4 overflow-y-auto overscroll-y scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {closedCalls.filtered ? (
              closedCalls.filtered?.length > 0 ? (
                closedCalls.filtered.map((chamado) => (
                  <div
                    onClick={() => handleOpenModal(chamado)}
                    key={chamado._id}
                    className={`w-[420px] h-[200px] cursor-pointer border border-gray-200 p-3 hover:bg-blue-100`}
                  >
                    <div className="flex justify-between gap-3 items-center w-full">
                      <h1 className="uppercase text-base font-bold">
                        <strong className="text-[#15599a]">{chamado.codigoProjeto}</strong> {chamado.nomeDoContrato}
                      </h1>
                      <p className={`text-xs text-center font-bold border-2 border-green-500 text-green-500 p-1 rounded-lg`}>{chamado.status}</p>
                    </div>
                    <div className="flex justify-between mt-3">
                      <p className="text-gray-500 font-bold text-xs">FORNECEDOR</p>
                      <p className="text-[#15599a] font-bold text-xs">{chamado.fornecedor}</p>
                    </div>
                    <div className="flex justify-between mt-3">
                      <p className="text-gray-500 font-bold text-xs">DATA DE ENTREGA</p>
                      <p className="text-[#15599a] font-bold text-xs">
                        {chamado.dataEntrega ? dayjs(chamado.dataEntrega).format('DD/MM/YYYY') : '-'}
                      </p>
                    </div>
                    <div className="flex justify-between mt-3">
                      <p className="text-gray-500 font-bold text-xs">AVARIAS</p>
                      <p className="text-red-500 font-bold text-xs">{chamado.avarias ? 'SIM' : 'NÃO'}</p>
                    </div>
                    <div className="flex justify-between mt-3">
                      <p className="text-gray-500 font-bold text-xs">MATERIAL FALTANDO</p>
                      <p className="text-red-500 font-bold text-xs">{chamado.entregaFaltando ? 'SIM' : 'NÃO'}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center italic text-gray-700">SEM CHAMADOS FINALIZADOS</p>
              )
            ) : (
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
            )}
          </div>
        </div>
        {modalIsOpen && (
          <ModalCallSuprimentos info={modalCall} modalIsOpen={modalIsOpen} setModalIsOpen={() => setModalIsOpen(false)} getCalls={getCalls} />
        )}
      </div>
    )
  }
}

export default ChamadosSuprimentos
