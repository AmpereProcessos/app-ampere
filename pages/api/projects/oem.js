import connectToDatabase from "../../../utils/connectDb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    let oem = await collection
      .aggregate([
        {
          $match: {
            "obra.statusDaObra": {
              $in: [
                "AGENDADA",
                "AGUARDANDO AGENDAMENTO",
                "EM ANDAMENTO",
                "CONCLUIDA",
              ],
            },
          },
        },
        {
          $limit: 700,
        },
      ])
      .toArray();
    res.json(oem);
  } else if (req.method === "POST") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    let oem = await collection
      .aggregate([
        {
          $match: {
            qtde: { $gt: 713 },
            "obra.statusDaObra": {
              $in: [
                "AGENDADA",
                "AGUARDANDO AGENDAMENTO",
                "EM ANDAMENTO",
                "CONCLUIDA",
              ],
            },
          },
        },
        {
          $limit: 700,
        },
      ])
      .toArray();
    res.json(oem);
  } else if (req.method === "PUT") {
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
                  $in: [
                    "AGENDADA",
                    "AGUARDANDO AGENDAMENTO",
                    "EM ANDAMENTO",
                    "CONCLUIDA",
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
                "obra.statusDaObra": {
                  $in: [
                    "AGENDADA",
                    "AGUARDANDO AGENDAMENTO",
                    "EM ANDAMENTO",
                    "CONCLUIDA",
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
                "obra.statusDaObra": {
                  $in: [
                    "AGENDADA",
                    "AGUARDANDO AGENDAMENTO",
                    "EM ANDAMENTO",
                    "CONCLUIDA",
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
export const config = {
  api: {
    responseLimit: "8mb",
  },
};
