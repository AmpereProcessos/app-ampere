import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import { InsertPropertySchema, type TProperty, type TPropertyTemporaryUsage } from "@/utils/schemas/properties";
import connectToAdministrationDatabase from "@/utils/services/mongodb/administration";
import createHttpError from "http-errors";
import { type Collection, ObjectId } from "mongodb";
import type { NextApiHandler } from "next";

const getProperties = async ({ id, includeOpenUsages }: { id: string | undefined; includeOpenUsages?: boolean }) => {
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

	const properties = await propertiesCollection.find({}).toArray();
	let openUsagesByPropertyId: Record<string, Array<TPropertyTemporaryUsage & { _id: string }>> = {};
	if (includeOpenUsages && properties.length > 0) {
		const propertyIds = properties.map((p) => p._id.toString());
		const openUsagesRaw = await temporaryUsagesCollection.find({ dataFim: null, "propriedade.id": { $in: propertyIds } }).toArray();
		openUsagesByPropertyId = openUsagesRaw.reduce<Record<string, Array<TPropertyTemporaryUsage & { _id: string }>>>((acc, usage) => {
			const propId = usage.propriedade.id;
			if (!acc[propId]) acc[propId] = [];
			acc[propId].push({ ...usage, _id: (usage as any)._id.toString() });
			return acc;
		}, {});
	}

	return {
		data: {
			default: properties.map((property) => ({
				...property,
				_id: property._id.toString(),
				...(includeOpenUsages ? { usosTemporarios: openUsagesByPropertyId[property._id.toString()] || [] } : {}),
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
	const { id, includeOpenUsages } = req.query;
	const properties = await getProperties({ id: id as string | undefined, includeOpenUsages: includeOpenUsages === "true" });
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
