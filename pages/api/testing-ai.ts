import { contractVariables } from "@/lib/contract-generation/variables";
import { formatAsSlug, formatDateAsLocale } from "@/utils/methods/formatting";
import type { TContractTemplateVariable } from "@/utils/schemas/contract-templates-variables";
import type { TFileReference } from "@/utils/schemas/crm/file-reference.schema";
import type { TMaterial } from "@/utils/schemas/materials";
import type { TProject } from "@/utils/schemas/projects";
import type { TServiceOrder } from "@/utils/schemas/service-order";
import connectToAdministrationDatabase from "@/utils/services/mongodb/administration";
import connectToCRMDatabase from "@/utils/services/mongodb/crm/main";
import connectToDatabase from "@/utils/services/mongodb/projects";
import connectToWarehouseDatabase from "@/utils/services/mongodb/warehouse";
import axios from "axios";
import { AlignmentType, Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const warehouseDatabase = await connectToWarehouseDatabase();
	const materialsCollection = warehouseDatabase.collection<TMaterial>("material");

	const materials = await materialsCollection
		.find({
			idEquipamento: null,
		})
		.toArray();

	return res.status(200).json(
		materials.map((m) => ({
			ID: m._id.toString(),
			NOME: m.nome,
			IMAGEM_URL: m.imagemUrl,
			UNIDADE: m.grandeza,
			FORNECEDORES: (m.fornecedores || []).map((f) => f.nome).join(", "),
			SINONIMOS: "",
		})),
	);
}
