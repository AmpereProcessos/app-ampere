import connectToDatabase from "../../../../utils/projectsDb";
export default async function handler(req, res) {
  const { year } = req.query;
  const db = await connectToDatabase(process.env.DB_KEY);
  const collection = db.collection("dados");
  let graphData = await collection
    .aggregate([
      {
        $match: {
          "contrato.dataAssinatura": { $ne: "-" },
        },
      },
      {
        $group: {
          _id: {
            ano: {
              $year: {
                $dateFromString: { dateString: "$contrato.dataAssinatura" },
              },
            },
            mes: {
              $month: {
                $dateFromString: { dateString: "$contrato.dataAssinatura" },
              },
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
  return res.json(graph);
}
