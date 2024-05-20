import { TFileReferenceDTO } from '@/utils/schemas/crm/file-reference.schema'
import axios from 'axios'
import { useQuery } from 'react-query'

type UseFileReferencesByOpportunityIdParams = {
  opportunityId: string
}
async function fetchFileReferencesByOpportunityId({ opportunityId }: UseFileReferencesByOpportunityIdParams) {
  try {
    const { data } = await axios.get(`/api/crm/file-references?opportunityId=${opportunityId}`)
    return data.data as TFileReferenceDTO[]
  } catch (error) {
    throw error
  }
}

export function useFileReferencesByOpportunityId({ opportunityId }: UseFileReferencesByOpportunityIdParams) {
  return useQuery({
    queryKey: ['file-references-by-opportunity', opportunityId],
    queryFn: async () => await fetchFileReferencesByOpportunityId({ opportunityId }),
  })
}

async function fetchFileReferencesByAnalysisId({ analysisId }: { analysisId: string }) {
  try {
    const { data } = await axios.get(`/api/crm/file-references?analysisId=${analysisId}`)
    return data.data as TFileReferenceDTO[]
  } catch (error) {
    throw error
  }
}

export function useFileReferencesByAnalysisId({ analysisId }: { analysisId: string }) {
  return useQuery({
    queryKey: ['file-references-by-analysis', analysisId],
    queryFn: async () => await fetchFileReferencesByAnalysisId({ analysisId }),
  })
}

async function fetchFileReferencesByClientId({ clientId }: { clientId: string }) {
  try {
    const { data } = await axios.get(`/api/crm/file-references?clientId=${clientId}`)
    return data.data as TFileReferenceDTO[]
  } catch (error) {
    throw error
  }
}

export function useFileReferencesByClientId({ clientId }: { clientId: string }) {
  return useQuery({
    queryKey: ['file-references-by-client', clientId],
    queryFn: async () => await fetchFileReferencesByClientId({ clientId }),
  })
}

async function fetchFileReferencesByHomologationId({ homologationId }: { homologationId: string }) {
  try {
    const { data } = await axios.get(`/api/crm/file-references?homologationId=${homologationId}`)
    return data.data as TFileReferenceDTO[]
  } catch (error) {
    throw error
  }
}

export function useFileReferencesByHomologationId({ homologationId }: { homologationId: string }) {
  return useQuery({
    queryKey: ['file-references-by-homologation', homologationId],
    queryFn: async () => await fetchFileReferencesByHomologationId({ homologationId }),
  })
}
