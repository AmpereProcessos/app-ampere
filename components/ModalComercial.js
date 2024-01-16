import React, { useState } from 'react'
import axios from 'axios'

import { useKey } from '../utils/hooks'
import { getErrorMessage, handleCRMProjectUpdatesAutomations } from '../utils/methods/handlers'

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
import ESigningBlock from './blocosInfoProjeto/ESigningBlock'

import SaveButton from './utils/Buttons/SaveButton'
import { useMutationWithFeedback } from '../utils/methods/mutation/general-hook'
import { updateProject } from '../utils/methods/mutation/clients'
import { useQueryClient } from 'react-query'
import { useClientById } from '../utils/methods/query/clients'
import LoadingPage from './utils/LoadingPage'
import ErrorPage from './utils/ErrorPage'
import toast from 'react-hot-toast'
import { useEffect } from 'react'
import { handleComercialProjectUpdate } from '../utils/methods/mutation/comercial'
import { useSession } from 'next-auth/react'

function ModalComercial({ projectId, modalIsOpen, closeModal }) {
  useKey('Escape', () => closeModal(false))
  const { data: session } = useSession()
  const queryClient = useQueryClient()

  const { data: project, isLoading, isSuccess, isError } = useClientById({ id: projectId, enabled: !!projectId })

  const [infoHolder, setInfo] = useState(project)

  const [changes, setChanges] = useState({})
  const [msg, setMsg] = useState({
    text: '',
    color: '',
  })
  const { mutate: updateProject } = useMutationWithFeedback({
    mutationKey: ['update-project'],
    mutationFn: handleComercialProjectUpdate,
    affectedQueryKey: ['comercial-projects'],
    queryClient: queryClient,
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
              {msg.text && <p className={`hidden text-sm italic lg:block ${msg.color}`}>{msg.text}</p>}
              <SaveButton
                text={'Salvar alterações'}
                icon={<FaSave />}
                handleClick={() => updateProject({ previousData: project, newData: infoHolder, changes: changes })}
              />
              <button>
                <VscChromeClose onClick={() => closeModal()} style={{ color: 'red' }} />
              </button>
            </div>
            {msg.text && <p className={`block text-sm italic lg:hidden ${msg.color}`}>{msg.text}</p>}
          </div>
          {isLoading ? <LoadingPage /> : null}
          {isError ? <ErrorPage msg={'Erro ao carregar informações do projeto. Tente novamente.'} /> : null}
          {isSuccess && infoHolder ? (
            <div className="overscroll-y flex h-full flex-col gap-y-2 overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
              <NotificationCreationBlock nomeDoProjeto={project.nomeDoContrato} codProjeto={project.qtde} />
              <InfoAtividadesBlock projectId={projectId} projectName={project.nomeDoContrato} projectIdentifier={project.qtde} session={session} />
              <InfoClienteBlock editor={true} infoHolder={infoHolder} setInfo={setInfo} changes={changes} setChanges={setChanges} project={project} />
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
                  showPaymentInfo={true}
                />
              )}
              <InfoContratoBlock
                editor={true}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                minimalInfo={false}
                showPaymentInfo={true}
              />
              <InfoReceitasBlock
                session={session}
                projectId={projectId}
                projectName={infoHolder.nomeDoContrato}
                projectIdentificator={project.qtde}
              />
              <InfoPagamentoBlock editor={true} infoHolder={infoHolder} setInfo={setInfo} changes={changes} setChanges={setChanges} />
              {!['MONTAGEM E DESMONTAGEM', 'OPERAÇÃO E MANUTENÇÃO'].includes(infoHolder.tipoDeServico) && (
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
              {!['BOMBA SOLAR', 'SISTEMA FOTOVOLTAICO (OFF GRID)'].includes(infoHolder.tipoDeServico) && (
                <InfoDadosConcessionariaBlock editor={true} infoHolder={infoHolder} setInfo={setInfo} changes={changes} setChanges={setChanges} />
              )}
              {!['TROCA DE PADRÃO', 'REFORMA DE PADRÃO', 'SUBESTAÇÃO DE ENERGIA'].includes(infoHolder.tipoDeServico) && (
                <InfoSistemaBlock
                  editor={true}
                  infoHolder={infoHolder}
                  setInfo={setInfo}
                  changes={changes}
                  setChanges={setChanges}
                  showPaymentInfo={true}
                />
              )}
              {!['BOMBA SOLAR', 'SISTEMA FOTOVOLTAICO (OFF GRID)', 'OPERAÇÃO E MANUTENÇÃO'].includes(infoHolder.tipoDeServico) ? (
                <InfoProjetoBlock
                  editor={true}
                  infoHolder={infoHolder}
                  setInfo={setInfo}
                  changes={changes}
                  setChanges={setChanges}
                  project={project}
                />
              ) : null}

              <InfoObrasBlock editor={true} infoHolder={infoHolder} setInfo={setInfo} changes={changes} setChanges={setChanges} project={project} />
              <InfoMaterialBlock editor={true} infoHolder={infoHolder} setInfo={setInfo} changes={changes} setChanges={setChanges} />
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
