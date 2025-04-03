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
import { formatDecimalPlaces, formatToMoney } from "@/utils/constants";
const getExport: NextApiHandler<any> = async (req, res) => {
	// const db = await connectToProjectsDatabase();
	// const projectsCollection = db.collection<TProject>("dados");
	// const fenescDateStart = "2024-04-01T00:00:00.000Z";
	// const fenescDateEnd = "2024-05-31T23:59:59.999Z";
	// const allProjects = await projectsCollection
	// 	.find({
	// 		tipoDeServico: {
	// 			$in: ["SISTEMA FOTOVOLTAICO", "AUMENTO DE SISTEMA FOTOVOLTAICO"],
	// 		},
	// 		"contrato.dataAssinatura": { $ne: null },
	// 	})
	// 	.toArray();
	// const stats = allProjects.reduce(
	// 	(acc, project) => {
	// 		acc["NÚMERO DE PROJETOS"]++;
	// 		const totalValue = getContractValue({
	// 			projectValue: project.sistema?.valorProjeto || 0,
	// 			paValue: project.padrao?.valor || 0,
	// 			structureValue: project.estruturaPersonalizada?.valor || 0,
	// 			oemValue: project.oem?.valor || 0,
	// 			insuranceValue: project.seguro?.valor || 0,
	// 		});
	// 		acc["VALOR VENDIDO"] += totalValue;
	// 		acc["POTÊNCIA VENDIDA"] += project.sistema.potPico || 0;
	// 		acc["POTÊNCIA INSTALADA"] += project.obra.saida ? project.sistema.potPico : 0;
	// 		acc["CIDADES PRESENTES"].add(project.cidade);
	// 		acc["ESTADOS PRESENTES"].add(project.uf);
	// 		return acc;
	// 	},
	// 	{
	// 		"NÚMERO DE PROJETOS": 0,
	// 		"VALOR VENDIDO": 0,
	// 		"POTÊNCIA VENDIDA": 0,
	// 		"POTÊNCIA INSTALADA": 0,
	// 		"CIDADES PRESENTES": new Set<string>(),
	// 		"ESTADOS PRESENTES": new Set<string>(),
	// 	},
	// );
	// const fenestProjects2024 = await projectsCollection
	// 	.find({
	// 		tipoDeServico: {
	// 			$in: ["SISTEMA FOTOVOLTAICO", "AUMENTO DE SISTEMA FOTOVOLTAICO"],
	// 		},
	// 		"contrato.dataAssinatura": { $gte: fenescDateStart, $lte: fenescDateEnd },
	// 	})
	// 	.toArray();
	// const fenestStats = fenestProjects2024.reduce(
	// 	(acc, project) => {
	// 		acc["NÚMERO DE PROJETOS"]++;
	// 		const totalValue = getContractValue({
	// 			projectValue: project.sistema?.valorProjeto || 0,
	// 			paValue: project.padrao?.valor || 0,
	// 			structureValue: project.estruturaPersonalizada?.valor || 0,
	// 			oemValue: project.oem?.valor || 0,
	// 			insuranceValue: project.seguro?.valor || 0,
	// 		});
	// 		acc["VALOR VENDIDO"] += totalValue;
	// 		acc["POTÊNCIA VENDIDA"] += project.sistema.potPico || 0;
	// 		acc["POTÊNCIA INSTALADA"] += project.obra.saida ? project.sistema.potPico : 0;
	// 		acc["CIDADES PRESENTES"].add(project.cidade);
	// 		acc["ESTADOS PRESENTES"].add(project.uf);
	// 		return acc;
	// 	},
	// 	{
	// 		"NÚMERO DE PROJETOS": 0,
	// 		"VALOR VENDIDO": 0,
	// 		"POTÊNCIA VENDIDA": 0,
	// 		"POTÊNCIA INSTALADA": 0,
	// 		"CIDADES PRESENTES": new Set<string>(),
	// 		"ESTADOS PRESENTES": new Set<string>(),
	// 	},
	// );
	// const fenescDateStart2022 = "2022-04-01T00:00:00.000Z";
	// const fenescDateEnd2022 = "2022-05-31T23:59:59.999Z";
	// const fenestProjects2022 = await projectsCollection
	// 	.find({
	// 		tipoDeServico: {
	// 			$in: ["SISTEMA FOTOVOLTAICO", "AUMENTO DE SISTEMA FOTOVOLTAICO"],
	// 		},
	// 		"contrato.status": "ASSINADO",
	// 		"contrato.dataAssinatura": { $gte: fenescDateStart2022, $lte: fenescDateEnd2022 },
	// 	})
	// 	.toArray();
	// const fenestStats2022 = fenestProjects2022.reduce(
	// 	(acc, project) => {
	// 		acc["NÚMERO DE PROJETOS"]++;
	// 		const totalValue = getContractValue({
	// 			projectValue: project.sistema?.valorProjeto || 0,
	// 			paValue: project.padrao?.valor || 0,
	// 			structureValue: project.estruturaPersonalizada?.valor || 0,
	// 			oemValue: project.oem?.valor || 0,
	// 			insuranceValue: project.seguro?.valor || 0,
	// 		});
	// 		acc["VALOR VENDIDO"] += totalValue;
	// 		acc["POTÊNCIA VENDIDA"] += project.sistema.potPico || 0;
	// 		acc["POTÊNCIA INSTALADA"] += project.obra.saida ? project.sistema.potPico : 0;
	// 		acc["CIDADES PRESENTES"].add(project.cidade);
	// 		acc["ESTADOS PRESENTES"].add(project.uf);
	// 		return acc;
	// 	},
	// 	{
	// 		"NÚMERO DE PROJETOS": 0,
	// 		"VALOR VENDIDO": 0,
	// 		"POTÊNCIA VENDIDA": 0,
	// 		"POTÊNCIA INSTALADA": 0,
	// 		"CIDADES PRESENTES": new Set<string>(),
	// 		"ESTADOS PRESENTES": new Set<string>(),
	// 	},
	// );
	// return res.json({
	// 	"NA NOSSA HISTÓRIA": {
	// 		...stats,
	// 		"VALOR VENDIDO": formatToMoney(stats["VALOR VENDIDO"]),
	// 		"POTÊNCIA VENDIDA": `${formatDecimalPlaces(stats["POTÊNCIA VENDIDA"])} kWp`,
	// 		"POTÊNCIA INSTALADA": `${formatDecimalPlaces(stats["POTÊNCIA INSTALADA"])} kWp`,
	// 		"Nº DE CIDADES ATENDIDAS": stats["CIDADES PRESENTES"].size,
	// 		"Nº DE ESTADOS ATENDIDOS": stats["ESTADOS PRESENTES"].size,
	// 		"CIDADES PRESENTES": Array.from(stats["CIDADES PRESENTES"]),
	// 		"ESTADOS PRESENTES": Array.from(stats["ESTADOS PRESENTES"]),
	// 	},
	// 	"FENESC 2024": {
	// 		...fenestStats,
	// 		"VALOR VENDIDO": formatToMoney(fenestStats["VALOR VENDIDO"]),
	// 		"POTÊNCIA VENDIDA": `${formatDecimalPlaces(fenestStats["POTÊNCIA VENDIDA"])} kWp`,
	// 		"POTÊNCIA INSTALADA": `${formatDecimalPlaces(fenestStats["POTÊNCIA INSTALADA"])} kWp`,
	// 		"Nº DE CIDADES ATENDIDAS": fenestStats["CIDADES PRESENTES"].size,
	// 		"Nº DE ESTADOS ATENDIDOS": fenestStats["ESTADOS PRESENTES"].size,
	// 		"CIDADES PRESENTES": Array.from(fenestStats["CIDADES PRESENTES"]),
	// 		"ESTADOS PRESENTES": Array.from(fenestStats["ESTADOS PRESENTES"]),
	// 	},
	// 	"FENESC 2022": {
	// 		...fenestStats2022,
	// 		"VALOR VENDIDO": formatToMoney(fenestStats2022["VALOR VENDIDO"]),
	// 		"POTÊNCIA VENDIDA": `${formatDecimalPlaces(fenestStats2022["POTÊNCIA VENDIDA"])} kWp`,
	// 		"POTÊNCIA INSTALADA": `${formatDecimalPlaces(fenestStats2022["POTÊNCIA INSTALADA"])} kWp`,
	// 		"Nº DE CIDADES ATENDIDAS": fenestStats2022["CIDADES PRESENTES"].size,
	// 		"Nº DE ESTADOS ATENDIDOS": fenestStats2022["ESTADOS PRESENTES"].size,
	// 		"CIDADES PRESENTES": Array.from(fenestStats2022["CIDADES PRESENTES"]),
	// 		"ESTADOS PRESENTES": Array.from(fenestStats2022["ESTADOS PRESENTES"]),
	// 	},
	// });

	return res.json("DESATIVADA");
};
export default apiHandler({
	GET: getExport,
});
