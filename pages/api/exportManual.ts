import { apiHandler } from "@/utils/api";
import { formatDateAsLocale, getProductsStr } from "@/utils/methods/formatting";
import { TContractRequest } from "@/utils/schemas/contract-requests";
import { TOpportunity } from "@/utils/schemas/crm/opportunity.schema";

import type { TProject } from "@/utils/schemas/projects";
import { TPurchaseControl } from "@/utils/schemas/purchases";
import connectToCRMDatabase from "@/utils/services/mongodb/crm/main";
import connectToProjectsDatabase from "@/utils/services/mongodb/projects";
import connectToSolicitacoesDatabase from "@/utils/services/mongodb/requests";
import dayjs from "dayjs";
import { Collection, type Db, ObjectId } from "mongodb";
import type { NextApiHandler } from "next";
import { getContractValue } from "../../utils/methods/util/projects";
import type { TUser } from "@/utils/schemas/crm/user.schema";
import ReferralCodes from "../../sellers-referral-codes.json";
const getExport: NextApiHandler<any> = async (req, res) => {
	const appDb: Db = await connectToProjectsDatabase();
	const crmDb: Db = await connectToCRMDatabase();

	const usersCollection = await crmDb.collection<TUser>("users");
	const projectsCollection = appDb.collection<TProject>("dados");

	const users = await usersCollection.find({}).toArray();

	const usersWithReferalCodes = users.map((user) => {
		const referralCode = ReferralCodes.find((code) => code._id.$oid === user._id.toString());
		return {
			updateOne: {
				filter: { _id: new ObjectId(user._id) },
				update: {
					$set: {
						codigoIndicacaoConecta: referralCode?.code || "",
					},
				},
			},
		};
	});

	const bulkwriteResponse = await usersCollection.bulkWrite(usersWithReferalCodes);

	return res.json(bulkwriteResponse);
};
export default apiHandler({
	GET: getExport,
});
