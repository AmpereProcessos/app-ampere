import { apiHandler } from "@/utils/api";
import { formatDateAsLocale } from "@/utils/methods/formatting";
import type { TCertification, TCertificationReference } from "@/utils/schemas/certifications";
import connectToAdministrationDatabase from "@/utils/services/mongodb/administration";
import { novu } from "@/utils/services/novu";
import { NOVU_WORKFLOW_IDS, type TGeneralNotificationPayload } from "@/utils/services/novu/workflows";
import dayjs from "dayjs";
import type { NextApiHandler } from "next";

const handleNotifyExpiringCertificationReferences = async () => {
	const weekStart = dayjs().startOf("week").toISOString();
	const weekEnd = dayjs().endOf("week").toISOString();
	const admDb = await connectToAdministrationDatabase();
	const certificationsCollection = admDb.collection<TCertificationReference>("certificacoes-referencias");

	const expiringCertificationReferences = await certificationsCollection
		.find({
			dataFim: { $gte: weekStart, $lte: weekEnd },
		})
		.toArray();

	const notificationsPromise = expiringCertificationReferences.flatMap((reference) => {
		console.log("[INFO] [NOTIFY EXPIRING CERTIFICATION REFERENCES] Handling reference...", {
			referenceTitle: reference.documento.titulo,
			documentTitle: reference.documento.titulo,
		});
		const certificationExpirationDate = reference.dataFim;
		const certificationExpiresToday = dayjs(certificationExpirationDate).isSame(dayjs(), "day");
		const certificationIsExpired = dayjs(certificationExpirationDate).isBefore(dayjs());
		const certificationDaysUntilExpiration = certificationIsExpired ? 0 : dayjs(certificationExpirationDate).diff(dayjs(), "days");
		return reference.notificados.map(async (user) => {
			console.log("[INFO] [NOTIFY EXPIRING CERTIFICATION REFERENCES] Notifying user...", {
				userId: user.id,
				userName: user.nome,
				userEmail: user.email,
			});
			const novuPayload: TGeneralNotificationPayload = {
				subject: certificationIsExpired
					? "DOCUMENTO EXPIRADO"
					: certificationExpiresToday
						? "DOCUMENTO VENCENDO HOJE"
						: "DOCUMENTO PRÓXIMO DA DATA DE EXPIRAÇÃO",
				body: certificationIsExpired
					? `$O documento ${reference.documento.titulo} expirou em ${formatDateAsLocale(certificationExpirationDate, true)}`
					: certificationExpiresToday
						? `O documento ${reference.documento.titulo} vence hoje`
						: `O documento ${reference.documento.titulo} expira em ${certificationDaysUntilExpiration} dias`,
				text: certificationIsExpired
					? `O documento ${reference.documento.titulo} expirou em ${formatDateAsLocale(certificationExpirationDate, true)}`
					: certificationExpiresToday
						? `O documento ${reference.documento.titulo} vence hoje`
						: `O documento ${reference.documento.titulo} expira em ${certificationDaysUntilExpiration} dias`,
				primaryAction: {
					label: "CONFERIR",
					redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/configuracoes`,
				},
			};
			const novuResponse = await novu.trigger({
				to: user.id,
				workflowId: NOVU_WORKFLOW_IDS.NOTIFY_GENERAL_NOTIFICATION,
				payload: novuPayload,
			});
			console.log("[INFO] [NOTIFY EXPIRING CERTIFICATION REFERENCES] Novu response...", novuResponse.result);
			return novuResponse.result;
		});
	});
	const notificationsResults = await Promise.all(notificationsPromise);
	console.log("[INFO] [NOTIFY EXPIRING CERTIFICATION REFERENCES] Notifications results...", notificationsResults);

	return {
		data: {},
		message: "Notificações enviadas com sucesso !",
	};
};
export type TNotifyExpiringCertificationReferencesOutput = Awaited<ReturnType<typeof handleNotifyExpiringCertificationReferences>>;
const notifyExpiringCertificationReferencesHandler: NextApiHandler<TNotifyExpiringCertificationReferencesOutput> = async (req, res) => {
	const result = await handleNotifyExpiringCertificationReferences();
	res.status(200).json(result);
};

export default apiHandler({
	GET: notifyExpiringCertificationReferencesHandler,
});
