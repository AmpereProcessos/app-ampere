import { ObjectId } from "mongodb";
import connectToDatabase from "../../../../utils/services/mongodb/projects";
import { getSession } from "next-auth/react";
import { errorHandler } from "../../../../utils/methods/handlers";
import { apiHandler, validateAuthenticationWithSession } from "../../../../utils/api";
export default async function handler(req, res) {
	if (req.method === "POST") {
		const session = await validateAuthenticationWithSession(req, res);
		const db = await connectToDatabase(process.env.DB_KEY, "projetos");
		const collection = db.collection("dados");
		const serviceOrdersCollection = db.collection("ordensDeServico");
		const logCollection = db.collection("logAlteracoes");
		delete req.body._id;

		// logging changes in changes collections
		const logObject = {
			autor: {
				id: session?.user?.id,
				nome: session?.user.nome,
				avatar_url: session?.user.avatar_url,
			},
			idProjetoAlterado: req.query.id,
			alteracoes: req.body,
			dataAlteracao: new Date().toISOString(),
			dataAlteracaoFormatada: new Date().toLocaleString("pt-br"),
		};

		const updateKeys = Object.keys(req.body);

		var newObj = await collection.updateOne({ _id: ObjectId(req.query.id) }, { $set: { ...req.body } });

		// Validating for non empty update objects
		if (session && updateKeys.length > 0) {
			await logCollection.insertOne(logObject);
		}
		// Checking for update on service order trackable fields
		if (
			[
				"vendedor.nome",
				"contrato.dataAssinatura",
				"homologacao.fastTrack",
				"homologacao.acesso.dataResposta",
				"homologacao.vistoria.dataEfetivacao",
				"pagamento.credor",
				"compra.previsaoEntrega",
				"compra.dataEntrega",
				"obra.pendencias",
			].some((x) => updateKeys.includes(x))
		) {
			const project = await collection.findOne({ _id: ObjectId(req.query.id) });
			if (project.idOrdemServico) {
				await serviceOrdersCollection.updateMany(
					{
						_id: new ObjectId(project.idOrdemServico),
					},
					{
						$set: {
							etiquetas: getServiceOrderTags({ project }),
							"projeto.vendedorNome": project.vendedor.nome,
							"projeto.contratoDataAssinatura": project.contrato?.dataAssinatura,
							"projeto.compraEntregaDataPrevisao": project.compra?.previsaoEntrega,
							"projeto.compraEntregaDataEfetivacao": project.compra?.dataEntrega,
							"projeto.homologacaoAcessoDataResposta": project.homologacao?.acesso.dataResposta,
							"projeto.homologacaoVistoriaDataEfetivacao": project.homologacao?.vistoria.dataEfetivacao,
						},
					},
				);
			}
		}
		return res.json(newObj);
	} else if (req.method == "PUT") {
		try {
			const db = await connectToDatabase(process.env.DB_KEY, "projetos").catch((err) => {
				throw err;
			});
			const collection = db.collection("dados");
			const id = req.query.id;
			const operation = req.body.operation;
			console.log(operation);
			var newObj = await collection.updateOne(
				{
					_id: ObjectId(id),
				},
				{ ...operation },
			);
			res.json(newObj);
		} catch (error) {
			errorHandler(error, res);
		}
	}
}

function getServiceOrderTags({ project }) {
	const tags = [];
	if (project.homologacao.fastTrack) {
		tags.push({
			id: "6798eb1b19ad4c2b679bd2e1",
			titulo: "FAST TRACK",
			cores: {
				primaria: "#058A05",
				secundaria: "#B7FDB7",
			},
		});
	}
	if (project.pagamento.credor == "SOL FÁCIL") {
		tags.push({
			id: "6798eb2bd422f4f93779dd0d",
			titulo: "DESLIGAMENTO REMOTO",
			cores: {
				primaria: "#FF0000",
				secundaria: "#FFCCCB",
			},
		});
	}
	if (project.obras?.pendencias == "LEVAR ESTRUTURA NA MONTAGEM") {
		tags.push({
			id: "6798eb4e38fd2c093589ee7f",
			titulo: "TRANSPORTAR ESTRUTURA",
			cores: {
				primaria: "#8B4513",
				secundaria: "#DFD0BC",
			},
		});
	}
	return tags;
}
