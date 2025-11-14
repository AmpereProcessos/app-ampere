import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import type { TProject } from "@/utils/schemas/projects";
import connectToDatabase from "@/utils/services/mongodb/projects";
import createHttpError from "http-errors";
import type { NextApiHandler } from "next";
import { z } from "zod";

const EnergyPAStatsQueryParams = z.object({
	after: z.string({ required_error: "A data de início é obrigatória." }).datetime({ message: "A data de início deve ser uma data válida." }),
	before: z.string({ required_error: "A data de término é obrigatória." }).datetime({ message: "A data de término deve ser uma data válida." }),
});
export type TEnergyPAStatsInput = z.infer<typeof EnergyPAStatsQueryParams>;
export type TEnergyPAStatsOutput = {
	data: {
		totalAdequacoes: number;
		totalAdequacoesPendentes: number;
		totalAdequacoesPendentesPagas: number;
		adequacoesConcluidas: number;
		porResponsabilidade: {
			tipo: string;
			totalAdequacoes: number;
			totalAdequacoesPendentes: number;
			totalAdequacoesPendentesPagas: number;
		}[];
	};
};

type TEnergyPAStatsReduced = {
	totalAdequacoes: number;
	totalAdequacoesPendentes: number;
	totalAdequacoesPendentesPagas: number;
	adequacoesConcluidas: number;
	porResponsabilidade: {
		[key: string]: {
			totalAdequacoes: number;
			totalAdequacoesPendentes: number;
			totalAdequacoesPendentesPagas: number;
		};
	};
};

const getEnergyPAStatsRoute: NextApiHandler<TEnergyPAStatsOutput> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const isAuthorized = !!session?.user.permissoes.execucao.visualizar;
	if (!isAuthorized) throw new createHttpError.Unauthorized("Oops, seu usuário não possui acesso a esse módulo.");

	const { after, before } = EnergyPAStatsQueryParams.parse(req.query);

	const db = await connectToDatabase();
	const projectsCollection = db.collection<TProject>("dados");

	const aggregatedStatsResults = (await projectsCollection
		.aggregate([
			{
				$group: {
					_id: {
						installationResponsability: "$padrao.respInstalacao",
					},
					overallEnergyPAAdequationsCount: {
						$sum: {
							$cond: [{ $eq: ["$padrao.aumentoCarga.aplicavel", true] }, 1, 0],
						},
					},
					overallPendingEnergyPAAdequationsCount: {
						$sum: {
							$cond: [
								{
									$and: [
										{
											$eq: ["$padrao.aumentoCarga.aplicavel", true],
										},
										{
											$eq: [{ $ifNull: ["$padrao.aumentoCarga.dataEfetivacao", null] }, null],
										},
									],
								},
								1,
								0,
							],
						},
					},
					paidPendingEnergyPAAdequationsCount: {
						$sum: {
							$cond: [
								{
									$and: [
										{
											$eq: ["$padrao.aumentoCarga.aplicavel", true],
										},
										{
											$eq: [{ $ifNull: ["$padrao.aumentoCarga.dataEfetivacao", null] }, null],
										},
										{
											$ne: [{ $ifNull: ["$compra.dataPagamento", null] }, null],
										},
									],
								},
								1,
								0,
							],
						},
					},
					completedEnergyPAAdequationsCount: {
						$sum: {
							$cond: [{ $and: [{ $gt: ["$padrao.aumentoCarga.dataEfetivacao", after] }, { $lt: ["$padrao.aumentoCarga.dataEfetivacao", before] }] }, 1, 0],
						},
					},
				},
			},
		])
		.toArray()) as {
		_id: { installationResponsability: string };
		overallEnergyPAAdequationsCount: number;
		overallPendingEnergyPAAdequationsCount: number;
		paidPendingEnergyPAAdequationsCount: number;
		completedEnergyPAAdequationsCount: number;
	}[];

	const aggregatedStatsResultsReduced = aggregatedStatsResults.reduce(
		(acc, curr) => {
			const responsability = curr._id.installationResponsability || "NÃO SE APLICA";
			acc.totalAdequacoes += curr.overallEnergyPAAdequationsCount;
			acc.totalAdequacoesPendentes += curr.overallPendingEnergyPAAdequationsCount;
			acc.totalAdequacoesPendentesPagas += curr.paidPendingEnergyPAAdequationsCount;
			acc.adequacoesConcluidas += curr.completedEnergyPAAdequationsCount;
			if (!acc.porResponsabilidade[responsability])
				acc.porResponsabilidade[responsability] = { totalAdequacoes: 0, totalAdequacoesPendentes: 0, totalAdequacoesPendentesPagas: 0 };

			acc.porResponsabilidade[responsability].totalAdequacoes += curr.overallEnergyPAAdequationsCount;
			acc.porResponsabilidade[responsability].totalAdequacoesPendentes += curr.overallPendingEnergyPAAdequationsCount;

			acc.porResponsabilidade[responsability].totalAdequacoesPendentesPagas += curr.paidPendingEnergyPAAdequationsCount;
			return acc;
		},
		{
			totalAdequacoes: 0,
			totalAdequacoesPendentes: 0,
			totalAdequacoesPendentesPagas: 0,
			adequacoesConcluidas: 0,
			porResponsabilidade: {},
		} as TEnergyPAStatsReduced,
	);
	return res.status(200).json({
		data: {
			totalAdequacoes: aggregatedStatsResultsReduced.totalAdequacoes,
			totalAdequacoesPendentes: aggregatedStatsResultsReduced.totalAdequacoesPendentes,
			totalAdequacoesPendentesPagas: aggregatedStatsResultsReduced.totalAdequacoesPendentesPagas,
			adequacoesConcluidas: aggregatedStatsResultsReduced.adequacoesConcluidas,
			porResponsabilidade: Object.entries(aggregatedStatsResultsReduced.porResponsabilidade)
				.map(([tipo, data]) => ({
					tipo,
					totalAdequacoes: data.totalAdequacoes,
					totalAdequacoesPendentes: data.totalAdequacoesPendentes,
					totalAdequacoesPendentesPagas: data.totalAdequacoesPendentesPagas,
				}))
				.sort((a, b) => b.totalAdequacoes - a.totalAdequacoes),
		},
	});
};

export default apiHandler({
	GET: getEnergyPAStatsRoute,
});
