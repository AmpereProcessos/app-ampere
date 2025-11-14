import { appRouterApiHandler, type UnwrapAppRouterNextResponse } from "@/utils/api-app-router";
import { ProjectComissionedUserSchema, type TProject } from "@/utils/schemas/projects";
import { ComissionableItems, type TComissionableItemsEnum } from "@/utils/select-options";
import connectToAppProjectsDatabase from "@/utils/services/mongodb/projects";
import { type AnyBulkWriteOperation, ObjectId } from "mongodb";
import { getValidCurrentSessionUncached } from "@/lib/authentication/session";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";

const BulkUpdateProjectsComissionSchema = z.array(
	z.object({
		projectId: z.string({ required_error: "ID do projeto é obrigatório.", invalid_type_error: "ID do projeto é obrigatório." }),
		comissionableValue: z.number({
			required_error: "Valor comissionável é obrigatório.",
			invalid_type_error: "Valor comissionável é obrigatório.",
		}),
		comissionableItems: z.array(z.enum(ComissionableItems as [TComissionableItemsEnum, ...TComissionableItemsEnum[]])),
		comissioned: z.array(ProjectComissionedUserSchema),
	}),
);

export type TBulkUpdateProjectsComissionInput = z.infer<typeof BulkUpdateProjectsComissionSchema>;

async function handleBulkUpdateProjectsComission(request: NextRequest) {
	const session = await getValidCurrentSessionUncached();

	console.log("[BULK UPDATE PROJECTS COMISSIONS] Author of the updates: ", session.user.nome);
	const payload = await request.json();
	const bulkUpdates = BulkUpdateProjectsComissionSchema.parse(payload);

	console.log("[BULK UPDATE PROJECTS COMISSIONS] Number of updates: ", bulkUpdates.length);
	const db = await connectToAppProjectsDatabase();
	const projectsCollection = db.collection<TProject>("dados");

	const bulkwriteAppUpdate: AnyBulkWriteOperation<TProject>[] = bulkUpdates.map((item) => {
		return {
			updateOne: {
				filter: { _id: new ObjectId(item.projectId) },
				update: {
					$set: {
						"comissoes.valorComissionavel": item.comissionableValue,
						"comissoes.comissionados": item.comissioned,
						"comissoes.itensComissionaveis": item.comissionableItems,
					},
				},
			},
		};
	});

	const result = await projectsCollection.bulkWrite(bulkwriteAppUpdate);
	console.log("[BULK UPDATE PROJECTS COMISSIONS] Bulkwrite result: ", result);

	return NextResponse.json({ message: "Comissões atualizadas com sucesso." }, { status: 200 });
}

export type TBulkUpdateProjectsComissionOutput = UnwrapAppRouterNextResponse<Awaited<ReturnType<typeof handleBulkUpdateProjectsComission>>>;

export const POST = appRouterApiHandler({
	POST: handleBulkUpdateProjectsComission,
});
