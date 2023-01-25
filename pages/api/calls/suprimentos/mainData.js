import { ObjectId } from "mongodb";
import connectToDatabase from "../../../../utils/callsDb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const db = await connectToDatabase(process.env.DB_KEY).catch((err) => {
        throw "Erro na conexão com o servidor, verifique a sua internet.";
      });
      const collection = db.collection("suprimentos");
      let chamadosAbertos = await collection
        .aggregate([
          {
            $match: {
              status: { $ne: "FECHADO" },
            },
          },
        ])
        .toArray();
      let chamadosFechados = await collection
        .aggregate([
          {
            $match: {
              status: "FECHADO",
            },
          },
        ])
        .toArray();
      res.json({
        abertos: chamadosAbertos,
        fechados: chamadosFechados,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  } else if (req.method === "POST") {
    try {
      const db = await connectToDatabase(process.env.DB_KEY).catch((err) => {
        throw "Houve um erro na conexão com o banco de dados.";
      });
      const collection = db.collection("suprimentos");
      var obj = req.body;
      let insertObj = await collection.insertOne({ ...obj }).catch((err) => {
        throw "Houve um erro na inserção do chamado. Por favor, tente novamente.";
      });
      res.json("Chamado criado!");
    } catch (error) {
      res.status(500).send(error);
    }
  } else if (req.method === "PUT") {
    try {
      const db = await connectToDatabase(process.env.DB_KEY).catch((err) => {
        throw "Houve um erro na conexão com o banco de dados.";
      });
      const collection = db.collection("suprimentos");
      var id = req.body.id;
      var mudancas = req.body.mudancas;
      let insertObj = await collection
        .updateOne({ _id: ObjectId(id) }, { $set: { ...mudancas } })
        .catch((err) => {
          throw "Houve um erro na inserção do chamado. Por favor, tente novamente.";
        });
      console.log(id, mudancas);
      res.json("Chamado criado!");
    } catch (error) {
      res.status(500).send(error);
    }
  }
}
