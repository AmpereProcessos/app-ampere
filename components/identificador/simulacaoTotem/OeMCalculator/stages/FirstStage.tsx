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
    <div className="flex h-fit w-full flex-col">
      <div className="flex h-[300px] w-full flex-1 flex-grow flex-col items-center justify-center gap-3 self-stretch font-normal text-[rgba(79,88,96,1)]">
        <div className="flex h-[146px] w-[300px] flex-col items-center justify-center lg:w-[350px]">
          <div className="relative w-full leading-none">
            <p className="m-0 inline text-[19px] font-normal leading-[1.2] text-[rgba(79,88,96,1)]">
              Simule o investimento e o retorno que você terá obtendo nossos serviços de{' '}
              <strong className="m-0 inline text-[19px] font-black leading-[1.2] text-[rgba(21,89,154,1)]">Operação & Manutenção</strong>!
            </p>
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-1 text-left">
          <div className="w-[300px] lg:w-[350px]">
            <div>
              <p className="m-0 w-[300px] text-[15px] leading-[1.2] lg:w-[350px]">Quantos painéis fotovoltaicos você possui ?</p>
            </div>
          </div>
          <div className="w-[300px] lg:w-[350px]">
            <TotemNumberInput
              showLabel={false}
              label=""
              showTag={false}
              placeholder=""
              value={infoHolder.premissas.numModulos || ''}
              handleChange={(value) =>
                setInfoHolder((prev) => ({
                  ...prev,
                  premissas: {
                    ...prev.premissas,
                    numModulos: Number(value),
                  },
                }))
              }
              width="100%"
            />
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-1 text-left">
          <div className="w-[300px] lg:w-[350px]">
            <div>
              <p className="m-0 w-[300px] text-[15px] leading-[1.2] lg:w-[350px]">
                Lembra qual a potência pico do seu sistema ? Diz aí pra gente se souber
              </p>
            </div>
          </div>
          <div className="w-[300px] lg:w-[350px]">
            <TotemNumberInput
              showLabel={false}
              label=""
              showTag={false}
              placeholder=""
              value={infoHolder.premissas.potenciaPico || ''}
              handleChange={(value) =>
                setInfoHolder((prev) => ({
                  ...prev,
                  premissas: {
                    ...prev.premissas,
                    potenciaPico: Number(value),
                  },
                }))
              }
              width="100%"
            />
          </div>
        </div>
      </div>
      <div className="flex h-[100px] w-full flex-col items-center justify-center gap-4 self-stretch text-center font-black text-white">
        <div className="w-full">
          <div className="flex flex-1 flex-grow flex-col items-center justify-center rounded-lg bg-gradient-to-l from-[rgba(13,53,92,1)] to-[rgba(21,89,154,1)] p-3 duration-300 hover:scale-[1.02]">
            <p
              onClick={() => {
                if (validateFields()) return moveToNextStage()
              }}
              className="m-0 w-full cursor-pointer text-[19px] leading-[1.2]"
            >
              Próximo
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FirstStage
