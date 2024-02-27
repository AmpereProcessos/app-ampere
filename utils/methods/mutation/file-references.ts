import { TFileReference } from '@/utils/schemas/file-reference.schema'
import axios from 'axios'

export async function createFileReference({ info }: { info: TFileReference }) {
  try {
    const { data } = await axios.post('/api/referencias-arquivos', info)
    if (typeof data.data != 'string') return 'Arquivo anexado com sucesso !'
    return data.data as string
  } catch (error) {
    throw error
  }
}
