import ChatsHub from "@/components/identificador/chats/ChatsHub";
import { useSession } from "@/components/providers/SessionProvider";
import LoadingPage from "@/components/utils/LoadingPage";
import UnauthenticatedComponent from "@/components/utils/UnauthenticatedComponent";
import UnauthorizedPage from "@/components/utils/UnauthorizedPage";
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
	return (
		<div className="flex flex-col gap-6 grow p-6">
			<div className="border-primary/20 flex items-center justify-between border-b p-1">
				<h1 className="text-start text-2xl font-black text-[#15599a] uppercase">Chats</h1>
			</div>
			<ChatsHub session={session} userHasMessageSendingPermission={userHasMessageSendingPermission} />
		</div>
	);
}
