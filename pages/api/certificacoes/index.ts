import type { TAuthSession } from "@/lib/authentication/types";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import { CertificationReferenceSchema, CertificationSchema, type TCertification, type TCertificationReference } from "@/utils/schemas/certifications";
import type { TFileReference } from "@/utils/schemas/crm/file-reference.schema";
import connectToAdministrationDatabase from "@/utils/services/mongodb/administration";
import connectToCRMDatabase from "@/utils/services/mongodb/crm/main";
import createHttpError from "http-errors";
import { type Collection, type Filter, ObjectId } from "mongodb";
import type { NextApiHandler } from "next";
import z from "zod";

const GetCertificationsInputSchema = z.object({
	search: z
		.string({
			invalid_type_error: "Tipo não válido para filtro de pesquisa.",
		})
		.optional()
		.nullable(),
	id: z
		.string({
			invalid_type_error: "Tipo não válido para ID.",
		})
		.optional()
		.nullable(),
});
export type TGetCertificationsInput = z.infer<typeof GetCertificationsInputSchema>;

async function getCertifications({ session, input }: { session: TAuthSession; input: TGetCertificationsInput }) {
	const { search, id } = input;

	const db = await connectToAdministrationDatabase();
	const certificationsCollection = db.collection<TCertification>("certificacoes");
	const certificationReferencesCollection = db.collection<TCertificationReference>("certificacoes-referencias");
	if (id) {
		if (!ObjectId.isValid(id)) throw new createHttpError.BadRequest("ID inválido.");

		const certification = await certificationsCollection.findOne({ _id: new ObjectId(id) });
		if (!certification) throw new createHttpError.NotFound("Certificação não encontrada.");
		const certificationReferences = await certificationReferencesCollection.find({ "certificacao.id": id }).toArray();
		return {
			data: {
				default: undefined,
				byId: {
					...certification,
					_id: certification._id.toString(),
					referencias: certificationReferences.map((c) => ({ ...c, _id: c._id.toString() })),
				},
			},
		};
	}

	const searchQuery: Filter<TCertification> =
		search && search.trim().length > 0 ? { $or: [{ titulo: { $regex: search, $options: "i" } }, { titulo: search }] } : {};

	const query: Filter<TCertification> = { ...searchQuery };
	const certifications = await certificationsCollection.find(query).toArray();
	const certificationsIds = certifications.map((c) => c._id.toString());
	const certificationReferences = await certificationReferencesCollection.find({ "certificacao.id": { $in: certificationsIds } }).toArray();

	const enrichedCertifications = certifications.map((c) => ({
		...c,
		_id: c._id.toString(),
		referencias: certificationReferences.filter((cr) => cr.certificacao.id === c._id.toString()).map((cr) => ({ ...cr, _id: cr._id.toString() })),
	}));
	return {
		data: {
			default: enrichedCertifications,
			byId: undefined,
		},
	};
}

export type TGetCertificationsOutput = Awaited<ReturnType<typeof getCertifications>>;
export type TGetCertificationsOutputById = Exclude<Awaited<ReturnType<typeof getCertifications>>["data"]["byId"], undefined>;
export type TGetCertificationsOutputDefault = Exclude<Awaited<ReturnType<typeof getCertifications>>["data"]["default"], undefined>;

const getCertificationsHandler: NextApiHandler<TGetCertificationsOutput> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const input = GetCertificationsInputSchema.parse(req.query);
	const result = await getCertifications({ session, input });
	res.status(200).json(result);
};

const CreateCertificationInputSchema = z.object({
	certification: CertificationSchema.omit({
		autor: true,
		dataInsercao: true,
	}),
	references: z.array(
		CertificationReferenceSchema.omit({
			certificacao: true,
		}).extend({
			documento: CertificationReferenceSchema.shape.documento.partial({
				id: true,
			}),
		}),
	),
});
export type TCreateCertificationInput = z.infer<typeof CreateCertificationInputSchema>;

async function createCertification({ session, input }: { session: TAuthSession; input: TCreateCertificationInput }) {
	const { certification, references } = input;

	const crmDb = await connectToCRMDatabase();
	const fileReferencesCollection = crmDb.collection<TFileReference>("file-references");
	const db = await connectToAdministrationDatabase();
	const certificationsCollection = db.collection<TCertification>("certificacoes");
	const certificationReferencesCollection = db.collection<TCertificationReference>("certificacoes-referencias");

	const insertedCertificationResponse = await certificationsCollection.insertOne({
		...certification,
		autor: {
			id: session.user.id,
			nome: session.user.nome,
			avatar_url: session.user.avatar_url,
		},
		dataInsercao: new Date().toISOString(),
	});

	if (!insertedCertificationResponse.acknowledged) throw new createHttpError.InternalServerError("Oops, houve um erro ao criar a certificação.");
	const insertedCertificationId = insertedCertificationResponse.insertedId.toString();

	const insertedCertificationReferencesIds = await Promise.all(
		references.map(async (r) => {
			let documentId = r.documento.id;
			// In case there is no document id, we gotta create the file reference for it
			if (!documentId) {
				documentId = await insertFileReferenceForDocumentHelper({ session, document: r.documento });
			}

			const insertedCertificationReferenceResponse = await certificationReferencesCollection.insertOne({
				...r,
				certificacao: {
					id: insertedCertificationId,
					titulo: certification.titulo,
				},
				documento: {
					id: documentId,
					titulo: r.documento.titulo,
					formato: r.documento.formato,
					url: r.documento.url,
				},
			});
			if (!insertedCertificationReferenceResponse.acknowledged)
				throw new createHttpError.InternalServerError("Oops, houve um erro ao criar a referência da certificação.");
			return insertedCertificationReferenceResponse.insertedId.toString();
		}),
	);

	return {
		data: {
			insertedCertificationId,
			insertedCertificationReferencesIds,
		},
		message: "Certificação criada com sucesso.",
	};
}
export type TCreateCertificationOutput = Awaited<ReturnType<typeof createCertification>>;

