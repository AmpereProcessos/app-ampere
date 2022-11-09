import connectToDatabase from "../../../utils/connectDb";
import { ObjectId } from "mongodb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    let arr = await collection
      .aggregate([
        {
          $match: {
            "ordensDeServico.realizarCobranca": true,
          },
        },
        {
          $project: {
            qtde: 1,
            nomeDoContrato: 1,
            telefone: 1,
            "pagamento.contatoPagador": 1,
            ordensDeServico: 1,
          },
        },
      ])
      .toArray();
    arr = arr.filter((obj) =>
      obj.ordensDeServico.some((elem) => elem.dataDeFechamento != undefined)
    );
    res.json(arr);
  } else if (req.method === "POST") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    console.log(req.body);
    var newObj = await collection.findOneAndUpdate(
      {
        _id: ObjectId(req.body.id),
        "ordensDeServico.index": req.body.index,
      },
      {
        $set: {
          "ordensDeServico.$.cobrancaRealizada": req.body.status,
          "ordensDeServico.$.dataDeCobranca": req.body.date,
        },
      },
      {
        returnDocument: "after",
      }
    );
    res.json(newObj);
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
          "ordensDeServico.$.dataDeFechamento": req.body.date,
        },
      },
      {
        returnDocument: "after",
      }
    );
    res.json(newObj);
  }
}
