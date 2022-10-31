import connectToDatabase from "../../utils/projectsDb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("dados");
    let arr = await collection
      .aggregate([
        {
          $match: {
            "compra.dataPagamento": { $gte: "2022-10-01" },
          },
        },
        {
          $sort: {
            "compra.dataPagamento": 1,
          },
        },
      ])
      .toArray();
    var formattedArr = arr.map((project) => {
      return {
        QTDE: project.qtde,
        NOMEDOCONTRATO: project.nomeDoContrato,
        CPF_CNPJ: project.cpf_cnpj,
        TELEFONE: project.telefone,
        CIDADE: project.cidade,
        UF: project.uf,
        VENDEDOR: project.vendedor?.nome,
        REGIONAL: project.regional,
        CODIGOSVB: project.codigosvb,
        SEGMENTO: project.segmento,
        VALOR_PADRAO: project.padrao?.valor,
        VALOR_ESTRUTURA: project.estruturaPersonalizada.valor,
        CONTRATO_STATUS: project.contrato.status,
        CONTRATO_DATASSN: project.contrato.dataAssinatura
          ? new Date(project.contrato.dataAssinatura).toLocaleDateString(
              "pt-br"
            )
          : "-",
        CONTRATO_FORMAASSN: project.contrato.formaAssinatura,
        PAG_STATUS: project.pagamento.status,
        PAG_DATA: project.compra.dataPagamento
          ? new Date(project.compra.dataPagamento).toLocaleDateString("pt-br")
          : "-",
        PAG_FORMA: project.pagamento.forma,
        PAG_CREDOR: project.pagamento.credor,
        FATURAMENTO_PREV: project.faturamento.previsaoFaturamento,
        COMPRA_DATLIB: project.compra.dataLiberacao
          ? new Date(project.compra.dataLiberacao).toLocaleDateString("pt-br")
          : "-",
        VALOR_KIT: project.compra.valorDoKit,
        QTDEMODULOS: project.sistema.qtdeModulos,
        POTMODULOS: project.sistema.potModulos,
        POTPICO: project.sistema.potPico,
        TOPOLOGIA: project.sistema.topologia,
        INVERSOR: project.sistema.inversor,
        VALOR_PROJETO: project.sistema.valorProjeto,
      };
    });
    res.json(formattedArr);
  }
}
