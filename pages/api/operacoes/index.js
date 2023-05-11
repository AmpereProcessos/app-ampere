import connectToDatabase from "../../../utils/auxiliaresDb";
export default async function handler(req, res) {
  if (req.method == "POST") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("operacoes");
    const info = req.body;
    try {
      await collection.insertOne(info);
      res.status(201).json("Operação criada com sucesso.");
    } catch (error) {
      res.status(500).json("Erro na criação da operação");
    }
  } else if (req.method == "GET") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("operacoes");
    const operations = await collection.find({}).toArray();
    console.log("OPERACOES", operations);
    res.json(operations);
  }
}
