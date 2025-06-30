import { apiHandler } from "@/utils/api";
import axios from "axios";
import type { NextApiHandler } from "next";
import QueryString from "qs";

const handleContaAzulAuthCallback: NextApiHandler<any> = async (req, res) => {
	console.log("[INFO] [CONTAAZULV2] [CALLBACK] Received request:", req.query);
	const { code, state } = req.query;

	if (!code || !state) return res.status(400).json({ error: "Parâmetros inválidos." });

	// Monta o header Authorization Basic com base64 do clientId:clientSecret
	const basicAuth = Buffer.from(`${process.env.CONTAAZULV2_CLIENT_ID}:${process.env.CONTAAZULV2_CLIENT_SECRET}`).toString("base64");

	const data = QueryString.stringify({
		client_id: process.env.CONTAAZULV2_CLIENT_ID,
		client_secret: process.env.CONTAAZULV2_CLIENT_SECRET,
		grant_type: "authorization_code",
		code: code,
		redirect_uri: "https://app.ampereenergias.com.br/api/integracao/conta-azul-v2/callback",
	});

	console.log("[INFO] [CONTAAZULV2] [CALLBACK] Stringified auth data:", data);
	console.log("[INFO] [CONTAAZULV2] [CALLBACK] Basic auth:", basicAuth);
	try {
		const response = await axios.post("https://auth.contaazul.com/oauth2/token", data, {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Authorization: `Basic ${basicAuth}`,
			},
		});
		console.log("[INFO] [CONTAAZULV2] Token response:", response.data);
	} catch (error) {
		console.log("[ERROR] [CONTAAZULV2] Error fetching token:", error);
		return res.status(500).json({ error: "Erro ao obter token de acesso." });
	}

	return res.status(200).json({ message: "Autenticação realizada com sucesso !" });
};

export default apiHandler({ GET: handleContaAzulAuthCallback });
