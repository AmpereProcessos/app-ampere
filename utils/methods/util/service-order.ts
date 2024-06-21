import { TServiceOrderDTO } from '@/utils/schemas/service-order'

export function getObjectDifference(obj1: any, obj2: any, parentKey = '') {
  const diff = {}

  for (const key in obj2) {
    const currentKey = parentKey ? `${parentKey}.${key}` : key

    if (typeof obj2[key] === 'object' && obj2[key] !== null) {
      if (Array.isArray(obj2[key])) {
        // Handle arrays
        if (!Array.isArray(obj1[key])) {
          //@ts-ignore
          diff[currentKey] = obj2[key]
        } else {
          //@ts-ignore
          diff[currentKey] = obj2[key]
        }
      } else {
        // Handle nested objects
        const nestedDiff = getObjectDifference(obj1[key], obj2[key], currentKey)
        Object.assign(diff, nestedDiff)
      }
    } else if (!obj1 || obj1[key] !== obj2[key]) {
      //@ts-ignore
      diff[currentKey] = obj2[key]
    }
  }

  return diff
}

export function getObservationsGroupedByTopic(observations: TServiceOrderDTO['observacoes']) {
  const reduced = observations.reduce((acc: { [key: string]: string[] }, current) => {
    const topic = current.topico.toUpperCase()
    if (!acc[topic]) acc[topic] = []
    acc[topic].push(current.descricao)
    return acc
  }, {})
  return Object.entries(reduced).map(([topic, observations]) => ({ topico: topic, observacoes: observations }))
}

export function getServiceObservationsFromObras(str: string): TServiceOrderDTO['observacoes'] {
  return str.split('/').map((obs) => ({ topico: 'OBRA', descricao: obs }))
}
