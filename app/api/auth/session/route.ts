import { getCurrentSession } from "@/lib/authentication/session";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function handleGetSession() {
	const session = await getCurrentSession();

	if (!session.session || !session.user) return null;
	return session;
}

export type TGetSessionResponse = Awaited<ReturnType<typeof handleGetSession>>;

export async function GET() {
	try {
		const session = await handleGetSession();

		return NextResponse.json(session);
	} catch (error) {
		console.error("Error validating session:", error);
		return NextResponse.json(
			{
				success: false,
				session: null,
				user: null,
			},
			{ status: 401 },
		);
	}
}
