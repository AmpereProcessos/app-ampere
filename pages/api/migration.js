import dayjs from 'dayjs'
import connectToCRMDatabase from '../../utils/services/mongodb/crm/main'
import connectToProjectsDatabase from '../../utils/services/mongodb/projects'
import connectToUsersDatabase from '../../utils/services/mongodb/users'
import { ObjectId } from 'mongodb'
import GenerationFactors from '../../utils/jsons/fatores-geracao.json'
import { formatDateAsLocale } from '../../utils/methods/formatting'
function getList({ str, category }) {
  if (category != 'MONTAGEM') return null
  if (typeof str != 'string') return null
  const spllited = str.split('\n')
  const formattedSpllited = spllited.map((i) => {
    const arr = i.split('-')
    var qty = null
    var desc = null
    if (arr.length > 1) {
      qty = Number(arr[0].trim())
      desc = arr[1]
    } else desc = arr[0]

    return {
      qtde: qty,
      descricao: desc,
    }
  })
  return formattedSpllited
}
export default async function handler(req, res) {
  const projectDb = await connectToProjectsDatabase(process.env.DB_KEY, 'projetos')
  const projectsCollection = await projectDb.collection('dados')

  const projects = await projectsCollection.find({ 'contrato.status': 'ASSINADO', 'vistoria.status': 'REALIZADA' }).toArray()

  const filtered = projects.filter((project) => {
    const genFactor = GenerationFactors.find((gen) => gen.CIDADE == project.cidade)?.ANUAL || 127
    console.log(genFactor)
    const peakPower = project.sistema.potPico || 0
    const expectedGen = peakPower * genFactor
    return expectedGen >= 9000
  })

  const formatted = filtered.map((project) => {
    const genFactor = GenerationFactors.find((gen) => gen.CIDADE == project.cidade)?.ANUAL || 127
    console.log(genFactor)
    const peakPower = project.sistema.potPico || 0
    const expectedGen = peakPower * genFactor
    return {
      NOME: project.nomeDoContrato,
      TELEFONE: project.telefone,
      VENDEDOR: project.vendedor.nome,
      'POTÊNCIA PICO': project.sistema.potPico,
      'EXPECTATIVA DE GERAÇÃO': expectedGen || 0,
      ASSINATURA: formatDateAsLocale(project.contrato.dataAssinatura),
    }
  })
  const totalPower = formatted.reduce((acc, current) => {
    return acc + current['POTÊNCIA PICO']
  }, 0)
  console.log(totalPower)
  res.json(formatted)
}
