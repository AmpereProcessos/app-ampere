import { apiHandler } from "@/utils/api";
import {
	getServiceObservationsFromObras,
	getServiceOrderInverterMetadataFromProject,
	getServiceOrderModulesMetadataFromProject,
	getServiceOrderTagsFromProject,
} from "@/utils/methods/util/service-order";
import type { TFileReference } from "@/utils/schemas/crm/file-reference.schema";
import type { TProject } from "@/utils/schemas/projects";
import type { TPurchaseControl } from "@/utils/schemas/purchases";
import type { TServiceOrder } from "@/utils/schemas/service-order";
import { type TTransportControl, TransportControlTransportItemSchema } from "@/utils/schemas/transport-controls";
import connectToCRMDatabase from "@/utils/services/mongodb/crm/main";
import connectToDatabase from "@/utils/services/mongodb/projects";
import createHttpError from "http-errors";
import { type Collection, ObjectId } from "mongodb";
import type { NextApiHandler } from "next";
import z from "zod";

export const UpdateTransportControlItemInputSchema = z.object({
	transportControlId: z.string({ required_error: "ID do controle de transporte não informado." }),
	itemIndex: z.number({ required_error: "Índice do item não informado." }),
	changes: TransportControlTransportItemSchema.partial(),
});
export type TUpdateTransportControlItemInput = z.infer<typeof UpdateTransportControlItemInputSchema>;

