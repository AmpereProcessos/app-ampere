import axios from 'axios'

export default async function handler(req, res) {
  if (req.method == 'GET') {
    const { destination, origin } = req.query

    const removeAccents = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    const fixedDestination = removeAccents(destination)
    const fixedOrigin = removeAccents(origin)
    const url = `https://maps.googleapis.com/maps/api/integracao/google-apis/distancematrix/json?origins=${fixedOrigin}&destinations=${fixedDestination}&departure_time=now&key=${process.env.DISTANCE_API}`

    try {
      const { data } = await axios.post(url, {})

      res.json(data)
    } catch (error) {
      res.json(error)
    }
  }
}
