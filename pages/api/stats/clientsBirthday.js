import connectToDatabase from "../../../utils/projectsDb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("dados");
    let arr = await collection
      .aggregate([
        {
          $match: {
            dataNascimento: { $ne: "-" },
          },
        },
        {
          $project: {
            nomeDoContrato: 1,
            dataNascimento: 1,
            data: {
              ano: {
                $year: { $dateFromString: { dateString: "$dataNascimento" } },
              },
              mes: {
                $month: { $dateFromString: { dateString: "$dataNascimento" } },
              },
            },
          },
        },
        {
          $match: {
            "data.mes": 11,
          },
        },
      ])
      .toArray();
    res.json(arr);
  }
}
