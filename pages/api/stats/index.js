import connectToDatabase from "../../../utils/connectDb";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    let installedInfo = await collection
      .aggregate([
        {
          $match: {
            "contrato.status": "ASSINADO",
            tipoDeServico: { $ne: "OPERAÇÃO E MANUTENÇÃO" },
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
            "contrato.status": { $ne: "RECISÃO DE CONTRATO" },
            tipoDeServico: { $ne: "OPERAÇÃO E MANUTENÇÃO" },
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
            tipoDeServico: { $ne: "OPERAÇÃO E MANUTENÇÃO" },
            "obra.statusDaObra": { $ne: "OBRA CANCELADA" },
          },
        },
        {
          $group: {
            _id: {
              ano: {
                $year: {
                  $dateFromString: {
                    dateString: "$compra.dataPedido",
                  },
                },
              },
              mes: {
                $month: {
                  $dateFromString: {
                    dateString: "$compra.dataPedido",
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
            nps: { $gte: 9 },
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
            nps: { $lte: 6 },
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
            $and: [{ nps: { $gte: 0 } }, { nps: { $lte: 10 } }],
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
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    var queryKey;
    var queryValue;
    if (req.body.filtrarPor == "REGIONAL") {
      queryKey = "regional";
      queryValue = req.body.parametro;
    } else if (req.body.filtrarPor == "VENDEDOR") {
      queryKey = "vendedor.nome";
      queryValue = req.body.parametro;
    } else if (req.body.filtrarPor == "INSIDE") {
      queryKey = "insider";
      queryValue = req.body.parametro;
    }
    console.log(queryKey);
    console.log(queryValue);
    let installedInfo = await collection
      .aggregate([
        {
          $match: {
            [`${queryKey}`]: queryValue,
            "contrato.status": "ASSINADO",
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
            [`${queryKey}`]: queryValue,
            "contrato.status": { $ne: "RECISÃO DE CONTRATO" },
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
            [`${queryKey}`]: queryValue,
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
                    dateString: "$compra.dataPedido",
                  },
                },
              },
              mes: {
                $month: {
                  $dateFromString: {
                    dateString: "$compra.dataPedido",
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
            [`${queryKey}`]: queryValue,
            nps: { $gte: 9 },
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
            [`${queryKey}`]: queryValue,
            nps: { $lte: 6 },
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
            [`${queryKey}`]: queryValue,
            $and: [{ nps: { $gte: 0 } }, { nps: { $lte: 10 } }],
          },
        },
        {
          $count: "nps",
        },
      ])
      .toArray();
    promotores = promotores.length > 0 ? promotores : [{ nps: 0 }];
    detratores = detratores.length > 0 ? detratores : [{ nps: 0 }];
    consultasTotais =
      consultasTotais.length > 0 ? consultasTotais : [{ nps: 0 }];
    let nps = (
      ((promotores[0].nps - detratores[0].nps) * 100) /
      consultasTotais[0].nps
    ).toFixed(2);
    console.log(nps);
    return res.status(201).json({
      installedInfo,
      averageHomoData,
      suprimentosData,
      nps: isNaN(nps) ? 0 : nps,
    });
  }
}
