"use client";

import { useMutation } from "convex/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "@/convex/_generated/api";
import type { TAuthSession } from "@/lib/authentication/types";
import ClientsVinculationMenu from "../crm-clientes/ClientsVinculationMenu";
import * as ChatHub from "./ChatHub";

type ChatsHubComposableProps = {
	session: TAuthSession;
	userHasMessageSendingPermission: boolean;
	whatsappConnection: typeof api.queries.connections.getWhatsappConnection._returnType;
};

/**
 * ChatsHub - Composable Version
 *
 * This component demonstrates the composable pattern for building complex UI.
 * Each sub-component can be customized and styled independently while sharing
 * state through context.
 *
 * Features:
 * - 🎨 Beautiful, modern UI with smooth animations
 * - 📱 Responsive design (mobile & desktop)
 * - 🔄 Smooth transitions between views
 * - ♿ Accessible (ARIA labels, keyboard navigation)
 * - 🎯 Type-safe with TypeScript
 * - 🧩 Composable architecture
 */
export default function ChatsHubComposable({
	session,
	userHasMessageSendingPermission,
	whatsappConnection,
}: ChatsHubComposableProps) {
	return (
		<ChatHub.Root
			session={session}
			userHasMessageSendingPermission={userHasMessageSendingPermission}
			whatsappConnection={whatsappConnection}
		>
			<ChatHubContent />
		</ChatHub.Root>
	);
}

/**
 * Inner component that has access to ChatHub context
 */
function ChatHubContent() {
	const { selectedPhoneNumber, setSelectedChatId } = ChatHub.useChatHub();
	const [newChatMenuIsOpen, setNewChatMenuIsOpen] = useState(false);
	const getChatByClientAppId = useMutation(api.mutations.chats.getChatByClientAppId);

	const handleNewChat = () => {
		setNewChatMenuIsOpen(true);
	};

	const handleSelectClient = async (client: any) => {
		if (!selectedPhoneNumber) {
			toast.error("Selecione um número de telefone.");
			return;
		}

		const clientId = client._id;
		if (!clientId) {
			toast.error("Oops, aparentemente esse cliente não possui um cadastro.");
			return;
		}

		try {
			const selectedChat = await getChatByClientAppId({
				cliente: {
					idApp: clientId,
					nome: client.nome,
					telefone: client.telefonePrimario || "",
					email: client.email || "",
					cpfCnpj: client.cpfCnpj || "",
					avatar_url: undefined,
				},
				whatsappPhoneNumberId: selectedPhoneNumber,
			});

			setSelectedChatId(selectedChat.chatId);
			setNewChatMenuIsOpen(false);
			toast.success("Chat aberto com sucesso!");
		} catch (error) {
			console.error("Error creating chat:", error);
			toast.error("Erro ao abrir chat");
		}
	};

	return (
		<>
			{/* Layout - Handles responsive desktop/mobile views */}
			<ChatHub.Layout
				listPanel={
					<>
						{/* List Header - Phone selector and new chat button */}
						<ChatHub.Header onNewChat={handleNewChat} />

						{/* Chat List - Displays all conversations */}
						<ChatHub.List />
					</>
				}
				contentPanel={
					<>
						{/* Content - Displays active chat or empty state */}
						<ChatHub.Content>
							{/* Messages - Scrollable message list */}
							<ChatHub.Messages />

							{/* Input - Message composition area */}
							<ChatHub.Input
								placeholder="Digite uma mensagem..."
								maxRows={4}
							/>
						</ChatHub.Content>
					</>
				}
			/>

			{/* New Chat Modal */}
			{newChatMenuIsOpen && (
				<ClientsVinculationMenu
					closeModal={() => setNewChatMenuIsOpen(false)}
					handleSelect={handleSelectClient}
				/>
			)}
		</>
	);
}
