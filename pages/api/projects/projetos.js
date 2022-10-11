import connectToDatabase from "../../../utils/projectsDb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("data");
    let projetos = await collection
      .aggregate([
        {
          $match: {
            projetoconcluido: { $ne: "SIM" },
            iniciarprojeto: "SIM",
          },
        },
      ])
      .toArray();
    res.json(projetos);
  }
}
