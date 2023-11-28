import axios from 'axios'
import { updateProject } from './clients'
import { getContractValue } from '../util/projects'

export async function handleComercialProjectUpdate({ previousData, newData, changes }) {
  try {
    if (previousData.contrato.status == 'ASSINADO' && previousData.tipoDeServico == 'SISTEMA FOTOVOLTAICO' && !previousData.compra?.liberacao) {
      console.log('PASSEI AUQI')
      throw new Error('Confira a liberação para compra.')
    }

    const wasUnsigned = previousData.contrato.status != 'ASSINADO'
    const isSigned = newData.contrato.status == 'ASSINADO'
    if (wasUnsigned && isSigned) await notifySigning({ projectIdentifier: newData.qtde, projectName: newData.nomeDoContrato })

    // Handle automations for CRM
    const projectId = previousData._id
    const idCRMProject = previousData.idProjetoCRM
    const idCRMPropose = previousData.idPropostaCRM
    await handleCRMAutomation({ projectId, idCRMProject, idCRMPropose, newData: changes, previousData })

    // Update project
    await updateProject({ id: projectId, changes: changes })

    return 'Atualizações realizadas com sucesso !'
  } catch (error) {
    throw error
  }
}

async function notifySigning({ projectName, projectIdentifier }) {
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

  return
}

async function handleCRMAutomation({ projectId, idCRMProject, idCRMPropose, newData, previousData }) {
  if (!idCRMProject) return
  if (!newData || !previousData) return

  // Checking for signature event
  if (newData['contrato.status'] == 'ASSINADO' || !!newData['contrato.dataAssinatura']) {
    const changes = {
      contrato: {
        id: projectId,
        idProposta: idCRMPropose,
        dataAssinatura: newData['contrato.dataAssinatura'] ? newData['contrato.dataAssinatura'] : previousData.contrato?.dataAssinatura,
      },
      dataPerda: null,
      motivoPerda: null,
    }
    const rdIntegrationObject = {
      operation: 'SALE',
      email: previousData.email,
      value: getContractValue({
        projectValue: previousData.sistema?.valorProjeto,
        paValue: previousData.padrao?.valor,
        structureValue: previousData.estruturaPersonalizada?.valor,
      }),
    }
    if (previousData.email) {
      const crmResponse = await axios.put('/api/integracao/rd-station/opportunities', rdIntegrationObject)
      console.log('RESPONSE', crmResponse)
    }
    await updateCRMProject({ idCRMProject: idCRMProject, changes: changes })
    if (previousData.vendedor) await notifySellerInCRM(previousData.vendedor.nome, idCRMProject, 'CONTRATO ATUALIZADO COMO ASSINADO.')
    return
  }

  // Checking for rescission
  if (newData['contrato.status'] && newData['contrato.status'] == 'RESCISÃO DE CONTRATO') {
    const changes = {
      contrato: null,
      dataPerda: new Date().toISOString(),
      motivoPerda: 'RESCISÃO CONTRATUAL',
    }
    await updateCRMProject({ idCRMProject: idCRMProject, changes: changes })
  }
  // Checking for unsigning
  if (newData['contrato.status'] && newData['contrato.status'] != 'ASSINADO' && newData['contrato.status'] != 'RESCISÃO DE CONTRATO') {
    const changes = {
      contrato: null,
    }
    await updateCRMProject({ idCRMProject: idCRMProject, changes: changes })
  }
}

async function notifySellerInCRM(sellerName, idCRMProject, message) {
  if (!sellerName || !idCRMProject) return
  const apiResponse = await axios.post(`/api/crm/notifySeller?sellerName=${sellerName}&idCRMProject=${idCRMProject}`, {
    message: message,
  })
}

export async function updateCRMProject({ idCRMProject, changes }) {
  try {
    const { data } = await axios.post(`/api/crm/updateProjects?projectId=${idCRMProject}`, {
      changes,
    })
    return 'ATUALIZAÇÕES DO PROJETO CRM BEM SUCEDIDAS !'
  } catch (error) {
    return 'HOUVE NA ATUALIZAÇÃO DO PROJETO CRM'
  }
}
