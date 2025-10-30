import ChatsHubComposable from "@/components/identificador/chats/ChatsHub.Composable";
import ChatsHubImproved from "@/components/identificador/chats/ChatsHub.Improved";
import WhatsAppConnectButton from "@/components/meta/WhatsappConnectButton";
import { useSession } from "@/components/providers/SessionProvider";
import ErrorComponent from "@/components/utils/ErrorComponent";
import LoadingPage from "@/components/utils/LoadingPage";
import UnauthenticatedComponent from "@/components/utils/UnauthenticatedComponent";
import UnauthorizedPage from "@/components/utils/UnauthorizedPage";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/convex/utils";
import type { TAuthSession } from "@/lib/authentication/types";

export default function Chats() {
	const { session, status } = useSession();

	if (status === "loading") return <LoadingPage />;
	if (status === "unauthenticated") return <UnauthenticatedComponent />;

	const userHasViewPermission = session.user.permissoes.chats.visualizar;
	const userHasMessageSendingPermission = session.user.permissoes.chats.enviarMensagens;

	if (!userHasViewPermission) return <UnauthorizedPage />;
	return <ChatsContent session={session} userHasMessageSendingPermission={userHasMessageSendingPermission} />;
}

function ChatsContent({ session, userHasMessageSendingPermission }: { session: TAuthSession; userHasMessageSendingPermission: boolean }) {
	const { data: whatsappConnection, isPending, isError, isSuccess } = useConvexQuery(api.queries.connections.getWhatsappConnection);
	return (
		<div className="flex flex-col gap-6 grow p-6">
			{isPending ? <h3 className="text-sm text-primary/60 animate-pulse py-4 text-center">Carregando conexão...</h3> : null}
			{isError ? <ErrorComponent msg="Erro ao carregar conexão do WhatsApp Business." /> : null}
			{isSuccess ? (
				whatsappConnection ? (
					<ChatsHubComposable
						session={session}
						userHasMessageSendingPermission={userHasMessageSendingPermission}
						whatsappConnection={whatsappConnection}
					/>
				) : (
					<WhatsAppConnectButton />
				)
			) : null}
		</div>
	);
}
