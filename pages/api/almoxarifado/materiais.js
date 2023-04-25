import { getSession } from "next-auth/react";
import connectToDatabase from "../../../utils/materialDb";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("material");
    try {
      const { id } = req.query;
      if (id) {
        let material = await collection.findOne({ _id: ObjectId(id) });
        res.status(200).json(material);
      } else {
        let materials = await collection.find({}).sort({ nome: 1 }).toArray();
        res.json(materials);
      }
    } catch (error) {
      res.status(500).json("Erro ao comunicar com o servidor.");
    }
  } else if (req.method === "POST") {
    const { user } = await getSession({ req: req });
    console.log(user);
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("material");
    let { changes, idFormulario, nomeDoContrato } = req.body;
    changes = changes.map((mat) => {
      const saida = mat.qtdeSaida ? mat.qtdeSaida : 0;
      const devolucao = mat.qtdeDevolucao ? mat.qtdeDevolucao : 0;
      const diff = saida - devolucao;
      return {
        updateOne: {
          filter: { nome: mat.nome },
          update: {
            $push: {
              qtdeAlteracoes: {
                $each: [
                  {
                    idFormulario: idFormulario,
                    nomeDoContrato: nomeDoContrato,
                    dataAlteracao: new Date().toISOString(), // current date
                    responsavel: user.name, // name of responsible person
                    movimentacao: -diff,
                  },
                ],
                $slice: -10, // limit the array size to 10 items
              },
            },
            $inc: { qtde: -diff },
          },
        },
      };
    });
    await collection.bulkWrite(changes);
    res.json("UEPA");
  } else if (req.method === "PUT") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("material");

    const { id, changes } = req.body;
    delete changes._id;
    try {
      await collection.updateOne(
        {
          _id: ObjectId(id),
        },
        {
          $set: { ...changes },
        }
      );

      res.status(201).json("Alterações feitas !");
    } catch (error) {
      res.json("Um erro ocorreu, tente novamente.");
    }
  }
}
