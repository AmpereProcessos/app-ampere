"use node";

import { v } from "convex/values";
import { sendBasicWhatsappMessage, sendTemplateWhatsappMessage } from "../../lib/whatsapp";
import { internal } from "../_generated/api";
import { internalAction } from "../_generated/server";

export const sendWhatsappMessage = internalAction({
	args: {
		messageId: v.id("messages"),
		phoneNumber: v.string(),
		content: v.string(),
	},
	handler: async (ctx, args) => {
		try {
			console.log("[WHATSAPP_ACTION] Sending message:", args.messageId);

			// Send message via WhatsApp API
			const response = await sendBasicWhatsappMessage({
				toPhoneNumber: args.phoneNumber,
				content: args.content,
			});

			// Update message with WhatsApp message ID and status
			await ctx.runMutation(internal.mutations.messages.updateMessageAfterSend, {
				messageId: args.messageId,
				whatsappMessageId: response.whatsappMessageId,
				success: true,
			});

			console.log("[WHATSAPP_ACTION] Message sent successfully:", response.whatsappMessageId);

			return {
				success: true,
				whatsappMessageId: response.whatsappMessageId,
			};
		} catch (error) {
			console.error("[WHATSAPP_ACTION] Error sending message:", error);

			// Update message status to failed
			await ctx.runMutation(internal.mutations.messages.updateMessageAfterSend, {
				messageId: args.messageId,
				whatsappMessageId: undefined,
				success: false,
			});

			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	},
});

export const sendWhatsappTemplate = internalAction({
	args: {
		messageId: v.id("messages"),
		phoneNumber: v.string(),
		templatePayload: v.any(),
	},
	handler: async (ctx, args) => {
		try {
			console.log("[WHATSAPP_ACTION] Sending template:", args.messageId, args.templatePayload);

			// Send template via WhatsApp API
			const response = await sendTemplateWhatsappMessage({
				templatePayload: args.templatePayload,
			});

			// Update message with WhatsApp message ID and status
			await ctx.runMutation(internal.mutations.messages.updateMessageAfterSend, {
				messageId: args.messageId,
				whatsappMessageId: response.whatsappMessageId,
				success: true,
			});

			console.log("[WHATSAPP_ACTION] Template sent successfully:", response.whatsappMessageId);

			return {
				success: true,
				whatsappMessageId: response.whatsappMessageId,
			};
		} catch (error) {
			console.error("[WHATSAPP_ACTION] Error sending template:", error);

			// Update message status to failed
			await ctx.runMutation(internal.mutations.messages.updateMessageAfterSend, {
				messageId: args.messageId,
				whatsappMessageId: undefined,
				success: false,
			});

			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	},
});
