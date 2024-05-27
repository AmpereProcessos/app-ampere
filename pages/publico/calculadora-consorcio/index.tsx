import React, { useState } from 'react'
import EnergyDiscountImage from '@/utils/images/discount-image.png'
import LogoAmpere from '@/utils/images/logo-texto-horizontal-branco.png'
import LogoEnergea from '@/utils/images/energea.png'
import Image from 'next/image'
function EnergyConsortiumCalculator() {
  const [simulation, setSimulation] = useState({
    expense: 150,
  })
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[#fff] p-3 lg:flex-row">
      <div className="flex w-full items-center justify-center lg:w-2/3">
        <Image src={EnergyDiscountImage} width={600} height={600} />
      </div>
      <div className="flex h-full w-full grow flex-col rounded-tl-md rounded-br-md bg-[#15599a]">
        <div className="flex w-full items-center justify-end gap-4 p-6">
          <Image src={LogoAmpere} height={60} width={180} />
          <Image src={LogoEnergea} height={60} width={180} />
        </div>
        <h1 className="w-full text-center font-raleway text-2xl font-black text-white">SIMULE AQUI SEU DESCONTO DE ENERGIA</h1>
        <div className="flex w-full grow flex-col justify-center">
          <div className="flex w-full flex-col">
            <h1 className="w-full text-center tracking-tight text-white">Quanto você gasta de energia por mês ? </h1>
            <input
              value={simulation.expense}
              className="bg-transparent p-3 text-center text-lg text-white outline-none"
              onChange={(e) => setSimulation((prev) => ({ ...prev, expense: Number(e.target.value) }))}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnergyConsortiumCalculator
