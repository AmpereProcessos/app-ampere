import { ExpenseSimplifiedProjection, TExpense, TExpenseSimplifiedDTO } from "@/utils/schemas/expenses";
import { Collection, Filter } from "mongodb";

type GetExpenseByFiltersParams = {
	collection: Collection<TExpense>;
	query: Filter<TExpense>;
	skip: number;
	limit: number;
};

export async function getExpensesByFilters({ collection, query, skip, limit }: GetExpenseByFiltersParams) {
	try {
		const expensesMatched = await collection.countDocuments({ ...query });
		const sort = { _id: -1 };
		const match = { ...query };
		const expenses = await collection
			.aggregate([{ $sort: sort }, { $match: match }, { $skip: skip }, { $limit: limit }, { $project: ExpenseSimplifiedProjection }])
			.toArray();

		return { expenses, expensesMatched } as { expenses: TExpenseSimplifiedDTO[]; expensesMatched: number };
	} catch (error) {
		throw error;
	}
}
