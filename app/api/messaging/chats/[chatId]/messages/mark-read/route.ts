import { getValidCurrentSessionUncached } from "@/lib/authentication/session";
import { resetUnreadCount } from "@/repositories/messaging/chats";
import { markChatMessagesAsRead } from "@/repositories/messaging/messages";
import { type NextRequest, NextResponse } from "next/server";

// Default orgId - in the future this should come from the user's organization
const DEFAULT_ORG_ID = process.env.DEFAULT_ORG_ID || "default-org";

/**
 * POST /api/messaging/chats/[chatId]/messages/mark-read
 * Mark all messages from client as read
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ chatId: string }> }) {
	try {
		// Authenticate user
		const session = await getValidCurrentSessionUncached();
		if (!session.user) {
			return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
		}

		const { chatId } = await params;

		// Mark messages as read
		const markedCount = await markChatMessagesAsRead(chatId);

		// Reset unread count in chat
		await resetUnreadCount(chatId, DEFAULT_ORG_ID);

		return NextResponse.json({
			success: true,
			markedCount,
		});
	} catch (error) {
		console.error("Error marking messages as read:", error);
		return NextResponse.json({ error: "Erro ao marcar mensagens como lidas" }, { status: 500 });
	}
}
