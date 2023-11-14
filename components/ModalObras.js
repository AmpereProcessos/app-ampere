import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useQueryClient } from 'react-query'

import { FaSave } from 'react-icons/fa'
import { VscChromeClose } from 'react-icons/vsc'

import NotificationCreationBlock from './NotificationCreationBlock'
import OSCreationBlock from './OSCreationBlock'
import AnimatedModalWrapper from './utils/AnimatedModalWrapper'
import SaveButton from './utils/Buttons/SaveButton'

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

function ModalObras({ projectId, modalIsOpen, handleUpdates, closeModal }) {
  useKey('Escape', () => closeModal())
  const queryClient = useQueryClient()
  const { data: project, isSuccess, isLoading, isError } = useClientById({ id: projectId, enabled: !!projectId })
  const [infoHolder, setInfo] = useState(project)

  const { mutate } = useMutationWithFeedback({
    mutationKey: ['update-project'],
    mutationFn: updateProject,
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
        <div className="flex flex-col h-full overflow-y-auto overscroll-y-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between px-2 text-lg pb-2 border-b border-gray-200">
            <div className="flex gap-2 items-center">
              <h1 className="text-[#15599a] pl-6 font-bold">{project ? `${project.qtde} - ${project.nomeDoContrato}` : 'CARREGANDO...'}</h1>
              {project?.codigoSVB && <p className="text-gray-600 text-sm font-bold">#{project.codigoSVB}</p>}
            </div>
            <div className="flex gap-x-2 items-center">
              {/* {msg.text && <p className={`hidden lg:block text-sm italic ${msg.color}`}>{msg.text}</p>} */}
              <SaveButton text={'Salvar alterações'} icon={<FaSave />} handleClick={() => mutate({ id: projectId, changes: changes })} />
              <button>
                <VscChromeClose onClick={() => closeModal(false)} style={{ color: 'red' }} />
              </button>
            </div>
            {/* <p className={`block lg:hidden text-sm italic ${msg.color}`}>{msg.text}</p> */}
          </div>
          {isLoading ? <LoadingPage /> : null}
          {isError ? <ErrorPage msg={'Erro ao carregar informações do projeto. Tente novamente.'} /> : null}
          {isSuccess && infoHolder ? (
            <div className="flex flex-col gap-y-2 h-full overflow-y-auto overscroll-y scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <NotificationCreationBlock nomeDoProjeto={project.nomeDoContrato} codProjeto={project.qtde} />

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

              <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg px-2">
                <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">ORDENS DE SERVIÇO</span>
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
