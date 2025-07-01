import { ObjectId } from "mongodb";
import connectToDatabase from "../../../../utils/services/mongodb/projects";
import { getSession } from "next-auth/react";
import { errorHandler } from "../../../../utils/methods/handlers";
import { apiHandler, validateAuthenticationWithSession } from "../../../../utils/api";

import { getServiceOrderTagsFromProject } from "../../../../utils/methods/util/service-order";
import type { NextApiRequest, NextApiResponse } from "next";
import type { TProject } from "@/utils/schemas/projects";
import type { TServiceOrder } from "@/utils/schemas/service-order";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "POST") {
		const session = await validateAuthenticationWithSession(req, res);
		const db = await connectToDatabase();
		const collection = db.collection<TProject>("dados");
		const serviceOrdersCollection = db.collection<TServiceOrder>("ordensDeServico");
		const logCollection = db.collection("logAlteracoes");
		delete req.body._id;

		const { id } = req.query;
		if (!id || typeof id !== "string" || !ObjectId.isValid(id)) return res.status(400).json({ message: "ID do projeto inválido" });
		// logging changes in changes collections
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

		const updateKeys = Object.keys(req.body);

		const newObj = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { ...req.body } });

		// Validating for non empty update objects
		if (session && updateKeys.length > 0) {
			await logCollection.insertOne(logObject);
		}
		// Checking for update on service order trackable fields
		if (
			[
				"vendedor.nome",
				"etiquetas",
				"contrato.dataAssinatura",
				"homologacao.fastTrack",
				"homologacao.acesso.dataResposta",
				"homologacao.vistoria.dataEfetivacao",
				"pagamento.credor",
				"compra.previsaoEntrega",
				"compra.dataEntrega",
				"obra.pendencias",
			].some((x) => updateKeys.includes(x))
		) {
			console.log("[INFO] [PROJECT UPDATE] Update in service order trackable fields. Handling service order update...");
			const project = await collection.findOne({ _id: new ObjectId(id) });
			if (!project) return res.status(404).json({ message: "Projeto não encontrado" });
			if (project.idOrdemServico) {
				await serviceOrdersCollection.updateMany(
					{
						_id: new ObjectId(project.idOrdemServico),
					},
					{
						$set: {
							etiquetas: getServiceOrderTagsFromProject(project),
							"projeto.vendedorNome": project.vendedor.nome,
							"projeto.contratoDataAssinatura": project.contrato?.dataAssinatura,
							"projeto.compraEntregaDataPrevisao": project.compra?.previsaoEntrega,
							"projeto.compraEntregaDataEfetivacao": project.compra?.dataEntrega,
							"projeto.homologacaoAcessoDataResposta": project.homologacao?.acesso.dataResposta,
							"projeto.homologacaoVistoriaDataEfetivacao": project.homologacao?.vistoria.dataEfetivacao,
						},
					},
				);
			}
		}
		// Checking for possible comission related fields updates
		if (["contrato.dataAssinatura", "compra.dataPagamento"].some((x) => updateKeys.includes(x))) {
			console.log("[INFO] [PROJECT UPDATE] Update in comission related fields. Handling comission update...");
			const project = await collection.findOne({ _id: new ObjectId(id) });
			if (!project) return res.status(404).json({ message: "Projeto não encontrado" });
			const projectType = project.tipoDeServico;
			const isSolarUFVSale = ["SISTEMA FOTOVOLTAICO", "AUMENTO DE SISTEMA FOTOVOLTAICO"].includes(projectType);

			// If its a solar UFV sale, the comission date reference is the payment date
			if (isSolarUFVSale && updateKeys.includes("compra.dataPagamento")) {
				console.log("[INFO] [PROJECT UPDATE] Solar UFV sale project. Handling comission update...");
				const comissionDateReference = req.body["compra.dataPagamento"];
				await collection.updateOne({ _id: new ObjectId(id) }, { $set: { "comissoes.dataReferencia": comissionDateReference } });
			}
			// If its not a solar UFV sale, the comission date reference is the contract signature date
			if (!isSolarUFVSale && updateKeys.includes("contrato.dataAssinatura")) {
				console.log("[INFO] [PROJECT UPDATE] Non-solar UFV sale project. Handling comission update...");
				const comissionDateReference = req.body["contrato.dataAssinatura"];
				await collection.updateOne({ _id: new ObjectId(id) }, { $set: { "comissoes.dataReferencia": comissionDateReference } });
			}
		}
		return res.json(newObj);
	}
	if (req.method === "PUT") {
		try {
			const db = await connectToDatabase();
			const collection = db.collection<TProject>("dados");
			const id = req.query.id;
			if (!id || typeof id !== "string" || !ObjectId.isValid(id)) return res.status(400).json({ message: "ID do projeto inválido" });
			const operation = req.body.operation;
			console.log(operation);
			const newObj = await collection.updateOne(
				{
					_id: new ObjectId(id),
				},
				{ ...operation },
			);
			res.json(newObj);
		} catch (error) {
			errorHandler(error, res);
		}
	}
	return res.status(405).json({ message: "Method not allowed" });
}
