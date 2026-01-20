import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import {
	InsertPropertySchema,
	PropertyMetadataVehicleSchema,
	type TProperty,
	type TPropertyTemporaryUsage,
	type TPropertyTemporaryUsageDTO,
} from "@/utils/schemas/properties";
import connectToAdministrationDatabase from "@/utils/services/mongodb/administration";
import createHttpError from "http-errors";
import { type Collection, type Filter, ObjectId } from "mongodb";
import type { NextApiHandler } from "next";
import { z } from "zod";

const PropertiesQueryParamsInputSchema = z.object({
	// general properties filter
	includeOpenUsages: z
		.string({ invalid_type_error: "Tipo não válido para o includeOpenUsages." })
		.optional()
		.nullable()
		.transform((val) => val === "true"),
	// singular property filter
	id: z.string({ invalid_type_error: "Tipo não válido para o ID." }).optional().nullable(),
	// multiple properties filter
	search: z.string({ invalid_type_error: "Tipo não válido para o search." }).optional().nullable(),
	status: z.enum(["all", "active-only", "inactive-only"]).optional().nullable(),
	metadataTypes: z
		.string({ invalid_type_error: "Tipo não válido para o metadataType." })
		.optional()
		.nullable()
		.transform((val) => z.array(PropertyMetadataVehicleSchema.shape.tipo).parse(val ? val.split(",") : [])),
});
export type TPropertiesQueryParamsInput = z.infer<typeof PropertiesQueryParamsInputSchema>;
const getProperties = async ({ id, includeOpenUsages, search, metadataTypes, status }: TPropertiesQueryParamsInput) => {
	const db = await connectToAdministrationDatabase();
	const propertiesCollection: Collection<TProperty> = db.collection("propriedades");
	const temporaryUsagesCollection: Collection<TPropertyTemporaryUsage> = db.collection("propriedades-uso-temporario");
	if (id) {
		if (typeof id !== "string" || !ObjectId.isValid(id)) throw new createHttpError.BadRequest("ID inválido.");
		const property = await propertiesCollection.findOne({ _id: new ObjectId(id) });
		if (!property) throw new createHttpError.NotFound("Propriedade não encontrada.");
		let openUsages: Array<TPropertyTemporaryUsage & { _id: string }> | undefined = undefined;
		if (includeOpenUsages) {
			const openUsagesRaw = await temporaryUsagesCollection.find({ "propriedade.id": id, dataFim: null }).toArray();
			openUsages = openUsagesRaw.map((usage) => ({ ...usage, _id: (usage as any)._id.toString() }));
		}
		return {
			data: {
				default: undefined,
				byId: { ...property, _id: property._id.toString(), ...(includeOpenUsages ? { usosTemporarios: openUsages || [] } : {}) },
			},
		};
	}

	const searchQuery: Filter<TProperty> = search
		? {
				$or: [
					{
						$or: [{ nome: { $regex: search, $options: "i" } }, { nome: search }],
					},
					{
						$or: [{ identificador: { $regex: search, $options: "i" } }, { identificador: search }],
					},
				],
			}
		: {};

	const metadataTypesQuery: Filter<TProperty> = { "metadados.tipo": { $in: metadataTypes } };

	const statusQuery: Filter<TProperty> = status === "active-only" ? { ativo: true } : status === "inactive-only" ? { ativo: false } : {};
	const query: Filter<TProperty> = { ...searchQuery, ...metadataTypesQuery, ...statusQuery };
	const properties = await propertiesCollection.find(query).toArray();

	let openUsagesByPropertyId: Map<string, Array<TPropertyTemporaryUsageDTO>> | undefined = undefined;
	if (includeOpenUsages && properties.length > 0) {
		const propertyIds = properties.map((p) => p._id.toString());
		const openUsagesFoundProperties = await temporaryUsagesCollection.find({ dataFim: null, "propriedade.id": { $in: propertyIds } }).toArray();
		openUsagesByPropertyId = new Map(
			properties.map((p) => {
				const equivalentUsages = openUsagesFoundProperties
					.filter((u) => u.propriedade.id === p._id.toString())
					.map((u) => ({ ...u, _id: u._id.toString() }));
				return [p._id.toString(), equivalentUsages];
			}),
		);
	}

	return {
		data: {
			default: properties.map((property) => ({
				...property,
				_id: property._id.toString(),
				...(includeOpenUsages && openUsagesByPropertyId ? { usosTemporarios: openUsagesByPropertyId.get(property._id.toString()) || [] } : {}),
			})),
			byId: undefined,
		},
	};
};
export type TGetPropertiesOutput = Awaited<ReturnType<typeof getProperties>>;
export type TGetPropertyByIdOutput = Exclude<Awaited<ReturnType<typeof getProperties>>["data"]["byId"], undefined>;
export type TGetPropertiesDefaultOutput = Exclude<Awaited<ReturnType<typeof getProperties>>["data"]["default"], undefined>;

const getPropertiesHandler: NextApiHandler<TGetPropertiesOutput> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const queryParams = PropertiesQueryParamsInputSchema.parse(req.query);
	const properties = await getProperties(queryParams);
	return res.status(200).json(properties);
};

type PostResponse = {
	data: { insertedId: string };
	message: string;
};
const createProperty: NextApiHandler<PostResponse> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);

	if (!session.user.permissoes.recursosHumanos.editar) throw new createHttpError.BadRequest("Usuário não autorizado a cadastrar propriedades.");

	console.log("[INFO] Creating property: ", {
		user: {
			id: session.user.id,
			nome: session.user.nome,
		},
		body: req.body,
	});
	const property = InsertPropertySchema.parse(req.body);

	const db = await connectToAdministrationDatabase();
	const propertiesCollection: Collection<TProperty> = db.collection("propriedades");

	const insertResponse = await propertiesCollection.insertOne(property);

	if (!insertResponse.acknowledged) throw new createHttpError.InternalServerError("Oops, houve um erro desconhecido ao cadastrar propriedade.");

	const insertedId = insertResponse.insertedId.toString();

	console.log("[INFO] Property created: ", {
		insertedId,
	});
	return res.status(201).json({ data: { insertedId }, message: "Propriedade cadastrada com sucesso !." });
};

type PutResponse = {
	data: string;
	message: string;
};

const updateProperty: NextApiHandler<PutResponse> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);

	if (!session.user.permissoes.recursosHumanos.editar) throw new createHttpError.BadRequest("Usuário não autorizado a editar propriedades.");

	const { id } = req.query;
	if (!id || typeof id !== "string" || !ObjectId.isValid(id)) throw new createHttpError.BadRequest("ID inválido.");
	const changes = InsertPropertySchema.partial().parse(req.body);

	const db = await connectToAdministrationDatabase();
	const propertiesCollection: Collection<TProperty> = db.collection("propriedades");

	const updateResponse = await propertiesCollection.updateOne({ _id: new ObjectId(id) }, { $set: changes });

	if (!updateResponse.acknowledged) throw new createHttpError.InternalServerError("Oops, houve um erro desconhecido ao atualizar propriedade.");
	if (updateResponse.matchedCount === 0) throw new createHttpError.InternalServerError("Nenhuma propriedade encontrada para atualização.");

	return res.status(200).json({ data: "Propriedade atualizada com sucesso !", message: "Propriedade atualizada com sucesso !" });
};

export default apiHandler({
	GET: getPropertiesHandler,
	POST: createProperty,
	PUT: updateProperty,
});
