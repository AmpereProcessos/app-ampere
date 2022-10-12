import connectToDatabase from "../../../utils/projectsDb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("data");
    let posvenda = await collection
      .aggregate([
        {
          $match: {
            statuscontrato: "ASSINADO",
            statustrocamedidor: { $ne: "REALIZADA" },
          },
        },
      ])
      .toArray();
    res.json(posvenda);
  }
}
