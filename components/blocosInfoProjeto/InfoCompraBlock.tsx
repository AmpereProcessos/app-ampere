import dayjs from 'dayjs'
import React, { useState } from 'react'
import { formatDate, formatToMoney, fornecedores, statusLiberacao } from '../../utils/constants'

import ProjectKitInfo from '../identificador/suprimentos/ProjectKitInfo'
import ProjectMissingMaterialInfo from '../identificador/suprimentos/MissingMaterialInfo'
import SelectInputPersonalized from '../inputs/Select'
import { deliveryStatus, PurchaseControlStatus } from '../../utils/select-options'
import CheckboxInput from '../inputs/Checkbox'
import { BsCalendarCheck, BsCalendarEvent, BsCalendarFill, BsCalendarPlus, BsCheckAll } from 'react-icons/bs'
import { FaMoon } from 'react-icons/fa'
import { TProjectDTO } from '@/utils/schemas/projects'
import DateInput from '../inputs/Date'
import { formatDateInputChange } from '@/utils/methods/shared'
import SelectInput from '../inputs/Select'
import NumberInput from '../inputs/Number'
import TextInput from '../inputs/Text'
import { TbAlertCircle } from 'react-icons/tb'
import UpdateLogsBlock from '../identificador/registrosAlteracoesProjeto/UpdateLogsBlock'
import { TProjectUpdateLogDTO } from '@/utils/schemas/project-updates-logs'
import Purchase from '../identificador/registrosAlteracoesProjeto/secao/Purchase'
import { usePurchaseControlByProjectId } from '@/utils/methods/query/purchase-controls'
import ErrorComponent from '../utils/ErrorComponent'
import { getErrorMessage } from '@/utils/methods/handlers'
import { TPurchaseControl, TPurchaseControlDTO, TPurchaseControlSimplifiedDTO } from '@/utils/schemas/purchases'
import { cn } from '@/lib/utils'
import { Factory, Package, Tag, Truck } from 'lucide-react'
import { formatDateAsLocale, formatNameAsInitials, formatToCEP, getProductsStr } from '@/utils/methods/formatting'
import Avatar from '../utils/Avatar'
import { createPurchaseControl } from '@/utils/methods/mutation/purchase-controls'
import { useMutationWithFeedback } from '@/utils/methods/mutation/general-hook'
import { useQueryClient } from '@tanstack/react-query'
import { FaLocationDot } from 'react-icons/fa6'
import { estadosECidades } from '@/utils/estados_cidades'
import { Session } from 'next-auth'

function getPrevisionStatus({ forecast, final }: { forecast?: number | null; final?: number | null }) {
  if (!final || final == 0)
    return (
      <h1 className="relative right-0 top-0 rounded border border-gray-500 p-2 text-xs font-bold tracking-tight text-gray-500 lg:absolute lg:right-10">
        PREVISTO PARA O KIT: {formatToMoney(forecast || 0)}
      </h1>
    )
  if (final < (forecast || 0))
    return (
      <h1 className="relative right-0 top-0 rounded border border-green-500 p-2 text-xs font-bold tracking-tight text-green-500 lg:absolute lg:right-10">
        PREVISTO PARA O KIT: {formatToMoney(forecast || 0)}
      </h1>
    )
  return (
    <h1 className="relative right-0 top-0 rounded border border-red-500 p-2 text-xs font-bold tracking-tight text-red-500 lg:absolute lg:right-10">
      PREVISTO PARA O KIT: {formatToMoney(forecast || 0)}
    </h1>
  )
}
function getAccessGrantingStatus({ status }: { status: TProjectDTO['homologacao']['status'] }) {
  if (status == 'APROVADO')
    return (
      <div className="relative left-0 top-0 flex items-center gap-2 rounded border border-green-500 p-2 text-xs font-bold tracking-tight text-green-500 lg:absolute lg:left-10">
        <BsCheckAll />
        <h1>{status}</h1>
      </div>
    )
  if (status == 'APROVADO NOTURNO')
    return (
      <div className="relative left-0 top-0 flex items-center gap-2 rounded border border-black p-2 text-xs font-bold tracking-tight text-black lg:absolute lg:left-10">
        <FaMoon />
        <h1>{status}</h1>
      </div>
    )
  return (
    <div className="relative left-0 top-0 flex items-center gap-2 rounded border border-black p-2 text-xs font-bold tracking-tight text-black lg:absolute lg:left-10">
      <h1>{status}</h1>
    </div>
  )
}

