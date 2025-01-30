import { apiHandler } from '@/utils/api'
import axios from 'axios'
import { NextApiHandler } from 'next'

const handleContaAzulAuthCallback: NextApiHandler<any> = async (req, res) => {
  const { code } = req.query
  const { state } = req.query

  if (!code || !state) return res.status(400).json({ error: 'Parâmetros inválidos.' })

  const redirect_uri = 'https://app.ampereenergias.com.br/api/integracao/conta-azul/callback'
  const headers = {
    Authorization: `Basic ${Buffer.from(`${process.env.CONTAAZUL_CLIENT_ID}:${process.env.CONTAAZUL_CLIENT_SECRET}`).toString('base64')}`,
  }
  const response = await axios.post(
    `https://api.contaazul.com/oauth2/token?grant_type=authorization_code&redirect_uri=${redirect_uri}&code=${code}`,
    {},
    { headers }
  )
  console.log('AUTHTOKEN RESPONSE', response.data)

  return res.status(200).json({ message: 'Autenticação realizada com sucesso !' })
}

export default apiHandler({ GET: handleContaAzulAuthCallback })
