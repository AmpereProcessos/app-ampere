import { contractVariables } from "@/lib/contract-generation/variables";
import { formatAsSlug, formatDateAsLocale } from "@/utils/methods/formatting";
import type { TContractTemplateVariable } from "@/utils/schemas/contract-templates-variables";
import type { TFileReference } from "@/utils/schemas/crm/file-reference.schema";
import type { TMaterialUpdateRegistry } from "@/utils/schemas/material-updates-registry";
import type { TMaterial } from "@/utils/schemas/materials";
import type { TProject } from "@/utils/schemas/projects";
import type { TServiceOrder } from "@/utils/schemas/service-order";
import type { TEmployee } from "@/utils/schemas/users";
import type { TNewWarehouseFormulary } from "@/utils/schemas/warehouse-formularies";
import connectToAdministrationDatabase from "@/utils/services/mongodb/administration";
import connectToCRMDatabase from "@/utils/services/mongodb/crm/main";
import connectToDatabase from "@/utils/services/mongodb/projects";
import connectToWarehouseDatabase from "@/utils/services/mongodb/warehouse";
import axios from "axios";
import { AlignmentType, Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";
import { type AnyBulkWriteOperation, ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const admDb = await connectToAdministrationDatabase();
	const usersCollection = await admDb.collection<TEmployee>("colaboradores");
	const users = await usersCollection.find({}).toArray();

	const bulkwriteUsers: AnyBulkWriteOperation<TEmployee>[] = users.map((user) => {
		return {
			updateOne: {
				filter: { _id: new ObjectId(user._id) },
				update: {
					$set: {
						permissoes: { ...user.permissoes, chats: { visualizar: false, enviarMensagens: false } },
					},
				},
			},
		};
	});

	const bulkwriteResponse = await usersCollection.bulkWrite(bulkwriteUsers);
	return res.status(200).json({ bulkwriteResponse });
}
