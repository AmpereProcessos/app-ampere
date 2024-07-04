import { ObjectId } from 'mongodb'
import connectToDatabase from '../../../../utils/services/mongodb/projects'
export default async function handler(req, res) {
  if (req.method === 'GET') {
    let id = req.query.id
    console.log(id)
    const db = await connectToDatabase(process.env.DB_KEY, 'projetos')
    const collection = db.collection('dados')
    var obj = await collection.find({ _id: ObjectId(id) }).toArray()
    res.json(obj)

    /// TESTING
    // const homologation = {
    //   homologar: true,
    //   status: 'PENDENTE',
    //   potencia: 0,
    //   distribuidora: 'CEMIG',
    //   pendencias: {},
    //   oportunidade: {
    //     id: '',
    //     nome: '',
    //   },
    //   titular: {
    //     nome: '',
    //     contato: '',
    //     identificador: '',
    //   },
    //   equipamentos: [],
    //   localizacao: {
    //     uf: '',
    //     cidade: '',
    //   },
    //   instalacao: {
    //     grupo: 'COMERCIAL',
    //     numeroCliente: '',
    //     numeroInstalacao: '',
    //   },
    //   documentacao: {
    //     formaAssinatura: 'FÍSICA',
    //   },
    //   acesso: {
    //     codigo: '',
    //   },
    //   atualizacoes: [],
    //   vistoria: {},
    //   dataLiberacao: new Date().toISOString(),
    // }
    // const formatted = obj.map((o) => ({ ...o, homologacao: homologation }))
    // return res.json(formatted)
    /// TESTING
  }
}
