import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import LoadingComponent from "@/components/utils/LoadingComponent";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import type { TAuthSession } from "@/lib/authentication/types";
import { cn } from "@/lib/utils";
import { formatNameAsInitials } from "@/utils/methods/formatting";
import { useMutation, useQuery } from "convex/react";
import { MessageCircleIcon, Plus, Send } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import ProjectVinculationMenu from "../projects/ProjectVinculationMenu";

type ChatsHubProps = {
	session: TAuthSession;
};
function ChatsHub({ session }: ChatsHubProps) {
	console.log(session);
	const chats = useQuery(api.queries.chat.getChats);

	const getChatByClientAppId = useMutation(api.mutations.chats.getChatByClientAppId);

	const [newChatMenuIsOpen, setNewChatMenuIsOpen] = useState<boolean>(false);
	const [selectedChatId, setSelectedChatId] = useState<Id<"chats"> | null>(null);
	return (
		<div className="w-full grow flex flex-col items-center justify-center gap-3 lg:flex-row rounded-lg shadow-lg border border-primary/20 p-3">
			<div className="flex flex-col gap-3 w-1/3 h-full">
				<div className="w-full flex items-center justify-between border-b border-primary/20 pb-2">
					<MessageCircleIcon className="w-5 h-5'" />
					<Button onClick={() => setNewChatMenuIsOpen(true)} variant={"ghost"} size={"fit"} className="p-2 rounded-full">
						<Plus className="w-5 h-5" />
					</Button>
				</div>
				<div className="grow w-full flex flex-col gap-3">
					{chats ? (
						chats.map((chat) => (
							<button
								type="button"
								key={chat._id}
								onClick={() => setSelectedChatId(chat._id)}
								className={cn("w-full flex gap-3 p-3 hover:bg-primary/10 rounded-lg", selectedChatId === chat._id && "bg-primary/10")}
							>
								<div className="flex items-center justify-center">
									<Avatar className="w-12 h-12 min-w-12 min-h-12">
										<AvatarImage src={undefined} alt={chat.cliente?.nome ?? ""} />
										<AvatarFallback>{formatNameAsInitials(chat.cliente?.nome ?? "")}</AvatarFallback>
									</Avatar>
								</div>
								{/* Informações do Chat */}
								<div className="grow flex flex-col">
									<div className="flex items-center justify-between">
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
									<div className="flex items-center justify-between">
										<p className="text-sm text-primary/60 truncate">{chat.ultimaMensagemConteudoTexto || "Nenhuma mensagem ainda"}</p>
										{(chat.mensagensNaoLidas || 0) > 0 && (
											<span className="ml-2 bg-green-500 text-white text-xs font-bold rounded-full px-2 py-1 flex-shrink-0">{chat.mensagensNaoLidas}</span>
										)}
									</div>
								</div>
							</button>
						))
					) : (
						<p className="text-primary/60 text-center text-sm italic">Carregando...</p>
					)}
				</div>
			</div>
			<div className="flex flex-col gap-3 w-2/3 h-full">
				{selectedChatId ? (
					<ChatHubContent chatId={selectedChatId} session={session} />
				) : (
					<div className="h-full w-full flex items-center flex-col justify-center">
						<p className="text-primary/60 text-center text-sm italic">Selecione um chat para ver as mensagens</p>
					</div>
				)}
			</div>
			{newChatMenuIsOpen ? (
				<ProjectVinculationMenu
					closeModal={() => setNewChatMenuIsOpen(false)}
					handleSelect={async (project) => {
						const clientId = project.idClienteCRM;
						if (!clientId)
							return toast.error("Oops, aparentemente esse cliente não possui um cadastro, tente vincular um projeto ao cliente para criar um chat.");
						const selectedChat = await getChatByClientAppId({
							cliente: {
								idApp: clientId,
								nome: project.nomeDoContrato,
								telefone: project.telefone || "",
								email: project.email || "",
								cpfCnpj: project.cpf_cnpj?.toString() || "",
								avatar_url: undefined,
							},
						});
						return setSelectedChatId(selectedChat.chatId);
					}}
				/>
			) : null}
		</div>
	);
}

