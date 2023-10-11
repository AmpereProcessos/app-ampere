import axios from 'axios'
import connectToDatabase from '../../../../utils/crmDb'

export default async function handler(req, res) {
  if (req.method == 'PUT') {
    const { operation, email, value, reason } = req.body
    if (typeof operation != 'string') throw new createHttpError.BadRequest('Operação inválida.')
    if (operation != 'SALE' && operation != 'OPPORTUNITY_LOST') throw new createHttpError.BadRequest('Operação inválida')

    const crmDb = await connectToDatabase(process.env.CRM_KEY)
    const utilsCollection = crmDb.collection('utils')

    if (operation == 'SALE') {
      if (typeof email != 'string') throw new createHttpError.BadRequest('Tipo de email inválido.')
      if (typeof value != 'number') throw new createHttpError.BadRequest('Tipo de valor inválido.')
      const url = 'https://api.rd.services/platform/events?event_type=sale'
      const payload = {
        event_type: 'SALE',
        event_family: 'CDP',
        payload: {
          email: email,
          funnel_name: 'default',
          value: value,
        },
      }
      const token = await getToken({ collection: utilsCollection })

      const headers = {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
      }
      const rdResponse = await axios.post(url, payload, { headers: headers })
      if (rdResponse.status != 200) {
        const refreshedToken = await getRefreshedToken({ collection: utilsCollection })
        const newHeaders = {
          accept: 'application/json',
          'content-type': 'application/json',
          authorization: `Bearer ${refreshedToken}`,
        }
        await axios.post(url, payload, { headers: newHeaders })
        return res.status(201).json('Atualização feita com sucesso.')
      } else return res.status(200).json('Atualização feita com sucesso !')
    }
  }
}

async function getToken({ collection }) {
  try {
    const token = await collection.findOne({ identificador: 'RD_ACCESS_TOKEN' })
    if (token) return token.valor
    else throw new createHttpError.NotFound('Token não encontrado.')
  } catch (error) {
    throw error
  }
}
async function getRefreshedToken({ collection }) {
  try {
    const rdResponse = await axios.post('https://api.rd.services/auth/token', {
      client_id: process.env.RD_CLIENT_ID,
      client_secret: process.env.RD_CLIENT_SECRET,
      refresh_token: process.env.RD_REFRESH_TOKEN,
    })
    console.log('RD RESPONSE', rdResponse)
    if (rdResponse.status == 200) {
      const { access_token } = rdResponse.data
      console.log('NOVO ACESS_TOKEN', access_token)
      await collection.updateOne({ identificador: 'RD_ACCESS_TOKEN' }, { $set: { valor: access_token } })
      return access_token
    } else throw new createHttpError.InternalServerError('Erro ao buscar acess_token.')
  } catch (error) {
    throw error
  }
}
