import { getAgentResponse } from "@/lib/ai-agent";
import { formatDateAsLocale, formatLocation } from "@/utils/methods/formatting";
import type { TClient } from "@/utils/schemas/crm/client.schema";
import type { TProject } from "@/utils/schemas/projects";
import connectToCRMDatabase from "@/utils/services/mongodb/crm/main";
import connectToDatabase from "@/utils/services/mongodb/projects";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import z from "zod";

const GenerateAIResponseInputSchema = z.object({
	chatSummary: z.object({
		id: z.string(),
		cliente: z.object({
			idApp: z.string(),
			nome: z.string(),
			telefone: z.string(),
			email: z.string().optional(),
			cpfCnpj: z.string().optional(),
		}),
		ultimasMensagens: z.array(
			z.object({
				id: z.string(),
				autorTipo: z.union([z.literal("cliente"), z.literal("usuario"), z.literal("ai")]),
				conteudoTipo: z.union([z.literal("IMAGEM"), z.literal("DOCUMENTO"), z.literal("VIDEO"), z.literal("AUDIO")]).optional(),
				conteudoTexto: z.string().optional(),
				conteudoMidiaUrl: z.string().optional(),
				dataEnvio: z.number(),
				atendimentoId: z.string().optional(),
			}),
		),
		atendimentoAberto: z.union([
			z.object({
				id: z.string(),
				descricao: z.string(),
				status: z.union([z.literal("PENDENTE"), z.literal("EM_ANDAMENTO"), z.literal("CONCLUIDO")]),
			}),
			z.literal(false),
		]),
	}),
});

export type GenerateAIResponseInput = z.infer<typeof GenerateAIResponseInputSchema>;

