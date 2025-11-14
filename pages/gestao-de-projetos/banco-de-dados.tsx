import React, { useState } from "react";

import { useSession } from "@/components/providers/SessionProvider";
import { useRouter } from "next/router";

import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";

import LoadingPage from "../../components/utils/LoadingPage";

import ModalDatabase from "@/components/ModalDatabase";
import FilterMenu from "@/components/identificador/banco-de-dados/FilterMenu";
import ProjectsDBPagination from "@/components/identificador/banco-de-dados/Pagination";
import ProjectDBCard from "@/components/identificador/banco-de-dados/ProjectDBCard";
import ProjectExportationMenu from "@/components/identificador/projects/ProjectExportationMenu";
import { Button } from "@/components/ui/button";
import ErrorComponent from "@/components/utils/ErrorComponent";
import UnauthenticatedComponent from "@/components/utils/UnauthenticatedComponent";
import type { TAuthSession } from "@/lib/authentication/types";
import { useProjectsByPersonalizedFilters } from "@/utils/methods/query/projects";
import { useQueryClient } from "@tanstack/react-query";
import { ProjectTypesCollors } from "../../utils/constants";
function MainDatebasePage() {
	const { session, status } = useSession();
	if (status === "loading") return <LoadingPage />;
	if (status === "unauthenticated") return <UnauthenticatedComponent />;
	return <MainDatebasePageContent session={session} />;
}

export default MainDatebasePage;

function MainDatebasePageContent({ session }: { session: TAuthSession }) {
	const queryClient = useQueryClient();
	const router = useRouter();
	const [filterMenuIsOpen, setFilterMenuIsOpen] = useState<boolean>(false);
	const [page, setPage] = useState<number>(1);
	const { data, isLoading, isError, isSuccess, filters, updateFilters } = useProjectsByPersonalizedFilters({ page });
	const handleOnMutate = async () => await queryClient.cancelQueries({ queryKey: ["projects-by-filters", page, filters] });
	const handleOnSettled = async () => await queryClient.invalidateQueries({ queryKey: ["projects-by-filters", page, filters] });
	const [modalProject, setModalProject] = useState<{ isOpen: boolean; projectId: string | null }>({ isOpen: false, projectId: null });
	const [exportationMenuIsOpen, setExportationMenuIsOpen] = useState<boolean>(false);
	const projects = data?.projects;
	const projectsMatched = data?.projectsMatched;
	const totalPages = data?.totalPages;
	const userHasOverallAccess =
		session.user.permissoes.comercial.visualizar &&
		session.user.permissoes.posVenda.visualizar &&
		session.user.permissoes.suprimentos.visualizar &&
		session.user.permissoes.engenharia.visualizar &&
		session.user.permissoes.execucao.visualizar &&
		session.user.permissoes.suporte.visualizar &&
		session.user.permissoes.administrativo.visualizar &&
		session.user.permissoes.financeiro.visualizar &&
		session.user.permissoes.recursosHumanos.visualizar;

	return (
		<div className="grow p-6">
			<div className="border-primary/20 flex w-full flex-col gap-2 border-b p-1">
				<div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
					<div className="flex items-center gap-1">
						{filterMenuIsOpen ? (
							<div className="text-primary/80 cursor-pointer hover:text-blue-400">
								<IoMdArrowDropupCircle style={{ fontSize: "25px" }} onClick={() => setFilterMenuIsOpen(false)} />
							</div>
						) : (
							<div className="text-primary/80 cursor-pointer hover:text-blue-400">
								<IoMdArrowDropdownCircle style={{ fontSize: "25px" }} onClick={() => setFilterMenuIsOpen(true)} />
							</div>
						)}
						<div className="flex flex-col gap-1">
							<h1 className="text-2xl font-black text-[#15599a] uppercase">BANCO DE CLIENTES</h1>
						</div>
					</div>
				</div>
				{filterMenuIsOpen ? <FilterMenu updateFilters={updateFilters} queryLoading={isLoading} resetSelectedPage={() => setPage(1)} /> : null}
				{userHasOverallAccess ? (
					<div className="flex w-full items-center justify-end">
						<Button variant={"ghost"} onClick={() => setExportationMenuIsOpen(true)} size={"xs"}>
							ABRIR MENU DE EXPORTAÇÃO
						</Button>
					</div>
				) : null}
			</div>
			<div className="my-2 flex w-full flex-col flex-wrap items-center justify-center gap-2">
				<h1 className="text-sm font-bold tracking-tight">LEGENDA DOS TIPOS DE SERVIÇOS</h1>
				<div className="flex w-full flex-wrap items-center justify-around gap-2">
					{Object.entries(ProjectTypesCollors).map(([key, value]) => (
						<div key={key} className="flex items-center gap-1">
							<div className={`h-5 min-h-5 w-5 min-w-5 rounded-full ${value}`} />
							<p className="text-primary/60 text-xs font-bold tracking-tight">{key}</p>
						</div>
					))}
				</div>
			</div>

			<ProjectsDBPagination
				activePage={page}
				selectPage={(page) => setPage(page)}
				queryLoading={isLoading}
				totalPages={totalPages || 0}
				projectsMatched={projectsMatched}
				projectsShowing={projects?.length}
			/>

			<div className="mt-4 flex flex-wrap justify-between gap-2 py-2">
				{isLoading ? <LoadingPage /> : null}
				{isError ? <ErrorComponent msg={"Erro ao buscar projetos."} /> : null}
				{isSuccess && projects
					? projects.map((project) => (
							<ProjectDBCard key={project._id} project={project} handleClick={(id) => setModalProject({ isOpen: true, projectId: id })} />
						))
					: null}
			</div>

			{modalProject.isOpen && modalProject.projectId && (
				<ModalDatabase
					session={session}
					projectId={modalProject.projectId}
					closeModal={() => setModalProject({ isOpen: false, projectId: null })}
					callbacks={{ onMutate: handleOnMutate, onSettled: handleOnSettled }}
				/>
			)}
			{exportationMenuIsOpen && <ProjectExportationMenu closeMenu={() => setExportationMenuIsOpen(false)} />}
		</div>
	);
}
