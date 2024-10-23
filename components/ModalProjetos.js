import React, { useEffect, useState } from 'react'
import { equipesTecnicas, projetistas, vendedores } from '../utils/constants'
import axios from 'axios'
import { FaSave } from 'react-icons/fa'
import { VscChromeClose } from 'react-icons/vsc'
import NotificationCreationBlock from './NotificationCreationBlock'
import AnimatedModalWrapper from './utils/AnimatedModalWrapper'
import { useKey } from '../utils/hooks'

// TESTING
import InfoHomologacaoBlock from './blocosInfoProjeto/InfoHomologacaoBlock'
// TESTING
import InfoAtividadesBlock from './blocosInfoProjeto/InfoAtividadesBlock'
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
import { useQueryClient } from '@tanstack/react-query'
import { useClientById } from '../utils/methods/query/clients'
import LoadingPage from './utils/LoadingPage'
import ErrorPage from './utils/ErrorPage'
import { useMutationWithFeedback } from '../utils/methods/mutation/general-hook'
import { updateProject } from '../utils/methods/mutation/clients'
import { useSession } from 'next-auth/react'
import { handleEngineeringUpdate } from '../utils/methods/mutation/engineering'
import { useProjectUpdateLogs } from '../utils/methods/query/project-update-logs'
import { getErrorMessage } from '../utils/methods/handlers'

function ModalProjetos({ projectId, modalIsOpen, closeModal }) {
  useKey('Escape', () => closeModal())
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const { data: project, isLoading, isSuccess, isError, error } = useClientById({ id: projectId, enabled: !!projectId })
  const { data: updateLogs } = useProjectUpdateLogs({ projectId })
  const [infoHolder, setInfo] = useState(project)
  const [changes, setChanges] = useState({})

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

  const { mutate: updateProject } = useMutationWithFeedback({
    mutationKey: ['update-project'],
    mutationFn: handleEngineeringUpdate,
    affectedQueryKey: ['project-by-id', projectId],
    queryClient: queryClient,
    callbackFn: async () => {
      setChanges({})
      await queryClient.invalidateQueries({ queryKey: ['engineering-projects'] })
    },
  })

  const errorMsg = getErrorMessage(error)
  useEffect(() => {
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
              {!!project?.homologacao.acesso.dataResposta && !project?.homologacao.vistoria.dataEfetivacao && (
                <div
                  className={`p-1 text-center text-xs font-bold italic ${
                    getParecerWarning(new Date(project?.homologacao.acesso.dataResposta), new Date()).style
                  }`}
                >
                  {getParecerWarning(new Date(project?.homologacao.acesso.dataResposta), new Date()).text}
                </div>
              )}
            </div>
            <div className="flex items-center gap-x-2">
              <SaveButton
                text={'Salvar alterações'}
                icon={<FaSave />}
                handleClick={() => updateProject({ previousData: project, newData: infoHolder, changes: changes, queryClient: queryClient })}
              />
              <button>
                <VscChromeClose onClick={() => closeModal()} style={{ color: 'red' }} />
              </button>
            </div>
          </div>
          {isLoading ? <LoadingPage /> : null}
          {isError ? <ErrorPage msg={errorMsg} /> : null}
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
                updateLogs={updateLogs || []}
              />
              {/* {!['BOMBA SOLAR', 'SISTEMA FOTOVOLTAICO (OFF GRID)'].includes(infoHolder.tipoDeServico) && (
                <InfoDadosConcessionariaBlock
                  editor={true}
                  infoHolder={infoHolder}
                  setInfo={setInfo}
                  changes={changes}
                  setChanges={setChanges}
                  updateLogs={updateLogs || []}
                />
              )} */}
              <InfoHomologacaoBlock session={session} infoHolder={infoHolder} setInfo={setInfo} changes={changes} setChanges={setChanges} />
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
                updateLogs={updateLogs || []}
                analysisId={project.idVisitaTecnica}
                session={session}
              />
              {!['OPERAÇÃO E MANUTENÇÃO', 'BOMBA SOLAR', 'SISTEMA FOTOVOLTAICO (OFF GRID)'].includes(infoHolder.tipoDeServico) && (
                <InfoPadraoBlock
                  comercialEdition={true}
                  technicalEdition={true}
                  infoHolder={infoHolder}
                  setInfo={setInfo}
                  changes={changes}
                  setChanges={setChanges}
                  updateLogs={updateLogs || []}
                  showPaymentInfo={false}
                />
              )}
              <InfoSistemaBlock
                editor={true}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                updateLogs={updateLogs || []}
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
                  updateLogs={updateLogs || []}
                  showDeliveryInfoOnly={false}
                  showMonetaryValues={true}
                />
              )}
              {/* <InfoProjetoBlock
                editor={true}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                updateLogs={updateLogs || []}
                handleUpdates={handleUpdates}
                project={project}
              /> */}
              <InfoObrasBlock
                editor={true}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                updateLogs={updateLogs || []}
                project={project}
              />
              <InfoMaterialBlock
                editor={false}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                updateLogs={updateLogs || []}
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
              />
            </div>
          ) : null}
        </div>
      </AnimatedModalWrapper>
    </>
  )
}

export default ModalProjetos
