import { getRevenuesByFilters } from "@/repositories/revenues/queries";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import { RevenueQueryFilters, TRevenue, TRevenueSimplified, TRevenueSimplifiedDTO } from "@/utils/schemas/revenues";
import connectToDatabase from "@/utils/services/mongodb/projects";
import createHttpError from "http-errors";
import { Collection, Filter } from "mongodb";
import { NextApiHandler } from "next";
import { z } from "zod";

const QuerySchema = z.object({
	page: z.string({ required_error: "Parâmetro de páginação não informado." }),
});

export type TRevenuesByFiltersResult = {
	revenues: TRevenueSimplifiedDTO[];
	revenuesMatched: number;
	totalPages: number;
};

const getRevenuesSearchByPersonalizedFiltersRoute: NextApiHandler<{ data: TRevenuesByFiltersResult }> = async (req, res) => {
	const PAGE_SIZE = 50;
	const session = await validateAuthenticationWithSession(req, res);

	const { page } = QuerySchema.parse(req.query);

	const filters = RevenueQueryFilters.parse(req.body);

	// Validating page parameter
	if (!page || isNaN(Number(page))) throw new createHttpError.BadRequest("Parâmetro de paginação inválido ou não informado.");

	const andConditions: Filter<TRevenue>[] = [];
	const orConditions: Filter<TRevenue>[] = [];

	if (filters.search.trim().length > 0) {
		orConditions.push({ nome: { $regex: filters.search, $options: "i" } }, { nome: filters.search });
	}
	if (filters.status.includes("RECEBIDO")) {
		orConditions.push({
			fracionamento: {
				$elemMatch: {
					dataRecebimento: { $ne: null },
				},
			},
		});
	}
	if (filters.status.includes("RECEBIDO PARCIAL")) {
		orConditions.push({
			fracionamento: {
				$elemMatch: {
					dataRecebimento: null,
				},
			},
		});
	}
	if (filters.status.includes("PENDENTE")) {
		orConditions.push({
			fracionamento: {
				$not: {
					$elemMatch: {
						dataRecebimento: null,
					},
				},
			},
		});
	}
	if (filters.types.length > 0) {
		andConditions.push({
			tipo: { $in: filters.types },
		});
	}

	const andConditionsQuery = andConditions.reduce((acc, current) => ({ ...acc, ...current }), {});
	const orConditionsQuery = orConditions.length > 0 ? { $or: orConditions } : {};
	const query: Filter<TRevenue> = { ...andConditionsQuery, ...orConditionsQuery };

	const skip = PAGE_SIZE * (Number(page) - 1);
	const limit = PAGE_SIZE;
	const db = await connectToDatabase(process.env.MONGODB_URI, "projetos");
	const collection: Collection<TRevenue> = db.collection("receitas");

	const { revenues, revenuesMatched } = await getRevenuesByFilters({ collection, query, skip, limit });
	const totalPages = Math.ceil(revenuesMatched / PAGE_SIZE);

	return res.status(200).json({ data: { revenues, revenuesMatched, totalPages } });
};

export default apiHandler({ POST: getRevenuesSearchByPersonalizedFiltersRoute });
