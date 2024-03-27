import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import LoadingPage from '../../components/utils/LoadingPage'
import { useOeMReportData } from '../../utils/methods/query/oem'
import { cidadesAtendidas, formatDate, formatDecimalPlaces, formatToMoney, validateAuthorization } from '../../utils/constants'
import { FaSolarPanel, FaHome, FaUserAlt } from 'react-icons/fa'
import dayjs from 'dayjs'
// @ts-ignore
import dayjsBusinessDays from 'dayjs-business-days'
import DateFloatingInput from '../../components/DateFloatingInput'
import { AnimatePresence, motion } from 'framer-motion'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import Select from 'react-select'
import DateInput from '../../components/inputs/Date'
import NumberFloatingInput from '../../components/NumberFloatingInput'
import SelectInput from '../../components/inputs/Select'
import { formatDateInputChange } from '@/utils/methods/shared'
import { TProjectDTO } from '@/utils/schemas/projects'
import { formatDateAsLocale } from '@/utils/methods/formatting'
dayjs.extend(dayjsBusinessDays)

const initialFirstScenario = {
  dueDate: '2022-12-31T24:00:00.000Z',
  dilutionDate: null,
}
const initialSecondScenario = {
  dueDate: '2023-12-31T24:00:00.000Z',
  dilutionDate: '2024-03-31T24:00:00.000Z',
}
const dateParam = '2022-12-31T24:00:00.000Z'
const initialCentralDateParam = '2023-12-31T20:00:00.000Z'
const initialDilutionDateParam = '2024-03-31T20:00:00.000Z'

type TotalsResults = { general: { plants: number; modules: number }; diluted: { plants: number; modules: number } }

function formatAsNumber(x: any) {
  const result = isNaN(x) ? 0 : Number(x)
  return result
}
function getCorrespondentDateInPreviousYear(date: string) {
  const previousYear = new Date(date).getFullYear() - 1
  const month = new Date(date).getMonth()
  const day = new Date(date).getDate()
  return new Date(previousYear, month, day)
}

function getDayDiff(d1: string | Date, d2: string | Date) {
  const timeDiff = Math.abs(new Date(d2).getTime() - new Date(d1).getTime())
  const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
  return dayDiff
}
function getBusinessDayDiff(d1: string | Date, d2: string | Date) {
  // @ts-ignore
  const diff = dayjs(d2).businessDiff(dayjs(d1))
  return Math.abs(diff) as number
}
function getFilteredData(data: TProjectDTO[], dueDate: string) {
  if (!data) return []
  return data.filter((p) => p.medidor.data && new Date(p.medidor.data) < getCorrespondentDateInPreviousYear(dueDate))
}

