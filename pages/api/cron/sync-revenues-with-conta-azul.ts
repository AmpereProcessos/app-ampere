import { getContaAzulAccessToken } from "@/repositories/integrations/conta-azul/queries";
import { apiHandler } from "@/utils/api";
import { formatDecimalPlaces } from "@/utils/constants";
import type { TIntegration } from "@/utils/schemas/integrations";
import type { TRevenue } from "@/utils/schemas/revenues";
import connectToDatabase from "@/utils/services/mongodb/projects";
import axios from "axios";
import { ObjectId } from "mongodb";
import type { NextApiHandler } from "next";

const handleSyncRevenuesWithContaAzul: NextApiHandler<any> = async (req, res) => {
	const db = await connectToDatabase();
	const revenuesCollection = db.collection<TRevenue>("receitas");
	const integrationsCollection = db.collection<TIntegration>("integracoes");

	// Getting revenues with _id and idContaAzulVenda only for query performance
	const revenues = await revenuesCollection
		.find({ idContaAzulVenda: { $ne: null } }, { projection: { _id: 1, idContaAzulVenda: 1, total: 1 } })
		.toArray();

	// Getting ContaAzul sales
	const accessToken = await getContaAzulAccessToken({ collection: integrationsCollection });
	const contaAzulSales = await getContaAzulRecentSales({ accessToken });

	const bulkwriteArr = revenues
		.map((revenue) => {
			const contaAzulSale = contaAzulSales.find((s: any) => s.id === revenue.idContaAzulVenda);
			if (!contaAzulSale) return null;

			const contaAzulInstallments = contaAzulSale.payment.installments;
			const revenueFractionments: TRevenue["fracionamento"] = contaAzulInstallments.map((installment: any) => {
				const percentage = (installment.value || 0) / revenue.total;
				console.log("PERCENTAGE", percentage, `INSTALLMENT VALUE ${installment.value} - REVENUE TOTAL ${revenue.total}`);
				return {
					titulo: `RECEBIMENTO DE ${formatDecimalPlaces(percentage * 100)}%`,
					valor: installment.value || 0,
					porcentagem: percentage * 100,
					dataRecebimento: installment.status === "ACQUITTED" ? installment.due_date : null,
					dataPrevisaoRecebimento: installment.due_date,
				};
			});
			const lastReceivedFractionment = revenueFractionments
				.filter((r) => r.dataRecebimento)
				.sort((a, b) => new Date(a.dataRecebimento as string).getTime() - new Date(b.dataRecebimento as string).getTime())[0];

			return {
				updateOne: {
					filter: { _id: new ObjectId(revenue._id) },
					update: {
						$set: {
							idContaAzulCliente: contaAzulSale.customer_id,
							idContaAzulVenda: contaAzulSale.id,
							fracionamento: revenueFractionments,
							dataEfetivacao: contaAzulSale.status === "COMMITTED" ? lastReceivedFractionment?.dataRecebimento : null,
							dataUltimaAtualizacaoContaAzul: new Date().toISOString(),
						},
					},
				},
			};
		})
		.filter((b) => !!b);

	const bulkwriteResponse = await revenuesCollection.bulkWrite(bulkwriteArr);

	console.log("BULKWRITE RESPONSE", bulkwriteResponse);
	return res.status(201).json({ data: {}, message: "Rotina executada com sucesso !" });
};

export default apiHandler({ GET: handleSyncRevenuesWithContaAzul });

type GetContaAzulRecentSalesParams = {
	accessToken: string;
};
async function getContaAzulRecentSales({ accessToken }: GetContaAzulRecentSalesParams) {
	const url = "https://api.contaazul.com/v1/sales?size=200";
	const headers = {
		Authorization: `Bearer ${accessToken}`,
		"Content-Type": "application/json",
	};
	const { data } = await axios.get(url, { headers });

	return data;
}
