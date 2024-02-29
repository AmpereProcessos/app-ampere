import React, { useContext, useEffect, useState } from 'react'
import { VscChromeClose } from 'react-icons/vsc'
import { cidadesAtendidas, cities, formatDate } from '../utils/constants'
import axios from 'axios'

import AnexoArquivo from './AnexoArquivo'
import dayjs from 'dayjs'
import AnimatedModalWrapper from './utils/AnimatedModalWrapper'
import SaveButton from './utils/Buttons/SaveButton'
import { FaSave } from 'react-icons/fa'
import OSCreationBlock from './OSCreationBlock'
import ProjectServiceOrders from './identificador/ordensDeServico/ProjectServiceOrders'
const MODAL_STYLES = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%,-50%)',
  backgroundColor: '#fff',
  minWidth: '40%',
  height: '87%',
  borderRadius: '10px',
  padding: '10px',
  zIndex: 1000,
}
const OVERLAY_STYLES = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,.7)',
  zIndex: 1000,
}
const statusStyles = {
  ABERTO: {
    textColor: 'text-yellow-500',
    borderColor: 'border-yellow-500',
  },
  PENDENTE: {
    textColor: 'text-red-400',
    borderColor: 'border-red-400',
  },
  'EM ANDAMENTO': {
    textColor: 'text-[#15599a]',
    borderColor: 'border-[#15599a]',
  },
  RESOLVIDO: {
    textColor: 'text-green-400',
    borderColor: 'border-green-400',
  },
}
function ModalCallSuporte({ setModalIsOpen, info, updateModalInfo, session, modalIsOpen }) {
  var ultAlteracoes = {
    anotAlteracoes: {
      usuario: info.ultAlteracoes?.anotAlteracoes ? info.ultAlteracoes?.anotAlteracoes.usuario : '',
      antes: info.ultAlteracoes?.anotAlteracoes ? info.ultAlteracoes?.anotAlteracoes.antes : '',
      depois: info.ultAlteracoes?.anotAlteracoes ? info.ultAlteracoes?.anotAlteracoes.depois : '',
      data: info.ultAlteracoes?.anotAlteracoes ? info.ultAlteracoes?.anotAlteracoes.data : '',
    },
    statusAlteracoes: {
      usuario: info.ultAlteracoes?.statusAlteracoes ? info.ultAlteracoes?.statusAlteracoes.usuario : '',
      antes: info.ultAlteracoes?.statusAlteracoes ? info.ultAlteracoes?.statusAlteracoes.antes : '',
      depois: info.ultAlteracoes?.statusAlteracoes ? info.ultAlteracoes?.statusAlteracoes.depois : '',
      data: info.ultAlteracoes?.statusAlteracoes ? info.ultAlteracoes?.statusAlteracoes.data : '',
    },
  }
  var selectableCities = cidadesAtendidas.filter((cidade) => cidade != info.cidade)
  const [infoHolder, setInfo] = useState(info)
  const [message, setMessage] = useState({ text: '', color: '' })
  const [osMessage, setOsMessage] = useState({ text: '', color: '' })

  function saveCallChanges() {
    if (info.statusChamado != infoHolder.statusChamado) {
      ultAlteracoes.statusAlteracoes.usuario = session?.id
      ultAlteracoes.statusAlteracoes.antes = info.statusChamado
      ultAlteracoes.statusAlteracoes.depois = infoHolder.statusChamado
      ultAlteracoes.statusAlteracoes.data = new Date().toJSON()
    }
    if (info.anotacoes != infoHolder.anotacoes) {
      ultAlteracoes.anotAlteracoes.usuario = session?.id
      ultAlteracoes.anotAlteracoes.antes = info.anotacoes
      ultAlteracoes.anotAlteracoes.depois = infoHolder.anotacoes
      ultAlteracoes.anotAlteracoes.data = new Date().toJSON()
    }
    axios
      .put('/api/chamados/suporte/updateSuporte', {
        ...infoHolder,
        ultAlteracoes: ultAlteracoes,
      })
      .then((res) => {
        setMessage({ text: res.data, color: 'text-green-500' })
        updateModalInfo(info._id)
      })
  }
  function closeCall() {
    if (info.anotacoes?.trim().length > 0) {
      if (info.statusChamado != 'RESOLVIDO') {
        ultAlteracoes.statusAlteracoes.usuario = session?.id
        ultAlteracoes.statusAlteracoes.antes = info.statusChamado
        ultAlteracoes.statusAlteracoes.depois = 'RESOLVIDO'
        ultAlteracoes.statusAlteracoes.data = new Date().toJSON()
      }
      axios
        .post('/api/chamados/suporte/updateSuporte', {
          ...infoHolder,
          fechamento: new Date(),
          statusChamado: 'RESOLVIDO',
          ultAlteracoes: ultAlteracoes,
        })
        .then((res) => {
          updateModalInfo(info._id)
        })
    } else {
      setMessage({
        text: 'Por favor, adicione anotações sobre o chamado pra prosseguir com a finalização.',
        color: 'text-red-500',
      })
    }
  }
  function reopenCall() {
    if (info.statusChamado != 'ABERTO') {
      ultAlteracoes.statusAlteracoes.usuario = session?.id
      ultAlteracoes.statusAlteracoes.antes = info.statusChamado
      ultAlteracoes.statusAlteracoes.depois = 'ABERTO'
      ultAlteracoes.statusAlteracoes.data = new Date().toJSON()
    }
    axios
      .post('/api/chamados/suporte/updateSuporte', {
        ...infoHolder,
        fechamento: '',
        statusChamado: 'ABERTO',
        ultAlteracoes: ultAlteracoes,
      })
      .then((res) => {
        updateModalInfo(info._id)
      })
  }
  async function addLinks(arr) {
    console.log('LINKS', arr)
    setInfo({
      ...infoHolder,
      links: arr,
    })
    await axios
      .put('/api/chamados/suporte/updateSuporte', {
        ...infoHolder,
        links: arr,
      })
      .then(() => {
        setMessage({ text: 'Link adicionado', color: 'text-green-500' })
        updateModalInfo(info._id)
      })
  }
  useEffect(() => {
    setMessage({ text: '', color: '' })
  }, [infoHolder])

  return (
    <>
      <AnimatedModalWrapper modalIsOpen={modalIsOpen} width={'47%'} height={'80%'}>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-gray-200 px-2 pb-2 text-lg">
            <div className="flex flex-col items-center">
              <h1 className="pl-6 font-bold uppercase text-[#15599a]">
                {info.tipoChamado} {info.equipamento && `- ${info.equipamento}`}
              </h1>
              <p className="text-xs text-gray-500">{info._id}</p>
            </div>

            {info.demanda && <span className="border border-gray-200 p-2 text-xs font-bold text-gray-600">DEMANDA {info.demanda}</span>}
            <button>
              <VscChromeClose
                onClick={() => {
                  setMessage({ text: '', color: '' })
                  setModalIsOpen(false)
                }}
                style={{ color: 'red' }}
              />
            </button>
          </div>
          <p className="mt-2 text-center text-xs italic text-gray-700">
            {info.fechamento
              ? `${dayjs(dayjs(info.fechamento)).diff(dayjs(info.abertura), 'hours')} horas até fechamento`
              : `${dayjs().diff(dayjs(info.abertura), 'hours')} horas em aberto`}
          </p>
          <div className="overscroll-y overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
            {session?.permissoes.rotas.includes('Pós-Venda') && info.fechamento ? (
              <div className="mt-4 flex flex-col items-center gap-x-2 border border-gray-200 p-2 lg:flex-row">
                <span className="text-center font-raleway font-bold">COLETA DE FEEDBACK</span>
                <input
                  value={infoHolder.feedbackValor ? infoHolder.feedbackValor : ''}
                  onChange={(e) =>
                    setInfo({
                      ...infoHolder,
                      feedbackValor: Number(e.target.value),
                    })
                  }
                  className="grow text-center text-sm outline-none placeholder:italic"
                  type="number"
                  max={10}
                  min={0}
                />
              </div>
            ) : (
              false
            )}
            <div className="mt-4 flex flex-col items-center gap-x-2 border border-gray-200 p-2 lg:flex-row">
              <span className="font-raleway font-bold">STATUS</span>
              <div className="flex grow justify-center gap-x-2">
                {info.statusChamado == 'ABERTO' ? (
                  <>
                    <p
                      onClick={() => setInfo({ ...infoHolder, statusChamado: 'ABERTO' })}
                      className={`${
                        infoHolder.statusChamado != 'ABERTO' && 'opacity-30'
                      } w-fit cursor-pointer rounded-lg border p-3 text-center text-xs font-bold ${
                        info && statusStyles[info?.statusChamado].textColor
                      } ${info && statusStyles[info.statusChamado].borderColor}`}
                    >
                      {info?.statusChamado}
                    </p>
                    <p
                      onClick={() =>
                        setInfo({
                          ...infoHolder,
                          statusChamado: 'EM ANDAMENTO',
                        })
                      }
                      className={`${
                        infoHolder.statusChamado != 'EM ANDAMENTO' && 'opacity-30'
                      } w-fit cursor-pointer rounded-lg border p-3 text-center text-xs font-bold hover:opacity-100 ${
                        statusStyles['EM ANDAMENTO'].textColor
                      } ${statusStyles['EM ANDAMENTO'].borderColor}`}
                    >
                      EM ANDAMENTO
                    </p>
                  </>
                ) : (
                  <p
                    className={`w-fit rounded-lg border p-3 text-center text-xs font-bold hover:opacity-100 ${
                      statusStyles[info.statusChamado].textColor
                    } ${statusStyles[info.statusChamado].borderColor}`}
                  >
                    {info.statusChamado}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-4 flex flex-col items-center gap-x-2 border border-gray-200 p-2 lg:flex-row">
              <span className="text-center font-raleway font-bold">NOME DO CLIENTE</span>
              <p className="grow text-center font-raleway">{info.nomeCliente ? info.nomeCliente : '-'}</p>
            </div>
            <div className="mt-4 flex flex-col items-center gap-x-2 border border-gray-200 p-2 lg:flex-row">
              <span className="text-center font-raleway font-bold">NOME DA USINA</span>
              <p className="grow text-center font-raleway">{info.nomeUsina ? info.nomeUsina : '-'}</p>
            </div>
            {info.tipoChamado == 'DEFEITOS E GARANTIA' && (
              <div className="mt-4 flex flex-col gap-x-2 border border-gray-200 p-2 lg:flex-row">
                <span className="text-center font-bold uppercase">EQUIPAMENTO DEFEITUOSO</span>
                <select
                  value={infoHolder.equipamento ? infoHolder.equipamento : 'NÃO DEFINIDO'}
                  onChange={(e) =>
                    setInfo({
                      ...infoHolder,
                      equipamento: e.target.value,
                    })
                  }
                  className="mt-2 grow text-center text-xs outline-none lg:mt-0"
                >
                  <option value={'NÃO DEFINIDO'}>NÃO DEFINIDO</option>
                  <option value={'PLACA'}>PLACA</option>
                  <option value={'INVERSOR/MICRO'}>INVERSOR/MICRO</option>
                  <option value={'COMUNICADOR'}>COMUNICADOR</option>
                </select>
              </div>
            )}
            <div className="mt-4 flex flex-col gap-x-2 border border-gray-200 p-2 lg:flex-row">
              <span className="text-center font-bold uppercase">EQUIPE RESPONSÁVEL</span>
              <p className="grow text-center text-sm">{info.equipeResp ? info.equipeResp : '-'}</p>
            </div>
            {!['PROBLEMAS COM CONCESSIONÁRIA', 'GOTEIRA', 'DISTRIBUIÇÃO DE CRÉDITOS', 'RETRABALHO EM ESTRUTURA'].includes(info.tipoChamado) && (
              <div className="mt-4 flex flex-col gap-x-2 border border-gray-200 p-2 lg:flex-row">
                <span className="text-center font-bold uppercase">LINK DA PLANTA</span>
                <input
                  value={infoHolder.linkMonitoramento}
                  onChange={(e) =>
                    setInfo({
                      ...infoHolder,
                      linkMonitoramento: e.target.value,
                    })
                  }
                  className="grow text-center text-sm outline-none placeholder:italic"
                  type="text"
                />
              </div>
            )}
            <div className="mt-4 flex justify-center">
              <a href={infoHolder.linkMonitoramento} className="grow text-center text-sm text-blue-400">
                {infoHolder.linkMonitoramento ? infoHolder.linkMonitoramento : '-'}
              </a>
            </div>

            <div className="mt-4 flex flex-col items-center gap-x-2 border border-gray-200 p-2 lg:flex-row">
              <span className="text-center font-raleway font-bold">ABERTURA</span>
              <p className="grow text-center font-raleway">{new Date(info.abertura).toLocaleString()}</p>
            </div>
            {info.fechamento && (
              <div className="mt-4 flex flex-col items-center gap-x-2 border border-gray-200 p-2 lg:flex-row">
                <span className="text-center font-raleway font-bold">FECHAMENTO</span>
                <p className="grow text-center font-raleway">{new Date(info.fechamento).toLocaleString()}</p>
              </div>
            )}
            <div className="mt-4 flex flex-col items-center gap-x-2 border border-gray-200 p-2 lg:flex-row">
              <span className="text-center font-raleway font-bold">CIDADE</span>
              <select
                value={infoHolder.cidade}
                onChange={(e) => setInfo({ ...infoHolder, cidade: e.target.value })}
                className="mt-2 grow text-center text-xs outline-none lg:mt-0"
              >
                {info.cidade && <option value={info.cidade}>{info.cidade}</option>}
                {selectableCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
                <option value={'A DEFINIR'}>A DEFINIR</option>
              </select>
            </div>
            <div className="mt-4 flex flex-col gap-x-2 border border-gray-200 p-2 lg:flex-row">
              <span className="text-center font-bold">RESPONSÁVEL</span>
              <select
                value={infoHolder.responsavel}
                onChange={(e) => setInfo({ ...infoHolder, responsavel: e.target.value })}
                className="mt-2 grow text-center text-xs outline-none lg:mt-0"
              >
                <option value={'A DEFINIR'}>A DEFINIR</option>
                <option value={'GABRIEL MARTINS'}>GABRIEL MARTINS</option>
                <option value={'MARCOS DIAS'}>MARCOS DIAS</option>
                <option value={'PÓS-VENDA'}>PÓS-VENDA</option>
              </select>
            </div>
            <div className="mt-4 flex flex-col items-center justify-center gap-x-2 border border-gray-200 p-2 lg:flex-row">
              <span className="text-center font-bold">O.S GERADA?</span>
              <input
                checked={infoHolder.osGerada}
                onChange={(e) => setInfo({ ...infoHolder, osGerada: e.target.checked })}
                type={'checkbox'}
                className={'ml-2'}
              />
            </div>

            <div className="mt-4 flex flex-col gap-x-2 border border-gray-200 p-2">
              <span className="text-center font-raleway font-bold">DESCRIÇÃO DO PROBLEMA</span>
              <span className="grow bg-gray-100 p-4 text-center font-raleway text-sm italic">
                {info.descricaoProblema ? info.descricaoProblema : ''}
              </span>
            </div>
            {info.tipoChamado.includes('GARANTIA') && (
              <>
                <div className="mt-4 flex flex-col gap-1 border border-gray-200 p-2">
                  <span className="text-center font-raleway font-bold">ÚLTIMA ATUALIZAÇÃO DO CLIENTE</span>
                  <input
                    value={infoHolder.ultAtualizacaoCliente ? formatDate(infoHolder.ultAtualizacaoCliente) : null}
                    onChange={(e) =>
                      setInfo({
                        ...infoHolder,
                        ultAtualizacaoCliente: new Date(e.target.value).toISOString(),
                      })
                    }
                    type={'date'}
                    className="grow text-center font-raleway outline-none"
                  />
                </div>
                <div className="mt-4 flex flex-col gap-1 border border-gray-200 p-2">
                  <span className="text-center font-raleway font-bold">STATUS DA GARANTIA</span>
                  <select
                    value={infoHolder.statusGarantia ? infoHolder.statusGarantia : 'NÃO DEFINIDO'}
                    onChange={(e) =>
                      setInfo({
                        ...infoHolder,
                        statusGarantia: e.target.value,
                      })
                    }
                    className="mt-2 grow text-center text-xs outline-none lg:mt-0"
                  >
                    <option value={'IDENTIFICAÇÃO E TESTES'}>IDENTIFICAÇÃO E TESTES</option>
                    <option value={'EM PROCESSO DE APROVAÇÃO'}>EM PROCESSO DE APROVAÇÃO</option>
                    <option value={'APROVADO'}>APROVADO</option>
                    <option value={'EQUIPAMENTO EM ROTA'}>EQUIPAMENTO EM ROTA</option>
                    <option value={'ENTREGUE'}>ENTREGUE</option>
                    <option value={'INSTALADO'}>INSTALADO</option>
                    <option value={'NÃO DEFINIDO'}>NÃO DEFINIDO</option>
                  </select>
                </div>
              </>
            )}
            <div className="mt-4 flex flex-col gap-x-2 border border-gray-200 p-2">
              <span className="text-center font-raleway font-bold">ANOTAÇÕES</span>
              <textarea
                value={infoHolder.anotacoes ? infoHolder.anotacoes : ''}
                onChange={(e) => setInfo({ ...infoHolder, anotacoes: e.target.value })}
                placeholder="Digite aqui as anotações do chamado"
                className="mt-1 h-fit min-h-[175px] grow resize-none rounded bg-gray-100 p-3 text-center text-sm outline-none placeholder:italic"
              />
            </div>
            {info.tipoChamado == 'GOTEIRA' || info.tipoChamado == 'DEFEITOS E GARANTIA' ? (
              <div className="flex flex-col">
                <h1 className="my-2 text-center font-bold text-[#15599a]">ADIÇÃO DE IMAGENS</h1>
                <AnexoArquivo
                  id={infoHolder.idPai}
                  prevLinks={infoHolder.links ? { chamadosSuporte: infoHolder.links } : {}}
                  client={infoHolder.nomeCliente ? `${infoHolder.nomeCliente}` : `${infoHolder.nomeUsina}`}
                  categories={[
                    {
                      label: 'CHAMADOS DE SUPORTE',
                      value: 'links.chamadosSuporte',
                    },
                  ]}
                  multiple={false}
                  handleUpdates={(_, obj) => addLinks(obj)}
                />
                {/* <AnexoArquivo
                  id={infoHolder.idPai}
                  prevLinks={
                    infoHolder.links
                      ? { chamadosSuporte: infoHolder.links }
                      : {}
                  }
                  cliente={
                    infoHolder.nomeCliente
                      ? `${infoHolder.nomeCliente}`
                      : `${infoHolder.nomeUsina}`
                  }
                  categorias={[
                    {
                      label: "CHAMADOS DE SUPORTE",
                      value: "links.chamadosSuporte",
                    },
                  ]}
                  multiple={false}
                  handleUpdates={(_, obj) => addLinks(obj)}
                /> */}
                {infoHolder.links?.length > 0 && (
                  <div className="flex flex-col">
                    <h1 className="text-center font-bold">IMAGENS ANEXADAS</h1>
                    <div className="flex flex-col items-center gap-1">
                      {infoHolder.links.map((obj, index2) => (
                        <a className="text-center text-xs font-bold text-[#15599a]" key={index2} href={obj.link}>
                          {obj.title} ({obj.format})
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              false
            )}
            {info.idPai ? (
              <div className="mt-2 flex w-full flex-col gap-2">
                <h1 className="w-full rounded-md bg-gray-800 p-2 text-center font-medium text-white">ORDENS DE SERVIÇO</h1>
                <OSCreationBlock
                  project={{ _id: info.idPai }}
                  categories={[
                    {
                      label: 'MANUTENÇÃO PREVENTIVA',
                      value: 'MANUTENÇÃO PREVENTIVA',
                    },
                    {
                      label: 'MANUTENÇÃO CORRETIVA',
                      value: 'MANUTENÇÃO CORRETIVA',
                    },
                    {
                      label: 'OUTROS',
                      value: 'OUTROS',
                    },
                    {
                      label: 'NÃO DEFINIDO',
                      value: 'NÃO DEFINIDO',
                    },
                  ]}
                />
                <ProjectServiceOrders projectId={info.idPai} />
              </div>
            ) : null}
            {info.statusChamado == 'RESOLVIDO' ? (
              <div className="text-center">
                <button onClick={reopenCall} className="mt-4 rounded-lg bg-yellow-400 p-3 font-raleway font-bold hover:bg-[#f18701] hover:text-white">
                  REABRIR CHAMADO
                </button>
              </div>
            ) : (
              <div className="text-center">
                <button onClick={closeCall} className="mt-4 rounded-lg bg-green-400 p-3 font-raleway font-bold hover:bg-[#06d6a0] hover:text-white">
                  FINALIZAR CHAMADO
                </button>
              </div>
            )}
            {message.text && <p className={`text-center ${message.color} mt-2 italic`}>{message.text}</p>}
            <div className="mt-2 flex items-center justify-center">
              <SaveButton text={'SALVAR'} icon={<FaSave />} handleClick={saveCallChanges} />
            </div>
          </div>
        </div>
      </AnimatedModalWrapper>
    </>
  )
}

export default ModalCallSuporte
