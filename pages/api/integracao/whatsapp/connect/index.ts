import type { TAuthSession } from "@/lib/authentication/types";
import { FacebookOAuth } from "@/lib/oauth";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import type { TIntegration } from "@/utils/schemas/integrations";
import connectToDatabase from "@/utils/services/mongodb/projects";
import * as arctic from "arctic";
import createHttpError from "http-errors";
import type { NextApiHandler } from "next";

async function getWhatsappIntegration({ session }: { session: TAuthSession }) {
	const db = await connectToDatabase();
	const collection = db.collection<TIntegration>("integracoes");
	const integration = await collection.findOne({ identificador: "WHATSAPP" });
	if (!integration || integration.identificador !== "WHATSAPP" || integration.dados.tipo !== "WHATSAPP")
		return {
			data: null,
		};
	return {
		data: {
			_id: integration._id.toString(),
			identificador: "WHATSAPP",
			dados: {
				tipo: "WHATSAPP",
				token: integration.dados.token,
				dataExpiracao: integration.dados.dataExpiracao,
				metaAutorId: integration.dados.metaAutorId,
				metaEscopo: integration.dados.metaEscopo,
				telefones: integration.dados.telefones,
			},
			autor: integration.autor,
			dataInsercao: integration.dataInsercao,
		},
	};
}
export type TGetWhatsappIntegrationOutput = Awaited<ReturnType<typeof getWhatsappIntegration>>;

const getWhatsappIntegrationHandler: NextApiHandler<TGetWhatsappIntegrationOutput> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const result = await getWhatsappIntegration({ session });
	return res.status(200).json(result);
};

export default apiHandler({
	GET: getWhatsappIntegrationHandler,
});
