import { apiHandler } from '@/utils/api'
import { formatDateAsLocale } from '@/utils/methods/formatting'
import { TExpenseDTO } from '@/utils/schemas/expenses'
import { TProject } from '@/utils/schemas/projects'
import connectToDatabase from '@/utils/services/mongodb/projects'
import createHttpError from 'http-errors'
import { Collection, Db, WithId } from 'mongodb'
import { NextApiHandler } from 'next'

type GetResponse = {}

const exportData: NextApiHandler<GetResponse> = async (req, res) => {
  const PAGE_SIZE = 200
  const { page } = req.query

  if (!page || isNaN(Number(page))) throw new createHttpError.BadRequest('Parâmetro de paginação inválido ou não informado.')

  const skip = PAGE_SIZE * (Number(page) - 1)
  const limit = PAGE_SIZE

  const db: Db = await connectToDatabase(process.env.DB_KEY, 'projetos')
  const collection: Collection<TProject> = db.collection('dados')

  const data = await fetchData({ collection: collection, skip: skip, limit: limit })

  const result = data.map((project) => {
    // Revenues
    const systemRevenue = project.sistema.valorProjeto
    const energyPaRevenue = project.padrao.valor || 0
    const structureRevenue = project.estruturaPersonalizada.valor || 0

    const totalEarned = systemRevenue + energyPaRevenue + structureRevenue
    // Expenses
    const kitExpense = project.compra.valorDoKit || 0
    const comissionWasPaid = !!project.comissoes?.pagamentoRealizado
    const sellerComission = (totalEarned * (project.comissoes?.porcentagemVendedor || 0)) / 100
    const insiderComission = (totalEarned * (project.comissoes?.porcentagemInsider || 0)) / 100
    const managersComission = (totalEarned * 0.75) / 100
    const comissionCost = comissionWasPaid ? sellerComission + insiderComission + managersComission : 0

    const totalSpend = kitExpense + comissionCost + project.despesas.reduce((acc, current) => acc + current.total, 0)

    return {
      QTDE: project.qtde,
      'NOME DO CONTRATO': project.nomeDoContrato || '',
      'NOME DO PROJETO': project.nomeDoProjeto || '',
      'TIPO DE PROJETO': project.tipoDeServico,
      UF: project.uf,
      CIDADE: project.cidade,
      SEGMENTO: project.segmento,
      'CANAL DE VENDA': project.canalVenda,
      'CÓDIGO DO CRM': project.codigoSVB,
      VENDEDOR: project.vendedor.nome,
      'STATUS DO CONTRATO': project.contrato.dataAssinatura,
      'DATA DE ASSINATURA': project.contrato.dataAssinatura ? formatDateAsLocale(project.contrato.dataAssinatura) : null,
      'FORMA DE PAGAMENTO': project.pagamento.forma,
      CREDOR: project.pagamento.credor,
      TOPOLOGIA: project.sistema.topologia,
      'QTDE DE MÓDULOS': project.sistema.qtdeModulos || 0,
      'POTÊNCIA DOS MÓDULOS': project.sistema.potModulos || 0,
      'POTÊNCIA PICO': project.sistema.potPico || 0,
      'VALOR DO CONTRATO': totalEarned,
      'VALOR DO SISTEMA': project.sistema.valorProjeto || 0,
      'VALOR DO PADRÃO': project.padrao.valor || 0,
      'VALOR DA ESTRUTURA': project.estruturaPersonalizada.valor || 0,
      'STATUS DA SUPRIMENTAÇÃO': project.compra.status,
      'STATUS DA ENTREGA': project.compra.statusEntrega,
      FORNECEDOR: project.compra.fornecedor,
      'DATA DE PEDIDO': project.compra.dataPedido ? formatDateAsLocale(project.compra.dataPedido) : null,
      'DATA DE PREVISÃO DE ENTREGA': project.compra.previsaoEntrega ? formatDateAsLocale(project.compra.previsaoEntrega) : null,
      'DATA DE ENTREGA': project.compra.dataEntrega ? formatDateAsLocale(project.compra.dataEntrega) : null,
      'STATUS DO PARECER DE ACESSO': project.parecer.statusDoParecerDeAcesso,
      'DATA DE APROVAÇÃO DO PARECER': project.parecer.dataParecerDeAcesso,
      'DESENHO DE TELHADO FEITO': project.projeto.desenhoTelhado,
      'MAPA DE MICRO FEITO': project.projeto.mapaDeMicro,
      'STATUS DA OBRA': project.obra.statusDaObra,
      'ENTRADA NA OBRA': project.obra.entrada,
      'SAÍDA DA OBRA': project.obra.saida,
      'EQUIPE DE EXECUÇÃO': project.obra.equipeResp,
      'STATUS DA VISTORIA': project.vistoria.status,
      'DATA DE PEDIDO DA VISTORIA': project.vistoria.dataPedido,
      'STATUS DA TROCA DE MEDIDOR': project.medidor.status,
      'STATUS DA MANUTENÇÃO PREVENTIVA': project.manutencaoPreventiva.status,
      'DATA DA MANUTENÇÃO PREVENTIVA': project.manutencaoPreventiva.data ? formatDateAsLocale(project.manutencaoPreventiva.data) : null,
      'TOTAL DE RECEITAS': totalEarned,
      'TOTAL DE DESPESAS': totalSpend,
    }
  })
  console.log('SKIP', skip)
  console.log('LIMIT', limit)
  return res.status(200).json(result)
}

export default apiHandler({ GET: exportData })

type FetchDataParams = {
  collection: Collection<TProject>
  skip: number
  limit: number
}
async function fetchData({ collection, skip, limit }: FetchDataParams) {
  const addFields = {
    idString: { $toString: '$_id' },
  }
  const expensesLookup = { from: 'despesas', localField: 'idString', foreignField: 'projeto.id', as: 'despesas' }
  const result = await collection
    .aggregate([{ $sort: { qtde: 1 } }, { $addFields: addFields }, { $lookup: expensesLookup }, { $skip: skip }, { $limit: limit }])
    .toArray()
  return result as WithId<TProjectWithExpenses>[]
}

type TProjectWithExpenses = TProject & { despesas: TExpenseDTO[] }
