import React from "react";

import { useSession } from "@/components/providers/SessionProvider";
import type { TAuthSession } from "@/lib/authentication/types";

import LoadingPage from "../../components/utils/LoadingPage";

import ErrorPage from "@/components/utils/ErrorPage";

import EngineeringDatabaseModePage from "@/components/identificador/engenharia/DatabaseModePage";
import EngineeringKanbanModePage from "@/components/identificador/engenharia/KanbanModePage";
import UnauthenticatedComponent from "@/components/utils/UnauthenticatedComponent";
import UnauthorizedComponent from "@/components/utils/UnauthorizedComponent";
import { useViewModesStore } from "@/utils/stores/view-modes-store";

function Projetos() {
	const { session, status } = useSession();

	if (status === "loading") return <LoadingPage />;
	if (status === "unauthenticated") return <UnauthenticatedComponent />;

	const isAuthorized = session?.user.permissoes.engenharia.visualizar;
	if (!isAuthorized) return <UnauthorizedComponent />;
	return <ProjectsPageContent session={session} />;
}

export default Projetos;

type ProjectsPageContentProps = {
	session: TAuthSession;
};
function ProjectsPageContent({ session }: ProjectsPageContentProps) {
	const engineeringViewMode = useViewModesStore((state) => state.modes.engineering);

	if (engineeringViewMode === "kanban") {
		return <EngineeringKanbanModePage session={session} />;
	}
	return <EngineeringDatabaseModePage session={session} />;
}
