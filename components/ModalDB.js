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
        <div className="flex flex-col h-full ">
          <div className="flex flex-col lg:flex-row items-center justify-between px-2 text-lg border-b border-gray-200 pb-2">
            <div className="flex gap-x-2">
              <h1 className="text-[#15599a] pl-6 font-bold">{project ? `${project.qtde} - ${project.nomeDoContrato}` : 'CARREGANDO...'}</h1>
              {project?.codigoSVB && <p className="text-gray-600 text-sm font-bold">#{project.codigoSVB}</p>}
            </div>
            <div className="flex gap-x-2 items-center">
              {msg.text && <p className={`hidden lg:block text-sm italic ${msg.color}`}>{msg.text}</p>}
              {userHasOverallAccess ? (
                <SaveButton text={'Salvar alterações'} icon={<FaSave />} handleClick={() => mutate({ id: projectId, changes: changes })} />
              ) : null}

              <button>
                <VscChromeClose onClick={() => closeModal()} style={{ color: 'red' }} />
              </button>
            </div>
            {msg.text && <p className={`block lg:hidden text-sm italic ${msg.color}`}>{msg.text}</p>}
          </div>
          {isLoading ? <LoadingPage /> : null}
          {isError ? <ErrorPage msg={'Erro ao carregar informações do projeto. Tente novamente.'} /> : null}
          {isSuccess && infoHolder ? (
            <div className="flex flex-col gap-y-2 h-full overflow-y-auto overscroll-y scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <NotificationCreationBlock nomeDoProjeto={project.nomeDoContrato} codProjeto={project.qtde} />
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
              <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg rounded-md">
                <span className="w-full bg-[#15599a] text-white text-center font-bold py-2 rounded-tr-md rounded-tl-md mb-2">ORDENS DE SERVIÇO</span>
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
