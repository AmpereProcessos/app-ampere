import { v } from "convex/values";
import { internal } from "../_generated/api";
import { internalMutation } from "../_generated/server";

export const scheduleAIResponse = internalMutation({
	args: {
		chatId: v.id("chats"),
		delayMs: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		const delay = args.delayMs ?? 5000; // Default 5 seconds
		await ctx.db.patch(args.chatId, {
			aiAgendamentoRespostaData: Date.now() + delay,
		});
		console.log(`[AI] Scheduled AI response for chat ${args.chatId} in ${delay}ms`);
	},
});

export const processScheduledAIResponses = internalMutation({
	args: {},
	handler: async (ctx, args) => {
		const now = Date.now();

		// Query chats that have scheduled AI responses due
		const chats = await ctx.db.query("chats").collect();
		const chatsNeedingResponse = chats.filter((chat) => {
			if (!chat.aiAgendamentoRespostaData) return false;
			if (chat.aiAgendamentoRespostaData > now) return false;

			// Check if there was a new message after the schedule was set
			// If ultimaInteracaoClienteData is after aiAgendamentoRespostaData, skip (new message came in)
			if (
				chat.ultimaInteracaoClienteData &&
				chat.aiAgendamentoRespostaData &&
				chat.ultimaInteracaoClienteData >= chat.aiAgendamentoRespostaData - 5000
			) {
				// Client sent another message within the window, skip
				return true;
			}

			return true;
		});

		console.log(`[AI] Found ${chatsNeedingResponse.length} chats needing AI response`);

		for (const chat of chatsNeedingResponse) {
			try {
				// Check if chat has an open service assigned to a human
				const openService = await ctx.db
					.query("services")
					.filter((q) => q.eq(q.field("chatId"), chat._id))
					.filter((q) => q.eq(q.field("status"), "PENDENTE"))
					.first();

				// Check if there's a service with a human assigned
				const hasHumanAssigned = openService?.responsavel !== undefined;

				if (!hasHumanAssigned) {
					// Clear the schedule first to prevent duplicate processing
					await ctx.db.patch(chat._id, {
						aiAgendamentoRespostaData: undefined,
					});

					// Schedule the AI response generation
					await ctx.scheduler.runAfter(0, internal.actions.ai.generateAIResponse, {
						chatId: chat._id,
					});

					console.log(`[AI] Triggered AI response for chat ${chat._id}`);
				} else {
					// Clear schedule but don't generate - human is handling
					await ctx.db.patch(chat._id, {
						aiAgendamentoRespostaData: undefined,
					});
					console.log(`[AI] Skipped chat ${chat._id} - human assigned`);
				}
			} catch (error) {
				console.error(`[AI] Error processing chat ${chat._id}:`, error);
			}
		}

		return {
			processed: chatsNeedingResponse.length,
		};
	},
});

export const clearAISchedule = internalMutation({
	args: {
		chatId: v.id("chats"),
	},
	handler: async (ctx, args) => {
		await ctx.db.patch(args.chatId, {
			aiAgendamentoRespostaData: undefined,
		});
		console.log(`[AI] Cleared AI schedule for chat ${args.chatId}`);
	},
});
