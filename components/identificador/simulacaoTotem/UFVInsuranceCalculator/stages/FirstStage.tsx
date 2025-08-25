import { TTotemSimulation } from '@/utils/schemas/totem-simulation'
import React from 'react'
import TotemNumberInput from '../../inputs/TotemNumberInput'
import toast from 'react-hot-toast'

type FirstStageProps = {
  infoHolder: TTotemSimulation
  setInfoHolder: React.Dispatch<React.SetStateAction<TTotemSimulation>>
  moveToNextStage: () => void
}
function FirstStage({ infoHolder, setInfoHolder, moveToNextStage }: FirstStageProps) {
  function validateFields() {
    if (!infoHolder.premissas.numModulos || Number(infoHolder.premissas.numModulos) == 0) {
      toast.error('Oops, preencha um número de módulos válido para prosseguir.')
      return false
    }
    return true
  }

  return (
    <div className="flex h-[400px] w-full flex-col">
      <div className="flex h-[300px] flex-col items-center text-center">
        <div className="flex h-[146px] w-[300px] flex-col items-center justify-center lg:w-[350px]">
          <div className="relative w-full leading-none">
            <p className="m-0 inline text-[19px] font-normal leading-[1.2] text-[rgba(79,88,96,1)]">
              Simule aqui o investimento necessário para segurar o seu{' '}
              <strong className="m-0 inline text-[19px] font-black leading-[1.2] text-[rgba(21,89,154,1)]">Sistema Fotovoltaico</strong>!
            </p>
          </div>
        </div>
        <div className="flex h-[300px] w-[300px] flex-col items-center justify-center gap-1 font-normal lg:w-[350px]">
          <div className="flex w-full items-center text-[rgba(79,88,96,1)] ">
            <p className="m-0 w-[365px] text-[15px] leading-[1.2]">Qual valor você investiu na sua usina fotovoltaica ?</p>
          </div>
          <div className="w-full text-[rgba(3,11,19,1)]">
            <TotemNumberInput
              showLabel={false}
              label=""
              placeholder=""
              value={infoHolder.premissas.valorReferencia || null}
              handleChange={(value) => {
                console.log('VALOR', value)
                setInfoHolder((prev) => ({ ...prev, premissas: { ...prev.premissas, valorReferencia: Number(value) } }))
              }}
              showTag={true}
            />
          </div>
        </div>
      </div>
      <div className="flex h-[100px] w-full flex-col items-center justify-center gap-4 self-stretch text-center font-black text-white">
        <div className="w-full">
          <div className="flex flex-1 grow flex-col items-center justify-center rounded-lg bg-linear-to-l from-[rgba(13,53,92,1)] to-[rgba(21,89,154,1)] p-3 duration-300 hover:scale-[1.02]">
            <p onClick={() => moveToNextStage()} className="m-0 w-full cursor-pointer text-[19px] leading-[1.2]">
              Próximo
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FirstStage
