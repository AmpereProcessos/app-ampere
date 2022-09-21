import connectToDatabase from "../../../../utils/projectsDb";
export default async function handler(req, res) {
  const { year } = req.query;
  console.log(year);
  const db = await connectToDatabase(process.env.DB_KEY);
  const collection = db.collection("data");
  let graphData = await collection
    .aggregate([
      {
        $match: {
          saidadeobra: { $ne: "-" },
        },
      },
      {
        $group: {
          _id: {
            ano: {
              $year: {
                $dateFromString: { dateString: "$saidadeobra" },
              },
            },
            mes: {
              $month: {
                $dateFromString: { dateString: "$saidadeobra" },
              },
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
          "_id.ano": Number(year),
        },
      },
    ])
    .toArray();
  var graph = graphData.map((info) => {
    return {
      name: `${info._id.mes}/${info._id.ano}`,
      Total: info.total.toFixed(2),
    };
  });
  console.log(graph);
  return res.json(graph);
}
