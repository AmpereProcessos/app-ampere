import axios from 'axios'

export async function handleUpdateClientPersonalized({ id, changes }: { id: string; changes: any }) {
  try {
    const { data } = await axios.put(`/api/crm/clients/personalized?id=${id}`, changes)
    if (typeof data.message != 'string') throw new Error('Oops, houve um erro desconhecido ao atualizar cliente.')
    return data.message as string
  } catch (error) {
    throw error
  }
}
