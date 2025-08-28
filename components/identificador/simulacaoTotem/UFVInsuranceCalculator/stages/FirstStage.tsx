import { TTotemSimulation } from '@/utils/schemas/totem-simulation'
import React from 'react'
import NumberInput from '@/components/inputs/Number'

type FirstStageProps = {
  infoHolder: TTotemSimulation
  setInfoHolder: React.Dispatch<React.SetStateAction<TTotemSimulation>>
}
function FirstStage({ infoHolder, setInfoHolder }: FirstStageProps) {
  return (
    <div className="flex w-full flex-col items-center gap-10 text-center">
      {/** SECTION TITLE */}
      <div className="flex w-full flex-col gap-0.5 self-center">
        <p className="text-primary text-center text-lg font-medium">Simule aqui o investimento necessário para segurar o seu</p>
        <p className="text-xl font-black text-[#15599a] dark:text-[#fead41]">Sistema Fotovoltaico !</p>
      </div>
      {/** SECTION INPUTS */}
      <div className="flex w-full flex-col gap-3">
        <NumberInput
          label="QUAL VALOR VOCÊ INVESTIU NA SUA USINA FOTOVOLTAICA?"
          labelClassName="text-primary text-start tracking-tighter text-xs"
          placeholder="Preencha o valor investido em R$..."
          holderClassName="border-primary/30"
          value={infoHolder.premissas.valorReferencia || null}
          handleChange={(value) => {
            setInfoHolder((prev) => ({ ...prev, premissas: { ...prev.premissas, valorReferencia: Number(value) } }))
          }}
          width="100%"
        />
      </div>
    </div>
  )
}

export default FirstStage
