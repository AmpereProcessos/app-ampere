import { TProjectDTOWithHomologation } from '@/utils/schemas/projects'
import React from 'react'
import DateInput from '../inputs/Date'
import { formatDate } from '@/utils/constants'
import { formatDateInputChange } from '@/utils/methods/shared'

type VistoryInformationProps = {
  infoHolder: TProjectDTOWithHomologation
  setInfoHolder: React.Dispatch<React.SetStateAction<TProjectDTOWithHomologation>>
  changes: { [key: string]: any }
  setChanges: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>
}
function VistoryInformation({ infoHolder, setInfoHolder, changes, setChanges }: VistoryInformationProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <h1 className="w-full rounded bg-gray-800 p-1 text-center font-bold text-white">INFORMAÇÕES SOBRE A VISTORIA</h1>
      <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <DateInput
            label="DATA DE SOLICITAÇÃO DA VISTORIA"
            value={formatDate(infoHolder.homologacao.vistoria.dataSolicitacao)}
            handleChange={(value) => {
              setInfoHolder((prev) => ({
                ...prev,
                homologacao: { ...prev.homologacao, vistoria: { ...prev.homologacao.vistoria, dataSolicitacao: formatDateInputChange(value) } },
              }))
              setChanges((prev) => ({ ...prev, 'homologacao.vistoria.dataSolicitacao': formatDateInputChange(value) }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/2">
          <DateInput
            label="DATA DE EXECUÇÃO DA VISTORIA"
            value={formatDate(infoHolder.homologacao.vistoria.dataEfetivacao)}
            handleChange={(value) => {
              setInfoHolder((prev) => ({
                ...prev,
                homologacao: { ...prev.homologacao, vistoria: { ...prev.homologacao.vistoria, dataEfetivacao: formatDateInputChange(value) } },
              }))
              setChanges((prev) => ({ ...prev, 'homologacao.vistoria.dataEfetivacao': formatDateInputChange(value) }))
            }}
            width="100%"
          />
        </div>
      </div>
    </div>
  )
}

export default VistoryInformation
