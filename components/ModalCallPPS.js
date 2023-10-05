import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { FaCity, FaHandHoldingUsd, FaMobileAlt, FaMoneyBillWave, FaSave, FaSolarPanel, FaUser } from 'react-icons/fa'
import { VscChromeClose } from 'react-icons/vsc'
import { AppContext } from '../context/AppContext'
import { formatDecimalPlaces, respChamadosPPS } from '../utils/constants'
import { useKey } from '../utils/hooks'
import PPSModalCallInfo from './PPSModalCallInfo'
import AnimatedModalWrapper from './utils/AnimatedModalWrapper'
import SaveButton from './utils/Buttons/SaveButton'
import LoadingPage from './utils/LoadingPage'
import { useSession } from 'next-auth/react'
import Avatar from './utils/Avatar'
import { BsCalendarCheckFill, BsCalendarFill, BsCode, BsHouse } from 'react-icons/bs'
import dayjs from 'dayjs'
import { usePPSCall } from '../utils/methods/query/ppsCalls'
import { MdCategory, MdOutlineEmail, MdLocationPin, MdWork } from 'react-icons/md'
import { HiIdentification, HiOutlineIdentification } from 'react-icons/hi'
import { TbTopologyFullHierarchy } from 'react-icons/tb'
import { saveCallChanges } from '../utils/methods/mutation/ppsCalls'
import { toast } from 'react-hot-toast'
import { getErrorMessage } from '../utils/methods/handlers'
import { useQueryClient } from 'react-query'
import CallFile from './identificador/chamados/pps/CallFile'
import { useRouter } from 'next/router'
import Link from 'next/link'
const MODAL_STYLES = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%,-50%)',
  backgroundColor: '#fff',
  minWidth: '40%',
  height: '87%',
  borderRadius: '10px',
  padding: '10px',
  zIndex: 1000,
}
const OVERLAY_STYLES = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,.7)',
  zIndex: 1000,
}
const statusStyles = {
  'EM ANDAMENTO': {
    textColor: 'text-[#15599a]',
    borderColor: 'border-[#15599a]',
  },
  'AGUARDANDO VENDEDOR': {
    textColor: 'text-orange-400',
    borderColor: 'border-orange-400',
  },
  REALIZADO: {
    textColor: 'text-green-400',
    borderColor: 'border-green-400',
  },
  PENDENTE: {
    textColor: 'text-red-400',
    borderColor: 'border-red-400',
  },
}
const responsibles = [
  {
    id: null,
    nome: 'Adriano Arantes',
    apelido: 'ADRIANO',
    ativo: false,
    avatar_url:
      'https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/usuarios%2Favatar-adriano.jpg?alt=media&token=a30ec3dd-8a2e-4a24-b330-1f4e9b9f0db6',
  },
  {
    id: null,
    nome: 'Arthur Alexander',
    apelido: 'ARTHUR',
    ativo: false,
    avatar_url:
      'https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/usuarios%2Favatar-arthurziin.jpg?alt=media&token=150fd914-04d5-4c0a-bf33-7daccdf81916',
  },
  {
    id: '6318db05929e9f8731d8d9bb',
    nome: 'Lucas Fernandes',
    ativo: true,
    apelido: 'LUCAS',
    avatar_url: 'https://avatars.githubusercontent.com/u/60222823?s=400&u=d82dbc3d1d666b315b793f1888fd65c92d8ca0a9&v=4',
  },
  {
    id: '632372d90d695bd5256518bb',
    nome: 'Nathan Peres',
    apelido: 'NATHAN',
    ativo: false,
    avatar_url:
      'https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/usuarios%2Favatar-nathan_peres?alt=media&token=7f672eea-0b33-4e49-b747-f2de2ee110ad',
  },
  {
    id: '631f832a5ba9ffa2a4cb8369',
    nome: 'Matheus Oliveira',
    apelido: 'MATHEUS',
    ativo: true,
    avatar_url:
      'https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/usuarios%2FavatarMatheus.jpg?alt=media&token=adb60500-22e6-4c1d-908f-72e3279fc641',
  },
  {
    id: '63a5fb69e6a905a237de81eb',
    nome: 'Leandro Viali',
    apelido: 'LEANDRO',
    ativo: false,
    avatar_url:
      'https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/usuarios%2Favatar-leandro_viali?alt=media&token=dffd6966-b6d4-460d-9baa-d467d933a8a7',
  },
]
function ModalCallPPS({ callId, modalIsOpen, closeModal }) {
  useKey('Escape', () => closeModal())
  const queryClient = useQueryClient()
  const router = useRouter()
  const { data: session } = useSession()
  const editor = session?.user?.accessibleRoutes.includes('PPS') && session?.user?.visualizacao == undefined

  const { data: call, isLoading: callLoading, isFetched: callFetched } = usePPSCall(callId, !!callId)
  const [infoHolder, setInfoHolder] = useState(call)
  const [changes, setChanges] = useState({})

  function renderResponsibles(current) {
    const filtered = responsibles.filter((resp) => resp.ativo || resp.apelido == current)
    return filtered.map((resp, index) => (
      <div
        key={index}
        onClick={() => handleChange('responsavel', resp)}
        className={`${
          infoHolder.responsavel?.apelido == resp.apelido ? '' : 'opacity-40'
        } flex gap-2 items-center border border-blue-700 p-2 w-fit rounded-md cursor-pointer`}
      >
        <Avatar url={resp.avatar_url} fallback={'R'} height={25} width={25} />
        <p className="font-medium text-gray-500 text-xs">{resp.apelido}</p>
      </div>
    ))
  }

  function handleChange(key, value) {
    // Function to update nested keys
    const updateNestedKey = (obj, keys, newValue) => {
      const keysArray = keys.split('.')
      const lastKey = keysArray.pop()
      const nestedObj = keysArray.reduce((acc, k) => acc[k], obj)
      nestedObj[lastKey] = newValue
    }

    setChanges((prevChanges) => ({ ...prevChanges, [key]: value }))

    // Update the infoHolder with the new changes
    setInfoHolder((prevInfo) => {
      const updatedInfo = { ...prevInfo }
      updateNestedKey(updatedInfo, key, value)
      return updatedInfo
    })
  }
  async function handleSaveChanges() {
    const loadingToastId = toast.loading('Carregando...')
    try {
      const response = await saveCallChanges({ id: call._id, changes: changes })
      toast.dismiss(loadingToastId)
      toast.success(response)
      await queryClient.invalidateQueries({ queryKey: ['open-pps-calls'] })
    } catch (error) {
      const msg = getErrorMessage(error)
      toast.dismiss(loadingToastId)
      toast.error(msg)
    }
  }
  async function handleCloseCall() {
    const loadingToastId = toast.loading('Carregando...')
    try {
      const currentDate = new Date().toISOString()
      setInfoHolder((prev) => ({ ...prev, status: 'REALIZADO', dataEfetivacao: currentDate }))
      const changes = {
        status: 'REALIZADO',
        dataEfetivacao: currentDate,
      }
      const response = await saveCallChanges({ id: call._id, changes: changes })
      toast.dismiss(loadingToastId)
      toast.success(response)
      await queryClient.invalidateQueries({ queryKey: ['open-pps-calls'] })
      await queryClient.invalidateQueries({ queryKey: ['closed-pps-calls'] })
    } catch (error) {
      const msg = getErrorMessage(error)
      toast.dismiss(loadingToastId)
      toast.error(msg)
    }
  }
  async function handleReOpenCall() {
    const loadingToastId = toast.loading('Carregando...')
    try {
      setInfoHolder((prev) => ({ ...prev, status: 'PENDENTE', dataEfetivacao: null }))
      const changes = {
        status: 'PENDENTE',
        dataEfetivacao: null,
      }
      const response = await saveCallChanges({ id: call._id, changes: changes })
      toast.dismiss(loadingToastId)
      toast.success(response)
      await queryClient.invalidateQueries({ queryKey: ['open-pps-calls'] })
      await queryClient.invalidateQueries({ queryKey: ['closed-pps-calls'] })
    } catch (error) {
      const msg = getErrorMessage(error)
      toast.dismiss(loadingToastId)
      toast.error(msg)
    }
  }
  function getChargesTotals(arr) {
    let sumTotalPot = 0
    let sumTotalDailyConsumption = 0
    for (let i = 0; i < arr.length; i++) {
      sumTotalPot = sumTotalPot + arr[i].qtde * arr[i].potencia
      sumTotalDailyConsumption = sumTotalDailyConsumption + arr[i].qtde * arr[i].potencia * arr[i].horasFuncionamento
    }
    return {
      totalPot: sumTotalPot / 1000,
      totalDailyConsumption: sumTotalDailyConsumption,
    }
  }
  useEffect(() => {
    setInfoHolder(call)
  }, [call])
  return (
    <>
      <AnimatedModalWrapper modalIsOpen={modalIsOpen} width={'60%'} height={'87%'}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-2 text-lg pb-2 border-b border-gray-200">
            <div className="flex flex-col">
              <h1 className="text-[#15599a] pl-6  font-bold">{call?.tipoSolicitacao || '...'}</h1>
              <p className="text-gray-500 text-center text-xs">#{call?._id || '...'}</p>
            </div>
            <button>
              <VscChromeClose
                onClick={() => {
                  closeModal()
                }}
                style={{ color: 'red' }}
              />
            </button>
          </div>
          {callFetched && infoHolder ? (
            <div className="flex flex-col px-2 lg:px-0 overflow-y-auto overscroll-y scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 gap-2">
              <div className="flex w-full items-center justify-center mt-4">
                <div className="flex gap-x-2 justify-center grow">
                  {infoHolder.status === 'REALIZADO' ? (
                    <div className={`text-xs cursor-pointer font-bold border p-3 w-fit text-center rounded-lg text-green-500 border-green-500 `}>
                      REALIZADO
                    </div>
                  ) : (
                    <>
                      <div
                        onClick={() => handleChange('status', 'PENDENTE')}
                        className={`${
                          infoHolder.status != 'PENDENTE' && 'opacity-30'
                        } text-xs cursor-pointer font-bold border p-3 w-fit text-center rounded-lg text-red-500 border-red-500 `}
                      >
                        PENDENTE
                      </div>
                      <div
                        onClick={() => handleChange('status', 'EM ANDAMENTO')}
                        className={`${
                          infoHolder.status != 'EM ANDAMENTO' && 'opacity-30'
                        } text-xs cursor-pointer font-bold border p-3 w-fit text-center rounded-lg text-blue-500 border-blue-500 `}
                      >
                        EM ANDAMENTO
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <Avatar fallback={'U'} height={25} width={25} url={call.requerente.avatar_url} />
                  <p className="font-medium text-gray-500 text-xs">{call.requerente?.apelido || 'Requerente não identificado'}</p>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <BsCalendarFill />
                  <p className="text-xs font-medium">{dayjs(call.dataInsercao).format('DD/MM/YYYY HH:mm')}</p>
                </div>
              </div>
              {call.dataEfetivacao ? (
                <div className="flex w-full justify-center mt-4 items-center gap-2 text-green-500">
                  <BsCalendarCheckFill />
                  <p className="text-xs font-medium">{dayjs(call.dataEfetivacao).format('DD/MM/YYYY HH:mm')}</p>
                </div>
              ) : null}

              <h1 className="w-full p-2 rounded-md text-center text-white font-bold bg-gray-800 mt-4">PROJETO</h1>
              {call.projeto ? (
                <div className="flex flex-col md:flex-row w-full justify-center gap-2 md:gap-4 items-center">
                  <div className="flex gap-2 items-center">
                    <BsCode size={'20px'} color="rgb(31,41,55)" />
                    {call.projeto.id ? (
                      <Link href={`https://crm.ampereenergias.com.br/projeto/id/${call.projeto.id}`}>
                        <a className="font-raleway font-medium text-sm hover:text-cyan-300 duration-300 ease-in-out cursor-pointer">
                          #{call.projeto.codigo || 'N/A'}
                        </a>
                      </Link>
                    ) : (
                      <p className="font-raleway font-medium text-sm hover:text-blue-300 duration-300 ease-in-out cursor-pointer">
                        #{call.projeto.codigo || 'N/A'}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 items-center">
                    <FaUser size={'20px'} color="rgb(31,41,55)" />
                    <p className="font-raleway font-medium text-sm">{call.projeto.nome || 'N/A'}</p>
                  </div>
                </div>
              ) : (
                <p className="py-2 w-full text-center text-gray-500 italic text-sm">Sem informações do projeto...</p>
              )}
              <h1 className="w-full p-2 rounded-md text-center text-white font-bold bg-gray-800 mt-4">CLIENTE</h1>
              {call.cliente ? (
                <div className="flex flex-col w-full gap-2 py-2">
                  <div className="flex w-full justify-center gap-2 lg:gap-4 flex-col md:flex-row items-center">
                    <div className="flex gap-2 items-center text-gray-800">
                      <FaUser size={'20px'} color="rgb(31,41,55)" />
                      <p className="font-raleway font-medium text-sm">{call.cliente.nome || 'N/A'}</p>
                    </div>
                    {/* <div className="flex gap-2 items-center">
                      <MdCategory size={'20px'} color="rgb(31,41,55)" />
                      <p className="font-raleway font-medium text-sm">{call.cliente.tipo || 'N/A'}</p>
                    </div> */}
                    <div className="flex gap-2 items-center">
                      <HiIdentification size={'20px'} color="rgb(31,41,55)" />
                      <p className="font-raleway font-medium text-sm">{call.cliente.cpfCnpj || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex w-full justify-center gap-2 lg:gap-4 flex-col md:flex-row items-center">
                    <div className="flex gap-2 items-center">
                      <FaMobileAlt size={'20px'} color="rgb(31,41,55)" />
                      <p className="font-raleway font-medium text-sm">{call.cliente.telefone || 'N/A'}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <MdOutlineEmail size={'20px'} color="rgb(31,41,55)" />
                      <p className="font-raleway font-medium text-sm">{call.cliente.email || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex w-full justify-center gap-2 lg:gap-4 flex-col md:flex-row items-center">
                    <div className="flex gap-2 items-center">
                      <FaCity size={'20px'} color="rgb(31,41,55)" />
                      <p className="font-raleway font-medium text-sm">
                        {call.cliente.uf || 'N/A'} / {call.cliente.cidade || 'N/A'}
                      </p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <MdLocationPin size={'20px'} color="rgb(31,41,55)" />
                      <p className="font-raleway font-medium text-sm">
                        {call.cliente.endereco
                          ? `${call.cliente.endereco} - ${call.cliente.numeroOuIdentificador}, ${call.cliente.bairro} - ${call.cliente.cep}`
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex w-full justify-center gap-2 lg:gap-4 flex-col md:flex-row items-center">
                    <div className="flex gap-2 items-center">
                      <FaMoneyBillWave size={'20px'} color="rgb(31,41,55)" />
                      <p className="font-raleway font-medium text-sm">{call.cliente.renda || 'N/A'}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <MdWork size={'20px'} color="rgb(31,41,55)" />
                      <p className="font-raleway font-medium text-sm">{call.cliente.profissao || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="py-2 w-full text-center text-gray-500 italic text-sm">Sem informações do cliente...</p>
              )}
              <h1 className="w-full p-2 rounded-md text-center text-white font-bold bg-gray-800 mt-4">PREMISSAS</h1>
              {call.premissas ? (
                <div className="flex w-full flex-col md:flex-row justify-center gap-2 md:gap-4 items-center">
                  <div className="flex gap-2 items-center">
                    <FaSolarPanel size={'20px'} color="rgb(31,41,55)" />
                    <p className="font-raleway font-medium text-sm">{call.premissas.geracao ? `${call.premissas.geracao} kWh` : 'N;A'}</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <TbTopologyFullHierarchy size={'20px'} color="rgb(31,41,55)" />
                    <p className="font-raleway font-medium text-sm">{call.premissas.topologia || 'N/A'}</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <BsHouse size={'20px'} color="rgb(31,41,55)" />
                    <p className="font-raleway font-medium text-sm">{call.premissas.tipoEstrutura || 'N/A'}</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <FaHandHoldingUsd size={'20px'} color="rgb(31,41,55)" />
                    <p className="font-raleway font-medium text-sm">{call.premissas.valorFinanciamento || 'N/A'}</p>
                  </div>
                </div>
              ) : (
                <p className="py-2 w-full text-center text-gray-500 italic text-sm">Sem premissas fornecidas...</p>
              )}
              {call.premissas?.cargas ? (
                <div className="flex flex-col text-gray-600 w-full">
                  <p className="font-bold text-xs text-center">EQUIPAMENTOS</p>
                  <div className="grid grid-cols-5  lg:grid-cols-6">
                    <h1 className="bg-gray-600 text-white text-xxs lg:text-xs text-center p-1 border-r border-white font-bold">NOME</h1>
                    <h1 className="bg-gray-600 text-white text-xxs lg:text-xs text-center p-1 border-r border-white font-bold hidden lg:flex">
                      POTÊNCIA NOMINAL
                    </h1>
                    <h1 className="bg-gray-600 text-white text-xxs lg:text-xs text-center p-1 border-r border-white font-bold">QTDE</h1>
                    <h1 className="bg-gray-600 text-white text-xxs lg:text-xs text-center p-1 border-r border-white font-bold">POTÊNCIA TOTAL</h1>
                    <h1 className="bg-gray-600 text-white text-xxs lg:text-xs text-center p-1 border-r border-white font-bold">HORAS DE USO</h1>
                    <h1 className="bg-gray-600 text-white text-xxs lg:text-xs text-center p-1 font-bold">Wh DIÁRIO</h1>
                  </div>
                  {call.premissas.cargas.map((charge, index) => (
                    <div key={index} className="grid grid-cols-5 lg:grid-cols-6 border border-t-0 border-gray-200">
                      <h1 className="text-gray-600 text-xxs text-center border-r p-2 border-gray-200 font-bold">{charge.descricao}</h1>
                      <h1 className="text-gray-600 text-xxs text-center border-r p-2 border-gray-200 font-bold hidden lg:flex">{charge.qtde}</h1>
                      <h1 className="text-gray-600 text-xxs text-center border-r p-2 border-gray-200 font-bold">{charge.potencia}</h1>
                      <h1 className="text-gray-600 text-xxs text-center border-r p-2 border-gray-200 font-bold">{charge.qtde * charge.potencia}</h1>
                      <h1 className="text-gray-600 text-xxs text-center border-r p-2 border-gray-200 font-bold">{charge.horasFuncionamento}</h1>
                      <h1 className="text-gray-600 text-xxs text-center p-2 font-bold">
                        {charge.qtde * charge.potencia * charge.horasFuncionamento}
                      </h1>
                    </div>
                  ))}
                  <div className="grid grid-cols-5 lg:grid-cols-6 border border-t-0 border-gray-200 items-center">
                    <p className="bg-gray-600 text-white text-xs col-span-4 lg:col-span-5 text-center p-1 border-r border-white font-bold h-full flex items-center justify-center">
                      CONSUMO DIÁRIO TOTAL
                    </p>
                    <p className="text-gray-600 text-xs col-span-1 text-center p-2 font-bold">
                      {formatDecimalPlaces(getChargesTotals(call.premissas.cargas).totalDailyConsumption, 0, 0)} kWh
                    </p>
                  </div>
                  <div className="grid grid-cols-5 lg:grid-cols-6 border border-t-0 border-gray-200 items-center">
                    <p className="bg-gray-600 text-white text-xs col-span-4 lg:col-span-5 text-center p-1 border-r border-white font-bold h-full flex items-center justify-center">
                      POTÊNCIA TOTAL
                    </p>
                    <p className="text-gray-600 text-xs col-span-1 text-center p-2 font-bold">
                      {formatDecimalPlaces(getChargesTotals(call.premissas.cargas).totalPot, 2, 2)} kWp
                    </p>
                  </div>
                </div>
              ) : null}
              <div className="w-full flex flex-col">
                <h1 className="w-full p-2 rounded-tr-md rounded-tl-md text-center text-white font-bold bg-gray-800 mt-4">OBSERVAÇÕES</h1>
                <span className="grow text-center font-raleway text-sm bg-gray-100 p-4 italic rounded-b">
                  {call.observacoes ? (
                    <ul className="text-xs font-bold text-center list-none">
                      {call.observacoes.split('/ ').map((string, index) => (
                        <li key={index}>{string}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-center italic text-gray-600">SEM OBSERVAÇÕES...</p>
                  )}
                </span>
              </div>

              <h1 className="w-full p-2 rounded-md text-center text-white font-bold bg-gray-800 mt-4">RESPONSÁVEL</h1>
              <div className="flex w-full gap-2 justify-around flex-wrap">{renderResponsibles(call.responsavel?.apelido)}</div>
              <div className="flex flex-col w-full">
                <h1 className="w-full p-2 rounded-tr-md rounded-tl-md text-center text-white font-bold bg-gray-800 mt-4">ANOTAÇÕES</h1>
                <textarea
                  value={infoHolder.anotacoes}
                  readOnly={!editor}
                  onChange={(e) => handleChange('anotacoes', e.target.value)}
                  placeholder="Digite aqui as anotações do chamado"
                  className="outline-none placeholder:italic text-center text-sm p-3 resize-none bg-gray-100 min-h-[150px] h-fit grow scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                />
              </div>
              <h1 className="w-full p-2 rounded-tr-md rounded-tl-md text-center text-white font-bold bg-gray-800 mt-4">ARQUIVOS</h1>
              <div className="flex flex-col items-center w-full gap-2">
                {call.links && call.links.length > 0 ? (
                  call.links.map((link, index) => (
                    <div key={index} className="w-full lg:w-[70%]">
                      <CallFile info={link} />
                    </div>
                  ))
                ) : (
                  <p className="py-2 italic text-sm text-gray-500">Sem arquivos anexados...</p>
                )}
              </div>
              {editor ? (
                infoHolder.dataEfetivacao ? (
                  <div className="text-center">
                    <button
                      onClick={() => handleReOpenCall()} // TODO
                      className="p-3 font-raleway mt-4 hover:bg-[#f18701] hover:text-white font-bold rounded-lg bg-yellow-400"
                    >
                      REABRIR CHAMADO
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <button
                      onClick={() => handleCloseCall()} // TODO
                      className="p-3 font-raleway mt-4 hover:bg-[#06d6a0] hover:text-white font-bold rounded-lg bg-green-400"
                    >
                      FINALIZAR CHAMADO
                    </button>
                  </div>
                )
              ) : (
                false
              )}
              {editor ? (
                <div className="flex items-center justify-center mt-2">
                  <SaveButton text={'SALVAR'} icon={<FaSave />} handleClick={() => handleSaveChanges()} /> {/*TODO*/}
                </div>
              ) : null}
            </div>
          ) : (
            <LoadingPage />
          )}
        </div>
      </AnimatedModalWrapper>
    </>
  )
}

export default ModalCallPPS
