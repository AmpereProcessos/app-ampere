import connectToDatabase from "../../../utils/proposesDb";
import { ObjectId } from "mongodb";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { user, password } = req.body;
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("users");
    let credential = await collection.findOne({ user: user });
    try {
      if (!credential) {
        throw "Usuário inexistente";
      } else if (credential.password == password) {
        res.status(201).json({ credentials: credential });
      } else {
        throw "Senha inválida";
      }
    } catch (err) {
      res.json({ error: err });
    }
    // await collection.insertOne({ user, password, admin });
  }
}
