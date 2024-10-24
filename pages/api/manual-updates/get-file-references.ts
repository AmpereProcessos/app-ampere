import { apiHandler } from '@/utils/api'
import { TFileReference } from '@/utils/schemas/crm/file-reference.schema'
import { TProject } from '@/utils/schemas/projects'
import connectToCRMDatabase from '@/utils/services/mongodb/crm/main'
import connectToDatabase from '@/utils/services/mongodb/projects'
import { Collection, Db } from 'mongodb'
import { NextApiHandler } from 'next'

const getFileReferencesRoute: NextApiHandler<any> = async (req, res) => {
  const crmdb = await connectToCRMDatabase(process.env.DB_KEY)
  const fileReferencesCollection: Collection<TFileReference> = crmdb.collection('file-references')
  const db: Db = await connectToDatabase(process.env.DB_KEY, 'projetos')
  const collection: Collection<TProject> = db.collection('dados')
  // const fileReferencesCollection: Collection<TFileReference> = db.collection('referencias-arquivos')
  const projects = await collection
    .find(
      {},
      {
        projection: {
          nomeDoContrato: 1,
          _id: 1,
          links: 1,
        },
      }
    )
    .toArray()

  const f = projects
    .map((project) => {
      const files = project.links
        ? Object.entries(project.links)
            .map(([key, value]) => {
              return (value || []).map((x) => ({ projetoId: project._id.toString(), projeto: project.nomeDoContrato, key, ...(x || {}) })) || []
            })
            .flat(1)
        : []
      return files
    })
    .flat(1)

  const fileReferences: TFileReference[] = f.map((file) => ({
    titulo: file.title,
    url: file.link,
    formato: file.format,
    idProjeto: file.projetoId,
    categorias: getCategories(file.key),
    autor: { id: 'holder', nome: 'MIGRAÇÃO' },
    dataInsercao: new Date().toISOString(),
  }))

  // const byKey = f.reduce((acc, current) => {
  //   if (!acc[current.key]) acc[current.key] = 0
  //   acc[current.key] += 1
  //   return acc
  // }, {})
  const insertResponse = await fileReferencesCollection.insertMany(fileReferences)
  console.log(fileReferences.length)
  return res.json(insertResponse)
}

export default apiHandler({ GET: getFileReferencesRoute })

function getCategories(category: string) {
  if (category == 'manutencaoPreventiva') return ['MANUTENÇÕES']
  if (category == 'projetos') return ['PROJETOS']
  if (category == 'manutencaoCorretiva') return ['MANUTENÇÕES']
  if (category == 'contratos') return ['CONTRATOS']
  if (category == 'visitaTecnica') return ['ANÁLISES TÉCNICAS']
  if (category == 'obras') return ['SERVIÇOS']
  if (category == 'documentos') return ['DOCUMENTOS']
  if (category == 'equipamentos') return ['COMPRAS']
  if (category == 'montagem') return ['SERVIÇOS']
  if (category == 'chamadosSuprimentos') return ['COMPRAS']
  if (category == 'chamadosSuporte') return ['OUTROS']
  if (category == 'padrao') return ['SERVIÇOS']
  return []
}
// "manutencaoPreventiva": 11500,
// "projetos": 5514,
// "manutencaoCorretiva": 249,
// "contratos": 1279,
// "visitaTecnica": 6159,
// "obras": 2347,
// "documentos": 7702,
// "equipamentos": 4985,
// "montagem": 6061,
// "chamadosSuprimentos": 30,
// "chamadosSuporte": 1,
// "padrao": 15
