import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import LoadingPage from '../../components/utils/LoadingPage'
import { useOeMReportData } from '../../utils/methods/query/oem'
import { cidadesAtendidas, formatDate, formatToMoney, validateAuthorization } from '../../utils/constants'
import { FaSolarPanel, FaHouse, FaHome, FaUserAlt } from 'react-icons/fa'
import dayjs from 'dayjs'
import dayjsBusinessDays from 'dayjs-business-days'
import DateFloatingInput from '../../components/DateFloatingInput'
import { AnimatePresence, motion } from 'framer-motion'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import Select from 'react-select'
import NumberFloatingInput from '../../components/NumberFloatingInput'
import SelectInput from '../../components/inputs/Select'
dayjs.extend(dayjsBusinessDays)
const dateParam = '2022-12-31T24:00:00.000Z'

const initialCentralDateParam = '2023-12-31T20:00:00.000Z'
const initialDilutionDateParam = '2024-03-31T20:00:00.000Z'

function getCorrespondentDateInPreviousYear(date) {
  const previousYear = new Date(date).getFullYear() - 1
  const month = new Date(date).getMonth()
  const day = new Date(date).getDate()
  return new Date(previousYear, month, day)
}

function getDayDiff(d1, d2) {
  const timeDiff = Math.abs(new Date(d2) - new Date(d1))
  const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
  return dayDiff
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
  const [dateParams, setDateParams] = useState({
    central: initialCentralDateParam,
    dilution: initialDilutionDateParam,
  })
  const [businessDays, setBusinessDays] = useState({
    central: dayjs(initialCentralDateParam).businessDiff(dayjs()),
    dilution: dayjs(initialDilutionDateParam).businessDiff(dayjs()),
  })
  // Getting data and instances of filtered date based on date filter params
  const { data, isFetching, isSuccess, filters, setFilters } = useOeMReportData(validateAuthorization(session, 'O&M'))
  const filteredDataByMaxDateParam = data ? data.filter((x) => new Date(x.medidor.data) < getCorrespondentDateInPreviousYear(dateParams.central)) : []

  const filteredDataByMaxDateParamSecondScenario = data
    ? data.filter((x) => new Date(x.medidor.data) < getCorrespondentDateInPreviousYear(dateParams.dilution))
    : []

  // Calculating stats
  function getOverallTotalQty(info) {
    if (!info) return { plants: 0, modules: 0 }
    const totalModulesQty = info.reduce((acc, current) => {
      const currentModules = isNaN(current.sistema?.qtdeModulos) ? 0 : Number(current.sistema?.qtdeModulos)
      return acc + currentModules
    }, 0)
    const totalPlantsQty = info.length
    return { plants: totalPlantsQty, modules: totalModulesQty }
  }
  function getDilutedOverallTotalQty(info) {
    if (!info) return { plants: 0, modules: 0 }
    const numeratorDays = getDayDiff(new Date(), new Date(dateParams.central))
    const denominatorDays = getDayDiff(new Date(), new Date(dateParams.dilution))
    const dilutionMultiplier = numeratorDays / denominatorDays

    const totalModulesQty = info.reduce((acc, current) => {
      const currentModules = isNaN(current.sistema?.qtdeModulos) ? 0 : Number(current.sistema?.qtdeModulos)
      return acc + currentModules
    }, 0)
    const totalPlantsQty = info.length
    return {
      plants: totalPlantsQty * dilutionMultiplier,
      modules: totalModulesQty * dilutionMultiplier,
    }
  }
  function getDataGroupedByCitySecondScenario(info) {
    // Corresponding to months from now till central date param
    const numeratorDays = getDayDiff(new Date(), new Date(dateParams.central))
    const denominatorDays = getDayDiff(new Date(), new Date(dateParams.dilution))
    const multiplier = numeratorDays / denominatorDays
    // console.log("MULTIPLICADOR", multiplier);
    const groupedResult = info.reduce((acc, current) => {
      const city = current.cidade
      const currentModules = isNaN(current.sistema?.qtdeModulos) ? 0 : Number(current.sistema?.qtdeModulos)
      if (!acc[city]) {
        acc[city] = {
          plants: 0,
          modules: 0,
        }
      }
      acc[city].plants = acc[city].plants + 1 * multiplier
      acc[city].modules = acc[city].modules + currentModules * multiplier
      return acc
    }, {})
    return groupedResult
  }
  function getDataGroupedByCity(info) {
    const groupedResult = info.reduce((acc, current) => {
      const city = current.cidade
      const currentModules = isNaN(current.sistema?.qtdeModulos) ? 0 : Number(current.sistema?.qtdeModulos)
      if (!acc[city]) {
        acc[city] = {
          plants: 0,
          modules: 0,
        }
      }
      acc[city].plants = acc[city].plants + 1
      acc[city].modules = acc[city].modules + currentModules
      return acc
    }, {})
    return groupedResult
  }
  function renderDataGroupedByCity(data) {
    return Object.keys(getDataGroupedByCity(data)).map((city, index) => (
      <div key={index} className="flex w-full items-center gap-2 border-b border-gray-300 py-1">
        <h1 className="w-1/3 text-center font-medium text-gray-500">{city}</h1>
        <h1 className="w-1/3 text-center font-medium text-gray-500">{getDataGroupedByCity(data)[city].plants}</h1>
        <h1 className="w-1/3 text-center font-medium text-gray-500">{getDataGroupedByCity(data)[city].modules}</h1>
      </div>
    ))
  }
  function renderDataGroupedByCitySecondScenario(data) {
    return Object.keys(getDataGroupedByCitySecondScenario(data)).map((city, index) => (
      <div key={index} className="flex w-full items-center gap-2 border-b border-gray-300 py-1">
        <h1 className="w-1/3 text-center font-medium text-gray-500">{city}</h1>
        <h1 className="w-1/3 text-center font-medium text-gray-500">{getDataGroupedByCitySecondScenario(data)[city].plants.toFixed(0)}</h1>
        <h1 className="w-1/3 text-center font-medium text-gray-500">{getDataGroupedByCitySecondScenario(data)[city].modules.toFixed(0)}</h1>
      </div>
    ))
  }
  console.log('UTEIS', businessDays.central, businessDays.dilution)
  return (
    <div className="grow p-6">
      <div className="flex flex-col items-center justify-between gap-2 border-b border-gray-200 p-1">
        <h1 className="flex font-Poppins text-2xl font-black text-[#fead61]">RELATÓRIO DO SETOR DE O&M</h1>
        <div className="flex w-full items-center justify-center gap-2">
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
        </div>
        <div className="flex w-full items-center justify-center gap-2">
          <NumberFloatingInput
            label={'DIAS UTEIS ATÉ VENCIMENTO'}
            editable={true}
            value={businessDays.central}
            handleChange={(value) => setBusinessDays((prev) => ({ ...prev, central: Number(value) }))}
          />
          <NumberFloatingInput
            label={'DIAS UTEIS ATÉ DILUIÇÃO'}
            editable={true}
            value={businessDays.dilution}
            handleChange={(value) => setBusinessDays((prev) => ({ ...prev, dilution: Number(value) }))}
          />
        </div>
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
            <div className="flex w-full items-center justify-center py-2">
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
            </AnimatePresence>
            <div className="flex flex-col items-center  justify-center bg-[#15599a] p-2">
              <p className="text-3xl font-bold text-white">CENÁRIO GERAL</p>
              <p className="text-center text-sm font-medium italic text-white">
                Considerando vencimento até: {dayjs(dateParam).format('DD/MM/YYYY')}
              </p>
            </div>

            <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
              <div className="flex w-full flex-col items-center rounded border border-gray-300 p-3 shadow-lg lg:w-1/3">
                <h1 className="text-center font-Poppins text-lg font-medium text-[#15599a]">Nº DE USINAS A SEREM LIMPAS</h1>
                <div className="flex w-full items-center justify-center gap-2">
                  <FaHome color="#fead41" size={'40px'} />
                  <p className="text-center font-Poppins text-2xl font-black text-[#fead41]">
                    {getOverallTotalQty(filteredDataByMaxDateParam).plants}
                  </p>
                </div>
              </div>
              <div className="flex w-full flex-col items-center rounded border border-gray-300 p-3 shadow-lg lg:w-1/3">
                <h1 className="text-center font-Poppins text-lg font-medium text-[#15599a]">Nº DE MÓDULOS A SEREM LIMPOS</h1>
                <div className="flex w-full items-center justify-center gap-2">
                  <FaHome color="#fead41" size={'40px'} />
                  <p className="text-center font-Poppins text-2xl font-black text-[#fead41]">
                    {getOverallTotalQty(filteredDataByMaxDateParam).modules}
                  </p>
                </div>
              </div>
              <div className="flex w-full flex-col items-center rounded border border-gray-300 p-3 shadow-lg lg:w-1/3">
                <h1 className="text-center font-Poppins text-lg font-medium text-[#15599a]">Nº DE MÓDULOS POR DIA</h1>
                <div className="flex w-full items-center justify-center gap-2">
                  <FaSolarPanel color="#fead41" size={'40px'} />
                  <p className="text-center font-Poppins text-2xl font-black text-[#fead41]">
                    {(getOverallTotalQty(filteredDataByMaxDateParam).modules / businessDays.central).toFixed(0)}
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
              {renderDataGroupedByCity(filteredDataByMaxDateParam)}
            </div>
            <div className="flex flex-col items-center  justify-center bg-[#fead41] p-2">
              <p className="text-3xl font-bold text-white">CENÁRIO SECUNDÁRIO</p>
              <p className="text-center text-sm font-medium italic text-white">
                Considerando diluição das manutenção pendentes até {dayjs(dateParams.central).format('DD/MM/YYYY')} em até{' '}
                {dayjs(dateParams.dilution).format('DD/MM/YYYY')}
              </p>
            </div>
            <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
              <div className="flex w-full flex-col items-center rounded border border-gray-300 p-3 shadow-lg lg:w-1/3">
                <h1 className="text-center font-Poppins text-lg font-medium text-[#15599a]">Nº DE USINAS A SEREM LIMPAS</h1>
                <div className="flex w-full items-center justify-center gap-2">
                  <FaHome color="#fead41" size={'40px'} />
                  <p className="text-center font-Poppins text-2xl font-black text-[#fead41]">
                    {getOverallTotalQty(filteredDataByMaxDateParamSecondScenario).plants}
                  </p>
                </div>
                <p className="text-center italic text-gray-500">
                  {getDilutedOverallTotalQty(filteredDataByMaxDateParamSecondScenario).plants.toFixed(0)} até{' '}
                  {dayjs(dateParams.central).format('DD/MM/YYYY')}
                </p>
              </div>
              <div className="flex w-full flex-col items-center rounded border border-gray-300 p-3 shadow-lg lg:w-1/3">
                <h1 className="text-center font-Poppins text-lg font-medium text-[#15599a]">Nº DE MÓDULOS À SEREM LIMPOS</h1>
                <div className="flex w-full items-center justify-center gap-2">
                  <FaSolarPanel color="#fead41" size={'40px'} />
                  <p className="text-center font-Poppins text-2xl font-black text-[#fead41]">
                    {getOverallTotalQty(filteredDataByMaxDateParamSecondScenario).modules}
                  </p>
                </div>
                <p className="text-center italic text-gray-500">
                  {getDilutedOverallTotalQty(filteredDataByMaxDateParamSecondScenario).modules.toFixed(0)} até{' '}
                  {dayjs(dateParams.central).format('DD/MM/YYYY')}
                </p>
              </div>
              <div className="flex w-full flex-col items-center rounded border border-gray-300 p-3 shadow-lg lg:w-1/3">
                <h1 className="text-center font-Poppins text-lg font-medium text-[#15599a]">Nº DE MÓDULOS POR DIA</h1>
                <div className="flex w-full items-center justify-center gap-2">
                  <FaSolarPanel color="#fead41" size={'40px'} />
                  <p className="text-center font-Poppins text-2xl font-black text-[#fead41]">
                    {(getOverallTotalQty(filteredDataByMaxDateParamSecondScenario).modules / businessDays.dilution).toFixed(0)}
                  </p>
                </div>
                <p className="text-center italic text-gray-500">
                  {(getDilutedOverallTotalQty(filteredDataByMaxDateParamSecondScenario).modules / businessDays.central).toFixed(0)} até{' '}
                  {dayjs(dateParams.central).format('DD/MM/YYYY')}
                </p>
              </div>
            </div>
            <div className="flex w-full flex-col rounded border border-gray-300 shadow-lg">
              <div className="flex w-full items-center gap-2 bg-[#15599a]">
                <h1 className="w-1/3 text-center font-medium text-white">CIDADE</h1>
                <h1 className="w-1/3 text-center font-medium text-white">Nº DE USINAS</h1>
                <h1 className="w-1/3 text-center font-medium text-white">Nº DE MÓDULOS</h1>
              </div>
              {renderDataGroupedByCitySecondScenario(filteredDataByMaxDateParamSecondScenario)}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default RelatorioSetor
