import connectToDatabase from "../../../utils/projectsDb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("dados");
    let projetos = await collection
      .aggregate([
        {
          $match: {
            "projeto.projetoConcluido": { $ne: "SIM" },
            "projeto.iniciar": "SIM",
          },
        },
      ])
      .toArray();
    res.json(projetos);
  }
}
