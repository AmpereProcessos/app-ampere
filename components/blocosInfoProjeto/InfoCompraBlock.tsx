import dayjs from 'dayjs'
import React from 'react'
import { formatDate, formatToMoney, fornecedores, statusLiberacao } from '../../utils/constants'

import ProjectKitInfo from '../identificador/suprimentos/ProjectKitInfo'
import ProjectMissingMaterialInfo from '../identificador/suprimentos/MissingMaterialInfo'
import SelectInputPersonalized from '../inputs/Select'
import { deliveryStatus, supplementationStatus } from '../../utils/select-options'
import CheckboxInput from '../inputs/Checkbox'
import { BsCalendarFill, BsCheckAll } from 'react-icons/bs'
import { FaMoon } from 'react-icons/fa'
import { TProjectDTO } from '@/utils/schemas/projects'
import DateInput from '../inputs/Date'
import { formatDateInputChange } from '@/utils/methods/shared'
import SelectInput from '../inputs/Select'
import NumberInput from '../inputs/Number'
import TextInput from '../inputs/Text'
import { TbAlertCircle } from 'react-icons/tb'

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
function getAccessGrantingStatus({ status }: { status: TProjectDTO['parecer']['statusDoParecerDeAcesso'] }) {
  if (status == 'PARECER DE ACESSO APROVADO')
    return (
      <div className="relative left-0 top-0 flex items-center gap-2 rounded border border-green-500 p-2 text-xs font-bold tracking-tight text-green-500 lg:absolute lg:left-10">
        <BsCheckAll />
        <h1>{status}</h1>
      </div>
    )
  if (status == 'PARECER APROVADO - NOTURNO')
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
  comercialEditionOnly: boolean
  project: TProjectDTO
  infoHolder: TProjectDTO
  setInfo: React.Dispatch<React.SetStateAction<TProjectDTO>>
  changes: { [key: string]: any }
  setChanges: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>
  showMonetaryValues: boolean
  showDeliveryInfoOnly: boolean
}
function InfoCompraBlock({
  editor,
  comercialEditionOnly,
  project,
  infoHolder,
  setInfo,
  changes,
  setChanges,
  showMonetaryValues = false,
  showDeliveryInfoOnly = false,
}: InfoCompraBlockProps) {
  const isContractAttached = project.links?.contratos?.map((c) => c.title.toUpperCase()).includes('CONTRATO ASSINADO')
  const isPendingPurchaseAnalysisLiberation = !!project && !project.compra.liberacao

  return (
    <div className="flex flex-col rounded-md border border-[#15599a] pb-2 shadow-lg">
      <span className="mb-2 w-full rounded-tr-md rounded-tl-md bg-[#15599a] py-2 text-center font-bold text-white">INFORMAÇÕES DA COMPRA</span>
      <div className="relative mb-4 flex w-full flex-col items-center justify-center gap-2">
        {getPrevisionStatus({ forecast: infoHolder.compra.previsaoValorDoKit, final: infoHolder.compra.valorDoKit })}
        {getAccessGrantingStatus({ status: infoHolder.parecer.statusDoParecerDeAcesso })}
        <div className="flex flex-col items-center">
          <CheckboxInput
            labelFalse={'LIBERADO PARA COMPRA'}
            labelTrue={'LIBERADO PARA COMPRA'}
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
          options={supplementationStatus}
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
