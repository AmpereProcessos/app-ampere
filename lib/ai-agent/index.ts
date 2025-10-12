import type { Id } from "@/convex/_generated/dataModel";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

const AI_GATEWAY_KEY = process.env.AI_GATEWAY_API_KEY;

// Configure OpenAI with Vercel AI Gateway
const openai = createOpenAI({
	apiKey: AI_GATEWAY_KEY,
	baseURL: "https://gateway.ai.cloudflare.com/v1/YOUR_ACCOUNT_ID/YOUR_GATEWAY_ID/openai", // Update with your gateway URL
});

interface ChatSummary {
	id: Id<"chats">;
	cliente: {
		nome: string;
		telefone: string;
		email?: string;
		cpfCnpj?: string;
	};
	ultimasMensagens: Array<{
		id: Id<"messages">;
		autorTipo: "cliente" | "usuario" | "ai";
		conteudoTipo?: "IMAGEM" | "DOCUMENTO" | "VIDEO" | "AUDIO";
		conteudoTexto?: string;
		conteudoMidiaUrl?: string;
		dataEnvio: number;
		atendimentoId?: Id<"services">;
	}>;
	atendimentoAberto:
		| {
				id: Id<"services">;
				status: "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDO";
		  }
		| false;
}

interface AIResponse {
	shouldTransferToHuman: boolean;
	message?: string;
	reason?: string;
}

const SYSTEM_PROMPT = `Você é um assistente virtual de atendimento ao cliente para a empresa Ampere, uma empresa especializada em energia solar fotovoltaica.

Seu papel é:
- Atender clientes de forma amigável e profissional
- Responder perguntas sobre produtos e serviços de energia solar
- Coletar informações iniciais dos clientes
- Agendar visitas técnicas quando solicitado
- Fornecer informações gerais sobre a empresa

Você DEVE transferir para atendimento humano quando:
1. O cliente explicitamente solicitar falar com um humano/atendente
2. Houver questões técnicas complexas que você não pode responder
3. O cliente demonstrar insatisfação ou frustração
4. Houver necessidade de negociação de valores ou condições comerciais
5. O cliente solicitar alterações em projetos ou contratos existentes
6. Você não tiver certeza de como ajudar

Informações sobre a empresa:
- Nome: Ampere Energia Solar
- Segmento: Instalação e manutenção de sistemas de energia solar fotovoltaica
- Serviços: Projetos residenciais, comerciais e industriais

Diretrizes de resposta:
- Seja breve e objetivo (máximo 2-3 parágrafos)
- Use linguagem clara e acessível
- Seja educado e empático
- Não invente informações que você não tem
- Quando em dúvida, transfira para humano

Formato de resposta:
Você deve responder em JSON com a seguinte estrutura:
{
  "shouldTransferToHuman": boolean,
  "message": "sua mensagem para o cliente (se houver)",
  "reason": "motivo da transferência (se shouldTransferToHuman for true)"
}`;

export async function generateResponse({ chatSummary }: { chatSummary: ChatSummary }): Promise<AIResponse> {
	try {
		if (!chatSummary) {
			throw new Error("Chat não encontrado");
		}

		// Build conversation context
		const conversationHistory = chatSummary.ultimasMensagens
			.reverse() // Oldest first
			.map((msg: ChatSummary["ultimasMensagens"][0]) => {
				const role = msg.autorTipo === "cliente" ? "Cliente" : msg.autorTipo === "ai" ? "Você (AI)" : "Atendente Humano";
				let content = msg.conteudoTexto || "";

				if (msg.conteudoTipo && !content) {
					content = `[${msg.conteudoTipo}]`;
				}

				return `${role}: ${content}`;
			})
			.join("\n");

		const userPrompt = `Informações do cliente:
- Nome: ${chatSummary.cliente.nome}
- Telefone: ${chatSummary.cliente.telefone}
${chatSummary.cliente.email ? `- Email: ${chatSummary.cliente.email}` : ""}
${chatSummary.cliente.cpfCnpj ? `- CPF/CNPJ: ${chatSummary.cliente.cpfCnpj}` : ""}

Histórico da conversa (últimas mensagens):
${conversationHistory}

${chatSummary.atendimentoAberto ? "OBS: Há um atendimento em aberto para este cliente." : ""}

Analise a conversa e responda apropriadamente. Lembre-se de retornar apenas JSON válido.`;

		// Generate response using AI
		const { text } = await generateText({
			model: openai("gpt-4o"),
			system: SYSTEM_PROMPT,
			prompt: userPrompt,
			temperature: 0.7,
		});

		// Parse JSON response
		const response = JSON.parse(text) as AIResponse;

		return response;
	} catch (error) {
		console.error("[AI_AGENT] Error generating response:", error);
		// Return a safe fallback
		return {
			shouldTransferToHuman: true,
			message: "Desculpe, estou com dificuldades técnicas. Vou transferir você para um de nossos atendentes.",
			reason: "Erro ao gerar resposta de IA",
		};
	}
}
