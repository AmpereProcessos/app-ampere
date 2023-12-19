import axios, { AxiosError } from 'axios'
import createHttpError from 'http-errors'
import { getContractValue } from './util/projects'

export function errorHandler(err, res) {
  console.log('ERRO', err)
  if (createHttpError.isHttpError(err) && err.expose) {
    // Lidar com os erros lançados pelo módulo http-errors
    return res.status(err.statusCode).json({ error: { message: err.message } })
  } else {
    // Erro de servidor padrão 500
    return res.status(500).json({
      error: { message: 'Internal Server Error', err: err },
      status: createHttpError.isHttpError(err) ? err.statusCode : 500,
    })
  }
}
export function getErrorMessage(error) {
  console.log(error)
  if (createHttpError.isHttpError(error) && error.expose) return error.message
  if (error instanceof AxiosError) {
    const personalizedHttpError = error.response.data?.error
    if (personalizedHttpError) return personalizedHttpError.message
    else return error.message
  }
  if (error instanceof Error) {
    const msg = error.message
    return msg
  }
  return 'Houve um erro desconhecido, por favor, comunique o setor de tecnologia.'
}
async function updateProject({ idCRMProject, changes }) {
  try {
    const { data } = await axios.post(`/api/crm/updateProjects?projectId=${idCRMProject}`, {
      changes,
    })
    return 'ATUALIZAÇÕES DO PROJETO CRM BEM SUCEDIDAS !'
  } catch (error) {
    return 'HOUVE NA ATUALIZAÇÃO DO PROJETO CRM'
  }
}
async function updatePropose({ idCRMPropose, changes }) {
  try {
    const { data } = await axios.post(`/api/crm/updateProposes?proposeId=${idCRMPropose}`, {
      changes,
    })
    return 'ATUALIZAÇÕES DA PROPOSTA CRM BEM SUCEDIDAS !'
  } catch (error) {
    return 'HOUVE NA ATUALIZAÇÃO DO PROPOSTA CRM'
  }
}
export async function handleCRMProjectUpdatesAutomations({ projectId, idCRMProject, idCRMPropose, newData, previousData }) {
  if (!idCRMProject) return
  if (!newData || !previousData) return
  console.log('NOVOS DADOS', newData)
  console.log('ANTIGOS', previousData)
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
    await updateProject({ idCRMProject: idCRMProject, changes: changes })
    // if (idCRMPropose)
    //   await updatePropose({ idCRMPropose: idCRMPropose, changes: changes });
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
    await updateProject({ idCRMProject: idCRMProject, changes: changes })
  }
  // Checking for unsigning
  if (newData['contrato.status'] && newData['contrato.status'] != 'ASSINADO' && newData['contrato.status'] != 'RESCISÃO DE CONTRATO') {
    const changes = {
      contrato: null,
    }
    await updateProject({ idCRMProject: idCRMProject, changes: changes })
  }
}
export async function notifySellerInCRM(sellerName, idCRMProject, message) {
  if (!sellerName || !idCRMProject) return
  const apiResponse = await axios.post(`/api/crm/notifySeller?sellerName=${sellerName}&idCRMProject=${idCRMProject}`, {
    message: message,
  })

  return apiResponse
}
