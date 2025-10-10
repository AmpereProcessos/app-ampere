import { v } from "convex/values";
import type { Id } from "../_generated/dataModel";
import { mutation } from "../_generated/server";

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
