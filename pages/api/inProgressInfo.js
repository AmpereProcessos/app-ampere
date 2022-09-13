import connectToDatabase from "../../utils/projectsDb";
export default async function handler(req, res) {
  const db = await connectToDatabase(process.env.DB_KEY);
  const collection = db.collection("data");
  let inComercialPhase = await collection
    .aggregate([
      {
        $match: {
          statusliberacaocredito: {
            $in: [
              "AGUARDAR PARECER DE ACESSO",
              "AGUARDAR CONTRATO",
              "AGUARDANDO LIBERAÇÃO DE CRÉDITO",
            ],
          },
        },
      },
    ])
    .toArray();
  let supplyPhase = await collection
    .aggregate([
      {
        $match: {
          iniciarprojeto: { $ne: "CONTRATO CANCELADO" },
          statusliberacaocredito: {
            $ne: {
              $in: [
                "AGUARDAR PARECER DE ACESSO",
                "AGUARDAR CONTRATO",
                "AGUARDANDO LIBERAÇÃO DE CRÉDITO",
              ],
            },
          },
          statusentrega: {
            $in: ["AGUARDANDO COMPRA", "EM ROTA"],
          },
        },
      },
    ])
    .toArray();
  let projectPhase = await collection
    .aggregate([
      {
        $match: {
          statuscontrato: "ASSINADO",
          iniciarprojeto: "SIM",
          projetoconcluido: { $ne: "SIM" },
        },
      },
    ])
    .toArray();
  console.log(supplyPhase.length);
  return res.json(supplyPhase);
}
