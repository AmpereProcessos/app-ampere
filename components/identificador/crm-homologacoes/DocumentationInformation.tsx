import DateInput from '@/components/inputs/Date'
import { formatDate } from '@/utils/constants'
import { formatDateInputChange } from '@/utils/methods/shared'
import { THomologationDTO } from '@/utils/schemas/crm/homologation.schema'

type DocumentationInformationProps = {
  infoHolder: THomologationDTO
  setInfoHolder: React.Dispatch<React.SetStateAction<THomologationDTO>>
}
function DocumentationInformation({ infoHolder, setInfoHolder }: DocumentationInformationProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <h1 className="w-full rounded bg-gray-800 p-1 text-center font-bold text-white">INFORMAÇÕES SOBRE A DOCUMENTAÇÃO</h1>
      <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <DateInput
            label="DATA DE LIBERAÇÃO PARA ASSINATURA"
            value={formatDate(infoHolder.documentacao.dataLiberacao)}
            handleChange={(value) =>
              setInfoHolder((prev) => ({ ...prev, documentacao: { ...prev.documentacao, dataLiberacao: formatDateInputChange(value) } }))
            }
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/2">
          <DateInput
            label="DATA DE ASSINATURA DA DOCUMENTAÇÃO"
            value={formatDate(infoHolder.documentacao.dataAssinatura)}
            handleChange={(value) =>
              setInfoHolder((prev) => ({ ...prev, documentacao: { ...prev.documentacao, dataAssinatura: formatDateInputChange(value) } }))
            }
            width="100%"
          />
        </div>
      </div>
      <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <DateInput
            label="INÍCIO DA ELABORAÇÃO DAS DOCUMENTAÇÕES"
            value={formatDate(infoHolder.documentacao.dataInicioElaboracao)}
            handleChange={(value) =>
              setInfoHolder((prev) => ({ ...prev, documentacao: { ...prev.documentacao, dataInicioElaboracao: formatDateInputChange(value) } }))
            }
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/2">
          <DateInput
            label="CONCLUSÃO DA ELABORAÇÃO DAS DOCUMENTAÇÕES"
            value={formatDate(infoHolder.documentacao.dataConclusaoElaboracao)}
            handleChange={(value) =>
              setInfoHolder((prev) => ({ ...prev, documentacao: { ...prev.documentacao, dataConclusaoElaboracao: formatDateInputChange(value) } }))
            }
            width="100%"
          />
        </div>
      </div>
    </div>
  )
}

export default DocumentationInformation
