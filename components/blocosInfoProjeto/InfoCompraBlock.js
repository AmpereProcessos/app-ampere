import dayjs from 'dayjs'
import React from 'react'
import { fornecedores, statusLiberacao } from '../../utils/constants'
import DateInput from '../DateInput'
import NumberInput from '../NumberInput'
import SelectInput from '../SelectInput'
import TextInput from '../TextInput'
import ProjectKitInfo from '../identificador/suprimentos/ProjectKitInfo'
import ProjectMissingMaterialInfo from '../identificador/suprimentos/MissingMaterialInfo'

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
    <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
      <span className="text-sm text-center font-bold text-[#15599a] py-2">INFORMAÇÕES DA COMPRA</span>
      {!showDeliveryInfoOnly && (
        <div className="flex gap-2 justify-center flex-wrap pb-2 border-b border-gray-200">
          <SelectInput
            label={'STATUS DA LIBERAÇÃO'}
            editable={editor}
            value={infoHolder.compra?.statusLiberacao ? infoHolder.compra?.statusLiberacao : 'NÃO DEFINIDO'}
            options={statusLiberacao.map((status) => {
              return { label: status.label, value: status.value }
            })}
            handleChange={(value) => {
              setChanges({
                ...changes,
                'compra.statusLiberacao': value,
                'projeto.iniciar': value == 'PAGO' ? 'SIM' : project.projeto.iniciar,
              })
              setInfo({
                ...infoHolder,
                compra: {
                  ...infoHolder.compra,
                  statusLiberacao: value,
                },
                projeto: {
                  ...infoHolder.projeto,
                  iniciar: value == 'PAGO' ? 'SIM' : project.projeto.iniciar,
                },
              })
            }}
          />
          <DateInput
            label={'Data de liberação p/ compra'}
            editable={comercialEditionOnly}
            value={
              infoHolder.compra?.dataLiberacao != undefined && infoHolder.compra.dataLiberacao != '-'
                ? new Date(infoHolder.compra.dataLiberacao).toISOString().slice(0, 10)
                : 0
            }
            handleChange={(value) => {
              setChanges({
                ...changes,
                'compra.dataLiberacao': isNaN(value) ? new Date(value).toISOString() : null,
              })
              setInfo({
                ...infoHolder,
                compra: {
                  ...infoHolder.compra,
                  dataLiberacao: isNaN(value) ? new Date(value).toISOString() : null,
                },
              })
            }}
          />
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
            label={'Data do pagamento'}
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

          <TextInput
            label={'LOCAL DE ENTREGA'}
            value={
              infoHolder.compra?.localEntrega != undefined && infoHolder.compra?.localEntrega != '-'
                ? infoHolder.compra?.localEntrega
                : 'NÃO DEFINIDO'
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
          <div className="flex flex-col w-[350px] items-center">
            <span className="uppercase font-bold font-raleway text-center text-sm">RELATÓRIO DE COMISS. SUPRIMENTOS</span>
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
      <div className="flex gap-2 justify-center flex-wrap py-2 border-b border-gray-200">
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
        <div className="w-full flex flex-wrap items-center justify-center gap-x-4 mt-2">
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
