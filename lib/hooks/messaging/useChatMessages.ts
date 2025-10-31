import { useCallback, useEffect, useState } from "react";

type TMessage = {
	_id: string;
	chat: { id: string };
	atendimento?: { id: string } | null;
	status: "ENVIADO" | "RECEBIDO" | "LIDO";
	whatsappId?: string | null;
	whatsappStatus?: "PENDENTE" | "ENVIADO" | "ENTREGUE" | "FALHOU" | null;
	conteudo: {
		tipo: "TEXTO" | "IMAGEM" | "AUDIO" | "VIDEO" | "DOCUMENTO";
		texto?: string | null;
		midiaUrl?: string | null;
		midiaTipo?: string | null;
		midiaTamanho?: number | null;
		midiaNomeArquivo?: string | null;
		midiaTextoProcessado?: string | null;
		midiaTextoProcessadoResumo?: string | null;
	};
	autor: {
		tipo: "CLIENTE" | "ATENDENTE" | "AGENTE-IA";
		id: string;
		nome: string;
		avatar?: string | null;
	};
	dataInsercao: string;
};

type TMessagesResult = {
	items: TMessage[];
	hasMore: boolean;
	nextCursor: string | null;
};

export function useChatMessages(chatId: string | null) {
	const [messages, setMessages] = useState<TMessage[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [hasMore, setHasMore] = useState(false);
	const [nextCursor, setNextCursor] = useState<string | null>(null);

	const fetchMessages = useCallback(
		async (cursor?: string | null, append = false) => {
			if (!chatId) {
				setIsLoading(false);
				return;
			}

			try {
				if (append) {
					setIsLoadingMore(true);
				} else {
					setIsLoading(true);
				}
				setError(null);

				const params = new URLSearchParams();
				if (cursor) params.append("cursor", cursor);

				const response = await fetch(`/api/messaging/chats/${chatId}/messages?${params.toString()}`);

				if (!response.ok) {
					throw new Error("Erro ao buscar mensagens");
				}

				const data: TMessagesResult = await response.json();

				if (append) {
					// Prepend older messages
					setMessages((prev) => [...data.items, ...prev]);
				} else {
					// Replace messages
					setMessages(data.items);
				}

				setHasMore(data.hasMore);
				setNextCursor(data.nextCursor);
			} catch (err) {
				console.error("Error fetching messages:", err);
				setError(err instanceof Error ? err.message : "Erro desconhecido");
			} finally {
				setIsLoading(false);
				setIsLoadingMore(false);
			}
		},
		[chatId],
	);

	// Initial fetch
	useEffect(() => {
		setMessages([]);
		setNextCursor(null);
		fetchMessages();
	}, [fetchMessages]);

	const loadOlderMessages = useCallback(() => {
		if (nextCursor && !isLoadingMore) {
			fetchMessages(nextCursor, true);
		}
	}, [nextCursor, isLoadingMore, fetchMessages]);

	const refresh = useCallback(() => {
		setMessages([]);
		setNextCursor(null);
		fetchMessages();
	}, [fetchMessages]);

	const addMessage = useCallback((newMessage: TMessage) => {
		setMessages((prev) => {
			// Check if message already exists
			if (prev.some((msg) => msg._id === newMessage._id)) {
				return prev;
			}
			return [...prev, newMessage];
		});
	}, []);

	const updateMessage = useCallback((updatedMessage: TMessage) => {
		setMessages((prev) => prev.map((msg) => (msg._id === updatedMessage._id ? updatedMessage : msg)));
	}, []);

	const markAsRead = useCallback(async () => {
		if (!chatId) return;

		try {
			const response = await fetch(`/api/messaging/chats/${chatId}/messages/mark-read`, {
				method: "POST",
			});

			if (!response.ok) {
				throw new Error("Erro ao marcar mensagens como lidas");
			}

			// Update local state
			setMessages((prev) => prev.map((msg) => (msg.autor.tipo === "CLIENTE" && msg.status !== "LIDO" ? { ...msg, status: "LIDO" as const } : msg)));
		} catch (err) {
			console.error("Error marking messages as read:", err);
		}
	}, [chatId]);

	return {
		messages,
		isLoading,
		isLoadingMore,
		error,
		hasMore,
		loadOlderMessages,
		refresh,
		addMessage,
		updateMessage,
		markAsRead,
	};
}
