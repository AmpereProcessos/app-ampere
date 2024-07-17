import { TFileReference } from '@/utils/schemas/crm/file-reference.schema'
import axios from 'axios'

export async function createFileReference({ info }: { info: TFileReference }) {
  try {
    const { data } = await axios.post('/api/crm/file-references', info)
    if (typeof data.data != 'string') return 'Arquivo anexado com sucesso !'
    return data.data as string
  } catch (error) {
    throw error
  }
}

export async function createManyFileReferences({ info }: { info: TFileReference[] }) {
  try {
    if (info.length == 0) return
    const { data } = await axios.post('/api/crm/file-references/many', info)
    if (typeof data.data != 'string') return 'Arquivos anexados com sucesso !'
    return data.data as string
  } catch (error) {
    throw error
  }
}
