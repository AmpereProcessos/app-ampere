import connectToDatabase from "../../utils/projectsDb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("dados");
    let arr = await collection.find({}).toArray();
    res.json(arr);
  }
}
export const config = {
  api: {
    responseLimit: "12mb",
    maxDuration: "60s",
  },
};
// Case #00106481 na vercel
