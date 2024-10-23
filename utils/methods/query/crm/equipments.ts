import { TEquipment, TEquipmentDTO } from '@/utils/schemas/crm/equipments'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

async function fetchEquipment({ category }: { category?: TEquipment['categoria'] | null }) {
  try {
    const { data } = await axios.get(`/api/utils?identifier=EQUIPMENT&equipmentCategory=${category}`)
    return data.data as TEquipmentDTO[]
  } catch (error) {
    throw error
  }
}

export function useEquipments({ category }: { category?: TEquipment['categoria'] | null }) {
  return useQuery({
    queryKey: ['equipments', category],
    queryFn: async () => await fetchEquipment({ category }),
  })
}
