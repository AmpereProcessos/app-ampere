import connectToSolicitacoesDatabase from "../../../../utils/solicitacoesDb";
import { ObjectId } from "mongodb";
export default async function handler(req, res) {
  if (req.method == "GET") {
    try {
      let id = req.query.id;
      const db = await connectToSolicitacoesDatabase(process.env.DB_KEY);
      const collection = db.collection("visitaTecnica");
      var arr = await collection.find({ _id: ObjectId(id) }).toArray();
      res.json(arr[0]);
    } catch (error) {
      res.status(500).send({ success: false, msg: error });
    }
  } else if (req.method == "POST") {
    let id = req.query.id;
    let toProject = req.body;
    const db = await connectToSolicitacoesDatabase(process.env.DB_KEY);
    const collection = db.collection("visitaTecnica");
    var arr = await collection
      .aggregate([
        {
          $match: {
            _id: ObjectId(id),
          },
        },
        {
          $project: toProject,
        },
      ])
      .toArray();
    res.json(arr[0]);
  }
}
