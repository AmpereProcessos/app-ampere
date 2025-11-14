import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import { InsertNotificationSchema, type TNotification } from "@/utils/schemas/notifications";
import connectToDatabase from "@/utils/services/mongodb/projects";
import { novu } from "@/utils/services/novu";
import { getNovuSubscriberId } from "@/utils/services/novu/config";
import { NOVU_WORKFLOW_IDS, type TGeneralNotificationPayload } from "@/utils/services/novu/workflows";
import dayjs from "dayjs";
import createHttpError from "http-errors";
import { type Collection, type Db, ObjectId } from "mongodb";
import type { NextApiHandler } from "next";
import type { TAuthSession } from "@/lib/authentication/types";
import { z } from "zod";

type GetResponse = {
	data: TNotification[] | TNotification;
};

const getNotifications: NextApiHandler<GetResponse> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const { recipientId } = req.query;
	if (!recipientId || typeof recipientId !== "string" || !ObjectId.isValid(recipientId)) throw new createHttpError.BadRequest("ID inválido.");

	const currentDate = dayjs();
	const dateWithMargin = currentDate.subtract(14, "days").toDate();

	const db: Db = await connectToDatabase();
	const collection: Collection<TNotification> = db.collection("notificacoes");

	const notifications = await collection
		.find({ destinatario: recipientId, $or: [{ lido: false }, { dataDeLeitura: { $gte: dateWithMargin } }] }, { sort: { lido: 1, dataLeitura: -1 } })
		.toArray();
	return res.status(200).json({ data: notifications });
};

type PostResponse = {
	data: {
		insertedId: string;
	};
	message: string;
};

const CreateNotificationInputSchema = z.object({
	notificadosIds: z.array(
		z.string({
			required_error: "ID do destinatário não informado.",
			invalid_type_error: "Tipo não válido para ID do destinatário.",
		}),
	),
	assunto: z.string({
		required_error: "Assunto não informado.",
		invalid_type_error: "Tipo não válido para assunto.",
	}),
	corpo: z.string({
		required_error: "Corpo não informado.",
		invalid_type_error: "Tipo não válido para corpo.",
	}),
	acaoPrimaria: z
		.object({
			titulo: z.string({
				required_error: "Título não informado.",
				invalid_type_error: "Tipo não válido para título.",
			}),
			link: z.string({
				required_error: "Link não informado.",
				invalid_type_error: "Tipo não válido para link.",
			}),
		})
		.optional()
		.nullable(),
	enviarSMS: z
		.boolean({
			required_error: "Envio de SMS não informado.",
			invalid_type_error: "Tipo não válido para envio de SMS.",
		})
		.optional(),
	enviarEmail: z
		.boolean({
			required_error: "Envio de e-mail não informado.",
			invalid_type_error: "Tipo não válido para envio de e-mail.",
		})
		.optional(),
});
export type TCreateNotificationInput = z.infer<typeof CreateNotificationInputSchema>;
async function createNotificationInNovu({ payload, session }: { payload: TCreateNotificationInput; session: TAuthSession }) {
	console.log("[INFO] [CREATE NOTIFICATION] Starting notification creation...", {
		userId: session.user.id,
		userName: session.user.nome,
	});

	// Inserting notification in novu
	const novuPayload: TGeneralNotificationPayload = {
		subject: payload.assunto,
		body: payload.corpo,
		text: payload.corpo,
		primaryAction: payload.acaoPrimaria
			? {
					label: payload.acaoPrimaria.titulo,
					redirectUrl: payload.acaoPrimaria.link,
				}
			: undefined,
		authorAvatarUrl: session.user.avatar_url ?? undefined,
	};
	const novuResponse = await novu.trigger({
		to: payload.notificadosIds.map((id) => getNovuSubscriberId(id)),
		workflowId: NOVU_WORKFLOW_IDS.NOTIFY_GENERAL_NOTIFICATION,
		payload: novuPayload,
	});
	console.log("[INFO] [CREATE NOTIFICATION] Novu response...", novuResponse.result);

	return {
		data: {
			insertedId: novuResponse.result.transactionId ?? "",
		},
		message: "Notificação criada com sucesso !",
	};
}
export type TCreateNotificationOutput = Awaited<ReturnType<typeof createNotificationInNovu>>;
const createNotificationHandler: NextApiHandler<PostResponse> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const payload = CreateNotificationInputSchema.parse(req.body);
	const result = await createNotificationInNovu({ payload, session });
	return res.status(201).json(result);
};

type PutResponse = {
	data: string;
	message: string;
};

const editNotification: NextApiHandler<PutResponse> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);

	const { id } = req.query;
	if (!id || typeof id !== "string" || !ObjectId.isValid(id)) throw new createHttpError.BadRequest("ID inválido.");
	console.log("NOTIFICAÇÃO", req.body);
	const notification = InsertNotificationSchema.partial().parse(req.body);
	const update = {
		...notification,
		dataDeLeitura: notification.dataDeLeitura ? new Date(notification.dataDeLeitura) : undefined,
	};
	const db: Db = await connectToDatabase();
	const collection: Collection<TNotification> = db.collection("notificacoes");

	const updateResponse = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { ...update } });

	if (!updateResponse.acknowledged) throw new createHttpError.InternalServerError("Oops, houve um erro desconhecido ao atualizar notificação.");

	return res.status(201).json({ data: "Notificação atualizada com sucesso !", message: "Notificação atualizada com sucesso !" });
};

export default apiHandler({
	GET: getNotifications,
	POST: createNotificationHandler,
	PUT: editNotification,
});
