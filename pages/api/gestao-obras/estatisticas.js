import dayjs from 'dayjs'
import connectToDatabase from '../../../utils/services/mongodb/projects'
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const db = await connectToDatabase(process.env.DB_KEY, 'projetos')
    const collection = db.collection('dados')
    let padroes = await collection
      .aggregate([
        {
          $match: {
            'padrao.aumentoCarga.aplicavel': true,
            'padrao.aumentoCarga.dataEfetivacao': null,
          },
        },
        {
          $project: {
            'compra.dataPagamento ': 1,
          },
        },
      ])
      .toArray()
    let estruturas = await collection
      .aggregate([
        {
          $match: {
            'estruturaPersonalizada.aplicavel': 'SIM',
            'estruturaPersonalizada.status': { $ne: 'PRONTA' },
          },
        },
        {
          $project: {
            'compra.statusLiberacao': 1,
          },
        },
      ])
      .toArray()
    let obras = await collection
      .aggregate([
        {
          $match: {
            'obra.statusDaObra': { $nin: ['CONCLUIDA', 'OBRA CANCELADA'] },
            'contrato.status': 'ASSINADO',
          },
        },
        {
          $project: {
            'compra.statusEntrega': 1,
            'material.statusSeparacao': 1,
            'obra.observacoes': 1,
          },
        },
      ])
      .toArray()
    let oss = await collection
      .aggregate([
        {
          $match: {
            ordensDeServico: { $ne: null },
            'ordensDeServico.dataDeFechamento': null,
          },
        },
        {
          $project: {
            'ordensDeServico.dataDeAbertura': 1,
          },
        },
      ])
      .toArray()
    let compras = await collection
      .aggregate([
        {
          $match: {
            'contrato.status': 'ASSINADO',
            'obra.statusDaObra': { $ne: 'CONCLUIDA' },
            'compra.dataLiberacao': { $ne: null },
            'compra.dataPedido': null,
          },
        },
        {
          $project: {
            'compra.dataPagamento ': 1,
          },
        },
      ])
      .toArray()
    var arr = {
      padroes: {
        total: padroes.length,
        parcial: padroes.filter((x) => !!x.compra.dataPagamento).length,
      },
      estruturas: {
        total: estruturas.length,
        parcial: estruturas.filter((x) => !!x.compra.dataPagamento).length,
      },
      obras: {
        total: obras.length,
        parcial: obras.filter((x) => x.compra.statusEntrega == 'ENTREGUE').length,
        obsPendente: obras.filter((x) => x.obra.observacoes == undefined || x.obra.observacoes.trim() == 0).length,
        separacaoPendente: obras.filter((x) => x.material.statusSeparacao != 'SEPARADO').length,
      },
      oss: {
        total: oss.length,
      },
      compras: {
        total: compras.length,
        parcial: compras.filter((x) => dayjs(new Date()).diff(x.compra.dataLiberacao, 'day') > 5).length,
      },
    }
    res.json(arr)
  }
}
