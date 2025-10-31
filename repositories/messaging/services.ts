import { ServiceSchema, type TService } from "@/utils/schemas/messaging/services";
import connectToDatabase from "@/utils/services/mongodb/projects";
import { ObjectId } from "mongodb";

const COLLECTION_NAME = "chats-services";

// MongoDB document type (includes _id)
export type TServiceDocument = TService & {
	_id: ObjectId;
	createdAt?: Date;
	updatedAt?: Date;
};

/**
 * Create a new service
 */
export async function createService(service: Omit<TService, "dataInicio" | "dataFim">): Promise<TServiceDocument> {
	const db = await connectToDatabase();
	const collection = db.collection<TServiceDocument>(COLLECTION_NAME);

	const now = new Date();
	const newService: Omit<TServiceDocument, "_id"> = {
		...service,
		dataInicio: now.toISOString(),
		dataFim: null,
		createdAt: now,
		updatedAt: now,
	};

	const result = await collection.insertOne(newService as any);
	return {
		...newService,
		_id: result.insertedId,
	} as TServiceDocument;
}

/**
 * Get a service by ID
 */
export async function getServiceById(serviceId: string): Promise<TServiceDocument | null> {
	const db = await connectToDatabase();
	const collection = db.collection<TServiceDocument>(COLLECTION_NAME);

	return await collection.findOne({
		_id: new ObjectId(serviceId),
	});
}

/**
 * Get active service for a chat (PENDENTE status)
 */
export async function getActiveChatService(chatId: string): Promise<TServiceDocument | null> {
	const db = await connectToDatabase();
	const collection = db.collection<TServiceDocument>(COLLECTION_NAME);

	return await collection.findOne({
		"chat.id": chatId,
		status: "PENDENTE",
	});
}

/**
 * Get all services for a chat
 */
export async function getChatServices(chatId: string): Promise<TServiceDocument[]> {
	const db = await connectToDatabase();
	const collection = db.collection<TServiceDocument>(COLLECTION_NAME);

	return await collection.find({ "chat.id": chatId }).sort({ dataInicio: -1 }).toArray();
}

/**
 * Get services by status
 */
export async function getServicesByStatus(status: TService["status"], limit?: number): Promise<TServiceDocument[]> {
	const db = await connectToDatabase();
	const collection = db.collection<TServiceDocument>(COLLECTION_NAME);

	let query = collection.find({ status }).sort({ dataInicio: -1 });

	if (limit) {
		query = query.limit(limit);
	}

	return await query.toArray();
}

/**
 * Get services by attendant
 */
export async function getServicesByAttendant(attendantId: string, status?: TService["status"]): Promise<TServiceDocument[]> {
	const db = await connectToDatabase();
	const collection = db.collection<TServiceDocument>(COLLECTION_NAME);

	const query: any = {
		"atendente.id": attendantId,
	};

	if (status) {
		query.status = status;
	}

	return await collection.find(query).sort({ dataInicio: -1 }).toArray();
}

/**
 * Update service
 */
export async function updateService(
	serviceId: string,
	update: Partial<Pick<TService, "status" | "descricao" | "atendente" | "tags" | "dataFim">>,
): Promise<boolean> {
	const db = await connectToDatabase();
	const collection = db.collection<TServiceDocument>(COLLECTION_NAME);

	// If status is being set to CONCLUÍDO or CANCELADO, set dataFim
	if (update.status && (update.status === "CONCLUÍDO" || update.status === "CANCELADO") && !update.dataFim) {
		update.dataFim = new Date().toISOString();
	}

	const result = await collection.updateOne(
		{ _id: new ObjectId(serviceId) },
		{
			$set: {
				...update,
				updatedAt: new Date(),
			},
		},
	);

	return result.modifiedCount > 0;
}

/**
 * Assign attendant to service
 */
export async function assignAttendantToService(serviceId: string, atendente: TService["atendente"]): Promise<boolean> {
	const db = await connectToDatabase();
	const collection = db.collection<TServiceDocument>(COLLECTION_NAME);

	const result = await collection.updateOne(
		{ _id: new ObjectId(serviceId) },
		{
			$set: {
				atendente,
				status: "EM ANDAMENTO",
				updatedAt: new Date(),
			},
		},
	);

	return result.modifiedCount > 0;
}

/**
 * Complete service
 */
export async function completeService(serviceId: string): Promise<boolean> {
	const db = await connectToDatabase();
	const collection = db.collection<TServiceDocument>(COLLECTION_NAME);

	const now = new Date();
	const result = await collection.updateOne(
		{ _id: new ObjectId(serviceId) },
		{
			$set: {
				status: "CONCLUÍDO",
				dataFim: now.toISOString(),
				updatedAt: now,
			},
		},
	);

	return result.modifiedCount > 0;
}

/**
 * Cancel service
 */
export async function cancelService(serviceId: string): Promise<boolean> {
	const db = await connectToDatabase();
	const collection = db.collection<TServiceDocument>(COLLECTION_NAME);

	const now = new Date();
	const result = await collection.updateOne(
		{ _id: new ObjectId(serviceId) },
		{
			$set: {
				status: "CANCELADO",
				dataFim: now.toISOString(),
				updatedAt: now,
			},
		},
	);

	return result.modifiedCount > 0;
}

/**
 * Get or create service for chat
 * If there's an active service, return it. Otherwise, create a new one.
 */
export async function getOrCreateChatService(
	chatId: string,
	cliente: TService["cliente"],
	atendente: TService["atendente"],
	descricao = "Atendimento padrão",
): Promise<TServiceDocument> {
	const db = await connectToDatabase();
	const collection = db.collection<TServiceDocument>(COLLECTION_NAME);

	// Try to find active service
	const existingService = await collection.findOne({
		"chat.id": chatId,
		status: "PENDENTE",
	});

	if (existingService) {
		return existingService;
	}

	// Create new service
	const now = new Date();
	const newService: Omit<TServiceDocument, "_id"> = {
		chat: { id: chatId },
		cliente,
		atendente,
		status: "PENDENTE",
		descricao,
		tags: [],
		dataInicio: now.toISOString(),
		dataFim: null,
		createdAt: now,
		updatedAt: now,
	};

	const result = await collection.insertOne(newService as any);
	return {
		...newService,
		_id: result.insertedId,
	} as TServiceDocument;
}

/**
 * Create indexes for the collection
 */
export async function createServiceIndexes(): Promise<void> {
	const db = await connectToDatabase();
	const collection = db.collection<TServiceDocument>(COLLECTION_NAME);

	await collection.createIndexes([
		{ key: { "chat.id": 1 } },
		{ key: { status: 1 } },
		{ key: { "atendente.id": 1 } },
		{ key: { "cliente.id": 1 } },
		{ key: { dataInicio: -1 } },
	]);
}
