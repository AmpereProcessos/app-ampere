import connectToDatabase from "../../../utils/projectsDb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("data");
    let comercial = await collection
      .aggregate([
        {
          $match: {
            statuscontrato: { $ne: "RECISÃO DE CONTRATO" },
            statuspagamento: { $in: ["AGUARDANDO PAGAMENTO", null] },
          },
        },
      ])
      .toArray();
    let suprimentos = await collection
      .aggregate([
        {
          $match: {
            statusentrega: { $in: ["EM ROTA", "AGUARDANDO COMPRA", "", null] },
            statuscontrato: "ASSINADO",
          },
        },
      ])
      .toArray();
    let projetos = await collection
      .aggregate([
        {
          $match: {
            projetoconcluido: { $ne: "SIM" },
            iniciarprojeto: "SIM",
          },
        },
      ])
      .toArray();
    let obras = await collection
      .aggregate([
        {
          $match: {
            statusobra: {
              $in: ["AGENDADA", "AGUARDANDO AGENDAMENTO", "EM ANDAMENTO"],
            },
            statuscontrato: "ASSINADO",
            statuspagamento: "PAGO",
          },
        },
      ])
      .toArray();
    let posvenda = await collection
      .aggregate([
        {
          $match: {
            statuscontrato: "ASSINADO",
            statustrocamedidor: { $ne: "REALIZADA" },
          },
        },
      ])
      .toArray();
    let oem = await collection
      .aggregate([
        {
          $match: {
            statusobra: "CONCLUIDA",
          },
        },
        {
          $sort: {
            saidadeobra: -1,
          },
        },
      ])
      .toArray();
    //obras - FILTRAR POR CONTRATO ASSINADO E STATUS DE PAGAMENTO PAGO
    res.json({
      comercial,
      suprimentos,
      projetos,
      obras,
      posvenda,
      oem,
    });
  }
}
