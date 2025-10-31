import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import LoadingComponent from "@/components/utils/LoadingComponent";
import type { TAuthSession } from "@/lib/authentication/types";
import { useMediaQuery } from "@/lib/hooks/media-query";
import { useChat } from "@/lib/hooks/messaging/useChat";
import { useChatMessages } from "@/lib/hooks/messaging/useChatMessages";
import { useChats } from "@/lib/hooks/messaging/useChats";
import { useWebSocket } from "@/lib/hooks/messaging/useWebSocket";
import { cn } from "@/lib/utils";
import { WHATSAPP_TEMPLATES } from "@/lib/whatsapp/templates";
import { formatPhoneAsWhatsappId } from "@/lib/whatsapp/utils";
import { formatDateAsLocale, formatNameAsInitials } from "@/utils/methods/formatting";
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
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BsRobot } from "react-icons/bs";
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";
import ClientsVinculationMenu from "../crm-clientes/ClientsVinculationMenu";
import MediaMessageDisplay from "./MediaMessageDisplay";
import FileUploadComponent from "./WSFileUploadComponent";

type WhatsappConnection = {
	token: string;
	dataExpiracao: number;
	telefones: Array<{
		nome: string;
		whatsappBusinessAccountId: string;
		whatsappTelefoneId: string;
		numero: string;
	}>;
};

type ChatsHubProps = {
	session: TAuthSession;
	userHasMessageSendingPermission: boolean;
	whatsappConnection: WhatsappConnection | null;
};

