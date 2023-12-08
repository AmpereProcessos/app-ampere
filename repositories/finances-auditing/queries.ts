import { ExpenseRevenueList, TProjectFinances } from '@/pages/api/stats/financial-auditing'
import { TExpense } from '@/utils/schemas/expenses'
import { TProject, TProjectDTO, TProjectEntity } from '@/utils/schemas/projects'
import createHttpError from 'http-errors'
import { Collection, ObjectId } from 'mongodb'

type GetFinancesByProjectIdParams = {
  projectId: string
  projectsCollection: Collection<TProject>
  expensesCollection: Collection<TExpense>
}
const projection = {
  _id: 1,
  nomeDoContrato: 1,
  tipoDeServico: 1,
  cidade: 1,
  'vendedor.nome': 1,
  'contrato.dataAssinatura': 1,
  'obra.saida': 1,
  comissoes: 1,
  'compra.valorDoKit': 1,
  'sistema.valorProjeto': 1,
  'padrao.valor': 1,
  'estruturaPersonalizada.valor': 1,
}
export async function getFinancesByProjectId({ projectId, projectsCollection, expensesCollection }: GetFinancesByProjectIdParams) {
  try {
    const project = await projectsCollection.findOne({ _id: new ObjectId(projectId) }, { projection: projection })
    if (!project) throw createHttpError.NotFound('Projeto não encontrado.')
    const projectExpenses = await expensesCollection.find({ 'projeto.id': projectId }).toArray()
    // Defining project info]
    const _id = project._id.toString()
    const nome = project.nomeDoContrato
    const tipoDeServico = project.tipoDeServico
    const cidade = project.cidade
    const vendedor = project.vendedor.nome
    const dataAssinatura = project.contrato.dataAssinatura
    const dataConclusaoObra = project.obra.saida
    const systemRevenue = project.sistema.valorProjeto
    const energyPaRevenue = project.padrao.valor || 0
    const structureRevenue = project.estruturaPersonalizada.valor || 0
    const saleTotal = systemRevenue + energyPaRevenue + structureRevenue

    const sellerComission = project.comissoes?.porcentagemVendedor || 0
    const insiderComission = project.comissoes?.porcentagemInsider || 0
    const totalComissionPercentage = sellerComission + insiderComission + 0.75 // 0.75 for managers
    // Formatting project expenses
    const expenses: ExpenseRevenueList = projectExpenses.map((expense) => {
      return {
        id: expense._id.toString(),
        categoria: expense.categoria,
        itens: expense.itens,
        total: expense.total,
      }
    })
    // Pushing cost of the kit generator, if it exists
    const kitCost = project.compra.valorDoKit || 0
    if (kitCost) expenses.push({ id: undefined, categoria: 'CUSTO DO KIT GERADOR', itens: [], total: kitCost })

    // Pushing comission costs, if they exist
    var comissionCost = 0
    const comissionWasPaid = !!project.comissoes?.pagamentoRealizado
    if (comissionWasPaid) comissionCost = (totalComissionPercentage / 100) * saleTotal
    if (comissionCost) expenses.push({ id: undefined, categoria: 'COMISSÕES', itens: [], total: comissionCost })

    // Formatting project revenues
    var revenues = []
    if (systemRevenue) revenues.push({ categoria: tipoDeServico, itens: [], total: systemRevenue })
    if (energyPaRevenue) revenues.push({ categoria: 'PADRÃO DE ENERGIA', itens: [], total: energyPaRevenue })
    if (structureRevenue) revenues.push({ categoria: 'ESTRUTURA', itens: [], total: structureRevenue })

    const projectFinances: TProjectFinances = {
      _id,
      nome,
      cidade,
      vendedor,
      dataAssinatura,
      dataConclusaoObra,
      despesas: {},
      despesasLista: expenses,
      receitas: {},
      receitasLista: revenues,
    }
    return projectFinances
  } catch (error) {
    throw error
  }
}
