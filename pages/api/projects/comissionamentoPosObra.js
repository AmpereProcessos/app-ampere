import connectToDatabase from "../../../utils/connectDb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    let arr = await collection
      .aggregate([
        {
          $match: {
            "conferencias.energiaInjetada.data": null,
            "contrato.status": "ASSINADO",
            "obra.saida": { $gte: "2022-10-01T00:00:00.000Z" },
          },
        },
        {
          $project: {
            nomeDoContrato: 1,
            qtde: 1,
            app: 1,
            conferencias: 1,
            cidade: 1,
            "medidor.data": 1,
            "obra.saida": 1,
            "obra.equipeResp": 1,
          },
        },
      ])
      .toArray();
    res.json(arr);
  }
}