const createCertificationHandler: NextApiHandler<TCreateCertificationOutput> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const input = CreateCertificationInputSchema.parse(req.body);
	const result = await createCertification({ session, input });
	res.status(200).json(result);
};

const UpdateCertificationInputSchema = z.object({
	certificationId: z.string({
		invalid_type_error: "Tipo não válido para ID da certificação.",
		required_error: "ID da certificação não informado.",
	}),
	certification: CertificationSchema.omit({
		autor: true,
		dataInsercao: true,
	}),
	references: z.array(
		CertificationReferenceSchema.omit({
			certificacao: true,
		}).extend({
			documento: CertificationReferenceSchema.shape.documento.partial({
				id: true,
			}),
			_id: z
				.string({
					invalid_type_error: "Tipo não válido para ID da referência da certificação.",
					required_error: "ID da referência da certificação não informado.",
				})
				.optional()
				.nullable(),
			deletar: z
				.boolean({
					required_error: "Deletar a referência da certificação não informado.",
					invalid_type_error: "Tipo não válido para a deletar a referência da certificação.",
				})
				.optional()
				.nullable(),
		}),
	),
});

export type TUpdateCertificationInput = z.infer<typeof UpdateCertificationInputSchema>;

async function updateCertification({ session, input }: { session: TAuthSession; input: TUpdateCertificationInput }) {
	const { certificationId, certification, references } = input;

	const db = await connectToAdministrationDatabase();
	const certificationsCollection = db.collection<TCertification>("certificacoes");
	const certificationReferencesCollection = db.collection<TCertificationReference>("certificacoes-referencias");

	await certificationsCollection.updateOne({ _id: new ObjectId(certificationId) }, { $set: { ...certification } });

	await Promise.all(
		references.map(async (r) => {
			if (r._id && r.deletar) {
				// Existing to delete
				return await certificationReferencesCollection.deleteOne({ _id: new ObjectId(r._id) });
			}
			if (r._id && !r.deletar) {
				// Existing to update
				let documentId = r.documento.id;
				if (!documentId) {
					// In case there is no document id, we gotta create the file reference for it
					documentId = await insertFileReferenceForDocumentHelper({ session, document: r.documento });
				}
				const certificationReference = CertificationReferenceSchema.parse({
					...r,
					certificacao: { id: certificationId, titulo: certification.titulo },
					documento: { id: documentId, ...r.documento },
				});
				return await certificationReferencesCollection.updateOne({ _id: new ObjectId(r._id) }, { $set: certificationReference });
			}
			let documentId = r.documento.id;
			if (!documentId) {
				// In case there is no document id, we gotta create the file reference for it
				documentId = await insertFileReferenceForDocumentHelper({ session, document: r.documento });
			}
			// New to create
			const certificationReference = CertificationReferenceSchema.parse({
				...r,
				certificacao: { id: certificationId, titulo: certification.titulo },
				documento: { id: documentId, ...r.documento },
			});
			return await certificationReferencesCollection.insertOne(certificationReference);
		}),
	);

	return {
		data: {
			updatedCertificationId: certificationId,
			updatedCertificationReferencesIds: references.map((r) => r._id),
		},
		message: "Certificação atualizada com sucesso.",
	};
}
export type TUpdateCertificationOutput = Awaited<ReturnType<typeof updateCertification>>;

const updateCertificationHandler: NextApiHandler<TUpdateCertificationOutput> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const input = UpdateCertificationInputSchema.parse(req.body);
	const result = await updateCertification({ session, input });
	res.status(200).json(result);
};

export default apiHandler({
	GET: getCertificationsHandler,
	POST: createCertificationHandler,
	PUT: updateCertificationHandler,
});

async function insertFileReferenceForDocumentHelper({
	session,
	document,
}: { session: TAuthSession; document: Omit<TCertificationReference["documento"], "id"> }) {
	const crmDb = await connectToCRMDatabase();
	const fileReferencesCollection = crmDb.collection<TFileReference>("file-references");

	const insertedFileReferenceResponse = await fileReferencesCollection.insertOne({
		...document,
		autor: {
			id: session.user.id,
			nome: session.user.nome,
			avatar_url: session.user.avatar_url,
		},
		dataInsercao: new Date().toISOString(),
		idParceiro: "65454ba15cf3e3ecf534b308",
	});
	if (!insertedFileReferenceResponse.acknowledged)
		throw new createHttpError.InternalServerError("Oops, houve um erro ao criar a referência do arquivo.");
	return insertedFileReferenceResponse.insertedId.toString();
}
