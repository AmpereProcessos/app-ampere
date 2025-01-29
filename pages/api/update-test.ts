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
      return {
        updateMany: {
          filter: { 'projeto.id': project._id.toString() },
          update: {
            $set: {
              'projeto.contratoDataAssinatura': project.contrato?.dataAssinatura,
              'projeto.compraEntregaDataPrevisao': project.compra?.previsaoEntrega,
              'projeto.compraEntregaDataEfetivacao': project.compra?.dataEntrega,
              'projeto.homologacaoAcessoDataResposta': project.homologacao?.acesso.dataResposta,
              'projeto.homologacaoVistoriaDataEfetivacao': project.homologacao?.vistoria.dataEfetivacao,
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
