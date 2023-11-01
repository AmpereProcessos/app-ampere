import axios from 'axios'

type UpdateProjectsComissionParams = {
  projects: {
    crmProjectId?: string
    projectId: string
    sellerCommission: number
    insiderCommission: number
  }[]
}
export async function updateAppProjectsComission({ projects }: UpdateProjectsComissionParams) {
  try {
    const { data } = await axios.post('/api/gestao/comissoes', { changes: projects })
    if (typeof data == 'string') return data
    else return 'Atualizações realizadas com sucesso.'
  } catch (error) {
    throw error
  }
}
export async function updateCRMProjectsComission({ projects }: UpdateProjectsComissionParams) {
  try {
    const { data } = await axios.put('/api/crm/projects', { changes: projects })
    if (typeof data == 'string') return data
    else return 'Atualizações realizadas com sucesso.'
  } catch (error) {
    throw error
  }
}
