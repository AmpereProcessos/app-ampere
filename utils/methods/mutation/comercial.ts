import axios from 'axios'
import { updateProject } from './clients'
import { getContractValue } from '../util/projects'
import { createRevenue } from '../../../utils/methods/mutation/revenues'
import { TProjectDTO } from '@/utils/schemas/projects'
import { notifySeller, updateCRMProject } from '../crm-integration'
import { QueryClient } from 'react-query'

type HandleComercialUpdateProps = {
  previousData: TProjectDTO
  newData: TProjectDTO
  changes: { [key: string]: any }
  queryClient: QueryClient
}
export async function handleComercialUpdate({ previousData, newData, changes, queryClient }: HandleComercialUpdateProps) {
  const projectId = previousData._id
  const idCRMProject = newData.idProjetoCRM
  const serviceType = newData.tipoDeServico

  const previousContractStatus = previousData.contrato.status
  const wasSigned = previousContractStatus == 'ASSINADO'
  const wasUnsigned = !wasSigned

  const newContractStatus = newData.contrato.status
  const isSigned = newContractStatus == 'ASSINADO'
  const isReleasedForPurchase = !!newData.compra.liberacao

  try {
    // const wasUnsigned = previousData.contrato.status != 'ASSINADO'
    // const isSigned = newData.contrato.status == 'ASSINADO'
    if (wasUnsigned && isSigned) {
      console.log('PASSED IN SIGNING CHANGE')
      await notifyContractSigning({ projectIdentifier: newData.qtde, projectName: newData.nomeDoContrato })
      await generateContractRevenue({ data: newData, queryClient })
    }

    // Handle automations for CRM
    if (idCRMProject) await handleCRMAutomation({ previousData, newData })

    // Update project
    await updateProject({ id: projectId, changes: changes })

    return 'Atualizações realizadas com sucesso !'
  } catch (error) {
    throw error
  }
}

type NotifyContractSigningParams = {
  projectName: string
  projectIdentifier: string | number
}
async function notifyContractSigning({ projectName, projectIdentifier }: NotifyContractSigningParams) {
  // Defining users to notify and the respective notification object
  const usersToNotifyArr = [
    {
      destinatario: '6353eb83ef4e1a367a877949',
      remetente: 'SISTEMA',
      mensagem: `Contrato atualizado para ASSINADO.`,
      projetoReferencia: projectIdentifier,
      nomeDoProjeto: projectName,
    },
    {
      destinatario: '64638b6c2071c508968bdf08',
      remetente: 'SISTEMA',
      mensagem: `Contrato atualizado para ASSINADO.`,
      projetoReferencia: projectIdentifier,
      nomeDoProjeto: projectName,
    },
  ]
  // Dealing with all the promises
  const notifyPromises = usersToNotifyArr.map(async (obj) => {
    await axios.post('/api/notificacoes/1', obj)
  })
  Promise.all(notifyPromises)

  return 'Notificações criadas com sucesso !'
}
type GenerateContractRevenueParams = {
  data: TProjectDTO
  queryClient: QueryClient
}
async function generateContractRevenue({ data, queryClient }: GenerateContractRevenueParams) {
  try {
    const revenue = {
      nome: `CONTRATO DE ${data.nomeDoContrato}`,
      tipo: data.tipoDeServico,
      autor: {
        id: '',
        nome: 'SISTEMA',
        avatar_url: null,
      },
      projeto: {
        id: data._id,
        nome: data.nomeDoContrato,
        identificador: data.qtde,
      },
      total: getContractValue({
        projectValue: data.sistema.valorProjeto,
        structureValue: data.estruturaPersonalizada.valor,
        paValue: data.padrao.valor,
      }),
      metodo: data.pagamento.forma == 'FINANCIAMENTO' ? 'FINANCIAMENTO' : 'À VISTA (GERAL)',
      efetivacao: {
        efetivado: true,
        data: data.contrato.dataAssinatura,
      },
      fracionamento: [],
      dataInsercao: new Date().toISOString(),
    }
    await createRevenue({ info: revenue })
    await queryClient.invalidateQueries({ queryKey: ['activities-by-project', data._id] })
  } catch (error) {
    throw error
  }
}

type HandleCRMAutomationsParams = {
  previousData: TProjectDTO
  newData: TProjectDTO
}
async function handleCRMAutomation({ previousData, newData }: HandleCRMAutomationsParams) {
  const projectId = previousData._id
  const idCRMProject = newData.idProjetoCRM as string
  const idCRMPropose = newData.idPropostaCRM
  const email = newData.email
  const sellerName = newData.vendedor.nome
  const projectValue = newData.sistema?.valorProjeto || 0
  const paValue = newData.padrao?.valor || 0
  const structureValue = newData.estruturaPersonalizada?.valor || 0
  const contractValue = getContractValue({ projectValue, structureValue, paValue })
  const previousContractStatus = previousData.contrato.status
  const wasSigned = previousContractStatus == 'ASSINADO'
  const wasUnsigned = !wasSigned

  const newContractStatus = newData.contrato.status
  const isSigned = newContractStatus == 'ASSINADO'
  const signatureDate = newData.contrato.dataAssinatura
  const isTerminated = newContractStatus == 'RESCISÃO DE CONTRATO'
  // Checking for signature event
  if (wasUnsigned && isSigned && !!signatureDate) {
    // Update  crm project
    const changes = { contrato: { id: projectId, idProposta: idCRMPropose, dataAssinatura: signatureDate }, dataPerda: null, motivoPerda: null }
    await updateCRMProject({ idCRMProject: idCRMProject, changes: changes })
    await notifySeller({ sellerName, idCRMProject, message: 'CONTRATO ATUALIZADO COMO ASSINADO.' })
    const rdSaleNotification = { operation: 'SALE', email: email, value: contractValue }
    if (email) await notifyRDStationWin({ info: rdSaleNotification })

    return 'Automações de assinatura realizadas.'
  }
  // Checking for rescission
  if (isTerminated) {
    console.log('PASSED IN CONTRACT TERMINATION')
    const changes = { contrato: null, dataPerda: new Date().toISOString(), motivoPerda: 'RESCISÃO CONTRATUAL' }
    await updateCRMProject({ idCRMProject: idCRMProject, changes: changes })
    return 'Automações de rescisão contratual realizadas.'
  }
  // Checking for unsigning
  if (wasSigned && !isSigned && !isTerminated) {
    console.log('PASSED IN CONTRACT UNSIGNING')
    const changes = { contrato: null }
    await updateCRMProject({ idCRMProject: idCRMProject, changes: changes })
    return 'Automações de dessasinatura realizadas.'
  }
  return 'Automações de CRM concluídas.'
}

async function notifyRDStationWin({ info }: { info: any }) {
  try {
    await axios.put('/api/integracao/rd-station/opportunities', info)
  } catch (error) {
    throw error
  }
}

// async function notifySellerInCRM(sellerName, idCRMProject, message) {
//   if (!sellerName || !idCRMProject) return
//   const apiResponse = await axios.post(`/api/crm/notifySeller?sellerName=${sellerName}&idCRMProject=${idCRMProject}`, {
//     message: message,
//   })
// }

// export async function updateCRMProject({ idCRMProject, changes }) {
//   try {
//     const { data } = await axios.post(`/api/crm/updateProjects?projectId=${idCRMProject}`, {
//       changes,
//     })
//     return 'ATUALIZAÇÕES DO PROJETO CRM BEM SUCEDIDAS !'
//   } catch (error) {
//     return 'HOUVE NA ATUALIZAÇÃO DO PROJETO CRM'
//   }
// }
