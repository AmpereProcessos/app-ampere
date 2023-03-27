import dayjs from "dayjs";
import connectToDatabase from "../../utils/connectDb";
export default async function handler(req, res) {
  // const db = await connectToDatabase(process.env.DB_KEY, "projetos");
  // const collection = db.collection("dados");
  // let arr = await collection
  //   .aggregate([
  //     {
  //       $match: {
  //         "contrato.status": "ASSINADO",
  //       },
  //     },
  //     {
  //       $project: {
  //         qtde: 1,
  //         "sistema.potPico": 1,
  //         "contrato.dataAssinatura": 1,
  //         "contrato.formaAssinatura": 1,
  //         "vendedor.nome": 1,
  //         cidade: 1,
  //         regional: 1,
  //         tipoDeServico: 1,
  //       },
  //     },
  //   ])
  //   .toArray();
  // let newArr = arr.map((item) => {
  //   return {
  //     QTDE: item.qtde,
  //     "POTÊNCIA PICO": item.sistema.potPico ? item.sistema.potPico : "-",
  //     "DATA ASSINATURA": item.contrato?.dataAssinatura
  //       ? dayjs(item.contrato?.dataAssinatura)
  //           .add(4, "hours")
  //           .format("DD/MM/YYYY")
  //       : "-",
  //     "FORMA ASSINATURA": item.contrato?.formaAssinatura
  //       ? item.contrato?.formaAssinatura
  //       : "-",
  //     CIDADE: item.cidade ? item.cidade : "-",
  //     REGIONAL: item.regional ? item.regional : "-",
  //     "TIPO DE SERVIÇO": item.tipoDeServico ? item.tipoDeServico : "-",
  //   };
  // });
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
  //         telefone: 1,
  //         "contrato.dataAssinatura": 1,
  //       },
  //     },
  //   ])
  //   .toArray();
  // arr = arr.map((item) => {
  //   return {
  //     nome: item.nomeDoContrato,
  //     nps: item.nps,
  //     telefone: item.telefone ? item.telefone : "-",
  //     cidade: item.cidade,
  //     vendedor: item.vendedor?.nome,
  //     assinaturaDoContrato: item.contrato?.dataAssinatura
  //       ? dayjs(item.contrato.dataAssinatura)
  //           .add(4, "hours")
  //           .format("DD/MM/YYYY")
  //       : "-",
  //   };
  // });
  // res.json(arr);
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
