import React, { useContext, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { AppContext } from '../context/AppContext'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { AreaChart, Area, LineChart, Legend, Line, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, YAxis, BarChart, Bar } from 'recharts'

import DashboardSkeleton from '../components/skeletons/DashboardSkeleton'
import { useSession } from 'next-auth/react'
import LoadingPage from '../components/utils/LoadingPage'
import { sellerPhotos } from '../utils/constants'
import { FaBirthdayCake } from 'react-icons/fa'

import dayjs from 'dayjs'
import { BsFillCalendarEventFill } from 'react-icons/bs'
import Fireworks from '@fireworks-js/react'

function renderAvatarBySeller(sellerName) {
  if (!sellerName) {
    return (
      <div className="flex h-[50px] w-[50px] items-center justify-center self-center rounded-full bg-gray-700">
        <p className="text-center text-lg font-bold text-white">V</p>
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
      <div className="flex h-[50px] w-[50px] items-center justify-center self-center rounded-full bg-gray-700">
        <p className="text-center text-lg font-bold uppercase text-white">
          {firstLetter}
          {secondLetter}
        </p>
      </div>
    )
  }
  return (
    <div className="h-[30px]  max-h-[50px] w-[30px] max-w-[50px] self-center lg:h-[50px] lg:w-[50px]">
      <Image
        width={30}
        height={30}
        src={existingSellerWithPhoto.avatar_url}
        alt={existingSellerWithPhoto.nome}
        style={{ borderRadius: '100%' }}
        layout="responsive"
      />
    </div>
  )
}
function Home() {
  const ref = useRef()
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
        <div className="relative grow p-6">
          <div className="flex w-full flex-col">
            <h1 className="w-full text-center font-raleway text-3xl font-extrabold text-[#15599a]">PARABÉNS, TIME AMPÈRE !</h1>
            <div className="mb-2 flex w-full flex-col">
              <h1 className="w-full text-center text-lg font-extrabold">META ALCANÇADA !!!</h1>
              <div className="flex h-[45px] w-full items-center justify-between self-center border border-gray-500 bg-[#a8a9aa]">
                <div
                  // style={{ width: `${(campainPeakPower / 2000) * 100}%` }}
                  style={{ width: `100%` }}
                  className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-r from-yellow-300 to-[#fead41]"
                >
                  <p className="bg-transparent text-xxs font-bold text-[#15599a] lg:text-sm">
                    {/* {((campainPeakPower / 2000) * 100).toLocaleString('pt-br', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  % */}
                    100% !!!
                  </p>
                </div>
              </div>
            </div>
            <div className="flex w-full justify-center gap-2">
              <div className="flex w-full items-center justify-center lg:w-[70%]">
                {topSellerData ? (
                  <div className="flex w-full items-center justify-center">
                    <div className="mb-2 flex w-full flex-col items-center">
                      <h1 className="text-center text-xl font-bold uppercase text-gray-600">TOP 3 VENDEDORES</h1>
                      <div className="flex h-[400px] w-full items-end justify-center gap-4 p-0 lg:h-[400px] lg:w-[1200px] lg:gap-10 lg:p-6">
                        <div className="hidden h-full w-1/5 flex-col justify-end lg:flex">
                          {renderAvatarBySeller(topSellerData[3]?._id)}
                          <h1 className="text-center text-sm font-bold text-gray-500">{topSellerData[3]?._id}</h1>
                          <p className="text-center text-lg font-medium text-green-500">
                            {topSellerData[3]?.potenciaVendida?.toLocaleString('pt-br', { maximumFractionDigits: 2 })} kWp
                          </p>
                          <div className="flex h-[30%] w-full items-center justify-center bg-gray-500 text-3xl font-bold text-white">4º</div>
                        </div>
                        <div className="flex h-full w-1/3 flex-col justify-end lg:w-1/5">
                          {renderAvatarBySeller(topSellerData[1]?._id)}
                          <h1 className="text-center text-xs font-bold text-gray-500 lg:text-sm">{topSellerData[1]?._id}</h1>
                          <p className="text-center text-xs font-medium text-green-500 lg:text-lg">
                            {topSellerData[1]?.potenciaVendida?.toLocaleString('pt-br', { maximumFractionDigits: 2 })} kWp
                          </p>
                          <div className="flex h-[60%] w-full items-center justify-center bg-[#15599a] text-3xl font-bold text-white">2º</div>
                        </div>
                        <div className="flex h-full w-1/3 flex-col justify-end lg:w-1/5">
                          {renderAvatarBySeller(topSellerData[0]?._id)}

                          <h1 className="text-center text-xs font-bold text-gray-500 lg:text-sm">{topSellerData[0]?._id}</h1>
                          <p className="text-center text-xs font-medium text-green-500 lg:text-lg">
                            {topSellerData[0]?.potenciaVendida.toLocaleString('pt-br', { maximumFractionDigits: 2 })} kWp
                          </p>
                          <div className="flex w-full grow items-center justify-center bg-[#fead41] text-3xl font-bold text-white">1º</div>
                        </div>
                        <div className="flex h-full w-1/3 flex-col justify-end lg:w-1/5">
                          {renderAvatarBySeller(topSellerData[2]?._id)}
                          <h1 className="text-center text-xs font-bold text-gray-500 lg:text-sm">{topSellerData[2]?._id}</h1>
                          <p className="text-center text-xs font-medium text-green-500 lg:text-lg">
                            {topSellerData[2]?.potenciaVendida.toLocaleString('pt-br', { maximumFractionDigits: 2 })} kWp
                          </p>
                          <div className="flex h-[40%] w-full items-center justify-center bg-[#15599a] text-3xl font-bold text-white">3º</div>
                        </div>
                        <div className="hidden h-full w-1/5 flex-col justify-end lg:flex">
                          {renderAvatarBySeller(topSellerData[4]?._id)}
                          <h1 className="text-center text-sm font-bold text-gray-500">{topSellerData[4]?._id}</h1>
                          <p className="text-center text-lg font-medium text-green-500">
                            {topSellerData[4]?.potenciaVendida?.toLocaleString('pt-br', { maximumFractionDigits: 2 })} kWp
                          </p>
                          <div className="flex h-[15%] w-full items-center justify-center bg-gray-500 text-3xl font-bold text-white">5º</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
            <div className="grid-rows-10 grid w-full grid-cols-1 gap-y-2 lg:grid-cols-10  lg:grid-rows-1 lg:gap-x-3">
              <div className="col-span-2 flex h-[250px] flex-col border border-gray-200 bg-[#fff] p-4 shadow-xl">
                <div className="flex justify-between">
                  <h1 className="w-full text-center uppercase text-gray-600">Obras finalizadas no mês</h1>
                  {installedData[0] ? validateStatsMonth(installedData[0]._id) : null}
                </div>
                <p className="flex grow items-center justify-center text-center text-2xl font-bold text-[#fead61]">
                  {installedData.length > 0 ? installedData[0]?.count : '-'} obras
                </p>
                <p className="text-center text-xs text-gray-600">
                  Último mês: <strong>{installedData.length > 0 && installedData[1]?.count ? `${installedData[1]?.count} obras` : 'N/A'} </strong>
                </p>
              </div>
              <div className="col-span-2 flex h-[250px] flex-col border border-gray-200 bg-[#fff] p-4 shadow-xl">
                <div className="flex justify-between">
                  <h1 className="w-full text-center uppercase text-gray-600">Potência Pico instalada no mês</h1>
                  {installedData[0] ? validateStatsMonth(installedData[0]._id) : null}
                </div>
                <p className="flex grow items-center justify-center text-2xl font-bold text-[#fead61]">
                  {installedData.length > 0 ? installedData[0]?.total.toFixed(2) : '-'} kWp
                </p>
                <p className="text-center text-xs text-gray-600">
                  Último mês:{' '}
                  <strong>{installedData.length > 0 && installedData[1]?.total ? `${installedData[1]?.total.toFixed(2)} kWp` : 'N/A'} </strong>
                </p>
              </div>
              <div className="col-span-2 flex h-[250px] flex-col border border-gray-200 bg-[#fff] p-4 shadow-xl">
                <div className="flex justify-between">
                  <h1 className="w-full text-center uppercase text-gray-600">Potência Pico homologada no mês</h1>
                  {averageHomoData[0] ? validateStatsMonth(averageHomoData[0]._id) : null}
                </div>
                <p className="flex grow items-center justify-center text-2xl font-bold text-[#fead61]">
                  {averageHomoData.length > 0 ? averageHomoData[0]?.homoPeakPot?.toFixed(2) : '-'} kWp
                </p>
                <p className="text-center text-xs text-gray-600">
                  Último mês:{' '}
                  <strong>
                    {averageHomoData.length > 0 && averageHomoData[1]?.homoPeakPot ? `${averageHomoData[1]?.homoPeakPot?.toFixed(2)} kWp` : 'N/A'}
                  </strong>
                </p>
              </div>
              <div className="col-span-2 flex h-[250px] flex-col border border-gray-200 bg-[#fff] p-4 shadow-xl">
                <div className="flex justify-between">
                  <h1 className="w-full text-center uppercase text-gray-600">TEMPO MÉDIO PARA COMPRA</h1>
                  {averageBuyTime[0] ? validateStatsMonth(averageBuyTime[0]._id) : null}
                </div>
                <p className="flex grow items-center justify-center text-2xl font-bold text-[#fead61]">
                  {averageBuyTime.length > 0 ? `${averageBuyTime[0].tempoMedio?.toFixed(2)} dias` : '-'}{' '}
                </p>
                <p className="text-center text-xs text-gray-600">
                  Último mês:{' '}
                  <strong>
                    {averageBuyTime.length > 0 && averageBuyTime[1]?.tempoMedio ? `${averageBuyTime[1]?.tempoMedio?.toFixed(2)} dias` : 'N/A'}{' '}
                  </strong>
                </p>
              </div>
              <div className="col-span-2 flex h-[250px] flex-col border border-gray-200 bg-[#fff] p-4 shadow-xl">
                <div className="flex justify-between">
                  <h1 className="w-full text-center uppercase text-gray-600">TEMPO MÉDIO DE APROVAÇÃO</h1>
                  {averageHomoData[0] ? validateStatsMonth(averageHomoData[0]._id) : null}
                </div>
                <p className="flex grow items-center justify-center text-2xl font-bold text-[#fead61]">
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
            <div className="mt-4 grid grid-cols-1 grid-rows-2 gap-y-2 lg:grid-cols-10 lg:grid-rows-1 lg:gap-x-3">
              <div className="col-span-2 flex h-[425px] flex-col border border-gray-200 bg-[#fff] p-4 shadow-xl">
                <h1 className="text-center text-xl text-gray-600">NPS</h1>
                <div className="flex grow items-center justify-center">
                  <div className="h-[150px] w-[150px]">
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
              <div className="col-span-8 flex h-[600px] flex-col border border-gray-200 bg-[#fff] p-4 shadow-xl lg:h-[425px]">
                <div className="grid grid-cols-1 grid-rows-2 py-2 lg:grid-cols-2 lg:grid-rows-1">
                  <h1 className="text-center text-xl uppercase text-gray-600">Potência pico vendida</h1>
                  <div className="flex items-center justify-center gap-x-2">
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
                      className={`cursor-pointer border border-gray-200 duration-500 ease-in-out hover:scale-105 ${
                        selectedYear == 2020 ? 'bg-blue-200 hover:bg-transparent' : 'bg-transparent hover:bg-blue-200'
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
                      className={`cursor-pointer border border-gray-200 duration-500 ease-in-out hover:scale-105 ${
                        selectedYear == 2021 ? 'bg-blue-200 hover:bg-transparent' : 'bg-transparent hover:bg-blue-200'
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
                      className={`cursor-pointer border border-gray-200 duration-500 ease-in-out hover:scale-105 ${
                        selectedYear == 2022 ? 'bg-blue-200 hover:bg-transparent' : 'bg-transparent hover:bg-blue-200'
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
                      className={`cursor-pointer border border-gray-200 duration-500 ease-in-out hover:scale-105 ${
                        selectedYear == 2023 ? 'bg-blue-200 hover:bg-transparent' : 'bg-transparent hover:bg-blue-200'
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
            <div className="mt-4 flex grow flex-col border  border-gray-200 bg-[#fff] p-4 shadow-xl">
              <div className="flex w-full flex-col items-center justify-between lg:flex-row">
                <h1 className="uppercase text-gray-600">ANIVERSARIANTES DO MÊS</h1>
                <button
                  onClick={() => filterBirthday(!filters.birthdayToday)}
                  className="rounded border border-[#fead61] p-2 font-bold text-[#fead61] duration-500 ease-in-out hover:scale-105 hover:bg-[#fead61] hover:text-black"
                >
                  ANIVERSARIANDO HOJE
                </button>
              </div>
              <div className="mt-2 flex w-full grow flex-wrap justify-center gap-y-2 lg:justify-between">
                {clientBirthday.filtered.length > 0 &&
                  clientBirthday.filtered?.map((client, index) => (
                    <div
                      key={index}
                      className="flex w-full flex-col gap-2 rounded-md border border-gray-200 bg-[#fff] p-3 text-center text-xs shadow-sm lg:w-[450px]"
                    >
                      <div className="flex w-full items-center justify-between">
                        <h1 className="font-bold leading-none tracking-tight">{client.nomeDoContrato}</h1>
                        {new Date(client.dataNascimento).getDate() == new Date().getDate() ? <FaBirthdayCake color="DA0C81" size={20} /> : null}
                      </div>
                      <div className="flex items-center justify-center gap-2 ">
                        <BsFillCalendarEventFill color="rgb(107,114,128)" />
                        <p className="font-bold text-[#DA0C81]">
                          {client.dataNascimento != undefined && new Date(client.dataNascimento).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )
    } else return <DashboardSkeleton />
  }
}

export default Home
