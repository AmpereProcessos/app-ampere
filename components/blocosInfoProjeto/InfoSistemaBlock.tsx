import React, { useContext } from 'react'

import { TProjectDTO } from '@/utils/schemas/projects'
import SelectInput from '../inputs/Select'
import NumberInput from '../inputs/Number'
import TextInput from '../inputs/Text'
import CheckboxInput from '../inputs/Checkbox'

type InfoSistemaBlockProps = {
  editor: boolean
  infoHolder: TProjectDTO
  setInfo: React.Dispatch<React.SetStateAction<TProjectDTO>>
  changes: { [key: string]: any }
  setChanges: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>
  showPaymentInfo: boolean
}
function InfoSistemaBlock({ editor, infoHolder, setInfo, changes, setChanges, showPaymentInfo = false }: InfoSistemaBlockProps) {
  return (
    <div className="flex flex-col rounded-md border border-[#15599a] pb-2 shadow-lg">
      <span className="mb-2 w-full rounded-tr-md rounded-tl-md bg-[#15599a] py-2 text-center font-bold text-white">INFORMAÇÕES SOBRE O SISTEMA</span>
      <div className="mt-2 flex w-full flex-col items-center gap-2 px-2 lg:flex-row">
        {showPaymentInfo ? (
          <div className="w-full lg:w-1/2">
            <NumberInput
              label={'VALOR DO PROJETO'}
              placeholder="Preencha aqui o valor do projeto..."
              editable={editor}
              value={infoHolder.sistema?.valorProjeto || 0}
              handleChange={(value) => {
                setChanges((prev) => ({
                  ...prev,
                  'sistema.valorProjeto': value,
                }))
                setInfo((prev) => ({
                  ...prev,
                  sistema: {
                    ...prev.sistema,
                    valorProjeto: value,
                  },
                }))
              }}
              width="100%"
            />
          </div>
        ) : null}
        <div className="w-full lg:w-1/2">
          <NumberInput
            label={'POTÊNCIA PICO DO PROJETO'}
            placeholder="Preencha aqui a potência pico do projeto..."
            editable={editor}
            value={infoHolder.sistema?.potPico || 0}
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                'sistema.potPico': value,
              }))
              setInfo((prev) => ({
                ...prev,
                sistema: {
                  ...prev.sistema,
                  potPico: value,
                },
              }))
            }}
            width="100%"
          />
        </div>
      </div>
      <div className="mt-2 flex w-full flex-col items-center gap-2 px-2 lg:flex-row">
        <div className="w-full lg:w-1/4">
          <SelectInput
            label={'TOPOLOGIA'}
            value={infoHolder.sistema?.topologia}
            selectedItemLabel="NÃO DEFINIDO"
            editable={editor}
            options={[
              { id: 1, label: 'INVERSOR', value: 'INVERSOR' },
              { id: 2, label: 'MICRO', value: 'MICRO' },
              { id: 3, label: 'OUTROS SERV.', value: 'OUTROS SERV.' },
            ]}
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                'sistema.topologia': value,
              }))
              setInfo((prev) => ({
                ...prev,
                sistema: {
                  ...prev.sistema,
                  topologia: value,
                },
              }))
            }}
            onReset={() => {
              setChanges((prev) => ({
                ...prev,
                'sistema.topologia': undefined,
              }))
              setInfo((prev) => ({
                ...prev,
                sistema: {
                  ...prev.sistema,
                  topologia: undefined,
                },
              }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <TextInput
            label={'QTDE E POTÊNCIA DO(S) INVERSOR(ES)'}
            editable={editor}
            value={infoHolder.sistema?.inversor || ''}
            placeholder="Preencha a quantidade e a potência do inversor..."
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                'sistema.inversor': value,
              }))
              setInfo((prev) => ({
                ...prev,
                sistema: {
                  ...prev.sistema,
                  inversor: value,
                },
              }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <NumberInput
            label={'NÚMERO DE MÓDULOS'}
            editable={editor}
            value={infoHolder.sistema?.qtdeModulos || 0}
            placeholder="Preencha o número de módulos"
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                'sistema.qtdeModulos': value,
              }))
              setInfo((prev) => ({
                ...prev,
                sistema: {
                  ...prev.sistema,
                  qtdeModulos: value,
                },
              }))
            }}
          />
        </div>
        <div className="w-full lg:w-1/4">
          <TextInput
            label={'POTÊNCIA DOS MÓDULOS'}
            editable={editor}
            value={infoHolder.sistema?.potModulos?.toString() || ''}
            placeholder="Preencha a potência dos módulos..."
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                'sistema.potModulos': value,
              }))
              setInfo((prev) => ({ ...prev, sistema: { ...prev.sistema, potModulos: value } }))
            }}
          />
        </div>
      </div>

      {infoHolder.tipoDeServico == 'SISTEMA FOTOVOLTAICO (OFF GRID)' && (
        <>
          <h1 className="mt-2 w-full text-center font-black text-[#fead41]">SISTEMA OFF GRID</h1>
          <div className="mt-2 flex w-full flex-col items-center justify-center gap-2 px-2 lg:flex-row">
            <div className="w-full lg:w-1/4">
              <SelectInput
                label={'TIPO DO CONTROLADOR'}
                editable={true}
                value={infoHolder.sistema.tipoControlador ? infoHolder.sistema.tipoControlador : 'NÃO DEFINIDO'}
                selectedItemLabel="NÃO DEFINIDO"
                options={[
                  { id: 1, label: 'INTEGRADO AO INVERSOR', value: 'INTEGRADO AO INVERSOR' },
                  { id: 2, label: 'COMPRO EM SEPARADO', value: 'SEPARADO' },
                ]}
                handleChange={(value) => {
                  setChanges((prev) => ({
                    ...prev,
                    'sistema.tipoControlador': value,
                  }))
                  setInfo((prev) => ({
                    ...prev,
                    sistema: {
                      ...prev.sistema,
                      tipoControlador: value,
                    },
                  }))
                }}
                onReset={() => {
                  setChanges((prev) => ({
                    ...prev,
                    'sistema.tipoControlador': '',
                  }))
                  setInfo((prev) => ({
                    ...prev,
                    sistema: {
                      ...prev.sistema,
                      tipoControlador: '',
                    },
                  }))
                }}
                width="100%"
              />
            </div>
            {infoHolder.sistema.tipoControlador != 'INTEGRADO AO INVERSOR' ? (
              <>
                <div className="w-full lg:w-1/4">
                  <TextInput
                    label={'MARCA DO CONTROLADOR'}
                    value={infoHolder.sistema?.marcaControlador}
                    placeholder="Preencha aqui a marca do controlador..."
                    handleChange={(value) => {
                      setChanges((prev) => ({
                        ...prev,
                        'sistema.marcaControlador': value,
                      }))
                      setInfo((prev) => ({
                        ...prev,
                        sistema: {
                          ...prev.sistema,
                          marcaControlador: value,
                        },
                      }))
                    }}
                    width="100%"
                  />
                </div>
                <div className="w-full lg:w-1/4">
                  <NumberInput
                    label={'QTDE DE CONTROLADORES'}
                    editable={true}
                    value={infoHolder.sistema?.qtdeControlador || null}
                    placeholder="Preencha a quantidade de controladores..."
                    handleChange={(value) => {
                      setChanges((prev) => ({
                        ...prev,
                        'sistema.qtdeControlador': Number(value),
                      }))
                      setInfo((prev) => ({
                        ...prev,
                        sistema: {
                          ...prev.sistema,
                          qtdeControlador: Number(value),
                        },
                      }))
                    }}
                    width="100%"
                  />
                </div>
                <div className="w-full lg:w-1/4">
                  <NumberInput
                    label={'CORRENTE DE CARGA (A)'}
                    editable={true}
                    value={infoHolder.sistema.correnteControlador || null}
                    placeholder="Preencha aqui a corrente de carga do controlador..."
                    handleChange={(value) => {
                      setChanges((prev) => ({
                        ...prev,
                        'sistema.correnteControlador': Number(value),
                      }))
                      setInfo((prev) => ({
                        ...prev,
                        sistema: {
                          ...prev.sistema,
                          correnteControlador: Number(value),
                        },
                      }))
                    }}
                    width="100%"
                  />
                </div>
              </>
            ) : null}
          </div>
        </>
      )}
      {infoHolder.tipoDeServico == 'BOMBA SOLAR' && (
        <>
          <div className="mt-2 flex w-full flex-col items-center justify-center gap-2 px-2 lg:flex-row">
            <div className="w-full lg:w-1/3">
              <TextInput
                label={'MARCA BOMBA'}
                editable={editor}
                value={infoHolder.sistema.marcaBomba}
                placeholder="Preencha aqui a marca da bomba..."
                handleChange={(value) => {
                  setChanges((prev) => ({
                    ...prev,
                    'sistema.marcaBomba': value,
                  }))
                  setInfo((prev) => ({
                    ...prev,
                    sistema: {
                      ...prev.sistema,
                      marcaBomba: value,
                    },
                  }))
                }}
                width="100%"
              />
            </div>
            <div className="w-full lg:w-1/3">
              <NumberInput
                label={'QTDE BOMBA'}
                editable={editor}
                value={infoHolder.sistema.qtdeBomba || null}
                placeholder="Preencha aqui a quantidade de bombas..."
                handleChange={(value) => {
                  setChanges((prev) => ({
                    ...prev,
                    'sistema.qtdeBomba': value,
                  }))
                  setInfo((prev) => ({
                    ...prev,
                    sistema: {
                      ...prev.sistema,
                      qtdeBomba: value,
                    },
                  }))
                }}
                width="100%"
              />
            </div>
            <div className="w-full lg:w-1/3">
              <NumberInput
                label={'POTÊNCIA BOMBA'}
                editable={editor}
                value={infoHolder.sistema.potBomba || null}
                placeholder="Preencha aqui a potência da(s) bomba(s)..."
                handleChange={(value) => {
                  setChanges((prev) => ({
                    ...prev,
                    'sistema.potBomba': value,
                  }))
                  setInfo((prev) => ({
                    ...prev,
                    sistema: {
                      ...prev.sistema,
                      potBomba: value,
                    },
                  }))
                }}
                width="100%"
              />
            </div>
          </div>
        </>
      )}
      {infoHolder.tipoDeServico == 'BOMBA SOLAR' || infoHolder.tipoDeServico == 'SISTEMA FOTOVOLTAICO (OFF GRID)' ? (
        <div className="mt-2 flex w-full flex-col items-center justify-center gap-2 px-2 lg:flex-row">
          <div className="w-full lg:w-1/4">
            <TextInput
              label={'MARCA DA BATERIA'}
              editable={true}
              value={infoHolder.sistema.marcaBateria}
              placeholder="Preencha aqui a marca da bateria..."
              handleChange={(value) => {
                setChanges((prev) => ({
                  ...prev,
                  'sistema.marcaBateria': value,
                }))
                setInfo((prev) => ({
                  ...prev,
                  sistema: {
                    ...prev.sistema,
                    marcaBateria: value,
                  },
                }))
              }}
              width="100%"
            />
          </div>
          <div className="w-full lg:w-1/4">
            <NumberInput
              label={'QTDE DE BATERIAS'}
              editable={true}
              value={infoHolder.sistema.qtdeBateria || null}
              placeholder="Preencha aqui a quantidade de baterias..."
              handleChange={(value) => {
                setChanges({
                  ...changes,
                  'sistema.qtdeBateria': Number(value),
                })
                setInfo({
                  ...infoHolder,
                  sistema: {
                    ...infoHolder.sistema,
                    qtdeBateria: Number(value),
                  },
                })
              }}
              width="100%"
            />
          </div>
          <div className="w-full lg:w-1/4">
            <SelectInput
              label={'TIPO DA BATERIA'}
              editable={true}
              value={infoHolder.sistema.tipoBateria}
              selectedItemLabel="NÃO DEFINIDO"
              options={[
                { id: 1, label: 'LÍTIO', value: 'LÍTIO' },
                { id: 2, label: 'ESTACIONÁRIA', value: 'ESTACIONÁRIA' },
              ]}
              handleChange={(value) => {
                setChanges((prev) => ({
                  ...prev,
                  'sistema.tipoBateria': value,
                }))
                setInfo((prev) => ({
                  ...prev,
                  sistema: {
                    ...prev.sistema,
                    tipoBateria: value,
                  },
                }))
              }}
              onReset={() => {
                setChanges((prev) => ({
                  ...prev,
                  'sistema.tipoBateria': 'NÃO DEFINIDO',
                }))
                setInfo((prev) => ({
                  ...prev,
                  sistema: {
                    ...prev.sistema,
                    tipoBateria: 'NÃO DEFINIDO',
                  },
                }))
              }}
              width="100%"
            />
          </div>
          <div className="w-full lg:w-1/4">
            <NumberInput
              label={'CAPACIDADE (Ah)'}
              editable={true}
              value={infoHolder.sistema.capacidadeBateria || null}
              placeholder="Preencha aqui"
              handleChange={(value) => {
                setChanges((prev) => ({
                  ...prev,
                  'sistema.capacidadeBateria': Number(value),
                }))
                setInfo((prev) => ({
                  ...prev,
                  sistema: {
                    ...prev.sistema,
                    capacidadeBateria: Number(value),
                  },
                }))
              }}
              width="100%"
            />
          </div>
        </div>
      ) : null}
      <div className="my-4 flex w-full items-center justify-center self-center">
        <CheckboxInput
          labelFalse="INICIAR PROJETO"
          labelTrue="INICIAR PROJETO"
          checked={infoHolder.projeto.iniciar == 'SIM'}
          handleChange={(value) => {
            setInfo((prev) => ({
              ...prev,
              projeto: {
                ...prev.projeto,
                iniciar: value ? 'SIM' : 'NÃO DEFINIDO',
              },
            }))
            setChanges((prev) => ({
              ...prev,
              'projeto.iniciar': value ? 'SIM' : 'NÃO DEFINIDO',
            }))
          }}
        />
      </div>
    </div>
  )
}

export default InfoSistemaBlock
