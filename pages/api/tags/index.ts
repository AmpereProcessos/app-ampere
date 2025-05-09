import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import { TagSchema, type TTag } from "@/utils/schemas/tags";
import connectToDatabase from "@/utils/services/mongodb/auxiliaries";
import createHttpError from "http-errors";
import { type Db, type Filter, ObjectId } from "mongodb";
import type { NextApiHandler, NextApiRequest } from "next";
import type { Session } from "next-auth";
import { z } from "zod";

/**
 * GET
 */
const FetchTagsRouteInputSchema = z.object({
	id: z.string({ invalid_type_error: "ID inválido." }).optional().nullable(),
	applicableToOpportunities: z.enum(["true", "false"]).optional().nullable(),
	applicableToProposals: z.enum(["true", "false"]).optional().nullable(),
	applicableToPurchases: z.enum(["true", "false"]).optional().nullable(),
	applicableToProjects: z.enum(["true", "false"]).optional().nullable(),
	applicableToServiceOrders: z.enum(["true", "false"]).optional().nullable(),
});
export type TGetTagsRouteInput = z.infer<typeof FetchTagsRouteInputSchema>;
async function fetchTags(req: NextApiRequest) {
	const queryParams = FetchTagsRouteInputSchema.parse(req.query);

	const db: Db = await connectToDatabase();
	const collection = db.collection<TTag>("etiquetas");

	const { id, applicableToOpportunities, applicableToProposals, applicableToPurchases, applicableToProjects, applicableToServiceOrders } = queryParams;

	if (id) {
		const tag = await collection.findOne({ _id: new ObjectId(id) });
		if (!tag) throw new createHttpError.NotFound("Tag não encontrada.");
		return {
			default: undefined,
			byId: { ...tag, _id: tag._id.toString() },
		};
	}

	const opportunitiesFilter: Filter<TTag> = applicableToOpportunities === "true" ? { "entidades.oportunidades": true } : {};
	const proposalsFilter: Filter<TTag> = applicableToProposals === "true" ? { "entidades.propostas": true } : {};
	const purchasesFilter: Filter<TTag> = applicableToPurchases === "true" ? { "entidades.compras": true } : {};
	const projectsFilter: Filter<TTag> = applicableToProjects === "true" ? { "entidades.projetos": true } : {};
	const serviceOrdersFilter: Filter<TTag> = applicableToServiceOrders === "true" ? { "entidades.ordensServico": true } : {};

	const finalFilter: Filter<TTag> = {
		...opportunitiesFilter,
		...proposalsFilter,
		...purchasesFilter,
		...projectsFilter,
		...serviceOrdersFilter,
	};
	const tags = await collection.find(finalFilter).toArray();

	return {
		default: tags.map((p) => ({ ...p, _id: p._id.toString() })),
		byId: undefined,
	};
}
export type TGetTagsRouteOutput = Awaited<ReturnType<typeof fetchTags>>;
export type TGetTagsRouteOutputDefault = Exclude<TGetTagsRouteOutput["default"], undefined>;
export type TGetTagsRouteOutputById = Exclude<TGetTagsRouteOutput["byId"], undefined>;

const getTagsRoute: NextApiHandler<{ data: TGetTagsRouteOutput }> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const result = await fetchTags(req);
	return res.status(200).json({
		data: result,
	});
};

/**
 * POST
 */

export type TCreateTagRouteInput = z.infer<typeof TagSchema>;
async function createTag(req: NextApiRequest, ctx: { session: Session }) {
	const payload = TagSchema.parse(req.body);

	const db: Db = await connectToDatabase();
	const collection = db.collection<TTag>("etiquetas");

	const author: TTag["autor"] = { id: ctx.session.user.id, nome: ctx.session.user.nome, avatar_url: ctx.session.user.avatar_url };
	const insertedTagResponse = await collection.insertOne({ ...payload, autor: author });

	if (!insertedTagResponse.acknowledged) throw new createHttpError.InternalServerError("Oops, houve um erro desconhecido ao criar a tag.");
	return { insertedId: insertedTagResponse.insertedId.toString(), message: "Tag criada com sucesso." };
}

export type TCreateTagRouteOutput = Awaited<ReturnType<typeof createTag>>;
const createTagRoute: NextApiHandler<{ data: TCreateTagRouteOutput }> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const result = await createTag(req, { session });
	return res.status(200).json({ data: result });
};

/**
 * PUT
 */

export const UpdateTagSchema = TagSchema.partial();
export type TUpdateTagRouteInput = z.infer<typeof UpdateTagSchema>;
async function updateTag(req: NextApiRequest, ctx: { session: Session }) {
	const { id } = req.query;

	if (!id || typeof id !== "string" || !ObjectId.isValid(id)) throw new createHttpError.BadRequest("ID inválido.");

	const payload = TagSchema.partial().parse(req.body);

	const db: Db = await connectToDatabase();
	const collection = db.collection<TTag>("etiquetas");

	const updateResponse = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { ...payload } });
	if (!updateResponse.acknowledged) throw new createHttpError.InternalServerError("Oops, houve um erro desconhecido ao atualizar a tag.");

	if (updateResponse.matchedCount === 0) throw new createHttpError.NotFound("Tag não encontrada.");

	return { updatedId: id, message: "Tag atualizada com sucesso." };
}

export type TUpdateTagRouteOutput = Awaited<ReturnType<typeof updateTag>>;
const updateTagRoute: NextApiHandler<{ data: TUpdateTagRouteOutput }> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const result = await updateTag(req, { session });
	return res.status(200).json({ data: result });
};
export default apiHandler({
	GET: getTagsRoute,
	POST: createTagRoute,
	PUT: updateTagRoute,
});
