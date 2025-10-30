"use client";

import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { AlertCircle, ArrowDown, Check, CheckCheck, Clock } from "lucide-react";
import { useCallback } from "react";
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";
import MediaMessageDisplay from "../MediaMessageDisplay";
import { useChatHub } from "./context";
import { Button } from "@/components/ui/button";

export type ChatHubMessagesProps = {
	className?: string;
	emptyState?: React.ReactNode;
};

export function Messages({ className, emptyState }: ChatHubMessagesProps) {
	const { selectedChatId } = useChatHub();

	const chatMessages = useQuery(
		api.queries.chat.getChatMessages,
		selectedChatId ? { chatId: selectedChatId } : "skip",
	);

	if (!chatMessages) {
		return (
			<div className={cn("flex-1 flex items-center justify-center bg-background/50", className)}>
				<div className="flex flex-col items-center gap-2">
					<div className="animate-pulse text-primary/40">Carregando mensagens...</div>
				</div>
			</div>
		);
	}

	if (chatMessages.length === 0) {
		return (
			<div className={cn("flex-1 flex items-center justify-center bg-background/50", className)}>
				{emptyState || (
					<div className="flex flex-col items-center justify-center p-8 text-center">
						<div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mb-4">
							<span className="text-4xl">💬</span>
						</div>
						<h3 className="text-base font-semibold text-primary/70 mb-1">Nenhuma mensagem ainda</h3>
						<p className="text-sm text-primary/50">Envie a primeira mensagem para iniciar a conversa</p>
					</div>
				)}
			</div>
		);
	}

	return (
		<StickToBottom
			className={cn(
				"relative flex-1 flex flex-col overflow-y-auto",
				"bg-gradient-to-b from-background/50 to-background",
				"scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent",
				className,
			)}
			initial="smooth"
			resize="smooth"
			role="log"
			aria-live="polite"
		>
			<StickToBottom.Content className="p-4 space-y-1">
				{chatMessages.map((message, index) => {
					const previousMessage = index > 0 ? chatMessages[index - 1] : null;
					const nextMessage = index < chatMessages.length - 1 ? chatMessages[index + 1] : null;

					const isUser = message.autorTipo === "usuario" || message.autorTipo === "ai";
					const isSameAuthorAsPrevious = previousMessage?.autorTipo === message.autorTipo;
					const isSameAuthorAsNext = nextMessage?.autorTipo === message.autorTipo;

					return (
						<MessageBubble
							key={message._id}
							message={message}
							isUser={isUser}
							isSameAuthorAsPrevious={isSameAuthorAsPrevious}
							isSameAuthorAsNext={isSameAuthorAsNext}
						/>
					);
				})}
			</StickToBottom.Content>
			<ScrollToBottomButton />
		</StickToBottom>
	);
}

type MessageBubbleProps = {
	message: NonNullable<ReturnType<typeof useQuery<typeof api.queries.chat.getChatMessages>>>[number];
	isUser: boolean;
	isSameAuthorAsPrevious: boolean;
	isSameAuthorAsNext: boolean;
};

function MessageBubble({ message, isUser, isSameAuthorAsPrevious, isSameAuthorAsNext }: MessageBubbleProps) {
	const shouldShowTimestamp = !isSameAuthorAsNext;
	const marginTop = isSameAuthorAsPrevious ? "mt-1" : "mt-4";

	// Define border radius based on grouping
	const roundedClasses = cn({
		"rounded-2xl": !isSameAuthorAsPrevious && !isSameAuthorAsNext, // Single message
		"rounded-t-2xl rounded-b-lg": !isSameAuthorAsPrevious && isSameAuthorAsNext, // First in group
		"rounded-lg": isSameAuthorAsPrevious && isSameAuthorAsNext, // Middle of group
		"rounded-t-lg rounded-b-2xl": isSameAuthorAsPrevious && !isSameAuthorAsNext, // Last in group
	});

	return (
		<div
			className={cn(
				"flex w-full animate-in fade-in slide-in-from-bottom-2 duration-300",
				marginTop,
				isUser ? "justify-end" : "justify-start",
			)}
		>
			<div
				className={cn(
					"max-w-[85%] sm:max-w-[75%] lg:max-w-[65%] px-4 py-2.5",
					"shadow-sm transition-all duration-200 hover:shadow-md",
					roundedClasses,
					isUser
						? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
						: "bg-card border border-primary/10 text-primary",
				)}
			>
				{/* Message Content */}
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
							variant={isUser ? "sent" : "received"}
						/>
					</div>
				) : (
					<p className="text-sm leading-relaxed break-words whitespace-pre-wrap">{message.conteudoTexto}</p>
				)}

				{/* Timestamp and Status */}
				{shouldShowTimestamp && (
					<div
						className={cn(
							"flex items-center gap-1.5 mt-1.5 justify-end",
							isUser ? "text-blue-100/90" : "text-primary/60",
						)}
					>
						<time className="text-[10px] font-medium">
							{new Date(message.dataEnvio).toLocaleTimeString("pt-BR", {
								hour: "2-digit",
								minute: "2-digit",
							})}
						</time>
						{isUser && <MessageStatusIcon status={message.whatsappStatus} />}
					</div>
				)}
			</div>
		</div>
	);
}

type MessageStatusIconProps = {
	status?: string | null;
};

function MessageStatusIcon({ status }: MessageStatusIconProps) {
	switch (status) {
		case "PENDENTE":
			return (
				<Clock
					className="w-3.5 h-3.5 animate-pulse"
					aria-label="Pendente"
				/>
			);
		case "ENVIADO":
			return (
				<Check
					className="w-3.5 h-3.5"
					aria-label="Enviado"
				/>
			);
		case "ENTREGUE":
		case "LIDO":
			return (
				<CheckCheck
					className="w-3.5 h-3.5"
					aria-label="Entregue"
				/>
			);
		case "FALHOU":
			return (
				<AlertCircle
					className="w-3.5 h-3.5 text-red-300"
					aria-label="Falhou"
				/>
			);
		default:
			return null;
	}
}

function ScrollToBottomButton() {
	const { isAtBottom, scrollToBottom } = useStickToBottomContext();

	const handleScrollToBottom = useCallback(() => {
		scrollToBottom();
	}, [scrollToBottom]);

	if (isAtBottom) return null;

	return (
		<Button
			className={cn(
				"absolute bottom-4 left-1/2 -translate-x-1/2",
				"rounded-full shadow-lg border-2 border-background",
				"bg-card hover:bg-card/90 text-primary",
				"animate-in fade-in slide-in-from-bottom-2 duration-300",
				"transition-transform hover:scale-105",
			)}
			onClick={handleScrollToBottom}
			size="icon"
			type="button"
			variant="outline"
			aria-label="Rolar para o final"
		>
			<ArrowDown className="w-4 h-4" />
		</Button>
	);
}
