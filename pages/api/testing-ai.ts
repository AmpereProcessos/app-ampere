import { apiHandler } from '@/utils/api'
import { formatLocation, formatToCEP } from '@/utils/methods/formatting'
import { TMaterial } from '@/utils/schemas/materials'
import { TProject } from '@/utils/schemas/projects'
import connectToAITestingDatabase from '@/utils/services/mongodb/ai-testing'
import clientPromise from '@/utils/services/mongodb/mongo-client'
import { ObjectId } from 'mongodb'
import { NextApiHandler } from 'next'
import OpenAI from 'openai'

const OpenAIClient = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
})
const handleAITesting: NextApiHandler<any> = async (req, res) => {
  const aiDb = await connectToAITestingDatabase()

  const projectsCollection = aiDb.collection<TProject>('projetos')
  // const materialsCollection = aiDb.collection<TMaterial>('materiais')

  const projects = await projectsCollection.find({ qtde: { $gt: 100 } }).toArray()

  const bulkwriteArr = await Promise.all(
    projects.map(async (project) => {
      const projectCode = project.qtde
      const projectName = project.nomeDoContrato
      const projectType = project.tipoDeServico
      const projectUf = project.uf
      const projectCity = project.cidade
      const projectLocationStr = formatLocation({
        location: {
          cep: formatToCEP(project.cep?.toString() || ''),
          uf: project.uf,
          cidade: project.cidade,
          bairro: project.bairro,
          endereco: project.logradouro,
          numeroOuIdentificador: project.numeroResidencia?.toString(),
          latitude: project.latitude,
          longitude: project.longitude,
        },
        includeCEP: true,
      })

      const projectDescription = `PROJETO DE CÓDIGO (OU NÚMERO) ${projectCode} DO CLIENTE ${projectName}, COM O TIPO DE SERVIÇO ${projectType}, A SER EXECUTADO NA CIDADE ${projectCity},ESTADO ${projectUf} E A LOCAÇÃO ${projectLocationStr}`

      // const OpenAiDescriptionEmbedding = await OpenAIClient.embeddings.create({
      //   model: 'text-embedding-ada-002',
      //   input: projectDescription,
      // })
      const OpenAiNameEmbedding = await OpenAIClient.embeddings.create({
        model: 'text-embedding-3-small',
        input: projectName,
      })
      // const OpenAiDescriptionEmbeddingResult = OpenAiDescriptionEmbedding.data[0].embedding
      const OpenAiNameEmbeddingResult = OpenAiNameEmbedding.data[0].embedding

      return {
        updateOne: {
          filter: { _id: new ObjectId(project._id) },
          update: {
            $set: {
              // description_embedding: OpenAiDescriptionEmbeddingResult,
              name_embedding: OpenAiNameEmbeddingResult,
            },
          },
        },
      }
    })
  )

  // const bulkwriteResponse = await projectsCollection.bulkWrite(bulkwriteArr)

  // //   const materials = await materialsCollection.find({}).toArray()

  // //   const bulkwriteArr = await Promise.all(
  // //     materials.map(async (material) => {
  // //       const materialName = material.nome

  // //       const OpenAiEmbedding = await OpenAIClient.embeddings.create({
  // //         model: 'text-embedding-3-small',
  // //         input: `${materialName}`,
  // //       })
  // //       const OpenAiEmbeddingResult = OpenAiEmbedding.data[0].embedding

  // //       return {
  // //         updateOne: {
  // //           filter: { _id: new ObjectId(material._id) },
  // //           update: {
  // //             $set: {
  // //               name_embedding: OpenAiEmbeddingResult,
  // //             },
  // //           },
  // //         },
  // //       }
  // //     })
  // //   )

  // //   const bulkwriteResponse = await materialsCollection.bulkWrite(bulkwriteArr)
  // return res.status(200).json(bulkwriteResponse)

  return res.status(200).json('DESATIVADA')
}

export default apiHandler({ GET: handleAITesting })
