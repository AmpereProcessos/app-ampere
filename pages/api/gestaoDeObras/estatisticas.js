import connectToDatabase from "../../../utils/connectDb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    let padroes = await collection
      .aggregate([
        {
          $match: {
            "projeto.aumentoDeCarga": "SIM",
            "projeto.acStatus": "PENDÊNCIA",
          },
        },
        {
          $project: {
            "compra.statusLiberacao": 1,
          },
        },
      ])
      .toArray();
    let estruturas = await collection
      .aggregate([
        {
          $match: {
            "estruturaPersonalizada.aplicavel": "SIM",
            "estruturaPersonalizada.status": "PENDÊNCIA",
          },
        },
        {
          $project: {
            "compra.statusLiberacao": 1,
          },
        },
      ])
      .toArray();
    let obras = await collection
      .aggregate([
        {
          $match: {
            "obra.statusDaObra": { $nin: ["CONCLUIDA", "OBRA CANCELADA"] },
          },
        },
        {
          $project: {
            "compra.statusEntrega": 1,
          },
        },
      ])
      .toArray();
    var arr = {
      padroes: {
        total: padroes.length,
        parcial: padroes.filter((x) => x.compra.statusLiberacao == "PAGO")
          .length,
      },
      estruturas: {
        total: estruturas.length,
        parcial: estruturas.filter((x) => x.compra.statusLiberacao == "PAGO")
          .length,
      },
      obras: {
        total: obras.length,
        parcial: obras.filter((x) => x.compra.statusEntrega == "ENTREGUE")
          .length,
      },
    };
    res.json(arr);
  }
}
