import connectToDatabase from "../../../utils/services/mongodb/projects";
export default async function handler(req, res) {
	if (req.method === "GET") {
		try {
			const db = await connectToDatabase(process.env.DB_KEY, "projetos").catch((err) => {
				throw "Erro ao comunicar com o servidor.";
			});
			const collection = db.collection("dados");
			var vendedorMatch = req.query.vendedor ? req.query.vendedor : { $ne: null };

			var arr = await collection
				.aggregate([
					{
						$match: {
							"vendedor.nome": vendedorMatch,
							"jornada.entregaTecnica": { $ne: null },
							"jornada.entregaTecnicaPresencial": { $ne: true },
							"medidor.data": { $gte: "2023-01-01T00:00:00.000Z" },
						},
					},
					{
						$project: {
							qtde: 1,
							nomeDoContrato: 1,
							"vendedor.nome": 1,
							"sistema.topologia": 1,
							cidade: 1,
							"medidor.data": 1,
							"jornada.dataEntregaTecnicaRemota": 1,
						},
					},
				])
				.toArray();
			res.json(arr);
		} catch (error) {
			res.status(500).send(error);
		}
	}
}
