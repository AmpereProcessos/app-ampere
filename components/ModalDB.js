import React, { useContext, useEffect, useState } from 'react'

import { FaSave } from 'react-icons/fa'
import { VscChromeClose } from 'react-icons/vsc'

import axios from 'axios'

import SaveButton from './utils/Buttons/SaveButton'
import { useSession } from 'next-auth/react'

import AnimatedModalWrapper from './utils/AnimatedModalWrapper'
import LoadingPage from './utils/LoadingPage'
import ErrorPage from './utils/ErrorPage'
import NotificationCreationBlock from './NotificationCreationBlock'
import InfoClienteBlock from './blocosInfoProjeto/InfoClienteBlock'
import InfoVisitaTecnicaBlock from './blocosInfoProjeto/InfoVisitaTecnicaBlock'
import InfoPadraoBlock from './blocosInfoProjeto/InfoPadraoBlock'
import InfoEstruturaBlock from './blocosInfoProjeto/InfoEstruturaBlock'
import InfoContratoBlock from './blocosInfoProjeto/InfoContratoBlock'
import InfoJornadaBlock from './blocosInfoProjeto/InfoJornadaBlock'
import InfoPagamentoBlock from './blocosInfoProjeto/InfoPagamentoBlock'
import InfoCompraBlock from './blocosInfoProjeto/InfoCompraBlock'
import InfoDadosConcessionariaBlock from './blocosInfoProjeto/InfoDadosConcessionariaBlock'
import InfoSistemaBlock from './blocosInfoProjeto/InfoSistemaBlock'
import InfoProjetoBlock from './blocosInfoProjeto/InfoProjetoBlock'
import InfoObrasBlock from './blocosInfoProjeto/InfoObrasBlock'
import InfoComissionamentoBlock from './blocosInfoProjeto/InfoComissionamentoBlock'
import InfoOeMBlock from './blocosInfoProjeto/InfoOeMBlock'
import InfoMaterialBlock from './blocosInfoProjeto/InfoMaterialBlock'
import InfoArquivosBlock from './blocosInfoProjeto/InfoArquivosBlock'

import { useClientById } from '../utils/methods/query/clients'
import { updateProject } from '../utils/methods/mutation/clients'
import { useMutationWithFeedback } from '../utils/methods/mutation/general-hook'
import { useQueryClient } from 'react-query'
import ProjectServiceOrders from './identificador/ordensDeServico/ProjectServiceOrders'
import OSCreationBlock from './OSCreationBlock'

function ModalDB({ projectId, modalIsOpen, closeModal, handleUpdates }) {
  const queryClient = useQueryClient()
  const { data: session } = useSession()
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
  ].every((el) => session?.user.accessibleRoutes.includes(el))
  const { data: project, isLoading, isSuccess, isError } = useClientById({ id: projectId, enabled: !!projectId })

  const [infoHolder, setInfo] = useState(project)
  const [changes, setChanges] = useState({})
  const [msg, setMsg] = useState({
    text: '',
    color: '',
  })
  const { mutate } = useMutationWithFeedback({
    mutationKey: ['update-project'],
    mutationFn: updateProject,
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
              {userHasOverallAccess ? (
                <SaveButton text={'Salvar alterações'} icon={<FaSave />} handleClick={() => mutate({ id: projectId, changes: changes })} />
              ) : null}

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
              <InfoClienteBlock
                editor={userHasOverallAccess}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                project={project}
              />
              <InfoVisitaTecnicaBlock
                editor={userHasOverallAccess}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                analysisId={project.idVisitaTecnica}
              />
              {!['OPERAÇÃO E MANUTENÇÃO', 'BOMBA SOLAR', 'SISTEMA FOTOVOLTAICO (OFF GRID)'].includes(infoHolder.tipoDeServico) && (
                <InfoPadraoBlock
                  comercialEdition={userHasOverallAccess}
                  technicalEdition={userHasOverallAccess}
                  infoHolder={infoHolder}
                  setInfo={setInfo}
                  changes={changes}
                  setChanges={setChanges}
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
                  showPaymentInfo={userHasOverallAccess}
                />
              )}
              <InfoContratoBlock
                editor={userHasOverallAccess}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                minimalInfo={false}
                showPaymentInfo={true}
              />
              <InfoJornadaBlock editor={userHasOverallAccess} infoHolder={infoHolder} setInfo={setInfo} changes={changes} setChanges={setChanges} />
              <InfoPagamentoBlock editor={userHasOverallAccess} infoHolder={infoHolder} setInfo={setInfo} changes={changes} setChanges={setChanges} />
              {!['MONTAGEM E DESMONTAGEM', 'OPERAÇÃO E MANUTENÇÃO'].includes(infoHolder.tipoDeServico) && (
                <InfoCompraBlock
                  editor={userHasOverallAccess}
                  project={project}
                  comercialEditionOnly={false}
                  infoHolder={infoHolder}
                  setInfo={setInfo}
                  changes={changes}
                  setChanges={setChanges}
                  showDeliveryInfoOnly={false}
                  showMonetaryValues={false}
                />
              )}
              {!['BOMBA SOLAR', 'SISTEMA FOTOVOLTAICO (OFF GRID)'].includes(infoHolder.tipoDeServico) && (
                <InfoDadosConcessionariaBlock
                  editor={userHasOverallAccess}
                  infoHolder={infoHolder}
                  setInfo={setInfo}
                  changes={changes}
                  setChanges={setChanges}
                />
              )}
              {!['TROCA DE PADRÃO', 'REFORMA DE PADRÃO', 'SUBESTAÇÃO DE ENERGIA'].includes(infoHolder.tipoDeServico) && (
                <InfoSistemaBlock
                  editor={userHasOverallAccess}
                  infoHolder={infoHolder}
                  setInfo={setInfo}
                  changes={changes}
                  setChanges={setChanges}
                  showPaymentInfo={userHasOverallAccess}
                />
              )}
              {!['BOMBA SOLAR', 'SISTEMA FOTOVOLTAICO (OFF GRID)', 'OPERAÇÃO E MANUTENÇÃO'].includes(infoHolder.tipoDeServico) ? (
                <InfoProjetoBlock
                  editor={userHasOverallAccess}
                  infoHolder={infoHolder}
                  setInfo={setInfo}
                  changes={changes}
                  setChanges={setChanges}
                  project={project}
                />
              ) : null}
              <InfoObrasBlock
                editor={userHasOverallAccess}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                project={project}
              />
              <div className="flex flex-col rounded-md border border-[#15599a] pb-2 shadow-lg">
                <span className="mb-2 w-full rounded-tr-md rounded-tl-md bg-[#15599a] py-2 text-center font-bold text-white">ORDENS DE SERVIÇO</span>
                <ProjectServiceOrders projectId={project._id} />
                <OSCreationBlock project={infoHolder} />
              </div>
              <InfoComissionamentoBlock
                editor={userHasOverallAccess}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                project={project}
              />
              <InfoOeMBlock
                editor={userHasOverallAccess}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                project={project}
              />
              <InfoMaterialBlock editor={userHasOverallAccess} infoHolder={infoHolder} setInfo={setInfo} changes={changes} setChanges={setChanges} />
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
            </div>
          ) : null}
        </div>
      </AnimatedModalWrapper>
    </>
  )
}

export default ModalDB
