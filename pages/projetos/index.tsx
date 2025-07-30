import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";

import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import { VscDiffAdded } from "react-icons/vsc";
import { FaMoon, FaSignature } from "react-icons/fa";
import { BsPatchCheck } from "react-icons/bs";
import { TbAlertHexagonFilled, TbCheckupList } from "react-icons/tb";

import ModalProjetos from "../../components/ModalProjetos";
import ProjetosSkeleton from "../../components/skeletons/ProjetosSkeleton";
import TagTipoDeServico from "../../components/TagTipoDeServico";
import LoadingPage from "../../components/utils/LoadingPage";

import TextInput from "../../components/inputs/Text";
import SelectInput from "../../components/inputs/Select";
import DateInput from "../../components/inputs/Date";
import MultipleSelectInput from "../../components/inputs/MultipleSelect";
import MultipleSelectInputVirtualized from "../../components/inputs/MultipleSelectInputVirtualized";
import { ServiceOrderStatus, HomologationControlStatus, inspectionStatus, serviceTypes } from "../../utils/select-options";
import { useEngineeringProjects } from "../../utils/methods/query/engineering";
import { formatDateInputChange } from "../../utils/methods/shared";
import { formatDate, formatDecimalPlaces, SlideMotionVariants } from "../../utils/constants";

import StatesAndCities from "@/utils/jsons/estados-cidades.json";
import ProjectCardsTags from "../../components/utils/ProjectCardsTags";
import { useTags } from "../../utils/methods/query/tags";
import type { Session } from "next-auth";
import ErrorComponent from "@/components/utils/ErrorComponent";
import { getErrorMessage } from "@/utils/methods/handlers";
import type { TProjectDTO } from "@/utils/schemas/projects";
import { cn } from "@/lib/utils";
import { formatDateAsLocale } from "@/utils/methods/formatting";
import { useUsers } from "@/utils/methods/query/crm/users";
import ErrorPage from "@/components/utils/ErrorPage";
import { useEngineeringSectorStats } from "@/utils/methods/query/stats";
import { ChartArea, CircleCheck, CircleDashed, CircleX, DraftingCompass, GitPullRequestArrow, ListTodo, Network } from "lucide-react";
import DateIntervalInput from "@/components/inputs/DateIntervalInput";
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
