import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import type { TMaterialUpdateRegistry } from "@/utils/schemas/material-updates-registry";
import { InsertMaterialSchema, type TMaterial } from "@/utils/schemas/materials";
import clientPromise from "@/utils/services/mongodb/mongo-client";
import connectToDatabase from "@/utils/services/mongodb/warehouse";
import createHttpError from "http-errors";
import { type Collection, type Db, ObjectId } from "mongodb";
import type { NextApiHandler } from "next";
import { z } from "zod";

type GetResponse = {
	data: TMaterial | TMaterial[];
};

const getMaterials: NextApiHandler<GetResponse> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const { id } = req.query;

	const db: Db = await connectToDatabase();
	const collection: Collection<TMaterial> = db.collection("material");
	if (id) {
		if (typeof id !== "string" || !ObjectId.isValid(id)) throw new createHttpError.BadRequest("ID inválido.");

		const material = await collection.findOne({ _id: new ObjectId(id), dataExclusao: null });
		if (!material) throw new createHttpError.NotFound("Material não encontrado.");
		return res.status(200).json({ data: material });
	}

	const materials = await collection.find({ dataExclusao: null }, { sort: { nome: 1 } }).toArray();
	return res.status(200).json({ data: materials });
};

type PostResponse = {
	data: {
		insertedId: string;
	};
	message: string;
};
const createMaterial: NextApiHandler<PostResponse> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);

	const material = InsertMaterialSchema.parse(req.body);

	const db: Db = await connectToDatabase();
	const collection: Collection<TMaterial> = db.collection("material");
	const insertResponse = await collection.insertOne(material);

	if (!insertResponse.acknowledged) throw new createHttpError.InternalServerError("Oops, houve um erro ao inserir o material.");
	const insertedId = insertResponse.insertedId.toString();
	return res.status(201).json({ data: { insertedId }, message: "Material criado com sucesso !" });
};
type PutResponse = {
	data: string;
	message: string;
};

const updateMaterial: NextApiHandler<PutResponse> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const author = { id: session.user.id, nome: session.user.nome, avatar_url: session.user.avatar_url };
	const { id } = req.query;
	if (!id || typeof id !== "string" || !ObjectId.isValid(id)) throw new createHttpError.BadRequest("ID inválido ou não fornecido.");

	const changes = InsertMaterialSchema.partial().parse(req.body);

	const db: Db = await connectToDatabase();
	const collection: Collection<TMaterial> = db.collection("material");
	const logCollection: Collection<TMaterialUpdateRegistry> = db.collection("alteracoes");

	const material = await collection.findOne({ _id: new ObjectId(id) });

	const updateResponse = await collection.updateOne(
		{ _id: new ObjectId(id) },
		{ $set: { ...changes, alteracao: { ...author, dataAlteracao: new Date().toISOString() } } },
	);
	const hasChangedQty = !!changes.qtde && changes.qtde !== material?.qtde;
	const hasChangedPrice = !!changes.preco && changes.preco !== material?.preco;
	if (changes.qtde) if (!updateResponse.acknowledged) throw new createHttpError.InternalServerError("Oops, houve um erro ao atualizar material.");
	if (!updateResponse.matchedCount) throw new createHttpError.NotFound("Material não encontrado.");

	if (hasChangedQty || hasChangedPrice) {
		const newQty = changes.qtde || 0;
		const currentQty = material?.qtde || 0;
		const newPrice = changes.preco || null;
		const currentPrice = material?.preco || null;
		const difference = newQty - currentQty;
		const log: TMaterialUpdateRegistry = {
			alteracao: difference,
			tipo: "ALTERAÇÃO MANUAL",
			idFormulario: null,
			material: {
				id: id,
				nome: material?.nome || "",
			},
			projeto: {
				id: null,
				nome: null,
			},
			qtdeAnterior: hasChangedQty ? currentQty : null,
			qtdeNovo: hasChangedQty ? newQty : null,
			precoAnterior: hasChangedPrice ? currentPrice : null,
			precoNovo: hasChangedPrice ? newPrice : null,
			autor: author,
			dataInsercao: new Date().toISOString(),
		};
		const logResponse = await logCollection.insertOne(log);
		console.log(logResponse);
	}
	return res.status(201).json({ data: "Material atualizado com sucesso !", message: "Material atualizado com sucesso !" });
};

type PatchResponse = {
	data: string;
	message: string;
};

