import connectToDatabase from '../../../../utils/services/mongodb/calls'
import connectToProjectsDatabase from '../../../../utils/services/mongodb/projects'
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const after = new Date(req.query.closedAfter).toJSON()
    const before = new Date(req.query.closedBefore).toJSON()
    const db = await connectToDatabase(process.env.DB_KEY)
    const projectsDb = await connectToProjectsDatabase(process.env.DB_KEY, 'projetos')
    const collection = db.collection('projetos')
    const collection2 = projectsDb.collection('dados')
    let openCalls = await collection
      .aggregate([
        { $match: { status: { $ne: 'FINALIZADO' } } },
        {
          $project: {
            projeto: 1,
            status: 1,
            responsavel: 1,
            tipoDoChamado: 1,
          },
        },
      ])
      .toArray()
    let closedCalls = await collection
      .aggregate([
        {
          $match: {
            status: 'FINALIZADO',
            abertura: {
              $gte: after,
              $lt: before,
            },
          },
        },
        {
          $project: {
            projeto: 1,
            status: 1,
            responsavel: 1,
            tipoDoChamado: 1,
            abertura: 1,
          },
        },
        {
          $sort: {
            abertura: -1,
          },
        },
      ])
      .toArray()

    let comissionamento = await collection2
      .aggregate([
        {
          $match: {
            'contrato.status': 'ASSINADO',
          },
        },
        {
          $match: {
            'comissionamento.projetos': { $ne: true },
            'contrato.status': 'ASSINADO',
            'compra.statusLiberacao': { $in: ['PAGO', 'REALIZAR COMPRA'] },
          },
        },
        {
          $project: {
            comissionamento: 1,
          },
        },
      ])
      .toArray()
    const docsToMake = await collection2.countDocuments({
      'homologacao.homologar': true,
      'homologacao.dataLiberacao': { $ne: null },
      'homologacao.dataEfetivacao': null,
      'homologacao.documentacao.dataConclusaoElaboracao': null,
    })
    const docsToSign = await collection2.countDocuments({
      'homologacao.homologar': true,
      'homologacao.dataLiberacao': { $ne: null },
      $and: [{ 'homologacao.documentacao.dataLiberacao': { $ne: null } }, { 'homologacao.documentacao.dataAssinatura': null }],
    })
    const accessToRequest = await collection2.countDocuments({
      $and: [
        {
          'homologacao.homologar': true,
        },
        {
          'homologacao.dataEfetivacao': null,
        },
        {
          'homologacao.dataLiberacao': { $ne: null },
        },
        {
          'homologacao.acesso.dataSolicitacao': null,
        },
      ],
    })
    const accessPendingResponse = await collection2.countDocuments({
      'homologacao.homologar': true,
      'homologacao.dataEfetivacao': null,
      'homologacao.dataLiberacao': { $ne: null },
      $and: [{ 'homologacao.documentacao.dataSolicitacao': { $ne: null } }, { 'homologacao.documentacao.dataResposta': null }],
    })
    const vistoryPendingRequest = await collection2.countDocuments({
      'obra.statusDaObra': { $regex: 'CONCLUIDA' },
      'homologacao.dataEfetivacao': null,
      'homologacao.vistoria.dataSolicitacao': null,
    })
    const vistoryPendingResponse = await collection2.countDocuments({
      'obra.statusDaObra': { $regex: 'CONCLUIDA' },
      'homologacao.dataEfetivacao': null,
      $and: [{ 'homologacao.vistoria.dataSolicitacao': { $ne: null } }, { 'homologacao.vistoria.dataEfetivacao': null }],
    })
    res.json({
      assinatura: {
        confeccionar: docsToMake,
        paraAssinar: docsToSign,
      },
      parecer: {
        solicitar: accessToRequest,
        aguardando: accessPendingResponse,
      },
      vistoria: {
        pendente: vistoryPendingRequest,
        aguardando: vistoryPendingResponse,
      },
      comissionamento: {
        total: comissionamento.length,
        parcial: comissionamento.filter((x) => x.comissionamento?.comercial == true && x.comissionamento?.suprimentos == true).length,
      },
      openCalls: openCalls,
      closedCalls: closedCalls,
    })
  } else if (req.method === 'POST') {
    let date = new Date().toJSON()
    var obj = { ...req.body, abertura: date }
    const db = await connectToDatabase(process.env.DB_KEY, 'chamados')
    const collection = db.collection('projetos')
    try {
      let created = await collection.insertOne(obj)
      res.json('CHAMADO ABERTO')
    } catch (error) {
      res.error(error)
    }
  }
}
