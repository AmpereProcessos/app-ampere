import { v } from "convex/values";
import { internalMutation } from "../_generated/server";

export const createService = internalMutation({
	args: {
		chatId: v.id("chats"),
		clienteId: v.id("clients"),
		descricao: v.string(),
		status: v.union(v.literal("PENDENTE"), v.literal("EM_ANDAMENTO"), v.literal("CONCLUIDO")),
	},
	handler: async (ctx, args) => {
		console.log("[INFO] [SERVICES] [CREATE_SERVICE] Creating service for chat:", args.chatId);

		const serviceId = await ctx.db.insert("services", {
			chatId: args.chatId,
			clienteId: args.clienteId,
			descricao: args.descricao,
			status: args.status,
		});

		console.log("[INFO] [SERVICES] [CREATE_SERVICE] Service created:", serviceId);

		return {
			data: {
				serviceId,
			},
			message: "Serviço criado com sucesso.",
		};
	},
});
