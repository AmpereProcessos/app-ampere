import { apiHandler } from '@/utils/api'
import { NextApiHandler } from 'next'

const handleContaAzulAuthorize: NextApiHandler<any> = async (req, res) => {
  const redirect_uri = 'https://app.ampereenergias.com.br/api/integracao/conta-azul/callback'

  const url = `https://api.contaazul.com/auth/authorize?redirect_uri=${redirect_uri}&client_id=${process.env.CONTAAZUL_CLIENT_ID}&scope=Sale&state=12345678`

  return res.redirect(url)
}

export default apiHandler({ GET: handleContaAzulAuthorize })
