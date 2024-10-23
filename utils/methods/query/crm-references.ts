import { TOpportunity, TOpportunityDTO } from '@/utils/schemas/crm-project'
import { TSolarSystemPropose, TSolarSystemProposeDTO } from '@/utils/schemas/proposes/solar-system.schema'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

export type TCRMReferences = {
  opportunity: TOpportunityDTO | null
  propose: TSolarSystemProposeDTO | null
}
type ReferencesQuery = { proposeId: string; opportunityId: string }
async function fetchReferences({ proposeId, opportunityId }: ReferencesQuery) {
  try {
    const { data } = await axios.get(`/api/crm/reference?proposeId=${proposeId}&opportunityId=${opportunityId}`)
    return data.data as TCRMReferences
  } catch (error) {
    throw error
  }
}

export function useCRMReferences({ proposeId, opportunityId }: ReferencesQuery) {
  return useQuery({
    queryKey: ['crm-references', proposeId, opportunityId],
    queryFn: async () => await fetchReferences({ proposeId, opportunityId }),
  })
}
