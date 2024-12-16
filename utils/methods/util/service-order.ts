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
  if (!Array.isArray(observations)) return []
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

export function getAvailableProjectMaterials(str: string) {
  const availableMaterialTextSplitted = str.split('\n')
  const materialsList = availableMaterialTextSplitted
    .map((i) => {
      const materialInfo = i.split('-')

      // obtaining the material qty and desc via arr position
      const materialQty = materialInfo[0] ? Number(materialInfo[0].trim()) : null
      const materialDesc = materialInfo[1] ? materialInfo[1] : null

      // in case the material qty or desc is present, return the material object
      if (materialQty || materialDesc)
        return {
          qtde: materialQty,
          descricao: materialDesc || 'MATERIAL NÃO IDENTIFICADO',
        }
      // in case neither the qty or the desc is present, return null
      return null
    })
    // filtering out the null values
    .filter((x) => !!x)
  return materialsList
}

export function getMissingProjectMaterials(str: string) {
  const missingMaterialTextSplitted = str.split('\n')
  const materialsList = missingMaterialTextSplitted
    .map((i) => {
      const materialInfo = i.split('-')

      // obtaining the material qty and desc via arr position
      const materialQty = materialInfo[0] ? Number(materialInfo[0].trim()) : null
      const materialDesc = materialInfo[1] ? materialInfo[1] : null

      // in case the material qty or desc is present, return the material object
      if (materialQty || materialDesc)
        return {
          qtde: materialQty,
          descricao: materialDesc || 'MATERIAL NÃO IDENTIFICADO',
        }
      // in case neither the qty or the desc is present, return null
      return null
    })
    // filtering out the null values
    .filter((x) => !!x)
  return materialsList
}
