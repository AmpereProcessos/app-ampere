import connectToDatabase from "../../../utils/connectDb";
import { ObjectId } from "mongodb";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    var newObj = await collection.updateOne(
      { _id: ObjectId(req.body.id) },
      { $set: { ordensDeServico: req.body.arr } }
    );
    return res.json("OK");
  } else if (req.method === "GET") {
    try {
      const db = await connectToDatabase(process.env.DB_KEY, "projetos").catch(
        (err) => {
          throw "Erro ao conectar com o servidor.";
        }
      );
      const after = req.query.after;
      const before = req.query.before;
      const collection = db.collection("dados");
      let arr = await collection
        .aggregate([
          {
            $match: {
              ordensDeServico: { $ne: null },
              $and: [
                {
                  "ordensDeServico.dataDeAbertura": {
                    $gte: after,
                  },
                },
                {
                  "ordensDeServico.dataDeAbertura": {
                    $lte: before,
                  },
                },
              ],
            },
          },
          {
            $project: {
              _id: 1,
              qtde: 1,
              nomeDoContrato: 1,
              cidade: 1,
              logradouro: 1,
              bairro: 1,
              numeroResidencia: 1,
              ordensDeServico: 1,
            },
          },
        ])
        .toArray();
      return res.json(arr);
    } catch (error) {
      res.status(500).send(error);
    }
  } else if (req.method === "PUT") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    var newObj = await collection.findOneAndUpdate(
      {
        _id: ObjectId(req.body.id),
        "ordensDeServico.index": req.body.index,
      },
      {
        $set: {
          "ordensDeServico.$.dataDeFechamento": req.body.fechamento,
        },
      },
      {
        returnDocument: "after",
      }
    );
    res.json(newObj);
  }
}
