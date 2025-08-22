import { getSession } from '../../../components/providers/SessionProvider'
import connectToDatabase from '../../../utils/services/mongodb/warehouse'
import connectToProjectsDatabase from '../../../utils/services/mongodb/projects'
import { ObjectId } from 'mongodb'
import createHttpError from 'http-errors'
import { errorHandler } from '../../../utils/methods/handlers'

export default async function handler(req, res) {
  // Fetching up to date information about the materials
  async function getCurrentMaterials(dbCollection) {
    try {
      const currentStateMaterials = await dbCollection
        .aggregate([
          {
            $project: {
              nome: 1,
              qtde: 1,
              qtdeMinima: 1,
            },
          },
        ])
        .toArray()
      return currentStateMaterials
    } catch (error) {
      throw error
    }
  }

  async function handleStockActivityLogInsertion({
    materialList,
    currentMaterials,
    logCollection,
    projectId,
    projectName,
    formId,
    userName,
    userId,
  }) {
    const filteredMaterialList = materialList.filter((x) => !!x.diff && x.diff != 0)
    const logs = filteredMaterialList.map((material) => {
      const materialId = material.id
      const correspondentMaterial = currentMaterials?.find((currentMaterial) => currentMaterial._id == materialId)
      const newQty = correspondentMaterial.qtde + material.diff
      const previousQty = correspondentMaterial.qtde
      return {
        idFormulario: formId,
        autor: {
          nome: userName,
          id: userId,
        },
        material: {
          id: materialId,
          nome: correspondentMaterial.nome,
          categoria: correspondentMaterial.categoria,
        },
        alteracao: material.diff,
        qtdeAnterior: previousQty,
        qtdeNovo: newQty,
        projeto: {
          id: projectId,
          nome: projectName,
        },
        tipo: material.diff > 0 ? 'DEVOLUÇÃO' : 'RETIRADA',
        dataInsercao: new Date().toISOString(),
      }
    })
    if (logs.length > 0) await logCollection.insertMany(logs)
    return
  }
  async function handleManualAlterationLogInsertion({ materialId, materialNewQty, userName, userId, currentMaterials, logCollection }) {
    console.log('FUI CHAMADO', materialId)
    const correspondentMaterial = currentMaterials?.find((currentMaterial) => currentMaterial._id == materialId)
    console.log('MATERIAL', correspondentMaterial)
    if (!correspondentMaterial) return null
    const previousQty = correspondentMaterial.qtde
    const diff = materialNewQty - previousQty
    const insertObj = {
      autor: {
        nome: userName,
        id: userId,
      },
      material: {
        id: materialId,
        nome: correspondentMaterial.nome,
        categoria: correspondentMaterial.categoria,
      },
      alteracao: diff,
      qtdeAnterior: previousQty,
      qtdeNovo: materialNewQty,
      tipo: 'ALTERAÇÃO MANUAL',
      dataInsercao: new Date().toISOString(),
    }
    if (diff != 0) {
      const response = await logCollection.insertOne(insertObj)
      console.log(response)
    }

    return
  }
  async function handleMaterialEntranceLogInsertion({ materialId, diff, userName, userId, currentMaterials, logCollection }) {
    console.log('FUI CHAMADO', materialId)
    const correspondentMaterial = currentMaterials?.find((currentMaterial) => currentMaterial._id == materialId)
    console.log('MATERIAL', correspondentMaterial)
    if (!correspondentMaterial) return null
    // const diff = materialNewQty - correspondentMaterial.qtde;
    const materialNewQty = correspondentMaterial.qtde + diff
    const previousQty = correspondentMaterial.qtde
    const insertObj = {
      autor: {
        nome: userName,
        id: userId,
      },
      material: {
        id: materialId,
        nome: correspondentMaterial.nome,
        categoria: correspondentMaterial.categoria,
      },
      alteracao: diff,
      qtdeAnterior: previousQty,
      qtdeNovo: materialNewQty,
      tipo: 'ENTRADA',
      dataInsercao: new Date().toISOString(),
    }
    const response = await logCollection.insertOne(insertObj)
    console.log(response)
    return
  }
  // Formatting function to MongoDB BulkWrite operation pattern
  function handleBulkWriteFormatting(materialList) {
    const filteredMaterialList = materialList.filter((x) => !!x.diff && x.diff != 0)
    const changes = filteredMaterialList.map((mat) => {
      const materialId = mat.id
      const diff = Number(mat.diff)
      console.log('DIFF', diff)
      return {
        updateOne: {
          filter: { _id: new ObjectId(materialId) },
          update: {
            $inc: { qtde: diff },
          },
        },
      }
    })
    return changes
  }
  if (req.method === 'GET') {
    const db = await connectToDatabase(process.env.DB_KEY)
    const collection = db.collection('material')
    try {
      const { id } = req.query
      if (id) {
        let material = await collection.findOne({ _id: ObjectId(id) })
        res.status(200).json(material)
      } else {
        let materials = await collection.find({}).sort({ nome: 1 }).toArray()
        res.json(materials)
      }
    } catch (error) {
      errorHandler(error, res)
    }
  } else if (req.method === 'POST') {
    const { user } = await getSession({ req: req })
    try {
      let { changes, idProjeto, idFormulario, identificador, tag } = req.body
      // Validating existence of array of changes
      if (!changes && !Array.isArray(changes)) throw new createHttpError.BadRequest('Array de mudanças não especificado.')

      // Getting the material collection
      const warehouseDb = await connectToDatabase(process.env.DB_KEY)
      const materialCollection = warehouseDb.collection('material')
      const logCollection = warehouseDb.collection('alteracoes')
      // Getting the notification collection
      const projectsDb = await connectToProjectsDatabase(process.env.DB_KEY, 'projetos')
      const notificationCollection = projectsDb.collection('notificacoes')

      // Getting the current state of materials so to check current quantities
      const currentStateMaterials = await getCurrentMaterials(materialCollection)

      console.log('CHANGES', changes)
      // Doing multiple qtde alterations for material items
      const bulkwriteArr = handleBulkWriteFormatting(changes)
      console.log('BULKWRITEARR', bulkwriteArr)
      if (bulkwriteArr.length > 0) await materialCollection.bulkWrite(bulkwriteArr)
      // Logging stock activity into logs collection
      await handleStockActivityLogInsertion({
        currentMaterials: currentStateMaterials,
        formId: idFormulario,
        logCollection: logCollection,
        materialList: changes,
        projectId: idProjeto,
        projectName: identificador,
        userId: user.id,
        userName: user.name,
      })

      res.status(200).json(bulkwriteArr)
    } catch (error) {
      errorHandler(error, res)
    }
  } else if (req.method === 'PUT') {
    const { user } = await getSession({ req: req })
    const db = await connectToDatabase(process.env.DB_KEY)
    const collection = db.collection('material')
    const logCollection = db.collection('alteracoes')
    // Getting the current state of materials so to check current quantities
    const currentStateMaterials = await getCurrentMaterials(collection)
    const { id, changes } = req.body
    delete changes._id
    try {
      await handleManualAlterationLogInsertion({
        materialId: id,
        currentMaterials: currentStateMaterials,
        userId: user.id,
        userName: user.name,
        materialNewQty: changes.qtde,
        logCollection: logCollection,
      })
      await collection.updateOne(
        {
          _id: ObjectId(id),
        },
        {
          $set: { ...changes },
        }
      )

      res.status(201).json('Alterações feitas !')
    } catch (error) {
      errorHandler(error, res)
    }
  } else if (req.method === 'PATCH') {
    const { user } = await getSession({ req: req })
    // Used for material entrance
    const { changes } = req.body
    try {
      if (!changes) throw new createHttpError.BadRequest('Array de mudanças não fornecido.;')
      const db = await connectToDatabase(process.env.DB_KEY)
      const collection = db.collection('material')
      const logCollection = db.collection('alteracoes')
      const { id, price, diff } = changes
      if (isNaN(diff)) throw new createHttpError.BadRequest('Valor de diferença não válido.')
      if (isNaN(price)) throw new createHttpError.BadRequest('Valor de preço inválido.')
      const dbResponse = await collection.updateOne(
        {
          _id: ObjectId(id),
        },
        {
          $set: {
            preco: price,
          },
          $inc: { qtde: diff },
        }
      )
      const currentStateMaterials = await getCurrentMaterials(collection)
      await handleMaterialEntranceLogInsertion({
        materialId: id,
        currentMaterials: currentStateMaterials,
        diff: diff,
        userId: user.id,
        userName: user.name,
        logCollection: logCollection,
      })
      res.status(201).json(dbResponse)
    } catch (error) {
      errorHandler(error, res)
    }
  }
}
