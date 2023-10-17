import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import { projetistas, statusDoParecerDeAcesso } from '../../utils/constants'
import DateInput from '../DateInput'
import NumberInput from '../NumberInput'
import OSCreationBlock from '../OSCreationBlock'
import SelectInput from '../SelectInput'
import ProjectServiceOrders from '../identificador/ordensDeServico/ProjectServiceOrders'
import { accessGrantingStatus } from '../../utils/select-options'

function InfoProjetoBlock({ editor, infoHolder, setInfo, changes, setChanges, handleUpdates, project }) {
  const { data: session } = useSession()
  return (
    <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg rounded-md">
      <span className="w-full bg-[#15599a] text-white text-center font-bold py-2 rounded-tr-md rounded-tl-md mb-2">INFORMAÇÕES SOBRE O PROJETO</span>
      <div className="flex items-center justify-center">
        <div className="flex flex-col w-[350px] items-center">
          <span className="uppercase font-bold font-raleway text-center text-sm">REALIZAR HOMOLOGAÇÃO</span>
          <div className="flex">
            <input
              disabled={!editor}
              checked={infoHolder.projeto?.realizarHomologacao}
              onChange={(e) => {
                setChanges({
                  ...changes,
                  'projeto.realizarHomologacao': e.target.checked,
                })
                setInfo((prev) => ({
                  ...prev,
                  projeto: {
                    ...prev.projeto,
                    realizarHomologacao: e.target.checked,
                  },
                }))
              }}
              type="checkbox"
              name="realizarHomologacao"
              id="realizarHomologacao"
            />
            <label className="ml-2" htmlFor="realizarHomologacao">
              SIM
            </label>
          </div>
        </div>
      </div>
      <div className="flex gap-2 justify-center flex-wrap">
        <SelectInput
          label={'Projetista'}
          value={infoHolder.projeto?.projetista?.nome ? infoHolder.projeto?.projetista?.nome : 'NÃO DEFINIDO'}
          editable={editor}
          options={projetistas.map((projetista) => {
            return {
              label: projetista.label,
              value: projetista.nome,
            }
          })}
          handleChange={(value) => {
            setChanges({
              ...changes,
              'projeto.projetista.nome': value,
              'projeto.projetista.codigo': projetistas.filter((projetista) => projetista.nome == value)[0].cod || '-',
            })
            setInfo({
              ...infoHolder,
              projeto: {
                ...infoHolder.projeto,
                projetista: {
                  nome: value,
                  codigo: projetistas.filter((projetista) => projetista.nome == value)[0].cod || '-',
                },
              },
            })
          }}
        />
        <div className="flex flex-col w-[350px] items-center">
          <span className="uppercase font-bold font-raleway text-center text-sm">DIAGRAMA UNIFILAR</span>
          <div className="flex">
            <input
              disabled={!editor}
              checked={infoHolder.projeto?.diagramaUnifilar === 'Ok' ? true : false}
              onChange={(e) => {
                setChanges({
                  ...changes,
                  'projeto.diagramaUnifilar': e.target.checked ? 'Ok' : 'PENDÊNCIA',
                })
                setInfo({
                  ...infoHolder,
                  projeto: {
                    ...infoHolder.projeto,
                    diagramaUnifilar: e.target.checked ? 'Ok' : 'PENDÊNCIA',
                  },
                })
              }}
              type="checkbox"
              name="diagramaunifilar"
              id="diagramaunifilar"
            />
            <label className="ml-2" htmlFor="diagramaunifilar">
              {infoHolder.projeto.diagramaUnifilar === 'Ok' ? 'OK' : 'PENDÊNCIA'}
            </label>
          </div>
        </div>
        <div className="flex flex-col w-[350px] items-center">
          <span className="uppercase font-bold font-raleway text-center text-sm">DESENHO DO TELHADO</span>
          <div className="flex">
            <input
              disabled={!editor}
              checked={infoHolder.projeto?.desenhoTelhado === 'OK' ? true : false}
              onChange={(e) => {
                setChanges({
                  ...changes,
                  'projeto.desenhoTelhado': e.target.checked ? 'OK' : 'PENDÊNCIA',
                })
                setInfo({
                  ...infoHolder,
                  projeto: {
                    ...infoHolder.projeto,
                    desenhoTelhado: e.target.checked ? 'OK' : 'PENDÊNCIA',
                  },
                })
              }}
              type="checkbox"
              name="desenhotelhado"
              id="desenhotelhado"
            />
            <label className="ml-2" htmlFor="desenhotelhado">
              OK
            </label>
          </div>
        </div>
        <SelectInput
          label={'MAPA DE MICRO'}
          editable={editor}
          value={
            infoHolder.projeto?.mapaDeMicro != undefined && infoHolder.projeto?.mapaDeMicro != '-' ? infoHolder.projeto?.mapaDeMicro : 'NÃO DEFINIDO'
          }
          options={[
            { label: 'OK', value: 'OK' },
            { label: `N\A`, value: `N\A` },
            { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
          ]}
          handleChange={(value) => {
            setChanges({
              ...changes,
              'projeto.mapaDeMicro': value,
            })
            setInfo({
              ...infoHolder,
              projeto: {
                ...infoHolder.projeto,
                mapaDeMicro: value,
              },
            })
          }}
        />
      </div>
      {infoHolder.projeto.realizarHomologacao ? (
        <div className="flex gap-2 justify-center flex-wrap">
          <DateInput
            label={'Data de liberação da documentação'}
            editable={editor}
            value={
              infoHolder.projeto.dataLiberacaoDocumentacao != undefined && infoHolder.projeto.dataLiberacaoDocumentacao != '-'
                ? new Date(infoHolder.projeto.dataLiberacaoDocumentacao).toISOString().slice(0, 10)
                : 0
            }
            handleChange={(value) => {
              setChanges({
                ...changes,
                'projeto.dataLiberacaoDocumentacao': isNaN(value) ? new Date(value).toISOString() : null,
              })
              setInfo({
                ...infoHolder,
                projeto: {
                  ...infoHolder.projeto,
                  dataLiberacaoDocumentacao: isNaN(value) ? new Date(value).toISOString() : null,
                },
              })
            }}
          />
          <DateInput
            label={'Data de assinatura da documentação'}
            editable={editor}
            value={
              infoHolder.projeto.dataAssDocumentacao != undefined && infoHolder.projeto.dataAssDocumentacao != '-'
                ? new Date(infoHolder.projeto.dataAssDocumentacao).toISOString().slice(0, 10)
                : 0
            }
            handleChange={(value) => {
              setChanges({
                ...changes,
                'projeto.dataAssDocumentacao': isNaN(value) ? new Date(value).toISOString() : null,
              })
              setInfo({
                ...infoHolder,
                projeto: {
                  ...infoHolder.projeto,
                  dataAssDocumentacao: isNaN(value) ? new Date(value).toISOString() : null,
                },
              })
            }}
          />
          <SelectInput
            label={'Forma de Assinatura (DOC)'}
            value={infoHolder.projeto?.formaAssDocumentacao ? infoHolder.projeto?.formaAssDocumentacao : 'NÃO DEFINIDO'}
            editable={editor}
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
            options={[
              {
                label: 'FISICA',
                value: 'FISICA',
              },
              {
                label: 'DIGITAL',
                value: 'DIGITAL',
              },
              {
                label: 'NÃO DEFINIDO',
                value: 'NÃO DEFINIDO',
              },
            ]}
          />
          <DateInput
            label={'DATA DE SOLICITAÇÃO DE ACESSO'}
            editable={editor}
            value={
              infoHolder.projeto.dataSolicitacaoAcesso != undefined && infoHolder.projeto.dataSolicitacaoAcesso != '-'
                ? new Date(infoHolder.projeto.dataSolicitacaoAcesso).toISOString().slice(0, 10)
                : 0
            }
            handleChange={(value) => {
              setChanges({
                ...changes,
                'projeto.dataSolicitacaoAcesso': isNaN(value) ? new Date(value).toISOString() : null,
              })
              setInfo({
                ...infoHolder,
                projeto: {
                  ...infoHolder.projeto,
                  dataSolicitacaoAcesso: isNaN(value) ? new Date(value).toISOString() : null,
                },
              })
            }}
          />
          <DateInput
            label={'Parecer de acesso'}
            editable={editor}
            value={
              infoHolder.parecer?.dataParecerDeAcesso != undefined && infoHolder.parecer?.dataParecerDeAcesso != '-'
                ? new Date(infoHolder.parecer?.dataParecerDeAcesso).toISOString().slice(0, 10)
                : 0
            }
            handleChange={(value) => {
              setChanges({
                ...changes,
                'parecer.dataParecerDeAcesso': isNaN(value) ? new Date(value).toISOString() : null,
              })
              setInfo({
                ...infoHolder,
                parecer: {
                  ...infoHolder.parecer,
                  dataParecerDeAcesso: isNaN(value) ? new Date(value).toISOString() : null,
                },
              })
            }}
          />
          <SelectInput
            label={'Status do parecer de acesso'}
            value={infoHolder.parecer.statusDoParecerDeAcesso ? infoHolder.parecer.statusDoParecerDeAcesso : 'NÃO DEFINIDO'}
            editable={editor}
            options={accessGrantingStatus.map((status) => status)}
            handleChange={(value) => {
              setChanges({
                ...changes,
                'parecer.statusDoParecerDeAcesso': value,
              })
              setInfo({
                ...infoHolder,
                parecer: {
                  ...infoHolder.parecer,
                  statusDoParecerDeAcesso: value,
                },
              })
            }}
          />
          {infoHolder.parecer.statusDoParecerDeAcesso == 'PARECER DE ACESSO COM OBRAS' && (
            <NumberInput
              label={'QUANTOS DIAS DE OBRA?'}
              value={infoHolder.parecer?.qtdeDiasObraDeRede != undefined ? infoHolder.parecer?.qtdeDiasObraDeRede : 0}
              editable={editor}
              handleChange={(value) => {
                setChanges({
                  ...changes,
                  'parecer.qtdeDiasObraDeRede': Number(value),
                })
                setInfo({
                  ...infoHolder,
                  parecer: {
                    ...infoHolder.parecer,
                    qtdeDiasObraDeRede: Number(value),
                  },
                })
              }}
            />
          )}
          <DateInput
            label={'DATA DO PEDIDO DE VISTORIA'}
            editable={editor}
            value={
              infoHolder.vistoria?.dataPedido != undefined && infoHolder.vistoria?.dataPedido != '-'
                ? new Date(infoHolder.vistoria.dataPedido).toISOString().slice(0, 10)
                : 0
            }
            handleChange={(value) => {
              setChanges({
                ...changes,
                'vistoria.dataPedido': isNaN(value) ? new Date(value).toISOString() : null,
              })
              setInfo({
                ...infoHolder,
                vistoria: {
                  ...infoHolder.vistoria,
                  dataPedido: isNaN(value) ? new Date(value).toISOString() : null,
                },
              })
            }}
          />
          <SelectInput
            label={'STATUS DA VISTORIA'}
            value={infoHolder.vistoria?.status ? infoHolder.vistoria.status : 'NÃO DEFINIDO'}
            editable={editor}
            options={[
              { label: 'REALIZADA', value: 'REALIZADA' },
              {
                label: 'AGUARDANDO OBRA DE REDE',
                value: 'AGUARDANDO OBRA DE REDE',
              },
              {
                label: 'AGUARDANDO CONCESSIONARIA',
                value: 'AGUARDANDO CONCESSIONARIA',
              },
              { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
            ]}
            handleChange={(value) => {
              setChanges({
                ...changes,
                'vistoria.status': value,
              })
              setInfo({
                ...infoHolder,
                vistoria: {
                  ...infoHolder.vistoria,
                  status: value,
                },
              })
            }}
          />
          <DateInput
            label={'DATA TROCA DO MEDIDOR'}
            editable={editor}
            value={
              infoHolder.medidor?.data != undefined && infoHolder.medidor?.data != '-'
                ? new Date(infoHolder.medidor.data).toISOString().slice(0, 10)
                : 0
            }
            handleChange={(value) => {
              setChanges({
                ...changes,
                'medidor.data': isNaN(value) ? new Date(value).toISOString() : null,
              })
              setInfo({
                ...infoHolder,
                medidor: {
                  ...infoHolder.medidor,
                  data: isNaN(value) ? new Date(value).toISOString() : null,
                },
              })
            }}
          />
          <SelectInput
            label={'STATUS DA TROCA DO MEDIDOR'}
            value={infoHolder.medidor?.status ? infoHolder.medidor?.status : 'NÃO DEFINIDO'}
            editable={editor}
            options={[
              { label: 'REALIZADA', value: 'REALIZADA' },
              {
                label: 'AGUARDANDO OBRA DE REDE',
                value: 'AGUARDANDO OBRA DE REDE',
              },
              { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
            ]}
            handleChange={(value) => {
              setChanges({
                ...changes,
                'medidor.status': value,
              })
              setInfo({
                ...infoHolder,
                medidor: {
                  ...infoHolder.medidor,
                  status: value,
                },
              })
            }}
          />
          <div className="flex w-full justify-around items-center flex-wrap">
            <div className="flex flex-col w-[350px] items-center">
              <span className="uppercase font-bold font-raleway text-center text-sm">HOUVE REPROVA (PARECER) ?</span>
              <div className="flex">
                <input
                  disabled={!editor}
                  checked={infoHolder.parecer.parecerReprovado === 'SIM' ? true : false}
                  onChange={(e) => {
                    setChanges({
                      ...changes,
                      'parecer.parecerReprovado': e.target.checked ? 'SIM' : 'NÃO',
                    })
                    setInfo({
                      ...infoHolder,
                      parecer: {
                        ...infoHolder.parecer,
                        parecerReprovado: e.target.checked ? 'SIM' : 'NÃO',
                      },
                    })
                  }}
                  type="checkbox"
                  name="parecerReprovado"
                  id="parecerReprovado"
                />
                <label className="ml-2" htmlFor="parecerReprovado">
                  SIM
                </label>
              </div>
            </div>
            {infoHolder.parecer?.parecerReprovado == 'SIM' && (
              <NumberInput
                label={'QTDE DE REPROVAS'}
                value={infoHolder.parecer?.qtdeReprovas ? infoHolder.parecer?.qtdeReprovas : 0}
                editable={editor}
                handleChange={(value) => {
                  setChanges({
                    ...changes,
                    'parecer.qtdeReprovas': Number(value),
                  })
                  setInfo({
                    ...infoHolder,
                    parecer: {
                      ...infoHolder.parecer,
                      qtdeReprovas: Number(value),
                    },
                  })
                }}
              />
            )}
            {infoHolder.parecer.parecerReprovado == 'SIM' && (
              <div className="flex flex-col grow items-center">
                <span className="uppercase font-bold font-raleway text-center text-sm">MOTIVO DA REPROVA</span>
                <input
                  className={`text-xs w-full text-center uppercase text-gray-600 outline-none`}
                  value={infoHolder.parecer?.motivoReprova ? infoHolder.parecer.motivoReprova : ''}
                  readOnly={!editor}
                  placeholder={'Informação a preencher...'}
                  onChange={(e) => {
                    setChanges({
                      ...changes,
                      'parecer.motivoReprova': e.target.value,
                    })
                    setInfo({
                      ...infoHolder,
                      parecer: {
                        ...infoHolder.parecer,
                        motivoReprova: e.target.value,
                      },
                    })
                  }}
                  type="text"
                />
              </div>
            )}
          </div>
          <div className="flex w-full justify-around items-center flex-wrap">
            <div className="flex flex-col w-[350px] items-center">
              <span className="uppercase font-bold font-raleway text-center text-sm">HOUVE REPROVA (VISTORIA) ?</span>
              <div className="flex">
                <input
                  disabled={!editor}
                  checked={infoHolder.vistoria?.vistoriaReprovada === 'SIM' ? true : false}
                  onChange={(e) => {
                    setChanges({
                      ...changes,
                      'vistoria.vistoriaReprovada': e.target.checked ? 'SIM' : 'NÃO',
                    })
                    setInfo({
                      ...infoHolder,
                      vistoria: {
                        ...infoHolder.vistoria,
                        vistoriaReprovada: e.target.checked ? 'SIM' : 'NÃO',
                      },
                    })
                  }}
                  type="checkbox"
                  name="vistoriaReprovada"
                  id="vistoriaReprovada"
                />
                <label className="ml-2" htmlFor="vistoriaReprovada">
                  SIM
                </label>
              </div>
            </div>
            {infoHolder.vistoria.vistoriaReprovada == 'SIM' && (
              <NumberInput
                label={'QTDE DE REPROVAS'}
                value={infoHolder.vistoria.qtdeReprovas ? infoHolder.vistoria.qtdeReprovas : 0}
                editable={editor}
                handleChange={(value) => {
                  setChanges({
                    ...changes,
                    'vistoria.qtdeReprovas': Number(value),
                  })
                  setInfo({
                    ...infoHolder,
                    vistoria: {
                      ...infoHolder.vistoria,
                      qtdeReprovas: Number(value),
                    },
                  })
                }}
              />
            )}
            {infoHolder.vistoria.vistoriaReprovada == 'SIM' && (
              <div className="flex flex-col grow items-center">
                <span className="uppercase font-bold font-raleway text-center text-sm">MOTIVO DA REPROVA</span>
                <input
                  className={`text-xs w-full text-center uppercase text-gray-600 outline-none`}
                  value={infoHolder.vistoria?.motivoReprova ? infoHolder.vistoria?.motivoReprova : ''}
                  readOnly={!editor}
                  placeholder={'Informação a preencher...'}
                  onChange={(e) => {
                    setChanges({
                      ...changes,
                      'vistoria.motivoReprova': e.target.value,
                    })
                    setInfo({
                      ...infoHolder,
                      vistoria: {
                        ...infoHolder.vistoria,
                        motivoReprova: e.target.value,
                      },
                    })
                  }}
                  type="text"
                />
              </div>
            )}
            {infoHolder.vistoria.vistoriaReprovada == 'SIM' && (
              <div className="flex flex-col w-[350px] items-center">
                <span className="uppercase font-bold font-raleway text-center text-sm">EQUIPE DE CAMPO NECESSÁRIA</span>
                <div className="flex">
                  <input
                    disabled={!editor}
                    checked={infoHolder.vistoria.equipeDeCampoNecessaria === 'SIM' ? true : false}
                    onChange={(e) => {
                      setChanges({
                        ...changes,
                        'vistoria.equipeDeCampoNecessaria': e.target.checked ? 'SIM' : 'NÃO',
                      })
                      setInfo({
                        ...infoHolder,
                        vistoria: {
                          ...infoHolder.vistoria,
                          equipeDeCampoNecessaria: e.target.checked ? 'SIM' : 'NÃO',
                        },
                      })
                    }}
                    type="checkbox"
                    name="equipeDeCampoNecessaria"
                    id="equipeDeCampoNecessaria"
                  />
                  <label className="ml-2" htmlFor="equipeDeCampoNecessaria">
                    SIM
                  </label>
                </div>
              </div>
            )}
          </div>
          {infoHolder.parecer.statusDoParecerDeAcesso == 'PENDENCIAS' && (
            <div className="w-full flex justify-center mt-2 items-center">
              <div className="flex flex-col w-[450px] items-center">
                <span className="uppercase font-bold font-raleway text-center text-sm">PENDÊNCIAS DO PARECER</span>
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
                  className="w-full text-center h-[150px] bg-gray-200 resize-none p-2 outline-none border border-gray-600"
                />
              </div>
            </div>
          )}
          <div className="flex flex-col w-[350px] items-center">
            <span className="uppercase font-bold font-raleway text-center text-sm">PROJETO CONCLUÍDO</span>
            <div className="flex">
              <input
                disabled={!editor}
                checked={infoHolder.projeto?.projetoConcluido === 'SIM' ? true : false}
                onChange={(e) => {
                  setChanges({
                    ...changes,
                    'projeto.projetoConcluido': e.target.checked ? 'SIM' : 'NÃO',
                  })
                  setInfo({
                    ...infoHolder,
                    projeto: {
                      ...infoHolder.projeto,
                      projetoConcluido: e.target.checked ? 'SIM' : 'NÃO',
                    },
                  })
                }}
                type="checkbox"
                name="projetoconcluido"
                id="projetoconcluido"
              />
              <label className="ml-2" htmlFor="projetoconcluido">
                SIM
              </label>
            </div>
          </div>
        </div>
      ) : null}

      {infoHolder.vistoria?.vistoriaReprovada == 'SIM' && infoHolder.vistoria.equipeDeCampoNecessaria == 'SIM' && (
        <div className="flex flex-col  pb-2 shadow-lg">
          <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">ORDENS DE SERVIÇO</span>
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
    </div>
  )
}

export default InfoProjetoBlock
