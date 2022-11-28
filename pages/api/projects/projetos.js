import connectToDatabase from "../../../utils/connectDb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    let projetos = await collection
      .aggregate([
        {
          $match: {
            "contrato.status": { $ne: "RECISÃO DE CONTRATO" },
            "projeto.projetoConcluido": { $ne: "SIM" },
            $or: [
              { "compra.statusLiberacao": "PAGO" },
              { "projeto.iniciar": "SIM" },
            ],
          },
        },
        {
          $sort: {
            qtde: 1,
          },
        },
      ])
      .toArray();
    res.json(projetos);
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
                "projeto.projetoConcluido": { $ne: "SIM" },
                $or: [
                  { "compra.statusLiberacao": "PAGO" },
                  { "projeto.iniciar": "SIM" },
                ],
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
                "projeto.projetoConcluido": { $ne: "SIM" },
                $or: [
                  { "compra.statusLiberacao": "PAGO" },
                  { "projeto.iniciar": "SIM" },
                ],
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
                "projeto.projetoConcluido": { $ne: "SIM" },
                $or: [
                  { "compra.statusLiberacao": "PAGO" },
                  { "projeto.iniciar": "SIM" },
                ],
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
