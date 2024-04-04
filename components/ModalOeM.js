import React, { useEffect, useState } from 'react'
import { useQueryClient } from 'react-query'

import { FaSave } from 'react-icons/fa'
import { VscChromeClose } from 'react-icons/vsc'

import SaveButton from './utils/Buttons/SaveButton'
import ProjectServiceOrders from './identificador/ordensDeServico/ProjectServiceOrders'
import NotificationCreationBlock from './NotificationCreationBlock'

import OSCreationBlock from './OSCreationBlock'

import AnimatedModalWrapper from './utils/AnimatedModalWrapper'
import InfoEstruturaBlock from './blocosInfoProjeto/InfoEstruturaBlock'
import InfoSistemaBlock from './blocosInfoProjeto/InfoSistemaBlock'
import InfoVisitaTecnicaBlock from './blocosInfoProjeto/InfoVisitaTecnicaBlock'
import InfoPadraoBlock from './blocosInfoProjeto/InfoPadraoBlock'
import InfoClienteBlock from './blocosInfoProjeto/InfoClienteBlock'
import InfoDadosConcessionariaBlock from './blocosInfoProjeto/InfoDadosConcessionariaBlock'
import InfoCompraBlock from './blocosInfoProjeto/InfoCompraBlock'
import InfoArquivosBlock from './blocosInfoProjeto/InfoArquivosBlock'
import InfoProjetoBlock from './blocosInfoProjeto/InfoProjetoBlock'
import InfoObrasBlock from './blocosInfoProjeto/InfoObrasBlock'

import ExecutionCommissioningBlock from './blocosInfoProjeto/InfoComissionamentoBlock'
import OeMBlock from './blocosInfoProjeto/InfoOeMBlock'

import { useMutationWithFeedback } from '../utils/methods/mutation/general-hook'
import { handleOeMUpdate } from '../utils/methods/mutation/oem'
import { useClientById } from '@/utils/methods/query/clients'

