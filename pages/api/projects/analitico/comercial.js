import connectToDatabase from '../../../../utils/connectDb'
import connectToCRMDatabase from '../../../../utils/crmDb'
function getContractValue(valorProjeto, valorPadrao, valorEstrutura) {
  var totalSum = 0

  let projeto = !isNaN(valorProjeto) ? valorProjeto : 0
  let padrao = !isNaN(valorPadrao) ? valorPadrao : 0
  let estrutura = !isNaN(valorEstrutura) ? valorEstrutura : 0
  totalSum = Number(totalSum) + Number(projeto) + Number(padrao) + Number(estrutura)
  return totalSum
}
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const db = await connectToDatabase(process.env.DB_KEY, 'projetos')
    const crmDb = await connectToCRMDatabase(process.env.CRM_KEY)

    const collection = db.collection('dados')
    const crmProjectsCollection = crmDb.collection('projects')
    const { after, before, field } = req.query
    const appProjects = await collection
      .aggregate([
        {
          $match: {
            $and: [{ [field]: { $gte: after } }, { [field]: { $lte: before } }],
          },
        },
        {
          $sort: {
            qtde: 1,
          },
        },
      ])
      .toArray()
    const crmProjects = await crmProjectsCollection
      .aggregate([
        {
          $match: { $and: [{ ['contrato.dataAssinatura']: { $gte: after } }, { ['contrato.dataAssinatura']: { $lte: before } }] },
        },
        {
          $addFields: {
            propostaObjectId: { $toObjectId: '$contrato.idProposta' },
          },
        },
        {
          $lookup: {
            from: 'proposes',
            localField: 'propostaObjectId',
            foreignField: '_id',
            as: 'proposta',
          },
        },
        {
          $project: {
            'proposta.template': 0,
            'proposta.projeto': 0,
            'proposta.premissas': 0,
            'proposta.kit': 0,
            'proposta.precificacao': 0,
            'proposta.linkArquivo': 0,
            'proposta.autor': 0,
          },
        },
      ])
      .toArray()

    const responseFormatted = appProjects.map((project) => {
      const equivalentCRMProject = crmProjects.find((p) => project.idProjetoCRM == p._id)
      const propose = equivalentCRMProject?.proposta[0] ? equivalentCRMProject?.proposta[0] : null
      const proposeValue = propose?.valorProposta || null
      return {
        id: project._id,
        nome: project.nomeDoContrato,
        idProjetoCRM: project.idProjetoCRM,
        vendedor: project.vendedor.nome,
        tipoServico: project.tipoDeServico,
        identificador: project.qtde,
        identificadorCRM: project.codigoSVB,
        cidade: project.cidade,
        cpfCnpj: project.cpf_cnpj,
        bairro: project.bairro,
        logradouro: project.logradouro,
        numeroOuIdentificador: project.numeroResidencia,
        potenciaPico: project.sistema?.potPico,
        dataAssinatura: project.contrato.dataAssinatura,
        dataSolicitacao: project.contrato.dataSolicitacao,
        valorProjeto: project.sistema?.valorProjeto,
        valorPadrao: project.padrao?.valor,
        valorEstrutura: project.estruturaPersonalizada?.valor,
        valorContrato: getContractValue(project.sistema?.valorProjeto, project.padrao?.valor, project.estruturaPersonalizada?.valor),
        proposta: {
          id: propose?._id || null,
          nome: propose?.nome || null,
          valor: proposeValue || null,
          potenciaPico: propose?.potenciaPico || null,
          url: propose?.linkArquivo || null,
        },
        links: project.links,
      }
    })
    res.json(responseFormatted)
  }
}
