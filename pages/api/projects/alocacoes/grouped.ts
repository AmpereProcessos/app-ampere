import type { TAuthSession } from "@/lib/authentication/types";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import type { TMaterial } from "@/utils/schemas/materials";
import type { TProject } from "@/utils/schemas/projects";
import connectToDatabase from "@/utils/services/mongodb/projects";
import connectToWarehouseDatabase from "@/utils/services/mongodb/warehouse";
import { type Filter, ObjectId } from "mongodb";
import type { NextApiHandler } from "next";
import z from "zod";

const GetProjectAllocationsGroupedInputSchema = z.object({
	projectIds: z
		.string({
			invalid_type_error: "Lista de IDS de projetos inválida.",
			required_error: "Lista de IDS de projetos inválida.",
		})
		.optional()
		.nullable()
		.transform((val) => val?.split(",").filter((s) => s.trim().length > 0)),
	search: z
		.string({
			invalid_type_error: "Busca inválida.",
			required_error: "Busca inválida.",
		})
		.optional()
		.nullable(),
	ufs: z
		.string({
			invalid_type_error: "Lista de UFs inválida.",
			required_error: "Lista de UFs inválida.",
		})
		.optional()
		.nullable()
		.transform((val) => val?.split(",").filter((s) => s.trim().length > 0)),
	cities: z
		.string({
			invalid_type_error: "Lista de cidades inválida.",
			required_error: "Lista de cidades inválida.",
		})
		.optional()
		.nullable()
		.transform((val) => val?.split(",").filter((s) => s.trim().length > 0)),
});
export type TGetProjectAllocationsGroupedInput = z.infer<typeof GetProjectAllocationsGroupedInputSchema>;

async function getProjectAllocationsGrouped({ input, session }: { input: TGetProjectAllocationsGroupedInput; session: TAuthSession }) {
	const db = await connectToDatabase();
	const projectsCollection = db.collection<TProject>("dados");
	const warehouseDb = await connectToWarehouseDatabase();
	const warehouseMaterialsCollection = warehouseDb.collection<TMaterial>("material");
	const { projectIds, search, ufs, cities } = input;

	const projectIdsQuery: Filter<TProject> = projectIds && projectIds?.length > 0 ? { _id: { $in: projectIds.map((id) => new ObjectId(id)) } } : {};
	const ufsQuery: Filter<TProject> = ufs && ufs?.length > 0 ? { uf: { $in: ufs } } : {};
	const citiesQuery: Filter<TProject> = cities && cities?.length > 0 ? { cidade: { $in: cities } } : {};

	const preUnwindQuery: Filter<TProject> = {
		...projectIdsQuery,
		...ufsQuery,
		...citiesQuery,
	};

	const searchQuery: Filter<TProject> =
		search && search?.trim().length > 0 ? { $or: [{ "alocacoes.nome": search }, { "alocacoes.nome": { $regex: search, $options: "i" } }] } : {};
	const postUnwindQuery: Filter<TProject> = {
		...searchQuery,
	};

	// Aggregation pipeline blocks
	const aggregationPreUnwindMatch = { $match: preUnwindQuery };
	const aggregationProject = { $project: { _id: 1, alocacoes: 1 } };
	const aggregationUnwind = { $unwind: { path: "$alocacoes", includeArrayIndex: "index", preserveNullAndEmptyArrays: false } };
	const aggregationPostUnwindMatch = { $match: postUnwindQuery };
	const aggregationGroup = {
		$group: {
			_id: "$alocacoes.idMaterial",
			totalQuantity: {
				$sum: "$alocacoes.quantidade",
			},
			totalPreviewQuantity: {
				$sum: "$alocacoes.quantidadePrevista",
			},
		},
	};
	const aggregationResult = (await projectsCollection
		.aggregate([aggregationPreUnwindMatch, aggregationProject, aggregationUnwind, aggregationPostUnwindMatch, aggregationGroup])
		.toArray()) as { _id: string; totalQuantity: number; totalPreviewQuantity: number }[];

	const materialsObjectIds = aggregationResult.map((result) => new ObjectId(result._id));
	const materials = await warehouseMaterialsCollection.find({ _id: { $in: materialsObjectIds } }).toArray();

	const allocationsResults = aggregationResult
		.map((result) => {
			const material = materials.find((material) => material._id.toString() === result._id);
			if (!material) return null;
			return {
				material: {
					id: material._id.toString(),
					nome: material.nome,
					preco: material.preco,
					unidade: material.grandeza,
					quantidade: material.qtde,
				},
				quantidade: result.totalQuantity,
				quantidadePrevista: result.totalPreviewQuantity,
			};
		})
		.filter((result) => result !== null)
		.sort((a, b) => a.material.nome.localeCompare(b.material.nome));

	return {
		data: {
			default: allocationsResults,
		},
	};
}
export type TGetProjectAllocationsGroupedOutput = Awaited<ReturnType<typeof getProjectAllocationsGrouped>>;

const getProjectAllocationsGroupedHandler: NextApiHandler<TGetProjectAllocationsGroupedOutput> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const input = GetProjectAllocationsGroupedInputSchema.parse(req.query);
	const response = await getProjectAllocationsGrouped({ session, input });
	return res.status(200).json(response);
};

export default apiHandler({
	GET: getProjectAllocationsGroupedHandler,
});
