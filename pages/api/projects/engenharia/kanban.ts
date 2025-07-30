import type { NextApiHandler } from "next";
import { z } from "zod";
import { EngineeringProjectProjection, type TEngineeringProject, type TEngineeringProjectDTO } from ".";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import createHttpError from "http-errors";
import connectToDatabase from "@/utils/services/mongodb/projects";
import type { TProject } from "@/utils/schemas/projects";
import type { Filter, WithId } from "mongodb";

const EngineeringProjectsKanbanInputSchema = z.object({
	search: z.string({
		required_error: "Parâmetro de busca não informado",
		invalid_type_error: "Tipo não válido para parâmetro de busca",
	}),
	projectTypes: z.array(
		z.string({
			required_error: "Parâmetro de tipos de projetos não informado",
			invalid_type_error: "Tipo não válido para parâmetro de tipos de projetos",
		}),
		{
			required_error: "Parâmetro de tipos de projetos não informado",
			invalid_type_error: "Tipo não válido para parâmetro de tipos de projetos",
		},
	),
	cities: z.array(
		z.string({
			required_error: "Parâmetro de cidades não informado",
			invalid_type_error: "Tipo não válido para parâmetro de cidades",
		}),
		{
			required_error: "Parâmetro de cidades não informado",
			invalid_type_error: "Tipo não válido para parâmetro de cidades",
		},
	),
	ufs: z.array(
		z.string({
			required_error: "Parâmetro de UFs não informado",
			invalid_type_error: "Tipo não válido para parâmetro de UFs",
		}),
		{
			required_error: "Parâmetro de UFs não informado",
			invalid_type_error: "Tipo não válido para parâmetro de UFs",
		},
	),
	deliveryStatus: z.array(
		z.string({
			required_error: "Parâmetro de status de entrega não informado",
			invalid_type_error: "Tipo não válido para parâmetro de status de entrega",
		}),
		{
			required_error: "Parâmetro de status de entrega não informado",
			invalid_type_error: "Tipo não válido para parâmetro de status de entrega",
		},
	),
	tagIds: z.array(
		z.string({
			required_error: "Parâmetro de IDs de etiquetas não informado",
			invalid_type_error: "Tipo não válido para parâmetro de IDs de etiquetas",
		}),
		{
			required_error: "Parâmetro de IDs de etiquetas não informado",
			invalid_type_error: "Tipo não válido para parâmetro de IDs de etiquetas",
		},
	),
	sellerNames: z.array(
		z.string({
			required_error: "Parâmetros de nomes de vendedores não informados",
			invalid_type_error: "Tipo não válido para parâmetros de nomes de vendedores",
		}),
		{
			required_error: "Parâmetros de nomes de vendedores não informados",
			invalid_type_error: "Tipo não válido para parâmetros de nomes de vendedores",
		},
	),
	accessGrantingStatus: z.array(
		z.string({
			required_error: "Parâmetros de status de liberação de acesso não informados",
			invalid_type_error: "Tipo não válido para parâmetros de status de liberação de acesso",
		}),
		{
			required_error: "Parâmetros de status de liberação de acesso não informados",
			invalid_type_error: "Tipo não válido para parâmetros de status de liberação de acesso",
		},
	),
	pendingVistoryOnly: z
		.boolean({
			required_error: "Parâmetro de status de vistoria pendente não informado",
			invalid_type_error: "Tipo não válido para parâmetro de status de vistoria pendente",
		})
		.optional()
		.nullable(),
	pendingDrawingOnly: z
		.boolean({
			required_error: "Parâmetro de status de desenho pendente não informado",
			invalid_type_error: "Tipo não válido para parâmetro de status de desenho pendente",
		})
		.optional()
		.nullable(),
	pendingDiagramOnly: z
		.boolean({
			required_error: "Parâmetro de status de diagrama pendente não informado",
			invalid_type_error: "Tipo não válido para parâmetro de status de diagrama pendente",
		})
		.optional()
		.nullable(),
	period: z.object({
		field: z
			.enum([
				"contrato.dataAssinatura",
				"homologacao.dataLiberacao",
				"homologacao.documentacao.dataInicioElaboracao",
				"homologacao.documentacao.dataConclusaoElaboracao",
				"homologacao.documentacao.dataLiberacao",
				"homologacao.documentacao.dataAssinatura",
				"homologacao.vistoria.dataSolicitacao",
				"homologacao.vistoria.dataEfetivacao",
				"homologacao.dataEfetivacao",
				"compra.dataEntrega",
				"compra.dataPagamento",
			])
			.optional()
			.nullable(),
		after: z
			.string({
				required_error: "Parâmetro de data depois não informado",
				invalid_type_error: "Tipo não válido para parâmetro de data depois",
			})
			.datetime({ message: "Formato inválido para parâmetro de início de período" })
			.optional()
			.nullable(),
		before: z
			.string({
				required_error: "Parâmetro de data antes não informado",
				invalid_type_error: "Tipo não válido para parâmetro de data antes",
			})
			.datetime({ message: "Formato inválido para parâmetro de fim de período" })
			.optional()
			.nullable(),
	}),
});
export type TEngineeringProjectsKanbanInput = z.infer<typeof EngineeringProjectsKanbanInputSchema>;

