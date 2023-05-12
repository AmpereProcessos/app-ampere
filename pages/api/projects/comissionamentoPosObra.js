import connectToDatabase from "../../../utils/connectDb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    let arr = await collection
      .aggregate([
        {
          $match: {
            "contrato.status": "ASSINADO",

            "obra.statusDaObra": "CONCLUIDA",

            "jornada.entregaTecnica": { $ne: true },
          },
        },
        {
          $project: {
            nomeDoContrato: 1,
            qtde: 1,
            codigoSVB: 1,
            app: 1,
            conferencias: 1,
            cidade: 1,
            "medidor.data": 1,
            "obra.saida": 1,
            "obra.equipeResp": 1,
            "jornada.entregaTecnica": 1,
            "jornada.tipoEntregaTecnica": 1,
            "vendedor.nome": 1,
            "oem.diagnostico": 1,
            links: 1,
          },
        },
        {
          $sort: {
            "medidor.data": 1,
            "obra.saida": 1,
          },
        },
      ])
      .toArray();
    res.json(arr);
  }
}
