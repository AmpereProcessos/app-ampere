import { contractVariables } from "@/lib/contract-generation/variables";
import { formatAsSlug, formatDateAsLocale } from "@/utils/methods/formatting";
import type { TContractTemplateVariable } from "@/utils/schemas/contract-templates-variables";
import type { TFileReference } from "@/utils/schemas/crm/file-reference.schema";
import type { TMaterialUpdateRegistry } from "@/utils/schemas/material-updates-registry";
import type { TMaterial } from "@/utils/schemas/materials";
import type { TProject } from "@/utils/schemas/projects";
import type { TServiceOrder } from "@/utils/schemas/service-order";
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
	const warehouseDatabase = await connectToWarehouseDatabase();
	const warehouseFormsCollection = warehouseDatabase.collection<TNewWarehouseFormulary>("formularios");
	const materialsCollection = warehouseDatabase.collection<TMaterial>("material");
	const logsCollection = warehouseDatabase.collection<TMaterialUpdateRegistry>("alteracoes");

	const allWarehouseForms = await warehouseFormsCollection.find({}).toArray();
	const allWarehouseLogs = await logsCollection.find({}).toArray();

	const bulkwriteLogs: AnyBulkWriteOperation<TMaterialUpdateRegistry>[] = allWarehouseLogs
		.map((log) => {
			const correspondingForm = allWarehouseForms.find((form) => form._id.toString() === log.idFormulario);
			return {
				updateOne: {
					filter: { _id: new ObjectId(log._id) },
					update: { $set: { formulario: correspondingForm ? { id: correspondingForm._id.toString(), titulo: correspondingForm.titulo } : null } },
				},
			};
		})
		.filter((b) => !!b);

	const bulkwriteResponse = await logsCollection.bulkWrite(bulkwriteLogs);
	return res.status(200).json({ bulkwriteResponse });
}
