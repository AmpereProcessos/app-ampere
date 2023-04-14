import connectToDatabase from "../../../utils/materialDb";
import { ObjectId } from "mongodb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("material");
    try {
      const { id } = req.query;
      if (id) {
        let material = await collection.findOne({ _id: ObjectId(id) });
        res.status(200).json(material);
      } else {
        let materials = await collection.find({}).toArray();
        res.json(materials);
      }
    } catch (error) {
      res.status(500).json("Erro ao comunicar com o servidor.");
    }
  } else if (req.method === "POST") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("material");
    let changes = req.body.map((mat) => {
      return {
        updateOne: {
          filter: { nome: mat.nome },
          update: { $inc: { qtde: -mat.diff } },
        },
      };
    });
    await collection.bulkWrite(changes);
    res.json("UEPA");
  } else if (req.method === "PUT") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("material");

    const { id, changes } = req.body;
    delete changes._id;
    try {
      await collection.updateOne(
        {
          _id: ObjectId(id),
        },
        {
          $set: { ...changes },
        }
      );

      res.status(201).json("Alterações feitas !");
    } catch (error) {
      res.json("Um erro ocorreu, tente novamente.");
    }
  }
}
