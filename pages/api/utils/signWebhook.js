import connectToDatabase from "../../../utils/auxiliaresDb";

export default async function handler(req, res) {
  if (req.method == "POST") {
    try {
      const db = await connectToDatabase(process.env.DB_KEY);
      const collection = db.collection("webhook");
      console.log(req.body);
      await collection.insertOne(req.body);
      res.status(201).json({ message: "Documento inserido." });
    } catch (error) {
      res.status(501).json({ message: "Erro ao inserir documento." });
    }
  }
}
