import { TProjectDTOWithHomologation } from '@/utils/schemas/projects'
import React from 'react'
import CheckboxInput from '../inputs/Checkbox'

type PendenciesInformationProps = {
  infoHolder: TProjectDTOWithHomologation
  setInfoHolder: React.Dispatch<React.SetStateAction<TProjectDTOWithHomologation>>
  changes: { [key: string]: any }
  setChanges: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>
}
function PendenciesInformation({ infoHolder, setInfoHolder, changes, setChanges }: PendenciesInformationProps) {
  console.log('PENDENCIAS', infoHolder.homologacao.pendencias)
  return (
    <div className="flex w-full flex-col gap-2">
      <h1 className="w-full rounded bg-gray-800 p-1 text-center font-bold text-white">CONTROLE</h1>
      <div className="flex w-full flex-col items-center justify-center gap-4 lg:flex-row">
        <div className="w-fit">
          <CheckboxInput
            labelFalse="DIAGRAMAS FEITOS"
            labelTrue="DIAGRAMAS FEITOS"
            checked={!!infoHolder.homologacao.pendencias.diagramas}
            handleChange={(value) => {
              setInfoHolder((prev) => ({
                ...prev,
                homologacao: {
                  ...prev.homologacao,
                  pendencias: { ...prev.homologacao.pendencias, diagramas: value ? new Date().toISOString() : null },
                },
              }))
              setChanges((prev) => ({ ...prev, 'homologacao.pendencias.diagramas': value ? new Date().toISOString() : null }))
            }}
          />
        </div>
        <div className="w-fit">
          <CheckboxInput
            labelFalse="FORMULÁRIOS FEITOS"
            labelTrue="FORMULÁRIOS FEITOS"
            checked={!!infoHolder.homologacao.pendencias.formularios}
            handleChange={(value) => {
              setInfoHolder((prev) => ({
                ...prev,
                homologacao: {
                  ...prev.homologacao,
                  pendencias: { ...prev.homologacao.pendencias, formularios: value ? new Date().toISOString() : null },
                },
              }))
              setChanges((prev) => ({ ...prev, 'homologacao.pendencias.formularios': value ? new Date().toISOString() : null }))
            }}
          />
        </div>
        <div className="w-fit">
          <CheckboxInput
            labelFalse="DESENHOS FEITOS"
            labelTrue="DESENHOS FEITOS"
            checked={!!infoHolder.homologacao.pendencias.desenhos}
            handleChange={(value) => {
              setInfoHolder((prev) => ({
                ...prev,
                homologacao: {
                  ...prev.homologacao,
                  pendencias: { ...prev.homologacao.pendencias, desenhos: value ? new Date().toISOString() : null },
                },
              }))
              setChanges((prev) => ({ ...prev, 'homologacao.pendencias.desenhos': value ? new Date().toISOString() : null }))
            }}
          />
        </div>
        <div className="w-fit">
          <CheckboxInput
            labelFalse="MAPAS DE MICRO"
            labelTrue="MAPAS DE MICRO"
            checked={!!infoHolder.homologacao.pendencias.mapasDeMicro}
            handleChange={(value) => {
              setInfoHolder((prev) => ({
                ...prev,
                homologacao: {
                  ...prev.homologacao,
                  pendencias: { ...prev.homologacao.pendencias, mapasDeMicro: value ? new Date().toISOString() : null },
                },
              }))
              setChanges((prev) => ({ ...prev, 'homologacao.pendencias.mapasDeMicro': value ? new Date().toISOString() : null }))
            }}
          />
        </div>
        <div className="w-fit">
          <CheckboxInput
            labelFalse="DISTRIBUIÇÃO DE CRÉDITOS FEITA"
            labelTrue="DISTRIBUIÇÃO DE CRÉDITOS FEITA"
            checked={!!infoHolder.homologacao.pendencias.distribuicoes}
            handleChange={(value) => {
              setInfoHolder((prev) => ({
                ...prev,
                homologacao: {
                  ...prev.homologacao,
                  pendencias: { ...prev.homologacao.pendencias, distribuicoes: value ? new Date().toISOString() : null },
                },
              }))
              setChanges((prev) => ({ ...prev, 'homologacao.pendencias.distribuicoes': value ? new Date().toISOString() : null }))
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default PendenciesInformation
