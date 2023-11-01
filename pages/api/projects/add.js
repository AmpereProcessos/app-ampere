import { ObjectId } from 'mongodb'
import connectToDatabase from '../../../utils/services/mongodb/projects'
import connectToISDatabase from '../../../utils/services/mongodb/inside-sales'
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const db = await connectToDatabase(process.env.DB_KEY, 'projetos')
    const collection = db.collection('dados')

    //Definindo o banco de Inside Sales e coleção de leads
    const dbIS = await connectToISDatabase(process.env.DB_KEY)
    const collectionIS = dbIS.collection('leads')
    // Buscando insider com códigoSVB na coleção de leads
    let cod = isNaN(req.body.codigoSVB) ? 0 : Number(req.body.codigoSVB)
    let obj = await collectionIS.findOneAndUpdate(
      { codigoSVB: cod },
      { $set: { contratoSolicitado: true, estagioFunil: 3 } },
      { returnNewDocument: true }
    )
    let insider = obj ? obj?.value?.responsavel : null

    // Pegando o último projeto adicionado na gestão de projetos
    let lastestInserted = await collection
      .aggregate([
        {
          $sort: {
            qtde: -1,
          },
        },
        {
          $limit: 1,
        },
      ])
      .toArray()
    // Inserindo novo projeto com qtde ajustado e insider
    let project = await collection.insertOne({
      ...req.body,
      qtde: lastestInserted[0].qtde + 1,
      insider: insider,
    })
    return res.json(project)
  }
}
