export const config = {
  api: {
    responseLimit: false,
  },
};
import connectToDatabase from "../../../utils/projectsDb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("dados");
    let arr = await collection.find({}).toArray();
    return res.json(arr);
  }
}