type InfoCompraBlockProps = {
  editor: boolean
  session: Session
  comercialEditionOnly: boolean
  project: TProjectDTO
  infoHolder: TProjectDTO
  setInfo: React.Dispatch<React.SetStateAction<TProjectDTO>>
  changes: { [key: string]: any }
  setChanges: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>
  updateLogs: TProjectUpdateLogDTO[]
  showMonetaryValues: boolean
  showDeliveryInfoOnly: boolean
}
function InfoCompraBlock({
  editor,
  session,
  comercialEditionOnly,
  project,
  infoHolder,
  setInfo,
  changes,
  setChanges,
  updateLogs = [],
  showMonetaryValues = false,
  showDeliveryInfoOnly = false,
}: InfoCompraBlockProps) {
  const [showLocationInformation, setShowLocationInformation] = useState<boolean>(false)
  const isContractAttached = project.links?.contratos?.map((c) => c.title.toUpperCase()).includes('CONTRATO ASSINADO')
  const isPendingPurchaseAnalysisLiberation = !!project && !project.compra.liberacao
  return (
    <div className="flex flex-col rounded-md border border-[#15599a] pb-2 shadow-lg">
      <span className="mb-2 w-full rounded-tr-md rounded-tl-md bg-[#15599a] py-2 text-center font-bold text-white">INFORMAÇÕES DA COMPRA</span>
      <UpdateLogsBlock logs={updateLogs} SectionElement={<Purchase logs={updateLogs} />} />
      <div className="relative mt-2 mb-4 flex w-full flex-col items-center justify-center gap-2">
        {getPrevisionStatus({ forecast: infoHolder.compra.previsaoValorDoKit, final: infoHolder.compra.valorDoKit })}
        {getAccessGrantingStatus({ status: infoHolder.homologacao.status })}

        <div className="flex flex-col items-center">
          <CheckboxInput
            labelFalse={'LIBERADO PARA SUPRIMENTOS'}
            labelTrue={'LIBERADO PARA SUPRIMENTOS'}
            checked={!!infoHolder.compra.liberacao}
            handleChange={(value) => {
              setChanges((prev) => ({ ...prev, 'compra.liberacao': value, status: 'PREDEFINIÇÃO DE EQUIPAMENTOS' }))
              setInfo((prev) => ({ ...prev, compra: { ...prev.compra, liberacao: value, status: 'PREDEFINIÇÃO DE EQUIPAMENTOS' } }))
            }}
          />
          {/* {infoHolder.compra.dataLiberacao && !comercialEditionOnly ? (
            <div className="flex items-center gap-2 text-gray-500">
              <BsCalendarFill />
              <p className="text-xs font-medium">{dayjs(infoHolder.compra.dataLiberacao).add(3, 'hour').format('DD/MM/YYYY')}</p>
            </div>
          ) : null} */}
        </div>
        <DateInput
          label={'DATA DE LIBERAÇÃO P/ COMPRA'}
          editable={editor}
          value={infoHolder.compra.dataLiberacao ? formatDate(infoHolder.compra.dataLiberacao) : undefined}
          handleChange={(value) => {
            setChanges((prev) => ({
              ...prev,
              'compra.dataLiberacao': formatDateInputChange(value),
            }))
            setInfo((prev) => ({
              ...prev,
              compra: {
                ...prev.compra,
                dataLiberacao: formatDateInputChange(value),
              },
            }))
          }}
        />
      </div>
      {isContractAttached && isPendingPurchaseAnalysisLiberation ? (
        <div className="px my-2 flex w-full flex-col rounded-xl border border-yellow-500 bg-yellow-100 py-1 px-2 italic text-yellow-500">
          <div className="flex items-center justify-center gap-1">
            <TbAlertCircle />
            <p className="text-sm">LEMBRETE</p>
          </div>
          <p className="w-full text-center text-[0.65rem]">
            NOTAMOS QUE EXISTE UM CONTRATO ASSINADO ANEXADO, LEMBRE-SE DE LIBERAR O PROJETO PARA ANÁLISE DE COMPRA, SE APLICÁVEL.
          </p>
        </div>
      ) : null}
      <div className="mb-4 flex w-full items-center justify-center">
        <SelectInputPersonalized
          label="STATUS DA SUPLEMENTAÇÃO"
          labelClassName="uppercase font-bold font-raleway text-center text-sm"
          selectedItemLabel={'INDEFINIDO'}
          options={PurchaseControlStatus}
          value={infoHolder.compra.status}
          handleChange={(value) => {
            setChanges((prev) => ({ ...prev, 'compra.status': value }))
            setInfo((prev) => ({ ...prev, compra: { ...prev.compra, status: value } }))
          }}
          onReset={() => {
            setChanges((prev) => ({ ...prev, 'compra.status': 'NÃO DEFINIDO' }))
            setInfo((prev) => ({ ...prev, compra: { ...prev.compra, status: 'NÃO DEFINIDO' } }))
          }}
        />
      </div>
      <div className="flex w-full items-center justify-end">
        <button
          onClick={() => setShowLocationInformation((prev) => !prev)}
          className={cn('flex items-center gap-1 rounded-lg px-2 py-1 text-black duration-300 ease-in-out', {
            'bg-gray-300  hover:bg-red-300': showLocationInformation,
            'bg-green-300  hover:bg-green-400': !showLocationInformation,
          })}
        >
          <FaLocationDot />
          <h1 className="text-xs font-medium tracking-tight">
            {!showLocationInformation ? 'MOSTRAR LOCALIZAÇÃO DE ENTREGA' : 'FECHAR DADOS DE LOCALIZAÇÃO DE ENTREGA'}
          </h1>
        </button>
      </div>
      {showLocationInformation ? (
        <>
          <div className="flex w-full flex-col items-center gap-2 px-2 lg:flex-row">
            <div className="w-full lg:w-1/3">
              <TextInput
                label="CEP"
                value={infoHolder.compra.localizacaoEntrega?.cep || ''}
                placeholder="Preencha aqui o CEP da instalação..."
                handleChange={(value) => {
                  setInfo((prev) => ({
                    ...prev,
                    compra: { ...prev.compra, localizacaoEntrega: { ...(prev.compra.localizacaoEntrega || {}), cep: formatToCEP(value) } },
                  }))
                  setChanges((prev) => ({ ...prev, 'compra.localizacaoEntrega.cep': formatToCEP(value) }))
                }}
                width="100%"
              />
            </div>
            <div className="w-full lg:w-1/3">
              <SelectInput
                label="ESTADO"
                value={infoHolder.compra.localizacaoEntrega?.uf}
                handleChange={(value) => {
                  setInfo((prev) => ({
                    ...prev,
                    compra: { ...prev.compra, localizacaoEntrega: { ...(prev.compra.localizacaoEntrega || {}), uf: value } },
                  }))
                  setChanges((prev) => ({ ...prev, 'compra.localizacaoEntrega.uf': value }))
                }}
                selectedItemLabel="NÃO DEFINIDO"
                onReset={() => {
                  setInfo((prev) => ({
                    ...prev,
                    compra: { ...prev.compra, localizacaoEntrega: { ...(prev.compra.localizacaoEntrega || {}), uf: null } },
                  }))
                  setChanges((prev) => ({ ...prev, 'compra.localizacaoEntrega.uf': null }))
                }}
                options={Object.keys(estadosECidades).map((state, index) => ({
                  id: index + 1,
                  label: state,
                  value: state,
                }))}
                width="100%"
              />
            </div>
            <div className="w-full lg:w-1/3">
              <SelectInput
                label="CIDADE"
                value={infoHolder.compra.localizacaoEntrega?.cidade}
                handleChange={(value) => {
                  setInfo((prev) => ({
                    ...prev,
                    compra: { ...prev.compra, localizacaoEntrega: { ...(prev.compra.localizacaoEntrega || {}), cidade: value } },
                  }))
                  setChanges((prev) => ({ ...prev, 'compra.localizacaoEntrega.cidade': value }))
                }}
                options={
                  infoHolder.compra.localizacaoEntrega?.uf
                    ? estadosECidades[infoHolder.compra.localizacaoEntrega?.uf as keyof typeof estadosECidades].map((city, index) => ({
                        id: index + 1,
                        value: city,
                        label: city,
                      }))
                    : null
                }
                selectedItemLabel="NÃO DEFINIDO"
                onReset={() => {
                  setInfo((prev) => ({
                    ...prev,
                    compra: { ...prev.compra, localizacaoEntrega: { ...(prev.compra.localizacaoEntrega || {}), cidade: null } },
                  }))
                  setChanges((prev) => ({ ...prev, 'compra.localizacaoEntrega.cidade': null }))
                }}
                width="100%"
              />
            </div>
          </div>
          <div className="flex w-full flex-col items-center gap-2 px-2 lg:flex-row">
            <div className="w-full lg:w-1/2">
              <TextInput
                label="BAIRRO"
                value={infoHolder.compra.localizacaoEntrega?.bairro || ''}
                placeholder="Preencha aqui o bairro do instalação..."
                handleChange={(value) => {
                  setInfo((prev) => ({
                    ...prev,
                    compra: { ...prev.compra, localizacaoEntrega: { ...(prev.compra.localizacaoEntrega || {}), bairro: value } },
                  }))
                  setChanges((prev) => ({ ...prev, 'compra.localizacaoEntrega.bairro': value }))
                }}
                width="100%"
              />
            </div>
            <div className="w-full lg:w-1/2">
              <TextInput
                label="LOGRADOURO/RUA"
                value={infoHolder.compra.localizacaoEntrega?.endereco || ''}
                placeholder="Preencha aqui o logradouro da instalação..."
                handleChange={(value) => {
                  setInfo((prev) => ({
                    ...prev,
                    compra: { ...prev.compra, localizacaoEntrega: { ...(prev.compra.localizacaoEntrega || {}), endereco: value } },
                  }))
                  setChanges((prev) => ({ ...prev, 'compra.localizacaoEntrega.endereco': value }))
                }}
                width="100%"
              />
            </div>
          </div>
          <div className="flex w-full flex-col items-center gap-2 px-2 lg:flex-row">
            <div className="w-full lg:w-1/2">
              <TextInput
                label="NÚMERO/IDENTIFICADOR"
                value={infoHolder.compra.localizacaoEntrega?.numeroOuIdentificador || ''}
                placeholder="Preencha aqui o número ou identificador da residência da instalação..."
                handleChange={(value) => {
                  setInfo((prev) => ({
                    ...prev,
                    compra: { ...prev.compra, localizacaoEntrega: { ...(prev.compra.localizacaoEntrega || {}), numeroOuIdentificador: value } },
                  }))
                  setChanges((prev) => ({ ...prev, 'compra.localizacaoEntrega.numeroOuIdentificador': value }))
                }}
                width="100%"
              />
            </div>
            <div className="w-full lg:w-1/2">
              <TextInput
                label="PONTO DE REFERÊNCIA"
                value={infoHolder.compra.localizacaoEntrega?.complemento || ''}
                placeholder="Preencha aqui algum complemento do endereço..."
                handleChange={(value) => {
                  setInfo((prev) => ({
                    ...prev,
                    compra: { ...prev.compra, localizacaoEntrega: { ...(prev.compra.localizacaoEntrega || {}), complemento: value } },
                  }))
                  setChanges((prev) => ({ ...prev, 'compra.localizacaoEntrega.complemento': value }))
                }}
                width="100%"
              />
            </div>
          </div>
          <div className="flex w-full flex-col items-center gap-2 px-2 lg:flex-row">
            <div className="w-full lg:w-1/2">
              <TextInput
                label="LATITUDE"
                value={infoHolder.compra.localizacaoEntrega?.latitude || ''}
                placeholder="Preencha aqui a latitude da instalação..."
                handleChange={(value) => {
                  setInfo((prev) => ({
                    ...prev,
                    compra: { ...prev.compra, localizacaoEntrega: { ...(prev.compra.localizacaoEntrega || {}), latitude: value } },
                  }))
                  setChanges((prev) => ({ ...prev, 'compra.localizacaoEntrega.latitude': value }))
                }}
                width="100%"
              />
            </div>
            <div className="w-full lg:w-1/2">
              <TextInput
                label="LONGITUDE"
                value={infoHolder.compra.localizacaoEntrega?.longitude || ''}
                placeholder="Preencha aqui a longitude da instalação..."
                handleChange={(value) => {
                  setInfo((prev) => ({
                    ...prev,
                    compra: { ...prev.compra, localizacaoEntrega: { ...(prev.compra.localizacaoEntrega || {}), longitude: value } },
                  }))
                  setChanges((prev) => ({ ...prev, 'compra.localizacaoEntrega.longitude': value }))
                }}
                width="100%"
              />
            </div>
          </div>
        </>
      ) : null}

      <div className="mt-2 flex w-full flex-col items-center gap-2 px-2 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <SelectInput
            label={'TIPO DO KIT'}
            value={infoHolder.compra?.tipoDoKit}
            selectedItemLabel="NÃO DEFINIDO"
            editable={comercialEditionOnly}
            options={[
              { id: 1, label: 'NORMAL', value: 'NORMAL' },
              { id: 2, label: 'PROMO', value: 'PROMO' },
              { id: 3, label: 'NÃO SE APLICA', value: 'NÃO SE APLICA' },
            ]}
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                'compra.tipoDoKit': value,
              }))
              setInfo((prev) => ({
                ...infoHolder,
                compra: {
                  ...infoHolder.compra,
                  tipoDoKit: value,
                },
              }))
            }}
            onReset={() => {
              setChanges((prev) => ({
                ...prev,
                'compra.tipoDoKit': undefined,
              }))
              setInfo((prev) => ({
                ...infoHolder,
                compra: {
                  ...infoHolder.compra,
                  tipoDoKit: undefined,
                },
              }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/2">
          <NumberInput
            label={'PREV. VALOR DO KIT'}
            editable={comercialEditionOnly}
            value={infoHolder.compra?.previsaoValorDoKit || 0}
            placeholder="Preencha a previsão do valor do kit..."
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                'compra.previsaoValorDoKit': value,
              }))
              setInfo((prev) => ({
                ...prev,
                compra: {
                  ...prev.compra,
                  previsaoValorDoKit: value,
                },
              }))
            }}
            width="100%"
          />
        </div>
      </div>
      <h1 className="mt-2 w-full text-center font-black text-[#fead41]">PEDIDO</h1>
      <div className="mt-2 flex w-full flex-col items-center gap-2 px-2 lg:flex-row">
        <div className="w-full lg:w-1/5">
          <SelectInput
            label={'FORNECEDOR'}
            editable={editor}
            value={infoHolder.compra?.fornecedor}
            selectedItemLabel="NÃO DEFINIDO"
            options={fornecedores.map((fornecedor, index) => ({ id: index + 1, ...fornecedor }))}
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                'compra.fornecedor': value,
              }))
              setInfo((prev) => ({
                ...prev,
                compra: {
                  ...prev.compra,
                  fornecedor: value,
                },
              }))
            }}
            onReset={() => {
              setChanges((prev) => ({
                ...prev,
                'compra.fornecedor': undefined,
              }))
              setInfo((prev) => ({
                ...prev,
                compra: {
                  ...prev.compra,
                  fornecedor: undefined,
                },
              }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/5">
          <DateInput
            label={'DATA DO PEDIDO'}
            editable={editor}
            value={infoHolder.compra.dataPedido ? formatDate(infoHolder.compra.dataPedido) : undefined}
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                'compra.dataPedido': formatDateInputChange(value),
              }))
              setInfo((prev) => ({
                ...prev,
                compra: {
                  ...prev.compra,
                  dataPedido: formatDateInputChange(value),
                },
              }))
            }}
            width="100%"
          />
        </div>
        {showMonetaryValues ? (
          <div className="w-full lg:w-1/5">
            <NumberInput
              label={'VALOR DO KIT'}
              editable={editor}
              value={infoHolder.compra?.valorDoKit || null}
              placeholder="Preencha aqui o valor do kit..."
              handleChange={(value) => {
                setChanges((prev) => ({
                  ...prev,
                  'compra.valorDoKit': Number(value),
                }))
                setInfo((prev) => ({
                  ...prev,
                  compra: {
                    ...prev.compra,
                    valorDoKit: Number(value),
                  },
                }))
              }}
              width="100%"
            />
          </div>
        ) : null}

        <div className="w-full lg:w-1/5">
          <TextInput
            label={'RASTREIO'}
            editable={editor}
            value={infoHolder.compra.rastreio || ''}
            placeholder="Preencha aqui o link de rastreio..."
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                'compra.rastreio': value,
              }))
              setInfo((prev) => ({
                ...prev,
                compra: {
                  ...prev.compra,
                  rastreio: value,
                },
              }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/5">
          <TextInput
            label={'OUTRAS INFORMAÇÕES'}
            value={infoHolder.compra?.informacoes ? infoHolder.compra?.informacoes : ''}
            placeholder="Preencha aqui outras informações relevantes..."
            editable={editor}
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                'compra.informacoes': value,
              }))
              setInfo((prev) => ({
                ...prev,
                compra: {
                  ...prev.compra,
                  informacoes: value,
                },
              }))
            }}
            width="100%"
          />
        </div>
      </div>
      <h1 className="mt-2 w-full text-center font-black text-[#fead41]">PAGAMENTO E FATURAMENTO</h1>
      <div className="mt-2 flex w-full flex-col items-center gap-2 px-2 lg:flex-row">
        <div className="w-full lg:w-1/5">
          <DateInput
            label={'DATA MÁX P/ PAGAMENTO'}
            editable={editor}
            value={infoHolder.compra.dataMaxPagamento ? formatDate(infoHolder.compra.dataMaxPagamento) : undefined}
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                'compra.dataMaxPagamento': formatDateInputChange(value),
              }))
              setInfo((prev) => ({
                ...prev,
                compra: {
                  ...prev.compra,
                  dataMaxPagamento: formatDateInputChange(value),
                },
              }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/5">
          <DateInput
            label={'DATA DE PAG. (CLIENTE)'}
            editable={editor}
            value={infoHolder.compra.dataPagamento ? formatDate(infoHolder.compra.dataPagamento) : undefined}
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                'compra.dataPagamento': formatDateInputChange(value),
              }))
              setInfo((prev) => ({
                ...prev,
                compra: {
                  ...prev.compra,
                  dataPagamento: formatDateInputChange(value),
                },
              }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/5">
          <DateInput
            label={'DATA DE PAG. (FORNECEDOR)'}
            editable={editor}
            value={infoHolder.compra.dataPagamentoEquipamentos ? formatDate(infoHolder.compra.dataPagamentoEquipamentos) : undefined}
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                'compra.dataPagamentoEquipamentos': formatDateInputChange(value),
              }))
              setInfo((prev) => ({
                ...prev,
                compra: {
                  ...prev.compra,
                  dataPagamentoEquipamentos: formatDateInputChange(value),
                },
              }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/5">
          <TextInput
            label={'INFORMAÇÕES DE FATURAMENTO'}
            editable={editor}
            value={infoHolder.faturamento?.previsaoFaturamento || ''}
            placeholder="Preencha aqui informações do faturamento, nº da NF, etc..."
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                'faturamento.previsaoFaturamento': value,
              }))
              setInfo((prev) => ({
                ...prev,
                faturamento: {
                  ...prev.faturamento,
                  previsaoFaturamento: value,
                },
              }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/5">
          <DateInput
            label={'DATA DE FATURAMENTO'}
            editable={editor}
            value={infoHolder.faturamento.dataFaturamento ? formatDate(infoHolder.faturamento.dataFaturamento) : undefined}
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                'faturamento.dataFaturamento': formatDateInputChange(value),
              }))
              setInfo((prev) => ({
                ...prev,
                faturamento: {
                  ...prev.faturamento,
                  dataFaturamento: formatDateInputChange(value),
                },
              }))
            }}
            width="100%"
          />
        </div>
      </div>
      <h1 className="mt-2 w-full text-center font-black text-[#fead41]">ENTREGA</h1>
      <div className="mt-2 flex w-full flex-col items-center gap-2 px-2 lg:flex-row">
        <div className="w-full lg:w-1/4">
          <TextInput
            label={'LOCAL DE ENTREGA'}
            value={infoHolder.compra?.localEntrega || ''}
            placeholder="Preencha o local de entrega..."
            editable={editor}
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                'compra.localEntrega': value,
              }))
              setInfo((prev) => ({
                ...prev,
                compra: {
                  ...prev.compra,
                  localEntrega: value,
                },
              }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <DateInput
            label={'DATA DE PREVISÃO DE ENTREGA'}
            editable={editor}
            value={infoHolder.compra.previsaoEntrega ? formatDate(infoHolder.compra.previsaoEntrega) : undefined}
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                'compra.previsaoEntrega': formatDateInputChange(value),
              }))
              setInfo((prev) => ({
                ...prev,
                compra: {
                  ...prev.compra,
                  previsaoEntrega: formatDateInputChange(value),
                },
              }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <DateInput
            label={'DATA DE ENTREGA'}
            editable={editor}
            value={infoHolder.compra.dataEntrega ? formatDate(infoHolder.compra.dataEntrega) : undefined}
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                'compra.dataEntrega': formatDateInputChange(value),
              }))
              setInfo((prev) => ({
                ...prev,
                compra: {
                  ...prev.compra,
                  dataEntrega: formatDateInputChange(value),
                },
              }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <SelectInput
            label={'STATUS DA ENTREGA'}
            editable={editor}
            value={infoHolder.compra?.statusEntrega || 'NÃO DEFINIDO'}
            selectedItemLabel="NÃO DEFINIDO"
            options={deliveryStatus}
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                'compra.statusEntrega': value,
              }))
              setInfo((prev) => ({
                ...prev,
                compra: {
                  ...prev.compra,
                  statusEntrega: value,
                },
              }))
            }}
            onReset={() => {
              setChanges((prev) => ({
                ...prev,
                'compra.statusEntrega': undefined,
              }))
              setInfo((prev) => ({
                ...prev,
                compra: {
                  ...prev.compra,
                  statusEntrega: undefined,
                },
              }))
            }}
            width="100%"
          />
        </div>
      </div>

      {!showDeliveryInfoOnly && (
        <div className="mt-2 flex w-full flex-wrap items-center justify-center gap-x-4 px-2">
          <div className="w-[450px]">
            <ProjectKitInfo infoHolder={infoHolder} setInfoHolder={setInfo} setChanges={setChanges} />
          </div>
          <div className="w-[450px]">
            <ProjectMissingMaterialInfo infoHolder={infoHolder} setInfoHolder={setInfo} setChanges={setChanges} />
          </div>
        </div>
      )}
      <h1 className="mt-2 w-full text-center font-black text-[#fead41]">ATUALIZAÇÕES</h1>
      <div className="flex w-full flex-col items-center gap-2 py-2 px-2">
        {infoHolder.compra.atualizacoes && infoHolder.compra.atualizacoes.length > 0 ? (
          infoHolder.compra.atualizacoes.map((item, index) => <UpdateCard key={index} update={item} />)
        ) : (
          <p className="w-full text-center text-sm font-medium tracking-tight text-primary/80">Não atualização definida.</p>
        )}
      </div>
      <PurchaseControlsBlock session={session} project={project} />

      {!showDeliveryInfoOnly ? (
        <div className="my-4 flex w-full items-center justify-center self-center">
          <CheckboxInput
            labelFalse="COMISSIONAMENTO SUPRIMENTOS FEITO"
            labelTrue="COMISSIONAMENTO SUPRIMENTOS FEITO"
            checked={!!infoHolder.comissionamento?.suprimentos}
            handleChange={(value) => {
              setInfo((prev) => ({
                ...prev,
                comissionamento: {
                  ...prev.comissionamento,
                  suprimentos: value,
                },
              }))
              setChanges((prev) => ({
                ...prev,
                'comissionamento.suprimentos': value,
              }))
            }}
          />
        </div>
      ) : null}
    </div>
  )
}