function RelatorioSetor() {
  const router = useRouter()
  const { data: session } = useSession({
    required: true,
    onUnauthenticated: () => {
      router.push('/auth/signin')
    },
  })
  const [showClientsNames, setShowClientsNames] = useState(false)
  const [scenarios, setScenarios] = useState({
    first: initialFirstScenario,
    second: initialSecondScenario,
  })

  const [dateParams, setDateParams] = useState({
    central: initialCentralDateParam,
    dilution: initialDilutionDateParam,
  })

  // Getting data and instances of filtered date based on date filter params
  const { data, isFetching, isSuccess, filters, setFilters } = useOeMReportData()
  const firstScenarioData = getFilteredData(data || [], scenarios.first.dueDate)
  const secondScenarioData = getFilteredData(data || [], scenarios.second.dueDate)
  function getTotals(data: TProjectDTO[], dueDate: string, dilutionDate: string | null): TotalsResults {
    if (!data) return { general: { plants: 0, modules: 0 }, diluted: { plants: 0, modules: 0 } }

    const numeratorDays = getDayDiff(new Date(), new Date(dueDate))
    const denominatorDays = dilutionDate ? getDayDiff(new Date(), new Date(dilutionDate)) : 0
    const dilutionMultiplier = numeratorDays / denominatorDays

    const modules = data.reduce((acc, current) => acc + formatAsNumber(current.sistema?.qtdeModulos), 0)
    const plants = data.length

    return { general: { plants: plants, modules: modules }, diluted: { plants: plants * dilutionMultiplier, modules: modules * dilutionMultiplier } }
  }
  function getTotalsByCity(data: TProjectDTO[], dueDate: string, dilutionDate: string | null) {
    const numeratorDays = getDayDiff(new Date(), new Date(dueDate))
    const denominatorDays = dilutionDate ? getDayDiff(new Date(), new Date(dilutionDate)) : null
    const dilutionMultiplier = denominatorDays ? numeratorDays / denominatorDays : 0
    const totals = data.reduce((acc: { [key: string]: TotalsResults }, current) => {
      const modules = formatAsNumber(current.sistema?.qtdeModulos)
      const city = current.cidade
      if (!acc[city]) acc[city] = { general: { plants: 0, modules: 0 }, diluted: { plants: 0, modules: 0 } }
      acc[city].general.modules += modules
      acc[city].general.plants += 1
      acc[city].diluted.modules += modules * dilutionMultiplier
      acc[city].diluted.plants += 1 * dilutionMultiplier
      return acc
    }, {})
    return totals
  }

  function renderStatsByCity(data: TProjectDTO[], dueDate: string, dilutionDate: string | null) {
    return Object.entries(getTotalsByCity(data, dueDate, dilutionDate)).map(([key, value], index) => (
      <div key={index} className="flex w-full items-center gap-2 border-b border-gray-300 py-1">
        <h1 className="w-1/3 text-center text-xs font-medium tracking-tight text-gray-500 lg:text-sm">{key}</h1>
        <div className="flex w-1/3 flex-col items-center">
          <h1 className="w-1/3 text-center text-xs font-medium tracking-tight text-gray-500 lg:text-sm">
            {formatDecimalPlaces(value.general.plants, 0, 0)}
          </h1>
          {value.diluted.plants ? (
            <h1 className="w-1/3 text-center text-[0.65rem] font-medium italic tracking-tight text-gray-500 lg:text-xs">
              {formatDecimalPlaces(value.diluted.plants, 0, 0)} (diluídos)
            </h1>
          ) : null}
        </div>
        <div className="flex w-1/3 flex-col items-center">
          <h1 className="w-1/3 text-center text-xs font-medium tracking-tight text-gray-500 lg:text-sm">
            {formatDecimalPlaces(value.general.modules, 0, 0)}
          </h1>
          {value.diluted.modules ? (
            <h1 className="w-1/3 text-center text-[0.65rem] font-medium italic tracking-tight text-gray-500 lg:text-xs">
              {formatDecimalPlaces(value.diluted.modules, 0, 0)} (diluídos)
            </h1>
          ) : null}
        </div>
      </div>
    ))
  }
  // const filteredDataByMaxDateParam = data ? data.filter((x) => new Date(x.medidor.data) < getCorrespondentDateInPreviousYear(dateParams.central)) : []

  // const filteredDataByMaxDateParamSecondScenario = data
  //   ? data.filter((x) => new Date(x.medidor.data) < getCorrespondentDateInPreviousYear(dateParams.dilution))
  //   : []

  // Calculating stats
  // function getOverallTotalQty(info) {
  //   if (!info) return { plants: 0, modules: 0 }
  //   const totalModulesQty = info.reduce((acc, current) => {
  //     const currentModules = isNaN(current.sistema?.qtdeModulos) ? 0 : Number(current.sistema?.qtdeModulos)
  //     return acc + currentModules
  //   }, 0)
  //   const totalPlantsQty = info.length
  //   return { plants: totalPlantsQty, modules: totalModulesQty }
  // }
  // function getDilutedOverallTotalQty(info) {
  //   if (!info) return { plants: 0, modules: 0 }
  //   const numeratorDays = getDayDiff(new Date(), new Date(dateParams.central))
  //   const denominatorDays = getDayDiff(new Date(), new Date(dateParams.dilution))
  //   const dilutionMultiplier = numeratorDays / denominatorDays

  //   const totalModulesQty = info.reduce((acc, current) => {
  //     const currentModules = isNaN(current.sistema?.qtdeModulos) ? 0 : Number(current.sistema?.qtdeModulos)
  //     return acc + currentModules
  //   }, 0)
  //   const totalPlantsQty = info.length
  //   return {
  //     plants: totalPlantsQty * dilutionMultiplier,
  //     modules: totalModulesQty * dilutionMultiplier,
  //   }
  // }
  // function getDataGroupedByCitySecondScenario(info) {
  //   // Corresponding to months from now till central date param
  //   const numeratorDays = getDayDiff(new Date(), new Date(dateParams.central))
  //   const denominatorDays = getDayDiff(new Date(), new Date(dateParams.dilution))
  //   const multiplier = numeratorDays / denominatorDays
  //   // console.log("MULTIPLICADOR", multiplier);
  //   const groupedResult = info.reduce((acc, current) => {
  //     const city = current.cidade
  //     const currentModules = isNaN(current.sistema?.qtdeModulos) ? 0 : Number(current.sistema?.qtdeModulos)
  //     if (!acc[city]) {
  //       acc[city] = {
  //         plants: 0,
  //         modules: 0,
  //       }
  //     }
  //     acc[city].plants = acc[city].plants + 1 * multiplier
  //     acc[city].modules = acc[city].modules + currentModules * multiplier
  //     return acc
  //   }, {})
  //   return groupedResult
  // }
  // function getDataGroupedByCity(info) {
  //   const groupedResult = info.reduce((acc, current) => {
  //     const city = current.cidade
  //     const currentModules = isNaN(current.sistema?.qtdeModulos) ? 0 : Number(current.sistema?.qtdeModulos)
  //     if (!acc[city]) {
  //       acc[city] = {
  //         plants: 0,
  //         modules: 0,
  //       }
  //     }
  //     acc[city].plants = acc[city].plants + 1
  //     acc[city].modules = acc[city].modules + currentModules
  //     return acc
  //   }, {})
  //   return groupedResult
  // }
  // function renderDataGroupedByCity(data) {
  //   return Object.keys(getDataGroupedByCity(data)).map((city, index) => (
  //     <div key={index} className="flex w-full items-center gap-2 border-b border-gray-300 py-1">
  //       <h1 className="w-1/3 text-center font-medium text-gray-500">{city}</h1>
  //       <h1 className="w-1/3 text-center font-medium text-gray-500">{getDataGroupedByCity(data)[city].plants}</h1>
  //       <h1 className="w-1/3 text-center font-medium text-gray-500">{getDataGroupedByCity(data)[city].modules}</h1>
  //     </div>
  //   ))
  // }
  // function renderDataGroupedByCitySecondScenario(data) {
  //   return Object.keys(getDataGroupedByCitySecondScenario(data)).map((city, index) => (
  //     <div key={index} className="flex w-full items-center gap-2 border-b border-gray-300 py-1">
  //       <h1 className="w-1/3 text-center font-medium text-gray-500">{city}</h1>
  //       <h1 className="w-1/3 text-center font-medium text-gray-500">{getDataGroupedByCitySecondScenario(data)[city].plants.toFixed(0)}</h1>
  //       <h1 className="w-1/3 text-center font-medium text-gray-500">{getDataGroupedByCitySecondScenario(data)[city].modules.toFixed(0)}</h1>
  //     </div>
  //   ))
  // }

  return (
    <div className="grow p-6">
      <div className="flex flex-col items-center justify-between gap-2 border-b border-gray-200 p-1">
        <h1 className="flex font-Poppins text-2xl font-black text-[#fead61]">RELATÓRIO DO SETOR DE O&M</h1>
        {/* <div className="flex w-full items-center justify-center gap-2">
          <DateFloatingInput
            label={'DATA DE VENCIMENTO'}
            editable={true}
            value={formatDate(dateParams.central)}
            handleChange={(value) => {
              setDateParams((prev) => ({ ...prev, central: value }))
              setBusinessDays((prev) => ({
                ...prev,
                central: dayjs(value).businessDiff(dayjs()),
              }))
            }}
          />
          <DateFloatingInput
            label={'DATA DE DILUIÇÃO'}
            editable={true}
            value={formatDate(dateParams.dilution)}
            handleChange={(value) => {
              setDateParams((prev) => ({ ...prev, dilution: value }))
              setBusinessDays((prev) => ({
                ...prev,
                dilution: dayjs(value).businessDiff(dayjs()),
              }))
            }}
          />
        </div> */}

        <div className="flex w-full items-center justify-center">
          <div className="w-full lg:w-[350px]">
            <Select
              placeholder={'CIDADES'}
              isMulti={true}
              styles={{
                control: (base, state) => ({
                  ...base,
                  width: '100%',
                  minHeight: '41px',
                }),
              }}
              options={cidadesAtendidas.map((city, index) => ({ label: city, value: city }))}
              onChange={(e) => {
                // @ts-ignore
                setFilters({ ...filters, cityArr: e.map((x) => x.value) })
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex w-full grow flex-col p-3">
        {isFetching ? <LoadingPage /> : null}
        {isSuccess ? (
          <div className="flex w-full flex-col gap-4">
            {/* <div className="flex w-full items-center justify-center py-2">
              <button onClick={() => setShowClientsNames((prev) => !prev)} className={`jgap-2 flex items-center rounded p-1 font-medium`}>
                <p>MOSTRAR CLIENTES</p>
                {showClientsNames ? <AiFillEye /> : <AiFillEyeInvisible />}
              </button>
            </div>
            <AnimatePresence>
              {showClientsNames ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0.6 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="overscroll-y flex h-fit max-h-[400px] w-full flex-col self-center overflow-y-auto border border-gray-200 p-2 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 lg:w-[50%]"
                >
                  {filteredDataByMaxDateParamSecondScenario.map((client, index) => (
                    <div key={index} className="flex w-full items-center justify-between gap-2 py-1 font-medium">
                      <div className="flex items-center gap-2">
                        <FaUserAlt style={{ color: '#15599a' }} />
                        <h1>{client.nomeDoContrato}</h1>
                      </div>
                      <h1>
                        VENCIDO EM <strong className="text-red-500">{dayjs(client.medidor.data).add(1, 'year').format('DD/MM/YYYY')}</strong>
                      </h1>
                    </div>
                  ))}
                </motion.div>
              ) : null}
            </AnimatePresence> */}
            {/** FIRST SCENARIO*/}
            <div className="flex w-full flex-col gap-4">
              <div className="flex flex-col items-center  justify-center bg-[#15599a] p-2">
                <p className="text-3xl font-bold text-white">CENÁRIO PRIMÁRIO</p>
                <p className="text-center text-sm font-medium italic text-white">
                  Considerando vencimento até: {formatDateAsLocale(scenarios.first.dueDate)}
                  {scenarios.first.dilutionDate ? `, com diluição até ${formatDateAsLocale(scenarios.first.dilutionDate)}` : null}
                </p>
              </div>
              {/** FIRST SCENARIO FILTERS*/}
              <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
                <div className="w-full lg:w-1/4">
                  <DateInput
                    label="DATA DE VENCIMENTO"
                    value={formatDate(scenarios.first.dueDate)}
                    handleChange={(value) => setScenarios((prev) => ({ ...prev, first: { ...prev.first, dueDate: formatDateInputChange(value) } }))}
                    width="100%"
                  />
                </div>
                <div className="w-full lg:w-1/4">
                  <DateInput
                    label="DATA DE DILUIÇÃO"
                    value={scenarios.first.dilutionDate ? formatDate(scenarios.first.dilutionDate) : undefined}
                    handleChange={(value) =>
                      setScenarios((prev) => ({ ...prev, first: { ...prev.first, dilutionDate: formatDateInputChange(value) } }))
                    }
                    width="100%"
                  />
                </div>
                <div className="w-full lg:w-1/4">
                  <div className={`flex w-full flex-col gap-1`}>
                    <h1 className={'font-sans font-bold text-[#353432]'}>DIAS ÚTEIS ATÉ O VENCIMENTO</h1>
                    <h1 className="h-[47px] w-full rounded-md border border-gray-200 p-3 text-sm outline-none placeholder:italic">
                      {/** @ts-ignore */}
                      {getBusinessDayDiff(scenarios.first.dueDate, new Date())}
                      {/* {dayjs(scenarios.first.dueDate).businessDiff(dayjs())} */}
                    </h1>
                  </div>
                </div>
                <div className="w-full lg:w-1/4">
                  <div className={`flex w-full flex-col gap-1`}>
                    <h1 className={'font-sans font-bold text-[#353432]'}>DIAS ÚTEIS ATÉ A DILUIÇÃO</h1>
                    <h1 className="h-[47px] w-full rounded-md border border-gray-200 p-3 text-sm outline-none placeholder:italic">
                      {/** @ts-ignore */}
                      {scenarios.first.dilutionDate ? getBusinessDayDiff(scenarios.first.dilutionDate, new Date()) : 'N/A'}
                      {/* {scenarios.first.dilutionDate ? dayjs(scenarios.first.dilutionDate).businessDiff(dayjs()) : 'N/A'} */}
                    </h1>
                  </div>
                </div>
              </div>
              <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
                <div className="flex w-full flex-col items-center rounded border border-gray-300 p-3 shadow-lg lg:w-1/3">
                  <h1 className="text-center font-Poppins text-lg font-medium text-[#15599a]">Nº DE USINAS A SEREM LIMPAS</h1>
                  <div className="flex w-full items-center justify-center gap-2">
                    <FaHome color="#fead41" size={'40px'} />
                    <p className="text-center font-Poppins text-2xl font-black text-[#fead41]">
                      {getTotals(firstScenarioData, scenarios.first.dueDate, scenarios.first.dilutionDate || null).general.plants}
                      {/* {getOverallTotalQty(filteredDataByMaxDateParam).plants} */}
                    </p>
                  </div>
                </div>
                <div className="flex w-full flex-col items-center rounded border border-gray-300 p-3 shadow-lg lg:w-1/3">
                  <h1 className="text-center font-Poppins text-lg font-medium text-[#15599a]">Nº DE MÓDULOS A SEREM LIMPOS</h1>
                  <div className="flex w-full items-center justify-center gap-2">
                    <FaHome color="#fead41" size={'40px'} />
                    <p className="text-center font-Poppins text-2xl font-black text-[#fead41]">
                      {getTotals(firstScenarioData, scenarios.first.dueDate, scenarios.first.dilutionDate || null).general.modules}
                      {/* {getOverallTotalQty(filteredDataByMaxDateParam).modules} */}
                    </p>
                  </div>
                </div>
                <div className="flex w-full flex-col items-center rounded border border-gray-300 p-3 shadow-lg lg:w-1/3">
                  <h1 className="text-center font-Poppins text-lg font-medium text-[#15599a]">Nº DE MÓDULOS POR DIA</h1>
                  <div className="flex w-full items-center justify-center gap-2">
                    <FaSolarPanel color="#fead41" size={'40px'} />
                    <p className="text-center font-Poppins text-2xl font-black text-[#fead41]">
                      {formatDecimalPlaces(
                        getTotals(firstScenarioData, scenarios.first.dueDate, scenarios.first.dilutionDate || null).general.modules /
                          getBusinessDayDiff(scenarios.first.dueDate, new Date())
                      )}
                      {/* {(getOverallTotalQty(filteredDataByMaxDateParam).modules / businessDays.central).toFixed(0)} */}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex w-full flex-col rounded border border-gray-300 shadow-lg">
                <div className="flex w-full items-center gap-2 bg-[#15599a]">
                  <h1 className="w-1/3 text-center font-medium text-white">CIDADE</h1>
                  <h1 className="w-1/3 text-center font-medium text-white">Nº DE USINAS</h1>
                  <h1 className="w-1/3 text-center font-medium text-white">Nº DE MÓDULOS</h1>
                </div>
                {renderStatsByCity(firstScenarioData, scenarios.first.dueDate, scenarios.first.dilutionDate)}
              </div>
            </div>
            {/** SECOND SCENARIO*/}
            <div className="flex w-full flex-col gap-4">
              <div className="flex flex-col items-center  justify-center bg-[#fead41] p-2">
                <p className="text-3xl font-bold text-white">CENÁRIO SECUNDÁRIO</p>
                <p className="text-center text-sm font-medium italic text-white">
                  Considerando vencimento até: {formatDateAsLocale(scenarios.second.dueDate)}
                  {scenarios.second.dilutionDate ? `, com diluição até ${formatDateAsLocale(scenarios.second.dilutionDate)}` : null}
                </p>
              </div>
              {/** SECOND SCENARIO FILTERS*/}
              <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
                <div className="w-full lg:w-1/4">
                  <DateInput
                    label="DATA DE VENCIMENTO"
                    value={formatDate(scenarios.second.dueDate)}
                    handleChange={(value) => setScenarios((prev) => ({ ...prev, second: { ...prev.second, dueDate: formatDateInputChange(value) } }))}
                    width="100%"
                  />
                </div>
                <div className="w-full lg:w-1/4">
                  <DateInput
                    label="DATA DE DILUIÇÃO"
                    value={scenarios.second.dilutionDate ? formatDate(scenarios.second.dilutionDate) : undefined}
                    handleChange={(value) =>
                      setScenarios((prev) => ({ ...prev, second: { ...prev.second, dilutionDate: formatDateInputChange(value) } }))
                    }
                    width="100%"
                  />
                </div>
                <div className="w-full lg:w-1/4">
                  <div className={`flex w-full flex-col gap-1`}>
                    <h1 className={'font-sans font-bold text-[#353432]'}>DIAS ÚTEIS ATÉ O VENCIMENTO</h1>
                    <h1 className="h-[47px] w-full rounded-md border border-gray-200 p-3 text-sm outline-none placeholder:italic">
                      {/** @ts-ignore */}
                      {dayjs(scenarios.second.dueDate).businessDiff(dayjs())}
                    </h1>
                  </div>
                </div>
                <div className="w-full lg:w-1/4">
                  <div className={`flex w-full flex-col gap-1`}>
                    <h1 className={'font-sans font-bold text-[#353432]'}>DIAS ÚTEIS ATÉ A DILUIÇÃO</h1>
                    <h1 className="h-[47px] w-full rounded-md border border-gray-200 p-3 text-sm outline-none placeholder:italic">
                      {/** @ts-ignore */}
                      {scenarios.second.dilutionDate ? dayjs(scenarios.second.dilutionDate).businessDiff(dayjs()) : 'N/A'}
                    </h1>
                  </div>
                </div>
              </div>
              <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
                <div className="flex w-full flex-col items-center rounded border border-gray-300 p-3 shadow-lg lg:w-1/3">
                  <h1 className="text-center font-Poppins text-lg font-medium text-[#15599a]">Nº DE USINAS A SEREM LIMPAS</h1>
                  <div className="flex w-full items-center justify-center gap-2">
                    <FaHome color="#fead41" size={'40px'} />
                    <p className="text-center font-Poppins text-2xl font-black text-[#fead41]">
                      {getTotals(secondScenarioData, scenarios.second.dueDate, scenarios.second.dilutionDate || null).general.plants}
                      {/* {getOverallTotalQty(filteredDataByMaxDateParamSecondScenario).plants} */}
                    </p>
                  </div>
                  <p className="text-center italic text-gray-500">
                    {formatDecimalPlaces(
                      getTotals(secondScenarioData, scenarios.second.dueDate, scenarios.second.dilutionDate || null).diluted.plants,
                      0,
                      0
                    )}{' '}
                    até {formatDateAsLocale(scenarios.second.dilutionDate)}
                  </p>
                </div>
                <div className="flex w-full flex-col items-center rounded border border-gray-300 p-3 shadow-lg lg:w-1/3">
                  <h1 className="text-center font-Poppins text-lg font-medium text-[#15599a]">Nº DE MÓDULOS À SEREM LIMPOS</h1>
                  <div className="flex w-full items-center justify-center gap-2">
                    <FaSolarPanel color="#fead41" size={'40px'} />
                    <p className="text-center font-Poppins text-2xl font-black text-[#fead41]">
                      {getTotals(secondScenarioData, scenarios.second.dueDate, scenarios.second.dilutionDate || null).general.modules}
                      {/* {getOverallTotalQty(filteredDataByMaxDateParamSecondScenario).plants} */}
                    </p>
                  </div>
                  <p className="text-center italic text-gray-500">
                    {formatDecimalPlaces(
                      getTotals(secondScenarioData, scenarios.second.dueDate, scenarios.second.dilutionDate || null).diluted.modules,
                      0,
                      0
                    )}{' '}
                    até {formatDateAsLocale(scenarios.second.dilutionDate)}
                  </p>
                </div>
                <div className="flex w-full flex-col items-center rounded border border-gray-300 p-3 shadow-lg lg:w-1/3">
                  <h1 className="text-center font-Poppins text-lg font-medium text-[#15599a]">Nº DE MÓDULOS POR DIA</h1>
                  <div className="flex w-full items-center justify-center gap-2">
                    <FaSolarPanel color="#fead41" size={'40px'} />
                    <p className="text-center font-Poppins text-2xl font-black text-[#fead41]">
                      {formatDecimalPlaces(
                        getTotals(secondScenarioData, scenarios.second.dueDate, scenarios.second.dilutionDate || null).general.modules /
                          getBusinessDayDiff(scenarios.second.dueDate, new Date())
                      )}
                      {/* {(getOverallTotalQty(filteredDataByMaxDateParamSecondScenario).modules / businessDays.dilution).toFixed(0)} */}
                    </p>
                  </div>
                  <p className="text-center italic text-gray-500">
                    {formatDecimalPlaces(
                      getTotals(secondScenarioData, scenarios.second.dueDate, scenarios.second.dilutionDate || null).diluted.modules /
                        getBusinessDayDiff(scenarios.second.dilutionDate, new Date())
                    )}{' '}
                    até {formatDateAsLocale(scenarios.second.dilutionDate)}
                  </p>
                </div>
              </div>
              <div className="flex w-full flex-col rounded border border-gray-300 shadow-lg">
                <div className="flex w-full items-center gap-2 bg-[#15599a]">
                  <h1 className="w-1/3 text-center font-medium text-white">CIDADE</h1>
                  <h1 className="w-1/3 text-center font-medium text-white">Nº DE USINAS</h1>
                  <h1 className="w-1/3 text-center font-medium text-white">Nº DE MÓDULOS</h1>
                </div>
                {renderStatsByCity(secondScenarioData, scenarios.second.dueDate, scenarios.second.dilutionDate)}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default RelatorioSetor
