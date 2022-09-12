import connectToDatabase from "../../utils/projectsDb";

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
                $year: { $dateFromString: { dateString: "$parecerdeacesso" } },
              },
              mes: {
                $month: { $dateFromString: { dateString: "$parecerdeacesso" } },
              },
            },
            averageTime: {
              $avg: {
                $dateDiff: {
                  startDate: {
                    $dateFromString: { dateString: "$documentacaoassinada" },
                  },
                  endDate: {
                    $dateFromString: { dateString: "$parecerdeacesso" },
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
    return res.status(201).json({
      installedInfo,
      averageHomoData,
    });
  }
}
