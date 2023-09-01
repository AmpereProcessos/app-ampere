import axios from 'axios'

export async function saveCallChanges({ id, changes }) {
  try {
    const { data } = await axios.put(`/api/calls/pps/mainData?id=${id}`, { changes: changes })
    console.log(data)
    return data
  } catch (error) {
    throw error
  }
}
