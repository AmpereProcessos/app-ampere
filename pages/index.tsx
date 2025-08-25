import React, { useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, YAxis } from 'recharts'

import DashboardSkeleton from '../components/skeletons/DashboardSkeleton'
import { useSession } from '@/components/providers/SessionProvider'
import LoadingPage from '../components/utils/LoadingPage'
import { formatDecimalPlaces } from '../utils/constants'

import { useDashboardStats, useSalesGraphStats } from '@/utils/methods/query/stats'
import ErrorComponent from '@/components/utils/ErrorComponent'
import ClientsBirthdays from '@/components/identificador/dashboard/ClientsBirthdays'
import { getArrOfYearsBetweenYears } from '@/utils/methods/dates'
import SalesRanking from '@/components/identificador/resultados/SalesRanking'

const currentDate = new Date()
const currentYear = currentDate.getFullYear()

function Home() {
  const ref = useRef()
  const router = useRouter()
  const { session, status } = useSession({
    required: true,
  })
  const [year, setYear] = useState<number>(currentYear)
  const { data: stats, isLoading, isSuccess, isError } = useDashboardStats()
  const { data: salesGraph } = useSalesGraphStats({ year })

  function validateStatsMonth(identifier: string) {
    const currentMonth = new Date().getMonth() + 1
    const splited = identifier.split('/')
    const month = Number(splited[0])
    const year = Number(splited[1])
    if (month >= currentMonth) return null
    if (month >= 10) return <p className="text-xs font-semibold text-[#fead61]">{`${month}/${year}`}</p>
    return <p className="text-xs font-semibold text-[#fead61]">{`0${month}/${year}`}</p>
  }
  console.log('SESSION', session)
  if (status === 'loading') return <LoadingPage />
  if (status === 'authenticated') {
    if (session.user?.visualizacao.tipo === 'EXECUÇÃO') {
      router.push('/ordens-de-servico/designadas')
      return <></>
    }

    if (isLoading) return <DashboardSkeleton />
    if (isError) return <ErrorComponent msg={'Oops, houve um erro ao carregar o dashboard geral.'} />
    if (isSuccess)
      return (
        <div className="bg-background relative grow p-6">
          <div className="flex w-full flex-col">
            <SalesRanking />
            <div className="mt-2 grid w-full grid-cols-1 grid-rows-10 gap-y-2 lg:grid-cols-10 lg:grid-rows-1 lg:gap-x-3">
              <div className="bg-background border-primary/20 col-span-2 flex h-[250px] flex-col border p-4 shadow-xl">
                <div className="flex justify-between">
                  <h1 className="text-primary/80 text-center tracking-tight uppercase">Obras finalizadas no mês</h1>
                  {validateStatsMonth(stats.instalacao.atual.identificador)}
                </div>
                <p className="flex grow items-center justify-center text-center text-2xl font-bold text-[#fead61]">
                  {stats.instalacao.atual.contagem} obras
                </p>
                <p className="text-primary/80 text-center text-xs">
                  Último mês: <strong>{stats.instalacao.anterior.contagem || 'N/A'}</strong>
                </p>
              </div>
              <div className="bg-background border-primary/20 col-span-2 flex h-[250px] flex-col border p-4 shadow-xl">
                <div className="flex justify-between">
                  <h1 className="text-primary/80 text-center tracking-tight uppercase">Potência Pico instalada no mês</h1>
                  {validateStatsMonth(stats.instalacao.atual.identificador)}
                </div>
                <p className="flex grow items-center justify-center text-2xl font-bold text-[#fead61]">
                  {formatDecimalPlaces(stats.instalacao.atual.valor)} kWp
                </p>
                <p className="text-primary/80 text-center text-xs">
                  Último mês: <strong>{formatDecimalPlaces(stats.instalacao.anterior.valor)} kWp</strong>
                </p>
              </div>
              <div className="bg-background border-primary/20 col-span-2 flex h-[250px] flex-col border p-4 shadow-xl">
                <div className="flex justify-between">
                  <h1 className="text-primary/80 text-center tracking-tight uppercase">Potência Pico homologada no mês</h1>
                  {validateStatsMonth(stats.homologacao.atual.identificador)}
                </div>
                <p className="flex grow items-center justify-center text-2xl font-bold text-[#fead61]">
                  {formatDecimalPlaces(stats.homologacao.atual.potencia)} kWp
                </p>
                <p className="text-primary/80 text-center text-xs">
                  Último mês: <strong>{formatDecimalPlaces(stats.homologacao.anterior.potencia)} kWp</strong>
                </p>
              </div>
              <div className="bg-background border-primary/20 col-span-2 flex h-[250px] flex-col border p-4 shadow-xl">
                <div className="flex justify-between">
                  <h1 className="text-primary/80 text-center tracking-tight uppercase">TEMPO MÉDIO PARA COMPRA</h1>
                  {validateStatsMonth(stats.suprimentos.atual.identificador)}
                </div>
                <p className="flex grow items-center justify-center text-2xl font-bold text-[#fead61]">
                  {formatDecimalPlaces(stats.suprimentos.atual.tempoMedio, 0)} dias
                </p>
                <p className="text-primary/80 text-center text-xs">
                  Último mês: <strong>{formatDecimalPlaces(stats.suprimentos.anterior.tempoMedio, 0)} dias</strong>
                </p>
              </div>
              <div className="bg-background border-primary/20 col-span-2 flex h-[250px] flex-col border p-4 shadow-xl">
                <div className="flex justify-between">
                  <h1 className="text-primary/80 text-center tracking-tight uppercase">TEMPO MÉDIO DE APROVAÇÃO</h1>
                  {validateStatsMonth(stats.homologacao.atual.identificador)}
                </div>
                <p className="flex grow items-center justify-center text-2xl font-bold text-[#fead61]">
                  {formatDecimalPlaces(stats.homologacao.atual.tempoMedio, 0)} dias
                </p>
                <p className="text-primary/80 text-center text-xs">
                  Último mês: <strong>{formatDecimalPlaces(stats.homologacao.anterior.tempoMedio, 0)} dias</strong>
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 grid-rows-2 gap-y-2 lg:grid-cols-10 lg:grid-rows-1 lg:gap-x-3">
              <div className="bg-background border-primary/20 col-span-2 flex h-[425px] flex-col border p-4 shadow-xl">
                <h1 className="text-primary/80 text-center text-xl">NPS</h1>
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
                        pathColor: '#fead61',
                        textColor: '#15599a',
                        trailColor: '#d6d6d6',
                        backgroundColor: '#3e98c7',
                      })}
                      value={stats.nps}
                      text={`${formatDecimalPlaces(stats.nps)}%`}
                      strokeWidth={6}
                    />
                  </div>
                </div>
              </div>
              <div className="bg-background border-primary/20 col-span-8 flex h-[600px] flex-col border p-4 shadow-xl lg:h-[425px]">
                <div className="flex w-full flex-wrap items-center gap-2 py-2">
                  <h1 className="text-primary/80 text-center text-xl uppercase">Potência pico vendida</h1>
                  <div className="flex grow flex-wrap items-center justify-end gap-x-2">
                    {getArrOfYearsBetweenYears({ initialYear: 2020, endYear: currentYear }).map((yearValue, index) => (
                      <button
                        type="button"
                        key={yearValue}
                        onClick={() => {
                          setYear(yearValue)
                        }}
                        className={`border-primary/20 cursor-pointer border duration-500 ease-in-out hover:scale-105 ${
                          year === yearValue ? 'bg-blue-200 hover:bg-transparent' : 'bg-transparent hover:bg-blue-200'
                        } text-primary/80 p-2 text-xs`}
                      >
                        {yearValue}
                      </button>
                    ))}
                  </div>
                </div>
                <ResponsiveContainer width="100%">
                  <AreaChart width={550} height={300} data={salesGraph || []} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#15599a" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#15599a" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="IDENTIFICADOR" />
                    <YAxis
                      dataKey={'VALOR'}
                      domain={[
                        0,
                        salesGraph
                          ? Math.max.apply(
                              null,
                              salesGraph.map((s) => s.VALOR)
                            )
                          : 2000,
                      ]}
                    />

                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Area type="monotone" dataKey="VALOR" stroke="#15599a" fillOpacity={1} fill="url(#colorTotal)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <ClientsBirthdays />
          </div>
        </div>
      )
  }
}

export default Home
