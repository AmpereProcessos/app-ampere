import connectToDatabase from '../../../utils/services/mongodb/projects'
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const db = await connectToDatabase(process.env.DB_KEY, 'projetos')
    const collection = db.collection('dados')
    let arr = await collection
      .aggregate([
        {
          $match: {
            'contrato.status': 'ASSINADO',
          },
        },
        {
          $project: {
            qtde: 1,
            nomeDoContrato: 1,
            telefone: 1,
            vendedor: 1,
            cidade: 1,
            nps: 1,
            'homologacao.vistoria.dataEfetivacao': 1,
            'jornada.dataNps': 1,
            'jornada.obsNps': 1,
          },
        },
        {
          $sort: {
            qtde: -1,
          },
        },
      ])
      .toArray()
    res.json(arr)
  }
}
