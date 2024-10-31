import React, { useEffect, useState } from 'react'

import { FaSave } from 'react-icons/fa'
import { VscChromeClose } from 'react-icons/vsc'

import SaveButton from './utils/Buttons/SaveButton'
import { useSession } from 'next-auth/react'

import AnimatedModalWrapper from './utils/AnimatedModalWrapper'
import LoadingPage from './utils/LoadingPage'
import ErrorPage from './utils/ErrorPage'
import NotificationCreationBlock from './NotificationCreationBlock'
import InfoAtividadesBlock from './blocosInfoProjeto/InfoAtividadesBlock'
import InfoClienteBlock from './blocosInfoProjeto/InfoClienteBlock'
import InfoVisitaTecnicaBlock from './blocosInfoProjeto/InfoVisitaTecnicaBlock'
import InfoPadraoBlock from './blocosInfoProjeto/InfoPadraoBlock'
import InfoEstruturaBlock from './blocosInfoProjeto/InfoEstruturaBlock'
import InfoContratoBlock from './blocosInfoProjeto/InfoContratoBlock'
import InfoJornadaBlock from './blocosInfoProjeto/InfoJornadaBlock'
import InfoPagamentoBlock from './blocosInfoProjeto/InfoPagamentoBlock'
import InfoCompraBlock from './blocosInfoProjeto/InfoCompraBlock'
import InfoSistemaBlock from './blocosInfoProjeto/InfoSistemaBlock'
import InfoObrasBlock from './blocosInfoProjeto/InfoObrasBlock'
import InfoComissionamentoBlock from './blocosInfoProjeto/InfoComissionamentoBlock'
import InfoOeMBlock from './blocosInfoProjeto/InfoOeMBlock'
import InfoMaterialBlock from './blocosInfoProjeto/InfoMaterialBlock'
import InfoArquivosBlock from './blocosInfoProjeto/InfoArquivosBlock'

import { useClientById } from '../utils/methods/query/clients'
import { updateProject } from '../utils/methods/mutation/clients'
import { useMutationWithFeedback } from '../utils/methods/mutation/general-hook'
import { useQueryClient } from '@tanstack/react-query'
import ProjectServiceOrders from './identificador/ordensDeServico/ProjectServiceOrders'
import OSCreationBlock from './OSCreationBlock'
import { useProjectUpdateLogs } from '@/utils/methods/query/project-update-logs'
import InfoHomologacaoBlock from './blocosInfoProjeto/InfoHomologacaoBlock'
import RestrictionBlock from './blocosInfoProjeto/RestrictionBlock'
import { getErrorMessage } from '@/utils/methods/handlers'
import InfoAnexosBlock from './blocosInfoProjeto/InfoAnexosBlock'

