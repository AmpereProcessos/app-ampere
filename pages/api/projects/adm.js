import connectToDatabase from '../../../utils/services/mongodb/projects'
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const db = await connectToDatabase(process.env.DB_KEY, 'projetos')
    const collection = db.collection('dados')
    let adm = await collection
      .aggregate([
        {
          $match: {
            'contrato.status': { $ne: 'RESCISÃO DE CONTRATO' },
            $or: [
              {
                tipoDeServico: {
                  $nin: ['OPERAÇÃO E MANUTENÇÃO', 'MONTAGEM E DESMONTAGEM'],
                },
                'obra.statusDaObra': 'CONCLUIDA',
              },
              {
                tipoDeServico: {
                  $in: ['OPERAÇÃO E MANUTENÇÃO', 'MONTAGEM E DESMONTAGEM', 'SEGURO DE SISTEMA FOTOVOLTAICO'],
                },
                'contrato.status': 'ASSINADO',
              },
            ],
            $or: [{ 'pagamento.cobrancaFeita': { $ne: true } }, { 'faturamento.concluido': { $ne: true } }],
          },
        },
        {
          $project: {
            _id: 1,
            qtde: 1,
            nomeDoContrato: 1,
            tipoDeServico: 1,
            'vendedor.nome': 1,
            'pagamento.forma': 1,
            'pagamento.status': 1,
            'pagamento.cobrancaFeita': 1,
            'faturamento.concluido': 1,
            'faturamento.empresaFaturamento': 1,
            'contrato.status': 1,
            'contrato.dataAssinatura': 1,
            'compra.statusLiberacao': 1,
            'obra.equipeResp': 1,
            'obra.saida': 1,
            'medidor.data': 1,
            'vistoria.status': 1,
          },
        },
        {
          $sort: {
            qtde: -1,
          },
        },
      ])
      .toArray()
    res.json(adm)
  }
}