export default InfoCompraBlock

type PurchaseControlsBlockProps = {
  session: Session
  project: TProjectDTO
}
function PurchaseControlsBlock({ session, project }: PurchaseControlsBlockProps) {
  const queryClient = useQueryClient()
  const { data: purchaseControls, isLoading, isError, isSuccess, error } = usePurchaseControlByProjectId({ projectId: project._id })

  async function generateContractPurchase() {
    const purchaseControl: TPurchaseControl = {
      status: 'EM COTAÇÃO',
      titulo: `COMPRA DO ${project.nomeDoContrato}`,
      anotacoes: project.produtos ? `KIT COMPOSTO POR: ${getProductsStr(project.produtos)}` : '',
      projeto: {
        id: project._id,
        nome: project.nomeDoProjeto,
      },
      etiquetas: [
        {
          id: '671146dea74d7a14b032aff3',
          titulo: 'KIT SOLAR',
          cores: {
            primaria: '#4682B4',
            secundaria: '#B0E0E6',
          },
        },
      ],
      atualizacoes: [],
      totalPrevisto: project.compra.previsaoValorDoKit,
      liberacao: {
        data: project.compra.dataLiberacao,
        autor: {},
      },
      composicao: [],
      fornecedor: {},
      total: 0,
      faturamentos: [],
      entrega: {
        status: 'AGUARDANDO COMPRA',
        localizacao: project.compra.localizacaoEntrega
          ? {
              ...project.compra.localizacaoEntrega,
              uf: project.compra.localizacaoEntrega.uf || '',
              cidade: project.compra.localizacaoEntrega.cidade || '',
            }
          : {
              uf: project.uf,
              cidade: project.cidade,
            },
      },
      transporte: { transportadora: {} },
      autor: {
        id: session.user.id,
        nome: session.user.nome,
        avatar_url: session.user.avatar_url,
      },
      dataInsercao: new Date().toISOString(),
    }
    await createPurchaseControl(purchaseControl)
    return 'Controle de compra criado com sucesso!'
  }
  const { mutate: handleGenerateContractPurchase, isPending: isMutationLoading } = useMutationWithFeedback({
    mutationKey: ['create-purchase-control', project._id],
    mutationFn: generateContractPurchase,
    queryClient: queryClient,
    affectedQueryKey: ['purchase-control-by-project-id', project._id],
  })
  return (
    <div className="flex w-[90%] flex-col gap-2 self-center rounded border border-black">
      <h1 className="w-full rounded bg-gray-800 p-1 text-center text-xs font-bold text-white">CONTROLES DE COMPRA</h1>
      <div className="flex w-full grow flex-col gap-1 p-2">
        <div className="flex w-full items-center justify-center lg:justify-end">
          <button
            disabled={isMutationLoading}
            onClick={() => handleGenerateContractPurchase()}
            className="rounded-md bg-green-700 py-1 px-4 text-sm font-bold text-white disabled:bg-gray-500"
          >
            GERAR COMPRA DO CONTRATO
          </button>
        </div>
        {isLoading ? <p className="w-full animate-pulse text-center text-xs font-bold tracking-tight text-gray-500">Carregando...</p> : null}
        {isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
        {isSuccess ? (
          purchaseControls && purchaseControls.length > 0 ? (
            purchaseControls.map((purchaseControl) => <PurchaseControlCard key={purchaseControl._id} purchaseControl={purchaseControl} />)
          ) : (
            <div className="w-full text-center text-sm font-medium tracking-tight text-primary/80">Nenhum controle de compra encontrado.</div>
          )
        ) : null}
      </div>
    </div>
  )
}

type PurchaseControlCardProps = {
  purchaseControl: TPurchaseControlSimplifiedDTO
}
function PurchaseControlCard({ purchaseControl }: PurchaseControlCardProps) {
  return (
    <div className="relative flex w-full flex-col justify-between gap-1 rounded border border-gray-500 bg-[#fff] p-2 shadow-sm">
      <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex items-center gap-2">
          <h1
            className={cn('rounded-lg px-2 py-0.5 text-[0.65rem] font-medium text-white', {
              'bg-red-600': purchaseControl.status == 'PENDENTE',
              'bg-gray-700': purchaseControl.status === 'EM COTAÇÃO',
              'bg-teal-600': purchaseControl.status === 'AGUARDANDO APROVAÇÃO',
              'bg-sky-500': purchaseControl.status === 'AGUARDANDO NOTA FUTURA',
              'bg-orange-600': purchaseControl.status === 'AGUARDANDO PAGAMENTO',
              'bg-blue-600': purchaseControl.status === 'AGUARDANDO COMPRA',
              'bg-violet-600': purchaseControl.status === 'AGUARDANDO FATURAMENTO',
              'bg-lime-600': purchaseControl.status === 'AGUARDANDO DESPACHE',
              'bg-green-800': purchaseControl.status === 'AGUARDANDO ENTREGA',
              'bg-green-500': purchaseControl.status === 'CONCLUÍDA',
              'bg-red-800': purchaseControl.status === 'PENDÊNCIAS',
            })}
          >
            {purchaseControl.status}
          </h1>
          <h1 className="text-sm font-bold leading-none tracking-tight">{purchaseControl.titulo}</h1>
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex w-full flex-wrap items-center justify-start gap-2 lg:grow">
          <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80 ">ETIQUETAS</h1>
          {purchaseControl.etiquetas.length > 0 ? (
            purchaseControl.etiquetas.map((tag, index) => (
              <div
                key={index}
                style={{
                  border: '1px solid',
                  borderColor: tag.cores.primaria,
                  color: tag.cores.primaria,
                  backgroundColor: tag.cores.secundaria,
                }}
                className={cn('flex items-center gap-1 rounded px-2 py-0.5')}
              >
                <Tag width={10} height={10} />
                <h1 className="text-[0.5rem] font-bold tracking-tight">{tag.titulo}</h1>
              </div>
            ))
          ) : (
            <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80 ">NÃO DEFINIDAS</h1>
          )}
        </div>
        <div className="flex w-full flex-wrap items-center justify-center gap-2 lg:min-w-fit lg:justify-end">
          <div className="flex items-center gap-1">
            <Factory width={13} height={13} />
            <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">FORNECEDOR</h1>
            <h1 className="py-0.5 text-center text-[0.6rem] font-bold  text-primary">{purchaseControl.fornecedor.nome || 'N/A'}</h1>
          </div>
          <div className="flex items-center gap-1">
            <FaLocationDot width={10} height={10} />
            <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">LOCALIZAÇÃO</h1>
            <h1 className="py-0.5 text-center text-[0.6rem] font-bold  text-primary">
              {purchaseControl.entrega.localizacao.cidade} ({purchaseControl.entrega.localizacao.uf})
            </h1>
          </div>
          <div className="flex items-center gap-1">
            <BsCalendarEvent width={10} height={10} />
            <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">PREVISÃO</h1>
            <h1 className="py-0.5 text-center text-[0.6rem] font-bold  text-primary">
              {formatDateAsLocale(purchaseControl.entrega.dataPrevisao) || 'N/A'}
            </h1>
          </div>
          <div className="flex items-center gap-1">
            <BsCalendarCheck width={10} height={10} />
            <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">EFETIVAÇÃO</h1>
            <h1 className="py-0.5 text-center text-[0.6rem] font-bold  text-primary">
              {formatDateAsLocale(purchaseControl.entrega.dataEfetivacao) || 'N/A'}
            </h1>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            <BsCalendarPlus />
            <p className="text-[0.65rem] font-medium text-primary/80">{formatDateAsLocale(purchaseControl.dataInsercao, true)}</p>
          </div>
          {purchaseControl.dataEfetivacao ? (
            <div className="flex items-center gap-1">
              <BsCalendarCheck color="#22c55e" />
              <p className="text-[0.65rem] font-medium text-primary/80">{formatDateAsLocale(purchaseControl.dataEfetivacao, true)}</p>
            </div>
          ) : null}
          <div className="flex items-center gap-1">
            <Avatar
              url={purchaseControl.autor.avatar_url || undefined}
              width={20}
              height={20}
              fallback={formatNameAsInitials(purchaseControl.autor.nome)}
            />
            <p className="text-[0.65rem] font-medium text-primary/80">{purchaseControl.autor.nome}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function UpdateCard({ update }: { update: TPurchaseControl['atualizacoes'][number] }) {
  return (
    <div className="flex w-full flex-col gap-1 rounded-md border border-primary bg-[#fff] p-2 dark:bg-[#121212]">
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <p className="text-[0.65rem] font-medium text-primary/80">ATUALIZAÇÃO POR:</p>
            <Avatar url={update.autor.avatar_url || undefined} width={20} height={20} fallback={formatNameAsInitials(update.autor.nome)} />
            <p className="text-[0.65rem] font-medium text-primary/80">{update.autor.nome}</p>
          </div>
          <div className="flex items-center gap-1">
            <BsCalendarPlus />
            <p className="text-[0.65rem] font-medium text-primary/80">{formatDateAsLocale(update.data, true)}</p>
          </div>
        </div>
      </div>
      <p className="rounded-lg bg-primary/10 p-2 text-center text-xs text-primary">{update.descricao}</p>
    </div>
  )
}
