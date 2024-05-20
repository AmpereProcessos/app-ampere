import connectToAppDatabase from '../../../utils/services/mongodb/projects'
import { calculateStringSimilarity } from '../../../utils/constants'
import connectToCRMDatabase from '../../../utils/services/mongodb/crm/main'
import { errorHandler } from '../../../utils/methods/handlers'
import { getContractValue } from '../../../utils/methods/util/projects'
import createHttpError from 'http-errors'
import { ObjectId } from 'mongodb'
export default async function handler(req, res) {
  if (req.method == 'GET') {
    try {
      const { after, before } = req.query
      const appDb = await connectToAppDatabase(process.env.DB_KEY, 'projetos')
      const appProjectsCollection = appDb.collection('dados')

      const crmDb = await connectToCRMDatabase(process.env.CRM_KEY)
      const crmUsersCollection = crmDb.collection('users')
      const crmProjectsCollection = crmDb.collection('projects')

      const crmUsers = await crmUsersCollection.find({}).toArray()
      const crmProjects = await crmProjectsCollection.find({ 'contrato.dataAssinatura': { $ne: null } }).toArray()
      const projects = await getFilteredProjects({ collection: appProjectsCollection, after, before })

      const commissionInfo = projects.map((project) => {
        const equivalentProjectInCRM = crmProjects.find((crmProject) => crmProject._id == project.idProjetoCRM)
        const representative = equivalentProjectInCRM?.representante
        const responsible = equivalentProjectInCRM?.responsavel

        const representativeUserInfo = crmUsers.find((user) => representative?.id == user._id)
        const responsibleUserInfo = crmUsers.find((user) => responsible?.id == user._id)

        const isFromSDR = representativeUserInfo?.grupo?.id == 4

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
          commission = getCRMCommissionValues({ responsibleUserInfo, representativeUserInfo, isFromSDR })
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
          insider: isFromSDR ? representative.nome : null,
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
      res.json(commissionInfo)
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

async function getFilteredProjects({ collection, after, before }) {
  try {
    const projects = await collection
      .aggregate([
        {
          $match: {
            'contrato.status': 'ASSINADO',
            $or: [
              {
                tipoDeServico: { $ne: 'OPERAÇÃO E MANUTENÇÃO' },
                $and: [{ 'compra.dataPagamento': { $gte: after } }, { 'compra.dataPagamento': { $lte: before } }],
              },
              {
                tipoDeServico: {
                  $in: ['OPERAÇÃO E MANUTENÇÃO', 'MONTAGEM E DESMONTAGEM'],
                },
                $and: [{ 'pagamento.dataRecebimento': { $gte: after } }, { 'pagamento.dataRecebimento': { $lte: before } }],
              },
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
    return projects
  } catch (error) {
    throw error
  }
}
function getCRMCommissionValues({ representativeUserInfo, responsibleUserInfo, isFromSDR }) {
  var commission = {
    seller: 0,
    insider: 0,
  }
  if (representativeUserInfo && responsibleUserInfo) {
    if (isFromSDR) {
      // console.log(representative?.nome, responsible?.nome)
      commission.seller = responsibleUserInfo.comissao.comRepresentante
      commission.insider = representativeUserInfo.comissao.semRepresentante
    } else {
      commission.seller = responsibleUserInfo.comissao.semRepresentante
    }
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
