"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/convex/utils";
import { cn } from "@/lib/utils";
import { MessageCircle, Plus } from "lucide-react";
import type { ReactNode } from "react";
import { useChatHub } from "./context";

export type ChatHubHeaderProps = {
	children?: ReactNode;
	className?: string;
	showPhoneSelector?: boolean;
	onNewChat?: () => void;
};

export function Header({ children, className, showPhoneSelector = true, onNewChat }: ChatHubHeaderProps) {
	const { selectedPhoneNumber, setSelectedPhoneNumber } = useChatHub();
	const { data: whatsappConnections } = useConvexQuery(api.queries.connections.getWhatsappConnection);

	const phoneNumbers = whatsappConnections?.telefones ?? [];

	return (
		<div
			className={cn("w-full flex items-center justify-between gap-3 px-4 py-3", "border-b border-primary/20 bg-card/50 backdrop-blur-sm", className)}
		>
			{/* Left section - Icon/Title */}
			<div className="flex items-center gap-2">
				<MessageCircle className="w-5 h-5 text-primary" />
				<h2 className="font-semibold text-base hidden sm:block">Conversas</h2>
			</div>

			{/* Right section - Actions */}
			<div className="flex items-center gap-2">
				{children}

				{/* Phone Number Selector */}
				{showPhoneSelector && phoneNumbers.length > 0 && (
					<Select value={selectedPhoneNumber ?? undefined} onValueChange={(value) => setSelectedPhoneNumber(value)}>
						<SelectTrigger className="w-[180px] h-9">
							<SelectValue placeholder="Selecione o número" />
						</SelectTrigger>
						<SelectContent>
							{phoneNumbers.map((phone) => (
								<SelectItem key={phone.numero} value={phone.whatsappTelefoneId}>
									<div className="flex flex-col items-start">
										<span className="font-medium">{phone.nome}</span>
										<span className="text-xs text-muted-foreground">{phone.numero}</span>
									</div>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				)}

				{/* New Chat Button */}
				{onNewChat && (
					<Button
						onClick={onNewChat}
						variant="ghost"
						size="icon"
						className="h-9 w-9 rounded-full hover:bg-primary/10 transition-colors"
						title="Nova conversa"
					>
						<Plus className="w-5 h-5" />
					</Button>
				)}
			</div>
		</div>
	);
}
