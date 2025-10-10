import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	users: defineTable({
		nome: v.string(),
		email: v.string(),
		avatar_url: v.string(),
		idApp: v.string(),
	}),
	clients: defineTable({
		nome: v.string(),
		cpfCnpj: v.optional(v.string()),
		email: v.optional(v.string()),
		telefone: v.string(),
		avatar_url: v.optional(v.string()),
		idApp: v.string(),
	}),
	chats: defineTable({
		clienteId: v.id("clients"),
		mensagensNaoLidas: v.number(),
		ultimaMensagemId: v.optional(v.id("messages")),
		ultimaMensagemData: v.optional(v.number()),
		ultimaMensagemConteudoTexto: v.optional(v.string()),
		status: v.union(v.literal("ABERTA"), v.literal("EXPIRADA")),
		ultimaInteracaoClienteData: v.optional(v.number()),
	}).index("by_client_id", ["clienteId"]),
	messages: defineTable({
		chatId: v.id("chats"),
		autorTipo: v.union(v.literal("cliente"), v.literal("usuario")),
		autorId: v.union(v.id("clients"), v.id("users")),
		conteudoTexto: v.optional(v.string()),
		conteudoMidiaUrl: v.optional(v.string()),
		conteudoMidiaTipo: v.optional(v.union(v.literal("IMAGEM"), v.literal("VIDEO"), v.literal("AUDIO"), v.literal("DOCUMENTO"))),
		status: v.union(v.literal("ENVIADO"), v.literal("RECEBIDO"), v.literal("LIDO")),
		whatsappMessageId: v.optional(v.string()),
		whatsappStatus: v.optional(v.union(v.literal("PENDENTE"), v.literal("ENVIADO"), v.literal("ENTREGUE"), v.literal("FALHOU"))),
		servicoId: v.optional(v.id("services")),
		dataEnvio: v.number(),
	})
		.index("by_chat_id", ["chatId"])
		.index("by_author_id", ["autorId"])
		.index("by_whatsapp_message_id", ["whatsappMessageId"]),
	services: defineTable({
		chatId: v.id("chats"),
		clienteId: v.id("clients"),
		descricao: v.string(),
		status: v.union(v.literal("PENDENTE"), v.literal("EM_ANDAMENTO"), v.literal("CONCLUIDO")),
		responsavel: v.optional(v.id("users")),
	})
		.index("by_chat_id", ["chatId"])
		.index("by_client_id", ["clienteId"])
		.index("by_responsible_id", ["responsavel"])
		.index("by_status", ["status"]),
});
