import connectToDatabase from "../../utils/projectsDb";

export default async function handler(req, res) {
  if (req.method === "GET") {
    var date = new Date();
    var currentMonth = date.getMonth() + 1;
    var currentYear = date.getFullYear();
    console.log(date.getFullYear());
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("data");
    let dados = await collection
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
    return res.status(201).json(dados);
  }
}
