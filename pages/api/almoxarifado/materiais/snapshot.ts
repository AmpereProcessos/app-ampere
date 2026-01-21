import type { TAuthSession } from "@/lib/authentication/types";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import type { TMaterialUpdateRegistry } from "@/utils/schemas/material-updates-registry";
import type { TMaterial } from "@/utils/schemas/materials";
import connectToWarehouseDatabase from "@/utils/services/mongodb/warehouse";
import type { NextApiRequest, NextApiResponse } from "next";
import z from "zod";

const GetMaterialsSnapshotInputSchema = z.object({
	paramDate: z.string({ required_error: "Data de início é obrigatória", invalid_type_error: "Data de início inválida." }).datetime({
		message: "Data de início inválida.",
	}),
});

export type TGetMaterialsSnapshotInput = z.infer<typeof GetMaterialsSnapshotInputSchema>;

async function getMaterialsSnapshot({ sessionUser, input }: { sessionUser: TAuthSession["user"]; input: TGetMaterialsSnapshotInput }) {
	const warehouseDb = await connectToWarehouseDatabase();
	const materialsCollection = warehouseDb.collection<TMaterial>("material");

	const materialUpdateRegistryCollection = warehouseDb.collection<TMaterialUpdateRegistry>("alteracoes");

	const materials = await materialsCollection
		.find(
			{
				idEquipamento: null,
				dataInsercao: { $lte: input.paramDate },
				$or: [{ dataExclusao: null }, { dataExclusao: { $gt: input.paramDate } }],
			},
			{
				projection: {
					_id: 1,
					nome: 1,
					qtde: 1,
				},
				sort: {
					nome: 1,
				},
			},
		)
		.toArray();

	const materialIds = materials.map((material) => material._id.toString());

	const materialUpdateRegistries = await materialUpdateRegistryCollection
		.find({
			"material.id": { $in: materialIds },
			dataInsercao: { $gt: input.paramDate },
		})
		.toArray();

	const exportData = materials.map((material) => {
		const changesDelta = materialUpdateRegistries
			.filter((registry) => registry.material.id === material._id.toString())
			.reduce((acc, registry) => {
				return acc - registry.alteracao;
			}, 0);

		return {
			ID: material._id.toString(),
			"NOME DO MATERIAL": material.nome,
			"QUANTIDADE NO SNAPSHOT": material.qtde + changesDelta,
		};
	});
	// const pipeline = [
	// 	// 1. Match materials that existed at snapshot time (created before, not deleted before)
	// 	{
	// 		$match: {
	// 			idEquipamento: null,
	// 			dataInsercao: { $lte: input.paramDate },
	// 			$or: [{ dataExclusao: null }, { dataExclusao: { $gt: input.paramDate } }],
	// 		},
	// 	},
	// 	// 2. Convert _id to string for lookup
	// 	{
	// 		$addFields: { materialIdString: { $toString: "$_id" } },
	// 	},
	// 	// 3. Lookup changes after snapshot date
	// 	{
	// 		$lookup: {
	// 			from: "alteracoes",
	// 			let: { materialId: "$materialIdString" },
	// 			pipeline: [
	// 				{
	// 					$match: {
	// 						$expr: {
	// 							$and: [{ $eq: ["$material.id", "$$materialId"] }, { $gt: ["$dataInsercao", input.paramDate] }],
	// 						},
	// 					},
	// 				},
	// 				{ $project: { alteracao: 1 } },
	// 			],
	// 			as: "changesAfterSnapshot",
	// 		},
	// 	},
	// 	// 4. Sum changes and calculate snapshot quantity
	// 	{
	// 		$addFields: {
	// 			snapshotQty: {
	// 				$subtract: ["$qtde", { $sum: "$changesAfterSnapshot.alteracao" }],
	// 			},
	// 		},
	// 	},
	// 	// 5. Project to output format
	// 	{
	// 		$project: {
	// 			_id: 0,
	// 			ID: { $toString: "$_id" },
	// 			"NOME DO MATERIAL": "$nome",
	// 			"QUANTIDADE NO SNAPSHOT": "$snapshotQty",
	// 		},
	// 	},
	// 	// 6. Sort by name
	// 	{ $sort: { "NOME DO MATERIAL": 1 } },
	// ];

	// const results = (await materialsCollection.aggregate(pipeline).toArray()) as {
	// 	ID: string;
	// 	"NOME DO MATERIAL": string;
	// 	"QUANTIDADE NO SNAPSHOT": number;
	// }[];

	return {
		data: exportData,
	};
}
export type TGetMaterialsSnapshotOutput = Awaited<ReturnType<typeof getMaterialsSnapshot>>;

async function getMaterialsSnapshotHandler(req: NextApiRequest, res: NextApiResponse) {
	const { user } = await validateAuthenticationWithSession(req, res);
	const input = GetMaterialsSnapshotInputSchema.parse(req.query);
	const result = await getMaterialsSnapshot({ sessionUser: user, input });
	return res.status(200).json(result);
}
export default apiHandler({
	GET: getMaterialsSnapshotHandler,
});