export type TEngineeringProjectsKanbanOutput = {
	data: {
		[key: string]: TEngineeringProjectDTO[];
	};
};
const getEngineeringProjectsKanbanHandler: NextApiHandler<TEngineeringProjectsKanbanOutput> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const isAuthorized = session.user.permissoes.engenharia.visualizar;

	if (!isAuthorized) throw new createHttpError.Unauthorized("Você não tem permissão para acessar este recurso");

	const db = await connectToDatabase();
	const projectsCollection = db.collection<TProject>("dados");

	const { search, projectTypes, cities, ufs, deliveryStatus, tagIds, sellerNames, accessGrantingStatus, pendingVistoryOnly, pendingDrawingOnly, pendingDiagramOnly, period } =
		EngineeringProjectsKanbanInputSchema.parse(req.body);

	const searchQueries: Filter<TProject>[] = search.trim().length > 0 ? [{ nomeDoContrato: { $regex: search, $options: "i" } }, { nomeDoContrato: search }] : [];

	const searchQuery = searchQueries.length > 0 ? { $or: searchQueries } : {};
	const projectTypesQuery: Filter<TProject> = projectTypes.length > 0 ? { tipoDeServico: { $in: projectTypes } } : {};

	const citiesQuery: Filter<TProject> = cities.length > 0 ? { cidade: { $in: cities } } : {};

	const ufsQuery: Filter<TProject> = ufs.length > 0 ? { uf: { $in: ufs } } : {};

	const deliveryStatusQuery: Filter<TProject> = deliveryStatus.length > 0 ? { "compra.statusEntrega": { $in: deliveryStatus } } : {};

	const tagIdsQuery: Filter<TProject> = tagIds.length > 0 ? { "etiquetas.id": { $in: tagIds } } : {};

	const sellerNamesQuery: Filter<TProject> = sellerNames.length > 0 ? { "vendedor.nome": { $in: sellerNames } } : {};

	const accessGrantingStatusQuery: Filter<TProject> =
		accessGrantingStatus.length > 0 ? { "homologacao.status": { $in: accessGrantingStatus as TProject["homologacao"]["status"][] } } : {};

	const pendingVistoryOnlyQuery: Filter<TProject> = pendingVistoryOnly ? { "homologacao.vistoria.dataEfetivacao": null } : {};
	const pendingDrawingOnlyQuery: Filter<TProject> = pendingDrawingOnly ? { "homologacao.pendencias.desenhos": null } : {};
	const pendingDiagramOnlyQuery: Filter<TProject> = pendingDiagramOnly ? { "homologacao.pendencias.diagramas": null } : {};

	const periodQuery: Filter<TProject> = period.field && period.after && period.before ? { [period.field]: { $gte: period.after, $lte: period.before } } : {};
	const query: Filter<TProject> = {
		"contrato.status": { $ne: "RESCISÃO DE CONTRATO" },
		"homologacao.dataEfetivacao": null,
		$or: [{ "compra.statusLiberacao": "PAGO" }, { "homologacao.dataLiberacao": { $ne: null } }],
		...searchQuery,
		...projectTypesQuery,
		...citiesQuery,
		...ufsQuery,
		...deliveryStatusQuery,
		...tagIdsQuery,
		...sellerNamesQuery,
		...accessGrantingStatusQuery,
		...pendingVistoryOnlyQuery,
		...pendingDrawingOnlyQuery,
		...pendingDiagramOnlyQuery,
		...periodQuery,
	};

	const projects = (await projectsCollection.find(query).project(EngineeringProjectProjection).toArray()) as WithId<TEngineeringProject>[];

	const byStatusInitial: Record<TEngineeringProject["homologacao"]["status"] & "NÃO DEFINIDO", TEngineeringProjectDTO[]> = {
		"NÃO DEFINIDO": [],
		PENDENTE: [],
		CANCELADO: [],
		"ELABORANDO DOCUMENTAÇÕES": [],
		"AGUARDANDO ASSINATURA": [],
		"AGUARDANDO FATURAMENTO": [],
		"AGUARDANDO PENDÊNCIAS": [],
		"AGUARDANDO RESPOSTA": [],
		"APROVADO COM REDUÇÃO": [],
		"APROVADO NOTURNO": [],
		APROVADO: [],
		REPROVADO: [],
		SUSPENSO: [],
		"REPROVADO COM REDUÇÃO": [],
	};

	const reduced = projects.reduce((acc, project) => {
		const homologationStatus = project.homologacao.status || "NÃO DEFINIDO";
		if (!acc[homologationStatus]) acc[homologationStatus] = [];
		acc[homologationStatus].push(project);
		return acc;
	}, byStatusInitial);

	res.status(200).json({ data: reduced });
};

export default apiHandler({
	POST: getEngineeringProjectsKanbanHandler,
});
