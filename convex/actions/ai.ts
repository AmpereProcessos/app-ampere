"use node";
import { v } from "convex/values";
import type { TGenerateAIResponseOutput } from "../../pages/api/integracao/ai/gerar-resposta";
import { internal } from "../_generated/api";
import { internalAction } from "../_generated/server";

const NEXT_API_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const generateAIResponse = internalAction({
	args: {
		chatId: v.id("chats"),
	},
	handler: async (ctx, args): Promise<{ success: boolean; transferred?: boolean; error?: string }> => {
		try {
			console.log("[AI_ACTION] Generating AI response for chat", args.chatId);

			// Get chat summary
			const chatSummary: any = await ctx.runQuery(internal.queries.chat.getChatSummary, {
				chatId: args.chatId,
			});

			if (!chatSummary) {
				throw new Error("Chat not found");
			}

			// Call the Next.js API endpoint with chat summary
			const response: Response = await fetch(`${NEXT_API_URL}/api/integracao/ai/gerar-resposta`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					chatSummary,
				}),
			});

			if (!response.ok) {
				throw new Error(`API request failed with status ${response.status}`);
			}

			const result: TGenerateAIResponseOutput = await response.json();
			console.log("[AI_ACTION] AI response result:", result);

			if (!result.success) {
				throw new Error(`AI generation failed: ${result.error || "Unknown error"}`);
			}

			// Get chat details
			const chat = await ctx.runQuery(internal.queries.chat.getChatInternal, {
				chatId: args.chatId,
			});

			if (!chat) {
				throw new Error("Chat not found");
			}

			await ctx.runMutation(internal.mutations.messages.createAIMessage, {
				chatId: args.chatId,
				conteudo: {
					texto: result.message,
				},
			});

			// if (result.shouldTransferToHuman) {
			// 	// Transfer to human
			// 	console.log("[AI_ACTION] Transferring chat", args.chatId, "to human:", result.reason);

			// 	if (!chatSummary.atendimentoAberto) {
			// 		// Create a service record
			// 		await ctx.runMutation(internal.mutations.services.createService, {
			// 			chatId: args.chatId,
			// 			clienteId: chat.clienteId,
			// 			descricao: result.reason || "Cliente solicitou atendimento humano",
			// 			status: "PENDENTE",
			// 		});
			// 	}

			// 	// Send a message indicating transfer
			// 	if (result.message) {
			// 		await ctx.runMutation(internal.mutations.messages.createAIMessage, {
			// 			chatId: args.chatId,
			// 			conteudo: {
			// 				texto: result.message,
			// 			},
			// 		});
			// 	}

			// 	// Clear AI schedule
			// 	await ctx.runMutation(internal.mutations.ai.clearAISchedule, {
			// 		chatId: args.chatId,
			// 	});
			// } else if (result.message) {
			// 	// Send AI response message
			// 	console.log("[AI_ACTION] Sending AI message to chat", args.chatId);

			// 	await ctx.runMutation(internal.mutations.messages.createAIMessage, {
			// 		chatId: args.chatId,
			// 		conteudo: {
			// 			texto: result.message,
			// 		},
			// 	});
			// }

			return {
				success: true,
				transferred: false,
			};
		} catch (error) {
			console.error("[AI_ACTION] Error generating AI response for chat", args.chatId, ":", error);
			// Don't throw - we don't want to fail the whole process
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	},
});
