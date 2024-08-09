import connectToAppDatabase from '../../../utils/services/mongodb/projects'
import { calculateStringSimilarity } from '../../../utils/constants'
import connectToCRMDatabase from '../../../utils/services/mongodb/crm/main'
import { errorHandler } from '../../../utils/methods/handlers'
import { getContractValue } from '../../../utils/methods/util/projects'
import createHttpError from 'http-errors'
import { Collection, Db, ObjectId, WithId } from 'mongodb'
import { NextApiRequest, NextApiResponse } from 'next'
import { TProject } from '@/utils/schemas/projects'
import { TUser } from '@/utils/schemas/crm/user.schema'
import { z } from 'zod'
import { TOpportunity } from '@/utils/schemas/crm/opportunity.schema'

const DateQuerySchema = z.object({
  after: z
    .string({ required_error: 'Parâmetros de período inválidos.', invalid_type_error: 'Parâmetros de período inválidos.' })
    .datetime({ message: 'Parâmetros de período inválidos.' }),
  before: z
    .string({ required_error: 'Parâmetros de período inválidos.', invalid_type_error: 'Parâmetros de período inválidos.' })
    .datetime({ message: 'Parâmetros de período inválidos.' }),
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method == 'GET') {
    try {
      const { after, before } = DateQuerySchema.parse(req.query)
      const appDb: Db = await connectToAppDatabase(process.env.DB_KEY, 'projetos')
      const appProjectsCollection: Collection<TProject> = appDb.collection('dados')

      const crmDb = await connectToCRMDatabase(process.env.DB_KEY)
      const crmUsersCollection: Collection<TUser> = crmDb.collection('users')
      const crmProjectsCollection: Collection<TOpportunity> = crmDb.collection('opportunities')

      const crmUsers = await crmUsersCollection.find({}).toArray()

      const crmProjects = await crmProjectsCollection.find({ 'ganho.data': { $ne: null } }).toArray()
      const projects = await getFilteredProjects({ collection: appProjectsCollection, after, before })
      const commissionInfo = projects.map((project) => {
        const crmOpportunity = crmProjects.find((crmProject) => crmProject._id.toString() == project.idProjetoCRM)
        const crmOpportunityResponsibles = crmOpportunity?.responsaveis || []
        const crmSeller = crmOpportunityResponsibles.find((r) => r.papel == 'VENDEDOR')
        const crmSDR = crmOpportunityResponsibles.find((r) => r.papel == 'SDR')
        console.log(crmSeller, crmSDR)
        const sellerUserInfo = crmUsers.find((user) => crmSeller?.id == user._id.toString())
        const sdrUserInfo = crmUsers.find((user) => crmSDR?.id == user._id.toString())

        // Defining commission values
        var commission = {
          seller: 0,
          insider: 0,
        }
        const comissionPaid = !!project.comissoes?.pagamentoRealizado
        const comissionDefined = !!project.comissoes?.efetivado
        const definedSellerCommission = project.comissoes?.porcentagemVendedor
        const definedInsiderCommission = project.comissoes?.porcentagemInsider
        // In case one of the commission values is already defined, use them
        if (typeof definedSellerCommission == 'number' && typeof definedInsiderCommission == 'number') {
          commission.seller = definedSellerCommission || 0
          commission.insider = definedInsiderCommission || 0
        } else {
          // Else, use commission values defined in CRM for the responsible and representative
          commission = getCRMCommissionValues({ sellerUserInfo, sdrUserInfo })
        }
        return {
          id: project._id,
          idProjetoCRM: project.idProjetoCRM,
          nome: project.nomeDoContrato,
          tipoServico: project.tipoDeServico,
          identificador: project.qtde,
          identificadorCRM: project.codigoSVB,
          cidade: project.cidade,
          vendedor: project.vendedor.nome,
          insider: project.insider,
          dataAssinatura: project.contrato?.dataAssinatura,
          dataRecebimentoParcial: project.compra?.dataPagamento,
          potenciaPico: project.sistema?.potPico,
          valorProjeto: project.sistema?.valorProjeto,
          valorPadrao: project.padrao?.valor,
          valorContrato: getContractValue({
            projectValue: project.sistema?.valorProjeto,
            paValue: project.padrao?.valor,
            structureValue: 0,
          }),
          comissoes: {
            efetivado: comissionDefined,
            pagamentoRealizado: comissionPaid,
            vendedor: commission.seller,
            insider: commission.insider,
          },
        }
      })
      res.status(200).json(commissionInfo)
    } catch (error) {
      console.log(error)
      errorHandler(error, res)
    }
  }
  if (req.method == 'POST') {
    try {
      const { changes } = req.body
      if (!changes || typeof changes != 'object' || !Array.isArray(changes))
        throw new createHttpError.BadRequest('Formato das alterações não é compatível.')

      const appDb = await connectToAppDatabase(process.env.DB_KEY, 'projetos')
      const appProjectsCollection = appDb.collection('dados')
      const crmDb = await connectToCRMDatabase(process.env.CRM_KEY)
      const crmProjectsCollection = crmDb.collection('projects')
      console.log('CHANGES', changes)
      await updateAppProjectsComission({ collection: appProjectsCollection, changes })

      res.status(200).json('Atualizações feitas com sucesso !')
    } catch (error) {
      errorHandler(error, res)
    }
  }
}

