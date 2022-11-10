import connectToDatabase from "../../../utils/usersDb";
import { ObjectId } from "mongodb";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const db = await connectToDatabase(process.env.DB_KEY, "authentication");
    const collection = db.collection("users");
    /*let credential = await collection.findOne({ user: user });
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
    }*/
    await collection.insertOne(req.body);
    return res.json("Usuário criado");
  }
}
