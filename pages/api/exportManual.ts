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
const getExport: NextApiHandler<any> = async (req, res) => {
	const db = await connectToProjectsDatabase();
	const projectsCollection = db.collection<TProject>("dados");

	const start = "2024-09-01T00:00:00.000Z";
	const end = "2024-12-31:59:59.999Z";
	const changesMetersInPeriod = await projectsCollection
		.find({
			"homologacao.vistoria.dataEfetivacao": {
				$gte: start,
				$lte: end,
			},
		})
		.toArray();

	const exportation = changesMetersInPeriod.map((project) => {
		return {
			QTDE: project.qtde,
			NOME: project.nomeDoContrato,
			CIDADE: project.cidade,
			UF: project.uf,
			TELEFONE: project.telefone,
			"TIPO DE SERVIÇO": project.tipoDeServico,
			"DATA ASSINATURA": formatDateAsLocale(project.contrato.dataAssinatura),
			"DATA ENTRADA DE OBRA": formatDateAsLocale(project.obra.entrada),
			"DATA SAÍDA DE OBRA": formatDateAsLocale(project.obra.saida),
			"DATA SOLICITAÇÃO DA VISTORIA": formatDateAsLocale(project.homologacao.vistoria.dataSolicitacao),
			"DATA EFETIVAÇÃO DA VISTORIA": formatDateAsLocale(project.homologacao.vistoria.dataEfetivacao),
		};
	});
	return res.json(exportation);
};
export default apiHandler({
	GET: getExport,
});
