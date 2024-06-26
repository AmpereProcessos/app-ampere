import connectToDatabase from '../../../utils/services/mongodb/projects'
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const db = await connectToDatabase(process.env.DB_KEY, 'projetos')
    const collection = db.collection('dados')
    let obras = await collection
      .aggregate([
        {
          $match: {
            'obra.statusDaObra': {
              $ne: 'CONCLUIDA',
            },
            'contrato.status': 'ASSINADO',
            $or: [
              { $and: [{ tipoDeServico: { $ne: 'MONTAGEM E DESMONTAGEM' } }, { 'compra.dataPedido': { $ne: null } }] },
              { 'obra.statusSolicitacao': 'SOLICITADA' },
            ],
            tipoDeServico: { $nin: ['OPERAÇÃO E MANUTENÇÃO', 'MANUTENÇÃO CORRETIVA', 'MANUTENÇÃO PREVENTIVA'] },
          },
        },
        {
          $project: {
            _id: 1,
            qtde: 1,
            nomeDoContrato: 1,
            cidade: 1,
            obra: 1,
            tipoDeServico: 1,
            'compra.statusEntrega': 1,
            'compra.previsaoEntrega': 1,
            'compra.dataEntrega': 1,
            'compra.statusLiberacao': 1,
            'compra.dataPagamento': 1,
            'visitaTecnica.tecnico': 1,
            'visitaTecnica.tipoDaTelha': 1,
            'vistoria.status': 1,
            'sistema.qtdeModulos': 1,
            'sistema.potPico': 1,
            'sistema.topologia': 1,
            'parecer.dataParecerDeAcesso': 1,
            'contrato.dataAssinatura': 1,
            'pagamento.credor': 1,
            'projeto.aumentoDeCarga': 1,
            'projeto.acStatus': 1,
            'estruturaPersonalizada.aplicavel': 1,
            'estruturaPersonalizada.status': 1,
            ordensDeServico: 1,
          },
        },
        {
          $sort: {
            'compra.dataEntrega': 1,
            'compra.previsaoEntrega': 1,
          },
        },
      ])
      .toArray()
    res.json(obras)
  } else if (req.method === 'POST') {
    const db = await connectToDatabase(process.env.DB_KEY, 'projetos')
    const collection = db.collection('dados')
    var arr
    switch (req.body.filtrarPor) {
      case 'REGIONAL':
        arr = await collection
          .aggregate([
            {
              $match: {
                regional: req.body.parametro,
                'obra.statusDaObra': {
                  $ne: 'CONCLUIDA',
                },
                'contrato.status': 'ASSINADO',
              },
            },
            {
              $sort: {
                qtde: 1,
              },
            },
          ])
          .toArray()
        break
      case 'VENDEDOR':
        arr = await collection
          .aggregate([
            {
              $match: {
                'vendedor.nome': req.body.parametro,
                'obra.statusDaObra': {
                  $ne: 'CONCLUIDA',
                },
                'contrato.status': 'ASSINADO',
              },
            },
            {
              $sort: {
                qtde: 1,
              },
            },
          ])
          .toArray()
      default:
        arr = await collection
          .aggregate([
            {
              $match: {
                'obra.statusDaObra': {
                  $ne: 'CONCLUIDA',
                },
                'contrato.status': 'ASSINADO',
              },
            },
            {
              $sort: {
                qtde: 1,
              },
            },
          ])
          .toArray()
    }
    res.json(arr)
  }
}
