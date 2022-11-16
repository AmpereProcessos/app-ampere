import connectToDatabase from "../../../utils/connectDb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    let comercial = await collection
      .aggregate([
        {
          $match: {
            "contrato.status": { $ne: "RECISÃO DE CONTRATO" },
            "obra.statusDaObra": {
              $in: [
                "AGENDADA",
                "AGUARDANDO AGENDAMENTO",
                "EM ANDAMENTO",
                "NÃO DEFINIDO",
                "CASA EM CONSTRUÇÃO",
                "",
                null,
                undefined,
              ],
            },
          },
        },
      ])
      .toArray();
    res.json(comercial);
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
                "contrato.status": { $ne: "RECISÃO DE CONTRATO" },
                "obra.statusDaObra": {
                  $in: [
                    "AGENDADA",
                    "AGUARDANDO AGENDAMENTO",
                    "EM ANDAMENTO",
                    "NÃO DEFINIDO",
                    "CASA EM CONSTRUÇÃO",
                    "",
                    null,
                    undefined,
                  ],
                },
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
                "contrato.status": { $ne: "RECISÃO DE CONTRATO" },
                "obra.statusDaObra": {
                  $in: [
                    "AGENDADA",
                    "AGUARDANDO AGENDAMENTO",
                    "EM ANDAMENTO",
                    "NÃO DEFINIDO",
                    "CASA EM CONSTRUÇÃO",
                    "",
                    null,
                    undefined,
                  ],
                },
              },
            },
          ])
          .toArray();
      default:
        arr = await collection
          .aggregate([
            {
              $match: {
                "contrato.status": { $ne: "RECISÃO DE CONTRATO" },
                "obra.statusDaObra": {
                  $in: [
                    "AGENDADA",
                    "AGUARDANDO AGENDAMENTO",
                    "EM ANDAMENTO",
                    "NÃO DEFINIDO",
                    "CASA EM CONSTRUÇÃO",
                    "",
                    null,
                    undefined,
                  ],
                },
              },
            },
          ])
          .toArray();
    }
    res.json(arr);
  }
}
