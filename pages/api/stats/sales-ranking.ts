import { apiHandler } from "@/utils/api";
import type { TUser } from "@/utils/schemas/crm/user.schema";
import type { TProject } from "@/utils/schemas/projects";
import connectToCRMDatabase from "@/utils/services/mongodb/crm/main";
import connectToDatabase from "@/utils/services/mongodb/projects";
import type { NextApiHandler } from "next";
import dayjs from "dayjs";
import { z } from "zod";
import { SalesRakingQueryParams, type TSalesRakingOutput } from "@/utils/schemas/stats";

const handleGetSalesRanking: NextApiHandler<TSalesRakingOutput> = async (req, res) => {
	const { type: typeString, rankBy: rankByString, projectTypes: projectTypesString } = req.query;

	const params = SalesRakingQueryParams.parse({
		type: typeString as unknown,
		rankBy: rankByString as unknown,
		projectTypes: projectTypesString as unknown,
	});

	console.log("[INFO] Get sales ranking params", params);
	const currentDate = dayjs();
	const currentMonth = currentDate.month();
	const currentSemesterMonthStart = currentMonth < 6 ? 0 : 6;

	const PERIOD_MAP = {
		"current-month": {
			startDate: currentDate.startOf("month").subtract(3, "hours").toDate(),
			endDate: currentDate.endOf("month").subtract(3, "hours").toDate(),
		},
		"current-semester": {
			startDate: currentDate.set("month", currentSemesterMonthStart).startOf("month").toDate(),
			endDate: currentDate
				.set("month", currentSemesterMonthStart + 5)
				.endOf("month")
				.subtract(3, "hours") // Fixing timezone issue
				.toDate(),
		},
		"current-year": {
			startDate: currentDate.startOf("year").subtract(3, "hours").toDate(),
			endDate: currentDate.endOf("year").subtract(3, "hours").toDate(),
		},
	};

	const RANK_BY_MAP = {
		"sales-total-qty": {
			field: "qtdeVendida",
			sort: -1,
		},
		"sales-total-value": {
			field: "valorTotal",
			sort: -1,
		},
		"sales-total-power": {
			field: "potenciaVendida",
			sort: -1,
		},
	};
	const { startDate, endDate } = PERIOD_MAP[params.type];
	const { field, sort } = RANK_BY_MAP[params.rankBy];

	console.log("[INFO] Period", { startDate, endDate });
	console.log("[INFO] Rank by", { field, sort });

	const crmDb = await connectToCRMDatabase();
	const crmCollection = crmDb.collection<TUser>("users");

	const projectsDb = await connectToDatabase();
	const projectsCollection = projectsDb.collection<TProject>("dados");

	const users = await crmCollection
		.find(
			{},
			{
				projection: {
					nome: 1,
					avatar_url: 1,
				},
			},
		)
		.toArray();
	const aggreagated = (await projectsCollection
		.aggregate([
			{
				$match: {
					tipoDeServico: { $in: params.projectTypes },
					"contrato.dataAssinatura": { $gte: startDate.toISOString(), $lte: endDate.toISOString() },
				},
			},
			{
				$group: {
					_id: "$vendedor.nome",
					qtdeVendida: {
						$count: {},
					},
					potenciaVendida: {
						$sum: "$sistema.potPico",
					},
					valorProjetoVendido: {
						$sum: "$sistema.valorProjeto",
					},
					valorOeMVendido: {
						$sum: "$oem.valor",
					},
					valorPadraoVendido: {
						$sum: "$padrao.valor",
					},
					valorEstruturaPersonalizadaVendido: {
						$sum: "$estruturaPersonalizada.valor",
					},
					valorSeguroVendido: {
						$sum: "$seguro.valor",
					},
					valorTotal: {
						$sum: {
							$add: [
								{ $ifNull: ["$sistema.valorProjeto", 0] },
								{ $ifNull: ["$oem.valor", 0] },
								{ $ifNull: ["$padrao.valor", 0] },
								{ $ifNull: ["$estruturaPersonalizada.valor", 0] },
								{ $ifNull: ["$seguro.valor", 0] },
							],
						},
					},
				},
			},
			{
				$sort: {
					[field]: sort,
				},
			},
		])
		.toArray()) as {
		_id: string;
		qtdeVendida: number;
		potenciaVendida: number;
		valorTotal: number;
	}[];

	const fiveFirst = aggreagated.slice(0, 5).map((item) => {
		const equivalentUser = users.find((user) => user.nome === item._id);
		return {
			name: equivalentUser?.nome || "NÃO DEFINIDO",
			avatar: equivalentUser?.avatar_url || undefined,
			totalSoldValue: item.valorTotal,
			totalSoldQty: item.qtdeVendida,
			totalSoldPower: item.potenciaVendida,
		};
	});
	const others = aggreagated.slice(5).map((item, index) => {
		const equivalentUser = users.find((user) => user.nome === item._id);
		return {
			index: index + 1,
			name: equivalentUser?.nome || "NÃO DEFINIDO",
			avatar: equivalentUser?.avatar_url || undefined,
			totalSoldValue: item.valorTotal,
			totalSoldQty: item.qtdeVendida,
			totalSoldPower: item.potenciaVendida,
		};
	});

	console.log("[INFO] Others", others);
	const output = {
		data: {
			first: fiveFirst[0] || undefined,
			second: fiveFirst[1] || undefined,
			third: fiveFirst[2] || undefined,
			fourth: fiveFirst[3] || undefined,
			fifth: fiveFirst[4] || undefined,
			others,
		},
	};

	res.status(200).json(output);
};

export default apiHandler({
	GET: handleGetSalesRanking,
});
