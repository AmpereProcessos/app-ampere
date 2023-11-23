import React, { useEffect, useState } from 'react'
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
import { useQueryClient } from 'react-query'
import { useClientById } from '../utils/methods/query/clients'
import LoadingPage from './utils/LoadingPage'
import ErrorPage from './utils/ErrorPage'
import { useMutationWithFeedback } from '../utils/methods/mutation/general-hook'
import { updateProject } from '../utils/methods/mutation/clients'
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
function ModalProjetos({ projectId, modalIsOpen, closeModal, handleUpdates }) {
  useKey('Escape', () => closeModal())
  const queryClient = useQueryClient()
  const { data: project, isLoading, isSuccess, isError } = useClientById({ id: projectId, enabled: !!projectId })
  const [infoHolder, setInfo] = useState(project)
  const [changes, setChanges] = useState({})
  const { mutate } = useMutationWithFeedback({
    mutationKey: ['update-project'],
    mutationFn: updateProject,
    affectedQueryKey: ['engineering-projects'],
    queryClient: queryClient,
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
    mutate({ id: projectId, changes: changes })
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
  useEffect(() => {
    // if (project?.idVisitaTecnica?.trim().length > 10) {
    //   getVisitaInfo(project.idVisitaTecnica)
    // }
    setInfo(project)
  }, [project])
  return (
    <>
      <AnimatedModalWrapper modalIsOpen={modalIsOpen}>
        <div className="flex h-full flex-col overflow-y-auto overscroll-y-auto">
          <div className="flex flex-col items-center justify-between border-b border-gray-200 px-2 pb-2 text-lg lg:flex-row">
            <div className="flex items-center gap-2">
              <h1 className="pl-6 font-bold text-[#15599a]">{project ? `${project.qtde} - ${project.nomeDoContrato}` : 'CARREGANDO...'}</h1>
              {project?.codigoSVB && <p className="text-sm font-bold text-gray-600">#{project.codigoSVB}</p>}
              {project?.parecer.dataParecerDeAcesso != undefined && project?.vistoria.status != 'REALIZADA' && (
                <div
                  className={`p-1 text-center text-xs font-bold italic ${
                    getParecerWarning(new Date(project?.parecer.dataParecerDeAcesso), new Date()).style
                  }`}
                >
                  {getParecerWarning(new Date(project?.parecer.dataParecerDeAcesso), new Date()).text}
                </div>
              )}
            </div>
            <div className="flex items-center gap-x-2">
              <p className={`hidden text-sm italic text-green-500 lg:block`}>{msg}</p>
              <SaveButton text={'Salvar alterações'} icon={<FaSave />} handleClick={handleChanges} />
              <button>
                <VscChromeClose onClick={() => closeModal()} style={{ color: 'red' }} />
              </button>
            </div>
            <p className={`block text-sm italic text-green-500 lg:hidden`}>{msg}</p>
          </div>
          {isLoading ? <LoadingPage /> : null}
          {isError ? <ErrorPage msg={'Erro ao carregar informações do projeto. Tente novamente.'} /> : null}
          {isSuccess && infoHolder ? (
            <div className="overscroll-y flex h-full flex-col gap-y-2 overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
              <NotificationCreationBlock nomeDoProjeto={project.nomeDoContrato} codProjeto={project.qtde} />
              <InfoAtividadesBlock projectId={projectId} projectName={project.nomeDoContrato} projectIdentifier={project.qtde} session={session} />
              <InfoClienteBlock
                editor={false}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                project={project}
              />
              {!['BOMBA SOLAR', 'SISTEMA FOTOVOLTAICO (OFF GRID)'].includes(infoHolder.tipoDeServico) && (
                <InfoDadosConcessionariaBlock editor={true} infoHolder={infoHolder} setInfo={setInfo} changes={changes} setChanges={setChanges} />
              )}
              <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
                <span className="py-2 text-center text-sm font-bold uppercase text-[#15599a]">COMISSIONAMENTO</span>
                <div className="flex flex-wrap justify-center gap-2">
                  <div className="flex w-[350px] flex-col items-center">
                    <span className="text-center font-raleway text-sm font-bold uppercase">COMISSIONAMENTO COMERCIAL</span>
                    <div className="flex">
                      <input
                        disabled={true}
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
                  <div className="flex w-[350px] flex-col items-center">
                    <span className="text-center font-raleway text-sm font-bold uppercase">COMISSIONAMENTO DE SUPRIMENTOS</span>
                    <div className="flex">
                      <input
                        disabled={true}
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
                  <div className="flex w-[350px] flex-col items-center">
                    <span className="text-center font-raleway text-sm font-bold uppercase">COMISSIONAMENTO PROJETOS</span>
                    <div className="flex">
                      <input
                        disabled={!false}
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
              <InfoVisitaTecnicaBlock
                editor={false}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                analysisId={project.idVisitaTecnica}
              />
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
                  editor={true}
                  project={project}
                  comercialEditionOnly={true}
                  infoHolder={infoHolder}
                  setInfo={setInfo}
                  changes={changes}
                  setChanges={setChanges}
                  showDeliveryInfoOnly={false}
                  showMonetaryValues={true}
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
          ) : null}
        </div>
      </AnimatedModalWrapper>
    </>
  )
}

export default ModalProjetos
