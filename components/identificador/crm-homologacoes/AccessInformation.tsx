import CheckboxInput from '@/components/inputs/Checkbox'
import DateInput from '@/components/inputs/Date'
import TextInput from '@/components/inputs/Text'
import { formatDate } from '@/utils/constants'
import { formatDateInputChange } from '@/utils/methods/shared'
import { THomologationDTO } from '@/utils/schemas/crm/homologation.schema'

type AccessInformationProps = {
  infoHolder: THomologationDTO
  setInfoHolder: React.Dispatch<React.SetStateAction<THomologationDTO>>
}
function AccessInformation({ infoHolder, setInfoHolder }: AccessInformationProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <h1 className="bg-primary/80 w-full rounded p-1 text-center font-bold text-white">INFORMAÇÕES SOBRE O PARECER DE ACESSO</h1>
      <div className="flex w-full items-center justify-center">
        <div className="w-fit">
          <CheckboxInput
            labelFalse="MODALIDADE FAST-TRACK"
            labelTrue="MODALIDADE FAST-TRACK"
            checked={!!infoHolder.fastTrack}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, fastTrack: value }))}
          />
        </div>
      </div>
      <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
        <div className="w-full lg:w-1/3">
          <TextInput
            label="CÓDIGO (NS) DA HOMOLOGAÇÃO"
            placeholder="Preencha o código de acompanhamento da homologação..."
            value={infoHolder.acesso.codigo}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, acesso: { ...prev.acesso, codigo: value } }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/3">
          <DateInput
            label="DATA DE SOLICITAÇÃO DA HOMOLOGAÇÃO"
            value={formatDate(infoHolder.acesso.dataSolicitacao)}
            handleChange={(value) =>
              setInfoHolder((prev) => ({ ...prev, acesso: { ...prev.acesso, dataSolicitacao: formatDateInputChange(value) } }))
            }
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/3">
          <DateInput
            label="DATA DE RESPOSTA DA HOMOLOGAÇÃO"
            value={formatDate(infoHolder.acesso.dataResposta)}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, acesso: { ...prev.acesso, dataResposta: formatDateInputChange(value) } }))}
            width="100%"
          />
        </div>
      </div>
    </div>
  )
}

export default AccessInformation
