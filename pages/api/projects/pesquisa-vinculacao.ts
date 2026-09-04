import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import {
	ProjectDBSimplifiedProjection,
	QueryVinculationProjectsFiltersSchema,
	type TProject,
	type TProjectDTODBSimplified,
	type TVinculationProjectsByFiltersResult,
} from "@/utils/schemas/projects";
import connectToDatabase from "@/utils/services/mongodb/projects";
import type { Db, Filter, WithId } from "mongodb";
import type { NextApiHandler } from "next";

const PAGE_SIZE = 25;

// Entrada do usuário vai direto para um $regex — sem escapar, um "(" ou "*" quebra a query.
function escapeRegex(value: string) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildSearchQuery({
	search,
	showRestricted,
}: {
	search: string;
	showRestricted: boolean;
}): Filter<TProject> {
	const conditions: Filter<TProject>[] = [];

	const trimmedSearch = search.trim();
	if (trimmedSearch.length > 0) {
		const pattern = escapeRegex(trimmedSearch);
		const searchConditions: Filter<TProject>[] = [
			{ nomeDoContrato: { $regex: pattern, $options: "i" } },
			{ codigoSVB: { $regex: pattern, $options: "i" } },
		];
		// `qtde` é o identificador sequencial do projeto (o número exibido no badge).
		// `codigoSVB` é string|number no banco, então o $regex acima só cobre a variante string.
		if (/^\d+$/.test(trimmedSearch)) {
			searchConditions.push({ qtde: Number(trimmedSearch) });
			searchConditions.push({ codigoSVB: Number(trimmedSearch) });
		}
		conditions.push({ $or: searchConditions });
	}

	// Projetos restritos só aparecem para quem tem a permissão de restrição,
	// espelhando o comportamento de /api/projects/fetchDoc/[id].
	if (!showRestricted) conditions.push({ "restricao.aplicavel": { $ne: true } });

	return conditions.length > 0 ? { $and: conditions } : {};
}

type PostResponse = {
	data: TVinculationProjectsByFiltersResult;
};
const getProjectsVinculationsBySearch: NextApiHandler<PostResponse> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const showRestricted = !!session.user.permissoes.gestao?.restringirProjetos;

	const { search, page } = QueryVinculationProjectsFiltersSchema.parse(req.body);

	const db: Db = await connectToDatabase();
	const collection = db.collection<TProject>("dados");

	const query = buildSearchQuery({ search, showRestricted });
	const skip = PAGE_SIZE * (page - 1);

	const projectsMatched = await collection.countDocuments(query);
	const projects = (await collection
		.aggregate([
			{ $match: query },
			{ $sort: { qtde: -1 } },
			{ $skip: skip },
			{ $limit: PAGE_SIZE },
			{ $project: ProjectDBSimplifiedProjection },
		])
		.toArray()) as WithId<TProjectDTODBSimplified>[];

	const totalPages = Math.ceil(projectsMatched / PAGE_SIZE);

	return res.status(200).json({ data: { projects, projectsMatched, totalPages } });
};

export default apiHandler({ POST: getProjectsVinculationsBySearch });
