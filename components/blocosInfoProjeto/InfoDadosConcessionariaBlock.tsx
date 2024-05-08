import { TProjectDTO } from '@/utils/schemas/projects'
import React from 'react'
import TextInput from '../inputs/Text'
import SelectInput from '../inputs/Select'
import NumberInput from '../inputs/Number'
import { TProjectUpdateLogDTO } from '@/utils/schemas/project-updates-logs'
import UpdateLogsBlock from '../identificador/registrosAlteracoesProjeto/UpdateLogsBlock'
import ElectricalInstallation from '../identificador/registrosAlteracoesProjeto/secao/ElectricalInstallation'

type InfoDadosConcessionariaBlockProps = {
  editor: boolean
  infoHolder: TProjectDTO
  setInfo: React.Dispatch<React.SetStateAction<TProjectDTO>>
  changes: { [key: string]: any }
  setChanges: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>
  updateLogs: TProjectUpdateLogDTO[]
}
function InfoDadosConcessionariaBlock({ editor, infoHolder, setInfo, changes, setChanges, updateLogs = [] }: InfoDadosConcessionariaBlockProps) {
  return (
    <div className="flex flex-col rounded-md border border-[#15599a] pb-2 shadow-lg">
      <span className="mb-2 w-full rounded-tr-md rounded-tl-md bg-[#15599a] py-2 text-center font-bold text-white">
        INFORMAÇÕES SOBRE A INSTALAÇÃO (CONCESSIONÁRIA)
      </span>
      <UpdateLogsBlock logs={updateLogs} SectionElement={<ElectricalInstallation logs={updateLogs} />} />
      <div className="mt-2 flex w-full flex-col items-center gap-2 px-2 lg:flex-row">
        <div className="w-full lg:w-1/4">
          <TextInput
            label={'NOME DO TITULAR'}
            editable={editor}
            value={infoHolder.dadosCemig?.titularProjeto || ''}
            placeholder="Preencha o nome do titular..."
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                'dadosCemig.titularProjeto': value,
              }))
              setInfo((prev) => ({
                ...prev,
                dadosCemig: {
                  ...prev.dadosCemig,
                  titularProjeto: value,
                },
              }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <TextInput
            label={'NÚMERO DA INSTALAÇÃO'}
            value={infoHolder.dadosCemig?.numeroInstalacao?.toString() || ''}
            placeholder="Preencha aqui o número da instalação..."
            editable={editor}
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                'dadosCemig.numeroInstalacao': value,
              }))
              setInfo((prev) => ({
                ...prev,
                dadosCemig: {
                  ...prev.dadosCemig,
                  numeroInstalacao: value,
                },
              }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <SelectInput
            label={'NECESSÁRIO DISTRIBUIÇÃO DE CRÉDITOS'}
            value={infoHolder.dadosCemig?.distCreditos}
            selectedItemLabel="NÃO DEFINIDO"
            editable={editor}
            options={[
              { id: 1, label: 'SIM', value: 'SIM' },
              { id: 2, label: 'NÃO', value: 'NÃO' },
            ]}
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                'dadosCemig.distCreditos': value,
              }))
              setInfo((prev) => ({
                ...prev,
                dadosCemig: {
                  ...prev.dadosCemig,
                  distCreditos: value,
                },
              }))
            }}
            onReset={() => {
              setChanges((prev) => ({
                ...prev,
                'dadosCemig.distCreditos': 'NÃO DEFINIDO',
              }))
              setInfo((prev) => ({
                ...prev,
                dadosCemig: {
                  ...prev.dadosCemig,
                  distCreditos: 'NÃO DEFINIDO',
                },
              }))
            }}
            width="100%"
          />
        </div>
        {infoHolder.dadosCemig.distCreditos == 'SIM' ? (
          <div className="w-full lg:w-1/4">
            <NumberInput
              label={'QTDE DE DISTRIBUIÇÕES'}
              editable={editor}
              value={infoHolder.dadosCemig?.qtdeDistCreditos || null}
              placeholder="Preencha aqui a quantidade de distribuições..."
              handleChange={(value) => {
                setChanges((prev) => ({
                  ...prev,
                  'dadosCemig.qtdeDistCreditos': value,
                }))
                setInfo((prev) => ({
                  ...prev,
                  dadosCemig: {
                    ...prev.dadosCemig,
                    qtdeDistCreditos: value,
                  },
                }))
              }}
              width="100%"
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default InfoDadosConcessionariaBlock
