import { getSession } from "next-auth/react";
import connectToDatabase from "../../../utils/materialDb";
import { ObjectId } from "mongodb";
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

    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("material");

    const currentStateMaterials = await collection
      .aggregate([
        {
          $project: {
            nome: 1,
            qtde: 1,
          },
        },
      ])
      .toArray();

    let { changes, idFormulario, identificador, tag } = req.body;
    // console.log(req.body);
    console.log("CHANGES", changes);
    changes = changes.map((mat) => {
      const materialId = mat.id;
      const diff = Number(mat.diff);
      const correspondentMaterial = currentStateMaterials?.find(
        (currentMaterial) => currentMaterial._id == materialId
      );
      console.log("MATERIAL CORRESPONDENTE", correspondentMaterial);
      const previousQty = correspondentMaterial
        ? correspondentMaterial.qtde
        : null;
      const newQty = correspondentMaterial
        ? correspondentMaterial.qtde + diff
        : null;
      console.log(
        "SOMA",
        correspondentMaterial.qtde,
        diff,
        correspondentMaterial.qtde + diff
      );
      // const saida = mat.qtdeSaida ? mat.qtdeSaida : 0;
      // const devolucao = mat.qtdeDevolucao ? mat.qtdeDevolucao : 0;
      // const diff = saida - devolucao;
      // const anterior = mat.qtdePreBaixa ? mat.qtdePreBaixa : 0;
      // const novo = anterior - diff;
      return {
        updateOne: {
          filter: { _id: new ObjectId(materialId) },
          update: {
            $push: {
              qtdeAlteracoes: {
                $each: [
                  {
                    idFormulario: idFormulario,
                    identificador: identificador,
                    dataAlteracao: new Date().toISOString(), // current date
                    responsavel: user.name, // name of responsible person
                    movimentacao: diff,
                    anterior: previousQty,
                    novo: newQty,
                    tag: tag,
                  },
                ],
                $slice: -10, // limit the array size to 10 items
              },
            },
            $inc: { qtde: diff },
          },
        },
      };
    });

    const filteredChanges = changes.filter((change) => !!change);

    await collection.bulkWrite(filteredChanges);
    res.status(200).json(filteredChanges);

    // res.json("UEPA");
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
  } else if (req.method === "PATCH") {
  }
}
