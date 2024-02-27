import { TFileReferenceDTO } from '@/utils/schemas/file-reference.schema'
import axios from 'axios'
import { useQuery } from 'react-query'

async function fetchFileReferencesByUserId({ id }: { id: string }) {
  try {
    const { data } = await axios.get(`/api/referencias-arquivos?userId=${id}`)
    return data.data as TFileReferenceDTO[]
  } catch (error) {
    throw error
  }
}

export function useFileReferencesByUserId({ id }: { id: string }) {
  return useQuery({
    queryKey: ['file-references-by-user-id', id],
    queryFn: async () => await fetchFileReferencesByUserId({ id }),
  })
}
