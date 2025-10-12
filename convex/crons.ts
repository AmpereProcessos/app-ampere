import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Check chat states every hour to expire conversations older than 24h
crons.interval(
	"check-chat-states",
	{ hours: 1 }, // Run every hour
	internal.mutations.chats.updateExpiredChats,
);

// Process scheduled AI responses every minute
crons.interval(
	"process-ai-responses",
	{ minutes: 1 }, // Run every minute
	internal.mutations.ai.processScheduledAIResponses,
);

export default crons;
