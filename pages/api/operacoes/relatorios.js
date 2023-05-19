import connectToDatabase from "../../../utils/operacoesDb";
export default async function handler(req, res) {
  if (req.method == "POST") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("relatorios");
    const info = req.body;
    try {
      await collection.insertOne(info);
      res.status(200).json("Relatório criado com sucesso.");
    } catch (error) {
      res.status(500).json("Erro na criação do relatório.");
    }
  } else if (req.method == "GET") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("relatorios");
    const { id } = req.query;
    if (!id || typeof id != "string") {
      res.status(400).json("ID inválido.");
    }
    try {
      const reports = await collection.find({ idPai: id }).toArray();
      res.status(200).json(reports);
    } catch (error) {
      res.status(500).json("Houve um erro ao buscar relatórios.");
    }
  }
}
