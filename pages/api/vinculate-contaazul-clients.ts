import { NextApiHandler } from 'next'
import connectToDatabase from '@/utils/services/mongodb/projects'
import connectToCRMDatabase from '@/utils/services/mongodb/crm/main'
import { TClient } from '@/utils/schemas/crm/client.schema'
import { formatToCPForCNPJ, formatWithoutDiacritics } from '@/utils/methods/formatting'
import { apiHandler } from '@/utils/api'
import { ObjectId } from 'mongodb'

const handleContaAzulClientVinculation: NextApiHandler<any> = async (req, res) => {
  const db = await connectToCRMDatabase()
  const clientsCollection = db.collection<TClient>('clients')

  const clients = await clientsCollection.find({}).toArray()

  const clientsWithCA = clients
    .map((client) => {
      const equivalentCAClient = [].find(
        (c) =>
          (!!c.document && formatToCPForCNPJ(c.document) == client.cpfCnpj) ||
          formatWithoutDiacritics(c.name, true) == formatWithoutDiacritics(client.nome, true)
      )

      if (!equivalentCAClient) return null
      return {
        client: {
          id: client._id.toString(),
          nome: client.nome,
        },
        contaAzulClient: {
          id: equivalentCAClient?.id,
          nome: equivalentCAClient?.name,
        },
      }
    })
    .filter((c) => !!c)

  const duplicated = Object.values(
    clientsWithCA.reduce((acc: { [key: string]: string[] }, current) => {
      if (!acc[current.contaAzulClient.id]) acc[current.contaAzulClient.id] = []

      acc[current.contaAzulClient.id].push(current.client.id)
      return acc
    }, {})
  ).filter((d) => d.length > 1)
  return res.status(200).json(duplicated)
}

export default apiHandler({
  GET: handleContaAzulClientVinculation,
})
