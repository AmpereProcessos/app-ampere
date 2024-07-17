import { THomologation, THomologationDTO } from '@/utils/schemas/crm/homologation.schema'
import axios from 'axios'

export async function createHomologation({ info, returnId }: { info: THomologation; returnId: boolean }) {
  try {
    const { data } = await axios.post('/api/crm/homologations', info)

    if (returnId) return data.data?.insertedId as string
    if (typeof data.message != 'string') return 'Homologação criada com sucesso !'
    return data.message as string
  } catch (error) {
    throw error
  }
}

export async function editHomologation({ id, changes }: { id: string; changes: Partial<THomologationDTO> }) {
  try {
    const { data } = await axios.put(`/api/crm/homologations?id=${id}`, changes)
    if (typeof data.message != 'string') return 'Homologação atualizada com sucesso !'
    return data.message as string
  } catch (error) {
    throw error
  }
}
