import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import LoadingPage from '../../components/utils/LoadingPage'
import { AiOutlineCalendar, AiOutlineSearch } from 'react-icons/ai'
import { HiIdentification } from 'react-icons/hi'
import { BsBank, BsFolderFill } from 'react-icons/bs'
import { FaSolarPanel, FaUserAlt } from 'react-icons/fa'
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle, IoMdCheckmark } from 'react-icons/io'
import { BsCheck2All } from 'react-icons/bs'
import { AnimatePresence, motion } from 'framer-motion'
import Select from 'react-select'
import { MdEmail } from 'react-icons/md'
import FilterButton from '../../components/utils/Buttons/FilterButton'
import dayjs from 'dayjs'
function CadastrosFenesc() {
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/authHome')
    },
  })
  const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false)
  const [dateFilter, setDateFilter] = useState({
    after: null,
    before: null,
    field: null,
  })
  const [filters, setFilters] = useState({
    efetivado: false,
    naoEfetivado: false,
  })
  const [registers, setRegisters] = useState()
  const [filteredRegisters, setFilteredRegisters] = useState()

  async function sendEmail(email, projectCode) {
    try {
      await axios.post('/api/integracao/email', {
        emailTo: email, // amperecontasareceber@gmail.com
        subject: 'EFETIVAÇÃO DE REGISTRO FENESC',
        message: `Olá, acabo de efetivar o cadastro do projeto ${projectCode} para FENESC. Atenciosamente, Volts.`,
        copy: ['comercial@ampereenergias.com.br'],
      })
    } catch (error) {
      console.log(error)
    }
  }

  async function getRegisters() {
    const { data } = await axios.get('/api/auxiliares/cadastroFenesc')
    setRegisters(data)
    setFilteredRegisters(data)
  }
  async function setEfetivado(id, obj) {
    await axios.put('/api/auxiliares/cadastroFenesc', {
      id: id,
      changes: {
        efetivado: obj.efetivado ? !obj.efetivado : true,
        dataEfetivacao: new Date().toISOString(),
      },
    })
    await sendEmail(obj.emailVendedor, obj.codigoSVB)
    getRegisters()
  }
  function filterRegisters() {
    var newArr
    if (dateFilter.after && dateFilter.before && dateFilter.field != null) {
      if (!newArr) newArr = registers
      newArr = newArr.filter((call) => call[dateFilter.field] >= dateFilter.after && call[dateFilter.field] <= dateFilter.before)
    }
    if (filters.efetivado) {
      if (!newArr) newArr = registers
      newArr = newArr.filter((call) => call.efetivado == true)
    }
    if (!filters.naoEfetivado) {
      if (!newArr) newArr = registers
      newArr = newArr.filter((call) => call.efetivado == null || call.efetivado == false)
    }
    if (!newArr) {
      setFilteredRegisters(registers)
    } else {
      setFilteredRegisters(newArr)
    }
  }
  useEffect(() => {
    if (session?.user.accessibleRoutes.includes('PPS')) {
      if (!registers) {
        getRegisters()
      }
    } else {
      if (session?.user) {
        router.push('/')
      }
    }
  }, [session])
  if (status == 'loading') return <LoadingPage />
  return (
    <div className="flex flex-col p-6 grow">
      <div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-wrap justify-center items-center gap-2 font-['Roboto']">
            <p className="font-bold uppercase text-center text-2xl text-[#15599a]">CADASTROS FENESC</p>
            <p className="font-bold text-[#fead61]">({filteredRegisters?.length})</p>
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
                <div className="flex flex-col lg:flex-row gap-2 w-full lg:w-fit">
                  <div className="flex items-center gap-x-2 justify-center">
                    <div className="flex flex-col w-fit items-center">
                      <span className="uppercase font-bold font-raleway text-center text-sm">Depois de:</span>
                      <input
                        className="text-xs w-full text-center uppercase text-gray-600 outline-none"
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
                    <div className="flex flex-col w-fit items-center">
                      <span className="uppercase font-bold font-raleway text-center text-sm">Antes de:</span>
                      <input
                        className="text-xs w-full text-center uppercase text-gray-600 outline-none"
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
                        {
                          label: 'DATA DE REGISTRO',
                          value: 'dataRegistro',
                        },
                        {
                          label: 'DATA DE EFETIVAÇÃO',
                          value: 'dataEfetivacao',
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
              </div>
              <div className="flex flex-col lg:flex-row items-center justify-center gap-2">
                <div
                  onClick={() =>
                    setFilters({
                      ...filters,
                      efetivado: !filters.efetivado,
                    })
                  }
                  className={`${
                    filters.efetivado ? 'bg-[#15599a]' : 'bg-blue-300'
                  } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
                >
                  EFETIVADOS
                </div>
                <div
                  onClick={() =>
                    setFilters({
                      ...filters,
                      naoEfetivado: !filters.naoEfetivado,
                    })
                  }
                  className={`${
                    filters.efetivado ? 'bg-[#15599a]' : 'bg-blue-300'
                  } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
                >
                  NÃO EFETIVADOS
                </div>
              </div>
              <div className="flex items-center justify-end gap-x-2">
                <FilterButton text={'FILTRAR'} icon={<AiOutlineSearch />} handleClick={filterRegisters} />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      <div className="flex justify-around grow gap-3 mt-4 flex-wrap">
        {filteredRegisters ? (
          filteredRegisters.map((register) => (
            <div
              key={register._id}
              className="w-full lg:w-[450px] rounded-md gap-1 flex flex-col border border-gray-300 shadow-sm h-fit lg:h-[290px] p-3"
            >
              <div className="flex items-center justify-between w-full">
                <h1 className="text-lg font-medium">
                  PROJETO <strong className="text-[#15599a]">#{register.codigoSVB}</strong>
                </h1>
                {register.efetivado ? (
                  <BsCheck2All style={{ fontSize: '25px', color: 'rgb(34,197,94)' }} />
                ) : (
                  <IoMdCheckmark onClick={() => setEfetivado(register._id, register)} style={{ fontSize: '20px', cursor: 'pointer' }} />
                )}
                <div className="flex items-center gap-2">
                  <HiIdentification style={{ color: 'rgb(55,65,81)', fontSize: '25px' }} />
                  <h1 className="text-gray-700 font-medium">{register.cpfCnpj}</h1>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaUserAlt style={{ color: '#003d5b' }} />
                  <h1 className="text-gray-700 font-medium text-xs">{register.nomeVendedor}</h1>
                </div>
                <div className="flex items-center gap-2">
                  <MdEmail style={{ color: '#16B010' }} />
                  <h1 className="text-gray-700 font-medium text-xs">{register.emailVendedor}</h1>
                </div>
              </div>
              <div className="flex flex-col w-full justify-between">
                <div className="flex gap-3 items-center justify-center">
                  <h1 className="text-sm text-gray-500">FINANCIAMENTO</h1>
                  <BsBank style={{ color: '#fead61' }} />
                </div>
                <div className="flex flex-col lg:flex-row w-full items-center justify-between">
                  <div className="flex flex-col items-center lg:items-start">
                    <h1 className="text-gray-600 font-medium text-sm">GERENTE</h1>
                    <h1 className="text-sm font-medium">{register.nomeGerente}</h1>
                  </div>
                  <div className="flex flex-col items-center">
                    <h1 className="text-gray-600 font-medium text-sm">PA</h1>
                    <h1 className="text-sm font-medium">{register.pontoAtendimento}</h1>
                  </div>
                  <div className="flex flex-col items-center lg:items-end">
                    <h1 className="text-gray-600 font-medium text-sm">CONTATO</h1>
                    <h1 className="text-sm font-medium">{register.telefoneGerente}</h1>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between">
                  <div className="flex flex-col items-start">
                    <h1 className="text-gray-600 font-medium text-xs">VALOR</h1>
                    <h1 className="text-sm font-medium">
                      R$
                      {register.valorFinanciado.toLocaleString('pt-br', {
                        minimumFractionDigits: 2,
                      })}
                    </h1>
                  </div>
                  <div className="flex flex-col items-end">
                    <h1 className="text-gray-600 font-medium text-xs">PARCELAS</h1>
                    <h1 className="text-sm font-medium">x{register.qtdeParcelas}</h1>
                  </div>
                </div>
              </div>
              <div className="flex flex-col w-full justify-between">
                <div className="flex gap-3 items-center justify-center">
                  <h1 className="text-sm text-gray-500">SISTEMA FOTOVOLTAICO</h1>
                  <FaSolarPanel style={{ color: 'rgb(34,197,94)' }} />
                </div>
                <div className="flex w-full items-center justify-between">
                  <div className="flex flex-col items-start">
                    <h1 className="text-gray-600 font-medium text-xs">VALOR</h1>
                    <h1 className="text-sm font-medium">
                      R$
                      {Number(register.valorProjeto).toLocaleString('pt-br', {
                        minimumFractionDigits: 2,
                      })}
                    </h1>
                  </div>
                  <div className="flex flex-col items-end">
                    <h1 className="text-gray-600 font-medium text-xs">POTÊNCIA</h1>
                    <h1 className="text-sm font-medium">{register.potPico}kWp</h1>
                  </div>
                </div>
              </div>
              <div className="flex flex-col w-full">
                <div className="flex items-center gap-2">
                  <AiOutlineCalendar style={{ color: '#15599a' }} />
                  <h1 className="text-gray-700 font-medium text-xs">
                    {register.dataRegistro ? dayjs(register.dataRegistro).format('DD/MM/YY HH:mm') : null}
                  </h1>
                </div>
                <div className="flex gap-3 items-center justify-center">
                  <a href={register.proposta.link} className="text-sm text-blue-300 font-medium">
                    PROPOSTA
                  </a>
                  <BsFolderFill style={{ color: 'rgb(30,64,175)' }} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="grow flex items-center justify-center">
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
          </div>
        )}
      </div>
    </div>
  )
}

export default CadastrosFenesc
