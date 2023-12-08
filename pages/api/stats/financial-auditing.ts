import { getFinancesByProjectId } from '@/repositories/finances-auditing/queries'
import { apiHandler } from '@/utils/api'
import { TExpense } from '@/utils/schemas/expenses'
import { TProject, TProjectDTO } from '@/utils/schemas/projects'
import connectToDatabase from '@/utils/services/mongodb/projects'
import createHttpError from 'http-errors'
import { Collection, ObjectId } from 'mongodb'
import { NextApiHandler } from 'next'
import { z } from 'zod'

export type ExpenseRevenueList = {
  id?: string
  categoria: string
  itens: {
    qtde: number
    descricao: string
    unidade: string
    preco: number
    idMaterial?: string | null | undefined
  }[]
  total: number
}[]
export type TProjectFinances = {
  _id: string
  nome: string
  cidade: string
  vendedor: string
  dataAssinatura: string | null | undefined
  dataConclusaoObra: string | null | undefined
  despesas: { [key: string]: number }
  despesasLista?: ExpenseRevenueList
  receitas: { [key: string]: number }
  receitasLista?: ExpenseRevenueList
}

const DatetimeStringSchema = z
  .string({ required_error: 'Parâmetro de data não fornecido.', invalid_type_error: 'Tipo inválido para o parâmetro de data.' })
  .datetime({ message: 'Formato inválido para parâmetro de data.' })

const FieldStringSchema = z.string({ required_error: 'Campo de filtro não fornecido.', invalid_type_error: 'Tipo inválido para o campo de filtro.' })
type GetResponse = TProjectFinances[] | TProjectFinances

const getAnalysis: NextApiHandler<GetResponse> = async (req, res) => {
  const { after, before, field, id } = req.query

  const db = await connectToDatabase(process.env.DB_KEY, 'projetos')
  const projectsCollection: Collection<TProject> = db.collection('dados')
  const expensesCollection: Collection<TExpense> = db.collection('despesas')
  // In case query is for project especific finances
  if (id) {
    if (typeof id != 'string' || !ObjectId.isValid(id)) throw createHttpError.BadRequest('ID inválido.')
    const projectFinances = await getFinancesByProjectId({ projectId: id, projectsCollection, expensesCollection })
    return res.json(projectFinances)
  }
  // In case query is for financial auditing of especific period
  const validatedAfter = DatetimeStringSchema.parse(after)
  const validatedBefore = DatetimeStringSchema.parse(before)
  const validatedField = FieldStringSchema.parse(field)

  const projects = (await projectsCollection
    .aggregate([
      {
        $match: {
          $and: [{ [validatedField]: { $gte: validatedAfter } }, { [validatedField]: { $lte: validatedBefore } }],
        },
      },
      {
        $project: {
          _id: 1,
          nomeDoContrato: 1,
          'contrato.dataAssinatura': 1,
          'obra.saida': 1,
          cidade: 1,
          'vendedor.nome': 1,
          comissoes: 1,
          'compra.valorDoKit': 1,
          'sistema.valorProjeto': 1,
          'padrao.valor': 1,
          'estruturaPersonalizada.valor': 1,
        },
      },
      {
        $sort: {
          [validatedField]: -1,
        },
      },
    ])
    .toArray()) as Pick<
    TProjectDTO,
    '_id' | 'nomeDoContrato' | 'contrato' | 'comissoes' | 'compra' | 'cidade' | 'vendedor' | 'obra' | 'sistema' | 'padrao' | 'estruturaPersonalizada'
  >[]

  const expenses = await expensesCollection.find({}).toArray()

  const projectFinances = projects.map((project) => {
    // Defining project info
    const nome = project.nomeDoContrato
    const dataAssinatura = project.contrato.dataAssinatura
    const dataConclusaoObra = project.obra.saida
    const cidade = project.cidade
    const vendedor = project.vendedor.nome
    // Formatting the project expenses
    const projectExpenses = expenses.filter((exp) => exp.projeto?.id == project._id)
    const kitCost = project.compra.valorDoKit || 0
    const expensesFormatted = projectExpenses.reduce(
      (acc: { [key: string]: number }, current) => {
        const expenseCategory = current.categoria
        const expenseTotal = current.total
        if (!acc[expenseCategory]) acc[expenseCategory] = expenseTotal
        else acc[expenseCategory] += expenseTotal
        return acc
      },
      { 'CUSTO DO KIT GERADOR': kitCost }
    )
    // Formatting the project revenues
    const systemRevenue = project.sistema.valorProjeto
    const energyPaRevenue = project.padrao.valor || 0
    const structureRevenue = project.estruturaPersonalizada.valor || 0
    const revenuesFormatted: { [key: string]: number } = {
      'KIT GERADOR': systemRevenue,
      'PADRÃO DE ENERGIA': energyPaRevenue,
      ESTRUTURA: structureRevenue,
    }
    // If comission was paid, adding comission cost
    const comissionWasPaid = !!project.comissoes?.pagamentoRealizado
    // If wasn't paid, returning info
    if (!comissionWasPaid)
      return { _id: project._id, nome, cidade, vendedor, dataAssinatura, dataConclusaoObra, despesas: expensesFormatted, receitas: revenuesFormatted }
    // If it was, adding new expense and retuning info
    const saleTotal = systemRevenue + (energyPaRevenue || 0) + (structureRevenue || 0)
    const comissionCost =
      (saleTotal * (project.comissoes?.porcentagemVendedor || 0)) / 100 + (saleTotal * (project.comissoes?.porcentagemInsider || 0)) / 100
    expensesFormatted['COMISSÕES'] = comissionCost
    return { _id: project._id, nome, cidade, vendedor, dataAssinatura, dataConclusaoObra, despesas: expensesFormatted, receitas: revenuesFormatted }
  })
  // @ts-ignore
  return res.json(projectFinances)
}

export default apiHandler({
  GET: getAnalysis,
})
