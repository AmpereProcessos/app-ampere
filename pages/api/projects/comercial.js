import connectToDatabase from "../../../utils/projectsDb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("dados");
    let comercial = await collection
      .aggregate([
        {
          $match: {
            "contrato.status": { $ne: "RECISÃO DE CONTRATO" },
            "pagamento.status": { $in: ["AGUARDANDO PAGAMENTO", null] },
          },
        },
      ])
      .toArray();
    res.json(comercial);
  }
}
