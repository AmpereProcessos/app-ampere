import { getValidCurrentSessionUncached } from "@/lib/authentication/session";
import { getChatById } from "@/repositories/messaging/chats";
import { getActiveChatService } from "@/repositories/messaging/services";
import { type NextRequest, NextResponse } from "next/server";

// Default orgId - in the future this should come from the user's organization
const DEFAULT_ORG_ID = process.env.DEFAULT_ORG_ID || "default-org";

/**
 * GET /api/messaging/chats/[chatId]
 * Get a single chat with its active service
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ chatId: string }> }) {
	try {
		// Authenticate user
		const session = await getValidCurrentSessionUncached();
		if (!session.user) {
			return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
		}

		const { chatId } = await params;

		// Fetch chat
		const chat = await getChatById(chatId, DEFAULT_ORG_ID);

		if (!chat) {
			return NextResponse.json({ error: "Conversa não encontrada" }, { status: 404 });
		}

		// Fetch active service if exists
		const activeService = await getActiveChatService(chatId);

		return NextResponse.json({
			...chat,
			_id: chat._id.toString(),
			atendimentoAberto: activeService
				? {
						...activeService,
						_id: activeService._id.toString(),
					}
				: null,
		});
	} catch (error) {
		console.error("Error fetching chat:", error);
		return NextResponse.json({ error: "Erro ao buscar conversa" }, { status: 500 });
	}
}
