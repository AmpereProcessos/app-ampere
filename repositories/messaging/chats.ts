import { ChatSchema, type TChat } from "@/utils/schemas/messaging/chats";
import connectToDatabase from "@/utils/services/mongodb/projects";
import { ObjectId } from "mongodb";
import { z } from "zod";

const COLLECTION_NAME = "chats";

// MongoDB document type (includes _id)
export type TChatDocument = TChat & {
	_id: ObjectId;
	orgId: string;
	createdAt?: Date;
	updatedAt?: Date;
};

// Pagination options
export type TPaginationOptions = {
	cursor?: string | null;
	limit?: number;
};

// Pagination result
export type TPaginatedResult<T> = {
	items: T[];
	hasMore: boolean;
	nextCursor: string | null;
};

// Cursor encoding/decoding
function encodeCursor(date: string, id: string): string {
	return Buffer.from(JSON.stringify({ date, id })).toString("base64");
}

function decodeCursor(cursor: string): { date: string; id: string } {
	return JSON.parse(Buffer.from(cursor, "base64").toString("utf-8"));
}

/**
 * Get paginated chats with optional search
 */
export async function getChats(
	orgId: string,
	whatsappPhoneNumberId: string,
	options: TPaginationOptions & { searchQuery?: string } = {},
): Promise<TPaginatedResult<TChatDocument>> {
	const db = await connectToDatabase();
	const collection = db.collection<TChatDocument>(COLLECTION_NAME);

	const limit = options.limit ?? 20;
	const query: any = {
		orgId,
		whatsappTelefoneId: whatsappPhoneNumberId,
	};

	// Apply search if provided
	if (options.searchQuery && options.searchQuery.trim().length > 0) {
		const searchRegex = { $regex: options.searchQuery, $options: "i" };
		query.$or = [
			{ "cliente.nome": searchRegex },
			{ "ultimaMensagemCliente.conteudoTexto": searchRegex },
			{ "ultimaMensagemAtendente.conteudoTexto": searchRegex },
		];
	}

	// Apply cursor pagination
	if (options.cursor) {
		const { date, id } = decodeCursor(options.cursor);
		const cursorCondition = [
			{ "ultimaMensagemCliente.data": { $lt: date } },
			{
				"ultimaMensagemCliente.data": date,
				_id: { $lt: new ObjectId(id) },
			},
		];

		if (query.$or) {
			query.$and = [{ $or: query.$or }, { $or: cursorCondition }];
			delete query.$or;
		} else {
			query.$or = cursorCondition;
		}
	}

	// Fetch one extra to check if there are more results
	const chats = await collection
		.find(query)
		.sort({ "ultimaMensagemCliente.data": -1, _id: -1 })
		.limit(limit + 1)
		.toArray();

	const hasMore = chats.length > limit;
	const items = hasMore ? chats.slice(0, limit) : chats;

	let nextCursor: string | null = null;
	if (hasMore && items.length > 0) {
		const lastItem = items[items.length - 1];
		nextCursor = encodeCursor(lastItem.ultimaMensagemCliente?.data ?? new Date().toISOString(), lastItem._id.toString());
	}

	return {
		items,
		hasMore,
		nextCursor,
	};
}

/**
 * Get a single chat by ID
 */
export async function getChatById(chatId: string, orgId: string): Promise<TChatDocument | null> {
	const db = await connectToDatabase();
	const collection = db.collection<TChatDocument>(COLLECTION_NAME);

	return await collection.findOne({
		_id: new ObjectId(chatId),
		orgId,
	});
}

/**
 * Get or create chat by client ID
 */
