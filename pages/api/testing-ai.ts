import { contractVariables } from "@/lib/contract-generation/variables";
import { formatAsSlug } from "@/utils/methods/formatting";
import type { TContractTemplateVariable } from "@/utils/schemas/contract-templates-variables";
import type { TProject } from "@/utils/schemas/projects";
import connectToAdministrationDatabase from "@/utils/services/mongodb/administration";
import connectToDatabase from "@/utils/services/mongodb/projects";
import axios from "axios";
import { AlignmentType, Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const db = await connectToAdministrationDatabase();
	const variablesCollection = db.collection<TContractTemplateVariable>("templates-contrato-variaveis");

	const insertedVariables = await variablesCollection.insertMany(
		contractVariables.map((v) => ({
			titulo: v.label,
			categoria: "NATIVA",
			descricao: v.description || "",
			identificador: formatAsSlug(v.label),
		})),
	);
	return res.json({ message: "Variáveis de template de contrato criadas com sucesso.", insertedVariables: insertedVariables.insertedIds });
}
