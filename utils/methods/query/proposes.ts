import { TSolarSystemProposeDTO } from '@/utils/schemas/proposes/solar-system.schema'
import axios from 'axios'

async function fetchProposeByID({ id }: { id: string }) {
  try {
    const { data } = await axios.get(`/api/crm/proposes?id=${id}`)
    return data.data as TSolarSystemProposeDTO[]
  } catch (error) {
    throw error
  }
}