export async function getOrCreateChatByClient(orgId: string, whatsappPhoneNumberId: string, cliente: TChat["cliente"]): Promise<TChatDocument> {
	const db = await connectToDatabase();
	const collection = db.collection<TChatDocument>(COLLECTION_NAME);

	// Try to find existing chat
	const existingChat = await collection.findOne({
		orgId,
		whatsappTelefoneId: whatsappPhoneNumberId,
		"cliente.id": cliente.id,
	});

	if (existingChat) {
		return existingChat;
	}

	// Create new chat
	const newChat: Omit<TChatDocument, "_id"> = {
		orgId,
		whatsappTelefoneId: whatsappPhoneNumberId,
		whatsappJanelaAtiva: false, // Expired by default
		cliente,
		mensagensNaoLidas: 0,
		ultimaMensagemCliente: null,
		ultimaMensagemAtendente: null,
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	const result = await collection.insertOne(newChat as any);
	return {
		...newChat,
		_id: result.insertedId,
	} as TChatDocument;
}

/**
 * Update chat
 */
export async function updateChat(chatId: string, orgId: string, update: Partial<Omit<TChat, "cliente">>): Promise<boolean> {
	const db = await connectToDatabase();
	const collection = db.collection<TChatDocument>(COLLECTION_NAME);

	const result = await collection.updateOne(
		{ _id: new ObjectId(chatId), orgId },
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
 * Update chat's last message from client
 */
export async function updateChatLastMessageFromClient(
	chatId: string,
	orgId: string,
	message: {
		idMensagem: string;
		conteudoTipo: Exclude<TChat["ultimaMensagemCliente"], undefined | null>["conteudoTipo"];
		conteudoTexto?: string | null;
		data: string;
	},
	incrementUnread = true,
): Promise<boolean> {
	const db = await connectToDatabase();
	const collection = db.collection<TChatDocument>(COLLECTION_NAME);

	const updateDoc: Record<string, unknown> = {
		ultimaMensagemCliente: message,
		whatsappJanelaAtiva: true, // Reopen window when client sends message
		updatedAt: new Date(),
	};

	const result = await collection.updateOne(
		{ _id: new ObjectId(chatId), orgId },
		incrementUnread ? { $set: updateDoc, $inc: { mensagensNaoLidas: 1 } } : { $set: updateDoc },
	);

	return result.modifiedCount > 0;
}

/**
 * Update chat's last message from attendant
 */
export async function updateChatLastMessageFromAttendant(
	chatId: string,
	orgId: string,
	message: {
		idMensagem: string;
		conteudoTipo: "TEXTO" | "IMAGEM" | "AUDIO" | "VIDEO" | "DOCUMENTO";
		conteudoTexto?: string | null;
		data: string;
	},
): Promise<boolean> {
	const db = await connectToDatabase();
	const collection = db.collection<TChatDocument>(COLLECTION_NAME);

	const result = await collection.updateOne(
		{ _id: new ObjectId(chatId), orgId },
		{
			$set: {
				ultimaMensagemAtendente: message,
				updatedAt: new Date(),
			},
		},
	);

	return result.modifiedCount > 0;
}

/**
 * Reset unread message count
 */
export async function resetUnreadCount(chatId: string, orgId: string): Promise<boolean> {
	const db = await connectToDatabase();
	const collection = db.collection<TChatDocument>(COLLECTION_NAME);

	const result = await collection.updateOne(
		{ _id: new ObjectId(chatId), orgId },
		{
			$set: {
				mensagensNaoLidas: 0,
				updatedAt: new Date(),
			},
		},
	);

	return result.modifiedCount > 0;
}

/**
 * Check and expire chats where 24h window has passed
 */
export async function expireInactiveChats(orgId: string): Promise<number> {
	const db = await connectToDatabase();
	const collection = db.collection<TChatDocument>(COLLECTION_NAME);

	const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

	const result = await collection.updateMany(
		{
			orgId,
			whatsappJanelaAtiva: true,
			"ultimaMensagemCliente.data": { $lt: twentyFourHoursAgo },
		},
		{
			$set: {
				whatsappJanelaAtiva: false,
				updatedAt: new Date(),
			},
		},
	);

	return result.modifiedCount;
}

/**
 * Create indexes for the collection
 */
export async function createChatIndexes(): Promise<void> {
	const db = await connectToDatabase();
	const collection = db.collection<TChatDocument>(COLLECTION_NAME);

	await collection.createIndexes([
		{ key: { orgId: 1, whatsappTelefoneId: 1 } },
		{ key: { "cliente.id": 1 } },
		{ key: { "ultimaMensagemCliente.data": -1 } },
		{ key: { orgId: 1, whatsappJanelaAtiva: 1 } },
	]);
}
