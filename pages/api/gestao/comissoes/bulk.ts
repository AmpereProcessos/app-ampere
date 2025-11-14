import { ObjectId, type AnyBulkWriteOperation } from "mongodb";
import { z } from "zod";
import { ComissionableItems, type TComissionableItemsEnum } from ".";
import type { TProject } from "@/utils/schemas/projects";
import connectToDatabase from "@/utils/services/mongodb/projects";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import type { NextApiRequest, NextApiResponse } from "next";
import createHttpError from "http-errors";

const BulkUpdateProjectsComissionSchema = z.array(
	z.object({
		projectId: z.string({ required_error: "ID do projeto é obrigatório.", invalid_type_error: "ID do projeto é obrigatório." }),
		comissionableValue: z.number({
			required_error: "Valor comissionável é obrigatório.",
			invalid_type_error: "Valor comissionável é obrigatório.",
		}),
		sellerComissionPercentage: z.number({
			required_error: "Porcentagem de comissão do vendedor é obrigatória.",
			invalid_type_error: "Porcentagem de comissão do vendedor é obrigatória.",
		}),
		insiderComissionPercentage: z.number({
			required_error: "Porcentagem de comissão do insider é obrigatória.",
			invalid_type_error: "Porcentagem de comissão do insider é obrigatória.",
		}),
		comissionableItems: z.array(z.enum(ComissionableItems as [TComissionableItemsEnum, ...TComissionableItemsEnum[]])),
		comissionDefined: z.boolean({
			required_error: "Definição de comissão é obrigatória.",
			invalid_type_error: "Definição de comissão é obrigatória.",
		}),
		comissionPaid: z.boolean({
			required_error: "Pagamento de comissão é obrigatório.",
			invalid_type_error: "Pagamento de comissão é obrigatório.",
		}),
	}),
);

export type TBulkUpdateProjectsComissionInput = z.infer<typeof BulkUpdateProjectsComissionSchema>;
async function handleBulkUpdateProjectsComission(input: TBulkUpdateProjectsComissionInput) {
	const bulkwriteAppUpdate: AnyBulkWriteOperation<TProject>[] = input.map((item) => {
		return {
			updateOne: {
				filter: { _id: new ObjectId(item.projectId) },
				update: {
					$set: {
						"comissoes.valorComissionavel": item.comissionableValue,
						"comissoes.porcentagemVendedor": item.sellerComissionPercentage,
						"comissoes.porcentagemInsider": item.insiderComissionPercentage,
						"comissoes.itensComissionaveis": item.comissionableItems,
						"comissoes.efetivado": item.comissionDefined,
						"comissoes.pagamentoRealizado": item.comissionPaid,
					},
				},
			},
		};
	});

	console.log(`[BULKWRITE UPDATE PROJECTS COMISSION] Updating ${bulkwriteAppUpdate.length} projects...`);
	console.log("[BULKWRITE UPDATE PROJECTS COMISSION] Operations:");
	for (const p of input) {
		console.log(
			`ProjectId: ${p.projectId}\n  - Seller Commission: ${p.sellerComissionPercentage}%\n  - Insider Commission: ${p.insiderComissionPercentage}%`,
		);
	}
	const db = await connectToDatabase();
	const projectsCollection = db.collection<TProject>("projects");

	const bulkwriteUpdateResult = await projectsCollection.bulkWrite(bulkwriteAppUpdate);

	return {
		data: { updatedCount: bulkwriteUpdateResult.modifiedCount },
		message: "Comissões atualizadas com sucesso.",
	};
}
export type TBulkUpdateProjectsComissionOutput = Awaited<ReturnType<typeof handleBulkUpdateProjectsComission>>;
async function handleBulkUpdateProjectsComissionHandler(req: NextApiRequest, res: NextApiResponse) {
	const session = await validateAuthenticationWithSession(req, res);
	const userHasAdministrativeViewPermission = !!session?.user.permissoes.administrativo.visualizar;
	const userHasFinancesViewPermission = !!session?.user.permissoes.financeiro.visualizar;
	if (!userHasAdministrativeViewPermission && !userHasFinancesViewPermission)
		throw new createHttpError.Forbidden("Você não tem permissão para acessar esta página.");

	const author = { id: session.user.id, nome: session.user.nome, avatar_url: session.user.avatar_url };

	const input = BulkUpdateProjectsComissionSchema.parse(req.body);

	console.log(`[BULK UPDATE PROJECTS COMISSION] Author of the operation: ${author.nome}`);
	const result = await handleBulkUpdateProjectsComission(input);

	return res.status(200).json(result);
}

export default apiHandler({
	POST: handleBulkUpdateProjectsComissionHandler,
});
