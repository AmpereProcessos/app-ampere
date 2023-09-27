import React, { useContext, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { AppContext } from '../context/AppContext'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { AreaChart, Area, LineChart, Legend, Line, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, YAxis, BarChart, Bar } from 'recharts'
import { Fireworks } from 'fireworks-js'
import DashboardSkeleton from '../components/skeletons/DashboardSkeleton'
import { useSession } from 'next-auth/react'
import LoadingPage from '../components/utils/LoadingPage'
import LogoCampanha from '../utils/images/logoCampanha2023.png'
import { sellerPhotos } from '../utils/constants'
const routes = [
  {
    title: 'Projetos',
    url: 'projetos',
  },
  {
    title: 'Obras',
    url: 'obras',
  },
  {
    title: 'Suprimentos',
    url: 'suprimentos',
  },
  {
    title: 'O&M',
    url: 'o&m',
  },
  {
    title: 'Marketing',
    url: 'marketing',
  },
  {
    title: 'Vendas',
    url: 'vendas',
  },
  {
    title: 'Pós-Venda',
    url: 'pos-venda',
  },
  {
    title: 'PPS',
    url: 'pps',
  },
  {
    title: 'InsideSales',
    url: 'insidesales',
  },
  {
    title: 'Financeiro',
    url: 'financeiro',
  },
  {
    title: 'ADM',
    url: 'adm',
  },
  {
    title: 'RH',
    url: 'rh',
  },
]
function renderAvatarBySeller(sellerName) {
  if (!sellerName) {
    return (
      <div className="w-[50px] h-[50px] self-center bg-gray-700 rounded-full flex items-center justify-center">
        <p className="text-center font-bold text-lg text-white">V</p>
      </div>
    )
  }
  const existingSellerWithPhoto = sellerPhotos.find((x) => x.nome == sellerName)
  if (!existingSellerWithPhoto) {
    const splittedName = sellerName.split(' ')
    const firstLetter = splittedName[0][0]
    var secondLetter
    if (['DE', 'DA', 'DO', 'DOS', 'DAS'].includes(splittedName[1])) secondLetter = splittedName[2] ? splittedName[2][0] : ''
    else secondLetter = splittedName[1] ? splittedName[1][0] : ''

    return (
      <div className="w-[50px] h-[50px] self-center bg-gray-700 rounded-full flex items-center justify-center">
        <p className="text-center font-bold text-lg uppercase text-white">
          {firstLetter}
          {secondLetter}
        </p>
      </div>
    )
  }
  return (
    <div className="w-[50px] h-[50px] self-center">
      <Image src={existingSellerWithPhoto.avatar_url} width={50} height={50} alt={existingSellerWithPhoto.nome} style={{ borderRadius: '100%' }} />
    </div>
  )
}
function Home() {
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/authHome')
    },
  })
  const [selectedYear, setSelectedYear] = useState()
  const [campainPeakPower, setCampainPeakPower] = useState(0)
  const [topSellerData, setTopSellerData] = useState([])
  const [installedData, setInstalledData] = useState([])
  const [averageHomoData, setHomoData] = useState([])
  const [averageBuyTime, setAverageBuyTime] = useState([])
  const [clientBirthday, setClientsBirthday] = useState({
    general: [],
    filtered: [],
  })
  const [nps, setNps] = useState(0)
  const [statsData, setStatsData] = useState({
    graphData: null,
    maxGraphValue: 1000,
  })
  const [filters, setFilters] = useState({
    birthdayToday: false,
  })
  const [regional, setRegional] = useState('GERAL')
  function getStats(credenciais) {
    if (credenciais?.visualizacao == 'REGIONAL') {
      axios
        .post('/api/stats', {
          filtrarPor: credenciais?.visualizacao,
          parametro: credenciais?.regional,
        })
        .then((res) => {
          setNps(res.data.nps)
          setAverageBuyTime(res.data.infoSuprimentos)
          setInstalledData(res.data.infoInstalacao)
          setHomoData(res.data.infoHomologacao)
          setTopSellerData(res.data.infoTopVendedores)
          setCampainPeakPower(res.data.potenciaVendidaCampanha)
        })
    } else if (credenciais?.visualizacao == 'VENDEDOR' || credenciais?.visualizacao == 'INSIDE') {
      axios
        .post('/api/stats', {
          filtrarPor: credenciais?.visualizacao,
          parametro: credenciais?.vendedor,
        })
        .then((res) => {
          setNps(res.data.nps)
          setAverageBuyTime(res.data.infoSuprimentos)
          setInstalledData(res.data.infoInstalacao)
          setHomoData(res.data.infoHomologacao)
          setTopSellerData(res.data.infoTopVendedores)
          setCampainPeakPower(res.data.potenciaVendidaCampanha)
        })
    } else {
      axios.get('/api/stats').then((res) => {
        setNps(res.data.nps)
        setAverageBuyTime(res.data.infoSuprimentos)
        setInstalledData(res.data.infoInstalacao)
        setHomoData(res.data.infoHomologacao)
        setTopSellerData(res.data.infoTopVendedores)
        setCampainPeakPower(res.data.potenciaVendidaCampanha)
      })
    }
  }
  function getBirthDay(credenciais) {
    if (credenciais?.visualizacao == 'REGIONAL') {
      axios
        .post('/api/stats/clientsBirthday', {
          filtrarPor: credenciais?.visualizacao,
          parametro: credenciais?.regional,
        })
        .then((res) => setClientsBirthday({ general: res.data, filtered: res.data }))
    } else if (credenciais?.visualizacao == 'VENDEDOR' || credenciais?.visualizacao == 'INSIDE') {
      axios
        .post('/api/stats/clientsBirthday', {
          filtrarPor: credenciais?.visualizacao,
          parametro: credenciais?.vendedor,
        })
        .then((res) => setClientsBirthday({ general: res.data, filtered: res.data }))
    } else {
      axios.get('/api/stats/clientsBirthday').then((res) => setClientsBirthday({ general: res.data, filtered: res.data }))
    }
  }
  function getGraphDataByYear(year, credenciais) {
    setSelectedYear(year)
    if (credenciais?.visualizacao == 'REGIONAL') {
      axios
        .post(`/api/stats/getByYear/${year}`, {
          filtrarPor: credenciais?.visualizacao,
          parametro: credenciais?.regional,
        })
        .then((res) => {
          setStatsData({
            ...statsData,
            graphData: res.data,
            maxGraphValue: Math.max(...res.data.map((o) => o.Total)),
          })
        })
    } else if (credenciais?.visualizacao == 'VENDEDOR' || credenciais?.visualizacao == 'INSIDE') {
      axios
        .post(`/api/stats/getByYear/${year}`, {
          filtrarPor: credenciais?.visualizacao,
          parametro: credenciais?.vendedor,
        })
        .then((res) =>
          setStatsData({
            ...statsData,
            graphData: res.data,
            maxGraphValue: Math.max(...res.data.map((o) => o.Total)),
          })
        )
    } else {
      axios.get(`/api/stats/getByYear/${year}`).then((res) => {
        setStatsData({
          ...statsData,
          graphData: res.data,
          maxGraphValue: Math.max(...res.data.map((o) => o.Total)),
        })
      })
    }
  }
  function filterBirthday(value) {
    var newArr
    setFilters({ ...filters, birthdayToday: value })
    if (value == true) {
      newArr = clientBirthday.general.filter((client) => new Date(client.dataNascimento).getDate() == new Date().getDate())
    } else {
      newArr = clientBirthday.general
    }

    setClientsBirthday({ ...clientBirthday, filtered: newArr })
  }
  function getDataByRegional(value) {
    setRegional(value)
    getGraphDataByYear(2023, { visualizacao: 'REGIONAL', regional: value })
    getStats({ visualizacao: 'REGIONAL', regional: value })
  }
  function validateStatsMonth(obj) {
    let currentMonth = new Date().getMonth() + 1
    let currentYear = new Date().getFullYear()
    if (obj.mes < currentMonth)
      return obj.mes >= 10 ? (
        <p className="text-xs font-semibold text-[#fead61]">{`${obj.mes}/${currentYear}`}</p>
      ) : (
        <p className="text-xs font-semibold text-[#fead61]">{`0${obj.mes}/${currentYear}`}</p>
      )
    else {
      return null
    }
  }
  useEffect(() => {
    if (session?.user) {
      getStats(session.user)
      getGraphDataByYear(2023, session.user)
      getBirthDay(session.user)
    }
  }, [session])
  if (status == 'loading') return <LoadingPage />
  if (status == 'authenticated') {
    if (session.user?.visualizacao == 'OBRAS') {
      router.push('/ordemDeServico/designadas')
      return <></>
    }
    if (statsData.graphData) {
      return (
        <div className="p-6 grow">
          {/* <div className="flex items-center justify-center w-full">
            <div className="w-[350px]">
              <Image
                src={LogoCampanha}
                fill={true}
                alt={"LOGO DA CAMPANHA 2023"}
                style={{ borderRadius: "100%", objectFit: "cover" }}
              />
            </div>
          </div> */}
          <div className="flex flex-col w-full mb-2">
            <h1 className="text-center w-full text-lg font-extrabold">META GLOBAL</h1>
            <div className="w-full h-[45px] border border-gray-500 bg-[#a8a9aa] self-center flex items-center justify-between">
              <div
                style={{ width: `${(campainPeakPower / 2000) * 100}%` }}
                className="bg-gradient-to-r from-yellow-300 to-[#fead41] w-full h-full flex flex-col items-center justify-center"
              >
                <p className="text-[#15599a] bg-transparent font-bold text-xxs lg:text-sm">
                  {((campainPeakPower / 2000) * 100).toLocaleString('pt-br', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  %
                </p>
                <p className="w-full text-center font-raleway text-xxs lg:text-sm font-bold text-green-500">
                  {campainPeakPower.toLocaleString('pt-br', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{' '}
                  kWp
                </p>
              </div>
              <p className="text-xs lg:text-lg text-white font-bold mr-4">
                {(2000 - campainPeakPower).toLocaleString('pt-br', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                kWp
              </p>
            </div>
          </div>
          <div className="w-full flex gap-2 justify-center">
            <div className="w-full lg:w-[70%] flex justify-center items-center">
              {topSellerData ? (
                <div className="flex items-center w-full justify-center">
                  <div className="flex flex-col items-center w-full mb-2">
                    <h1 className="text-gray-600 uppercase text-xl text-center font-bold">TOP 3 VENDEDORES</h1>
                    <div className="lg:w-[600px] w-full flex items-end justify-center h-[500px] lg:h-[400px] gap-4 lg:gap-10 p-0 lg:p-6">
                      <div className="h-full flex flex-col justify-end w-1/3">
                        {renderAvatarBySeller(topSellerData[1]?._id)}
                        {/* <div className="w-[50px] h-[50px] self-center">
                          <Image
                            src={
                              "https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/usuarios%2Favatar_juliano.jpg?alt=media&token=3893b2ea-9f9a-48ca-8f1c-cc85aa04ecbd"
                            }
                            width={50}
                            height={50}
                            alt={"LOGO TOP 1º"}
                            style={{ borderRadius: "100%" }}
                          />
                        </div> */}
                        <h1 className="text-center font-bold text-sm text-gray-500">{topSellerData[1]?._id}</h1>
                        <p className="text-center font-medium text-lg text-green-500">
                          {topSellerData[1]?.potenciaVendida?.toLocaleString('pt-br', { maximumFractionDigits: 2 })} kWp
                        </p>
                        <div className="h-[60%] w-full bg-[#15599a] flex justify-center items-center text-3xl text-white font-bold">2º</div>
                      </div>
                      <div className="h-full flex flex-col justify-end w-1/3">
                        {renderAvatarBySeller(topSellerData[0]?._id)}
                        {/* <div className="w-[50px] h-[50px] self-center">
                          <Image
                            src={
                              "https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/usuarios%2Favatar_stenio.jpg?alt=media&token=44eef96f-7f8b-4e1b-95c0-ab609aef50c9"
                            }
                            width={50}
                            height={50}
                            alt={"LOGO TOP 1º"}
                            style={{ borderRadius: "100%" }}
                          />
                        </div> */}
                        <h1 className="text-center font-bold text-sm text-gray-500">{topSellerData[0]?._id}</h1>
                        <p className="text-center font-medium text-lg text-green-500">
                          {topSellerData[0]?.potenciaVendida.toLocaleString('pt-br', { maximumFractionDigits: 2 })} kWp
                        </p>
                        <div className="grow w-full bg-[#fead41] flex justify-center items-center text-3xl text-white font-bold">1º</div>
                      </div>
                      <div className="h-full flex flex-col justify-end w-1/3">
                        {renderAvatarBySeller(topSellerData[2]?._id)}
                        {/* <div className="w-[50px] h-[50px] self-center">
                          <Image
                            src={
                              "https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/usuarios%2Favatar-rafael_feo?alt=media&token=edec02ff-c2df-455d-ad30-8358710dda93"
                            }
                            width={50}
                            height={50}
                            alt={"LOGO TOP 1º"}
                            style={{ borderRadius: "100%" }}
                          />
                        </div> */}
                        <h1 className="text-center font-bold text-sm text-gray-500">{topSellerData[2]?._id}</h1>
                        <p className="text-center font-medium text-lg text-green-500">
                          {topSellerData[2]?.potenciaVendida.toLocaleString('pt-br', { maximumFractionDigits: 2 })} kWp
                        </p>
                        <div className="h-[40%] w-full bg-[#15599a] flex justify-center items-center text-3xl text-white font-bold">3º</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
              {/* {topSellerData ? (
                <div className="flex items-center w-full justify-center">
                  <div className="flex flex-col items-center w-full">
                    <h1 className="text-gray-600 uppercase text-xl text-center font-bold">
                      TOP 3 VENDEDORES
                    </h1>
                    <div className="lg:w-[600px] w-full flex items-end justify-center h-[300px] gap-10 p-6">
                      <div className="h-full flex flex-col justify-end w-1/3">
                        <h1 className="text-center font-bold text-sm text-gray-500">
                          {topSellerData[1]._id}
                        </h1>
                        <p className="text-center font-medium text-lg text-green-500">
                          {topSellerData[1].potenciaVendida} kWp
                        </p>
                        <div className="h-[60%] w-full bg-[#15599a] flex justify-center items-center text-3xl text-white font-bold">
                          2º
                        </div>
                      </div>
                      <div className="h-full flex flex-col justify-end w-1/3">
                        <h1 className="text-center font-bold text-sm text-gray-500">
                          {topSellerData[0]._id}
                        </h1>
                        <p className="text-center font-medium text-lg text-green-500">
                          {topSellerData[0].potenciaVendida} kWp
                        </p>
                        <div className="h-full w-full bg-[#fead41] flex justify-center items-center text-3xl text-white font-bold">
                          1º
                        </div>
                      </div>
                      <div className="h-full flex flex-col justify-end w-1/3">
                        <h1 className="text-center font-bold text-sm text-gray-500">
                          {topSellerData[2]._id}
                        </h1>
                        <p className="text-center font-medium text-lg text-green-500">
                          {topSellerData[2].potenciaVendida} kWp
                        </p>
                        <div className="h-[30%] w-full bg-[#15599a] flex justify-center items-center text-3xl text-white font-bold">
                          3º
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null} */}
            </div>
          </div>
          <div className="grid grid-rows-10 grid-cols-1 gap-y-2 lg:grid-cols-10 lg:grid-rows-1  lg:gap-x-3 w-full">
            <div className="flex flex-col col-span-2 p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
              <div className="flex justify-between">
                <h1 className="uppercase text-gray-600 text-center w-full">Obras finalizadas no mês</h1>
                {installedData[0] ? validateStatsMonth(installedData[0]._id) : null}
              </div>
              <p className="grow text-center text-2xl font-bold text-[#fead61] flex items-center justify-center">
                {installedData.length > 0 ? installedData[0]?.count : '-'} obras
              </p>
              <p className="text-center text-xs text-gray-600">
                Último mês: <strong>{installedData.length > 0 && installedData[1]?.count ? `${installedData[1]?.count} obras` : 'N/A'} </strong>
              </p>
            </div>
            <div className="flex flex-col col-span-2 p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
              <div className="flex justify-between">
                <h1 className="uppercase text-gray-600 text-center w-full">Potência Pico instalada no mês</h1>
                {installedData[0] ? validateStatsMonth(installedData[0]._id) : null}
              </div>
              <p className="grow text-2xl font-bold text-[#fead61] flex items-center justify-center">
                {installedData.length > 0 ? installedData[0]?.total.toFixed(2) : '-'} kWp
              </p>
              <p className="text-center text-xs text-gray-600">
                Último mês:{' '}
                <strong>{installedData.length > 0 && installedData[1]?.total ? `${installedData[1]?.total.toFixed(2)} kWp` : 'N/A'} </strong>
              </p>
            </div>
            <div className="flex flex-col col-span-2 p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
              <div className="flex justify-between">
                <h1 className="uppercase text-gray-600 text-center w-full">Potência Pico homologada no mês</h1>
                {averageHomoData[0] ? validateStatsMonth(averageHomoData[0]._id) : null}
              </div>
              <p className="grow text-2xl font-bold text-[#fead61] flex items-center justify-center">
                {averageHomoData.length > 0 ? averageHomoData[0]?.homoPeakPot?.toFixed(2) : '-'} kWp
              </p>
              <p className="text-center text-xs text-gray-600">
                Último mês:{' '}
                <strong>
                  {averageHomoData.length > 0 && averageHomoData[1]?.homoPeakPot ? `${averageHomoData[1]?.homoPeakPot?.toFixed(2)} kWp` : 'N/A'}
                </strong>
              </p>
            </div>
            <div className="flex flex-col col-span-2 p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
              <div className="flex justify-between">
                <h1 className="uppercase text-gray-600 text-center w-full">TEMPO MÉDIO PARA COMPRA</h1>
                {averageBuyTime[0] ? validateStatsMonth(averageBuyTime[0]._id) : null}
              </div>
              <p className="grow text-2xl font-bold text-[#fead61] flex items-center justify-center">
                {averageBuyTime.length > 0 ? `${averageBuyTime[0].tempoMedio?.toFixed(2)} dias` : '-'}{' '}
              </p>
              <p className="text-center text-xs text-gray-600">
                Último mês:{' '}
                <strong>
                  {averageBuyTime.length > 0 && averageBuyTime[1]?.tempoMedio ? `${averageBuyTime[1]?.tempoMedio?.toFixed(2)} dias` : 'N/A'}{' '}
                </strong>
              </p>
            </div>
            <div className="flex flex-col col-span-2 p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
              <div className="flex justify-between">
                <h1 className="uppercase text-gray-600 text-center w-full">TEMPO MÉDIO DE APROVAÇÃO</h1>
                {averageHomoData[0] ? validateStatsMonth(averageHomoData[0]._id) : null}
              </div>
              <p className="grow text-2xl font-bold text-[#fead61] flex items-center justify-center">
                {averageHomoData.length > 0 && averageHomoData[0]?.averageTime ? `${averageHomoData[0]?.averageTime?.toFixed(0)} dias` : 'N/A'}{' '}
              </p>
              <p className="text-center text-xs text-gray-600">
                Último mês:{' '}
                <strong>
                  {averageHomoData.length > 1 && averageHomoData[1]?.averageTime ? `${averageHomoData[1]?.averageTime?.toFixed(0)} dias` : 'N/A'}
                </strong>
              </p>
            </div>
          </div>
          <div className="grid grid-rows-2 grid-cols-1 gap-y-2 mt-4 lg:grid-cols-10 lg:grid-rows-1 lg:gap-x-3">
            <div className="flex flex-col p-4 h-[425px] border border-gray-200 bg-[#fff] shadow-xl col-span-2">
              <h1 className="text-gray-600 text-xl text-center">NPS</h1>
              <div className="flex grow items-center justify-center">
                <div className="w-[150px] h-[150px]">
                  <CircularProgressbar
                    styles={buildStyles({
                      // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                      strokeLinecap: 'butt',
                      // Text size
                      textSize: '16px',
                      // How long animation takes to go from one percentage to another, in seconds
                      pathTransitionDuration: 0.5,

                      // Can specify path transition in more detail, or remove it entirely
                      // pathTransition: 'none',

                      // Colors
                      pathColor: `#fead61`,
                      textColor: '#15599a',
                      trailColor: '#d6d6d6',
                      backgroundColor: '#3e98c7',
                    })}
                    value={Number(nps)}
                    text={`${nps}%`}
                    strokeWidth={6}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col p-4 h-[600px] lg:h-[425px] border border-gray-200 bg-[#fff] shadow-xl col-span-8">
              <div className="grid grid-cols-1 grid-rows-2 lg:grid-cols-2 lg:grid-rows-1 py-2">
                <h1 className="text-gray-600 uppercase text-xl text-center">Potência pico vendida</h1>
                <div className="flex items-center gap-x-2 justify-center">
                  <p
                    onClick={() => {
                      if (regional != undefined && regional != 'GERAL') {
                        getGraphDataByYear(2020, {
                          visualizacao: 'REGIONAL',
                          regional: regional,
                        })
                      } else {
                        getGraphDataByYear(2020, session.user)
                      }
                    }}
                    className={`border cursor-pointer border-gray-200 hover:scale-105 duration-500 ease-in-out ${
                      selectedYear == 2020 ? 'bg-blue-200 hover:bg-transparent' : 'hover:bg-blue-200 bg-transparent'
                    } p-2 text-xs text-gray-600`}
                  >
                    2020
                  </p>
                  <p
                    onClick={() => {
                      if (regional != undefined && regional != 'GERAL') {
                        getGraphDataByYear(2021, {
                          visualizacao: 'REGIONAL',
                          regional: regional,
                        })
                      } else {
                        getGraphDataByYear(2021, session.user)
                      }
                    }}
                    className={`border cursor-pointer border-gray-200 hover:scale-105 duration-500 ease-in-out ${
                      selectedYear == 2021 ? 'bg-blue-200 hover:bg-transparent' : 'hover:bg-blue-200 bg-transparent'
                    } p-2 text-xs text-gray-600`}
                  >
                    2021
                  </p>
                  <p
                    onClick={() => {
                      if (regional != undefined && regional != 'GERAL') {
                        getGraphDataByYear(2022, {
                          visualizacao: 'REGIONAL',
                          regional: regional,
                        })
                      } else {
                        getGraphDataByYear(2022, session.user)
                      }
                    }}
                    className={`border cursor-pointer border-gray-200 hover:scale-105 duration-500 ease-in-out ${
                      selectedYear == 2022 ? 'bg-blue-200 hover:bg-transparent' : 'hover:bg-blue-200 bg-transparent'
                    } p-2 text-xs text-gray-600`}
                  >
                    2022
                  </p>
                  <p
                    onClick={() => {
                      if (regional != undefined && regional != 'GERAL') {
                        getGraphDataByYear(2023, {
                          visualizacao: 'REGIONAL',
                          regional: regional,
                        })
                      } else {
                        getGraphDataByYear(2023, session.user)
                      }
                    }}
                    className={`border cursor-pointer border-gray-200 hover:scale-105 duration-500 ease-in-out ${
                      selectedYear == 2023 ? 'bg-blue-200 hover:bg-transparent' : 'hover:bg-blue-200 bg-transparent'
                    } p-2 text-xs text-gray-600`}
                  >
                    2023
                  </p>
                </div>
              </div>
              <ResponsiveContainer width="100%">
                <AreaChart width={550} height={300} data={statsData.graphData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#15599a" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#15599a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" />
                  <YAxis dataKey={'Total'} domain={[0, statsData.maxGraphValue]} />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Area type="monotone" dataKey="Total" stroke="#15599a" fillOpacity={1} fill="url(#colorTotal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="flex mt-4 grow flex-col p-4  border border-gray-200 bg-[#fff] shadow-xl">
            <div className="flex flex-col lg:flex-row w-full items-center justify-between">
              <h1 className="text-gray-600 uppercase">ANIVERSARIANTES DO MÊS</h1>
              <button
                onClick={() => filterBirthday(!filters.birthdayToday)}
                className="p-2 rounded font-bold border border-[#fead61] text-[#fead61] hover:scale-105 duration-500 ease-in-out hover:text-black hover:bg-[#fead61]"
              >
                ANIVERSARIANDO HOJE
              </button>
            </div>
            <div className="w-full grow flex flex-wrap justify-center lg:justify-between gap-y-2 mt-2">
              {clientBirthday.filtered.length > 0 &&
                clientBirthday.filtered?.map((client, index) => (
                  <div key={index} className="w-[350px] text-xs text-center bg-[#fff] border border-gray-200 p-2">
                    <p>{client.nomeDoContrato}</p>
                    <p className="text-[#15599a] font-bold">
                      {client.dataNascimento != undefined && new Date(client.dataNascimento).toLocaleDateString()}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )
    } else return <DashboardSkeleton />
  }
}

export default Home