import { useKey } from '../utils/hooks'
import LoadingPage from './utils/LoadingPage'
import ErrorPage from './utils/ErrorPage'
function ModalOeM({ projectId, closeModal, modalIsOpen }) {
  const queryClient = useQueryClient()
  useKey('Escape', () => closeModal())
  const { data: project, isLoading, isSuccess, isError } = useClientById({ id: projectId, enabled: !!projectId })

  const [infoHolder, setInfo] = useState({})
  const [changes, setChanges] = useState({})

  const { mutate: updateProject } = useMutationWithFeedback({
    mutationKey: ['update-project'],
    mutationFn: handleOeMUpdate,
    affectedQueryKey: ['project-by-id', projectId],
    queryClient: queryClient,
    callbackFn: async () => await queryClient.invalidateQueries({ queryKey: ['oem-projects'] }),
  })

  useEffect(() => {
    if (project) setInfo(project)
  }, [project])
  return (
    <>
      <AnimatedModalWrapper modalIsOpen={modalIsOpen}>
        <div className="flex h-full flex-col overflow-y-auto overscroll-y-auto">
          <div className="flex flex-col items-center justify-between border-b border-gray-200 px-2 pb-2 text-lg lg:flex-row">
            <div className="flex items-center gap-2">
              <h1 className="pl-6 font-bold  text-[#15599a]">
                {infoHolder?.qtde} - {infoHolder?.nomeDoContrato}
              </h1>
              {infoHolder?.codigoSVB && <p className="text-sm font-bold text-gray-600">#{infoHolder?.codigoSVB}</p>}
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
          {isSuccess && infoHolder?._id ? (
            <div className="overscroll-y flex h-full flex-col gap-y-2 overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
              <NotificationCreationBlock nomeDoProjeto={project.nomeDoContrato} codProjeto={project.qtde} />

              <InfoClienteBlock
                editor={false}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                project={project}
              />
              <ExecutionCommissioningBlock
                editor={true}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                project={project}
              />
              <OeMBlock editor={true} infoHolder={infoHolder} setInfo={setInfo} changes={changes} setChanges={setChanges} project={project} />
              <div className="flex flex-col border border-[#15599a] px-2 pb-2 shadow-lg">
                <span className="py-2 text-center text-sm font-bold uppercase text-[#15599a]">ORDENS DE SERVIÇO</span>
                <ProjectServiceOrders projectId={project._id} />
                <OSCreationBlock project={infoHolder} />
              </div>
              <InfoVisitaTecnicaBlock
                editor={false}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                analysisId={project.idVisitaTecnica}
              />
              {!['BOMBA SOLAR', 'OPERAÇÃO E MANUTENÇÃO'].includes(project.tipoDeServico) ? (
                <InfoPadraoBlock
                  comercialEdition={false}
                  technicalEdition={false}
                  infoHolder={infoHolder}
                  setInfo={setInfo}
                  changes={changes}
                  setChanges={setChanges}
                  showPaymentInfo={false}
                />
              ) : null}

              {!['TROCA DE PADRÃO', 'REFORMA DE PADRÃO', 'SUBESTAÇÃO DE ENERGIA'].includes(infoHolder.tipoDeServico) && (
                <InfoEstruturaBlock
                  comercialEdition={false}
                  technicalEdition={false}
                  infoHolder={infoHolder}
                  project={project}
                  setInfo={setInfo}
                  changes={changes}
                  setChanges={setChanges}
                  showPaymentInfo={false}
                />
              )}
              {!['MONTAGEM E DESMONTAGEM', 'OPERAÇÃO E MANUTENÇÃO'].includes(project.tipoDeServico) ? (
                <InfoCompraBlock
                  editor={false}
                  infoHolder={infoHolder}
                  project={project}
                  setInfo={setInfo}
                  changes={changes}
                  setChanges={setChanges}
                  showDeliveryInfoOnly={true}
                  showMonetaryValues={false}
                />
              ) : null}
              {!['BOMBA SOLAR', 'SISTEMA FOTOVOLTAICO (OFF GRID)'].includes(infoHolder.tipoDeServico) && (
                <InfoDadosConcessionariaBlock editor={false} infoHolder={infoHolder} setInfo={setInfo} changes={changes} setChanges={setChanges} />
              )}
              {!['TROCA DE PADRÃO', 'REFORMA DE PADRÃO', 'SUBESTAÇÃO DE ENERGIA'].includes(infoHolder.tipoDeServico) && (
                <InfoSistemaBlock editor={false} infoHolder={infoHolder} setInfo={setInfo} changes={changes} setChanges={setChanges} />
              )}
              {!['OPERAÇÃO E MANUTENÇÃO', 'BOMBA SOLAR', 'SISTEMA FOTOVOLTAICO (OFF GRID)'].includes(project.tipoDeServico) ? (
                <InfoProjetoBlock
                  editor={false}
                  infoHolder={infoHolder}
                  setInfo={setInfo}
                  changes={changes}
                  setChanges={setChanges}
                  project={project}
                />
              ) : null}

              {project.tipoDeServico != 'OPERAÇÃO E MANUTENÇÃO' ? (
                <InfoObrasBlock
                  editor={false}
                  infoHolder={infoHolder}
                  setInfo={setInfo}
                  changes={changes}
                  setChanges={setChanges}
                  project={project}
                />
              ) : null}

              <InfoArquivosBlock
                project={project}
                infoHolder={infoHolder}
                categories={[
                  { label: 'DOCUMENTOS', value: 'links.documentos' },
                  { label: 'PROJETOS', value: 'links.projetos' },
                  { label: 'OBRAS', value: 'links.obras' },
                  {
                    label: 'MANUTENÇÃO PREVENTIVA',
                    value: 'links.manutencaoPreventiva',
                  },
                  {
                    label: 'MANUTENÇÃO CORRETIVA',
                    value: 'links.manutencaoCorretiva',
                  },
                ]}
              />
            </div>
          ) : null}
        </div>
      </AnimatedModalWrapper>
    </>
  )
}

export default ModalOeM
