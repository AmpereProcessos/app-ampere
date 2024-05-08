import React, { useEffect, useState } from 'react'
import { equipesTecnicas, fornecedores, vendedores, cidadesAtendidas } from '../utils/constants'
import { FaSave } from 'react-icons/fa'
import { VscChromeClose } from 'react-icons/vsc'
import TextInput from './TextInput'
import SelectInput from './SelectInput'
import DateInput from './DateInput'
import NumberInput from './NumberInput'
import NotificationCreationBlock from './NotificationCreationBlock'
import axios from 'axios'
import Link from 'next/link'
import AnimatedModalWrapper from './utils/AnimatedModalWrapper'
import InfoContratoBlock from './blocosInfoProjeto/InfoContratoBlock'
import InfoClienteBlock from './blocosInfoProjeto/InfoClienteBlock'
import InfoPagamentoBlock from './blocosInfoProjeto/InfoPagamentoBlock'
import InfoCompraBlock from './blocosInfoProjeto/InfoCompraBlock'
import InfoSistemaBlock from './blocosInfoProjeto/InfoSistemaBlock'
import InfoArquivosBlock from './blocosInfoProjeto/InfoArquivosBlock'
import InfoPadraoBlock from './blocosInfoProjeto/InfoPadraoBlock'
import InfoEstruturaBlock from './blocosInfoProjeto/InfoEstruturaBlock'
import InfoObrasBlock from './blocosInfoProjeto/InfoObrasBlock'
import InfoMaterialBlock from './blocosInfoProjeto/InfoMaterialBlock'
import SaveButton from './utils/Buttons/SaveButton'
import InfoDespesasBlock from './blocosInfoProjeto/InfoDespesasBlock'
import { useClientById } from '@/utils/methods/query/clients'
import { useMutationWithFeedback } from '@/utils/methods/mutation/general-hook'
import { updateProject } from '@/utils/methods/mutation/clients'
import { useKey } from '@/utils/hooks'
import { useQueryClient } from 'react-query'
import LoadingPage from './utils/LoadingPage'
import InfoAtividadesBlock from './blocosInfoProjeto/InfoAtividadesBlock'
import { useSession } from 'next-auth/react'
import { useProjectUpdateLogs } from '@/utils/methods/query/project-update-logs'
const MODAL_STYLES = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%,-50%)',
  backgroundColor: '#fff',
  width: '93%',
  height: '98%',
  borderRadius: '10px',
  padding: '10px',
  zIndex: 1000,
}
const OVERLAY_STYLES = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,.7)',
  zIndex: 1000,
}

function ModalADM({ projectId, modalIsOpen, closeModal }) {
  useKey('Escape', () => closeModal())
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const { data: project, isSuccess, isLoading, isError } = useClientById({ id: projectId, enabled: !!projectId })
  const { data: updateLogs } = useProjectUpdateLogs({ projectId })
  const [infoHolder, setInfo] = useState(project)
  const [changes, setChanges] = useState({})

  const { mutate } = useMutationWithFeedback({
    mutationKey: ['update-project'],
    mutationFn: updateProject,
    affectedQueryKey: ['project-by-id', projectId], // ['adm-projects'],
    queryClient: queryClient,
    callbackFn: async () => {
      setChanges({})
      await queryClient.invalidateQueries({ queryKey: ['adm-projects'] })
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
              <InfoDespesasBlock projectId={infoHolder._id} />
              {!['OPERAÇÃO E MANUTENÇÃO', 'BOMBA SOLAR', 'SISTEMA FOTOVOLTAICO (OFF GRID)'].includes(infoHolder.tipoDeServico) ? (
                <InfoPadraoBlock
                  comercialEdition={false}
                  technicalEdition={false}
                  infoHolder={infoHolder}
                  setInfo={setInfo}
                  changes={changes}
                  setChanges={setChanges}
                  showPaymentInfo={true}
                  showPaymentOnly={true}
                />
              ) : null}
              {!['TROCA DE PADRÃO', 'REFORMA DE PADRÃO', 'SUBESTAÇÃO DE ENERGIA'].includes(infoHolder.tipoDeServico) && (
                <InfoEstruturaBlock
                  comercialEdition={false}
                  technicalEdition={false}
                  project={project}
                  infoHolder={infoHolder}
                  setInfo={setInfo}
                  changes={changes}
                  setChanges={setChanges}
                  showPaymentInfo={true}
                />
              )}
              <InfoContratoBlock
                editor={false}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                minimalInfo={true}
                showPaymentInfo={true}
              />
              <InfoPagamentoBlock
                editor={true}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                updateLogs={updateLogs || []}
                showADMOnly={true}
              />
              {infoHolder.tipoDeServico != 'MONTAGEM E DESMONTAGEM' && (
                <InfoCompraBlock
                  editor={true}
                  infoHolder={infoHolder}
                  project={project}
                  setInfo={setInfo}
                  changes={changes}
                  setChanges={setChanges}
                  showDeliveryInfoOnly={false}
                  showMonetaryValues={true}
                />
              )}
              <InfoSistemaBlock
                editor={false}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                showPaymentInfo={true}
              />
              <InfoObrasBlock editor={false} infoHolder={infoHolder} setInfo={setInfo} changes={changes} setChanges={setChanges} project={project} />
              <InfoMaterialBlock editor={true} infoHolder={infoHolder} setInfo={setInfo} changes={changes} setChanges={setChanges} />
              <InfoArquivosBlock
                project={project}
                infoHolder={infoHolder}
                categories={[
                  { label: 'DOCUMENTOS', value: 'links.documentos' },
                  { label: 'CONTRATOS', value: 'links.contratos' },
                  { label: 'EQUIPAMENTOS', value: 'links.equipamentos' },
                  { label: 'PROJETOS', value: 'links.projetos' },
                ]}
                handleUpdates={() => console.log()}
              />
            </div>
          ) : null}
        </div>
      </AnimatedModalWrapper>
    </>
  )
}

export default ModalADM
