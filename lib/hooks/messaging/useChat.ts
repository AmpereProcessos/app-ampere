import { useCallback, useEffect, useState } from "react";

type TService = {
	_id: string;
	status: "PENDENTE" | "EM ANDAMENTO" | "CONCLUÍDO" | "CANCELADO";
	descricao: string;
	atendente?: {
		tipo: "USUÁRIO" | "AGENTE-IA";
		id: string;
		nome: string;
		avatar?: string | null;
	} | null;
	dataInicio: string;
	dataFim?: string | null;
};

type TChat = {
	_id: string;
	whatsappTelefoneId: string;
	whatsappJanelaAtiva: boolean;
	cliente: {
		id: string;
		nome: string;
		telefone: string;
		avatar?: string | null;
	};
	mensagensNaoLidas: number;
	ultimaMensagemCliente?: {
		idMensagem: string;
		conteudoTipo: "TEXTO" | "IMAGEM" | "AUDIO" | "VIDEO" | "DOCUMENTO";
		conteudoTexto?: string | null;
		data: string;
	} | null;
	ultimaMensagemAtendente?: {
		idMensagem: string;
		conteudoTipo: "TEXTO" | "IMAGEM" | "AUDIO" | "VIDEO" | "DOCUMENTO";
		conteudoTexto?: string | null;
		data: string;
	} | null;
	atendimentoAberto?: TService | null;
};

export function useChat(chatId: string | null) {
	const [chat, setChat] = useState<TChat | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchChat = useCallback(async () => {
		if (!chatId) {
			setIsLoading(false);
			return;
		}

		try {
			setIsLoading(true);
			setError(null);

			const response = await fetch(`/api/messaging/chats/${chatId}`);

			if (!response.ok) {
				throw new Error("Erro ao buscar conversa");
			}

			const data: TChat = await response.json();
			setChat(data);
		} catch (err) {
			console.error("Error fetching chat:", err);
			setError(err instanceof Error ? err.message : "Erro desconhecido");
		} finally {
			setIsLoading(false);
		}
	}, [chatId]);

	useEffect(() => {
		fetchChat();
	}, [fetchChat]);

	const refresh = useCallback(() => {
		fetchChat();
	}, [fetchChat]);

	const updateChatData = useCallback((updatedChat: Partial<TChat>) => {
		setChat((prev) => (prev ? { ...prev, ...updatedChat } : null));
	}, []);

	return {
		chat,
		isLoading,
		error,
		refresh,
		updateChatData,
	};
}