const MaterialEntranceInputSchema = z.object({
	idNF: z.string({
		required_error: "O ID da nota fiscal é obrigatório.",
		invalid_type_error: "O ID da nota fiscal deve ser uma string.",
	}),
	destinatario: z.object({
		nome: z
			.string({
				invalid_type_error: "Tipo não válido para o nome do destinatário.",
			})
			.optional(),
		cpfCnpj: z
			.string({
				invalid_type_error: "Tipo não válido para o CNPJ do destinatário.",
			})
			.optional(),
		localizacao: z.object({
			cep: z
				.string({
					invalid_type_error: "Tipo não válido para o CEP do destinatário.",
				})
				.optional()
				.nullable(),
			uf: z
				.string({
					invalid_type_error: "Tipo não válido para a UF do destinatário.",
				})
				.optional()
				.nullable(),
			cidade: z
				.string({
					invalid_type_error: "Tipo não válido para a cidade do destinatário.",
				})
				.optional()
				.nullable(),
			bairro: z
				.string({
					invalid_type_error: "Tipo não válido para o bairro do destinatário.",
				})
				.optional()
				.nullable(),
			endereco: z
				.string({
					invalid_type_error: "Tipo não válido para o endereço do destinatário.",
				})
				.optional(),
			numeroOuIdentificador: z
				.string({
					invalid_type_error: "Tipo não válido para o número ou identificador do destinatário.",
				})
				.optional(),
		}),
	}),
	emissor: z.object({
		nome: z
			.string({
				invalid_type_error: "Tipo não válido para o nome do emissor.",
			})
			.optional(),
		cpfCnpj: z
			.string({
				invalid_type_error: "Tipo não válido para o CNPJ do emissor.",
			})
			.optional(),
		localizacao: z.object({
			cep: z
				.string({
					invalid_type_error: "Tipo não válido para o CEP do emissor.",
				})
				.optional()
				.nullable(),
			uf: z
				.string({
					invalid_type_error: "Tipo não válido para a UF do emissor.",
				})
				.optional()
				.nullable(),
			cidade: z
				.string({
					invalid_type_error: "Tipo não válido para a cidade do emissor.",
				})
				.optional()
				.nullable(),
			bairro: z
				.string({
					invalid_type_error: "Tipo não válido para o bairro do emissor.",
				})
				.optional()
				.nullable(),
			endereco: z
				.string({
					invalid_type_error: "Tipo não válido para o endereço do emissor.",
				})
				.optional(),
			numeroOuIdentificador: z
				.string({
					invalid_type_error: "Tipo não válido para o número ou identificador do emissor.",
				})
				.optional(),
		}),
	}),
	itens: z.array(
		z.object({
			index: z.string({
				required_error: "Index do item não informado.",
				invalid_type_error: "Tipo não válido para o Index do item.",
			}),
			ncm: z
				.string({
					invalid_type_error: "Tipo não válido para o NCM.",
				})
				.optional()
				.nullable(),
			nome: z.string({
				required_error: "Nome do item não informado.",
				invalid_type_error: "Tipo não válido para o nome do item.",
			}),
			quantidade: z.number({
				required_error: "Quantidade do item não informada.",
				invalid_type_error: "Tipo não válido para a quantidade do item.",
			}),
			unidade: z.string({
				required_error: "Unidade do item não informada.",
				invalid_type_error: "Tipo não válido para unidade do item.",
			}),
			valorUnitario: z.number({
				required_error: "Valor unitário do item não informado.",
				invalid_type_error: "Tipo não válido para valor unitário do item.",
			}),
			valorTotal: z.number({
				required_error: "Valor total do item não informado.",
				invalid_type_error: "Tipo não válido para valor total do item.",
			}),
			material: z
				.object({
					id: z.string({
						required_error: "ID do material vinculado não informado.",
						invalid_type_error: "Tipo não válido para o ID do material informado.",
					}),
					nome: z.string({
						required_error: "Nome do material não informado.",
						invalid_type_error: "Tipo não válido para o nome do material.",
					}),
					unidade: z.string({
						required_error: "Unidade do material não informada.",
						invalid_type_error: "Tipo não válido para a unidade do material.",
					}),
					quantidadeAtual: z.number({
						required_error: "Quantidade atual do material não informada.",
						invalid_type_error: "Tipo não válido para a quantidade atual do material.",
					}),
					valorUnitarioAtual: z.number({
						required_error: "Valor unitário atual do material não informado.",
						invalid_type_error: "Tipo não válido para o valor unitário atual do material.",
					}),
				})
				.optional()
				.nullable(),
		}),
		{
			required_error: "Lista de itens não informada.",
			invalid_type_error: "Tipo não válido para lista de itens.",
		},
	),
	valorTotal: z.number({
		required_error: "Valor total da nota não informado.",
		invalid_type_error: "Tipo não válido para o valor total da nota.",
	}),
});
export type TMaterialEntranceInput = z.infer<typeof MaterialEntranceInputSchema>;
const inputMaterial: NextApiHandler<PatchResponse> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const author = { id: session.user.id, nome: session.user.nome, avatar_url: session.user.avatar_url };

	const payload = MaterialEntranceInputSchema.parse(req.body);
	console.log("GOT CALLED", payload);
	const dbClient = await clientPromise;
	const materialsDb: Db = dbClient.db("almoxarifado");
	const materialEntrancesCollection = materialsDb.collection("entradas-material");
	const materialsCollection: Collection<TMaterial> = materialsDb.collection("material");
	const logsCollection: Collection<TMaterialUpdateRegistry> = materialsDb.collection("alteracoes");

	const dbSession = dbClient.startSession();

	try {
		await dbSession.withTransaction(async () => {
			await materialEntrancesCollection.insertOne(payload, { session: dbSession });

			const vinculatableMaterialIds = payload.itens
				.map((item) => item.material?.id)
				.filter(Boolean)
				.map((id) => new ObjectId(id));
			const materials = await materialsCollection.find({ _id: { $in: vinculatableMaterialIds } }, { session: dbSession }).toArray();

			for (const item of payload.itens) {
				const existingMaterial = materials.find((mat) => mat._id.toString() === item.material?.id);

				if (existingMaterial) {
					const newQty = existingMaterial.qtde + item.quantidade;
					const newPrice =
						(existingMaterial.qtde * existingMaterial.preco + item.quantidade * item.valorUnitario) / (existingMaterial.qtde + item.quantidade);
					const diff = item.quantidade;

					const updateMaterialResponse = await materialsCollection.updateOne(
						{
							_id: existingMaterial._id,
						},
						{
							$inc: { qtde: diff },
							$set: { preco: newPrice },
						},
						{
							session: dbSession,
						},
					);
					console.log("UPDATE MATERIAL RESPONSE", updateMaterialResponse);
					await logsCollection.insertOne(
						{
							alteracao: diff,
							tipo: "ENTRADA",
							idFormulario: payload.idNF,
							material: {
								id: existingMaterial._id.toString(),
								nome: existingMaterial.nome,
							},
							projeto: {
								id: null,
								nome: null,
							},
							qtdeAnterior: existingMaterial.qtde,
							qtdeNovo: newQty,
							precoAnterior: existingMaterial.preco,
							precoNovo: newPrice,
							autor: author,
							dataInsercao: new Date().toISOString(),
						},
						{
							session: dbSession,
						},
					);
				} else {
					const insertMaterialResponse = await materialsCollection.insertOne(
						{
							nome: item.nome,
							qtde: item.quantidade,
							preco: item.valorUnitario,
							grandeza: item.unidade,
							dataInsercao: new Date().toISOString(),
						},
						{
							session: dbSession,
						},
					);
					if (!insertMaterialResponse.acknowledged) throw new createHttpError.InternalServerError(`Erro ao criar o material ${item.nome}.`);
					const insertedMaterialId = insertMaterialResponse.insertedId.toString();

					await logsCollection.insertOne(
						{
							alteracao: item.quantidade,
							tipo: "ENTRADA",
							material: {
								id: insertedMaterialId,
								nome: item.nome,
							},
							projeto: {
								id: null,
								nome: null,
							},
							qtdeAnterior: 0,
							qtdeNovo: item.quantidade,
							precoAnterior: 0,
							precoNovo: item.valorUnitario,
							autor: author,
							dataInsercao: new Date().toISOString(),
						},
						{
							session: dbSession,
						},
					);
				}
			}
		});
	} catch (error) {
		console.log("Erro ao realizar entrada de materiais.", error);
		throw error;
	}

	return res.status(201).json({ data: "Entrada de material feita com sucesso !", message: "Entrada de material feita com sucesso !" });
};
export default apiHandler({ GET: getMaterials, POST: createMaterial, PUT: updateMaterial, PATCH: inputMaterial });
