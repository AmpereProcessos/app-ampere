import { getValidCurrentSessionUncached } from "@/lib/authentication/session";
import { getChatById, updateChatLastMessageFromAttendant, updateChatLastMessageFromClient } from "@/repositories/messaging/chats";
import { createMessage, getChatMessages, getUnreadMessageCount } from "@/repositories/messaging/messages";
import { getOrCreateChatService } from "@/repositories/messaging/services";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Default orgId - in the future this should come from the user's organization
const DEFAULT_ORG_ID = process.env.DEFAULT_ORG_ID || "default-org";

/**
 * GET /api/messaging/chats/[chatId]/messages
 * Get paginated messages for a chat
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ chatId: string }> }) {
	try {
		// Authenticate user
		const session = await getValidCurrentSessionUncached();
		if (!session.user) {
			return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
		}

		const { chatId } = await params;

		// Get query parameters
		const searchParams = request.nextUrl.searchParams;
		const cursor = searchParams.get("cursor");
		const limit = searchParams.get("limit");

		// Fetch messages
		const result = await getChatMessages(chatId, {
			cursor: cursor || undefined,
			limit: limit ? Number.parseInt(limit) : undefined,
		});

		// Convert ObjectIds to strings
		const items = result.items.map((msg) => ({
			...msg,
			_id: msg._id.toString(),
		}));

		return NextResponse.json({
			...result,
			items,
		});
	} catch (error) {
		console.error("Error fetching messages:", error);
		return NextResponse.json({ error: "Erro ao buscar mensagens" }, { status: 500 });
	}
}

/**
 * POST /api/messaging/chats/[chatId]/messages
 * Create a new message
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ chatId: string }> }) {
	try {
		// Authenticate user
		const session = await getValidCurrentSessionUncached();
		if (!session.user) {
			return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
		}

		const { chatId } = await params;

		// Parse request body
		const body = await request.json();

		// Validate request
		const schema = z.object({
			conteudo: z.object({
				tipo: z.enum(["TEXTO", "IMAGEM", "AUDIO", "VIDEO", "DOCUMENTO"]),
				texto: z.string().optional().nullable(),
				midiaUrl: z.string().optional().nullable(),
				midiaTipo: z.string().optional().nullable(),
				midiaTamanho: z.number().optional().nullable(),
				midiaNomeArquivo: z.string().optional().nullable(),
			}),
			autor: z.object({
				tipo: z.enum(["CLIENTE", "ATENDENTE", "AGENTE-IA"]),
				id: z.string(),
				nome: z.string(),
				avatar: z.string().optional().nullable(),
			}),
		});

		const validatedData = schema.parse(body);

		// Get chat to verify it exists and get cliente info
		const chat = await getChatById(chatId, DEFAULT_ORG_ID);
		if (!chat) {
			return NextResponse.json({ error: "Conversa não encontrada" }, { status: 404 });
		}

		// Get or create service
		const service = await getOrCreateChatService(
			chatId,
			chat.cliente,
			validatedData.autor.tipo === "ATENDENTE"
				? {
						tipo: "USUÁRIO",
						id: validatedData.autor.id,
						nome: validatedData.autor.nome,
						avatar: validatedData.autor.avatar,
					}
				: validatedData.autor.tipo === "AGENTE-IA"
					? {
							tipo: "AGENTE-IA",
							id: "ai-agent",
							nome: "AI Agent",
							avatar: null,
						}
					: null,
		);

		// Create message
		const message = await createMessage({
			chat: { id: chatId },
			atendimento: { id: service._id.toString() },
			status: validatedData.autor.tipo === "CLIENTE" ? "RECEBIDO" : "ENVIADO",
			whatsappId: null,
			whatsappStatus: validatedData.autor.tipo === "CLIENTE" ? null : "PENDENTE",
			conteudo: validatedData.conteudo,
			autor: validatedData.autor,
		});

		// Update chat's last message
		const messageData = {
			idMensagem: message._id.toString(),
			conteudoTipo: validatedData.conteudo.tipo,
			conteudoTexto: validatedData.conteudo.texto,
			data: message.dataInsercao,
		};

		if (validatedData.autor.tipo === "CLIENTE") {
			await updateChatLastMessageFromClient(
				chatId,
				DEFAULT_ORG_ID,
				messageData,
				true, // Increment unread count
			);
		} else {
			await updateChatLastMessageFromAttendant(chatId, DEFAULT_ORG_ID, messageData);
		}

		return NextResponse.json({
			messageId: message._id.toString(),
			message: {
				...message,
				_id: message._id.toString(),
			},
		});
	} catch (error) {
		console.error("Error creating message:", error);

		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: "Dados inválidos", details: error.errors }, { status: 400 });
		}

		return NextResponse.json({ error: "Erro ao criar mensagem" }, { status: 500 });
	}
}
