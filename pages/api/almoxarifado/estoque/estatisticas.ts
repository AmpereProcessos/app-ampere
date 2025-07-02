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
				$group: {
					_id: null,
					// Valor total do estoque (preço × quantidade)
					valorTotalEstoque: {
						$sum: { $multiply: ["$preco", "$qtde"] },
					},
					// Soma total de preços para calcular média
					somaPrecos: { $sum: "$preco" },
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
					valorTotalEstoque: { $round: ["$valorTotalEstoque", 2] },
					valorMedioPorItem: {
						$round: [{ $divide: ["$somaPrecos", "$totalItens"] }, 2],
					},
					totalItens: 1,
					itensAbaixoMinimo: 1,
					itensAcimaMaximo: 1,
				},
			},
		])
		.toArray();

	// Se não há materiais, retorna valores zerados
	const result: TGetStockAnalyticsOutput["data"] = {
		valorTotalEstoque: statistics?.valorTotalEstoque || 0,
		valorMedioPorItem: statistics?.valorMedioPorItem || 0,
		totalItens: statistics?.totalItens || 0,
		itensAbaixoMinimo: statistics?.itensAbaixoMinimo || 0,
		itensAcimaMaximo: statistics?.itensAcimaMaximo || 0,
	};

	return res.status(200).json({
		message: "Estatísticas do estoque coletada com sucesso.",
		data: result,
	});
};

export default apiHandler({
	GET: handleGetStockAnalytics,
});
