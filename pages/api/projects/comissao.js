import connectToDatabase from "../../../utils/connectDb";
export default async function handler(req, res) {
  if (req.method == "GET") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    try {
      var arr = await collection
        .aggregate([
          {
            $match: {
              "contrato.status": 1,
            },
          },
          {
            $project: {
              qtde: 1,
              codigoSVB: 1,
              nomeDoContrato: 1,
              cidade: 1,
              vendedor: 1,
              "sistema.valorProjeto": 1,
              insider: 1,
            },
          },
        ])
        .toArray();
      res.json(arr);
    } catch (error) {
      res.status(500).send("Erro na comunicação com o servidor.");
    }
  }
}
