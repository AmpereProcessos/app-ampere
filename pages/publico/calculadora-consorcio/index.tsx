import React, { useState } from 'react'
import EnergyDiscountImage from '@/utils/svgs/manage-money.svg'
import LogoAmpere from '@/utils/images/logo-texto-azul.png'
import LogoEnergea from '@/utils/images/energea-color.png'
import Image from 'next/image'
import { FaMinus, FaPlus } from 'react-icons/fa'
import { formatToMoney, GeneralVisibleHiddenExitMotionVariants } from '@/utils/constants'
import SelectInput from '@/components/inputs/Select'
import TextInput from '@/components/inputs/Text'
import { TSimulation } from '@/pages/api/integracao/rd-station/energy-consortium'
import axios from 'axios'
import { getErrorMessage } from '@/utils/methods/handlers'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'

const DISCOUNT = 0.18
const BASE_PUBLIC_ILUMINATION_PRICE = 20
const CONNECTIONS = [
  { id: 1, label: 'MONOFÁSICO', value: 'MONOFÁSICO', disponibility: 30 },
  { id: 2, label: 'BIFÁSICO', value: 'BIFÁSICO', disponibility: 50 },
  { id: 3, label: 'TRIFÁSICO', value: 'TRIFÁSICO', disponibility: 100 },
]
const ENERGY_TARIFFS = [
  { id: 1, distributor: 'CEMIG', tariff: 0.93 },
  { id: 2, distributor: 'EQUATORIAL', tariff: 0.8 },
]

type TStateHolder = {
  status: null | 'loading' | 'concluded' | 'error'
  text: string
}

