import React, { useState } from 'react'
import { fornecedores, oemPlans, reportsByPlan, statusObra, tiposDeEstruturas, vendedores } from '../utils/constants'
import { FaSave } from 'react-icons/fa'
import { VscChromeClose } from 'react-icons/vsc'
import TextInput from './TextInput'
import SelectInput from './SelectInput'
import DateInput from './DateInput'
import NumberInput from './NumberInput'
import NotificationCreationBlock from './NotificationCreationBlock'
import Link from 'next/link'
import axios from 'axios'
import dayjs from 'dayjs'
import OSCreationBlock from './OSCreationBlock'
import { equipesTecnicas } from '../utils/constants'
import { useKey } from '../utils/hooks'
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
import SaveButton from './utils/Buttons/SaveButton'
import ProjectServiceOrders from './identificador/ordensDeServico/ProjectServiceOrders'
import ExecutionCommissioningBlock from './blocosInfoProjeto/InfoComissionamentoBlock'
import OeMBlock from './blocosInfoProjeto/InfoOeMBlock'
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
function formataCPF(cpf) {
  //retira os caracteres indesejados...
  cpf = cpf.replace(/[^\d]/g, '')
  //realizar a formatação...
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}
function formataCEP(cep) {
  cep = cep
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{3})\d+?$/, '$1')

  return cep
}
function ModalOeM({ open, setModalIsOpen, modalIsOpen, project, editor, handleUpdates, credentials, users }) {
  useKey('Escape', () => setModalIsOpen(false))

  const [infoHolder, setInfo] = useState(project)
  const [msg, setMsg] = useState('')
  const [changes, setChanges] = useState({})
  const [osInfo, setOsInfo] = useState({
    categoria: 'NÃO DEFINIDO',
    servicoExecutado: '',
    realizarCobranca: false,
    valorCobranca: 0,
    usuarioEmissor: '',
    grauDeUrgencia: 'NÃO DEFINIDO',
    observacoes: '',
    dataDeAbertura: new Date().toISOString(),
    agendar: false,
  })
  const [osMsg, setOsMsg] = useState({
    text: '',
    color: 'text-red-500',
  })
  function handleOSCreation() {
    var arr
    if (!credentials?.controller) {
      setOsMsg({
        text: 'Usuário não autorizado para geração de OSs.',
        color: 'text-red-500',
      })
    } else {
      if (osInfo.servicoExecutado.trim().length < 5) {
        setOsMsg({
          text: 'Por favor, preencha o serviço a ser executado.',
          color: 'text-red-500',
        })
        return
      } else {
        if (infoHolder.ordensDeServico != undefined && infoHolder.ordensDeServico?.length > 0) {
          infoHolder.ordensDeServico.push({
            ...osInfo,
            usuarioEmissor: credentials?.name,
            index: infoHolder.ordensDeServico?.length,
            cobrancaRealizada: false,
          })
          arr = infoHolder.ordensDeServico
        } else {
          arr = [
            {
              ...osInfo,
              usuarioEmissor: credentials?.name,
              index: 0,
              cobrancaRealizada: false,
            },
          ]
          infoHolder.ordensDeServico = arr
        }
        axios.post('/api/ordensDeServico', { id: project._id, arr: arr }).then((res) => {
          setOsMsg({
            text: 'Ordem de serviço gerada',
            color: 'text-green-500',
          })
          setOsInfo({
            categoria: 'NÃO DEFINIDO',
            servicoExecutado: '',
            realizarCobranca: false,
            valorCobranca: 0,
            usuarioEmissor: '',
            grauDeUrgencia: 'NÃO DEFINIDO',
            observacoes: '',
            dataDeAbertura: new Date().toISOString(),
            agendar: false,
          })
          handleUpdates(project._id)
        })
      }
    }
  }
  async function handleChanges() {
    axios.post(`/api/projects/update/${project._id}`, changes).then((res) => {
      setMsg('Alterações feitas')
      handleUpdates(project._id)
    })
  }
  console.log(changes)
  return (
    <>
      <AnimatedModalWrapper modalIsOpen={modalIsOpen}>
        <div className="flex flex-col h-full overflow-y-auto overscroll-y-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between px-2 text-lg pb-2 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <h1 className="text-[#15599a] pl-6  font-bold">
                {infoHolder.qtde} - {infoHolder.nomeDoContrato}
              </h1>
              {infoHolder.codigoSVB && <p className="text-gray-600 text-sm font-bold">#{infoHolder.codigoSVB}</p>}
            </div>

            <div className="flex gap-x-2 items-center">
              {msg && <p className="text-sm italic text-green-400">{msg}</p>}
              <SaveButton text={'Salvar alterações'} icon={<FaSave />} handleClick={handleChanges} />
              <button>
                <VscChromeClose onClick={() => setModalIsOpen(false)} style={{ color: 'red' }} />
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-y-2 h-full overflow-y-auto overscroll-y-auto">
            <NotificationCreationBlock nomeDoProjeto={project.nomeDoContrato} codProjeto={project.qtde} />

            <InfoClienteBlock editor={false} infoHolder={infoHolder} setInfo={setInfo} changes={changes} setChanges={setChanges} project={project} />
            <ExecutionCommissioningBlock
              editor={true}
              infoHolder={infoHolder}
              setInfo={setInfo}
              changes={changes}
              setChanges={setChanges}
              project={project}
            />
            <OeMBlock editor={true} infoHolder={infoHolder} setInfo={setInfo} changes={changes} setChanges={setChanges} project={project} />
            <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg px-2">
              <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">ORDENS DE SERVIÇO</span>
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
                handleUpdates={handleUpdates}
                project={project}
              />
            ) : null}

            {project.tipoDeServico != 'OPERAÇÃO E MANUTENÇÃO' ? (
              <InfoObrasBlock editor={false} infoHolder={infoHolder} setInfo={setInfo} changes={changes} setChanges={setChanges} project={project} />
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
              handleUpdates={handleUpdates}
            />
          </div>
        </div>
      </AnimatedModalWrapper>
    </>
  )
}

export default ModalOeM
