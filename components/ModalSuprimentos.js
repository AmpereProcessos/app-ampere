import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { vendedores, statusLiberacao, credores, fornecedores } from '../utils/constants'
import { FaSave } from 'react-icons/fa'
import { IoMdAdd } from 'react-icons/io'
import { VscChromeClose } from 'react-icons/vsc'
import TextInput from './TextInput'
import SelectInput from './SelectInput'
import DateInput from './DateInput'
import NotificationCreationBlock from './NotificationCreationBlock'
import NumberInput from './NumberInput'
import dayjs from 'dayjs'
import AnimatedModalWrapper from './utils/AnimatedModalWrapper'
import { useKey } from '../utils/hooks'
import InfoSistemaBlock from './blocosInfoProjeto/InfoSistemaBlock'
import InfoEstruturaBlock from './blocosInfoProjeto/InfoEstruturaBlock'
import InfoCompraBlock from './blocosInfoProjeto/InfoCompraBlock'
import InfoVisitaTecnicaBlock from './blocosInfoProjeto/InfoVisitaTecnicaBlock'
import InfoClienteBlock from './blocosInfoProjeto/InfoClienteBlock'
import InfoPagamentoBlock from './blocosInfoProjeto/InfoPagamentoBlock'
import InfoArquivosBlock from './blocosInfoProjeto/InfoArquivosBlock'
import SaveButton from './utils/Buttons/SaveButton'
import { useClientById } from '../utils/methods/query/clients'
import LoadingPage from './utils/LoadingPage'
import ErrorPage from './utils/ErrorPage'
import { useMutationWithFeedback } from '../utils/methods/mutation/general-hook'
import { updateProject } from '../utils/methods/mutation/clients'
import { useQueryClient } from 'react-query'

function ModalSuprimentos({ projectId, modalIsOpen, closeModal, handleUpdates }) {
  useKey('Escape', () => closeModal())
  const queryClient = useQueryClient()
  const { data: project, isLoading, isSuccess, isError } = useClientById({ id: projectId, enabled: !!projectId })
  const [infoHolder, setInfo] = useState(project)
  const [infoVisita, setInfoVisita] = useState({})
  const [changes, setChanges] = useState({})
  const [msg, setMsg] = useState({ text: '', color: '' })
  const { mutate } = useMutationWithFeedback({
    mutationKey: ['update-project'],
    mutationFn: updateProject,
    affectedQueryKey: ['supply-projects'],
    queryClient: queryClient,
  })

  function getVisitaInfo(id) {
    axios
      .post(`/api/solicitacoes/getVisitaTecnica/${id}`, {
        suprimentos: 1,
        obsSuprimentos: 1,
      })
      .then((res) => {
        setInfoVisita({
          suprimentos: res.data.suprimentos,
          obsSuprimentos: res.data.obsSuprimentos,
        })
      })
  }
  useEffect(() => {
    if (project?.idVisitaTecnica?.trim().length > 10) {
      getVisitaInfo(project.idVisitaTecnica)
    }
    setInfo(project)
  }, [project])
  console.log('INFO HOLDER', infoHolder)
  console.log('CHANGES', changes)
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
              {msg.text && <p className={`hidden lg:block text-sm italic ${msg.color}`}>{msg.text}</p>}
              <SaveButton text={'Salvar alterações'} icon={<FaSave />} handleClick={() => mutate({ id: projectId, changes: changes })} />
              <button>
                <VscChromeClose onClick={() => closeModal(false)} style={{ color: 'red' }} />
              </button>
            </div>
            <p className={`block lg:hidden text-sm italic ${msg.color}`}>{msg.text}</p>
          </div>
          {isLoading ? <LoadingPage /> : null}
          {isError ? <ErrorPage msg={'Erro ao carregar informações do projeto. Tente novamente.'} /> : null}
          {isSuccess && infoHolder ? (
            <div className="flex flex-col gap-y-2 h-full overflow-y-auto overscroll-y-auto">
              <NotificationCreationBlock nomeDoProjeto={project.nomeDoContrato} codProjeto={project.qtde} />
              <InfoClienteBlock
                editor={false}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                project={project}
              />
              <InfoVisitaTecnicaBlock
                editor={false}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                infoVisita={infoVisita}
              />
              <InfoSistemaBlock editor={true} infoHolder={infoHolder} setInfo={setInfo} changes={changes} setChanges={setChanges} />
              {!['TROCA DE PADRÃO', 'REFORMA DE PADRÃO', 'SUBESTAÇÃO DE ENERGIA'].includes(infoHolder.tipoDeServico) &&
                infoHolder.estruturaPersonalizada.aplicavel == 'SIM' && (
                  <InfoEstruturaBlock
                    comercialEdition={true}
                    technicalEdition={false}
                    infoHolder={infoHolder}
                    setInfo={setInfo}
                    changes={changes}
                    setChanges={setChanges}
                    showPaymentInfo={false}
                    project={project}
                  />
                )}
              {infoHolder.tipoDeServico != 'MONTAGEM E DESMONTAGEM' && (
                <InfoCompraBlock
                  editor={true}
                  project={project}
                  infoHolder={infoHolder}
                  setInfo={setInfo}
                  changes={changes}
                  setChanges={setChanges}
                  showDeliveryInfoOnly={false}
                  showMonetaryValues={true}
                />
              )}
              <InfoPagamentoBlock editor={true} infoHolder={infoHolder} setInfo={setInfo} changes={changes} setChanges={setChanges} />
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
