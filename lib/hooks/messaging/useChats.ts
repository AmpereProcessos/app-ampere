import { useCallback, useEffect, useState } from "react";

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
};

type TChatsResult = {
	items: TChat[];
	hasMore: boolean;
	nextCursor: string | null;
};

export function useChats(whatsappPhoneNumberId: string | null, searchQuery?: string) {
	const [chats, setChats] = useState<TChat[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [hasMore, setHasMore] = useState(false);
	const [nextCursor, setNextCursor] = useState<string | null>(null);

	const fetchChats = useCallback(
		async (cursor?: string | null) => {
			if (!whatsappPhoneNumberId) {
				setIsLoading(false);
				return;
			}

			try {
				setIsLoading(true);
				setError(null);

				const params = new URLSearchParams({
					whatsappPhoneNumberId,
				});

				if (cursor) params.append("cursor", cursor);
				if (searchQuery) params.append("search", searchQuery);

				const response = await fetch(`/api/messaging/chats?${params.toString()}`);

				if (!response.ok) {
					throw new Error("Erro ao buscar conversas");
				}

				const data: TChatsResult = await response.json();

				if (cursor) {
					// Append to existing chats
					setChats((prev) => [...prev, ...data.items]);
				} else {
					// Replace chats
					setChats(data.items);
				}

				setHasMore(data.hasMore);
				setNextCursor(data.nextCursor);
			} catch (err) {
				console.error("Error fetching chats:", err);
				setError(err instanceof Error ? err.message : "Erro desconhecido");
			} finally {
				setIsLoading(false);
			}
		},
		[whatsappPhoneNumberId, searchQuery],
	);

	// Initial fetch
	useEffect(() => {
		setChats([]);
		setNextCursor(null);
		fetchChats();
	}, [fetchChats]);

	const loadMore = useCallback(() => {
		if (nextCursor && !isLoading) {
			fetchChats(nextCursor);
		}
	}, [nextCursor, isLoading, fetchChats]);

	const refresh = useCallback(() => {
		setChats([]);
		setNextCursor(null);
		fetchChats();
	}, [fetchChats]);

	const updateChat = useCallback((updatedChat: TChat) => {
		setChats((prev) => prev.map((chat) => (chat._id === updatedChat._id ? updatedChat : chat)));
	}, []);

	const addChat = useCallback((newChat: TChat) => {
		setChats((prev) => {
			// Check if chat already exists
			if (prev.some((chat) => chat._id === newChat._id)) {
				return prev;
			}
			return [newChat, ...prev];
		});
	}, []);

	return {
		chats,
		isLoading,
		error,
		hasMore,
		loadMore,
		refresh,
		updateChat,
		addChat,
	};
}
