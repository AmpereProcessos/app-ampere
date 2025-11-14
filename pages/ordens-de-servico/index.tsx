import ServiceOrdersCardModePage from "@/components/identificador/ordensDeServico/CardModePage";
import ServiceOrdersKanbanModePage from "@/components/identificador/ordensDeServico/KanbanModePage";

import { useSession } from "@/components/providers/SessionProvider";
import LoadingPage from "@/components/utils/LoadingPage";
import UnauthenticatedComponent from "@/components/utils/UnauthenticatedComponent";
import React, { useState } from "react";

export type TServiceOrdersPageModes = "card" | "kanban";

function MainServiceOrdersPage() {
	const { session, status } = useSession();
	const [mode, setMode] = useState<TServiceOrdersPageModes>("card");

	if (status === "loading") return <LoadingPage />;
	if (status === "unauthenticated") return <UnauthenticatedComponent />;

	if (mode === "kanban") return <ServiceOrdersKanbanModePage session={session} handleSetMode={setMode} />;
	return <ServiceOrdersCardModePage session={session} handleSetMode={setMode} />;
}

export default MainServiceOrdersPage;
