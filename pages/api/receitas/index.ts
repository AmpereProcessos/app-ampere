import { createSaleFromRevenueV2 } from "@/lib/integrations/conta-azul-v2";
import type { TClient } from "@/utils/schemas/crm/client.schema";
import type { TIntegration } from "@/utils/schemas/integrations";
import type { TProject } from "@/utils/schemas/projects";
import connectToCRMDatabase from "@/utils/services/mongodb/crm/main";
import createHttpError from "http-errors";
import { type Collection, type Db, ObjectId, type WithId } from "mongodb";
import type { NextApiHandler } from "next";
import { apiHandler, validateAuthenticationWithSession } from "../../../utils/api";
import { GeneralRevenueSchema, type TRevenue, type TRevenueWithProjectDTO } from "../../../utils/schemas/revenues";
import connectToDatabase from "../../../utils/services/mongodb/projects";
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

	console.log("[INFO] [CREATE REVENUE] Revenue details:", {
		revenueName: revenue.nome,
		revenueType: revenue.tipo,
		revenueTotal: revenue.total,
		revenueMethod: revenue.metodo,
		revenueProjectId: revenueProjectId || "No project attached",
		fracionamentoCount: revenue.fracionamento.length,
	});

	if (revenueProjectId) {
		console.log("[INFO] [CREATE REVENUE] Fetching project data.", { projectId: revenueProjectId });
		const projectResponse = await projectsCollection.findOne({ _id: new ObjectId(revenueProjectId) });
		project = projectResponse;

		if (!projectResponse) {
			console.warn("[WARN] [CREATE REVENUE] Project not found.", { projectId: revenueProjectId });
		} else {
			console.log("[INFO] [CREATE REVENUE] Revenue attached to project.", {
				projectId: projectResponse._id.toString(),
				projectName: projectResponse.nomeDoContrato,
				projectCpfCnpj: projectResponse.cpf_cnpj,
				projectClientCRMId: projectResponse.idClienteCRM || "No CRM client attached",
				existingContaAzulVenda: projectResponse.idContaAzulVenda || null,
				existingContaAzulCliente: projectResponse.idContaAzulCliente || null,
			});

			if (projectResponse?.idClienteCRM) {
				console.log("[INFO] [CREATE REVENUE] Fetching client data.", { clientCRMId: projectResponse.idClienteCRM });
				const clientResponse = await clientsCollection.findOne({ _id: new ObjectId(projectResponse.idClienteCRM) });
				client = clientResponse;

				if (!clientResponse) {
					console.warn("[WARN] [CREATE REVENUE] Client not found.", { clientCRMId: projectResponse.idClienteCRM });
				} else {
					console.log("[INFO] [CREATE REVENUE] Revenue attached to client.", {
						clientId: clientResponse._id.toString(),
						clientName: clientResponse.nome,
						clientCpfCnpj: clientResponse.cpfCnpj || "No CPF/CNPJ",
						clientEmail: clientResponse.email || "No email",
						clientPhone: clientResponse.telefonePrimario,
						existingContaAzulCliente: (clientResponse as TClient & { idContaAzulCliente?: string }).idContaAzulCliente || null,
					});
				}
			} else {
				console.log("[INFO] [CREATE REVENUE] Project has no CRM client attached, skipping client fetch.");
			}
		}
	} else {
		console.log("[INFO] [CREATE REVENUE] Revenue has no project attached, will skip Conta Azul integration.");
	}
	let contaAzulSaleId: string | null = null;
	let contaAzulClientId: string | null = null;
	let contaAzulFinancialEventId: string | null = null;
	let contaAzulCostCenterId: string | null = null;
	// Only run Conta Azul integration if project exists
	if (client && project) {
		console.log("[INFO] [CREATE REVENUE] Starting Conta Azul V2 integration.", {
			clientId: client._id.toString(),
			projectId: project._id.toString(),
			projectValues: {
				sistemaValorProjeto: project.sistema?.valorProjeto || null,
				padraoValor: project.padrao?.valor || null,
				estruturaPersonalizadaValor: project.estruturaPersonalizada?.valor || null,
				seguroValor: project.seguro?.valor || null,
				oemValor: project.oem?.valor || null,
			},
		});

		try {
			console.log("[INFO] [CREATE REVENUE] Calling createSaleFromRevenueV2...");
			const contaAzulResponse = await createSaleFromRevenueV2({
				revenue,
				client: client,
				project: project,
			});
			contaAzulSaleId = contaAzulResponse.contaAzulSaleId;
			contaAzulClientId = contaAzulResponse.contaAzulClientId;
			contaAzulFinancialEventId = contaAzulResponse.contaAzulFinancialEventId;
			contaAzulCostCenterId = contaAzulResponse.contaAzulCostCenterId;
			console.log("[INFO] [CREATE REVENUE] Conta Azul sale created successfully.", {
				contaAzulSaleId,
				contaAzulClientId,
			});

			// Update client with Conta Azul ID
			console.log("[INFO] [CREATE REVENUE] Updating client with Conta Azul ID.", {
				clientId: client._id.toString(),
				contaAzulClientId,
			});
			await clientsCollection.updateOne({ _id: new ObjectId(client._id) }, { $set: { idContaAzulCliente: contaAzulClientId } });

			// Update project with Conta Azul references
			console.log("[INFO] [CREATE REVENUE] Updating project with Conta Azul references.", {
				projectId: project._id.toString(),
				contaAzulSaleId,
				contaAzulClientId,
			});
			await projectsCollection.updateOne(
				{ _id: new ObjectId(project._id) },
				{
					$set: {
						idContaAzulVenda: contaAzulSaleId,
						idContaAzulCliente: contaAzulClientId,
						idContaAzulCentroCusto: contaAzulCostCenterId,
					},
				},
			);

			console.log("[INFO] [CREATE REVENUE] Conta Azul integration completed successfully.");
		} catch (error) {
			console.error("[ERROR] [CREATE REVENUE] Conta Azul V2 integration failed:", {
				error: error instanceof Error ? error.message : String(error),
				stack: error instanceof Error ? error.stack : undefined,
				clientId: client._id.toString(),
				projectId: project._id.toString(),
				revenueName: revenue.nome,
			});
			// Don't block revenue creation if Conta Azul fails
		}
	} else {
		if (!client && project) {
			console.log("[INFO] [CREATE REVENUE] Skipping Conta Azul integration: No client found.", {
				projectId: project._id.toString(),
				projectHasClienteCRM: !!project.idClienteCRM,
			});
		} else if (client && !project) {
			console.log("[INFO] [CREATE REVENUE] Skipping Conta Azul integration: No project attached.");
		} else {
			console.log("[INFO] [CREATE REVENUE] Skipping Conta Azul integration: No client or project.");
		}
	}
	const revenueReceivedCompletely = revenue.fracionamento.length > 0 ? revenue.fracionamento.every((f) => !!f.dataRecebimento) : false;

	console.log("[INFO] [CREATE REVENUE] Inserting revenue into database.", {
		revenueName: revenue.nome,
		revenueType: revenue.tipo,
		revenueTotal: revenue.total,
		revenueReceivedCompletely,
		contaAzulSaleId: contaAzulSaleId || "Not created",
		contaAzulClientId: contaAzulClientId || "Not created",
		projectId: project?._id.toString() || "No project",
		clientId: client?._id.toString() || "No client",
	});

	const insertResponse = await revenuesCollection.insertOne({
		...revenue,
		idContaAzulVenda: contaAzulSaleId,
		idContaAzulCliente: contaAzulClientId,
		idContaAzulEventoFinanceiro: contaAzulFinancialEventId,
		autor: author,
		dataEfetivacao: revenueReceivedCompletely ? new Date().toISOString() : null,
		dataInsercao: new Date().toISOString(),
	});

	if (!insertResponse.acknowledged) {
		console.error("[ERROR] [CREATE REVENUE] Failed to insert revenue into database.", {
			revenueName: revenue.nome,
			acknowledged: insertResponse.acknowledged,
		});
		throw new createHttpError.InternalServerError("Oops, houve um erro na criação da receita.");
	}

	console.log("[INFO] [CREATE REVENUE] Revenue created successfully.", {
		revenueId: insertResponse.insertedId.toString(),
		revenueName: revenue.nome,
		revenueType: revenue.tipo,
		revenueTotal: revenue.total,
		contaAzulIntegration: contaAzulSaleId ? "Success" : "Skipped or Failed",
		authorId: author.id,
		authorName: author.nome,
	});

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
