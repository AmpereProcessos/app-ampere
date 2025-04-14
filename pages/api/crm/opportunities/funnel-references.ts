import { apiHandler } from "@/utils/api";
import connectToCRMDatabase from "@/utils/services/mongodb/crm/main";
import { GeneralFunnelReferenceSchema, type TFunnelReference } from "@/utils/schemas/crm/funnel-reference.schema";
import createHttpError from "http-errors";
import { ObjectId } from "mongodb";
import type { NextApiHandler } from "next";
import type { z } from "zod";

const UpdateFunnelReferenceInputSchema = GeneralFunnelReferenceSchema.pick({
	idEstagioFunil: true,
});
export type TUpdateFunnelReferenceInput = z.infer<typeof UpdateFunnelReferenceInputSchema>;

const handleUpdateFunnelReference: NextApiHandler<any> = async (req, res) => {
	const { id } = req.query;

	if (!id || typeof id !== "string" || !ObjectId.isValid(id)) throw new createHttpError.BadRequest("ID inválido.");
	const { idEstagioFunil } = UpdateFunnelReferenceInputSchema.parse(req.body);

	const crmDb = await connectToCRMDatabase();
	const funnelReferencesCollection = crmDb.collection<TFunnelReference>("funnel-references");

	const updateResponse = await funnelReferencesCollection.updateOne({ _id: new ObjectId(id) }, { $set: { idEstagioFunil } });
	if (!updateResponse.acknowledged) throw new createHttpError.InternalServerError("Oops, houve um erro desconhecido ao atualizar referência.");
	if (updateResponse.matchedCount === 0) throw new createHttpError.NotFound("Referência não encontrada.");

	return res.status(200).json({ data: "Referência atualizada com sucesso !", message: "Referência atualizada com sucesso !" });
};

export default apiHandler({
	PUT: handleUpdateFunnelReference,
});
