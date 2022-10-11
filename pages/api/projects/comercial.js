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
    res.json(comercial);
  }
}
