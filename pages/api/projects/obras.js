import connectToDatabase from "../../../utils/connectDb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    let obras = await collection
      .aggregate([
        {
          $match: {
            "obra.statusDaObra": {
              $ne: "CONCLUIDA",
            },
            "contrato.status": "ASSINADO",
          },
        },
        {
          $sort: {
            qtde: 1,
          },
        },
      ])
      .toArray();
    res.json(obras);
  } else if (req.method === "POST") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    var arr;
    switch (req.body.filtrarPor) {
      case "REGIONAL":
        arr = await collection
          .aggregate([
            {
              $match: {
                regional: req.body.parametro,
                "obra.statusDaObra": {
                  $ne: "CONCLUIDA",
                },
                "contrato.status": "ASSINADO",
              },
            },
            {
              $sort: {
                qtde: 1,
              },
            },
          ])
          .toArray();
        break;
      case "VENDEDOR":
        arr = await collection
          .aggregate([
            {
              $match: {
                "vendedor.nome": req.body.parametro,
                "obra.statusDaObra": {
                  $ne: "CONCLUIDA",
                },
                "contrato.status": "ASSINADO",
              },
            },
            {
              $sort: {
                qtde: 1,
              },
            },
          ])
          .toArray();
      default:
        arr = await collection
          .aggregate([
            {
              $match: {
                "obra.statusDaObra": {
                  $ne: "CONCLUIDA",
                },
                "contrato.status": "ASSINADO",
              },
            },
            {
              $sort: {
                qtde: 1,
              },
            },
          ])
          .toArray();
    }
    res.json(arr);
  }
}
