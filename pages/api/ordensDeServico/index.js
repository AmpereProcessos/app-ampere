import connectToDatabase from '../../../utils/connectDb'
import { ObjectId } from 'mongodb'
import { errorHandler } from '../../../utils/methods/handlers'
import createHttpError from 'http-errors'
export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const db = await connectToDatabase(process.env.DB_KEY, 'projetos')
      const collection = db.collection('ordensDeServico')
      const info = req.body
      if (!info) throw new createHttpError.BadRequest('Nenhuma informações provida.')
      const dbResponse = await insertServiceOrder({ collection, info })
      res.status(201).json(dbResponse.insertedId)
    } catch (error) {
      errorHandler(error, res)
    }
  } else if (req.method === 'GET') {
    try {
      const db = await connectToDatabase(process.env.DB_KEY, 'projetos')
      console.log(req.query)
      const after = req.query.after
      const before = req.query.before
      const simplified = req.query.simplified == 'false' ? false : true
      const id = req.query.id
      const projectId = req.query.projectId
      const status = req.query.status
      const responsibleName = req.query.responsibleName
      const collection = db.collection('ordensDeServico')
      if (!!projectId && projectId != 'undefined' && typeof projectId == 'string') {
        const orders = await getServiceOrdersByProject({ collection, projectId, simplified })
        return res.status(200).json(orders)
      }
      if (!!id && id != 'undefined' && typeof id == 'string') {
        const order = await getServiceOrderById({ collection, id })
        return res.json(order)
      }
      const openOnly = status == 'EM ABERTO'
      const orders = await getServiceOrders({ after, before, collection, simplified, openOnly, responsibleName })
      return res.json(orders)
    } catch (error) {
      errorHandler(error, res)
    }
  } else if (req.method === 'PUT') {
    try {
      const db = await connectToDatabase(process.env.DB_KEY, 'projetos')
      const collection = db.collection('ordensDeServico')
      const { id } = req.query
      const changes = req.body
      console.log('MUDANÇAS', req.body)
      if (!id || typeof id != 'string') throw new createHttpError.BadRequest('ID não fornecido ou inválido.')
      if (!changes) throw new createHttpError.BadRequest('Mudanças não fornecidas.')
      delete changes._id
      var newObj = await collection.findOneAndUpdate(
        {
          _id: new ObjectId(id),
        },
        {
          $set: {
            ...changes,
          },
        },
        {
          returnDocument: 'after',
        }
      )

      return res.status(201).json(newObj)
    } catch (error) {
      errorHandler(error, res)
    }
  }
}

async function getServiceOrders({ collection, simplified, after, before, openOnly, responsibleName }) {
  const pipeline = []
  if (after && before && after != 'null' && before != 'null') {
    pipeline.push({
      $match: {
        $and: [
          {
            dataInsercao: {
              $gte: after,
            },
          },
          {
            dataInsercao: {
              $lte: before,
            },
          },
        ],
      },
    })
  }
  if (simplified) {
    pipeline.push({
      $project: {
        categoria: 1,
        urgencia: 1,
        'favorecido.nome': 1,
        'projeto.identificador': 1,
        localizacao: 1,
        responsavel: 1,
        autor: 1,
        observacoes: 1,
        dataInsercao: 1,
        dataEfetivacao: 1,
      },
    })
  }
  if (openOnly) {
    pipeline.push({
      $match: {
        dataEfetivacao: null,
      },
    })
    console.log('FUI CHAMADO', pipeline)
  }
  if (responsibleName != 'undefined') {
    pipeline.push({
      $match: {
        'responsavel.nome': responsibleName,
      },
    })
  }
  pipeline.push({
    $sort: {
      dataInsercao: -1,
    },
  })

  try {
    const orders = await collection.aggregate(pipeline).toArray()
    return orders
  } catch (error) {
    throw error
  }
}
async function getServiceOrdersByProject({ collection, simplified, projectId }) {
  const pipeline = []
  if (projectId) {
    pipeline.push({
      $match: {
        'projeto.id': projectId,
      },
    })
  }
  if (simplified) {
    pipeline.push({
      $project: {
        categoria: 1,
        descricao: 1,
        urgencia: 1,
        'favorecido.nome': 1,
        'projeto.identificador': 1,
        localizacao: 1,
        responsavel: 1,
        autor: 1,
        observacoes: 1,
        dataInsercao: 1,
        dataEfetivacao: 1,
      },
    })
  }
  pipeline.push({
    $sort: {
      dataInsercao: -1,
    },
  })
  try {
    const orders = await collection.aggregate(pipeline).toArray()
    return orders
  } catch (error) {
    throw error
  }
}
async function getServiceOrderById({ collection, id }) {
  try {
    const order = await collection.findOne({ _id: new ObjectId(id) })
    return order
  } catch (error) {
    throw error
  }
}
async function insertServiceOrder({ collection, info }) {
  try {
    const dbResponse = await collection.insertOne(info)
    return dbResponse
  } catch (error) {
    throw error
  }
}
