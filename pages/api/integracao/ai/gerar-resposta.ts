import { getAgentResponse } from "@/lib/ai-agent";
import type { NextApiRequest, NextApiResponse } from "next";
import z from "zod";

const GenerateAIResponseInputSchema = z.object({
	chatSummary: z.object({
		id: z.string(),
		cliente: z.object({
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
				status: z.union([z.literal("PENDENTE"), z.literal("EM_ANDAMENTO"), z.literal("CONCLUIDO")]),
			}),
			z.literal(false),
		]),
	}),
});

export type GenerateAIResponseInput = z.infer<typeof GenerateAIResponseInputSchema>;

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

		// Generate AI response (type casting is safe as validated by zod schema)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const aiResponse = await getAgentResponse({ chatSummary: chatSummary as any });

		return res.status(200).json({
			success: true,
			message: aiResponse,
		});
	} catch (error) {
		console.error("[API] [GERAR_RESPOSTA] Error:", error);
		return res.status(500).json({
			success: false,
			error: "Erro ao gerar resposta de IA",
			details: error instanceof Error ? error.message : "Erro desconhecido",
		});
	}
}
