import connectToDatabase from "../../../utils/connectDb";
import { NextResponse } from "next/server";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    // let arr = await collection
    //   .find(
    //     {
    //       "contrato.status": { $ne: "RECISÃO DE CONTRATO" },
    //     },
    //     {
    //       _id: 1,
    //       qtde: 1,
    //       nomeDoContrato: 1,
    //       cidade: 1,
    //       "vendedor.nome": 1,
    //       "jornada.dataNps": 1,
    //       "obra.saida": 1,
    //       "parecer.dataParecerDeAcesso": 1,
    //       "contrato.dataAssinatura": 1,
    //       "compra.dataPagamento": 1,
    //       "medidor.data": 1,
    //       "compra.dataPedido": 1,
    //       "sistema.qtdeModulos": 1,
    //     }
    //   )
    //   .sort({ qtde: 1 })
    //   .toArray();
    let arr = await collection
      .aggregate([
        {
          $project: {
            _id: 1,
            qtde: 1,
            nomeDoContrato: 1,
            cidade: 1,
            "vendedor.nome": 1,
            "jornada.dataNps": 1,
            "obra.saida": 1,
            "parecer.dataParecerDeAcesso": 1,
            "contrato.dataAssinatura": 1,
            "compra.dataPagamento": 1,
            "medidor.data": 1,
            "compra.dataPedido": 1,
            "sistema.qtdeModulos": 1,
          },
        },
        {
          $match: {
            "contrato.status": { $ne: "RECISÃO DE CONTRATO" },
          },
        },
      ])
      .toArray();
    res.json(arr);
  } else if (req.method === "POST") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    let arr = await collection
      .aggregate([
        {
          $match: {
            "contrato.status": { $ne: "RECISÃO DE CONTRATO" },
          },
        },
        {
          $project: {
            _id: 1,
            qtde: 1,
            nomeDoContrato: 1,
            cidade: 1,
            nps: 1,
            "vendedor.nome": 1,
            "jornada.dataNps": 1,
            "obra.saida": 1,
            "parecer.dataParecerDeAcesso": 1,
            "contrato.dataAssinatura": 1,
            "compra.dataPagamento": 1,
            "medidor.data": 1,
            "compra.dataPedido": 1,
            "sistema.qtdeModulos": 1,
          },
        },
        {
          $sort: {
            qtde: 1,
          },
        },
      ])
      .toArray();
    // res.json(arr);
    return NextResponse.json(arr);
  }
}
export const config = {
  api: {
    responseLimit: "8mb",
  },
};
