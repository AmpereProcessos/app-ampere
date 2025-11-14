import { getTechnicalAnalysisByFilter } from "@/repositories/technical-analysis/queries";

import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import { formatDateQuery } from "@/utils/methods/dates";
import { PersonalizedTechnicalAnalysisQuerySchema, TTechnicalAnalysis, TTechnicalAnalysisDTOSimplified } from "@/utils/schemas/technical-analysis";
import connectToCRMDatabase from "@/utils/services/mongodb/crm/main";

import createHttpError from "http-errors";
import { Collection, Filter } from "mongodb";
import { NextApiHandler } from "next";
import { z } from "zod";

export type TTechnicalAnalysisByFiltersResult = {
	analysis: TTechnicalAnalysisDTOSimplified[];
	analysisMatched: number;
	totalPages: number;
};

const QueryParamsSchema = z.object({
	after: z.string({
		required_error: "Parâmetros de período não fornecidos ou inválidos.",
		invalid_type_error: "Parâmetros de período não fornecidos ou inválidos.",
	}),
	before: z.string({
		required_error: "Parâmetros de período não fornecidos ou inválidos.",
		invalid_type_error: "Parâmetros de período não fornecidos ou inválidos.",
	}),
	page: z.string({ required_error: "Parâmetro de páginação não informado." }),
});
type PostResponse = {
	data: TTechnicalAnalysisByFiltersResult;
};
const getTechnicalAnalysisByPersonalizedFilters: NextApiHandler<PostResponse> = async (req, res) => {
	const PAGE_SIZE = 200;

	const session = await validateAuthenticationWithSession(req, res);

	const { after, before, page } = QueryParamsSchema.parse(req.query);
	const { applicants, analysts, partners, filters } = PersonalizedTechnicalAnalysisQuerySchema.parse(req.body);

	// Validating page parameter
	if (!page || isNaN(Number(page))) throw new createHttpError.BadRequest("Parâmetro de paginação inválido ou não informado.");

	// Defining the queries
	const insertionQuery: Filter<TTechnicalAnalysis> =
		after != "null" && before != "null"
			? {
					$and: [
						{ dataInsercao: { $gte: formatDateQuery(after, "start") as string } },
						{ dataInsercao: { $lte: formatDateQuery(before, "end") as string } },
					],
				}
			: {};
	const applicantQuery: Filter<TTechnicalAnalysis> = applicants ? { "requerente.id": { $in: applicants } } : {};
	const partnerQuery: Filter<TTechnicalAnalysis> = partners ? { idParceiro: { $in: [...partners] } } : {};
	const analystQuery: Filter<TTechnicalAnalysis> = analysts ? { "analista.id": { $in: analysts } } : {};
	const nameQuery = filters.name.trim().length > 0 ? { $or: [{ nome: { $regex: filters.name, $options: "i" } }, { nome: filters.name }] } : {};
	const filtersQuery: Filter<TTechnicalAnalysis> = {
		...nameQuery,
		status: filters.pending ? { $ne: "CONCLUIDO" } : filters.status.length > 0 ? { $in: filters.status } : { $ne: undefined },
		// @ts-ignore
		complexidade: filters.complexity ? filters.complexity : { $ne: "undefined" },
		"localizacao.cidade": filters.city.length > 0 ? { $in: filters.city } : { $ne: "undefined" },
		"localizacao.uf": filters.state.length > 0 ? { $in: filters.state } : { $ne: "undefined" },
		tipoSolicitacao: filters.type.length > 0 ? { $in: filters.type } : { $ne: undefined },
	};
	const query = { ...insertionQuery, ...applicantQuery, ...partnerQuery, ...analystQuery, ...filtersQuery };
	const skip = PAGE_SIZE * (Number(page) - 1);
	const limit = PAGE_SIZE;
	console.log(query);
	const db = await connectToCRMDatabase(process.env.DB_KEY);
	const collection: Collection<TTechnicalAnalysis> = db.collection("technical-analysis");

	const { analysis, analysisMatched } = await getTechnicalAnalysisByFilter({ collection, query, skip, limit });
	const totalPages = Math.ceil(analysisMatched / PAGE_SIZE);
	return res.status(200).json({ data: { analysis, analysisMatched, totalPages } });
};

export default apiHandler({ POST: getTechnicalAnalysisByPersonalizedFilters });
