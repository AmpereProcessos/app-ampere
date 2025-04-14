import { getFunnelReferences } from "@/repositories/crm-funnel-references/queries";
import { getOpportunitiesByQuery } from "@/repositories/crm-oportunities/queries";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import type { TFunnelReference } from "@/utils/schemas/crm/funnel-reference.schema";
import type { TOpportunity, TOpportunitySimplifiedWithProposalAndActivitiesAndFunnels } from "@/utils/schemas/crm/opportunity.schema";
import connectToCRMDatabase from "@/utils/services/mongodb/crm/main";
import dayjs from "dayjs";
import type { Filter } from "mongodb";
import type { NextApiHandler } from "next";

type GetResponse = {
	data: TOpportunitySimplifiedWithProposalAndActivitiesAndFunnels[];
};

const handleGetNutritionOpportunities: NextApiHandler<GetResponse> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);

	const currentDateDayjs = dayjs();
	const currentEndDate = currentDateDayjs.endOf("day").toISOString();
	const crmDb = await connectToCRMDatabase();
	const opportunitiesCollection = crmDb.collection<TOpportunity>("opportunities");
	const funnelReferencesCollection = crmDb.collection<TFunnelReference>("funnel-references");

	const pendingInteractionQuery: Filter<TOpportunity> = {
		proximaInteracao: { $lte: currentEndDate },
	};
	const responsibleQuery: Filter<TOpportunity> = {
		"responsaveis.id": "67101db881376cb5c51d45af",
	};
	const ongoingOpportunitiesQuery: Filter<TOpportunity> = {
		"perda.data": null,
		"ganho.data": null,
	};

	const opportunities = await getOpportunitiesByQuery({
		collection: opportunitiesCollection,
		query: { ...pendingInteractionQuery, ...responsibleQuery, ...ongoingOpportunitiesQuery },
	});

	const funnelReferences = await getFunnelReferences({
		collection: funnelReferencesCollection,
		funnelId: "67f97583e21e0e11bc36559d",
		query: {},
	});

	const oppportunitiesWithFunnel: TOpportunitySimplifiedWithProposalAndActivitiesAndFunnels[] = opportunities
		.map((opportunity) => {
			const opportunityFunnelReference = funnelReferences.find((fr) => fr.idOportunidade === opportunity._id.toString());
			if (!opportunityFunnelReference) return null;
			return {
				...opportunity,
				proposta: {
					nome: opportunity.proposta[0]?.nome,
					valor: opportunity.proposta[0]?.valor,
					potenciaPico: opportunity.proposta[0]?.potenciaPico,
				},
				funil: {
					id: opportunityFunnelReference._id.toString(),
					idFunil: opportunityFunnelReference.idFunil,
					idEstagio: opportunityFunnelReference.idEstagioFunil.toString(),
				},
				statusAtividades: {},
			};
		})
		.filter((o) => !!o);

	return res.status(200).json({ data: oppportunitiesWithFunnel });
};

export default apiHandler({ GET: handleGetNutritionOpportunities });
