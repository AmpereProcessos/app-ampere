import { getProjectExportFormatted, GetProjectsExportRoutePayloadSchema, getProjectProjection } from "@/lib/data-exports";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import { formatDateQuery } from "@/utils/methods/dates";
import type { TProject } from "@/utils/schemas/projects";
import connectToDatabase from "@/utils/services/mongodb/projects";
import type { Filter } from "mongodb";
import type { NextApiHandler } from "next";
import createHttpError from "http-errors";

const handleProjectsPersonalizedExport: NextApiHandler<any> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const userHasOverallAccess = ["Projetos", "Obras", "Suprimentos", "O&M", "Marketing", "Vendas", "Pós-Venda", "PPS", "InsideSales", "Financeiro", "ADM", "RH"].every((el) =>
		session?.user.permissoes.rotas.includes(el),
	);
	if (!userHasOverallAccess) throw new createHttpError.Forbidden("Você não tem permissão para exportar projetos.");
	const { filters, projection } = GetProjectsExportRoutePayloadSchema.parse(req.body);

	const db = await connectToDatabase();
	const projectsCollection = db.collection<TProject>("dados");

	const mongoProjection = getProjectProjection(projection);

	const contractNameSearchQuery: Filter<TProject> | null =
		filters.contractNamesearch.trim().length > 0
			? {
					$or: [{ nomeDoContrato: { $regex: filters.contractNamesearch, $options: "i" } }, { nomeDoContrato: filters.contractNamesearch }],
				}
			: null;

	const neighborhoodSearchQuery: Filter<TProject> | null =
		filters.neighborhoodSearch.trim().length > 0
			? {
					$or: [{ bairro: { $regex: filters.neighborhoodSearch, $options: "i" } }, { bairro: filters.neighborhoodSearch }],
				}
			: null;

	const streetSearchQuery: Filter<TProject> | null =
		filters.streetSearch.trim().length > 0
			? {
					$or: [{ logradouro: { $regex: filters.streetSearch, $options: "i" } }, { logradouro: filters.streetSearch }],
				}
			: null;

	const applicableSearchQueries = [contractNameSearchQuery, neighborhoodSearchQuery, streetSearchQuery].filter(Boolean) as Filter<TProject>[];
	const searchQuery: Filter<TProject> =
		applicableSearchQueries.length > 0
			? {
					$and: applicableSearchQueries,
				}
			: {};

	const serviceTypeQuery: Filter<TProject> =
		filters.serviceType.length > 0
			? {
					tipoDeServico: { $in: filters.serviceType },
				}
			: {};

	const sellersQuery: Filter<TProject> =
		filters.sellers.length > 0
			? {
					"vendedor.nome": { $in: filters.sellers },
				}
			: {};

	const insiderQuery: Filter<TProject> =
		filters.insiders.length > 0
			? {
					insider: { $in: filters.insiders },
				}
			: {};
	const citiesQuery: Filter<TProject> =
		filters.cities.length > 0
			? {
					cidade: { $in: filters.cities },
				}
			: {};

	const statesQuery: Filter<TProject> =
		filters.states.length > 0
			? {
					uf: { $in: filters.states },
				}
			: {};

	const periodQuery: Filter<TProject> =
		filters.period.field && filters.period.after && filters.period.before
			? {
					[filters.period.field]: { $gte: formatDateQuery(filters.period.after, "start"), $lte: formatDateQuery(filters.period.before, "end") },
				}
			: {};

	const finalQuery: Filter<TProject> = {
		...searchQuery,
		...serviceTypeQuery,
		...sellersQuery,
		...insiderQuery,
		...citiesQuery,
		...statesQuery,
		...periodQuery,
	};

	const projects = await projectsCollection.find(finalQuery, { projection: mongoProjection }).toArray();

	const formattedProjects = getProjectExportFormatted({ projects, exportablesDefinition: projection });

	return res.status(200).json({ data: formattedProjects });
};
export default apiHandler({
	POST: handleProjectsPersonalizedExport,
});