function ModalDB({ session, projectId, modalIsOpen, closeModal }) {
  const queryClient = useQueryClient()

  const userHasOverallAccess = [
    'Projetos',
    'Obras',
    'Suprimentos',
    'O&M',
    'Marketing',
    'Vendas',
    'Pós-Venda',
    'PPS',
    'InsideSales',
    'Financeiro',
    'ADM',
    'RH',
  ].every((el) => session?.user.permissoes.rotas.includes(el))
  const userHasOeMAccess = !!session?.user.permissoes.suporte.visualizar
  const userHasRestrictionPermission = session.user.permissoes.gestao.restringirProjetos

  const { data: project, isLoading, isSuccess, isError, error } = useClientById({ id: projectId, enabled: !!projectId })
  const { data: updateLogs } = useProjectUpdateLogs({ projectId })

  const [infoHolder, setInfo] = useState(project)
  const [changes, setChanges] = useState({})
  const { mutate } = useMutationWithFeedback({
    mutationKey: ['update-project'],
    mutationFn: updateProject,
    affectedQueryKey: ['project-by-id', projectId],
    queryClient: queryClient,
  })

  const errorMsg = getErrorMessage(error)
  useEffect(() => {
    setInfo(project)
  }, [project])
  return (
    <>
      <AnimatedModalWrapper modalIsOpen={modalIsOpen}>
        <div className="flex h-full flex-col ">
          <div className="flex flex-col items-center justify-between border-b border-gray-200 px-2 pb-2 text-lg lg:flex-row">
            <div className="flex gap-x-2">
              <h1 className="pl-6 font-bold text-[#15599a]">{project ? `${project.qtde} - ${project.nomeDoContrato}` : 'CARREGANDO...'}</h1>
              {project?.codigoSVB && <p className="text-sm font-bold text-gray-600">#{project.codigoSVB}</p>}
            </div>
            <div className="flex items-center gap-x-2">
              {userHasOverallAccess || userHasOeMAccess ? (
                <SaveButton text={'Salvar alterações'} icon={<FaSave />} handleClick={() => mutate({ id: projectId, changes: changes })} />
              ) : null}
              <button>
                <VscChromeClose onClick={() => closeModal()} style={{ color: 'red' }} />
              </button>
            </div>
          </div>
          {isLoading ? <LoadingPage /> : null}
          {isError ? <ErrorPage msg={errorMsg} /> : null}
          {isSuccess && infoHolder && session ? (
            <div className="overscroll-y flex h-full flex-col gap-y-2 overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
              <NotificationCreationBlock nomeDoProjeto={project.nomeDoContrato} codProjeto={project.qtde} />
              <InfoAtividadesBlock projectId={projectId} projectName={project.nomeDoContrato} projectIdentifier={project.qtde} session={session} />
              <InfoClienteBlock
                editor={userHasOverallAccess}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                updateLogs={updateLogs || []}
                project={project}
              />
              <InfoVisitaTecnicaBlock
                editor={userHasOverallAccess}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                analysisId={project.idVisitaTecnica}
                session={session}
              />
              {!['OPERAÇÃO E MANUTENÇÃO', 'BOMBA SOLAR', 'SISTEMA FOTOVOLTAICO (OFF GRID)'].includes(infoHolder.tipoDeServico) && (
                <InfoPadraoBlock
                  comercialEdition={userHasOverallAccess}
                  technicalEdition={userHasOverallAccess}
                  infoHolder={infoHolder}
                  setInfo={setInfo}
                  changes={changes}
                  setChanges={setChanges}
                  updateLogs={updateLogs || []}
                  showPaymentInfo={userHasOverallAccess}
                />
              )}
              {!['OPERAÇÃO E MANUTENÇÃO', 'TROCA DE PADRÃO', 'REFORMA DE PADRÃO', 'SUBESTAÇÃO DE ENERGIA'].includes(infoHolder.tipoDeServico) && (
                <InfoEstruturaBlock
                  comercialEdition={userHasOverallAccess}
                  technicalEdition={userHasOverallAccess}
                  project={project}
                  infoHolder={infoHolder}
                  setInfo={setInfo}
                  changes={changes}
                  setChanges={setChanges}
                  updateLogs={updateLogs || []}
                  showPaymentInfo={userHasOverallAccess}
                />
              )}
              <InfoContratoBlock
                editor={userHasOverallAccess}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                updateLogs={updateLogs || []}
                minimalInfo={false}
                showPaymentInfo={true}
              />
              <InfoJornadaBlock
                editor={userHasOverallAccess}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                updateLogs={updateLogs || []}
              />
              <InfoPagamentoBlock
                editor={userHasOverallAccess}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                updateLogs={updateLogs || []}
              />
              {!['MONTAGEM E DESMONTAGEM', 'OPERAÇÃO E MANUTENÇÃO'].includes(infoHolder.tipoDeServico) && (
                <InfoCompraBlock
                  editor={userHasOverallAccess}
                  session={session}
                  project={project}
                  comercialEditionOnly={false}
                  infoHolder={infoHolder}
                  setInfo={setInfo}
                  changes={changes}
                  setChanges={setChanges}
                  updateLogs={updateLogs || []}
                  showDeliveryInfoOnly={false}
                  showMonetaryValues={false}
                />
              )}
              {/* {!['BOMBA SOLAR', 'SISTEMA FOTOVOLTAICO (OFF GRID)'].includes(infoHolder.tipoDeServico) && (
                <InfoDadosConcessionariaBlock
                  editor={userHasOverallAccess}
                  infoHolder={infoHolder}
                  setInfo={setInfo}
                  changes={changes}
                  setChanges={setChanges}
                  updateLogs={updateLogs || []}
                />
              )} */}
              {!['TROCA DE PADRÃO', 'REFORMA DE PADRÃO', 'SUBESTAÇÃO DE ENERGIA'].includes(infoHolder.tipoDeServico) && (
                <InfoSistemaBlock
                  editor={userHasOverallAccess}
                  infoHolder={infoHolder}
                  setInfo={setInfo}
                  changes={changes}
                  setChanges={setChanges}
                  updateLogs={updateLogs || []}
                  showPaymentInfo={userHasOverallAccess}
                />
              )}
              {!['BOMBA SOLAR', 'SISTEMA FOTOVOLTAICO (OFF GRID)', 'OPERAÇÃO E MANUTENÇÃO'].includes(infoHolder.tipoDeServico) ? (
                <InfoHomologacaoBlock session={session} infoHolder={infoHolder} setInfo={setInfo} changes={changes} setChanges={setChanges} />
              ) : // <InfoProjetoBlock
              //   comercialEdition={userHasOverallAccess}
              //   editor={userHasOverallAccess}
              //   infoHolder={infoHolder}
              //   setInfo={setInfo}
              //   changes={changes}
              //   setChanges={setChanges}
              //   updateLogs={updateLogs || []}
              //   project={project}
              // />
              null}
              <InfoObrasBlock
                editor={userHasOverallAccess}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                updateLogs={updateLogs || []}
                project={project}
              />
              <div className="flex flex-col rounded-md border border-[#15599a] pb-2 shadow-lg">
                <span className="mb-2 w-full rounded-tr-md rounded-tl-md bg-[#15599a] py-2 text-center font-bold text-white">ORDENS DE SERVIÇO</span>
                <ProjectServiceOrders projectId={project._id} />
                <OSCreationBlock project={infoHolder} />
              </div>
              <InfoComissionamentoBlock
                editor={userHasOeMAccess}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                updateLogs={updateLogs || []}
                project={project}
              />
              <InfoOeMBlock
                editor={userHasOeMAccess}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                updateLogs={updateLogs || []}
                project={project}
              />
              <InfoMaterialBlock
                editor={userHasOverallAccess}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                updateLogs={updateLogs || []}
              />
              <InfoAnexosBlock projectId={projectId} project={infoHolder} session={session} />
              {/* <InfoArquivosBlock
                project={project}
                infoHolder={infoHolder}
                ableToDelete={userHasOverallAccess}
                categories={[
                  { label: 'DOCUMENTOS', value: 'links.documentos' },
                  { label: 'CONTRATOS', value: 'links.contratos' },
                  { label: 'EQUIPAMENTOS', value: 'links.equipamentos' },
                  { label: 'PROJETOS', value: 'links.projetos' },
                  { label: 'VISITA TÉCNICA', value: 'links.visitaTecnica' },
                  { label: 'MANUTENÇÃO PREVENTIVA', value: 'links.manutencaoPreventiva' },
                  { label: 'MANUTENÇÃO CORRETIVA', value: 'links.manutencaoCorretiva' },
                ]}
              /> */}
              {userHasRestrictionPermission ? (
                <RestrictionBlock infoHolder={infoHolder} setInfo={setInfo} changes={changes} setChanges={setChanges} />
              ) : null}
            </div>
          ) : null}
        </div>
      </AnimatedModalWrapper>
    </>
  )
}

export default ModalDB
