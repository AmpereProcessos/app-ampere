import { TProjectDTOWithHomologation } from '@/utils/schemas/projects'
import TextInput from '../inputs/Text'
import DateInput from '../inputs/Date'
import { formatDate } from '@/utils/constants'
import { formatDateInputChange } from '@/utils/methods/shared'
import CheckboxInput from '../inputs/Checkbox'

type AccessInformationProps = {
  infoHolder: TProjectDTOWithHomologation
  setInfoHolder: React.Dispatch<React.SetStateAction<TProjectDTOWithHomologation>>
  changes: { [key: string]: any }
  setChanges: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>
}
function AccessInformation({ infoHolder, setInfoHolder, changes, setChanges }: AccessInformationProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <h1 className="w-full rounded bg-gray-800 p-1 text-center font-bold text-white">INFORMAÇÕES SOBRE O PARECER DE ACESSO</h1>
      <div className="flex w-full items-center justify-center">
        <div className="w-fit">
          <CheckboxInput
            labelFalse="MODALIDADE FAST-TRACK"
            labelTrue="MODALIDADE FAST-TRACK"
            checked={!!infoHolder.homologacao.fastTrack}
            handleChange={(value) => {
              setInfoHolder((prev) => ({ ...prev, homologacao: { ...prev.homologacao, fastTrack: value } }))
              setChanges((prev) => ({ ...prev, 'homologacao.fastTrack': value }))
            }}
          />
        </div>
      </div>
      <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
        <div className="w-full lg:w-1/3">
          <TextInput
            label="CÓDIGO (NS) DA HOMOLOGAÇÃO"
            placeholder="Preencha o código de acompanhamento da homologação..."
            value={infoHolder.homologacao.acesso.codigo}
            handleChange={(value) => {
              setInfoHolder((prev) => ({ ...prev, homologacao: { ...prev.homologacao, acesso: { ...prev.homologacao.acesso, codigo: value } } }))
              setChanges((prev) => ({ ...prev, 'homologacao.acesso.codigo': value }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/3">
          <DateInput
            label="DATA DE SOLICITAÇÃO DA HOMOLOGAÇÃO"
            value={formatDate(infoHolder.homologacao.acesso.dataSolicitacao)}
            handleChange={(value) => {
              setInfoHolder((prev) => ({
                ...prev,
                homologacao: { ...prev.homologacao, acesso: { ...prev.homologacao.acesso, dataSolicitacao: formatDateInputChange(value) } },
              }))
              setChanges((prev) => ({ ...prev, 'homologacao.acesso.dataSolicitacao': formatDateInputChange(value) }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/3">
          <DateInput
            label="DATA DE APROVAÇÃO DA HOMOLOGAÇÃO"
            value={formatDate(infoHolder.homologacao.acesso.dataResposta)}
            handleChange={(value) => {
              setInfoHolder((prev) => ({
                ...prev,
                homologacao: { ...prev.homologacao, acesso: { ...prev.homologacao.acesso, dataResposta: formatDateInputChange(value) } },
              }))
              setChanges((prev) => ({ ...prev, 'homologacao.acesso.dataResposta': formatDateInputChange(value) }))
            }}
            width="100%"
          />
        </div>
      </div>
    </div>
  )
}

export default AccessInformation