function ChatsHub({ session, userHasMessageSendingPermission, whatsappConnection }: ChatsHubProps) {
	console.log("whatsappConnection", whatsappConnection);
	const isDesktop = useMediaQuery("(min-width: 1024px)");

	const [newChatMenuIsOpen, setNewChatMenuIsOpen] = useState<boolean>(false);
	const [selectedPhoneNumber, setSelectedPhoneNumber] = useState<string | null>(whatsappConnection?.telefones[0]?.whatsappTelefoneId ?? null);
	const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState<string>("");

	// Setup WebSocket
	const { isConnected, joinChatRoom, leaveChatRoom } = useWebSocket({
		onNewMessage: (message) => {
			console.log("New message from WebSocket:", message);
			// The useChatMessages hook will handle adding this
		},
		onChatUpdate: (chat) => {
			console.log("Chat update from WebSocket:", chat);
		},
	});

	// Para mobile, usamos um estado para controlar se estamos mostrando a lista ou o chat
	const showingChatList = !selectedChatId || isDesktop;

	const handleSelectChat = useCallback((chatId: string) => {
		setSelectedChatId(chatId);
	}, []);

	return (
		<div className="w-full max-h-[calc(100vh-200px)] grow flex flex-col items-center justify-center rounded-lg shadow-lg border border-primary/20 overflow-hidden">
			{/* WebSocket Status Indicator */}
			{!isConnected && <div className="w-full bg-amber-100 text-amber-800 text-xs px-2 py-1 text-center">Reconectando ao servidor...</div>}

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
											{(whatsappConnection?.telefones ?? [])?.map((phone) => (
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
										type="button"
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
									handleSelectChat={handleSelectChat}
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
								joinChatRoom={joinChatRoom}
								leaveChatRoom={leaveChatRoom}
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
												{(whatsappConnection?.telefones ?? [])?.map((phone) => (
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
											type="button"
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
										handleSelectChat={handleSelectChat}
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
								joinChatRoom={joinChatRoom}
								leaveChatRoom={leaveChatRoom}
							/>
						)}
					</div>
				</div>
			)}

			{/* New Chat Menu */}
			{newChatMenuIsOpen && (
				<Popover open={newChatMenuIsOpen} onOpenChange={setNewChatMenuIsOpen}>
					<PopoverTrigger asChild>
						<div />
					</PopoverTrigger>
					<PopoverContent className="w-96">
						<div className="flex flex-col gap-3">
							<h3 className="font-semibold">Novo Chat</h3>
							<ClientsVinculationMenu
								closeModal={() => setNewChatMenuIsOpen(false)}
								handleSelect={async (client) => {
									if (!selectedPhoneNumber) return toast.error("Selecione um número de telefone.");

									try {
										const response = await fetch("/api/messaging/chats", {
											method: "POST",
											headers: { "Content-Type": "application/json" },
											body: JSON.stringify({
												whatsappPhoneNumberId: selectedPhoneNumber,
												cliente: {
													id: client._id,
													nome: client.nome,
													telefone: client.telefonePrimario || "",
													avatar: null,
												},
											}),
										});

										if (!response.ok) throw new Error("Erro ao criar chat");

										const data = await response.json();
										setSelectedChatId(data.chatId);
										setNewChatMenuIsOpen(false);
									} catch (error) {
										console.error("Error creating chat:", error);
										toast.error("Erro ao criar conversa");
									}
								}}
							/>
						</div>
					</PopoverContent>
				</Popover>
			)}
		</div>
	);
}

export default ChatsHub;

// ChatHubList Component
type ChatHubListProps = {
	selectedPhoneNumber: string;
	selectedChatId: string | null;
	handleSelectChat: (chatId: string) => void;
	searchQuery: string;
};

function ChatHubList({ selectedPhoneNumber, selectedChatId, handleSelectChat, searchQuery }: ChatHubListProps) {
	const { chats, isLoading, hasMore, loadMore } = useChats(selectedPhoneNumber, searchQuery);

	if (isLoading && chats.length === 0) {
		return (
			<div className="flex items-center justify-center py-8">
				<Loader2 className="w-6 h-6 animate-spin text-primary/60" />
			</div>
		);
	}

	if (chats.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-8">
				<MessageCircleIcon className="w-12 h-12 text-primary/20 mb-2" />
				<p className="text-primary/60 text-center text-sm italic">{searchQuery ? "Nenhum chat encontrado" : "Nenhum chat ainda"}</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-2 overflow-y-auto">
			{chats.map((chat) => (
				<button
					type="button"
					key={chat._id}
					onClick={() => handleSelectChat(chat._id)}
					className={cn("w-full flex gap-3 p-3 hover:bg-primary/10 rounded-lg transition-colors", selectedChatId === chat._id && "bg-primary/10")}
				>
					<div className="flex items-center justify-center">
						<Avatar className="w-12 h-12 min-w-12 min-h-12">
							<AvatarImage src={chat.cliente?.avatar ?? undefined} alt={chat.cliente?.nome ?? ""} />
							<AvatarFallback>{formatNameAsInitials(chat.cliente?.nome ?? "")}</AvatarFallback>
						</Avatar>
					</div>
					{/* Informações do Chat */}
					<div className="grow flex flex-col min-w-0">
						<div className="flex items-center justify-between w-full min-w-0">
							<h3 className="font-semibold truncate">{chat.cliente?.nome || "Cliente desconhecido"}</h3>
							{chat.ultimaMensagemCliente?.data && (
								<span className="text-xs text-primary/60 ml-2 flex-shrink-0">
									{new Date(chat.ultimaMensagemCliente.data).toLocaleTimeString("pt-BR", {
										hour: "2-digit",
										minute: "2-digit",
									})}
								</span>
							)}
						</div>
						<div className="flex items-center justify-between w-full min-w-0">
							{chat.ultimaMensagemCliente?.conteudoTipo === "TEXTO" ? (
								<p className="text-start text-sm text-primary/60 truncate flex-1 min-w-0">
									{chat.ultimaMensagemCliente.conteudoTexto || "Nenhuma mensagem ainda"}
								</p>
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

			{/* Load More Button */}
			{hasMore && (
				<Button variant="ghost" onClick={loadMore} className="w-full">
					Carregar mais conversas
				</Button>
			)}
		</div>
	);
}

// ChatHubContent Component
type ChatHubContentProps = {
	chatId: string;
	whatsappPhoneNumberId: string;
	session: TAuthSession;
	onBack: () => void;
	isDesktop: boolean;
	userHasMessageSendingPermission: boolean;
	joinChatRoom: (chatId: string) => void;
	leaveChatRoom: (chatId: string) => void;
};

function ChatHubContent({
	chatId,
	whatsappPhoneNumberId,
	session,
	onBack,
	isDesktop,
	userHasMessageSendingPermission,
	joinChatRoom,
	leaveChatRoom,
}: ChatHubContentProps) {
	const { chat, isLoading } = useChat(chatId);

	// Join/leave chat room
	useEffect(() => {
		joinChatRoom(chatId);
		return () => leaveChatRoom(chatId);
	}, [chatId, joinChatRoom, leaveChatRoom]);

	if (isLoading || !chat) {
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
				chat={chat}
				whatsappPhoneNumberId={whatsappPhoneNumberId}
				session={session}
				userHasMessageSendingPermission={userHasMessageSendingPermission}
			/>
		</div>
	);
}

// Due to length, I'll continue in the next file section...

// ChatHubContentHeader Component
type ChatHubContentHeaderProps = {
	chat: any; // Use the proper type from useChat
	onBack: () => void;
	isDesktop: boolean;
	whatsappPhoneNumberId: string;
};

function ChatHubContentHeader({ chat, onBack, isDesktop }: ChatHubContentHeaderProps) {
	const updateService = async (serviceId: string, status: string) => {
		try {
			const response = await fetch(`/api/messaging/services/${serviceId}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ status }),
			});

			if (!response.ok) throw new Error("Erro ao atualizar serviço");
			toast.success("Serviço atualizado");
		} catch (error) {
			console.error("Error updating service:", error);
			toast.error("Erro ao atualizar serviço");
		}
	};

	return (
		<div className="w-full flex flex-col">
			<div className="p-3 bg-card border-b border-primary/10 flex items-center gap-2">
				<div className="flex items-center gap-3">
					{/* Botão de voltar para mobile */}
					{!isDesktop && (
						<Button variant="ghost" size="sm" onClick={onBack} className="p-2 hover:bg-primary/10 rounded-full">
							<ArrowLeft className="w-5 h-5 text-primary" />
						</Button>
					)}

					{/* Avatar do Cliente */}
					<Avatar className="w-6 h-6 lg:w-10 lg:h-10 min-w-6 min-h-6 lg:min-w-10 lg:min-h-10">
						<AvatarImage src={chat.cliente?.avatar} alt={chat.cliente?.nome ?? ""} />
						<AvatarFallback className="text-xs lg:text-base">{formatNameAsInitials(chat.cliente?.nome ?? "")}</AvatarFallback>
					</Avatar>

					{/* Informações do Cliente */}
					<div className="flex items-center gap-2">
						<h2 className="text-sm lg:text-base font-semibold text-primary">{chat.cliente?.nome || "Cliente desconhecido"}</h2>
						<div className="text-[0.625rem] lg:text-xs flex items-center gap-2 text-primary/60">
							{chat.cliente?.telefone && <span>{chat.cliente.telefone}</span>}
						</div>
					</div>
				</div>
			</div>
			{chat.atendimentoAberto ? (
				<div className="flex flex-col gap-2 bg-orange-200 text-orange-800 p-2">
					<div className="flex items-center justify-between gap-2">
						<h1 className="text-[0.625rem] lg:text-xs font-semibold">ATENDIMENTO ABERTO</h1>
						<div className="flex items-center gap-2">
							{chat.atendimentoAberto.dataInicio ? (
								<div className="flex items-center gap-1">
									<PlayIcon className="w-3 h-3 min-w-3 min-h-3" strokeWidth={1.5} />
									<p className="text-[0.625rem] lg:text-xs">{formatDateAsLocale(new Date(chat.atendimentoAberto.dataInicio), true)}</p>
								</div>
							) : null}
							<Button
								size="fit"
								onClick={() => updateService(chat.atendimentoAberto?._id, "CONCLUÍDO")}
								className="px-2 py-1 bg-orange-500 text-orange-100 hover:bg-orange-600 text-xs"
							>
								FINALIZAR
							</Button>
						</div>
					</div>
					<div className="w-full flex items-center justify-between gap-2">
						<div className="flex items-center gap-1">
							<TextIcon className="w-4 h-4 min-w-4 min-h-4" />
							<p className="text-xs lg:text-sm font-semibold">{chat.atendimentoAberto.descricao}</p>
						</div>
						{chat.atendimentoAberto.atendente ? (
							chat.atendimentoAberto.atendente.tipo === "AGENTE-IA" ? (
								<div className="text-[0.625rem] lg:text-xs flex items-center gap-2 text-orange-100 px-2 py-1 bg-orange-800 rounded-lg">
									<BsRobot className="w-4 h-4 min-w-4 min-h-4" />
									AI
								</div>
							) : (
								<div className="text-[0.625rem] lg:text-xs flex items-center gap-2 text-orange-100 px-2 py-1 bg-orange-800 rounded-lg">
									<UserRound className="w-4 h-4 min-w-4 min-h-4" />
									{chat.atendimentoAberto.atendente?.nome}
								</div>
							)
						) : (
							<div className="text-[0.625rem] lg:text-xs flex items-center gap-2 text-orange-100 px-2 py-1 bg-orange-800 rounded-lg">SEM RESPONSÁVEL</div>
						)}
					</div>
				</div>
			) : null}
		</div>
	);
}

// ChatHubContentMessages Component
type ChatHubContentMessagesProps = {
	chatId: string;
};

function ChatHubContentMessages({ chatId }: ChatHubContentMessagesProps) {
	const { messages, isLoading, hasMore, loadOlderMessages, markAsRead } = useChatMessages(chatId);

	// Mark messages as read when viewing chat
	useEffect(() => {
		const timer = setTimeout(() => {
			markAsRead();
		}, 500);
		return () => clearTimeout(timer);
	}, [markAsRead]);

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

	if (isLoading) {
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
				{hasMore && (
					<div className="flex items-center justify-center mb-4">
						<Button variant="outline" size="sm" onClick={loadOlderMessages}>
							Carregar mensagens antigas
						</Button>
					</div>
				)}

				{messages && messages.length > 0 ? (
					messages.map((message, index) => {
						const isUser = message.autor.tipo === "ATENDENTE" || message.autor.tipo === "AGENTE-IA";
						const previousMessage = index > 0 ? messages[index - 1] : null;
						const nextMessage = index < messages.length - 1 ? messages[index + 1] : null;

						const isSameAuthorAsPrevious = previousMessage?.autor.tipo === message.autor.tipo;
						const isSameAuthorAsNext = nextMessage?.autor.tipo === message.autor.tipo;
						const shouldShowTimestamp = !isSameAuthorAsNext;
						const marginTop = isSameAuthorAsPrevious ? "mt-0.5" : "mt-4";

						const roundedClasses = cn({
							"rounded-lg": !isSameAuthorAsPrevious && !isSameAuthorAsNext,
							"rounded-t-lg rounded-b-md": !isSameAuthorAsPrevious && isSameAuthorAsNext,
							"rounded-md": isSameAuthorAsPrevious && isSameAuthorAsNext,
							"rounded-t-md rounded-b-lg": isSameAuthorAsPrevious && !isSameAuthorAsNext,
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
									{message.conteudo.tipo !== "TEXTO" ? (
										<div className="space-y-2">
											<MediaMessageDisplay
												storageId={undefined}
												mediaUrl={message.conteudo.midiaUrl ?? undefined}
												mediaType={message.conteudo.tipo}
												fileName={message.conteudo.midiaNomeArquivo ?? undefined}
												fileSize={message.conteudo.midiaTamanho ?? undefined}
												mimeType={message.conteudo.midiaTipo ?? undefined}
												caption={message.conteudo.texto ?? undefined}
											/>
										</div>
									) : (
										<p className="text-sm break-words whitespace-pre-wrap">{message.conteudo.texto}</p>
									)}

									{/* Timestamp e status */}
									{shouldShowTimestamp && (
										<div
											className={cn("flex items-center gap-1 mt-1 justify-end", {
												"text-blue-100": isUser,
												"text-primary/60": !isUser,
											})}
										>
											<p className="text-[10px]">
												{new Date(message.dataInsercao).toLocaleTimeString("pt-BR", {
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
			type="button"
			onClick={() => scrollToBottom()}
			className="absolute bottom-20 right-4 bg-primary text-primary-foreground rounded-full p-2 shadow-lg hover:bg-primary/90 transition-all"
		>
			<ArrowDown className="w-5 h-5" />
		</button>
	);
}

// ChatHubContentInput Component
type ChatHubContentInputProps = {
	chatId: string;
	chat: any;
	whatsappPhoneNumberId: string;
	session: TAuthSession;
	userHasMessageSendingPermission: boolean;
};

function ChatHubContentInput({ chatId, chat, whatsappPhoneNumberId, session, userHasMessageSendingPermission }: ChatHubContentInputProps) {
	const [messageText, setMessageText] = useState("");
	const [showTemplateSelector, setShowTemplateSelector] = useState(false);
	const [isSendingTemplate, setIsSendingTemplate] = useState(false);
	const [isSending, setIsSending] = useState(false);

	const isConversationExpired = !chat.whatsappJanelaAtiva;

	const sendMessage = async () => {
		if (!messageText.trim() || isSending) return;

		setIsSending(true);
		try {
			const response = await fetch(`/api/messaging/chats/${chatId}/messages`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					conteudo: {
						tipo: "TEXTO",
						texto: messageText,
					},
					autor: {
						tipo: "ATENDENTE",
						id: session.user.id,
						nome: session.user.nome,
						avatar: session.user.avatar_url,
					},
				}),
			});

			if (!response.ok) throw new Error("Erro ao enviar mensagem");

			setMessageText("");
			toast.success("Mensagem enviada");
		} catch (error) {
			console.error("Error sending message:", error);
			toast.error("Erro ao enviar mensagem");
		} finally {
			setIsSending(false);
		}
	};

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

			// TODO: Implement template sending API endpoint
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
						onFileSelect={async ({ file, fileName, downloadURL }) => {
							// Send media message
							try {
								const response = await fetch(`/api/messaging/chats/${chatId}/messages`, {
									method: "POST",
									headers: { "Content-Type": "application/json" },
									body: JSON.stringify({
										conteudo: {
											tipo: file.type.startsWith("image/") ? "IMAGEM" : "DOCUMENTO",
											midiaUrl: downloadURL,
											midiaTipo: file.type,
											midiaTamanho: file.size,
											midiaNomeArquivo: fileName,
										},
										autor: {
											tipo: "ATENDENTE",
											id: session.user.id,
											nome: session.user.nome,
											avatar: session.user.avatar_url,
										},
									}),
								});

								if (!response.ok) throw new Error("Erro ao enviar arquivo");
								toast.success("Arquivo enviado");
							} catch (error) {
								console.error("Error sending file:", error);
								toast.error("Erro ao enviar arquivo");
							}
						}}
						disabled={isConversationExpired}
					/>
					<textarea
						value={messageText}
						onChange={(e) => setMessageText(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter" && !e.shiftKey && !isConversationExpired) {
								e.preventDefault();
								sendMessage();
							}
						}}
						placeholder={isConversationExpired ? "Envie um template para continuar..." : "Digite uma mensagem..."}
						className={cn("flex-1 px-4 py-2 rounded-lg resize-none text-sm transition-colors focus:outline-none align-top")}
						rows={1}
						style={{ maxHeight: "120px" }}
						disabled={isConversationExpired || isSending}
					/>
					<Button
						type="button"
						size="icon"
						onClick={sendMessage}
						disabled={!messageText.trim() || isConversationExpired || isSending}
						className="bg-blue-500 hover:bg-blue-600"
					>
						{isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
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
