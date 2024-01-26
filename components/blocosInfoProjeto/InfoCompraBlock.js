import dayjs from 'dayjs'
import React from 'react'
import { formatDate, formatToMoney, fornecedores, statusLiberacao } from '../../utils/constants'
import DateInput from '../DateInput'
import NumberInput from '../NumberInput'
import SelectInput from '../SelectInput'
import TextInput from '../TextInput'
import ProjectKitInfo from '../identificador/suprimentos/ProjectKitInfo'
import ProjectMissingMaterialInfo from '../identificador/suprimentos/MissingMaterialInfo'
import SelectInputPersonalized from '../inputs/Select'
import { supplementationStatus } from '../../utils/select-options'
import CheckboxInput from '../inputs/Checkbox'
import { BsCalendarFill, BsCheckAll } from 'react-icons/bs'
import { FaMoon } from 'react-icons/fa'

function getPrevisionStatus({ forecast, final }) {
  if (!final || final == 0)
    return (
      <h1 className="relative right-0 top-0 rounded border border-gray-500 p-2 text-xs font-bold tracking-tight text-gray-500 lg:absolute lg:right-10">
        PREVISTO PARA O KIT: {formatToMoney(forecast)}
      </h1>
    )
  if (final < forecast)
    return (
      <h1 className="relative right-0 top-0 rounded border border-green-500 p-2 text-xs font-bold tracking-tight text-green-500 lg:absolute lg:right-10">
        PREVISTO PARA O KIT: {formatToMoney(forecast)}
      </h1>
    )
  return (
    <h1 className="relative right-0 top-0 rounded border border-red-500 p-2 text-xs font-bold tracking-tight text-red-500 lg:absolute lg:right-10">
      PREVISTO PARA O KIT: {formatToMoney(forecast)}
    </h1>
  )
}
function getAccessGrantingStatus({ status }) {
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
}) {
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
            editable={comercialEditionOnly}
            checked={infoHolder.compra.liberacao}
            handleChange={(value) => {
              setChanges((prev) => ({ ...prev, 'compra.liberacao': value, status: 'PREDEFINIÇÃO DE EQUIPAMENTOS' }))
              setInfo((prev) => ({ ...prev, compra: { ...prev.compra, liberacao: value, status: 'PREDEFINIÇÃO DE EQUIPAMENTOS' } }))
            }}
          />
          {infoHolder.compra.dataLiberacao && !comercialEditionOnly ? (
            <div className="flex items-center gap-2 text-gray-500">
              <BsCalendarFill />
              <p className="text-xs font-medium">{dayjs(infoHolder.compra.dataLiberacao).add(3, 'hour').format('DD/MM/YYYY')}</p>
            </div>
          ) : null}
        </div>

        {comercialEditionOnly ? (
          <DateInput
            label={'Data DE LIBERAÇÃO P/ COMPRA'}
            editable={editor}
            value={infoHolder.compra.dataLiberacao ? new Date(infoHolder.compra.dataLiberacao).toISOString().slice(0, 10) : null}
            handleChange={(value) => {
              setChanges({
                ...changes,
                'compra.dataLiberacao': dayjs(value).isValid() ? new Date(value).toISOString() : null,
              })
              setInfo({
                ...infoHolder,
                compra: {
                  ...infoHolder.compra,
                  dataLiberacao: dayjs(value).isValid() ? new Date(value).toISOString() : null,
                },
              })
            }}
          />
        ) : null}
      </div>
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
      <div className="mb-4 flex w-full flex-col justify-around gap-2 lg:flex-row">
        <SelectInput
          label={'TIPO DO KIT'}
          value={infoHolder.compra?.tipoDoKit != undefined && infoHolder.compra.tipoDoKit != '-' ? infoHolder.compra.tipoDoKit : 'NÃO DEFINIDO'}
          editable={editor}
          options={[
            {
              label: 'NORMAL',
              value: 'NORMAL',
            },
            {
              label: 'PROMO',
              value: 'PROMO',
            },
            {
              label: 'NÃO SE APLICA',
              value: 'NÃO SE APLICA',
            },
            {
              label: 'NÃO DEFINIDO',
              value: 'NÃO DEFINIDO',
            },
          ]}
          handleChange={(value) => {
            setChanges({
              ...changes,
              'compra.tipoDoKit': value,
            })
            setInfo({
              ...infoHolder,
              compra: {
                ...infoHolder.compra,
                tipoDoKit: value,
              },
            })
          }}
        />
        <SelectInput
          label={'Fornecedor'}
          editable={editor}
          value={infoHolder.compra?.fornecedor != undefined && infoHolder.compra.fornecedor != '-' ? infoHolder.compra.fornecedor : 'NÃO DEFINIDO'}
          options={fornecedores.map((fornecedor) => fornecedor)}
          handleChange={(value) => {
            setChanges({
              ...changes,
              'compra.fornecedor': value,
            })
            setInfo({
              ...infoHolder,
              compra: {
                ...infoHolder.compra,
                fornecedor: value,
              },
            })
          }}
        />
        {comercialEditionOnly ? (
          <NumberInput
            tag={'R$'}
            label={'PREV. VALOR DO KIT'}
            editable={editor}
            value={
              infoHolder.compra?.previsaoValorDoKit != undefined && infoHolder.compra?.previsaoValorDoKit != '-'
                ? infoHolder.compra?.previsaoValorDoKit
                : 0
            }
            handleChange={(value) => {
              setChanges({
                ...changes,
                'compra.previsaoValorDoKit': Number(value),
              })
              setInfo({
                ...infoHolder,
                compra: {
                  ...infoHolder.compra,
                  previsaoValorDoKit: Number(value),
                },
              })
            }}
          />
        ) : null}
        {showMonetaryValues && (
          <NumberInput
            tag={'R$'}
            label={'VALOR DO KIT'}
            editable={editor}
            value={infoHolder.compra?.valorDoKit != undefined && infoHolder.compra?.valorDoKit != '-' ? infoHolder.compra?.valorDoKit : 0}
            handleChange={(value) => {
              setChanges({
                ...changes,
                'compra.valorDoKit': Number(value),
              })
              setInfo({
                ...infoHolder,
                compra: {
                  ...infoHolder.compra,
                  valorDoKit: Number(value),
                },
              })
            }}
          />
        )}
        <DateInput
          label={'Data do pedido'}
          editable={editor}
          value={
            infoHolder.compra.dataPedido != undefined && infoHolder.compra.dataPedido != '-'
              ? new Date(infoHolder.compra.dataPedido).toISOString().slice(0, 10)
              : 0
          }
          handleChange={(value) => {
            setChanges({
              ...changes,
              'compra.dataPedido': isNaN(value) ? new Date(value).toISOString() : null,
            })
            setInfo({
              ...infoHolder,
              compra: {
                ...infoHolder.compra,
                dataPedido: isNaN(value) ? new Date(value).toISOString() : null,
              },
            })
          }}
        />
      </div>
      <div className="mb-4 flex w-full flex-col justify-around gap-2 lg:flex-row">
        <DateInput
          label={'Data máx p/ pagamento'}
          editable={editor}
          value={infoHolder.compra.dataMaxPagamento ? new Date(infoHolder.compra.dataMaxPagamento).toISOString().slice(0, 10) : null}
          handleChange={(value) => {
            setChanges({
              ...changes,
              'compra.dataMaxPagamento': dayjs(value).isValid() ? new Date(value).toISOString() : null,
            })
            setInfo({
              ...infoHolder,
              compra: {
                ...infoHolder.compra,
                dataMaxPagamento: dayjs(value).isValid() ? new Date(value).toISOString() : null,
              },
            })
          }}
        />
        <DateInput
          label={'Data do pagamento (CLIENTE)'}
          editable={editor}
          value={
            infoHolder.compra?.dataPagamento != undefined && infoHolder.compra?.dataPagamento != '-'
              ? new Date(infoHolder.compra?.dataPagamento).toISOString().slice(0, 10)
              : 0
          }
          handleChange={(value) => {
            setChanges({
              ...changes,
              'compra.dataPagamento': isNaN(value) ? new Date(value).toISOString() : null,
            })
            setInfo({
              ...infoHolder,
              compra: {
                ...infoHolder.compra,
                dataPagamento: isNaN(value) ? new Date(value).toISOString() : null,
              },
            })
          }}
        />
        <DateInput
          label={'Data do pagamento (FORNECEDOR)'}
          editable={editor}
          value={
            infoHolder.compra?.dataPagamentoEquipamentos != undefined && infoHolder.compra?.dataPagamentoEquipamentos != '-'
              ? new Date(infoHolder.compra?.dataPagamentoEquipamentos).toISOString().slice(0, 10)
              : 0
          }
          handleChange={(value) => {
            setChanges({
              ...changes,
              'compra.dataPagamentoEquipamentos': isNaN(value) ? new Date(value).toISOString() : null,
            })
            setInfo({
              ...infoHolder,
              compra: {
                ...infoHolder.compra,
                dataPagamentoEquipamentos: isNaN(value) ? new Date(value).toISOString() : null,
              },
            })
          }}
        />
        <TextInput
          label={'Informações faturamento'}
          editable={editor}
          value={infoHolder.faturamento?.previsaoFaturamento ? infoHolder.faturamento?.previsaoFaturamento : ''}
          handleChange={(value) => {
            setChanges({
              ...changes,
              'faturamento.previsaoFaturamento': value,
            })
            setInfo({
              ...infoHolder,
              faturamento: {
                ...infoHolder.faturamento,
                previsaoFaturamento: value,
              },
            })
          }}
        />
        <DateInput
          label="Data de faturamento"
          editable={editor}
          value={infoHolder.faturamento?.dataFaturamento ? new Date(infoHolder.faturamento?.dataFaturamento).toISOString().slice(0, 10) : ''}
          handleChange={(value) => {
            setChanges({
              ...changes,
              'faturamento.dataFaturamento': isNaN(value) ? new Date(value).toISOString() : null,
            })
            setInfo({
              ...infoHolder,
              faturamento: {
                ...infoHolder.faturamento,
                dataFaturamento: isNaN(value) ? new Date(value).toISOString() : null,
              },
            })
          }}
        />
      </div>
      {!showDeliveryInfoOnly && (
        <div className="flex flex-wrap justify-center gap-2 pb-2 ">
          <TextInput
            label={'INFORMAÇÕES'}
            value={infoHolder.compra?.informacoes ? infoHolder.compra?.informacoes : ''}
            editable={editor}
            handleChange={(value) => {
              setChanges({
                ...changes,
                'compra.informacoes': value,
              })
              setInfo({
                ...infoHolder,
                compra: {
                  ...infoHolder.compra,
                  informacoes: value,
                },
              })
            }}
          />
          <TextInput
            label={'RASTREIO'}
            editable={editor}
            value={infoHolder.compra.rastreio ? infoHolder.compra.rastreio : ''}
            handleChange={(value) => {
              setChanges({
                ...changes,
                'compra.rastreio': value,
              })
              setInfo({
                ...infoHolder,
                compra: {
                  ...infoHolder.compra,
                  rastreio: value,
                },
              })
            }}
          />

          <div className="flex w-[350px] flex-col items-center">
            <span className="text-center font-raleway text-sm font-bold uppercase">RELATÓRIO DE COMISS. SUPRIMENTOS</span>
            <div className="flex">
              <input
                disabled={!editor}
                checked={infoHolder.comissionamento?.suprimentos ? true : false}
                onChange={(e) => {
                  setChanges({
                    ...changes,
                    'comissionamento.suprimentos': e.target.checked,
                  })
                  setInfo({
                    ...infoHolder,
                    comissionamento: {
                      ...infoHolder.comissionamento,
                      suprimentos: e.target.checked,
                    },
                  })
                }}
                type="checkbox"
                name="comissionamentoSuprimentos"
                id="comissionamentoSuprimentos"
              />
              <label className="ml-2" htmlFor="comissionamentoSuprimentos">
                OK
              </label>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-wrap justify-center gap-2 py-2 ">
        <TextInput
          label={'LOCAL DE ENTREGA'}
          value={
            infoHolder.compra?.localEntrega != undefined && infoHolder.compra?.localEntrega != '-' ? infoHolder.compra?.localEntrega : 'NÃO DEFINIDO'
          }
          editable={editor}
          handleChange={(value) => {
            setChanges({
              ...changes,
              'compra.localEntrega': value,
            })
            setInfo({
              ...infoHolder,
              compra: {
                ...infoHolder.compra,
                localEntrega: value,
              },
            })
          }}
        />
        <DateInput
          label={'Previsão de entrega'}
          editable={editor}
          value={
            infoHolder.compra.previsaoEntrega != undefined && infoHolder.compra.previsaoEntrega != '-'
              ? new Date(infoHolder.compra.previsaoEntrega).toISOString().slice(0, 10)
              : 0
          }
          handleChange={(value) => {
            setChanges({
              ...changes,
              'compra.previsaoEntrega': isNaN(value) ? new Date(value).toISOString() : null,
            })
            setInfo({
              ...infoHolder,
              compra: {
                ...infoHolder.compra,
                previsaoEntrega: isNaN(value) ? new Date(value).toISOString() : null,
              },
            })
          }}
        />
        <DateInput
          label={'Data de entrega'}
          editable={editor}
          value={
            infoHolder.compra.dataEntrega != undefined && infoHolder.compra.dataEntrega != '-'
              ? new Date(infoHolder.compra.dataEntrega).toISOString().slice(0, 10)
              : 0
          }
          handleChange={(value) => {
            setChanges({
              ...changes,
              'compra.dataEntrega': isNaN(value) ? new Date(value).toISOString() : null,
            })
            setInfo({
              ...infoHolder,
              compra: {
                ...infoHolder.compra,
                dataEntrega: isNaN(value) ? new Date(value).toISOString() : null,
              },
            })
          }}
        />
        <SelectInput
          label={'STATUS DA ENTREGA'}
          editable={editor}
          value={infoHolder.compra?.statusEntrega ? infoHolder.compra?.statusEntrega : 'NÃO DEFINIDO'}
          options={[
            {
              label: 'AGUARDANDO COMPRA',
              value: 'AGUARDANDO COMPRA',
            },
            {
              label: 'EM ROTA',
              value: 'EM ROTA',
            },
            {
              label: 'ENTREGUE',
              value: 'ENTREGUE',
            },
            {
              label: 'CANCELADO',
              value: 'CANCELADO',
            },
            {
              label: 'NÃO DEFINIDO',
              value: 'NÃO DEFINIDO',
            },
          ]}
          handleChange={(value) => {
            setChanges({
              ...changes,
              'compra.statusEntrega': value,
            })
            setInfo({
              ...infoHolder,
              compra: {
                ...infoHolder.compra,
                statusEntrega: value,
              },
            })
          }}
        />
      </div>
      {!showDeliveryInfoOnly && (
        <div className="mt-2 flex w-full flex-wrap items-center justify-center gap-x-4">
          {/* <div className="flex flex-col w-[450px] self-center mt-2 items-center">
            <span className="uppercase font-bold font-raleway text-center text-sm">INFORMAÇÕES DO KIT</span>
            <textarea
              readOnly={!editor}
              value={infoHolder.compra.kitInfo ? infoHolder.compra.kitInfo : ''}
              placeholder={'Observações do material aqui...'}
              onChange={(e) => {
                setChanges({
                  ...changes,
                  'compra.kitInfo': e.target.value,
                })
                setInfo({
                  ...infoHolder,
                  compra: {
                    ...infoHolder.compra,
                    kitInfo: e.target.value,
                  },
                })
              }}
              className="w-full mb-2 text-center h-[150px] bg-gray-200 resize-none p-2 outline-none border border-gray-600"
            />
          </div> */}
          <div className="w-[450px]">
            <ProjectKitInfo infoHolder={infoHolder} setInfoHolder={setInfo} setChanges={setChanges} />
          </div>
          {/* <div className="flex flex-col w-[450px] self-center mt-2 items-center">
            <span className="uppercase font-bold font-raleway text-center text-sm">MATERIAL FALTANTE</span>
            <textarea
              readOnly={!editor}
              value={infoHolder.material.materialFaltante ? infoHolder.material.materialFaltante : ''}
              placeholder={'Observações do material aqui...'}
              onChange={(e) => {
                setChanges({
                  ...changes,
                  'material.materialFaltante': e.target.value,
                })
                setInfo({
                  ...infoHolder,
                  material: {
                    ...infoHolder.material,
                    materialFaltante: e.target.value,
                  },
                })
              }}
              className="w-full mb-2 text-center h-[150px] bg-gray-200 resize-none p-2 outline-none border border-gray-600"
            />
          </div> */}
          <div className="w-[450px]">
            <ProjectMissingMaterialInfo infoHolder={infoHolder} setInfoHolder={setInfo} setChanges={setChanges} />
          </div>
        </div>
      )}
    </div>
  )
}

export default InfoCompraBlock
