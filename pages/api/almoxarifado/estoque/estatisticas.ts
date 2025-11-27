import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import type { TMaterial } from "@/utils/schemas/materials";
import connectToWarehouseDatabase from "@/utils/services/mongodb/warehouse";
import type { NextApiHandler } from "next";
import { z } from "zod";

export type TGetStockAnalyticsOutput = {
	message: string;
	data: {
		valorTotalEstoque: number;
		valorMedioPorItem: number;
		totalItens: number;
		itensAbaixoMinimo: number;
		itensAcimaMaximo: number;
	};
};

const handleGetStockAnalytics: NextApiHandler<TGetStockAnalyticsOutput> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);

	const db = await connectToWarehouseDatabase();
	const materialsCollection = db.collection<TMaterial>("material");

	// Agregação para calcular todas as estatísticas em uma única query
	const [statistics] = await materialsCollection
		.aggregate([
			{
				$match: {
					dataExclusao: null,
					idEquipamento: null,
				},
			},
			{
				$project: {
					_id: 1,
					qtde: 1,
					preco: 1,
					valorTotal: { $multiply: ["$preco", "$qtde"] },
					qtdeMinima: 1,
					qtdeMaxima: 1,
				},
			},
			{
				$group: {
					_id: null,
					valorTotalEstoque: { $sum: "$valorTotal" },
					// Contagem total de itens
					totalItens: { $sum: 1 },
					// Itens abaixo do mínimo
					itensAbaixoMinimo: {
						$sum: {
							$cond: [
								{
									$and: [{ $ne: ["$qtdeMinima", null] }, { $lt: ["$qtde", "$qtdeMinima"] }],
								},
								1,
								0,
							],
						},
					},
					// Itens acima do máximo
					itensAcimaMaximo: {
						$sum: {
							$cond: [
								{
									$and: [{ $ne: ["$qtdeMaxima", null] }, { $gt: ["$qtde", "$qtdeMaxima"] }],
								},
								1,
								0,
							],
						},
					},
				},
			},
			{
				$project: {
					_id: 0,
					valorTotalEstoque: 1,
					totalItens: 1,
					itensAbaixoMinimo: 1,
					itensAcimaMaximo: 1,
				},
			},
		])
		.toArray();
	console.log("[INFO] [GET_STOCK_ANALYTICS] Statistics collected successfully.", statistics);
	// Se não há materiais, retorna valores zerados
	const result: TGetStockAnalyticsOutput["data"] = {
		valorTotalEstoque: statistics?.valorTotalEstoque || 0,
		valorMedioPorItem: (statistics?.valorTotalEstoque ?? 0) / (statistics?.totalItens ?? 0),
		totalItens: statistics?.totalItens || 0,
		itensAbaixoMinimo: statistics?.itensAbaixoMinimo || 0,
		itensAcimaMaximo: statistics?.itensAcimaMaximo || 0,
	};

	console.log("[INFO] [GET_STOCK_ANALYTICS] Stock analytics collected successfully.", result);
	return res.status(200).json({
		message: "Estatísticas do estoque coletada com sucesso.",
		data: result,
	});
};

export default apiHandler({
	GET: handleGetStockAnalytics,
});
