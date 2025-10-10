import { v } from "convex/values";
import type { Id } from "../_generated/dataModel";
import { mutation } from "../_generated/server";

export const getChatByClientAppId = mutation({
	args: {
		cliente: v.object({
			idApp: v.string(),
			nome: v.string(),
			cpfCnpj: v.optional(v.string()),
			email: v.optional(v.string()),
			telefone: v.string(),
			avatar_url: v.optional(v.string()),
		}),
	},
	handler: async (ctx, args) => {
		let clientId: Id<"clients"> | null = null;
		const client = await ctx.db
			.query("clients")
			.filter((q) => q.eq(q.field("idApp"), args.cliente.idApp))
			.first();
		if (!client) {
			// If client is not yet registered, we need to register it
			const insertClientResponse = await ctx.db.insert("clients", {
				...args.cliente,
			});
			clientId = insertClientResponse;
		} else {
			clientId = client._id;
		}

		if (!clientId) {
			throw new Error("Cliente não encontrado.");
		}

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
		}
		if (!chatId) {
			throw new Error("Chat não encontrado.");
		}
		return {
			chatId: chatId,
			clientId: clientId,
		};
	},
});
