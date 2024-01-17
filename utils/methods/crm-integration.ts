import axios from 'axios'

type NotifySellerParams = {
  sellerName: string
  idCRMProject: string
  message: string
}
export async function notifySeller({ sellerName, idCRMProject, message }: NotifySellerParams) {
  try {
    if (!sellerName || !idCRMProject) return
    const apiResponse = await axios.post(`/api/crm/notifySeller?sellerName=${sellerName}&idCRMProject=${idCRMProject}`, {
      message: message,
    })
    return 'Vendedores notificados !'
  } catch (error) {
    throw error
  }
}

type UpdateCRMProject = {
  idCRMProject: string
  changes: { [key: string]: any }
}
export async function updateCRMProject({ idCRMProject, changes }: UpdateCRMProject) {
  try {
    const { data } = await axios.post(`/api/crm/updateProjects?projectId=${idCRMProject}`, {
      changes,
    })
    return 'ATUALIZAÇÕES DO PROJETO CRM BEM SUCEDIDAS !'
  } catch (error) {
    throw new Error('HOUVE NA ATUALIZAÇÃO DO PROJETO CRM')
  }
}
