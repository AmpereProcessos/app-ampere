import connectToDatabase from "../../../../utils/callsDb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("projetos");
    let chamadosAbertos = await collection
      .find({ status: { $ne: "FINALIZADO" } })
      .toArray();
    let chamadosFechados = await collection
      .aggregate([
        {
          $match: {
            status: "FINALIZADO",
          },
        },
      ])
      .toArray();
    res.json({
      chamadosAbertos: chamadosAbertos,
      chamadosFechados: chamadosFechados,
    });
  }
}
