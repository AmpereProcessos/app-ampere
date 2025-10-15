import { FacebookOAuth } from "@/lib/oauth";
import { apiHandler } from "@/utils/api";
import * as arctic from "arctic";
import type { NextApiHandler } from "next";

const handleArcticWhatsapp: NextApiHandler<any> = async (req, res) => {
	const state = arctic.generateState();
	const scopes = ["email", "public_profile", "whatsapp_business_management", "whatsapp_business_messaging"];
	const url = FacebookOAuth.createAuthorizationURL(state, scopes);
	console.log("[INFO] [ARCTIC_WHATSAPP] Redirecting to:", url.toString());
	res.redirect(url.toString());
};

export default apiHandler({
	GET: handleArcticWhatsapp,
});
