import connectToDatabase from "@/utils/services/mongodb/projects";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import type { NextApiHandler } from "next";
import { z } from "zod";
import type { TProject } from "@/utils/schemas/projects";
import { type Collection, ObjectId } from "mongodb";
import createHttpError from "http-errors";
import type { TServiceOrder } from "@/utils/schemas/service-order";
import { getServiceOrderInverterMetadataFromProject, getServiceOrderModulesMetadataFromProject, getServiceOrderTagsFromProject } from "@/utils/methods/util/service-order";

type PostResponse = {
	data: { insertedId: string };
	message: string;
};
const TriggerType = z.enum(["create-project-main-service-order", "create-project-main-purchase-control", "create-project-main-revenue"]);

const HandleTriggerPayload = z.object({
	projectId: z.string({ required_error: "ID do projeto não informado.", invalid_type_error: "Tipo não válido para o ID do projeto." }),
	triggerType: TriggerType,
});
export type THandleProjectTriggerInput = z.infer<typeof HandleTriggerPayload>;
export const handleProjectTrigger: NextApiHandler<PostResponse> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const { projectId, triggerType } = HandleTriggerPayload.parse(req.body);

	const db = await connectToDatabase();
	const projectscollection: Collection<TProject> = db.collection("dados");
	const serviceOrdersCollection: Collection<TServiceOrder> = db.collection("ordensDeServico");
	const project = await projectscollection.findOne({ _id: new ObjectId(projectId) });

	if (!project) {
		throw new createHttpError.NotFound("Projeto não encontrado.");
	}
	if (triggerType === "create-project-main-service-order") {
		// Defining data for the service order based on the project information
		const serviceOrder: TServiceOrder = {
			categoria: "MONTAGEM",
			etiquetas: getServiceOrderTagsFromProject(project),
			favorecido: {
				nome: project.nomeDoContrato || "",
				contato: project.telefone || "",
			},
			anotacoes: "",
			projeto: {
				id: project._id.toString() || null, // id do projeto ampère (contrato nosso, seja SFV, O&M, Montagem, Produto avulso, etc),
				nome: project.nomeDoContrato || null, // nome do projeto no sistema (de modo a facilitar a identificação, e não fazer queries extras no sistema)
				identificador: project.qtde || null, // identificador QTDE do projeto no banco de projetos
				tipo: project.tipoDeServico || null, // tipo do projeto
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
				id: session?.user.id,
				nome: session.user.nome,
				avatar_url: session?.user.avatar_url,
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
			observacoes: [],
			dataPrevisaoLiberacao: project.compra.previsaoEntrega,
			dataLiberacao: project.compra.dataEntrega,
			dataInsercao: new Date().toISOString(),
		};

		// Inserting the new service order
		const insertServiceOrderResponse = await serviceOrdersCollection.insertOne(serviceOrder);
		const insertedServiceOrderId = insertServiceOrderResponse.insertedId.toString();

		// Updating the project with the service order id
		await projectscollection.updateOne({ _id: new ObjectId(projectId) }, { $set: { idOrdemServico: insertedServiceOrderId } });

		return res.status(200).json({
			data: { insertedId: insertedServiceOrderId },
			message: "Ordem de serviço criada com sucesso.",
		});
	}
};

export default apiHandler({
	POST: handleProjectTrigger,
});
