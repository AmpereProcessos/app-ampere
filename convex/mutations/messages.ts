import { v } from "convex/values";
import { internal } from "../_generated/api";
import type { Id } from "../_generated/dataModel";
import { internalMutation, mutation } from "../_generated/server";

export const createMessage = mutation({
	args: {
		cliente: v.object({
			idApp: v.string(),
			nome: v.string(),
			cpfCnpj: v.optional(v.string()),
			email: v.optional(v.string()),
			telefone: v.string(),
			avatar_url: v.optional(v.string()),
		}),
		autor: v.object({
			idApp: v.string(),
			tipo: v.union(v.literal("cliente"), v.literal("usuario")),
		}),
		conteudo: v.object({
			texto: v.optional(v.string()),
			midiaUrl: v.optional(v.string()),
			midiaTipo: v.optional(v.union(v.literal("IMAGEM"), v.literal("VIDEO"), v.literal("AUDIO"), v.literal("DOCUMENTO"))),
		}),
		whatsappMessageId: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		let autorId: Id<"clients"> | Id<"users"> | null = null;

		let clientId: Id<"clients"> | null = null;
		const cliente = await ctx.db
			.query("clients")
			.filter((q) => q.eq(q.field("idApp"), args.cliente.idApp))
			.first();

		if (!cliente) {
			// If client is not yet registered, we need to register it
			const insertClientResponse = await ctx.db.insert("clients", {
				...args.cliente,
			});
			clientId = insertClientResponse;
			// If the author is a client, we also define the autorId
			if (args.autor.tipo === "cliente") autorId = clientId;
		} else {
			clientId = cliente._id;
			// If the author is a client, we also define the autorId
			if (args.autor.tipo === "cliente") autorId = clientId;
		}
		// If clientId was not defined by any means, we need to throw an error
		if (!clientId) {
			throw new Error("Cliente não encontrado.");
		}

		// Then, we query for the chat this cliet has
		let chatId: Id<"chats"> | null = null;
		const chat = await ctx.db
			.query("chats")
			.filter((q) => q.eq(q.field("clienteId"), clientId))
			.first();
		if (!chat) {
			// If chat is not yet registered, we need to register it
			const insertChatResponse = await ctx.db.insert("chats", {
				clienteId: clientId,
				mensagensNaoLidas: 0,
				status: "ABERTA",
			});
			chatId = insertChatResponse;
		} else {
			chatId = chat._id;
		}

		// If chatId was not defined by any means, we need to throw an error
		if (!chatId) {
			throw new Error("Chat não encontrado.");
		}

		let serviceId: Id<"services"> | null = null;

		// We try finding any open service for this chat
		const service = await ctx.db
			.query("services")
			.filter((q) => q.eq(q.field("chatId"), chatId))
			.filter((q) => q.eq(q.field("status"), "PENDENTE"))
			.first();
		if (!service) {
			// If no service was found, we only create one if the autor is a user
			if (args.autor.tipo === "usuario") {
				const insertServiceResponse = await ctx.db.insert("services", {
					chatId: chatId,
					clienteId: clientId,
					descricao: "NÃO ESPECIFICADO",
					status: "PENDENTE",
				});
				serviceId = insertServiceResponse;
			}
		} else {
			serviceId = service._id;
		}

		if (!autorId) {
			// If no autorId was defined, we check if the autor is a user
			if (args.autor.tipo === "usuario") {
				const user = await ctx.db
					.query("users")
					.filter((q) => q.eq(q.field("idApp"), args.autor.idApp))
					.first();
				if (!user) {
					throw new Error("Usuário não encontrado.");
				}
				autorId = user._id;
			} else {
				// Else, it is a user but no user was found, them throw an error
				throw new Error("Autor não encontrado.");
			}
		}

		// We check if the whatsappMessageId is defined (is obligatory in case it came from a client)
		if (args.autor.tipo === "cliente" && !args.whatsappMessageId) {
			throw new Error("WhatsappMessageId não informado.");
		}

		// Finally, we insert the message
		const insertMessageResponse = await ctx.db.insert("messages", {
			chatId: chatId,
			autorTipo: args.autor.tipo,
			autorId: autorId,
			conteudoTexto: args.conteudo.texto,
			conteudoMidiaUrl: args.conteudo.midiaUrl,
			conteudoMidiaTipo: args.conteudo.midiaTipo,
			status: "ENVIADO",
			whatsappMessageId: args.whatsappMessageId,
			servicoId: serviceId ?? undefined,
			dataEnvio: Date.now(),
		});

		// Updating chat embedded data
		await ctx.db.patch(chatId, {
			ultimaMensagemId: insertMessageResponse,
			ultimaMensagemData: Date.now(),
			ultimaMensagemConteudoTexto: args.conteudo.texto,
			mensagensNaoLidas: args.autor.tipo === "cliente" ? (chat?.mensagensNaoLidas ?? 0) + 1 : (chat?.mensagensNaoLidas ?? 0),
		});
		// [TODO] Schedule the Whatsapp message to be send in case we came from user
		return {
			data: {
				insertedId: insertMessageResponse,
			},
			message: "Mensagem criada com sucesso.",
		};
	},
});

