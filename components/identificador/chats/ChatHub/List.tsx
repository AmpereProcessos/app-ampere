"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { formatNameAsInitials } from "@/utils/methods/formatting";
import { useQuery } from "convex/react";
import { ImageIcon, MessageCircle } from "lucide-react";
import { useChatHub } from "./context";

export type ChatHubListProps = {
	className?: string;
	onChatSelect?: (chatId: string) => void;
};

export function List({ className, onChatSelect }: ChatHubListProps) {
	const { selectedPhoneNumber, selectedChatId, setSelectedChatId } = useChatHub();

	const chats = useQuery(api.queries.chat.getChats, selectedPhoneNumber ? { whatsappPhoneNumberId: selectedPhoneNumber } : "skip");

	const handleSelectChat = (chatId: string) => {
		setSelectedChatId(chatId as Id<"chats">);
		onChatSelect?.(chatId);
	};

	if (!selectedPhoneNumber) {
		return (
			<div className={cn("flex flex-col items-center justify-center p-8 text-center", className)}>
				<MessageCircle className="w-12 h-12 text-primary/20 mb-3" />
				<p className="text-sm text-primary/60 italic">Selecione um número de telefone para ver os chats</p>
			</div>
		);
	}

	if (!chats) {
		return (
			<div className={cn("flex flex-col gap-3 p-3", className)}>
				{Array.from({ length: 5 }).map((_, i) => (
					<ChatItemSkeleton key={i.toString()} />
				))}
			</div>
		);
	}

	if (chats.length === 0) {
		return (
			<div className={cn("flex flex-col items-center justify-center p-8 text-center", className)}>
				<MessageCircle className="w-12 h-12 text-primary/20 mb-3" />
				<p className="text-sm text-primary/60 font-medium">Nenhum chat ainda</p>
				<p className="text-xs text-primary/40 mt-1">Inicie uma nova conversa clicando no botão +</p>
			</div>
		);
	}

	return (
		<ScrollArea className={cn("flex-1 w-full", className)}>
			<div className="flex flex-col gap-2 p-3">
				{chats.map((chat) => (
					<ChatItem key={chat._id} chat={chat} isSelected={selectedChatId === chat._id} onSelect={() => handleSelectChat(chat._id)} />
				))}
			</div>
		</ScrollArea>
	);
}

type ChatItemProps = {
	chat: NonNullable<ReturnType<typeof useQuery<typeof api.queries.chat.getChats>>>[number];
	isSelected: boolean;
	onSelect: () => void;
};

function ChatItem({ chat, isSelected, onSelect }: ChatItemProps) {
	const hasUnread = (chat.mensagensNaoLidas || 0) > 0;

	return (
		<Button
			variant="ghost"
			className={cn(
				"w-full h-auto p-3 flex items-start gap-3 hover:bg-primary/10 transition-all duration-200",
				"rounded-lg relative overflow-hidden group",
				isSelected && "bg-primary/10 shadow-sm",
			)}
			onClick={onSelect}
		>
			{/* Selection indicator */}
			{isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />}

			{/* Avatar */}
			<Avatar className="w-12 h-12 min-w-12 min-h-12 ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
				<AvatarImage src={chat.cliente?.avatar_url} alt={chat.cliente?.nome ?? ""} />
				<AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
					{formatNameAsInitials(chat.cliente?.nome ?? "?")}
				</AvatarFallback>
			</Avatar>

			{/* Content */}
			<div className="flex-1 min-w-0 flex flex-col gap-1">
				{/* Header: Name and Time */}
				<div className="flex items-center justify-between gap-2 w-full">
					<h3 className={cn("font-semibold text-sm truncate text-left", hasUnread && "text-primary")}>{chat.cliente?.nome || "Cliente desconhecido"}</h3>
					{chat.ultimaMensagemData && (
						<span className={cn("text-xs flex-shrink-0", hasUnread ? "text-primary font-medium" : "text-primary/60")}>
							{new Date(chat.ultimaMensagemData).toLocaleTimeString("pt-BR", {
								hour: "2-digit",
								minute: "2-digit",
							})}
						</span>
					)}
				</div>

				{/* Last Message Preview */}
				<div className="flex items-center justify-between gap-2 w-full">
					<div className="flex items-center gap-1.5 min-w-0 flex-1">
						{chat.ultimaMensagemConteudoTipo === "TEXTO" ? (
							<p className={cn("text-xs truncate text-left", hasUnread ? "text-primary/80 font-medium" : "text-primary/60")}>
								{chat.ultimaMensagemConteudoTexto || "Nenhuma mensagem ainda"}
							</p>
						) : (
							<>
								<ImageIcon className="w-3.5 h-3.5 text-primary/60 flex-shrink-0" />
								<p className={cn("text-xs truncate", hasUnread ? "text-primary/80 font-medium" : "text-primary/60")}>
									{chat.ultimaMensagemConteudoTipo === "IMAGEM" ? "Imagem" : "Documento"}
								</p>
							</>
						)}
					</div>

					{/* Unread Badge */}
					{hasUnread && (
						<Badge
							variant="default"
							className="bg-green-500 hover:bg-green-500 text-white text-xs font-bold px-2 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center rounded-full"
						>
							{chat.mensagensNaoLidas}
						</Badge>
					)}
				</div>
			</div>
		</Button>
	);
}

function ChatItemSkeleton() {
	return (
		<div className="w-full p-3 flex items-start gap-3">
			<Skeleton className="w-12 h-12 rounded-full" />
			<div className="flex-1 flex flex-col gap-2">
				<div className="flex items-center justify-between">
					<Skeleton className="h-4 w-32" />
					<Skeleton className="h-3 w-12" />
				</div>
				<Skeleton className="h-3 w-full" />
			</div>
		</div>
	);
}
