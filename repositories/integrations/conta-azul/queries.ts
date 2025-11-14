import { TIntegration } from "@/utils/schemas/integrations";
import axios from "axios";
import dayjs from "dayjs";
import { Collection } from "mongodb";

type GetContaAzulAccessTokenParams = {
	collection: Collection<TIntegration>;
};
export async function getContaAzulAccessToken({ collection }: GetContaAzulAccessTokenParams) {
	try {
		const currentDayJs = dayjs();
		const currentDayjsDate = currentDayJs.toDate();
		const integrationRecord = await collection.findOne({ identificador: "CONTA_AZUL" });
		if (!integrationRecord) throw new Error("Integração Conta Azul não encontrada.");

		// Checking for possible token expiration
		const tokenExpirationDate = new Date(integrationRecord.dados.dataExpiracao);
		if (currentDayjsDate >= tokenExpirationDate) {
			// In case token is expired, handling token refresh
			const url = `https://api.contaazul.com/oauth2/token?grant_type=refresh_token&refresh_token=${integrationRecord.dados.tokenRefresh}`;
			const headers = {
				Authorization: `Basic ${Buffer.from(`${process.env.CONTAAZUL_CLIENT_ID}:${process.env.CONTAAZUL_CLIENT_SECRET}`).toString("base64")}`,
			};
			const { data: contaAzulResponse } = await axios.post(url, {}, { headers });
			const { refresh_token, token_type, expires_in, access_token } = contaAzulResponse;

			const newTokenExpirationDate = currentDayJs.add(expires_in, "second").toISOString();
			await collection.updateOne(
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

			return access_token; // Returning the new access token
		}
		// If token is not expired, returning the existing access token
		return integrationRecord.dados.tokenAcesso;
	} catch (error) {
		throw error;
	}
}
