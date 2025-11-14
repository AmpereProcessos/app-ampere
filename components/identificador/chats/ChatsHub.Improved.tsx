import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import LoadingComponent from "@/components/utils/LoadingComponent";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useConvexQuery } from "@/convex/utils";
import type { TAuthSession } from "@/lib/authentication/types";
import { useMediaQuery } from "@/lib/hooks/media-query";
import { cn } from "@/lib/utils";
import { WHATSAPP_TEMPLATES } from "@/lib/whatsapp/templates";
import { formatPhoneAsWhatsappId } from "@/lib/whatsapp/utils";
import { formatDateAsLocale, formatNameAsInitials } from "@/utils/methods/formatting";
import { useMutation, useQuery } from "convex/react";
import {
	AlertCircle,
	AlertTriangle,
	ArrowDown,
	ArrowLeft,
	Check,
	CheckCheck,
	Clock,
	FileText,
	ImageIcon,
	Loader2,
	MessageCircleIcon,
	PlayIcon,
	Plus,
	Search,
	Send,
	TextIcon,
	UserRound,
	X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { BsRobot } from "react-icons/bs";
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";
import ClientsVinculationMenu from "../crm-clientes/ClientsVinculationMenu";
import ProjectVinculationMenu from "../projects/ProjectVinculationMenu";
import FileUploadComponent from "./FileUploadComponent";
import MediaMessageDisplay from "./MediaMessageDisplay";
import { useDebounce, useLoadMoreChats, useLoadOlderMessages } from "./hooks/usePaginatedChats";

type ChatsHubProps = {
	session: TAuthSession;
	userHasMessageSendingPermission: boolean;
	whatsappConnection: typeof api.queries.connections.getWhatsappConnection._returnType;
};

function ChatsHub({ session, userHasMessageSendingPermission, whatsappConnection }: ChatsHubProps) {
	console.log(session);
	const isDesktop = useMediaQuery("(min-width: 1024px)");

	const { data: whatsappConnections } = useConvexQuery(api.queries.connections.getWhatsappConnection);
	const getChatByClientAppId = useMutation(api.mutations.chats.getChatByClientAppId);

	const [newChatMenuIsOpen, setNewChatMenuIsOpen] = useState<boolean>(false);
	const [selectedPhoneNumber, setSelectedPhoneNumber] = useState<string | null>(whatsappConnection?.telefones[0]?.whatsappTelefoneId ?? null);
	const [selectedChatId, setSelectedChatId] = useState<Id<"chats"> | null>(null);
	const [searchQuery, setSearchQuery] = useState<string>("");

	// Para mobile, usamos um estado para controlar se estamos mostrando a lista ou o chat
	const showingChatList = !selectedChatId || isDesktop;

	console.log("SELECTED PHONE NUMBER", selectedPhoneNumber);
	return (
		<div className="w-full max-h-[calc(100vh-200px)] grow flex flex-col items-center justify-center rounded-lg shadow-lg border border-primary/20 overflow-hidden">
			{/* Layout Desktop - duas colunas lado a lado */}
			{isDesktop ? (
				<div className="w-full h-full flex">
					<div className="flex flex-col gap-3 w-1/3 h-full border-r border-primary/20">
						<div className="w-full flex flex-col gap-2 border-b border-primary/20 px-3 py-3">
							<div className="flex items-center justify-between">
								<MessageCircleIcon className="w-5 h-5'" />
								<div className="flex items-center gap-2">
									<Select value={selectedPhoneNumber ?? undefined} onValueChange={(value) => setSelectedPhoneNumber(value)}>
										<SelectTrigger>
											<SelectValue placeholder="Selecione o número.." />
										</SelectTrigger>
										<SelectContent>
											{(whatsappConnections?.telefones ?? [])?.map((phone) => (
												<SelectItem key={phone.numero} value={phone.whatsappTelefoneId}>
													{phone.nome}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<Button onClick={() => setNewChatMenuIsOpen(true)} variant={"ghost"} size={"fit"} className="p-2 rounded-full">
										<Plus className="w-5 h-5" />
									</Button>
								</div>
							</div>
							{/* Search Input */}
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary/40" />
								<Input
									type="text"
									placeholder="Buscar conversas..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="pl-10 pr-10"
								/>
								{searchQuery && (
									<button
										onClick={() => setSearchQuery("")}
										className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary/40 hover:text-primary"
									>
										<X className="w-4 h-4" />
									</button>
								)}
							</div>
						</div>
						<div className="grow w-full flex flex-col gap-3 px-3 overflow-y-auto">
							{selectedPhoneNumber ? (
								<ChatHubList
									selectedPhoneNumber={selectedPhoneNumber}
									selectedChatId={selectedChatId}
									handleSelectChat={(chatId) => setSelectedChatId(chatId)}
									searchQuery={searchQuery}
								/>
							) : (
								<p className="text-primary/60 text-center text-sm italic">Selecione o número de telefone !</p>
							)}
						</div>
					</div>
					<div className="flex flex-col gap-3 w-2/3 h-full">
						{selectedChatId && selectedPhoneNumber ? (
							<ChatHubContent
								chatId={selectedChatId}
								whatsappPhoneNumberId={selectedPhoneNumber}
								session={session}
								onBack={() => setSelectedChatId(null)}
								isDesktop={isDesktop}
								userHasMessageSendingPermission={userHasMessageSendingPermission}
							/>
						) : (
							<div className="h-full w-full flex items-center flex-col justify-center">
								<MessageCircleIcon className="w-12 h-12 text-primary/40 mb-2" />
								<p className="text-primary/60 text-center text-sm italic">Selecione um chat para ver as mensagens</p>
							</div>
						)}
					</div>
				</div>
			) : (
				/* Layout Mobile - uma tela por vez com animações */
				<div className="relative w-full h-full overflow-hidden">
					{/* Lista de Chats - Mobile */}
					<div
						className={cn(
							"absolute inset-0 w-full h-full transition-transform duration-300 ease-in-out",
							showingChatList ? "translate-x-0" : "-translate-x-full",
						)}
					>
						<div className="flex flex-col gap-3 w-full h-full">
							<div className="w-full flex flex-col gap-2 border-b border-primary/20 px-3 py-3">
								<div className="flex items-center justify-between">
									<MessageCircleIcon className="w-5 h-5'" />
									<div className="flex items-center gap-2">
										<Select value={selectedPhoneNumber ?? undefined} onValueChange={(value) => setSelectedPhoneNumber(value)}>
											<SelectTrigger>
												<SelectValue placeholder="Selecione o número.." />
											</SelectTrigger>
											<SelectContent>
												{(whatsappConnections?.telefones ?? [])?.map((phone) => (
													<SelectItem key={phone.numero} value={phone.whatsappTelefoneId}>
														{phone.nome}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<Button onClick={() => setNewChatMenuIsOpen(true)} variant={"ghost"} size={"fit"} className="p-2 rounded-full">
											<Plus className="w-5 h-5" />
										</Button>
									</div>
								</div>
								{/* Search Input */}
								<div className="relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary/40" />
									<Input
										type="text"
										placeholder="Buscar conversas..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="pl-10 pr-10"
									/>
									{searchQuery && (
										<button
											onClick={() => setSearchQuery("")}
											className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary/40 hover:text-primary"
										>
											<X className="w-4 h-4" />
										</button>
									)}
								</div>
							</div>
							<div className="grow w-full flex flex-col gap-3 p-3 overflow-y-auto">
								{selectedPhoneNumber ? (
									<ChatHubList
										selectedPhoneNumber={selectedPhoneNumber}
										selectedChatId={selectedChatId}
										handleSelectChat={(chatId) => setSelectedChatId(chatId)}
										searchQuery={searchQuery}
									/>
								) : (
									<p className="text-primary/60 text-center text-sm italic">Selecione o número de telefone !</p>
								)}
							</div>
						</div>
					</div>

					{/* Conteúdo do Chat - Mobile */}
					<div
						className={cn(
							"absolute inset-0 w-full h-full transition-transform duration-300 ease-in-out",
							showingChatList ? "translate-x-full" : "translate-x-0",
						)}
					>
						{selectedChatId && selectedPhoneNumber && (
							<ChatHubContent
								chatId={selectedChatId}
								whatsappPhoneNumberId={selectedPhoneNumber}
								session={session}
								onBack={() => setSelectedChatId(null)}
								isDesktop={isDesktop}
								userHasMessageSendingPermission={userHasMessageSendingPermission}
							/>
						)}
					</div>
				</div>
			)}

			{/* New Chat Menu */}
			<Popover open={newChatMenuIsOpen} onOpenChange={setNewChatMenuIsOpen}>
				<PopoverTrigger asChild>
					<div />
				</PopoverTrigger>
				<PopoverContent className="w-96">
					<div className="flex flex-col gap-3">
						<h3 className="font-semibold">Novo Chat</h3>
						<ClientsVinculationMenu
							onSelectClient={async (client) => {
								if (!selectedPhoneNumber) {
									toast.error("Selecione um número de telefone primeiro");
									return;
								}
								const chat = await getChatByClientAppId({
									clientAppId: client.idApp,
									whatsappPhoneNumberId: selectedPhoneNumber,
								});
								setSelectedChatId(chat.chatId);
								setNewChatMenuIsOpen(false);
							}}
						/>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
}

type ChatHubListProps = {
	selectedPhoneNumber: string;
	selectedChatId: Id<"chats"> | null;
	handleSelectChat: (chatId: Id<"chats">) => void;
	searchQuery: string;
};

function ChatHubList({ selectedPhoneNumber, selectedChatId, handleSelectChat, searchQuery }: ChatHubListProps) {
	const debouncedSearchQuery = useDebounce(searchQuery, 300);
	const scrollRef = useRef<HTMLDivElement>(null);
	const [allChats, setAllChats] = useState<any[]>([]);
	const [nextCursor, setNextCursor] = useState<string | null>(null);
	const [isLoadingMore, setIsLoadingMore] = useState(false);

	// Initial load
	const initialResult = useQuery(api.queries.chat.getChats, {
		whatsappPhoneNumberId: selectedPhoneNumber,
		paginationOpts: {
			cursor: null,
			numItems: 20,
		},
		searchQuery: debouncedSearchQuery || undefined,
	});

	// Load more chats
	const moreChatsResult = useLoadMoreChats(selectedPhoneNumber, isLoadingMore ? nextCursor : null, debouncedSearchQuery);

	// Reset when search changes
	useEffect(() => {
		setAllChats([]);
		setNextCursor(null);
		setIsLoadingMore(false);
	}, [debouncedSearchQuery]);

	// Update chats when initial result loads
	useEffect(() => {
		if (initialResult) {
			setAllChats(initialResult.items);
			setNextCursor(initialResult.nextCursor);
		}
	}, [initialResult]);

	// Append more chats when loading more
	useEffect(() => {
		if (moreChatsResult && isLoadingMore) {
			setAllChats((prev) => [...prev, ...moreChatsResult.items]);
			setNextCursor(moreChatsResult.nextCursor);
			setIsLoadingMore(false);
		}
	}, [moreChatsResult, isLoadingMore]);

	// Infinite scroll handler
	const handleScroll = useCallback(() => {
		if (!scrollRef.current || isLoadingMore || !nextCursor) return;

		const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
		const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

		if (isNearBottom && initialResult?.hasMore) {
			setIsLoadingMore(true);
		}
	}, [isLoadingMore, nextCursor, initialResult?.hasMore]);

	useEffect(() => {
		const scrollElement = scrollRef.current;
		if (scrollElement) {
			scrollElement.addEventListener("scroll", handleScroll);
			return () => scrollElement.removeEventListener("scroll", handleScroll);
		}
	}, [handleScroll]);

	if (!initialResult) {
		return (
			<div className="flex items-center justify-center py-8">
				<Loader2 className="w-6 h-6 animate-spin text-primary/60" />
			</div>
		);
	}

	if (allChats.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-8">
				<MessageCircleIcon className="w-12 h-12 text-primary/20 mb-2" />
				<p className="text-primary/60 text-center text-sm italic">{debouncedSearchQuery ? "Nenhum chat encontrado" : "Nenhum chat ainda"}</p>
			</div>
		);
	}

	return (
		<div ref={scrollRef} className="flex flex-col gap-2 overflow-y-auto">
			{allChats.map((chat) => (
				<button
					type="button"
					key={chat._id}
					onClick={() => handleSelectChat(chat._id)}
					className={cn("w-full flex gap-3 p-3 hover:bg-primary/10 rounded-lg transition-colors", selectedChatId === chat._id && "bg-primary/10")}
				>
					<div className="flex items-center justify-center">
						<Avatar className="w-12 h-12 min-w-12 min-h-12">
							<AvatarImage src={chat.cliente?.avatar_url} alt={chat.cliente?.nome ?? ""} />
							<AvatarFallback>{formatNameAsInitials(chat.cliente?.nome ?? "")}</AvatarFallback>
						</Avatar>
					</div>
					{/* Informações do Chat */}
					<div className="grow flex flex-col min-w-0">
						<div className="flex items-center justify-between w-full min-w-0">
							<h3 className="font-semibold truncate">{chat.cliente?.nome || "Cliente desconhecido"}</h3>
							{chat.ultimaMensagemData && (
								<span className="text-xs text-primary/60 ml-2 flex-shrink-0">
									{new Date(chat.ultimaMensagemData).toLocaleTimeString("pt-BR", {
										hour: "2-digit",
										minute: "2-digit",
									})}
								</span>
							)}
						</div>
						<div className="flex items-center justify-between w-full min-w-0">
							{chat.ultimaMensagemConteudoTipo === "TEXTO" ? (
								<p className="text-start text-sm text-primary/60 truncate flex-1 min-w-0">{chat.ultimaMensagemConteudoTexto || "Nenhuma mensagem ainda"}</p>
							) : (
								<div className="flex items-center gap-1">
									<ImageIcon className="w-4 h-4" />
									<p className="text-sm text-primary/60 truncate">MÍDIA</p>
								</div>
							)}
							{(chat.mensagensNaoLidas || 0) > 0 && (
								<span className="ml-2 bg-green-500 text-white text-xs font-bold rounded-full px-2 py-1 flex-shrink-0">{chat.mensagensNaoLidas}</span>
							)}
						</div>
					</div>
				</button>
			))}

			{/* Loading More Indicator */}
			{isLoadingMore && (
				<div className="flex items-center justify-center py-4">
					<Loader2 className="w-5 h-5 animate-spin text-primary/60" />
				</div>
			)}

			{/* Load More Button (alternative to infinite scroll) */}
			{!isLoadingMore && nextCursor && initialResult?.hasMore && (
				<Button variant="ghost" onClick={() => setIsLoadingMore(true)} className="w-full">
					Carregar mais conversas
				</Button>
			)}
		</div>
	);
}

function ChatHubContent({
	chatId,
	whatsappPhoneNumberId,
	session,
	onBack,
	isDesktop,
	userHasMessageSendingPermission,
}: {
	chatId: Id<"chats">;
	whatsappPhoneNumberId: string;
	session: TAuthSession;
	onBack: () => void;
	isDesktop: boolean;
	userHasMessageSendingPermission: boolean;
}) {
	const chat = useQuery(api.queries.chat.getChat, { chatId });

	if (!chat) {
		return (
			<div className="h-full w-full flex items-center justify-center">
				<Loader2 className="w-8 h-8 animate-spin text-primary/60" />
			</div>
		);
	}

	return (
		<div className="h-full w-full flex flex-col">
			<ChatHubContentHeader chat={chat} onBack={onBack} isDesktop={isDesktop} whatsappPhoneNumberId={whatsappPhoneNumberId} />
			<ChatHubContentMessages chatId={chatId} />
			<ChatHubContentInput
				chatId={chatId}
				whatsappPhoneNumberId={whatsappPhoneNumberId}
				session={session}
				userHasMessageSendingPermission={userHasMessageSendingPermission}
			/>
		</div>
	);
}

type ChatHubContentHeaderProps = {
	chat: any;
	onBack: () => void;
	isDesktop: boolean;
	whatsappPhoneNumberId: string;
};

function ChatHubContentHeader({ chat, onBack, isDesktop, whatsappPhoneNumberId }: ChatHubContentHeaderProps) {
	const [projectVinculationMenuIsOpen, setProjectVinculationMenuIsOpen] = useState(false);
	const [clientVinculationMenuIsOpen, setClientVinculationMenuIsOpen] = useState(false);
	const getChatByClientAppId = useMutation(api.mutations.chats.getChatByClientAppId);

	return (
		<div className="w-full flex items-center justify-between border-b border-primary/20 p-3">
			<div className="flex items-center gap-3">
				{!isDesktop && (
					<Button onClick={onBack} variant="ghost" size="fit" className="p-2">
						<ArrowLeft className="w-5 h-5" />
					</Button>
				)}
				<Avatar className="w-10 h-10">
					<AvatarImage src={chat.cliente?.avatar_url} alt={chat.cliente?.nome ?? ""} />
					<AvatarFallback>{formatNameAsInitials(chat.cliente?.nome ?? "")}</AvatarFallback>
				</Avatar>
				<div className="flex flex-col">
					<h3 className="font-semibold">{chat.cliente?.nome || "Cliente desconhecido"}</h3>
					<p className="text-xs text-primary/60">{chat.cliente?.telefone}</p>
				</div>
			</div>
			<div className="flex items-center gap-2">
				{chat.atendimentoAberto && (
					<div className="flex items-center gap-2 text-xs bg-green-500/20 text-green-700 dark:text-green-400 px-3 py-1 rounded-full">
						{chat.atendimentoAberto.responsavel === "ai" ? (
							<>
								<BsRobot className="w-4 h-4" />
								<span>AI</span>
							</>
						) : (
							<>
								<UserRound className="w-4 h-4" />
								<span>{chat.atendimentoAberto.responsavel?.nome}</span>
							</>
						)}
					</div>
				)}
				<Popover open={projectVinculationMenuIsOpen} onOpenChange={setProjectVinculationMenuIsOpen}>
					<PopoverTrigger asChild>
						<Button variant="ghost" size="fit" className="p-2">
							<FileText className="w-5 h-5" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-96">
						<ProjectVinculationMenu clientAppId={chat.cliente?.idApp} />
					</PopoverContent>
				</Popover>
			</div>
		</div>
	);
}

type ChatHubContentMessagesProps = {
	chatId: Id<"chats">;
};

function ChatHubContentMessages({ chatId }: ChatHubContentMessagesProps) {
	const [allMessages, setAllMessages] = useState<any[]>([]);
	const [nextCursor, setNextCursor] = useState<string | null>(null);
	const [isLoadingOlder, setIsLoadingOlder] = useState(false);
	const previousChatId = useRef(chatId);

	// Initial load (most recent messages)
	const initialResult = useQuery(api.queries.chat.getChatMessages, {
		chatId,
		paginationOpts: {
			cursor: null,
			numItems: 30,
		},
	});

	// Load older messages
	const olderMessagesResult = useLoadOlderMessages(chatId, isLoadingOlder ? nextCursor : null);

	// Reset when chat changes
	useEffect(() => {
		if (chatId !== previousChatId.current) {
			previousChatId.current = chatId;
			setAllMessages([]);
			setNextCursor(null);
			setIsLoadingOlder(false);
		}
	}, [chatId]);

	// Update messages when initial result loads
	useEffect(() => {
		if (initialResult && chatId === previousChatId.current) {
			setAllMessages(initialResult.items);
			setNextCursor(initialResult.nextCursor);
		}
	}, [initialResult, chatId]);

	// Prepend older messages when loading more
	useEffect(() => {
		if (olderMessagesResult && isLoadingOlder) {
			setAllMessages((prev) => [...olderMessagesResult.items, ...prev]);
			setNextCursor(olderMessagesResult.nextCursor);
			setIsLoadingOlder(false);
		}
	}, [olderMessagesResult, isLoadingOlder]);

	const getMessageStatusIcon = (whatsappStatus?: string | null) => {
		switch (whatsappStatus) {
			case "PENDENTE":
				return <Clock className="w-3 h-3" />;
			case "ENVIADO":
				return <Check className="w-3 h-3" />;
			case "ENTREGUE":
				return <CheckCheck className="w-3 h-3" />;
			case "FALHOU":
				return <AlertCircle className="w-3 h-3 text-red-400" />;
			default:
				return null;
		}
	};

	if (!initialResult) {
		return (
			<div className="flex grow items-center justify-center">
				<Loader2 className="w-8 h-8 animate-spin text-primary/60" />
			</div>
		);
	}

	return (
		<StickToBottom
			className="relative flex grow flex-col flex-1 overflow-y-auto bg-background scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-primary/20"
			initial="smooth"
			resize="smooth"
			role="log"
		>
			<StickToBottom.Content className="p-3">
				{/* Load Older Messages Button */}
				{nextCursor && initialResult?.hasMore && (
					<div className="flex items-center justify-center mb-4">
						<Button variant="outline" size="sm" onClick={() => setIsLoadingOlder(true)} disabled={isLoadingOlder}>
							{isLoadingOlder ? (
								<>
									<Loader2 className="w-4 h-4 animate-spin mr-2" />
									Carregando...
								</>
							) : (
								"Carregar mensagens antigas"
							)}
						</Button>
					</div>
				)}

				{allMessages && allMessages.length > 0 ? (
					allMessages.map((message, index) => {
						const isUser = message.autorTipo === "usuario" || message.autorTipo === "ai";
						const previousMessage = index > 0 ? allMessages[index - 1] : null;
						const nextMessage = index < allMessages.length - 1 ? allMessages[index + 1] : null;
						const messageAuthor = message.autor;
						// Verifica se é do mesmo autor que a mensagem anterior
						const isSameAuthorAsPrevious = previousMessage?.autorTipo === message.autorTipo;

						// Verifica se é do mesmo autor que a próxima mensagem
						const isSameAuthorAsNext = nextMessage?.autorTipo === message.autorTipo;

						// Define se deve mostrar o timestamp (apenas na última mensagem do grupo)
						const shouldShowTimestamp = !isSameAuthorAsNext;

						// Define o espaçamento
						const marginTop = isSameAuthorAsPrevious ? "mt-0.5" : "mt-4";

						// Define bordas arredondadas baseado no agrupamento
						const roundedClasses = cn({
							"rounded-lg": !isSameAuthorAsPrevious && !isSameAuthorAsNext, // Mensagem única
							"rounded-t-lg rounded-b-md": !isSameAuthorAsPrevious && isSameAuthorAsNext, // Primeira do grupo
							"rounded-md": isSameAuthorAsPrevious && isSameAuthorAsNext, // Meio do grupo
							"rounded-t-md rounded-b-lg": isSameAuthorAsPrevious && !isSameAuthorAsNext, // Última do grupo
						});

						return (
							<div key={message._id} className={cn("flex", marginTop, { "justify-end": isUser, "justify-start": !isUser })}>
								<div
									className={cn("max-w-[70%] px-3 py-2", roundedClasses, {
										"bg-blue-500 text-white": isUser,
										"bg-card border border-primary/10 text-primary": !isUser,
									})}
								>
									{/* Conteúdo da mensagem */}
									{message.conteudoMidiaTipo ? (
										<div className="space-y-2">
											<MediaMessageDisplay
												storageId={message.conteudoMidiaStorageId}
												mediaUrl={message.conteudoMidiaUrl}
												mediaType={message.conteudoMidiaTipo}
												fileName={message.conteudoMidiaFileName}
												fileSize={message.conteudoMidiaFileSize}
												mimeType={message.conteudoMidiaMimeType}
												caption={message.conteudoTexto}
											/>
										</div>
									) : (
										<p className="text-sm break-words whitespace-pre-wrap">{message.conteudoTexto}</p>
									)}

									{/* Timestamp e status - apenas na última mensagem do grupo */}
									{shouldShowTimestamp && (
										<div
											className={cn("flex items-center gap-1 mt-1 justify-end", {
												"text-blue-100": isUser,
												"text-primary/60": !isUser,
											})}
										>
											<p className="text-[10px]">
												{new Date(message.dataEnvio).toLocaleTimeString("pt-BR", {
													hour: "2-digit",
													minute: "2-digit",
												})}
											</p>
											{isUser && getMessageStatusIcon(message.whatsappStatus)}
										</div>
									)}
								</div>
							</div>
						);
					})
				) : (
					<div className="flex flex-col items-center justify-center h-full">
						<p className="text-primary/60">Nenhuma mensagem ainda</p>
						<p className="text-primary/40 text-sm mt-1">Envie a primeira mensagem para iniciar a conversa</p>
					</div>
				)}
			</StickToBottom.Content>
			<ChatScrollButton />
		</StickToBottom>
	);
}

function ChatScrollButton() {
	const { isAtBottom, scrollToBottom } = useStickToBottomContext();

	if (isAtBottom) return null;

	return (
		<button
			onClick={scrollToBottom}
			className="absolute bottom-20 right-4 bg-primary text-primary-foreground rounded-full p-2 shadow-lg hover:bg-primary/90 transition-all"
		>
			<ArrowDown className="w-5 h-5" />
		</button>
	);
}

function ChatHubContentInput({
	chatId,
	whatsappPhoneNumberId,
	session,
	userHasMessageSendingPermission,
}: {
	chatId: Id<"chats">;
	whatsappPhoneNumberId: string;
	session: TAuthSession;
	userHasMessageSendingPermission: boolean;
}) {
	const chat = useQuery(api.queries.chat.getChat, { chatId });
	const [messageText, setMessageText] = useState("");
	const [showTemplateSelector, setShowTemplateSelector] = useState(false);
	const [isSendingTemplate, setIsSendingTemplate] = useState(false);
	const handleSendMessage = useMutation(api.mutations.messages.createMessage);
	const handleSendTemplate = useMutation(api.mutations.messages.createTemplateMessage);

	if (!chat) return null;

	const isConversationExpired = chat.status === "EXPIRADA";

	const sendTemplate = async (templateKey: keyof typeof WHATSAPP_TEMPLATES) => {
		if (!chat.cliente?.telefone) {
			toast.error("Telefone do cliente não encontrado");
			return;
		}

		setIsSendingTemplate(true);
		try {
			const template = WHATSAPP_TEMPLATES[templateKey];
			const payload = template.getPayload({
				templateKey,
				toPhoneNumber: formatPhoneAsWhatsappId(chat.cliente.telefone),
				clientName: chat.cliente?.nome ?? "Cliente",
			});

			await handleSendTemplate({
				chatId: chatId,
				userAppId: session.user.id,
				templateId: template.id,
				templatePayloadData: payload.data,
				templatePayloadContent: payload.content,
			});

			toast.success("Template enviado com sucesso!");
			setShowTemplateSelector(false);
		} catch (error) {
			console.error("Error sending template:", error);
			toast.error("Erro ao enviar template");
		} finally {
			setIsSendingTemplate(false);
		}
	};

	if (!userHasMessageSendingPermission) return null;

	return (
		<div className="flex items-center justify-center w-full p-3">
			<div className="flex flex-col gap-2 px-4 py-2 bg-card border-t border-primary/10 shadow-sm w-[98%] self-center rounded-full">
				{/* Alert quando conversa expirada */}
				{isConversationExpired && (
					<div className="flex items-center gap-2 px-3 py-1 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg w-[90%] self-center">
						<AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-500 flex-shrink-0" />
						<p className="text-xs text-amber-800 dark:text-amber-200">Janela de 24h expirada. Envie um template aprovado para reiniciar a conversa.</p>
					</div>
				)}
				{/* Input e botões */}
				<div className="flex items-end gap-2">
					<FileUploadComponent
						onFileSelect={({ file, fileName, storageId }) => {
							// Determine media type based on file type
							let midiaTipo: "IMAGEM" | "DOCUMENTO" = "DOCUMENTO";
							if (file.type.startsWith("image/")) {
								midiaTipo = "IMAGEM";
							}

							handleSendMessage({
								autor: {
									tipo: "usuario",
									idApp: session.user.id,
								},
								conteudo: {
									texto: undefined,
									midiaTipo,
									midiaStorageId: storageId as Id<"_storage">,
									midiaMimeType: file.type,
									midiaFileName: fileName,
									midiaFileSize: file.size,
								},
								cliente: {
									idApp: chat.cliente?.idApp,
									nome: chat.cliente?.nome,
									telefone: formatPhoneAsWhatsappId(chat.cliente?.telefone),
									avatar_url: chat.cliente?.avatar_url,
									email: chat.cliente?.email,
									cpfCnpj: chat.cliente?.cpfCnpj,
								},
								whatsappPhoneNumberId: whatsappPhoneNumberId,
							});
							setMessageText("");
						}}
						disabled={isConversationExpired}
					/>
					<textarea
						value={messageText}
						onChange={(e) => setMessageText(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter" && !e.shiftKey && !isConversationExpired) {
								e.preventDefault();
								handleSendMessage({
									autor: {
										tipo: "usuario",
										idApp: session.user.id,
									},
									conteudo: {
										texto: messageText,
									},
									cliente: {
										idApp: chat.cliente?.idApp,
										nome: chat.cliente?.nome,
										telefone: formatPhoneAsWhatsappId(chat.cliente?.telefone),
										avatar_url: chat.cliente?.avatar_url,
										email: chat.cliente?.email,
										cpfCnpj: chat.cliente?.cpfCnpj,
									},
									whatsappPhoneNumberId: whatsappPhoneNumberId,
								});
								setMessageText("");
							}
						}}
						placeholder={isConversationExpired ? "Envie um template para continuar..." : "Digite uma mensagem..."}
						className={cn("flex-1 px-4 py-2 rounded-lg resize-none text-sm transition-colors focus:outline-none align-top")}
						rows={1}
						style={{ maxHeight: "120px" }}
						disabled={isConversationExpired}
					/>
					<Button
						type="button"
						size="icon"
						onClick={() => {
							handleSendMessage({
								autor: {
									tipo: "usuario",
									idApp: session.user.id,
								},
								conteudo: {
									texto: messageText,
								},
								cliente: {
									idApp: chat.cliente?.idApp,
									nome: chat.cliente?.nome,
									telefone: formatPhoneAsWhatsappId(chat.cliente.telefone),
									avatar_url: chat.cliente?.avatar_url,
									email: chat.cliente?.email,
									cpfCnpj: chat.cliente?.cpfCnpj,
								},
								whatsappPhoneNumberId: whatsappPhoneNumberId,
							});
							setMessageText("");
						}}
						disabled={!messageText.trim() || isConversationExpired}
						className="bg-blue-500 hover:bg-blue-600"
					>
						<Send className="w-4 h-4" />
					</Button>

					{/* Template Selector Popover */}
					<Popover open={showTemplateSelector} onOpenChange={setShowTemplateSelector}>
						<PopoverTrigger asChild>
							<Button type="button" size="icon" variant="ghost" className={cn({ "bg-green-500 hover:bg-green-600": isConversationExpired })}>
								<FileText className="w-4 h-4" />
							</Button>
						</PopoverTrigger>
						<PopoverContent align="end" side="top" className="w-80 p-0">
							<div className="flex items-center justify-between p-3 border-b border-primary/10">
								<h3 className="font-semibold text-sm">Selecionar Template</h3>
								<Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowTemplateSelector(false)}>
									<X className="w-4 h-4" />
								</Button>
							</div>
							<div className="p-2 max-h-64 overflow-y-auto">
								{Object.entries(WHATSAPP_TEMPLATES).map(([key, template]) => (
									<Button
										key={key}
										variant="ghost"
										className="w-full justify-start h-auto p-3"
										onClick={() => sendTemplate(key as keyof typeof WHATSAPP_TEMPLATES)}
										disabled={isSendingTemplate}
									>
										<div className="flex items-start gap-2 w-full">
											<FileText className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
											<div className="flex-1 min-w-0 text-left">
												<p className="font-medium text-sm">{template.title}</p>
												<p className="text-xs text-muted-foreground mt-0.5">
													{template.type === "marketing" ? "Marketing" : "Utilitário"} • {template.language}
												</p>
											</div>
										</div>
									</Button>
								))}
							</div>
						</PopoverContent>
					</Popover>
				</div>
			</div>
		</div>
	);
}

export default ChatsHub;
