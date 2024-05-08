import dayjs from 'dayjs'
import React from 'react'

import { contractStatus } from '../../utils/select-options'
import { TProjectDTO } from '@/utils/schemas/projects'
import CheckboxInput from '../inputs/Checkbox'
import SelectInput from '../inputs/Select'
import DateInput from '../inputs/Date'
import { formatDate } from '@/utils/constants'
import { formatDateInputChange } from '@/utils/methods/shared'
import NumberInput from '../inputs/Number'
import { TProjectUpdateLogDTO } from '@/utils/schemas/project-updates-logs'
import UpdateLogsBlock from '../identificador/registrosAlteracoesProjeto/UpdateLogsBlock'
import Contract from '../identificador/registrosAlteracoesProjeto/secao/Contract'

type InfoContratoBlockProps = {
  editor: boolean
  infoHolder: TProjectDTO
  setInfo: React.Dispatch<React.SetStateAction<TProjectDTO>>
  changes: { [key: string]: any }
  setChanges: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>
  project: TProjectDTO
  updateLogs: TProjectUpdateLogDTO[]
  showPaymentInfo?: boolean
}
function InfoContratoBlock({ editor, infoHolder, setInfo, changes, setChanges, updateLogs, showPaymentInfo = false }: InfoContratoBlockProps) {
  return (
    <div className="flex flex-col rounded-md border border-[#15599a] pb-2 shadow-lg">
      <span className="mb-2 w-full rounded-tr-md rounded-tl-md bg-[#15599a] py-2 text-center font-bold text-white">INFORMAÇÕES DO CONTRATO</span>
      <UpdateLogsBlock logs={updateLogs} SectionElement={<Contract logs={updateLogs} />} />
      <div className="mt-2 flex w-full items-center justify-center">
        <div className="w-full lg:w-1/2">
          <SelectInput
            editable={editor}
            label="FORMA DE ASSINATURA"
            options={[
              { id: 1, label: 'FISICO', value: 'FISICO' },
              { id: 2, label: 'DIGITAL', value: 'DIGITAL' },
              { id: 3, label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
            ]}
            value={infoHolder.contrato.formaAssinatura}
            selectedItemLabel="NÃO DEFINIDO"
            handleChange={(value) => {
              setInfo((prev) => ({ ...prev, contrato: { ...prev.contrato, formaAssinatura: value } }))
              setChanges((prev) => ({ ...prev, 'contrato.formaAssinatura': value }))
            }}
            onReset={() => {
              setInfo((prev) => ({ ...prev, contrato: { ...prev.contrato, formaAssinatura: 'NÃO DEFINIDO' } }))
              setChanges((prev) => ({ ...prev, 'contrato.formaAssinatura': 'NÃO DEFINIDO' }))
            }}
            width="100%"
          />
        </div>
      </div>
      <div className="mt-2 flex w-full flex-col items-center gap-2 px-2 lg:flex-row">
        <div className="w-full lg:w-1/4">
          <SelectInput
            editable={editor}
            label="STATUS DO CONTRATO"
            options={contractStatus}
            value={infoHolder.contrato.status}
            selectedItemLabel="NÃO DEFINIDO"
            handleChange={(value) => {
              setInfo((prev) => ({ ...prev, contrato: { ...prev.contrato, status: value } }))
              setChanges((prev) => ({ ...prev, 'contrato.status': value }))
            }}
            onReset={() => {
              setInfo((prev) => ({ ...prev, contrato: { ...prev.contrato, status: 'NÃO DEFINIDO' } }))
              setChanges((prev) => ({ ...prev, 'contrato.status': 'NÃO DEFINIDO' }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <DateInput
            label="DATA DE SOLICITAÇÃO"
            value={infoHolder.contrato.dataSolicitacao ? formatDate(infoHolder.contrato.dataSolicitacao) : undefined}
            handleChange={(value) => {
              setInfo((prev) => ({ ...prev, contrato: { ...prev.contrato, dataSolicitacao: formatDateInputChange(value) } }))
              setChanges((prev) => ({ ...prev, 'contrato.dataSolicitacao': formatDateInputChange(value) }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <DateInput
            label="DATA DE LIBERAÇÃO"
            value={infoHolder.contrato.dataLiberacao ? formatDate(infoHolder.contrato.dataLiberacao) : undefined}
            handleChange={(value) => {
              setInfo((prev) => ({ ...prev, contrato: { ...prev.contrato, dataLiberacao: formatDateInputChange(value) } }))
              setChanges((prev) => ({ ...prev, 'contrato.dataLiberacao': formatDateInputChange(value) }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <DateInput
            label="DATA DE ASSINATURA"
            value={infoHolder.contrato.dataAssinatura ? formatDate(infoHolder.contrato.dataAssinatura) : undefined}
            handleChange={(value) => {
              setInfo((prev) => ({ ...prev, contrato: { ...prev.contrato, dataAssinatura: formatDateInputChange(value) } }))
              setChanges((prev) => ({ ...prev, 'contrato.dataAssinatura': formatDateInputChange(value) }))
            }}
            width="100%"
          />
        </div>
      </div>
      {showPaymentInfo ? (
        <div className="mt-2 flex w-full flex-col items-center gap-2 px-2 lg:flex-row">
          <div className="flex w-full items-center justify-center lg:w-1/4">
            <CheckboxInput
              labelTrue="PORCENTAGENS EFETIVADAS"
              labelFalse="PORCENTAGENS EFETIVADAS"
              checked={!!infoHolder.comissoes?.efetivado}
              handleChange={(value) => {
                setInfo((prev) => ({ ...prev, comissoes: { ...(prev.comissoes || {}), efetivado: value } }))
                setChanges((prev) => ({ ...prev, 'comissoes.efetivado': value }))
              }}
              justify="justify-center"
            />
          </div>
          <div className="flex w-full  items-center justify-center lg:w-1/4">
            <CheckboxInput
              labelTrue="PAGAMENTOS FEITOS"
              labelFalse="PAGAMENTOS FEITOS"
              checked={!!infoHolder.comissoes?.pagamentoRealizado}
              handleChange={(value) => {
                setInfo((prev) => ({ ...prev, comissoes: { ...(prev.comissoes || {}), pagamentoRealizado: value } }))
                setChanges((prev) => ({ ...prev, 'comissoes.pagamentoRealizado': value }))
              }}
              justify="justify-center"
            />
          </div>
          <div className="w-full lg:w-1/4">
            <NumberInput
              label="PORCENTAGEM DO VENDEDOR"
              placeholder="Preencha a porcentagem de comissão do vendedor..."
              editable={editor}
              value={infoHolder.comissoes?.porcentagemVendedor || null}
              handleChange={(value) => {
                setInfo((prev) => ({ ...prev, comissoes: { ...(prev.comissoes || {}), porcentagemVendedor: value } }))
                setChanges((prev) => ({ ...prev, 'comissoes.porcentagemVendedor': value }))
              }}
              width="100%"
            />
          </div>
          <div className="w-full lg:w-1/4">
            <NumberInput
              label="PORCENTAGEM DO INSIDER"
              placeholder="Preencha a porcentagem de comissão do insider..."
              editable={editor}
              value={infoHolder.comissoes?.porcentagemInsider || null}
              handleChange={(value) => {
                setInfo((prev) => ({ ...prev, comissoes: { ...(prev.comissoes || {}), porcentagemInsider: value } }))
                setChanges((prev) => ({ ...prev, 'comissoes.porcentagemInsider': value }))
              }}
              width="100%"
            />
          </div>
        </div>
      ) : null}

      <div className="mt-2 flex w-full items-center justify-center">
        <CheckboxInput
          labelFalse="COMISSIONAMENTO COMERCIAL FEITO"
          labelTrue="COMISSIONAMENTO COMERCIAL FEITO"
          checked={!!infoHolder.comissionamento?.comercial}
          handleChange={(value) => {
            setInfo((prev) => ({ ...prev, comissionamento: { ...(prev.comissionamento || {}), comercial: value } }))
            setChanges((prev) => ({ ...prev, 'comissionamento.comercial': value }))
          }}
        />
      </div>
    </div>
  )
}

export default InfoContratoBlock