type GetFilteredProjectsParams = {
  collection: Collection<TProject>
  after: string
  before: string
}
async function getFilteredProjects({ collection, after, before }: GetFilteredProjectsParams) {
  try {
    const projects = await collection
      .aggregate([
        {
          $match: {
            'contrato.status': 'ASSINADO',
            $or: [
              {
                tipoDeServico: { $in: ['SISTEMA FOTOVOLTAICO', 'AUMENTO DE SISTEMA FOTOVOLTAICO'] },
                $and: [{ 'compra.dataPagamento': { $gte: after } }, { 'compra.dataPagamento': { $lte: before } }],
              },
              {
                tipoDeServico: { $nin: ['SISTEMA FOTOVOLTAICO', 'AUMENTO DE SISTEMA FOTOVOLTAICO'] },
                $and: [{ 'contrato.dataAssinatura': { $gte: after } }, { 'contrato.dataAssinatura': { $lte: before } }],
              },
              // {
              //   tipoDeServico: { $ne: 'OPERAÇÃO E MANUTENÇÃO' },
              //   $and: [{ 'compra.dataPagamento': { $gte: after } }, { 'compra.dataPagamento': { $lte: before } }],
              // },
              // {
              //   tipoDeServico: {
              //     $in: ['OPERAÇÃO E MANUTENÇÃO', 'MONTAGEM E DESMONTAGEM'],
              //   },
              //   $and: [{ 'pagamento.dataRecebimento': { $gte: after } }, { 'pagamento.dataRecebimento': { $lte: before } }],
              // },
            ],
          },
        },
        {
          $project: {
            qtde: 1,
            nomeDoContrato: 1,
            codigoSVB: 1,
            cidade: 1,
            vendedor: 1,
            tipoDeServico: 1,
            'contrato.dataAssinatura': 1,
            comissoes: 1,
            'pagamento.dataRecebimento': 1,
            'sistema.potPico': 1,
            'sistema.valorProjeto': 1,
            'padrao.valor': 1,
            'estruturaPersonalizada.valor': 1,
            'oem.valor': 1,
            'compra.dataPagamento': 1,
            canalVenda: 1,
            insider: 1,
            idProjetoCRM: 1,
          },
        },
      ])
      .toArray()
    return projects as WithId<TProject>[]
  } catch (error) {
    throw error
  }
}

type GetCRMCommissionValuesParams = {
  sellerUserInfo: TUser | undefined
  sdrUserInfo: TUser | undefined
}
function getCRMCommissionValues({ sellerUserInfo, sdrUserInfo }: GetCRMCommissionValuesParams) {
  var commission = {
    seller: 0,
    insider: 0,
  }
  if (!sellerUserInfo && !sdrUserInfo) return commission
  // In case there is information about an SDR, than, it is a sale with Representante
  if (!!sdrUserInfo) {
    // console.log(representative?.nome, responsible?.nome)
    commission.seller = sellerUserInfo?.comissoes.comSDR || 0
    commission.insider = sdrUserInfo?.comissoes?.semSDR || 0
  } else {
    commission.seller = sellerUserInfo?.comissoes?.semSDR || 0
  }

  return commission
}

async function updateAppProjectsComission({ collection, changes }) {
  try {
    const bulkwriteAppUpdate = changes.map((project) => {
      const { crmProjectId, appProjectId, sellerCommission, insiderCommission } = project
      return {
        updateOne: {
          filter: { _id: new ObjectId(appProjectId) },
          update: {
            $set: {
              'comissoes.porcentagemVendedor': sellerCommission,
              'comissoes.porcentagemInsider': insiderCommission,
              'comissoes.pagamentoRealizado': true,
            },
          },
        },
      }
    })
    if (bulkwriteAppUpdate.length > 0) {
      await collection.bulkWrite(bulkwriteAppUpdate)
      return
    }
    return
  } catch (error) {
    throw error
  }
}
