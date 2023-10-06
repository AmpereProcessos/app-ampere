import React, { useState } from 'react'
import { equipesTecnicas, projetistas, vendedores } from '../utils/constants'
import axios from 'axios'
import { FaSave } from 'react-icons/fa'
import { VscChromeClose } from 'react-icons/vsc'
import NotificationCreationBlock from './NotificationCreationBlock'
import AnimatedModalWrapper from './utils/AnimatedModalWrapper'
import { useKey } from '../utils/hooks'
import InfoPadraoBlock from './blocosInfoProjeto/InfoPadraoBlock'
import InfoSistemaBlock from './blocosInfoProjeto/InfoSistemaBlock'
import InfoCompraBlock from './blocosInfoProjeto/InfoCompraBlock'
import InfoVisitaTecnicaBlock from './blocosInfoProjeto/InfoVisitaTecnicaBlock'
import InfoClienteBlock from './blocosInfoProjeto/InfoClienteBlock'
import InfoDadosConcessionariaBlock from './blocosInfoProjeto/InfoDadosConcessionariaBlock'
import InfoArquivosBlock from './blocosInfoProjeto/InfoArquivosBlock'
import InfoProjetoBlock from './blocosInfoProjeto/InfoProjetoBlock'
import InfoObrasBlock from './blocosInfoProjeto/InfoObrasBlock'
import InfoMaterialBlock from './blocosInfoProjeto/InfoMaterialBlock'
import SaveButton from './utils/Buttons/SaveButton'
const MODAL_STYLES = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%,-50%)',
  backgroundColor: '#fff',
  width: '93%',
  height: '98%',
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
function formataCPF(cpf) {
  //retira os caracteres indesejados...
  cpf = cpf.replace(/[^\d]/g, '')
  //realizar a formatação...
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}
function formataCEP(cep) {
  cep = cep
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{3})\d+?$/, '$1')

  return cep
}
function ModalProjetos({ setModalIsOpen, modalIsOpen, project, editor, handleUpdates, credentials }) {
  useKey('Escape', () => setModalIsOpen(false))

  const [infoHolder, setInfo] = useState(project)
  const [changes, setChanges] = useState({})
  const [osInfo, setOsInfo] = useState({
    servicoExecutado: '',
    realizarCobranca: false,
    valorCobranca: 0,
    usuarioEmissor: '',
    grauDeUrgencia: 'NÃO DEFINIDO',
    dataDeAbertura: new Date(),
  })
  const [osMsg, setOsMsg] = useState({
    text: '',
    color: 'text-red-500',
  })
  const [msg, setMsg] = useState('')

  async function notifyAccessGrantingApproval() {
    const notifyObj = {
      destinatario: '64638b6c2071c508968bdf08',
      remetente: 'SISTEMA',
      mensagem: `Parecer de acesso aprovado.`,
      projetoReferencia: infoHolder.qtde,
      nomeDoProjeto: infoHolder.nomeDoContrato,
    }
    await axios.post('/api/notificacoes/1', notifyObj)
    return
  }

  async function handleChanges() {
    const previousStatus = project.parecer.statusDoParecerDeAcesso
    const newStatus = infoHolder.parecer.statusDoParecerDeAcesso
    if (previousStatus != 'PARECER DE ACESSO APROVADO' && newStatus == 'PARECER DE ACESSO APROVADO') {
      notifyAccessGrantingApproval()
    }
    axios.post(`/api/projects/update/${project._id}`, changes).then((res) => {
      setMsg('Alterações feitas')
      handleUpdates(project._id)
    })
  }

  function getParecerWarning(date1, date2) {
    var timeDiff = Math.abs(date2.getTime() - date1.getTime())
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24))
    if (diffDays > 110) {
      return {
        text: 'PARECER COM >110 DIAS',
        style: 'text-red-600 border-2 border-red-600',
      }
    } else if (diffDays > 105) {
      return {
        text: 'PARECER COM >105 DIAS',
        style: 'text-orange-300 border-2 border-orange-300',
      }
    } else if (diffDays > 90) {
      return {
        text: 'PARECER COM >90 DIAS',
        style: 'text-blue-300 border-2 border-blue-300',
      }
    } else {
      return 'border border-gray-200'
    }
  }

  return (
    <>
      <AnimatedModalWrapper modalIsOpen={modalIsOpen}>
        <div className="flex flex-col h-full overflow-y-auto overscroll-y-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between px-2 text-lg pb-2 border-b border-gray-200">
            <div className="flex gap-2 items-center">
              <h1 className="text-[#15599a] pl-6 text-center font-bold">
                {infoHolder.qtde} - {infoHolder.nomeDoContrato}
              </h1>
              {infoHolder.codigoSVB && <p className="text-gray-600 text-sm font-bold">#{infoHolder.codigoSVB}</p>}
              {infoHolder.parecer.dataParecerDeAcesso != undefined && infoHolder.vistoria.status != 'REALIZADA' && (
                <div
                  className={`p-1 text-xs text-center font-bold italic ${
                    getParecerWarning(new Date(infoHolder.parecer.dataParecerDeAcesso), new Date()).style
                  }`}
                >
                  {getParecerWarning(new Date(infoHolder.parecer.dataParecerDeAcesso), new Date()).text}
                </div>
              )}
            </div>
            <div className="flex gap-x-2 items-center">
              <p className={`hidden lg:block text-sm italic text-green-500`}>{msg}</p>
              <SaveButton text={'Salvar alterações'} icon={<FaSave />} handleClick={handleChanges} />
              <button>
                <VscChromeClose onClick={() => setModalIsOpen(false)} style={{ color: 'red' }} />
              </button>
            </div>
            <p className={`block lg:hidden text-sm italic text-green-500`}>{msg}</p>
          </div>
          <div className="flex flex-col gap-y-2 h-full overflow-y-auto overscroll-y-auto">
            <NotificationCreationBlock nomeDoProjeto={project.nomeDoContrato} codProjeto={project.qtde} />

            <InfoClienteBlock editor={false} infoHolder={infoHolder} setInfo={setInfo} changes={changes} setChanges={setChanges} project={project} />
            {!['BOMBA SOLAR', 'SISTEMA FOTOVOLTAICO (OFF GRID)'].includes(infoHolder.tipoDeServico) && (
              <InfoDadosConcessionariaBlock editor={true} infoHolder={infoHolder} setInfo={setInfo} changes={changes} setChanges={setChanges} />
            )}
            <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
              <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">COMISSIONAMENTO</span>
              <div className="flex gap-2 justify-center flex-wrap">
                <div className="flex flex-col w-[350px] items-center">
                  <span className="uppercase font-bold font-raleway text-center text-sm">COMISSIONAMENTO COMERCIAL</span>
                  <div className="flex">
                    <input
                      disabled={!editor}
                      checked={infoHolder.comissionamento?.comercial ? true : false}
                      onChange={(e) => {
                        setChanges({
                          ...changes,
                          'comissionamento.comercial': e.target.checked,
                        })
                        setInfo({
                          ...infoHolder,
                          comissionamento: {
                            ...infoHolder.comissionamento,
                            comercial: e.target.checked,
                          },
                        })
                      }}
                      type="checkbox"
                      name="comissionamentoComercial"
                      id="comissionamentoComercial"
                    />
                    <label className="ml-2" htmlFor="comissionamentoComercial">
                      OK
                    </label>
                  </div>
                </div>
                <div className="flex flex-col w-[350px] items-center">
                  <span className="uppercase font-bold font-raleway text-center text-sm">COMISSIONAMENTO DE SUPRIMENTOS</span>
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
                <div className="flex flex-col w-[350px] items-center">
                  <span className="uppercase font-bold font-raleway text-center text-sm">COMISSIONAMENTO PROJETOS</span>
                  <div className="flex">
                    <input
                      disabled={!editor}
                      checked={infoHolder.comissionamento?.projetos ? true : false}
                      onChange={(e) => {
                        setChanges({
                          ...changes,
                          'comissionamento.projetos': e.target.checked,
                        })
                        setInfo({
                          ...infoHolder,
                          comissionamento: {
                            ...infoHolder.comissionamento,
                            projetos: e.target.checked,
                          },
                        })
                      }}
                      type="checkbox"
                      name="comissionamentoProjetos"
                      id="comissionamentoProjetos"
                    />
                    <label className="ml-2" htmlFor="comissionamentoProjetos">
                      OK
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <InfoVisitaTecnicaBlock editor={true} infoHolder={infoHolder} setInfo={setInfo} changes={changes} setChanges={setChanges} />
            {!['OPERAÇÃO E MANUTENÇÃO', 'BOMBA SOLAR', 'SISTEMA FOTOVOLTAICO (OFF GRID)'].includes(infoHolder.tipoDeServico) && (
              <InfoPadraoBlock
                comercialEdition={true}
                technicalEdition={true}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                showPaymentInfo={false}
              />
            )}
            <InfoSistemaBlock
              editor={true}
              infoHolder={infoHolder}
              setInfo={setInfo}
              changes={changes}
              setChanges={setChanges}
              showPaymentInfo={true}
            />
            {infoHolder.tipoDeServico != 'MONTAGEM E DESMONTAGEM' && (
              <InfoCompraBlock
                editor={false}
                project={project}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                showDeliveryInfoOnly={true}
                showMonetaryValues={false}
              />
            )}
            <InfoProjetoBlock
              editor={true}
              infoHolder={infoHolder}
              setInfo={setInfo}
              changes={changes}
              setChanges={setChanges}
              handleUpdates={handleUpdates}
              project={project}
            />
            <InfoObrasBlock editor={true} infoHolder={infoHolder} setInfo={setInfo} changes={changes} setChanges={setChanges} project={project} />
            <InfoMaterialBlock
              editor={false}
              infoHolder={infoHolder}
              setInfo={setInfo}
              changes={changes}
              setChanges={setChanges}
              project={project}
              showCircuitBreakers={true}
              circuitBreakerAddition={true}
            />
            <InfoArquivosBlock
              project={project}
              infoHolder={infoHolder}
              categories={[
                { label: 'DOCUMENTOS', value: 'links.documentos' },
                { label: 'PROJETOS', value: 'links.projetos' },
                { label: 'OBRAS', value: 'links.obras' },
                { label: 'VISITA TÉCNICA', value: 'links.visitaTecnica' },
              ]}
              handleUpdates={handleUpdates}
            />
          </div>
        </div>
      </AnimatedModalWrapper>
    </>
  )
}

export default ModalProjetos
