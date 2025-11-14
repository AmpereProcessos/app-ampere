import { apiHandler } from "@/utils/api";
import axios from "axios";
import type { NextApiHandler } from "next";

const handleContaAzulAuthCallback: NextApiHandler<any> = async (req, res) => {
	console.log("CONTA AZUL AUTH CALLBACK", req.query);
	const { code, state } = req.query;

	if (!code || !state) return res.status(400).json({ error: "Parâmetros inválidos." });

	const redirect_uri = "https://app.ampereenergias.com.br/api/integracao/conta-azul/callback";
	const headers = {
		Authorization: `Basic ${Buffer.from(`${process.env.CONTAAZUL_CLIENT_ID}:${process.env.CONTAAZUL_CLIENT_SECRET}`).toString("base64")}`,
	};
	try {
		const response = await axios.post(
			`https://api.contaazul.com/oauth2/token?grant_type=authorization_code&redirect_uri=${redirect_uri}&code=${code}`,
			{},
			{ headers },
		);
		console.log("AUTHTOKEN RESPONSE", response.data);
	} catch (error) {
		console.log("AUTHTOKEN ERROR", error);
		throw error;
	}

	return res.status(200).json({ message: "Autenticação realizada com sucesso !" });
};

export default apiHandler({ GET: handleContaAzulAuthCallback });
