import React from 'react'

import { TProjectDTO } from '@/utils/schemas/projects'
import SelectInput from '../inputs/Select'
import TextInput from '../inputs/Text'
import CheckboxInput from '../inputs/Checkbox'
import NumberInput from '../inputs/Number'

type InfoPadraoBlockProps = {
  comercialEdition: boolean
  technicalEdition: boolean
  infoHolder: TProjectDTO
  setInfo: React.Dispatch<React.SetStateAction<TProjectDTO>>
  changes: { [key: string]: any }
  setChanges: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>
  showPaymentInfo: boolean
  showPaymentOnly: boolean
}
function InfoPadraoBlock({
  comercialEdition,
  technicalEdition,
  infoHolder,
  setInfo,
  changes,
  setChanges,
  showPaymentInfo = true,
  showPaymentOnly = false,
}: InfoPadraoBlockProps) {
  return (
    <div className="flex flex-col rounded-md border border-[#15599a] pb-2 shadow-lg">
      <span className="mb-2 w-full rounded-tr-md rounded-tl-md bg-[#15599a] py-2 text-center font-bold text-white">
        INFORMAÇÕES SOBRE PADRÃO DE ENERGIA
      </span>
      <div className="mt-2 flex w-full flex-col items-center gap-2 px-2 lg:flex-row">
        <div className="w-full lg:w-1/4">
          <TextInput
            label={'AMPERAGEM'}
            placeholder="Preencha a amperagem do padrão..."
            editable={technicalEdition}
            value={infoHolder.visitaTecnica?.amperagem ? infoHolder.visitaTecnica.amperagem : ''}
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                'visitaTecnica.amperagem': value,
              }))
              setInfo((prev) => ({
                ...prev,
                visitaTecnica: {
                  ...prev.visitaTecnica,
                  amperagem: value,
                },
              }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <SelectInput
            label={'TIPO DO PADRÃO'}
            editable={technicalEdition}
            value={infoHolder.padrao.tipo ? infoHolder.padrao.tipo : 'NÃO DEFINIDO'}
            selectedItemLabel="NÃO DEFINIDO"
            options={[
              { id: 1, label: 'CONTRA A REDE', value: 'CONTRA A REDE' },
              { id: 2, label: 'A FAVOR DA REDE', value: 'A FAVOR DA REDE' },
              { id: 3, label: 'CONSTRUIR', value: 'CONSTRUIR' },
              { id: 4, label: 'SUBESTAÇÃO', value: 'SUBESTAÇÃO' },
              { id: 5, label: 'REFORMA DE PADRÃO', value: 'REFORMA DE PADRÃO' },
              { id: 6, label: 'N/A', value: 'N/A' },
              { id: 7, label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
            ]}
            handleChange={(value) => {
              setChanges((prev) => ({ ...prev, 'padrao.tipo': value }))
              setInfo((prev) => ({ ...prev, padrao: { ...infoHolder.padrao, tipo: value } }))
            }}
            onReset={() => {
              setChanges((prev) => ({ ...prev, 'padrao.tipo': 'NÃO DEFINIDO' }))
              setInfo((prev) => ({ ...prev, padrao: { ...infoHolder.padrao, tipo: 'NÃO DEFINIDO' } }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <SelectInput
            label={'TIPO DE ENTRADA'}
            value={infoHolder.padrao.tipoEntrada ? infoHolder.padrao.tipoEntrada : 'NÃO DEFINIDO'}
            selectedItemLabel="NÃO DEFINIDO"
            editable={technicalEdition}
            options={[
              { id: 1, label: 'AÉREA', value: 'AÉREA' },
              { id: 2, label: 'SUBTERRÂNEO', value: 'SUBTERRÂNEO' },
            ]}
            handleChange={(value) => {
              setChanges((prev) => ({ ...prev, 'padrao.tipoEntrada': value }))
              setInfo((prev) => ({
                ...prev,
                padrao: {
                  ...prev.padrao,
                  tipoEntrada: value as TProjectDTO['padrao']['tipoEntrada'],
                },
              }))
            }}
            onReset={() => {
              setChanges((prev) => ({ ...prev, 'padrao.tipoEntrada': undefined }))
              setInfo((prev) => ({
                ...prev,
                padrao: {
                  ...prev.padrao,
                  tipoEntrada: undefined,
                },
              }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <SelectInput
            label={'TIPO DE SAÍDA'}
            editable={technicalEdition}
            value={infoHolder.visitaTecnica.saidaDoCliente ? infoHolder.visitaTecnica.saidaDoCliente : 'N/A'}
            selectedItemLabel="NÃO DEFINIDO"
            options={[
              { id: 1, label: 'SUBTERRANEO', value: 'SUBTERRANEO' },
              { id: 2, label: 'AEREO', value: 'AEREO' },
              { id: 3, label: 'N/A', value: 'N/A' },
            ]}
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                'visitaTecnica.saidaDoCliente': value,
              }))
              setInfo((prev) => ({
                ...prev,
                visitaTecnica: {
                  ...prev.visitaTecnica,
                  saidaDoCliente: value as TProjectDTO['visitaTecnica']['saidaDoCliente'],
                },
              }))
            }}
            onReset={() => {
              setChanges((prev) => ({
                ...prev,
                'visitaTecnica.saidaDoCliente': undefined,
              }))
              setInfo((prev) => ({
                ...prev,
                visitaTecnica: {
                  ...prev.visitaTecnica,
                  saidaDoCliente: undefined,
                },
              }))
            }}
            width="100%"
          />
        </div>
      </div>
      <div className="my-2 flex w-full items-center justify-center self-center">
        <CheckboxInput
          labelFalse="NECESSÁRIO AUMENTO DE CARGA"
          labelTrue="NECESSÁRIO AUMENTO DE CARGA"
          checked={infoHolder.projeto.aumentoDeCarga == 'SIM'}
          handleChange={(value) => {
            setInfo((prev) => ({
              ...prev,
              projeto: {
                ...prev.projeto,
                aumentoDeCarga: value ? 'SIM' : 'NÃO',
                acStatus: value && infoHolder.projeto.acStatus != 'REALIZADO' ? 'PENDÊNCIA' : undefined,
              },
            }))
            setChanges((prev) => ({
              ...prev,
              'projeto.aumentoDeCarga': value ? 'SIM' : 'NÃO',
              'projeto.acStatus': value && infoHolder.projeto.acStatus != 'REALIZADO' ? 'PENDÊNCIA' : undefined,
            }))
          }}
        />
      </div>
      {infoHolder.projeto.aumentoDeCarga == 'SIM' ? (
        <div className="mt-2 flex w-full flex-col items-center gap-2 px-2 lg:flex-row">
          <div className="w-full lg:w-1/4">
            <SelectInput
              label={'STATUS AUMENTO DE CARGA'}
              editable={technicalEdition}
              value={infoHolder.projeto.acStatus ? infoHolder.projeto.acStatus : 'NÃO DEFINIDO'}
              selectedItemLabel="NÃO DEFINIDO"
              options={[
                { id: 1, label: 'PENDÊNCIA', value: 'PENDÊNCIA' },
                { id: 2, label: 'REALIZADO', value: 'REALIZADO' },
                { id: 3, label: 'SOLICITADO COM G.D', value: 'SOLICITADO COM G.D' },
              ]}
              handleChange={(value) => {
                setChanges((prev) => ({
                  ...prev,
                  'projeto.acStatus': value,
                }))
                setInfo((prev) => ({
                  ...prev,
                  projeto: {
                    ...prev.projeto,
                    acStatus: value,
                  },
                }))
              }}
              onReset={() => {
                setChanges((prev) => ({
                  ...prev,
                  'projeto.acStatus': null,
                }))
                setInfo((prev) => ({
                  ...prev,
                  projeto: {
                    ...prev.projeto,
                    acStatus: null,
                  },
                }))
              }}
              width="100%"
            />
          </div>
          <div className="w-full lg:w-1/4">
            <SelectInput
              label={'PAGAMENTO DO PADRÃO'}
              editable={comercialEdition}
              value={infoHolder.padrao?.respPagamento}
              selectedItemLabel="NÃO DEFINIDO"
              options={[
                { id: 1, label: 'CLIENTE IRÁ COMPRAR EM SEPARADO', value: 'CLIENTE IRÁ COMPRAR EM SEPARADO' },
                { id: 2, label: 'CLIENTE PAGAR POR FORA', value: 'CLIENTE PAGAR POR FORA' },
                { id: 3, label: 'INCLUSO NO CONTRATO', value: 'INCLUSO NO CONTRATO' },
                { id: 4, label: 'NÃO HAVERA TROCA PADRÃO', value: 'NÃO HAVERA TROCA PADRÃO' },
              ]}
              handleChange={(value) => {
                setChanges((prev) => ({
                  ...prev,
                  'padrao.respPagamento': value,
                }))
                setInfo((prev) => ({
                  ...prev,
                  padrao: { ...prev.padrao, respPagamento: value },
                }))
              }}
              onReset={() => {
                setChanges((prev) => ({
                  ...prev,
                  'padrao.respPagamento': null,
                }))
                setInfo((prev) => ({
                  ...prev,
                  padrao: { ...prev.padrao, respPagamento: null },
                }))
              }}
              width="100%"
            />
          </div>
          <div className="w-full lg:w-1/4">
            <SelectInput
              label={'RESPONSÁVEL INSTALAÇÃO DO PADRÃO'}
              editable={comercialEdition || technicalEdition}
              value={infoHolder.padrao?.respInstalacao ? infoHolder.padrao?.respInstalacao : 'NÃO SE APLICA'}
              selectedItemLabel="NÃO DEFINIDO"
              options={[
                { id: 1, label: 'AMPERE', value: 'AMPERE' },
                { id: 2, label: 'CLIENTE', value: 'CLIENTE' },
                { id: 3, label: 'NÃO SE APLICA', value: 'NÃO SE APLICA' },
              ]}
              handleChange={(value) => {
                setChanges((prev) => ({
                  ...prev,
                  'padrao.respInstalacao': value,
                }))
                setInfo((prev) => ({
                  ...prev,
                  padrao: { ...prev.padrao, respInstalacao: value },
                }))
              }}
              onReset={() => {
                setChanges((prev) => ({
                  ...prev,
                  'padrao.respInstalacao': null,
                }))
                setInfo((prev) => ({
                  ...prev,
                  padrao: { ...prev.padrao, respInstalacao: null },
                }))
              }}
              width="100%"
            />
          </div>
          {showPaymentInfo ? (
            <div className="w-full lg:w-1/4">
              <NumberInput
                label={'VALOR DO PADRÃO'}
                placeholder="Preencha o valor do padrão..."
                editable={comercialEdition}
                value={infoHolder.padrao.valor || null}
                handleChange={(value) => {
                  setChanges((prev) => ({
                    ...prev,
                    'padrao.valor': value,
                  }))
                  setInfo((prev) => ({
                    ...prev,
                    padrao: { ...prev.padrao, valor: value },
                  }))
                }}
                width="100%"
              />
            </div>
          ) : null}

          {/* {!showPaymentOnly ? (
          <SelectInput
            label={'AUMENTO DE CARGA'}
            editable={comercialEdition}
            value={infoHolder.projeto.aumentoDeCarga ? infoHolder.projeto.aumentoDeCarga : 'NÃO DEFINIDO'}
            options={[
              { label: 'SIM', value: 'SIM' },
              { label: 'NÃO', value: 'NÃO' },
              { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
            ]}
            handleChange={(value) => {
              setChanges({
                ...changes,
                'projeto.aumentoDeCarga': value,
                'projeto.acStatus': value == 'SIM' && infoHolder.acStatus != 'REALIZADO' ? 'PENDÊNCIA' : undefined,
              })
              setInfo({
                ...infoHolder,
                projeto: {
                  ...infoHolder.projeto,
                  aumentoDeCarga: value,
                  acStatus: value == 'SIM' && infoHolder.acStatus != 'REALIZADO' ? 'PENDÊNCIA' : undefined,
                },
              })
            }}
          />
        ) : null} */}

          {showPaymentInfo ? <></> : null}
        </div>
      ) : null}
      <div className="mt-2 flex w-full items-center justify-center self-center">
        <CheckboxInput
          labelFalse="POSSUI CAIXA CONJUGADA"
          labelTrue="POSSUI CAIXA CONJUGADA"
          checked={infoHolder.padrao.caixaConjugada == 'SIM'}
          handleChange={(value) => {
            setInfo((prev) => ({
              ...prev,
              padrao: {
                ...prev.padrao,
                caixaConjugada: value ? 'SIM' : 'NÃO',
              },
            }))
            setChanges((prev) => ({
              ...prev,
              'padrao.caixaConjugada': value ? 'SIM' : 'NÃO',
            }))
          }}
        />
      </div>
      {/* {!showPaymentOnly ? (
        <div className="flex flex-wrap justify-center gap-2 border-t border-gray-200 pt-2">
          <div className="flex w-[350px] flex-col items-center">
            <span className="text-center font-raleway text-sm font-bold uppercase">CAIXA CONJUGADA</span>
            <div className="flex">
              <input
                disabled={!comercialEdition}
                checked={infoHolder.padrao.caixaConjugada == 'SIM' ? true : false}
                onChange={(e) => {
                  setChanges({
                    ...changes,
                    'padrao.caixaConjugada': e.target.checked ? 'SIM' : 'NÃO',
                  })
                  setInfo({
                    ...infoHolder,
                    padrao: {
                      ...infoHolder.padrao,
                      caixaConjugada: e.target.checked ? 'SIM' : 'NÃO',
                    },
                  })
                }}
                type="checkbox"
                name="caixaConjugada"
                id="caixaConjugada"
              />
              <label className="ml-2" htmlFor="caixaConjugada">
                SIM ?
              </label>
            </div>
          </div>
        </div>
      ) : null} */}
    </div>
  )
}

export default InfoPadraoBlock