export const createTemplateMessage = mutation({
	args: {
		chatId: v.id("chats"),
		userAppId: v.string(),
		templateId: v.string(),
		templatePayloadData: v.any(),
		templatePayloadContent: v.string(),
	},
	handler: async (ctx, args) => {
		const { chatId, templateId, templatePayloadData, templatePayloadContent, userAppId } = args;
		console.log("[SEND_TEMPLATE_MESSAGE] Sending template message:", args);
		// Get chat and user
		const chat = await ctx.db.get(chatId);
		if (!chat) throw new Error("Chat não encontrado.");

		const user = await ctx.db
			.query("users")
			.filter((q) => q.eq(q.field("idApp"), userAppId))
			.first();
		if (!user) throw new Error("Usuário não encontrado.");

		const client = await ctx.db.get(chat.clienteId);
		if (!client) throw new Error("Cliente não encontrado.");

		// Insert message record
		const messageId = await ctx.db.insert("messages", {
			chatId: args.chatId,
			autorTipo: "usuario",
			autorId: user._id,
			conteudoTexto: templatePayloadContent,
			status: "ENVIADO",
			whatsappStatus: "PENDENTE",
			dataEnvio: Date.now(),
		});

		// Update chat
		await ctx.db.patch(args.chatId, {
			ultimaMensagemId: messageId,
			ultimaMensagemData: Date.now(),
			ultimaMensagemConteudoTexto: templatePayloadContent,
			status: "ABERTA", // Reopen conversation after template
			ultimaInteracaoClienteData: Date.now(), // Reset 24h timer
		});

		// Schedule template send via action
		await ctx.scheduler.runAfter(1000, internal.actions.whatsapp.sendWhatsappTemplate, {
			messageId: messageId,
			phoneNumber: client.telefone,
			templatePayload: args.templatePayloadData,
		});

		return {
			data: {
				messageId,
			},
			message: "Template agendado para envio.",
		};
	},
});

export const updateMessageAfterSend = internalMutation({
	args: {
		messageId: v.id("messages"),
		whatsappMessageId: v.optional(v.string()),
		success: v.boolean(),
	},
	handler: async (ctx, args) => {
		console.log(`[INFO] [MESSAGES] [UPDATE_MESSAGE_AFTER_SEND] Updating message ${args.messageId}.`);
		const message = await ctx.db.get(args.messageId);
		if (!message) {
			throw new Error("Mensagem não encontrada.");
		}

		if (args.success && args.whatsappMessageId) {
			// Update message with WhatsApp message ID and mark as sent
			console.log(`[INFO] [MESSAGES] [UPDATE_MESSAGE_AFTER_SEND] Message ${args.messageId} sent successfully.`);
			await ctx.db.patch(args.messageId, {
				whatsappMessageId: args.whatsappMessageId,
				whatsappStatus: "ENVIADO",
			});
		} else {
			console.log(`[INFO] [MESSAGES] [UPDATE_MESSAGE_AFTER_SEND] Message ${args.messageId} failed to send.`);
			// Mark message as failed
			await ctx.db.patch(args.messageId, {
				whatsappStatus: "FALHOU",
			});
		}

		return { success: true };
	},
});

export const updateMessageStatus = mutation({
	args: {
		whatsappMessageId: v.string(),
		status: v.union(v.literal("ENVIADO"), v.literal("RECEBIDO"), v.literal("LIDO")),
		whatsappStatus: v.union(v.literal("PENDENTE"), v.literal("ENVIADO"), v.literal("ENTREGUE"), v.literal("FALHOU")),
	},
	handler: async (ctx, args) => {
		// Find message by WhatsApp message ID
		const message = await ctx.db
			.query("messages")
			.withIndex("by_whatsapp_message_id", (q) => q.eq("whatsappMessageId", args.whatsappMessageId))
			.first();

		if (!message) {
			console.log("[INFO] [MESSAGES] [UPDATE_MESSAGE_STATUS] Message not found for WhatsApp ID:", args.whatsappMessageId);
			return {
				success: false,
				message: "Mensagem não encontrada.",
			};
		}

		// Update message status
		await ctx.db.patch(message._id, {
			status: args.status,
			whatsappStatus: args.whatsappStatus,
		});

		console.log("[INFO] [MESSAGES] [UPDATE_MESSAGE_STATUS] Updated message:", message._id, "to status:", args.status);

		return {
			success: true,
			message: "Status da mensagem atualizado com sucesso.",
		};
	},
});