async function updateTransportControlItem({ input }: { input: TUpdateTransportControlItemInput }) {
	const { transportControlId, itemIndex, changes } = input;

	console.log("[INFO] [UPDATE-TRANSPORT-CONTROL-ITEM] Starting", input);
	const db = await connectToDatabase();
	const crmDb = await connectToCRMDatabase();
	const fileReferencesCollection: Collection<TFileReference> = crmDb.collection("file-references");
	const projectsCollection: Collection<TProject> = db.collection("dados");
	const purchaseControlsCollection: Collection<TPurchaseControl> = db.collection("controles-compras");
	const transportControlsCollection: Collection<TTransportControl> = db.collection("controles-transportes");
	const serviceOrdersCollection: Collection<TServiceOrder> = db.collection("ordensDeServico");

	const previousTransportControl = await transportControlsCollection.findOne({ _id: new ObjectId(transportControlId) });
	if (!previousTransportControl) throw new createHttpError.NotFound("Controle de transporte não encontrado.");

	const previousTransportControlItem = previousTransportControl.itens[itemIndex];
	if (!previousTransportControlItem) throw new createHttpError.NotFound("Item de controle de transporte não encontrado.");

	const updatedTransportControlItems = previousTransportControl.itens.map((item, index) => (index === itemIndex ? { ...item, ...changes } : item));
	const updateTransportControlResponse = await transportControlsCollection.updateOne(
		{ _id: new ObjectId(transportControlId) },
		{ $set: { itens: updatedTransportControlItems } },
	);
	if (!updateTransportControlResponse.acknowledged)
		throw new createHttpError.InternalServerError("Oops, houve um erro ao atualizar o item do controle de transporte.");

	const updatedTransportControl = await transportControlsCollection.findOne({ _id: new ObjectId(transportControlId) });
	if (!updatedTransportControl) throw new createHttpError.InternalServerError("Oops, houve um erro ao atualizar o item do controle de transporte.");

	const updatedTransportControlItem = updatedTransportControl.itens[itemIndex];

	if (!previousTransportControlItem.dataEfetivacao && updatedTransportControlItem.dataEfetivacao) {
		console.log("[INFO] [UPDATE-TRANSPORT-CONTROL-ITEM] Effetivation identified, starting triggers");
		const attachments = updatedTransportControlItem.anexos || [];

		// If the item was effectivated thought the update, we need to update the purchase control delivery date and status
		const purchaseControl = await purchaseControlsCollection.findOne({ _id: new ObjectId(previousTransportControlItem.id) });
		if (!purchaseControl) throw new createHttpError.NotFound("Controle de compra não encontrado.");
		await purchaseControlsCollection.updateOne(
			{ _id: new ObjectId(previousTransportControlItem.id) },
			{ $set: { "entrega.dataEfetivacao": updatedTransportControlItem.dataEfetivacao, "entrega.status": "ENTREGUE" } },
		);

		if (purchaseControl.projeto.id) {
			console.log("[INFO] [UPDATE-TRANSPORT-CONTROL-ITEM] Purchase control project found, starting project update");
			// If purchase control has a vinculated project, update the project delivery date and delivery status
			const project = await projectsCollection.findOne({ _id: new ObjectId(purchaseControl.projeto.id) });
			if (!project) throw new createHttpError.NotFound("Projeto não encontrado.");
			await projectsCollection.updateOne(
				{ _id: new ObjectId(purchaseControl.projeto.id) },
				{ $set: { "compra.status": "ENTREGUE", "compra.dataEntrega": updatedTransportControlItem.dataEfetivacao } },
			);

			// Generating the service order trigger
			const serviceOrder: TServiceOrder = {
				categoria: "MONTAGEM",
				etiquetas: getServiceOrderTagsFromProject(project),
				favorecido: {
					nome: project.nomeDoContrato || "",
					contato: project.telefone || "",
				},
				idAnaliseTecnica: project.idVisitaTecnica,
				anotacoes: "",
				projeto: {
					id: project._id.toString() || null, // id do projeto ampère (contrato nosso, seja SFV, O&M, Montagem, Produto avulso, etc),
					nome: project.nomeDoContrato || null, // nome do projeto no sistema (de modo a facilitar a identificação, e não fazer queries extras no sistema)
					identificador: project.qtde || null, // identificador QTDE do projeto no banco de projetos
					tipo: project.tipoDeServico || null, // tipo do projeto
					vendedorNome: project.vendedor?.nome || null,
					contratoDataAssinatura: project.contrato?.dataAssinatura,
					compraEntregaDataPrevisao: project.compra?.previsaoEntrega,
					compraEntregaDataEfetivacao: project.compra?.dataEntrega,
					homologacaoAcessoDataResposta: project.homologacao?.acesso.dataResposta,
					homologacaoVistoriaDataEfetivacao: project.homologacao?.vistoria.dataEfetivacao,
				},
				descricao: `SERVIÇO DO PROJETO ${project.nomeDoContrato}`, // servico executado
				localizacao: {
					cep: project.cep?.toString() || "",
					uf: project.uf,
					cidade: project.cidade,
					bairro: project.bairro,
					endereco: project.logradouro,
					numeroOuIdentificador: project.numeroResidencia?.toString() || "",
				},
				responsavel: {
					nome: project.obra?.equipeResp || "",
					tipo: project.obra?.equipeResp ? "INTERNO" : "EXTERNO",
				},
				// configurar: false,
				urgencia: "POUCO URGENTE",
				periodo: {
					inicio: null,
					fim: null,
				},
				pagamento: {
					recebedor: null,
					valor: null,
				},
				cobranca: {
					pagador: null,
					valor: null,
				},
				autor: {
					id: purchaseControl.autor.id,
					nome: purchaseControl.autor.nome,
					avatar_url: purchaseControl.autor.avatar_url,
				},
				equipamentos: {
					modulos: getServiceOrderModulesMetadataFromProject(project),
					inversor: getServiceOrderInverterMetadataFromProject(project),
					disponivel: null,
					retirada: null,
				},
				detalhes: {
					pontoAgua: "",
					senhaWifi: "",
					configuracaoMonitoramento: false,
					possuiTrafo: false,
					tipoEstrutura: project.estruturaPersonalizada?.tipo || null,
					tipoTelha: project.visitaTecnica?.tipoDaTelha || null,
					tipoPadrao: project.padrao?.tipo || null,
					tipoSaidaPadrao: project.visitaTecnica?.saidaDoCliente || null,
					amperagemPadrao: project.visitaTecnica?.amperagem || null,
					responsabilidadePadrao: project.padrao?.respInstalacao,
					topologia: project.sistema?.topologia,
				},
				observacoes: getServiceObservationsFromObras(project.obra?.observacoes || ""),
				dataPrevisaoLiberacao: project.compra.previsaoEntrega,
				dataLiberacao: project.compra.dataEntrega || new Date().toISOString(),
				dataInsercao: new Date().toISOString(),
			};
			const insertServiceOrderResponse = await serviceOrdersCollection.insertOne(serviceOrder);
			const insertedServiceOrderId = insertServiceOrderResponse.insertedId.toString();
			// Updating the project with the service order id
			await projectsCollection.updateOne({ _id: new ObjectId(purchaseControl.projeto.id) }, { $set: { idOrdemServico: insertedServiceOrderId } });
		}

		const fileReferencesToInsert: TFileReference[] = attachments.map((attachment) => ({
			titulo: attachment.titulo,
			categorias: ["COMPRAS"],
			formato: attachment.formato,
			url: attachment.url,
			tamanho: attachment.tamanho,
			autor: {
				id: purchaseControl.autor.id,
				nome: purchaseControl.autor.nome,
				avatar_url: purchaseControl.autor.avatar_url,
			},
			dataInsercao: new Date().toISOString(),
			idTransporte: transportControlId,
			idCompra: updatedTransportControlItem.id,
			idProjeto: purchaseControl.projeto.id,
		}));

		if (fileReferencesToInsert.length > 0) {
			console.log(`[INFO] [UPDATE-TRANSPORT-CONTROL-ITEM] ${fileReferencesToInsert.length} file references to insert found, starting insertion`);
			await fileReferencesCollection.insertMany(fileReferencesToInsert);
		}
	}
	return {
		data: {
			updatedId: transportControlId.toString(),
		},
		message: "Item de controle de transporte atualizado com sucesso.",
	};
}
export type TUpdateTransportControlItemOutput = Awaited<ReturnType<typeof updateTransportControlItem>>;

const updateTransportControlItemRoute: NextApiHandler<TUpdateTransportControlItemOutput> = async (req, res) => {
	const input = UpdateTransportControlItemInputSchema.parse(req.body);
	const result = await updateTransportControlItem({ input });
	return res.status(200).json(result);
};

export default apiHandler({
	PUT: updateTransportControlItemRoute,
});