const GenerateAIResponseOutputSchema = z.union([
	z.object({
		success: z.literal(true, {
			required_error: "A flag de sucesso é obrigatória",
			invalid_type_error: "A flag de sucesso deve ser um booleano",
		}),
		message: z.string({
			required_error: "A mensagem é obrigatória",
			invalid_type_error: "A mensagem deve ser uma string",
		}),
	}),
	z.object({
		success: z.literal(false, {
			required_error: "A flag de sucesso é obrigatória",
			invalid_type_error: "A flag de sucesso deve ser um booleano",
		}),
		error: z.string({
			required_error: "O erro é obrigatório",
			invalid_type_error: "O erro deve ser uma string",
		}),
		details: z.array(
			z.string({
				required_error: "Os detalhes são obrigatórios",
				invalid_type_error: "Os detalhes devem ser uma array de strings",
			}),
		),
	}),
]);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	// Only allow POST requests
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	try {
		// Validate input
		const validationResult = GenerateAIResponseInputSchema.safeParse(req.body);

		if (!validationResult.success) {
			return res.status(400).json({
				success: false,
				error: "Dados inválidos",
				details: validationResult.error.errors,
			});
		}

		const { chatSummary } = validationResult.data;

		const crmDb = await connectToCRMDatabase();
		const clientsCollection = crmDb.collection<TClient>("clients");
		const client = await clientsCollection.findOne({ _id: new ObjectId(chatSummary.cliente.idApp) });
		if (!client) {
			return res.status(400).json({
				success: false,
				error: "Cliente não encontrado",
				details: ["Cliente não encontrado"],
			});
		}

		const projectsDb = await connectToDatabase();
		const projectsCollection = projectsDb.collection<TProject>("dados");
		const projects = await projectsCollection.find({ idClienteCRM: client._id.toString() }).toArray();

		const projectsFormatted = projects.map((p) => {
			let status: "EM_ANDAMENTO" | "CONCLUIDO" = "EM_ANDAMENTO";

			if (p.tipoDeServico === "OPERAÇÃO E MANUTENÇAO") {
				if (p.obra.saida) status = "CONCLUIDO";
			}
			if (p.tipoDeServico === "MONTAGEM E DESMONTAGEM") {
				if (p.obra.saida) status = "CONCLUIDO";
			}
			if (p.tipoDeServico === "SISTEMA FOTOVOLTAICO") {
				if (p.homologacao.vistoria.dataEfetivacao) status = "CONCLUIDO";
			}
			if (p.tipoDeServico === "SEGURO DE SISTEMA FOTOVOLTAICO") {
				if (p.seguro.dataFim && new Date() > new Date(p.seguro.dataFim)) status = "CONCLUIDO";
			}
			return {
				id: p._id.toString(),
				codigo: p.qtde,
				status,
				nome: p.nomeDoContrato,
				tipo: p.tipoDeServico,
				localizacao: formatLocation({
					location: {
						uf: p.uf || "N/A",
						cidade: p.cidade || "N/A",
						cep: p.cep?.toString() || "N/A",
						bairro: p.bairro || "N/A",
						endereco: p.logradouro || "N/A",
						numeroOuIdentificador: p.numeroResidencia?.toString() || "N/A",
						latitude: p.latitude || "N/A",
						longitude: p.longitude || "N/A",
					},
					includeCity: true,
					includeUf: true,
					includeCEP: true,
				}),
				datas: {
					"ASSINATURA DO CONTRATO": formatDateAsLocale(p.contrato.dataAssinatura) || "N/A",
					"SOLICITAÇÃO DE ACESSO DE HOMOLOGAÇÃO": formatDateAsLocale(p.homologacao.acesso.dataSolicitacao) || "N/A",
					"APROVAÇÃO DE ACESSO DE HOMOLOGAÇÃO": formatDateAsLocale(p.homologacao.acesso.dataResposta) || "N/A",
					"PEDIDO DOS EQUIPAMENTOS": formatDateAsLocale(p.compra.dataPedido) || "N/A",
					"ENTREGA DOS EQUIPAMENTOS": formatDateAsLocale(p.compra.dataEntrega) || "N/A",
					"INÍCIO DA EXECUÇÃO DO SERVIÇO": formatDateAsLocale(p.obra.entrada) || "N/A",
					"TÉRMINO DA EXECUÇÃO DO SERVIÇO": formatDateAsLocale(p.obra.saida) || "N/A",
					"SOLICITAÇÃO DA VISTORIA": formatDateAsLocale(p.homologacao.vistoria.dataSolicitacao) || "N/A",
					"APROVAÇÃO DA VISTORIA": formatDateAsLocale(p.homologacao.vistoria.dataEfetivacao) || "N/A",
				},
				produtos: p.produtos || [],
				servicos: p.servicos || [],
			};
		});
		console.log("[INFO] [GENERATE_AI_RESPONSE] Projetos formatados:", projectsFormatted);
		// Generate AI response (type casting is safe as validated by zod schema)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const aiResponse = await getAgentResponse({
			details: {
				id: chatSummary.id,
				cliente: {
					...chatSummary.cliente,
					cidade: client.cidade,
					uf: client.uf,
					cep: client.cep ?? undefined,
					bairro: client.bairro ?? undefined,
					endereco: client.endereco ?? undefined,
					numeroOuIdentificador: client.numeroOuIdentificador ?? undefined,
				},
				ultimasMensagens: chatSummary.ultimasMensagens,
				atendimentoAberto: chatSummary.atendimentoAberto,
				projetos: projectsFormatted,
			},
		});

		const validatedResponse = GenerateAIResponseOutputSchema.parse({
			success: true,
			message: aiResponse,
		});
		return res.status(200).json(validatedResponse);
	} catch (error) {
		console.error("[API] [GERAR_RESPOSTA] Error:", error);
		const validatedResponse = GenerateAIResponseOutputSchema.parse({
			success: false,
			error: error instanceof Error ? error.message : "Erro desconhecido",
			details: error instanceof Error ? error.message : "Erro desconhecido",
		});
		return res.status(500).json(validatedResponse);
	}
}
export type TGenerateAIResponseOutput = z.infer<typeof GenerateAIResponseOutputSchema>;