function EnergyConsortiumCalculator() {
  const [stateHolder, setStateHolder] = useState<TStateHolder>({
    status: null,
    text: '',
  })
  const [simulation, setSimulation] = useState<TSimulation>({
    userName: '',
    userEmail: '',
    expense: 250,
    distributor: 'CEMIG',
    tariff: 0.93,
    connection: 'BIFÁSICO',
  })
  const [result, setResult] = useState({ newExpense: 0, economy: 0 })
  async function handleSimulation({ simulation }: { simulation: TSimulation }) {
    try {
      setStateHolder({ status: 'loading', text: 'Iniciando simulação...' })
      await new Promise((resolve) => setTimeout(resolve, 1000)) // 3 sec
      setStateHolder({ status: 'loading', text: 'Executando cálculos...' })
      const { data } = await axios.post('/api/integracao/rd-station/energy-consortium', simulation)
      const newExpense = data.data?.newExpense || 0
      const economy = data.data?.economy || 0
      setStateHolder({ status: 'concluded', text: 'Simulação concluída !' })
      return setResult({ newExpense, economy })
    } catch (error) {
      const msg = getErrorMessage(error)
      setStateHolder({ status: 'error', text: msg })
    }
  }
  function handleCalculation({ simulation }: { simulation: TSimulation }) {
    const { expense, distributor, tariff, connection } = simulation
    const disponibility = CONNECTIONS.find((c) => c.value == connection)?.disponibility || 30

    const energyConsumption = (expense - BASE_PUBLIC_ILUMINATION_PRICE) / tariff

    const acquirable = energyConsumption - disponibility

    // New expenses
    const newDistributorExpense = BASE_PUBLIC_ILUMINATION_PRICE + disponibility * 1.02 * tariff // 1.02 to fix taxes and other tariffs
    const newConsortiumExpense = (1 - DISCOUNT) * tariff * acquirable
    const newExpense = newDistributorExpense + newConsortiumExpense

    const economy = expense - newExpense
    return { newExpense, economy }
  }
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[#15599a] p-3 font-[Inter] lg:flex-row">
      <div className="flex h-full w-full flex-col justify-between lg:w-2/3">
        <div className="flex w-full grow items-center justify-center">
          <div className="h-[250px] w-[250px] lg:h-[600px] lg:w-[600px]">
            <Image src={EnergyDiscountImage} alt="" />
          </div>
        </div>
        <a className="text-[0.3rem] text-gray-100" href="https://storyset.com/people">
          People illustrations by Storyset
        </a>
      </div>
      <div className="flex h-full w-full grow flex-col rounded-tl-md rounded-br-md bg-[#fff] p-6">
        <h1 className="w-full text-center text-2xl font-black text-[#15599a]">SIMULE AQUI SEU DESCONTO DE ENERGIA</h1>
        <div className="mt-6 flex w-full grow flex-col gap-5">
          <div className="flex w-full flex-col items-center gap-4 self-center lg:w-[70%] lg:flex-row">
            <div className="w-full lg:w-1/2">
              <TextInput
                label="SEU NOME"
                placeholder="Preencha aqui o seu nome..."
                value={simulation.userName}
                handleChange={(value) => setSimulation((prev) => ({ ...prev, userName: value }))}
                width="100%"
                labelClassName="tracking-tight font-medium"
              />
            </div>
            <div className="w-full lg:w-1/2">
              <TextInput
                label="SEU EMAIL"
                placeholder="Preencha aqui o seu email..."
                value={simulation.userEmail}
                handleChange={(value) => setSimulation((prev) => ({ ...prev, userEmail: value }))}
                width="100%"
                labelClassName="tracking-tight font-medium"
              />
            </div>
          </div>
          <div className="flex w-full flex-col items-center gap-4 self-center lg:w-[70%] lg:flex-row">
            <div className="w-full lg:w-1/2">
              <SelectInput
                label="SUA DISTRIBUIDORA DE ENERGIA"
                labelClassName="tracking-tight font-medium"
                value={simulation.distributor}
                options={ENERGY_TARIFFS.map((t) => ({ ...t, label: t.distributor, value: t.distributor }))}
                selectedItemLabel="NÃO DEFINIDA"
                handleChange={(value) => {
                  const tariff = ENERGY_TARIFFS.find((t) => t.distributor == value)
                  setSimulation((prev) => ({ ...prev, distributor: value, tariff: tariff?.tariff || 0.93 }))
                }}
                onReset={() =>
                  setSimulation((prev) => ({
                    ...prev,
                    distributor: ENERGY_TARIFFS[0].distributor as TSimulation['distributor'],
                    tariff: ENERGY_TARIFFS[0].tariff,
                  }))
                }
                width="100%"
              />
            </div>
            <div className="w-full lg:w-1/2">
              <SelectInput
                label="SEU TIPO DE CONEXÃO"
                labelClassName="tracking-tight  font-medium"
                value={simulation.connection}
                options={CONNECTIONS}
                selectedItemLabel="NÃO DEFINIDA"
                handleChange={(value) => {
                  setSimulation((prev) => ({ ...prev, connection: value }))
                }}
                onReset={() => setSimulation((prev) => ({ ...prev, connection: 'BIFÁSICO' }))}
                width="100%"
              />
            </div>
          </div>
          <div className="flex w-full flex-col items-center gap-4 self-center lg:w-[70%]">
            <h1 className="w-full text-center text-sm font-medium tracking-tight">QUANTO VOCÊ GASTA DE ENERGIA POR MÊS ? </h1>
            <div className="flex w-full items-center justify-between gap-4 self-center">
              <button
                onClick={() => setSimulation((prev) => ({ ...prev, expense: prev.expense - 10 }))}
                className="flex items-center justify-center rounded-full border border-gray-500 bg-[#fff] p-3 text-xs duration-300 ease-in-out hover:scale-105 hover:bg-gray-100 lg:text-lg"
              >
                <FaMinus />
              </button>
              <h1 className="text-4xl font-black ">{formatToMoney(simulation.expense)}</h1>
              <button
                onClick={() => setSimulation((prev) => ({ ...prev, expense: prev.expense + 10 }))}
                className="flex items-center justify-center rounded-full border border-gray-500 bg-[#fff] p-3 text-xs duration-300 ease-in-out hover:scale-105 hover:bg-gray-100 lg:text-lg"
              >
                <FaPlus />
              </button>
            </div>
            <div className="flex w-full items-center justify-between gap-3">
              <button
                onClick={() => setSimulation((prev) => ({ ...prev, expense: 100 }))}
                className="min-w-1/5 flex w-[40%] items-center justify-center rounded-md border border-gray-500 bg-white p-2 py-4 text-xs font-bold duration-300 ease-in-out hover:scale-105 hover:bg-gray-100 lg:w-1/4 lg:p-3 lg:py-6 lg:text-lg"
              >
                R$ 100
              </button>
              <button
                onClick={() => setSimulation((prev) => ({ ...prev, expense: 250 }))}
                className="min-w-1/5 flex w-[40%] items-center justify-center rounded-md border border-gray-500 bg-white p-2 py-4 text-xs font-bold duration-300 ease-in-out hover:scale-105 hover:bg-gray-100 lg:w-1/4 lg:p-3 lg:py-6 lg:text-lg"
              >
                R$ 250
              </button>
              <button
                onClick={() => setSimulation((prev) => ({ ...prev, expense: 500 }))}
                className="min-w-1/5 flex w-[40%] items-center justify-center rounded-md border border-gray-500 bg-white p-2 py-4 text-xs font-bold duration-300 ease-in-out hover:scale-105 hover:bg-gray-100 lg:w-1/4 lg:p-3 lg:py-6 lg:text-lg"
              >
                R$ 500
              </button>
              <button
                onClick={() => setSimulation((prev) => ({ ...prev, expense: 1000 }))}
                className="min-w-1/5 flex w-[40%] items-center justify-center rounded-md border border-gray-500 bg-white p-2 py-4 text-xs font-bold duration-300 ease-in-out hover:scale-105 hover:bg-gray-100 lg:w-1/4 lg:p-3 lg:py-6 lg:text-lg"
              >
                R$ 1000
              </button>
            </div>
          </div>
          {!stateHolder.status || stateHolder.status == 'error' ? (
            <div className="flex min-h-[50px] w-full flex-col items-center justify-center gap-1">
              <button
                onClick={() => handleSimulation({ simulation })}
                className="rounded bg-black p-3 px-12 font-bold text-white duration-300 hover:scale-[1.02] hover:bg-gray-800"
              >
                SIMULAR
              </button>
              {stateHolder.status == 'error' ? <h1 className="text-center font-medium text-red-500">{stateHolder.text}</h1> : null}
            </div>
          ) : null}
          {stateHolder.status == 'concluded' ? (
            <AnimatePresence>
              <motion.div
                key={'editor'}
                variants={GeneralVisibleHiddenExitMotionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex w-full flex-col gap-4 self-center lg:w-[70%]"
              >
                <h1 className="w-full text-center text-sm font-medium leading-none tracking-tight">SUA ECONOMIA SERÁ DE:</h1>
                <div className="flex w-full flex-col items-center justify-center gap-4 lg:flex-row">
                  <h1 className="text-3xl font-black tracking-tight">{formatToMoney(result.economy)} / MÊS</h1>
                  <div className="h-[1px] w-full bg-black lg:h-full lg:w-[1px]"></div>
                  <h1 className="text-3xl font-black tracking-tight">
                    <strong className="text-[#04e762]">{formatToMoney(result.economy * 12)}</strong> / ANO
                  </h1>
                </div>
                <div className="flex flex-col items-center justify-center gap-2 lg:flex-row lg:justify-end">
                  <h1 className="text-sm tracking-tight text-gray-500">Deseja economizar na sua conta de energia ?</h1>
                  <Link
                    href={
                      'https://portal.energea.com.br/auto-servir?empresa=1714682702286x426663626911252500&REP=1714682746611x553649292113980600&plano=1667231520862x115446081571782660'
                    }
                  >
                    <button className="rounded bg-green-600 p-2 px-12 text-xs font-bold text-white duration-300 hover:scale-[1.02] hover:bg-green-700">
                      ADQUIRA JÁ
                    </button>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : null}
          {stateHolder.status == 'loading' ? (
            <div className="flex min-h-[50px] w-full items-center justify-center">
              <h1 className="animate-pulse text-center font-medium text-gray-500">{stateHolder.text}</h1>
            </div>
          ) : null}
          {/* <div className="flex w-full flex-col gap-4 self-center lg:w-[70%]">
            <h1 className="w-full text-center text-sm font-medium leading-none tracking-tight">SUA ECONOMIA SERÁ DE:</h1>
            <div className="flex w-full flex-col items-center justify-center gap-4 lg:flex-row">
              <h1 className="text-3xl font-black tracking-tight">{formatToMoney(handleCalculation({ simulation }).economy)} / MÊS</h1>
              <div className="h-[1px] w-full bg-black lg:h-full lg:w-[1px]"></div>
              <h1 className="text-3xl font-black tracking-tight">
                <strong className="text-[#04e762]">{formatToMoney(handleCalculation({ simulation }).economy * 12)}</strong> / ANO
              </h1>
            </div>
          </div> */}
        </div>
        <div className="flex w-full items-center justify-end gap-4 p-6">
          <Image src={LogoAmpere} height={50} width={150} alt="Logo Ampère" />
          <Image src={LogoEnergea} height={50} width={150} alt="Logo Energea" />
        </div>
      </div>
    </div>
  )
  // return (
  //   <div className="flex h-full w-full flex-col items-center justify-center bg-[#fff] p-3 font-[Inter] lg:flex-row">
  //     <div className="flex h-full w-full flex-col justify-between lg:w-2/3">
  //       <div className="flex w-full grow items-center justify-center">
  //         <Image src={EnergyDiscountImage} width={600} height={600} />
  //       </div>
  //     </div>
  //     <div className="flex h-full w-full grow flex-col rounded-tl-md rounded-br-md bg-[#15599a] p-6">
  //       <h1 className="w-full text-center text-2xl font-black text-[#fead41]">SIMULE AQUI SEU DESCONTO DE ENERGIA</h1>
  //       <div className="mt-6 flex w-full grow flex-col gap-5">
  //         <div className="flex w-full flex-col items-center gap-4 self-center lg:w-[70%]">
  //           <h1 className="w-full text-center font-medium tracking-tight text-white">QUANTO VOCÊ GASTA DE ENERGIA POR MÊS ? </h1>
  //           <div className="flex w-full items-center justify-between gap-4 self-center">
  //             <button
  //               onClick={() => setSimulation((prev) => ({ ...prev, expense: prev.expense - 10 }))}
  //               className="flex items-center justify-center rounded-full bg-[#fff] p-3 text-xs duration-300 ease-in-out hover:scale-105 hover:bg-gray-100 lg:text-lg"
  //             >
  //               <FaMinus />
  //             </button>
  //             <h1 className="text-4xl font-black text-white">{formatToMoney(simulation.expense)}</h1>
  //             <button
  //               onClick={() => setSimulation((prev) => ({ ...prev, expense: prev.expense + 10 }))}
  //               className="flex items-center justify-center rounded-full bg-[#fff] p-3 text-xs duration-300 ease-in-out hover:scale-105 hover:bg-gray-100 lg:text-lg"
  //             >
  //               <FaPlus />
  //             </button>
  //           </div>
  //           <div className="flex w-full items-center justify-between gap-3">
  //             <button
  //               onClick={() => setSimulation((prev) => ({ ...prev, expense: 100 }))}
  //               className="min-w-1/5 flex w-[40%] items-center justify-center rounded-md border border-gray-500 bg-white p-2 py-4 text-xs font-bold duration-300 ease-in-out hover:scale-105 hover:bg-gray-100 lg:w-1/4 lg:p-3 lg:py-6 lg:text-lg"
  //             >
  //               R$ 100
  //             </button>
  //             <button
  //               onClick={() => setSimulation((prev) => ({ ...prev, expense: 250 }))}
  //               className="min-w-1/5 flex w-[40%] items-center justify-center rounded-md border border-gray-500 bg-white p-2 py-4 text-xs font-bold duration-300 ease-in-out hover:scale-105 hover:bg-gray-100 lg:w-1/4 lg:p-3 lg:py-6 lg:text-lg"
  //             >
  //               R$ 250
  //             </button>
  //             <button
  //               onClick={() => setSimulation((prev) => ({ ...prev, expense: 500 }))}
  //               className="min-w-1/5 flex w-[40%] items-center justify-center rounded-md border border-gray-500 bg-white p-2 py-4 text-xs font-bold duration-300 ease-in-out hover:scale-105 hover:bg-gray-100 lg:w-1/4 lg:p-3 lg:py-6 lg:text-lg"
  //             >
  //               R$ 500
  //             </button>
  //             <button
  //               onClick={() => setSimulation((prev) => ({ ...prev, expense: 1000 }))}
  //               className="min-w-1/5 flex w-[40%] items-center justify-center rounded-md border border-gray-500 bg-white p-2 py-4 text-xs font-bold duration-300 ease-in-out hover:scale-105 hover:bg-gray-100 lg:w-1/4 lg:p-3 lg:py-6 lg:text-lg"
  //             >
  //               R$ 1000
  //             </button>
  //           </div>
  //         </div>
  //         <div className="flex w-full flex-col items-center gap-4 self-center lg:w-[70%] lg:flex-row">
  //           <div className="w-full lg:w-1/2">
  //             <SelectInput
  //               label="DISTRIBUIDORA DE ENERGIA"
  //               labelClassName="tracking-tight text-white font-medium"
  //               value={simulation.distributor}
  //               options={ENERGY_TARIFFS.map((t) => ({ ...t, label: t.distributor, value: t.distributor }))}
  //               selectedItemLabel="NÃO DEFINIDA"
  //               handleChange={(value) => {
  //                 const tariff = ENERGY_TARIFFS.find((t) => t.distributor == value)
  //                 setSimulation((prev) => ({ ...prev, distributor: value, tariff: tariff?.tariff || 0.93 }))
  //               }}
  //               onReset={() =>
  //                 setSimulation((prev) => ({
  //                   ...prev,
  //                   distributor: ENERGY_TARIFFS[0].distributor as TSimulation['distributor'],
  //                   tariff: ENERGY_TARIFFS[0].tariff,
  //                 }))
  //               }
  //               width="100%"
  //             />
  //           </div>
  //           <div className="w-full lg:w-1/2">
  //             <SelectInput
  //               label="CONEXÃO"
  //               labelClassName="tracking-tight text-white font-medium"
  //               value={simulation.connection}
  //               options={CONNECTIONS}
  //               selectedItemLabel="NÃO DEFINIDA"
  //               handleChange={(value) => {
  //                 setSimulation((prev) => ({ ...prev, connection: value }))
  //               }}
  //               onReset={() => setSimulation((prev) => ({ ...prev, connection: 'BIFÁSICO' }))}
  //               width="100%"
  //             />
  //           </div>
  //         </div>
  //         <h1 className="w-full text-center font-medium tracking-tight text-white">SUA ECONOMIA SERÁ DE:</h1>
  //         <div className="flex w-full flex-col items-center justify-center gap-4 lg:flex-row">
  //           <h1 className="text-5xl font-black text-white">{formatToMoney(handleCalculation({ simulation }).economy)} / MÊS</h1>
  //           <div className="h-[1px] w-full bg-white lg:h-full lg:w-[1px]"></div>
  //           <h1 className="text-5xl font-black text-white">
  //             <strong className="text-[#04e762]">{formatToMoney(handleCalculation({ simulation }).economy * 12)}</strong> / ANO
  //           </h1>
  //         </div>
  //       </div>
  //       <div className="flex w-full items-center justify-end gap-4 p-6">
  //         <Image src={LogoAmpere} height={70} width={180} />
  //         <Image src={LogoEnergea} height={70} width={180} />
  //       </div>
  //     </div>
  //   </div>
  // )
}

export default EnergyConsortiumCalculator