export default ChatsHub;

function ChatHubContent({ chatId, session }: { chatId: Id<"chats">; session: TAuthSession }) {
	const chat = useQuery(api.queries.chat.getChat, {
		chatId,
	});

	const chatMessages = useQuery(api.queries.chat.getChatMessages, {
		chatId,
	});

	const [messageText, setMessageText] = useState("");
	const handleSendMessage = useMutation(api.mutations.messages.createMessage);
	if (!chat || !chatMessages) return <LoadingComponent />;

	return (
		<>
			{/* Header do Chat */}
			<div className="p-4 bg-card border-b border-primary/10 flex items-center justify-between shadow-sm">
				<div className="flex items-center gap-3">
					{/* Avatar do Cliente */}
					<Avatar className="w-12 h-12 min-w-12 min-h-12">
						<AvatarImage src={undefined} alt={chat.cliente?.nome ?? ""} />
						<AvatarFallback>{formatNameAsInitials(chat.cliente?.nome ?? "")}</AvatarFallback>
					</Avatar>

					{/* Informações do Cliente */}
					<div>
						<h2 className="font-semibold text-primary">{chat.cliente?.nome || "Cliente desconhecido"}</h2>
						<div className="flex items-center gap-2 text-xs text-primary/600">{chat.cliente?.telefone && <span>{chat.cliente.telefone}</span>}</div>
					</div>
				</div>
			</div>
			{/* Área de Mensagens */}
			<div className="flex flex-col flex-1 overflow-y-auto p-4 bg-background">
				{chatMessages && chatMessages.length > 0 ? (
					chatMessages.map((message, index) => {
						const isUser = message.autorTipo === "usuario";
						const previousMessage = index > 0 ? chatMessages[index - 1] : null;
						const nextMessage = index < chatMessages.length - 1 ? chatMessages[index + 1] : null;
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
									<p className="text-sm break-words whitespace-pre-wrap">{message.conteudoTexto}</p>

									{/* Timestamp - apenas na última mensagem do grupo */}
									{shouldShowTimestamp && (
										<p
											className={cn("text-[10px] mt-1 text-right", {
												"text-blue-100": isUser,
												"text-primary/60": !isUser,
											})}
										>
											{new Date(message.dataEnvio).toLocaleTimeString("pt-BR", {
												hour: "2-digit",
												minute: "2-digit",
											})}
										</p>
									)}
								</div>
							</div>
						);
					})
				) : (
					<div className="flex flex-col items-center justify-center h-full">
						<p className="text-primary/600">Nenhuma mensagem ainda</p>
						<p className="text-primary/400 text-sm mt-1">Envie a primeira mensagem para iniciar a conversa</p>
					</div>
				)}
				{/* <div ref={messagesEndRef} /> */}
			</div>

			{/* Footer - Input de Mensagem */}
			<div className="flex items-end gap-2 p-4 bg-card border-t border-primary/10 shadow-sm">
				<textarea
					value={messageText}
					onChange={(e) => setMessageText(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter" && !e.shiftKey) {
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
									telefone: chat.cliente?.telefone,
									avatar_url: chat.cliente?.avatar_url,
									email: chat.cliente?.email,
									cpfCnpj: chat.cliente?.cpfCnpj,
								},
							});
						}
					}}
					placeholder="Digite uma mensagem..."
					className="flex-1 px-4 py-3 border border-primary/10 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
					rows={1}
					style={{ maxHeight: "120px" }}
				/>
				<button
					type="button"
					onClick={() =>
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
								telefone: chat.cliente?.telefone,
								avatar_url: chat.cliente?.avatar_url,
								email: chat.cliente?.email,
								cpfCnpj: chat.cliente?.cpfCnpj,
							},
						})
					}
					disabled={!messageText.trim()}
					className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-primary/30 disabled:cursor-not-allowed transition-colors"
					aria-label="Enviar mensagem"
				>
					<Send className="w-5 h-5" />
				</button>
			</div>
		</>
	);
}
