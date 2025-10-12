import type { Id } from "@/convex/_generated/dataModel";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { Experimental_Agent as Agent } from "ai";

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
				descricao: string;
				status: "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDO";
		  }
		| false;
}

type AIResponse = string;

const SYSTEM_PROMPT = `Você é um assistente virtual de atendimento ao cliente para a empresa Ampere, uma empresa especializada em energia solar fotovoltaica.

Seu papel é:
- Atender clientes de forma amigável e profissional
- Responder perguntas sobre produtos e serviços de energia solar
- Coletar informações iniciais dos clientes
- Agendar visitas técnicas quando solicitado
- Fornecer informações gerais sobre a empresa

Informações sobre a empresa:
- Nome: Ampere Energia Solar
- Endereço: Rua 28, n.º 1842, Centro, CEP 38300-082, Ituiutaba/MG
- Segmento: Energia Solar (instalações, projetos, homologação, instalação, manutenção, etc)
- Serviços: Projetos fotovoltaicos residenciais, comerciais e industriais, além de consórcios de energia, seguro, monitoramento, etc

Diretrizes de resposta:
- Seja breve e objetivo (máximo 2-3 parágrafos)
- Use linguagem clara e acessível
- Seja educado e empático
- Não invente informações que você não tem

Formato de resposta:
Você deve responder em JSON com a seguinte estrutura:
{
  "message": "sua mensagem para o cliente (se houver)",
}`;

export const agent = new Agent({
	model: "openai/gpt-4o",
	system: SYSTEM_PROMPT,
	tools: {},
	toolChoice: "none",
});

export async function getAgentResponse({ chatSummary }: { chatSummary: ChatSummary }): Promise<AIResponse> {
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

		const userPrompt = `Você está encarregando de responder ao cliente.

### INFORMAÇÕES DO CLIENTE
- Nome: ${chatSummary.cliente.nome}
- Telefone: ${chatSummary.cliente.telefone}
${chatSummary.cliente.email ? `- Email: ${chatSummary.cliente.email}` : ""}
${chatSummary.cliente.cpfCnpj ? `- CPF/CNPJ: ${chatSummary.cliente.cpfCnpj}` : ""}

### HISTÓRICO DA CONVERSA
${conversationHistory}

${
	chatSummary.atendimentoAberto
		? `
### ATENDIMENTO EM ABERTO
- ID: ${chatSummary.atendimentoAberto.id}
- Descrição: ${chatSummary.atendimentoAberto.descricao}
- Status: ${chatSummary.atendimentoAberto.status}
`
		: ""
}

Analise a conversa e responda apropriadamente. Lembre-se de retornar apenas JSON válido.`;

		// Generate response using AI
		const { text } = await agent.generate({
			prompt: userPrompt,
		});

		return text;
	} catch (error) {
		console.error("[AI_AGENT] Error generating response:", error);
		// Return a safe fallback
		return "Desculpe, estou com dificuldades técnicas. Vou transferir você para um de nossos atendentes.";
	}
}
