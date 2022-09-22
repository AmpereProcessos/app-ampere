import connectToDatabase from "../../../utils/projectsDb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("data");
    let comercial = await collection
      .aggregate([
        {
          $match: {
            statuscontrato: {
              $in: ["SOLICITADO", "AGUARDANDO SOLICITAÇÃO", "NÃO ASSINADO"],
            },
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
          },
        },
      ])
      .toArray();
    //obras - entregue
    console.log(
      comercial.length,
      suprimentos.length,
      projetos.length,
      obras.length
    );
    res.json({
      comercial,
      suprimentos,
      projetos,
      obras,
    });
  }
}
