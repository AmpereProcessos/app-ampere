import ChatsHub from "@/components/identificador/chats/ChatsHub";
import { useSession } from "@/components/providers/SessionProvider";
import { Button } from "@/components/ui/button";
import LoadingPage from "@/components/utils/LoadingPage";
import UnauthenticatedComponent from "@/components/utils/UnauthenticatedComponent";
import { api } from "@/convex/_generated/api";
import type { TAuthSession } from "@/lib/authentication/types";
import { useQuery } from "convex/react";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function Chats() {
	const { session, status } = useSession();

	if (status === "loading") return <LoadingPage />;
	if (status === "unauthenticated") return <UnauthenticatedComponent />;

	return <ChatsContent session={session} />;
}

function ChatsContent({ session }: { session: TAuthSession }) {
	const chats = useQuery(api.queries.chat.getChats);
	const [openNewChatModalIsOpen, setOpenNewChatModalIsOpen] = useState(false);
	const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
	return (
		<div className="flex flex-col gap-6 grow p-6">
			<div className="border-primary/20 flex items-center justify-between border-b p-1">
				<h1 className="text-start text-2xl font-black text-[#15599a] uppercase">Chats</h1>
			</div>
			<ChatsHub session={session} />
		</div>
	);
}
