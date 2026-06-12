import type { TProjectADMSimplifiedWithRevenue } from "@/pages/api/projects/adm";
import type { TProject } from "@/utils/schemas/projects";
import type { Collection, Filter } from "mongodb";

type GetADMProjectsByFilterParams = {
	collection: Collection<TProject>;
	match: Filter<TProject>;
	postLookupMatchStages: Filter<TProject>[];
	skip: number;
	limit: number;
};

const addFields = { idAsString: { $toString: "$_id" } };
const lookup = {
	from: "receitas",
	localField: "idAsString",
	foreignField: "projeto.id",
	as: "receitas",
};
const projection = {
	_id: 1,
	qtde: 1,
	nomeDoContrato: 1,
	tipoDeServico: 1,
	etiquetas: 1,
	"vendedor.nome": 1,
	"pagamento.forma": 1,
	"pagamento.status": 1,
	"pagamento.cobrancaFeita": 1,
	"faturamento.concluido": 1,
	"faturamento.empresaFaturamento": 1,
	"contrato.status": 1,
	"contrato.dataAssinatura": 1,
	"compra.statusLiberacao": 1,
	"obra.equipeResp": 1,
	"obra.saida": 1,
	"medidor.data": 1,
	"vistoria.status": 1,
	"receitas.total": 1,
	"receitas.metodo": 1,
	"receitas.fracionamento": 1,
};
const sort = { qtde: -1 };

export async function getADMProjectsByFilter({
	collection,
	match,
	postLookupMatchStages,
	skip,
	limit,
}: GetADMProjectsByFilterParams) {
	const postLookupMatch =
		postLookupMatchStages.length > 0 ? [{ $match: { $and: postLookupMatchStages } }] : [];

	const aggregationResult = await collection
		.aggregate<{
			projectsMatched: { count: number }[];
			projects: Record<string, unknown>[];
		}>([
			{ $match: match },
			{ $addFields: addFields },
			{ $lookup: lookup },
			...postLookupMatch,
			{
				$facet: {
					projectsMatched: [{ $count: "count" }],
					projects: [{ $sort: sort }, { $skip: skip }, { $limit: limit }, { $project: projection }],
				},
			},
		])
		.toArray();

	const facetResult = aggregationResult[0];
	const projectsMatched = facetResult?.projectsMatched[0]?.count ?? 0;
	const projects = (facetResult?.projects ?? []).map((project) => ({
		...project,
		receita: project.receitas?.[0],
	})) as TProjectADMSimplifiedWithRevenue[];

	return { projects, projectsMatched };
}
