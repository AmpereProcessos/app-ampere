import { ObjectId } from "mongodb";
import { apiHandler, validateAuthenticationWithSession } from "../../../../utils/api";
import { errorHandler } from "../../../../utils/methods/handlers";
import connectToDatabase from "../../../../utils/services/mongodb/projects";

import { handleProjectUpdateJourneyStepsTracking } from "@/lib/project-journeys/tracking";
import type { TProject } from "@/utils/schemas/projects";
import type { TServiceOrder } from "@/utils/schemas/service-order";
import createHttpError from "http-errors";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServiceObservationsFromObras, getServiceOrderTagsFromProject } from "../../../../utils/methods/util/service-order";

const handleProjectUpdate = async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await validateAuthenticationWithSession(req, res);
	const db = await connectToDatabase();
	const collection = db.collection<TProject>("dados");
	const serviceOrdersCollection = db.collection<TServiceOrder>("ordensDeServico");
	const logCollection = db.collection("logAlteracoes");
	delete req.body._id;

	const { id } = req.query;

	if (!id || typeof id !== "string" || !ObjectId.isValid(id)) throw new createHttpError.BadRequest("ID do projeto inválido");
	const updateKeys = Object.keys(req.body);

	if (updateKeys.length === 0) throw new createHttpError.BadRequest("Nenhuma alteração foi realizada");

	const previousProjectData = await collection.findOne({ _id: new ObjectId(id) });
	if (!previousProjectData) throw new createHttpError.NotFound("Projeto não encontrado");

	// Now, handling the project update
	const updateProjectResponse = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { ...req.body } });
	if (!updateProjectResponse.acknowledged)
		// Checking for possible update errors
		throw new createHttpError.InternalServerError("Oops, houve um erro desconhecido ao atualizar projeto");
	if (updateProjectResponse.matchedCount === 0) throw new createHttpError.NotFound("Projeto não encontrado");
	// Inserting the log for the changes in the log collections
	const logObject = {
		autor: {
			id: session?.user?.id,
			nome: session?.user.nome,
			avatar_url: session?.user.avatar_url,
		},
		idProjetoAlterado: req.query.id,
		alteracoes: req.body,
		dataAlteracao: new Date().toISOString(),
		dataAlteracaoFormatada: new Date().toLocaleString("pt-br"),
	};
	await logCollection.insertOne(logObject);

	const updatedProjectData = await collection.findOne({ _id: new ObjectId(id) });
	if (!updatedProjectData) throw new createHttpError.NotFound("Projeto não encontrado");

	if (
		[
			"idVisitaTecnica",
			"vendedor.nome",
			"etiquetas",
			"contrato.dataAssinatura",
			"homologacao.fastTrack",
			"homologacao.acesso.dataResposta",
			"homologacao.vistoria.dataEfetivacao",
			"pagamento.credor",
			"compra.dataPagamento",
			"compra.previsaoEntrega",
			"compra.dataEntrega",
			"obra.pendencias",
			"obra.observacoes",
		].some((x) => updateKeys.includes(x))
	) {
		// Checking for update on service order trackable fields
		console.log("[INFO] [PROJECT UPDATE] Update in service order trackable fields. Handling service order update...");
		const project = await collection.findOne({ _id: new ObjectId(id) });
		if (!project) throw new createHttpError.NotFound("Projeto não encontrado");
		if (project.idOrdemServico) {
			await serviceOrdersCollection.updateMany(
				{
					_id: new ObjectId(project.idOrdemServico),
				},
				{
					$set: {
						etiquetas: getServiceOrderTagsFromProject(project),
						idAnaliseTecnica: project.idVisitaTecnica,
						observacoes: getServiceObservationsFromObras(project.obra.observacoes),
						"projeto.vendedorNome": project.vendedor.nome,
						"projeto.contratoDataAssinatura": project.contrato?.dataAssinatura,
						"projeto.compraDataPagamento": project.compra?.dataPagamento,
						"projeto.compraEntregaDataPrevisao": project.compra?.previsaoEntrega,
						"projeto.compraEntregaDataEfetivacao": project.compra?.dataEntrega,
						"projeto.homologacaoAcessoDataResposta": project.homologacao?.acesso.dataResposta,
						"projeto.homologacaoVistoriaDataEfetivacao": project.homologacao?.vistoria.dataEfetivacao,
					},
				},
			);
		}
	}
	if (["contrato.dataAssinatura", "compra.dataPagamento"].some((x) => updateKeys.includes(x))) {
		// Checking for possible comission related fields updates
		console.log("[INFO] [PROJECT UPDATE] Update in comission related fields. Handling comission update...");
		const project = await collection.findOne({ _id: new ObjectId(id) });
		if (!project) throw new createHttpError.NotFound("Projeto não encontrado");
		const projectType = project.tipoDeServico;
		const usesPaymentParam = [
			"SISTEMA FOTOVOLTAICO",
			"AUMENTO DE SISTEMA FOTOVOLTAICO",
			"PRODUTOS E SERVIÇOS AVULSOS",
			"MONTAGEM E DESMONTAGEM",
		].includes(projectType);

		// If its a solar UFV sale, the comission date reference is the payment date
		if (usesPaymentParam && updateKeys.includes("compra.dataPagamento")) {
			console.log("[INFO] [PROJECT UPDATE] Solar UFV sale project. Handling comission update...");
			const comissionDateReference = req.body["compra.dataPagamento"];
			await collection.updateOne({ _id: new ObjectId(id) }, { $set: { "comissoes.dataReferencia": comissionDateReference } });
		}
		// If its not a solar UFV sale, the comission date reference is the contract signature date
		if (!usesPaymentParam && updateKeys.includes("contrato.dataAssinatura")) {
			console.log("[INFO] [PROJECT UPDATE] Non-solar UFV sale project. Handling comission update...");
			const comissionDateReference = req.body["contrato.dataAssinatura"];
			await collection.updateOne({ _id: new ObjectId(id) }, { $set: { "comissoes.dataReferencia": comissionDateReference } });
		}
	}

	handleProjectUpdateJourneyStepsTracking({ previous: previousProjectData, updated: updatedProjectData });
	return res.json({
		data: {
			updatedId: id,
		},
		message: "Projeto atualizado com sucesso !",
	});
};
const handleProjectUpdatePut = async (req: NextApiRequest, res: NextApiResponse) => {
	const db = await connectToDatabase();
	const collection = db.collection<TProject>("dados");
	const id = req.query.id;
	if (!id || typeof id !== "string" || !ObjectId.isValid(id)) throw new createHttpError.BadRequest("ID do projeto inválido");
	const operation = req.body.operation;
	console.log(operation);
	const newObj = await collection.updateOne(
		{
			_id: new ObjectId(id),
		},
		{ ...operation },
	);
	return res.json(newObj);
};
export default apiHandler({
	POST: handleProjectUpdate,
	PUT: handleProjectUpdatePut,
});
