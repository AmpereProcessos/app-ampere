import React, { useState } from 'react'

import { useKey } from '../utils/hooks'

import { FaSave } from 'react-icons/fa'

import { VscChromeClose } from 'react-icons/vsc'

import NotificationCreationBlock from './NotificationCreationBlock'
import InfoAtividadesBlock from './blocosInfoProjeto/InfoAtividadesBlock'
import AnimatedModalWrapper from './utils/AnimatedModalWrapper'
import InfoSistemaBlock from './blocosInfoProjeto/InfoSistemaBlock'
import InfoPadraoBlock from './blocosInfoProjeto/InfoPadraoBlock'
import InfoEstruturaBlock from './blocosInfoProjeto/InfoEstruturaBlock'
import InfoCompraBlock from './blocosInfoProjeto/InfoCompraBlock'
import InfoVisitaTecnicaBlock from './blocosInfoProjeto/InfoVisitaTecnicaBlock'
import InfoContratoBlock from './blocosInfoProjeto/InfoContratoBlock'
import InfoClienteBlock from './blocosInfoProjeto/InfoClienteBlock'
import InfoDadosConcessionariaBlock from './blocosInfoProjeto/InfoDadosConcessionariaBlock'
import InfoReceitasBlock from './blocosInfoProjeto/InfoReceitasBlock'
import InfoPagamentoBlock from './blocosInfoProjeto/InfoPagamentoBlock'
import InfoArquivosBlock from './blocosInfoProjeto/InfoArquivosBlock'
import InfoProjetoBlock from './blocosInfoProjeto/InfoProjetoBlock'
import InfoObrasBlock from './blocosInfoProjeto/InfoObrasBlock'
import InfoMaterialBlock from './blocosInfoProjeto/InfoMaterialBlock'

import SaveButton from './utils/Buttons/SaveButton'
import { useMutationWithFeedback } from '../utils/methods/mutation/general-hook'
import { useQueryClient } from 'react-query'
import { useClientById } from '../utils/methods/query/clients'
import LoadingPage from './utils/LoadingPage'
import ErrorPage from './utils/ErrorPage'
import { useEffect } from 'react'
import { handleComercialUpdate } from '../utils/methods/mutation/comercial'
import { useSession } from 'next-auth/react'
import { useProjectUpdateLogs } from '../utils/methods/query/project-update-logs'
import InfoHomologacaoBlock from './blocosInfoProjeto/InfoHomologacaoBlock'

function ModalComercial({ projectId, modalIsOpen, closeModal }) {
  useKey('Escape', () => closeModal(false))
  const { data: session } = useSession()
  const queryClient = useQueryClient()

  const { data: project, isLoading, isSuccess, isError } = useClientById({ id: projectId, enabled: !!projectId })
  const { data: updateLogs } = useProjectUpdateLogs({ projectId })
  const [infoHolder, setInfo] = useState(project)

  const [changes, setChanges] = useState({})

  const { mutate: updateProject } = useMutationWithFeedback({
    mutationKey: ['update-project'],
    mutationFn: handleComercialUpdate,
    affectedQueryKey: ['project-by-id', projectId],
    queryClient: queryClient,
    callbackFn: async () => {
      setChanges({})
      await queryClient.invalidateQueries({ queryKey: ['comercial-projects'] })
    },
  })

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
          {isError ? <ErrorPage msg={'Erro ao carregar informações do projeto. Tente novamente.'} /> : null}
          {isSuccess && infoHolder ? (
            <div className="overscroll-y flex h-full flex-col gap-y-2 overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
              <NotificationCreationBlock nomeDoProjeto={project.nomeDoContrato} codProjeto={project.qtde} />
              <InfoAtividadesBlock projectId={projectId} projectName={project.nomeDoContrato} projectIdentifier={project.qtde} session={session} />
              <InfoClienteBlock
                editor={true}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                updateLogs={updateLogs || []}
                project={project}
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
              <InfoContratoBlock
                editor={true}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                updateLogs={updateLogs || []}
                minimalInfo={false}
                showPaymentInfo={true}
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
                  showPaymentInfo={true}
                />
              )}
              {!['OPERAÇÃO E MANUTENÇÃO', 'TROCA DE PADRÃO', 'REFORMA DE PADRÃO', 'SUBESTAÇÃO DE ENERGIA'].includes(infoHolder.tipoDeServico) && (
                <InfoEstruturaBlock
                  comercialEdition={true}
                  technicalEdition={true}
                  project={project}
                  infoHolder={infoHolder}
                  setInfo={setInfo}
                  changes={changes}
                  setChanges={setChanges}
                  updateLogs={updateLogs || []}
                  showPaymentInfo={true}
                />
              )}
              <InfoReceitasBlock
                session={session}
                project={infoHolder}
                projectId={projectId}
                projectName={infoHolder.nomeDoContrato}
                projectIdentificator={project.qtde}
              />
              <InfoPagamentoBlock
                editor={true}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                updateLogs={updateLogs || []}
              />
              {!['MONTAGEM E DESMONTAGEM', 'OPERAÇÃO E MANUTENÇÃO'].includes(infoHolder.tipoDeServico) && (
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
              {!['TROCA DE PADRÃO', 'REFORMA DE PADRÃO', 'SUBESTAÇÃO DE ENERGIA'].includes(infoHolder.tipoDeServico) && (
                <InfoSistemaBlock
                  editor={true}
                  infoHolder={infoHolder}
                  setInfo={setInfo}
                  changes={changes}
                  setChanges={setChanges}
                  showPaymentInfo={true}
                  updateLogs={updateLogs || []}
                />
              )}
              {!['BOMBA SOLAR', 'SISTEMA FOTOVOLTAICO (OFF GRID)', 'OPERAÇÃO E MANUTENÇÃO'].includes(infoHolder.tipoDeServico) ? (
                <InfoHomologacaoBlock session={session} infoHolder={infoHolder} setInfo={setInfo} changes={changes} setChanges={setChanges} />
              ) : // <InfoProjetoBlock
              //   comercialEdition={true}
              //   editor={true}
              //   infoHolder={infoHolder}
              //   setInfo={setInfo}
              //   changes={changes}
              //   setChanges={setChanges}
              //   updateLogs={updateLogs || []}
              //   project={project}
              // />
              null}

              <InfoObrasBlock
                editor={true}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                project={project}
                updateLogs={updateLogs || []}
              />
              <InfoMaterialBlock
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
                  { label: 'CONTRATOS', value: 'links.contratos' },
                  {
                    label: 'EQUIPAMENTOS',
                    value: 'links.equipamentos',
                  },
                  { label: 'PROJETOS', value: 'links.projetos' },
                  { label: 'VISITA TÉCNICA', value: 'links.visitaTecnica' },
                ]}
              />
              {/* <ESigningBlock
                projectId={infoHolder._id}
                contractName={infoHolder.nomeDoContrato}
                email={infoHolder.email}
                phone_number={infoHolder.telefone}
                documentation={infoHolder.cpf_cnpj}
                contractLinks={infoHolder.links?.contratos}
                digitalSigningInfo={infoHolder.assinaturaDigital}
              /> */}
            </div>
          ) : null}
        </div>
      </AnimatedModalWrapper>
    </>
  )
}

export default ModalComercial
