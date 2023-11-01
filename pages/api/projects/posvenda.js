import connectToDatabase from '../../../utils/services/mongodb/projects'
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const db = await connectToDatabase(process.env.DB_KEY, 'projetos')
    const collection = db.collection('dados')
    let posvenda = await collection
      .aggregate([
        {
          $match: {
            'contrato.status': {
              $in: ['ASSINADO'],
            },
            tipoDeServico: { $ne: 'OPERAÇÃO E MANUTENÇÃO' },
            'jornada.jornadaConcluida': { $ne: true },
          },
        },
        {
          $project: {
            _id: 1,
            qtde: 1,
            nomeDoContrato: 1,
            tipoDeServico: 1,
            telefone: 1,
            jornada: 1,
            cidade: 1,
            'contrato.status': 1,
            'contrato.dataAssinatura': 1,
            'vendedor.nome': 1,
            'parecer.statusDoParecerDeAcesso': 1,
            'projeto.dataLiberacaoDocumentacao': 1,
            'projeto.dataAssDocumentacao': 1,
            'compra.statusLiberacao': 1,
            'compra.previsaoEntrega': 1,
            'obra.entrada': 1,
            'obra.saida': 1,
            'faturamento.previsaoFaturamento': 1,
            'faturamento.dataFaturamento': 1,
            'sistema.qtdeModulos': 1,
            'medidor.data': 1,
            possuiDeficiencia: 1,
            qualDeficiencia: 1,
            nps: 1,
          },
        },
        {
          $sort: {
            qtde: 1,
          },
        },
      ])
      .toArray()
    let assinatura = await collection
      .aggregate([
        {
          $match: {
            'projeto.projetoConcluido': { $ne: 'SIM' },
            $or: [{ 'compra.statusLiberacao': 'PAGO' }, { 'projeto.iniciar': 'SIM' }],
            'projeto.dataAssDocumentacao': null, // filtrar statusDoParecerDeAcesso = "AGUARDANDO ASSINATURA"
          },
        },
        {
          $project: {
            'projeto.dataAssDocumentacao': 1,
            'parecer.statusDoParecerDeAcesso': 1,
          },
        },
      ])
      .toArray()
    res.json({
      projetos: posvenda,
      assinatura: {
        confeccionar: assinatura.filter((x) => x.parecer.statusDoParecerDeAcesso != 'AGUARDANDO ASSINATURA').length,
        paraAssinar: assinatura.filter((x) => x.parecer.statusDoParecerDeAcesso == 'AGUARDANDO ASSINATURA').length,
      },
    })
  }
}
