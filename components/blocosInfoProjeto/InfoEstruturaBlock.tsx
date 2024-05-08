import React from 'react'
import { formatDate, tiposDeEstruturas } from '../../utils/constants'

import { TProjectDTO } from '@/utils/schemas/projects'
import SelectInput from '../inputs/Select'
import { structureTypes } from '@/utils/select-options'
import CheckboxInput from '../inputs/Checkbox'
import NumberInput from '../inputs/Number'
import DateInput from '../inputs/Date'
import { formatDateInputChange } from '@/utils/methods/shared'
import { TProjectUpdateLogDTO } from '@/utils/schemas/project-updates-logs'

type InfoEstruturaBlockProps = {
  comercialEdition: boolean
  technicalEdition: boolean
  infoHolder: TProjectDTO
  setInfo: React.Dispatch<React.SetStateAction<TProjectDTO>>
  changes: { [key: string]: any }
  setChanges: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>
  updateLogs: TProjectUpdateLogDTO[]
  project: TProjectDTO
  showPaymentInfo: boolean
}
function InfoEstruturaBlock({
  comercialEdition,
  technicalEdition,
  infoHolder,
  setInfo,
  changes,
  setChanges,
  updateLogs,
  project,
  showPaymentInfo = true,
}: InfoEstruturaBlockProps) {
  return (
    <div className="flex flex-col rounded-md border border-[#15599a] pb-2 shadow-lg">
      <span className="mb-2 w-full rounded-tr-md rounded-tl-md bg-[#15599a] py-2 text-center font-bold text-white">
        INFORMAÇÕES SOBRE A ESTRUTURA
      </span>
      <div className="flex w-full items-center justify-center self-center lg:w-1/3">
        <SelectInput
          label={'TIPO DA ESTRUTURA'}
          editable={comercialEdition || technicalEdition}
          value={infoHolder.estruturaPersonalizada?.tipo || 'N/A'}
          selectedItemLabel="NÃO DEFINIDO"
          options={structureTypes}
          handleChange={(value) => {
            setChanges((prev) => ({
              ...prev,
              'estruturaPersonalizada.tipo': value,
            }))
            setInfo((prev) => ({
              ...prev,
              estruturaPersonalizada: {
                ...prev.estruturaPersonalizada,
                tipo: value,
              },
            }))
          }}
          onReset={() => {
            setChanges((prev) => ({
              ...prev,
              'estruturaPersonalizada.tipo': undefined,
            }))
            setInfo((prev) => ({
              ...prev,
              estruturaPersonalizada: {
                ...prev.estruturaPersonalizada,
                tipo: undefined,
              },
            }))
          }}
          width="100%"
        />
      </div>
      <div className="my-2 flex w-full items-center justify-center self-center">
        <CheckboxInput
          labelFalse="NECESSÁRIO ADEQUAÇÃO DE ESTRUTURA"
          labelTrue="NECESSÁRIO ADEQUAÇÃO DE ESTRUTURA"
          checked={infoHolder.estruturaPersonalizada.aplicavel == 'SIM'}
          handleChange={(value) => {
            setInfo((prev) => ({
              ...prev,
              estruturaPersonalizada: {
                ...prev.estruturaPersonalizada,
                aplicavel: value ? 'SIM' : 'NÃO',
              },
            }))
            setChanges((prev) => ({
              ...prev,
              'estruturaPersonalizada.aplicavel': value ? 'SIM' : 'NÃO',
            }))
          }}
        />
      </div>
      {infoHolder.estruturaPersonalizada.aplicavel == 'SIM' ? (
        <>
          <div className="mt-2 flex w-full flex-col items-center gap-2 px-2 lg:flex-row">
            <div className="w-full lg:w-1/3">
              <SelectInput
                label={'STATUS DE EXECUÇÃO DA ESTRUTURA PERSONALIZADA'}
                editable={technicalEdition}
                value={infoHolder.estruturaPersonalizada.aplicavel}
                selectedItemLabel="NÃO DEFINIDO"
                options={[
                  { id: 1, label: 'PRONTA', value: 'PRONTA' },
                  { id: 2, label: 'PENDÊNCIA', value: 'PENDÊNCIA' },
                  { id: 3, label: 'N/A', value: 'N/A' },
                ]}
                handleChange={(value) => {
                  setChanges((prev) => ({
                    ...prev,
                    'estruturaPersonalizada.status': value,
                  }))
                  setInfo((prev) => ({
                    ...prev,
                    estruturaPersonalizada: {
                      ...prev.estruturaPersonalizada,
                      status: value,
                    },
                  }))
                }}
                onReset={() => {
                  setChanges((prev) => ({
                    ...prev,
                    'estruturaPersonalizada.status': null,
                  }))
                  setInfo((prev) => ({
                    ...prev,
                    estruturaPersonalizada: {
                      ...prev.estruturaPersonalizada,
                      status: null,
                    },
                  }))
                }}
                width="100%"
              />
            </div>
            <div className="w-full lg:w-1/3">
              <SelectInput
                label={'PAGAMENTO DA ESTRUTURA'}
                editable={comercialEdition}
                value={infoHolder.estruturaPersonalizada?.respPagamento}
                selectedItemLabel="NÃO DEFINIDO"
                options={[
                  { id: 1, label: 'AMPERE', value: 'AMPERE' },
                  { id: 2, label: 'CLIENTE', value: 'CLIENTE' },
                  { id: 3, label: 'NÃO SE APLICA', value: 'NÃO SE APLICA' },
                ]}
                handleChange={(value) => {
                  setChanges((prev) => ({
                    ...prev,
                    'estruturaPersonalizada.respPagamento': value,
                  }))
                  setInfo((prev) => ({
                    ...prev,
                    estruturaPersonalizada: {
                      ...prev.estruturaPersonalizada,
                      respPagamento: value,
                    },
                  }))
                }}
                onReset={() => {
                  setChanges((prev) => ({
                    ...prev,
                    'estruturaPersonalizada.respPagamento': null,
                  }))
                  setInfo((prev) => ({
                    ...prev,
                    estruturaPersonalizada: {
                      ...prev.estruturaPersonalizada,
                      respPagamento: null,
                    },
                  }))
                }}
                width="100%"
              />
            </div>
            {showPaymentInfo ? (
              <div className="w-full lg:w-1/3">
                <NumberInput
                  label={'VALOR DA ESTRUTURA'}
                  placeholder="Preencha aqui o valor da estrutura"
                  editable={comercialEdition}
                  value={infoHolder.estruturaPersonalizada?.valor || null}
                  handleChange={(value) => {
                    setChanges((prev) => ({
                      ...prev,
                      'estruturaPersonalizada.valor': value,
                    }))
                    setInfo((prev) => ({
                      ...prev,
                      estruturaPersonalizada: {
                        ...prev.estruturaPersonalizada,
                        valor: value,
                      },
                    }))
                  }}
                  width="100%"
                />
              </div>
            ) : null}
          </div>
          <div className="mt-2 flex w-full flex-col items-center gap-2 px-2 lg:flex-row">
            <div className="w-full lg:w-1/2">
              <SelectInput
                label={'STATUS DA ENTREGA DA ESTRUTURA'}
                editable={comercialEdition}
                value={infoHolder.estruturaPersonalizada.statusEntrega ? infoHolder.estruturaPersonalizada?.statusEntrega : 'NÃO DEFINIDO'}
                selectedItemLabel="NÃO DEFINIDO"
                options={[
                  { id: 1, label: 'AGUARDANDO COMPRA', value: 'AGUARDANDO COMPRA' },
                  { id: 2, label: 'EM ROTA', value: 'EM ROTA' },
                  { id: 3, label: 'ENTREGUE', value: 'ENTREGUE' },
                  { id: 4, label: 'CANCELADO', value: 'CANCELADO' },
                ]}
                handleChange={(value) => {
                  setChanges((prev) => ({
                    ...prev,
                    'estruturaPersonalizada.statusEntrega': value,
                  }))
                  setInfo((prev) => ({
                    ...prev,
                    estruturaPersonalizada: {
                      ...prev.estruturaPersonalizada,
                      statusEntrega: value,
                    },
                  }))
                }}
                onReset={() => {
                  setChanges((prev) => ({
                    ...prev,
                    'estruturaPersonalizada.statusEntrega': 'NÃO DEFINIDO',
                  }))
                  setInfo((prev) => ({
                    ...prev,
                    estruturaPersonalizada: {
                      ...prev.estruturaPersonalizada,
                      statusEntrega: 'NÃO DEFINIDO',
                    },
                  }))
                }}
                width="100%"
              />
            </div>
            <div className="w-full lg:w-1/2">
              <DateInput
                label={'DATA DE ENTREGA DA ESTRUTURA'}
                editable={comercialEdition}
                value={infoHolder.estruturaPersonalizada?.dataEntrega ? formatDate(infoHolder.estruturaPersonalizada.dataEntrega) : undefined}
                handleChange={(value) => {
                  setChanges((prev) => ({
                    ...prev,
                    'estruturaPersonalizada.dataEntrega': formatDateInputChange(value),
                  }))
                  setInfo((prev) => ({
                    ...prev,
                    estruturaPersonalizada: {
                      ...prev.estruturaPersonalizada,
                      dataEntrega: formatDateInputChange(value),
                    },
                  }))
                }}
                width="100%"
              />
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}

export default InfoEstruturaBlock
