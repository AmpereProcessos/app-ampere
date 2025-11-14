import { refreshContaAzulV2AccessToken } from "@/lib/integrations/conta-azul/tokens";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import type { TIntegration } from "@/utils/schemas/integrations";
import connectToDatabase from "@/utils/services/mongodb/projects";
import dayjs from "dayjs";
import type { NextApiRequest, NextApiResponse } from "next";

async function getContaAzulV2AccessToken() {
	const db = await connectToDatabase();
	const integrationsCollection = db.collection<TIntegration>("integracoes");

	const integrationRecord = await integrationsCollection.findOne({ identificador: "CONTA_AZUL_V2" });

	if (!integrationRecord) {
		return {
			data: null,
			message: "Integração Conta Azul V2 não encontrada.",
		};
	}

	if (integrationRecord.dados.tipo !== "CONTA_AZUL_V2") throw new Error("Integração Conta Azul V2 não encontrada.");
	return {
		data: {
			_id: integrationRecord._id.toString(),
			identificador: integrationRecord.identificador,
			dados: integrationRecord.dados,
			autor: integrationRecord.autor,
			dataInsercao: integrationRecord.dataInsercao,
		},
	};
}
export type TGetContaAzulV2IntegrationOutput = Awaited<ReturnType<typeof getContaAzulV2AccessToken>>;

async function getContaAzulV2AccessTokenHandler(req: NextApiRequest, res: NextApiResponse) {
	await validateAuthenticationWithSession(req, res);
	const response = await getContaAzulV2AccessToken();
	return res.status(200).json(response);
}

async function getRefreshContaAzulV2AccessToken() {
	const db = await connectToDatabase();
	const integrationsCollection = db.collection<TIntegration>("integracoes");

	const integrationRecord = await integrationsCollection.findOne({ identificador: "CONTA_AZUL_V2" });

	if (!integrationRecord || integrationRecord.dados.tipo !== "CONTA_AZUL_V2") throw new Error("Integração Conta Azul V2 não encontrada.");

	const newTokens = await refreshContaAzulV2AccessToken(integrationRecord.dados.tokenRefresh);

	await integrationsCollection.updateOne(
		{ identificador: "CONTA_AZUL_V2" },
		{
			$set: {
				dados: {
					tipo: "CONTA_AZUL_V2",
					tokenAcesso: newTokens.access_token,
					tokenRefresh: newTokens.refresh_token,
					dataExpiracao: dayjs().add(newTokens.expires_in, "seconds").toISOString(),
				},
			},
		},
	);

	return {
		data: "Token de acesso atualizado com sucesso.",
		message: "Token de acesso atualizado com sucesso.",
	};
}
export type TGetRefreshContaAzulV2IntegrationOutput = Awaited<ReturnType<typeof getRefreshContaAzulV2AccessToken>>;

async function getRefreshContaAzulV2AccessTokenHandler(req: NextApiRequest, res: NextApiResponse) {
	await validateAuthenticationWithSession(req, res);
	const response = await getRefreshContaAzulV2AccessToken();
	return res.status(200).json(response);
}

async function deleteContaAzulV2Integration() {
	const db = await connectToDatabase();
	const integrationsCollection = db.collection<TIntegration>("integracoes");
	await integrationsCollection.deleteMany({ identificador: "CONTA_AZUL_V2" });
	return {
		data: "Integração Conta Azul V2 deletada com sucesso.",
		message: "Integração Conta Azul V2 deletada com sucesso.",
	};
}

async function deleteContaAzulV2IntegrationHandler(req: NextApiRequest, res: NextApiResponse) {
	await validateAuthenticationWithSession(req, res);
	const response = await deleteContaAzulV2Integration();
	return res.status(200).json(response);
}

export default apiHandler({
	GET: getContaAzulV2AccessTokenHandler,
	DELETE: deleteContaAzulV2IntegrationHandler,
	POST: getRefreshContaAzulV2AccessTokenHandler,
});
