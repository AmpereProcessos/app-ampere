import React from 'react'
import TotemTextInput from '../../inputs/TotemTextInput'
import { TTotemSimulation } from '@/utils/schemas/totem-simulation'

type SecondStageProps = {
  infoHolder: TTotemSimulation
  setInfoHolder: React.Dispatch<React.SetStateAction<TTotemSimulation>>
  moveToNextStage: () => void
}
function SecondStage({ infoHolder, setInfoHolder, moveToNextStage }: SecondStageProps) {
  return (
    <div className="flex h-[400px] w-full flex-col">
      <div className="flex h-[300px] w-full flex-1 grow flex-col items-center justify-center gap-3 self-stretch text-left font-normal text-[rgba(79,88,96,1)]">
        <div className="flex h-[120px] w-[300px] flex-col items-center justify-center lg:w-[350px]">
          <div className="relative flex w-full flex-col leading-none">
            <p className="m-0 inline text-center text-[19px] font-normal leading-[1.2] text-[rgba(79,88,96,1)]">Diz aí pra gente onde você mora.</p>{' '}
            <strong className="text-md m-0 inline text-center text-[19px] font-black leading-[1.2] text-[rgba(21,89,154,1)]">
              Isso nos ajuda a dimensionar com mais precisão.
            </strong>
          </div>
        </div>
        <div className="flex h-[200px] flex-col gap-2">
          <div className="flex w-[300px] flex-col items-center justify-center gap-1 lg:w-[350px]">
            <div className="flex w-full items-start self-stretch">
              <div>
                <p className="m-0 w-[300px] text-[15px] leading-[1.2] lg:w-[350px]">Preencha seu estado (sigla)</p>
              </div>
            </div>
            <div className="w-full">
              <TotemTextInput
                showLabel={false}
                label=""
                placeholder=""
                value={infoHolder.uf || ''}
                handleChange={(value) => setInfoHolder((prev) => ({ ...prev, uf: value }))}
                width="100%"
              />
            </div>
          </div>
          <div className="flex w-[300px] flex-col items-center justify-center gap-1 lg:w-[350px]">
            <div className="flex w-full items-start self-stretch">
              <div>
                <p className="m-0 w-[300px] text-[15px] leading-[1.2] lg:w-[350px]">Preencha sua cidade</p>
              </div>
            </div>
            <div className="w-full">
              <TotemTextInput
                showLabel={false}
                label=""
                placeholder=""
                value={infoHolder.cidade || ''}
                handleChange={(value) => setInfoHolder((prev) => ({ ...prev, cidade: value }))}
                width="100%"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex h-[100px] w-full flex-col items-center justify-center gap-4 self-stretch text-center font-black text-white">
        <div className="w-full">
          <div
            onClick={() => moveToNextStage()}
            className="flex flex-1 grow cursor-pointer flex-col items-center justify-center rounded-lg bg-linear-to-l from-[rgba(13,53,92,1)] to-[rgba(21,89,154,1)] p-3 duration-300 hover:scale-[1.02]"
          >
            <p className="m-0 w-full text-[19px] leading-[1.2]">Próximo</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SecondStage
