import { TProject } from '@/utils/schemas/projects'
import { TBirthdayRecord } from '@/utils/schemas/stats'
import axios from 'axios'
import { useState } from 'react'
import { useQuery } from 'react-query'

export async function fetchClients() {
  const { data } = await axios.get('/api/projects/todos')
  if (!data) return []
  if (!Array.isArray(data)) return []
  return data as TProject[]
}

export function useClients(enabled: boolean) {
  return useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients,
    refetchOnWindowFocus: false,
    enabled: !!enabled,
  })
}
async function fetchClientById({ id }: { id: string }) {
  try {
    const { data } = await axios.get(`/api/projects/fetchDoc/${id}`)
    return data[0]
  } catch (error) {
    throw error
  }
}
export function useClientById({ enabled, id }: { enabled: boolean; id: string }) {
  return useQuery({
    queryKey: ['project-by-id', id],
    queryFn: async () => await fetchClientById({ id }),
    enabled: !!enabled,
    refetchOnWindowFocus: false,
    retry: 1,
  })
}

async function fetchBirthDays() {
  try {
    const { data } = await axios.get('/api/stats/clients-birthday')
    return data as TBirthdayRecord[]
  } catch (error) {
    throw error
  }
}

type UseBirthdaysFilters = {
  name: string
  isToday: boolean
}
export function useClientsBirthdays() {
  const [filters, setFilters] = useState<UseBirthdaysFilters>({
    name: '',
    isToday: false,
  })
  function matchIsToday(birthday: TBirthdayRecord) {
    if (!filters.isToday) return true
    const birthdayDate = new Date(birthday.dataNascimento).getDate()
    const todayDate = new Date().getDate()
    return birthdayDate == todayDate
  }
  function matchName(birthday: TBirthdayRecord) {
    if (filters.name.trim().length == 0) return true
    return birthday.nome.toUpperCase().includes(filters.name.toUpperCase())
  }
  function handelModelData(data: TBirthdayRecord[]) {
    var modeledData = data
    return modeledData.filter((birthday) => matchIsToday(birthday) && matchName(birthday))
  }
  return {
    ...useQuery({
      queryKey: ['clients-birthdays'],
      queryFn: fetchBirthDays,
      select: (data) => handelModelData(data),
    }),
    filters,
    setFilters,
  }
}
