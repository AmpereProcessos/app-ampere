import { ObjectId } from "mongodb";
import connectToDatabase from "../../../utils/auxiliaresDb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("cotacoes");
    let arr = await collection.find({}).toArray();
    res.json(arr);
  } else if (req.method == "POST") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("cotacoes");
    let insertObj = req.body;
    console.log(insertObj);
    let insert = await collection.insertOne(insertObj);
    res.json(insert);
  } else if (req.method == "PUT") {
    var id = req.body.id;
    var changes = req.body.changes;
    try {
      const db = await connectToDatabase(process.env.DB_KEY);
      const collection = db.collection("cotacoes");
      var resMongo = await collection.updateOne(
        {
          _id: ObjectId(id),
        },
        { $set: { ...changes } }
      );
      res.json({
        msg: "Informações da cotação alteradas com sucesso.",
        statusCode: 200,
      });
    } catch (error) {
      res
        .status(500)
        .json({ msg: "Erro na alteração das informações", statusCode: 500 });
    }
  }
}
