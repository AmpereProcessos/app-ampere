import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import { GeneralOpportunityInteraction, type TOpportunityHistory } from "@/utils/schemas/crm/opportunity-history.schema";
import type { TOpportunity } from "@/utils/schemas/crm/opportunity.schema";
import connectToCRMDatabase from "@/utils/services/mongodb/crm/main";
import dayjs from "dayjs";
import { ObjectId } from "mongodb";
import type { NextApiHandler } from "next";
import type { z } from "zod";
import { getDayJsTimeUnitEquivalent } from "@/utils/methods/dates";

const CreateInteractionInputSchema = GeneralOpportunityInteraction;
export type TCreateInteractionInput = z.infer<typeof CreateInteractionInputSchema>;
const handleCreateInteraction: NextApiHandler<any> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const interaction = CreateInteractionInputSchema.parse(req.body);

	const crmDb = await connectToCRMDatabase();
	const interactionsCollection = crmDb.collection<TOpportunityHistory>("opportunities-history");
	const opportunitiesCollection = crmDb.collection<TOpportunity>("opportunities");
	const insertInteractionResponse = await interactionsCollection.insertOne(interaction);

	const opportunity = await opportunitiesCollection.findOne({ _id: new ObjectId(interaction.oportunidade.id) });
	if (!opportunity) throw new Error("Oportunidade não encontrada.");

	if (!insertInteractionResponse.acknowledged) throw new Error("Oops, houve um erro desconhecido ao inserir interação.");
	const insertedInteractionId = insertInteractionResponse.insertedId.toString();

	// Now, updating the opportunity
	if (opportunity.interacoesConfiguracao?.taxaMedida && opportunity.interacoesConfiguracao?.taxaValor) {
		const nextInteraction = dayjs()
			.add(
				opportunity.interacoesConfiguracao.taxaValor,
				getDayJsTimeUnitEquivalent({
					unit: opportunity.interacoesConfiguracao.taxaMedida,
				}),
			)
			.toISOString();
		await opportunitiesCollection.updateOne(
			{ _id: new ObjectId(opportunity._id) },
			{
				$set: {
					proximaInteracao: nextInteraction,
					ultimaInteracao: {
						tipo: interaction.tipoInteracao,
						data: new Date().toISOString(),
					},
				},
			},
		);
	}

	return res.status(201).json({ data: { insertedInteractionId }, message: "Interação criada com sucesso !" });
};
export default apiHandler({
	POST: handleCreateInteraction,
});
