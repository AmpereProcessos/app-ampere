import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import { TIntegration } from "@/utils/schemas/integrations";
import connectToDatabase from "@/utils/services/mongodb/projects";
import axios from "axios";
import dayjs from "dayjs";
import { NextApiHandler } from "next";

const handleAccessTokenRefresh: NextApiHandler<any> = async (req, res) => {
	const currentDayJs = dayjs();
	const currentDayjsDate = currentDayJs.toDate();
	const session = await validateAuthenticationWithSession(req, res);

	const db = await connectToDatabase();
	const integrationsCollection = db.collection<TIntegration>("integracoes");

	const integrationRecord = await integrationsCollection.findOne({ identificador: "CONTA_AZUL" });

	if (!integrationRecord) return res.status(404).json({ message: "Integração Conta Azul não encontrada." });

	// In case token is expired, handling token refresh
	const url = `https://api.contaazul.com/oauth2/token?grant_type=refresh_token&refresh_token=${integrationRecord.dados.tokenRefresh}`;
	const headers = {
		Authorization: `Basic ${Buffer.from(`${process.env.CONTAAZUL_CLIENT_ID}:${process.env.CONTAAZUL_CLIENT_SECRET}`).toString("base64")}`,
	};
	const { data: contaAzulResponse } = await axios.post(url, {}, { headers });
	const { refresh_token, token_type, expires_in, access_token } = contaAzulResponse;

	const newTokenExpirationDate = currentDayJs.add(expires_in, "second").toISOString();
	await integrationsCollection.updateOne(
		{ identificador: "CONTA_AZUL" },
		{
			$set: {
				dados: {
					...integrationRecord.dados,
					tokenRefresh: refresh_token,
					dataExpiracao: newTokenExpirationDate,
					tokenAcesso: access_token,
				},
			},
		},
	);

	return res.status(201).json({ data: { accessToken: access_token }, message: "Token atualizado com sucesso !" });
};

export default apiHandler({
	GET: handleAccessTokenRefresh,
});
