import connectToDatabase from "../../../utils/connectDb";

export default async function handler(req, res) {
  if (req.method == "GET") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("receitas");
    const { projectId } = req.query;
    try {
      if (projectId && typeof projectId == "string") {
        // Project related revenues
        const revenues = await collection
          .aggregate([
            {
              $match: {
                "projeto.id": projectId,
              },
            },
          ])
          .toArray();
        res.status(200).json(revenues);
      } else {
        // All revenues
        const revenues = await collection
          .aggregate([{ $sort: { dataInsercao: -1 } }])
          .toArray();
        res.status(200).json(revenues);
      }
    } catch (error) {
      errorHandler(error, res);
    }
  }
}
