export const NOVU_APPLICATION_IDENTIFIER = process.env.NODE_ENV === "production" ? "deFlr5yz6KNm" : "deFlr5yz6KNm";

export function getNovuSubscriberId(userId: string) {
	return `app-${userId}`;
}
