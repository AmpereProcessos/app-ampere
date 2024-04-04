import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useQueryClient } from 'react-query'

import { FaSave } from 'react-icons/fa'
import { VscChromeClose } from 'react-icons/vsc'

import NotificationCreationBlock from './NotificationCreationBlock'
import OSCreationBlock from './OSCreationBlock'
import AnimatedModalWrapper from './utils/AnimatedModalWrapper'
import SaveButton from './utils/Buttons/SaveButton'
import InfoAtividadesBlock from './blocosInfoProjeto/InfoAtividadesBlock'
import InfoPadraoBlock from './blocosInfoProjeto/InfoPadraoBlock'
import InfoEstruturaBlock from './blocosInfoProjeto/InfoEstruturaBlock'
import InfoSistemaBlock from './blocosInfoProjeto/InfoSistemaBlock'
import InfoVisitaTecnicaBlock from './blocosInfoProjeto/InfoVisitaTecnicaBlock'
import InfoClienteBlock from './blocosInfoProjeto/InfoClienteBlock'
import InfoArquivosBlock from './blocosInfoProjeto/InfoArquivosBlock'
import InfoObrasBlock from './blocosInfoProjeto/InfoObrasBlock'
import InfoMaterialBlock from './blocosInfoProjeto/InfoMaterialBlock'

import ProjectServiceOrders from './identificador/ordensDeServico/ProjectServiceOrders'
import { useKey } from '../utils/hooks'

import LoadingPage from './utils/LoadingPage'
import ErrorPage from './utils/ErrorPage'
import { useClientById } from '../utils/methods/query/clients'
import { useMutationWithFeedback } from '@/utils/methods/mutation/general-hook'
import { updateProject } from '@/utils/methods/mutation/clients'
import { useSession } from 'next-auth/react'
import { handleExecutionUpdate } from '@/utils/methods/mutation/execution'

function ModalObras({ projectId, modalIsOpen, handleUpdates, closeModal }) {
  useKey('Escape', () => closeModal())
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const { data: project, isSuccess, isLoading, isError } = useClientById({ id: projectId, enabled: !!projectId })
  const [infoHolder, setInfo] = useState(project)

  const { mutate: updateProject } = useMutationWithFeedback({
    mutationKey: ['update-project'],
    mutationFn: handleExecutionUpdate,
    affectedQueryKey: ['execution-projects'],
    queryClient: queryClient,
  })

  const [changes, setChanges] = useState({})

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
            </div>
            <div className="flex items-center gap-x-2">
              {/* {msg.text && <p className={`hidden lg:block text-sm italic ${msg.color}`}>{msg.text}</p>} */}
              <SaveButton
                text={'Salvar alterações'}
                icon={<FaSave />}
                handleClick={() => updateProject({ previousData: project, newData: infoHolder, changes: changes, queryClient: queryClient })}
              />
              <button>
                <VscChromeClose onClick={() => closeModal(false)} style={{ color: 'red' }} />
              </button>
            </div>
            {/* <p className={`block lg:hidden text-sm italic ${msg.color}`}>{msg.text}</p> */}
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
              <InfoObrasBlock
                editor={true}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                project={project}
                showDeliveryInfo={true}
                showMaterialInfo={true}
              />

              <div className="flex flex-col rounded-md border border-[#15599a] pb-2 shadow-lg">
                <span className="mb-2 w-full rounded-tr-md rounded-tl-md bg-[#15599a] py-2 text-center font-bold text-white">ORDENS DE SERVIÇO</span>
                <ProjectServiceOrders projectId={project._id} />
                <OSCreationBlock project={infoHolder} />
              </div>
              <InfoSistemaBlock
                editor={true}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                showPaymentInfo={false}
              />
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
                  comercialEdition={false}
                  technicalEdition={true}
                  infoHolder={infoHolder}
                  setInfo={setInfo}
                  changes={changes}
                  setChanges={setChanges}
                  showPaymentInfo={true}
                />
              )}
              {!['TROCA DE PADRÃO', 'REFORMA DE PADRÃO', 'SUBESTAÇÃO DE ENERGIA'].includes(infoHolder.tipoDeServico) && (
                <InfoEstruturaBlock
                  comercialEdition={false}
                  technicalEdition={true}
                  infoHolder={infoHolder}
                  project={project}
                  setInfo={setInfo}
                  changes={changes}
                  setChanges={setChanges}
                  showPaymentInfo={true}
                />
              )}
              <InfoMaterialBlock
                editor={true}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                showCircuitBreakers={true}
              />
              <InfoArquivosBlock
                project={project}
                infoHolder={infoHolder}
                categories={[
                  { label: 'DOCUMENTOS', value: 'links.documentos' },
                  { label: 'CONTRATOS', value: 'links.contratos' },
                  { label: 'EQUIPAMENTOS', value: 'links.equipamentos' },
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

export default ModalObras
