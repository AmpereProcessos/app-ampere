import { MessageSchema, type TMessage } from "@/utils/schemas/messaging/messages";
import connectToDatabase from "@/utils/services/mongodb/projects";
import { ObjectId } from "mongodb";

const COLLECTION_NAME = "chats-messages";

// MongoDB document type (includes _id)
export type TMessageDocument = TMessage & {
	_id: ObjectId;
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
 * Create a new message
 */
export async function createMessage(message: Omit<TMessage, "dataInsercao">): Promise<TMessageDocument> {
	const db = await connectToDatabase();
	const collection = db.collection<TMessageDocument>(COLLECTION_NAME);

	const now = new Date();
	const newMessage: Omit<TMessageDocument, "_id"> = {
		...message,
		dataInsercao: now.toISOString(),
		createdAt: now,
		updatedAt: now,
	};

	const result = await collection.insertOne(newMessage as any);
	return {
		...newMessage,
		_id: result.insertedId,
	} as TMessageDocument;
}

/**
 * Get paginated messages for a chat (most recent first)
 */
export async function getChatMessages(chatId: string, options: TPaginationOptions = {}): Promise<TPaginatedResult<TMessageDocument>> {
	const db = await connectToDatabase();
	const collection = db.collection<TMessageDocument>(COLLECTION_NAME);

	const limit = options.limit ?? 30;
	const query: Record<string, unknown> = {
		"chat.id": chatId,
	};

	// Apply cursor pagination (for loading older messages)
	if (options.cursor) {
		const { date, id } = decodeCursor(options.cursor);
		query.$or = [
			{ dataInsercao: { $lt: date } as Record<string, unknown> },
			{
				dataInsercao: date,
				_id: { $lt: new ObjectId(id) } as Record<string, unknown>,
			},
		];
	}

	// Fetch one extra to check if there are more results
	const messages = await collection
		.find(query)
		.sort({ dataInsercao: -1, _id: -1 }) // Most recent first
		.limit(limit + 1)
		.toArray();

	const hasMore = messages.length > limit;
	const items = hasMore ? messages.slice(0, limit) : messages;

	// Reverse to show oldest first (for display)
	items.reverse();

	let nextCursor: string | null = null;
	if (hasMore && messages.length > 0) {
		// Cursor points to the oldest message (before reversing)
		const oldestMessage = messages[messages.length - 1];
		nextCursor = encodeCursor(oldestMessage.dataInsercao, oldestMessage._id.toString());
	}

	return {
		items,
		hasMore,
		nextCursor,
	};
}

/**
 * Get a single message by ID
 */
export async function getMessageById(messageId: string): Promise<TMessageDocument | null> {
	const db = await connectToDatabase();
	const collection = db.collection<TMessageDocument>(COLLECTION_NAME);

	return await collection.findOne({
		_id: new ObjectId(messageId),
	});
}

/**
 * Get a message by WhatsApp message ID
 */
export async function getMessageByWhatsappId(whatsappId: string): Promise<TMessageDocument | null> {
	const db = await connectToDatabase();
	const collection = db.collection<TMessageDocument>(COLLECTION_NAME);

	return await collection.findOne({
		whatsappId,
	});
}

/**
 * Update message status
 */
export async function updateMessageStatus(
	messageId: string,
	status: TMessage["status"],
	whatsappStatus?: TMessage["whatsappStatus"],
): Promise<boolean> {
	const db = await connectToDatabase();
	const collection = db.collection<TMessageDocument>(COLLECTION_NAME);

	const updateDoc: Record<string, unknown> = {
		status,
		updatedAt: new Date(),
	};

	if (whatsappStatus !== undefined) {
		updateDoc.whatsappStatus = whatsappStatus;
	}

	const result = await collection.updateOne({ _id: new ObjectId(messageId) }, { $set: updateDoc });

	return result.modifiedCount > 0;
}

/**
 * Update message by WhatsApp ID
 */
export async function updateMessageByWhatsappId(whatsappId: string, update: Partial<Pick<TMessage, "status" | "whatsappStatus">>): Promise<boolean> {
	const db = await connectToDatabase();
	const collection = db.collection<TMessageDocument>(COLLECTION_NAME);

	const result = await collection.updateOne(
		{ whatsappId },
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
 * Update message after send (set WhatsApp ID and status)
 */
export async function updateMessageAfterSend(messageId: string, whatsappId: string | null, success: boolean): Promise<boolean> {
	const db = await connectToDatabase();
	const collection = db.collection<TMessageDocument>(COLLECTION_NAME);

	const updateDoc: Record<string, unknown> = {
		whatsappStatus: success ? "ENVIADO" : "FALHOU",
		updatedAt: new Date(),
	};

	if (whatsappId) {
		updateDoc.whatsappId = whatsappId;
	}

	const result = await collection.updateOne({ _id: new ObjectId(messageId) }, { $set: updateDoc });

	return result.modifiedCount > 0;
}

/**
 * Mark all messages from client in a chat as read
 */
export async function markChatMessagesAsRead(chatId: string): Promise<number> {
	const db = await connectToDatabase();
	const collection = db.collection<TMessageDocument>(COLLECTION_NAME);

	const result = await collection.updateMany(
		{
			"chat.id": chatId,
			"autor.tipo": "CLIENTE",
			status: { $ne: "LIDO" },
		},
		{
			$set: {
				status: "LIDO",
				updatedAt: new Date(),
			},
		},
	);

	return result.modifiedCount;
}

/**
 * Get unread message count for a chat
 */
export async function getUnreadMessageCount(chatId: string): Promise<number> {
	const db = await connectToDatabase();
	const collection = db.collection<TMessageDocument>(COLLECTION_NAME);

	return await collection.countDocuments({
		"chat.id": chatId,
		"autor.tipo": "CLIENTE",
		status: { $ne: "LIDO" },
	});
}

/**
 * Get last N messages for a chat (for AI context)
 */
export async function getLastMessages(chatId: string, limit = 100): Promise<TMessageDocument[]> {
	const db = await connectToDatabase();
	const collection = db.collection<TMessageDocument>(COLLECTION_NAME);

	const messages = await collection.find({ "chat.id": chatId }).sort({ dataInsercao: -1 }).limit(limit).toArray();

	// Reverse to show oldest first
	return messages.reverse();
}

/**
 * Update message media processing results
 */
export async function updateMessageMediaProcessing(messageId: string, processedText: string, summary: string): Promise<boolean> {
	const db = await connectToDatabase();
	const collection = db.collection<TMessageDocument>(COLLECTION_NAME);

	const result = await collection.updateOne(
		{ _id: new ObjectId(messageId) },
		{
			$set: {
				"conteudo.midiaTextoProcessado": processedText,
				"conteudo.midiaTextoProcessadoResumo": summary,
				updatedAt: new Date(),
			},
		},
	);

	return result.modifiedCount > 0;
}

/**
 * Create indexes for the collection
 */
export async function createMessageIndexes(): Promise<void> {
	const db = await connectToDatabase();
	const collection = db.collection<TMessageDocument>(COLLECTION_NAME);

	await collection.createIndexes([
		{ key: { "chat.id": 1, dataInsercao: -1 } },
		{ key: { whatsappId: 1 }, unique: true, sparse: true },
		{ key: { "autor.id": 1 } },
		{ key: { "atendimento.id": 1 } },
		{ key: { dataInsercao: -1 } },
	]);
}
