import { v } from "convex/values";
import type { Id } from "../_generated/dataModel";
import { query } from "../_generated/server";

export const getChats = query({
	args: {},
	handler: async (ctx, args) => {
		const chats = await ctx.db.query("chats").collect();
		const enrichedChats = await Promise.all(
			chats.map(async (chat) => {
				const chatClient = await ctx.db
					.query("clients")
					.filter((q) => q.eq(q.field("_id"), chat.clienteId))
					.first();
				if (!chatClient) throw new Error("Cliente não encontrado.");
				return {
					...chat,
					cliente: chatClient,
				};
			}),
		);
		return enrichedChats;
	},
});

export const getChat = query({
	args: {
		chatId: v.id("chats"),
	},
	handler: async (ctx, args) => {
		const chat = await ctx.db.get(args.chatId);
		if (!chat) throw new Error("Chat não encontrado.");
		const chatClient = await ctx.db.get(chat.clienteId);
		if (!chatClient) throw new Error("Cliente não encontrado.");
		const enrichedChat = {
			...chat,
			cliente: chatClient,
		};
		return enrichedChat;
	},
});

export const getChatMessages = query({
	args: {
		chatId: v.id("chats"),
	},
	handler: async (ctx, args) => {
		const messages = await ctx.db
			.query("messages")
			.filter((q) => q.eq(q.field("chatId"), args.chatId))
			.collect();

		const enrichedMessages = await Promise.all(
			messages.map(async (message) => {
				let messageAuthor: { nome: string; avatar_url: string | null } | null = null;
				if (message.autorTipo === "cliente") {
					const client = await ctx.db.get(message.autorId as Id<"clients">);
					if (!client) throw new Error("Cliente não encontrado.");
					messageAuthor = {
						nome: client.nome,
						avatar_url: client.avatar_url ?? null,
					};
				} else {
					const user = await ctx.db.get(message.autorId as Id<"users">);
					if (!user) throw new Error("Usuário não encontrado.");
					messageAuthor = {
						nome: user.nome,
						avatar_url: user.avatar_url ?? null,
					};
				}
				return {
					...message,
					autor: messageAuthor,
				};
			}),
		);
		return enrichedMessages;
	},
});
