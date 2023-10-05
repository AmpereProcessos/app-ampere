import axios from 'axios'

export async function updateProject({ id, changes }) {
  try {
    const { data: response } = await axios.post(`/api/projects/update/${id}`, changes)
    return response
  } catch (error) {
    throw error
  }
}
