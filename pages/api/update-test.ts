import { NextApiHandler } from 'next'
import connectToProjectsDatabase from '@/utils/services/mongodb/projects'
import { TProject } from '@/utils/schemas/projects'
import { TServiceOrder } from '@/utils/schemas/service-order'
import { apiHandler } from '@/utils/api'

const handleUpdateTest: NextApiHandler<any> = async (req, res) => {
  const appDb = await connectToProjectsDatabase()
  const projectsCollection = appDb.collection<TProject>('dados')
  const serviceOrdersCollection = appDb.collection<TServiceOrder>('ordensDeServico')

  const projects = await projectsCollection.find({}).toArray()

  const serviceOrdersBulkwriteArr = projects
    .map((project) => {
      const deliveryDateExpectation = project.compra.previsaoEntrega
      const deliveryDateEffectivation = project.compra.dataEntrega
      if (!deliveryDateExpectation && !deliveryDateEffectivation) return null
      return {
        updateMany: {
          filter: { categoria: 'MONTAGEM', 'projeto.id': project._id.toString() },
          update: {
            $set: {
              dataPrevisaoLiberacao: deliveryDateExpectation,
              dataLiberacao: deliveryDateEffectivation,
            },
          },
        },
      }
    })
    .filter((b) => !!b)

  const bulkwriteResponse = await serviceOrdersCollection.bulkWrite(serviceOrdersBulkwriteArr)
  return res.status(200).json(bulkwriteResponse)
}

export default apiHandler({
  GET: handleUpdateTest,
})
