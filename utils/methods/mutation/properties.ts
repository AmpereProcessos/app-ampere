import type {
  TCreateTemporaryUsageInput,
  TCreateTemporaryUsageOutput,
  TUpdatePropertyTemporaryUsageInput,
  TUpdatePropertyTemporaryUsageOutput,
} from '@/pages/api/propriedades/uso-temporario'
import type { TProperty } from '@/utils/schemas/properties'
import type { TPropertyUsageClientMetrics } from '@/utils/methods/uploading'
import axios from 'axios'

export const PROPERTY_USAGE_METRICS_HEADER = 'x-property-usage-client-metrics'

function getPropertyUsageRequestConfig(clientMetrics?: TPropertyUsageClientMetrics) {
  if (!clientMetrics) return undefined
  return {
    headers: {
      [PROPERTY_USAGE_METRICS_HEADER]: JSON.stringify(clientMetrics),
    },
  }
}

export async function createProperty({ info }: { info: TProperty }) {
  const { data } = await axios.post('/api/propriedades', info)
  if (typeof data.message !== 'string') return 'Propriedade criada com sucesso !'
  return data.message
}

export async function updateProperty({ id, changes }: { id: string; changes: Partial<TProperty> }) {
  const { data } = await axios.put(`/api/propriedades?id=${id}`, changes)
  if (typeof data.message !== 'string') return 'Atualização feita com sucesso !'
  return data.message
}

export async function createPropertyUsage({
  info,
  clientMetrics,
}: {
  info: TCreateTemporaryUsageInput
  clientMetrics?: TPropertyUsageClientMetrics
}) {
  const { data }: { data: TCreateTemporaryUsageOutput } = await axios.post(
    '/api/propriedades/uso-temporario',
    info,
    getPropertyUsageRequestConfig(clientMetrics)
  )
  return data
}

export async function updatePropertyUsage({
  id,
  changes,
  clientMetrics,
}: TUpdatePropertyTemporaryUsageInput & { clientMetrics?: TPropertyUsageClientMetrics }) {
  const { data }: { data: TUpdatePropertyTemporaryUsageOutput } = await axios.put(
    `/api/propriedades/uso-temporario?id=${id}`,
    {
      id,
      changes,
    },
    getPropertyUsageRequestConfig(clientMetrics)
  )
  return data
}
