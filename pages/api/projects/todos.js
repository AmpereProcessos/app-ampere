import connectToDatabase from '../../../utils/services/mongodb/projects'
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const db = await connectToDatabase(process.env.DB_KEY, 'projetos')
    const collection = db.collection('dados')
    let arr = await collection
      .aggregate([
        {
          $project: {
            qtde: 1,
            nomeDoContrato: 1,
            cep: 1,
            uf: 1,
            cidade: 1,
            bairro: 1,
            logradouro: 1,
            numeroResidencia: 1,
            'sistema.topologia': 1,
            'obra.equipeResp': 1,
            segmento: 1,
            'oem.plano': 1,
            'oem.oemConcluido': 1,
          },
        },
        {
          $sort: {
            qtde: 1,
          },
        },
      ])
      .toArray()
    res.json(arr)
  }
}
