import connectToDatabase from "../../../utils/projectsDb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("data");
    let obras = await collection
      .aggregate([
        {
          $match: {
            statusobra: {
              $in: ["AGENDADA", "AGUARDANDO AGENDAMENTO", "EM ANDAMENTO"],
            },
            statuscontrato: "ASSINADO",
          },
        },
      ])
      .toArray();
    res.json(obras);
  }
}
