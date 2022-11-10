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
  } else if (req.method === "POST") {
    let date = new Date().toJSON();
    var obj = { ...req.body, abertura: date };
    const db = await connectToDatabase(process.env.DB_KEY, "chamados");
    const collection = db.collection("projetos");
    console.log(req.body);
    try {
      let created = await collection.insertOne(obj);
      res.json("CHAMADO ABERTO");
    } catch (error) {
      res.error(error);
    }
  }
}
