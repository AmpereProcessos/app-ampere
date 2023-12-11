import Fireworks from '@fireworks-js/react'
import React, { useRef } from 'react'
import AmpereTeam from '../utils/images/time-ampere.jpg'
import Image from 'next/image'
function Test() {
  const ref = useRef()
  return (
    <div className="flex grow flex-col p-6">
      <Fireworks
        ref={ref}
        options={{ opacity: 0.1 }}
        style={{
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          position: 'fixed',
        }}
      />
      <div className="flex w-full items-center justify-center gap-2">
        <div className="flex w-full items-center justify-center lg:w-[40%]">
          <Image src={AmpereTeam} quality={100} alt="Avatar" fill={true} style={{ borderRadius: '2%' }} />
        </div>

        <div className="flex h-full w-full flex-col items-start lg:w-[60%]">
          <div className="mb-2 flex w-full flex-col">
            <h1 className="w-full text-center text-lg font-extrabold">META ALCANÇADA !!!</h1>
            <div className="flex h-[45px] w-full items-center justify-between self-center border border-gray-500 bg-[#a8a9aa]">
              <div
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
          <h1 className="w-full text-center text-3xl font-black text-[#15599a]">Na Ampère, todo mundo vende !</h1>
          <h1 className="w-full text-center text-xl font-bold text-[#fead41]">Onde todos vendem, todos ganham !</h1>
        </div>
      </div>
    </div>
  )
}

export default Test
