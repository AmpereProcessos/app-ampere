import { TOpportunity } from '@/utils/schemas/crm/opportunity.schema'
import axios from 'axios'

export async function updateOpportunity({ id, changes }: { id: string; changes: Partial<TOpportunity> }) {
  try {
    const { data } = await axios.put(`/api/crm/opportunities?id=${id}`, changes)
    if (typeof data.message != 'string') return 'Oportunidade atualizada com sucesso !'
    return data.message as string
  } catch (error) {
    throw error
  }
}
