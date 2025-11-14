import { getExpensesByFilters } from "@/repositories/expenses/queries";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import { ExpenseQueryFilters, TExpense, TExpenseDTO, TExpenseSimplifiedDTO } from "@/utils/schemas/expenses";
import connectToDatabase from "@/utils/services/mongodb/projects";
import createHttpError from "http-errors";
import { Collection, Filter } from "mongodb";
import { NextApiHandler } from "next";
import { z } from "zod";

const QuerySchema = z.object({
	page: z.string({ required_error: "Parâmetro de páginação não informado." }),
});

export type TExpensesByFiltersResult = {
	expenses: TExpenseSimplifiedDTO[];
	expensesMatched: number;
	totalPages: number;
};

const getExpensesSearchByPersonalizedFiltersRoute: NextApiHandler<{ data: TExpensesByFiltersResult }> = async (req, res) => {
	const PAGE_SIZE = 50;
	const session = await validateAuthenticationWithSession(req, res);

	const { page } = QuerySchema.parse(req.query);

	const filters = ExpenseQueryFilters.parse(req.body);

	// Validating page parameter
	if (!page || isNaN(Number(page))) throw new createHttpError.BadRequest("Parâmetro de paginação inválido ou não informado.");

	const andConditions: Filter<TExpense>[] = [];
	const orConditions: Filter<TExpense>[] = [];

	if (filters.status.includes("PAGO")) {
		orConditions.push({
			pagamentos: {
				$elemMatch: {
					dataPagamento: { $ne: null },
				},
			},
		});
	}
	if (filters.status.includes("PAGO PARCIAL")) {
		orConditions.push({
			pagamentos: {
				$elemMatch: {
					dataPagamento: null,
				},
			},
		});
	}
	if (filters.status.includes("PENDENTE")) {
		orConditions.push({
			pagamentos: {
				$not: {
					$elemMatch: {
						dataPagamento: null,
					},
				},
			},
		});
	}
	if (filters.apportionments.length > 0) {
		andConditions.push({
			rateio: { $in: filters.apportionments },
		});
	}
	if (filters.categories.length > 0) {
		andConditions.push({
			categoria: { $in: filters.categories },
		});
	}

	const andConditionsQuery = andConditions.reduce((acc, current) => ({ ...acc, ...current }), {});
	const orConditionsQuery = orConditions.length > 0 ? { $or: orConditions } : {};
	const query: Filter<TExpense> = { ...andConditionsQuery, ...orConditionsQuery };

	const skip = PAGE_SIZE * (Number(page) - 1);
	const limit = PAGE_SIZE;
	const db = await connectToDatabase(process.env.MONGODB_URI, "projetos");
	const collection: Collection<TExpense> = db.collection("despesas");

	const { expenses, expensesMatched } = await getExpensesByFilters({ collection, query, skip, limit });
	const totalPages = Math.ceil(expensesMatched / PAGE_SIZE);

	return res.status(200).json({ data: { expenses, expensesMatched, totalPages } });
};

export default apiHandler({ POST: getExpensesSearchByPersonalizedFiltersRoute });
