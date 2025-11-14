import { getContaAzulV2Tokens } from "@/lib/integrations/conta-azul/tokens";
import { apiHandler } from "@/utils/api";
import type { TIntegration } from "@/utils/schemas/integrations";
import connectToDatabase from "@/utils/services/mongodb/projects";
import axios from "axios";
import dayjs from "dayjs";
import type { NextApiHandler } from "next";
import QueryString from "qs";
import z from "zod";

const handleContaAzulAuthCallback: NextApiHandler<any> = async (req, res) => {
	console.log("[INFO] [CONTAAZULV2] [CALLBACK] Received request:", req.query);
	const { code, state } = req.query;

	if (!code || !state) return res.status(400).json({ error: "Parâmetros inválidos." });

	const db = await connectToDatabase();
	const integrationsCollection = db.collection<TIntegration>("integracoes");

	try {
		const tokens = await getContaAzulV2Tokens(code as string);
		const integrationRecord = await integrationsCollection.findOne({ identificador: "CONTA_AZUL_V2" });

		if (!integrationRecord) {
			await integrationsCollection.insertOne({
				identificador: "CONTA_AZUL_V2",
				dados: {
					tipo: "CONTA_AZUL_V2",
					tokenRefresh: tokens.refresh_token,
					tokenAcesso: tokens.access_token,
					dataExpiracao: dayjs().add(tokens.expires_in, "seconds").toISOString(),
				},
				autor: {
					id: "SYSTEM_USER",
					nome: "SISTEMA",
				},
				dataInsercao: new Date().toISOString(),
			});
			return res.status(200).json({ message: "Integração Conta Azul V2 criada com sucesso !" });
		}
		await integrationsCollection.updateOne(
			{ identificador: "CONTA_AZUL_V2" },
			{
				$set: {
					dados: {
						tipo: "CONTA_AZUL_V2",
						tokenRefresh: tokens.refresh_token,
						tokenAcesso: tokens.access_token,
						dataExpiracao: dayjs().add(tokens.expires_in, "seconds").toISOString(),
					},
				},
			},
		);

		return res.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/configuracoes?mode=integrations`);
	} catch (error) {
		console.log("[ERROR] [CONTAAZULV2] Error fetching token:", error);
		return res.status(500).json({ error: "Erro ao obter token de acesso." });
	}
};

export default apiHandler({ GET: handleContaAzulAuthCallback });
