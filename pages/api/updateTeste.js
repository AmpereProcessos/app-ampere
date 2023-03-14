import dayjs from "dayjs";
import connectToDatabase from "../../utils/connectDb";
export default async function handler(req, res) {
  // const db = await connectToDatabase(process.env.DB_KEY, "projetos");
  // const collection = db.collection("dados");
  // let arr = await collection
  //   .aggregate([
  //     {
  //       $match: {
  //         nps: { $gte: 8 },
  //       },
  //     },
  //     {
  //       $project: {
  //         nomeDoContrato: 1,
  //         cidade: 1,
  //         vendedor: 1,
  //         nps: 1,
  //         "contrato.dataAssinatura": 1,
  //       },
  //     },
  //   ])
  //   .toArray();
  // arr = arr.map((item) => {
  //   return {
  //     nome: item.nomeDoContrato,
  //     nps: item.nps,
  //     cidade: item.cidade,
  //     vendedor: item.vendedor?.nome,
  //     assinaturaDoContrato: item.contrato?.dataAssinatura
  //       ? dayjs(item.contrato.dataAssinatura)
  //           .add(4, "hours")
  //           .format("DD/MM/YYYY")
  //       : "-",
  //   };
  // });
  res.json("DESATIVADA");
}

// Update Many example:
// let arr = await collection.updateMany(
//   {
//     "pagamento.forma": "CAPITAL PROPRIO",
//   },
//   {
//     $set: {
//       "pagamento.forma": "CAPITAL PRÓPRIO",
//     },
//   }
// );
