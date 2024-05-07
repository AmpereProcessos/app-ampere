import React from 'react'
import { credores, formatDate } from '../../utils/constants'

import dayjs from 'dayjs'
import { billableCompanies } from '../../utils/select-options'
import { formatToCPForCNPJ } from '@/utils/methods/formatting'
import { TProjectDTO } from '@/utils/schemas/projects'
import SelectInput from '../inputs/Select'
import TextInput from '../inputs/Text'
import CheckboxInput from '../inputs/Checkbox'
import DateInput from '../inputs/Date'
import { formatDateInputChange } from '@/utils/methods/shared'
import { TProjectUpdateLogDTO } from '@/utils/schemas/project-updates-logs'
import { MdVisibility } from 'react-icons/md'
import UpdateLogsBlock from '../identificador/registrosAlteracoesProjeto/UpdateLogsBlock'
import Payment from '../identificador/registrosAlteracoesProjeto/secao/Payment'

type InfoPagamentoBlockProps = {
  editor: boolean
  infoHolder: TProjectDTO
  setInfo: React.Dispatch<React.SetStateAction<TProjectDTO>>
  changes: { [key: string]: any }
  setChanges: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>
  updateLogs: TProjectUpdateLogDTO[]
  showADMOnly: boolean
}
function InfoPagamentoBlock({ editor, infoHolder, setInfo, changes, setChanges, updateLogs, showADMOnly = false }: InfoPagamentoBlockProps) {
  console.log('LOGS', updateLogs)
  return (
    <div className="flex flex-col rounded-md border border-[#15599a] pb-2 shadow-lg">
      <span className="mb-2 w-full rounded-tr-md rounded-tl-md bg-[#15599a] py-2 text-center font-bold text-white">INFORMAÇÕES SOBRE PAGAMENTO</span>
      <UpdateLogsBlock logs={updateLogs} SectionElement={<Payment logs={updateLogs} />} />
      <div className="mt-2 flex w-full flex-col items-center justify-center gap-2 px-2 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <SelectInput
            label={'FORMA DE PAGAMENTO'}
            value={infoHolder.pagamento?.forma}
            selectedItemLabel="NÃO DEFINIDO"
            editable={editor}
            options={[
              { id: 1, label: 'CAPITAL PRÓPRIO', value: 'CAPITAL PRÓPRIO' },
              { id: 2, label: 'FINANCIAMENTO', value: 'FINANCIAMENTO' },
              { id: 3, label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
            ]}
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                'pagamento.forma': value,
              }))
              setInfo((prev) => ({
                ...prev,
                pagamento: {
                  ...prev.pagamento,
                  forma: value,
                },
              }))
            }}
            onReset={() => {
              setChanges((prev) => ({
                ...prev,
                'pagamento.forma': undefined,
              }))
              setInfo((prev) => ({
                ...prev,
                pagamento: {
                  ...prev.pagamento,
                  forma: undefined,
                },
              }))
            }}
            width="100%"
          />
        </div>
        {infoHolder.pagamento?.forma == 'FINANCIAMENTO' ? (
          <div className="w-full lg:w-1/2">
            <SelectInput
              label={'CREDOR'}
              value={infoHolder.pagamento.credor}
              selectedItemLabel="NÃO DEFINIDO"
              editable={editor}
              options={credores.map((credor, index) => ({ id: index + 1, label: credor.label, value: credor.value }))}
              handleChange={(value) => {
                setChanges((prev) => ({
                  ...prev,
                  'pagamento.credor': value,
                }))
                setInfo((prev) => ({
                  ...prev,
                  pagamento: {
                    ...prev.pagamento,
                    credor: value,
                  },
                }))
              }}
              onReset={() => {
                setChanges((prev) => ({
                  ...prev,
                  'pagamento.credor': undefined,
                }))
                setInfo((prev) => ({
                  ...prev,
                  pagamento: {
                    ...prev.pagamento,
                    credor: undefined,
                  },
                }))
              }}
              width="100%"
            />
          </div>
        ) : null}
      </div>
      <div className="mt-2 flex w-full flex-col items-center justify-center gap-2 px-2 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <TextInput
            label={'NOME DO PAGADOR'}
            editable={editor}
            value={infoHolder.pagamento?.pagador || ''}
            placeholder="Preencha o nome do pagador..."
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                'pagamento.pagador': value,
              }))
              setInfo((prev) => ({
                ...prev,
                pagamento: {
                  ...prev.pagamento,
                  pagador: value,
                },
              }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/2">
          <TextInput
            label={'CONTATO DO PAGADOR'}
            editable={editor}
            value={infoHolder.pagamento?.contatoPagador || ''}
            placeholder="Preencha o contato do pagador..."
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                'pagamento.contatoPagador': value,
              }))
              setInfo((prev) => ({
                ...prev,
                pagamento: {
                  ...prev.pagamento,
                  contatoPagador: value,
                },
              }))
            }}
            width="100%"
          />
        </div>
      </div>
      <div className="mt-2 flex w-full flex-col items-center justify-center gap-2 px-2 lg:flex-row">
        {showADMOnly ? (
          <div className="flex w-full items-center justify-center lg:w-1/2">
            <CheckboxInput
              labelFalse="PAGAMENTO CONCLUÍDO"
              labelTrue="PAGAMENTO CONCLUÍDO"
              checked={!!infoHolder.pagamento.cobrancaFeita}
              handleChange={(value) => {
                setInfo((prev) => ({
                  ...prev,
                  pagamento: {
                    ...prev.pagamento,
                    cobrancaFeita: value,
                  },
                }))
                setChanges((prev) => ({
                  ...prev,
                  'pagamento.cobrancaFeita': value,
                }))
              }}
              justify="justify-center"
            />
          </div>
        ) : null}
        <div className="w-full lg:w-1/2">
          <DateInput
            label={'DATA DE RECEBIMENTO'}
            editable={true}
            value={infoHolder.pagamento?.dataRecebimento ? formatDate(infoHolder.pagamento?.dataRecebimento) : undefined}
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                'pagamento.dataRecebimento': formatDateInputChange(value),
              }))
              setInfo((prev) => ({
                ...prev,
                pagamento: {
                  ...prev.pagamento,
                  dataRecebimento: formatDateInputChange(value),
                },
              }))
            }}
            width="100%"
          />
        </div>
      </div>
      <h1 className="mt-2 w-full text-center font-black text-[#fead41]">FATURAMENTO</h1>
      <div className="mt-2 flex w-full flex-col items-center justify-center gap-2 px-2 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <SelectInput
            label={'EMPRESA A FATURAR'}
            value={infoHolder.faturamento?.empresaFaturamento}
            selectedItemLabel="NÃO DEFINIDO"
            editable={editor}
            options={billableCompanies}
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                'faturamento.empresaFaturamento': value,
              }))
              setInfo((prev) => ({
                ...prev,
                faturamento: {
                  ...prev.faturamento,
                  empresaFaturamento: value,
                },
              }))
            }}
            onReset={() => {
              setChanges((prev) => ({
                ...prev,
                'faturamento.empresaFaturamento': undefined,
              }))
              setInfo((prev) => ({
                ...prev,
                faturamento: {
                  ...prev.faturamento,
                  empresaFaturamento: undefined,
                },
              }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/2">
          <TextInput
            label={'CNPJ PARA FATURAMENTO'}
            editable={editor}
            value={infoHolder.faturamento?.cnpjFaturamento?.toString()}
            placeholder="Preencha o CNPJ para faturamento..."
            handleChange={(value) => {
              setChanges({
                ...changes,
                'faturamento.cnpjFaturamento': formatToCPForCNPJ(value),
              })
              setInfo({
                ...infoHolder,
                faturamento: {
                  ...infoHolder.faturamento,
                  cnpjFaturamento: formatToCPForCNPJ(value),
                },
              })
            }}
            width="100%"
          />
        </div>
      </div>
      {showADMOnly ? (
        <div className="my-2 flex w-full items-center justify-center self-center">
          <CheckboxInput
            labelFalse="FATURAMENTO CONCLUÍDO"
            labelTrue="FATURAMENTO CONCLUÍDO"
            checked={!!infoHolder.faturamento.concluido}
            handleChange={(value) => {
              setInfo((prev) => ({
                ...prev,
                faturamento: {
                  ...prev.faturamento,
                  concluido: value,
                },
              }))
              setChanges((prev) => ({
                ...prev,
                'faturamento.concluido': value,
              }))
            }}
            justify="justify-center"
          />
        </div>
      ) : null}
    </div>
  )
}

export default InfoPagamentoBlock
