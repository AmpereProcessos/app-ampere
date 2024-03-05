import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import { formatDate, projetistas, statusDoParecerDeAcesso } from '../../utils/constants'

import OSCreationBlock from '../OSCreationBlock'

import ProjectServiceOrders from '../identificador/ordensDeServico/ProjectServiceOrders'
import { accessGrantingStatus } from '../../utils/select-options'
import { TProjectDTO } from '@/utils/schemas/projects'
import CheckboxInput from '../inputs/Checkbox'
import SelectInput from '../inputs/Select'
import DateInput from '../inputs/Date'
import { formatDateInputChange } from '@/utils/methods/shared'
import NumberInput from '../inputs/Number'
import TextInput from '../inputs/Text'

type InfoProjetoBlockProps = {
  editor: boolean
  infoHolder: TProjectDTO
  setInfo: React.Dispatch<React.SetStateAction<TProjectDTO>>
  changes: { [key: string]: any }
  setChanges: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>
  project: TProjectDTO
}
function InfoProjetoBlock({ editor, infoHolder, setInfo, changes, setChanges, project }: InfoProjetoBlockProps) {
  return (
    <div className="flex flex-col rounded-md border border-[#15599a] pb-2 shadow-lg">
      <span className="mb-2 w-full rounded-tr-md rounded-tl-md bg-[#15599a] py-2 text-center font-bold text-white">INFORMAÇÕES SOBRE O PROJETO</span>
      <div className="flex w-full flex-col items-center justify-center gap-2 px-2 lg:flex-row">
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
        <CheckboxInput
          labelFalse="REALIZAR HOMOLOGAÇÃO"
          labelTrue="REALIZAR HOMOLOGAÇÃO"
          checked={!!infoHolder.projeto?.realizarHomologacao}
          handleChange={(value) => {
            setInfo((prev) => ({
              ...prev,
              projeto: {
                ...(prev.projeto || {}),
                realizarHomologacao: value,
              },
            }))
            setChanges((prev) => ({
              ...prev,
              'projeto.realizarHomologacao': value,
            }))
          }}
        />
      </div>

      <div className="flex w-full items-center justify-center self-center px-2 lg:w-1/3">
        <SelectInput
          label={'PROJETISTA'}
          value={infoHolder.projeto?.projetista?.nome}
          selectedItemLabel="NÃO DEFINIDO"
          editable={editor}
          options={projetistas.map((projetista, index) => ({
            id: index + 1,
            label: projetista.label,
            value: projetista.nome,
          }))}
          handleChange={(value) => {
            setChanges((prev) => ({
              ...prev,
              'projeto.projetista.nome': value,
            }))
            setInfo((prev) => ({
              ...prev,
              projeto: {
                ...prev.projeto,
                projetista: {
                  ...prev.projeto.projetista,
                  nome: value,
                },
              },
            }))
          }}
          onReset={() => {
            setChanges((prev) => ({
              ...prev,
              'projeto.projetista.nome': '',
            }))
            setInfo((prev) => ({
              ...prev,
              projeto: {
                ...prev.projeto,
                projetista: {
                  ...prev.projeto.projetista,
                  nome: '',
                },
              },
            }))
          }}
          width="100%"
        />
      </div>
      <h1 className="mt-2 w-full text-center font-black text-[#fead41]">PENDÊNCIAS</h1>
      <div className="my-4 flex w-full flex-col items-center justify-center gap-2 px-2 lg:flex-row">
        <div className="flex w-full items-center justify-center lg:w-1/3">
          <CheckboxInput
            labelFalse="DIAGRAMA UNIFILAR FEITO"
            labelTrue="DIAGRAMA UNIFILAR FEITO"
            checked={infoHolder.projeto?.diagramaUnifilar == 'Ok'}
            handleChange={(value) => {
              setInfo((prev) => ({
                ...prev,
                projeto: {
                  ...(prev.projeto || {}),
                  diagramaUnifilar: value ? 'Ok' : null,
                },
              }))
              setChanges((prev) => ({
                ...prev,
                'projeto.diagramaUnifilar': value ? 'Ok' : null,
              }))
            }}
          />
        </div>
        <div className="flex w-full items-center justify-center lg:w-1/3">
          <CheckboxInput
            labelFalse="DESENHO DO TELHADO FEITO"
            labelTrue="DESENHO DO TELHADO FEITO"
            checked={infoHolder.projeto?.desenhoTelhado == 'OK'}
            handleChange={(value) => {
              setInfo((prev) => ({
                ...prev,
                projeto: {
                  ...(prev.projeto || {}),
                  desenhoTelhado: value ? 'OK' : null,
                },
              }))
              setChanges((prev) => ({
                ...prev,
                'projeto.desenhoTelhado': value ? 'OK' : null,
              }))
            }}
          />
        </div>
        <div className="flex w-full items-center justify-center lg:w-1/3">
          <CheckboxInput
            labelFalse="MAPA DE MICRO FEITO"
            labelTrue="MAPA DE MICRO FEITO"
            checked={infoHolder.projeto?.mapaDeMicro == 'OK'}
            handleChange={(value) => {
              setInfo((prev) => ({
                ...prev,
                projeto: {
                  ...(prev.projeto || {}),
                  mapaDeMicro: value ? 'OK' : null,
                },
              }))
              setChanges((prev) => ({
                ...prev,
                'projeto.mapaDeMicro': value ? 'OK' : null,
              }))
            }}
          />
        </div>
      </div>
      <h1 className="mt-2 w-full text-center font-black text-[#fead41]">DOCUMENTAÇÃO</h1>
      <div className="mt-2 flex w-full flex-col items-center justify-center gap-2 px-2 lg:flex-row">
        <div className="w-full lg:w-1/3">
          <SelectInput
            label={'FORMA DE ASSINATURA'}
            value={infoHolder.projeto?.formaAssDocumentacao}
            selectedItemLabel="NÃO DEFINIDO"
            editable={editor}
            options={[
              { id: 1, label: 'FISICA', value: 'FISICA' },
              { id: 2, label: 'DIGITAL', value: 'DIGITAL' },
            ]}
            handleChange={(value) => {
              setChanges({
                ...changes,
                'projeto.formaAssDocumentacao': value,
              })
              setInfo({
                ...infoHolder,
                projeto: {
                  ...infoHolder.projeto,
                  formaAssDocumentacao: value,
                },
              })
            }}
            onReset={() => {
              setChanges({
                ...changes,
                'projeto.formaAssDocumentacao': null,
              })
              setInfo({
                ...infoHolder,
                projeto: {
                  ...infoHolder.projeto,
                  formaAssDocumentacao: null,
                },
              })
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/3">
          <DateInput
            label={'DATA DE LIBERAÇÃO DA DOCUMENTAÇÃO'}
            editable={editor}
            value={infoHolder.projeto.dataLiberacaoDocumentacao ? formatDate(infoHolder.projeto.dataLiberacaoDocumentacao) : undefined}
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                'projeto.dataLiberacaoDocumentacao': formatDateInputChange(value),
              }))
              setInfo((prev) => ({
                ...prev,
                projeto: {
                  ...prev.projeto,
                  dataLiberacaoDocumentacao: formatDateInputChange(value),
                },
              }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/3">
          <DateInput
            label={'DATA DE ASSINATURA DA DOCUMENTAÇÃO'}
            editable={editor}
            value={infoHolder.projeto.dataAssDocumentacao ? formatDate(infoHolder.projeto.dataAssDocumentacao) : undefined}
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                'projeto.dataAssDocumentacao': formatDateInputChange(value),
              }))
              setInfo((prev) => ({
                ...prev,
                projeto: {
                  ...prev.projeto,
                  dataAssDocumentacao: formatDateInputChange(value),
                },
              }))
            }}
            width="100%"
          />
        </div>
      </div>
      <h1 className="mt-2 w-full text-center font-black text-[#fead41]">PARECER DE ACESSO</h1>
      <div className="mt-2 flex w-full flex-col items-center justify-center gap-2 px-2 lg:flex-row">
        <div className="w-full lg:w-1/4">
          <DateInput
            label={'DATA DE SOLICITAÇÃO DE ACESSO'}
            editable={editor}
            value={infoHolder.projeto.dataSolicitacaoAcesso ? formatDate(infoHolder.projeto.dataSolicitacaoAcesso) : undefined}
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                'projeto.dataSolicitacaoAcesso': formatDateInputChange(value),
              }))
              setInfo((prev) => ({
                ...prev,
                projeto: {
                  ...prev.projeto,
                  dataSolicitacaoAcesso: formatDateInputChange(value),
                },
              }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <DateInput
            label={'DATA DO PARECER DE ACESSO'}
            editable={editor}
            value={infoHolder.parecer.dataParecerDeAcesso ? formatDate(infoHolder.parecer.dataParecerDeAcesso) : undefined}
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                'parecer.dataParecerDeAcesso': formatDateInputChange(value),
              }))
              setInfo((prev) => ({
                ...prev,
                parecer: {
                  ...prev.parecer,
                  dataParecerDeAcesso: formatDateInputChange(value),
                },
              }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <SelectInput
            label={'STATUS DO PARECER DE ACESSO'}
            value={infoHolder.parecer.statusDoParecerDeAcesso}
            selectedItemLabel="NÃO DEFINIDO"
            editable={editor}
            options={accessGrantingStatus.map((status) => status)}
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                'parecer.statusDoParecerDeAcesso': value,
              }))
              setInfo((prev) => ({
                ...prev,
                parecer: {
                  ...prev.parecer,
                  statusDoParecerDeAcesso: value,
                },
              }))
            }}
            onReset={() => {
              setChanges((prev) => ({
                ...prev,
                'parecer.statusDoParecerDeAcesso': null,
              }))
              setInfo((prev) => ({
                ...prev,
                parecer: {
                  ...prev.parecer,
                  statusDoParecerDeAcesso: null,
                },
              }))
            }}
            width="100%"
          />
        </div>
        {infoHolder.parecer.statusDoParecerDeAcesso == 'PARECER DE ACESSO COM OBRAS' ? (
          <div className="w-full lg:w-1/4">
            <NumberInput
              label={'QUANTOS DIAS DE OBRA?'}
              value={infoHolder.parecer?.qtdeDiasObraDeRede || null}
              placeholder="Preencha aqui o número de dias para obra de rede..."
              editable={editor}
              handleChange={(value) => {
                setChanges({
                  ...changes,
                  'parecer.qtdeDiasObraDeRede': value,
                })
                setInfo({
                  ...infoHolder,
                  parecer: {
                    ...infoHolder.parecer,
                    qtdeDiasObraDeRede: value,
                  },
                })
              }}
              width="100%"
            />
          </div>
        ) : null}
      </div>
      <div className="mt-2 flex w-full flex-col items-center justify-center gap-2 px-2 lg:flex-row">
        <div className="flex w-full items-center justify-center lg:w-1/3">
          <CheckboxInput
            labelFalse="HOUVE REPROVA DE PARECER"
            labelTrue="HOUVE REPROVA DE PARECER"
            checked={infoHolder.parecer.parecerReprovado == 'SIM'}
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                'parecer.parecerReprovado': value ? 'SIM' : 'NÃO',
              }))
              setInfo((prev) => ({
                ...prev,
                parecer: {
                  ...prev.parecer,
                  parecerReprovado: value ? 'SIM' : 'NÃO',
                },
              }))
            }}
          />
        </div>
        {infoHolder.parecer.parecerReprovado == 'SIM' ? (
          <>
            <div className="w-full lg:w-1/3">
              <NumberInput
                label={'Nº DE REPROVAS'}
                value={infoHolder.parecer.qtdeReprovas || 0}
                placeholder="Preencha aqui o número de reprovas..."
                editable={editor}
                handleChange={(value) => {
                  setChanges((prev) => ({
                    ...prev,
                    'parecer.qtdeReprovas': value,
                  }))
                  setInfo((prev) => ({
                    ...prev,
                    parecer: {
                      ...prev.parecer,
                      qtdeReprovas: value,
                    },
                  }))
                }}
                width="100%"
              />
            </div>
            <div className="w-full lg:w-1/3">
              <TextInput
                label="MOTIVO DA REPROVA"
                placeholder="Preencha aqui o motivo da reprova..."
                value={infoHolder.parecer.motivoReprova || ''}
                handleChange={(value) => {
                  setChanges((prev) => ({
                    ...prev,
                    'parecer.motivoReprova': value,
                  }))
                  setInfo((prev) => ({
                    ...prev,
                    parecer: {
                      ...prev.parecer,
                      motivoReprova: value,
                    },
                  }))
                }}
                width="100%"
              />
            </div>
          </>
        ) : null}
      </div>
      {infoHolder.parecer.statusDoParecerDeAcesso == 'PENDENCIAS' && (
        <div className="mt-2 flex w-full items-center justify-center">
          <div className="flex w-[450px] flex-col items-center">
            <span className="text-center font-raleway text-sm font-bold uppercase">PENDÊNCIAS DO PARECER</span>
            <textarea
              readOnly={!editor}
              value={infoHolder.parecer?.pendencias ? infoHolder.parecer?.pendencias : ''}
              placeholder={'Pendências do parecer aqui...'}
              onChange={(e) => {
                setChanges({
                  ...changes,
                  'parecer.pendencias': e.target.value,
                })
                setInfo({
                  ...infoHolder,
                  parecer: {
                    ...infoHolder.parecer,
                    pendencias: e.target.value,
                  },
                })
              }}
              className="h-[150px] w-full resize-none border border-gray-600 bg-gray-200 p-2 text-center outline-none"
            />
          </div>
        </div>
      )}
      <h1 className="mt-2 w-full text-center font-black text-[#fead41]">VISTORIA</h1>
      <div className="mt-2 flex w-full flex-col items-center justify-center gap-2 px-2 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <DateInput
            label={'DATA DE PEDIDO DA VISTORIA'}
            editable={editor}
            value={infoHolder.vistoria.dataPedido ? formatDate(infoHolder.vistoria.dataPedido) : undefined}
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                'vistoria.dataPedido': formatDateInputChange(value),
              }))
              setInfo((prev) => ({
                ...prev,
                vistoria: {
                  ...prev.vistoria,
                  dataPedido: formatDateInputChange(value),
                },
              }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/2">
          <SelectInput
            label={'STATUS DA VISTORIA'}
            value={infoHolder.vistoria?.status}
            selectedItemLabel="NÃO DEFINIDO"
            editable={editor}
            options={[
              { id: 1, label: 'REALIZADA', value: 'REALIZADA' },
              { id: 2, label: 'AGUARDANDO OBRA DE REDE', value: 'AGUARDANDO OBRA DE REDE' },
              { id: 3, label: 'AGUARDANDO CONCESSIONARIA', value: 'AGUARDANDO CONCESSIONARIA' },
            ]}
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                'vistoria.status': value,
              }))
              setInfo((prev) => ({
                ...prev,
                vistoria: {
                  ...prev.vistoria,
                  status: value,
                },
              }))
            }}
            onReset={() => {
              setChanges((prev) => ({
                ...prev,
                'vistoria.status': null,
              }))
              setInfo((prev) => ({
                ...prev,
                vistoria: {
                  ...prev.vistoria,
                  status: null,
                },
              }))
            }}
            width="100%"
          />
        </div>
      </div>
      <div className="mt-2 flex w-full flex-col items-center justify-center gap-2 px-2 lg:flex-row">
        <div className="flex w-full items-center justify-center lg:w-1/4">
          <CheckboxInput
            labelFalse="HOUVE REPROVA DE VISTORIA"
            labelTrue="HOUVE REPROVA DE VISTORIA"
            checked={infoHolder.vistoria.vistoriaReprovada == 'SIM'}
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                'vistoria.vistoriaReprovada': value ? 'SIM' : 'NÃO',
              }))
              setInfo((prev) => ({
                ...prev,
                vistoria: {
                  ...prev.vistoria,
                  vistoriaReprovada: value ? 'SIM' : 'NÃO',
                },
              }))
            }}
          />
        </div>
        {infoHolder.vistoria.vistoriaReprovada == 'SIM' ? (
          <>
            <div className="w-full lg:w-1/4">
              <NumberInput
                label={'Nº DE REPROVAS'}
                value={infoHolder.vistoria.qtdeReprovas || 0}
                placeholder="Preencha aqui o número de reprovas..."
                editable={editor}
                handleChange={(value) => {
                  setChanges((prev) => ({
                    ...prev,
                    'vistoria.qtdeReprovas': value,
                  }))
                  setInfo((prev) => ({
                    ...prev,
                    vistoria: {
                      ...prev.vistoria,
                      qtdeReprovas: value,
                    },
                  }))
                }}
                width="100%"
              />
            </div>
            <div className="w-full lg:w-1/4">
              <TextInput
                label="MOTIVO DA REPROVA"
                placeholder="Preencha aqui o motivo da reprova..."
                value={infoHolder.vistoria.motivoReprova || ''}
                handleChange={(value) => {
                  setChanges((prev) => ({
                    ...prev,
                    'vistoria.motivoReprova': value,
                  }))
                  setInfo((prev) => ({
                    ...prev,
                    vistoria: {
                      ...prev.vistoria,
                      motivoReprova: value,
                    },
                  }))
                }}
                width="100%"
              />
            </div>
            <div className="flex w-full items-center justify-center lg:w-1/4">
              <CheckboxInput
                labelFalse="EQUIPE DE CAMPO NECESSÁRIA"
                labelTrue="EQUIPE DE CAMPO NECESSÁRIA"
                checked={infoHolder.vistoria.equipeDeCampoNecessaria == 'SIM'}
                handleChange={(value) => {
                  setChanges((prev) => ({
                    ...prev,
                    'vistoria.equipeDeCampoNecessaria': value ? 'SIM' : 'NÃO',
                  }))
                  setInfo((prev) => ({
                    ...prev,
                    vistoria: {
                      ...prev.vistoria,
                      equipeDeCampoNecessaria: value ? 'SIM' : 'NÃO',
                    },
                  }))
                }}
              />
            </div>
          </>
        ) : null}
      </div>
      {infoHolder.vistoria?.vistoriaReprovada == 'SIM' && infoHolder.vistoria.equipeDeCampoNecessaria == 'SIM' && (
        <div className="flex flex-col  pb-2 shadow-lg">
          <span className="py-2 text-center text-sm font-bold uppercase text-[#15599a]">ORDENS DE SERVIÇO</span>
          <OSCreationBlock
            project={infoHolder}
            categories={[
              { label: 'PADRÃO', value: 'PADRÃO' },
              { label: 'ESTRUTURA', value: 'ESTRUTURA' },
              {
                label: 'MANUTENÇÃO PREVENTIVA',
                value: 'MANUTENÇÃO PREVENTIVA',
              },
              {
                label: 'MANUTENÇÃO CORRETIVA',
                value: 'MANUTENÇÃO CORRETIVA',
              },
              {
                label: 'NÃO DEFINIDO',
                value: 'NÃO DEFINIDO',
              },
            ]}
          />
          <ProjectServiceOrders projectId={project._id} />
        </div>
      )}
      <h1 className="mt-2 w-full text-center font-black text-[#fead41]">MEDIDOR</h1>
      <div className="mt-2 flex w-full flex-col items-center justify-center gap-2 px-2 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <DateInput
            label={'DATA DE TROCA DO MEDIDOR'}
            editable={editor}
            value={infoHolder.medidor.data ? formatDate(infoHolder.medidor.data) : undefined}
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                'medidor.data': formatDateInputChange(value),
              }))
              setInfo((prev) => ({
                ...prev,
                medidor: {
                  ...prev.medidor,
                  data: formatDateInputChange(value),
                },
              }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/2">
          <SelectInput
            label={'STATUS DA TROCA DO MEDIDOR'}
            value={infoHolder.medidor?.status}
            selectedItemLabel="NÃO DEFINIDO"
            editable={editor}
            options={[
              { id: 1, label: 'REALIZADA', value: 'REALIZADA' },
              { id: 2, label: 'AGUARDANDO OBRA DE REDE', value: 'AGUARDANDO OBRA DE REDE' },
            ]}
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                'medidor.status': value,
              }))
              setInfo((prev) => ({
                ...prev,
                medidor: {
                  ...prev.medidor,
                  status: value,
                },
              }))
            }}
            onReset={() => {
              setChanges((prev) => ({
                ...prev,
                'medidor.status': null,
              }))
              setInfo((prev) => ({
                ...prev,
                medidor: {
                  ...prev.medidor,
                  status: null,
                },
              }))
            }}
            width="100%"
          />
        </div>
      </div>
      <div className="my-4 mt-6 flex w-full items-center justify-center self-center">
        <CheckboxInput
          labelFalse="PROJETO CONCLUIDO"
          labelTrue="PROJETO CONCLUIDO"
          checked={infoHolder.projeto.projetoConcluido == 'SIM'}
          handleChange={(value) => {
            setInfo((prev) => ({
              ...prev,
              projeto: {
                ...prev.projeto,
                projetoConcluido: value ? 'SIM' : 'NÃO',
              },
            }))
            setChanges((prev) => ({
              ...prev,
              'projeto.projetoConcluido': value ? 'SIM' : 'NÃO',
            }))
          }}
        />
      </div>
    </div>
  )
}

export default InfoProjetoBlock
