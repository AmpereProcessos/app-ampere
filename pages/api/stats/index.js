import connectToDatabase from "../../../utils/projectsDb";

export default async function handler(req, res) {
  if (req.method === "GET") {
    var date = new Date();
    var currentMonth = date.getMonth() + 1;
    var currentYear = date.getFullYear();
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("data");
    let installedInfo = await collection
      .aggregate([
        {
          $match: { saidadeobra: { $ne: "-" } },
        },
        {
          $group: {
            _id: {
              ano: {
                $year: { $dateFromString: { dateString: "$saidadeobra" } },
              },
              mes: {
                $month: { $dateFromString: { dateString: "$saidadeobra" } },
              },
            },
            total: {
              $sum: "$potpico",
            },
            count: { $count: {} },
          },
        },
        {
          $sort: {
            "_id.ano": 1,
            "_id.mes": 1,
          },
        },
        {
          $match: {
            "_id.ano": { $gte: currentYear },
            "_id.mes": { $gte: currentMonth - 3 },
          },
        },
      ])
      .toArray();
    let averageHomoData = await collection
      .aggregate([
        {
          $match: {
            statusparecerdeacesso: { $ne: "CANCELADO" },
            saidadeobra: { $ne: "-" },
            statusdaobra: { $ne: "OBRA CANCELADA" },
          },
        },
        {
          $group: {
            _id: {
              ano: {
                $year: { $dateFromString: { dateString: "$pareceracesso" } },
              },
              mes: {
                $month: { $dateFromString: { dateString: "$pareceracesso" } },
              },
            },
            averageTime: {
              $avg: {
                $dateDiff: {
                  startDate: {
                    $dateFromString: { dateString: "$documentacaoassinada" },
                  },
                  endDate: {
                    $dateFromString: { dateString: "$pareceracesso" },
                  },
                  unit: "day",
                },
              },
            },
            homoPeakPot: { $sum: "$potpico" },
          },
        },
        {
          $sort: {
            "_id.ano": 1,
            "_id.mes": 1,
          },
        },
        {
          $match: {
            "_id.ano": { $gte: currentYear },
            "_id.mes": { $gte: currentMonth - 1 },
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
      nps,
    });
  }
  if (req.method === "POST") {
    var date = new Date();
    var currentMonth = date.getMonth() + 1;
    var currentYear = date.getFullYear();
    var regional = req.body.regional;
    console.log(regional);
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("data");
    let installedInfo = await collection
      .aggregate([
        {
          $match: {
            regional: regional,
            saidadeobra: { $ne: "-" },
          },
        },
        {
          $group: {
            _id: {
              ano: {
                $year: { $dateFromString: { dateString: "$saidadeobra" } },
              },
              mes: {
                $month: { $dateFromString: { dateString: "$saidadeobra" } },
              },
            },
            total: {
              $sum: "$potpico",
            },
            count: { $count: {} },
          },
        },
        {
          $sort: {
            "_id.ano": 1,
            "_id.mes": 1,
          },
        },
        {
          $match: {
            "_id.ano": { $gte: currentYear },
            "_id.mes": { $gte: currentMonth - 3 },
          },
        },
      ])
      .toArray();
    let averageHomoData = await collection
      .aggregate([
        {
          $match: {
            statusparecerdeacesso: { $ne: "CANCELADO" },
            saidadeobra: { $ne: "-" },
            statusdaobra: { $ne: "OBRA CANCELADA" },
            regional: regional,
          },
        },
        {
          $group: {
            _id: {
              ano: {
                $year: { $dateFromString: { dateString: "$pareceracesso" } },
              },
              mes: {
                $month: { $dateFromString: { dateString: "$pareceracesso" } },
              },
            },
            averageTime: {
              $avg: {
                $dateDiff: {
                  startDate: {
                    $dateFromString: { dateString: "$documentacaoassinada" },
                  },
                  endDate: {
                    $dateFromString: { dateString: "$pareceracesso" },
                  },
                  unit: "day",
                },
              },
            },
            homoPeakPot: { $sum: "$potpico" },
          },
        },
        {
          $sort: {
            "_id.ano": 1,
            "_id.mes": 1,
          },
        },
        {
          $match: {
            "_id.ano": { $gte: currentYear },
            "_id.mes": { $gte: currentMonth - 2 },
          },
        },
      ])
      .toArray();
    let graphData = await collection
      .aggregate([
        {
          $match: {
            regional: regional,
            saidadeobra: { $ne: "-" },
          },
        },
        {
          $group: {
            _id: {
              ano: {
                $year: { $dateFromString: { dateString: "$saidadeobra" } },
              },
              mes: {
                $month: { $dateFromString: { dateString: "$saidadeobra" } },
              },
            },
            total: {
              $sum: "$potpico",
            },
            count: { $count: {} },
          },
        },
        {
          $sort: {
            "_id.ano": 1,
            "_id.mes": 1,
          },
        },
        {
          $match: {
            "_id.ano": req.data.year ? req.data.year : 2022,
          },
        },
      ])
      .toArray();
    var graph = graphData.map((info) => {
      return { name: `${info._id.mes}/${info._id.ano}`, Total: info._id.total };
    });
    console.log(graph);
    return res.status(201).json({
      installedInfo,
      averageHomoData,
    });
  }
}
