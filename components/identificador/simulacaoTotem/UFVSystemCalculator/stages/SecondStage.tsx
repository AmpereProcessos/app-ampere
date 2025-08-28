import React from 'react'
import TotemTextInput from '../../inputs/TotemTextInput'
import { TTotemSimulation } from '@/utils/schemas/totem-simulation'
import SelectInputVirtualized from '@/components/inputs/SelectVirtualized'
import StatesAndCities from '@/utils/jsons/estados-cidades.json'

const AllCities = StatesAndCities.flatMap((s) => s.cidades).map((c, index) => ({ id: index + 1, label: c, value: c }))
const AllStates = StatesAndCities.map((e) => e.sigla).map((c, index) => ({ id: index + 1, label: c, value: c }))
type SecondStageProps = {
  infoHolder: TTotemSimulation
  setInfoHolder: React.Dispatch<React.SetStateAction<TTotemSimulation>>
  moveToNextStage: () => void
}
function SecondStage({ infoHolder, setInfoHolder, moveToNextStage }: SecondStageProps) {
  return (
    <div className="flex w-full flex-col items-center gap-10 text-center">
      <div className="flex w-full flex-col gap-0.5 self-center">
        <p className="text-primary text-center text-lg font-medium">Diz aí pra gente onde você mora.</p>
        <p className="text-lg font-black text-[#15599a] dark:text-[#fead41]">Isso nos ajuda a dimensionar com mais precisão.</p>
      </div>
      <div className="flex w-full flex-col gap-3">
        <SelectInputVirtualized
          label="ESTADO"
          labelClassName="text-primary text-start tracking-tighter text-xs"
          options={AllStates}
          holderClassName="border-primary/30"
          selectedItemLabel={'NÃO DEFINIDO'}
          onReset={() => setInfoHolder((prev) => ({ ...prev, uf: '' }))}
          value={infoHolder.uf || ''}
          handleChange={(value) => setInfoHolder((prev) => ({ ...prev, uf: value }))}
          width="100%"
        />
        <SelectInputVirtualized
          label="CIDADE"
          labelClassName="text-primary text-start tracking-tighter text-xs"
          holderClassName="border-primary/30"
          options={AllCities}
          selectedItemLabel={'NÃO DEFINIDO'}
          onReset={() => setInfoHolder((prev) => ({ ...prev, cidade: '' }))}
          value={infoHolder.cidade || ''}
          handleChange={(value) => setInfoHolder((prev) => ({ ...prev, cidade: value }))}
          width="100%"
        />
      </div>
    </div>
  )
}

export default SecondStage
