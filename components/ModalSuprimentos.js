import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useQueryClient } from 'react-query'

import { FaSave } from 'react-icons/fa'
import { VscChromeClose } from 'react-icons/vsc'

import NotificationCreationBlock from './NotificationCreationBlock'

import AnimatedModalWrapper from './utils/AnimatedModalWrapper'
import SaveButton from './utils/Buttons/SaveButton'
import LoadingPage from './utils/LoadingPage'
import ErrorPage from './utils/ErrorPage'

import { useKey } from '../utils/hooks'
import { useClientById } from '../utils/methods/query/clients'
import { useProjectUpdateLogs } from '../utils/methods/query/project-update-logs'
import { useMutationWithFeedback } from '../utils/methods/mutation/general-hook'
import { updateProject } from '../utils/methods/mutation/clients'

import InfoSistemaBlock from './blocosInfoProjeto/InfoSistemaBlock'
import InfoAtividadesBlock from './blocosInfoProjeto/InfoAtividadesBlock'
import InfoEstruturaBlock from './blocosInfoProjeto/InfoEstruturaBlock'
import InfoCompraBlock from './blocosInfoProjeto/InfoCompraBlock'
import InfoVisitaTecnicaBlock from './blocosInfoProjeto/InfoVisitaTecnicaBlock'
import InfoClienteBlock from './blocosInfoProjeto/InfoClienteBlock'
import InfoPagamentoBlock from './blocosInfoProjeto/InfoPagamentoBlock'
import InfoArquivosBlock from './blocosInfoProjeto/InfoArquivosBlock'
import { useSession } from 'next-auth/react'

function ModalSuprimentos({ projectId, modalIsOpen, closeModal, handleUpdates }) {
  useKey('Escape', () => closeModal())
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const { data: project, isLoading, isSuccess, isError } = useClientById({ id: projectId, enabled: !!projectId })
  const { data: updateLogs } = useProjectUpdateLogs({ projectId })
  const [infoHolder, setInfo] = useState(project)
  const [changes, setChanges] = useState({})
  const { mutate } = useMutationWithFeedback({
    mutationKey: ['update-project'],
    mutationFn: updateProject,
    affectedQueryKey: ['project-by-id', projectId], // ['supply-projects'],
    queryClient: queryClient,
    callbackFn: async () => {
      setChanges({})
      await queryClient.invalidateQueries({ queryKey: ['supply-projects'] })
    },
  })

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
              <InfoVisitaTecnicaBlock
                editor={false}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                analysisId={project.idVisitaTecnica}
                session={session}
              />
              <InfoSistemaBlock
                editor={true}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                updateLogs={updateLogs || []}
              />
              {!['TROCA DE PADRÃO', 'REFORMA DE PADRÃO', 'SUBESTAÇÃO DE ENERGIA'].includes(infoHolder.tipoDeServico) &&
                infoHolder.estruturaPersonalizada.aplicavel == 'SIM' && (
                  <InfoEstruturaBlock
                    comercialEdition={true}
                    technicalEdition={false}
                    infoHolder={infoHolder}
                    setInfo={setInfo}
                    changes={changes}
                    setChanges={setChanges}
                    updateLogs={updateLogs || []}
                    showPaymentInfo={false}
                    project={project}
                  />
                )}
              <InfoCompraBlock
                editor={true}
                project={project}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                updateLogs={updateLogs || []}
                showDeliveryInfoOnly={false}
                showMonetaryValues={true}
              />

              <InfoPagamentoBlock
                editor={true}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                updateLogs={updateLogs || []}
              />
              <InfoArquivosBlock
                project={project}
                infoHolder={infoHolder}
                categories={[
                  { label: 'DOCUMENTOS', value: 'links.documentos' },
                  { label: 'EQUIPAMENTOS', value: 'links.equipamentos' },
                  { label: 'PROJETOS', value: 'links.projetos' },
                  { label: 'OBRAS', value: 'links.obras' },
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

export default ModalSuprimentos
