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

const createNotification: NextApiHandler<PostResponse> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	console.log("[INFO] [CREATE NOTIFICATION] Starting notification creation...", {
		userId: session.user.id,
		userName: session.user.nome,
	});

	const notification = InsertNotificationSchema.parse(req.body);
	const db: Db = await connectToDatabase();
	const collection: Collection<TNotification> = db.collection("notificacoes");

	// Inserting notification in novu
	const novuPayload: TGeneralNotificationPayload = {
		subject: notification.mensagem,
		body: notification.mensagem,
		text: notification.mensagem,
		primaryAction: {
			label: "Ver notificação",
			redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/notificacoes`,
		},
		authorAvatarUrl: session.user.avatar_url ?? undefined,
	};
	const novuResponse = await novu.trigger({
		to: getNovuSubscriberId(notification.destinatario),
		workflowId: NOVU_WORKFLOW_IDS.NOTIFY_GENERAL_NOTIFICATION,
		payload: novuPayload,
	});
	console.log("[INFO] [CREATE NOTIFICATION] Novu response...", novuResponse.result);
	const insertResponse = await collection.insertOne({ ...notification, dataDeEnvio: new Date() });
	if (!insertResponse.acknowledged) throw new createHttpError.BadRequest("Oops, houve um erro ao criar notificação.");
	console.log("[SUCCESS] [CREATE NOTIFICATION] Notification created successfully !", {
		notificationId: insertResponse.insertedId.toString(),
	});
	return res.status(201).json({ data: { insertedId: insertResponse.insertedId.toString() }, message: "Notificação criada com sucesso !" });
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
	POST: createNotification,
	PUT: editNotification,
});
