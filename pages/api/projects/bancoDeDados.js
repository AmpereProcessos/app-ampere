import connectToDatabase from "../../../utils/services/mongodb/projects";
import { NextResponse } from "next/server";
export default async function handler(req, res) {
	if (req.method === "GET") {
		const db = await connectToDatabase(process.env.DB_KEY, "projetos");
		const collection = db.collection("dados");
		var page = req.query.page;
		let matchFrom = 500 * (page - 1);
		// let arr = await collection
		//   .find(
		//     {
		//       "contrato.status": { $ne: "RESCISÃO DE CONTRATO" },
		//     },
		//     {
		//       _id: 1,
		//       qtde: 1,
		//       nomeDoContrato: 1,
		//       cidade: 1,
		//       "vendedor.nome": 1,
		//       "jornada.dataNps": 1,
		//       "obra.saida": 1,
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
					$match: { qtde: { $gte: matchFrom } },
				},
				{
					$project: {
						_id: 1,
						qtde: 1,
						nomeDoContrato: 1,
						cidade: 1,
						"vendedor.nome": 1,
						tipoDeServico: 1,
						// "jornada.dataNps": 1,
						// "obra.saida": 1,
						// "obra.equipeResp": 1,
						// "contrato.dataAssinatura": 1,
						// "compra.dataPagamento": 1,
						// "medidor.data": 1,
						// "compra.dataPedido": 1,
						// "sistema.qtdeModulos": 1,
						// "jornada.entregaTecnica": 1,
					},
				},
				{
					$match: {
						"contrato.status": { $ne: "RESCISÃO DE CONTRATO" },
					},
				},
				{
					$sort: {
						qtde: 1,
					},
				},
				{
					$limit: 500,
				},
			])
			.toArray();
		res.json(arr);
	} else if (req.method === "POST") {
		const db = await connectToDatabase(process.env.DB_KEY, "projetos");
		const collection = db.collection("dados");
		let matchObj = req.body;
		console.log(matchObj);
		let arr = await collection
			.aggregate([
				{
					$match: matchObj,
				},
				{
					$project: {
						_id: 1,
						qtde: 1,
						nomeDoContrato: 1,
						cidade: 1,
						"vendedor.nome": 1,
						tipoDeServico: 1,
						// "jornada.dataNps": 1,
						// "obra.saida": 1,
						// "obra.equipeResp": 1,
						// "contrato.dataAssinatura": 1,
						// "compra.dataPagamento": 1,
						// "medidor.data": 1,
						// "compra.dataPedido": 1,
						// "sistema.qtdeModulos": 1,
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
		return res.json(arr);
	}
}
export const config = {
	api: {
		responseLimit: "8mb",
	},
};
