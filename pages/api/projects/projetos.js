import connectToDatabase from "../../../utils/connectDb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    let projetos = await collection
      .aggregate([
        {
          $sort: {
            qtde: 1,
          },
        },
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
          $project: {
            _id: 1,
            qtde: 1,
            nomeDoContrato: 1,
            "parecer.statusDoParecerDeAcesso": 1,
            "vistoria.status": 1,
            "projeto.diagramaUnifilar": 1,
            "projeto.desenhoTelhado": 1,
            "contrato.dataAssinatura": 1,
            "sistema.potPico": 1,
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
