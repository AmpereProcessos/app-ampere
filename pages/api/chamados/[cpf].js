import connectToDatabase from "../../../utils/projectsDb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const filter = Number(req.query.cpf);
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = await db.collection("data");
    let project = collection
      .find({
        cpfcnpj: filter,
      })
      .toArray();
    return res.json(filter);
  }
}
