import connectToDatabase from "../../../utils/projectsDb";

export default async function handler(req, res) {
  if (req.method === "GET") {
    var date = new Date();
    var currentMonth = date.getMonth() + 1;
    var currentYear = date.getFullYear();
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("dados");
    let installedInfo = await collection
      .aggregate([
        {
          $match: {
            "obra.saida": { $ne: "-" },
          },
        },
        {
          $group: {
            _id: {
              ano: {
                $year: { $dateFromString: { dateString: "$obra.saida" } },
              },
              mes: {
                $month: { $dateFromString: { dateString: "$obra.saida" } },
              },
            },
            total: {
              $sum: "$sistema.potPico",
            },
            count: { $count: {} },
          },
        },
        {
          $sort: {
            "_id.ano": -1,
            "_id.mes": -1,
          },
        },
      ])
      .toArray();
    let averageHomoData = await collection
      .aggregate([
        {
          $match: {
            "parecer.statusDoParecerDeAcesso": { $ne: "CANCELADO" },
            "obra.saida": { $ne: "-" },
            "obra.statusDaObra": { $ne: "OBRA CANCELADA" },
          },
        },
        {
          $group: {
            _id: {
              ano: {
                $year: {
                  $dateFromString: {
                    dateString: "$parecer.dataParecerDeAcesso",
                  },
                },
              },
              mes: {
                $month: {
                  $dateFromString: {
                    dateString: "$parecer.dataParecerDeAcesso",
                  },
                },
              },
            },
            averageTime: {
              $avg: {
                $dateDiff: {
                  startDate: {
                    $dateFromString: {
                      dateString: "$projeto.dataAssDocumentacao",
                    },
                  },
                  endDate: {
                    $dateFromString: {
                      dateString: "$parecer.dataParecerDeAcesso",
                    },
                  },
                  unit: "day",
                },
              },
            },
            homoPeakPot: { $sum: "$sistema.potPico" },
          },
        },
        {
          $sort: {
            "_id.ano": -1,
            "_id.mes": -1,
          },
        },
      ])
      .toArray();
    let suprimentosData = await collection
      .aggregate([
        {
          $match: {
            "contrato.status": "ASSINADO",
            "obra.statusDaObra": { $ne: "OBRA CANCELADA" },
          },
        },
        {
          $group: {
            _id: {
              ano: {
                $year: {
                  $dateFromString: {
                    dateString: "$compra.dataLiberacao",
                  },
                },
              },
              mes: {
                $month: {
                  $dateFromString: {
                    dateString: "$compra.dataLiberacao",
                  },
                },
              },
            },
            tempoMedio: {
              $avg: {
                $dateDiff: {
                  startDate: {
                    $dateFromString: {
                      dateString: "$compra.dataLiberacao",
                    },
                  },
                  endDate: {
                    $dateFromString: {
                      dateString: "$compra.dataPedido",
                    },
                  },
                  unit: "day",
                },
              },
            },
          },
        },
        {
          $sort: {
            "_id.ano": -1,
            "_id.mes": -1,
          },
        },
        {
          $match: {
            "_id.ano": { $gte: 2021 },
          },
        },
      ])
      .toArray();
    let promotores = await collection
      .aggregate([
        {
          $match: {
            nps: { $in: [9, 10] },
          },
        },
        {
          $count: "nps",
        },
      ])
      .toArray();
    let detratores = await collection
      .aggregate([
        {
          $match: {
            nps: { $in: [0, 1, 2, 3, 4, 5, 6] },
          },
        },
        {
          $count: "nps",
        },
      ])
      .toArray();
    let consultasTotais = await collection
      .aggregate([
        {
          $match: {
            nps: { $in: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
          },
        },
        {
          $count: "nps",
        },
      ])
      .toArray();
    var nps = (
      ((promotores[0].nps - detratores[0].nps) * 100) /
      consultasTotais[0].nps
    ).toFixed(2);
    return res.status(201).json({
      installedInfo,
      averageHomoData,
      suprimentosData,
      nps,
    });
  }
  if (req.method === "POST") {
    var date = new Date();
    var currentMonth = date.getMonth() + 1;
    var currentYear = date.getFullYear();
    var regional = req.body.regional;
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("data");
    let installedInfo = await collection
      .aggregate([
        {
          $match: {
            regional: regional,
            "obra.saida": { $ne: "-" },
          },
        },
        {
          $group: {
            _id: {
              ano: {
                $year: { $dateFromString: { dateString: "$obra.saida" } },
              },
              mes: {
                $month: { $dateFromString: { dateString: "$obra.saida" } },
              },
            },
            total: {
              $sum: "$sistema.potPico",
            },
            count: { $count: {} },
          },
        },
        {
          $sort: {
            "_id.ano": -1,
            "_id.mes": -1,
          },
        },
      ])
      .toArray();
    let averageHomoData = await collection
      .aggregate([
        {
          $match: {
            "parecer.statusDoParecerDeAcesso": { $ne: "CANCELADO" },
            "obra.saida": { $ne: "-" },
            "obra.statusDaObra": { $ne: "OBRA CANCELADA" },
            regional: regional,
          },
        },
        {
          $group: {
            _id: {
              ano: {
                $year: {
                  $dateFromString: {
                    dateString: "$parecer.dataParecerDeAcesso",
                  },
                },
              },
              mes: {
                $month: {
                  $dateFromString: {
                    dateString: "$parecer.dataParecerDeAcesso",
                  },
                },
              },
            },
            averageTime: {
              $avg: {
                $dateDiff: {
                  startDate: {
                    $dateFromString: {
                      dateString: "$projeto.dataAssDocumentacao",
                    },
                  },
                  endDate: {
                    $dateFromString: {
                      dateString: "$parecer.dataParecerDeAcesso",
                    },
                  },
                  unit: "day",
                },
              },
            },
            homoPeakPot: { $sum: "$sistema.potPico" },
          },
        },
        {
          $sort: {
            "_id.ano": -1,
            "_id.mes": -1,
          },
        },
      ])
      .toArray();
    return res.status(201).json({
      installedInfo,
      averageHomoData,
    });
  }
}
