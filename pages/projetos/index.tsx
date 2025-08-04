import React from "react";
import { useRouter } from "next/router";

import dayjs from "dayjs";
import { useSession } from "next-auth/react";

import LoadingPage from "../../components/utils/LoadingPage";

import StatesAndCities from "@/utils/jsons/estados-cidades.json";

import type { Session } from "next-auth";

import ErrorPage from "@/components/utils/ErrorPage";

import { useViewModesStore } from "@/utils/stores/view-modes-store";
import EngineeringKanbanModePage from "@/components/identificador/engenharia/KanbanModePage";
import EngineeringDatabaseModePage from "@/components/identificador/engenharia/DatabaseModePage";

const AllCities = StatesAndCities.flatMap((s) => s.cidades).map((c, index) => ({ id: index + 1, label: c, value: c }));
const AllStates = StatesAndCities.map((e) => e.sigla).map((c, index) => ({ id: index + 1, label: c, value: c }));
const CurrentDate = dayjs().toDate();

function Projetos() {
	const router = useRouter();
	const { data: session, status } = useSession({ required: true });

	if (status !== "authenticated") return <LoadingPage />;

	const isAuthorized = session?.user.permissoes.rotas.includes("Projetos") || session.user.permissoes.engenharia.visualizar;
	if (!isAuthorized) return <ErrorPage msg="Você não tem permissão para acessar esta página" />;
	return <ProjectsPageContent session={session} />;
}

export default Projetos;

type ProjectsPageContentProps = {
	session: Session;
};
function ProjectsPageContent({ session }: ProjectsPageContentProps) {
	const engineeringViewMode = useViewModesStore((state) => state.modes.engineering);

	if (engineeringViewMode === "kanban") {
		return <EngineeringKanbanModePage session={session} />;
	}
	return <EngineeringDatabaseModePage session={session} />;
}
