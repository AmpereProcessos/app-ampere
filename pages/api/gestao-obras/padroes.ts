import type { NextApiHandler } from "next";
import connectToDatabase from "../../../utils/services/mongodb/projects";
import type { Collection, Db, Filter, ObjectId, WithId } from "mongodb";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import type { TProject, TProjectDTO } from "@/utils/schemas/projects";
import { z } from "zod";
import createHttpError from "http-errors";
import type { TServiceOrder } from "@/utils/schemas/service-order";

const EnergyPAExecutionProjection = {
	_id: 1,
	qtde: 1,
	nomeDoContrato: 1,
	tipoDeServico: 1,
	"compra.dataPedido": 1,
	"compra.dataPagamento": 1,
	"compra.previsaoEntrega": 1,
	cidade: 1,
	uf: 1,
	telefone: 1,
	cep: 1,
	bairro: 1,
	logradouro: 1,
	numeroResidencia: 1,
	segmento: 1,
	"homologacao.documentacao.dataAssinatura": 1,
	"homologacao.documentacao.dataConclusaoElaboracao": 1,
	"homologacao.vistoria": 1,
	"homologacao.status": 1,
	"obra.saida": 1,
	padrao: 1,
	visitaTecnica: 1,
	ordensDeServico: 1,
};

export type TEnergyPAExecution = Pick<
	TProjectDTO,
	| "_id"
	| "qtde"
	| "nomeDoContrato"
	| "tipoDeServico"
	| "compra"
	| "cidade"
	| "uf"
	| "telefone"
	| "cep"
	| "bairro"
	| "logradouro"
	| "numeroResidencia"
	| "segmento"
	| "homologacao"
	| "padrao"
	| "obra"
	| "visitaTecnica"
>;

type GetResponse = {
	data: TEnergyPAExecution | TEnergyPAExecution[];
};

const getEnergyPAExecutions: NextApiHandler<GetResponse> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);

	const db: Db = await connectToDatabase();
	const collection: Collection<TProject> = db.collection("dados");

	const projects = await collection.find({ "padrao.aumentoCarga.aplicavel": true }, { projection: EnergyPAExecutionProjection }).toArray();

	return res.status(200).json({ data: projects.map((p) => ({ ...p, _id: p._id.toString() })) });
};

const EnergyPAExecutionWithFiltersInput = z.object({
	page: z.number({
		required_error: "Página não informada.",
		invalid_type_error: "Tipo não válido para a página.",
	}),
	search: z.string({
		required_error: "Filtro de pesquisa não informado.",
		invalid_type_error: "Tipo não válido para o filtro de pesquisa.",
	}),
	segments: z.array(
		z.string({
			required_error: "Filtro de segmento não informado.",
			invalid_type_error: "Tipo não válido para o filtro de segmento.",
		}),
	),
	homologationStatus: z.array(
		z.string({
			required_error: "Filtro de status de homologação não informado.",
			invalid_type_error: "Tipo não válido para o filtro de status de homologação.",
		}),
	),
	responsabilityTypes: z.array(
		z.string({
			required_error: "Filtro de tipo de responsabilidade não informado.",
			invalid_type_error: "Tipo não válido para o filtro de tipo de responsabilidade.",
		}),
	),
	pendingExecutionOnly: z.boolean({
		required_error: "Filtro de execução pendente não informado.",
		invalid_type_error: "Tipo não válido para o filtro de execução pendente.",
	}),
	paidOnly: z.boolean({
		required_error: "Filtro de execução pendente não informado.",
		invalid_type_error: "Tipo não válido para o filtro de execução pendente.",
	}),
	period: z.object({
		field: z
			.enum([
				"homologacao.documentacao.dataConclusaoElaboracao",
				"homologacao.documentacao.dataAssinatura",
				"homologacao.acesso.dataResposta",
				"homologacao.vistoria.dataEfetivacao",
				"padrao.aumentoCarga.dataEfetivacao",
			])
			.optional()
			.nullable(),
		after: z
			.string({
				required_error: "Filtro de período não informado.",
				invalid_type_error: "Tipo não válido para o filtro de período.",
			})
			.optional()
			.nullable(),
		before: z
			.string({
				required_error: "Filtro de período não informado.",
			})
			.optional()
			.nullable(),
	}),
});
export type TEnergyPAExecutionWithFiltersInput = z.infer<typeof EnergyPAExecutionWithFiltersInput>;

