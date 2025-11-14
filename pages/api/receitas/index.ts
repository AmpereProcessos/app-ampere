import connectToDatabase from "../../../utils/services/mongodb/projects";
import { GeneralRevenueSchema, type TRevenue, type TRevenueWithProjectDTO } from "../../../utils/schemas/revenues";
import type { NextApiHandler } from "next";
import { apiHandler, validateAuthenticationWithSession } from "../../../utils/api";
import createHttpError from "http-errors";
import { type Collection, type Db, ObjectId, type WithId } from "mongodb";
import type { TIntegration } from "@/utils/schemas/integrations";
import { getContaAzulAccessToken } from "@/repositories/integrations/conta-azul/queries";
import { createSaleFromRevenue } from "@/lib/integrations/conta-azul";
import type { TClient } from "@/utils/schemas/crm/client.schema";
import connectToCRMDatabase from "@/utils/services/mongodb/crm/main";
import type { TProject } from "@/utils/schemas/projects";
type GetResponse = {
	data: TRevenue | TRevenue[];
};

const getRevenues: NextApiHandler<GetResponse> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);

	const { id, projectId } = req.query;

	const db: Db = await connectToDatabase();
	const collection: Collection<TRevenue> = db.collection("receitas");

	// Query for a specific revenue
	if (id) {
		if (typeof id !== "string" || !ObjectId.isValid(id)) throw new createHttpError.BadRequest("ID inválido.");

		const addFields = { projectIdAsObjectId: { $toObjectId: "$projeto.id" } };
		const lookup = { from: "dados", localField: "projectIdAsObjectId", foreignField: "_id", as: "projetoDados" };
		const revenueArr = await collection
			.aggregate([
				{ $match: { _id: new ObjectId(id) } },
				{ $addFields: addFields },
				{ $lookup: lookup },
				{
					$project: {
						nome: 1,
						tipo: 1,
						autor: 1,
						projeto: 1,
						total: 1,
						metodo: 1,
						efetivacao: 1,
						fracionamento: 1,
						dataInsercao: 1,
						"projetoDados._id": 1,
						"projetoDados.nomeDoContrato": 1,
						"projetoDados.cpf_cnpj": 1,
						"projetoDados.inscricaoRural": 1,
						"projetoDados.tipoDeServico": 1,
						"projetoDados.telefone": 1,
						"projetoDados.email": 1,
						"projetoDados.cep": 1,
						"projetoDados.uf": 1,
						"projetoDados.cidade": 1,
						"projetoDados.bairro": 1,
						"projetoDados.logradouro": 1,
						"projetoDados.numeroResidencia": 1,
						"projetoDados.pagamento.pagador": 1,
						"projetoDados.pagamento.contatoPagador": 1,
						"projetoDados.pagamento.cpf_cnpjPagador": 1,
						"projetoDados.pagamento.forma": 1,
						"projetoDados.pagamento.metodo": 1,
						"projetoDados.pagamento.credor": 1,
						"projetoDados.pagamento.credorNomeGerente": 1,
						"projetoDados.pagamento.credorContatoGerente": 1,
						"projetoDados.pagamento.negociacao": 1,
						"projetoDados.produtos": 1,
						"projetoDados.servicos": 1,
					},
				},
			])
			.toArray();
		const revenue = revenueArr.map((p) => ({ ...p, projetoDados: p.projetoDados[0] }))[0];
		if (!revenue) throw new createHttpError.NotFound("Receita não encontrada.");
		return res.status(200).json({ data: revenue as TRevenueWithProjectDTO });
	}
	// Query for a given project revenues
	if (projectId) {
		if (typeof projectId !== "string") throw new createHttpError.BadRequest("ID de projeto inválido.");
		const revenues = await collection.find({ "projeto.id": projectId }, { sort: { "efetivacao.data": -1, dataInsercao: 1 } }).toArray();
		return res.status(200).json({ data: revenues });
	}
	// Query for all revenues
	const revenues = await collection.find({}, { sort: { "efetivacao.data": -1, dataInsercao: 1 } }).toArray();
	return res.status(200).json({ data: revenues });
};

type PostResponse = {
	data: {
		insertedId: string;
	};
	message: string;
};

