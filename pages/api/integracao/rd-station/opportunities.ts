import { errorHandler, ErrorResponse, validateAuthenticationWithSession } from "@/utils/api";
import { formatToPhone } from "@/utils/methods/formatting";
import { TIntegrationRDStation } from "@/utils/schemas/crm/integration.schema";
import { TOpportunity } from "@/utils/schemas/crm/opportunity.schema";
import { TUser } from "@/utils/schemas/crm/user.schema";
import connectToCRMDatabase from "@/utils/services/mongodb/crm/main";
import axios from "axios";
import createHttpError from "http-errors";
import { Collection, Db, ObjectId, WithId } from "mongodb";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

type GetPayloadParams = {
	email: string;
	value: number;
	reason: string;
};

const OPERATIONS_CONFIGS = {
	SALE: {
		url: "https://api.rd.services/platform/events?event_type=sale",
		getPayload({ email, value, reason }: GetPayloadParams) {
			return {
				event_type: "SALE",
				event_family: "CDP",
				payload: {
					email: email,
					funnel_name: "default",
					value: value,
				},
			};
		},
		getHeaders(token: string) {
			return {
				accept: "application/json",
				"content-type": "application/json",
				authorization: `Bearer ${token}`,
			};
		},
	},
	OPPORTUNITY_LOST: {
		url: "https://api.rd.services/platform/events?event_type=opportunity_lost",
		getPayload({ email, value, reason }: GetPayloadParams) {
			return {
				event_type: "OPPORTUNITY_LOST",
				event_family: "CDP",
				payload: {
					email: email,
					funnel_name: "default",
					reason: reason,
				},
			};
		},
		getHeaders(token: string) {
			return {
				accept: "application/json",
				"content-type": "application/json",
				authorization: `Bearer ${token}`,
			};
		},
	},
};
type PutResponse = {
	data: string;
};
const updateOpportunities: NextApiHandler<PutResponse | ErrorResponse> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);

	const { operation, email, value, reason } = req.body;
	// Validating for valid operations
	if (typeof operation != "string") throw new createHttpError.BadRequest("Operação inválida.");
	if (operation != "SALE" && operation != "OPPORTUNITY_LOST") throw new createHttpError.BadRequest("Operação inválida");
	// Validating params given operation type
	if (typeof email != "string") throw new createHttpError.BadRequest("Tipo de email inválido.");
	if (operation == "SALE" && typeof value != "number") throw new createHttpError.BadRequest("Tipo de valor inválido.");
	if (operation == "OPPORTUNITY_LOST" && typeof reason != "string") throw new createHttpError.BadRequest("Tipo de razão inválida.");
	const db = await connectToCRMDatabase(process.env.CRM_KEY);
	const integrationsCollection: Collection<TIntegrationRDStation> = db.collection("integrations");
	// Now, able to proceed
	try {
		// Going for the update with current token
		const token = await getToken({ collection: integrationsCollection });
		console.log("TOKEN NO BLOCO TRY", token);
		const url = OPERATIONS_CONFIGS[operation].url;
		const payload = OPERATIONS_CONFIGS[operation].getPayload({ email, value, reason });
		const headers = OPERATIONS_CONFIGS[operation].getHeaders(token);
		// Simulating invalid token
		// throw new createHttpError[401]('Token inválido. Acesso não autorizado.')
		const rdResponse = await axios.post(url, payload, { headers: headers });
		console.log("RD RESPONSE NO BLOCO TRY", rdResponse.data);
		// Token is invalid, so throw to catch block for refreshed token
		if (rdResponse.status === 401) throw new createHttpError[401]("Token inválido. Acesso não autorizado.");
		return res.status(201).json({ data: "Oportunidade alterada com sucesso !" });
	} catch (error) {
		// Getting a refreshed token and going for the update
		const refreshedToken = await refreshToken({ collection: integrationsCollection });
		console.log("TOKEN NO BLOCO CATCH", refreshedToken);
		const url = OPERATIONS_CONFIGS[operation].url;
		const payload = OPERATIONS_CONFIGS[operation].getPayload({ email, value, reason });
		const headers = OPERATIONS_CONFIGS[operation].getHeaders(refreshedToken);
		const rdResponse = await axios.post(url, payload, { headers: headers });
		console.log("RD RESPONSE NO BLOCO CATCH", rdResponse.data);
		const formattedError = new createHttpError.InternalServerError("Erro ao atualizar oportunidade.");
		// If still unable to update oportunity, throwing InternalServerError
		if (rdResponse.status != 200) return errorHandler(formattedError, res);
		return res.status(201).json({ data: "Oportunidade alterada com sucesso !" });
	}
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method == "PUT") {
		await updateOpportunities(req, res);
	}
}

type GetTokenParams = {
	collection: Collection<TIntegrationRDStation>;
};
async function getToken({ collection }: GetTokenParams) {
	try {
		const integration = await collection.findOne({ identificador: "RD_STATION" });
		const token = integration?.access_token;
		if (token) return token as string;
		else throw new createHttpError.NotFound("Token não encontrado.");
	} catch (error) {
		throw error;
	}
}
type RefreshTokenParams = {
	collection: Collection<TIntegrationRDStation>;
};
async function refreshToken({ collection }: RefreshTokenParams) {
	try {
		const integration = await collection.findOne({ identificador: "RD_STATION" });
		const RD_CLIENT_ID = integration?.client_id;
		const RD_CLIENT_SECRET = integration?.client_secret;
		const RD_REFRESH_TOKEN = integration?.refresh_token;
		const rdResponse = await axios.post("https://api.rd.services/auth/token", {
			client_id: RD_CLIENT_ID,
			client_secret: RD_CLIENT_SECRET,
			refresh_token: RD_REFRESH_TOKEN,
		});
		// console.log('RD RESPONSE', rdResponse)
		if (rdResponse.status == 200) {
			const { access_token } = rdResponse.data;
			console.log("NOVO ACESS_TOKEN", access_token);
			await collection.updateOne(
				{ identificador: "RD_STATION" },
				{ $set: { access_token: access_token, dataValidacaoToken: new Date().toISOString() } },
			);
			return access_token as string;
		} else throw new createHttpError.InternalServerError("Erro ao buscar acess_token.");
	} catch (error) {
		throw error;
	}
}
