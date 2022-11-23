import connectToDatabase from "../../../utils/connectDb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    let suprimentos = await collection
      .aggregate([
        {
          $match: {
            "compra.statusEntrega": {
              $in: [
                "EM ROTA",
                "AGUARDANDO COMPRA",
                "",
                null,
                undefined,
                " ",
                "NÃO DEFINIDO",
                "CANCELADO",
              ],
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
    res.json(suprimentos);
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
                "compra.statusEntrega": {
                  $in: [
                    "EM ROTA",
                    "AGUARDANDO COMPRA",
                    "",
                    null,
                    undefined,
                    " ",
                    "NÃO DEFINIDO",
                    "CANCELADO",
                  ],
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
                "compra.statusEntrega": {
                  $in: [
                    "EM ROTA",
                    "AGUARDANDO COMPRA",
                    "",
                    null,
                    undefined,
                    " ",
                    "NÃO DEFINIDO",
                    "CANCELADO",
                  ],
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
                "compra.statusEntrega": {
                  $in: [
                    "EM ROTA",
                    "AGUARDANDO COMPRA",
                    "",
                    null,
                    undefined,
                    " ",
                    "NÃO DEFINIDO",
                    "CANCELADO",
                  ],
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
