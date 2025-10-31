import { getValidCurrentSessionUncached } from "@/lib/authentication/session";
import { getChats, getOrCreateChatByClient } from "@/repositories/messaging/chats";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Default orgId - in the future this should come from the user's organization
const DEFAULT_ORG_ID = process.env.DEFAULT_ORG_ID || "default-org";

/**
 * GET /api/messaging/chats
 * List chats with pagination and optional search
 */
export async function GET(request: NextRequest) {
	try {
		// Authenticate user
		const session = await getValidCurrentSessionUncached();
		if (!session.user) {
			return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
		}

		// Get query parameters
		const searchParams = request.nextUrl.searchParams;
		const whatsappPhoneNumberId = searchParams.get("whatsappPhoneNumberId");
		const cursor = searchParams.get("cursor");
		const limit = searchParams.get("limit");
		const searchQuery = searchParams.get("search");

		if (!whatsappPhoneNumberId) {
			return NextResponse.json({ error: "whatsappPhoneNumberId é obrigatório" }, { status: 400 });
		}

		// Fetch chats
		const result = await getChats(DEFAULT_ORG_ID, whatsappPhoneNumberId, {
			cursor: cursor || undefined,
			limit: limit ? Number.parseInt(limit) : undefined,
			searchQuery: searchQuery || undefined,
		});

		return NextResponse.json(result);
	} catch (error) {
		console.error("Error fetching chats:", error);
		return NextResponse.json({ error: "Erro ao buscar conversas" }, { status: 500 });
	}
}

/**
 * POST /api/messaging/chats
 * Create or get existing chat by client
 */
export async function POST(request: NextRequest) {
	try {
		// Authenticate user
		const session = await getValidCurrentSessionUncached();
		if (!session.user) {
			return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
		}

		// Parse request body
		const body = await request.json();

		// Validate request
		const schema = z.object({
			whatsappPhoneNumberId: z.string(),
			cliente: z.object({
				id: z.string(),
				nome: z.string(),
				telefone: z.string(),
				avatar: z.string().optional().nullable(),
			}),
		});

		const validatedData = schema.parse(body);

		// Get or create chat
		const chat = await getOrCreateChatByClient(DEFAULT_ORG_ID, validatedData.whatsappPhoneNumberId, validatedData.cliente);

		return NextResponse.json({
			chatId: chat._id.toString(),
			chat,
		});
	} catch (error) {
		console.error("Error creating/getting chat:", error);

		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: "Dados inválidos", details: error.errors }, { status: 400 });
		}

		return NextResponse.json({ error: "Erro ao criar/buscar conversa" }, { status: 500 });
	}
}
