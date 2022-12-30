import connectToDatabase from "../../../utils/connectDb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    let oem = await collection
      .aggregate([
        {
          $sort: {
            qtde: 1,
          },
        },
        {
          $match: {
            "contrato.status": "ASSINADO",
            $or: [
              {
                "obra.statusDaObra": {
                  $in: [
                    "AGENDADA",
                    "AGUARDANDO AGENDAMENTO",
                    "EM ANDAMENTO",
                    "CONCLUIDA",
                  ],
                },
              },
              { tipoDeServico: "OPERAÇÃO E MANUTENÇÃO" },
            ],
            "oem.oemConcluido": { $ne: true },
            "oem.plano": { $ne: null },
          },
        },
        {
          $project: {
            _id: 1,
            qtde: 1,
            nomeDoContrato: 1,
            cidade: 1,
            "projeto.topologia": 1,
            "obra.equipeResp": 1,
            "obra.statusDaObra": 1,
            "obra.saida": 1,
            "conferencias.usinaLigada": 1,
            "oem.plano": 1,
            tipoDeServico: 1,
            sistema: 1,
            app: 1,
            manutencaoPreventiva: 1,
            "medidor.data": 1,
          },
        },
      ])
      .toArray();
    res.json(oem);
  } else if (req.method === "POST") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    console.log("FUI CHAMADO");
    let oem = await collection
      .aggregate([
        {
          $sort: {
            qtde: 1,
          },
        },
        {
          $match: {
            $or: [
              {
                "obra.statusDaObra": {
                  $in: [
                    "AGENDADA",
                    "AGUARDANDO AGENDAMENTO",
                    "EM ANDAMENTO",
                    "CONCLUIDA",
                  ],
                },
              },
              { tipoDeServico: "OPERAÇÃO E MANUTENÇÃO" },
            ],
          },
        },
        {
          $match: {
            $or: [
              { "medidor.data": { $gte: "2021-06-01T00:00:00.000Z" } },
              { "medidor.data": null },
              { "manutencaoPreventiva.status": { $ne: "REALIZADO" } },
            ],
          },
        },
        {
          $project: {
            _id: 1,
            qtde: 1,
            nomeDoContrato: 1,
            cidade: 1,
            "projeto.topologia": 1,
            "obra.equipeResp": 1,
            "obra.statusDaObra": 1,
            "obra.saida": 1,
            "conferencias.usinaLigada": 1,
            sistema: 1,
            app: 1,
            manutencaoPreventiva: 1,
            "medidor.data": 1,
          },
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
