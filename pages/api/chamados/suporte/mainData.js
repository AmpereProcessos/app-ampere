import connectToDatabase from '../../../../utils/services/mongodb/calls'
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const after = new Date(req.query.closedAfter).toJSON()
    const before = new Date(req.query.closedBefore).toJSON()
    const db = await connectToDatabase(process.env.DB_KEY)
    const collection = db.collection('suporte')
    let openCalls = await collection
      .aggregate([
        {
          $match: {
            statusChamado: { $in: ['EM ANDAMENTO', 'ABERTO', 'PENDENTE'] },
          },
        },
        {
          $project: {
            nomeCliente: 1,
            nomeUsina: 1,
            abertura: 1,
            demanda: 1,
            responsavel: 1,
            tipoChamado: 1,
            statusChamado: 1,
            cidade: 1,
            statusGarantia: 1,
            ultAtualizacaoCliente: 1,
          },
        },
        {
          $sort: {
            abertura: -1,
          },
        },
      ])
      .toArray()
    let closedCalls = await collection
      .aggregate([
        {
          $match: {
            statusChamado: 'RESOLVIDO',
            fechamento: {
              $gte: after,
              $lt: before,
            },
          },
        },
        {
          $project: {
            nomeCliente: 1,
            nomeUsina: 1,
            abertura: 1,
            demanda: 1,
            responsavel: 1,
            tipoChamado: 1,
            statusChamado: 1,
            feedbackValor: 1,
            cidade: 1,
          },
        },
        {
          $sort: {
            abertura: -1,
          },
        },
      ])
      .toArray()
    return res.json({ openCalls, closedCalls })
  }
  if (req.method === 'POST') {
    let date = new Date().toJSON()
    var obj = {
      idPai: req.body.idPai,
      abertura: date,
      nomeCliente: req.body.clientName,
      nomeUsina: req.body.plantName ? req.body.plantName : '',
      cidade: req.body.clientCity,
      tipoChamado: req.body.problemType,
      descricaoProblema: req.body.problemDesc,
      statusChamado: 'ABERTO',
      responsavel: req.body.responsavel ? req.body.responsavel : 'DEFINIR',
      plano: req.body.plano,
    }
    const db = await connectToDatabase(process.env.DB_KEY, 'chamados')
    const collection = db.collection('suporte')
    let created = await collection.insertOne({
      ...req.body,
      statusChamado: 'ABERTO',
    })
    return res.json('CHAMADO CRIADO')
  }
}
