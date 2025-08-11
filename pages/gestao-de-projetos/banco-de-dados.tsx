import React, { useState } from "react";

import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";

import LoadingPage from "../../components/utils/LoadingPage";

import { ProjectTypesCollors } from "../../utils/constants";
import { useProjectsByPersonalizedFilters } from "@/utils/methods/query/projects";
import FilterMenu from "@/components/identificador/banco-de-dados/FilterMenu";
import ProjectsDBPagination from "@/components/identificador/banco-de-dados/Pagination";
import ErrorComponent from "@/components/utils/ErrorComponent";
import ProjectDBCard from "@/components/identificador/banco-de-dados/ProjectDBCard";
import { Button } from "@/components/ui/button";
import ProjectExportationMenu from "@/components/identificador/projects/ProjectExportationMenu";
import ModalDatabase from "@/components/ModalDatabase";
import { useQueryClient } from "@tanstack/react-query";
function MainDatebasePage() {
	const queryClient = useQueryClient();
	const router = useRouter();
	const { data: session, status } = useSession({ required: true });
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
	const userHasOverallAccess = ["Projetos", "Obras", "Suprimentos", "O&M", "Marketing", "Vendas", "Pós-Venda", "PPS", "InsideSales", "Financeiro", "ADM", "RH"].every((el) =>
		session?.user.permissoes.rotas.includes(el),
	);
	if (status !== "authenticated") return <LoadingPage />;

	return (
		<div className="grow p-6">
			<div className="flex w-full flex-col gap-2 border-b border-gray-300 p-1">
				<div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
					<div className="flex items-center gap-1">
						{filterMenuIsOpen ? (
							<div className="cursor-pointer text-gray-600 hover:text-blue-400">
								<IoMdArrowDropupCircle style={{ fontSize: "25px" }} onClick={() => setFilterMenuIsOpen(false)} />
							</div>
						) : (
							<div className="cursor-pointer text-gray-600 hover:text-blue-400">
								<IoMdArrowDropdownCircle style={{ fontSize: "25px" }} onClick={() => setFilterMenuIsOpen(true)} />
							</div>
						)}
						<div className="flex flex-col gap-1">
							<h1 className="text-2xl font-black uppercase text-[#15599a]">BANCO DE CLIENTES</h1>
						</div>
					</div>
				</div>
				{filterMenuIsOpen ? <FilterMenu updateFilters={updateFilters} queryLoading={isLoading} resetSelectedPage={() => setPage(1)} /> : null}
				{userHasOverallAccess ? (
					<div className="w-full flex items-center justify-end">
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
							<div className={`min-w-5 min-h-5 h-5 w-5 rounded-full ${value}`} />
							<p className="text-xs font-bold tracking-tight text-gray-500">{key}</p>
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
					? projects.map((project) => <ProjectDBCard key={project._id} project={project} handleClick={(id) => setModalProject({ isOpen: true, projectId: id })} />)
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

export default MainDatebasePage;
