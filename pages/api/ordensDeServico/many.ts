import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import { ServiceOrderSchema } from "@/utils/schemas/service-order";
import connectToDatabase from "@/utils/services/mongodb/projects";
import createHttpError from "http-errors";
import { ObjectId } from "mongodb";
import { NextApiHandler } from "next";
import { z } from "zod";

const UpdateManyServiceOrdersByProjectIdPayloadSchema = z.object({
	filters: z.record(z.any()),
	changes: ServiceOrderSchema.partial(),
});
const handleUpdateManyServiceOrders: NextApiHandler<any> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);

	if (!session.user.permissoes.ordensDeServico.editar)
		throw new createHttpError.Unauthorized("Usuário não possui permissão para editar ordens de serviço.");
	const { projectId } = req.query;

	if (!projectId || typeof projectId != "string" || !ObjectId.isValid(projectId)) throw new createHttpError.BadRequest("ID do projeto inválido.");

	const { filters, changes } = UpdateManyServiceOrdersByProjectIdPayloadSchema.parse(req.body);

	const db = await connectToDatabase();
	const serviceOrdersCollection = db.collection("ordensDeServico");

	if (projectId) {
		const updateResponse = await serviceOrdersCollection.updateMany({ "projeto.id": projectId, ...filters }, { $set: changes });
		if (!updateResponse.acknowledged) throw new createHttpError.InternalServerError("Oops, houve um erro desconhecido ao atualizar ordem de serviço.");

		return res.status(201).json({ data: "Ordens de serviço atualizadas com sucesso.", message: "Ordens de serviço atualizadas com sucesso." });
	}
	throw new createHttpError.BadRequest("Operação inválida. Por favor, especifique o ID do projeto.");
};

export default apiHandler({
	PUT: handleUpdateManyServiceOrders,
});