export type TEnergyPAExecutionWithFiltersOutput = {
	data: {
		projects: (TEnergyPAExecution & { ordemDeServico: TServiceOrder | undefined })[];
		projectsMatched: number;
		totalPages: number;
	};
};
const getEnergyPAExecutionWithFilters: NextApiHandler<TEnergyPAExecutionWithFiltersOutput> = async (req, res) => {
	const PAGE_SIZE = 50;
	const session = await validateAuthenticationWithSession(req, res);
	const isAuthorized = !!session?.user.permissoes.execucao.visualizar;
	if (!isAuthorized) throw new createHttpError.Unauthorized("Oops, seu usuário não possui acesso a esse módulo.");
	const { page, search, segments, homologationStatus, responsabilityTypes, pendingExecutionOnly, paidOnly, period } = EnergyPAExecutionWithFiltersInput.parse(req.body);

	console.log({ page, search, segments, homologationStatus, responsabilityTypes, pendingExecutionOnly, paidOnly, period });
	const db: Db = await connectToDatabase();
	const projectsCollection: Collection<TProject> = db.collection("dados");
	const serviceOrdersCollection: Collection<TServiceOrder> = db.collection("ordensDeServico");

	const searchQueries: Filter<TProject>[] =
		search.trim().length > 0
			? [
					{
						nomeDoContrato: { $regex: search, $options: "i" },
					},
					{
						nomeDoContrato: search,
					},
				]
			: [];

	const searchQuery: Filter<TProject> = searchQueries.length > 0 ? { $or: searchQueries } : {};
	const segmentsQuery: Filter<TProject> = segments.length > 0 ? { segmento: { $in: segments as any } } : {};

	const homologationStatusQuery: Filter<TProject> = homologationStatus.length > 0 ? { "homologacao.status": { $in: homologationStatus as any } } : {};

	const responsabilityTypesQuery: Filter<TProject> = responsabilityTypes.length > 0 ? { "obra.responsabilidade": { $in: responsabilityTypes } } : {};

	const pendingExecutionOnlyQuery: Filter<TProject> = pendingExecutionOnly ? { "padrao.aumentoCarga.dataEfetivacao": null } : {};

	const paidOnlyQuery: Filter<TProject> = paidOnly ? { "compra.dataPagamento": { $ne: null } } : {};

	const periodQuery: Filter<TProject> = period.field && period.after && period.before ? { [period.field]: { $gte: period.after, $lte: period.before } } : {};
	const query: Filter<TProject> = {
		"padrao.aumentoCarga.aplicavel": true,
		...searchQuery,
		...segmentsQuery,
		...homologationStatusQuery,
		...responsabilityTypesQuery,
		...pendingExecutionOnlyQuery,
		...paidOnlyQuery,
		...periodQuery,
	};

	console.log(JSON.stringify(query, null, 2));
	const skip = PAGE_SIZE * (Number(page) - 1);
	const limit = PAGE_SIZE;

	const projectsMatched = await projectsCollection.countDocuments(query);
	const projects = (await projectsCollection
		.find(query)
		.project(EnergyPAExecutionProjection)
		.skip(skip)
		.limit(limit)
		.sort({ nomeDoContrato: 1 })
		.toArray()) as WithId<TEnergyPAExecution>[];

	const projectIds = projects.map((p) => p._id.toString());
	const projectsServiceOrders = await serviceOrdersCollection.find({ "projeto.id": { $in: projectIds }, categoria: "PADRÃO" }).toArray();

	const projectsWithServiceOrders = projects.map((p) => {
		const serviceOrder = projectsServiceOrders.find((so) => so.projeto.id === p._id.toString());
		return { ...p, ordemDeServico: serviceOrder };
	});

	const totalPages = Math.ceil(projectsMatched / PAGE_SIZE);
	return res.status(200).json({
		data: {
			projects: projectsWithServiceOrders.map((p) => ({ ...p, _id: p._id.toString() })),
			projectsMatched,
			totalPages,
		},
	});
};
export default apiHandler({ GET: getEnergyPAExecutions, POST: getEnergyPAExecutionWithFilters });
