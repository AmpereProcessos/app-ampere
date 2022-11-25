import connectToDatabase from "../../../../utils/callsDb";
export default async function handler(req, res) {
  if (req.method == "POST") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("adm");
    let arr = await collection.insertOne({
      ...req.body,
      status: "ABERTO",
      dataAbertura: new Date(),
    });
    console.log(req.body);
    res.json("Chamado aberto!");
  } else if (req.method == "GET") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("adm");
    let openCalls = await collection.find({
      status: "ABERTO",
    });
    res.json(openCalls);
  }
}
