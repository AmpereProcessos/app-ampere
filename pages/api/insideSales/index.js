import connectToDatabase from "../../../utils/insideSalesDb";
export default async function handler(req, res) {
  if (req.method == "POST") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("leads");
    console.log(req.body);
    var arr = await collection
      .find({ responsavel: req.body.responsavel })
      .toArray();
    res.json(arr);
  }
}
