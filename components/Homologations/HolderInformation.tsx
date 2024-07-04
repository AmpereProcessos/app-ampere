import { TProjectDTOWithHomologation } from '@/utils/schemas/projects'
import React from 'react'
import TextInput from '../inputs/Text'
import { formatToCPForCNPJ, formatToPhone } from '@/utils/methods/formatting'
import SelectInput from '../inputs/Select'
import { SigningForms } from '@/utils/select-options'

type HolderInformationProps = {
  infoHolder: TProjectDTOWithHomologation
  setInfoHolder: React.Dispatch<React.SetStateAction<TProjectDTOWithHomologation>>
  changes: { [key: string]: any }
  setChanges: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>
}
function HolderInformation({ infoHolder, setInfoHolder, changes, setChanges }: HolderInformationProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <h1 className="w-full rounded bg-gray-800 p-1 text-center font-bold text-white">INFORMAÇÕES DO TITULAR DA INSTALAÇÃO ELÉTRICA</h1>
      <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
        <div className="w-full lg:w-1/3">
          <TextInput
            label="NOME DO TITULAR"
            placeholder="Preencha o nome do titular da instalação..."
            value={infoHolder.homologacao.titular.nome}
            handleChange={(value) => {
              setInfoHolder((prev) => ({ ...prev, homologacao: { ...prev.homologacao, titular: { ...prev.homologacao.titular, nome: value } } }))
              setChanges((prev) => ({ ...prev, 'homologacao.titular.nome': value }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/3">
          <TextInput
            label="CPF/CNPJ DO TITULAR"
            placeholder="Preencha o cpf ou cpnj do titular da instalação..."
            value={infoHolder.homologacao.titular.identificador}
            handleChange={(value) => {
              setInfoHolder((prev) => ({
                ...prev,
                homologacao: { ...prev.homologacao, titular: { ...prev.homologacao.titular, identificador: formatToCPForCNPJ(value) } },
              }))
              setChanges((prev) => ({ ...prev, 'homologacao.titular.identificador': formatToCPForCNPJ(value) }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/3">
          <TextInput
            label="TELEFONE DO TITULAR"
            placeholder="Preencha o telefone do titular da instalação..."
            value={infoHolder.homologacao.titular.contato}
            handleChange={(value) => {
              setInfoHolder((prev) => ({
                ...prev,
                homologacao: { ...prev.homologacao, titular: { ...prev.homologacao.titular, contato: formatToPhone(value) } },
              }))
              setChanges((prev) => ({ ...prev, 'homologacao.titular.contato': formatToPhone(value) }))
            }}
            width="100%"
          />
        </div>
      </div>
      <div className="flex w-full items-center justify-center">
        <div className="w-full lg:w-1/3">
          <SelectInput
            label="FORMA DE ASSINATURA"
            selectedItemLabel="NÃO DEFINIDO"
            options={SigningForms}
            value={infoHolder.homologacao.documentacao.formaAssinatura}
            handleChange={(value) => {
              setInfoHolder((prev) => ({
                ...prev,
                homologacao: {
                  ...prev.homologacao,
                  documentacao: { ...prev.homologacao.documentacao, formaAssinatura: value },
                },
              }))
              setChanges((prev) => ({ ...prev, 'homologacao.documentacao.formaAssinatura': value }))
            }}
            onReset={() => {
              setInfoHolder((prev) => ({
                ...prev,
                homologacao: { ...prev.homologacao, documentacao: { ...prev.homologacao.documentacao, formaAssinatura: 'FÍSICA' } },
              }))
              setChanges((prev) => ({ ...prev, 'homologacao.documentacao.formaAssinatura': 'FÍSICA' }))
            }}
            width="100%"
          />
        </div>
      </div>
    </div>
  )
}

export default HolderInformation