const createRevenue: NextApiHandler<PostResponse> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);

	const revenue = GeneralRevenueSchema.parse(req.body);
	const author = { id: session.user.id, nome: session.user.nome, avatar_url: session.user.avatar_url };
	const db: Db = await connectToDatabase();
	const crmDb = await connectToCRMDatabase();

	console.log("[INFO] [CREATE REVENUE] Starting revenue creation process.", {
		authorId: session.user.id,
		authorName: session.user.nome,
	});
	const projectsCollection: Collection<TProject> = db.collection("dados");
	const revenuesCollection: Collection<TRevenue> = db.collection("receitas");
	const integrationsCollection: Collection<TIntegration> = db.collection("integracoes");
	const clientsCollection: Collection<TClient> = crmDb.collection("clients");

	const revenueProjectId = revenue.projeto.id;
	let project: WithId<TProject> | null = null;
	let client: WithId<TClient> | null = null;
	if (revenueProjectId) {
		const projectResponse = await projectsCollection.findOne({ _id: new ObjectId(revenueProjectId) });
		project = projectResponse;
		console.log(`[INFO] [CREATE REVENUE] Revenue attached to project ${projectResponse?._id.toString()}.`);
		if (projectResponse?.idClienteCRM) {
			const clientResponse = await clientsCollection.findOne({ _id: new ObjectId(projectResponse.idClienteCRM) });
			client = clientResponse;
			console.log(`[INFO] [CREATE REVENUE] Revenue attached to client ${clientResponse?._id.toString()}.`);
		}
	}
	const contaAzulAccessToken = await getContaAzulAccessToken({ collection: integrationsCollection });

	let contaAzulSaleId: string | null = null;
	let contaAzulClientId: string | null = null;
	if (client) {
		const contaAzulResponse = await createSaleFromRevenue({
			revenue,
			client: client,
			accessToken: contaAzulAccessToken,
		});
		contaAzulSaleId = contaAzulResponse.contaAzulSaleId;
		contaAzulClientId = contaAzulResponse.contaAzulCustomerId;
		await clientsCollection.updateOne({ _id: new ObjectId(client._id) }, { $set: { idContaAzulCliente: contaAzulClientId } });
	}

	if (project) {
		await projectsCollection.updateOne(
			{ _id: new ObjectId(project._id) },
			{ $set: { idContaAzulVenda: contaAzulSaleId, idContaAzulCliente: contaAzulClientId } },
		);
	}
	const revenueReceivedCompletely = revenue.fracionamento.length > 0 ? revenue.fracionamento.every((f) => !!f.dataRecebimento) : false;
	const insertResponse = await revenuesCollection.insertOne({
		...revenue,
		idContaAzulVenda: contaAzulSaleId,
		idContaAzulCliente: contaAzulClientId,
		autor: author,
		dataEfetivacao: revenueReceivedCompletely ? new Date().toISOString() : null,
		dataInsercao: new Date().toISOString(),
	});

	if (!insertResponse.acknowledged) throw new createHttpError.InternalServerError("Oops, houve um erro na criação da receita.");

	return res.status(201).json({ data: { insertedId: insertResponse.insertedId.toString() }, message: "Receita criada com sucesso !" });
};

type PutResponse = {
	data: string;
	message: string;
};

const editRevenue: NextApiHandler<PutResponse> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);

	const { id } = req.query;
	if (typeof id !== "string" || !ObjectId.isValid(id)) throw new createHttpError.BadRequest("ID inválido.");
	const changes = GeneralRevenueSchema.partial().parse(req.body);

	console.log(changes);
	const db: Db = await connectToDatabase();
	const collection: Collection<TRevenue> = db.collection("receitas");

	const updateResponse = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { ...changes } });
	if (!updateResponse.acknowledged) throw new createHttpError.InternalServerError("Oops, houve um erro ao atualizar receita.");

	const revenueUpdated = await collection.findOne({ _id: new ObjectId(id) });
	if (!revenueUpdated) throw new createHttpError.NotFound("Receita não encontrada.");

	// Updating revenue effectivation date on complete receipt of the revenue
	const revenueReceivedCompletely = revenueUpdated.fracionamento.length > 0 ? revenueUpdated.fracionamento.every((f) => !!f.dataRecebimento) : false;
	if (revenueReceivedCompletely) {
		await collection.updateOne({ _id: new ObjectId(id) }, { $set: { dataEfetivacao: new Date().toISOString() } });
	}

	return res.status(201).json({ data: "Receita atualizada com sucesso!", message: "Receita atualizada com sucesso!" });
};
export default apiHandler({ GET: getRevenues, POST: createRevenue, PUT: editRevenue });
