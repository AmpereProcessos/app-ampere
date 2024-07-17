import CheckboxInput from '@/components/inputs/Checkbox'
import { THomologation } from '@/utils/schemas/crm/homologation.schema'

type PendenciesInformationProps = {
  infoHolder: THomologation
  setInfoHolder: React.Dispatch<React.SetStateAction<THomologation>>
}
function PendenciesInformation({ infoHolder, setInfoHolder }: PendenciesInformationProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <h1 className="w-full rounded bg-gray-800 p-1 text-center font-bold text-white">PENDÊNCIAS</h1>
      <div className="flex w-full flex-col items-center justify-center gap-4 lg:flex-row">
        <div className="w-fit">
          <CheckboxInput
            labelFalse="DIAGRAMAS FEITOS"
            labelTrue="DIAGRAMAS FEITOS"
            checked={!!infoHolder.pendencias.diagramas}
            handleChange={(value) => {
              setInfoHolder((prev) => ({
                ...prev,
                pendencias: { ...prev.pendencias, diagramas: value ? new Date().toISOString() : null },
              }))
            }}
          />
        </div>
        <div className="w-fit">
          <CheckboxInput
            labelFalse="FORMULÁRIOS FEITOS"
            labelTrue="FORMULÁRIOS FEITOS"
            checked={!!infoHolder.pendencias.formularios}
            handleChange={(value) => {
              setInfoHolder((prev) => ({
                ...prev,
                pendencias: { ...prev.pendencias, formularios: value ? new Date().toISOString() : null },
              }))
            }}
          />
        </div>
        <div className="w-fit">
          <CheckboxInput
            labelFalse="DESENHOS FEITOS"
            labelTrue="DESENHOS FEITOS"
            checked={!!infoHolder.pendencias.desenhos}
            handleChange={(value) => {
              setInfoHolder((prev) => ({
                ...prev,
                pendencias: { ...prev.pendencias, desenhos: value ? new Date().toISOString() : null },
              }))
            }}
          />
        </div>
        <div className="w-fit">
          <CheckboxInput
            labelFalse="MAPAS DE MICRO"
            labelTrue="MAPAS DE MICRO"
            checked={!!infoHolder.pendencias.mapasDeMicro}
            handleChange={(value) => {
              setInfoHolder((prev) => ({
                ...prev,
                pendencias: { ...prev.pendencias, mapasDeMicro: value ? new Date().toISOString() : null },
              }))
            }}
          />
        </div>
        <div className="w-fit">
          <CheckboxInput
            labelFalse="DISTRIBUIÇÃO DE CRÉDITOS FEITA"
            labelTrue="DISTRIBUIÇÃO DE CRÉDITOS FEITA"
            checked={!!infoHolder.pendencias.distribuicoes}
            handleChange={(value) => {
              setInfoHolder((prev) => ({
                ...prev,
                pendencias: { ...prev.pendencias, distribuicoes: value ? new Date().toISOString() : null },
              }))
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default PendenciesInformation
