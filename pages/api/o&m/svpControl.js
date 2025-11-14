import connectToDatabase from "../../../utils/services/mongodb/projects";
export default async function handler(req, res) {
	if (req.method === "GET") {
		const db = await connectToDatabase(process.env.DB_KEY, "projetos");
		const collection = db.collection("dados");
		let arr = await collection
			.aggregate([
				{
					$match: {
						"contrato.dataAssinatura": {
							$gt: "2021-09-01T08:00:00.000Z",
						},
					},
				},
				{
					$project: {
						qtde: 1,
						nomeDoContrato: 1,
						nomeDoProjeto: 1,
						email: 1,
						telefone: 1,
						oem: 1,
					},
				},
			])
			.toArray();
		res.json(arr);
	}
}
