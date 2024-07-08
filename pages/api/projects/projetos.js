import connectToDatabase from '../../../utils/services/mongodb/projects'
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const db = await connectToDatabase(process.env.DB_KEY, 'projetos')
    const collection = db.collection('dados')
    let projetos = await collection
      .aggregate([
        {
          $sort: {
            qtde: 1,
          },
        },
        {
          $match: {
            'contrato.status': { $ne: 'RESCISÃO DE CONTRATO' },
            'homologacao.dataEfetivacao': null,
            $or: [{ 'compra.statusLiberacao': 'PAGO' }, { 'homologacao.dataLiberacao': { $ne: null } }],
          },
        },
        {
          $project: {
            _id: 1,
            qtde: 1,
            nomeDoContrato: 1,
            cidade: 1,
            tipoDeServico: 1,
            'vendedor.nome': 1,
            homologacao: 1,
            'obra.statusDaObra': 1,
            'compra.statusEntrega': 1,
            'compra.dataEntrega': 1,
            'compra.previsaoEntrega': 1,
            'compra.dataPagamento': 1,
            'contrato.dataAssinatura': 1,
            'sistema.potPico': 1,
            'material.disjuntores': 1,
          },
        },
      ])
      .toArray()
    res.json(projetos)
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
                'projeto.projetoConcluido': { $ne: 'SIM' },
                $or: [{ 'compra.statusLiberacao': 'PAGO' }, { 'projeto.iniciar': 'SIM' }],
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
                'projeto.projetoConcluido': { $ne: 'SIM' },
                $or: [{ 'compra.statusLiberacao': 'PAGO' }, { 'projeto.iniciar': 'SIM' }],
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
                'projeto.projetoConcluido': { $ne: 'SIM' },
                $or: [{ 'compra.statusLiberacao': 'PAGO' }, { 'projeto.iniciar': 'SIM' }],
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
