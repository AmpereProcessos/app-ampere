import connectToDatabase from "../../../utils/materialDb";
import { ObjectId } from "mongodb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("material");
    let materiais = await collection.find({}).toArray();
    res.json(materiais);
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
    try {
      await collection.updateOne(
        {
          _id: ObjectId(req.body.id),
        },
        {
          $set: {
            qtde: req.body.novaQtde,
            preco: req.body.novoPreco,
            infoAlteracoes: { ...req.body.infoAlt, dataAlt: new Date() },
          },
        }
      );
      console.log(req.body);
      res.json("Alterações feitas");
    } catch (error) {
      res.json("Um erro ocorreu, tente novamente.");
    }
  }
}
