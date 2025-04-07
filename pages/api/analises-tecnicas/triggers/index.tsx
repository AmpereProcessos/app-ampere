import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import type { TProject } from "@/utils/schemas/projects";
import type { TServiceOrder } from "@/utils/schemas/service-order";
import type { TTechnicalAnalysis } from "@/utils/schemas/technical-analysis";
import connectToCRMDatabase from "@/utils/services/mongodb/crm/main";
import connectToDatabase from "@/utils/services/mongodb/projects";
import createHttpError from "http-errors";
import { type Collection, ObjectId, type WithId } from "mongodb";
import type { NextApiHandler } from "next";
import { z } from "zod";

const TriggerType = z.enum(["create-technical-analysis-service-order"]);
const HandleTriggerPayload = z.object({
	technicalAnalysisId: z.string({ required_error: "ID da análise técnica não informado.", invalid_type_error: "Tipo não válido para o ID da análise técnica." }),
	triggerType: TriggerType,
});
export type THandleTechnicalAnalysisTriggerInput = z.infer<typeof HandleTriggerPayload>;
type PostResponse = {
	data: { insertedId: string };
	message: string;
};
const handleTechnicalAnalysisTrigger: NextApiHandler<PostResponse> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const { technicalAnalysisId, triggerType } = HandleTriggerPayload.parse(req.body);

	console.log("ID DA ANÁLISE TÉCNICA", technicalAnalysisId);
	const db = await connectToDatabase();
	const crmDb = await connectToCRMDatabase();
	const projectsCollection: Collection<TProject> = db.collection("dados");
	const technicalAnalysesCollection: Collection<TTechnicalAnalysis> = crmDb.collection("technical-analysis");
	const serviceOrdersCollection: Collection<TServiceOrder> = db.collection("ordensDeServico");
	const technicalAnalysis = await technicalAnalysesCollection.findOne({
		_id: new ObjectId(technicalAnalysisId),
	});

	if (!technicalAnalysis) {
		throw new createHttpError.NotFound("Análise técnica não encontrada.");
	}
	if (triggerType === "create-technical-analysis-service-order") {
		let project: WithId<TProject> | null = null;

		project = await projectsCollection.findOne({
			_id: new ObjectId(technicalAnalysis.idParceiro),
		});

		const technicalAnalysisModules = technicalAnalysis.equipamentos.filter((e) => e.categoria === "MÓDULO");
		const technicalAnalysisInverters = technicalAnalysis.equipamentos.filter((e) => e.categoria === "INVERSOR");

		const serviceOrder: TServiceOrder = {
			categoria: "MONTAGEM",
			etiquetas: [],
			favorecido: {
				nome: technicalAnalysis.nome || "",
				contato: "",
			},
			anotacoes: "",
			idAnaliseTecnica: technicalAnalysisId,
			projeto: {
				id: project?._id.toString() || null, // id do projeto ampère (contrato nosso, seja SFV, O&M, Montagem, Produto avulso, etc),
				nome: project?.nomeDoContrato || null, // nome do projeto no sistema (de modo a facilitar a identificação, e não fazer queries extras no sistema)
				identificador: project?.qtde || null, // identificador QTDE do projeto no banco de projetos
				tipo: project?.tipoDeServico || null, // tipo do projeto
			},
			descricao: `SERVIÇO DO CLIENTE ${technicalAnalysis.nome}`, // servico executado
			localizacao: {
				cep: technicalAnalysis.localizacao.cep?.toString() || "",
				uf: technicalAnalysis.localizacao?.uf || "",
				cidade: technicalAnalysis.localizacao?.cidade || "",
				bairro: technicalAnalysis.localizacao?.bairro || "",
				endereco: technicalAnalysis.localizacao?.endereco || "",
				numeroOuIdentificador: technicalAnalysis.localizacao?.numeroOuIdentificador || "",
			},
			responsavel: {
				nome: project?.obra?.equipeResp || "",
				tipo: project?.obra?.equipeResp ? "INTERNO" : "EXTERNO",
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
				modulos: {
					qtde: technicalAnalysisModules.reduce((acc, curr) => acc + curr.qtde, 0),
					modelo: technicalAnalysisModules.map((e) => `${e.qtde}x ${e.modelo}`).join(", "),
					potencia: technicalAnalysisModules.map((e) => `${e.qtde}x ${e.potencia}`).join(", "),
				},
				inversor: {
					qtde: technicalAnalysisInverters.reduce((acc, curr) => acc + curr.qtde, 0),
					modelo: technicalAnalysisInverters.map((e) => `${e.qtde}x ${e.modelo}`).join(", "),
					potencia: technicalAnalysisInverters.map((e) => `${e.qtde}x ${e.potencia}`).join(", "),
				},
				disponivel: null,
				retirada: null,
			},
			detalhes: {
				pontoAgua: "",
				senhaWifi: "",
				configuracaoMonitoramento: false,
				possuiTrafo: false,
				tipoEstrutura: null,
				tipoTelha: null,
				tipoPadrao: null,
				tipoSaidaPadrao: null,
				amperagemPadrao: null,
				responsabilidadePadrao: null,
				topologia: null,
			},
			observacoes: [],
			dataPrevisaoLiberacao: null,
			dataLiberacao: null,
			dataInsercao: new Date().toISOString(),
		};

		const insertServiceOrderResponse = await serviceOrdersCollection.insertOne(serviceOrder);
		const insertedServiceOrderId = insertServiceOrderResponse.insertedId.toString();

		await serviceOrdersCollection.updateOne({ _id: new ObjectId(insertedServiceOrderId) }, { $set: { idAnaliseTecnica: technicalAnalysisId } });
		return res.status(200).json({
			data: { insertedId: insertedServiceOrderId },
			message: "Ordem de serviço criada com sucesso.",
		});
	}
};
export default apiHandler({
	POST: handleTechnicalAnalysisTrigger,
});
