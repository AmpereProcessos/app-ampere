import React, { useState } from 'react'
import EnergyDiscountImage from '@/utils/images/discount-image.png'
import LogoAmpere from '@/utils/images/logo-texto-azul.png'
import LogoEnergea from '@/utils/images/energea-color.png'
import Image from 'next/image'
import { FaMinus, FaPlus } from 'react-icons/fa'
import { formatToMoney } from '@/utils/constants'
import SelectInput from '@/components/inputs/Select'

type TSimulation = {
  expense: number
  distributor: 'CEMIG' | 'EQUATORIAL'
  tariff: number
  connection: string
}
function EnergyConsortiumCalculator() {
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
  const [simulation, setSimulation] = useState<TSimulation>({
    expense: 250,
    distributor: 'CEMIG',
    tariff: 0.93,
    connection: 'BIFÁSICO',
  })
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
          <Image src={EnergyDiscountImage} width={600} height={600} />
        </div>
      </div>
      <div className="flex h-full w-full grow flex-col rounded-tl-md rounded-br-md bg-[#fff] p-6">
        <h1 className="w-full text-center text-2xl font-black text-[#15599a]">SIMULE AQUI SEU DESCONTO DE ENERGIA</h1>
        <div className="mt-6 flex w-full grow flex-col gap-5">
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
          <div className="flex w-full flex-col items-center gap-4 self-center lg:w-[70%] lg:flex-row">
            <div className="w-full lg:w-1/2">
              <SelectInput
                label="DISTRIBUIDORA DE ENERGIA"
                labelClassName="tracking-tight  font-medium"
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
                label="CONEXÃO"
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
          <div className="flex w-full flex-col gap-4 self-center lg:w-[70%]">
            <h1 className="w-full text-center text-sm font-medium leading-none tracking-tight">SUA ECONOMIA SERÁ DE:</h1>
            <div className="flex w-full flex-col items-center justify-center gap-4 lg:flex-row">
              <h1 className="text-3xl font-black tracking-tight">{formatToMoney(handleCalculation({ simulation }).economy)} / MÊS</h1>
              <div className="h-[1px] w-full bg-black lg:h-full lg:w-[1px]"></div>
              <h1 className="text-3xl font-black tracking-tight">
                <strong className="text-[#04e762]">{formatToMoney(handleCalculation({ simulation }).economy * 12)}</strong> / ANO
              </h1>
            </div>
          </div>
        </div>
        <div className="flex w-full items-center justify-end gap-4 p-6">
          <Image src={LogoAmpere} height={50} width={150} />
          <Image src={LogoEnergea} height={50} width={120} />
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
