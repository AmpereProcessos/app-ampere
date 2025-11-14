import { ObjectId, type AnyBulkWriteOperation, type Collection } from "mongodb";
import type { TServiceOrder } from "@/utils/schemas/service-order";
import connectToDatabase from "@/utils/services/mongodb/projects";
import type { Db } from "mongodb";
import type { NextApiHandler } from "next";
import type { TProject } from "@/utils/schemas/projects";
import { apiHandler } from "@/utils/api";
import {
	getServiceOrderModulesMetadataFromProject,
	getServiceOrderInverterMetadataFromProject,
	getServiceOrderTagsFromProject,
} from "@/utils/methods/util/service-order";

const handleSyncServiceOrders: NextApiHandler<any> = async (req, res) => {
	const db: Db = await connectToDatabase();

	const projectsCollection: Collection<TProject> = db.collection("dados");
	const serviceOrdersCollection: Collection<TServiceOrder> = db.collection("ordensDeServico");

	const projects = await projectsCollection
		.find({
			"obra.statusDaObra": {
				$ne: "CONCLUIDA",
			},
			"contrato.status": "ASSINADO",
			$or: [
				{ $and: [{ tipoDeServico: { $ne: "MONTAGEM E DESMONTAGEM" } }, { "compra.dataPedido": { $ne: null } }] },
				{ "obra.statusSolicitacao": "SOLICITADA" },
				{ "compra.statusEntrega": "ENTREGUE" },
			],
			tipoDeServico: { $nin: ["OPERAÇÃO E MANUTENÇÃO"] },
		})
		.toArray();

	const serviceOrders = await serviceOrdersCollection.find({}).toArray();

	const serviceOrdersUpdateBulkwrite: (AnyBulkWriteOperation<TServiceOrder> | null)[] = projects.map((project) => {
		const serviceOrder = serviceOrders.find((serviceOrder) => serviceOrder.projeto.id === project._id.toString());
		if (!serviceOrder) return null;
		return {
			updateOne: {
				filter: { _id: new ObjectId(serviceOrder._id) },
				update: {
					$set: {
						responsavel: {
							nome: project.obra?.equipeResp || "",
							tipo: project.obra?.equipeResp ? "INTERNO" : "EXTERNO",
						},
						etiquetas: getServiceOrderTagsFromProject(project),
						"projeto.vendedorNome": project.vendedor.nome,
						"projeto.contratoDataAssinatura": project.contrato?.dataAssinatura,
						"projeto.compraEntregaDataPrevisao": project.compra?.previsaoEntrega,
						"projeto.compraEntregaDataEfetivacao": project.compra?.dataEntrega,
						"projeto.homologacaoAcessoDataResposta": project.homologacao?.acesso.dataResposta,
						"projeto.homologacaoVistoriaDataEfetivacao": project.homologacao?.vistoria.dataEfetivacao,
						"periodo.inicio": project.obra.entrada,
						"periodo.fim": project.obra.saida,
						equipamentos: {
							modulos: getServiceOrderModulesMetadataFromProject(project),
							inversor: getServiceOrderInverterMetadataFromProject(project),
							disponivel: null,
							retirada: null,
						},
					},
				},
			},
		};
	});
	console.log(serviceOrdersUpdateBulkwrite.length);
	const bulkwriteResponse = await serviceOrdersCollection.bulkWrite(serviceOrdersUpdateBulkwrite.filter((b) => !!b));

	return res.status(200).json({
		bulkwriteResponse: bulkwriteResponse,
		bulkwrite: serviceOrdersUpdateBulkwrite.filter((b) => !!b),
	});
};

export default apiHandler({
	GET: handleSyncServiceOrders,
});
