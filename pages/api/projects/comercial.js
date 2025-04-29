import connectToDatabase from "../../../utils/services/mongodb/projects";
export default async function handler(req, res) {
	if (req.method === "GET") {
		const db = await connectToDatabase(process.env.DB_KEY, "projetos");
		const collection = db.collection("dados");
		let comercial = await collection
			.aggregate([
				{
					$match: {
						"contrato.status": { $ne: "RESCISÃO DE CONTRATO" },
						dataValidacaoComercial: null,
					},
				},
				{
					$project: {
						_id: 1,
						qtde: 1,
						nomeDoContrato: 1,
						codigoSVB: 1,
						contrato: 1,
						vendedor: 1,
						pagamento: 1,
						tipoDeServico: 1,
						"sistema.valorProjeto": 1,
						"padrao.valor": 1,
						"estruturaPersonalizada.valor": 1,
						"sistema.potPico": 1,
						"compra.liberacao": 1,
						"compra.dataLiberacao": 1,
						"compra.status": 1,
						"compra.dataPagamento": 1,
						"homologacao.status": 1,
						"homologacao.acesso.dataResposta": 1,
						idProjetoCRM: 1,
						idVisitaTecnica: 1,
						insider: 1,
					},
				},
				{
					$sort: { qtde: 1 },
				},
			])
			.toArray();
		res.json(comercial);
	} else if (req.method === "POST") {
		const db = await connectToDatabase(process.env.DB_KEY, "projetos");
		const collection = db.collection("dados");
		var arr;
		switch (req.body.filtrarPor) {
			case "REGIONAL":
				arr = await collection
					.aggregate([
						{
							$match: {
								regional: req.body.parametro,
								"contrato.status": { $ne: "RESCISÃO DE CONTRATO" },
								"obra.statusDaObra": {
									$in: ["AGENDADA", "AGUARDANDO AGENDAMENTO", "EM ANDAMENTO", "NÃO DEFINIDO", "CASA EM CONSTRUÇÃO", "", null, undefined],
								},
							},
						},
						{
							$sort: {
								qtde: 1,
							},
						},
					])
					.toArray();
				break;
			case "VENDEDOR":
				arr = await collection
					.aggregate([
						{
							$match: {
								"vendedor.nome": req.body.parametro,
								"contrato.status": { $ne: "RESCISÃO DE CONTRATO" },
								"obra.statusDaObra": {
									$in: ["AGENDADA", "AGUARDANDO AGENDAMENTO", "EM ANDAMENTO", "NÃO DEFINIDO", "CASA EM CONSTRUÇÃO", "", null, undefined],
								},
							},
						},
						{
							$sort: {
								qtde: 1,
							},
						},
					])
					.toArray();
			default:
				arr = await collection
					.aggregate([
						{
							$match: {
								"contrato.status": { $ne: "RESCISÃO DE CONTRATO" },
								"obra.statusDaObra": {
									$in: ["AGENDADA", "AGUARDANDO AGENDAMENTO", "EM ANDAMENTO", "NÃO DEFINIDO", "CASA EM CONSTRUÇÃO", "", null, undefined],
								},
							},
						},
						{
							$sort: {
								qtde: 1,
							},
						},
					])
					.toArray();
		}
		res.json(arr);
	}
}
