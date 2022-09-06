import connectToDatabase2 from "../../../utils/ossDb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    /*const {
    clientName,
    city,
    attendant,
    modulesQty,
    modulesPot,
    currentEfficience,
    distance,
    price,
  } = req.body;*/
    const { generalInfos, osInfos } = req.body;
    const db = await connectToDatabase2(process.env.DB_KEY);
    const collection = db.collection("data");
    await collection.insertOne({
      generalInfos: { ...generalInfos, date: new Date(generalInfos.date) },
      osInfos: { ...osInfos },
    });
    console.log("UEPA");
    return res.status(201).json("Dados salvos");
  } else if (req.method === "GET") {
    const db = await connectToDatabase2(process.env.DB_KEY);
    const collection = db.collection("data");
    var dateFilterParam = new Date();
    dateFilterParam.setDate(dateFilterParam.getDate() - 2);
    let OSs = await collection.find({}).toArray();
    //         "generalInfos.date": { $gt: dateFilterParam },
    return res.status(201).json(OSs);
  }
}
