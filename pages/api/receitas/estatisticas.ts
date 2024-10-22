import { validateAuthenticationWithSession } from '@/utils/api'
import { NextApiHandler } from 'next'

const getRevenueStatsRoute: NextApiHandler<any> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
}
