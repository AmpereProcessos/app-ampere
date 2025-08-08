export const NOVU_APPLICATION_IDENTIFIER = process.env.NODE_ENV === "production" ? "XHqYkViuQN1D" : "XHqYkViuQN1D";

export function getNovuSubscriberId(userId: string) {
	return `app-${userId}`;
}
