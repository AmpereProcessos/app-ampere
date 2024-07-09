import { ObjectId } from 'mongodb'
import connectToDatabase from '../../../../utils/services/mongodb/projects'
import createHttpError from 'http-errors'
import { apiHandler, validateAuthenticationWithSession } from '../../../../utils/api'
const getProjectById = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  const userHasRestrictionPermission = session.user.permissoes.gestao.restringirProjetos
  const { id } = req.query
  if (!id || typeof id != 'string' || !ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID inválido.')
  const db = await connectToDatabase(process.env.DB_KEY, 'projetos')
  const collection = db.collection('dados')
  const project = await collection.findOne({ _id: ObjectId(id) })

  if (!project) throw new createHttpError.NotFound('Projeto não encontrado.')

  const isProjectRestricted = !!project.restricao?.aplicavel

  if (isProjectRestricted && !userHasRestrictionPermission)
    throw new createHttpError.Unauthorized('Projeto restrito. Para mais informações, entrar em contato com seu gestor.')

  return res.json(project)
}

export default apiHandler({ GET: getProjectById })
// export default async function handler(req, res) {
//   if (req.method === 'GET') {
//     let id = req.query.id
//     console.log(id)
//     const db = await connectToDatabase(process.env.DB_KEY, 'projetos')
//     const collection = db.collection('dados')
//     const project = await collection.find({ _id: ObjectId(id) }).toArray()
//     throw new createHttpError.Unauthorized('Projeto restrito. Para mais informações, entrar em contato com o gestor.')
//     res.json(project)
//   }
// }
